# DashboardAI

![Node 22+](https://img.shields.io/badge/node-%3E%3D22.12-339933?logo=node.js&logoColor=white)
![React 19](https://img.shields.io/badge/react-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/typescript-5.9-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/supabase-postgres%20%2B%20pgvector-3ECF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/deploy-vercel-000000?logo=vercel&logoColor=white)
![Licença](https://img.shields.io/github/license/Gelvazio/dashboard-ai)

Gerenciador **genérico e multi-projeto** de tasks para agentes de IA. Qualquer projeto
pode cadastrar a sua fila de tarefas, que agentes (Claude Code, Codex, Grok, Gemini etc.)
consomem com segurança via **MCP**, com travas atômicas, dependências entre tasks,
registro de execução e uma **memória persistente** (busca semântica com pgvector)
compartilhada entre os agentes. Um painel web (React) mostra a fila, os logs, a memória e
a saúde das travas de cada projeto.

## Sumário

- [Arquitetura](#arquitetura)
- [Execução local](#execução-local)
- [Banco de dados](#banco-de-dados)
- [Deploy na Vercel](#deploy-na-vercel)
- [Agentes de IA (fila via MCP)](#agentes-de-ia-fila-via-mcp)
- [Memória via MCP](#memória-via-mcp)
- [Segurança](#segurança)
- [Validação](#validação)

## Arquitetura

> Seção provisória (detalhada na SUB-26.2).

Três partes: o banco no **Supabase** (Postgres + pgvector, RLS por projeto), as funções
serverless na **Vercel** (`api/mcp.ts`, servidor MCP JSON-RPC, e `api/embedding.ts`) e o
**frontend** React 19 + Vite + TypeScript + Tailwind v4 (`src/`), que acessa o banco com a
chave anon e o login do usuário.

## Execução local

> Seção provisória (detalhada na SUB-26.3).

Requer Node 22.12+. Copie `.env.example` para `.env.local`, preencha as variáveis do seu
projeto Supabase e rode `npm ci` e `npm run dev`. `npm run check:env` confere se toda
variável usada no código está documentada no `.env.example`.

## Banco de dados

O banco é um projeto **Supabase** (PostgreSQL 15+ com a extensão `pgvector` ≥ 0.5). Os scripts
ficam em [`database/`](database/README.md) e são **idempotentes**: podem ser reaplicados sem erro
e sem perda de dados (também atualizam instalações antigas). A descrição completa de tabelas,
funções, papéis e RLS está no [`database/README.md`](database/README.md).

### 1. Aplicar os scripts

Aplique **em ordem numérica** (`00` → `06`):

| Arquivo | Conteúdo |
|---|---|
| `00_projects_roles.sql` | Projetos (`projects`), papéis globais (`user_roles`) e por projeto (`project_members`) |
| `01_tasks_schema.sql` | Fila `tasks` (código por projeto, dependências, triggers de guarda) |
| `02_logs_schema.sql` | Histórico de execuções dos agentes |
| `03_memories_schema.sql` | `pgvector` + memórias (`ai_memories`) por projeto ou globais |
| `04_rpc_functions.sql` | `pegar_proxima_task`, `finalizar_task`, `liberar_trava_task`, `match_memories` etc. |
| `05_rls_policies.sql` | RLS e permissões das tabelas e funções de 00–04 |
| `06_messages_rules.sql` | Recados entre agentes e regras por projeto |

- **SQL Editor do Supabase:** abra cada arquivo, cole e execute, na ordem da tabela.
- **psql** (use a *connection string* do painel do Supabase, em *Project Settings > Database*):

```bash
export DATABASE_URL='postgresql://postgres:<senha>@<host>:5432/postgres'
for f in database/0*.sql; do psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"; done
```

### 2. Criar o projeto e os membros

O script `00` já cria o projeto `default`. Para outro projeto e a sua equipe (SQL Editor, como
`postgres`; os `user_id` vêm de *Authentication > Users*):

```sql
-- Primeiro administrador global (vê e gerencia todos os projetos)
insert into public.user_roles (user_id, role) values ('<auth.users.id>', 'admin')
on conflict (user_id) do update set role = 'admin';

-- Novo projeto: slug em minúsculas; prefixo do código das tasks (MEUAPP-0001)
insert into public.projects (slug, nome, prefixo_codigo)
values ('meu-app', 'Meu App', 'MEUAPP')
on conflict (slug) do nothing;

-- Membros do projeto: owner > editor > viewer
insert into public.project_members (project_id, user_id, role)
select id, '<auth.users.id>', 'editor' from public.projects where slug = 'meu-app'
on conflict (project_id, user_id) do update set role = excluded.role;
```

| Papel | O que pode |
|---|---|
| `viewer` | Lê a fila, os logs e as memórias do projeto |
| `editor` | Também cria e edita tasks e memórias do projeto |
| `owner` | Também edita o projeto, a equipe e as regras |
| `admin` (global, `user_roles`) | Tudo, em todos os projetos |

Agentes, MCP e scripts usam a chave `service_role` no servidor (ignora a RLS); o navegador usa
só a chave anon com o login do usuário.

### 3. Testar localmente

`database/tests/run_tests.sh` cria o banco `dashai_test` num PostgreSQL **local** com pgvector,
simula os papéis do Supabase, aplica `00`–`06` duas vezes (idempotência) e roda as verificações
de RLS, fila, memória, recados/regras e captura paralela de tasks:

```bash
database/tests/run_tests.sh                                   # usa `sudo -u postgres psql`
PSQL="psql -h localhost -U postgres" database/tests/run_tests.sh
```

> ⚠️ Nunca rode os testes contra o Supabase: o script **apaga e recria** o banco de teste.

## Deploy na Vercel

> Seção provisória (detalhada na SUB-26.5).

O repositório já traz o `vercel.json` com as funções `api/`. Configure as variáveis de
ambiente do servidor no painel da Vercel (nunca com prefixo `VITE_` para segredos) e faça o
deploy pela integração com o GitHub.

## Agentes de IA (fila via MCP)

Os agentes se conectam ao endpoint `/mcp` com o token `MCP_AUTH_TOKEN` e usam as
ferramentas da fila (`task_next`, `task_finish`, `task_list`, `task_create`, em
[`api/_lib/queue-tools.ts`](api/_lib/queue-tools.ts)) para pegar, executar e finalizar tasks
do projeto, sempre respeitando travas e dependências.

### Configurar o cliente MCP

O servidor ([`api/mcp.ts`](api/mcp.ts)) usa o transporte **Streamable HTTP** (JSON simples, sem
SSE), protocolos `2025-06-18`, `2025-03-26` e `2024-11-05`, e responde só a `POST`:

- **URL:** `https://<seu-app>.vercel.app/mcp` (rewrite para `/api/mcp`, no `vercel.json`).
- **Autenticação:** cabeçalho `Authorization: Bearer <MCP_AUTH_TOKEN>`. Sem `MCP_AUTH_TOKEN`
  no servidor, as ferramentas de fila e memória ficam **desativadas**; com ele, um token
  errado ou ausente recebe `401`. Guarde o token numa variável de ambiente do cliente, nunca
  no repositório.
- **Projeto:** cada ferramenta aceita o argumento `project` (slug); sem ele vale
  `MCP_DEFAULT_PROJECT`. Para dar a um projeto um endpoint/token só dele, faça um deploy com
  `MCP_ALLOWED_PROJECTS=meu-app` (outros slugs e memória global são recusados).

**Claude Code:**

```bash
claude mcp add --transport http dashboard-ai https://<seu-app>.vercel.app/mcp \
  --header "Authorization: Bearer $MCP_AUTH_TOKEN"
```

**Codex** (`~/.codex/config.toml` ou `.codex/config.toml` do projeto; o token vem da variável
de ambiente `MCP_AUTH_TOKEN` exportada antes de abrir o Codex):

```toml
[mcp_servers.dashboard-ai]
url = "https://<seu-app>.vercel.app/mcp"
bearer_token_env_var = "MCP_AUTH_TOKEN"
```

Ou: `codex mcp add dashboard-ai --url https://<seu-app>.vercel.app/mcp --bearer-token-env-var MCP_AUTH_TOKEN`.

**Outros clientes** com suporte a MCP via HTTP (Cursor, Gemini CLI etc.): informe a mesma URL
e o cabeçalho `Authorization` no formato de configuração de cada um, por exemplo:

```json
{ "mcpServers": { "dashboard-ai": {
  "url": "https://<seu-app>.vercel.app/mcp",
  "headers": { "Authorization": "Bearer ${MCP_AUTH_TOKEN}" } } } }
```

**Conferir a conexão** (deve listar `task_next`, `task_finish`, `task_list`, `task_create`,
`brain_store`, `brain_search` e `brain_delete`):

```bash
curl -s https://<seu-app>.vercel.app/mcp \
  -H "Authorization: Bearer $MCP_AUTH_TOKEN" -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

**Protocolo de trabalho:** além da fila no banco, agentes que trabalham **neste repositório**
seguem o [`AGENTS.md`](AGENTS.md): `git pull --rebase` antes de tudo, no máximo 1 item travado
por agente, trava registrada no `quadro-task-principal.md` com commit + push imediatos antes de
codar, nunca mexer na trava de outro agente e registrar o SHA da entrega no histórico.

### Ciclo da fila (exemplos)

Todas as chamadas são `tools/call` (JSON-RPC 2.0) com o nome da ferramenta em `params.name`.
O argumento `project` (slug) é opcional; sem ele vale `MCP_DEFAULT_PROJECT`.

**1. Pegar a próxima task** — `task_next` trava a task elegível de maior prioridade (dependências
concluídas, ON, `executar_apos` alcançado, tentativas sobrando) para o agente:

```json
{ "jsonrpc": "2.0", "id": 1, "method": "tools/call",
  "params": { "name": "task_next", "arguments": {
    "agent": "Claude Code", "project": "meu-app", "lock_minutes": 90, "routine": "agendador-ia" } } }
```

A resposta traz `task` (com `id`, `codigo`, `titulo`, `instrucao`, `dependencias`, `tentativas`
etc.) ou `task: null` com a fila vazia (com `routine`, grava um log `sem_tarefa`).
`exclusive: true` limita a 1 task em execução por projeto.

**2. Executar** a `instrucao` da task (código, commit, PR...).

**3. Finalizar** — `task_finish` com o `id` recebido libera a trava e grava o log. Use o mesmo
`agent` do `task_next` (confere o dono da trava):

```json
{ "jsonrpc": "2.0", "id": 2, "method": "tools/call",
  "params": { "name": "task_finish", "arguments": {
    "task_id": 42, "status": "concluida", "agent": "Claude Code", "routine": "agendador-ia",
    "result": "Implementado o filtro por data, com testes.",
    "pr_url": "https://github.com/minha-org/meu-app/pull/17", "commit_sha": "a1b2c3d",
    "metadata": { "repositorio": "minha-org/meu-app", "branch": "feat/filtro-data", "arquivos_alterados": 4 } } } }
```

```json
{ "jsonrpc": "2.0", "id": 3, "method": "tools/call",
  "params": { "name": "task_finish", "arguments": {
    "task_id": 43, "status": "recusada", "agent": "Claude Code",
    "result": "A instrução pede para apagar dados de produção; precisa de decisão humana." } } }
```

```json
{ "jsonrpc": "2.0", "id": 4, "method": "tools/call",
  "params": { "name": "task_finish", "arguments": {
    "task_id": 44, "status": "erro", "agent": "Claude Code",
    "result": "Build falhou: dependência indisponível.",
    "metadata": { "erro_mensagem": "npm ERR! 503 Service Unavailable" } } } }
```

| `status` | Quando usar | Efeito |
|---|---|---|
| `concluida` | Trabalho feito | Task concluída |
| `recusada` | Fere uma regra, está ambígua ou precisa de decisão humana (explique em `result`) | Task recusada, sai da fila |
| `erro` | Falha técnica | Volta para `pendente` se ainda houver tentativas (`tentativas`/`max_tentativas`); senão fica `erro` |

**Listar** — `task_list` devolve as tasks não excluídas na ordem da fila (filtro opcional de
`status`, `limit` 1–200, padrão 50; `include_instruction` traz instrução e resultado):

```json
{ "jsonrpc": "2.0", "id": 5, "method": "tools/call",
  "params": { "name": "task_list", "arguments": {
    "project": "meu-app", "status": ["pendente", "em_execucao"], "limit": 20 } } }
```

**Criar** — `task_create` (origem `mcp`); o código `<PREFIXO>-NNNN` é gerado se `code` for
omitido. `type: "humano"` cria etapas de pessoas, que agentes não pegam:

```json
{ "jsonrpc": "2.0", "id": 6, "method": "tools/call",
  "params": { "name": "task_create", "arguments": {
    "project": "meu-app", "title": "Testes do filtro por data",
    "instruction": "Cobrir com testes unitários o filtro por data da listagem.",
    "type": "ia", "priority": 2, "order": 10, "dependencies": ["MEUAPP-0042"],
    "execute_after": "2026-10-13T08:00:00-03:00", "max_attempts": 3 } } }
```

## Memória via MCP

O servidor MCP (`/mcp`, código em [`api/_lib/brain-tools.ts`](api/_lib/brain-tools.ts)) oferece
uma **memória persistente** compartilhada entre os agentes: decisões, regras e aprendizados em
Markdown, gravados na tabela `ai_memories` com um embedding (1536 dimensões) e recuperados por
similaridade de cosseno (RPC `match_memories`, pgvector). Como as ferramentas da fila, exigem
`MCP_AUTH_TOKEN` no servidor (o cliente manda `Authorization: Bearer <token>`).

### Escopo: projeto ou global

- **Projeto:** argumento `project` (slug) → `MCP_DEFAULT_PROJECT` → `default`. O título é
  **único por projeto**: gravar de novo o mesmo título atualiza a memória (upsert).
- **Global** (`global: true`, `project_id` nulo): compartilhada por todos os projetos. Não pode
  ser combinada com `project` e é **recusada** quando o servidor está restrito por
  `MCP_ALLOWED_PROJECTS`.
- A busca do projeto inclui as globais por padrão (`include_global: true`).

### Ferramentas

| Ferramenta | Argumentos | O que faz |
|---|---|---|
| `brain_store` | `title` (obrigatório, ≤ 200), `content` (obrigatório, Markdown, ≤ 100.000), `tags` (≤ 20, cada ≤ 60, salvas em minúsculas), `project` ou `global` | Grava ou atualiza a memória (embedding de `título + conteúdo`) |
| `brain_search` | `query` (obrigatório, ≤ 8.000), `project`, `tags` (só memórias com **todas** as tags), `limit` (1–20, padrão 5), `threshold` (0 a < 1, padrão **0.5**), `include_global` (padrão `true`) | Busca semântica; cada resultado traz `title`, `scope` (`project`/`global`), `similarity` (3 casas), `tags`, `content` e `updated_at` |
| `brain_delete` | `title` ou `id` (UUID), `project` ou `global` | Remove a memória do projeto (ou das globais) |

**Limiar:** `threshold` é a similaridade mínima (1 − distância de cosseno). Sem resultados,
a resposta sugere outra consulta ou um limiar menor (ex.: `0.3`); para respostas mais
precisas, suba para `0.7`–`0.8`.

### Exemplos

Chamadas `tools/call` (JSON-RPC 2.0) ao endpoint `/mcp`:

```json
{ "jsonrpc": "2.0", "id": 1, "method": "tools/call",
  "params": { "name": "brain_store", "arguments": {
    "project": "meu-app",
    "title": "Padrão de datas na API",
    "content": "Toda data trafega em ISO 8601 UTC; a conversão para o fuso do usuário é só na interface.",
    "tags": ["api", "datas"] } } }
```

```json
{ "jsonrpc": "2.0", "id": 2, "method": "tools/call",
  "params": { "name": "brain_search", "arguments": {
    "project": "meu-app", "query": "como formatar datas no backend?",
    "tags": ["api"], "limit": 3, "threshold": 0.6 } } }
```

```json
{ "jsonrpc": "2.0", "id": 3, "method": "tools/call",
  "params": { "name": "brain_store", "arguments": {
    "global": true, "title": "Commits em português",
    "content": "Mensagens de commit no imperativo, em pt-BR.", "tags": ["git"] } } }
```

```json
{ "jsonrpc": "2.0", "id": 4, "method": "tools/call",
  "params": { "name": "brain_delete", "arguments": { "project": "meu-app", "title": "Padrão de datas na API" } } }
```

Com `curl` (o servidor exige `MCP_AUTH_TOKEN`):

```bash
curl -s https://<seu-app>.vercel.app/mcp \
  -H "Authorization: Bearer $MCP_AUTH_TOKEN" -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"brain_search","arguments":{"project":"meu-app","query":"datas"}}}'
```

Boas práticas para agentes: **buscar antes de gravar** (`brain_search`) para não duplicar,
usar títulos descritivos e estáveis (o título é a chave), e apagar (`brain_delete`) memórias
obsoletas em vez de deixá-las contradizer as novas.

## Segurança

> Seção provisória (detalhada na SUB-26.8).

Todo acesso do navegador passa pela RLS do Supabase com o login do usuário; a chave
`service_role`, a chave de embeddings e o token do MCP ficam só no servidor. Nenhum segredo
vai para o Git: só o `.env.example`, com valores vazios.

## Validação

> Seção provisória (detalhada na SUB-26.9).

`npm run validar` roda typecheck, testes, build, checagem de variáveis de ambiente, testes
Python dos scripts e `npm audit`, e mostra um resumo no fim.

---

Coordenação entre agentes neste repositório: veja [`AGENTS.md`](AGENTS.md). Licença:
[`LICENSE`](LICENSE).
