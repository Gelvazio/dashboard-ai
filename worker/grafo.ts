import { END, START, StateGraph, type BaseCheckpointSaver } from '@langchain/langgraph';
import { EstadoExecucao } from './estado.js';
import { carregarContexto, type DepsContexto } from './nos/carregarContexto.js';
import { executar, type DepsExecutar } from './nos/executar.js';
import { finalizarNode, type DepsFinalizar } from './nos/finalizar.js';
import { criarNoPlanejar, type ModeloPlano } from './nos/planejar.js';
import { politica, type PedirAprovacao } from './nos/politica.js';
import { OPCOES_REVISAO_PADRAO, revisar, type OpcoesRevisao } from './nos/revisar.js';

type Estado = typeof EstadoExecucao.State;

/** Dependências injetáveis do grafo; omitidas usam as implementações reais dos nós. */
export interface DepsGrafo {
  modelo: ModeloPlano;
  checkpointer?: BaseCheckpointSaver;
  contexto?: DepsContexto;
  pedirAprovacao?: PedirAprovacao;
  executar?: DepsExecutar;
  revisao?: OpcoesRevisao;
  esperar?: (ms: number) => Promise<void>;
  finalizar?: DepsFinalizar;
}

function aprovacaoNegada(aprovacao: unknown): boolean {
  return typeof aprovacao === 'object' && aprovacao !== null && (aprovacao as { aprovado?: unknown }).aprovado === false;
}

/**
 * Grafo principal do worker LangGraph (SUB-28.12):
 * carregarContexto -> planejar -> politica -> executar -> revisar -> (executar | finalizar).
 * Aprovação negada em `politica` vai direto para `finalizar` (status `recusada`).
 */
export function criarGrafo(deps: DepsGrafo) {
  return new StateGraph(EstadoExecucao)
    .addNode('carregarContexto', (state: Estado) => carregarContexto(state, deps.contexto))
    .addNode('planejar', criarNoPlanejar(deps.modelo))
    .addNode('politica', (state: Estado) => politica(state, deps.pedirAprovacao))
    .addNode('executar', (state: Estado) => executar(state, deps.executar))
    .addNode('revisar', (state: Estado) => revisar(state, deps.revisao ?? OPCOES_REVISAO_PADRAO, deps.esperar))
    .addNode('finalizar', (state: Estado) => finalizarNode(state, deps.finalizar))
    .addEdge(START, 'carregarContexto')
    .addEdge('carregarContexto', 'planejar')
    .addEdge('planejar', 'politica')
    .addConditionalEdges('politica', (state: Estado) => (aprovacaoNegada(state.aprovacao) ? 'finalizar' : 'executar'), [
      'executar',
      'finalizar',
    ])
    .addEdge('executar', 'revisar')
    .addConditionalEdges('revisar', (state: Estado) => (state.final ? 'finalizar' : 'executar'), ['executar', 'finalizar'])
    .addEdge('finalizar', END)
    .compile({ checkpointer: deps.checkpointer });
}
