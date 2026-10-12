import { describe, it, expect } from 'vitest';
import { palavrasDe, STOPWORDS } from '@/lib/texto';

describe('palavrasDe', () => {
  it('devolve lista vazia para texto vazio', () => {
    expect(palavrasDe('')).toEqual([]);
    expect(palavrasDe('   \n ')).toEqual([]);
  });

  it('passa para minúsculas e mantém acentos', () => {
    expect(palavrasDe('Memória PERSISTENTE Vetorial')).toEqual([
      'memória',
      'persistente',
      'vetorial',
    ]);
  });

  it('descarta palavras com menos de 4 letras', () => {
    expect(palavrasDe('api de rpc sql banco')).toEqual(['banco']);
  });

  it('descarta stopwords em português e inglês', () => {
    expect(STOPWORDS.has('para')).toBe(true);
    expect(STOPWORDS.has('with')).toBe(true);
    expect(palavrasDe('Configurar para produção with Supabase this time')).toEqual([
      'configurar',
      'produção',
      'supabase',
      'time',
    ]);
  });

  it('remove marcadores Markdown (#, *, _)', () => {
    expect(palavrasDe('# Título\n\n**negrito** e _itálico_\n- item lista')).toEqual([
      'título',
      'negrito',
      'itálico',
      'item',
      'lista',
    ]);
  });

  it('remove blocos de código e código inline', () => {
    const md = 'Antes\n```ts\nconst segredo = funcaoInterna();\n```\nFinal `variavelOculta` fim';
    expect(palavrasDe(md)).toEqual(['antes', 'final']);
  });

  it('mantém o texto do link e descarta a URL', () => {
    expect(palavrasDe('Veja [documentação oficial](https://supabase.com/docs/guides) agora')).toEqual(
      ['veja', 'documentação', 'oficial', 'agora'],
    );
    expect(palavrasDe('acesse https://exemplo.com/caminho/longo hoje')).toEqual(['acesse', 'hoje']);
  });

  it('separa por pontuação e mantém repetições na ordem', () => {
    expect(palavrasDe('embedding, embedding; vetor-embedding.')).toEqual([
      'embedding',
      'embedding',
      'vetor',
      'embedding',
    ]);
  });
});
