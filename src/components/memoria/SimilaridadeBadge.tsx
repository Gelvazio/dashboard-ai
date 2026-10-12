import { cn } from '@/lib/utils';
import { classeSimilaridade, formatarSimilaridade } from '@/lib/similaridade';

export interface SimilaridadeBadgeProps {
  /** Similaridade de cosseno entre 0 e 1 (ex.: 0.894 -> "89%"). */
  similaridade: number;
  className?: string;
}

/**
 * Pílula com a porcentagem de similaridade de um resultado da busca semântica
 * (SUB-19.4). Cor por faixa via `classeSimilaridade` (verde/âmbar/cinza).
 */
export function SimilaridadeBadge({ similaridade, className }: SimilaridadeBadgeProps) {
  const texto = formatarSimilaridade(similaridade);
  const rotulo = `Similaridade de ${texto}`;
  return (
    <span
      title={rotulo}
      aria-label={rotulo}
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ring-1 ring-inset',
        classeSimilaridade(similaridade),
        className,
      )}
    >
      {texto}
    </span>
  );
}
