/**
 * Cliente Supabase do frontend (reutilizável, tipado com `Database`).
 *
 * Usa somente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY: a chave anon é pública e
 * todo acesso é decidido pela RLS do banco a partir do JWT do usuário logado
 * (Supabase Auth, SUB-27). A chave service_role NUNCA vem para o navegador.
 *
 * O cliente é criado sob demanda: sem as variáveis a aplicação abre normalmente e
 * mostra o estado "não configurado" (ver `supabaseConfigurado` e `verificarConexao`).
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export type DashboardClient = SupabaseClient<Database>;

const env = import.meta.env;

/** true se as variáveis do Supabase estão definidas. */
export const supabaseConfigurado = Boolean(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY);

/** Erro de serviço com mensagem pronta para a interface (em português). */
export class ServiceError extends Error {
  constructor(
    message: string,
    readonly code?: string,
    readonly details?: string,
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

let cliente: DashboardClient | undefined;

/** Papel (`role`) gravado no JWT de uma chave do Supabase, se for um JWT legível. */
export function papelDaChave(chave: string): string | undefined {
  try {
    const parte = chave.split('.')[1];
    if (!parte) return undefined;
    const b64 = parte.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(parte.length / 4) * 4, '=');
    return (JSON.parse(atob(b64)) as { role?: string }).role;
  } catch {
    return undefined;
  }
}

/** Cliente único da aplicação. Lança ServiceError se o Supabase não estiver configurado. */
export function getSupabase(): DashboardClient {
  if (cliente) return cliente;
  if (!supabaseConfigurado) {
    throw new ServiceError(
      'Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.',
      'SEM_CONFIG',
    );
  }
  if (papelDaChave(env.VITE_SUPABASE_ANON_KEY!) === 'service_role') {
    throw new ServiceError('VITE_SUPABASE_ANON_KEY contém uma chave service_role: use a chave anon.', 'CHAVE_INSEGURA');
  }
  cliente = createClient<Database>(env.VITE_SUPABASE_URL!, env.VITE_SUPABASE_ANON_KEY!, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return cliente;
}

/** Substitui o cliente (testes ou ambientes especiais). Passe `undefined` para voltar ao padrão. */
export function definirClienteSupabase(novo: DashboardClient | undefined): void {
  cliente = novo;
}

const MENSAGENS: Record<string, string> = {
  '42501': 'Sem permissão para esta operação neste projeto.',
  '23505': 'Já existe um registro com estes dados (valor duplicado).',
  '23503': 'Registro relacionado não encontrado.',
  '23514': 'Valor fora das regras permitidas.',
  PGRST301: 'Sessão expirada: entre novamente.',
  PGRST116: 'Registro não encontrado.',
};

interface ResultadoSupabase<T> {
  data: T | null;
  error: { message: string; code?: string; details?: string | null; hint?: string | null } | null;
}

/**
 * Devolve `data` de uma resposta do supabase-js ou lança ServiceError com mensagem
 * amigável (mantendo a mensagem do banco quando ela é específica, ex.: triggers).
 */
export function resultado<T>(res: ResultadoSupabase<T>, contexto?: string): T {
  if (res.error) {
    const { message, code, details } = res.error;
    // Erros conhecidos viram mensagem amigável; os demais (ex.: RAISE de triggers, P0001)
    // mantêm a mensagem do banco, que já é específica.
    const texto = (code && MENSAGENS[code]) || message || 'Erro ao acessar o Supabase.';
    throw new ServiceError(contexto ? `${contexto}: ${texto}` : texto, code, details ?? undefined);
  }
  return res.data as T;
}

export type EstadoConexao = 'sem_config' | 'conectado' | 'sem_sessao' | 'erro';

/**
 * Situação da conexão para o indicador do header: sem configuração, sem sessão
 * (a RLS bloqueia anon), conectado ou erro de rede/servidor.
 */
export async function verificarConexao(client?: DashboardClient): Promise<{ estado: EstadoConexao; detalhe?: string }> {
  if (!client && !supabaseConfigurado) return { estado: 'sem_config' };
  try {
    const sb = client ?? getSupabase();
    const { error, status } = await sb.from('projects').select('id').limit(1);
    if (!error) return { estado: 'conectado' };
    if (status === 401 || status === 403 || error.code === '42501' || error.code === 'PGRST301') {
      return { estado: 'sem_sessao', detalhe: error.message };
    }
    return { estado: 'erro', detalhe: error.message };
  } catch (err) {
    return { estado: 'erro', detalhe: (err as Error).message };
  }
}
