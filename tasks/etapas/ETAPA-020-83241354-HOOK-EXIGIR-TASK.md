## Etapa 020-83241354 — SUB-59: Hooks que obrigam o Claude Code a registrar a tarefa no quadro antes de editar

**Tarefa:** SUB-59 · **Pedido em:** 2026-10-13 19:49 · **Criada por:** Claude Code (Opus 5.5) (nuvem · main)
**Pedido:** "E o hook pra gravar a task no quadro, tem como fazer?" → "Faça isso" (opção recomendada:
trava antes de editar + lembrete a cada pedido).
**Objetivo:** garantir, no Claude Code, a regra "todo pedido que muda arquivo vira TASK antes de
executar" (`tasks/ciclo-da-task.md`): o hook não escreve a tarefa (não entende o pedido), mas impede
a edição até existir uma reserva no `tasks/STATUS.md`.

### Escopo

- **Entra:**
  - `.claude/hooks/exigir-reserva.mjs` (`PreToolUse` em `Edit|Write|NotebookEdit`): deixa passar
    edição dentro de `tasks/` (é onde se abre e reserva a tarefa) e fora da pasta do projeto
    (rascunhos da sessão); nos outros arquivos, só deixa se houver no `STATUS.md` uma linha
    `🔄 Em execução` com `Claude Code` em "Em uso por". Senão bloqueia (código 2) com a instrução
    de abrir e reservar a tarefa.
  - `.claude/hooks/lembrar-task.mjs` (`UserPromptSubmit`): acrescenta ao contexto um lembrete curto
    da regra a cada pedido.
  - Registro dos dois no `.claude/settings.json` e uma seção curta em `.claude/rules/multiplas-ias.md`
    (regra deste projeto; as regras de `tasks/` são genéricas).
- **Não entra:** escrever tarefa automaticamente; travar outras IAs (o hook só existe no Claude
  Code); travar edição feita por comando no terminal (`sed -i`, `>`), que o hook não enxerga;
  criar arquivos de teste (regra `testes-validacao.md`).

### Critério de pronto

Sem reserva: `Edit` em `src/` é bloqueado com mensagem clara; `Edit` em `tasks/STATUS.md` passa.
Com reserva de Claude Code: `Edit` em `src/` passa. Qualquer erro do próprio hook (JSON inválido,
`STATUS.md` ausente) **libera** a edição, para nunca prender a sessão. Escape: variável
`DASHBOARD_AI_SEM_TRAVA=1` desliga a trava.

### Riscos

| Risco | Plano B |
|---|---|
| Hook bloqueia por engano e prende o trabalho | Falha do hook libera; escape `DASHBOARD_AI_SEM_TRAVA=1`; dá para remover a entrada do `settings.json` |
| Reserva de outra sessão Claude Code libera a sua | Aceito: o hook não sabe o nome da frente; a regra de reserva continua valendo |
| Node ausente no Windows | Node ≥ 22 já é exigido pelo `package.json` |

### Decisões

| Data | Decisão | Quem | Por quê |
|---|---|---|---|
| 2026-10-13 19:49 | Trava antes de editar + lembrete; sem hook `Stop` | Gelvazio | "Faça isso" sobre a recomendação |
| 2026-10-13 19:51 | Plano da SUB-59 **aprovado** | Gelvazio | Resposta no chat: "Sim, pode executar" |

### SUB-59.1 — Hook `exigir-reserva.mjs` (trava antes de editar)

**Próximo passo:** nenhum (concluída).

- **Descrição:** script Node e entrada `PreToolUse` no `.claude/settings.json`, como no escopo.
- **Critérios de Aceitação:** os 5 casos do critério de pronto conferidos à mão, com JSON no stdin.
- **Entrega:** commit `feat(SUB-59.1)` · **Verificação:** hook rodado com JSON no stdin em 9 casos: sem reserva de Claude Code barra `src/` (código 2, caminho absoluto e relativo); `tasks/`, fora do projeto, escape `DASHBOARD_AI_SEM_TRAVA=1`, JSON inválido e `STATUS.md` ausente liberam; com reserva de Claude Code libera; `settings.json` validado com `json.tool`

### SUB-59.2 — Hook `lembrar-task.mjs` (lembrete a cada pedido)

**Próximo passo:** nenhum (concluída).

- **Descrição:** script Node e entrada `UserPromptSubmit` no `.claude/settings.json`.
- **Critérios de Aceitação:** imprime o lembrete e sai com código 0.
- **Entrega:** commit `feat(SUB-59.2)` · **Verificação:** rodado com JSON no stdin: imprime o lembrete de 3 linhas e sai com código 0; linhas ≤ 100 caracteres; `settings.json` validado com `json.tool`

### SUB-59.3 — Documentar a trava em `.claude/rules/multiplas-ias.md`

**Próximo passo:** nenhum (concluída).

- **Descrição:** seção curta: o que os hooks fazem, o que não pegam, o escape.
- **Critérios de Aceitação:** arquivo < 5 KB; nada repetido de outra regra.
- **Entrega:** commit `docs(SUB-59.3)` · **Verificação:** seção nova em `multiplas-ias.md` (< 5 KB, linhas ≤ 100 caracteres); `INDEX.md` e "Registro de decisões" do `STATUS.md` atualizados; nada repetido de outra regra (aponta para `ciclo-da-task.md`)

### SUB-59.4 — Aceite do usuário

**Próximo passo:** executar a descrição abaixo (reservada por Claude Code (Opus 5.5) (nuvem · main) em 2026-10-13 20:14).
edição em `src/` e confere que ela é barrada; depois responde "sim".

- **Descrição:** o usuário confere no Claude Code local que, sem reserva, a edição é barrada.
- **Critérios de Aceitação:** "sim" do usuário.
- **Entrega:** — · **Verificação:** —
