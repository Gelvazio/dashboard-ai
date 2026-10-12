import { describe, expect, it, vi } from 'vitest';
import type { ResultadoExecucao } from '../../worker/executar';
import { grafoSobDemanda, lerOpcoes, rodarWorker } from '../../worker/index';

const grafo = { invoke: async () => ({}) };
const execucao = (taskId: number): ResultadoExecucao => ({ taskId, execucaoId: `task-${taskId}-t1`, situacao: 'executada' });

describe('lerOpcoes', () => {
  it('usa padrões e lê --projeto, --agente e --uma-vez', () => {
    expect(lerOpcoes([])).toEqual({ projeto: 'default', agente: 'Worker LangGraph', umaVez: false });
    expect(lerOpcoes(['--projeto', 'loja', '--agente', 'W1', '--uma-vez'])).toEqual({ projeto: 'loja', agente: 'W1', umaVez: true });
  });

  it('recusa opção desconhecida', () => {
    expect(() => lerOpcoes(['--apagar'])).toThrow();
  });
});

describe('rodarWorker', () => {
  it('repete até não haver task', async () => {
    const fila = [execucao(1), execucao(2), null];
    const executar = vi.fn(async () => fila.shift() ?? null);
    const feitas = await rodarWorker({ projeto: 'p', agente: 'A', umaVez: false }, executar, grafo, () => {});
    expect(feitas.map((e) => e.taskId)).toEqual([1, 2]);
    expect(executar).toHaveBeenCalledTimes(3);
    expect(executar).toHaveBeenCalledWith({ agente: 'A', projeto: 'p', grafo });
  });

  it('--uma-vez executa no máximo uma task', async () => {
    const executar = vi.fn(async () => execucao(1));
    expect(await rodarWorker({ projeto: 'p', agente: 'A', umaVez: true }, executar, grafo, () => {})).toHaveLength(1);
    expect(executar).toHaveBeenCalledTimes(1);
  });
});

describe('grafoSobDemanda', () => {
  it('só cria o grafo na primeira invocação e reaproveita', async () => {
    const criar = vi.fn(async () => grafo);
    const preguicoso = grafoSobDemanda(criar);
    expect(criar).not.toHaveBeenCalled();
    await preguicoso.invoke({}, { configurable: { thread_id: 't' } });
    await preguicoso.invoke({}, { configurable: { thread_id: 't' } });
    expect(criar).toHaveBeenCalledTimes(1);
  });
});
