## Etapa 022-c00b3c7f — SUB-61: Sincronia automática das skills no commit e Gemini CLI lendo o `AGENTS.md`

**Tarefa:** SUB-61 · **Pedido em:** 2026-10-13 20:08 · **Criada por:** Claude Code (Opus 5.5) (nuvem · main)
**Pedido:** "Existe sincronização automática das skills e regras e agents.md?" → proposta de
`pre-commit` + `GEMINI.md` → "Sim"
**Objetivo:** ninguém precisa lembrar do `npm run sync:agentes` (as cópias entram sozinhas no
commit) e o Gemini CLI passa a carregar as regras do `AGENTS.md`, como as outras IAs.

### Escopo

- **Entra:**
  - `.githooks/pre-commit`: se o commit tem arquivo de `.agents/`, roda o sincronizador e acrescenta
    ao commit **só** as cópias que ele gravou (caminhos exatos, nunca `git add .`). Sem Node ou com
    erro do script: só avisa e deixa o commit seguir (o `pre-push` da SUB-60 continua de rede).
  - Linha do `pre-commit` na tabela de hooks do `.claude/rules/git-quick.md`.
  - `GEMINI.md` na raiz, só com o aviso e `@./AGENTS.md` (mesmo papel do `CLAUDE.md`).
- **Não entra:** sincronizar regras (já são arquivo único); converter agents para outras IAs;
  mudar o `.gemini/settings.json`.

### Critério de pronto

Commit que altera `.agents/skills/…` sai com as cópias de `.claude/`, `.grok/` e `.gemini/commands/`
no mesmo commit; commit sem `.agents/` não roda o sincronizador; `pre-push` passa logo depois.

### Riscos

| Risco | Plano B |
|---|---|
| A fonte tem mudança não preparada para o commit (`git add` parcial) e a cópia sai com ela | O hook avisa quando `.agents/` tem mudança fora do commit; o `--checar` do `pre-push` pega diferença |
| Hook quebra o commit de alguma IA | Erro do hook só avisa; `--no-verify` com motivo registrado |
| Hook em CRLF no Windows | `.githooks/* text eol=lf` já está no `.gitattributes` |

### Decisões

| Data | Decisão | Quem | Por quê |
|---|---|---|---|
| 2026-10-13 20:08 | `GEMINI.md` apontando para o `AGENTS.md` (em vez de `context.fileName`), igual ao `CLAUDE.md` | Claude Code (Opus 5.5) | Mesmo padrão já usado; o Gemini CLI aceita `@arquivo` |
| 2026-10-13 20:10 | Plano da SUB-61 **aprovado** | Gelvazio | Resposta no chat: "Sim, pode executar" |

### SUB-61.1 — Hook `pre-commit` que sincroniza as skills

**Próximo passo:** nenhum (concluída).

- **Descrição:** criar `.githooks/pre-commit` e a linha na tabela de hooks do `git-quick.md`.
- **Critérios de Aceitação:** casos do critério de pronto conferidos num clone de teste.
- **Entrega:** commit `feat(SUB-61.1)` · **Verificação:** `sh -n` ok; em clone de teste: commit sem `.agents/` não roda nada; commit com skill alterada leva junto `.claude/` e `.grok/` (o TOML só muda quando muda a descrição); `--checar` 0 e push aceito logo depois; com mudança em `.agents/` fora do commit, avisa e inclui (skill nova gerou também `.gemini/commands/nova.toml`). Linha no `git-quick.md`

### SUB-61.2 — `GEMINI.md` apontando para o `AGENTS.md`

**Próximo passo:** nenhum (concluída).

- **Descrição:** arquivo curto no padrão do `CLAUDE.md`.
- **Critérios de Aceitação:** `@./AGENTS.md` numa linha própria; nenhuma regra no arquivo.
- **Entrega:** commit `feat(SUB-61.2)` · **Verificação:** `@./AGENTS.md` em linha própria (sintaxe de importação do Gemini CLI); arquivo sem regras, no padrão do `CLAUDE.md`; linhas ≤ 100

### SUB-61.3 — Aceite do usuário

**Próximo passo:** executar a descrição abaixo (reservada por Claude Code (Opus 5.5) (nuvem · main) em 2026-10-13 20:14).
mesmo commit; no Gemini CLI, `/memory show` mostra o `AGENTS.md`; depois responde "sim".

- **Descrição:** o usuário edita uma skill em `.agents/skills/`, commita e vê as cópias no mesmo
  commit; se usar o Gemini CLI, confere com `/memory show` que o `AGENTS.md` foi carregado.
- **Critérios de Aceitação:** "sim" do usuário.
- **Entrega:** — · **Verificação:** —
