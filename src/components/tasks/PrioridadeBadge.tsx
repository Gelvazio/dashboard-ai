import { cn } from '@/lib/utils';
import { infoPrioridade } from '@/lib/tasks';
import { Tooltip } from '@/components/ui/Tooltip';

export function PrioridadeBadge({ prioridade, className }: { prioridade: number; className?: string }) {
  const info = infoPrioridade(prioridade);
  return (
    <Tooltip conteudo={`Prioridade ${prioridade} — ${info.rotulo} (1 = mais urgente)`}>
      <span
        tabIndex={0}
        aria-label={`Prioridade ${prioridade}, ${info.rotulo}`}
        className={cn('inline-flex size-6 items-center justify-center rounded-md text-xs font-bold tabular-nums', info.badge, className)}
      >
        {prioridade}
      </span>
    </Tooltip>
  );
}
