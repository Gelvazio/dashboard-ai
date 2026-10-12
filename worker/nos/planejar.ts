import { EstadoExecucao } from '../estado.js';
import { montarPromptPlano } from '../plano.js';
import { PlanoSchema } from '../plano.js';

/**
 * Nó que planeja a execução (SUB-28.7).
 * Chama o modelo para gerar o plano de passos com `PlanoSchema`.
 * Placeholder - implementação real com modelo será depois.
 */
export async function planejar(state: typeof EstadoExecucao.State) {
  const prompt = montarPromptPlano(state);

  // Placeholder: em implementação real será chamada ao modelo LangChain
  // com saída estruturada usando PlanoSchema
  const planoPlaceholder = {
    passos: [
      {
        ferramenta: 'brain_search',
        argumentos: { query: state.instrucao },
        sensivel: false,
        criterio: 'Memórias relevantes encontradas',
      },
    ],
  };

  const planoValidado = PlanoSchema.parse(planoPlaceholder);

  return {
    plano: JSON.stringify(planoValidado),
  };
}
