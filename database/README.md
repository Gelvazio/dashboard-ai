# 🗄️ database/ — Scripts SQL consolidados do Dashboard AI

O Dashboard AI é um **gerenciador genérico de tasks de IA para qualquer projeto**: vários
projetos (`public.projects`) compartilham a mesma fila (`public.tasks`), a memória
(`public.ai_memories`) e o histórico de execuções, isolados por `project_id` e por RLS.

Todos os scripts são **idempotentes** (`create ... if not exists`, `create or replace`,
`drop ... if exists` + `create`): podem ser reaplicados sem erro e sem perda de dados, e também
atualizam instalações da versão anterior (sem `project_id`).

## Ordem de aplicação

| Arquivo | Conteúdo |
|---|---|
| `00_projects_roles.sql` | Utilitários (`usuario_atual()`, `papel_requisicao()`), `projects` (+ projeto `default`), `user_roles` (admin/member), `project_members` (owner/editor/viewer), `eh_administrador()`, `tem_acesso_projeto()`; migra o legado `professores_administradores` para `user_roles` |
| `01_tasks_schema.sql` | `public.tasks` com `project_id`, código **único por projeto** (`<PREFIXO>-0001`), `tipo` (`ia`/`humano`), `origem`, espelho (`arquivo_md`, `md5_md`, `sincronizado_em`), `log_id`, auditoria; triggers de guarda da interface, código, dependências (mesmo projeto, sem ciclo), `updated_at` e ciclo de vida |
| `02_logs_schema.sql` | `public.agendamento_tarefa_logs` por projeto (agente, status antes/depois, instrução recebida, repositório, branch, commit, PR, sessão, arquivos alterados, duração) |
| `03_memories_schema.sql` | Extensão `vector` + `public.ai_memories` por projeto (`project_id` nulo = memória global), título único por projeto, índice HNSW de cosseno |
| `04_rpc_functions.sql` | `pegar_proxima_task`, `finalizar_task`, `registrar_execucao_sem_tarefa`, `liberar_trava_task`, `match_memories` |
| `05_rls_policies.sql` | RLS e permissões das tabelas e funções de 00–04 |
| `06_messages_rules.sql` | `agent_messages` (recados entre agentes, por projeto/task) e `project_rules` (regras do repositório por seção, com `md5`), `ler_recados()`, `conferir_regras()` e a RLS dessas tabelas |
| `07_agent_events.sql` | `agent_events` (eventos dos agentes para o monitor em tempo real), trigger `validar_agent_event`, RLS, publicação no Supabase Realtime e `atividade_atual_agentes()` |

## Modelo de acesso

| Papel | O que pode |
|---|---|
| `anon` | Nada (sem acesso a tabelas nem funções) |
| `authenticated` | Projetos em que é membro: `viewer` lê; `editor` cria/edita tasks e memórias do projeto; `owner` também edita o projeto e a equipe. Administrador global (`user_roles.role = 'admin'` ou JWT `app_metadata.role = 'admin'`) vê e gerencia tudo. Sem DELETE nas tasks (exclusão lógica); logs só leitura |
| `service_role` | Backend, MCP, scripts e agentes: ignora RLS e é o **único** que executa `pegar_proxima_task`, `finalizar_task` e `registrar_execucao_sem_tarefa` |

Guarda da interface (trigger): usuários da API nunca colocam ou tiram uma task de `em_execucao`,
não mexem na trava nem nas tentativas (exceto zerar ao reabrir) e só concluem tasks do tipo
`humano`. `project_id` de uma task não muda depois de criada.

## Recados e regras (06)

- **`agent_messages`**: recado de um agente/frente (`remetente`) para outro (`destinatario`, nulo = todos),
  com `tipo` (`recado`, `pergunta`, `resposta`, `alerta`, `handoff`), task opcional (`task_id` ou
  `task_codigo`, sempre do mesmo projeto) e `resposta_de` para conversas.
  `ler_recados(p_projeto, p_agente, p_somente_nao_lidos, p_marcar_lidos, p_desde, p_limite)` devolve a
  caixa de entrada do agente (dirigidos a ele + para todos, sem os próprios e os arquivados) e marca
  como lidos os dirigidos a ele. Recados para todos não são marcados: use `p_desde`.
  Interface: viewer lê; editor cria e só altera `lido_em`, `lido_por` e `arquivado` (sem DELETE);
  `criado_por` é sempre o usuário logado.
- **`project_rules`**: cópia das regras do repositório do projeto por (`arquivo`, `secao`), com `md5`
  gerado do `conteudo`. `conferir_regras(p_projeto, '[{"arquivo","secao","md5"}]')` compara o que está
  no repositório com o banco: `igual`, `diverge`, `so_local`, `so_banco` (regras com `ativo = false`
  são ignoradas). Regras viram instrução para agentes, por isso só o **owner** do projeto (ou
  administrador) escreve; viewer lê.

## Eventos dos agentes (07)

- **`agent_events`**: um evento por linha, por projeto (`project_id`) e opcionalmente por task
  (`task_id`/`task_codigo`). Colunas: `agente` (obrigatório, até 120), `execucao_id` (thread do
  LangGraph), `etapa` (nó/passo), `tipo`, `status` (livre), `mensagem` (até 2000), `metadados`
  (objeto JSON), `chave_idempotencia`, `criado_por` e `created_at`.
