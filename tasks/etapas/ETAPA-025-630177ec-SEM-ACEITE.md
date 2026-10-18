## Etapa 025-630177ec — SUB-64: a IA sempre aceita, nunca pede aceite (regra global C32)

**Tarefa:** SUB-64 · **Pedido em:** 2026-10-17 21:50 · **Criada por:** Claude Code (Opus 5.5) (local · main)
**Pedido:** "quero que aceite sempre tudo" e, na proposta em 3 itens, "1-SEMPRE ACEITE,NUNCA
PERGUNTE;2-SIM;3-SIM" (item 3 = alinhar este projeto à regra global).
**Objetivo:** levar a C32 do `rules-ai` (ACEITE-GLOBAL) às regras deste projeto e fechar os aceites
que estão no quadro.

### Decisões

| Data | Decisão | Quem | Palavras |
|---|---|---|---|
| 2026-10-17 21:50 | Aprovado: aplicar a C32 aqui e fechar os aceites do quadro | Gelvazio | "3-SIM" |

### SUB-64.1 — Regra C32 nas regras do projeto e aceites fechados

**Próximo passo:** — (entregue).

- **Nível:** MEDIO — texto de 3 regras e movimento de linhas no quadro.
- **Descrição:** tirar a subtarefa "Aceite do usuário" do ciclo e do modelo da etapa; fechar os
  aceites existentes (concluído quando a entrega já existe, dispensado quando a dependência está
  aberta).
- **Critérios de Aceitação:** nenhuma regra do projeto manda criar aceite; nenhum aceite 👀 no quadro.
- **Entrega:** commit `feat(SUB-64.1)`: C32 em `.claude/rules/tasks/ciclo-da-task.md` (item 2 de
  Encerrar) e `.claude/rules/tasks/quadro.md` (modelo da etapa); skill `proxima-task` sem "aceites"
  (cópias geradas pelo hook `pre-commit`). Aceites fechados: SUB-47.16, SUB-55.6 e SUB-63.2 →
  ✅ Concluído (C32), o que fecha as mães SUB-55 e SUB-63; SUB-62.4 → ✅ Dispensado (C32), porque a
  SUB-62.3 ainda está com o Qoder. Nota da C32 na seção de cada uma.
- **Verificação:** `grep -i aceite` em `.claude/rules` e `.agents` só encontra o texto da C32; o
  único 👀 que sobrou no quadro é a SUB-47.11, que tem o piloto da equipe para rodar (não é só
  aceite).
