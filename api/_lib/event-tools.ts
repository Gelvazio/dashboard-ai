/**
 * Ferramenta MCP `agent_event` (SUB-35.40): agentes fora do worker LangGraph
 * (Claude Code, Codex, Grok…) reportam o próprio progresso para o monitor em
 * tempo real, gravando uma linha em `public.agent_events` (database/07).
 *
 *   agent_event -> insere um evento (início, progresso, fim, erro, heartbeat,
 *                  trava, liberação ou commit) no projeto
 *
 * Projeto: argumento `project` (slug) > MCP_DEFAULT_PROJECT > `default`, sempre
 * dentro de MCP_ALLOWED_PROJECTS quando definido. Como as demais ferramentas de
 * dados, exige MCP_AUTH_TOKEN (o servidor usa a service_role). Com
 * `chave_idempotencia`, repetir o envio não duplica o evento (unique por projeto).
 */
import { registerTool, type CallToolResult } from './tools.js';
import { db, unwrap } from './supabase.js';
import { PROJECT_PROP, guard, json, oneOf, projectId, resolveProject, str } from './args.js';

export const TIPOS_EVENTO = ['inicio', 'progresso', 'fim', 'erro', 'heartbeat', 'trava', 'liberacao', 'commit'] as const;
export type TipoEvento = (typeof TIPOS_EVENTO)[number];

interface EventRow {
  id: number;
  tipo: TipoEvento;
  agente: string;
  task_codigo: string | null;
  created_at: string;
}

/** Valida os argumentos e monta a linha de `agent_events` (sem `project_id`). */
export function montarEvento(args: Record<string, unknown>) {
  const agente = str(args, 'agente', { required: true, max: 120 })!;
  const tipo = oneOf(str(args, 'tipo', { required: true }), TIPOS_EVENTO, 'tipo')!;
  const evento: Record<string, unknown> = { agente, tipo };
  const taskCodigo = str(args, 'task_codigo', { max: 60 });
  if (taskCodigo) evento.task_codigo = taskCodigo;
  const etapa = str(args, 'etapa', { max: 120 });
  if (etapa) evento.etapa = etapa;
  const status = str(args, 'status', { max: 60 });
  if (status) evento.status = status;
  const mensagem = str(args, 'mensagem', { max: 2000 });
  if (mensagem) evento.mensagem = mensagem;
  const chave = str(args, 'chave_idempotencia', { max: 200 });
  if (chave) evento.chave_idempotencia = chave;
  return evento;
}

// ----------------------------------------------------------------- agent_event
export async function agentEvent(args: Record<string, unknown>): Promise<CallToolResult> {
  const evento = montarEvento(args);
  const slug = resolveProject(args.project) ?? 'default';
  const row: Record<string, unknown> = { ...evento, project_id: await projectId(slug) };
  const cols = 'id,tipo,agente,task_codigo,created_at';

  let inseridos: EventRow[];
  if (row.chave_idempotencia) {
    // Reenvio com a mesma chave: ignora em silêncio (nenhuma linha devolvida).
    inseridos = unwrap<EventRow[]>(
      await db()
        .from('agent_events')
        .upsert(row, { onConflict: 'project_id,chave_idempotencia', ignoreDuplicates: true })
        .select(cols),
    );
  } else {
    inseridos = unwrap<EventRow[]>(await db().from('agent_events').insert(row).select(cols));
  }

  const e = inseridos[0];
  if (!e) {
    return json({
      event: null,
      project: slug,
      duplicate: true,
      message: `Evento com chave_idempotencia "${String(row.chave_idempotencia)}" já registrado no projeto ${slug}.`,
    });
  }
  return json({
    event: e,
    project: slug,
    duplicate: false,
    message: `Evento ${e.tipo} de "${e.agente}" registrado no projeto ${slug}${e.task_codigo ? ` (${e.task_codigo})` : ''}.`,
  });
}

// ----------------------------------------------------------------- registro
registerTool({
  name: 'agent_event',
  description:
    'Registra um evento do agente no monitor em tempo real do projeto (início/fim de etapa, progresso, erro, ' +
    'heartbeat, trava, liberação ou commit). Use chave_idempotencia para que reenvios não dupliquem o evento.',
  inputSchema: {
    type: 'object',
    properties: {
      project: PROJECT_PROP,
      agente: { type: 'string', maxLength: 120, description: 'Quem emite (ex.: "Claude Code").' },
      tipo: { type: 'string', enum: [...TIPOS_EVENTO] },
      task_codigo: { type: 'string', description: 'Código da task/subtarefa (ex.: "SUB-35.40"), se houver.' },
      etapa: { type: 'string', maxLength: 120, description: 'Passo ou etapa atual (ex.: "testes").' },
      status: { type: 'string', description: 'Status livre informado pelo agente (ex.: "ok", "falhou").' },
      mensagem: { type: 'string', maxLength: 2000, description: 'Resumo legível do evento.' },
      chave_idempotencia: {
        type: 'string',
        maxLength: 200,
        description: 'Identificador único do evento no projeto (ex.: "git:<sha>"); reenvios com a mesma chave são ignorados.',
      },
    },
    required: ['agente', 'tipo'],
  },
  handler: guard(agentEvent),
});
