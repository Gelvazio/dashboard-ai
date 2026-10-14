import { ChatOpenAI } from '@langchain/openai';
import type { BaseCheckpointSaver } from '@langchain/langgraph';
import { criarCheckpointer } from './checkpointer.js';
import type { GrafoExecucao } from './executar.js';
import { criarGrafo } from './grafo.js';
import { NIVEIS, type NivelTarefa } from './niveis.js';
import type { ModeloPlano, ModelosPorNivel } from './nos/planejar.js';

const MODELO_PADRAO = 'gpt-4o-mini';
const TEMPERATURA_MODELO = 0;

/** Variável de ambiente com o modelo de cada nível. */
const VARIAVEL_MODELO_POR_NIVEL: Record<NivelTarefa, string> = {
  LEVE: 'WORKER_MODELO_LEVE',
  MEDIO: 'WORKER_MODELO_MEDIO',
  PESADO: 'WORKER_MODELO_PESADO',
};

/**
 * Cria os modelos do worker: um `ChatOpenAI` por nome de modelo distinto.
 * Cada nível cai em `WORKER_MODELO` (e este no padrão) quando sua variável está vazia.
 * @param env Variáveis de ambiente (`WORKER_MODELO`, `WORKER_MODELO_LEVE/MEDIO/PESADO`).
 * @param apiKey Chave da OpenAI.
 * @returns Modelo padrão e modelos por nível (instâncias compartilhadas por nome).
 */
function criarModelos(env: NodeJS.ProcessEnv, apiKey: string) {
  const nomePadrao = env.WORKER_MODELO || MODELO_PADRAO;
  const porNome = new Map<string, ModeloPlano>();
  const obterModelo = (nome: string): ModeloPlano => {
    const existente = porNome.get(nome);
    if (existente) return existente;
    const novo = new ChatOpenAI({ model: nome, apiKey, temperature: TEMPERATURA_MODELO });
    porNome.set(nome, novo);
    return novo;
  };

  const modelosPorNivel: ModelosPorNivel = {};
  for (const nivel of NIVEIS) {
    modelosPorNivel[nivel] = obterModelo(env[VARIAVEL_MODELO_POR_NIVEL[nivel]] || nomePadrao);
  }
  return { modelo: obterModelo(nomePadrao), modelosPorNivel };
}

/**
 * Monta o grafo real do worker com modelo e checkpointer Postgres (SUB-39.4).
 * Ponto único da configuração usada pelo CLI do worker e pela retomada da aprovação.
 * @param env Variáveis de ambiente (`OPENAI_API_KEY`, `WORKER_MODELO`,
 *   `WORKER_MODELO_LEVE/MEDIO/PESADO`, `LANGGRAPH_DATABASE_URL`).
 * @returns Grafo pronto para `invoke`.
 * @throws {Error} Sem `OPENAI_API_KEY` ou sem `LANGGRAPH_DATABASE_URL`.
 */
export async function criarGrafoComCheckpointer(env: NodeJS.ProcessEnv = process.env): Promise<GrafoExecucao> {
  if (!env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY não definida');
  const { modelo, modelosPorNivel } = criarModelos(env, env.OPENAI_API_KEY);
  // `langgraph-checkpoint-postgres` traz outra versão de `langgraph-checkpoint`; a interface usada é a mesma.
  const checkpointer = (await criarCheckpointer(env)) as unknown as BaseCheckpointSaver;
  return criarGrafo({ modelo, modelosPorNivel, checkpointer }) as unknown as GrafoExecucao;
}
