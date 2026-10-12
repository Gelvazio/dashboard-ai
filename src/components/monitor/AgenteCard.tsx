/**
 * Cartão de um agente no monitor (SUB-35.23).
 *
 * Exibe: nome, selo do estado, task atual, etapa/nó, última mensagem
 * e "há X s" (tempo relativo).
 */
import { estadoDoAgente, type EstadoAgente } from '@/lib/monitor';
import type { AtividadeAgente } from '@/types/database';

interface AgenteCardProps {
  atividade: AtividadeAgente;
  agora?: number;
}

/** Tempo relativo em formato "há X s" ou "há X min". */
function tempoRelativo(dataISO: string | null, agora: number = Date.now()): string {
  if (!dataISO) return '--';
  const ms = agora - Date.parse(dataISO);
  if (ms < 0) return 'agora';
  const s = Math.floor(ms / 1000);
  if (s < 60) return `há ${s} s`;
  const min = Math.floor(s / 60);
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  return `há ${h} h`;
}

/** Cores e rótulos dos estados. */
const ESTADO: Record<EstadoAgente, { rotulo: string; classe: string }> = {
  ativo: { rotulo: 'Ativo', classe: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300' },
  ocioso: { rotulo: 'Ocioso', classe: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300' },
  sem_sinal: { rotulo: 'Sem sinal', classe: 'bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400' },
  finalizado: { rotulo: 'Finalizado', classe: 'bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400' },
};

export function AgenteCard({ atividade, agora = Date.now() }: AgenteCardProps) {
  const estado = estadoDoAgente(atividade, agora);
  const info = ESTADO[estado];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* Cabeçalho: nome + estado */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{atividade.agente}</h3>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${info.classe}`}>{info.rotulo}</span>
      </div>

      {/* Task atual */}
      {atividade.task_codigo && (
        <div className="mb-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Task:</span>
          <span className="ml-1 text-sm font-mono text-slate-700 dark:text-slate-300">{atividade.task_codigo}</span>
        </div>
      )}

      {/* Etapa/nó */}
      {atividade.etapa && (
        <div className="mb-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Etapa:</span>
          <span className="ml-1 text-sm text-slate-700 dark:text-slate-300">{atividade.etapa}</span>
        </div>
      )}

      {/* Última mensagem */}
      {atividade.mensagem && (
        <div className="mb-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Mensagem:</span>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{atividade.mensagem}</p>
        </div>
      )}

      {/* Tempo relativo */}
      <div className="mt-3 text-xs text-slate-400 dark:text-slate-500">
        {tempoRelativo(atividade.ultimo_em || atividade.ultimo_heartbeat_em, agora)}
      </div>
    </div>
  );
}
