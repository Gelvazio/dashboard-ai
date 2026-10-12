import { interrupt } from '@langchain/langgraph';
import { EstadoExecucao } from '../estado.js';
import { ALLOWLIST } from '../ferramentas.js';
import type { z } from 'zod';
import { PlanoSchema } from '../plano.js';

type Passo = z.infer<typeof PlanoSchema>['passos'][number];

/** Pedido enviado ao humano quando o plano tem passos sensíveis. */
export interface PedidoAprovacao {
  tipo: 'aprovacao';
  taskCodigo: string;
  passos: Pick<Passo, 'ferramenta' | 'argumentos' | 'criterio'>[];
  motivo: string;
}

export type PedirAprovacao = (pedido: PedidoAprovacao) => unknown;

/**
 * Nó de política/aprovação (SUB-28.8).
 * Valida cada passo contra a allowlist (fora dela: erro de permissão) e, se houver
 * passo sensível (flag do plano ou da allowlist), chama `interrupt()` com o pedido
 * de aprovação; a resposta do humano (ex.: `{ aprovado: true }`) vai para `aprovacao`.
 */
export async function politica(state: typeof EstadoExecucao.State, pedirAprovacao: PedirAprovacao = interrupt) {
  const { plano, taskCodigo } = state;
  if (!plano) {
    return { aprovacao: null };
  }

  const { passos } = PlanoSchema.parse(JSON.parse(plano));

  // Nenhum passo pode usar ferramenta fora da allowlist.
  const proibido = passos.find((passo) => !ALLOWLIST[passo.ferramenta]);
  if (proibido) {
    // status 403 faz `classificarFalha` tratar como permissão (sem repetir).
    throw Object.assign(new Error(`Ferramenta não permitida: ${proibido.ferramenta}`), { status: 403 });
  }

  const sensiveis = passos.filter((passo) => passo.sensivel || ALLOWLIST[passo.ferramenta].sensivel);
  if (sensiveis.length === 0) {
    return { aprovacao: null };
  }

  const resposta = pedirAprovacao({
    tipo: 'aprovacao',
    taskCodigo,
    passos: sensiveis.map(({ ferramenta, argumentos, criterio }) => ({ ferramenta, argumentos, criterio })),
    motivo: 'Ação sensível requer aprovação humana',
  });
  return { aprovacao: resposta ?? null };
}
