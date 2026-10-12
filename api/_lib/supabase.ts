/**
 * Cliente Supabase das funções serverless (`@supabase/supabase-js`), com a chave
 * `service_role` — somente no servidor; NUNCA no frontend. As RPCs da fila
 * (`pegar_proxima_task`, `finalizar_task`, ...) só podem ser executadas por ela.
 *
 * Variáveis: SUPABASE_URL (ou VITE_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY e,
 * opcionalmente, SUPABASE_REST_URL (aponta a API REST direto para um PostgREST,
 * ex.: testes locais; as chamadas `<url>/rest/v1/...` são redirecionadas para ela).
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

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
  url: string;
  serviceKey: string;
  restUrl?: string;
}

const TIMEOUT_MS = 20_000;
const PLACEHOLDER_URL = 'http://supabase.local';

export function supabaseConfig(env: NodeJS.ProcessEnv = process.env): SupabaseConfig {
  const url = (env.SUPABASE_URL ?? env.VITE_SUPABASE_URL)?.replace(/\/+$/, '');
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const restUrl = env.SUPABASE_REST_URL?.replace(/\/+$/, '');
  if ((!url && !restUrl) || !serviceKey) {
    throw new SupabaseError(
      'Servidor sem configuração do Supabase: defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.',
      500,
    );
  }
  return { url: url ?? PLACEHOLDER_URL, serviceKey, restUrl };
}

/** fetch com timeout e, se SUPABASE_REST_URL estiver definido, redirecionamento da API REST. */
function makeFetch(cfg: SupabaseConfig): typeof fetch {
  const prefix = `${cfg.url}/rest/v1`;
  return (input, init) => {
    let target: Parameters<typeof fetch>[0] = input;
    if (cfg.restUrl) {
      const href = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      if (href.startsWith(prefix)) target = cfg.restUrl + href.slice(prefix.length);
    }
    return fetch(target, { ...init, signal: init?.signal ?? AbortSignal.timeout(TIMEOUT_MS) });
  };
}

let cached: { key: string; client: SupabaseClient } | undefined;

/** Cliente (reaproveitado entre invocações quentes enquanto a configuração não muda). */
export function db(config: SupabaseConfig = supabaseConfig()): SupabaseClient {
  const key = `${config.url}|${config.restUrl ?? ''}|${config.serviceKey}`;
  if (cached?.key !== key) {
    cached = {
      key,
      client: createClient(config.url, config.serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        global: { fetch: makeFetch(config) },
      }),
    };
  }
  return cached.client;
}

interface PostgrestLikeResult<T> {
  data: T | null;
  error: { message: string; details?: string | null; hint?: string | null; code?: string } | null;
  status: number;
}

/** Devolve `data` ou lança SupabaseError com mensagem, detalhes e dica do PostgREST. */
export function unwrap<T>(res: PostgrestLikeResult<T>): T {
  if (res.error) {
    const e = res.error;
    const msg = [e.message, e.details, e.hint].filter(Boolean).join(' — ');
    throw new SupabaseError(msg || `HTTP ${res.status}`, res.status, e.code);
  }
  return res.data as T;
}

/** Chama uma função RPC e devolve o resultado (ou lança SupabaseError). */
export async function rpc<T = unknown>(name: string, args: Record<string, unknown>): Promise<T> {
  return unwrap<T>(await db().rpc(name, args));
}
