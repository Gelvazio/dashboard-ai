/**
 * Primitivas de memória persistente do MCP (SUB-07), com escopo por projeto:
 *
 *   brain_store   -> grava/atualiza uma memória (upsert por projeto + título) com embedding
 *   brain_search  -> busca semântica (RPC match_memories): memórias do projeto + globais
 *   brain_delete  -> remove uma memória pelo título (ou id) no projeto
 *
 * Projeto: argumento `project` (slug) > MCP_DEFAULT_PROJECT > `default`.
 * Memória global (project_id nulo, compartilhada por todos os projetos): `global: true`
 * em brain_store/brain_delete — só permitida quando o servidor não está restrito por
 * MCP_ALLOWED_PROJECTS. Como as demais ferramentas de dados, exige MCP_AUTH_TOKEN.
 */
import { registerTool, type CallToolResult } from './tools.js';
import { rest, rpc } from './supabase.js';
import { generateEmbedding, toPgVector } from './embeddings.js';
import { PROJECT_PROP, ToolInputError, bool, guard, int, json, projectId, resolveProject, str, strList } from './args.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_TAGS = 20;

interface MemoryRow {
  id: string;
  project_id: number | null;
  title: string;
  content?: string;
  tags: string[];
  similarity?: number;
  updated_at: string;
}

/** Escopo da escrita: { slug, id } de um projeto ou memória global (id nulo). */
async function writeScope(args: Record<string, unknown>): Promise<{ slug: string | null; id: number | null }> {
  if (bool(args, 'global')) {
    if (args.project !== undefined && args.project !== null && args.project !== '') {
      throw new ToolInputError('Use "global" OU "project", não os dois.');
    }
    if ((process.env.MCP_ALLOWED_PROJECTS ?? '').trim()) {
      throw new ToolInputError('Memória global não permitida: este servidor é restrito por MCP_ALLOWED_PROJECTS.');
    }
    return { slug: null, id: null };
  }
  const slug = resolveProject(args.project) ?? 'default';
  return { slug, id: await projectId(slug) };
}

function tagList(args: Record<string, unknown>) {
  const tags = strList(args, 'tags')?.map((t) => t.toLowerCase());
  if (tags && tags.length > MAX_TAGS) throw new ToolInputError(`"tags" aceita no máximo ${MAX_TAGS} itens.`);
  if (tags?.some((t) => t.length > 60)) throw new ToolInputError('Cada tag deve ter no máximo 60 caracteres.');
  return tags;
}

// ----------------------------------------------------------------- brain_store
export async function brainStore(args: Record<string, unknown>): Promise<CallToolResult> {
  const title = str(args, 'title', { required: true, max: 200 })!;
  const content = str(args, 'content', { required: true, max: 100_000 })!;
  const tags = tagList(args) ?? [];
  const scope = await writeScope(args);
  const embedding = await generateEmbedding(`${title}\n\n${content}`);

  const rows = await rest<MemoryRow[]>('POST', 'ai_memories', {
    query: { on_conflict: 'project_id,title', select: 'id,project_id,title,tags,updated_at' },
    body: { project_id: scope.id, title, content, tags, embedding: toPgVector(embedding) },
    prefer: 'resolution=merge-duplicates,return=representation',
  });
  const m = rows[0];
  return json({
    memory: { id: m.id, title: m.title, tags: m.tags, updated_at: m.updated_at },
    project: scope.slug,
    scope: scope.id === null ? 'global' : 'project',
    message: `Memória "${m.title}" gravada${scope.slug ? ` no projeto ${scope.slug}` : ' como global'}.`,
  });
}

