// scripts/checar-env.mjs — confere se toda variável de ambiente usada no código
// está documentada no `.env.example` (Node, sem dependências).
// SUB-08.8: extração das variáveis citadas no código-fonte.

/** Nome de variável de ambiente: maiúsculas, dígitos e `_`, começando por letra ou `_`. */
const NOME = '[A-Z_][A-Z0-9_]*';

const PADROES = [
  // process.env.X, import.meta.env.X, env.X (qualquer objeto chamado `env`)
  new RegExp(`(?<![\\w$])env\\.(${NOME})(?![\\w$])`, 'g'),
  // process.env['X'] / import.meta.env["X"]
  new RegExp(`(?<![\\w$])env\\[\\s*['"\`](${NOME})['"\`]\\s*\\]`, 'g'),
  // Python: os.environ.get("X") / os.environ["X"] / os.getenv("X")
  new RegExp(`os\\.environ\\.get\\(\\s*['"](${NOME})['"]`, 'g'),
  new RegExp(`os\\.environ\\[\\s*['"](${NOME})['"]\\s*\\]`, 'g'),
  new RegExp(`os\\.getenv\\(\\s*['"](${NOME})['"]`, 'g'),
];

/**
 * Extrai os nomes de variáveis de ambiente citados em `texto`.
 * Reconhece `process.env.X`, `import.meta.env.X`, `env.X` (só nomes em maiúsculas),
 * `env["X"]`, `os.environ.get("X")`, `os.environ["X"]` e `os.getenv("X")`.
 * @param {string} texto
 * @returns {string[]} nomes sem repetição, em ordem alfabética
 */
export function extrairVariaveis(texto) {
  const nomes = new Set();
  for (const padrao of PADROES) {
    for (const m of String(texto ?? '').matchAll(padrao)) nomes.add(m[1]);
  }
  return [...nomes].sort();
}

/**
 * Lista os nomes das variáveis declaradas num `.env.example` (linhas `NOME=` ou
 * `export NOME=`), ignorando comentários (`#`) e linhas vazias.
 * @param {string} texto conteúdo do `.env.example`
 * @returns {string[]} nomes sem repetição, em ordem alfabética
 */
export function variaveisDoExemplo(texto) {
  const nomes = new Set();
  for (const linha of String(texto ?? '').split(/\r?\n/)) {
    const limpa = linha.trim();
    if (!limpa || limpa.startsWith('#')) continue;
    const m = limpa.match(new RegExp(`^(?:export\\s+)?(${NOME})\\s*=`));
    if (m) nomes.add(m[1]);
  }
  return [...nomes].sort();
}
