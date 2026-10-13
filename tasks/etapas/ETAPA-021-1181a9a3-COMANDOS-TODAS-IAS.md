## Etapa 021-1181a9a3 — SUB-60: Comandos (skills) para todas as IAs, sempre sincronizados

**Tarefa:** SUB-60 · **Pedido em:** 2026-10-13 19:56 · **Criada por:** Claude Code (Opus 5.5) (nuvem · main)
**Pedido:** "Faça isso, crie versões de comandos pra todas e deixe eles sincronizados"
**Objetivo:** cada IA do projeto consegue chamar as skills de `.agents/skills/` como comando
(`/nome` ou equivalente), a partir de uma fonte única, e uma cópia desatualizada não chega à `main`.

### Levantamento (documentação oficial, 2026-10-13)

| Ferramenta | Onde lê comandos/skills no projeto | Precisa gerar? |
|---|---|---|
| Codex | `.agents/skills/` (chama com `$nome` ou `/skills`) | Não — já é a fonte |
| Google Antigravity | `.agents/skills/` (chama com `/nome`); workflows antigos param em 2026-10-19 | Não |
| Cursor | `.agents/skills/` (e `.claude/skills/`), `/nome` | Não |
| GitHub Copilot (VS Code) | `.agents/skills/`, `.github/skills/`, `.claude/skills/`, `/nome` | Não |
| Claude Code | `.claude/skills/` | Já existe (cópia) |
| Grok Build | `.grok/skills/` | **Sim — cópia nova** |
| Gemini CLI | `.gemini/commands/<nome>.toml` (`description`, `prompt`) | **Sim — gerar TOML** |
| DeepSeek, Devin, OpenRouter | sem formato de comando de projeto documentado | Seguem pelo `AGENTS.md` |

### Escopo

- **Entra:** `scripts/sincronizar-agentes.mjs` passa a ter destinos em mapa (Claude: skills +
  agents; Grok: skills; Gemini: TOML gerado de cada `SKILL.md`, com `@{.agents/skills/<nome>/SKILL.md}`
  e `{{args}}`); modo `--checar` que só confere e falha se houver cópia desatualizada; o
  `.githooks/pre-push` e o `scripts/validar.sh` rodam esse modo; gerar as cópias; documentar no
  `AGENTS.md` (1 linha) e no `README.md`.
- **Não entra:** cópia dos agentes (`agents/`) para outras ferramentas (formatos diferentes, fora do
  pedido); apagar arquivos das cópias (o script continua só copiando); arquivos de teste novos.

### Critério de pronto

`npm run sync:agentes` gera `.grok/skills/proxima-task/SKILL.md` e `.gemini/commands/proxima-task.toml`;
rodar de novo não muda nada; `--checar` sai 0 com tudo igual e 1 com uma cópia alterada; push com
cópia desatualizada é recusado pelo `pre-push` com instrução de rodar `npm run sync:agentes`.

### Riscos

| Risco | Plano B |
|---|---|
| `pre-push` passa a barrar pushes de todas as IAs | Mensagem diz o comando que conserta; `--no-verify` segue como escape registrado |
| Máquina sem Node no `pre-push` | Hook só avisa e segue se `node` não existir |
| Formato do Grok/Gemini mudar | Destinos num mapa: ajustar uma entrada |

### Decisões

| Data | Decisão | Quem | Por quê |
|---|---|---|---|
| 2026-10-13 19:59 | Plano da SUB-60 **aprovado**, com o `--checar` no `pre-push` | Gelvazio | Resposta no chat: "Sim, pode executar" |

### SUB-60.1 — Sincronizador com destinos em mapa + cópia para `.grok/skills/`

**Próximo passo:** nenhum (concluída).

- **Descrição:** refatorar `scripts/sincronizar-agentes.mjs` para uma lista de destinos
  (`{ pasta, subpastas }`) e acrescentar o Grok.
- **Critérios de Aceitação:** saída do Claude Code igual à de antes; `.grok/skills/` criado.
- **Entrega:** commit `feat(SUB-60.1)` · **Verificação:** `node --check` ok; execução: Claude Code igual a antes (skills 1 e agents 3 já iguais), `.grok/skills/proxima-task/SKILL.md` copiado e idêntico (`cmp`); segunda execução sem cópias; linhas ≤ 100

### SUB-60.2 — Gerar `.gemini/commands/<skill>.toml`

**Próximo passo:** nenhum (concluída).

- **Descrição:** ler `name`/`description` do frontmatter de cada `SKILL.md` e escrever o TOML.
- **Critérios de Aceitação:** TOML válido (conferido com parser); só reescreve se mudou.
- **Entrega:** commit `feat(SUB-60.2)` · **Verificação:** `node --check` ok; `.gemini/commands/proxima-task.toml` gerado e lido sem erro pelo `tomllib` do Python (campos `description` e `prompt`, com `@{.agents/skills/proxima-task/SKILL.md}` e `{{args}}`); segunda execução não regrava; funções ≤ 45 linhas e linhas ≤ 100

### SUB-60.3 — Modo `--checar` no `pre-push` e no `validar.sh`

**Próximo passo:** depende da SUB-60.2.

- **Descrição:** `--checar` não grava nada e sai 1 listando o que está desatualizado.
- **Critérios de Aceitação:** os casos do critério de pronto conferidos num clone de teste.
- **Entrega:** — · **Verificação:** —

### SUB-60.4 — Gerar as cópias e documentar

**Próximo passo:** depende da SUB-60.3.

- **Descrição:** rodar `npm run sync:agentes`, versionar as cópias; uma linha no `AGENTS.md`
  (onde cada IA acha os comandos) e a tabela do levantamento no `README.md`.
- **Critérios de Aceitação:** `--checar` sai 0 na `main`.
- **Entrega:** — · **Verificação:** —

### SUB-60.5 — Aceite do usuário

**Próximo passo:** depende da SUB-60.4.

- **Descrição:** o usuário chama `/proxima-task` (ou `$proxima-task` no Codex) em pelo menos uma
  ferramenta além do Claude Code.
- **Critérios de Aceitação:** "sim" do usuário.
- **Entrega:** — · **Verificação:** —
