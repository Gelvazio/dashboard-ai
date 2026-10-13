## Etapa 009-5ca65c0a — SUB-47: Equipe de agentes: classificar tarefas por nível com Laya Server (System-One)

**Tarefa:** SUB-47 · **Migrada em:** 2026-10-13 (ETAPA-001) · **Executor:** por subtarefa (coluna "Em uso por" do `tasks/STATUS.md`)
**Próximo passo:** escolher uma subtarefa livre no `tasks/STATUS.md` (cada subtarefa tem o próprio próximo passo abaixo).

> Bloco migrado do `task-principal.md` sem alterar o texto. **Status, prioridade, dependências e reserva** de cada subtarefa ficam só no [`tasks/STATUS.md`](../STATUS.md); aqui ficam descrição, critérios, entrega e anotações. Quem reserva uma subtarefa edita só a seção dela.

### Tarefa-mãe

- **Descrição:** Cada tarefa do quadro passa a ter `Nível` (`LEVE`, `MEDIO`, `PESADO`), definido automaticamente pelo **Laya Server** (System-One control, Jev-compatible) com **Opus 5.5 como revisor/fallback**. O Laya Server roda como serviço em background via Docker, expõe endpoint HTTP `/v1/systemone` e fornece decisões estruturadas rápidas (< 1s, sem custo de LLM). Quando o score do Laya é baixo (< 0.7) ou o servidor está indisponível, o Opus revisa a decisão (modo híbrido). Cada ferramenta de IA (Claude Code, Grok, DeepSeek, Gemini, Devin) pega só o que o seu modelo dá conta, conforme uma matriz ferramenta × modelo × nível. No Claude Code, uma equipe de subagentes (líder + classificador Laya/Opus + executores Haiku/Sonnet/Opus) trabalha em paralelo, com só o líder mexendo no Git e no quadro. Plano completo: plano nesta etapa + integração Laya em `docs/laya-server.md`.
- **Critérios de Aceitação:** Todas as subtarefas `concluido`; Laya Server rodando e acessível; classificação automática funciona; piloto (SUB-47.11) aceito pelo usuário.
- **Commit:** pendente
- **Anotação:** Criada em 2026-10-13 12:10 por Claude Code (Opus 5.5), a pedido do usuário. **Atualizada em 2026-10-13 para integrar Laya Server com Opus como revisor/fallback:** o classificador manual Opus foi substituído pelo Laya Server (System-One control) como primário, com Opus 5.5 como revisor quando o score do Laya é baixo (< 0.7) ou quando o servidor está indisponível. Vantagens: < 1s por classificação na maioria dos casos (Laya), custo zero (local), precisão garantida em casos complexos (Opus fallback). Configurável via `CLASSIFICADOR_MODE` (laya/opus/hybrid). Prioridade `MEDIA` (padrão da seção 1.2). **Revisão de 2026-10-13 14:22 (Claude Code (Opus 5.5), a pedido do usuário — opção C: manter o Laya e ajustar):** (1) apagado o bloco duplicado `SUB-47.2` (script de sincronização), cópia idêntica da `SUB-47.3`; (2) contagem corrigida para 14 filhas (47.0 a 47.13); (3) plano `docs/equipe-de-agentes.md` atualizado com o Laya; (4) **fonte oficial do Laya Server: <https://github.com/NandhaKishorM/laya>** — toda informação de instalação, configuração, endpoints e variáveis deve ser buscada lá (README e docs do repositório), nunca deduzida; o que estiver nos blocos e não bater com a fonte oficial vale a fonte oficial; (5) critérios sem "testes unitários" (regra do usuário: nunca escrever testes); (6) SUB-47.12 marcada como tarefa de banco (regra 11); (7) SUB-47.0 depende do Docker rodando; (8) o modo de execução da equipe (1 tarefa por vez, 3 clones ou paralelo) **ainda depende de decisão do usuário**. **Nenhuma subtarefa pode ser pega antes de o usuário aprovar o plano** em `docs/equipe-de-agentes.md`; quando aprovar, a dependência de aprovação sai dos blocos e o resumo é atualizado.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE


### Plano (vindo de `docs/equipe-de-agentes.md` em 2026-10-13)

