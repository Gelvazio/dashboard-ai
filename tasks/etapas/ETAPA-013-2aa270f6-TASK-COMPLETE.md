## Etapa 013-2aa270f6 — SUB-52: Restaurar o `task_complete.md` e mover para ele toda tarefa concluída

**Tarefa:** SUB-52 · **Pedido em:** 2026-10-13 14:59 · **Criada por:** Claude Code (Opus 5.5) (local · main)
**Pedido:** "restaure o task_complete.md, e a regra de moção de tarefa concluída pra ele" · "no quadro deve
ficar apenas tarefa aberta ou em andamento; as concluídas devem todas ser movidas para o task_complete"
**Código:** era `SUB-51`, trocado para `SUB-52` em 2026-10-13 15:03 porque `SUB-51` já tinha sido usado (Laya Server, fundido na SUB-47; ver ETAPA-009). Os commits `1ae79b8` e `7c8a295` citam o código antigo.
**Objetivo:** deixar no `tasks/STATUS.md` só o que está aberto ou em andamento, com as concluídas num arquivo
próprio.

### SUB-52.1 — Restaurar `tasks/task_complete.md`, regra de mudança e mover as linhas ✅

**Próximo passo:** nenhum (concluída).

- **Descrição:** `git mv` do histórico para `tasks/task_complete.md`; nova seção no fim com a tabela das
  concluídas do quadro novo; regra: toda linha (mãe ou subtarefa) que vira ✅ sai do `STATUS.md` e vai para o
  `task_complete.md` no mesmo commit da entrega.
- **Critérios de Aceitação:** nenhuma linha ✅ no "📌 Tarefas"; regra em um lugar só (`quadro.md`); painel lendo
  o caminho novo.
- **Entrega:** commit `feat(SUB-52.1)` desta etapa · **Verificação:** `git mv` preservou o histórico do arquivo;
  nenhuma linha ✅ no "📌 Tarefas" (grep); MIGRA-QUADRO, SUB-42, SUB-42.1 e SUB-52/52.1 na tabela "✅ Concluídas"
  do `task_complete.md`; regra no `quadro.md` (4,9 KB, ≤ 5 KB) com ponteiro no `ciclo-da-task.md`; `index.html`
  lê `tasks/task_complete.md` (a tabela nova tem a coluna "Em uso por", lida pela mesma função do quadro).
  Sem navegador (regra do usuário).
