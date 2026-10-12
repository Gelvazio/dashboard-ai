import { TIPOS_EVENTO_AGENTE, type AgentEvent, type AtividadeAgente, type TipoEventoAgente } from '@/types/database';

export type EstadoAgente = 'ativo' | 'ocioso' | 'sem_sinal' | 'finalizado';

export interface LimitesEstadoAgente {
  /** Até quantos segundos desde o último sinal o agente conta como ativo (padrão 120). */
  ativoAteSeg?: number;
  /** Até quantos segundos conta como ocioso; acima disso, sem sinal (padrão 900). */
  ociosoAteSeg?: number;
}

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

/** Ordem fixa dos estados no gráfico de rosca (SUB-35.16). */
export const ORDEM_ESTADOS: readonly EstadoAgente[] = ['ativo', 'ocioso', 'sem_sinal', 'finalizado'];

/**
 * Conta os agentes por estado (`estadoDoAgente`) na ordem fixa de
 * `ORDEM_ESTADOS`, incluindo estados com zero, para o gráfico de rosca (SUB-35.16).
 */
export function contarPorStatus(
  atividades: readonly Pick<AtividadeAgente, 'tipo' | 'ultimo_em' | 'ultimo_heartbeat_em'>[],
  agora: number = Date.now(),
  limites: LimitesEstadoAgente = {},
): { estado: EstadoAgente; total: number }[] {
  const totais = new Map<EstadoAgente, number>(ORDEM_ESTADOS.map((e) => [e, 0]));
  for (const a of atividades) {
    const e = estadoDoAgente(a, agora, limites);
    totais.set(e, (totais.get(e) ?? 0) + 1);
  }
  return ORDEM_ESTADOS.map((estado) => ({ estado, total: totais.get(estado) ?? 0 }));
}

export interface ContagemAgente {
  agente: string;
  porTipo: Record<TipoEventoAgente, number>;
  total: number;
}

/**
 * Conta os eventos de cada agente por `tipo` (todos os tipos presentes, com
 * zero) para o gráfico de barras empilhadas (SUB-35.17). Ordena por total desc
 * e, no empate, pelo nome do agente.
 */
export function contarPorAgente(eventos: readonly Pick<AgentEvent, 'agente' | 'tipo'>[]): ContagemAgente[] {
  const mapa = new Map<string, ContagemAgente>();
  for (const e of eventos) {
    let c = mapa.get(e.agente);
    if (!c) {
      const porTipo = Object.fromEntries(TIPOS_EVENTO_AGENTE.map((t) => [t, 0])) as Record<TipoEventoAgente, number>;
      c = { agente: e.agente, porTipo, total: 0 };
      mapa.set(e.agente, c);
    }
    c.porTipo[e.tipo] = (c.porTipo[e.tipo] ?? 0) + 1;
    c.total += 1;
  }
  return [...mapa.values()].sort((a, b) => b.total - a.total || a.agente.localeCompare(b.agente, 'pt-BR'));
}

export interface SegmentoLinhaDoTempo {
  agente: string;
  etapa: string | null;
  inicio: number; // timestamp em ms
  fim: number; // timestamp em ms
  status: 'aberta' | 'concluida' | 'erro';
}

/**
 * Segmentos de linha do tempo para o monitor (SUB-35.18): une `inicio` e
 * `fim`/`erro` da mesma `execucao_id` + `etapa`; etapa ainda aberta termina em
 * `agora`.
 */
export function segmentosLinhaDoTempo(
  eventos: readonly { agente: string; execucao_id: string; etapa: string | null; tipo: string; created_at: string }[],
  agora: number = Date.now(),
): SegmentoLinhaDoTempo[] {
  const segmentos = new Map<string, SegmentoLinhaDoTempo>();
  for (const e of eventos) {
    const chave = `${e.agente}:${e.execucao_id}`;
    const inicioMs = Date.parse(e.created_at);
    if (Number.isNaN(inicioMs)) continue;

    if (e.tipo === 'inicio') {
      segmentos.set(chave, { agente: e.agente, etapa: e.etapa, inicio: inicioMs, fim: agora, status: 'aberta' });
    } else if (e.tipo === 'fim' || e.tipo === 'erro') {
      const s = segmentos.get(chave);
      if (s) {
        s.fim = inicioMs;
        s.status = e.tipo === 'fim' ? 'concluida' : 'erro';
      }
    }
  }
  return [...segmentos.values()];
}
