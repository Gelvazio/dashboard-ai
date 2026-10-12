/**
 * Ferramentas MCP da fila de tasks (SUB-30): agentes de QUALQUER projeto operam
 * a fila do Dashboard AI pelo MCP, sem acesso direto ao banco.
 *
 *   task_next    -> pega (e trava) a próxima task elegível   (RPC pegar_proxima_task)
 *   task_finish  -> encerra a task travada e grava o log     (RPC finalizar_task)
 *   task_list    -> lista as tasks de um projeto
 *   task_create  -> cria uma task (origem `mcp`)
 *
 * Projeto: argumento opcional `project` (slug); padrão MCP_DEFAULT_PROJECT.
 * Se MCP_ALLOWED_PROJECTS (slugs separados por vírgula) estiver definido, só
 * esses projetos são aceitos — útil para dar a um projeto um endpoint/token
 * próprio. Por segurança, as ferramentas da fila exigem MCP_AUTH_TOKEN definido
 * (o servidor usa a chave service_role).
 */
import { registerTool, type CallToolResult } from './tools.js';
import { rest, rpc } from './supabase.js';
import {
  PROJECT_PROP, ToolInputError, bool, guard, int, json, oneOf, projectId, resolveProject, str, strList,
} from './args.js';

const STATUS = ['pendente', 'em_execucao', 'concluida', 'recusada', 'erro', 'cancelada'] as const;
const FINAL_STATUS = ['concluida', 'recusada', 'erro'] as const;

interface TaskRow {
  id: number;
  project_id: number;
  codigo: string;
  titulo: string;
  instrucao: string;
  tipo: string;
  status: string;
  prioridade: number;
  ordem: number;
  dependencias: string[];
  executar: boolean;
  executar_apos: string | null;
  tentativas: number;
  max_tentativas: number;
  trava_frente: string | null;
  trava_em: string | null;
  resultado: string | null;
  pr_url: string | null;
  commit_sha: string | null;
  projects?: { slug: string } | null;
  [k: string]: unknown;
}


// ----------------------------------------------------------------- task_next
export async function taskNext(args: Record<string, unknown>): Promise<CallToolResult> {
  const agent = str(args, 'agent', { required: true, max: 120 })!;
  const project = resolveProject(args.project);
  const lockMinutes = int(args, 'lock_minutes', 1, 24 * 60) ?? 90;
  const exclusive = bool(args, 'exclusive') ?? false;
  const routine = str(args, 'routine', { max: 120 });

  const rows = await rpc<TaskRow[]>('pegar_proxima_task', {
    p_agente: agent,
    p_projeto: project ?? null,
    p_lock_minutos: lockMinutes,
    p_exclusivo: exclusive,
  });
  const task = rows?.[0];
  if (!task) {
    let logId: number | undefined;
    if (routine) {
      logId = await rpc<number>('registrar_execucao_sem_tarefa', {
        p_rotina: routine,
        p_agente: agent,
        p_projeto: project ?? null,
      });
    }
    return json({ task: null, message: 'Fila vazia: nenhuma task elegível.', project: project ?? null, log_id: logId ?? null });
  }
  return json({
    task,
    message:
      `Task ${task.codigo} travada para "${agent}" por ${lockMinutes} min. Execute a instrução e chame ` +
      `task_finish com task_id=${task.id} (status concluida, recusada ou erro).`,
  });
}

