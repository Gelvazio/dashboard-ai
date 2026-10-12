/**
 * POST /api/embedding — gera o embedding de um texto no servidor, para o
 * navegador nunca precisar da chave do provedor (SUB-33).
 *
 * Esqueleto (SUB-33.4): CORS, OPTIONS e 405. A autenticação (SUB-33.10) e a
 * geração do embedding (SUB-33.11) substituem o 501 provisório abaixo.
 */
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

  // Provisório até a SUB-33.11.
  return res.status(501).json({ erro: 'Geração de embedding ainda não disponível.' });
}
