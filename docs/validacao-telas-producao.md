# Validação das telas contra o banco de produção (SUB-25.4, SUB-25.7 e SUB-35.32)

- **Criado em:** 2026-10-12 · **Executor:** Claude Code (Opus 5.5)
- **Aprovação:** pedido do usuário no chat ("pesquisa demais tarefas pendentes que houver de banco de
  dados e assuma todas e faça 1 por vez") e exceção à regra "nunca abrir navegador" liberada pelo
  usuário só para estas 3 tarefas
- **Quadro:** blocos `SUB-25.4`, `SUB-25.7` e `SUB-35.32` em [`task-principal.md`](../task-principal.md)
- **Conclusão:** pendente · **Tempo decorrido:** pendente

## Objetivo

Conferir as telas Fila, Logs, Memória, Configurações e Monitor rodando `npm run preview` contra o
Supabase de produção (`fcmntkzpjoetdabllabn`, scripts `00` a `08` aplicados), em 1280x800 e
390x844, e registrar o resultado no [`docs/VALIDACAO.md`](VALIDACAO.md).

## Escopo

- **Entra:** build e preview locais; navegação no painel do navegador do app; leitura do console;
  consultas de leitura pelo MCP do Supabase; registro no `docs/VALIDACAO.md`.
- **Não entra:** criar conta ou digitar senha pela IA (o usuário faz o cadastro e o login no painel);
  dados de teste no banco sem autorização explícita; screenshots grandes no repositório.

## Riscos

| Risco | Plano B |
|---|---|
| Banco sem usuário (0 em `auth.users`) | O usuário se cadastra com `gelvazio@gmail.com` e confirma o e-mail (vira admin pela SUB-40) |
| Telas vazias (sem tasks, logs, memórias ou eventos) | Conferir o estado vazio; dados de teste só com autorização (SUB-35.32 precisa de eventos) |
| Erro no console por configuração | Registrar como ressalva e criar subtarefa nova |

## Passos

| # | Subtarefa | Verificação | Status |
|---|---|---|---|
| 1 | SUB-25.4 Telas Fila e Logs | console sem erros; checklist no `docs/VALIDACAO.md` | 🔄 Em progresso |
| 2 | SUB-25.7 Telas Memória e Configurações | console sem erros; checklist no `docs/VALIDACAO.md` | ⬜ Pendente |
| 3 | SUB-35.32 Monitor em tempo real | eventos inseridos (com autorização) aparecem sem recarregar | ⬜ Pendente |
