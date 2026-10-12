import { describe, expect, it } from 'vitest';
import { mensagemErroAuth, MENSAGEM_GENERICA_AUTH, MENSAGEM_REDE_AUTH } from '@/lib/auth';

describe('mensagemErroAuth', () => {
  it('null devolve vazio', () => expect(mensagemErroAuth(null)).toBe(''));
  it('invalid_credentials por código e por mensagem', () => {
    expect(mensagemErroAuth({ code: 'invalid_credentials' })).toBe('E-mail ou senha inválidos.');
    expect(mensagemErroAuth({ message: 'Invalid login credentials', status: 400 })).toBe('E-mail ou senha inválidos.');
  });
  it('email_not_confirmed', () => expect(mensagemErroAuth({ code: 'email_not_confirmed' })).toMatch(/Confirme/));
  it('rate limit por código e por 429', () => {
    expect(mensagemErroAuth({ code: 'over_request_rate_limit' })).toMatch(/Muitas tentativas/);
    expect(mensagemErroAuth({ status: 429 })).toMatch(/Muitas tentativas/);
  });
  it('user_banned', () => expect(mensagemErroAuth({ code: 'user_banned' })).toMatch(/bloqueado/));
  it('falha de rede', () => expect(mensagemErroAuth({ message: 'Failed to fetch', status: 0 })).toBe(MENSAGEM_REDE_AUTH));
  it('genérico', () => expect(mensagemErroAuth({ message: 'algo estranho', status: 500 })).toBe(MENSAGEM_GENERICA_AUTH));
});
