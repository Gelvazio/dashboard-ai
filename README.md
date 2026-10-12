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
- [Monitor em tempo real](#monitor-em-tempo-real)
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

### Chaves: o que vai para o navegador e o que fica no servidor

| Chave / variável | Onde | Observação |
|---|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Navegador (bundle) | Públicas por definição. `getSupabase()` recusa uma chave cujo JWT tenha `role = service_role`. |
| `SUPABASE_SERVICE_ROLE_KEY` | Só servidor (`api/`, scripts) | Ignora a RLS. Nunca com prefixo `VITE_`, nunca no Git. |
| `OPENAI_API_KEY` (embeddings) | Só servidor (`api/embedding.ts`, MCP) | O frontend chama `/api/embedding` com o JWT do usuário; erros do provedor não são devolvidos (podem ecoar a chave). |
| `MCP_AUTH_TOKEN` | Só servidor + clientes MCP | Obrigatório: sem ele as ferramentas de dados do `/mcp` ficam desativadas. Gere com `openssl rand -hex 32`. |

Nenhum segredo vai para o Git: só o `.env.example`, com valores vazios (`.env` e `.env.local` estão no `.gitignore`).

### RLS por projeto e papéis (`database/05_rls_policies.sql`)

- **`anon`**: nenhum acesso a tabelas ou funções. Sem login, a interface não lê nada.
- **`authenticated`**: só os projetos em que é membro (`project_members`), ou todos se for administrador global (`user_roles.role = 'admin'`, função `eh_administrador()`):
  - `viewer` lê projeto, tasks, logs e memórias do projeto;
  - `editor` também cria e altera tasks e cria, altera e exclui memórias do projeto (sem `DELETE` em tasks: exclusão lógica; o trigger de guarda impede mexer em execução/trava);
  - `owner` também altera o projeto e gerencia `project_members`;
  - memória global (`project_id` nulo): qualquer autenticado lê, só administrador escreve;
  - logs: só leitura; quem grava é o backend.
- **`service_role`**: backend/agentes (MCP, scripts, worker). Ignora a RLS e é o único que executa as funções da fila (`pegar_proxima_task`, `finalizar_task`, `liberar_trava_task`, ...) e `match_memories`.

### Login

- O dashboard exige sessão do Supabase Auth: sem sessão a `RotaProtegida` mostra o login (SUB-27.13). Configuração do provedor e das URLs de retorno em [`src/README.md`](src/README.md#autenticação-supabase-auth) (SUB-27.17).
- O link mágico usa `shouldCreateUser: false`: só entra quem já foi cadastrado. O primeiro administrador e os membros são criados como descrito em [`database/README.md`](database/README.md) (SUB-27.21).
- `sair()` encerra a sessão e esquece o projeto selecionado no navegador.

### Rotação de chaves

1. **`MCP_AUTH_TOKEN`**: gere um novo, atualize na Vercel (*Settings → Environment Variables*), faça *redeploy* e troque nos clientes MCP. O token antigo deixa de valer no deploy.
2. **`SUPABASE_SERVICE_ROLE_KEY` / anon**: no Supabase, *Project Settings → API* (ou *API Keys*), gere novas chaves/rotacione o JWT secret; atualize Vercel (`SUPABASE_*` e `VITE_SUPABASE_ANON_KEY`), scripts locais (`.env`) e faça *redeploy*. Rotacionar o JWT secret encerra todas as sessões.
3. **`OPENAI_API_KEY`**: crie uma nova no provedor, atualize na Vercel, *redeploy* e revogue a antiga.
4. Se uma chave vazou no Git, rotacione primeiro; reescrever o histórico não basta.

## Monitor em tempo real

A tela **Monitor dos Agentes** (`#/monitor`) mostra, por projeto, o que cada agente está fazendo agora: cartões de atividade, gráficos por estado e por agente, linha do tempo da última hora e o feed de eventos.

### Fluxo

```text
worker LangGraph / agente via MCP / espelho do git log
        │  insere eventos
        ▼
public.agent_events (RLS por projeto; database/07_agent_events.sql)
        │  Supabase Realtime (INSERT)
        ▼
eventService.assinarEventos → useEventosAgentes / useAtividadeAgentes → #/monitor
```

- O **worker LangGraph** emite um evento por nó (`inicio`, `progresso`, `fim`, `erro`) e `heartbeat` periódicos.
- A atividade atual vem da função `atividade_atual_agentes(p_project_id)` (último evento e último heartbeat de cada agente); a tela a reconsulta quando chega um evento novo.
- O indicador "ao vivo" mostra o estado da assinatura Realtime; em caso de erro, o botão recarrega eventos e atividade.

### Reportar progresso pelo MCP (`agent_event`)

Qualquer agente conectado ao MCP pode reportar seu progresso com a ferramenta `agent_event` (exige `MCP_AUTH_TOKEN`):

```json
{
  "jsonrpc": "2.0", "id": 1, "method": "tools/call",
  "params": {
    "name": "agent_event",
    "arguments": {
      "project": "meu-projeto",
      "agente": "Claude Code",
      "tipo": "inicio",
      "task_codigo": "SUB-12.3",
      "etapa": "implementação",
      "mensagem": "Começando o componente",
      "chave_idempotencia": "claude-SUB-12.3-inicio"
    }
  }
}
```

- `tipo`: `inicio`, `progresso`, `fim`, `erro`, `heartbeat`, `trava`, `liberacao` ou `commit`. Obrigatórios: `agente` e `tipo`.
- `chave_idempotencia` (opcional): reenviar a mesma chave não duplica o evento.
- Use em `agente` o mesmo nome usado no quadro (`task-principal.md`). Veja a seção 4 "Reporte de progresso (opcional)" do `AGENTS.md`.

### Espelho do quadro (`scripts/espelhar_quadro_eventos.py`)

Para agentes que não usam o MCP, o script transforma os commits de trava/entrega do `git log` (`lock: assumindo sub-task …` → `trava`, `feat(SUB-…)` → `commit`, `docs(board): concluir SUB-…` → `fim`) em eventos:

```bash
python3 scripts/espelhar_quadro_eventos.py --desde "2 hours ago" --projeto meu-projeto            # só lista (dry-run)
python3 scripts/espelhar_quadro_eventos.py --aplicar --desde "2 hours ago" --projeto meu-projeto  # envia
```

Com `--aplicar` ele usa `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` do `.env` (nunca rodar com chaves no navegador).

### Estados exibidos

| Estado | Quando |
|---|---|
| **Ativo** | último sinal (evento ou heartbeat) há até 2 min |
| **Ocioso** | último sinal entre 2 e 15 min |
| **Sem sinal** | mais de 15 min sem sinal (ou sem data) |
| **Finalizado** | último evento foi `fim` ou `liberacao` |

> ⚠️ O monitor é **só exibição**. Um evento `trava`, `inicio` ou `fim` **não** trava, libera nem conclui nada: a trava vale apenas quando está commitada e com push no `task-principal.md`, e uma trava presa só é liberada pelo **usuário** (`AGENTS.md`, seção 1.1). "Sem sinal" não significa tarefa abandonada.

## Validação

> Seção provisória (detalhada na SUB-26.9).

`npm run validar` roda typecheck, testes, build, checagem de variáveis de ambiente, testes
Python dos scripts e `npm audit`, e mostra um resumo no fim.

---

Coordenação entre agentes neste repositório: veja [`AGENTS.md`](AGENTS.md). Licença:
[`LICENSE`](LICENSE).
