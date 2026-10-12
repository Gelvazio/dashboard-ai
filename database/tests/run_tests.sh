#!/usr/bin/env bash
# Testes locais de database/ (PostgreSQL 15+ com pgvector). Uso:
#   database/tests/run_tests.sh            # usa `sudo -u postgres psql`
#   PSQL="psql -h localhost -U postgres" database/tests/run_tests.sh
# Cria (e recria) o banco de teste $DB; nunca rodar contra o Supabase.
set -euo pipefail
cd "$(dirname "$0")/.."
export PSQL=${PSQL:-"sudo -n -u postgres psql"}
DB=${DB:-dashai_test}
run() { $PSQL -X -q -v ON_ERROR_STOP=1 -d "$DB" "$@"; }

$PSQL -X -q -c "drop database if exists $DB" >/dev/null
$PSQL -X -q -c "create database $DB" >/dev/null
run -f tests/supabase_stub.sql >/dev/null 2>&1
for i in 1 2; do  # idempotência: aplica tudo duas vezes
  for f in 0*.sql; do run -f "$f" 2>&1 >/dev/null | { grep -v "NOTICE:" || true; }; done
done
echo "OK: schema 00-05 aplicado 2x sem erro"

saida=$(run -f tests/test_multi_projeto.sql 2>&1) || { echo "$saida" | grep -E 'FALHOU|ERROR' ; exit 1; }
echo "$saida" | grep -c 'NOTICE:  ok:' | xargs -I{} echo "OK: {} verificações de RLS/fila/memória"
echo "$saida" | grep -q TODOS_OS_TESTES_PASSARAM || { echo "$saida"; exit 1; }

DB=$DB bash tests/test_paralelo.sh
