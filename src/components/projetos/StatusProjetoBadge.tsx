import { cn } from '@/lib/utils';

const APARENCIA_PROJETO = {
  ativo: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-500/15 dark:text-emerald-300',
  inativo: 'bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-700 dark:text-slate-300',
} as const;

/** Propriedades visuais do status de um projeto. */
export interface StatusProjetoBadgeProps {
  ativo: boolean;
  className?: string;
}

/** Mostra o estado do projeto como 1-ATIVO ou 0-INATIVO. */
export function StatusProjetoBadge({ ativo, className }: StatusProjetoBadgeProps) {
  const aparencia = ativo ? APARENCIA_PROJETO.ativo : APARENCIA_PROJETO.inativo;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        aparencia,
        className,
      )}
      aria-label={ativo ? 'Projeto ativo' : 'Projeto inativo'}
    >
      {ativo ? '1-ATIVO' : '0-INATIVO'}
    </span>
  );
}
