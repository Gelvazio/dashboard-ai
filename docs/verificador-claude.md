# Verificação geral das tarefas — marcador `VERIFICADOR-CLAUDE`

- **Criado em:** 2026-10-12 15:20
- **Pedido por:** Gelvazio (usuário), no chat
- **Executor:** Claude Code (Opus 5.5)
- **Status:** 🔄 Em progresso

## Objetivo

Ler todas as tarefas e subtarefas do `task-principal.md` e do `task_complete.md` e conferir, uma por
vez, se o que foi entregue está correto. O resultado fica num marcador novo em cada bloco:

```markdown
- **VERIFICADOR-CLAUDE:** PENDENTE
```

## Escopo

- **Entra:** os 246 blocos `### [ ]`/`### [x]`/`#### [ ]`/`#### [x]` dos dois quadros (15 no
  `task-principal.md`, 231 no `task_complete.md`), na ordem em que aparecem.
- **Não entra:** corrigir código. Se a verificação achar um problema, ele é registrado no marcador
  (e no relatório final); a correção é uma tarefa nova, aprovada pelo usuário.
- **Não entra:** mudar `Status`, `Commit`, `Anotação` ou `STATUS-TAREFA-CONFIRMADO-CONCLUIDO` dos
  blocos, nem as travas. O marcador é só leitura e conferência.

## Como cada item é verificado

1. O bloco é lido inteiro (descrição, critérios, commit e anotação).
2. Os commits citados existem no histórico (`git cat-file -e <sha>`).
3. Os arquivos citados existem na `main` e têm o que o critério pede (funções, seções, colunas).
4. Os testes do item fazem parte da execução geral, conferida no início:

| Checagem | Resultado em 2026-10-12 15:23 |
|---|---|
| `npm ci` | OK |
| `npm run typecheck` | ❌ falha: `tests/unit/api-aprovacao.test.ts(111,21)` TS6133 `deps` sem uso |
| `npm run build` (`tsc -b && vite build`) | ❌ falha pelo mesmo erro do `tsc -b` |
| `npx vite build` (sem `tsc`) | OK |
| `npm run check:chunks` | OK (16 chunks, todos até 500 kB) |
| `npm run typecheck:worker` | OK |
| `npm test` (Vitest) | OK: 300 testes passam, 30 pulados (integração sem banco) |
| `npm run check:env` | OK (aviso: `LANGGRAPH_DATABASE_URL` não usada em src/api/scripts) |
| Testes Python (`unittest`) | OK: 13 testes |
| `npm run test:integration` / `database/tests` | ⛔ não executados: Docker parado e sem Postgres local |

Não se abre navegador (regra do usuário). Itens de validação visual são conferidos pelo registro
deixado no `docs/VALIDACAO.md` e na anotação.

## Valores do marcador

| Valor | Quando |
|---|---|
| `✅ OK — <data hora> (Claude Code): <evidência>` | Entrega conferida e de acordo com o critério |
| `⚠️ RESSALVA — <data hora> (Claude Code): <o quê>` | Entregue, mas com ponto a corrigir ou não conferível aqui |
| `❌ FALHA — <data hora> (Claude Code): <o quê>` | Entrega não atende o critério ou quebra a validação |
| `⬜ NÃO IMPLEMENTADA — <data hora> (Claude Code): <situação>` | Tarefa ainda pendente no quadro |

## Passos

| # | Passo | Status |
|---|---|---|
| 1 | Inserir `VERIFICADOR-CLAUDE: PENDENTE` nos 246 blocos; commit e push | ✅ Concluído |
| 2 | Rodar a validação geral (tabela acima) | ✅ Concluído |
| 3 | Verificar os itens um por um, na ordem dos quadros; commit e push a cada item | 🔄 Em progresso |
| 4 | Relatório final: lista de ressalvas e falhas | ⬜ Pendente |
