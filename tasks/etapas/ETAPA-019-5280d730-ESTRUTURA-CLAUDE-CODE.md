## Etapa 019-5280d730 — SUB-58: Completar a estrutura do Claude Code (`.mcp.json`, hook de início, `CLAUDE.local.md`, `settings.json` limpo)

**Tarefa:** SUB-58 · **Pedido em:** 2026-10-13 19:32 · **Criada por:** Claude Code (Opus 5.5) (nuvem · main)
**Pedido:** "Faça isso mas noutro repositório o dashboard-ai" (montar a estrutura de projeto do Claude
Code mostrada num reel: `CLAUDE.md`, `.mcp.json`, `.claude/settings.json`, `rules/`, `skills/`,
`agents/`, `hooks/`). Itens escolhidos pelo usuário: `.mcp.json`, hook de início, `CLAUDE.local.md`
e limpar o `settings.json`.
**Objetivo:** completar o que falta da estrutura do Claude Code sem duplicar regras: o Claude Code
passa a falar com o MCP do próprio projeto, sincroniza a `main` sozinho ao abrir a sessão, ganha um
lugar para preferências pessoais fora do Git e o `settings.json` versionado deixa de ter caminho de
uma máquina só.

### Escopo

- **Entra:** `.mcp.json` na raiz; `.claude/hooks/sincronizar-main.sh` + entrada `hooks` no
  `.claude/settings.json`; `CLAUDE.local.md` no `.gitignore` e na lista "O que nunca vai para o Git"
  do `git-quick.md`; remover `Bash(cd /c/fontes/dashboard-ai-claude-code-senai)` do `settings.json`.
- **Não entra:** pasta `.claude/commands/` (as skills já fazem esse papel); mudar regras existentes;
  gravar segredo em arquivo versionado; criar o `CLAUDE.local.md` (é pessoal, cada um cria o seu).

### Critério de pronto

`.mcp.json` sem nenhum segredo (URL e token vêm de variáveis de ambiente); o hook não bloqueia a
sessão em nenhum caso (sem rede, fora da `main`, com arquivos alterados); `settings.json` continua
JSON válido e com as mesmas permissões, menos a linha do caminho fixo; `npm run validar` verde.

### Riscos

| Risco | Plano B |
|---|---|
| Hook com `pull --rebase` estraga trabalho local | Só puxa na `main` e com a árvore limpa; senão só avisa. Sempre sai com código 0 |
| Hook em CRLF quebra no Git Bash | Regra `.claude/hooks/* text eol=lf` no `.gitattributes` |
| `.mcp.json` vaza o `MCP_AUTH_TOKEN` | Usa `${MCP_AUTH_TOKEN}` e `${DASHBOARD_AI_MCP_URL}`; nada fixo no arquivo |
| Variável de ambiente ausente | O Claude Code só mostra o MCP como desconectado; o resto segue (reporte é opcional) |

### Decisões

| Data | Decisão | Quem | Por quê |
|---|---|---|---|
| 2026-10-13 19:34 | Itens escolhidos: `.mcp.json`, hook de início, `CLAUDE.local.md`, limpar `settings.json`; `commands/` fica de fora | Gelvazio | Escolha no chat |
| 2026-10-13 19:37 | Plano da SUB-58 **aprovado** | Gelvazio | Resposta no chat: "Sim, pode executar" |

### SUB-58.1 — `.mcp.json` apontando para o MCP do projeto

**Próximo passo:** nenhum (concluída).

- **Descrição:** criar `.mcp.json` (servidor `dashboard-ai`, tipo `http`, URL
  `${DASHBOARD_AI_MCP_URL}`, cabeçalho `Authorization: Bearer ${MCP_AUTH_TOKEN}`) e acrescentar
  `DASHBOARD_AI_MCP_URL` ao `.env.example` e uma linha na seção do MCP do `README.md`.
- **Critérios de Aceitação:** JSON válido; nenhum valor secreto ou URL real no arquivo.
- **Entrega:** commit `feat(SUB-58.1)` · **Verificação:** `python3 -m json.tool .mcp.json` ok; conferido que não há URL real nem token no arquivo

### SUB-58.2 — Hook de início de sessão que sincroniza a `main`

**Próximo passo:** nenhum (concluída).

- **Descrição:** `.claude/hooks/sincronizar-main.sh` roda `git fetch --all --prune` e, só na `main`
  com a árvore limpa, `git pull --rebase origin main`; nos outros casos só avisa. Registrar no
  `.claude/settings.json` (`hooks.SessionStart`) e pôr `.claude/hooks/* text eol=lf` no
  `.gitattributes`.
- **Critérios de Aceitação:** sai sempre com código 0; testado com árvore limpa, árvore suja e sem rede.
- **Entrega:** commit `feat(SUB-58.2)` · **Verificação:** hook rodado em clone de teste em 6 casos (árvore limpa, suja, outra branch, sem rede, fora de repositório, remoto com commit novo): todos saem com código 0 e só puxam no caso seguro; `settings.json` validado com `json.tool`

### SUB-58.3 — `CLAUDE.local.md` fora do Git

**Próximo passo:** nenhum (concluída).

- **Descrição:** acrescentar `CLAUDE.local.md` ao `.gitignore` e à lista "O que nunca vai para o
  Git" do `.claude/rules/git-quick.md`.
- **Critérios de Aceitação:** `git check-ignore CLAUDE.local.md` confirma.
- **Entrega:** commit `feat(SUB-58.3)` · **Verificação:** `git check-ignore -v CLAUDE.local.md` aponta a regra nova do `.gitignore`; `git-quick.md` com linhas ≤ 100 caracteres e < 5 KB

### SUB-58.4 — Tirar o caminho fixo do `settings.json`

**Próximo passo:** nenhum (concluída).

- **Descrição:** remover `Bash(cd /c/fontes/dashboard-ai-claude-code-senai)` (caminho de uma
  máquina; pela decisão de 2026-10-13 15:16, caminhos de sessão ficam no `settings.local.json`).
- **Critérios de Aceitação:** JSON válido; demais permissões iguais.
- **Entrega:** commit `feat(SUB-58.4)` · **Verificação:** comparação com `json` antes/depois: só saiu a linha do `cd`; `deny` e `hooks` iguais. `npm run validar` na nuvem: `env` e `python` OK; `typecheck`, `testes`, `build`, `chunks` e `audit` não rodaram porque esta sessão não alcança o registro do npm (sem `node_modules`). A SUB-58 não mexe em TypeScript; rodar `npm run validar` local no aceite (SUB-58.5)

### SUB-58.5 — Aceite do usuário

**Próximo passo:** 👀 o usuário, no Claude Code local: (1) exportar `DASHBOARD_AI_MCP_URL` e
`MCP_AUTH_TOKEN` e ver o `dashboard-ai` em `/mcp`; (2) abrir uma sessão nova e ver a mensagem
`[hook sincronizar-main]`; (3) rodar `npm run validar`; (4) responder "sim".

- **Descrição:** o usuário confere no Claude Code local se o MCP aparece e o hook roda ao abrir.
- **Critérios de Aceitação:** "sim" do usuário.
- **Entrega:** — · **Verificação:** —
