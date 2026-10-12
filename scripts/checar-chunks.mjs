#!/usr/bin/env node
// Checa o tamanho dos chunks JS gerados pelo Vite (SUB-34.5).
// Uso: npm run build && npm run check:chunks
// Falha (exit 1) se algum arquivo em dist/assets/*.js passar do limite.
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const LIMITE_KB = Number(process.env.CHUNK_LIMITE_KB ?? 500);
const pasta = join(process.cwd(), 'dist', 'assets');

if (!existsSync(pasta)) {
  console.error(`check:chunks: pasta ${pasta} não existe. Rode "npm run build" antes.`);
  process.exit(1);
}

const arquivos = readdirSync(pasta)
  .filter((nome) => nome.endsWith('.js'))
  .map((nome) => ({ nome, kb: statSync(join(pasta, nome)).size / 1024 }))
  .sort((a, b) => b.kb - a.kb);

if (arquivos.length === 0) {
  console.error('check:chunks: nenhum .js em dist/assets.');
  process.exit(1);
}

const grandes = arquivos.filter((a) => a.kb > LIMITE_KB);
for (const a of arquivos) {
  const marca = a.kb > LIMITE_KB ? 'ACIMA' : 'ok';
  console.log(`${marca.padEnd(5)} ${a.kb.toFixed(1).padStart(8)} kB  ${a.nome}`);
}

if (grandes.length > 0) {
  console.error(`check:chunks: ${grandes.length} chunk(s) acima de ${LIMITE_KB} kB.`);
  process.exit(1);
}
console.log(`check:chunks: ${arquivos.length} chunk(s), todos até ${LIMITE_KB} kB.`);
