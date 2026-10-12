import type { AgentEvent } from '@/types/database';

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
