import { EstadoExecucao } from '../estado.js';
import { ALLOWLIST } from '../ferramentas.js';

/**
 * Nó de política/aprovação (SUB-28.8).
 * Valida passos contra allowlist e interrompe para aprovação se sensível.
 * Placeholder - implementação real com interrupt será depois.
 */
export async function politica(state: typeof EstadoExecucao.State) {
  const { plano } = state;

  if (!plano) {
    return { aprovacao: null };
  }

  // Parse do plano
  const planoObj = JSON.parse(plano);
  const passos = planoObj.passos || [];

  // Validar cada passo contra a allowlist
  for (const passo of passos) {
    const ferramenta = ALLOWLIST[passo.ferramenta];
    if (!ferramenta) {
      throw new Error(`Ferramenta não permitida: ${passo.ferramenta}`);
    }

    // Se sensível, interromper para aprovação (placeholder)
    if (ferramenta.sensivel) {
      // Em implementação real, chamar interrupt() com pedido de aprovação
      return {
        aprovacao: {
          acao: passo.ferramenta,
          estado: 'pendente',
          motivo: 'Ação sensível requer aprovação humana',
        },
      };
    }
  }

  return { aprovacao: null };
}
