import { EstadoExecucao } from '../estado.js';
import { finalizar } from '../fila.js';

/**
 * Nó que finaliza a execução (SUB-28.11).
 * Chama a RPC finalizar_task e libera a trava.
 */
export async function finalizarNode(state: typeof EstadoExecucao.State) {
  const { taskId, execucaoId, resultados } = state;

  // Determinar status baseado nos resultados
  const todosPassosFeitos = Object.keys(resultados).length > 0;
  const status = todosPassosFeitos ? 'concluida' : 'erro';

  await finalizar({
    taskId,
    status,
    execucaoId,
  });

  return { final: true };
}
