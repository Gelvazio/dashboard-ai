// scripts/sincronizar-agentes.mjs — copia as skills e os agentes de `.agents/` (fonte, lida por
// todas as IAs) para `.claude/` (o Claude Code só lê essa pasta, local e nuvem). Node, sem
// dependências. Só copia: nunca apaga arquivo em `.claude/`, porque a cópia pode ter arquivos
// próprios (ex.: `evals/` da skill `proxima-task`).
// SUB-47.3.

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PASTA_ORIGEM = '.agents';
const PASTA_DESTINO = '.claude';
const SUBPASTAS_SINCRONIZADAS = ['skills', 'agents'];

/**
 * Lista, de forma recursiva, os arquivos dentro de `pasta`.
 * @param {string} pasta - Caminho absoluto da pasta.
 * @returns {string[]} Caminhos absolutos dos arquivos (vazio se a pasta não existir).
 */
function listarArquivos(pasta) {
  if (!existsSync(pasta)) return [];

  return readdirSync(pasta, { withFileTypes: true }).flatMap((entrada) => {
    const caminho = join(pasta, entrada.name);
    if (entrada.isDirectory()) return listarArquivos(caminho);
    return [caminho];
  });
}

/**
 * Diz se o arquivo de destino já tem exatamente o conteúdo da origem.
 * @param {string} origem - Arquivo de origem.
 * @param {string} destino - Arquivo de destino.
 * @returns {boolean} true se o destino existe e é igual à origem.
 */
function estaIgual(origem, destino) {
  if (!existsSync(destino)) return false;
  return readFileSync(origem).equals(readFileSync(destino));
}

/**
 * Copia os arquivos de uma subpasta de `.agents/` para a mesma subpasta de `.claude/`.
 * @param {string} raiz - Raiz do repositório.
 * @param {string} subpasta - Nome da subpasta (ex.: `skills`).
 * @returns {{copiados: string[], iguais: number}} Arquivos copiados (relativos à raiz) e
 *   quantidade de arquivos que já estavam iguais.
 */
export function sincronizarSubpasta(raiz, subpasta) {
  const pastaOrigem = join(raiz, PASTA_ORIGEM, subpasta);
  const pastaDestino = join(raiz, PASTA_DESTINO, subpasta);
  const copiados = [];
  let iguais = 0;

  for (const origem of listarArquivos(pastaOrigem)) {
    const destino = join(pastaDestino, relative(pastaOrigem, origem));
    if (estaIgual(origem, destino)) {
      iguais += 1;
      continue;
    }
    mkdirSync(dirname(destino), { recursive: true });
    copyFileSync(origem, destino);
    copiados.push(relative(raiz, destino));
  }
  return { copiados, iguais };
}

/**
 * Sincroniza todas as subpastas e mostra o resumo no terminal.
 * @param {string} raiz - Raiz do repositório.
 * @returns {number} Total de arquivos copiados.
 */
export function sincronizarAgentes(raiz) {
  let total = 0;
  for (const subpasta of SUBPASTAS_SINCRONIZADAS) {
    const { copiados, iguais } = sincronizarSubpasta(raiz, subpasta);
    for (const arquivo of copiados) console.log(`copiado: ${arquivo}`);
    console.log(`${subpasta}: ${copiados.length} copiado(s), ${iguais} já igual(is)`);
    total += copiados.length;
  }
  return total;
}

const caminhoChamado = process.argv[1] ? resolve(process.argv[1]) : '';
const executadoDireto = caminhoChamado === fileURLToPath(import.meta.url);
if (executadoDireto) sincronizarAgentes(RAIZ);
