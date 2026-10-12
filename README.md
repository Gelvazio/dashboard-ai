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

> Seção provisória (detalhada na SUB-26.4).

Os scripts SQL ficam em [`database/`](database/README.md) e são idempotentes: aplique-os em
ordem numérica no SQL Editor do Supabase (ou com `psql -f`).

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
