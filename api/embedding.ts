/**
 * POST /api/embedding — gera o embedding de um texto no servidor, para o
 * navegador nunca precisar da chave do provedor (SUB-33).
 *
 * CORS, OPTIONS e 405 (SUB-33.4); autenticação com sessão do Supabase (SUB-33.10);
 * corpo `{ texto }` -> 200 `{ embedding, dimensoes, modelo }`, 400/413/502 (SUB-33.11).
 */
import { AuthError, bearerToken, verificarSessaoSupabase } from './_lib/auth.js';
import { lerTextoEmbedding } from './_lib/embedding-input.js';
import { EMBEDDING_DIMENSIONS, EmbeddingError, generateEmbedding } from './_lib/embeddings.js';
import type { McpRequest, McpResponse } from './_lib/http.js';
import { HttpError } from './_lib/http-error.js';

function setCors(res: McpResponse): void {
  res.setHeader('Access-Control-Allow-Origin', process.env.MCP_CORS_ORIGIN ?? '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req: McpRequest, res: McpResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ erro: 'Apenas requisições POST são aceitas.' });
  }

  // Autenticação: só usuários com sessão válida do Supabase Auth (SUB-33.10).
  const token = bearerToken(req.headers);
  let sessao: { userId: string } | null = null;
  if (token) {
    try {
      sessao = await verificarSessaoSupabase(token);
    } catch (err) {
      if (err instanceof AuthError) {
        return res.status(503).json({ erro: 'Serviço de autenticação indisponível. Tente novamente.' });
      }
      throw err;
    }
  }
  if (!sessao) {
    res.setHeader('WWW-Authenticate', 'Bearer');
    return res.status(401).json({ erro: 'Não autorizado: faça login novamente.' });
  }

  // Corpo e geração do embedding (SUB-33.11).
  try {
    const texto = lerTextoEmbedding(req.body);
    const embedding = await generateEmbedding(texto);
    const modelo = process.env.EMBEDDING_MODEL?.trim() || 'text-embedding-3-small';
    return res.status(200).json({ embedding, dimensoes: EMBEDDING_DIMENSIONS, modelo });
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ erro: err.message });
    }
    if (err instanceof EmbeddingError) {
      // A mensagem do provedor pode ecoar parte da chave: nunca devolvê-la ao cliente.
      return res.status(502).json({ erro: 'Falha ao gerar o embedding no provedor configurado.' });
    }
    throw err;
  }
}
