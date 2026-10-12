import { EstadoExecucao } from '../estado.js';

/**
 * Nó que revisa o resultado (SUB-28.10).
 * Decide se precisa de mais passos ou finalizar.
 * Placeholder - implementação real com roteamento será depois.
 */
export async function revisar(state: typeof EstadoExecucao.State) {
  const { passoAtual } = state;

  // Se não há passo atual ou todos os passos foram executados, finalizar
  if (!passoAtual) {
    return { final: true };
  }

  // Placeholder: em implementação real, verificar se há mais passos no plano
  // ou se os critérios de sucesso foram atendidos
  const temMaisPassos = false;

  if (temMaisPassos) {
    return { final: false };
  }

  return { final: true };
}
