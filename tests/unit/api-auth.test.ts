import { describe, expect, it } from 'vitest';
import { bearerToken } from '../../api/_lib/auth';

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
