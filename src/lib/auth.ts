/**
 * Utilitários puros de autenticação (Supabase Auth) para a interface.
 */

/** Forma mínima de um erro do Supabase Auth (AuthError ou similar). */
export interface ErroAuth {
  message?: string;
  code?: string;
  status?: number;
}

const MENSAGENS: Record<string, string> = {
  invalid_credentials: 'E-mail ou senha inválidos.',
  email_not_confirmed: 'Confirme seu e-mail antes de entrar.',
  over_request_rate_limit: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  over_email_send_rate_limit: 'Muitos e-mails enviados. Aguarde alguns minutos e tente novamente.',
  user_banned: 'Este usuário está bloqueado. Fale com o administrador.',
};

export const MENSAGEM_GENERICA_AUTH = 'Não foi possível concluir a autenticação. Tente novamente.';
export const MENSAGEM_REDE_AUTH = 'Falha de conexão com o servidor de autenticação. Verifique sua internet.';

/** Traduz um erro do Supabase Auth para uma mensagem em português. `null` -> string vazia. */
export function mensagemErroAuth(erro: ErroAuth | null): string {
  if (!erro) return '';
  const code = erro.code?.toLowerCase();
  if (code && MENSAGENS[code]) return MENSAGENS[code];
  const msg = (erro.message ?? '').toLowerCase();
  if (msg.includes('invalid login credentials')) return MENSAGENS.invalid_credentials;
  if (msg.includes('email not confirmed')) return MENSAGENS.email_not_confirmed;
  if (erro.status === 429 || msg.includes('rate limit')) return MENSAGENS.over_request_rate_limit;
  if (msg.includes('banned')) return MENSAGENS.user_banned;
  if (erro.status === 0 || msg.includes('failed to fetch') || msg.includes('network') || msg.includes('fetch failed')) {
    return MENSAGEM_REDE_AUTH;
  }
  return MENSAGEM_GENERICA_AUTH;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Valida o formulário de login. Devolve um objeto vazio quando está tudo certo. */
export function validarLogin(d: { email: string; senha: string }): Partial<Record<'email' | 'senha', string>> {
  const erros: Partial<Record<'email' | 'senha', string>> = {};
  const email = (d.email ?? '').trim();
  if (!email) erros.email = 'Informe o e-mail.';
  else if (!EMAIL_RE.test(email)) erros.email = 'E-mail inválido.';
  const senha = d.senha ?? '';
  if (!senha) erros.senha = 'Informe a senha.';
  else if (senha.length < 6) erros.senha = 'A senha deve ter pelo menos 6 caracteres.';
  return erros;
}

/**
 * URL de retorno (`redirectTo`) do link mágico e da redefinição de senha:
 * origem + caminho + hash da tela (`#/rota`), descartando tokens/parâmetros anteriores
 * (`#access_token=...`, `?x=`, `&type=`).
 */
export function urlDeRetorno(loc: Pick<Location, 'origin' | 'pathname' | 'hash'>): string {
  const tela = /^#\/[^?&#=]*/.exec(loc.hash ?? '')?.[0] ?? '';
  return `${loc.origin}${loc.pathname || '/'}${tela}`;
}
