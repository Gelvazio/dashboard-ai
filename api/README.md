# ⚡ api/ — Servidor MCP serverless (Vercel)

| Arquivo | Papel |
|---|---|
| `mcp.ts` | Função serverless `POST /api/mcp` (também em `/mcp` via `vercel.json`): valida o método HTTP, CORS, token opcional, faz o parse JSON-RPC 2.0 (inclui lotes) e roteia `initialize`, `ping`, `notifications/*`, `tools/list` e `tools/call` |
| `_lib/jsonrpc.ts` | Tipos, validação e helpers de envelope JSON-RPC (`ok`, `fail`, `RpcError`, códigos -32700…-32603) |
| `_lib/tools.ts` | Registro de ferramentas (`registerTool`, `listTools`, `getTool`, `textResult`) |
| `_lib/brain-tools.ts` | Memória persistente por projeto: `brain_store`, `brain_search`, `brain_delete` (SUB-07) |
| `_lib/embeddings.ts` | Geração de embeddings (API compatível com OpenAI, 1536 dimensões) |
| `_lib/args.ts` | Validação de argumentos, resolução do projeto e exigência de `MCP_AUTH_TOKEN` |
| `_lib/queue-tools.ts` | Ferramentas da fila multi-projeto: `task_next`, `task_finish`, `task_list`, `task_create` (SUB-30) |
| `_lib/supabase.ts` | Cliente PostgREST mínimo (fetch nativo, sem dependências) usando a `service_role` — só no servidor |
| `_lib/http.ts` | Tipos mínimos compatíveis com `VercelRequest`/`VercelResponse` |
| `tsconfig.json` | Configuração TypeScript estrita das funções (`tsc -p api/tsconfig.json`) |

Arquivos/pastas iniciados por `_` não viram rotas na Vercel.

## Teste rápido

```bash
curl -s -X POST https://<seu-projeto>.vercel.app/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18"}}'
```

## Ferramentas da fila (multi-projeto)

Qualquer projeto pode usar a mesma fila: cada chamada informa `project` (slug da tabela `projects`)
ou cai em `MCP_DEFAULT_PROJECT` (e, sem ele, no projeto `default`).

| Ferramenta | O que faz | Por baixo |
|---|---|---|
| `task_next` | Pega e trava a próxima task `ia` elegível do projeto (`agent` obrigatório; `lock_minutes`, `exclusive`, `routine`). Fila vazia + `routine` grava log `sem_tarefa` | RPC `pegar_proxima_task` / `registrar_execucao_sem_tarefa` |
| `task_finish` | Encerra a task travada: `concluida`, `recusada` ou `erro` (volta à fila enquanto houver tentativas). Aceita `result`, `pr_url`, `commit_sha`, `metadata` (branch, sessao_url, arquivos_alterados…) e confere o dono da trava | RPC `finalizar_task` |
| `task_list` | Lista tasks do projeto (filtro `status`, `limit` ≤ 200, `include_instruction`) | `GET /tasks` |
| `task_create` | Cria task com `origem = 'mcp'` (`title`, `instruction`, `type` ia/humano, `priority`, `dependencies`, `execute_after`…); o código `<PREFIXO>-NNNN` é gerado pelo banco | `POST /tasks` |

Exemplo:

```bash
curl -s -X POST https://<seu-projeto>.vercel.app/api/mcp \
  -H 'Content-Type: application/json' -H "Authorization: Bearer $MCP_AUTH_TOKEN" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"task_next","arguments":{"agent":"Claude Code","project":"meu-app"}}}'
```

## Ferramentas de memória (por projeto)

| Ferramenta | O que faz |
|---|---|
| `brain_store` | Grava/atualiza (upsert por projeto + `title`) uma memória em Markdown com `tags`; gera o embedding de `title + content`. `global: true` grava memória compartilhada por todos os projetos |
| `brain_search` | Busca semântica (`query`) no projeto **e** nas memórias globais (`include_global`, padrão true), com `tags`, `limit` (≤ 20) e `threshold` (padrão 0.5); retorna a similaridade |
| `brain_delete` | Remove pelo `title` ou `id` no projeto (ou nas globais com `global: true`) |

Sem `project` (e sem `MCP_DEFAULT_PROJECT`) a memória vai para o projeto `default`. Um servidor restrito por
`MCP_ALLOWED_PROJECTS` lê as memórias globais, mas não as grava nem apaga.

Segurança: as ferramentas da fila e da memória usam a `service_role` (ignora RLS), por isso **ficam desativadas
enquanto `MCP_AUTH_TOKEN` não estiver definido** e podem ser restritas a alguns projetos com
`MCP_ALLOWED_PROJECTS`. Erros de entrada ou do banco voltam como resultado `isError`, sem derrubar o servidor.

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `MCP_AUTH_TOKEN` | Exige `Authorization: Bearer <token>`. Opcional para `initialize`/`tools/list`, **obrigatória** para as ferramentas da fila e da memória |
| `MCP_CORS_ORIGIN` | Opcional. Origem liberada no CORS (padrão `*`) |
| `SUPABASE_URL` (ou `VITE_SUPABASE_URL`) | URL do projeto Supabase (a API REST é `<url>/rest/v1`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave `service_role` — só nas variáveis da Vercel, nunca no frontend nem no repositório |
| `SUPABASE_REST_URL` | Opcional. URL REST explícita (ex.: PostgREST local em testes) |
| `MCP_DEFAULT_PROJECT` | Opcional. Slug usado quando a chamada não informa `project` (padrão `default`) |
| `MCP_ALLOWED_PROJECTS` | Opcional. Lista de slugs separados por vírgula que este servidor pode acessar |
| `OPENAI_API_KEY` | Chave da API de embeddings (obrigatória para `brain_store`/`brain_search`) |
| `EMBEDDING_MODEL` | Opcional. Modelo de embedding (padrão `text-embedding-3-small`; precisa gerar 1536 dimensões) |
| `EMBEDDING_API_URL` | Opcional. Endpoint compatível com OpenAI (padrão `https://api.openai.com/v1/embeddings`) |

## Ativação no Claude Code

```bash
claude mcp add --transport http dashboard-ai-brain https://<seu-projeto>.vercel.app/api/mcp
# com token: --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

> Para checagem de tipos local é preciso `typescript` e `@types/node` como devDependencies
> no `package.json` da raiz (criado na SUB-01.1).
