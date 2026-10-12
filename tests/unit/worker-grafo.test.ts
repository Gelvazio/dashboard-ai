import { describe, expect, it, vi } from 'vitest';
import type { ToolDefinition } from '../../api/_lib/tools';
import type { FinalizarArgs } from '../../worker/fila';
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
