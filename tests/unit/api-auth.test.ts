import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuthError, bearerToken, verificarSessaoSupabase } from '../../api/_lib/auth';

describe('api/_lib/auth — bearerToken', () => {
  it('devolve null sem cabeçalho', () => {
    expect(bearerToken({})).toBeNull();
  });

  it('recusa outro esquema', () => {
    expect(bearerToken({ authorization: 'Basic abc' })).toBeNull();
  });

  it('recusa Bearer vazio ou com espaços no token', () => {
    expect(bearerToken({ authorization: 'Bearer ' })).toBeNull();
    expect(bearerToken({ authorization: 'Bearer' })).toBeNull();
    expect(bearerToken({ authorization: 'Bearer a b' })).toBeNull();
  });

  it('usa o primeiro valor quando vem em array', () => {
    expect(bearerToken({ authorization: ['Bearer tok1', 'Bearer tok2'] })).toBe('tok1');
    expect(bearerToken({ authorization: [] })).toBeNull();
  });

  it('extrai o token (esquema case-insensitive, sem espaços)', () => {
    expect(bearerToken({ authorization: 'Bearer abc.def' })).toBe('abc.def');
    expect(bearerToken({ authorization: '  bearer   xyz  ' })).toBe('xyz');
  });
});

describe('api/_lib/auth — verificarSessaoSupabase', () => {
  const env = { SUPABASE_URL: 'https://exemplo.supabase.co/', SUPABASE_ANON_KEY: 'anon-de-teste' };
  const resposta = (status: number, corpo: unknown = {}) =>
    new Response(JSON.stringify(corpo), { status, headers: { 'Content-Type': 'application/json' } });

  afterEach(() => vi.unstubAllGlobals());

  it('200 com id devolve o userId e envia token e apikey', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(resposta(200, { id: 'u-1' }));
    vi.stubGlobal('fetch', fetchFalso);
    await expect(verificarSessaoSupabase('tok', env)).resolves.toEqual({ userId: 'u-1' });
    const [url, init] = fetchFalso.mock.calls[0];
    expect(url).toBe('https://exemplo.supabase.co/auth/v1/user');
    expect(init.headers).toEqual({ Authorization: 'Bearer tok', apikey: 'anon-de-teste' });
  });

  it('401/403 devolvem null', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta(401)));
    await expect(verificarSessaoSupabase('tok', env)).resolves.toBeNull();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta(403)));
    await expect(verificarSessaoSupabase('tok', env)).resolves.toBeNull();
  });

  it('500 lança AuthError sem vazar chave ou token', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta(500)));
    const err = await verificarSessaoSupabase('tok-secreto', env).catch((e) => e);
    expect(err).toBeInstanceOf(AuthError);
    expect(err.message).not.toMatch(/anon-de-teste|tok-secreto/);
  });

  it('timeout lança AuthError', async () => {
    const abort = Object.assign(new Error('timeout'), { name: 'TimeoutError' });
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abort));
    await expect(verificarSessaoSupabase('tok', env)).rejects.toThrowError('Tempo esgotado ao validar a sessão.');
  });

  it('sem configuração lança AuthError', async () => {
    await expect(verificarSessaoSupabase('tok', {})).rejects.toBeInstanceOf(AuthError);
  });
});
