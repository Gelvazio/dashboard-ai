# 🗄️ database/ — Scripts SQL consolidados do Dashboard AI

Todos os scripts são **idempotentes** (`create ... if not exists`, `create or replace`,
`drop trigger if exists` + `create trigger`): podem ser reaplicados sem erro e sem perda de dados.

## Ordem de aplicação

| Arquivo | Conteúdo |
|---|---|
| `01_tasks_schema.sql` | Tabela `public.tasks` (fila da IA), restrições, índices e triggers (código `TASK-NNNN`, `updated_at`, ciclo de vida/liberação de trava) |
| `02_logs_schema.sql` | Tabela `public.agendamento_tarefa_logs` (histórico do agendador) |
| `03_memories_schema.sql` | Extensão `vector` + tabela `public.ai_memories` (Jev-Mem) com índice HNSW de cosseno |
| `04_rpc_functions.sql` | Funções RPC: `pegar_proxima_task` (captura atômica, lock de 90 min, respeita dependências/ON-OFF/tentativas), `finalizar_task` (encerra, libera trava, grava log), `liberar_trava_task` (liberação manual de trava expirada), `match_memories` (similaridade de cosseno + filtro de tags) e `eh_professor_administrador` (+ tabela `professores_administradores`, para uso em RLS) |

## Como aplicar

**Supabase:** abra *SQL Editor* e execute os arquivos na ordem acima.

**psql:**
```bash
for f in database/0*.sql; do psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"; done
```

Requisitos: PostgreSQL 15+ com a extensão `pgvector` ≥ 0.5 (necessária para índices HNSW).

## Exemplos de chamada (supabase-js)

```ts
// Agente pega a próxima task (fila serial, lock de 90 min)
const { data: [task] } = await supabase.rpc('pegar_proxima_task', { p_agente: 'Claude' });

// Agente finaliza e registra no histórico do agendador
await supabase.rpc('finalizar_task', {
  p_task_id: task.id, p_status: 'concluida', p_resultado: 'Relatório...',
  p_pr_url: 'https://github.com/...', p_commit_sha: 'abc1234', p_agente: 'Claude', p_rotina: 'agendador-ia',
});

// Busca semântica
const { data } = await supabase.rpc('match_memories', {
  query_embedding: embedding, match_threshold: 0.7, match_count: 5,
});
```

> ⚠️ RLS não é habilitado por estes scripts. Antes de expor o projeto com a chave `anon`,
> habilite RLS e crie políticas (ver exemplo com `eh_professor_administrador()` em `04_rpc_functions.sql`).
