import { describe, expect, it } from 'vitest';
import { escopoMemoria, filtrarMemoriasLocal, memoriaComoMarkdown } from '@/lib/memorias';

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

describe('lib/memorias — filtrarMemoriasLocal', () => {
  const memorias = [
    { title: 'Configuração do Vercel', content: 'Deploy com `vercel --prod`.', tags: ['deploy', 'Vercel'], project_id: 1 },
    { title: 'Regra global', content: 'Sempre rodar os testes.', tags: ['qualidade'], project_id: null },
    { title: 'Banco', content: 'Usar migrações idempotentes.', tags: ['sql', 'deploy'], project_id: 1 },
  ];

  it('filtro vazio devolve todas na mesma ordem', () => {
    expect(filtrarMemoriasLocal(memorias)).toEqual(memorias);
    expect(filtrarMemoriasLocal(memorias, { busca: '  ', tag: '', escopo: 'todas' })).toEqual(memorias);
  });

  it('busca sem acento e sem maiúsculas em título, conteúdo e tags', () => {
    expect(filtrarMemoriasLocal(memorias, { busca: 'CONFIGURACAO' }).map((m) => m.title)).toEqual(['Configuração do Vercel']);
    expect(filtrarMemoriasLocal(memorias, { busca: 'migracoes' }).map((m) => m.title)).toEqual(['Banco']);
    expect(filtrarMemoriasLocal(memorias, { busca: 'qualidade' }).map((m) => m.title)).toEqual(['Regra global']);
    expect(filtrarMemoriasLocal(memorias, { busca: 'inexistente' })).toEqual([]);
  });

  it('filtra por tag exata sem diferenciar maiúsculas', () => {
    expect(filtrarMemoriasLocal(memorias, { tag: 'DEPLOY' }).map((m) => m.title)).toEqual(['Configuração do Vercel', 'Banco']);
    expect(filtrarMemoriasLocal(memorias, { tag: 'vercel' })).toHaveLength(1);
    expect(filtrarMemoriasLocal(memorias, { tag: 'depl' })).toEqual([]);
  });

  it('filtra por escopo e combina os critérios', () => {
    expect(filtrarMemoriasLocal(memorias, { escopo: 'global' }).map((m) => m.title)).toEqual(['Regra global']);
    expect(filtrarMemoriasLocal(memorias, { escopo: 'projeto' })).toHaveLength(2);
    expect(filtrarMemoriasLocal(memorias, { escopo: 'projeto', tag: 'deploy', busca: 'banco' }).map((m) => m.title)).toEqual(['Banco']);
    expect(filtrarMemoriasLocal(memorias, { escopo: 'global', tag: 'deploy' })).toEqual([]);
  });
});
