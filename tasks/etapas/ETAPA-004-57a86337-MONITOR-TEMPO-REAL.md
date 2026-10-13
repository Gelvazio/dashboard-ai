## Etapa 004-57a86337 — SUB-35: Monitor em Tempo Real dos Agentes

**Tarefa:** SUB-35 · **Migrada em:** 2026-10-13 (ETAPA-001) · **Executor:** por subtarefa (coluna "Em uso por" do `tasks/STATUS.md`)
**Próximo passo:** nenhum — SUB-35 concluída; validação de integração cancelada a pedido do usuário.

> Bloco migrado do `task-principal.md` sem alterar o texto. **Status, prioridade, dependências e reserva** de cada subtarefa ficam só no [`tasks/STATUS.md`](../STATUS.md); aqui ficam descrição, critérios, entrega e anotações. Quem reserva uma subtarefa edita só a seção dela.

### Tarefa-mãe

- **Descrição:** Tela `#/monitor` que mostra, ao vivo, o que cada agente de IA está fazendo agora — versão do `dashboard-task-principal.html` (que lê o quadro em Markdown do GitHub a cada `POLL_MS` e desenha gráficos Chart.js por status, fase e agente) apoiada no **banco**: nova tabela `agent_events` (por projeto, com RLS e publicação no Supabase Realtime), assinatura Realtime no frontend (sem polling), cartões de atividade atual por agente (heartbeat), gráficos por estado e por agente, linha do tempo das etapas e feed de eventos. Os eventos vêm do worker LangGraph (SUB-28, cada nó emite `inicio`/`fim`/`erro` + heartbeat), da ferramenta MCP `agent_event` (agentes como Claude Code e Codex) e, opcionalmente, de um espelho dos commits de lock/entrega do quadro. Biblioteca de gráficos: Chart.js via `react-chartjs-2` (mesma do HTML atual, registro só dos elementos usados, canvas leve para atualização contínua). **Só exibição:** não há regra de expiração de trava; travas continuam sendo liberadas só pelo usuário.
- **Escopo por projeto:** eventos, atividade e assinatura filtrados pelo projeto selecionado (`project_id`, ver SUB-29); genérico para qualquer projeto.
- **Critérios de Aceitação:** Com dois agentes emitindo eventos, a tela atualiza em segundos sem recarregar; viewer de outro projeto não vê os eventos; build sem chunk acima de 500 kB (gráficos em chunk da tela).
- **Commit:** pendente
- **Anotação:** **Validação visual (SUB-35.32, 2026-10-12 19:03, Claude Code (Opus 5.5)):** monitor conferido contra o Supabase de produção; tempo real OK (confirmado pelo usuário); bug do Chart.js (`BarController` não registrado) corrigido em `4f4e90f`; detalhes em `docs/VALIDACAO.md`.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 15:45 (Devin): tarefa-mãe pendente: 45 de 46 subtarefas concluídas (SUB-35.1 a SUB-35.45) com commits verificados (9f5692f, 54cdea9, 2d714d4, 95f12ff, d9d9a6c, e7a39cd, b518611, 5a09109, 89c6a43, 47fb521, c43ad04, b045c12, 8628ec3, 7e268fb, c47df6b, 860e0c9, 7d2181e, 6391c1b, 7d2181e, a7beb5a, 73d73ad, cabdbc0, da9ff65, 4bc0b25, a2d2ed9, 6456092, 173fc36, 0d90464, 9c2edf5, 2d1cd0a, 8dff43b, 2750ba4, 8e63d4c, bd6563e, 469ce5c, 64c0b11, 34bf1c1, 4a1156d, 176aadb, 0263ae9, 53a5c93, e8917a3, 9b785dc, dcdbc96). Arquivos do monitor presentes (src/components/monitor/, src/hooks/, src/lib/monitor.ts, src/views/MonitorView.tsx, database/07_agent_events.sql). Restam: SUB-35.32 (validação visual) e SUB-35.46 (validação automatizada).

### SUB-35.46 — Validação automatizada da SUB-35

**Próximo passo:** nenhum — escopo restante concluído; validação de banco cancelada pelo usuário.

- **Descrição:** Validar o código sem banco pelos comandos da SUB-35.46.1. A validação de banco da
  SUB-35.46.2 foi cancelada pelo usuário e não foi executada.
- **Critérios de Aceitação:** Validações sem banco concluídas; item de integração removido por decisão
  do usuário.
- **Commit:** entrega registrada em `tasks/task_complete.md`
- **Anotação:** Fechada após a conclusão da SUB-35.46.1. Em 2026-10-13, Gelvazio pediu a remoção da
  SUB-35.46.2; a validação de integração permanece não executada.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente`; a dependência SUB-35.32 continua `pendente` (marcador `⬜ NÃO IMPLEMENTADA`, Devin, 15:50), então a validação automatizada da SUB-35 não foi executada.

### SUB-35.46.1 — Validação sem banco (typecheck, testes, build, Python)

**Próximo passo:** nenhum — entregue; a validação de banco foi cancelada por pedido do usuário.

- **Descrição:** Parte sem banco da SUB-35.46, separada em 2026-10-13 15:19 por Claude Code (Opus 5.5) (nuvem · main) pela regra de `multiplas-ias.md` (o `npm run test:integration` é tarefa de banco). Rodar `npm run typecheck`, `npm test`, `npm run build` e os testes Python (`scripts/test_*.py`) e registrar o resultado.
- **Critérios de Aceitação:** Tudo verde, ou cada falha registrada com o comando e a saída.
- **Entrega:** commit desta entrega (`feat(SUB-35.46.1)`), validação feita sobre a `main` em `ae50c56` · **Verificação:** comandos rodados em sessão na nuvem (Node v22.22.0, npm 10.9.4) depois de `npm ci` (163 pacotes)
- **Anotação:** 2026-10-13 15:20 — Claude Code (Opus 5.5) (nuvem · main). Resultado, tudo verde:

  | Comando | Resultado | Tempo |
  |---|---|---|
  | `npm run typecheck` | ✅ OK | 13 s |
  | `npm test` (Vitest) | ✅ 44 arquivos OK, 8 pulados · 301 testes OK, 30 pulados (331) | 6 s |
  | `npm run build` | ✅ OK | 12 s |
  | `python3 -m unittest scripts/test_espelhar_quadro_eventos.py scripts/test_sincronizar_tasks.py` | ✅ 13 testes OK | < 1 s |

  Os itens pulados do Vitest são os que dependem de variáveis de ambiente/banco (sem `.env` na nuvem); eles são cobertos pela SUB-35.46.2 (`npm run test:integration`, só Claude Code local). Nada foi alterado no código.

### SUB-35.46.2 — Validação de banco (`npm run test:integration`)

**Próximo passo:** cancelada em 2026-10-13 por pedido do usuário; a validação não foi executada.

- **Descrição:** Parte de banco da SUB-35.46 (separada em 2026-10-13 15:19): rodar `npm run test:integration` e registrar o resultado. **Só o Claude Code local** (`multiplas-ias.md`).
- **Critérios de Aceitação:** Tudo verde, ou cada falha registrada com o comando e a saída.
- **Entrega:** — · **Verificação:** —
- **Anotação:** Cancelada a pedido explícito de Gelvazio em 2026-10-13. Removida do quadro ativo;
  nenhum teste de integração foi executado.

### Encerramento da SUB-35 — 2026-10-13

O usuário pediu a remoção da validação de banco SUB-35.46.2. As subtarefas restantes estavam
concluídas; a SUB-35 e a SUB-35.46 foram encerradas com essa ressalva. A validação de banco não foi
executada.
