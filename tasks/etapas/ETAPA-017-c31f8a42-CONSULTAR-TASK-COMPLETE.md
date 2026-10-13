## Etapa 017-c31f8a42 — SUB-56: Consultar tarefas concluídas antes de afirmar status ou dependências

**Tarefa:** SUB-56 · **Pedido em:** 2026-10-13 16:37 · **Criada por:** Codex (GPT-6) (local · main)
**Pedido:** "Ajuste a regra em AGENTS.MD pra sempre procurar tarefas concluídas em TASK_COMPLETE.md"
**Objetivo:** orientar agentes a consultar o quadro ativo e o arquivo de concluídas antes de informar
o status ou as dependências de uma tarefa.

### SUB-56.1 — Instruir no `AGENTS.md` a consulta ao `tasks/task_complete.md`

**Próximo passo:** nenhum (concluída).

- **Descrição:** incluir uma regra curta para conferir `tasks/STATUS.md` e
  `tasks/task_complete.md` antes de afirmar status, conclusão ou dependências.
- **Critérios de Aceitação:** a orientação está explícita em `AGENTS.md` e esclarece que a ausência
  de uma tarefa no quadro ativo não significa que ela esteja pendente.
- **Entrega:** commit `feat(SUB-56.1)` · **Verificação:** orientação lida em `AGENTS.md`.
- **Anotação:** tarefa pequena, sem plano separado em `docs/`.
