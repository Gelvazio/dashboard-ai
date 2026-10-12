import { finalizar, reivindicar, type FinalizarArgs, type TaskReivindicada } from './fila.js';
import { classificarFalha } from './falhas.js';
import { reconciliar, type EsperadoReconciliacao, type Reconciliacao } from './reconciliar.js';

/** Grafo compilado (ou falso nos testes): só o que a execução usa. */
export interface GrafoExecucao {
  invoke: (entrada: Record<string, unknown>, config: { configurable: { thread_id: string } }) => Promise<unknown>;
}

export interface DepsExecucao {
  agente: string;
  projeto: string;
  grafo: GrafoExecucao;
  reivindicar?: (agente: string, projeto: string) => Promise<TaskReivindicada | null>;
  reconciliar?: (esperado: EsperadoReconciliacao) => Promise<Reconciliacao>;
  finalizar?: (args: FinalizarArgs) => Promise<void>;
}

export interface ResultadoExecucao {
  taskId: number;
  execucaoId: string;
  situacao: 'executada' | 'abortada' | 'erro';
  motivo?: string;
}

/** Identificador da execução (contrato 1.1): `task-<taskId>-t<tentativa>`. */
export function idDaExecucao(task: Pick<TaskReivindicada, 'taskId' | 'tentativa'>): string {
  return `task-${task.taskId}-t${task.tentativa}`;
}

/**
 * Uma execução do worker (SUB-28.22): `reivindicar` -> `reconciliar` -> `grafo.invoke`
 * com `thread_id = execucaoId` (o checkpointer está no grafo compilado). Reconciliação
 * inválida aborta sem efeitos; exceção no grafo finaliza a task com `erro`.
 * Sem task disponível retorna `null`.
 */
export async function executarUmaTask(deps: DepsExecucao): Promise<ResultadoExecucao | null> {
  const pegar = deps.reivindicar ?? ((agente: string, projeto: string) => reivindicar(agente, projeto));
  const conferir = deps.reconciliar ?? ((esperado: EsperadoReconciliacao) => reconciliar(esperado));
  const encerrar = deps.finalizar ?? finalizar;

  const task = await pegar(deps.agente, deps.projeto);
  if (!task) return null;

  const execucaoId = idDaExecucao(task);
  const reconciliacao = await conferir({ taskId: task.taskId, agente: deps.agente, tentativa: task.tentativa });
  if (!reconciliacao.valido) {
    return { taskId: task.taskId, execucaoId, situacao: 'abortada', motivo: reconciliacao.motivo };
  }

  try {
    await deps.grafo.invoke(
      {
        taskId: task.taskId,
        taskCodigo: task.taskCodigo,
        projeto: deps.projeto,
        agente: deps.agente,
        tentativa: task.tentativa,
        execucaoId,
        instrucao: task.instrucao,
      },
      { configurable: { thread_id: execucaoId } },
    );
    return { taskId: task.taskId, execucaoId, situacao: 'executada' };
  } catch (erro) {
    const mensagem = (erro instanceof Error ? erro.message : String(erro)).slice(0, 2000);
    // A task não pode ficar presa em `em_execucao`: a falha é registrada mesmo com o grafo quebrado.
    await encerrar({
      taskId: task.taskId,
      status: 'erro',
      execucaoId,
      erroMensagem: mensagem,
      classeFalha: classificarFalha(erro),
    });
    return { taskId: task.taskId, execucaoId, situacao: 'erro', motivo: mensagem };
  }
}
