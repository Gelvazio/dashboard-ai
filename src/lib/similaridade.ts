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
