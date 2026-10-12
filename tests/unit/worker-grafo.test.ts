import { describe, expect, it, vi } from 'vitest';
import type { ToolDefinition } from '../../api/_lib/tools';
import type { FinalizarArgs } from '../../worker/fila';
import { criarGrafo } from '../../worker/grafo';
import type { ModeloPlano } from '../../worker/nos/planejar';

// RPC falsa: `finalizar` real (worker/fila) grava aqui a chamada de `finalizar_task`.
const rpcs: { nome: string; args: Record<string, unknown> }[] = [];
vi.mock('../../api/_lib/supabase', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../api/_lib/supabase')>()),
  rpc: vi.fn(async (nome: string, args: Record<string, unknown>) => {
    rpcs.push({ nome, args });
    return null;
  }),
}));

vi.mock('../../api/_lib/tools', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../api/_lib/tools')>()),
  listTools: vi.fn(async () => [definicao]),
}));

const definicao: ToolDefinition = {
  name: 'brain_search',
  description: 'Busca',
  inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
};

function passo(query: string, sensivel = false) {
  return { ferramenta: 'brain_search', argumentos: { query }, sensivel, criterio: 'ok' };
}

function montar(passos: ReturnType<typeof passo>[], aprovacao: unknown = { aprovado: true }) {
  const modelo = { withStructuredOutput: () => ({ invoke: async () => ({ passos }) }) } as unknown as ModeloPlano;
  const chamar = vi.fn(async (_nome: string, args: Record<string, unknown>, _chave: string) => `ok ${args.query}`);
  const finalizacoes: FinalizarArgs[] = [];
  const grafo = criarGrafo({
    modelo,
    contexto: { buscar: async () => ({ texto: '[Deploy]: Vercel', erro: false }) },
    pedirAprovacao: () => aprovacao,
    executar: { obterDefinicao: async () => definicao, chamar },
    esperar: async () => {},
    finalizar: { finalizar: async (args) => void finalizacoes.push(args) },
  });
  return { grafo, chamar, finalizacoes };
}

const entrada = { taskId: 5, taskCodigo: 'SUB-05', projeto: 'default', agente: 'Worker', tentativa: 1, execucaoId: 'exec-5', instrucao: 'Buscar deploy' };

describe('criarGrafo', () => {
  it('caminho feliz: contexto, plano, execução de todos os passos e finalização', async () => {
    const { grafo, chamar, finalizacoes } = montar([passo('a'), passo('b')]);
    const final = await grafo.invoke(entrada);
    expect(chamar.mock.calls.map((c) => c[2])).toEqual(['exec-5:passo-0', 'exec-5:passo-1']);
    expect(final.resultados).toMatchObject({ 'passo-0': 'ok a', 'passo-1': 'ok b' });
    expect(finalizacoes).toHaveLength(1);
    expect(finalizacoes[0]).toMatchObject({ taskId: 5, status: 'concluida', execucaoId: 'exec-5' });
  });

  it('aprovação negada finaliza como recusada sem executar', async () => {
    const { grafo, chamar, finalizacoes } = montar([passo('a', true)], { aprovado: false });
    await grafo.invoke(entrada);
    expect(chamar).not.toHaveBeenCalled();
    expect(finalizacoes[0]).toMatchObject({ status: 'recusada' });
  });
});

// SUB-28.17: grafo completo com modelo, ferramentas e RPC falsos, finalizando pela RPC `finalizar_task`.
describe('criarGrafo até finalizar_task (RPC falsa)', () => {
  const semEventos = {
    db: () => {
      throw new Error('sem banco nos testes');
    },
    avisar: () => {},
  };

  function montarComRpc(passos: ReturnType<typeof passo>[], chamar: (nome: string, args: Record<string, unknown>, chave: string) => Promise<string>) {
    rpcs.length = 0;
    const espiao = vi.fn(chamar);
    const grafo = criarGrafo({
      modelo: { withStructuredOutput: () => ({ invoke: async () => ({ passos }) }) } as unknown as ModeloPlano,
      contexto: { buscar: async () => ({ texto: '', erro: false }) },
      pedirAprovacao: () => ({ aprovado: true }),
      executar: { obterDefinicao: async () => definicao, chamar: espiao },
      esperar: async () => {},
      eventos: semEventos,
    });
    return { grafo, chamar: espiao };
  }

  it('caminho feliz: executa todos os passos e chama finalizar_task com concluida', async () => {
    const { grafo, chamar } = montarComRpc([passo('a'), passo('b')], async (_n, args) => `ok ${args.query}`);
    await grafo.invoke({ ...entrada, agente: 'Worker 1' });

    expect(chamar).toHaveBeenCalledTimes(2);
    expect(rpcs).toHaveLength(1);
    expect(rpcs[0].nome).toBe('finalizar_task');
    expect(rpcs[0].args).toMatchObject({
      p_task_id: 5,
      p_status: 'concluida',
      p_resultado: expect.stringContaining('passo-0, passo-1'),
      p_metadados: {
        execucao_id: 'exec-5',
        chaves: expect.arrayContaining(['passo-0', 'passo-1']),
        erro_mensagem: null,
        passo_falho: null,
      },
    });
  });

  it('erro permanente: não repete o passo e chama finalizar_task com erro', async () => {
    const { grafo, chamar } = montarComRpc([passo('a'), passo('b'), passo('c')], async (_n, args) => {
      if (args.query === 'b') throw new Error('registro corrompido');
      return `ok ${args.query}`;
    });
    const final = await grafo.invoke(entrada);

    expect(chamar.mock.calls.map((c) => c[2])).toEqual(['exec-5:passo-0', 'exec-5:passo-1']);
    expect(final.resultados).toMatchObject({ classe_falha: 'permanente' });
    expect(rpcs).toHaveLength(1);
    expect(rpcs[0].nome).toBe('finalizar_task');
    expect(rpcs[0].args).toMatchObject({
      p_task_id: 5,
      p_status: 'erro',
      p_metadados: { execucao_id: 'exec-5', passo_falho: 'brain_search' },
    });
    expect((rpcs[0].args.p_metadados as { erro_mensagem: string }).erro_mensagem).toContain('registro corrompido');
  });
});