// ----------------------------------------------------------------- task_finish
export async function taskFinish(args: Record<string, unknown>): Promise<CallToolResult> {
  const taskId = int(args, 'task_id', 1, Number.MAX_SAFE_INTEGER, true)!;
  const status = oneOf(str(args, 'status', { required: true }), FINAL_STATUS, 'status')!;
  const meta = args.metadata;
  if (meta !== undefined && (typeof meta !== 'object' || meta === null || Array.isArray(meta))) {
    throw new ToolInputError('"metadata" deve ser um objeto.');
  }
  const task = await rpc<TaskRow>('finalizar_task', {
    p_task_id: taskId,
    p_status: status,
    p_resultado: str(args, 'result', { max: 50_000 }) ?? null,
    p_pr_url: str(args, 'pr_url', { max: 500 }) ?? null,
    p_commit_sha: str(args, 'commit_sha', { max: 64 }) ?? null,
    p_agente: str(args, 'agent', { max: 120 }) ?? null,
    p_rotina: str(args, 'routine', { max: 120 }) ?? null,
    p_metadados: meta ?? {},
  });
  return json({
    task: { id: task.id, codigo: task.codigo, status: task.status, tentativas: task.tentativas, log_id: task.log_id },
    message:
      status === 'erro' && task.status === 'pendente'
        ? `Task ${task.codigo} voltou para a fila (tentativa ${task.tentativas}/${task.max_tentativas}).`
        : `Task ${task.codigo} finalizada como ${task.status}.`,
  });
}

// ----------------------------------------------------------------- task_list
export async function taskList(args: Record<string, unknown>): Promise<CallToolResult> {
  const project = resolveProject(args.project);
  const statuses = strList(args, 'status');
  statuses?.forEach((s) => oneOf(s, STATUS, 'status'));
  const limit = int(args, 'limit', 1, 200) ?? 50;
  const includeInstruction = bool(args, 'include_instruction') ?? false;

  const cols = [
    'id', 'codigo', 'titulo', 'tipo', 'status', 'prioridade', 'ordem', 'dependencias', 'executar',
    'executar_apos', 'tentativas', 'max_tentativas', 'trava_frente', 'trava_em', 'pr_url', 'commit_sha',
    'updated_at', 'projects(slug)',
  ];
  if (includeInstruction) cols.push('instrucao', 'resultado');
  const query: Record<string, string> = {
    select: cols.join(','),
    excluido: 'eq.false',
    order: 'prioridade.asc,ordem.asc,created_at.asc,id.asc',
    limit: String(limit),
  };
  if (project) query.project_id = `eq.${await projectId(project)}`;
  if (statuses?.length) query.status = `in.(${statuses.join(',')})`;

  const rows = await rest<TaskRow[]>('GET', 'tasks', { query });
  const tasks = rows.map(({ projects, ...t }) => ({ project: projects?.slug ?? null, ...t }));
  return json({ project: project ?? null, count: tasks.length, tasks });
}

// ----------------------------------------------------------------- task_create
export async function taskCreate(args: Record<string, unknown>): Promise<CallToolResult> {
  const project = resolveProject(args.project);
  const body: Record<string, unknown> = {
    titulo: str(args, 'title', { required: true, max: 300 }),
    instrucao: str(args, 'instruction', { required: true, max: 50_000 }),
    origem: 'mcp',
  };
  const code = str(args, 'code', { max: 60 });
  if (code) body.codigo = code;
  const type = oneOf(str(args, 'type'), ['ia', 'humano'] as const, 'type');
  if (type) body.tipo = type;
  const priority = int(args, 'priority', 1, 5);
  if (priority !== undefined) body.prioridade = priority;
  const order = int(args, 'order', -1_000_000, 1_000_000);
  if (order !== undefined) body.ordem = order;
  const deps = strList(args, 'dependencies');
  if (deps) body.dependencias = deps;
  const execute = bool(args, 'execute');
  if (execute !== undefined) body.executar = execute;
  const after = str(args, 'execute_after', { max: 40 });
  if (after) {
    if (Number.isNaN(Date.parse(after))) throw new ToolInputError('"execute_after" deve ser uma data ISO 8601.');
    body.executar_apos = after;
  }
  const maxAttempts = int(args, 'max_attempts', 1, 20);
  if (maxAttempts !== undefined) body.max_tentativas = maxAttempts;
  if (project) body.project_id = await projectId(project);

  const rows = await rest<TaskRow[]>('POST', 'tasks', { body, prefer: 'return=representation' });
  const t = rows[0];
  return json({
    task: { id: t.id, codigo: t.codigo, titulo: t.titulo, tipo: t.tipo, status: t.status, prioridade: t.prioridade },
    project: project ?? 'default',
    message: `Task ${t.codigo} criada.`,
  });
}

