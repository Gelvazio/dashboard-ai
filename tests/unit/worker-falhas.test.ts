import { describe, it, expect } from 'vitest';
import { classificarFalha } from '../../worker/falhas';

describe('classificarFalha', () => {
  it('deve classificar erro de rede como transitorio', () => {
    const err = new Error('ECONNREFUSED');
    expect(classificarFalha(err)).toBe('transitoria');
  });

  it('deve classificar timeout como transitorio', () => {
    const err = new Error('ETIMEDOUT');
    expect(classificarFalha(err)).toBe('transitoria');
  });

  it('deve classificar 429 como transitorio', () => {
    const err = new Error('Too Many Requests');
    (err as any).status = 429;
    expect(classificarFalha(err)).toBe('transitoria');
  });

  it('deve classificar 403 como permissao', () => {
    const err = new Error('Forbidden');
    (err as any).status = 403;
    expect(classificarFalha(err)).toBe('permissao');
  });

  it('deve classificar 400 como validacao', () => {
    const err = new Error('Bad Request');
    (err as any).status = 400;
    expect(classificarFalha(err)).toBe('validacao');
  });

  it('deve classificar erro zod como validacao', () => {
    const err = new Error('ZodError: validation failed');
    expect(classificarFalha(err)).toBe('validacao');
  });

  it('deve classificar recusa como recusa', () => {
    const err = new Error('Task recusada pelo usuário');
    expect(classificarFalha(err)).toBe('recusa');
  });

  it('deve classificar erro generico como permanente', () => {
    const err = new Error('Erro desconhecido');
    expect(classificarFalha(err)).toBe('permanente');
  });

  it('deve classificar erro nao-Error como permanente', () => {
    expect(classificarFalha('string')).toBe('permanente');
    expect(classificarFalha(null)).toBe('permanente');
    expect(classificarFalha(123)).toBe('permanente');
  });
});
