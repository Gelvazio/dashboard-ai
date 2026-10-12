/**
 * Funções de formatação de similaridade para busca semântica (SUB-19.x).
 *
 * Formata valores de similaridade (0–1) como porcentagens e
 * fornece classes Tailwind para badges de similaridade.
 */

/**
 * Formata um valor de similaridade (0–1) como porcentagem.
 *
 * @param s - Valor de similaridade entre 0 e 1
 * @returns String formatada como porcentagem (ex: '89%')
 */
export function formatarSimilaridade(s: number): string {
  // Limita ao intervalo 0–1
  const limitado = Math.max(0, Math.min(1, s));
  // Multiplica por 100 e arredonda
  const porcentagem = Math.round(limitado * 100);
  return `${porcentagem}%`;
}

/** Limiar a partir do qual a similaridade é considerada alta (verde). */
export const LIMIAR_SIMILARIDADE_ALTA = 0.85;
/** Limiar a partir do qual a similaridade é considerada média (âmbar). */
export const LIMIAR_SIMILARIDADE_MEDIA = 0.7;

/**
 * Classes Tailwind (claro e `dark:`) para o badge de similaridade.
 *
 * - `>= 0.85` verde; `>= 0.7` âmbar; abaixo disso (ou valor inválido) cinza.
 */
export function classeSimilaridade(s: number): string {
  if (Number.isFinite(s) && s >= LIMIAR_SIMILARIDADE_ALTA) {
    return 'bg-emerald-100 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/30';
  }
  if (Number.isFinite(s) && s >= LIMIAR_SIMILARIDADE_MEDIA) {
    return 'bg-amber-100 text-amber-800 ring-amber-600/20 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/30';
  }
  return 'bg-slate-100 text-slate-700 ring-slate-500/20 dark:bg-slate-500/15 dark:text-slate-300 dark:ring-slate-400/30';
}
