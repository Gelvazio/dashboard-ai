import { describe, expect, it, vi } from 'vitest';
import type { FinalizarArgs, TaskReivindicada } from '../../worker/fila';
import { executarUmaTask, idDaExecucao } from '../../worker/executar';

const task: TaskReivindicada = { taskId: 42, taskCodigo: 'SUB-42', tentativa: 2, instrucao: 'Listar tasks' };

function fakes(opcoes: { task?: TaskReivindicada | null; valido?: boolean; falha?: Error } = {}) {
  const finalizacoes: FinalizarArgs[] = [];
  const invoke = vi.fn(async () => {
    if (opcoes.falha) throw opcoes.falha;
    return {};
  });
  const deps = {
    agente: 'Worker A',
    projeto: 'default',
    grafo: { invoke },
    reivindicar: vi.fn(async () => (opcoes.task === undefined ? task : opcoes.task)),
    reconciliar: vi.fn(async () => (opcoes.valido === false ? { valido: false, motivo: 'trava expirada' } : { valido: true })),
    finalizar: vi.fn(async (args: FinalizarArgs) => void finalizacoes.push(args)),
  };
  return { deps, invoke, finalizacoes };
}

describe('executarUmaTask', () => {
  it('sem task retorna null sem chamar o grafo', async () => {
    const { deps, invoke } = fakes({ task: null });
    expect(await executarUmaTask(deps)).toBeNull();
    expect(invoke).not.toHaveBeenCalled();
  });

  it('invoca o grafo com thread_id = execucaoId', async () => {
    const { deps, invoke, finalizacoes } = fakes();
    expect(await executarUmaTask(deps)).toEqual({ taskId: 42, execucaoId: 'task-42-t2', situacao: 'executada' });
    expect(deps.reconciliar).toHaveBeenCalledWith({ taskId: 42, agente: 'Worker A', tentativa: 2 });
    expect(invoke).toHaveBeenCalledWith(
      expect.objectContaining({ taskId: 42, execucaoId: 'task-42-t2', instrucao: 'Listar tasks', agente: 'Worker A' }),
      { configurable: { thread_id: 'task-42-t2' } },
    );
    expect(finalizacoes).toHaveLength(0);
  });

  it('reconciliação inválida aborta sem efeitos', async () => {
    const { deps, invoke, finalizacoes } = fakes({ valido: false });
    expect(await executarUmaTask(deps)).toMatchObject({ situacao: 'abortada', motivo: 'trava expirada' });
    expect(invoke).not.toHaveBeenCalled();
    expect(finalizacoes).toHaveLength(0);
  });

  it('exceção no grafo finaliza com erro', async () => {
    const { deps, finalizacoes } = fakes({ falha: new Error('timeout no modelo') });
    expect(await executarUmaTask(deps)).toMatchObject({ situacao: 'erro', motivo: 'timeout no modelo' });
    expect(finalizacoes).toEqual([
      { taskId: 42, status: 'erro', execucaoId: 'task-42-t2', agente: 'Worker A', erroMensagem: 'timeout no modelo', classeFalha: 'transitoria' },
    ]);
  });

  it('idDaExecucao segue o contrato', () => {
    expect(idDaExecucao({ taskId: 7, tentativa: 1 })).toBe('task-7-t1');
  });
});
