import { db, unwrap } from '../api/_lib/supabase.js';

/** Linha da task relida no Supabase antes de iniciar/retomar. */
export interface TaskAtual {
  status: string;
  trava_frente: string | null;
  trava_em: string | null;
  tentativas: number;
}

export interface EsperadoReconciliacao {
  taskId: number;
  agente: string;
  tentativa: number;
}

export interface Reconciliacao {
  valido: boolean;
  motivo?: string;
}

export interface DepsReconciliar {
  lerTask: (taskId: number) => Promise<TaskAtual | null>;
  agora: () => Date;
  /** Validade da trava (minutos), igual à de `pegar_proxima_task`. */
  lockMinutos: number;
}

async function lerTaskNoSupabase(taskId: number): Promise<TaskAtual | null> {
  const linhas = unwrap<TaskAtual[]>(
    await db().from('tasks').select('status,trava_frente,trava_em,tentativas').eq('id', taskId).limit(1),
  );
  return linhas[0] ?? null;
}

const DEPS_PADRAO: DepsReconciliar = { lerTask: lerTaskNoSupabase, agora: () => new Date(), lockMinutos: 90 };

/**
 * Reconciliação na retomada (SUB-28.14).
 * Relê a task e só libera a execução se ela continua `em_execucao`, com
 * `trava_frente` = agente, trava dentro da validade e a mesma tentativa do
 * checkpoint; caso contrário o worker deve abortar sem efeitos.
 */
export async function reconciliar(esperado: EsperadoReconciliacao, deps: DepsReconciliar = DEPS_PADRAO): Promise<Reconciliacao> {
  const task = await deps.lerTask(esperado.taskId);
  if (!task) return { valido: false, motivo: 'task não encontrada' };
  if (task.status !== 'em_execucao') return { valido: false, motivo: `status ${task.status}` };
  if (task.trava_frente !== esperado.agente) return { valido: false, motivo: 'trava de outro agente' };

  // A trava expira `lockMinutos` depois de adquirida (`trava_em`).
  const travaEm = task.trava_em ? new Date(task.trava_em).getTime() : Number.NaN;
  if (!(deps.agora().getTime() - travaEm < deps.lockMinutos * 60_000)) {
    return { valido: false, motivo: 'trava expirada' };
  }
  if (task.tentativas !== esperado.tentativa) return { valido: false, motivo: 'tentativa divergente' };
  return { valido: true };
}
