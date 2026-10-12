/**
 * Gerador de embeddings do navegador (SUB-33): chama `POST /api/embedding` no
 * servidor com o JWT do usuário logado. A chave do provedor de embeddings fica
 * só no servidor; o frontend nunca a conhece.
 */
import { DIMENSOES_EMBEDDING, type GeradorEmbedding } from './memoryService';
import { getSupabase, ServiceError, type DashboardClient } from './supabase';

export interface OpcoesGeradorEmbedding {
  /** Endpoint do servidor (padrão `/api/embedding`, mesma origem). */
  url?: string;
  /** Cliente Supabase (padrão: o cliente da aplicação). */
  client?: DashboardClient;
}

/** Cria um `GeradorEmbedding` que usa o endpoint autenticado do servidor. */
export function criarGeradorEmbedding(opcoes: OpcoesGeradorEmbedding = {}): GeradorEmbedding {
  const url = opcoes.url ?? '/api/embedding';

  return async (texto: string) => {
    const client = opcoes.client ?? getSupabase();
    const { data, error } = await client.auth.getSession();
    const token = data.session?.access_token;
    if (error || !token) throw new ServiceError('Faça login para usar a busca semântica.', 'SEM_SESSAO');

    let resp: Response;
    try {
      resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ texto }),
      });
    } catch {
      throw new ServiceError('Não foi possível contatar o servidor de embeddings.', 'REDE');
    }

    const corpo = (await resp.json().catch(() => null)) as { embedding?: unknown; erro?: unknown } | null;
    if (resp.status === 401) throw new ServiceError('Faça login para usar a busca semântica.', 'SEM_SESSAO');
    if (!resp.ok) {
      const msg = typeof corpo?.erro === 'string' ? corpo.erro : `Falha ao gerar o embedding (HTTP ${resp.status}).`;
      throw new ServiceError(msg, `HTTP_${resp.status}`);
    }

    const vetor = corpo?.embedding;
    if (
      !Array.isArray(vetor) ||
      vetor.length !== DIMENSOES_EMBEDDING ||
      vetor.some((x) => typeof x !== 'number' || !Number.isFinite(x))
    ) {
      throw new ServiceError(`Embedding inválido: esperado vetor com ${DIMENSOES_EMBEDDING} números.`, 'VETOR_INVALIDO');
    }
    return vetor as number[];
  };
}
