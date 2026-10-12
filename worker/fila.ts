import { rpc } from '../api/_lib/supabase.js';

export interface TaskReivindicada {
  taskId: number;
  taskCodigo: string;
  tentativa: number;
  instrucao: string;
}

/**
 * Reivindica a próxima task disponível para o agente (SUB-28.4).
 * Chama a RPC `pegar_proxima_task` com `p_agente`, `p_projeto`,
 * `p_lock_minutos` (padrão 90) e `p_exclusivo` (padrão false).
 * Retorna null se não houver task disponível.
 */
export async function reivindicar(
  agente: string,
  projeto: string,
  lockMinutos = 90,
  exclusivo = false,
): Promise<TaskReivindicada | null> {
  const data = await rpc<any>('pegar_proxima_task', {
    p_agente: agente,
    p_projeto: projeto,
    p_lock_minutos: lockMinutos,
    p_exclusivo: exclusivo,
  });

  if (!data || data.length === 0) {
    return null;
  }

  const task = data[0];
  return {
    taskId: task.id,
    taskCodigo: task.codigo,
    tentativa: task.tentativas,
    instrucao: task.instrucao ?? '',
  };
}