- **Tipos**: `inicio`, `progresso`, `fim`, `erro`, `heartbeat`, `trava`, `liberacao`, `commit`.
- **`chave_idempotencia`**: única por projeto (`unique (project_id, chave_idempotencia)`; nula = sem
  deduplicação). O emissor repete o envio sem duplicar, ex.: `git:<sha>` no espelho do quadro
  (`scripts/espelhar_quadro_eventos.py --aplicar`, com `on_conflict` + `resolution=ignore-duplicates`).
- **Trigger `validar_agent_event`**: a task precisa ser do mesmo projeto (`task_codigo` sem task
  correspondente é aceito; com task, o código é preenchido a partir dela); eventos são só-inclusão
  (update não muda `project_id`, `agente`, `created_at` nem `criado_por`); pela interface,
  `criado_por` é sempre o usuário logado.
- **RLS**: viewer lê, editor inclui; sem UPDATE/DELETE pela interface (só `service_role`).
- **Realtime**: o arquivo adiciona `agent_events` à publicação `supabase_realtime` se ela existir e a
  tabela ainda não estiver nela (no Postgres local, sem a publicação, o bloco não faz nada). Confira com
  `select * from pg_publication_tables where tablename = 'agent_events'`.
- **`atividade_atual_agentes(p_project_id)`**: último evento de cada agente do projeto (`agente`,
  `task_codigo`, `etapa`, `tipo`, `status`, `mensagem`, `execucao_id`, `ultimo_em`) mais
  `ultimo_heartbeat_em`. `security invoker` (respeita a RLS), executável por `authenticated` e
  `service_role`. Só exibe atividade; não altera travas.

## Fila

- `pegar_proxima_task(p_agente, p_projeto => null, p_lock_minutos => 90, p_exclusivo => false)`:
  pega 1 task `ia` elegível (projeto ativo, ON, `executar_apos` alcançado, tentativas sobrando,
  dependências do mesmo projeto concluídas) na ordem prioridade → ordem → criação, com
  `FOR UPDATE SKIP LOCKED` (vários agentes em paralelo, nunca a mesma task). `p_projeto` = slug
  (null = qualquer projeto ativo). `p_exclusivo => true` = no máximo 1 task em execução por projeto.
- `finalizar_task(p_task_id, p_status, p_resultado, p_pr_url, p_commit_sha, p_agente, p_rotina, p_metadados)`:
  `concluida` | `recusada` | `erro` (erro com tentativas sobrando volta a `pendente`); grava o log
  e `tasks.log_id`. `p_metadados` (jsonb): `repositorio`, `branch`, `sessao_url`,
  `arquivos_alterados`, `erro_mensagem`.
- `registrar_execucao_sem_tarefa(p_rotina, p_agente, p_projeto)`: log `sem_tarefa` (fila vazia).
- `liberar_trava_task(p_task_id, p_forcar, p_lock_minutos)`: libera trava expirada (ou à força);
  pela interface exige papel `editor` no projeto.

## Como aplicar

**Supabase:** abra *SQL Editor* e execute os arquivos na ordem acima (00 → 07).

**psql:**
```bash
for f in database/0*.sql; do psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"; done
```

Requisitos: PostgreSQL 15+ (usa `unique nulls not distinct`) com `pgvector` ≥ 0.5 (índice HNSW).

Depois de aplicar, cadastre o primeiro administrador (SQL Editor, como `postgres`):
```sql
insert into public.user_roles (user_id, role) values ('<auth.users.id>', 'admin')
on conflict (user_id) do update set role = 'admin';
```

## Exemplos (supabase-js, no servidor com a chave service_role)

```ts
// Agente pega a próxima task do projeto "meu-app"
const { data: [task] } = await supabase.rpc('pegar_proxima_task', { p_agente: 'Claude', p_projeto: 'meu-app' });

// Agente finaliza e registra no histórico
await supabase.rpc('finalizar_task', {
  p_task_id: task.id, p_status: 'concluida', p_resultado: 'Relatório...',
  p_pr_url: 'https://github.com/...', p_commit_sha: 'abc1234', p_agente: 'Claude', p_rotina: 'agendador-ia',
  p_metadados: { branch: 'feat/x', arquivos_alterados: 3 },
});

// Busca semântica: memórias do projeto + globais
const { data } = await supabase.rpc('match_memories', {
  query_embedding: embedding, match_threshold: 0.7, match_count: 5, p_projeto: 'meu-app',
});
```

## Testes locais

`database/tests/run_tests.sh` cria o banco `dashai_test` num PostgreSQL local com pgvector, simula
os papéis do Supabase (`tests/supabase_stub.sql`, só para testes), aplica 00–06 duas vezes e roda
as verificações de RLS, fila, memória (`tests/test_multi_projeto.sql`), recados e regras
(`tests/test_recados_regras.sql`) e captura paralela entre projetos (`tests/test_paralelo.sh`). Nunca rode os testes contra o Supabase.
