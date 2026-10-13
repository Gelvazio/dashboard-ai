# 📁 `projects/` — projetos de IA independentes

Cada subpasta de `projects/` é um **projeto de IA independente** (ex.: `projects/meu-app-ia/`,
`projects/analise-dados-ai/`), com o **próprio código**, que **compartilha a infraestrutura central
do Dashboard AI**: banco, servidor MCP e embeddings. É a **Opção A (compartilhamento)**, definida
pelo usuário em 2026-10-13 (SUB-48,
[ETAPA-010](../tasks/etapas/ETAPA-010-43fbb21f-ESTRUTURA-PROJECTS.md)).

> **Por que compartilhar:** um único Supabase do Dashboard AI (8 GB no plano Pro) sai mais barato
> que várias contas Free (500 MB cada), e todos os projetos ganham o mesmo MCP, a mesma memória e
> o mesmo painel sem refazer nada.

---

## Estrutura

```text
dashboard-ai/                  ← agregador central (este repositório)
├── api/mcp.ts                 ← MCP compartilhado (todas as ferramentas aceitam `project`)
├── api/embedding.ts           ← geração de embeddings compartilhada
├── database/                  ← schema do banco compartilhado (tabela `projects`, RLS)
├── tasks/STATUS.md            ← quadro central
└── projects/
    ├── README.md              ← este arquivo
    └── <slug-do-projeto>/     ← um projeto filho (nome = slug em kebab-case)
        ├── README.md          ← obrigatório: o que é, como rodar, slug no banco
        ├── AGENTS.md          ← opcional: regras só deste projeto
        ├── tasks/STATUS.md    ← opcional: quadro próprio (senão usa o central)
        ├── docs/              ← opcional: documentação do projeto
        └── src/ ...           ← código do projeto
```

## O que é compartilhado e o que é de cada projeto

| Peça | Onde fica | Como o projeto usa |
|------|-----------|--------------------|
| **Banco de dados** | Supabase do Dashboard AI | Cada projeto tem uma linha na tabela `projects` (coluna `slug`); os dados dele ficam ligados por `project_id` |
| **Servidor MCP** | `api/mcp.ts` (mesmo endpoint para todos) | Passar o argumento `project: "<slug>"` nas ferramentas (`task_next`, `task_list`, `task_create`, `task_finish`, `brain_store`, `brain_search`, `brain_delete`, `agent_event`) |
| **Memória e embeddings** | Tabela `ai_memories` + `api/embedding.ts` | `brain_store`/`brain_search` com `project` gravam e buscam só nas memórias do projeto; `global: true` é a memória compartilhada por todos |
| **Classificação por nível e equipe de agentes** | `.agents/` (SUB-47) | Mesmos níveis (`LEVE`/`MEDIO`/`PESADO`) e mesmos executores |
| **Código** | `projects/<slug>/` | Próprio de cada projeto |
| **Regras de IA** | `projects/<slug>/AGENTS.md` | Opcional; completa (não substitui) o [`AGENTS.md`](../AGENTS.md) da raiz |
| **Quadro de tarefas** | Central (`tasks/STATUS.md`) ou `projects/<slug>/tasks/STATUS.md` | Decidir por projeto e registrar no `README.md` dele |

## Isolamento entre projetos

O projeto A não vê os dados do projeto B. Isso vale em duas camadas:

- **Telas e usuários (RLS):** as políticas de `database/05_rls_policies.sql` usam
  `tem_acesso_projeto(project_id, papel)` e a tabela `project_members`: cada usuário só enxerga os
  projetos de que é membro (`viewer`, `editor`, `owner`).
- **Servidor MCP:** o MCP usa a chave `service_role` (que passa por cima do RLS), então o
  isolamento ali é feito **no código**: toda ferramenta resolve o `project` (argumento →
  `MCP_DEFAULT_PROJECT` → `default`) e filtra por `project_id`. Para travar um servidor em projetos
  específicos, use `MCP_ALLOWED_PROJECTS=slug-a,slug-b` (ver [`.env.example`](../.env.example)):
  aí o `project` passa a ser obrigatório e só os slugs da lista são aceitos.

## Como criar um projeto filho

1. **Escolher o slug:** minúsculas, números e hífen (ex.: `analise-dados-ai`). O nome da pasta é
   igual ao slug.
2. **Criar a pasta** `projects/<slug>/` com um `README.md` dizendo: o que o projeto faz, como
   rodar, o slug no banco e qual quadro de tarefas ele usa.
3. **Registrar no banco** uma linha em `projects` com esse `slug` (e o `prefixo_codigo` das tarefas,
   se quiser um próprio). ⚠️ É **tarefa de banco**: só o Claude Code local, e gravar em produção
   exige **autorização explícita do usuário** (`.claude/rules/multiplas-ias.md`).
4. **Dar acesso** aos usuários pela tabela `project_members` (mesma regra do passo 3).
5. **Conectar as IAs** ao MCP central passando `project: "<slug>"` nas chamadas, ou configurar um
   servidor com `MCP_DEFAULT_PROJECT=<slug>`.
6. **Tarefas:** usar o quadro central (`tasks/STATUS.md`, com o slug no título da tarefa) ou criar
   `projects/<slug>/tasks/STATUS.md` pelo modelo de
   [`.claude/rules/tasks/quadro.md`](../.claude/rules/tasks/quadro.md).

## Regras

- Código de um projeto filho **não** importa código de outro projeto filho; o que for comum vai
  para o Dashboard AI (raiz) e é usado por todos.
- Segredos (`.env`, chaves, tokens) **nunca** entram no Git, nem dentro de `projects/`.
- As regras de Git e de tarefas da raiz valem também aqui: tudo na `main`
  ([`git-quick.md`](../.claude/rules/git-quick.md)).

## Projetos

| Projeto | Pasta | Situação |
|---------|-------|----------|
| Clone do Kiro.dev | `projects/kiro-dev-clone/` (ainda não criada) | 🔒 Trava especial — só o usuário libera ([ETAPA-008](../tasks/etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md)) |
