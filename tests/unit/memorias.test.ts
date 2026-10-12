import { describe, expect, it } from 'vitest';
import { memoriaComoMarkdown } from '@/lib/memorias';

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
