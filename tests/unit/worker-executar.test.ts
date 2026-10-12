import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EstadoExecucao } from '../../worker/estado';
import { executar, type DepsExecutar } from '../../worker/nos/executar';
import { listTools, type ToolDefinition } from '../../api/_lib/tools';

vi.mock('../../api/_lib/tools', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../api/_lib/tools')>()),
  listTools: vi.fn(),
}));

type Estado = typeof EstadoExecucao.State;

const definicao: ToolDefinition = {
  name: 'brain_search',
  description: 'Busca',
  inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
};
const passos = [0, 1].map((i) => ({ ferramenta: 'brain_search', argumentos: { query: `q${i}` }, sensivel: false, criterio: 'ok' }));

function estado(resultados: Record<string, unknown>): Estado {
  return {
    taskId: 1, taskCodigo: 'SUB-01', projeto: 'default', agente: 'Worker', tentativa: 1, execucaoId: 'exec-1',
    instrucao: 'x', plano: JSON.stringify({ passos }), passoAtual: '', resultados, aprovacao: null, final: false,
  } as Estado;
}

function depsFalsas() {
  const chamar = vi.fn(async (_nome: string, args: Record<string, unknown>) => `ok ${args.query}`);
  const deps: DepsExecutar = { obterDefinicao: async () => definicao, chamar };
  return { deps, chamar };
}

describe('executar', () => {
  beforeEach(() => vi.mocked(listTools).mockResolvedValue([definicao]));

  it('executa o primeiro passo com a chave de idempotência', async () => {
    const { deps, chamar } = depsFalsas();
    const saida = await executar(estado({}), deps);
    expect(chamar).toHaveBeenCalledWith('brain_search', { query: 'q0' }, 'exec-1:passo-0');
    expect(saida).toEqual({ passoAtual: 'brain_search', resultados: { 'passo-0': 'ok q0', erro: null } });
  });

  it('retomada não duplica a chamada de passo já registrado', async () => {
    const { deps, chamar } = depsFalsas();
    await executar(estado({ 'passo-0': 'ok q0' }), deps);
    expect(chamar).toHaveBeenCalledTimes(1);
    expect(chamar).toHaveBeenCalledWith('brain_search', { query: 'q1' }, 'exec-1:passo-1');

    const fim = await executar(estado({ 'passo-0': 'ok q0', 'passo-1': 'ok q1' }), deps);
    expect(fim).toEqual({ passoAtual: '', final: true });
    expect(chamar).toHaveBeenCalledTimes(1);
  });

  it('falha do handler vai para resultados.erro sem gravar o passo', async () => {
    const deps: DepsExecutar = { obterDefinicao: async () => definicao, chamar: vi.fn(async () => { throw new Error('timeout'); }) };
    expect(await executar(estado({}), deps)).toEqual({ passoAtual: 'brain_search', resultados: { erro: 'timeout' } });
  });
});
