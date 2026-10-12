import { ChatOpenAI } from '@langchain/openai';
import type { BaseCheckpointSaver } from '@langchain/langgraph';
import { criarCheckpointer } from './checkpointer.js';
import type { GrafoExecucao } from './executar.js';
import { criarGrafo } from './grafo.js';

const MODELO_PADRAO = 'gpt-4o-mini';

/**
 * Monta o grafo real do worker com modelo e checkpointer Postgres (SUB-39.4).
 * Ponto único da configuração usada pelo CLI do worker e pela retomada da aprovação.
 * @param env Variáveis de ambiente (`OPENAI_API_KEY`, `WORKER_MODELO`, `LANGGRAPH_DATABASE_URL`).
 * @returns Grafo pronto para `invoke`.
 * @throws {Error} Sem `OPENAI_API_KEY` ou sem `LANGGRAPH_DATABASE_URL`.
 */
export async function criarGrafoComCheckpointer(env: NodeJS.ProcessEnv = process.env): Promise<GrafoExecucao> {
  if (!env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY não definida');
  const modelo = new ChatOpenAI({ model: env.WORKER_MODELO || MODELO_PADRAO, apiKey: env.OPENAI_API_KEY, temperature: 0 });
  // `langgraph-checkpoint-postgres` traz outra versão de `langgraph-checkpoint`; a interface usada é a mesma.
  const checkpointer = (await criarCheckpointer(env)) as unknown as BaseCheckpointSaver;
  return criarGrafo({ modelo, checkpointer }) as unknown as GrafoExecucao;
}
