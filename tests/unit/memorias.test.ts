import { describe, expect, it } from 'vitest';
import { escopoMemoria, memoriaComoMarkdown } from '@/lib/memorias';

describe('lib/memorias — memoriaComoMarkdown', () => {
  it('gera título, tags, escopo do projeto e conteúdo', () => {
    const md = memoriaComoMarkdown({ title: ' Deploy ', content: 'Use `npm run build`.\n', tags: ['vercel', ' ci '], project_id: 3 });
    expect(md).toBe('# Deploy\n\n**Tags:** `vercel`, `ci`\n**Escopo:** projeto\n\nUse `npm run build`.\n');
  });

  it('omite a linha de tags quando vazia e marca memória global', () => {
    const md = memoriaComoMarkdown({ title: 'Regra', content: 'Texto', tags: [], project_id: null });
    expect(md).toBe('# Regra\n\n**Escopo:** global\n\nTexto\n');
  });
});

describe('lib/memorias — escopoMemoria', () => {
  it('project_id nulo é global; com projeto é projeto', () => {
    expect(escopoMemoria({ project_id: null })).toBe('global');
    expect(escopoMemoria({ project_id: 7 })).toBe('projeto');
    expect(escopoMemoria({ project_id: 0 })).toBe('projeto');
  });
});
