import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import { ChatOpenAI } from '@langchain/openai';
import type { BaseCheckpointSaver } from '@langchain/langgraph';
import { criarCheckpointer } from './checkpointer.js';
import { executarUmaTask, type DepsExecucao, type GrafoExecucao, type ResultadoExecucao } from './executar.js';
import { criarGrafo } from './grafo.js';

export interface OpcoesWorker {
  projeto: string;
  agente: string;
  umaVez: boolean;
}

/** Lê `--projeto`, `--agente` e `--uma-vez` (SUB-28.15). */
export function lerOpcoes(argv: string[]): OpcoesWorker {
  const { values } = parseArgs({
    args: argv,
    options: {
      projeto: { type: 'string', default: 'default' },
      agente: { type: 'string', default: 'Worker LangGraph' },
      'uma-vez': { type: 'boolean', default: false },
    },
    strict: true,
  });
  return { projeto: values.projeto!, agente: values.agente!, umaVez: values['uma-vez']! };
}

/** Grafo criado só na primeira task (sem task, não exige modelo nem checkpointer). */
export function grafoSobDemanda(criar: () => Promise<GrafoExecucao>): GrafoExecucao {
  let grafo: Promise<GrafoExecucao> | undefined;
  return {
    invoke: async (entrada, config) => {
      grafo ??= criar();
      return (await grafo).invoke(entrada, config);
    },
  };
}

async function criarGrafoReal(env: NodeJS.ProcessEnv = process.env): Promise<GrafoExecucao> {
  if (!env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY não definida');
  const modelo = new ChatOpenAI({ model: env.WORKER_MODELO || 'gpt-4o-mini', apiKey: env.OPENAI_API_KEY, temperature: 0 });
  // `langgraph-checkpoint-postgres` traz outra versão de `langgraph-checkpoint`; a interface usada é a mesma.
  const checkpointer = (await criarCheckpointer(env)) as unknown as BaseCheckpointSaver;
  return criarGrafo({ modelo, checkpointer }) as unknown as GrafoExecucao;
}

/**
 * Loop do worker: chama `executarUmaTask` até não haver task (ou uma vez só com `--uma-vez`).
 * Devolve as execuções feitas.
 */
export async function rodarWorker(
  opcoes: OpcoesWorker,
  executar: (deps: DepsExecucao) => Promise<ResultadoExecucao | null> = executarUmaTask,
  grafo: GrafoExecucao = grafoSobDemanda(() => criarGrafoReal()),
  log: (mensagem: string) => void = console.log,
): Promise<ResultadoExecucao[]> {
  const execucoes: ResultadoExecucao[] = [];
  for (;;) {
    const resultado = await executar({ agente: opcoes.agente, projeto: opcoes.projeto, grafo });
    if (!resultado) {
      log(`worker: nenhuma task disponível em "${opcoes.projeto}"`);
      break;
    }
    execucoes.push(resultado);
    log(`worker: ${resultado.execucaoId} ${resultado.situacao}${resultado.motivo ? ` (${resultado.motivo})` : ''}`);
    if (opcoes.umaVez) break;
  }
  return execucoes;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  rodarWorker(lerOpcoes(process.argv.slice(2))).catch((erro: unknown) => {
    console.error(`worker: ${erro instanceof Error ? erro.message : String(erro)}`);
    process.exit(1);
  });
}
