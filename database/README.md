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
| `08_projects_campos.sql` | Campos de `public.projects`: responsável, prazo, cor, ícone, URLs, prioridade e tags; checks e índice GIN |

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

**Supabase (produção/nuvem):** abra *SQL Editor* e execute os arquivos na ordem acima
(`00_projects_roles.sql` → `08_projects_campos.sql`).

**Supabase local (Docker):** para desenvolvimento e testes offline, os mesmos scripts são aplicados
como **migrations** — veja a seção seguinte.

**psql:**
```bash
for f in database/0*.sql; do psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"; done
```

Requisitos: PostgreSQL 15+ (usa `unique nulls not distinct`) com `pgvector` ≥ 0.5 (índice HNSW).

Depois de aplicar, cadastre o primeiro administrador (veja a seção abaixo).

## Cadastro de projetos (08)

O script `08_projects_campos.sql` complementa `public.projects`, criada pelo script `00`.
Ele é idempotente e deve ser aplicado depois dos scripts `00` a `07`, tanto no Supabase remoto
quanto nas migrations locais.

| Campo | Tipo e regra |
|---|---|
| `responsavel_id` | UUID do usuário responsável; referência a `auth.users(id)` com `ON DELETE SET NULL` quando o schema Auth existe |
| `data_prevista_fim` | Prazo opcional (`date`) |
| `cor` | Cor opcional no formato `#RRGGBB` |
| `icone` | Nome opcional de ícone do lucide-react: minúsculas, números e hífen, até 64 caracteres |
| `url_producao`, `url_documentacao` | URLs opcionais iniciadas por `http://` ou `https://` |
| `prioridade` | `MAXIMA`, `ALTA`, `MEDIA` ou `BAIXA`; padrão `MEDIA` |
| `tags` | Lista de texto; padrão vazio e índice GIN `projects_tags_gin` |

O status do projeto continua na coluna `ativo boolean` criada pelo `00`; a interface mostra
`1-ATIVO` ou `0-INATIVO`. A tela fica na rota `#/projetos`. Administradores criam projetos;
owners e administradores podem editá-los e ativá-los ou inativá-los. A RLS continua limitando
os projetos visíveis ao usuário.

## Scripts de produção × migrations locais

| Onde | O quê | Como se aplica |
|---|---|---|
| `database/*.sql` | **Produção** (Supabase na nuvem) — a fonte da verdade do schema | *SQL Editor* ou `psql`, na ordem `00` → `08` |
| `database/configlocal/supabase/migrations/*.sql` | **Local** (Docker), para desenvolvimento e testes offline | `npx supabase --workdir database/configlocal db reset` (ou `start`) |

- As migrations locais são **cópias idênticas** dos scripts de produção, com o prefixo de versão
  `<AAAAMMDDHHMMSS>_` para o Supabase aplicar na ordem certa:
  `20261013000000_00_projects_roles.sql` até `20261013000008_08_projects_campos.sql`.
- Mudou um script de produção? Atualize também a migration correspondente em
  `database/configlocal/supabase/migrations/` (ou crie uma nova); senão o banco local fica diferente
  do de produção.
- O banco local é **descartável** (`db reset` apaga e recria); o de produção **não**. Como alternar
  entre os dois: `docs/supabase-local-instalacao.md` e `database/configlocal/README.md`.

## Primeiro administrador e membros

O login da interface (Supabase Auth, SUB-27) só mostra os projetos em que o usuário é membro;
sem papel nenhum, quem entra vê a lista de projetos vazia. Os papéis ficam em duas tabelas:

| Tabela | Papéis | Efeito |
|---|---|---|
| `user_roles` | `admin` \| `member` (padrão) | `admin` vê e gerencia **todos** os projetos, membros e memórias globais |
| `project_members` | `owner` > `editor` > `viewer` (padrão) | por projeto: `viewer` lê; `editor` cria/edita tasks e memórias; `owner` também edita o projeto e a equipe |

**1. Crie o usuário** em *Authentication → Users → Add user* (ou deixe a pessoa se cadastrar /
entrar por link mágico) e copie o **User UID** (é o `auth.users.id`). Também dá para buscar pelo
e-mail no SQL Editor:
```sql
select id, email from auth.users where email = 'pessoa@exemplo.com';
```

**2. Primeiro administrador** — no *SQL Editor* (roda como `postgres`, ignora a RLS; pela API só
um administrador pode gravar em `user_roles`, então o primeiro tem de ser criado aqui):
```sql
insert into public.user_roles (user_id, role, email, nome)
select id, 'admin', email, 'Administrador' from auth.users where email = 'admin@exemplo.com'
on conflict (user_id) do update set role = 'admin';
```
O usuário precisa sair e entrar de novo (ou recarregar a página) para a interface buscar o papel.

**3. Membros dos projetos** — pelo SQL Editor, ou pela própria API com um usuário administrador
ou `owner` do projeto (a RLS `project_members_owner_write` permite):
```sql
insert into public.project_members (project_id, user_id, role)
select p.id, u.id, 'editor'                       -- 'owner' | 'editor' | 'viewer'
from public.projects p, auth.users u
where p.slug = 'meu-app' and u.email = 'pessoa@exemplo.com'
on conflict (project_id, user_id) do update set role = excluded.role;
```

Trocar o papel é o mesmo `insert ... on conflict do update`; remover o acesso:
```sql
delete from public.project_members
where project_id = (select id from public.projects where slug = 'meu-app')
  and user_id = (select id from auth.users where email = 'pessoa@exemplo.com');
```

Conferir quem tem acesso a um projeto:
```sql
select u.email, m.role, coalesce(r.role, 'member') as papel_global
from public.project_members m
join auth.users u on u.id = m.user_id
left join public.user_roles r on r.user_id = m.user_id
where m.project_id = (select id from public.projects where slug = 'meu-app')
order by m.role, u.email;
```

> Os e-mails acima são exemplos. Nunca coloque a chave `service_role` no frontend nem em
> arquivos versionados: agentes e scripts usam essa chave no servidor (ignora a RLS); pessoas
> usam o login com a chave anon e ficam limitadas pelos papéis acima. Um administrador também
> pode ser marcado pelo servidor via `app_metadata.role = 'admin'` no JWT (Auth Admin API).

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
