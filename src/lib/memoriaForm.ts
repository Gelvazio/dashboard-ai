/**
 * Validação e utilitários do formulário de nova memória canônica (SUB-20).
 * Funções puras: o modal (SUB-20.6) só cuida da interface.
 */
import { palavrasDe } from '@/lib/texto';

export const MAX_TITULO_MEMORIA = 200;
export const MAX_TAGS_MEMORIA = 20;
export const MAX_TAMANHO_TAG = 40;

export interface DadosMemoriaForm {
  titulo: string;
  conteudo: string;
  tags: string[];
}

export type ErrosMemoria = Partial<Record<'titulo' | 'conteudo' | 'tags', string>>;

/**
 * Valida os dados da memória e devolve os erros por campo (objeto vazio = válido).
 * Título obrigatório (até 200 caracteres), conteúdo obrigatório e até 20 tags
 * de até 40 caracteres cada (tags vazias não são aceitas). Espaços nas pontas
 * não contam.
 */
export function validarMemoria({ titulo, conteudo, tags }: DadosMemoriaForm): ErrosMemoria {
  const e: ErrosMemoria = {};

  const t = (titulo ?? '').trim();
  if (!t) e.titulo = 'Informe o título.';
  else if (t.length > MAX_TITULO_MEMORIA) e.titulo = `O título deve ter no máximo ${MAX_TITULO_MEMORIA} caracteres.`;

  if (!(conteudo ?? '').trim()) e.conteudo = 'Informe o conteúdo.';

  const lista = tags ?? [];
  if (lista.length > MAX_TAGS_MEMORIA) {
    e.tags = `Use no máximo ${MAX_TAGS_MEMORIA} tags.`;
  } else if (lista.some((tag) => !tag.trim())) {
    e.tags = 'Remova as tags vazias.';
  } else {
    const longa = lista.find((tag) => tag.trim().length > MAX_TAMANHO_TAG);
    if (longa !== undefined) e.tags = `A tag "${longa.trim().slice(0, 20)}…" passa de ${MAX_TAMANHO_TAG} caracteres.`;
  }

  return e;
}

/**
 * Sugere tags a partir do título e do conteúdo ("geração de tags dinâmicas").
 * Conta a frequência das palavras de `palavrasDe` (cada ocorrência no título
 * vale 2, no conteúdo vale 1), ordena por pontuação decrescente, desempata em
 * ordem alfabética e devolve as `max` primeiras. Determinística.
 */
export function sugerirTags(titulo: string, conteudo: string, max = 5): string[] {
  if (max <= 0) return [];
  const pontos = new Map<string, number>();
  const somar = (palavras: string[], peso: number) => {
    for (const p of palavras) pontos.set(p, (pontos.get(p) ?? 0) + peso);
  };
  somar(palavrasDe(titulo ?? ''), 2);
  somar(palavrasDe(conteudo ?? ''), 1);
  return [...pontos.entries()]
    .sort(([a, pa], [b, pb]) => pb - pa || (a < b ? -1 : a > b ? 1 : 0))
    .slice(0, max)
    .map(([p]) => p);
}
