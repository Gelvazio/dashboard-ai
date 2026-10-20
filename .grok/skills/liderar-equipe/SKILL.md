---
name: liderar-equipe
description: Fluxo do líder da equipe de agentes do Claude Code no Dashboard AI - sincroniza, classifica o nível das subtarefas livres, reserva UMA por vez, delega ao executor do nível (executor-leve, executor-medio ou executor-pesado), confere e valida a entrega, commita e segue para a próxima. Use quando o usuário pedir "rode a equipe", "lidere a equipe", "faça as tarefas com os agentes" ou "/liderar-equipe". Só para o Claude Code com Opus 5.5 ou superior, ou Fable, como líder.
---

# Liderar a equipe (liderar-equipe)

Regras: `AGENTS.md` → `.claude/rules/` (quadro, reserva, ciclo, git) e a seção "Nível das
subtarefas" de `.claude/rules/multiplas-ias.md`. Esta skill só descreve **o trabalho do líder**.

> Fonte única: `.agents/skills/liderar-equipe/SKILL.md`. As cópias em `.claude/`, `.grok/` e
> `.gemini/commands/` são geradas no commit — **não editar as cópias**.

## Quem é quem

| Papel | Quem | Pode |
|---|---|---|
| **Líder** | esta sessão (Claude Code com Opus 5.5+ ou Fable) | Git, quadro, validar, decidir |
| `classificador-tarefas` | subagente (Haiku + Jev) | só acrescentar `- **Nível:**` nas etapas |
| `executor-leve` / `executor-medio` / `executor-pesado` | subagentes (Haiku / Sonnet / Opus) | só editar os arquivos da subtarefa |

## Modo: **uma subtarefa por vez, na mesma pasta**

Decisão do usuário (2026-10-13): **nada em paralelo**. Uma subtarefa só começa depois que a anterior
foi entregue (commit + push) ou liberada. Assim não há dois agentes nos mesmos arquivos nem no Git.

## Ciclo do líder

1. **Sincronizar:** `git fetch --all --prune` + `git pull --rebase origin main`; ler
   `tasks/STATUS.md` e `tasks/RECADOS.md`.
2. **Classificar:** subtarefas livres sem `- **Nível:**` → subagente `classificador-tarefas` com a
   lista de códigos. Conferir o relatório (nível plausível pelos sinais da skill
   `classificar-tarefa`; na dúvida, subir) e commitar:
   `docs(board): classificar <códigos> por <líder>`.
3. **Escolher UMA** subtarefa livre pela skill `proxima-task` (prioridade, dependências ✅, sem
   reserva nem 🔒). Tarefa **grande** (`ciclo-da-task.md`) sem plano aprovado → parar e pedir ao
   usuário.
4. **Reservar** em nome do executor, como frente própria — ex.:
   `Claude Code (Sonnet · executor-medio) (local · main) (desde <data hora>)` — e fazer
   `lock: assumindo sub-task <COD> por <frente do executor>` + push **antes** de delegar.
5. **Delegar** pelo nível: `LEVE` → `executor-leve`, `MEDIO` → `executor-medio`,
   `PESADO` → `executor-pesado`. Mandar: código, nome da reserva, descrição e critérios (seção da
   etapa) e a **lista exata de arquivos** que pode alterar.
6. **Conferir** o relatório e o diff: `git diff --name-only` só com os arquivos da lista (arquivo a
   mais → desfazer esse arquivo ou devolver ao executor); critérios atendidos.
7. **Validar** conforme `.claude/rules/testes-validacao.md` (`npm run validar` quando mexer em
   código). Falhou → devolver ao executor com o erro (até 2 vezes) ou assumir a correção.
8. **Entregar:** seção da subtarefa com entrega e verificação; linha ✅ movida para o
   `tasks/task_complete.md`; **1 commit** `feat(<COD>): … por <frente do executor>` com os
   arquivos + quadro; push; mostrar a tela de pendentes (`git-quick.md`).
9. **Próxima:** voltar ao passo 1. Parar quando não houver subtarefa livre, quando o usuário pedir,
   ou quando a próxima precisar de decisão/autorização do usuário.

## Casos especiais

- **Banco de dados** (SQL, RLS, migração, `database/`): o próprio líder faz, se a sessão tiver
  acesso ao banco; senão, liberar e anotar (`multiplas-ias.md`). Produção exige autorização do
  usuário.
- **Executor travou ou a subtarefa é maior que o nível:** liberar a reserva (`—` + `⬜ Pendente`),
  dividir ou reclassificar, anotar na seção e voltar ao passo 1.
- **Tipo de subagente indisponível** (ex.: sessão na nuvem sem o repositório registrado como raiz):
  usar um agente geral com o **modelo do nível** e o texto do `executor-*.md` correspondente no
  pedido (piloto SUB-47.11).
- **Executor aponta problema fora da lista de arquivos:** o líder decide; se corrigir, registra no
  campo de entrega como "ajuste do líder".
- **Push recusado:** `fetch` + `pull --rebase`, reler o quadro e repetir o push. Nunca `--force`.

## Proibido

- ⛔ Mais de uma subtarefa em andamento ao mesmo tempo.
- ⛔ Executor ou classificador usando Git ou editando o quadro (fora a linha `Nível`).
- ⛔ Pular a reserva, o commit por subtarefa ou a validação.
- ⛔ Mudar prioridade, ou pegar subtarefa reservada por outra frente ou sob 🔒 trava especial.
