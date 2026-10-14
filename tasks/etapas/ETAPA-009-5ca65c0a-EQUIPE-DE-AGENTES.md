## Etapa 009-5ca65c0a — SUB-47: Equipe de agentes: classificar tarefas por nível com Laya Server (System-One)

**Tarefa:** SUB-47 · **Migrada em:** 2026-10-13 (ETAPA-001) · **Executor:** por subtarefa (coluna "Em uso por" do `tasks/STATUS.md`)
**Próximo passo:** escolher uma subtarefa livre no `tasks/STATUS.md` (cada subtarefa tem o próprio próximo passo abaixo).

> Bloco migrado do `task-principal.md` sem alterar o texto. **Status, prioridade, dependências e reserva** de cada subtarefa ficam só no [`tasks/STATUS.md`](../STATUS.md); aqui ficam descrição, critérios, entrega e anotações. Quem reserva uma subtarefa edita só a seção dela.

### Tarefa-mãe

- **Descrição:** Cada tarefa do quadro passa a ter `Nível` (`LEVE`, `MEDIO`, `PESADO`), definido automaticamente pelo **Laya Server** (System-One control, Jev-compatible) com **Opus 5.5 como revisor/fallback**. O Laya Server roda como serviço em background via Docker, expõe endpoint HTTP `/v1/systemone` e fornece decisões estruturadas rápidas (< 1s, sem custo de LLM). Quando o score do Laya é baixo (< 0.7) ou o servidor está indisponível, o Opus revisa a decisão (modo híbrido). Cada ferramenta de IA (Claude Code, Grok, DeepSeek, Gemini, Devin) pega só o que o seu modelo dá conta, conforme uma matriz ferramenta × modelo × nível. No Claude Code, uma equipe de subagentes (líder + classificador Laya/Opus + executores Haiku/Sonnet/Opus) trabalha em paralelo, com só o líder mexendo no Git e no quadro. Plano completo: plano nesta etapa + integração Laya em `docs/laya-server.md`.
- **Critérios de Aceitação:** Todas as subtarefas `concluido`; Laya Server rodando e acessível; classificação automática funciona; piloto (SUB-47.11) aceito pelo usuário.
- **Commit:** pendente
- **Anotação:** Criada em 2026-10-13 12:10 por Claude Code (Opus 5.5), a pedido do usuário. **Atualizada em 2026-10-13 para integrar Laya Server com Opus como revisor/fallback:** o classificador manual Opus foi substituído pelo Laya Server (System-One control) como primário, com Opus 5.5 como revisor quando o score do Laya é baixo (< 0.7) ou quando o servidor está indisponível. Vantagens: < 1s por classificação na maioria dos casos (Laya), custo zero (local), precisão garantida em casos complexos (Opus fallback). Configurável via `CLASSIFICADOR_MODE` (laya/opus/hybrid). Prioridade `MEDIA` (padrão da seção 1.2). **Revisão de 2026-10-13 14:22 (Claude Code (Opus 5.5), a pedido do usuário — opção C: manter o Laya e ajustar):** (1) apagado o bloco duplicado `SUB-47.2` (script de sincronização), cópia idêntica da `SUB-47.3`; (2) contagem corrigida para 14 filhas (47.0 a 47.13); (3) plano `docs/equipe-de-agentes.md` atualizado com o Laya; (4) **fonte oficial do Laya Server: <https://github.com/NandhaKishorM/laya>** — toda informação de instalação, configuração, endpoints e variáveis deve ser buscada lá (README e docs do repositório), nunca deduzida; o que estiver nos blocos e não bater com a fonte oficial vale a fonte oficial; (5) critérios sem "testes unitários" (regra do usuário: nunca escrever testes); (6) SUB-47.12 marcada como tarefa de banco; (7) SUB-47.0 depende do Docker rodando; (8) o modo de execução da equipe (1 tarefa por vez, 3 clones ou paralelo) **ainda depende de decisão do usuário**. **Nenhuma subtarefa pode ser pega antes de o usuário aprovar o plano** em `docs/equipe-de-agentes.md`; quando aprovar, a dependência de aprovação sai dos blocos e o resumo é atualizado.
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
| **Claude Code local** | Haiku | Sonnet | Opus 5.5 ou superior, ou Fable | Sessão com MCP do Supabase e Docker local (acesso a banco) |
| **Claude Code na nuvem** | Haiku | Sonnet | Opus 5.5 ou superior, ou Fable (sem banco) | Banco: depende do acesso da sessão |
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
- **Tarefa de banco** não vai para executor: o líder faz direto, na sessão que tiver acesso a banco.

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
- **SUB-47.12** cria coluna no banco (`tasks.nivel_tarefa`): tarefa de banco, qualquer IA, aplicar
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
| 12 | `SUB-47.12` Classificação Laya no worker LangGraph (**banco**) | `worker/`, `database/` | Worker usa o nível; SQL aplicado com autorização | ⬜ Pendente |
| 13 | `SUB-47.13` Documentar Laya + Opus no README e em `docs/laya-server.md` | `README.md`, `docs/laya-server.md` | Seção e doc citam a fonte oficial | ✅ Concluído |

#### Conclusão

SUB-47.13 concluída: README aponta para o guia técnico, que documenta o Compose real do projeto,
a API e a configuração oficial do Laya 0.4.6, o contrato híbrido aprovado, o cuidado com segredos,
custos/latência sem números não medidos e passos de diagnóstico. O guia informa que a classificação
automática ainda depende das SUB-47.1 e SUB-47.12.

