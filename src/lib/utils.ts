import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Junta classes condicionais (clsx) e resolve conflitos do Tailwind (tailwind-merge):
 * `cn('px-2 py-1', ativo && 'bg-brand-600', 'px-4')` -> 'py-1 bg-brand-600 px-4'.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
