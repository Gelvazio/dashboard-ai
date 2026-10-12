import { describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ToolDefinition } from '../../api/_lib/tools';
import type { EventosDeps } from '../../worker/eventos';
import { criarGrafo } from '../../worker/grafo';
import type { ModeloPlano } from '../../worker/nos/planejar';

vi.mock('../../api/_lib/tools', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../api/_lib/tools')>()),
  listTools: vi.fn(async () => [definicao]),
}));

const definicao: ToolDefinition = {
  name: 'brain_search',
  description: 'Busca',
  inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
};

// Emissor espião: cliente `db` falso que guarda as linhas inseridas em `agent_events`.
function espiao(): { eventos: Record<string, unknown>[]; deps: EventosDeps } {
  const eventos: Record<string, unknown>[] = [];
  const cliente = {
    from: (tabela: string) => ({
      select: () => ({ eq: () => ({ eq: async () => ({ data: [{ id: 1 }], error: null, status: 200 }) }) }),
      insert: async (linha: Record<string, unknown>) => {
        if (tabela === 'agent_events') eventos.push(linha);
        return { data: null, error: null, status: 201 };
      },
    }),
  };
  return { eventos, deps: { db: () => cliente as unknown as SupabaseClient, avisar: () => {} } };
}

function montar(modelo: ModeloPlano) {
  const { eventos, deps } = espiao();
  const grafo = criarGrafo({
    modelo,
    contexto: { buscar: async () => ({ texto: '', erro: false }) },
    pedirAprovacao: () => ({ aprovado: true }),
    executar: { obterDefinicao: async () => definicao, chamar: async (_n, args) => `ok ${args.query}` },
    esperar: async () => {},
    finalizar: { finalizar: async () => {} },
    eventos: deps,
  });
  return { grafo, eventos };
}

const passo = (query: string) => ({ ferramenta: 'brain_search', argumentos: { query }, sensivel: false, criterio: 'ok' });
const entrada = { taskId: 5, taskCodigo: 'SUB-05', projeto: 'default', agente: 'Worker', tentativa: 1, execucaoId: 'exec-5', instrucao: 'x' };
const sequencia = (eventos: Record<string, unknown>[]) => eventos.map((e) => `${e.etapa}:${e.tipo}`);

describe('eventos do grafo (SUB-35.39)', () => {
  it('emite inicio/fim por nó na ordem de execução', async () => {
    const modelo = { withStructuredOutput: () => ({ invoke: async () => ({ passos: [passo('a'), passo('b')] }) }) };
    const { grafo, eventos } = montar(modelo as unknown as ModeloPlano);
    await grafo.invoke(entrada);

    const nos = ['carregarContexto', 'planejar', 'politica', 'executar', 'revisar', 'executar', 'revisar', 'executar', 'revisar', 'finalizar'];
    expect(sequencia(eventos)).toEqual(nos.flatMap((no) => [`${no}:inicio`, `${no}:fim`]));
    for (const e of eventos) {
      expect(e).toMatchObject({ project_id: 1, agente: 'Worker', task_id: 5, task_codigo: 'SUB-05', execucao_id: 'exec-5' });
    }
    expect(eventos.filter((e) => e.tipo === 'fim').every((e) => typeof (e.metadados as { duracao_ms: unknown }).duracao_ms === 'number')).toBe(true);
  });

  it('emite erro no nó que falha e interrompe o grafo', async () => {
    const modelo = {
      withStructuredOutput: () => ({
        invoke: async () => {
          throw new Error('modelo indisponível');
        },
      }),
    };
    const { grafo, eventos } = montar(modelo as unknown as ModeloPlano);
    await expect(grafo.invoke(entrada)).rejects.toThrow('modelo indisponível');

    expect(sequencia(eventos)).toEqual(['carregarContexto:inicio', 'carregarContexto:fim', 'planejar:inicio', 'planejar:erro']);
    expect(eventos[3].mensagem).toBe('Error: modelo indisponível');
  });
});
