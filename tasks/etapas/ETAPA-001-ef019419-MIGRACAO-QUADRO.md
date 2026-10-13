## Etapa 001-ef019419 — Migrar o quadro para o modelo novo e eliminar regras duplicadas

**Tarefa:** MIGRA-QUADRO · **Pedido em:** 2026-10-13 14:27 · **Executor:** Claude Code (Opus 5.5) (local · main)
**Pedido:** "MIGRE TUDO PRO MODELO NOVO E EVITE DUPLICATAS DE REGRAS" + "TODA SUBTAREFA AINDA CONTINUA TENDO
OPCAO DE SER ASSUMIDA POR QUALQUER IA, ISSO DEVE SER MANTIDO"
**Objetivo:** trocar o quadro antigo (`task-principal.md` + `task_complete.md` + `STATUS.md` da raiz) pelo modelo de
`.claude/rules/tasks/quadro.md` (`tasks/STATUS.md` + `tasks/etapas/`), com cada regra escrita em um lugar só.
**Próximo passo:** 001.3 — criar `tasks/STATUS.md`.

### Escopo

**Entra:**
- congelar o quadro antigo durante a migração (recado + aviso no `task-principal.md`);
- regras sem duplicata: `AGENTS.md` vira porta de entrada curta e guarda só o que é deste projeto; `.claude/rules/`
  vai para o Git sem as referências copiadas do projeto `aulasenai`;
- `tasks/STATUS.md` (absorve o `STATUS.md` da raiz) e `tasks/RECADOS.md`;
- uma etapa por tarefa-mãe pendente; **cada subtarefa vira uma linha própria em "📌 Tarefas"**, reservável por
  qualquer IA; a etapa guarda o plano comum e uma seção por subtarefa; os planos de tarefas pendentes saem de `docs/`
  e entram na etapa;
- histórico: `task_complete.md`, etapas antigas do `STATUS.md` da raiz e planos de `docs/` de tarefas concluídas vão
  para `tasks/historico/` sem alterar o texto;
- uma skill `proxima-task` só, para o modelo novo; tirar a `documentacao-padrao` do projeto;
- painel `index.html` passa a ler o modelo novo;
- links do README, `docs/` e espelho de eventos.

**Não entra:** executar tarefas do quadro; mudar prioridade, dependência ou conteúdo de tarefas; banco de dados.

### Riscos

| Risco | Plano B |
|---|---|
| IA com regra antiga escreve no `task-principal.md` | O arquivo fica com um aviso de uma linha apontando para `tasks/STATUS.md` |
| Painel `index.html` sem dados entre os itens 001.6 e 001.8 | Item 001.8 logo em seguida; aviso no recado |
| Duas IAs editando a mesma etapa (subtarefas da mesma mãe) | Cada uma edita só a seção da sua subtarefa; conflito → sincronizar e manter as duas mudanças |
| Perder conteúdo na conversão | Conferir contagem de blocos antes × depois; histórico movido sem alterar texto |

### Decisões

| Quando | Quem | Decisão |
|---|---|---|
| 2026-10-13 14:27 | Usuário | Aprovado o plano de 9 itens |
| 2026-10-13 14:27 | Usuário | Histórico (`task_complete.md`) vira arquivo congelado em `tasks/historico/` |
| 2026-10-13 14:27 | Usuário | Planos de `docs/` de tarefas concluídas vão para `tasks/historico/` |
| 2026-10-13 14:30 | Usuário | **Toda subtarefa continua podendo ser assumida por qualquer IA:** uma linha por subtarefa em "📌 Tarefas", com "Em uso por" próprio |
| 2026-10-13 14:32 | Usuário | **Toda tarefa-mãe tem no mínimo 1 subtarefa.** Tarefa hoje atômica (ex.: SUB-38, SUB-42, SUB-48) ganha a subtarefa `.1` com o mesmo conteúdo; reserva e trabalho são sempre na subtarefa |
| 2026-10-13 14:30 | Claude Code | Códigos atuais (`SUB-XX.N`) e o prefixo `lock: assumindo sub-task ... por ...` são mantidos (histórico e espelho de eventos continuam válidos) |

| Item | Descrição | Status | Concluído em | Verificação |
|------|-----------|--------|--------------|-------------|
| 001.1 | Aprovação do plano pelo usuário | ✅ Concluído | 2026-10-13 14:27 | Respostas no chat (4 perguntas) + regra das subtarefas às 14:30 |
| 001.2 | Congelar o quadro antigo (recado + aviso) | ✅ Concluído | 2026-10-13 14:31 | Aviso no topo do `task-principal.md` + recado em `tasks/RECADOS.md`; nenhuma trava ativa no momento |
| 001.3 | `tasks/STATUS.md` (absorve o `STATUS.md` da raiz) | 🔄 Em progresso | — | — |
| 001.4 | Etapas das tarefas pendentes (uma linha por subtarefa no `STATUS.md`) | ⬜ Pendente | — | — |
| 001.5 | Histórico em `tasks/historico/` (sem alterar texto) | ⬜ Pendente | — | — |
| 001.6 | Regras sem duplicata (`AGENTS.md` curto + `.claude/rules/` no Git) | ⬜ Pendente | — | — |
| 001.7 | Skill `proxima-task` única; tirar `documentacao-padrao` | ⬜ Pendente | — | — |
| 001.8 | Painel `index.html` lendo o modelo novo | ⬜ Pendente | — | — |
| 001.9 | Links (README, `docs/`, espelho de eventos) | ⬜ Pendente | — | — |
| 001.10 | Aceite do usuário | ⬜ Pendente | — | — |
