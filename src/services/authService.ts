/**
 * Serviço de autenticação (Supabase Auth) do frontend.
 * A senha só é repassada ao Supabase: nunca é guardada nem registrada em log.
 */
import type { Session } from '@supabase/supabase-js';
import { mensagemErroAuth } from '@/lib/auth';
import { getSupabase, ServiceError, type DashboardClient } from './supabase';
import type { ProjectRole, UserRole } from '@/types/database';

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

/** Dados enviados ao Supabase para criar um usuário (sem nenhum campo de papel/permissão). */
export interface NovoUsuario {
  nome: string;
  email: string;
  senha: string;
  redirectTo: string;
}

/**
 * Cria o usuário no Supabase Auth (`signUp`). Nada de papel sai do frontend: o acesso vem de
 * `project_members`/`user_roles`, gravados por um administrador.
 * Devolve `precisaConfirmar: true` quando o Supabase enviou o e-mail de confirmação (sem sessão).
 * Lança `ServiceError(..., 'AUTH')` com mensagem em português.
 */
export async function cadastrarUsuario(
  { nome, email, senha, redirectTo }: NovoUsuario,
  client: DashboardClient = getSupabase(),
): Promise<{ precisaConfirmar: boolean }> {
  const { data, error } = await client.auth.signUp({
    email: email.trim(),
    password: senha,
    options: { data: { nome: nome.trim() }, emailRedirectTo: redirectTo },
  });
  if (error) throw new ServiceError(mensagemErroAuth(error), 'AUTH');
  return { precisaConfirmar: !data.session };
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

/** Envia o link mágico de acesso (só para usuários já cadastrados). */
export async function enviarLinkMagico(
  email: string,
  redirectTo: string,
  client: DashboardClient = getSupabase(),
): Promise<void> {
  const { error } = await client.auth.signInWithOtp({
    email: email.trim(),
    options: { emailRedirectTo: redirectTo, shouldCreateUser: false },
  });
  if (error) throw new ServiceError(mensagemErroAuth(error), 'AUTH');
}

/** Papel global do usuário (`user_roles`); sem linha -> `null`. */
export async function obterPapelGlobal(
  userId: string,
  client: DashboardClient = getSupabase(),
): Promise<UserRole | null> {
  const { data, error } = await client.from('user_roles').select('role').eq('user_id', userId).maybeSingle();
  if (error) throw new ServiceError(`Não foi possível ler o papel do usuário: ${error.message}`, error.code);
  return (data?.role as UserRole | undefined) ?? null;
}

/** Sessão atual (restaurada do armazenamento do Supabase) ou `null`. */
export async function obterSessao(client: DashboardClient = getSupabase()): Promise<Session | null> {
  const { data, error } = await client.auth.getSession();
  if (error) throw new ServiceError(mensagemErroAuth(error), 'AUTH');
  return data.session ?? null;
}

/** Envia o e-mail de redefinição de senha, voltando para `redirectTo`. */
export async function redefinirSenha(
  email: string,
  redirectTo: string,
  client: DashboardClient = getSupabase(),
): Promise<void> {
  const { error } = await client.auth.resetPasswordForEmail(email.trim(), { redirectTo });
  if (error) throw new ServiceError(mensagemErroAuth(error), 'AUTH');
}

/**
 * Papel do usuário no projeto: `'admin'` se for administrador global (acesso total),
 * senão `project_members.role`; não membro -> `null`.
 */
export async function papelNoProjeto(
  projectId: number,
  userId: string,
  client: DashboardClient = getSupabase(),
): Promise<ProjectRole | 'admin' | null> {
  if ((await obterPapelGlobal(userId, client)) === 'admin') return 'admin';
  const { data, error } = await client
    .from('project_members')
    .select('role')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new ServiceError(`Não foi possível ler o papel no projeto: ${error.message}`, error.code);
  return (data?.role as ProjectRole | undefined) ?? null;
}
