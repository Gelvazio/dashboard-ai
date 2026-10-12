/**
 * Cliente mínimo do Supabase (PostgREST) para as funções serverless, usando o
 * `fetch` nativo do Node.js 18+ — sem dependências.
 *
 * Usa a chave `service_role` (somente no servidor; NUNCA no frontend): as RPCs da
 * fila (`pegar_proxima_task`, `finalizar_task`, ...) só podem ser executadas por ela.
 *
 * Variáveis: SUPABASE_URL (ou VITE_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY e,
 * opcionalmente, SUPABASE_REST_URL (aponta direto para um PostgREST, ex.: testes).
 */

export class SupabaseError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}

export interface SupabaseConfig {
  restUrl: string;
  serviceKey: string;
}

export function supabaseConfig(env: NodeJS.ProcessEnv = process.env): SupabaseConfig {
  const url = env.SUPABASE_URL ?? env.VITE_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const restUrl = env.SUPABASE_REST_URL ?? (url ? `${url.replace(/\/+$/, '')}/rest/v1` : undefined);
  if (!restUrl || !serviceKey) {
    throw new SupabaseError(
      'Servidor sem configuração do Supabase: defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.',
      500,
    );
  }
  return { restUrl: restUrl.replace(/\/+$/, ''), serviceKey };
}

type Query = Record<string, string | undefined>;

export async function rest<T = unknown>(
  method: 'GET' | 'POST' | 'PATCH',
  path: string,
  options: { query?: Query; body?: unknown; prefer?: string; config?: SupabaseConfig } = {},
): Promise<T> {
  const cfg = options.config ?? supabaseConfig();
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(options.query ?? {})) if (v !== undefined) qs.append(k, v);
  const url = `${cfg.restUrl}/${path}${qs.size ? `?${qs.toString()}` : ''}`;
  const headers: Record<string, string> = {
    apikey: cfg.serviceKey,
    Authorization: `Bearer ${cfg.serviceKey}`,
    Accept: 'application/json',
  };
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  if (options.prefer) headers.Prefer = options.prefer;

  const resp = await fetch(url, {
    method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: AbortSignal.timeout(20_000),
  });
  const text = await resp.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!resp.ok) {
    const err = (data ?? {}) as { message?: string; code?: string; details?: string; hint?: string };
    const detail = [err.message ?? (typeof data === 'string' ? data : resp.statusText), err.details, err.hint]
      .filter(Boolean)
      .join(' — ');
    throw new SupabaseError(detail || `HTTP ${resp.status}`, resp.status, err.code);
  }
  return data as T;
}

/** Chama uma função RPC (`POST /rpc/<nome>`). */
export const rpc = <T = unknown>(name: string, args: Record<string, unknown>, config?: SupabaseConfig) =>
  rest<T>('POST', `rpc/${name}`, { body: args, config });
