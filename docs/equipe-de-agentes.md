# Plano — Equipe de agentes: classificação de tarefas por nível e modelo

- **Criado em:** 2026-10-13 12:10
- **Executor do plano:** Claude Code (Opus 5.5)
- **Tarefa no quadro:** `SUB-47` (subtarefas `SUB-47.1` a `SUB-47.10`)
- **Status:** ⬜ Aguardando aprovação do usuário
- **Concluído em / tempo decorrido:** —

## Objetivo

Cada tarefa do quadro passa a ter um **Nível** (`LEVE`, `MEDIO`, `PESADO`), definido por um classificador especialista. Cada
ferramenta de IA (Claude Code, Grok, DeepSeek, Gemini, Devin) pega só o que o seu modelo dá conta. No Claude Code, uma
**equipe** (líder + classificador + executores por nível) trabalha em paralelo no quadro.

## Escopo

**Entra:**
- skill `classificar-tarefa`: critérios dos níveis + **matriz ferramenta × modelo × nível**, válida para todas as IAs;
- agente `classificador-tarefas` (Claude Code, `model: opus`);
- agentes executores `executor-leve` (Haiku), `executor-medio` (Sonnet) e `executor-pesado` (Opus);
- skill `liderar-equipe`: o fluxo do líder (sessão principal);
- script `scripts/sincronizar-agentes.mjs`: copia a fonte `.agents/` para `.claude/`, que é onde o Claude Code lê (local e nuvem);
- regra nova no `AGENTS.md`: campo `Nível`, matriz por ferramenta e funcionamento da equipe;
- ajuste da skill `.agents/skills/proxima-task/` para filtrar por nível;
- classificação dos blocos pendentes do quadro;
- instalação global em `~/.agents/` e `~/.claude/` (**só com autorização do usuário no passo**);
- piloto com 1 item livre do quadro.

