/**
 * Utilitários de texto (SUB-20.10).
 *
 * `palavrasDe` extrai as palavras relevantes de um texto em Markdown; é a base
 * da sugestão de tags (`sugerirTags`, SUB-20.3), que conta a frequência delas.
 */

/** Stopwords em português e inglês (minúsculas) ignoradas por `palavrasDe`. */
export const STOPWORDS: ReadonlySet<string> = new Set([
  // português
  'aquela', 'aquelas', 'aquele', 'aqueles', 'aquilo', 'até', 'assim', 'cada',
  'como', 'contra', 'desde', 'dessa', 'dessas', 'desse', 'desses', 'desta',
  'destas', 'deste', 'destes', 'depois', 'durante', 'elas', 'eles', 'entre',
  'essa', 'essas', 'esse', 'esses', 'esta', 'está', 'estão', 'estas', 'este',
  'estes', 'isso', 'isto', 'mais', 'mesmo', 'mesma', 'muito', 'muita', 'muitos',
  'muitas', 'nada', 'nela', 'nele', 'nessa', 'nesse', 'nesta', 'neste', 'nossa',
  'nosso', 'onde', 'para', 'pela', 'pelas', 'pelo', 'pelos', 'pode', 'podem',
  'porque', 'quais', 'qual', 'quando', 'quanto', 'quem', 'seja', 'sejam', 'sem',
  'sobre', 'também', 'tem', 'têm', 'tendo', 'toda', 'todas', 'todo', 'todos',
  'tudo', 'você', 'vocês', 'será', 'serão', 'sido', 'somente', 'sua', 'suas',
  'seu', 'seus', 'outra', 'outras', 'outro', 'outros', 'ainda', 'apenas',
  'então', 'foram', 'havia', 'mas', 'num', 'numa', 'ser', 'ter', 'uma', 'umas',
  // inglês
  'about', 'after', 'also', 'been', 'before', 'being', 'both', 'could', 'does',
  'each', 'from', 'have', 'having', 'here', 'into', 'just', 'more', 'most',
  'only', 'other', 'over', 'same', 'should', 'some', 'such', 'than', 'that',
  'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through',
  'under', 'very', 'were', 'what', 'when', 'where', 'which', 'while', 'will',
  'with', 'would', 'your', 'yours',
]);

/** Tamanho mínimo (em letras) para uma palavra ser considerada. */
const TAMANHO_MINIMO = 4;

/** Remove a sintaxe Markdown mais comum, preservando o texto visível. */
function removerMarkdown(texto: string): string {
  return (
    texto
      // blocos de código cercados (``` ... ``` ou ~~~ ... ~~~)
      .replace(/(```|~~~)[\s\S]*?(\1|$)/g, ' ')
      // código inline
      .replace(/`[^`\n]*`/g, ' ')
      // imagens: ![alt](url) -> alt
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      // links: [texto](url) -> texto
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // URLs soltas
      .replace(/\b(?:https?:\/\/|www\.)\S+/gi, ' ')
      // títulos, ênfase, citações e listas
      .replace(/[#*_>~]/g, ' ')
  );
}

/**
 * Extrai as palavras relevantes de um texto (Markdown aceito).
 *
 * Remove código, links e marcadores (`#`, `*`, `_`), passa para minúsculas,
 * separa por qualquer caractere que não seja letra/dígito, descarta palavras
 * com menos de 4 letras e as stopwords pt/en. Mantém repetições e a ordem de
 * aparição (quem conta frequência é o chamador).
 */
export function palavrasDe(texto: string): string[] {
  if (!texto) return [];
  return removerMarkdown(texto)
    .toLocaleLowerCase('pt-BR')
    .split(/[^\p{L}\p{N}]+/u)
    .filter((p) => p.length >= TAMANHO_MINIMO && !STOPWORDS.has(p));
}
