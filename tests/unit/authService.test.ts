import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CHAVE_PROJETO_LOCAL,
  enviarLinkMagico,
  entrarComSenha,
  obterSessao,
  redefinirSenha,
  sair,
} from '@/services/authService';
import { ServiceError, type DashboardClient } from '@/services/supabase';

const sessao = { access_token: 't', user: { id: 'u1' } };

function cliente(auth: Record<string, unknown>): DashboardClient {
  return { auth } as unknown as DashboardClient;
}

afterEach(() => vi.unstubAllGlobals());

describe('authService', () => {
  it('entrarComSenha: sucesso devolve a sessão (e-mail com trim)', async () => {
    const signInWithPassword = vi.fn().mockResolvedValue({ data: { session: sessao }, error: null });
    await expect(entrarComSenha(' a@b.com ', 'segredo', cliente({ signInWithPassword }))).resolves.toBe(sessao);
    expect(signInWithPassword).toHaveBeenCalledWith({ email: 'a@b.com', password: 'segredo' });
  });

  it('entrarComSenha: credenciais inválidas viram ServiceError traduzido', async () => {
    const signInWithPassword = vi
      .fn()
      .mockResolvedValue({ data: { session: null }, error: { message: 'Invalid login credentials', status: 400 } });
    const p = entrarComSenha('a@b.com', 'x', cliente({ signInWithPassword }));
    await expect(p).rejects.toBeInstanceOf(ServiceError);
    await expect(p).rejects.toMatchObject({ message: 'E-mail ou senha inválidos.', code: 'AUTH' });
  });

  it('sair: chama signOut e limpa o projeto salvo', async () => {
    const removeItem = vi.fn();
    vi.stubGlobal('localStorage', { removeItem });
    const signOut = vi.fn().mockResolvedValue({ error: null });
    await sair(cliente({ signOut }));
    expect(signOut).toHaveBeenCalled();
    expect(removeItem).toHaveBeenCalledWith(CHAVE_PROJETO_LOCAL);
  });

  it('obterSessao: devolve a sessão ou null', async () => {
    const getSession = vi.fn().mockResolvedValueOnce({ data: { session: sessao }, error: null })
      .mockResolvedValueOnce({ data: { session: null }, error: null });
    const c = cliente({ getSession });
    await expect(obterSessao(c)).resolves.toBe(sessao);
    await expect(obterSessao(c)).resolves.toBeNull();
  });

  it('enviarLinkMagico: shouldCreateUser false e emailRedirectTo', async () => {
    const signInWithOtp = vi.fn().mockResolvedValue({ data: {}, error: null });
    await enviarLinkMagico('a@b.com', 'https://app/#/login', cliente({ signInWithOtp }));
    expect(signInWithOtp).toHaveBeenCalledWith({
      email: 'a@b.com',
      options: { emailRedirectTo: 'https://app/#/login', shouldCreateUser: false },
    });
  });

  it('redefinirSenha: repassa redirectTo e traduz rate limit', async () => {
    const resetPasswordForEmail = vi.fn().mockResolvedValue({ data: {}, error: { status: 429, message: 'x' } });
    await expect(redefinirSenha('a@b.com', 'https://app/', cliente({ resetPasswordForEmail }))).rejects.toThrow(
      /Muitas tentativas/,
    );
    expect(resetPasswordForEmail).toHaveBeenCalledWith('a@b.com', { redirectTo: 'https://app/' });
  });
});
