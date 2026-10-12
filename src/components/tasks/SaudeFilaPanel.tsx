import { Activity, ShieldCheck } from 'lucide-react';
import type { DiagnosticoFila } from '@/lib/saudeFila';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';
import { PendentesResumo } from './PendentesResumo';
import { TravaItem } from './TravaItem';

export interface SaudeFilaPanelProps {
  /** `diagnostico` do `useSaudeFila`. */
  diagnostico: DiagnosticoFila;
  /** Id da task com liberação em andamento (`liberando` do `useSaudeFila`). */
  liberando: number | null;
  /** `liberar` do `useSaudeFila`. */
  onLiberar: (task: Task, forcar: boolean) => Promise<boolean>;
  className?: string;
}

/** Painel de diagnóstico da fila: travas ativas e resumo das pendentes (SUB-23.7). */
export function SaudeFilaPanel({ diagnostico, liberando, onLiberar, className }: SaudeFilaPanelProps) {
  const { travas, pendentes, alerta } = diagnostico;
  return (
    <section
      aria-labelledby="saude-fila-titulo"
      className={cn('space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900', className)}
    >
      <header className="flex items-center gap-2">
        <Activity className={cn('size-5', alerta ? 'text-rose-500' : 'text-brand-600')} aria-hidden />
        <h2 id="saude-fila-titulo" className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Saúde da fila
        </h2>
        {alerta && (
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-950 dark:text-rose-300">
            Trava expirada
          </span>
        )}
      </header>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Travas ativas ({travas.length})</h3>
        {travas.length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <ShieldCheck className="size-4 text-emerald-500" aria-hidden />
            Nenhuma trava ativa
          </p>
        ) : (
          <ul className="space-y-2">
            {travas.map((t) => (
              <TravaItem key={t.task.id} trava={t} liberando={liberando === t.task.id} onLiberar={onLiberar} />
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Pendentes</h3>
        <PendentesResumo pendentes={pendentes} />
      </div>
    </section>
  );
}
