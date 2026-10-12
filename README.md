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

> Seção provisória (detalhada nas SUB-26.6 e SUB-26.10).

Os agentes se conectam ao endpoint `/mcp` com o token `MCP_AUTH_TOKEN` e usam as
ferramentas da fila (`task_next`, `task_finish`, `task_list`, `task_create`) para pegar,
executar e finalizar tasks do projeto, sempre respeitando travas e dependências.

## Memória via MCP

> Seção provisória (detalhada na SUB-26.7).

As ferramentas `brain_store`, `brain_search` e `brain_delete` gravam e consultam memórias em
Markdown por projeto (ou globais), com busca por similaridade de embeddings.

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
