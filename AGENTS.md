# 🤖 AGENTS.md — Porta de entrada para todas as IAs (Dashboard AI)

Vale para **todas as IAs** (Claude, Gemini, Grok, Copilot, Devin, DeepSeek, Antigravity etc.).
Este arquivo **não repete regras**: ele diz onde cada uma está. Cada regra existe em **um arquivo
só**, dentro de [`.claude/rules/`](.claude/rules/INDEX.md).

- **Regra nova pedida pelo usuário** → vai para o arquivo do assunto em `.claude/rules/` (veja o
  [`INDEX.md`](.claude/rules/INDEX.md)). Pedido para "salvar no `CLAUDE.md`" (ou `GEMINI.md`,
  `.cursorrules`, `copilot-instructions.md`…) significa salvar lá. Arquivos de uma IA só apenas
  apontam para este `AGENTS.md`.
- **Tarefas** ficam no quadro [`tasks/STATUS.md`](tasks/STATUS.md) (etapas em
  [`tasks/etapas/`](tasks/etapas/)). Nunca neste arquivo e nunca em `docs/`.

## ⛔ Antes de qualquer tarefa, leia (nesta ordem)

| # | Arquivo | O que define |
|---|---------|--------------|
| 1 | [`.claude/rules/essentials.md`](.claude/rules/essentials.md) | Sincronizar, o que ler, checklist de início |
| 2 | [`.claude/rules/git-quick.md`](.claude/rules/git-quick.md) | Tudo na `main`, hooks, commits, proibições |
| 3 | [`.claude/rules/tasks/quadro.md`](.claude/rules/tasks/quadro.md) | Onde fica cada informação; tarefa × subtarefa |
| 4 | [`.claude/rules/tasks/frentes-e-reserva.md`](.claude/rules/tasks/frentes-e-reserva.md) | Pegar e reservar subtarefa, prioridade, limites |
| 5 | [`.claude/rules/tasks/ciclo-da-task.md`](.claude/rules/tasks/ciclo-da-task.md) | Abrir, plano na etapa, executar, encerrar, retomar |
| 6 | [`.claude/rules/multiplas-ias.md`](.claude/rules/multiplas-ias.md) | Banco só pelo Claude Code local, trava especial, tamanho das subtarefas |
| 7 | [`.claude/rules/testes-validacao.md`](.claude/rules/testes-validacao.md) | Nunca abrir navegador; nunca escrever testes (exceto bug) |
| 8 | [`.claude/rules/codigo-solid.md`](.claude/rules/codigo-solid.md) e [`codigo-limites-nomes.md`](.claude/rules/codigo-limites-nomes.md) | Como escrever código |

Opcional: [`.claude/rules/reporte-progresso.md`](.claude/rules/reporte-progresso.md) (eventos no
monitor). Skill do fluxo: [`proxima-task`](.agents/skills/proxima-task/SKILL.md) (cópia para o Claude Code em
`.claude/skills/`; não editar a cópia).

**Se uma regra daqui parecer contradizer outra, vale a do arquivo do assunto; avise o usuário.**

---

# 📎 Anexo — plano a ser movido (tarefa SUB-41)

> O texto abaixo **não é regra**: é o plano original do "Cérebro de Memória Persistente", já
> implementado. A tarefa **SUB-41** (ver `tasks/STATUS.md`) vai movê-lo para
> `docs/plano-cerebro-memoria-persistente.md`. Até lá, fica aqui sem alterações.

## 3. Ativação no Terminal (Claude Code)

Após realizar o deploy do código acima na Vercel e configurar as variáveis de ambiente (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `OPENAI_API_KEY`), ative a sua memória compartilhada direto no Claude Code rodando o comando:

```bash
claude mcp add --transport http dashboard-ai-brain https://<seu-projeto>.vercel.app/api/mcp
```
