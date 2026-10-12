import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_INFO } from '@/lib/tasks';
import type { TaskStatus } from '@/types';
import { Tooltip } from '@/components/ui/Tooltip';

export function StatusBadge({ status, detalhe, className }: { status: TaskStatus; detalhe?: string; className?: string }) {
  const info = STATUS_INFO[status];
  return (
    <Tooltip conteudo={detalhe ? `${info.descricao}\n${detalhe}` : info.descricao}>
      <span
        tabIndex={0}
        className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset', info.badge, className)}
      >
        {status === 'em_execucao' ? (
          <Loader2 className="size-3 animate-spin" aria-hidden />
        ) : (
          <span className={cn('size-1.5 rounded-full', info.ponto)} aria-hidden />
        )}
        {info.rotulo}
      </span>
    </Tooltip>
  );
}
