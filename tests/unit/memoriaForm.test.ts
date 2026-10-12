import { describe, it, expect } from 'vitest';
import { validarMemoria, MAX_TITULO_MEMORIA, MAX_TAGS_MEMORIA, MAX_TAMANHO_TAG } from '@/lib/memoriaForm';

const valido = { titulo: 'Decisão de arquitetura', conteudo: 'Usar pgvector.', tags: ['banco', 'supabase'] };

describe('validarMemoria', () => {
  it('aceita dados válidos (objeto vazio)', () => {
    expect(validarMemoria(valido)).toEqual({});
    expect(validarMemoria({ ...valido, tags: [] })).toEqual({});
  });

  it('exige título e conteúdo (só espaços não contam)', () => {
    const e = validarMemoria({ titulo: '   ', conteudo: '\n ', tags: [] });
    expect(e.titulo).toBeTruthy();
    expect(e.conteudo).toBeTruthy();
    expect(e.tags).toBeUndefined();
  });

  it('limita o título a 200 caracteres', () => {
    expect(validarMemoria({ ...valido, titulo: 'a'.repeat(MAX_TITULO_MEMORIA) })).toEqual({});
    expect(validarMemoria({ ...valido, titulo: 'a'.repeat(MAX_TITULO_MEMORIA + 1) }).titulo).toMatch(/200/);
  });

  it('aceita até 20 tags e recusa 21', () => {
    const vinte = Array.from({ length: MAX_TAGS_MEMORIA }, (_, i) => `tag${i}`);
    expect(validarMemoria({ ...valido, tags: vinte })).toEqual({});
    expect(validarMemoria({ ...valido, tags: [...vinte, 'extra'] }).tags).toMatch(/20/);
  });

  it('limita cada tag a 40 caracteres', () => {
    expect(validarMemoria({ ...valido, tags: ['x'.repeat(MAX_TAMANHO_TAG)] })).toEqual({});
    expect(validarMemoria({ ...valido, tags: ['ok', 'x'.repeat(MAX_TAMANHO_TAG + 1)] }).tags).toMatch(/40/);
  });

  it('recusa tags vazias', () => {
    expect(validarMemoria({ ...valido, tags: ['ok', '  '] }).tags).toBeTruthy();
  });
});