- **Criado em:** 2026-10-13 12:10
- **Executor do plano:** Claude Code (Opus 5.5)
- **Tarefa no quadro:** `SUB-47` (subtarefas `SUB-47.0` a `SUB-47.13`; classificador Laya Server + Opus desde 2026-10-13)
- **Status:** ✅ Aprovado pelo usuário em 2026-10-13 15:09 ("sub-47 aprovada", registrado por Claude Code (Opus 5.5) (nuvem · main)); subtarefas liberadas no `tasks/STATUS.md`
- **Concluído em / tempo decorrido:** —

#### Objetivo

Cada tarefa do quadro passa a ter um **Nível** (`LEVE`, `MEDIO`, `PESADO`), definido por um classificador especialista. Cada
ferramenta de IA (Claude Code, Grok, DeepSeek, Gemini, Devin) pega só o que o seu modelo dá conta. No Claude Code, uma
**equipe** (líder + classificador + executores por nível) trabalha em paralelo no quadro.

#### Escopo

**Entra:**
- skill `classificar-tarefa`: critérios dos níveis + **matriz ferramenta × modelo × nível**, válida para todas as IAs;
- Laya Server (Docker) + wrapper `src/lib/laya.ts`, com Opus como revisor/fallback (fonte oficial:
  <https://github.com/NandhaKishorM/laya>);
- agente `classificador-tarefas` (usa a skill `classificar-tarefa`, que chama o Laya);
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

#### Como funciona

##### Níveis

| Nível | Sinais concretos | Na dúvida |
|---|---|---|
| `PESADO` | `database/`, SQL, RLS, autenticação, chaves, migração, segurança, arquitetura, mais de 3 arquivos ligados, mudança em massa | — |
| `MEDIO` | Código em `src/`, `api/`, `scripts/`, de 1 a 3 arquivos, com lógica | sobe para `PESADO` |
| `LEVE` | Só `.md`, mover blocos do quadro, formatação, textos, configuração simples sem lógica | sobe para `MEDIO` |

A regra mais restritiva vence. Exemplo: "1 arquivo, mas é SQL" = `PESADO`.

Em linguagem simples: `LEVE` = **tarefa fácil**, `MEDIO` = **tarefa média**, `PESADO` = **tarefa difícil**. As tarefas
fáceis são as que vão para os modelos rápidos e baratos (ex.: **DeepSeek V4.1 Flash**, Haiku, Gemini Flash) e
para o **Grok Bot**, o **Devin** (plano Free) e o **Antigravity** (Starter Quota), que só pegam tarefa fácil.
**Tarefa difícil (`PESADO`) é só do Claude Code com Opus 5.5 ou superior, ou Fable** (definido pelo usuário em
2026-10-13); nenhuma outra ferramenta ou modelo pega `PESADO`.

##### Matriz ferramenta × modelo × nível (proposta — o usuário confirma no passo 47.2)

| Ferramenta | `LEVE` | `MEDIO` | `PESADO` | Observação |
|---|---|---|---|---|
| **Claude Code local** | Haiku | Sonnet | Opus 5.5 ou superior, ou Fable | Único que pega tarefa de banco (regra 11) |
| **Claude Code na nuvem** | Haiku | Sonnet | Opus 5.5 ou superior, ou Fable (sem banco) | Regra 11: banco nunca |
| **Gemini CLI** | modelo Flash | modelo Pro | ⛔ não pega | — |
| **Antigravity** (Starter Quota) | Gemini 3.8 Flash | ⛔ não pega | ⛔ não pega | Só tarefa fácil (`LEVE`): cota de entrada pequena; definido pelo usuário em 2026-10-13 |
| **Grok** (SuperGrok) | modelo rápido | Grok 4.7 | ⛔ não pega | Só até tarefa média (`MEDIO`), por cautela com a cota do plano; definido pelo usuário em 2026-10-13 |
| **DeepSeek** | **DeepSeek V4.1 Flash** | modelo de raciocínio | ⛔ não pega | Flash definido pelo usuário em 2026-10-13 para tarefa fácil (`LEVE`) |
| **Devin** | ✅ | ⛔ não pega | ⛔ não pega | Só tarefa fácil (`LEVE`): plano Free, com modelos limitados; definido pelo usuário em 2026-10-13. Não escolhe o modelo por tarefa |
| **Grok Bot** | ✅ | ⛔ não pega | ⛔ não pega | Só tarefa fácil (`LEVE`), definido pelo usuário em 2026-10-13; não escolhe o modelo por tarefa e os Bots compartilham o mesmo computador |

Cada agente se identifica no quadro como **ferramenta + modelo** (ex.: `Grok (modelo rápido)`) e só pega item com
`Nível` igual ou abaixo do máximo da sua linha. Um modelo forte pode pegar item mais leve **só se** não houver item
livre do seu nível, para a fila não parar.

##### Equipe no Claude Code

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

##### Onde os arquivos ficam

| Fonte (editar aqui) | Cópia gerada pelo script | Quem lê |
|---|---|---|
| `.agents/skills/<skill>/SKILL.md` | `.claude/skills/<skill>/SKILL.md` | Todas as IAs / Claude Code |
| `.agents/agents/<agente>.md` | `.claude/agents/<agente>.md` | Claude Code (local e nuvem) |
| `~/.agents/...` (global, passo 47.10) | `~/.claude/...` | Claude Code local em qualquer projeto |

O Claude Code **não lê** `.agents/` e a nuvem **não enxerga** `~/.claude/`. Por isso a cópia em `.claude/` vai
commitada no repositório. O `settings.local.json` de `.claude/` é pessoal e **não** entra no commit.

#### Riscos

| Risco | Chance | Impacto | Plano B |
|---|---|---|---|
| Executores em paralelo editam o mesmo arquivo | Média | Alto | O líder só dispara em paralelo itens com arquivos diferentes; havendo sobreposição, executa em sequência |
| Gasto rápido do limite da assinatura | Alta | Médio | No máximo 3 executores por vez; o piloto mede o consumo |
| Classificação errada para baixo | Média | Alto | Classificador em Opus + regra "na dúvida, sobe o nível" |
| Mudança de regra do `AGENTS.md` conflita com agentes em execução | Baixa | Médio | A regra vale só para itens travados depois do commit dela; travas atuais não mudam |
| Nomes de modelos das outras ferramentas mudam | Alta | Baixo | A matriz fica só na skill (um lugar); o usuário revisa quando trocar de plano ou de modelo |

#### Classificador: Laya Server + Opus (revisão de 2026-10-13)

Em 2026-10-13 13:40–13:48, outra sessão fundiu a `SUB-51` (Laya Server) nesta tarefa. Em 2026-10-13 14:22 o usuário
escolheu **manter o Laya** (opção C), com estes ajustes:

- **Fonte oficial do Laya Server: <https://github.com/NandhaKishorM/laya>.** Instalação, imagem Docker, variáveis,
  endpoints (ex.: `/v1/systemone`), formato de request/response e health check são buscados **lá** (README e docs do
  repositório). O que estiver no quadro e não bater com a fonte oficial vale a fonte oficial; nada é deduzido.
- **Modo híbrido:** o Laya classifica primeiro (local, sem custo de LLM); se o score for baixo (< 0.7) ou o servidor
  estiver fora, o **Opus 5.5 ou superior** revisa. Configurável por `CLASSIFICADOR_MODE` (`laya`, `opus`, `hybrid`).
- **Pré-requisito:** Docker rodando na máquina (SUB-47.0). Sem Docker, o modo `opus` continua funcionando.
- **Sem testes novos** nos critérios (regra do usuário).
- **SUB-47.12** cria coluna no banco (`tasks.nivel_tarefa`): tarefa de banco, só Claude Code local (regra 11), aplicar
  só com autorização do usuário.
- **Modo de execução da equipe** (1 tarefa por vez em pasta única, 3 clones independentes, ou paralelo): **pendente de
  decisão do usuário**; o fluxo da seção "Equipe no Claude Code" acima ainda descreve o paralelo.

#### Passos

Numeração atual do quadro (14 filhas, `SUB-47.0` a `SUB-47.13`; o bloco duplicado `SUB-47.2` foi apagado em 2026-10-13).

| # | Subtarefa | Arquivos | Verificação | Status |
|---|---|---|---|---|
| 0 | `SUB-47.0` Laya Server via Docker Compose (config da fonte oficial) | `docker-compose.laya.yml`, `scripts/start-laya.*` | Serviço sobe; health check passa | ⬜ Pendente |
| 1 | `SUB-47.1` Wrapper `src/lib/laya.ts` (Laya + Opus fallback) | `src/lib/laya.ts`, `src/lib/index.ts` | `npm run typecheck` verde | ⬜ Pendente |
| 2 | `SUB-47.2` Skill `classificar-tarefa` (níveis, sinais, matriz, exemplos reais) | `.agents/skills/classificar-tarefa/SKILL.md` | Usuário confirma a matriz | ⬜ Pendente |
| 3 | `SUB-47.3` Script de sincronização `.agents/` → `.claude/` | `scripts/sincronizar-agentes.mjs`, `package.json` (`npm run sync:agentes`) | `node --check` + execução copia os arquivos | ⬜ Pendente |
| 4 | `SUB-47.4` Agente `classificador-tarefas` (usa a skill com Laya) | `.agents/agents/classificador-tarefas.md` (+ cópia) | Frontmatter válido; sincronizado | ⬜ Pendente |
| 5 | `SUB-47.5` Executores `executor-leve`, `executor-medio`, `executor-pesado` | `.agents/agents/executor-*.md` (+ cópias) | Frontmatter válido; sem permissão de Git | ⬜ Pendente |
| 6 | `SUB-47.6` Skill `liderar-equipe` (fluxo do líder; modo de execução a decidir) | `.agents/skills/liderar-equipe/SKILL.md` (+ cópia) | Fluxo coerente com o `AGENTS.md` | ⬜ Pendente |
| 7 | `SUB-47.7` Regra nova no `AGENTS.md` (campo `Nível`, matriz, equipe) | `AGENTS.md` | Leitura; sem contradição com as seções 1, 1.1 e 1.2 | ⬜ Pendente |
| 8 | `SUB-47.8` `proxima-task` filtra por nível | `.agents/skills/proxima-task/SKILL.md` | Passo 3 da skill cita o nível | ⬜ Pendente |
| 9 | `SUB-47.9` Classificar os blocos pendentes do quadro | `task-principal.md` | Todo bloco pendente tem `Nível:` | ⬜ Pendente |
| 10 | `SUB-47.10` Instalação global (com autorização) | `~/.agents/`, `~/.claude/agents/`, `~/.claude/skills/` | Arquivos presentes; outro projeto lista os agentes | ⬜ Pendente |
| 11 | `SUB-47.11` Piloto da equipe em 1 item livre + aceite do usuário | quadro + arquivos do item | Item entregue pela equipe; consumo anotado | ⬜ Pendente |
| 12 | `SUB-47.12` Classificação Laya no worker LangGraph (**banco**, só Claude Code local) | `worker/`, `database/` | Worker usa o nível; SQL aplicado com autorização | ⬜ Pendente |
| 13 | `SUB-47.13` Documentar Laya + Opus no README e em `docs/laya-server.md` | `README.md`, `docs/laya-server.md` | Seção e doc citam a fonte oficial | ⬜ Pendente |

#### Conclusão

_A preencher ao final: resultado, commits, pendências e tempo decorrido._

### SUB-47.0 — Configurar Laya Server via Docker Compose

**Próximo passo:** ⛔ falta só a autorização do usuário para **construir e rodar** o Laya no Docker. Com ela: ler `laya/README.md`, `laya/LOCAL_SETUP.md` e `laya/compose.yaml` (fonte oficial local) e escrever o `docker-compose.laya.yml` e os scripts a partir deles.

- **Descrição:** Criar `docker-compose.laya.yml` na raiz do projeto com serviço `laya-serve` baseado na configuração oficial do Laya. Configurar variáveis de ambiente: `LAYA_SERVE_BACKEND=laya`, `LAYA_SERVE_PRELOAD=true`, `LAYA_SERVE_DEVICE=cpu` (ou `cuda` se GPU disponível), `LAYA_API_KEY` (opcional, para proteção), `LAYA_BIND_ADDRESS=127.0.0.1` (só localhost). Publicar porta `8000` e adicionar health check. Criar script `scripts/start-laya.sh` (Windows: `.bat`) para iniciar/parar o serviço. Documentar como rodar: `docker compose -f docker-compose.laya.yml up -d laya-serve`.
- **Critérios de Aceitação:** Docker Compose funcional; serviço inicia sem erros; health check passa; portas corretas; script de start/stop funcional; configuração conferida contra a fonte oficial.
- **Commit:** pendente
- **Anotação:** Integrado da SUB-51 para usar Laya Server como classificador automático (System-One control) em vez de classificador manual Opus. **Fonte oficial obrigatória:** <https://github.com/NandhaKishorM/laya> — imagem, serviço, variáveis (`LAYA_SERVE_*`, `LAYA_API_KEY`, `LAYA_BIND_ADDRESS`), porta e health check acima são **suposições a conferir** no README/docs do repositório antes de escrever o `docker-compose.laya.yml`. **Pré-requisito:** Docker Desktop instalado e rodando nesta máquina (em 2026-10-12 o Docker estava parado — ver SUB-38); sem Docker, o item fica ⛔ com esse motivo.
- **Bloqueio (2026-10-13 15:33, Claude Code (Opus 5.5) (local · main)):** `docker --version` = 29.4.3, mas `docker info` falha (`dockerDesktopLinuxEngine` não encontrado: Docker Desktop parado). Além disso, subir o serviço exige baixar e executar código de terceiros, o que pede autorização explícita do usuário.
- **Código do Laya no projeto (2026-10-13 15:58, informado pelo usuário, registrado por Claude Code (Opus 5.5) (local · main)):** o repositório oficial está clonado em `C:\fontes\dashboard-ai-claude-code-senai\laya` (pasta `laya/` na raiz; `origin` = <https://github.com/NandhaKishorM/laya>, commit `c73908d` "release: 0.4.6"). É um repositório git próprio dentro do nosso: **não versionar** (não está no `.gitignore`; nunca `git add laya`). Usar como fonte oficial local: `README.md`, `LOCAL_SETUP.md`, `Dockerfile`, `compose.yaml` (variáveis `LAYA_DEVICE`, `LAYA_MODEL`, `LAYA_TORCH_INDEX`… — os nomes `LAYA_SERVE_*` da descrição eram suposição e devem seguir este compose). Docker Desktop rodando (`docker info` = 29.4.3).
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.1 — Criar wrapper TypeScript para API do Laya com Opus como revisor/fallback (`src/lib/laya.ts`)

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar `src/lib/laya.ts` com: tipos TypeScript para request/response do endpoint `/v1/systemone` (baseado na especificação Jev), função `classificarLaya(estado, perguntas)` que faz POST para o Laya Server e devolve `{ choice, score, noul }`, função `classificarComOpus(estado, perguntas)` que usa Anthropic API (Opus 5.5 ou superior) para classificação, e função `classificar(estado, perguntas)` que implementa o modo híbrido: (1) tenta Laya Server; (2) se score < 0.7 (baixa confiança) ou erro, usa Opus como revisor/fallback; (3) retorna a decisão com metadados (qual classificador usou, score, tempo). Configurar variáveis de ambiente: `LAYA_SERVER_URL` (padrão: `http://localhost:8000`), `ANTHROPIC_API_KEY` (para Opus), `CLASSIFICADOR_MODE` (padrão: `hybrid`; opções: `laya`, `opus`, `hybrid`). Função `status()` para health check do Laya. Tratar erros de conexão e timeouts. Exportar em `src/lib/index.ts`.
- **Critérios de Aceitação:** Wrapper TypeScript funcional; tipos conferidos contra a especificação da fonte oficial; modo híbrido implementado; Opus integrado como fallback; `npm run typecheck` verde. **Sem testes novos** (regra do usuário: nunca escrever testes, exceto para corrigir bug).
- **Commit:** pendente
- **Anotação:** Formato de request/response do `/v1/systemone` deve ser tirado da fonte oficial <https://github.com/NandhaKishorM/laya>, não deduzido. Integrado da SUB-51 para usar Laya Server como classificador primário e Opus como revisor/fallback. Vantagens: Laya < 1s e grátis na maioria dos casos; Opus garante precisão em casos complexos ou quando Laya tem baixa confiança (score < 0.7). Configurável via `CLASSIFICADOR_MODE`.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.2 — Skill `classificar-tarefa` (níveis, sinais, matriz ferramenta × modelo)

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar `.agents/skills/classificar-tarefa/SKILL.md`: níveis `LEVE` (tarefa fácil) / `MEDIO` (média) / `PESADO` (difícil) com sinais concretos, ordem de decisão (a regra mais restritiva vence; na dúvida, sobe o nível), **matriz ferramenta × modelo × nível** (Claude Code local/nuvem, Gemini, Grok, DeepSeek, Devin), exemplos reais do quadro e o formato de saída (`- **Nível:** X` abaixo de `Prioridade:` + justificativa curta na anotação). A skill usa o wrapper do Laya (`src/lib/laya.ts`) para classificação automática em vez de chamada manual Opus. Proibido: mudar `Prioridade`, reclassificar bloco travado por outro agente ou sob 🔒 trava especial.
- **Critérios de Aceitação:** Skill com frontmatter válido; matriz **confirmada pelo usuário** e registrada na anotação; integração com Laya funcional.
- **Commit:** pendente
- **Anotação:** Plano em `docs/equipe-de-agentes.md`. Atualizado para usar Laya Server. Em 2026-10-13 12:25 o usuário definiu: **DeepSeek V4.1 Flash** pega tarefa fácil (`LEVE`); já está na matriz do plano. Em 2026-10-13 12:27 o usuário definiu: **Grok Bot** pega **só** tarefa fácil (`LEVE`); linha própria na matriz do plano. Em 2026-10-13 12:29 o usuário definiu: **Devin** (plano Free) pega **só** tarefa fácil (`LEVE`). Em 2026-10-13 12:31 o usuário definiu: **Antigravity** (Starter Quota) pega **só** tarefa fácil (`LEVE`), em linha separada do Gemini CLI. Em 2026-10-13 12:34 o usuário definiu: **Grok (SuperGrok)** pega só até tarefa média (`LEVE` com modelo rápido, `MEDIO` com Grok 4.7); não pega `PESADO`. Em 2026-10-13 12:35 o usuário definiu: **tarefa difícil (`PESADO`) só para o Claude Code com Opus 5.5 ou superior, ou Fable**; nenhuma outra ferramenta ou modelo pega `PESADO` (Gemini CLI passa a ir só até `MEDIO`).
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.3 — Script `scripts/sincronizar-agentes.mjs` (`.agents/` → `.claude/`)

**Próximo passo:** nenhum (concluída).

- **Descrição:** Script Node que copia `.agents/skills/*` para `.claude/skills/*` e `.agents/agents/*` para `.claude/agents/*` (o Claude Code só lê `.claude/`, local e nuvem). Script `npm run sync:agentes` no `package.json`. Não toca em `.claude/settings.local.json` nem em `.claude/launch.json`.
- **Critérios de Aceitação:** `node --check` sem erro; execução copia os arquivos; nada fora de `skills/` e `agents/` é alterado.
- **Commit:** `feat(SUB-47.3)` (Claude Code (Opus 5.5) (local · main), 2026-10-13)
- **Anotação:** Plano em `docs/equipe-de-agentes.md`. **Entrega (2026-10-13 15:40):** `scripts/sincronizar-agentes.mjs` (Node, sem dependências) copia `.agents/skills/**` e `.agents/agents/**` para `.claude/` só quando o conteúdo mudou, e **nunca apaga** nada em `.claude/` (a cópia da `proxima-task` tem `evals/` e `test_output.md` próprios, que o usuário pediu para manter); `npm run sync:agentes` no `package.json`. **Verificação:** `node --check` ok; linhas ≤ 100; execução numa pasta temporária: 3 arquivos copiados (inclusive subpasta), `evals.md` e `settings.local.json` preexistentes intactos, segunda execução sem cópias; no projeto, `skills: 0 copiado(s), 1 já igual(is)` (a `proxima-task` já estava sincronizada).
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.4 — Agente `classificador-tarefas` (usa Laya, não Opus)

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar `.agents/agents/classificador-tarefas.md` (`model: any`, `skills: [classificar-tarefa]`, ferramentas só de leitura + edição do quadro). Ele lê os blocos sem `Nível`, usa a skill `classificar-tarefa` (que chama o Laya Server) para definir o nível, grava o nível com justificativa e devolve a lista ao líder. Não faz Git. Rodar `npm run sync:agentes`.
- **Critérios de Aceitação:** Frontmatter válido; cópia em `.claude/agents/`; integração com Laya funcional.
- **Commit:** pendente
- **Anotação:** Plano em `docs/equipe-de-agentes.md`. Atualizado para usar Laya Server em vez de Opus (custo zero, < 1s).
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.5 — Executores `executor-leve` (Haiku), `executor-medio` (Sonnet), `executor-pesado` (Opus)

**Próximo passo:** nenhum — entregue. Os executores serão usados pela skill `liderar-equipe` (SUB-47.6).

- **Descrição:** Criar `.agents/agents/executor-leve.md`, `executor-medio.md` e `executor-pesado.md`. Cada um recebe do líder um item já travado, edita **só** os arquivos da tarefa, segue as regras de código do projeto e devolve relatório (arquivos alterados, o que foi feito, pendências). **Proibido** usar Git e editar o quadro. Rodar `npm run sync:agentes`.
- **Critérios de Aceitação:** Frontmatter válido; instruções proíbem Git e edição do quadro; cópias em `.claude/agents/`.
- **Entrega:** commit desta entrega (`feat(SUB-47.5)`) · **Verificação:** frontmatter lido por script Node nos 3 arquivos (`name`, `description`, `tools`, `model` = `haiku`/`sonnet`/`opus`); `npm run sync:agentes` copiou os 3 para `.claude/agents/` e `diff -r .agents/agents .claude/agents` sem diferenças; linhas do corpo ≤ 100 caracteres
- **Anotação:** Plano em `docs/equipe-de-agentes.md`. **Entrega (2026-10-13 15:25, Claude Code (Opus 5.5) (nuvem · main)):** criados `.agents/agents/executor-leve.md` (Haiku), `executor-medio.md` (Sonnet) e `executor-pesado.md` (Opus), com as cópias em `.claude/agents/`. Cada um: recebe do líder a subtarefa já reservada (código, critérios, lista de arquivos), para e pede o que falta se a tarefa parecer acima do nível, segue `codigo-solid.md`, `codigo-limites-nomes.md` e `testes-validacao.md`, e devolve um relatório padrão (arquivos, o que foi feito, validação, pendências). **Proibido** qualquer comando `git`, editar o quadro (`tasks/`) e arquivos fora da lista; tarefa de banco volta para o líder. Ferramentas: `Read, Edit, Write, Glob, Grep, Bash` (o Bash fica para a validação com `npm`; o Git é proibido pelas instruções).
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.6 — Skill `liderar-equipe` (fluxo do líder)

**Próximo passo:** executar conforme a descrição.

- **Descrição:** ⚠️ O modo de execução (1 tarefa por vez em pasta única, 3 clones independentes, ou até 3 em paralelo) **depende de decisão do usuário**; ajustar este bloco antes de começar. Texto original: criar `.agents/skills/liderar-equipe/SKILL.md`: fetch + pull, chamar o classificador nos blocos sem nível, escolher até 3 itens livres por prioridade e com arquivos diferentes, travar (commit + push), disparar os executores em paralelo pelo nível, validar cada entrega (`npm run validar`), commit por tarefa, mover para `task_complete.md`, push. Tarefa de banco: o próprio líder, só na sessão local (regra 11). Rodar `npm run sync:agentes`.
- **Critérios de Aceitação:** Fluxo coerente com as seções 1, 1.1 e 1.2 do `AGENTS.md`; cópia em `.claude/skills/`.
- **Commit:** pendente
- **Anotação:** Plano em `docs/equipe-de-agentes.md`.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.7 — Regra nova no `AGENTS.md`: campo `Nível`, matriz e equipe

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Acrescentar ao `AGENTS.md` (seção nova 1.4): todo bloco tem `Nível:` abaixo de `Prioridade:`; quem cria ou subdivide classifica pela skill `classificar-tarefa` (que usa Laya Server); cada agente se identifica como ferramenta + modelo e só pega item até o nível máximo da sua linha na matriz (modelo forte pega item mais leve só se não houver item livre do seu nível); equipe do Claude Code: cada executor conta como um agente com nome próprio, e só o líder mexe no Git e no quadro.
- **Critérios de Aceitação:** Sem contradição com as regras existentes; `npm run validar` verde.
- **Commit:** pendente
- **Anotação:** Plano em `docs/equipe-de-agentes.md`. Atualizado para mencionar Laya Server.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.8 — `proxima-task` filtra por nível

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Ajustar o passo 3 de `.agents/skills/proxima-task/SKILL.md` para considerar o `Nível` e a matriz da skill `classificar-tarefa`. Rodar `npm run sync:agentes`.
- **Critérios de Aceitação:** Passo 3 cita o nível; cópia atualizada.
- **Commit:** pendente
- **Anotação:** Plano em `docs/equipe-de-agentes.md`.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.9 — Classificar os blocos pendentes do quadro

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Rodar o `classificador-tarefas` em todos os blocos pendentes do `task-principal.md` (exceto os sob 🔒 trava especial e os travados por outro agente) e gravar `Nível:` + justificativa.
- **Critérios de Aceitação:** Todo bloco pendente elegível tem `Nível:`; o diff só acrescenta linhas de nível e justificativa.
- **Commit:** pendente
- **Anotação:** Plano em `docs/equipe-de-agentes.md`.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.10 — Instalação global em `~/.agents/` e `~/.claude/` (só com autorização)

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Com **autorização explícita do usuário no passo**, copiar as skills e os agentes para `~/.agents/` (fonte global) e `~/.claude/skills/` + `~/.claude/agents/` (uso local em qualquer projeto). Para projetos na nuvem, documentar o uso do `npm run sync:agentes` (ou a cópia manual) em cada repositório.
- **Critérios de Aceitação:** Arquivos presentes nas pastas globais; o procedimento para outros projetos fica descrito no plano.
- **Commit:** pendente
- **Anotação:** Plano em `docs/equipe-de-agentes.md`.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.11 — Piloto da equipe em 1 item livre + aceite do usuário

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Rodar a equipe (skill `liderar-equipe`) em 1 item livre do quadro, de ponta a ponta. Anotar o consumo, os problemas e os ajustes. Pedir o aceite do usuário.
- **Critérios de Aceitação:** Item entregue pela equipe com o protocolo completo; aceite do usuário registrado.
- **Commit:** pendente
- **Anotação:** Plano em `docs/equipe-de-agentes.md`.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.12 — Integrar classificação Laya no worker LangGraph

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Integrar a classificação do Laya no worker LangGraph: ao criar uma tarefa via `pegar_proxima_task` ou manualmente, chamar o wrapper do Laya para definir o nível automaticamente. Adicionar campo `nivel_tarefa` na tabela `tasks` (se não existir) ou usar o campo existente. Atualizar o nó `planejar` do worker para considerar o nível na distribuição por modelo (LEVE → modelos pequenos, MEDIO → modelos médios, PESADO → modelos grandes).
- **Critérios de Aceitação:** Classificação automática integrada; campo `nivel_tarefa` presente; nó `planejar` atualizado; testes do worker passam.
- **Commit:** pendente
- **Anotação:** Integrado da SUB-51 para que o worker LangGraph também use o Laya Server. ⚠️ **Tarefa de banco** (coluna `nivel_tarefa` na tabela `tasks`): só o **Claude Code local** com MCP do Supabase pode pegar (regra 11 do `AGENTS.md`); SQL idempotente em `database/`; aplicar no Supabase **só com autorização explícita do usuário**. Nível `PESADO`. Se quiser separar a parte do worker (sem banco), subdividir antes de começar.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.13 — Documentar Laya Server e Opus no README

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Atualizar o `README.md` com seção "Laya Server + Opus (Classificação Híbrida)" descrevendo: o que é o Laya Server (System-One control), como iniciar (Docker Compose), variáveis de ambiente (`LAYA_SERVER_URL`, `ANTHROPIC_API_KEY`, `CLASSIFICADOR_MODE`), modo híbrido (Laya primário, Opus revisor/fallback quando score < 0.7), quando cada classificador é usado, custo e velocidade comparativos, e monitoramento. Adicionar também instruções de troubleshooting (servidor não inicia, timeouts, erros de conexão, API key do Opus). Criar `docs/laya-server.md` com documentação técnica detalhada incluindo a integração com Opus. A documentação deve citar e seguir a fonte oficial <https://github.com/NandhaKishorM/laya>.
- **Critérios de Aceitação:** README atualizado com seção do Laya + Opus; instruções completas; modo híbrido documentado; troubleshooting documentado; `docs/laya-server.md` criado.
- **Commit:** pendente
- **Anotação:** Integrado da SUB-51 para documentação do Laya Server com Opus como revisor/fallback.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE
