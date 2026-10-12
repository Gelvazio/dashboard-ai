import { describe, expect, it } from 'vitest';
import { mensagemErroAuth, MENSAGEM_GENERICA_AUTH, MENSAGEM_REDE_AUTH, validarLogin, urlDeRetorno } from '@/lib/auth';

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

describe('validarLogin', () => {
  it('válido devolve vazio (com trim)', () => expect(validarLogin({ email: '  a@b.com ', senha: '123456' })).toEqual({}));
  it('campos vazios', () => expect(validarLogin({ email: ' ', senha: '' })).toEqual({ email: 'Informe o e-mail.', senha: 'Informe a senha.' }));
  it('e-mail inválido', () => expect(validarLogin({ email: 'a@b', senha: '123456' }).email).toBe('E-mail inválido.'));
  it('senha curta', () => expect(validarLogin({ email: 'a@b.com', senha: '12345' }).senha).toMatch(/6 caracteres/));
});

describe('urlDeRetorno', () => {
  const o = 'https://app.exemplo.com';
  it('mantém a tela do hash', () => expect(urlDeRetorno({ origin: o, pathname: '/', hash: '#/memoria' })).toBe(`${o}/#/memoria`));
  it('descarta tokens no hash', () =>
    expect(urlDeRetorno({ origin: o, pathname: '/', hash: '#access_token=abc&type=recovery' })).toBe(`${o}/`));
  it('descarta parâmetros após a tela', () =>
    expect(urlDeRetorno({ origin: o, pathname: '/app/', hash: '#/login?x=1&access_token=a' })).toBe(`${o}/app/#/login`));
  it('sem hash e caminho vazio', () => expect(urlDeRetorno({ origin: o, pathname: '', hash: '' })).toBe(`${o}/`));
});
