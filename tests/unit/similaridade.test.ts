import { describe, it, expect } from 'vitest';
import { formatarSimilaridade } from '@/lib/similaridade';

describe('formatarSimilaridade', () => {
  it('formata 0.894 como 89%', () => {
    expect(formatarSimilaridade(0.894)).toBe('89%');
  });

  it('formata 0.5 como 50%', () => {
    expect(formatarSimilaridade(0.5)).toBe('50%');
  });

  it('formata 1.0 como 100%', () => {
    expect(formatarSimilaridade(1.0)).toBe('100%');
  });

  it('formata 0.0 como 0%', () => {
    expect(formatarSimilaridade(0.0)).toBe('0%');
  });

  it('limita valores acima de 1 para 100%', () => {
    expect(formatarSimilaridade(1.5)).toBe('100%');
  });

  it('limita valores abaixo de 0 para 0%', () => {
    expect(formatarSimilaridade(-0.5)).toBe('0%');
  });

  it('arredonda 0.994 para 99%', () => {
    expect(formatarSimilaridade(0.994)).toBe('99%');
  });

  it('arredonda 0.006 para 1%', () => {
    expect(formatarSimilaridade(0.006)).toBe('1%');
  });

  it('arredonda 0.949 para 95%', () => {
    expect(formatarSimilaridade(0.949)).toBe('95%');
  });

  it('arredonda 0.950 para 95%', () => {
    expect(formatarSimilaridade(0.950)).toBe('95%');
  });

  it('arredonda 0.951 para 95%', () => {
    expect(formatarSimilaridade(0.951)).toBe('95%');
  });
});
