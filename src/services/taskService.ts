/**
 * Serviço da fila de tasks do projeto selecionado (SUB-09).
 *
 * Tudo é filtrado por `project_id` e passa pela RLS (viewer lê; editor cria e edita;
 * sem DELETE — a exclusão é lógica). O banco protege a fila: a interface não coloca
 * nem tira tasks de `em_execucao`, não mexe em travas/tentativas (exceto zerar ao
 * reabrir) e só conclui tasks do tipo `humano`; essas recusas chegam como ServiceError.
 */
import type { Task, TaskInsert, TaskStatus, TaskUpdate } from '@/types';
import { getSupabase, resultado, ServiceError, type DashboardClient } from './supabase';

export interface FiltroTasks {
  /** Um ou mais status (padrão: todos). */
  status?: TaskStatus | TaskStatus[];
  /** Busca textual em código, título e instrução (sem diferenciar maiúsculas). */
  busca?: string;
  /** Incluir tasks excluídas logicamente (padrão false). */
  incluirExcluidas?: boolean;
  /** Máximo de linhas (padrão 500). */
  limite?: number;
}

/** Campos que a interface pode informar ao criar/editar (o resto é do banco ou da fila). */
export type DadosTask = Pick<TaskInsert, 'titulo' | 'instrucao'> &
  Partial<Pick<Task, 'tipo' | 'prioridade' | 'ordem' | 'dependencias' | 'executar' | 'executar_apos' | 'max_tentativas' | 'codigo'>>;

export type AlteracoesTask = Partial<Omit<DadosTask, 'codigo'>>;

const CAMPOS_EDITAVEIS = [
  'titulo', 'instrucao', 'tipo', 'prioridade', 'ordem', 'dependencias', 'executar', 'executar_apos', 'max_tentativas',
] as const;

/** Escapa curingas do PostgREST/ILIKE e caracteres que quebram o filtro `or=(...)`. */
function termoBusca(busca: string): string {
  return busca.trim().replace(/[\\%_]/g, (c) => `\\${c}`).replace(/[,()*]/g, ' ');
}

function validar(dados: AlteracoesTask): void {
  if (dados.titulo !== undefined && !dados.titulo.trim()) throw new ServiceError('Informe o título da task.');
  if (dados.instrucao !== undefined && !dados.instrucao.trim()) throw new ServiceError('Informe a instrução da task.');
  if (dados.prioridade !== undefined && (!Number.isInteger(dados.prioridade) || dados.prioridade < 1 || dados.prioridade > 5)) {
    throw new ServiceError('A prioridade deve ser um inteiro de 1 a 5.');
  }
  if (dados.max_tentativas !== undefined && (!Number.isInteger(dados.max_tentativas) || dados.max_tentativas < 1 || dados.max_tentativas > 20)) {
    throw new ServiceError('O máximo de tentativas deve ser de 1 a 20.');
  }
  if (dados.executar_apos && Number.isNaN(Date.parse(dados.executar_apos))) {
    throw new ServiceError('"Executar após" deve ser uma data/hora válida.');
  }
}

function soEditaveis(dados: AlteracoesTask): TaskUpdate {
  const out: Record<string, unknown> = {};
  for (const k of CAMPOS_EDITAVEIS) if (dados[k] !== undefined) out[k] = dados[k];
  if (typeof out.titulo === 'string') out.titulo = out.titulo.trim();
  if (Array.isArray(out.dependencias)) {
    out.dependencias = [...new Set((out.dependencias as string[]).map((d) => d.trim()).filter(Boolean))];
  }
  return out as TaskUpdate;
}

/** Tasks do projeto na ordem da fila: prioridade, ordem e criação. */
export async function listarTasks(projectId: number, filtro: FiltroTasks = {}, client: DashboardClient = getSupabase()): Promise<Task[]> {
  let q = client.from('tasks').select('*').eq('project_id', projectId);
  if (!filtro.incluirExcluidas) q = q.eq('excluido', false);
  if (filtro.status) {
    const lista = Array.isArray(filtro.status) ? filtro.status : [filtro.status];
    if (lista.length) q = q.in('status', lista);
  }
  if (filtro.busca?.trim()) {
    const t = termoBusca(filtro.busca);
    q = q.or(`codigo.ilike.*${t}*,titulo.ilike.*${t}*,instrucao.ilike.*${t}*`);
  }
  return resultado(
    await q
      .order('prioridade', { ascending: true })
      .order('ordem', { ascending: true })
      .order('created_at', { ascending: true })
      .order('id', { ascending: true })
      .limit(filtro.limite ?? 500),
    'Listar tasks',
  );
}

