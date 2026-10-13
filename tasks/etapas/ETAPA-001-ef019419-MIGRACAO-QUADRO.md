## Etapa 001-ef019419 — Migrar o quadro para o modelo novo e eliminar regras duplicadas

**Tarefa:** MIGRA-QUADRO · **Pedido em:** 2026-10-13 14:27 · **Executor:** Claude Code (Opus 5.5) (local · main)
**Pedido:** "MIGRE TUDO PRO MODELO NOVO E EVITE DUPLICATAS DE REGRAS" + "TODA SUBTAREFA AINDA CONTINUA TENDO
OPCAO DE SER ASSUMIDA POR QUALQUER IA, ISSO DEVE SER MANTIDO"
**Objetivo:** trocar o quadro antigo (`task-principal.md` + `task_complete.md` + `STATUS.md` da raiz) pelo modelo de
`.claude/rules/tasks/quadro.md` (`tasks/STATUS.md` + `tasks/etapas/`), com cada regra escrita em um lugar só.
**Próximo passo:** 001.7 — deixar uma só skill `proxima-task` (em `.claude/skills/`) e tirar a `documentacao-padrao` do projeto.

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
| 2026-10-13 15:05 | Claude Code | Seção 5 (marcador `STATUS-TAREFA-CONFIRMADO-CONCLUIDO`) e seção 6 (plano em `docs/`) do `AGENTS.md` antigo substituídas pelo campo **Verificação** da subtarefa e pelo **plano na etapa**; regras 9 e 10 da seção 1.1 (resumo e mover concluídas) deixam de existir porque o modelo novo não tem resumo nem move blocos |
| 2026-10-13 15:05 | Claude Code | SUB-42 dada como concluída pela reescrita do `AGENTS.md` (os trechos que ela mandava tirar sumiram); plano da SUB-41 mantido intacto como anexo |
| 2026-10-13 14:30 | Claude Code | Códigos atuais (`SUB-XX.N`) e o prefixo `lock: assumindo sub-task ... por ...` são mantidos (histórico e espelho de eventos continuam válidos) |

| Item | Descrição | Status | Concluído em | Verificação |
|------|-----------|--------|--------------|-------------|
| 001.1 | Aprovação do plano pelo usuário | ✅ Concluído | 2026-10-13 14:27 | Respostas no chat (4 perguntas) + regra das subtarefas às 14:30 |
| 001.2 | Congelar o quadro antigo (recado + aviso) | ✅ Concluído | 2026-10-13 14:31 | Aviso no topo do `task-principal.md` + recado em `tasks/RECADOS.md`; nenhuma trava ativa no momento |
| 001.3 | `tasks/STATUS.md` (absorve o `STATUS.md` da raiz) | ✅ Concluído | 2026-10-13 14:45 | Riscos, decisões, pendências e lições trazidos do `STATUS.md` antigo; aceites antigos listados em Pendências |
| 001.4 | Etapas das tarefas pendentes (uma linha por subtarefa no `STATUS.md`) | ✅ Concluído | 2026-10-13 14:45 | Script copia os blocos literalmente: 88 blocos pendentes (11 mães + 77 subtarefas) → 11 etapas (002 a 012) + 91 linhas (77 + 3 subtarefas `.1` novas: SUB-38.1, SUB-42.1, SUB-48.1); 80 seções de subtarefa; planos de `docs/` de SUB-38, SUB-45 e SUB-47 embutidos nas etapas |
| 001.5 | Histórico em `tasks/historico/` (sem alterar texto) | ✅ Concluído | 2026-10-13 14:50 | `git mv` de `task-principal.md`, `task_complete.md`, `STATUS.md` (→ `STATUS-antigo.md`) e dos planos de SUB-40 e validação de telas; planos de SUB-38/45/47 removidos de `docs/` (conteúdo já nas etapas); `task-principal.md` da raiz virou aviso de uma linha; `tasks/historico/README.md` explica o conteúdo |
| 001.6 | Regras sem duplicata (`AGENTS.md` curto + `.claude/rules/` no Git) | ✅ Concluído | 2026-10-13 15:05 | `AGENTS.md` 547 → 39 linhas de regra + anexo da SUB-41 intacto; cada seção antiga mapeada para um arquivo de `.claude/rules/` (tabela no chat); 4 arquivos novos (`multiplas-ias`, `reporte-progresso`, `testes-validacao`) e referências ao projeto `aulasenai` removidas do `INDEX`/`essentials`/`git-quick`; todos ≤ 5 KB; `CLAUDE.md` aponta para `.claude/rules/`; `.gitignore` com `settings.local.json` e `launch.json`; SUB-42 resolvida |
| 001.7 | Skill `proxima-task` única; tirar `documentacao-padrao` | 🔄 Em progresso | — | — |
| 001.8 | Painel `index.html` lendo o modelo novo | ⬜ Pendente | — | — |
| 001.9 | Links (README, `docs/`, espelho de eventos) | ⬜ Pendente | — | — |
| 001.10 | Aceite do usuário | ⬜ Pendente | — | — |
