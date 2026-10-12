#!/usr/bin/env bash
# Testes de integração do frontend contra PostgreSQL + pgvector + PostgREST locais.
#   POSTGREST_BIN=/caminho/postgrest tests/integration/run.sh
# Cria (e recria) o banco $DB com database/00-06 e o stub de papéis do Supabase,
# sobe um PostgREST temporário com segredo aleatório e roda `vitest run tests/integration`.
# Nunca rodar contra o Supabase.
set -euo pipefail
cd "$(dirname "$0")/../.."
PSQL=${PSQL:-"sudo -n -u postgres psql"}
DB=${DB:-dashai_front_test}
PORT=${PORT:-3398}
POSTGREST_BIN=${POSTGREST_BIN:-postgrest}
command -v "$POSTGREST_BIN" >/dev/null || { echo "PostgREST não encontrado (defina POSTGREST_BIN)"; exit 1; }
run() { $PSQL -X -q -v ON_ERROR_STOP=1 -d "$DB" "$@"; }

$PSQL -X -q -c "drop database if exists $DB" >/dev/null
$PSQL -X -q -c "create database $DB" >/dev/null
run -f database/tests/supabase_stub.sql >/dev/null 2>&1
for f in database/0*.sql; do run -f "$f" 2>&1 >/dev/null | { grep -v "NOTICE:" || true; }; done

SENHA=$(openssl rand -hex 16)
SEGREDO=$(openssl rand -hex 32)
run -c "do \$\$ begin
  if not exists (select 1 from pg_roles where rolname = 'authenticator') then
    create role authenticator login noinherit;
  end if;
end \$\$;" >/dev/null
run -c "alter role authenticator with login password '$SENHA'" >/dev/null
run -c "grant anon, authenticated, service_role to authenticator" >/dev/null 2>&1 || true

CONF=$(mktemp)
cat > "$CONF" <<CONF
db-uri = "postgres://authenticator:$SENHA@localhost:5432/$DB"
db-schemas = "public"
db-anon-role = "anon"
jwt-secret = "$SEGREDO"
server-port = $PORT
CONF
"$POSTGREST_BIN" "$CONF" >/tmp/postgrest-front-test.log 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null; rm -f "$CONF"' EXIT
for _ in $(seq 1 50); do curl -s "http://localhost:$PORT/" >/dev/null && break; sleep 0.2; done

DASHBOARD_TEST_REST_URL="http://localhost:$PORT" DASHBOARD_TEST_JWT_SECRET="$SEGREDO" \
  npx vitest run tests/integration "$@"
