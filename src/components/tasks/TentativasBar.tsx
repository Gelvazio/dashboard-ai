import { cn } from '@/lib/utils';
import { progressoTentativas } from '@/lib/tasks';
import type { Task } from '@/types';
import { Tooltip } from '@/components/ui/Tooltip';

/** Barra de progresso das tentativas usadas (fica vermelha ao esgotar). */
export function TentativasBar({ task }: { task: Pick<Task, 'tentativas' | 'max_tentativas'> }) {
  const p = progressoTentativas(task);
  const cor = p >= 1 ? 'bg-rose-500' : p >= 0.5 ? 'bg-amber-500' : 'bg-brand-500';
  return (
    <Tooltip conteudo={`${task.tentativas} de ${task.max_tentativas} tentativas usadas${p >= 1 ? ' — limite atingido' : ''}`}>
      <span tabIndex={0} className="flex w-14 flex-col gap-1">
        <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
          {task.tentativas}/{task.max_tentativas}
        </span>
        <span className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700" role="progressbar" aria-valuemin={0} aria-valuemax={task.max_tentativas} aria-valuenow={task.tentativas}>
          <span className={cn('block h-full rounded-full transition-all', cor)} style={{ width: `${Math.round(p * 100)}%` }} />
        </span>
      </span>
    </Tooltip>
  );
}
