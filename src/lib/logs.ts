/** Apresentação dos logs do agendador (rótulos, cores, duração, agrupamento por dia). */
import type { AgendamentoLog, LogStatus } from '@/types';

export const LOG_INFO: Record<LogStatus, { rotulo: string; badge: string; ponto: string }> = {
  concluida: { rotulo: 'Concluída', badge: 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30', ponto: 'bg-status-concluida' },
  recusada: { rotulo: 'Recusada', badge: 'bg-orange-50 text-orange-800 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/30', ponto: 'bg-status-recusada' },
  erro: { rotulo: 'Erro', badge: 'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30', ponto: 'bg-status-erro' },
  sem_tarefa: { rotulo: 'Sem task', badge: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-500/30', ponto: 'bg-status-cancelada' },
};

/** 850 → "850 ms"; 75_000 → "1 min 15 s"; 3_900_000 → "1 h 5 min". */
export function formatarDuracao(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return '—';
  if (ms < 1000) return `${Math.round(ms)} ms`;
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} s`;
  const min = Math.floor(s / 60);
  if (min < 60) return s % 60 ? `${min} min ${s % 60} s` : `${min} min`;
  const h = Math.floor(min / 60);
  return min % 60 ? `${h} h ${min % 60} min` : `${h} h`;
}

/** Duração do log: `duracao_ms` ou a diferença entre início e fim. */
export function duracaoDoLog(l: Pick<AgendamentoLog, 'duracao_ms' | 'inicio_em' | 'fim_em'>): number | null {
  if (l.duracao_ms != null) return l.duracao_ms;
  if (l.inicio_em && l.fim_em) return Date.parse(l.fim_em) - Date.parse(l.inicio_em);
  return null;
}

/** Agrupa (mantendo a ordem) por dia local: [["11/10/2026", [...]], ...]. */
export function agruparPorDia<T extends Pick<AgendamentoLog, 'data_hora'>>(logs: T[]): [string, T[]][] {
  const fmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
  const grupos = new Map<string, T[]>();
  for (const l of logs) {
    const dia = fmt.format(new Date(l.data_hora));
    grupos.set(dia, [...(grupos.get(dia) ?? []), l]);
  }
  return [...grupos.entries()];
}
