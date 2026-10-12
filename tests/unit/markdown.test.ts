import { describe, expect, it } from 'vitest';
import { hrefSeguro, parseInline, parseMarkdown } from '@/lib/markdown';
import { taskComoMarkdown } from '@/lib/tasks';
import type { Task } from '@/types';

describe('lib/markdown', () => {
  it('inline: código, negrito, itálico, links e URLs', () => {
    expect(parseInline('use `npm test` e **rode** *já*')).toEqual([
      { t: 'texto', v: 'use ' }, { t: 'codigo', v: 'npm test' }, { t: 'texto', v: ' e ' },
      { t: 'negrito', v: [{ t: 'texto', v: 'rode' }] }, { t: 'texto', v: ' ' }, { t: 'italico', v: [{ t: 'texto', v: 'já' }] },
    ]);
    expect(parseInline('veja [o PR](https://github.com/o/r/pull/1).')).toEqual([
      { t: 'texto', v: 'veja ' }, { t: 'link', href: 'https://github.com/o/r/pull/1', v: [{ t: 'texto', v: 'o PR' }] }, { t: 'texto', v: '.' },
    ]);
    expect(parseInline('em https://exemplo.com/a.')[1]).toEqual({ t: 'link', href: 'https://exemplo.com/a', v: [{ t: 'texto', v: 'https://exemplo.com/a' }] });
  });

  it('bloqueia links perigosos', () => {
    expect(hrefSeguro('javascript:alert(1)')).toBeNull();
    expect(parseInline('[x](javascript:alert(1))').some((n) => n.t === 'link')).toBe(false);
    expect(hrefSeguro('mailto:a@b.c')).toBe('mailto:a@b.c');
  });

  it('blocos: títulos, listas, código, citação e linha', () => {
    const b = parseMarkdown('## Objetivo\nFazer X\ncontinua\n\n- a\n- b\n\n1. um\n2. dois\n\n```ts\nconst x = 1;\n```\n> nota\n\n---');
    expect(b.map((x) => x.t)).toEqual(['titulo', 'paragrafo', 'lista', 'lista', 'codigo', 'citacao', 'linha']);
    expect(b[2]).toMatchObject({ ordenada: false, itens: [[{ t: 'texto', v: 'a' }], [{ t: 'texto', v: 'b' }]] });
    expect(b[3]).toMatchObject({ ordenada: true });
    expect(b[4]).toEqual({ t: 'codigo', lang: 'ts', v: 'const x = 1;' });
    expect(parseMarkdown('<script>alert(1)</script>')).toEqual([{ t: 'paragrafo', v: [{ t: 'texto', v: '<script>alert(1)</script>' }] }]);
  });

  it('código sem fechamento vai até o fim', () => {
    expect(parseMarkdown('```\nabc')).toEqual([{ t: 'codigo', lang: '', v: 'abc' }]);
  });
});

describe('taskComoMarkdown', () => {
  it('resume a task com metadados, instrução e resultado', () => {
    const md = taskComoMarkdown({
      codigo: 'LOJA-0004', titulo: 'Otimizar', status: 'concluida', executar: true, prioridade: 3, ordem: 0, tipo: 'ia', tentativas: 1, max_tentativas: 3,
      dependencias: ['LOJA-0001'], pr_url: 'https://github.com/o/r/pull/7', commit_sha: 'abc123', concluido_em: null, instrucao: 'Fazer X', resultado: 'Feito',
    } as unknown as Task, { nome: 'Loja', slug: 'loja' });
    expect(md).toContain('# LOJA-0004 — Otimizar');
    expect(md).toContain('**Projeto:** Loja (loja)');
    expect(md).toContain('**Depende de:** LOJA-0001');
    expect(md).toContain('**PR:** https://github.com/o/r/pull/7');
    expect(md).toContain('## Instrução\n\nFazer X');
    expect(md).toContain('## Resultado\n\nFeito');
  });
});
