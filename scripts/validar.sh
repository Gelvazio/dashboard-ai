#!/usr/bin/env bash
# scripts/validar.sh — validação completa do repositório (`npm run validar`).
# Roda todas as etapas em sequência, SEM parar na primeira falha, e mostra um
# resumo no fim. Sai com código 1 se qualquer etapa falhar (nada é escondido).
set -euo pipefail

cd "$(dirname "$0")/.."

declare -a NOMES=() RESULTADOS=() DURACOES=()
FALHAS=0

tem_script() { node -e "process.exit(require('./package.json').scripts?.['$1'] ? 0 : 1)"; }

etapa() {
  local nome="$1"; shift
  local inicio=$SECONDS
  echo
  echo "==> ${nome}: $*"
  if "$@"; then
    RESULTADOS+=("OK")
  else
    RESULTADOS+=("FALHOU")
    FALHAS=$((FALHAS + 1))
  fi
  NOMES+=("$nome")
  DURACOES+=("$((SECONDS - inicio))s")
}

pular() {
  echo
  echo "==> $1: pulada ($2)"
  NOMES+=("$1"); RESULTADOS+=("PULADA"); DURACOES+=("-")
}

etapa "typecheck" npm run typecheck
etapa "testes" npm test
etapa "build" npm run build
if tem_script check:chunks; then etapa "chunks" npm run check:chunks; else pular "chunks" "script check:chunks ainda não existe"; fi
if tem_script check:env; then etapa "env" npm run check:env; else pular "env" "script check:env ainda não existe"; fi
etapa "agentes" npm run check:agentes
if command -v python3 >/dev/null 2>&1; then
  etapa "python" python3 -m unittest discover -s scripts
else
  pular "python" "python3 não encontrado"
fi
etapa "audit" npm audit --omit=dev --audit-level=high

echo
echo "================ RESUMO DA VALIDAÇÃO ================"
for i in "${!NOMES[@]}"; do
  printf '  %-10s %-7s %s\n' "${NOMES[$i]}" "${RESULTADOS[$i]}" "${DURACOES[$i]}"
done
echo "====================================================="
if [ "$FALHAS" -gt 0 ]; then
  echo "❌ ${FALHAS} etapa(s) falharam."
  exit 1
fi
echo "✅ Todas as etapas passaram."