/** Uma task pelo id (dentro do projeto). */
export async function obterTask(projectId: number, id: number, client: DashboardClient = getSupabase()): Promise<Task> {
  return resultado(await client.from('tasks').select('*').eq('project_id', projectId).eq('id', id).single(), 'Carregar task');
}

/** Cria uma task pendente no projeto (o código `<PREFIXO>-NNNN` é gerado pelo banco se omitido). */
export async function criarTask(projectId: number, dados: DadosTask, client: DashboardClient = getSupabase()): Promise<Task> {
  validar(dados);
  const insert: TaskInsert = {
    ...soEditaveis(dados),
    titulo: dados.titulo.trim(),
    instrucao: dados.instrucao,
    project_id: projectId,
    origem: 'ui',
    status: 'pendente',
    ...(dados.codigo?.trim() ? { codigo: dados.codigo.trim() } : {}),
  };
  return resultado(await client.from('tasks').insert(insert).select().single(), 'Criar task');
}

async function alterar(projectId: number, id: number, campos: TaskUpdate, contexto: string, client: DashboardClient): Promise<Task> {
  return resultado(
    await client.from('tasks').update(campos).eq('project_id', projectId).eq('id', id).select().single(),
    contexto,
  );
}

/** Edita os campos editáveis da task (título, instrução, prioridade, ordem, dependências...). */
export async function atualizarTask(projectId: number, id: number, dados: AlteracoesTask, client: DashboardClient = getSupabase()): Promise<Task> {
  validar(dados);
  const campos = soEditaveis(dados);
  if (!Object.keys(campos).length) throw new ServiceError('Nada para atualizar.');
  return alterar(projectId, id, campos, 'Atualizar task', client);
}

/** Liga/desliga a task na fila (chave ON/OFF). */
export async function alternarExecucao(projectId: number, id: number, executar: boolean, client: DashboardClient = getSupabase()): Promise<Task> {
  return alterar(projectId, id, { executar }, executar ? 'Ligar task' : 'Desligar task', client);
}

/** Cancela a task (não pode estar em execução). */
export async function cancelarTask(projectId: number, id: number, client: DashboardClient = getSupabase()): Promise<Task> {
  return alterar(projectId, id, { status: 'cancelada' }, 'Cancelar task', client);
}

/** Reabre uma task recusada, com erro, cancelada ou concluída: volta a pendente e zera as tentativas. */
export async function reabrirTask(projectId: number, id: number, client: DashboardClient = getSupabase()): Promise<Task> {
  return alterar(projectId, id, { status: 'pendente', tentativas: 0, executar: true }, 'Reabrir task', client);
}

/** Conclui uma task do tipo `humano` (aprovação, teste manual...), com relatório opcional. */
export async function concluirTaskHumana(projectId: number, id: number, relatorio?: string, client: DashboardClient = getSupabase()): Promise<Task> {
  return alterar(projectId, id, { status: 'concluida', ...(relatorio ? { resultado: relatorio } : {}) }, 'Concluir task', client);
}

/** Exclusão lógica (some da fila e é desligada; pode ser restaurada). */
export async function excluirTaskLogico(projectId: number, id: number, client: DashboardClient = getSupabase()): Promise<Task> {
  return alterar(projectId, id, { excluido: true }, 'Excluir task', client);
}

/** Desfaz a exclusão lógica (a task volta desligada; ligue com alternarExecucao). */
export async function restaurarTask(projectId: number, id: number, client: DashboardClient = getSupabase()): Promise<Task> {
  return alterar(projectId, id, { excluido: false }, 'Restaurar task', client);
}

/** Contagem de tasks (não excluídas) por status, para indicadores. */
export async function contarTasksPorStatus(projectId: number, client: DashboardClient = getSupabase()): Promise<Record<TaskStatus, number>> {
  const linhas = resultado(
    await client.from('tasks').select('status').eq('project_id', projectId).eq('excluido', false),
    'Contar tasks',
  );
  const total: Record<TaskStatus, number> = { pendente: 0, em_execucao: 0, concluida: 0, recusada: 0, erro: 0, cancelada: 0 };
  for (const { status } of linhas) total[status] += 1;
  return total;
}
