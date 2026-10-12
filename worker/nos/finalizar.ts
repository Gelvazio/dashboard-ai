import { EstadoExecucao } from '../estado.js';
import { finalizar, type FinalizarArgs } from '../fila.js';

const LIMITE_RESUMO = 2000;

export interface DepsFinalizar {
  finalizar: (args: FinalizarArgs) => Promise<void>;
}

const CHAVE_PASSO = /^passo-\d+$/;

/** Chaves dos passos executados (`passo-<i>`), sem memórias, contadores nem classe de falha. */
export function chavesDosPassos(resultados: Record<string, unknown>): string[] {
  return Object.keys(resultados).filter((chave) => CHAVE_PASSO.test(chave));
}

/** Resumo sem valores dos resultados (podem conter dados sensíveis): só os passos concluídos. */
export function resumoSeguro(resultados: Record<string, unknown>): string {
  const passos = chavesDosPassos(resultados);
  const resumo = passos.length ? `${passos.length} passo(s) concluído(s): ${passos.join(', ')}` : 'Nenhum passo executado';
  return resumo.slice(0, LIMITE_RESUMO);
}

function foiRecusada(aprovacao: unknown): boolean {
  return typeof aprovacao === 'object' && aprovacao !== null && (aprovacao as { aprovado?: unknown }).aprovado === false;
}

/**
 * Nó que finaliza a execução (SUB-28.11).
 * Chama a RPC `finalizar_task` com `concluida`, `recusada` (aprovação negada)
 * ou `erro` (`resultados.erro` preenchido), um resumo seguro e o `execucaoId`.
 */
export async function finalizarNode(state: typeof EstadoExecucao.State, deps: DepsFinalizar = { finalizar }) {
  const { taskId, execucaoId, resultados, aprovacao, passoAtual } = state;
  const erro = resultados['erro'];
  const status: FinalizarArgs['status'] = foiRecusada(aprovacao) ? 'recusada' : erro ? 'erro' : 'concluida';

  await deps.finalizar({
    taskId,
    status,
    execucaoId,
    agente: state.agente,
    resultado: resumoSeguro(resultados),
    erroMensagem: status === 'erro' ? String(erro).slice(0, LIMITE_RESUMO) : status === 'recusada' ? 'Aprovação recusada' : undefined,
    passoFalho: status === 'erro' && passoAtual ? passoAtual : undefined,
    chaves: chavesDosPassos(resultados),
  });

  return { final: true };
}
