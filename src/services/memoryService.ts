/**
 * Serviço da memória persistente (SUB-10): memórias do projeto selecionado e
 * memórias globais (project_id nulo, compartilhadas entre projetos).
 *
 * RLS: viewer lê o projeto (e as globais); editor grava/exclui no projeto; só
 * administrador grava/exclui memórias globais.
 *
 * Embeddings: o navegador não tem chave de API de embeddings. A busca semântica
 * recebe um `GeradorEmbedding` (ex.: endpoint do servidor) — sem ele, `buscarMemorias`
 * faz busca textual. `salvarMemoria` grava o embedding quando o gerador é informado;
 * caso contrário a memória fica sem vetor (o MCP `brain_store` grava com vetor).
 */
import type { AiMemory, AiMemoryInsert, MemoryMatch } from '@/types';
import { getSupabase, resultado, ServiceError, type DashboardClient } from './supabase';

export const DIMENSOES_EMBEDDING = 1536;

/** Função que transforma texto em vetor de 1536 dimensões. */
export type GeradorEmbedding = (texto: string) => Promise<number[]>;

/** Memória sem o vetor (o que a interface exibe). */
export type Memoria = Omit<AiMemory, 'embedding'> & { tem_embedding?: boolean };

const COLUNAS = 'id,project_id,title,content,tags,criado_por,created_at,updated_at';

const vetor = (v: number[]) => {
  if (v.length !== DIMENSOES_EMBEDDING || v.some((x) => !Number.isFinite(x))) {
    throw new ServiceError(`Embedding inválido: esperado vetor com ${DIMENSOES_EMBEDDING} números.`);
  }
  return `[${v.join(',')}]`;
};

const normalizarTags = (tags?: string[]) =>
  [...new Set((tags ?? []).map((t) => t.trim().toLowerCase()).filter(Boolean))];

export interface FiltroMemorias {
  /** Incluir memórias globais (padrão true). */
  incluirGlobais?: boolean;
  /** Só memórias com todas estas tags. */
  tags?: string[];
  /** Busca textual em título e conteúdo. */
  busca?: string;
  limite?: number;
}

/** Memórias do projeto (e globais), mais recentes primeiro. */
export async function listarMemorias(projectId: number, filtro: FiltroMemorias = {}, client: DashboardClient = getSupabase()): Promise<Memoria[]> {
  let q = client.from('ai_memories').select(COLUNAS);
  q = filtro.incluirGlobais === false ? q.eq('project_id', projectId) : q.or(`project_id.eq.${projectId},project_id.is.null`);
  const tags = normalizarTags(filtro.tags);
  if (tags.length) q = q.contains('tags', tags);
  if (filtro.busca?.trim()) {
    const t = filtro.busca.trim().replace(/[\\%_]/g, (c) => `\\${c}`).replace(/[,()*]/g, ' ');
    q = q.or(`title.ilike.*${t}*,content.ilike.*${t}*`);
  }
  return resultado(await q.order('updated_at', { ascending: false }).limit(filtro.limite ?? 200), 'Listar memórias');
}

export interface ContagemMemorias {
  projeto: number;
  globais: number;
  total: number;
}

/** Quantidade de memórias do projeto e globais (só contagens, sem trazer as linhas). */
export async function contarMemorias(projectId: number, client: DashboardClient = getSupabase()): Promise<ContagemMemorias> {
  const [doProjeto, globais] = await Promise.all([
    client.from('ai_memories').select('id', { count: 'exact', head: true }).eq('project_id', projectId),
    client.from('ai_memories').select('id', { count: 'exact', head: true }).is('project_id', null),
  ]);
  resultado(doProjeto, 'Contar memórias');
  resultado(globais, 'Contar memórias globais');
  const projeto = doProjeto.count ?? 0;
  const g = globais.count ?? 0;
  return { projeto, globais: g, total: projeto + g };
}

