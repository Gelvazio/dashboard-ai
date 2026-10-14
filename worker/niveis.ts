/**
 * Níveis de task (SUB-47.17 a 47.19), sem dependências: quem só precisa do tipo ou da checagem
 * (fila, planejamento, fábrica do grafo) importa daqui, sem carregar banco nem classificador.
 */

export const NIVEIS = ['LEVE', 'MEDIO', 'PESADO'] as const;
export type NivelTarefa = (typeof NIVEIS)[number];

/**
 * Diz se um valor é um nível válido.
 * @param valor - Valor qualquer (ex.: `nivel_tarefa` do banco ou `nivel` do estado).
 * @returns true para `LEVE`, `MEDIO` ou `PESADO`.
 */
export function ehNivel(valor: unknown): valor is NivelTarefa {
  return typeof valor === 'string' && (NIVEIS as readonly string[]).includes(valor);
}