// ----------------------------------------------------------------- brain_search
export async function brainSearch(args: Record<string, unknown>): Promise<CallToolResult> {
  const query = str(args, 'query', { required: true, max: 8_000 })!;
  const slug = resolveProject(args.project) ?? 'default';
  await projectId(slug); // valida o projeto antes de gastar um embedding
  const tags = tagList(args);
  const limit = int(args, 'limit', 1, 20) ?? 5;
  const thr = args.threshold;
  if (thr !== undefined && (typeof thr !== 'number' || !Number.isFinite(thr) || thr < 0 || thr >= 1)) {
    throw new ToolInputError('"threshold" deve ser um número entre 0 e 1 (ex.: 0.5).');
  }
  const includeGlobal = bool(args, 'include_global') ?? true;
  const embedding = await generateEmbedding(query);

  const rows = await rpc<MemoryRow[]>('match_memories', {
    query_embedding: toPgVector(embedding),
    match_threshold: (thr as number | undefined) ?? 0.5,
    match_count: limit,
    filter_tags: tags?.length ? tags : null,
    p_projeto: slug,
    p_incluir_globais: includeGlobal,
  });
  const results = rows.map((m) => ({
    id: m.id,
    title: m.title,
    scope: m.project_id === null ? 'global' : 'project',
    similarity: Math.round((m.similarity ?? 0) * 1000) / 1000,
    tags: m.tags,
    content: m.content,
    updated_at: m.updated_at,
  }));
  return json({
    project: slug,
    count: results.length,
    results,
    message: results.length ? undefined : 'Nenhuma memória acima do limiar; tente outra consulta ou um threshold menor.',
  });
}

// ----------------------------------------------------------------- brain_delete
export async function brainDelete(args: Record<string, unknown>): Promise<CallToolResult> {
  const title = str(args, 'title', { max: 200 });
  const id = str(args, 'id', { max: 36 });
  if (!title && !id) throw new ToolInputError('Informe "title" ou "id" da memória.');
  if (id && !UUID_RE.test(id)) throw new ToolInputError('"id" deve ser um UUID.');
  const scope = await writeScope(args);

  const query: Record<string, string> = {
    project_id: scope.id === null ? 'is.null' : `eq.${scope.id}`,
    select: 'id,title',
  };
  if (title) query.title = `eq.${title}`;
  if (id) query.id = `eq.${id}`;
  const rows = await rest<MemoryRow[]>('DELETE', 'ai_memories', { query, prefer: 'return=representation' });
  const where = scope.slug ? `no projeto ${scope.slug}` : 'nas memórias globais';
  return json({
    deleted: rows.length,
    memories: rows.map((m) => ({ id: m.id, title: m.title })),
    message: rows.length ? `${rows.length} memória(s) removida(s) ${where}.` : `Nenhuma memória encontrada ${where}.`,
  });
}

// ----------------------------------------------------------------- registro
const GLOBAL_PROP = {
  type: 'boolean',
  description: 'true = memória global, compartilhada por todos os projetos (não combine com project).',
};
const TAGS_PROP = { type: 'array', items: { type: 'string' }, maxItems: MAX_TAGS };

registerTool({
  name: 'brain_store',
  description:
    'Grava na memória persistente uma decisão, regra ou aprendizado (Markdown). Se já existir memória com o ' +
    'mesmo título no projeto, ela é atualizada. Busque antes com brain_search para não duplicar.',
  inputSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'Título único e descritivo (chave da memória no projeto).' },
      content: { type: 'string', description: 'Conteúdo em Markdown.' },
      tags: { ...TAGS_PROP, description: 'Tags de categorização (ex.: ["arquitetura", "banco"]).' },
      project: PROJECT_PROP,
      global: GLOBAL_PROP,
    },
    required: ['title', 'content'],
  },
  handler: guard(brainStore),
});

registerTool({
  name: 'brain_search',
  description:
    'Busca semântica na memória do projeto (e nas memórias globais). Use antes de decidir ou implementar ' +
    'para reaproveitar decisões já registradas.',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Pergunta ou assunto em linguagem natural.' },
      project: PROJECT_PROP,
      tags: { ...TAGS_PROP, description: 'Só memórias que tenham todas estas tags.' },
      limit: { type: 'integer', minimum: 1, maximum: 20, description: 'Máximo de resultados (padrão 5).' },
      threshold: { type: 'number', minimum: 0, maximum: 1, description: 'Similaridade mínima (padrão 0.5).' },
      include_global: { type: 'boolean', description: 'Incluir memórias globais (padrão true).' },
    },
    required: ['query'],
  },
  handler: guard(brainSearch),
});

registerTool({
  name: 'brain_delete',
  description: 'Remove uma memória obsoleta pelo título (ou id) no projeto, ou nas memórias globais com global=true.',
  inputSchema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      id: { type: 'string', description: 'UUID da memória (alternativa ao título).' },
      project: PROJECT_PROP,
      global: GLOBAL_PROP,
    },
  },
  handler: guard(brainDelete),
});
