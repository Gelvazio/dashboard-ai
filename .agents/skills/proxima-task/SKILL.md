---
name: proxima-task
description: Executa a próxima subtarefa livre do quadro task-principal.md seguindo o protocolo de trava do AGENTS.md (pull, lock, implementação, validação, conclusão e liberação). Use quando pedirem para "pegar a próxima task", trabalhar no quadro, assumir/concluir uma SUB-XX ou liberar uma trava no dashboard-ai.
---

# Próxima task do quadro (dashboard-ai)

Fluxo de uma subtarefa por vez no quadro `task-principal.md`. A fonte da verdade é o `AGENTS.md`: em caso de dúvida ou divergência, ele prevalece.

## Procedimento

1. **Sincronize primeiro:** rode `git pull --rebase origin main` antes de ler qualquer arquivo local.
2. **Leia o quadro:** em `task-principal.md`, confira `🔒 TRAVA ATIVA NO MOMENTO`, todos os blocos `### 🔒 TRAVA ADICIONAL — ...` e o `📊 Resumo de Progresso`. Não leia o `task_complete.md` para escolher tarefa: ele só guarda os blocos já concluídos (a lista "livres agora" é um atalho, mas confirme no bloco da subtarefa).
3. **Escolha um item livre:** subtarefa (`#### [ ] SUB-XX.Y`) ou tarefa atômica (`Subtarefas: Nenhuma (atômica)`) com `Status: pendente`, sem trava de ninguém e com todas as dependências de `Depende de:` em `concluido`. Nunca escolha uma tarefa-mãe com filhas nem um item travado por outro agente. Se o item passar de ~3 min de trabalho (mais de 1 função/componente/arquivo de teste), subdivida-o no quadro (`SUB-XX.Y.1`, ...) antes de codificar.
4. **Grave a trava** em `task-principal.md`:
   - adicione um bloco `### 🔒 TRAVA ADICIONAL — <Seu nome> — SUB-XX.Y` (tabela com Status 🔴 **OCUPADO**, sub-task, título, agente, data/hora de início, bloqueio **ATIVADO**), logo abaixo da trava principal;
   - no bloco da subtarefa: `Status: em_execucao` e `Executor: <Seu nome> (início: AAAA-MM-DD HH:MM)`;
   - na lista `Subtarefas:` da tarefa-mãe: marque o item como `(em_execucao)`;
   - no resumo: atualize `Em Execução` e retire o item de "livres agora".
5. **Faça commit e push só do quadro, na hora:** `git add task-principal.md && git commit -m "lock: assumindo sub-task SUB-XX.Y por <Seu nome>" && git push origin main`. Se o push for recusado, rode `git pull --rebase origin main` e releia o quadro; se outro agente pegou o mesmo item, desfaça seu lock local e volte ao passo 3.
6. **Implemente só o escopo da subtarefa** (Descrição + Critérios de Aceitação). Se encontrar um problema fora do escopo, registre-o como uma nova subtarefa `pendente` no quadro em vez de corrigi-lo agora.
7. **Valide com Node >= 22.12** (ver `.nvmrc`/`engines`): `npm run typecheck`, `npm test`, `npm run build`, `npm run check:chunks` e `npm run check:env` (ou tudo de uma vez com `npm run validar`). Para mudanças no worker, rode também `npm run typecheck:worker`. Corrija até ficar tudo verde.
8. **Faça commit da entrega:** `git add <arquivos da tarefa>` (nunca `git add .`) e `git commit -m "feat(SUB-XX.Y): <o que foi feito> por <Seu nome>"`.
9. **Conclua no quadro:**
   - no bloco: `#### [x]`, `Status: concluido`, `Executor` com o horário de conclusão, `Commit:` com o SHA curto da entrega, `Anotação:` técnica (o que foi feito, arquivos, testes, desvios e achados) e `STATUS-TAREFA-CONFIRMADO-CONCLUIDO: AAAA-MM-DD HH:MM — <Seu nome>: entrega verificada (...)` (seção 5 do `AGENTS.md`);
   - na lista da tarefa-mãe: `(concluido, <sha>)`; se todas as filhas estiverem concluídas, feche também a tarefa-mãe;
   - **mova o bloco concluído** para o fim da fase correspondente em `task_complete.md` (o bloco inteiro; no quadro fica só a referência `(concluido, <sha>)` na lista da tarefa-mãe). Tarefa-mãe fechada também vai para lá;
   - remova o seu bloco `TRAVA ADICIONAL` e recalcule o resumo (em execução, livres, bloqueadas, concluídas). Itens que dependiam deste podem ter ficado livres.
10. **Faça commit e push da conclusão:** `git add task-principal.md task_complete.md && git commit -m "docs(board): concluir SUB-XX.Y (<sha>) e liberar trava de <Seu nome>"`, depois `git pull --rebase origin main` e `git push origin main`.
11. **Só então** escolha a próxima subtarefa (volte ao passo 1) ou reporte ao usuário.

## Especificações

- No máximo 1 item travado por agente; a trava só vale depois de commitada e enviada (push).
- O nome do agente é o mesmo em todos os lugares: `Executor:`, bloco de trava, mensagens de commit e anotação.
- Ao final, `main` remota com o commit `feat(...)` da entrega + o `docs(board): concluir ...`, quadro sem a sua trava e validações verdes.
- Marque `STATUS-TAREFA-CONFIRMADO-CONCLUIDO` com data só se os critérios foram realmente verificados; placeholder ou entrega parcial fica `PENDENTE` e a subtarefa continua `pendente`.

## Dicas

- O monitor (`agent_event` via MCP, seção 4 do `AGENTS.md`) é opcional e não substitui o lock no quadro.
- Scripts auxiliares ficam na pasta de trabalho do agente, nunca em `/tmp`.
- Dependência que não aparece como bloco no `task-principal.md` está `concluido` no `task_complete.md`; abra esse arquivo só para consultar a entrega (busque pelo código, ex.: `grep -n "SUB-28.4:" task_complete.md`) ou reabrir a tarefa, trazendo o bloco de volta ao quadro como `pendente`.
- Se as dependências estiverem `concluido` mas o código delas for placeholder, não marque a sua como concluída em cima disso: registre o achado e reabra/crie a subtarefa correspondente.

## Proibido

- Liberar, editar ou sobrescrever a trava de outro agente (só o usuário pode pedir isso).
- `git push --force`, `git merge` para sincronizar ou `git add .`.
- Travar uma tarefa-mãe com subtarefas ou um item com dependência não concluída.
- Recriar o antigo `quadro-task-principal.md`.
