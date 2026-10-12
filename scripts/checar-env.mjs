// scripts/checar-env.mjs — confere se toda variável de ambiente usada no código
// está documentada no `.env.example` (Node, sem dependências).
// SUB-08.8: extração das variáveis citadas no código-fonte.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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

/** Extensões de código-fonte varridas pelo `check:env`. */
export const EXTENSOES_FONTE = ['.ts', '.tsx', '.js', '.mjs', '.py'];

/** Pastas nunca varridas (dependências, build e testes). */
export const PASTAS_IGNORADAS = ['node_modules', 'dist', 'tests'];

/**
 * Lista recursivamente os arquivos de código-fonte (`.ts`, `.tsx`, `.js`, `.mjs`, `.py`)
 * das pastas informadas, ignorando `node_modules`, `dist` e `tests`. Pastas
 * inexistentes são ignoradas.
 * @param {string[]} dirs pastas a varrer (ex.: `['src', 'api', 'scripts']`)
 * @returns {string[]} caminhos (`join(dir, ...)`) sem repetição, em ordem alfabética
 */
export function listarArquivosFonte(dirs) {
  const arquivos = new Set();
  const visitar = (dir) => {
    for (const entrada of readdirSync(dir, { withFileTypes: true })) {
      const caminho = join(dir, entrada.name);
      if (entrada.isDirectory()) {
        if (!PASTAS_IGNORADAS.includes(entrada.name)) visitar(caminho);
      } else if (entrada.isFile() && EXTENSOES_FONTE.includes(extname(entrada.name))) {
        arquivos.add(caminho);
      }
    }
  };
  for (const dir of dirs) {
    if (existsSync(dir)) visitar(dir);
  }
  return [...arquivos].sort();
}

/** Variáveis embutidas do Vite (`import.meta.env.DEV` etc.): não vão no `.env.example`. */
export const VARIAVEIS_EMBUTIDAS = ['BASE_URL', 'DEV', 'MODE', 'PROD', 'SSR'];

/** Pastas varridas pelo `npm run check:env`. */
export const PASTAS_FONTE = ['src', 'api', 'scripts'];

/**
 * Execução direta (`npm run check:env`): sai com código 1 se alguma variável usada
 * no código não estiver no `.env.example`; avisa (sem falhar) as que estão no
 * exemplo mas não são usadas. Este próprio arquivo não é varrido (os comentários
 * citam nomes de exemplo).
 * @param {string} raiz raiz do repositório
 * @returns {number} código de saída
 */
export function main(raiz = resolve(fileURLToPath(import.meta.url), '..', '..')) {
  const esteArquivo = resolve(fileURLToPath(import.meta.url));
  const usadas = new Map();
  for (const arquivo of listarArquivosFonte(PASTAS_FONTE.map((d) => join(raiz, d)))) {
    if (resolve(arquivo) === esteArquivo) continue;
    for (const nome of extrairVariaveis(readFileSync(arquivo, 'utf8'))) {
      if (VARIAVEIS_EMBUTIDAS.includes(nome)) continue;
      if (!usadas.has(nome)) usadas.set(nome, []);
      usadas.get(nome).push(relative(raiz, arquivo));
    }
  }
  const caminhoExemplo = join(raiz, '.env.example');
  if (!existsSync(caminhoExemplo)) {
    console.error('check:env: `.env.example` não encontrado na raiz do repositório.');
    return 1;
  }
  const doExemplo = new Set(variaveisDoExemplo(readFileSync(caminhoExemplo, 'utf8')));
  const faltando = [...usadas.keys()].filter((n) => !doExemplo.has(n)).sort();
  const naoUsadas = [...doExemplo].filter((n) => !usadas.has(n)).sort();

  for (const nome of naoUsadas) {
    console.warn(`aviso: ${nome} está no .env.example mas não é usada em ${PASTAS_FONTE.join('/, ')}/`);
  }
  if (faltando.length > 0) {
    console.error('check:env: variáveis usadas no código e ausentes do .env.example:');
    for (const nome of faltando) console.error(`  - ${nome} (${usadas.get(nome).join(', ')})`);
    return 1;
  }
  console.log(`check:env: OK (${usadas.size} variáveis usadas, todas no .env.example).`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  process.exitCode = main();
}
