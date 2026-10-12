/**
 * POST /api/embedding — gera o embedding de um texto no servidor, para o
 * navegador nunca precisar da chave do provedor (SUB-33).
 *
 * CORS, OPTIONS e 405 (SUB-33.4); autenticação com sessão do Supabase (SUB-33.10).
 * A geração do embedding (SUB-33.11) substitui o 501 provisório abaixo.
 */
import { AuthError, bearerToken, verificarSessaoSupabase } from './_lib/auth.js';
import type { McpRequest, McpResponse } from './_lib/http.js';

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

  // Provisório até a SUB-33.11.
  return res.status(501).json({ erro: 'Geração de embedding ainda não disponível.' });
}
