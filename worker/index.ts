import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import { executarUmaTask, type DepsExecucao, type GrafoExecucao, type ResultadoExecucao } from './executar.js';
import { criarGrafoComCheckpointer } from './grafoFabrica.js';
import { iniciarHeartbeat } from './heartbeat.js';

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

/**
 * Loop do worker: chama `executarUmaTask` até não haver task (ou uma vez só com `--uma-vez`).
 * Devolve as execuções feitas.
 */
export async function rodarWorker(
  opcoes: OpcoesWorker,
  executar: (deps: DepsExecucao) => Promise<ResultadoExecucao | null> = executarUmaTask,
  grafo: GrafoExecucao = grafoSobDemanda(() => criarGrafoComCheckpointer()),
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

const CODIGO_SAIDA_SINAL = { SIGINT: 130, SIGTERM: 143 } as const;

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const opcoes = lerOpcoes(process.argv.slice(2));
  // Heartbeat do monitor (SUB-35.38): para no fim do loop e em SIGINT/SIGTERM.
  const pararHeartbeat = iniciarHeartbeat({ agente: opcoes.agente, projeto: opcoes.projeto });
  for (const sinal of ['SIGINT', 'SIGTERM'] as const) {
    process.once(sinal, () => {
      pararHeartbeat();
      process.exit(CODIGO_SAIDA_SINAL[sinal]);
    });
  }
  rodarWorker(opcoes)
    .finally(pararHeartbeat)
    .catch((erro: unknown) => {
      console.error(`worker: ${erro instanceof Error ? erro.message : String(erro)}`);
      process.exit(1);
    });
}
