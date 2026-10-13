## Etapa 014-7d3c51e9 — SUB-53: Listar as tarefas pendentes depois de cada push na `main`

**Tarefa:** SUB-53 · **Pedido em:** 2026-10-13 15:06 · **Criada por:** Claude Code (Opus 5.5) (local · main)
**Pedido:** "adicione 1 regra que ao final de cada push ao main, automaticamente já liste a tela de tarefas
pendentes"
**Objetivo:** o usuário ver o que falta fazer logo depois de cada entrega, sem precisar pedir.

### SUB-53.1 — Regra "listar pendentes depois do push"

**Próximo passo:** nenhum (concluída).

- **Descrição:** regra no `git-quick.md` (seção "Fluxo"): depois de cada push para a `main` que der certo, a IA
  mostra a tabela das tarefas-mãe abertas, os itens 👀 e a próxima subtarefa pela prioridade, antes da frase
  final. Ponteiro no `ciclo-da-task.md` (passo 6 do "Encerrar").
- **Critérios de Aceitação:** regra em um lugar só; arquivos de regra ≤ 5 KB.
- **Entrega:** commit `feat(SUB-53.1)` · **Verificação:** leitura das regras e `wc -c` (`git-quick.md` e
  `ciclo-da-task.md` abaixo de 5 KB). Reserva e entrega no mesmo commit (subtarefa de poucos minutos, sem
  outra frente ativa).
