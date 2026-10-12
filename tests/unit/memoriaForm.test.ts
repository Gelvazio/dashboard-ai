import { describe, it, expect } from 'vitest';
import { parseTags, sugerirTags, validarMemoria, MAX_TITULO_MEMORIA, MAX_TAGS_MEMORIA, MAX_TAMANHO_TAG } from '@/lib/memoriaForm';

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

describe('sugerirTags', () => {
  it('devolve vazio sem palavras relevantes ou com max <= 0', () => {
    expect(sugerirTags('', '')).toEqual([]);
    expect(sugerirTags('de para com', 'the and')).toEqual([]);
    expect(sugerirTags('supabase', 'banco', 0)).toEqual([]);
  });

  it('ordena por frequência e o título vale 2x', () => {
    // supabase: 2 (título); banco: 1+1 = 2 (conteúdo); vetorial: 1
    // empate supabase/banco desempata em ordem alfabética
    expect(sugerirTags('Supabase', 'banco banco vetorial')).toEqual(['banco', 'supabase', 'vetorial']);
    expect(sugerirTags('Supabase vetorial', 'banco')).toEqual(['supabase', 'vetorial', 'banco']);
  });

  it('desempata em ordem alfabética', () => {
    expect(sugerirTags('', 'zebra manga abacate')).toEqual(['abacate', 'manga', 'zebra']);
  });

  it('limita a max (padrão 5)', () => {
    const conteudo = 'alfa bravo charlie delta echoo foxtrot golf';
    expect(sugerirTags('', conteudo)).toHaveLength(5);
    expect(sugerirTags('', conteudo, 2)).toEqual(['alfa', 'bravo']);
  });

  it('ignora Markdown, código e stopwords via palavrasDe', () => {
    expect(sugerirTags('# Embeddings para busca', '```\ncodigoOculto\n```\n**embeddings** [docs](https://x.y)')).toEqual([
      'embeddings',
      'busca',
      'docs',
    ]);
  });

  it('é determinística', () => {
    const a = sugerirTags('Fila de tasks', 'trava trava fila agente');
    expect(sugerirTags('Fila de tasks', 'trava trava fila agente')).toEqual(a);
    expect(a).toEqual(['fila', 'tasks', 'trava', 'agente']);
  });
});

describe('parseTags', () => {
  it('devolve vazio para texto vazio ou só separadores', () => {
    expect(parseTags('')).toEqual([]);
    expect(parseTags(' , # ,,  ')).toEqual([]);
  });

  it('separa por vírgula, espaço e #', () => {
    expect(parseTags('banco, supabase #vetor  mcp')).toEqual(['banco', 'supabase', 'vetor', 'mcp']);
    expect(parseTags('#um#dois\ntres\tquatro')).toEqual(['um', 'dois', 'tres', 'quatro']);
  });

  it('passa para minúsculas e remove duplicados mantendo a ordem', () => {
    expect(parseTags('Supabase, banco, SUPABASE #Banco api')).toEqual(['supabase', 'banco', 'api']);
  });

  it('preserva hífens, acentos e outros caracteres dentro da tag', () => {
    expect(parseTags('front-end, memória, v1.2')).toEqual(['front-end', 'memória', 'v1.2']);
  });
});
