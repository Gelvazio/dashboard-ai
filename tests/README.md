# tests/ — Testes do frontend (Vitest)

| Comando | O que roda |
|---|---|
| `npm test` | `tests/unit` (sem banco); os de integração ficam *skipped* sem as variáveis abaixo |
| `POSTGREST_BIN=/caminho/postgrest npm run test:integration` | Cria o banco `dashai_front_test` (PostgreSQL 15+ com pgvector, `sudo -u postgres psql`), aplica `database/00-06`, sobe um PostgREST temporário com segredo aleatório e roda `tests/integration` |

Os testes de integração usam o `@supabase/supabase-js` real apontado para o PostgREST local, com JWTs
`anon`, `authenticated` (com `sub` = usuário) e `service_role` assinados pelo segredo de teste
(`tests/helpers/postgrest.ts`), então exercitam a RLS de verdade. Cada teste cria projetos com slug
único. Nunca aponte esses testes para o Supabase.

Variáveis (definidas pelo `run.sh`): `DASHBOARD_TEST_REST_URL`, `DASHBOARD_TEST_JWT_SECRET`.
