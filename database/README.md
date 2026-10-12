# 🗄️ database/ — Scripts SQL consolidados do Dashboard AI

Todos os scripts são **idempotentes** (`create ... if not exists`, `create or replace`,
`drop trigger if exists` + `create trigger`): podem ser reaplicados sem erro e sem perda de dados.

## Ordem de aplicação

| Arquivo | Conteúdo |
|---|---|
| `01_tasks_schema.sql` | Tabela `public.tasks` (fila da IA), restrições, índices e triggers (código `TASK-NNNN`, `updated_at`, ciclo de vida/liberação de trava) |
| `02_logs_schema.sql` | Tabela `public.agendamento_tarefa_logs` (histórico do agendador) |
| `03_memories_schema.sql` | Extensão `vector` + tabela `public.ai_memories` (Jev-Mem) com índice HNSW de cosseno |
| `04_rpc_functions.sql` | Funções RPC (`pegar_proxima_task`, `finalizar_task`, `match_memories`, `eh_professor_administrador`) — SUB-05 |

## Como aplicar

**Supabase:** abra *SQL Editor* e execute os arquivos na ordem acima.

**psql:**
```bash
for f in database/0*.sql; do psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"; done
```

Requisitos: PostgreSQL 15+ com a extensão `pgvector` ≥ 0.5 (necessária para índices HNSW).
