/**
 * Geração de embeddings para a memória (SUB-07) via API compatível com a OpenAI
 * (`POST /v1/embeddings`), usando o `fetch` nativo — sem dependências.
 *
 * Variáveis:
 *   OPENAI_API_KEY      chave da API (obrigatória)
 *   EMBEDDING_MODEL     modelo (padrão text-embedding-3-small)
 *   EMBEDDING_API_URL   endpoint compatível (padrão https://api.openai.com/v1/embeddings)
 *
 * A coluna ai_memories.embedding é vector(1536); vetores de outro tamanho são recusados.
 */
export const EMBEDDING_DIMENSIONS = 1536;
const DEFAULT_URL = 'https://api.openai.com/v1/embeddings';
const DEFAULT_MODEL = 'text-embedding-3-small';
/** ~8k tokens do modelo; corta o texto com folga para não estourar o limite. */
const MAX_INPUT_CHARS = 24_000;

export class EmbeddingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmbeddingError';
  }
}

export async function generateEmbedding(text: string, env: NodeJS.ProcessEnv = process.env): Promise<number[]> {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) throw new EmbeddingError('Servidor sem OPENAI_API_KEY: não é possível gerar embeddings.');
  const model = env.EMBEDDING_MODEL?.trim() || DEFAULT_MODEL;
  const url = env.EMBEDDING_API_URL?.trim() || DEFAULT_URL;

  const body: Record<string, unknown> = { input: text.slice(0, MAX_INPUT_CHARS), model };
  // Só os modelos text-embedding-3-* aceitam reduzir/fixar a dimensão.
  if (model.startsWith('text-embedding-3')) body.dimensions = EMBEDDING_DIMENSIONS;

  let resp: Response;
  try {
    resp = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20_000),
    });
  } catch (err) {
    throw new EmbeddingError(`Falha ao chamar a API de embeddings: ${(err as Error).message}`);
  }
  const data = (await resp.json().catch(() => null)) as
    | { data?: { embedding?: unknown }[]; error?: { message?: string } }
    | null;
  if (!resp.ok) {
    throw new EmbeddingError(`API de embeddings respondeu ${resp.status}: ${data?.error?.message ?? resp.statusText}`);
  }
  const vec = data?.data?.[0]?.embedding;
  if (!Array.isArray(vec) || vec.some((x) => typeof x !== 'number' || !Number.isFinite(x))) {
    throw new EmbeddingError('Resposta da API de embeddings sem vetor válido.');
  }
  if (vec.length !== EMBEDDING_DIMENSIONS) {
    throw new EmbeddingError(
      `Embedding com ${vec.length} dimensões; a coluna espera ${EMBEDDING_DIMENSIONS} (ajuste EMBEDDING_MODEL).`,
    );
  }
  return vec as number[];
}

/** Formato literal do pgvector ("[0.1,0.2,...]"), aceito pelo PostgREST em colunas e RPCs. */
export const toPgVector = (vec: number[]) => `[${vec.join(',')}]`;
