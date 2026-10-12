/**
 * Serviço dos eventos dos agentes (SUB-35): tabela `agent_events` do projeto
 * selecionado, para o monitor em tempo real. A interface só lê (a RLS libera a
 * leitura para membros do projeto); quem grava são o worker, a ferramenta MCP
 * `agent_event` e o espelho do quadro.
 */
import type { AgentEvent, AtividadeAgente } from '@/types';
import { getSupabase, resultado, ServiceError, type DashboardClient } from './supabase';

export interface FiltroEventos {
  /** ISO 8601: só eventos a partir desta data/hora (inclusive). */
  desde?: string;
  /** Só eventos deste agente (nome exato). */
  agente?: string;
  /** Máximo de eventos (padrão 200, entre 1 e 1000). */
  limite?: number;
}

/** Eventos do projeto, mais recentes primeiro (`created_at` desc, depois `id` desc). */
export async function listarEventos(
  projectId: number,
  filtro: FiltroEventos = {},
  client: DashboardClient = getSupabase(),
): Promise<AgentEvent[]> {
  if (filtro.desde && Number.isNaN(Date.parse(filtro.desde))) throw new ServiceError('Data inválida em "desde".');
  const limite = Math.min(Math.max(Math.trunc(filtro.limite ?? 200), 1), 1000);
  let q = client.from('agent_events').select('*').eq('project_id', projectId);
  if (filtro.desde) q = q.gte('created_at', filtro.desde);
  if (filtro.agente?.trim()) q = q.eq('agente', filtro.agente.trim());
  const res = await q.order('created_at', { ascending: false }).order('id', { ascending: false }).limit(limite);
  return resultado(res, 'Listar eventos');
}

/**
 * Atividade atual de cada agente do projeto (último evento + último heartbeat),
 * via RPC `atividade_atual_agentes`, ordenada por `ultimo_em` desc.
 */
export async function atividadeAtual(
  projectId: number,
  client: DashboardClient = getSupabase(),
): Promise<AtividadeAgente[]> {
  const res = await client.rpc('atividade_atual_agentes', { p_project_id: projectId });
  const lista = resultado(res, 'Atividade dos agentes') ?? [];
  return [...lista].sort((a, b) => Date.parse(b.ultimo_em) - Date.parse(a.ultimo_em));
}
