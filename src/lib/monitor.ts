import type { AgentEvent, AtividadeAgente, TipoEventoAgente } from '@/types/database';

/** Ordem do feed: `created_at` mais recente primeiro; empate pelo `id` maior. */
function maisRecentePrimeiro(a: AgentEvent, b: AgentEvent): number {
  const ta = Date.parse(a.created_at);
  const tb = Date.parse(b.created_at);
  if (ta !== tb) return tb - ta;
  return b.id - a.id;
}

/**
 * Mescla um evento novo (ex.: vindo do Supabase Realtime) na lista do feed
 * (SUB-35.14). Ignora `id` já presente (devolve a mesma lista), mantém a ordem
 * por `created_at` desc (eventos atrasados entram na posição certa) e corta em
 * `max`. Não altera a lista recebida.
 */
export function mesclarEvento(lista: readonly AgentEvent[], novo: AgentEvent, max = 200): AgentEvent[] {
  if (lista.some((e) => e.id === novo.id)) return lista as AgentEvent[];
  const limite = Math.max(0, Math.floor(max));
  const i = lista.findIndex((e) => maisRecentePrimeiro(novo, e) < 0);
  const mesclada = i === -1 ? [...lista, novo] : [...lista.slice(0, i), novo, ...lista.slice(i)];
  return mesclada.length > limite ? mesclada.slice(0, limite) : mesclada;
}

export type EstadoAgente = 'ativo' | 'ocioso' | 'sem_sinal' | 'finalizado';

export interface LimitesEstadoAgente {
  /** Até quantos segundos desde o último sinal o agente conta como ativo (padrão 120). */
  ativoAteSeg?: number;
  /** Até quantos segundos conta como ocioso; acima disso, sem sinal (padrão 900). */
  ociosoAteSeg?: number;
}

/** Tipos de evento que encerram o trabalho do agente. */
const TIPOS_FINAIS: readonly TipoEventoAgente[] = ['fim', 'liberacao'];

/**
 * Estado do agente para exibição no monitor (SUB-35.15), a partir do último
 * `tipo` e do sinal mais recente (`ultimo_em` ou `ultimo_heartbeat_em`):
 * `finalizado` se o último evento foi `fim`/`liberacao`; senão `ativo` até
 * `ativoAteSeg`, `ocioso` até `ociosoAteSeg` e `sem_sinal` depois (ou sem data
 * válida). **Só exibição:** não sugere nem libera travas.
 */
export function estadoDoAgente(
  atividade: Pick<AtividadeAgente, 'tipo' | 'ultimo_em' | 'ultimo_heartbeat_em'>,
  agora: number = Date.now(),
  { ativoAteSeg = 120, ociosoAteSeg = 900 }: LimitesEstadoAgente = {},
): EstadoAgente {
  if (TIPOS_FINAIS.includes(atividade.tipo)) return 'finalizado';
  const sinais = [atividade.ultimo_em, atividade.ultimo_heartbeat_em]
    .map((d) => (d ? Date.parse(d) : NaN))
    .filter((t) => Number.isFinite(t));
  if (sinais.length === 0) return 'sem_sinal';
  const idadeSeg = Math.max(0, (agora - Math.max(...sinais)) / 1000);
  if (idadeSeg <= ativoAteSeg) return 'ativo';
  if (idadeSeg <= ociosoAteSeg) return 'ocioso';
  return 'sem_sinal';
}
