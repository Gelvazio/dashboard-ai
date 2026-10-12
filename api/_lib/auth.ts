import type { McpRequest } from './http.js';

/**
 * Lê o token do cabeçalho `Authorization: Bearer <token>`.
 * Aceita o valor como string ou array (usa o primeiro), esquema `Bearer`
 * sem diferenciar maiúsculas. Devolve `null` se ausente ou malformado.
 */
export function bearerToken(headers: McpRequest['headers']): string | null {
  const bruto = headers['authorization'] ?? headers['Authorization'];
  const valor = Array.isArray(bruto) ? bruto[0] : bruto;
  if (typeof valor !== 'string') return null;
  const m = /^\s*Bearer\s+(\S+)\s*$/i.exec(valor);
  return m ? m[1] : null;
}

/** Falha ao validar a sessão (configuração ausente, rede ou resposta inesperada). */
export class AuthError extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = 'AuthError';
  }
}

/**
 * Valida o JWT de um usuário do Supabase Auth (`GET /auth/v1/user`).
 * 200 com `id` -> `{ userId }`; 401/403 -> `null` (sessão inválida/expirada);
 * outros erros lançam `AuthError`, sem incluir chaves ou o token na mensagem.
 */
export async function verificarSessaoSupabase(
  token: string,
  env: Record<string, string | undefined> = process.env,
): Promise<{ userId: string } | null> {
  const url = env.SUPABASE_URL?.replace(/\/+$/, '');
  const apikey = env.SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !apikey) {
    throw new AuthError('Validação de sessão indisponível: SUPABASE_URL ou chave do Supabase não configurada.');
  }

  let resp: Response;
  try {
    resp = await fetch(`${url}/auth/v1/user`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}`, apikey },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    const tempo = err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError');
    throw new AuthError(tempo ? 'Tempo esgotado ao validar a sessão.' : 'Falha de rede ao validar a sessão.');
  }

  if (resp.status === 401 || resp.status === 403) return null;
  if (!resp.ok) throw new AuthError(`Falha ao validar a sessão (HTTP ${resp.status}).`);

  const corpo = (await resp.json().catch(() => null)) as { id?: unknown } | null;
  if (!corpo || typeof corpo.id !== 'string' || !corpo.id) {
    throw new AuthError('Resposta inesperada ao validar a sessão.');
  }
  return { userId: corpo.id };
}
