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
