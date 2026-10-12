# ⚡ api/ — Servidor MCP serverless (Vercel)

| Arquivo | Papel |
|---|---|
| `mcp.ts` | Função serverless `POST /api/mcp` (também em `/mcp` via `vercel.json`): valida o método HTTP, CORS, token opcional, faz o parse JSON-RPC 2.0 (inclui lotes) e roteia `initialize`, `ping`, `notifications/*`, `tools/list` e `tools/call` |
| `embedding.ts` | Função serverless `POST /api/embedding`: valida a sessão Supabase e gera embeddings no servidor, sem expor a chave do provedor ao navegador (SUB-33) |
| `_lib/jsonrpc.ts` | Tipos, validação e helpers de envelope JSON-RPC (`ok`, `fail`, `RpcError`, códigos -32700…-32603) |
| `_lib/tools.ts` | Registro de ferramentas (`registerTool`, `listTools`, `getTool`, `textResult`) |
| `_lib/brain-tools.ts` | Memória persistente por projeto: `brain_store`, `brain_search`, `brain_delete` (SUB-07) |
| `_lib/embeddings.ts` | Geração de embeddings (API compatível com OpenAI, 1536 dimensões) |
| `_lib/args.ts` | Validação de argumentos, resolução do projeto e exigência de `MCP_AUTH_TOKEN` |
| `_lib/queue-tools.ts` | Ferramentas da fila multi-projeto: `task_next`, `task_finish`, `task_list`, `task_create` (SUB-30) |
| `_lib/supabase.ts` | Cliente `@supabase/supabase-js` com a `service_role` (sem sessão; timeout de 20 s) — só no servidor |
| `_lib/http.ts` | Tipos mínimos compatíveis com `VercelRequest`/`VercelResponse` |
| `tsconfig.json` | Configuração TypeScript estrita das funções (`tsc -p api/tsconfig.json`) |

Arquivos/pastas iniciados por `_` não viram rotas na Vercel.

## Teste rápido

```bash
curl -s -X POST https://<seu-projeto>.vercel.app/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18"}}'
```

## Endpoint de embeddings para o frontend

`POST /api/embedding` valida o JWT da sessão do Supabase Auth enviado pelo navegador e gera o vetor no servidor. A chave do provedor (`OPENAI_API_KEY`) nunca deve ser enviada pelo cliente. O corpo aceita `{ "texto": "..." }` com texto não vazio de até 8.000 caracteres.

### Requisição e resposta

Envie `Content-Type: application/json` e `Authorization: Bearer <access_token>` com o access token da sessão Supabase:

```json
{
  "texto": "Texto para gerar o embedding"
}
```

Em caso de sucesso, a resposta `200` contém o vetor de 1536 dimensões e o modelo usado:

```json
{
  "embedding": [0.0123, -0.0456],
  "dimensoes": 1536,
  "modelo": "text-embedding-3-small"
}
```

O vetor acima é abreviado. A resposta real contém 1536 números. Erros são JSON no formato `{ "erro": "..." }`.

| Status | Quando ocorre |
|---|---|
| `204` | Preflight CORS com `OPTIONS` |
| `400` | Corpo ausente ou JSON inválido, ou `texto` ausente, vazio ou de tipo incorreto |
| `401` | Token ausente, inválido ou sessão expirada; a resposta inclui `WWW-Authenticate: Bearer` |
| `405` | Método diferente de `POST` e `OPTIONS`; o cabeçalho `Allow` informa os métodos aceitos |
| `413` | `texto` com mais de 8.000 caracteres |
| `502` | O provedor de embeddings falhou ou devolveu um vetor inválido; detalhes internos não são expostos |
| `503` | Serviço de autenticação do Supabase indisponível |

### Exemplo com curl

```bash
curl -sS -X POST "https://<seu-projeto>.vercel.app/api/embedding" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -d '{"texto":"Texto para gerar o embedding"}'
```

`SUPABASE_ACCESS_TOKEN` deve conter o access token da sessão do usuário, não uma chave de API do Supabase.

### Variáveis do servidor

| Variável | Uso |
|---|---|
| `SUPABASE_URL` | URL do projeto usada para validar a sessão em `/auth/v1/user` |
| `SUPABASE_ANON_KEY` | Chave preferida para validar a sessão Supabase; está listada no `.env.example` |
| `SUPABASE_SERVICE_ROLE_KEY` | Fallback para a validação se `SUPABASE_ANON_KEY` não estiver definida; mantenha somente nas variáveis secretas do servidor |
| `OPENAI_API_KEY` | Chave do provedor de embeddings; obrigatória e somente no servidor |
| `EMBEDDING_MODEL` | Opcional; modelo usado (padrão `text-embedding-3-small`), que deve retornar 1536 dimensões |
| `EMBEDDING_API_URL` | Opcional; endpoint compatível com OpenAI (padrão `https://api.openai.com/v1/embeddings`) |

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
| `SUPABASE_URL` | URL do projeto usada pelo servidor; obrigatória para validar a sessão em `POST /api/embedding` |
| `VITE_SUPABASE_URL` | URL pública usada pelo frontend; é fallback legado do cliente de dados em `api/_lib/supabase.ts`, mas não substitui `SUPABASE_URL` na validação da sessão |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave `service_role` — só nas variáveis da Vercel, nunca no frontend nem no repositório |
| `SUPABASE_ANON_KEY` | Chave anon usada para validar a sessão do usuário em `POST /api/embedding` (fallback: `SUPABASE_SERVICE_ROLE_KEY`) |
| `SUPABASE_REST_URL` | Opcional. Redireciona a API REST para um PostgREST (ex.: testes locais) |
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

> Checagem de tipos local: `npm install` e `npm run typecheck:api` (ou `npm run typecheck`, que
> também verifica o frontend). `typescript` e `@types/node` estão nas devDependencies da raiz.

> Runtime: **Node.js 22+** (`engines` no `package.json`, `.nvmrc`). O `@supabase/supabase-js` atual
> exige WebSocket nativo e falha no Node 20 (já sem suporte desde abril de 2026).
