import { beforeEach, describe, expect, it, vi } from 'vitest';

// Cliente falso: registra as chamadas de RPC e devolve a resposta configurada no teste.
const chamadas: { nome: string; args: Record<string, unknown> }[] = [];
let resposta: unknown = [];

vi.mock('../../api/_lib/supabase.js', async (importOriginal) => {
  const real = await importOriginal<typeof import('../../api/_lib/supabase.js')>();
  return {
    ...real,
    rpc: async (nome: string, args: Record<string, unknown>) => {
      chamadas.push({ nome, args });
      return resposta;
    },
  };
});

const { reivindicar, finalizar } = await import('../../worker/fila.js');

describe('reivindicar', () => {
  beforeEach(() => {
    chamadas.length = 0;
    resposta = [];
  });

  it('chama pegar_proxima_task com agente, projeto e padrões de trava', async () => {
    await reivindicar('Worker 1', 'default');
    expect(chamadas).toEqual([
      {
        nome: 'pegar_proxima_task',
        args: { p_agente: 'Worker 1', p_projeto: 'default', p_lock_minutos: 90, p_exclusivo: false },
      },
    ]);
  });

  it('repassa lockMinutos e exclusivo', async () => {
    await reivindicar('Worker 1', 'meu-app', 30, true);
    expect(chamadas[0].args).toMatchObject({ p_lock_minutos: 30, p_exclusivo: true });
  });

  it('devolve null quando não há task disponível', async () => {
    expect(await reivindicar('Worker 1', 'default')).toBeNull();
    resposta = null;
    expect(await reivindicar('Worker 1', 'default')).toBeNull();
  });

  it('mapeia a primeira task devolvida', async () => {
    resposta = [{ id: 42, codigo: 'SUB-01', tentativas: 2, instrucao: 'Fazer algo' }];
    expect(await reivindicar('Worker 1', 'default')).toEqual({
      taskId: 42,
      taskCodigo: 'SUB-01',
      tentativa: 2,
      instrucao: 'Fazer algo',
    });
  });

  it('usa instrução vazia quando a task não tem instrução', async () => {
    resposta = [{ id: 1, codigo: 'SUB-02', tentativas: 1, instrucao: null }];
    expect((await reivindicar('Worker 1', 'default'))?.instrucao).toBe('');
  });
});

describe('finalizar', () => {
  beforeEach(() => {
    chamadas.length = 0;
    resposta = null;
  });

  it('chama finalizar_task com resultado e metadados da execução', async () => {
    await finalizar({
      taskId: 42,
      status: 'concluida',
      resultado: 'ok',
      execucaoId: 'exec-1',
      chaves: ['exec-1:0'],
    });
    expect(chamadas).toEqual([
      {
        nome: 'finalizar_task',
        args: {
          p_task_id: 42,
          p_status: 'concluida',
          p_resultado: 'ok',
          p_erro_mensagem: null,
          p_metadados: { execucao_id: 'exec-1', chaves: ['exec-1:0'], classe_falha: null, passo_falho: null },
        },
      },
    ]);
  });

  it('envia erro, classe de falha e passo falho', async () => {
    await finalizar({
      taskId: 7,
      status: 'erro',
      erroMensagem: 'timeout',
      classeFalha: 'transitoria',
      passoFalho: 'executar',
      execucaoId: 'exec-2',
    });
    expect(chamadas[0].args).toEqual({
      p_task_id: 7,
      p_status: 'erro',
      p_resultado: null,
      p_erro_mensagem: 'timeout',
      p_metadados: { execucao_id: 'exec-2', chaves: [], classe_falha: 'transitoria', passo_falho: 'executar' },
    });
  });
});
