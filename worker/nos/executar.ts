import { EstadoExecucao } from '../estado.js';
import { criarFerramentaLangChain } from '../ferramentas.js';
import { listTools } from '../../api/_lib/tools.js';

/**
 * Nó que executa o passo atual (SUB-28.9).
 * Chama a ferramenta com chave de idempotência `${execucaoId}:${passo}`.
 * Placeholder - implementação real será depois.
 */
export async function executar(state: typeof EstadoExecucao.State) {
  const { execucaoId, resultados } = state;

  // Placeholder: em implementação real, plano virá do estado
  const planoPlaceholder = {
    passos: [
      {
        ferramenta: 'brain_search',
        argumentos: { query: state.instrucao },
      },
    ],
  };

  const passos = planoPlaceholder.passos || [];

  // Encontrar o próximo passo não executado
  const passoIndex = passos.findIndex((p: any) => !resultados[`passo-${p.ferramenta}`]);

  if (passoIndex === -1) {
    return { passoAtual: '', final: true };
  }

  const passo = passos[passoIndex];
  const chaveIdempotencia = `${execucaoId}:passo-${passoIndex}`;

  // Criar e executar a ferramenta
  const definicao = (await listTools()).find((t) => t.name === passo.ferramenta);
  if (!definicao) {
    throw new Error(`Ferramenta não disponível: ${passo.ferramenta}`);
  }
  const ferramenta = criarFerramentaLangChain(definicao, async (args) => {
    // Placeholder: implementação real chamará MCP
    return `Resultado de ${passo.ferramenta}`;
  });

  const resultado = await ferramenta.invoke(passo.argumentos);

  return {
    passoAtual: passo.ferramenta,
    resultados: {
      ...resultados,
      [`passo-${passoIndex}`]: resultado,
    },
  };
}