export interface OpcoesBusca {
  /** Similaridade mínima de 0 a 1 (padrão 0.5). */
  limiar?: number;
  /** Máximo de resultados (padrão 10). */
  limite?: number;
  tags?: string[];
  incluirGlobais?: boolean;
}

/** Busca semântica por vetor (RPC match_memories), no projeto e nas globais. */
export async function buscarMemoriasSimilares(
  projetoSlug: string,
  embedding: number[],
  opcoes: OpcoesBusca = {},
  client: DashboardClient = getSupabase(),
): Promise<MemoryMatch[]> {
  const limiar = opcoes.limiar ?? 0.5;
  if (limiar < 0 || limiar >= 1) throw new ServiceError('O limiar de similaridade deve estar entre 0 e 1.');
  const tags = normalizarTags(opcoes.tags);
  return resultado(
    await client.rpc('match_memories', {
      query_embedding: vetor(embedding),
      match_threshold: limiar,
      match_count: Math.min(Math.max(opcoes.limite ?? 10, 1), 100),
      filter_tags: tags.length ? tags : null,
      p_projeto: projetoSlug,
      p_incluir_globais: opcoes.incluirGlobais ?? true,
    }),
    'Buscar memórias',
  );
}

export type ResultadoBusca =
  | { modo: 'semantica'; resultados: MemoryMatch[] }
  | { modo: 'texto'; resultados: Memoria[] };

/**
 * Busca a partir de texto: semântica se houver gerador de embeddings, senão textual.
 */
export async function buscarMemorias(
  projeto: { id: number; slug: string },
  consulta: string,
  opcoes: OpcoesBusca & { gerador?: GeradorEmbedding } = {},
  client: DashboardClient = getSupabase(),
): Promise<ResultadoBusca> {
  if (!consulta.trim()) throw new ServiceError('Digite algo para buscar.');
  if (opcoes.gerador) {
    const emb = await opcoes.gerador(consulta);
    return { modo: 'semantica', resultados: await buscarMemoriasSimilares(projeto.slug, emb, opcoes, client) };
  }
  return {
    modo: 'texto',
    resultados: await listarMemorias(
      projeto.id,
      { busca: consulta, tags: opcoes.tags, incluirGlobais: opcoes.incluirGlobais, limite: opcoes.limite ?? 10 },
      client,
    ),
  };
}

export interface DadosMemoria {
  title: string;
  content: string;
  tags?: string[];
}

/**
 * Grava (ou atualiza, pelo título) uma memória no projeto — ou global com
 * `projectId = null` (só administrador). Com `gerador`, grava também o embedding.
 */
export async function salvarMemoria(
  projectId: number | null,
  dados: DadosMemoria,
  opcoes: { gerador?: GeradorEmbedding } = {},
  client: DashboardClient = getSupabase(),
): Promise<Memoria> {
  const title = dados.title.trim();
  if (!title) throw new ServiceError('Informe o título da memória.');
  if (title.length > 200) throw new ServiceError('O título deve ter no máximo 200 caracteres.');
  if (!dados.content.trim()) throw new ServiceError('Informe o conteúdo da memória.');
  const linha: AiMemoryInsert = { project_id: projectId, title, content: dados.content, tags: normalizarTags(dados.tags) };
  if (opcoes.gerador) linha.embedding = vetor(await opcoes.gerador(`${title}\n\n${dados.content}`));
  return resultado(
    await client.from('ai_memories').upsert(linha, { onConflict: 'project_id,title' }).select(COLUNAS).single(),
    'Salvar memória',
  );
}

/** Exclui uma memória (do projeto, ou global se administrador). */
export async function excluirMemoria(id: string, client: DashboardClient = getSupabase()): Promise<void> {
  const linhas = resultado(await client.from('ai_memories').delete().eq('id', id).select('id'), 'Excluir memória');
  if (!linhas.length) throw new ServiceError('Memória não encontrada ou sem permissão para excluí-la.');
}
