import { describe, expect, it } from 'vitest';
import { lerTextoEmbedding, MAX_TEXTO_EMBEDDING } from '../../api/_lib/embedding-input';
import { HttpError } from '../../api/_lib/http-error';

const status = (fn: () => unknown) => {
  try {
    fn();
  } catch (e) {
    expect(e).toBeInstanceOf(HttpError);
    return (e as HttpError).status;
  }
  throw new Error('não lançou');
};

describe('api/_lib/embedding-input — lerTextoEmbedding', () => {
  it('corpo vazio -> 400', () => {
    expect(status(() => lerTextoEmbedding(undefined))).toBe(400);
    expect(status(() => lerTextoEmbedding(''))).toBe(400);
    expect(status(() => lerTextoEmbedding(Buffer.from('  ')))).toBe(400);
  });

  it('JSON inválido -> 400', () => {
    expect(status(() => lerTextoEmbedding('{texto:'))).toBe(400);
  });

  it('sem texto (ou texto não string / vazio / corpo não objeto) -> 400', () => {
    expect(status(() => lerTextoEmbedding({}))).toBe(400);
    expect(status(() => lerTextoEmbedding({ texto: 42 }))).toBe(400);
    expect(status(() => lerTextoEmbedding({ texto: '   ' }))).toBe(400);
    expect(status(() => lerTextoEmbedding('["x"]'))).toBe(400);
  });

  it('texto longo demais -> 413', () => {
    expect(status(() => lerTextoEmbedding({ texto: 'a'.repeat(MAX_TEXTO_EMBEDDING + 1) }))).toBe(413);
  });

  it('aceita objeto, string JSON e Buffer', () => {
    expect(lerTextoEmbedding({ texto: 'olá' })).toBe('olá');
    expect(lerTextoEmbedding('{"texto":"oi"}')).toBe('oi');
    expect(lerTextoEmbedding(Buffer.from('{"texto":"buf"}'))).toBe('buf');
    expect(lerTextoEmbedding({ texto: 'a'.repeat(MAX_TEXTO_EMBEDDING) })).toHaveLength(MAX_TEXTO_EMBEDDING);
  });
});
