# ⚡ api/ — Servidor MCP serverless (Vercel)

| Arquivo | Papel |
|---|---|
| `mcp.ts` | Função serverless `POST /api/mcp` (também em `/mcp` via `vercel.json`): valida o método HTTP, CORS, token opcional, faz o parse JSON-RPC 2.0 (inclui lotes) e roteia `initialize`, `ping`, `notifications/*`, `tools/list` e `tools/call` |
| `_lib/jsonrpc.ts` | Tipos, validação e helpers de envelope JSON-RPC (`ok`, `fail`, `RpcError`, códigos -32700…-32603) |
| `_lib/tools.ts` | Registro de ferramentas (`registerTool`, `listTools`, `getTool`, `textResult`) — as primitivas `brain_store`, `brain_search`, `brain_delete` entram na SUB-07 |
| `_lib/http.ts` | Tipos mínimos compatíveis com `VercelRequest`/`VercelResponse` |
| `tsconfig.json` | Configuração TypeScript estrita das funções (`tsc -p api/tsconfig.json`) |

Arquivos/pastas iniciados por `_` não viram rotas na Vercel.

## Teste rápido

```bash
curl -s -X POST https://<seu-projeto>.vercel.app/api/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18"}}'
```

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `MCP_AUTH_TOKEN` | Opcional. Se definida, exige `Authorization: Bearer <token>` |
| `MCP_CORS_ORIGIN` | Opcional. Origem liberada no CORS (padrão `*`) |

## Ativação no Claude Code

```bash
claude mcp add --transport http dashboard-ai-brain https://<seu-projeto>.vercel.app/api/mcp
# com token: --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

> Para checagem de tipos local é preciso `typescript` e `@types/node` como devDependencies
> no `package.json` da raiz (criado na SUB-01.1).
