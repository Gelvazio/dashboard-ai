import { describe, expect, it } from 'vitest';
import { HttpError } from '../../api/_lib/http-error';

describe('api/_lib/http-error', () => {
  it('guarda status, mensagem e nome', () => {
    const err = new HttpError(413, 'Texto longo demais.');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(HttpError);
    expect(err.status).toBe(413);
    expect(err.message).toBe('Texto longo demais.');
    expect(err.name).toBe('HttpError');
  });
});
