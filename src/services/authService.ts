/**
 * Serviço de autenticação (Supabase Auth) do frontend.
 * A senha só é repassada ao Supabase: nunca é guardada nem registrada em log.
 */
import type { Session } from '@supabase/supabase-js';
import { mensagemErroAuth } from '@/lib/auth';
import { getSupabase, ServiceError, type DashboardClient } from './supabase';

/** Entra com e-mail e senha. Lança `ServiceError(..., 'AUTH')` com mensagem em português. */
export async function entrarComSenha(
  email: string,
  senha: string,
  client: DashboardClient = getSupabase(),
): Promise<Session> {
  const { data, error } = await client.auth.signInWithPassword({ email: email.trim(), password: senha });
  if (error) throw new ServiceError(mensagemErroAuth(error), 'AUTH');
  if (!data.session) throw new ServiceError(mensagemErroAuth({}), 'AUTH');
  return data.session;
}

/** Chave do projeto selecionado no `localStorage` (ver `ProjetoContext`). */
export const CHAVE_PROJETO_LOCAL = 'dashboard-ai:projeto';

/** Sai da sessão e esquece o projeto selecionado. Lança `ServiceError(..., 'AUTH')` em erro. */
export async function sair(client: DashboardClient = getSupabase()): Promise<void> {
  const { error } = await client.auth.signOut();
  try {
    globalThis.localStorage?.removeItem(CHAVE_PROJETO_LOCAL);
  } catch {
    // localStorage indisponível (modo privado/SSR): nada a limpar.
  }
  if (error) throw new ServiceError(mensagemErroAuth(error), 'AUTH');
}
