import { rpc } from '../api/_lib/supabase.js';
import { ehNivel, type NivelTarefa } from './niveis.js';

export interface TaskReivindicada {
  taskId: number;
  taskCodigo: string;
  tentativa: number;
  instrucao: string;
  /** Título da task (só quando veio do banco). */
  titulo?: string;
  /** `nivel_tarefa` (SUB-47.17), só quando a task já foi classificada. */
  nivel?: NivelTarefa;
}

/** Campos de `public.tasks` (setof devolvido por `pegar_proxima_task`) usados por `reivindicar`. */
interface LinhaTaskReivindicada {
  id: number;
  codigo: string;
  tentativas: number;
  instrucao: string;
  titulo?: string | null;
  nivel_tarefa?: string | null;
}

export interface FinalizarArgs {
  taskId: number;
  status: 'concluida' | 'erro' | 'recusada';
  resultado?: string;
  erroMensagem?: string;
  classeFalha?: string;
  passoFalho?: string;
  execucaoId: string;
  chaves?: string[];
  /** Agente que detém a trava; a RPC recusa se a trava for de outro. */
  agente?: string;
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
  const data = await rpc<LinhaTaskReivindicada[] | null>('pegar_proxima_task', {
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
    // Só aparecem quando existem: a task antiga (sem coluna ou sem nível) fica igual a antes.
    ...(task.titulo ? { titulo: task.titulo } : {}),
    ...(ehNivel(task.nivel_tarefa) ? { nivel: task.nivel_tarefa } : {}),
  };
}

/**
 * Finaliza uma task chamando a RPC `finalizar_task` (SUB-28.30).
 * Libera a trava e registra o resultado.
 */
export async function finalizar(args: FinalizarArgs): Promise<void> {
  await rpc('finalizar_task', {
    p_task_id: args.taskId,
    p_status: args.status,
    p_resultado: args.resultado ?? null,
    p_agente: args.agente ?? null,
    // `finalizar_task` não tem parâmetro de erro: a mensagem vai em `p_metadados.erro_mensagem` (log da execução).
    p_metadados: {
      execucao_id: args.execucaoId,
      chaves: args.chaves ?? [],
      classe_falha: args.classeFalha ?? null,
      passo_falho: args.passoFalho ?? null,
      erro_mensagem: args.erroMensagem ?? null,
    },
  });
}
