/**
 * Serviço do histórico do agendador (SUB-11): tabela `agendamento_tarefa_logs`
 * do projeto selecionado. Somente leitura na interface (quem grava são as funções
 * da fila no servidor); a RLS libera a leitura para membros do projeto.
 */
import type { AgendamentoLog, LogStatus } from '@/types';
import { LOG_STATUS } from '@/types';
import { getSupabase, resultado, ServiceError, type DashboardClient } from './supabase';

export interface FiltroLogs {
  status?: LogStatus | LogStatus[];
  rotina?: string;
  agente?: string;
  /** Código da task (ex.: APP-0012). */
  taskCodigo?: string;
  /** ISO 8601: só execuções a partir de/até esta data/hora. */
  desde?: string;
  ate?: string;
  /** Busca textual em detalhes, erro e código da task. */
  busca?: string;
  /** Página (0 = primeira) e tamanho (padrão 50, máximo 500). */
  pagina?: number;
  porPagina?: number;
}

export interface PaginaLogs {
  logs: AgendamentoLog[];
  total: number;
  pagina: number;
  porPagina: number;
}

const escapar = (t: string) => t.trim().replace(/[\\%_]/g, (c) => `\\${c}`).replace(/[,()*]/g, ' ');

function validarDatas(f: { desde?: string; ate?: string }) {
  for (const [nome, v] of [['desde', f.desde], ['ate', f.ate]] as const) {
    if (v && Number.isNaN(Date.parse(v))) throw new ServiceError(`Data inválida em "${nome}".`);
  }
}

/** Histórico do projeto, mais recente primeiro (data_hora desc), paginado e com total. */
export async function listarLogs(projectId: number, filtro: FiltroLogs = {}, client: DashboardClient = getSupabase()): Promise<PaginaLogs> {
  validarDatas(filtro);
  const porPagina = Math.min(Math.max(filtro.porPagina ?? 50, 1), 500);
  const pagina = Math.max(filtro.pagina ?? 0, 0);
  let q = client.from('agendamento_tarefa_logs').select('*', { count: 'exact' }).eq('project_id', projectId);
  if (filtro.status) {
    const lista = Array.isArray(filtro.status) ? filtro.status : [filtro.status];
    if (lista.length) q = q.in('status', lista);
  }
  if (filtro.rotina?.trim()) q = q.eq('rotina', filtro.rotina.trim());
  if (filtro.agente?.trim()) q = q.eq('agente', filtro.agente.trim());
  if (filtro.taskCodigo?.trim()) q = q.eq('task_codigo', filtro.taskCodigo.trim());
  if (filtro.desde) q = q.gte('data_hora', filtro.desde);
  if (filtro.ate) q = q.lte('data_hora', filtro.ate);
  if (filtro.busca?.trim()) {
    const t = escapar(filtro.busca);
    q = q.or(`detalhes.ilike.*${t}*,erro_mensagem.ilike.*${t}*,task_codigo.ilike.*${t}*`);
  }
  const res = await q
    .order('data_hora', { ascending: false })
    .order('id', { ascending: false })
    .range(pagina * porPagina, pagina * porPagina + porPagina - 1);
  const logs = resultado(res, 'Listar logs');
  return { logs, total: res.count ?? logs.length, pagina, porPagina };
}

export type ContadoresLogs = Record<LogStatus, number> & { total: number };

/** Contadores por status no período (consulta só as contagens, sem trazer as linhas). */
export async function contarLogsPorStatus(
  projectId: number,
  periodo: { desde?: string; ate?: string } = {},
  client: DashboardClient = getSupabase(),
): Promise<ContadoresLogs> {
  validarDatas(periodo);
  const contagens = await Promise.all(
    LOG_STATUS.map(async (status) => {
      let q = client
        .from('agendamento_tarefa_logs')
        .select('id', { count: 'exact', head: true })
        .eq('project_id', projectId)
        .eq('status', status);
      if (periodo.desde) q = q.gte('data_hora', periodo.desde);
      if (periodo.ate) q = q.lte('data_hora', periodo.ate);
      const res = await q;
      resultado(res, 'Contar logs');
      return [status, res.count ?? 0] as const;
    }),
  );
  const out = Object.fromEntries(contagens) as Record<LogStatus, number>;
  return { ...out, total: contagens.reduce((s, [, n]) => s + n, 0) };
}

/** Última execução registrada no projeto (para o indicador "Última execução da IA"). */
export async function ultimaExecucao(projectId: number, client: DashboardClient = getSupabase()): Promise<AgendamentoLog | null> {
  return resultado(
    await client
      .from('agendamento_tarefa_logs')
      .select('*')
      .eq('project_id', projectId)
      .order('data_hora', { ascending: false })
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle(),
    'Última execução',
  );
}

/** Rotinas e agentes distintos dos logs recentes (para os filtros da tela). */
export async function opcoesDeFiltro(projectId: number, client: DashboardClient = getSupabase()): Promise<{ rotinas: string[]; agentes: string[] }> {
  const linhas = resultado(
    await client
      .from('agendamento_tarefa_logs')
      .select('rotina,agente')
      .eq('project_id', projectId)
      .order('data_hora', { ascending: false })
      .limit(1000),
    'Opções de filtro',
  );
  const unicos = (xs: (string | null)[]) => [...new Set(xs.filter((x): x is string => Boolean(x)))].sort();
  return { rotinas: unicos(linhas.map((l) => l.rotina)), agentes: unicos(linhas.map((l) => l.agente)) };
}
