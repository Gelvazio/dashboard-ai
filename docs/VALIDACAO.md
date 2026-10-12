# Validação local (SUB-25.2)

Registro da execução de `npm ci && npm run validar` com todas as tasks anteriores concluídas.
Nada foi corrigido nesta etapa: falhas viram subtarefas novas (SUB-25.8+).

- **Data:** 2026-10-12 13:33 UTC
- **Executor:** Devin (Cognition AI)
- **Commit validado:** `d284472` (`main`)
- **Node:** v22.12.0 (exigido pelo `engines`: `>=22.12`)
- **npm:** 10.8.3
- **`npm ci`:** OK (173 pacotes)

## Resultado do `npm run validar`

| Etapa | Comando | Resultado | Tempo |
|---|---|---|---|
| typecheck | `npm run typecheck` | OK | 12s |
| testes | `npm test` | OK | 9s |
| build | `npm run build` | OK | 8s |
| chunks | `npm run check:chunks` | OK | 0s |
| env | `npm run check:env` | OK | 0s |
| python | `python3 -m unittest discover -s scripts` | OK (13 testes) | 0s |
| audit | `npm audit --omit=dev --audit-level=high` | OK (0 vulnerabilidades) | 1s |

Fora do `validar`, `npm run typecheck:worker` também passou.

### Testes (`vitest run`)

- **Arquivos:** 39 aprovados, 8 pulados (47)
- **Testes:** 268 aprovados, 30 pulados (298), 0 falhas
- Os pulados dependem de banco e são pulados por `describe.skipIf` quando não há configuração:
  - 7 arquivos em `tests/integration/*.integration.test.ts` (rodam com `npm run test:integration`, SUB-25.6);
  - `tests/unit/worker-checkpointer.test.ts` (bloco contra Postgres, exige `LANGGRAPH_DATABASE_URL`).

### Chunks do build (`check:chunks`, limite 500 kB)

16 chunks, todos dentro do limite. Maiores:

| Chunk | Tamanho |
|---|---|
| `react-vendor` | 390.1 kB |
| `supabase` | 209.1 kB |
| `index` | 53.9 kB |
| `MemoriaView` | 35.8 kB |
| `FilaView` | 25.8 kB |
| `MonitorView` | 18.7 kB |
| `SaudeFilaPanel` | 12.6 kB |

CSS: `index.css` com 63.42 kB (10.79 kB gzip).

### Avisos (não bloqueiam)

`check:env` avisa que `LANGGRAPH_DATABASE_URL` e `WORKER_MODELO` estão no `.env.example`, mas não aparecem em `src/`, `api/` ou `scripts/`. As duas são usadas pelo worker (`worker/`), que o script não varre.

## Falhas encontradas

Nenhuma. Nenhuma subtarefa SUB-25.8+ foi criada.

## Suíte do banco (SUB-25.3)

`database/tests/run_tests.sh` em 2026-10-12 13:37 UTC, commit `24c10c5`, contra PostgreSQL 16.15 com pgvector (imagem `pgvector/pgvector:pg16` em Docker local, banco descartável `dashai_test`):

```bash
PSQL="docker exec -i -w /repo/database pg-dash psql -U postgres" bash database/tests/run_tests.sh
```

| Verificação | Resultado |
|---|---|
| Schema `00`–`06` aplicado 2x (idempotência) | OK |
| `tests/test_multi_projeto.sql` (RLS, fila, memória) | OK, 72 verificações |
| `tests/test_recados_regras.sql` (SUB-31) | OK, 46 verificações |
| `tests/test_paralelo.sh`: 12 agentes em paralelo | OK, 60 tasks de 3 projetos sem duplicidade |
| `tests/test_paralelo.sh`: `p_exclusivo=true` com 10 chamadas simultâneas | OK, 1 task entregue |

Saída: exit 0. Nenhuma falha, então nenhuma SUB-25.8+ foi criada.
