## Etapa 015-074d37b0 — SUB-54: Tirar a tabela "🧭 Frentes" do quadro (fica só o "Em uso por")

**Tarefa:** SUB-54 · **Pedido em:** 2026-10-13 15:48 · **Criada por:** Claude Code (Opus 5.5) (local · main)
**Pedido:** "por que ainda está dando conflito?" → "mas pq tem uma tabela em status?" → aprovação da proposta
"apagar a tabela 🧭 Frentes e usar só a coluna Em uso por" ("sim", duas vezes).
**Objetivo:** acabar com os conflitos de git na tabela de frentes (linhas vizinhas editadas por duas sessões ao
mesmo tempo) e com a informação repetida: quem está fazendo o quê já está na coluna "Em uso por".

### Escopo

- **Entra:** regras `quadro.md`, `frentes-e-reserva.md` e `ciclo-da-task.md`; skill `proxima-task`
  (`.agents/` + cópia em `.claude/` pelo `npm run sync:agentes`); remover a seção "🧭 Frentes" do
  `tasks/STATUS.md`; recado no `tasks/RECADOS.md`.
- **Não entra:** coluna "Em uso por" (continua igual); nome da frente na reserva, na seção da subtarefa e no
  commit (continua); histórico (`tasks/historico/`, etapas antigas, commits) não é alterado.
- **Critério de pronto:** nenhuma regra, skill ou modelo manda atualizar "linha da frente"; o `STATUS.md` não
  tem a seção "🧭 Frentes"; a `proxima-task` acha as frentes ativas pela coluna "Em uso por"; recado publicado.

### Riscos

| Risco | Plano B |
|---|---|
| A sessão da nuvem editar a linha dela enquanto a tabela é removida (conflito no push) | Recado em `RECADOS.md`; no conflito, manter a remoção e conferir se a reserva dela em "Em uso por" está certa |
| Outra IA seguir a regra antiga por cópia local desatualizada | Toda IA faz `fetch` + `pull --rebase` antes de ler o quadro (`essentials.md`); o recado reforça |

### Decisões

| Data | Quem | Decisão |
|---|---|---|
| 2026-10-13 15:48 | Gelvazio | Aprovado no chat ("sim"): apagar a tabela "🧭 Frentes" em vez de criar um arquivo por frente (opção 3) |

### SUB-54.1 — Regras sem "linha da frente" (`quadro.md`, `frentes-e-reserva.md`, `ciclo-da-task.md`)

**Próximo passo:** nenhum (concluída).

- **Descrição:** `quadro.md`: "Tarefa que cada sessão está fazendo" → coluna "Em uso por" do "📌 Tarefas"; tirar
  "🧭 Frentes" do modelo do `STATUS.md` e "Em uso por" passa a ser a forma de achar a frente. `frentes-e-reserva.md`:
  tirar "cada frente atualiza só a própria linha"; manter o nome da frente (reserva, seção, commit).
  `ciclo-da-task.md`: tirar "Linha da frente atualizada" (Encerrar) e, no Retomar, procurar o próprio nome em
  "Em uso por".
- **Critérios de Aceitação:** nenhuma das três regras manda atualizar linha de frente; arquivos ≤ 5 KB.
- **Entrega:** commit `feat(SUB-54.1)` · **Verificação:** `quadro.md` (lugar único = coluna "Em uso por"; seção
  "🧭 Frentes" fora do modelo), `frentes-e-reserva.md` (sem "atualizar a própria linha"; frente sem reserva = parada)
  e `ciclo-da-task.md` (sem "Linha da frente atualizada"; Retomar procura o nome em "Em uso por"); `grep` sem
  "🧭 Frentes"/"linha da frente" em `.claude/rules`, `AGENTS.md` e `README.md` (fora o título do
  `frentes-e-reserva.md`); tamanhos 4,8 KB, 2,9 KB e 4,2 KB (≤ 5 KB).

### SUB-54.2 — Skill `proxima-task` lendo as frentes pela coluna "Em uso por"

**Próximo passo:** nenhum (concluída).

- **Descrição:** em `.agents/skills/proxima-task/SKILL.md`, as frentes ativas passam a ser os nomes (sem o
  "(desde …)") que aparecem em "Em uso por" nas linhas 🔄; rodar `npm run sync:agentes` para a cópia em `.claude/`.
- **Critérios de Aceitação:** skill sem menção à tabela "🧭 Frentes"; cópia em `.claude/` igual à de `.agents/`.
- **Entrega:** commit `feat(SUB-54.2)` · **Verificação:** passo 3 da skill passa a montar as frentes ativas pelos
  nomes da coluna "Em uso por" (sem `(desde …)`, `—` e trava especial) e a descrição cita a coluna; `grep` sem
  "🧭"/"Encerrada" na skill; `npm run sync:agentes` copiou a skill e `cmp` confirma `.claude/` = `.agents/`.

### SUB-54.3 — Remover a seção "🧭 Frentes" do `STATUS.md` e avisar as IAs

**Próximo passo:** nenhum (concluída).

- **Descrição:** apagar a seção "🧭 Frentes de trabalho" do `tasks/STATUS.md`; registro de decisão no
  `STATUS.md`; recado para `todas` no `tasks/RECADOS.md`.
- **Critérios de Aceitação:** seção removida sem tocar nas linhas de tarefa; recado publicado.
- **Entrega:** commit `feat(SUB-54.3)` · **Verificação:** seção "🧭 Frentes de trabalho" apagada do `STATUS.md`
  (o arquivo passa do cabeçalho direto para "📌 Tarefas"; nenhuma linha de tarefa mudou); decisão já registrada no
  "Registro de decisões" em 15:48; recado para `todas` no `RECADOS.md` (15:55).

### SUB-54.4 — Aceite do usuário

**Próximo passo:** depois da 54.3, mostrar o resultado ao usuário e esperar o aceite.

- **Descrição:** o usuário confere o quadro sem a tabela e as regras novas.
- **Critérios de Aceitação:** aceite do usuário registrado nas Decisões desta etapa.
- **Entrega:** — · **Verificação:** —
