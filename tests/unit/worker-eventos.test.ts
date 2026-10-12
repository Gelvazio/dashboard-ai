import { describe, expect, it } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { MENSAGEM_MAX, comEventos, emitirEvento, mensagemSegura, type EventoWorker } from '../../worker/eventos.js';

interface Chamada {
  tabela: string;
  op: 'select' | 'insert' | 'upsert';
  filtros?: [string, unknown][];
  linha?: Record<string, unknown>;
  opcoes?: unknown;
}

// Cliente falso: registra as chamadas a `from()` e devolve `projetos` na busca do slug.
function dbFalso(opcoes: { projetos?: { id: number }[]; erroInsert?: string } = {}) {
  const chamadas: Chamada[] = [];
  const projetos = opcoes.projetos ?? [{ id: 42 }];
  const resultado = (data: unknown, erro?: string) => ({
    data: erro ? null : data,
    error: erro ? { message: erro } : null,
    status: erro ? 500 : 200,
  });
  const cliente = {
    from(tabela: string) {
      return {
        select() {
          const filtros: [string, unknown][] = [];
          const consulta = {
            eq(coluna: string, valor: unknown) {
              filtros.push([coluna, valor]);
              if (filtros.length < 2) return consulta;
              chamadas.push({ tabela, op: 'select', filtros });
              return Promise.resolve(resultado(projetos));
            },
          };
          return consulta;
        },
        insert(linha: Record<string, unknown>) {
          chamadas.push({ tabela, op: 'insert', linha });
          return Promise.resolve(resultado(null, opcoes.erroInsert));
        },
        upsert(linha: Record<string, unknown>, opts: unknown) {
          chamadas.push({ tabela, op: 'upsert', linha, opcoes: opts });
          return Promise.resolve(resultado(null, opcoes.erroInsert));
        },
      };
    },
  };
  return { chamadas, db: () => cliente as unknown as SupabaseClient };
}

const base: EventoWorker = {
  projeto: 'meu-app',
  agente: 'Worker 1',
  tipo: 'inicio',
  execucaoId: 'task-7-t1',
  etapa: 'planejar',
};

describe('emitirEvento', () => {
  it('busca o projeto pelo slug e insere o payload em agent_events', async () => {
    const { chamadas, db } = dbFalso();
    const avisos: string[] = [];
    const ok = await emitirEvento(
      { ...base, taskId: 7, taskCodigo: 'SUB-1', status: 'ok', mensagem: 'começou', metadados: { n: 1 } },
      { db, avisar: (m) => avisos.push(m) },
    );

    expect(ok).toBe(true);
    expect(avisos).toEqual([]);
    expect(chamadas[0]).toEqual({
      tabela: 'projects',
      op: 'select',
      filtros: [
        ['slug', 'meu-app'],
        ['excluido', false],
      ],
    });
    expect(chamadas[1]).toEqual({
      tabela: 'agent_events',
      op: 'insert',
      linha: {
        project_id: 42,
        agente: 'Worker 1',
        tipo: 'inicio',
        execucao_id: 'task-7-t1',
        etapa: 'planejar',
        task_id: 7,
        task_codigo: 'SUB-1',
        status: 'ok',
        mensagem: 'começou',
        metadados: { n: 1 },
      },
    });
  });

  it('corta a mensagem em 2000 caracteres', async () => {
    const { chamadas, db } = dbFalso();
    await emitirEvento({ ...base, mensagem: 'x'.repeat(MENSAGEM_MAX + 500) }, { db });
    expect(MENSAGEM_MAX).toBe(2000);
    expect((chamadas[1].linha!.mensagem as string).length).toBe(2000);
  });

  it('só aceita metadados objeto', async () => {
    for (const metadados of [['a'], 'texto', 3, null]) {
      const { chamadas, db } = dbFalso();
      await emitirEvento({ ...base, metadados }, { db });
      expect(chamadas[1].linha!.metadados).toEqual({});
    }
  });

  it('com chave_idempotencia usa upsert ignorando duplicatas', async () => {
    const { chamadas, db } = dbFalso();
    await emitirEvento({ ...base, chaveIdempotencia: 'k1' }, { db });
    expect(chamadas[1]).toMatchObject({
      op: 'upsert',
      linha: { chave_idempotencia: 'k1', project_id: 42 },
      opcoes: { onConflict: 'project_id,chave_idempotencia', ignoreDuplicates: true },
    });
  });

  it('falha do banco não lança: devolve false e avisa sem o payload', async () => {
    const { db } = dbFalso({ erroInsert: 'permission denied' });
    const avisos: string[] = [];
    const ok = await emitirEvento({ ...base, mensagem: 'segredo-do-payload' }, { db, avisar: (m) => avisos.push(m) });
    expect(ok).toBe(false);
    expect(avisos).toHaveLength(1);
    expect(avisos[0]).toContain('permission denied');
    expect(avisos[0]).not.toContain('segredo-do-payload');
  });

  it('não lança quando o cliente quebra ou o projeto não existe', async () => {
    const avisos: string[] = [];
    const avisar = (m: string) => avisos.push(m);
    await expect(
      emitirEvento(base, {
        db: () => {
          throw new Error('sem rede');
        },
        avisar,
      }),
    ).resolves.toBe(false);
    const { chamadas, db } = dbFalso({ projetos: [] });
    await expect(emitirEvento(base, { db, avisar })).resolves.toBe(false);
    expect(chamadas.some((c) => c.tabela === 'agent_events')).toBe(false);
    expect(avisos).toHaveLength(2);
  });
});

const estado = { projeto: 'meu-app', agente: 'Worker 1', taskId: 7, taskCodigo: 'SUB-1', execucaoId: 'task-7-t1', extra: 1 };

describe('comEventos', () => {
  const relogio = () => {
    let t = 1000;
    return () => (t += 250);
  };

  it('emite inicio e fim (com duração) e devolve o resultado do nó', async () => {
    const { chamadas, db } = dbFalso();
    const ordem: string[] = [];
    const no = comEventos(
      'planejar',
      async (s: typeof estado) => {
        ordem.push(`no:${chamadas.filter((c) => c.tabela === 'agent_events').length}`);
        return { plano: s.extra };
      },
      { db },
      relogio(),
    );

    await expect(no(estado)).resolves.toEqual({ plano: 1 });
    const eventos = chamadas.filter((c) => c.tabela === 'agent_events').map((c) => c.linha!);
    expect(ordem).toEqual(['no:1']);
    expect(eventos.map((e) => e.tipo)).toEqual(['inicio', 'fim']);
    for (const e of eventos) {
      expect(e).toMatchObject({ project_id: 42, agente: 'Worker 1', task_id: 7, task_codigo: 'SUB-1', execucao_id: 'task-7-t1', etapa: 'planejar' });
    }
    expect(eventos[1].metadados).toEqual({ duracao_ms: 250 });
  });

  it('em falha emite erro com mensagem segura e relança o erro original', async () => {
    const { chamadas, db } = dbFalso();
    const original = new Error('falhou com Bearer abc.def-123 e token=xyz987');
    const no = comEventos('executar', () => {
      throw original;
    }, { db });

    await expect(no(estado)).rejects.toBe(original);
    const eventos = chamadas.filter((c) => c.tabela === 'agent_events').map((c) => c.linha!);
    expect(eventos.map((e) => e.tipo)).toEqual(['inicio', 'erro']);
    expect(eventos[1].etapa).toBe('executar');
    expect(eventos[1].mensagem).toContain('Error: falhou com');
    expect(eventos[1].mensagem).not.toContain('abc.def-123');
    expect(eventos[1].mensagem).not.toContain('xyz987');
  });

  it('falha ao emitir não interrompe o nó', async () => {
    const { db } = dbFalso({ erroInsert: 'offline' });
    const no = comEventos('revisar', () => ({ final: true }), { db, avisar: () => {} });
    await expect(no(estado)).resolves.toEqual({ final: true });
  });
});

describe('mensagemSegura', () => {
  it('mascara JWT, chaves de API e credenciais em URL', () => {
    const msg = mensagemSegura(
      new Error('eyJhbGciOi.eyJzdWIi.c2lnbmF0dXJl sk-proj-abcdefgh1234 postgres://u:senha123@host/db apikey=zzz'),
    );
    expect(msg).not.toMatch(/eyJhbGciOi|sk-proj-abcdefgh1234|senha123|zzz/);
    expect(msg).toBe('Error: *** *** postgres://***@host/db apikey=***');
    expect(mensagemSegura(new Error('Bearer abc.def'))).toBe('Error: Bearer ***');
  });

  it('limita a 500 caracteres e aceita valores que não são Error', () => {
    expect(mensagemSegura('x'.repeat(900))).toHaveLength(500);
    expect(mensagemSegura(42)).toBe('42');
  });
});