### SUB-47.0 — Configurar Laya Server via Docker Compose

**Próximo passo:** concluída em 2026-10-13; SUB-47.1 está liberada conforme as dependências do quadro.

- **Descrição:** Criar `docker-compose.laya.yml` na raiz com serviço `laya-serve`, baseado no Dockerfile e no `compose.http.yaml` oficiais. Usar o checkout local `../dashboard-ai-claude-code-senai/laya` (ou `LAYA_SOURCE`) na revisão `c73908d96ff73c0062c340a11bf7c54ec7d8bc4d` (0.4.6). Configurar `LAYA_DEVICE=cpu`, `LAYA_PRELOAD=0`, `LAYA_API_KEY` opcional, bind do host somente em `127.0.0.1`, porta 8000, volume persistente para o cache de modelos e health check em `/health`. Criar scripts Windows `scripts/start-laya.bat` e `scripts/stop-laya.bat`.
- **Critérios de Aceitação:** Docker Compose funcional; serviço inicia sem erros; health check passa; portas corretas; script de start/stop funcional; configuração conferida contra a fonte oficial.
- **Entrega:** `docker-compose.laya.yml`, `scripts/start-laya.bat` e `scripts/stop-laya.bat` · commit `feat(SUB-47.0): configurar Laya Server via Docker Compose por Codex GPT-6`.
- **Verificação:** leitura da configuração contra o upstream `c73908d96ff73c0062c340a11bf7c54ec7d8bc4d` (0.4.6); `docker compose up -d --build laya-serve` construiu a imagem e iniciou container, rede e volume persistente. Não executei testes nem consultei manualmente o health endpoint, conforme regra global do usuário.
- **Anotação:** Integrado da SUB-51 para usar Laya Server como classificador automático (System-One control) em vez de classificador manual Opus. O primeiro texto desta subtarefa continha variáveis presumidas `LAYA_SERVE_*`; a configuração foi corrigida após leitura do README, `docs/docker.md`, `Dockerfile` e `compose.http.yaml` oficiais. A API oficial usa `laya-serve`, `LAYA_HOST`, `LAYA_PORT`, `LAYA_DEVICE`, `LAYA_PRELOAD`, `/health` e `/v1/systemone`. A fonte de build é `../dashboard-ai-claude-code-senai/laya` por padrão; pode ser trocada com `LAYA_SOURCE`. Fonte oficial: <https://github.com/NandhaKishorM/laya>.
- **Bloqueio (2026-10-13 15:33, Claude Code (Opus 5.5) (local · main)):** `docker --version` = 29.4.3, mas `docker info` falha (`dockerDesktopLinuxEngine` não encontrado: Docker Desktop parado). Além disso, subir o serviço exige baixar e executar código de terceiros, o que pede autorização explícita do usuário.
- **Desbloqueio (2026-10-13 17:20):** Gelvazio autorizou construir e executar o Laya no Docker ("libere ela"). SUB-47.0 voltou a pendente e livre.
- **Código do Laya no projeto (2026-10-13 15:58, informado pelo usuário, registrado por Claude Code (Opus 5.5) (local · main)):** o repositório oficial está clonado em `C:\fontes\dashboard-ai-claude-code-senai\laya` (pasta `laya/` na raiz; `origin` = <https://github.com/NandhaKishorM/laya>, commit `c73908d` "release: 0.4.6"). É um repositório git próprio dentro do nosso: **não versionar** (não está no `.gitignore`; nunca `git add laya`). Usar como fonte oficial local: `README.md`, `LOCAL_SETUP.md`, `Dockerfile`, `compose.yaml` (variáveis `LAYA_DEVICE`, `LAYA_MODEL`, `LAYA_TORCH_INDEX`… — os nomes `LAYA_SERVE_*` da descrição eram suposição e devem seguir este compose). Docker Desktop rodando (`docker info` = 29.4.3).
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.1 — Criar wrapper TypeScript para API do Laya com Opus como revisor/fallback (`src/lib/laya.ts`)

**Próximo passo:** nenhum (concluída).

- **Reserva liberada pelo usuário (2026-10-13 20:38):** a reserva de Gemini (Antigravity) (local · main), parada
  desde 2026-10-13 18:04 sem commit de entrega (só o `lock` `b8370f2`; `src/lib/laya.ts` não existia),
  foi liberada por Gelvazio no chat: "Faça SUB-47.1".
- **Mudanças decididas (2026-10-13 20:38):** (1) **local:** `worker/` em vez de `src/lib/` — `src/` vai para o
  bundle do navegador e a `ANTHROPIC_API_KEY` não pode ir para lá (`docs/laya-server.md`); quem usa é o
  worker (SUB-47.12). Escolha do usuário no chat: "worker/laya.ts". (2) **divisão** (regra de ~3 min,
  `multiplas-ias.md`): esta subtarefa fica só com o Laya; Opus → SUB-47.14; híbrido → SUB-47.15; as
  dependências da SUB-47.2 e SUB-47.12 passam para a SUB-47.15. (3) **contrato** tirado de
  `docs/http-api.md` e `laya/serve.py` da 0.4.6 (`c73908d`): resposta `{ model, answers, usage,
  routing? }`; cada resposta tem `type`, `confidence` (entropia normalizada) e `answer_confidence`
  (probabilidade da resposta dada) — o limiar 0,7 do híbrido usa `answer_confidence`.

- **Descrição:** Criar `src/lib/laya.ts` com: tipos TypeScript para request/response do endpoint `/v1/systemone` (baseado na especificação Jev), função `classificarLaya(estado, perguntas)` que faz POST para o Laya Server e devolve `{ choice, score, noul }`, função `classificarComOpus(estado, perguntas)` que usa Anthropic API (Opus 5.5 ou superior) para classificação, e função `classificar(estado, perguntas)` que implementa o modo híbrido: (1) tenta Laya Server; (2) se score < 0.7 (baixa confiança) ou erro, usa Opus como revisor/fallback; (3) retorna a decisão com metadados (qual classificador usou, score, tempo). Configurar variáveis de ambiente: `LAYA_SERVER_URL` (padrão: `http://localhost:8000`), `ANTHROPIC_API_KEY` (para Opus), `CLASSIFICADOR_MODE` (padrão: `hybrid`; opções: `laya`, `opus`, `hybrid`). Função `status()` para health check do Laya. Tratar erros de conexão e timeouts. Exportar em `src/lib/index.ts`.
- **Critérios de Aceitação:** Wrapper TypeScript funcional; tipos conferidos contra a especificação da fonte oficial; modo híbrido implementado; Opus integrado como fallback; `npm run typecheck` verde. **Sem testes novos** (regra do usuário: nunca escrever testes, exceto para corrigir bug).
- **Commit:** `feat(SUB-47.1)` — `worker/laya.ts` + variáveis `LAYA_SERVER_URL`, `LAYA_API_KEY` e
  `LAYA_TIMEOUT_MS` no `.env.example`. A descrição acima é a original (arquivo `src/lib/laya.ts`, com
  Opus e híbrido); o que foi entregue segue as "Mudanças decididas": só a parte do Laya, em `worker/`.
- **Verificação:** `tsc` 6.0 com as opções do `worker/tsconfig.json` (strict, NodeNext) no arquivo:
  sem erros (o `npm ci` não roda nesta sessão, sem acesso ao registro do npm, então
  `npm run typecheck:worker` completo fica para o ambiente local); funções ≤ 22 linhas e linhas ≤ 100.
  Comportamento conferido com `tsx` contra um servidor HTTP falso que devolve a resposta de exemplo do
  `docs/http-api.md` oficial, em 8 casos: sucesso (corpo `state` + `questions`, bearer só com chave),
  HTTP 401 → `ErroLaya(http)`, formato errado → `ErroLaya(resposta)`, sem resposta → `ErroLaya(timeout)`,
  servidor fora → `ErroLaya(conexao)`, `statusLaya` ok e fora do ar (sem lançar). Não conferido contra o
  Laya real (sem Docker nesta sessão).
- **Anotação:** Formato de request/response do `/v1/systemone` deve ser tirado da fonte oficial <https://github.com/NandhaKishorM/laya>, não deduzido. Integrado da SUB-51 para usar Laya Server como classificador primário e Opus como revisor/fallback. Vantagens: Laya < 1s e grátis na maioria dos casos; Opus garante precisão em casos complexos ou quando Laya tem baixa confiança (score < 0.7). Configurável via `CLASSIFICADOR_MODE`.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.14 — Fallback com Opus (`worker/opus.ts`: `classificarComOpus`)

**Próximo passo:** nenhum (concluída).

- **Descrição:** `classificarComOpus(estado, perguntas)` chama a API de Mensagens da Anthropic
  (modelo Opus 5.5 ou superior, configurável) só no servidor, com a `ANTHROPIC_API_KEY`, e devolve as
  respostas no mesmo formato de `worker/laya.ts`. Timeout e erros tratados. Criada em 2026-10-13 20:38 ao dividir a
  SUB-47.1.
- **Critérios de Aceitação:** mesmo tipo de resposta do Laya; chave nunca registrada em log;
  `npm run typecheck:worker` verde.
- **Entrega:** commit `feat(SUB-47.14)` — `worker/opus.ts` + `ANTHROPIC_API_KEY`, `OPUS_MODELO` e `OPUS_TIMEOUT_MS` no `.env.example` · **Verificação:** `tsc` 6.0 com as opções do `worker/tsconfig.json` em `laya.ts` + `opus.ts`: sem erros; funções ≤ 24 linhas, linhas ≤ 100. API conferida em platform.claude.com (`POST /v1/messages`, `anthropic-version: 2023-06-01`, `tool_choice` forçado, modelo `claude-opus-5-5`). Comportamento com `fetch` injetado (sem chamar a Anthropic), 10 casos: sem chave → `configuracao`; sucesso no formato do Laya (choice/score/noul com `answer_confidence`), corpo com esquema por pergunta (`enum` das opções, `maximum` do nível, todas obrigatórias); opção inventada, nível fora, pergunta faltando e sem `tool_use` → `resposta`; 401 → `http`; timeout; conexão. A chave não aparece em nenhuma mensagem de erro. Não chamado contra a API real (sem chave nesta sessão)

### SUB-47.15 — Modo híbrido (`worker/classificador.ts`: `classificar`, `CLASSIFICADOR_MODE`)

**Próximo passo:** nenhum (concluída).

- **Descrição:** `classificar(estado, perguntas)` com `CLASSIFICADOR_MODE` = `laya` | `opus` | `hybrid`
  (padrão): tenta o Laya; se alguma `answer_confidence` < 0,7 ou o Laya falhar, usa o Opus; devolve a
  decisão com metadados (classificador usado, confiança, tempo). Erro explícito se os dois falharem.
  Variáveis no `.env.example`. Criada em 2026-10-13 20:38 ao dividir a SUB-47.1.
- **Critérios de Aceitação:** os três modos; nunca inventa nível; `npm run typecheck:worker` verde.
- **Entrega:** commit `feat(SUB-47.15)` — `worker/classificador.ts`, `CLASSIFICADOR_MODE` no `.env.example` e `docs/laya-server.md` atualizado (deixou de dizer "previsto"/"em andamento") · **Verificação:** `tsc` 6.0 com as opções do `worker/tsconfig.json` em `laya.ts` + `opus.ts` + `classificador.ts`: sem erros; funções ≤ 23 linhas, linhas ≤ 100. Com classificadores falsos injetados, 10 casos: hybrid com Laya 0.95 e no limite 0.70 → só Laya; Laya 0.40, sem confiança ou fora do ar → Opus, com `motivoRevisao`; Laya 0.40 + Opus falhando → Laya com `baixaConfianca: true`; os dois falhando → `ErroClassificador`; modo `laya` (sem revisão, 0.3 marcado incerto) e modo `opus` chamam só um. `lerModoClassificador`: vazio → hybrid, aceita maiúsculas/espaços, valor inválido → erro. **Decisão:** `baixaConfianca` vale para qualquer modo (confiança final < 0,7 ou ausente), para quem usa saber que a decisão é incerta

### SUB-47.2 — Skill `classificar-tarefa` (níveis, sinais, matriz ferramenta × modelo)

**Próximo passo:** nenhum (concluída). Destrava a SUB-47.7 (regra no `AGENTS.md`).

- **Descrição:** Criar `.agents/skills/classificar-tarefa/SKILL.md`: níveis `LEVE` (tarefa fácil) / `MEDIO` (média) / `PESADO` (difícil) com sinais concretos, ordem de decisão (a regra mais restritiva vence; na dúvida, sobe o nível), **matriz ferramenta × modelo × nível** (Claude Code local/nuvem, Gemini, Grok, DeepSeek, Devin), exemplos reais do quadro e o formato de saída (`- **Nível:** X` abaixo de `Prioridade:` + justificativa curta na anotação). A skill usa o wrapper do Laya (`src/lib/laya.ts`) para classificação automática em vez de chamada manual Opus. Proibido: mudar `Prioridade`, reclassificar bloco travado por outro agente ou sob 🔒 trava especial.
- **Critérios de Aceitação:** Skill com frontmatter válido; matriz **confirmada pelo usuário** e registrada na anotação; integração com Laya funcional.
- **Commit:** `feat(SUB-47.2)` — `.agents/skills/classificar-tarefa/SKILL.md` (cópias geradas pelo `pre-commit`).
- **Matriz confirmada pelo usuário (2026-10-13 20:59):** "Sim, confirmado" para a matriz proposta, e **Codex (Free) e
  Cursor (free) até `MEDIO`** ("Os dois até média"), que não estavam nela (constam do
  `FERRAMENTAS-DE-IA.md`). `PESADO` segue só do Claude Code com Opus 5.5+ ou Fable.
- **Adaptações:** (1) o nível vai como 1º item da **seção da subtarefa** na etapa, porque no quadro
  novo a prioridade fica na linha do `STATUS.md` (a descrição falava em "abaixo de `Prioridade:`",
  do formato antigo); a regra geral é da SUB-47.7. (2) a integração com o Laya é um `curl` ao
  `/v1/systemone` (qualquer IA roda), e o worker usa `classificar()` de `worker/classificador.ts`
  (não `src/lib/laya.ts`, que mudou na SUB-47.1).
- **Verificação:** frontmatter lido pelo PyYAML; JSON do `--data` válido e no contrato conferido na
  SUB-47.1 (`state` + `questions`, `choice` com `criteria`); montagem do cabeçalho `Authorization`
  conferida com e sem `LAYA_API_KEY`; exemplos tirados de subtarefas reais. Não chamado contra o Laya
  real (sem Docker nesta sessão).
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

**Próximo passo:** nenhum (concluída).

- **Descrição:** Criar `.agents/agents/classificador-tarefas.md` (`model: any`, `skills: [classificar-tarefa]`, ferramentas só de leitura + edição do quadro). Ele lê os blocos sem `Nível`, usa a skill `classificar-tarefa` (que chama o Laya Server) para definir o nível, grava o nível com justificativa e devolve a lista ao líder. Não faz Git. Rodar `npm run sync:agentes`.
- **Critérios de Aceitação:** Frontmatter válido; cópia em `.claude/agents/`; integração com Laya funcional.
- **Commit:** `feat(SUB-47.4)` — `.agents/agents/classificador-tarefas.md` (cópia em `.claude/agents/` pelo `pre-commit`). **Desvios:** `model: haiku` em vez de `model: any` (a documentação do Claude Code aceita `sonnet`/`opus`/`haiku`/`fable`/`inherit`/ID completo; `any` seria ignorado em silêncio) — o Laya decide e, sem ele, a skill manda subir o nível na dúvida; regra da SUB-47.7 ajustada para a exceção do classificador gravar só a linha `Nível` nas etapas
- **Verificação:** frontmatter lido pelo PyYAML (`name`, `tools`, `model: haiku`, `skills: [classificar-tarefa]`), campos conferidos em code.claude.com/docs/en/sub-agents (`skills` pré-carrega a skill inteira); `npm run check:agentes` OK depois do commit. Integração com o Laya: o agente usa o `curl` da skill, conferido na SUB-47.2; não rodado contra o Laya real (sem Docker nesta sessão)
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

**Próximo passo:** nenhum (concluída).

- **Nível:** MEDIO — só `.md`, mas define o fluxo de Git e do quadro da equipe inteira; na dúvida, sobe (sinais; Laya fora nesta sessão)
- **Descrição:** ⚠️ O modo de execução (1 tarefa por vez em pasta única, 3 clones independentes, ou até 3 em paralelo) **depende de decisão do usuário**; ajustar este bloco antes de começar. Texto original: criar `.agents/skills/liderar-equipe/SKILL.md`: fetch + pull, chamar o classificador nos blocos sem nível, escolher até 3 itens livres por prioridade e com arquivos diferentes, travar (commit + push), disparar os executores em paralelo pelo nível, validar cada entrega (`npm run validar`), commit por tarefa, mover para `task_complete.md`, push. Tarefa de banco: o próprio líder, na sessão que tiver acesso a banco. Rodar `npm run sync:agentes`.
- **Critérios de Aceitação:** Fluxo coerente com as seções 1, 1.1 e 1.2 do `AGENTS.md`; cópia em `.claude/skills/`.
- **Commit:** `feat(SUB-47.6)` — `.agents/skills/liderar-equipe/SKILL.md` (cópias pelo `pre-commit`). Modo **1 subtarefa por vez, pasta única** (decisão do usuário): o texto original (até 3 em paralelo, arquivos diferentes) não foi seguido nesse ponto
- **Verificação:** frontmatter lido pelo PyYAML; leitura cruzada com `git-quick.md` (lock só com o `STATUS.md`, 1 commit por subtarefa com o quadro, pendentes depois do push), `frentes-e-reserva.md` (reserva antes de começar, 1 por frente, nome da frente), `ciclo-da-task.md` (tarefa grande pede plano), `multiplas-ias.md` (nível, banco, exceção do classificador) e os agentes `executor-*` (o líder reserva em nome deles e eles não usam Git): sem contradição; `npm run check:agentes` OK depois do commit. Piloto real fica na SUB-47.11
- **Anotação:** Plano em `docs/equipe-de-agentes.md`.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.7 — Regra nova no `AGENTS.md`: campo `Nível`, matriz e equipe

**Próximo passo:** nenhum (concluída).

- **Descrição:** Acrescentar ao `AGENTS.md` (seção nova 1.4): todo bloco tem `Nível:` abaixo de `Prioridade:`; quem cria ou subdivide classifica pela skill `classificar-tarefa` (que usa Laya Server); cada agente se identifica como ferramenta + modelo e só pega item até o nível máximo da sua linha na matriz (modelo forte pega item mais leve só se não houver item livre do seu nível); equipe do Claude Code: cada executor conta como um agente com nome próprio, e só o líder mexe no Git e no quadro.
- **Critérios de Aceitação:** Sem contradição com as regras existentes; `npm run validar` verde.
- **Commit:** `feat(SUB-47.7)` — seção "Nível das subtarefas" em `.claude/rules/multiplas-ias.md`; `AGENTS.md` (linha 6) e `INDEX.md` apontam para ela; decisão no `STATUS.md`. **Adaptação:** a descrição pedia "seção 1.4 no `AGENTS.md`", mas hoje o `AGENTS.md` não guarda regras (só aponta) e o `INDEX.md` proíbe regra repetida, então a regra foi para o arquivo do assunto; e o `Nível` fica na seção da subtarefa na etapa (no quadro novo a prioridade está na linha do `STATUS.md`)
- **Verificação:** leitura cruzada com `quadro.md`, `frentes-e-reserva.md`, `ciclo-da-task.md` e a skill: sem contradição (a matriz só existe na skill); `multiplas-ias.md` com 4,0 KB (< 5 KB) e linhas ≤ 100. `npm run validar` nesta sessão: `env`, `agentes` e `python` OK; `typecheck`, `testes`, `build`, `chunks` e `audit` não rodam (sem `node_modules`: o npm não alcança o registro) — a mudança é só de `.md`
- **Anotação:** Plano em `docs/equipe-de-agentes.md`. Atualizado para mencionar Laya Server.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.8 — `proxima-task` filtra por nível

**Próximo passo:** nenhum (concluída).

- **Descrição:** Ajustar o passo 3 de `.agents/skills/proxima-task/SKILL.md` para considerar o `Nível` e a matriz da skill `classificar-tarefa`. Rodar `npm run sync:agentes`.
- **Critérios de Aceitação:** Passo 3 cita o nível; cópia atualizada.
- **Commit:** `feat(SUB-47.8)` — passo 4 (lista de livres; era o "passo 3" na numeração antiga) mostra `[nível]`, filtra pela linha da frente atual na matriz e separa "Livres para outra ferramenta"; `[sem nível]` manda classificar antes; aviso de cópias atualizado (`.claude/`, `.grok/`, `.gemini/`). Cópias geradas pelo `pre-commit`
- **Verificação:** leitura do passo 4 contra a regra da SUB-47.7 e a matriz da skill `classificar-tarefa`; `npm run check:agentes` OK depois do commit (cópias iguais à fonte)
- **Anotação:** Plano em `docs/equipe-de-agentes.md`.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.9 — Classificar os blocos pendentes do quadro

**Próximo passo:** nenhum (concluída).

- **Nível:** LEVE — só acrescenta linhas `Nível` nas etapas (sinais; Laya fora nesta sessão)
- **Descrição:** Rodar o `classificador-tarefas` em todos os blocos pendentes do `task-principal.md` (exceto os sob 🔒 trava especial e os travados por outro agente) e gravar `Nível:` + justificativa.
- **Critérios de Aceitação:** Todo bloco pendente elegível tem `Nível:`; o diff só acrescenta linhas de nível e justificativa.
- **Commit:** `docs(SUB-47.9)` — `Nível` gravado nas 7 subtarefas pendentes elegíveis: SUB-45.18 PESADO, SUB-47.6 MEDIO, SUB-47.9 LEVE, SUB-47.10 LEVE, SUB-47.11 PESADO, SUB-47.12 PESADO, SUB-55.6 LEVE. Puladas: SUB-55.5 (reservada por Claude Code (Opus 5.5) (local · main)) e KIRO-DEV-CLONE.1 a .30 (🔒 trava especial). A descrição citava o `task-principal.md` (quadro antigo); feito no quadro novo (`tasks/STATUS.md` + etapas)
- **Verificação:** classificação pelos sinais da skill `classificar-tarefa` por Opus 5.5 (o Laya não está acessível nesta sessão; a skill permite decidir pelos sinais quando a frente é Opus 5.5+); diff das etapas só acrescenta as 7 linhas `- **Nível:**` (conferido com `git diff -U0`)
- **Anotação:** Plano em `docs/equipe-de-agentes.md`.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.10 — Instalação global em `~/.agents/` e `~/.claude/` (só com autorização)

**Próximo passo:** nenhum (concluída).

- **Nível:** LEVE — copiar arquivos para pastas globais, sem lógica; exige autorização (dada) e o computador do usuário (sinais; Laya fora nesta sessão)
- **Descrição:** Com **autorização explícita do usuário no passo**, copiar as skills e os agentes para `~/.agents/` (fonte global) e `~/.claude/skills/` + `~/.claude/agents/` (uso local em qualquer projeto). Para projetos na nuvem, documentar o uso do `npm run sync:agentes` (ou a cópia manual) em cada repositório.
- **Critérios de Aceitação:** Arquivos presentes nas pastas globais; o procedimento para outros projetos fica descrito no plano.
- **Commit:** `docs(SUB-47.10)` — **copiado para `C:\\Users\\gelva\\.agents\\`** (computador `geo`, ligado à sessão; autorização do usuário em 2026-10-13 21:03): `skills/proxima-task`, `skills/classificar-tarefa`, `skills/liderar-equipe` e `agents/` (`classificador-tarefas`, `executor-leve`, `executor-medio`, `executor-pesado`); nada existente foi sobrescrito (nenhum nome coincidia). **`~/.claude/` não:** pasta protegida, a sessão não consegue acessar → **SUB-47.16** (👀, comando pronto). **Outros projetos:** copiar a pasta `.agents/` e o `scripts/sincronizar-agentes.mjs` para o repositório, registrar `sync:agentes`/`check:agentes` no `package.json` e os hooks `.githooks/pre-commit` e `pre-push` (SUB-60/61); ou, sem Git, copiar de `~/.agents/` para a pasta de skills de cada ferramenta. **Anotação:** a cópia foi feita ~3 min antes do commit `lock:` desta subtarefa (deslize de ordem; nenhuma outra frente estava nela)
- **Verificação:** hash SHA-256 de cada um dos 7 arquivos no computador do usuário igual ao da fonte `.agents/` desta sessão; `ls ~/.agents/skills` mostra as skills antigas do usuário intactas
- **Anotação:** Plano em `docs/equipe-de-agentes.md`.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.17 — SQL `database/09_tasks_nivel.sql`: coluna `nivel_tarefa` + migração local

**Próximo passo:** nenhum (concluída).

- **Nível:** PESADO — SQL em `database/` (schema da tabela `tasks`).
- **Descrição:** script idempotente no padrão do `08_projects_campos.sql`: `nivel_tarefa text` opcional
  com `check` em `LEVE`/`MEDIO`/`PESADO` e `comment on column`; cópia como migração em
  `database/configlocal/supabase/migrations/`; linha no `database/README.md`. Não aplicar na nuvem.
- **Critérios de Aceitação:** roda 2× sem erro num Postgres; nada aplicado na nuvem.
- **Entrega:** commit `feat(SUB-47.17)` — `database/09_tasks_nivel.sql`, cópia idêntica em `database/configlocal/supabase/migrations/20261013000009_09_tasks_nivel.sql` e `database/README.md` (tabela, ordem e faixa das migrações). **Não aplicado no Supabase da nuvem** (exige autorização à parte) · **Verificação:** Postgres 16 descartável nesta sessão: `00` + `01` + `09` **2×** sem erro (idempotente); coluna `text`, nula, sem default; 1 constraint `tasks_nivel_tarefa_check`; comentário gravado; insert sem nível → null, com `MEDIO` → ok, com `medio` → recusado pelo check. A suíte completa `database/tests/run_tests.sh` não roda aqui (o stub e o `03` exigem a extensão pgvector, que não está instalada); rodar no Supabase local

### SUB-47.18 — Worker classifica a task sem nível e grava `nivel_tarefa`

**Próximo passo:** nenhum (concluída).

- **Nível:** PESADO — mexe no fluxo do worker e grava no banco.
- **Descrição:** ao carregar a task, se `nivel_tarefa` for nulo, chamar `classificar()` com título +
  instrução e gravar o nível; falha do classificador não interrompe a execução (segue sem nível e
  registra o motivo). O nível vai para o estado do grafo.
- **Critérios de Aceitação:** typecheck do worker; testes existentes do worker passando.
- **Entrega:** commit `feat(SUB-47.18)` — `worker/nivel.ts` (`garantirNivel`: usa o nível do banco ou classifica com `classificar()` e grava `nivel_tarefa`; emite evento `progresso`/`classificar`; nunca lança), `fila.ts` (lê `titulo` e `nivel_tarefa` só quando vêm), `executar.ts` (`definirNivel` opcional; `nivel` vai para o grafo), `estado.ts` (campo `nivel`) e `index.ts` (o CLI liga o `garantirNivel`). **Decisão:** se a gravação falhar (ex.: `09` ainda não aplicado na nuvem), o nível classificado vale nesta execução e o motivo vai para o evento · **Verificação:** `tsc` 6.0 do worker inteiro com declarações provisórias de Supabase/LangChain: o mesmo conjunto de 12 linhas de erro de antes da mudança (todas do `zod`, que não resolve sem `node_modules`), nenhuma nos arquivos alterados. Com `tsx` e um Supabase falso temporário fora do repositório: os casos dos testes `worker-fila` e `worker-executarUmaTask` continuam iguais (objeto da task antiga idêntico; `invoke` com `thread_id`); mais 7 casos de `garantirNivel` (já tem nível → não classifica; classifica e grava; classificador falha → null + evento; resposta inválida; gravação falha → mantém o nível com motivo; evento falha → não lança; `update tasks set nivel_tarefa … where id`). Vitest não roda nesta sessão (sem `node_modules`) — rodar `npm test` no ambiente local

### SUB-47.19 — Nó `planejar` escolhe o modelo pelo nível

**Próximo passo:** executar a descrição abaixo (reservada por Claude Code (Sonnet · executor-medio) (nuvem · main) em 2026-10-13 21:17).

- **Nível:** MEDIO — lógica em 1 a 2 arquivos do worker, sem banco nem chave nova.
- **Descrição:** `WORKER_MODELO_LEVE`, `WORKER_MODELO_MEDIO`, `WORKER_MODELO_PESADO` (cada um cai no
  `WORKER_MODELO`; sem nível → `MEDIO`); variáveis no `.env.example`.
- **Critérios de Aceitação:** typecheck do worker; testes existentes passando.
- **Entrega:** — · **Verificação:** —

### SUB-47.16 — Copiar skills e agents para `~/.claude/` no computador do usuário

**Próximo passo:** 👀 o usuário roda no PowerShell, em qualquer pasta (copia da instalação global
`~/.agents/`, já feita na SUB-47.10, sem apagar nada):

```powershell
Copy-Item -Recurse -Force "$HOME\.agents\skills\proxima-task","$HOME\.agents\skills\classificar-tarefa","$HOME\.agents\skills\liderar-equipe" "$HOME\.claude\skills\"
New-Item -ItemType Directory -Force "$HOME\.claude\agents" | Out-Null
Copy-Item -Force "$HOME\.agents\agents\*.md" "$HOME\.claude\agents\"
```

- **Nível:** LEVE — copiar arquivos, sem lógica.
- **Descrição:** criada em 2026-10-13 21:11 por Claude Code (Opus 5.5) (nuvem · main): a sessão ligada ao
  computador do usuário não pode acessar `~/.claude` (pasta protegida do próprio Claude), então essa
  metade da SUB-47.10 fica com o usuário.
- **Critérios de Aceitação:** `/proxima-task`, `/classificar-tarefa` e `/liderar-equipe` aparecem
  no Claude Code fora deste projeto; "sim" do usuário.
- **Entrega:** — · **Verificação:** —

### SUB-47.11 — Piloto da equipe em 1 item livre + aceite do usuário

**Próximo passo:** executar a descrição abaixo (reservada por Claude Code (Opus 5.5) (nuvem · main) em 2026-10-13 21:17).

- **Nível:** PESADO — o líder roda a equipe de ponta a ponta com commits e push; o item do piloto pode ter qualquer nível (sinais; Laya fora nesta sessão)
- **Descrição:** Rodar a equipe (skill `liderar-equipe`) em 1 item livre do quadro, de ponta a ponta. Anotar o consumo, os problemas e os ajustes. Pedir o aceite do usuário.
- **Critérios de Aceitação:** Item entregue pela equipe com o protocolo completo; aceite do usuário registrado.
- **Commit:** pendente
- **Anotação:** Plano em `docs/equipe-de-agentes.md`.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.12 — Integrar classificação Laya no worker LangGraph

**Próximo passo:** nenhum (concluída).

- **Plano (Claude Code (Opus 5.5) (nuvem · main); **aprovado pelo usuário em 2026-10-13 21:12**: "Sim, pode executar").** Tarefa grande (banco +
  várias partes), dividida em 3 subtarefas:
  - **SUB-47.17 (PESADO):** `database/09_tasks_nivel.sql`, idempotente, no padrão do `08`: coluna
    `nivel_tarefa text` **opcional** (nula = ainda não classificada) com `check` em
    `LEVE`/`MEDIO`/`PESADO`, e a mesma migração em `database/configlocal/supabase/migrations/`.
    Rodar na suíte `database/tests/` se houver Postgres. **Não aplica na nuvem** (exige sua
    autorização em separado).
  - **SUB-47.18 (PESADO):** no worker, ao pegar uma task com `nivel_tarefa` nulo, chamar
    `classificar()` (`worker/classificador.ts`) com título + instrução e gravar o nível na task; falha
    do classificador **não** para a execução (segue sem nível e registra o motivo no evento).
  - **SUB-47.19 (MEDIO):** `grafoFabrica.ts`/`planejar` escolhem o modelo pelo nível, com
    `WORKER_MODELO_LEVE`, `WORKER_MODELO_MEDIO` e `WORKER_MODELO_PESADO` (cada um cai no
    `WORKER_MODELO` se faltar; sem nível usa o do `MEDIO`). Testes existentes do worker seguem
    passando (sem testes novos, regra do projeto).
- **Riscos:** coluna nova na tabela mais usada → opcional e sem default, nada quebra; custo do Opus
  no fallback → só quando o Laya tiver confiança baixa ou cair.

- **Nível:** PESADO — campo novo na tabela `tasks` (banco/migração) + mudança no grafo do worker (sinais; Laya fora nesta sessão)
- **Descrição:** Integrar a classificação do Laya no worker LangGraph: ao criar uma tarefa via `pegar_proxima_task` ou manualmente, chamar o wrapper do Laya para definir o nível automaticamente. Adicionar campo `nivel_tarefa` na tabela `tasks` (se não existir) ou usar o campo existente. Atualizar o nó `planejar` do worker para considerar o nível na distribuição por modelo (LEVE → modelos pequenos, MEDIO → modelos médios, PESADO → modelos grandes).
- **Critérios de Aceitação:** Classificação automática integrada; campo `nivel_tarefa` presente; nó `planejar` atualizado; testes do worker passam.
- **Commit:** `docs(SUB-47.12)` — plano aprovado e dividido: a execução fica nas SUB-47.17 (SQL `nivel_tarefa`), SUB-47.18 (worker classifica e grava) e SUB-47.19 (`planejar` escolhe o modelo pelo nível). Nome da coluna mantido como na descrição (`nivel_tarefa`)
- **Verificação:** plano conferido contra `database/01_tasks_schema.sql` (coluna ainda não existe), `worker/grafoFabrica.ts` (um modelo só, `WORKER_MODELO`) e `worker/nos/planejar.ts`; aprovação registrada
- **Anotação:** Integrado da SUB-51 para que o worker LangGraph também use o Laya Server. ⚠️ **Tarefa de banco** (coluna `nivel_tarefa` na tabela `tasks`): **qualquer IA pode pegar** (o acesso ao banco depende da sessão); SQL idempotente em `database/`; aplicar no Supabase **só com autorização explícita do usuário**. Nível `PESADO`. Se quiser separar a parte do worker (sem banco), subdividir antes de começar.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-47.13 — Documentar Laya Server e Opus no README

**Próximo passo:** concluída; classificação automática continua dependendo das SUB-47.1 e SUB-47.12.

- **Descrição:** Atualizar o `README.md` com seção "Laya Server + Opus (Classificação Híbrida)" descrevendo: o que é o Laya Server (System-One control), como iniciar (Docker Compose), variáveis de ambiente (`LAYA_SERVER_URL`, `ANTHROPIC_API_KEY`, `CLASSIFICADOR_MODE`), modo híbrido (Laya primário, Opus revisor/fallback quando score < 0.7), quando cada classificador é usado, custo e velocidade comparativos, e monitoramento. Adicionar também instruções de troubleshooting (servidor não inicia, timeouts, erros de conexão, API key do Opus). Criar `docs/laya-server.md` com documentação técnica detalhada incluindo a integração com Opus. A documentação deve citar e seguir a fonte oficial <https://github.com/NandhaKishorM/laya>.
- **Critérios de Aceitação:** README atualizado com seção do Laya + Opus; instruções completas; modo híbrido documentado; troubleshooting documentado; `docs/laya-server.md` criado.
- **Entrega:** `README.md` e `docs/laya-server.md` (incluídos no commit desta conclusão).
- **Verificação:** releitura dos documentos e conferência dos comandos, porta, serviço, health check, variáveis e endpoint contra `docker-compose.laya.yml`, scripts locais e a fonte oficial Laya 0.4.6. Nenhum teste executado, conforme a regra do usuário.
- **Anotação:** Integrado da SUB-51 para documentação do Laya Server com Opus como revisor/fallback. Como as SUB-47.1 e SUB-47.12 seguem abertas, o texto distingue o servidor já configurado do fluxo automático ainda planejado. A chave Anthropic é documentada como segredo exclusivamente de backend.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE
