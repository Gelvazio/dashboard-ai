## Etapa 006-5d507457 — SUB-42: Tirar do `AGENTS.md` as referências a tarefas específicas (regras genéricas)

**Tarefa:** SUB-42 · **Migrada em:** 2026-10-13 (ETAPA-001) · **Executor:** por subtarefa (coluna "Em uso por" do `tasks/STATUS.md`)
**Próximo passo:** escolher uma subtarefa livre no `tasks/STATUS.md` (cada subtarefa tem o próprio próximo passo abaixo).

> Bloco migrado do `task-principal.md` sem alterar o texto. **Status, prioridade, dependências e reserva** de cada subtarefa ficam só no [`tasks/STATUS.md`](../STATUS.md); aqui ficam descrição, critérios, entrega e anotações. Quem reserva uma subtarefa edita só a seção dela.

### Tarefa-mãe

- **Descrição:** Mesma regra do usuário da SUB-41 (o `AGENTS.md` só tem regras, nenhuma tarefa). Trechos encontrados em 2026-10-12 que tratam de tarefas específicas:
  1. **Seção 1.1, item 3 (linha ~113)** — "⛔ **KIRO-DEV-CLONE**: esta tarefa está TRAVADA PARA TODAS AS IAS…": é o **estado** de uma tarefa, que já está registrado no quadro (bloco `### 🔒 TRAVA ESPECIAL: KIRO-DEV-CLONE` do `task-principal.md`). Trocar por regra genérica: "Tarefas com bloco `### 🔒 TRAVA ESPECIAL: <código>` no `task-principal.md` estão travadas para todas as IAs (inclusive as subtarefas); só o usuário cria ou remove essa trava; ela tem precedência sobre o protocolo normal e sobre a prioridade (seção 1.2)". Ajustar a regra 3 da seção 1.2 ("🔴 trava especial") se precisar.
  2. **Seção 1.2, tabela (linha ~160)** — `MAXIMA` "(ex.: `SUB-38`, verificação geral)": tirar o exemplo da tarefa.
  3. **Seção 4 (linhas ~244-272)** — "monitor em tempo real (SUB-35)", exemplos com `SUB-35.45` e "espelho … (SUB-35.42/35.43)": tirar os códigos de tarefa e usar `SUB-XX` nos exemplos (a regra e os nomes de arquivos ficam).
  4. **Seção 5 (linha ~293 e a nota da linha ~299)** — "o marcador `VERIFICADOR-CLAUDE` da `SUB-38`" e "⚠️ Esta regra foi adicionada em 2026-10-12 após a restauração do quadro…": tirar a referência à SUB-38 (dizer só "o marcador `VERIFICADOR-CLAUDE`, quando existir") e tirar a nota histórica (o Git guarda o histórico).
  5. **Avisos do cabeçalho (linhas ~3 e ~5)** — "o antigo `quadro-task-principal.md` foi incorporado ao `task-principal.md`" e "Já houve agente lendo o quadro 'sincronizado' com o remoto vários commits à frente": são histórico, não regra. Deixar só a regra ("Travas, status e tarefas ficam só no `task-principal.md`; não criar outro quadro" e "rodar `git fetch --all --prune` antes do `pull`…"), sem o relato do que aconteceu.
  Não mudar o sentido de nenhuma regra; só tirar o que é tarefa ou histórico de tarefa. Exemplos genéricos (`SUB-XX`, `SUB-01.1`, `SUB-19.3`, nome de agente fictício e data de exemplo na tabela da seção 5) podem ficar.
- **Critérios de Aceitação:** `grep -n "SUB-[0-9]\|KIRO-DEV-CLONE" AGENTS.md` sem resultados (os `SUB-XX`/`SUB-01.1` genéricos de exemplo podem ficar); a trava da `KIRO-DEV-CLONE` continua valendo pelo bloco do `task-principal.md`; `npm run validar` verde.
- **Commit:** pendente
- **Anotação:** Criada a pedido do usuário em 2026-10-12 por Claude Code (Opus 5.5) ("veja se tem mais alguma"), depois da SUB-41. Varredura feita com `grep` no `AGENTS.md`; os itens acima são todos os que citam tarefas concretas. As seções 1 a 5 são regras e ficam. **Releitura completa (2026-10-12, Claude Code (Opus 5.5), a pedido do usuário):** o `AGENTS.md` (483 linhas, já com a regra 9 da seção 1.1, `26e949b`) foi lido do início ao fim. A única **tarefa** é o plano "🧠 Cérebro de Memória Persistente" (linhas ~345-525 depois das seções 6 e da regra 10, SUB-41); as referências a tarefas concretas e os relatos de histórico são os itens 1 a 5 acima. Os números de linha foram atualizados (+5 por causa da regra 9) e o item 5 foi acrescentado.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-42.1 — Tirar do `AGENTS.md` as referências a tarefas específicas (regras genéricas)

**Próximo passo:** começar pelo escopo da tarefa-mãe.

Subtarefa criada na migração (regra: toda tarefa-mãe tem no mínimo 1 subtarefa). Executa todo o escopo da tarefa-mãe: descrição e critérios na seção **Tarefa-mãe** acima.
