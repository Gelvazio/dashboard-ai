// scripts/sincronizar-agentes.mjs — copia as skills e os agentes de `.agents/` (fonte única,
// lida direto por Codex, Antigravity, Cursor e Copilot) para as pastas das IAs que só leem a
// própria pasta: `.claude/` (Claude Code) e `.grok/` (Grok Build); e gera, para o Gemini CLI,
// um comando `.gemini/commands/<skill>.toml` por skill. Node, sem dependências.
// Só copia: nunca apaga arquivo no destino, porque a cópia pode ter arquivos próprios
// (ex.: `evals/` da skill `proxima-task`).
// SUB-47.3 (Claude Code) · SUB-60 (outras IAs).

import {
  copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PASTA_ORIGEM = '.agents';

/** Destinos de cópia: para acrescentar uma IA, acrescente uma entrada (SUB-60.1). */
const DESTINOS_DE_COPIA = [
  { nome: 'Claude Code', pasta: '.claude', subpastas: ['skills', 'agents'] },
  { nome: 'Grok Build', pasta: '.grok', subpastas: ['skills'] },
];

const PASTA_SKILLS = 'skills';
const ARQUIVO_SKILL = 'SKILL.md';
const PASTA_COMANDOS_GEMINI = join('.gemini', 'commands');
const SEPARADOR_FRONTMATTER = '---';

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
 * Copia os arquivos de uma subpasta de `.agents/` para a mesma subpasta de um destino.
 * @param {{raiz: string, pastaDestino: string, subpasta: string}} opcoes - Raiz do repositório,
 *   pasta do destino (ex.: `.claude`) e subpasta (ex.: `skills`).
 * @returns {{copiados: string[], iguais: number}} Arquivos copiados (relativos à raiz) e
 *   quantidade de arquivos que já estavam iguais.
 */
export function sincronizarSubpasta({ raiz, pastaDestino, subpasta }) {
  const origemSubpasta = join(raiz, PASTA_ORIGEM, subpasta);
  const destinoSubpasta = join(raiz, pastaDestino, subpasta);
  const copiados = [];
  let iguais = 0;

  for (const origem of listarArquivos(origemSubpasta)) {
    const destino = join(destinoSubpasta, relative(origemSubpasta, origem));
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
 * Lê um campo de uma linha só (`campo: valor`) do frontmatter de um `SKILL.md`.
 * @param {string} texto - Conteúdo do `SKILL.md`.
 * @param {string} campo - Nome do campo (ex.: `description`).
 * @returns {string} Valor do campo, ou texto vazio se não existir.
 */
function lerCampoFrontmatter(texto, campo) {
  const linhas = texto.split(/\r?\n/);
  if (linhas[0] !== SEPARADOR_FRONTMATTER) return '';

  const fim = linhas.indexOf(SEPARADOR_FRONTMATTER, 1);
  const linha = linhas.slice(1, fim).find((atual) => atual.startsWith(`${campo}:`));
  return linha ? linha.slice(campo.length + 1).trim() : '';
}

/**
 * Escapa um texto para string TOML básica (entre aspas duplas).
 * @param {string} texto - Texto livre.
 * @returns {string} Texto com `\\` e `"` escapados.
 */
function escaparToml(texto) {
  return texto.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
}

/**
 * Monta o comando do Gemini CLI que embute o `SKILL.md` (`@{...}`) e o pedido (`{{args}}`).
 * @param {{nome: string, descricao: string}} skill - Nome e descrição da skill.
 * @returns {string} Conteúdo do arquivo `.toml`.
 */
export function montarComandoGemini({ nome, descricao }) {
  const caminhoSkill = `${PASTA_ORIGEM}/${PASTA_SKILLS}/${nome}/${ARQUIVO_SKILL}`;
  return [
    `# Gerado por scripts/sincronizar-agentes.mjs (SUB-60.2). Fonte: ${caminhoSkill}.`,
    `description = "${escaparToml(descricao)}"`,
    'prompt = """',
    `Siga a skill \`${nome}\` do projeto (fonte única: ${caminhoSkill}), cujo texto vem abaixo.`,
    '',
    `@{${caminhoSkill}}`,
    '',
    'Pedido do usuário: {{args}}',
    '"""',
    '',
  ].join('\n');
}

/**
 * Lista as skills de `.agents/skills/` (pastas que têm `SKILL.md`).
 * @param {string} raiz - Raiz do repositório.
 * @returns {{nome: string, descricao: string}[]} Skills encontradas.
 */
function listarSkills(raiz) {
  const pastaSkills = join(raiz, PASTA_ORIGEM, PASTA_SKILLS);
  if (!existsSync(pastaSkills)) return [];

  return readdirSync(pastaSkills, { withFileTypes: true })
    .filter((entrada) => existsSync(join(pastaSkills, entrada.name, ARQUIVO_SKILL)))
    .map((entrada) => {
      const texto = readFileSync(join(pastaSkills, entrada.name, ARQUIVO_SKILL), 'utf8');
      const nome = lerCampoFrontmatter(texto, 'name') || entrada.name;
      return { nome, descricao: lerCampoFrontmatter(texto, 'description') };
    });
}

/**
 * Gera `.gemini/commands/<skill>.toml` para cada skill; só grava o que mudou.
 * @param {string} raiz - Raiz do repositório.
 * @returns {{copiados: string[], iguais: number}} Arquivos gravados e quantos já estavam iguais.
 */
export function gerarComandosGemini(raiz) {
  const copiados = [];
  let iguais = 0;

  for (const skill of listarSkills(raiz)) {
    const destino = join(raiz, PASTA_COMANDOS_GEMINI, `${skill.nome}.toml`);
    const conteudo = montarComandoGemini(skill);
    if (existsSync(destino) && readFileSync(destino, 'utf8') === conteudo) {
      iguais += 1;
      continue;
    }
    mkdirSync(dirname(destino), { recursive: true });
    writeFileSync(destino, conteudo);
    copiados.push(relative(raiz, destino));
  }
  return { copiados, iguais };
}

/**
 * Sincroniza todos os destinos (cópias e comandos do Gemini) e mostra o resumo no terminal.
 * @param {string} raiz - Raiz do repositório.
 * @returns {number} Total de arquivos copiados.
 */
export function sincronizarAgentes(raiz) {
  let total = 0;
  for (const { nome, pasta, subpastas } of DESTINOS_DE_COPIA) {
    for (const subpasta of subpastas) {
      const { copiados, iguais } = sincronizarSubpasta({ raiz, pastaDestino: pasta, subpasta });
      for (const arquivo of copiados) console.log(`copiado: ${arquivo}`);
      console.log(`${nome} ${subpasta}: ${copiados.length} copiado(s), ${iguais} já igual(is)`);
      total += copiados.length;
    }
  }
  const gemini = gerarComandosGemini(raiz);
  for (const arquivo of gemini.copiados) console.log(`gerado: ${arquivo}`);
  const { copiados: gerados, iguais: comandosIguais } = gemini;
  console.log(`Gemini CLI comandos: ${gerados.length} gerado(s), ${comandosIguais} já igual(is)`);
  return total + gemini.copiados.length;
}

const caminhoChamado = process.argv[1] ? resolve(process.argv[1]) : '';
const executadoDireto = caminhoChamado === fileURLToPath(import.meta.url);
if (executadoDireto) sincronizarAgentes(RAIZ);