// ----------------------------------------------------------------- registro
registerTool({
  name: 'task_next',
  description:
    'Pega e trava a próxima task elegível da fila (maior prioridade, dependências concluídas). ' +
    'Retorna a task com a instrução a executar, ou task=null se a fila estiver vazia. ' +
    'Ao terminar, chame task_finish com o task_id.',
  inputSchema: {
    type: 'object',
    properties: {
      agent: { type: 'string', description: 'Identificação do agente que vai executar (ex.: "Claude Code").' },
      project: PROJECT_PROP,
      lock_minutes: { type: 'integer', minimum: 1, maximum: 1440, description: 'Duração da trava (padrão 90).' },
      exclusive: { type: 'boolean', description: 'true = no máximo 1 task em execução por projeto (padrão false).' },
      routine: { type: 'string', description: 'Nome da rotina; com a fila vazia, registra um log sem_tarefa.' },
    },
    required: ['agent'],
  },
  handler: guard(taskNext),
});

registerTool({
  name: 'task_finish',
  description:
    'Finaliza uma task travada: concluida (feito), recusada (fere regra, ambígua ou precisa de decisão humana — ' +
    'explique em result) ou erro (falha técnica; volta para a fila se houver tentativas). Libera a trava e grava o log.',
  inputSchema: {
    type: 'object',
    properties: {
      task_id: { type: 'integer', description: 'id retornado por task_next.' },
      status: { type: 'string', enum: [...FINAL_STATUS] },
      result: { type: 'string', description: 'Relatório do que foi feito ou o motivo da recusa/erro.' },
      pr_url: { type: 'string' },
      commit_sha: { type: 'string' },
      agent: { type: 'string', description: 'Mesmo agente do task_next (confere o dono da trava).' },
      routine: { type: 'string', description: 'Nome da rotina/agendamento (padrão "agente").' },
      metadata: {
        type: 'object',
        description: 'Opcional: repositorio, branch, sessao_url, arquivos_alterados, erro_mensagem.',
      },
    },
    required: ['task_id', 'status'],
  },
  handler: guard(taskFinish),
});

registerTool({
  name: 'task_list',
  description: 'Lista as tasks (não excluídas) de um projeto, na ordem da fila, com filtro opcional de status.',
  inputSchema: {
    type: 'object',
    properties: {
      project: PROJECT_PROP,
      status: { type: 'array', items: { type: 'string', enum: [...STATUS] }, description: 'Filtrar por status.' },
      limit: { type: 'integer', minimum: 1, maximum: 200, description: 'Máximo de tasks (padrão 50).' },
      include_instruction: { type: 'boolean', description: 'Incluir instrução e resultado (padrão false).' },
    },
  },
  handler: guard(taskList),
});

registerTool({
  name: 'task_create',
  description:
    'Cria uma task na fila de um projeto. Use tipo "humano" para etapas de pessoas (aprovação, teste), ' +
    'que não são pegas por agentes. O código (<PREFIXO>-NNNN) é gerado se omitido.',
  inputSchema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      instruction: { type: 'string', description: 'Instrução completa em Markdown para quem executar.' },
      project: PROJECT_PROP,
      type: { type: 'string', enum: ['ia', 'humano'], description: 'Padrão "ia".' },
      priority: { type: 'integer', minimum: 1, maximum: 5, description: '1 = mais alta (padrão 3).' },
      order: { type: 'integer', description: 'Desempate dentro da prioridade (padrão 0).' },
      dependencies: { type: 'array', items: { type: 'string' }, description: 'Códigos de tasks do mesmo projeto.' },
      execute: { type: 'boolean', description: 'Chave ON/OFF (padrão true).' },
      execute_after: { type: 'string', description: 'Data/hora ISO 8601 a partir da qual pode ser pega.' },
      max_attempts: { type: 'integer', minimum: 1, maximum: 20 },
      code: { type: 'string', description: 'Código manual (opcional; único no projeto).' },
    },
    required: ['title', 'instruction'],
  },
  handler: guard(taskCreate),
});
