## Etapa 013-2aa270f6 — SUB-51: Restaurar o `task_complete.md` e mover para ele toda tarefa concluída

**Tarefa:** SUB-51 · **Pedido em:** 2026-10-13 14:59 · **Criada por:** Claude Code (Opus 5.5) (local · main)
**Pedido:** "restaure o task_complete.md, e a regra de moção de tarefa concluída pra ele" · "no quadro deve
ficar apenas tarefa aberta ou em andamento; as concluídas devem todas ser movidas para o task_complete"
**Objetivo:** deixar no `tasks/STATUS.md` só o que está aberto ou em andamento, com as concluídas num arquivo
próprio.

### SUB-51.1 — Restaurar `tasks/task_complete.md`, regra de mudança e mover as linhas ✅

**Próximo passo:** mover `tasks/historico/task_complete.md` para `tasks/task_complete.md`, ajustar regras
(`quadro.md`, `ciclo-da-task.md`), painel (`index.html`) e mover as linhas ✅ do quadro.

- **Descrição:** `git mv` do histórico para `tasks/task_complete.md`; nova seção no fim com a tabela das
  concluídas do quadro novo; regra: toda linha (mãe ou subtarefa) que vira ✅ sai do `STATUS.md` e vai para o
  `task_complete.md` no mesmo commit da entrega.
- **Critérios de Aceitação:** nenhuma linha ✅ no "📌 Tarefas"; regra em um lugar só (`quadro.md`); painel lendo
  o caminho novo.
- **Entrega:** — · **Verificação:** —