**Não entra:**
- roteamento automático por API (OpenRouter/Jev): continua na `SUB-46`, travada;
- agent teams experimental (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`): a equipe usa **subagentes**, que são estáveis no app
  desktop;
- configuração dentro das ferramentas das outras IAs. Elas seguem a regra pelo `AGENTS.md` e pela skill, sem arquivos
  próprios;
- testes automatizados (regra global do usuário).

## Como funciona

### Níveis

| Nível | Sinais concretos | Na dúvida |
|---|---|---|
| `PESADO` | `database/`, SQL, RLS, autenticação, chaves, migração, segurança, arquitetura, mais de 3 arquivos ligados, mudança em massa | — |
| `MEDIO` | Código em `src/`, `api/`, `scripts/`, de 1 a 3 arquivos, com lógica | sobe para `PESADO` |
| `LEVE` | Só `.md`, mover blocos do quadro, formatação, textos, configuração simples sem lógica | sobe para `MEDIO` |

A regra mais restritiva vence. Exemplo: "1 arquivo, mas é SQL" = `PESADO`.

Em linguagem simples: `LEVE` = **tarefa fácil**, `MEDIO` = **tarefa média**, `PESADO` = **tarefa difícil**. As tarefas
fáceis são as que vão para os modelos rápidos e baratos (ex.: **DeepSeek V4.1 Flash**, Haiku, Gemini Flash).

### Matriz ferramenta × modelo × nível (proposta — o usuário confirma no passo 47.1)

| Ferramenta | `LEVE` | `MEDIO` | `PESADO` | Observação |
|---|---|---|---|---|
| **Claude Code local** | Haiku | Sonnet | Opus | Único que pega tarefa de banco (regra 11) |
| **Claude Code na nuvem** | Haiku | Sonnet | Opus (sem banco) | Regra 11: banco nunca |
| **Gemini** (CLI / Antigravity) | modelo Flash | modelo Pro | modelo Pro (sem banco) | — |
| **Grok** | modelo rápido | modelo principal | modelo principal (sem banco) | — |
| **DeepSeek** | **DeepSeek V4.1 Flash** | modelo de raciocínio | ⛔ não pega | Flash definido pelo usuário em 2026-10-13 para tarefa fácil (`LEVE`) |
| **Devin** | ✅ | ✅ | ⛔ não pega | Não escolhe o modelo por tarefa |

Cada agente se identifica no quadro como **ferramenta + modelo** (ex.: `Grok (modelo rápido)`) e só pega item com
`Nível` igual ou abaixo do máximo da sua linha. Um modelo forte pode pegar item mais leve **só se** não houver item
livre do seu nível, para a fila não parar.

### Equipe no Claude Code

```
LÍDER (sessão principal, Opus) — skill liderar-equipe
 1. git fetch + pull --rebase → lê o task-principal.md
 2. blocos sem Nível → subagente classificador-tarefas (Opus) grava Nível + justificativa
 3. escolhe itens livres por prioridade (no máximo 3 em paralelo) → trava cada um (commit + push do lock)
 4. dispara em paralelo: LEVE → executor-leve · MEDIO → executor-medio · PESADO → executor-pesado
 5. recebe cada entrega → valida (npm run validar) → commit por tarefa → move para task_complete.md → push
```

- **Só o líder mexe no Git e no quadro.** Os executores editam apenas os arquivos da sua tarefa e devolvem um relatório.
  Motivo: todos trabalham na mesma pasta da `main` (sem worktree, por regra), e dois `git commit` simultâneos se atropelam.
- **Cada executor conta como um agente** no quadro, com nome próprio (ex.: `Claude Code — executor-medio (Sonnet)`), e
  segue o limite de 1 item por agente. O líder grava a trava em nome dele.
- **Tarefa de banco** (regra 11) não vai para executor: o líder faz direto, e só na sessão local.

### Onde os arquivos ficam

| Fonte (editar aqui) | Cópia gerada pelo script | Quem lê |
|---|---|---|
| `.agents/skills/<skill>/SKILL.md` | `.claude/skills/<skill>/SKILL.md` | Todas as IAs / Claude Code |
| `.agents/agents/<agente>.md` | `.claude/agents/<agente>.md` | Claude Code (local e nuvem) |
| `~/.agents/...` (global, passo 47.9) | `~/.claude/...` | Claude Code local em qualquer projeto |

O Claude Code **não lê** `.agents/` e a nuvem **não enxerga** `~/.claude/`. Por isso a cópia em `.claude/` vai
commitada no repositório. O `settings.local.json` de `.claude/` é pessoal e **não** entra no commit.

## Riscos

| Risco | Chance | Impacto | Plano B |
|---|---|---|---|
| Executores em paralelo editam o mesmo arquivo | Média | Alto | O líder só dispara em paralelo itens com arquivos diferentes; havendo sobreposição, executa em sequência |
| Gasto rápido do limite da assinatura | Alta | Médio | No máximo 3 executores por vez; o piloto mede o consumo |
| Classificação errada para baixo | Média | Alto | Classificador em Opus + regra "na dúvida, sobe o nível" |
| Mudança de regra do `AGENTS.md` conflita com agentes em execução | Baixa | Médio | A regra vale só para itens travados depois do commit dela; travas atuais não mudam |
| Nomes de modelos das outras ferramentas mudam | Alta | Baixo | A matriz fica só na skill (um lugar); o usuário revisa quando trocar de plano ou de modelo |

## Passos

| # | Subtarefa | Arquivos | Verificação | Status |
|---|---|---|---|---|
| 1 | `SUB-47.1` Skill `classificar-tarefa` (níveis, sinais, matriz, exemplos reais) | `.agents/skills/classificar-tarefa/SKILL.md` | Usuário confirma a matriz | ⬜ Pendente |
| 2 | `SUB-47.2` Script de sincronização `.agents/` → `.claude/` | `scripts/sincronizar-agentes.mjs`, `package.json` (`npm run sync:agentes`) | `node --check` + execução copia os arquivos | ⬜ Pendente |
| 3 | `SUB-47.3` Agente `classificador-tarefas` (Opus, só lê o quadro e grava `Nível`) | `.agents/agents/classificador-tarefas.md` (+ cópia) | Frontmatter válido; sincronizado | ⬜ Pendente |
| 4 | `SUB-47.4` Executores `executor-leve`, `executor-medio`, `executor-pesado` | `.agents/agents/executor-*.md` (+ cópias) | Frontmatter válido; sem permissão de Git | ⬜ Pendente |
| 5 | `SUB-47.5` Skill `liderar-equipe` (fluxo do líder) | `.agents/skills/liderar-equipe/SKILL.md` (+ cópia) | Fluxo coerente com o `AGENTS.md` | ⬜ Pendente |
| 6 | `SUB-47.6` Regra nova no `AGENTS.md` (campo `Nível`, matriz, equipe) | `AGENTS.md` | Leitura; sem contradição com as seções 1, 1.1 e 1.2 | ⬜ Pendente |
| 7 | `SUB-47.7` `proxima-task` filtra por nível | `.agents/skills/proxima-task/SKILL.md` | Passo 3 da skill cita o nível | ⬜ Pendente |
| 8 | `SUB-47.8` Classificar os blocos pendentes do quadro | `task-principal.md` | Todo bloco pendente tem `Nível:` | ⬜ Pendente |
| 9 | `SUB-47.9` Instalação global (com autorização) | `~/.agents/`, `~/.claude/agents/`, `~/.claude/skills/` | Arquivos presentes; outro projeto lista os agentes | ⬜ Pendente |
| 10 | `SUB-47.10` Piloto da equipe em 1 item livre + aceite do usuário | quadro + arquivos do item | Item entregue pela equipe; consumo anotado | ⬜ Pendente |

## Conclusão

_A preencher ao final: resultado, commits, pendências e tempo decorrido._
