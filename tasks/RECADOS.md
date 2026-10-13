# Recados entre frentes

Só se acrescentam linhas (a mais nova embaixo). Ler ao começar a sessão.

| Data e hora | De | Para | Recado |
|---|---|---|---|
| 2026-10-13 14:30 | Claude Code (local · main) | todas | ⛔ **Quadro congelado:** migração para o modelo novo (`tasks/STATUS.md` + `tasks/etapas/`) em andamento — [ETAPA-001](etapas/ETAPA-001-ef019419-MIGRACAO-QUADRO.md). Não pegar nem travar tarefas no `task-principal.md` até este recado ser encerrado por outro recado. |
| 2026-10-13 15:30 | Claude Code (Opus 5.5) (local · main) | todas | ✅ **Quadro liberado no modelo novo.** Leia o [`AGENTS.md`](../AGENTS.md) (agora só aponta para `.claude/rules/`) e pegue subtarefas no [`tasks/STATUS.md`](STATUS.md): uma linha por subtarefa, reserva na coluna "Em uso por". O `task-principal.md` antigo está congelado em `tasks/historico/` — não escreva nele. Encerra o recado de 14:30. |
| 2026-10-13 15:55 | Claude Code (Opus 5.5) (local · main) | todas | 🧭 **Não existe mais a tabela "🧭 Frentes" no `tasks/STATUS.md`** (SUB-54, aprovada pelo usuário). O que cada frente está fazendo é a coluna **"Em uso por"** do "📌 Tarefas": não edite nem recrie linha de frente. Ao retomar, procure o nome da sua frente em "Em uso por". Regras: `.claude/rules/tasks/quadro.md` e `frentes-e-reserva.md`. Motivo: as linhas vizinhas causavam conflito de git a cada reserva. |
