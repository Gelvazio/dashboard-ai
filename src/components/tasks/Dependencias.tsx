import { cn } from '@/lib/utils';
import { STATUS_INFO, type DependenciaTask } from '@/lib/tasks';
import { Tooltip } from '@/components/ui/Tooltip';

const COR = {
  concluida: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
  pendente: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
  desconhecida: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700',
} as const;

/** Chips com o código de cada dependência, coloridos pela situação dela. */
export function Dependencias({ deps }: { deps: DependenciaTask[] }) {
  if (!deps.length) return <span className="text-xs text-slate-400">—</span>;
  return (
    <span className="flex flex-wrap gap-1">
      {deps.map((d) => (
        <Tooltip
          key={d.codigo}
          conteudo={d.status ? `${d.codigo}: ${STATUS_INFO[d.status].rotulo}` : `${d.codigo}: não encontrada neste projeto (ou fora do filtro)`}
        >
          <span tabIndex={0} className={cn('rounded px-1.5 py-0.5 font-mono text-[11px] ring-1 ring-inset', COR[d.estado])}>
            {d.codigo}
          </span>
        </Tooltip>
      ))}
    </span>
  );
}
