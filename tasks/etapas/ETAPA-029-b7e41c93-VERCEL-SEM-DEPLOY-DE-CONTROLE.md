## Etapa 029-b7e41c93 — VERCEL-SEM-DEPLOY-DE-CONTROLE: `tasks/` e `rules-local/` não geram deploy na Vercel (C46)

**Tarefa:** VERCEL-SEM-DEPLOY-DE-CONTROLE · **Pedido em:** 2026-10-23 17:53 · **Criada por:** Claude Code (Sonnet 5.5) (local · main · rules-ai)
**Pedido:** aplicar no `dashboard-ai` a regra global C46 (`rules-ai`, subtarefa VERCEL-SEM-DEPLOY-DE-CONTROLE.3, etapa 034 do `rules-ai`): `ignoreCommand` no `vercel.json` e `rules-local/` no `.vercelignore`. Pedido do usuário no `rules-ai`: "rules-local/ também deve ser removido sempre, nunca deve ir pro deploy da nuvem… vale pra todos os projetos".
**Objetivo:** push que só muda `tasks/` ou `rules-local/` não gera deploy na Vercel, e `rules-local/` nunca vai ao site; economiza o armazenamento de deploys sem mudar nada do que o usuário vê.

### VERCEL-SEM-DEPLOY-DE-CONTROLE.1 — Acrescentar `ignoreCommand` e `.vercelignore`

**Próximo passo:** arquivos já gravados em 2026-10-23 (`vercel.json` e `.vercelignore`); falta o commit + push (`vercel.json`, `.vercelignore` e o quadro) e, depois do push, conferir na Vercel (`list_deployments`) que um push só de `tasks/` ou `rules-local/` não vira deploy e que o commit de entrega aparece como READY.

- **Nível:** MEDIO — configuração de 2 arquivos, com lógica de comparação (regra `rules-local/regras/niveis-e-modelos.md`)
- **Modelo:** só Sonnet — nunca outro
- **Effort:** medium
- **Descrição:** o `vercel.json` (`functions` e `rewrites`) não tinha `ignoreCommand` e o projeto não tinha `.vercelignore`. Acrescentar a chave `ignoreCommand` (comando padrão da C46, em `rules-local/regras/vercel-sem-deploy-de-controle.md` quando o `rules-local` for sincronizado) sem mexer em `functions` nem `rewrites`, e criar o `.vercelignore` só com a linha `rules-local/`. `tasks/` não entra no `.vercelignore`.
- **Arquivos:** `vercel.json`, `.vercelignore`
- **Critérios de Aceitação:** `vercel.json` válido com o `ignoreCommand` padrão (R2); `grep -n "rules-local/" .vercelignore` acha a linha (R3); `git diff -- vercel.json` mostra só a chave nova.
- **Entrega:** a preencher (commit) · **Verificação:** `node -e "JSON.parse(...)"` do `vercel.json` ok (chaves `$schema`, `ignoreCommand`, `functions`, `rewrites`); `git diff -- vercel.json` só com a linha do `ignoreCommand`; `.vercelignore` com `rules-local/`; o comando padrão dá código 0 no commit `901edb6` (só `rules-local/` e `tasks/`) e 1 no `5cd83ea` (outros arquivos); `npm run check:agentes` sem cópia desatualizada. A conferência na Vercel (R4/R5) depende do push.
- **JEV-AI-SUGGESTION:** NAO
