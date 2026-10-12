/**
 * Funções de diagnóstico da saúde da fila de tasks (SUB-23.x).
 *
 * Detecta tasks travadas por muito tempo, classifica pendentes e
 * fornece métricas para o painel de diagnóstico.
 */
import type { Task } from '@/types';

/** Tempo limite em minutos antes de considerar uma trava expirada. */
export const LIMITE_TRAVA_MIN = 90;

/**
 * Calcula há quantos minutos uma task está travada.
 *
 * @param task - Task com campo `trava_em`
 * @param agora - Timestamp atual em ms (padrão: Date.now())
 * @returns Minutos desde a trava, ou null se não houver trava/data inválida
 */
export function minutosDeTrava(task: Pick<Task, 'trava_em'>, agora: number = Date.now()): number | null {
  if (!task.trava_em) return null;
  const travadoEm = Date.parse(task.trava_em);
  if (Number.isNaN(travadoEm)) return null;
  const minutos = (agora - travadoEm) / 1000 / 60;
  return minutos < 0 ? 0 : minutos;
}

/**
 * Verifica se a trava de uma task está expirada (ultrapassou o limite).
 *
 * @param task - Task com campo `trava_em`
 * @param agora - Timestamp atual em ms (padrão: Date.now())
 * @param limite - Limite em minutos (padrão: LIMITE_TRAVA_MIN)
 * @returns true se a trava expirou, false caso contrário (sem trava ou dentro do limite)
 */
export function travaExpirada(
  task: Pick<Task, 'trava_em'>,
  agora: number = Date.now(),
  limite: number = LIMITE_TRAVA_MIN,
): boolean {
  const minutos = minutosDeTrava(task, agora);
  if (minutos === null) return false;
  return minutos >= limite;
}
