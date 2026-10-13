// scripts/alternar-env.mjs — alterna o projeto entre o Supabase da NUVEM e o LOCAL.
//
// O Vite carrega `.env.local` em QUALQUER modo, e ele vence o `.env` (credenciais da nuvem).
// Então "alternar" aqui é ligar/desligar o `.env.local`:
//
//   local  → garante o `.env.local` (copia do `.env.local.example` se faltar)
//   nuvem  → guarda o `.env.local` como `.env.local.off` (o `.env` volta a valer)
//   status → diz qual dos dois está ativo (modo padrão, sem argumento)
//
// Uso: node scripts/alternar-env.mjs <local|nuvem|status>
// Atalhos: `npm run dev:local` (local) e `npm run dev` (nuvem) já chamam este script.
//
// Não substitui o `.env` da nuvem nem apaga nada: o `.env.local` é movido, não removido.

import { copyFileSync, existsSync, readFileSync, renameSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ativo = join(raiz, '.env.local');
const guardado = join(raiz, '.env.local.off');
const modelo = join(raiz, '.env.local.example');
const envNuvem = join(raiz, '.env');

/** Variáveis que precisam de valor no `.env.local` (as chaves do stack local). */
const CHAVES = ['VITE_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_ANON_KEY'];

/** Nomes das variáveis que estão sem valor no arquivo. */
function chavesVazias(caminho) {
  const texto = readFileSync(caminho, 'utf8');
  return CHAVES.filter((nome) => new RegExp(`^\\s*${nome}\\s*=\\s*$`, 'm').test(texto));
}

function usarLocal() {
  if (existsSync(ativo)) {
    console.log('✅ Ambiente LOCAL já ativo (.env.local existe).');
  } else if (existsSync(guardado)) {
    renameSync(guardado, ativo);
    console.log('✅ Ambiente LOCAL ativado (restaurei o .env.local guardado).');
  } else if (existsSync(modelo)) {
    copyFileSync(modelo, ativo);
    console.log('✅ Ambiente LOCAL ativado: criei o .env.local a partir do .env.local.example.');
  } else {
    console.error('❌ Não achei o .env.local.example para criar o .env.local.');
    process.exit(1);
  }

  const vazias = chavesVazias(ativo);
  if (vazias.length > 0) {
    console.log('⚠️  Faltam valores no .env.local (pegue com `npx supabase --workdir database/configlocal status`):');
    for (const nome of vazias) console.log(`     ${nome}=`);
  }
  console.log('▶️  Suba o frontend com: npm run dev:local');
}

function usarNuvem() {
  if (existsSync(ativo)) {
    renameSync(ativo, guardado);
    console.log('✅ Ambiente NUVEM ativado (guardei o .env.local como .env.local.off).');
  } else {
    console.log('✅ Ambiente NUVEM já ativo (não existe .env.local).');
  }

  if (!existsSync(envNuvem)) {
    console.log('⚠️  Não existe .env na raiz: copie o .env.example e preencha as credenciais da nuvem.');
  }
  console.log('▶️  Suba o frontend com: npm run dev');
}

function mostrarStatus() {
  const local = existsSync(ativo);
  console.log(`Ambiente ativo: ${local ? 'LOCAL (Supabase em Docker)' : 'NUVEM'}`);
  console.log(`  .env.local ....... ${local ? 'existe (vence o .env no Vite)' : 'não existe'}`);
  console.log(`  .env.local.off ... ${existsSync(guardado) ? 'existe (local guardado)' : 'não existe'}`);
  console.log(`  .env (nuvem) ..... ${existsSync(envNuvem) ? 'existe' : 'não existe'}`);

  if (local) {
    const vazias = chavesVazias(ativo);
    if (vazias.length > 0) {
      console.log(`  ⚠️  chaves ainda vazias no .env.local: ${vazias.join(', ')}`);
    }
  }
}

const modo = (process.argv[2] ?? 'status').toLowerCase();

if (modo === 'local') {
  usarLocal();
} else if (modo === 'nuvem' || modo === 'cloud') {
  usarNuvem();
} else if (modo === 'status') {
  mostrarStatus();
} else {
  console.error(`❌ Modo desconhecido: "${modo}". Use: local | nuvem | status`);
  process.exit(1);
}
