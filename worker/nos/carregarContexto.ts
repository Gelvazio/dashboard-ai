import { EstadoExecucao } from '../estado.js';

/**
 * Nó que carrega o contexto inicial (SUB-28.6).
 * Busca memórias relevantes via brain_search e guarda no estado.
 * Placeholder - implementação real será depois com ferramentas MCP.
 */
export async function carregarContexto(state: typeof EstadoExecucao.State) {
  const { instrucao } = state;

  // Placeholder: em SUB-28.9 será implementada a chamada real ao brain_search
  // Aqui retornamos o estado vazio para o nó funcionar
  return {
    resultados: {
      ...state.resultados,
      brain_search: [],
    },
  };
}
