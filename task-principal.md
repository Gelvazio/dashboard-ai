# 📋 TASK-PRINCIPAL: Projeto Dashboard AI

> 📦 **Tarefas concluídas:** os blocos `[x]` ficam em [`task_complete.md`](task_complete.md) e não precisam ser lidos. Dependência que não aparece neste quadro está `concluido` lá. Ao concluir uma tarefa, mova o bloco para lá no mesmo commit; para reabrir, traga o bloco de volta.

> **Objetivo:** Construção da solução unificada do **Dashboard AI**, integrando o controle e fila de tarefas da IA (`tasks`), a base de memória persistente vetorial (`ai_memories` / Jev-Mem) e o monitoramento em tempo real do agendador autônomo.
> **Fonte Base:** inspirado no motor de fila do `aulassenai-base` e na especificação de memória Jev-Mem.
> **Direção (2026-10-11):** o Dashboard AI é um **gerenciador genérico de tasks de IA, usável por qualquer projeto** (multi-projeto), não acoplado ao AulasSenai.
> **Regra Geral:** Toda tarefa pode ser subdividida em mini-tarefas menores. Cada tarefa/subtarefa declara obrigatoriamente suas **Dependências** e suas **Subtarefas**. Nenhuma IA pode assumir uma tarefa cujas dependências não estejam `concluido`.

---

## 🔒 PROTOCOLO DE CONCORRÊNCIA PARA AGENTES DE IA

> **TRAVA ATIVA (LOCK):** Se houver uma task marcada na seção **"🔒 TRAVA ATIVA NO MOMENTO"** com status `EM EXECUÇÃO`, **NENHUMA OUTRA IA PODE ASSUMIR AQUELA MESMA TAREFA**.
> Para assumir uma nova tarefa, o agente **DEVE OBRIGATORIAMENTE**:
> 1. Executar `git pull --rebase origin main` **PRIMEIRO** para garantir o estado mais recente.
> 2. Ler obrigatoriamente este arquivo (task-principal.md) ATUALIZADO.
> 3. Conferir a seção **"🔒 TRAVA ATIVA NO MOMENTO"**:
>    - ⛔ **PROIBIÇÃO TOTAL DE CONFLITO:** Se já existir uma task com trava ativa ou status `EM EXECUÇÃO` associada a outro agente, **NENHUMA OUTRA IA PODE ASSUMIR AQUELA MESMA TAREFA**.
> 4. Localizar a próxima sub-task com status `pendente` cujas dependências estejam `concluido`, **pela prioridade**: `MAXIMA` → `ALTA` → `MEDIA` → `BAIXA` (na mesma prioridade, a ordem do quadro). Prioridade menor (ex.: `BAIXA`) só com orientação explícita do usuário — ver seção 1.2 do [`AGENTS.md`](AGENTS.md).
> 5. Gravar a tarefa como bloqueada (status `em_execucao`, nome do agente, data/hora).
> 6. **Executar COMMIT e PUSH do bloqueio IMEDIATAMENTE (antes de criar código da tarefa):**
>    ```bash
>    git add task-principal.md
>    git commit -m "lock: assumindo sub-task SUB-XX por [Nome do Agente]"
>    git push origin main
>    ```
> 7. Ao finalizar, atualizar o status para `concluido`, anotar o hash do `git commit`, registrar a nota de entrega, mover o bloco para `task_complete.md`, executar `git push origin main` e liberar a trava.

---

## 🔒 TRAVA ATIVA NO MOMENTO (LOCK DE AGENTE)

| Propriedade | Valor Atual |
|---|---|
| **Status da Trava:** | 🔒 **OCUPADA** |
| **Sub-task em Execução:** | **SUB-38** |
| **Título da Sub-task:** | Verificação geral de todas as tarefas (marcador `VERIFICADOR-CLAUDE`) |
| **Agente Responsável:** | DeepSeek Harness (deepseek-flash) |
| **Data e Hora de Início:** | 2026-10-12 16:25 |
| **Bloqueio para Outras IAs:** | Nenhuma outra IA pode assumir a SUB-38 (a 🔒 TRAVA ESPECIAL do KIRO-DEV-CLONE continua ativa logo abaixo) |

---

### 🔒 TRAVA ADICIONAL — DeepSeek Harness (deepseek-flash) — SUB-38

| Propriedade | Valor Atual |
|---|---|
| **Status da Trava:** | 🔴 **OCUPADO** |
| **Sub-task em Execução:** | **SUB-38** |
| **Título da Sub-task:** | Verificação geral de todas as tarefas (marcador `VERIFICADOR-CLAUDE`) |
| **Agente Responsável:** | DeepSeek Harness (deepseek-flash) |
| **Data e Hora de Início:** | 2026-10-12 16:25 |
| **Bloqueio para Outras IAs:** | **ATIVADO** — ninguém assume a SUB-38 |

---

### 🔒 TRAVA ADICIONAL — Devin (Cognition AI) — SUB-41.1

| Propriedade | Valor Atual |
|---|---|
| **Status da Trava:** | 🔴 **OCUPADO** |
| **Sub-task em Execução:** | **SUB-41.1** |
| **Título da Sub-task:** Criar `docs/plano-cerebro-memoria-persistente.md` e mover a seção "1. Arquitetura do Banco de Dados (Supabase)" |
| **Agente Responsável:** | Devin (Cognition AI) |
| **Data e Hora de Início:** | 2026-10-12 18:40 |
| **Bloqueio para Outras IAs:** | **ATIVADO** — ninguém assume a SUB-41.1 |

---

### 🔒 TRAVA ADICIONAL — Claude Code (Opus 5.5, sessão em nuvem) — SUB-25.4

| Propriedade | Valor Atual |
|---|---|
| **Status da Trava:** | 🔴 **OCUPADO** |
| **Sub-task em Execução:** | **SUB-25.4** |
| **Título da Sub-task:** | Teste rápido local: telas Fila e Logs |
| **Agente Responsável:** | Claude Code (Opus 5.5, sessão em nuvem) |
| **Data e Hora de Início:** | 2026-10-12 21:32 |
| **Bloqueio para Outras IAs:** | **ATIVADO** — ninguém assume a SUB-25.4 |

---

### 🔒 TRAVA ESPECIAL: KIRO-DEV-CLONE

> **ATENÇÃO:** A tarefa `KIRO-DEV-CLONE` está **TRAVADA PARA TODAS AS IAS**.
> Nenhuma IA pode assumir suas subtarefas sem autorização explícita do usuário.
> Para liberar, o usuário deve remover esta trava manualmente no quadro.

| Propriedade | Valor Atual |
|---|---|
| **Status da Trava:** | 🔴 **TRAVADO PARA TODAS AS IAS** |
| **Tarefa:** | KIRO-DEV-CLONE |
| **Motivo:** Tarefa reservada para implementação manual pelo usuário |
| **Agente Responsável:** — (usuário) |
| **Data e Hora de Início:** 2026-10-12 15:10 |
| **Bloqueio para Outras IAs:** **ATIVADO** |

---

## 📊 Resumo de Progresso
- **Total de Tasks Principais:** 44
- **Subtarefas atômicas (~3 min):** 251
- **Em Execução:** 3 (SUB-38, SUB-41.1, SUB-25.4)
- **Pendentes:** 11 principais (SUB-38, 25, 26, 28, 35, 39, 40, 41, 42, 43, KIRO-DEV-CLONE) + 41 subtarefas
  - livres agora, pela prioridade (seção 1.2 do [`AGENTS.md`](AGENTS.md)): 5 — SUB-25.7, SUB-35.32, SUB-40.7 (só com autorização do usuário) e SUB-43 (atômica) (`MEDIA`); SUB-39.1 (`BAIXA`, só com orientação do usuário). As 30 filhas de `KIRO-DEV-CLONE` (`BAIXA`) estão 🔒 travadas para todas as IAs
  - bloqueadas por dependência: 6 — SUB-26.3 e SUB-26.9 (dependem da mãe SUB-25, ainda pendente), SUB-35.46 (depende da SUB-35.32), SUB-41.2 e SUB-41.3 (cadeia da SUB-41) e SUB-42 (depende da SUB-41)
  - em execução: 3 — SUB-38 (DeepSeek Harness (deepseek-flash)), restaurada ao quadro em 2026-10-12 16:25; SUB-41.1 (Devin (Cognition AI)); SUB-25.4 (Claude Code (Opus 5.5, sessão em nuvem))
  - reservadas: 30 — `KIRO-DEV-CLONE.1` a `KIRO-DEV-CLONE.30`, sob a 🔒 TRAVA ESPECIAL (só o usuário libera)
- **Concluídas:** 239 de 295 blocos (33 principais + 206 subtarefas) — blocos em [`task_complete.md`](task_complete.md)
- **Canceladas:** 0

---

## ⭐ PRIORIDADE MÁXIMA

### [ ] SUB-38: Verificação geral de todas as tarefas (marcador `VERIFICADOR-CLAUDE`)
- **Status:** em_execucao
- **Prioridade:** MAXIMA
- **Executor:** DeepSeek Harness (deepseek-flash) (início: 2026-10-12 16:25)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica; mantida como 1 tarefa por decisão do usuário em 2026-10-12, apesar de passar de ~3 min)
- **Descrição:** Ler todos os blocos do `task-principal.md` e do `task_complete.md` e conferir, um por vez, se a entrega está correta (commits citados existem, arquivos e funções existem e atendem aos critérios, testes e validação). O resultado vai no marcador `- **VERIFICADOR-CLAUDE:**` de cada bloco (já inserido como `PENDENTE`). Valores: `✅ OK`, `⚠️ RESSALVA`, `❌ FALHA` ou `⬜ NÃO IMPLEMENTADA`, sempre com data, hora, agente e evidência. Só leitura: problemas achados viram subtarefas novas, não são corrigidos aqui. Commit e push a cada bloco verificado (`docs(verificador): SUB-XX verificada (<resultado>) por <agente>`). Plano e critérios: [`docs/verificador-claude.md`](docs/verificador-claude.md).
- **Critérios de Aceitação:** Nenhum marcador `VERIFICADOR-CLAUDE: PENDENTE` nos dois quadros; relatório final com a lista de ressalvas e falhas.
- **Commit:** pendente
- **Anotação:** **Restaurada ao quadro (2026-10-12 16:25, DeepSeek Harness (deepseek-flash), a pedido do usuário):** o bloco desta tarefa foi **apagado** do `task-principal.md` pelo commit `32d6f58` ("concluir SUB-38 (verificação parcial) e liberar trava de Devin") e **nunca foi registrado no `task_complete.md`** — ficou fora dos **dois** quadros, deixando a seção `⭐ PRIORIDADE MÁXIMA` vazia e o resumo contando uma pendente que não existia como bloco. Conferido no histórico: `SUB-38:` existe em `32d6f58^`, não existe em `32d6f58` e não aparece no `task_complete.md` daquele commit. Como o critério de aceitação **não** foi atendido — há **268 marcadores `VERIFICADOR-CLAUDE: PENDENTE`** (36 no quadro ativo + 232 no histórico) contra 9 verificados — a tarefa volta como pendente e é assumida na mesma hora pela trava normal. **Estado herdado:** marcador inserido em 246 blocos (`5fb92f7`, hoje 277 por causa das 30 filhas do KIRO e da SUB-25.8); validação geral registrada em [`docs/verificador-claude.md`](docs/verificador-claude.md) (`npm run typecheck`/`build` falhavam com TS6133, corrigido na SUB-25.8); **Progresso (2026-10-12 16:40): 45 de 297 blocos verificados.** Herdados 9 (SUB-25, SUB-25.4, SUB-25.7, SUB-26, SUB-26.3, SUB-26.9 e a mãe SUB-28 com `⚠️ RESSALVA` — esta por citar o commit inexistente `76f243e` na SUB-28.33; confirmado: `cfe88af` existe, `76f243e` não). Meus 36: **4 com evidência real** (`✅ OK` — SUB-28.18, 28.23, 28.25 e 28.32: commits, arquivos e funções conferidos, `npm run typecheck:api` exit 0) e **32 factuais** (`⬜ NÃO IMPLEMENTADA` — SUB-35.46, `KIRO-DEV-CLONE` e as 30 filhas: nada do escopo existe no repositório). Com isso o quadro ativo chegou a **0 pendentes**; depois entraram tarefas novas de outros agentes (SUB-39/40/41/42), então a fila ativa voltou a ter pendentes. **Falta o histórico: ~237 blocos em `task_complete.md`**, na ordem, começando pela `SUB-01` (linha 27). A contagem ao vivo é `grep -c 'VERIFICADOR-CLAUDE: PENDENTE'` nos dois quadros — este texto é um retrato do momento. Sem navegador e sem Docker/Postgres local (restrição registrada em `STATUS.md`).
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE

---

## 🚀 FASE 10: Build, Validação e Documentação

### [ ] SUB-25: Validação de Build e Execução Local
- **Status:** pendente (aguardando subtarefas)
- **Prioridade:** ALTA
- **Executor:** nenhum
- **Depende de:** SUB-01 a SUB-24; subtarefas SUB-25.1 a SUB-25.8
- **Subtarefas:** (subdividida em 4 em 2026-10-11 23:38 por DashboardAI (Grok Bot); a mãe só é concluída quando todas estiverem `concluido`; refinada para 6 em 2026-10-11 23:51; SUB-25.8 criada em 2026-10-12 15:15 por DeepSeek Harness (deepseek-flash) para desbloquear `typecheck` e `build`)
  - `SUB-25.1`: Script `scripts/validar.sh` + `npm run validar` (`concluido`, `2c9664c`)
  - `SUB-25.2`: Rodar `npm ci` + `npm run validar` e registrar em `docs/VALIDACAO.md` (`concluido`, `5b06c99`)
  - `SUB-25.3`: Rodar `database/tests/run_tests.sh` (`concluido`, `cbf3c88`)
  - `SUB-25.4`: Teste rápido local: telas Fila e Logs (`em_execucao`)
  - `SUB-25.6`: Rodar `npm run test:integration` (`concluido`, `7c9891f`)
  - `SUB-25.7`: Teste rápido local: telas Memória e Configurações (`pendente`)
  - `SUB-25.8`: Corrigir erro de tipagem TS6133 em `tests/unit/api-aprovacao.test.ts` (`concluido`, `c933a99`)
- **Descrição:** Rodar compilação de produção (`npm run build`), validar ausência de erros de tipagem TypeScript e verificar integridade de pacotes.
- **Critérios de Aceitação:** Build gerado com sucesso na pasta `dist/` sem alertas impeditivos.
- **Commit:** pendente
- **Anotação:** pendente
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 15:25 (Claude Code): tarefa-mãe pendente: filhas 25.1, 25.2, 25.3 e 25.6 concluídas; 25.4, 25.7 (validação no navegador) e 25.8 (em execução) abertas. Critério ainda não atendido: `npm run build` falha no `tsc -b` (TS6133 em `tests/unit/api-aprovacao.test.ts:111`, corrigido pela SUB-25.8); `npx vite build` sozinho gera `dist/` e `check:chunks` passa (16 chunks ≤ 500 kB).

#### [ ] SUB-25.4: Teste rápido local: telas Fila e Logs
- **Status:** em_execucao
- **Prioridade:** MEDIA
- **Executor:** Claude Code (Opus 5.5, sessão em nuvem) (início: 2026-10-12 21:32)
- **Depende de:** SUB-25.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Subir `npm run preview` contra o banco local e conferir as telas Fila e Logs em 1280x800 e 390x844; registrar no `docs/VALIDACAO.md` (sem commitar screenshots grandes).
- **Critérios de Aceitação:** Sem erros no console; checklist registrado.
- **Commit:** pendente
- **Anotação:** pendente
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 15:48 (Devin): pendente, sem executor. Não há registro das telas Fila e Logs no `docs/VALIDACAO.md`; depende de navegador (não usado nesta verificação).

#### [ ] SUB-25.7: Teste rápido local: telas Memória e Configurações
- **Status:** pendente
- **Prioridade:** MEDIA
- **Executor:** nenhum
- **Depende de:** SUB-25.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Com `npm run preview` contra o banco local, conferir as telas Memória e Configurações em 1280x800 e 390x844; registrar no `docs/VALIDACAO.md`.
- **Critérios de Aceitação:** Sem erros no console; checklist registrado.
- **Commit:** pendente
- **Anotação:** pendente
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 15:49 (Devin): pendente, sem executor. Não há registro das telas Memória e Configurações no `docs/VALIDACAO.md`; depende de navegador (não usado nesta verificação).

### [ ] SUB-26: Documentação Completa e Manual Operacional no `README.md`
- **Status:** pendente (aguardando subtarefas)
- **Prioridade:** MEDIA
- **Executor:** nenhum
- **Depende de:** SUB-25; subtarefas SUB-26.1 a SUB-26.10
- **Subtarefas:** (subdividida em 9 em 2026-10-11 23:38 por DashboardAI (Grok Bot); a mãe só é concluída quando todas estiverem `concluido`; refinada para 10 em 2026-10-11 23:51)
  - `SUB-26.1`: Esqueleto do `README.md` (`concluido`, `67e13c2`)
  - `SUB-26.2`: Seção Arquitetura (`concluido`, `b3f4c36`)
  - `SUB-26.3`: Seção Execução local (`pendente`)
  - `SUB-26.4`: Seção Banco de dados (`concluido`, `62ea6c0`)
  - `SUB-26.5`: Seção Deploy na Vercel (`concluido`, a5c2a8a)
  - `SUB-26.6`: Seção Agentes de IA: configurar clientes MCP (`concluido`, `d7f05f6`)
  - `SUB-26.7`: Seção Memória via MCP (`concluido`, `7fa647b`)
  - `SUB-26.8`: Seção Segurança (`concluido`, `f48b2de`)
  - `SUB-26.9`: Revisão final do README (`pendente`)
  - `SUB-26.10`: Seção Agentes de IA: exemplos do ciclo da fila (`concluido`, `23153af`)
- **Descrição:** Documentar no `README.md` a arquitetura da solução, guia de execução local, deploy na Vercel e instruções para agentes de IA operarem a fila e a memória.
- **Critérios de Aceitação:** Documentação clara, completa e em conformidade com as regras do projeto.
- **Commit:** pendente
- **Anotação:** pendente
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 15:25 (Claude Code): tarefa-mãe pendente: o `README.md` já tem Arquitetura, Banco de dados, Deploy na Vercel, Agentes de IA, Memória via MCP, Segurança e Monitor; faltam as filhas 26.3 (Execução local, linha 90 ainda diz "Seção provisória") e 26.9 (Validação, linha 535 "Seção provisória").

#### [ ] SUB-26.3: Seção Execução local
- **Status:** pendente
- **Prioridade:** MEDIA
- **Executor:** nenhum
- **Depende de:** SUB-26.1, SUB-08.9, SUB-25
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Node 22 (`.nvmrc`), `npm ci`, copiar `.env.example`, `npm run dev`, `npm test`, `npm run test:integration`, `npm run validar`.
- **Critérios de Aceitação:** Comandos conferidos contra o `package.json`.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 15:25 (Claude Code): pendente (bloqueada pela SUB-25). `README.md` linha 88-95: seção "Execução local" ainda provisória; `.nvmrc` existe.

#### [ ] SUB-26.9: Revisão final do README
- **Status:** pendente
- **Prioridade:** MEDIA
- **Executor:** nenhum
- **Depende de:** SUB-26.2, SUB-26.3, SUB-26.4, SUB-26.5, SUB-26.6, SUB-26.7, SUB-26.8, SUB-26.10, SUB-25
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Remover placeholders, conferir links e comandos, incluir a seção Validação com o resultado da SUB-25.
- **Critérios de Aceitação:** Nenhum placeholder; links válidos.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 15:25 (Claude Code): pendente (depende de 26.3 e SUB-25). `README.md` ainda tem 2 placeholders "Seção provisória" (linhas 90 e 535).

---

## 🚀 FASE 11: Orquestração de Tasks com LangChain/LangGraph (última fase)

### [ ] SUB-28: Integração LangChain/LangGraph para Execução de Tasks
- **Status:** pendente (aguardando subtarefas)
- **Prioridade:** MEDIA
- **Executor:** nenhum
- **Depende de:** SUB-01 a SUB-27, SUB-29, SUB-30 (todas as tasks anteriores concluídas); subtarefas SUB-28.1 a SUB-28.32
- **Subtarefas:** (subdividida em 18 em 2026-10-11 23:38 por DashboardAI (Grok Bot); a mãe só é concluída quando todas estiverem `concluido`; refinada para 25 em 2026-10-11 23:51; nova revisão para 32 em 2026-10-12 00:17)
  - `SUB-28.1`: Contrato: identificadores e estado mínimo em `docs/langgraph-contrato.md` (`concluido`, `fc379a6`)
  - `SUB-28.2`: Dependências do worker no `package.json` (`concluido`, `3642a8d`)
  - `SUB-28.3`: Annotation `EstadoExecucao` em `worker/estado.ts` (`concluido`, `21c908b`)
  - `SUB-28.4`: `reivindicar(agente, projeto)` em `worker/fila.ts` (`concluido`, `06e7e4b`)
  - `SUB-28.5`: Allowlist e `obterFerramenta(nome)` em `worker/ferramentas.ts` (`concluido`, `999d1e0`)
  - `SUB-28.6`: Nó `carregarContexto` em `worker/nos/carregarContexto.ts` (`concluido`, `463b3d9`)
  - `SUB-28.7`: Nó `planejar` (chamada ao modelo) em `worker/nos/planejar.ts` (`concluido`, `07ca06f`)
  - `SUB-28.8`: Nó `politica` (aprovação humana) em `worker/nos/politica.ts` (`concluido`, `6ebd647`)
  - `SUB-28.9`: Nó `executar` em `worker/nos/executar.ts` (`concluido`, `9cf0e2a`)
  - `SUB-28.10`: Nó `revisar` (roteamento) em `worker/nos/revisar.ts` (`concluido`, `b1c35a9`)
  - `SUB-28.11`: Nó `finalizar` em `worker/nos/finalizar.ts` (`concluido`, `9575b13`)
  - `SUB-28.12`: Montagem do `StateGraph` em `worker/grafo.ts` (`concluido`, `0d9c835`)
  - `SUB-28.13`: Checkpointer durável em `worker/checkpointer.ts` (`concluido`, `1bd4ca7`)
  - `SUB-28.14`: Reconciliação na retomada em `worker/reconciliar.ts` (`concluido`, `206ba39`)
  - `SUB-28.15`: CLI do worker em `worker/index.ts` (`concluido`, `ba04cc1`)
  - `SUB-28.16`: Endpoint `api/aprovacao.ts`: autenticação e papel (401/403) (`concluido`, `2adb51d`)
  - `SUB-28.17`: Testes do worker: caminho feliz e erro (`concluido`, `46718f9`)
  - `SUB-28.18`: Atualizar `LangChain_LangGraph.md` (status e desvios) (`concluido`, 18c8d9d)
  - `SUB-28.19`: Adaptar ferramentas para `tool()` do LangChain em `worker/ferramentas.ts` (`concluido`, `a9bb258`)
  - `SUB-28.20`: `PlanoSchema` em `worker/plano.ts` (`concluido`, `048e647`)
  - `SUB-28.21`: `classificarFalha(err)` em `worker/falhas.ts` (`concluido`, `04c0f02`)
  - `SUB-28.22`: `executarUmaTask(deps)` em `worker/executar.ts` (`concluido`, `c18fcbd`)
  - `SUB-28.23`: Retomada da aprovação (`Command({ resume })`) em `api/aprovacao.ts` (`concluido`, fa99fe2)
  - `SUB-28.24`: Testes do worker: interrupção e retomada sem duplicar efeitos (`concluido`, `057b3a1`)
  - `SUB-28.25`: Variáveis do worker no `api/README.md` (`concluido`, 3345ccd)
  - `SUB-28.26`: Contrato: ferramentas permitidas e idempotência em `docs/langgraph-contrato.md` (`concluido`, `07b64cc`)
  - `SUB-28.27`: Contrato: mapeamento de erros para `finalizar_task` em `docs/langgraph-contrato.md` (`concluido`, `52df1e7`)
  - `SUB-28.28`: `worker/tsconfig.json` e `typecheck:worker` (`concluido`, `fbef4e8`)
  - `SUB-28.29`: Schema zod `EstadoSchema` em `worker/estado.ts` (`concluido`, `0e7a40c`)
  - `SUB-28.30`: `finalizar(...)` em `worker/fila.ts` (`concluido`, `9b27e51`)
  - `SUB-28.31`: `montarPromptPlano(estado)` em `worker/plano.ts` (`concluido`, `8a43f2b`)
  - `SUB-28.32`: Registro de auditoria da aprovação (`concluido`, ff049de)
  - `SUB-28.33`: Corrigir `finalizar()` para a assinatura real de `finalizar_task` (`concluido`, `76f243e`)
  - `SUB-28.34`: `resumoSeguro`/`chaves` só com os passos `passo-<i>` em `worker/nos/finalizar.ts` (`concluido`, `8bc3b99`)
- **Descrição:** Implementar a orquestração multi-etapas de execução descrita em `LangChain_LangGraph.md`, mantendo Supabase como autoridade sobre a fila, dependências, locks, tentativas e resultado. Integrar o worker LangGraph às RPCs existentes e às ferramentas MCP autorizadas, com checkpoint durável, retomada, tratamento de falhas e aprovação humana para ações sensíveis.
- **Critérios de Aceitação:** A task só inicia após todas as dependências SUB-01 a SUB-27 concluídas; execução reivindicada por `pegar_proxima_task`; estado do grafo é retomável e não duplica efeitos; escrita ocorre por ferramentas autenticadas e autorizadas; ações sensíveis pausam para aprovação; conclusão/erro e liberação do lock passam por `finalizar_task`; documentação de operação e segurança atualizada conforme `LangChain_LangGraph.md`.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⚠️ RESSALVA — 2026-10-12 15:40 (Devin): Todas as 34 subtarefas marcadas como concluídas com commits; 33 commits verificados (fc379a6, 3642a8d, 21c908b, 06e7e4b, 999d1e0, 463b3d9, 07ca06f, 6ebd647, 9cf0e2a, b1c35a9, 9575b13, 0d9c835, 1bd4ca7, 206ba39, ba04cc1, 2adb51d, 46718f9, 18c8d9d, a9bb258, 048e647, 04c0f02, c18fcbd, fa99fe2, 057b3a1, 3345ccd, 07b64cc, 52df1e7, fbef4e8, 0e7a40c, 9b27e51, 8a43f2b, ff049de, 8bc3b99). 1 commit incorreto no quadro: SUB-28.33 cita 76f243e (não existe), mas o commit cfe88af existe e é a entrega real. Arquivos do worker todos presentes (worker/ com 15 arquivos).

#### [x] SUB-28.18: Atualizar `LangChain_LangGraph.md` (status e desvios)
- **Status:** concluido
- **Prioridade:** MEDIA
- **Executor:** Devin (Cognition AI) (início: 2026-10-12 14:36, conclusão: 2026-10-12 14:38)
- **Depende de:** SUB-28.15, SUB-28.32
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Atualizar `LangChain_LangGraph.md`: status implementado, nós, retomada, aprovação e desvios justificados.
- **Critérios de Aceitação:** Documentação coerente com o código.
- **Commit:** 18c8d9d
- **Anotação:** Atualizado status para "Implementado na SUB-28" com lista de itens implementados (grafo, checkpointer, retomada, aprovação, auditoria, idempotência, classificação de falhas, integração com RPCs, segurança, allowlist, CLI, heartbeat). Adicionada seção 11 com desvios justificados (modelo simplificado, eventos via RPC, endpoint separado, checkpointer em schema separado, limites de espera) e cobertura de testes.
- **VERIFICADOR-CLAUDE:** ✅ OK — 2026-10-12 16:27 (DeepSeek Harness (deepseek-flash)): commit `18c8d9d` existe (`docs(SUB-28.18): Atualizar LangChain_LangGraph.md com status e desvios`); `LangChain_LangGraph.md` existe e traz, na linha 5, "**Status:** ✅ **Implementado na SUB-28** (2026-10-12)" e, na linha 9, a seção "## 11. Status de implementação e desvios (SUB-28)", com "### 11.2 Desvios justificados" na linha 26 — atende ao critério "documentação coerente com o código".

#### [x] SUB-28.23: Retomada da aprovação (`Command({ resume })`) em `api/aprovacao.ts`
- **Status:** concluido
- **Prioridade:** MEDIA
- **Executor:** Devin (Cognition AI) (início: 2026-10-12 14:26, conclusão: 2026-10-12 14:30)
- **Depende de:** SUB-28.16
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Após autorizar, retomar o grafo com `Command({ resume: { aprovado, por, em } })` no `thread_id` da execução. O registro de auditoria fica na SUB-28.32.
- **Critérios de Aceitação:** `typecheck:api` OK; teste de retomada com grafo falso.
- **Commit:** fa99fe2
- **Anotação:** Implementada retomada do grafo LangGraph com Command({ resume }) no thread_id da execução. Adicionadas: execucaoIdDaTask (lê o execucaoId mais recente dos logs), criarGrafoComCheckpointer (cria grafo com checkpointer Postgres), retomarGrafo (envia Command({ resume }) com decisão do usuário). Testes atualizados para cobrir os novos deps. typecheck:api OK, testes OK (9 passed).
- **VERIFICADOR-CLAUDE:** ✅ OK — 2026-10-12 16:27 (DeepSeek Harness (deepseek-flash)): commit `fa99fe2` existe (`feat(SUB-28.23): Retomada da aprovação em api/aprovacao.ts`); `api/aprovacao.ts` contém `execucaoIdDaTask`, `criarGrafoComCheckpointer` e `retomarGrafo` (linhas 32-34 e 126-133), com o `Command({ resume })` documentado no `thread_id` da execução; `npm run typecheck:api` exit 0 e `tests/unit/api-aprovacao.test.ts` tem o teste "editor autorizado: com grafo e execucaoId devolve 200" (grafo falso) — atende aos dois critérios.

#### [x] SUB-28.25: Variáveis do worker no `api/README.md`
- **Status:** concluido
- **Prioridade:** MEDIA
- **Executor:** Devin (Cognition AI) (início: 2026-10-12 14:40, conclusão: 2026-10-12 14:42)
- **Depende de:** SUB-28.15, SUB-28.32
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Documentar `LANGGRAPH_DATABASE_URL`, variáveis do modelo, endpoint de aprovação e operação do worker no `api/README.md`.
- **Critérios de Aceitação:** Documentação coerente com o código.
- **Commit:** 3345ccd
- **Anotação:** Adicionada seção "Worker LangGraph (SUB-28)" no api/README.md com: tabela de variáveis do worker (OPENAI_API_KEY, WORKER_MODELO, LANGGRAPH_DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, MCP_DEFAULT_PROJECT), exemplos de execução (local, uma task, produção), endpoint de aprovação humana (POST /api/aprovacao com JWT) e monitoramento (heartbeats via emitir_event). typecheck:api OK.
- **VERIFICADOR-CLAUDE:** ✅ OK — 2026-10-12 16:27 (DeepSeek Harness (deepseek-flash)): commit `3345ccd` existe (`docs(SUB-28.25): Variáveis do worker no api/README.md`); `api/README.md` documenta `WORKER_MODELO` (linha 147) e `LANGGRAPH_DATABASE_URL` (linha 148) na tabela de variáveis do worker e o endpoint `POST /api/aprovacao` (linha 168) — atende ao critério "documentação coerente com o código".

#### [x] SUB-28.32: Registro de auditoria da aprovação
- **Status:** concluido
- **Prioridade:** MEDIA
- **Executor:** Devin (Cognition AI) (início: 2026-10-12 14:32, conclusão: 2026-10-12 14:35)
- **Depende de:** SUB-28.23
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Após a retomada em `api/aprovacao.ts`, registrar quem aprovou, quando, a task e a ação (sem credenciais) nos metadados da execução/log. Teste com grafo falso.
- **Critérios de Aceitação:** `typecheck:api` OK; teste confere o registro sem credenciais.
- **Commit:** ff049de
- **Anotação:** Adicionada dependência atualizarMetadadosLog que registra auditoria da aprovação nos metadados da execução (aprovado, usuario_id, em, motivo) sem expor credenciais. Testes atualizados para verificar que metadados são chamados com os dados corretos. typecheck:api OK, testes OK (10 passed).
- **VERIFICADOR-CLAUDE:** ✅ OK — 2026-10-12 16:27 (DeepSeek Harness (deepseek-flash)): commit `ff049de` existe (`feat(SUB-28.32): Registro de auditoria da aprovação`); `api/aprovacao.ts` define `atualizarMetadadosLog` (linhas 36, 95 e 128) e grava `aprovacao_audit` com aprovado/usuario_id/em/motivo (linha 146), sem credenciais; `npm run typecheck:api` exit 0 e o teste "regista auditoria da aprovação nos metadados (SUB-28.32)" confere o conteúdo — atende aos dois critérios.

---

## 📡 FASE 12: Monitor em Tempo Real dos Agentes

### [ ] SUB-35: Monitor em Tempo Real dos Agentes
- **Status:** pendente (aguardando subtarefas)
- **Prioridade:** MEDIA
- **Executor:** nenhum
- **Depende de:** SUB-12, SUB-29, SUB-30; subtarefas SUB-35.1 a SUB-35.46 (as partes do worker dependem de SUB-28.x)
- **Subtarefas:** (criada e subdividida em 46 em 2026-10-12 00:39 por DashboardAI (Grok Bot) a pedido do usuário; a mãe só é concluída quando todas estiverem `concluido`)
  - `SUB-35.1`: Tabela `agent_events` em `database/07_agent_events.sql` (`concluido`, `9f5692f`)
  - `SUB-35.2`: Trigger `validar_agent_event` em `database/07_agent_events.sql` (`concluido`, `54cdea9`)
  - `SUB-35.3`: RLS de `agent_events` (viewer lê, editor inclui) em `database/07_agent_events.sql` (`concluido`, `2d714d4`)
  - `SUB-35.4`: Publicar `agent_events` no Supabase Realtime (`concluido`, `95f12ff`)
  - `SUB-35.5`: Função `atividade_atual_agentes(p_project_id)` em `database/07_agent_events.sql` (`concluido`, `d9d9a6c`)
  - `SUB-35.6`: Teste de integração de `agent_events` (RLS e trigger) (`concluido`, `e7a39cd`)
  - `SUB-35.7`: Seção "Eventos dos agentes (07)" no `database/README.md` (`concluido`, `b518611`)
  - `SUB-35.8`: Tipos `AgentEvent` e `AtividadeAgente` em `src/types/database.ts` (`concluido`, `5a09109`)
  - `SUB-35.9`: `listarEventos()` em `src/services/eventService.ts` (`concluido`, `89c6a43`)
  - `SUB-35.10`: `atividadeAtual()` em `src/services/eventService.ts` (`concluido`, `47fb521`)
  - `SUB-35.11`: `assinarEventos()` (Supabase Realtime) em `src/services/eventService.ts` (`concluido`, `c43ad04`)
  - `SUB-35.12`: Testes de `eventService` em `tests/unit/eventService.test.ts` (`concluido`, `b045c12`)
  - `SUB-35.13`: Teste de integração de `listarEventos`/`atividadeAtual` (`concluido`, `8628ec3`)
  - `SUB-35.14`: `mesclarEvento()` em `src/lib/monitor.ts` (`concluido`, `7e268fb`)
  - `SUB-35.15`: `estadoDoAgente()` em `src/lib/monitor.ts` (`concluido`, `c47df6b`)
  - `SUB-35.16`: `contarPorStatus()` em `src/lib/monitor.ts` (`concluido`, `860e0c9`)
  - `SUB-35.17`: `contarPorAgente()` em `src/lib/monitor.ts` (`concluido`, `7d2181e`)
  - `SUB-35.18`: `segmentosLinhaDoTempo()` em `src/lib/monitor.ts` (`concluido`, `6391c1b`)
  - `SUB-35.19`: Hook `useEventosAgentes(projectId)` em `src/hooks/useEventosAgentes.ts` (`concluido`, `7d2181e`)
  - `SUB-35.20`: Hook `useAtividadeAgentes(projectId)` em `src/hooks/useAtividadeAgentes.ts` (`concluido`, `a7beb5a`)
  - `SUB-35.21`: Instalar `chart.js` e `react-chartjs-2` (`concluido`, `73d73ad`)
  - `SUB-35.22`: Registro do Chart.js e paleta em `src/lib/charts.ts` (`concluido`, `cabdbc0`)
  - `SUB-35.23`: Componente `AgenteCard` em `src/components/monitor/AgenteCard.tsx` (`concluido`, `da9ff65`)
  - `SUB-35.24`: Componente `AtividadeAgentesGrid` em `src/components/monitor/AtividadeAgentesGrid.tsx` (`concluido`, `4bc0b25`)
  - `SUB-35.25`: Gráfico `GraficoPorStatus` em `src/components/monitor/GraficoPorStatus.tsx` (`concluido`, `a2d2ed9`)
  - `SUB-35.26`: Gráfico `GraficoPorAgente` em `src/components/monitor/GraficoPorAgente.tsx` (`concluido`, `6456092`)
  - `SUB-35.27`: Linha do tempo `LinhaDoTempoAgentes` em `src/components/monitor/LinhaDoTempoAgentes.tsx` (`concluido`, `173fc36`)
  - `SUB-35.28`: Feed `FeedEventos` em `src/components/monitor/FeedEventos.tsx` (`concluido`, `0d90464`)
  - `SUB-35.29`: Indicador `IndicadorAoVivo` em `src/components/monitor/IndicadorAoVivo.tsx` (`concluido`, `9c2edf5`)
  - `SUB-35.30`: Tela `MonitorView` em `src/views/MonitorView.tsx` (`concluido`, `2d1cd0a`)
  - `SUB-35.31`: Registrar a tela `monitor` (rota `#/monitor` e menu) (`concluido`, `8dff43b`)
  - `SUB-35.32`: Validação visual do monitor (SUB-35) (`pendente`)
  - `SUB-35.33`: `emitirEvento()` em `worker/eventos.ts` (`concluido`, `2750ba4`)
  - `SUB-35.34`: Testes de `emitirEvento` em `tests/unit/worker-eventos.test.ts` (`concluido`, `8e63d4c`)
  - `SUB-35.35`: `comEventos(nome, no)` em `worker/eventos.ts` (`concluido`, `bd6563e`)
  - `SUB-35.36`: Envolver os nós em `worker/grafo.ts` com `comEventos` (`concluido`, `469ce5c`)
  - `SUB-35.37`: `iniciarHeartbeat()` em `worker/heartbeat.ts` (`concluido`, `64c0b11`)
  - `SUB-35.38`: Ligar o heartbeat no CLI `worker/index.ts` (`concluido`, `34bf1c1`)
  - `SUB-35.39`: Teste do worker: eventos emitidos na ordem dos nós (`concluido`, `4a1156d`)
  - `SUB-35.40`: Ferramenta MCP `agent_event` em `api/_lib/event-tools.ts` (`concluido`, `176aadb`)
  - `SUB-35.41`: Testes da ferramenta `agent_event` em `tests/unit/api-event-tools.test.ts` (`concluido`, `0263ae9`)
  - `SUB-35.42`: `commits_para_eventos()` em `scripts/espelhar_quadro_eventos.py` (`concluido`, `53a5c93`)
  - `SUB-35.43`: CLI `scripts/espelhar_quadro_eventos.py` (dry-run e `--aplicar`) (`concluido`, `e8917a3`)
  - `SUB-35.44`: Seção "Monitor em tempo real" no `README.md` (`concluido`, `9b785dc`)
  - `SUB-35.45`: Seção "Reporte de progresso (opcional)" no `AGENTS.md` (`concluido`, `dcdbc96`)
  - `SUB-35.46`: Validação automatizada da SUB-35 (`pendente`)
- **Descrição:** Tela `#/monitor` que mostra, ao vivo, o que cada agente de IA está fazendo agora — versão do `dashboard-task-principal.html` (que lê o quadro em Markdown do GitHub a cada `POLL_MS` e desenha gráficos Chart.js por status, fase e agente) apoiada no **banco**: nova tabela `agent_events` (por projeto, com RLS e publicação no Supabase Realtime), assinatura Realtime no frontend (sem polling), cartões de atividade atual por agente (heartbeat), gráficos por estado e por agente, linha do tempo das etapas e feed de eventos. Os eventos vêm do worker LangGraph (SUB-28, cada nó emite `inicio`/`fim`/`erro` + heartbeat), da ferramenta MCP `agent_event` (agentes como Claude Code e Codex) e, opcionalmente, de um espelho dos commits de lock/entrega do quadro. Biblioteca de gráficos: Chart.js via `react-chartjs-2` (mesma do HTML atual, registro só dos elementos usados, canvas leve para atualização contínua). **Só exibição:** não há regra de expiração de trava; travas continuam sendo liberadas só pelo usuário.
- **Escopo por projeto:** eventos, atividade e assinatura filtrados pelo projeto selecionado (`project_id`, ver SUB-29); genérico para qualquer projeto.
- **Critérios de Aceitação:** Com dois agentes emitindo eventos, a tela atualiza em segundos sem recarregar; viewer de outro projeto não vê os eventos; build sem chunk acima de 500 kB (gráficos em chunk da tela).
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 15:45 (Devin): tarefa-mãe pendente: 45 de 46 subtarefas concluídas (SUB-35.1 a SUB-35.45) com commits verificados (9f5692f, 54cdea9, 2d714d4, 95f12ff, d9d9a6c, e7a39cd, b518611, 5a09109, 89c6a43, 47fb521, c43ad04, b045c12, 8628ec3, 7e268fb, c47df6b, 860e0c9, 7d2181e, 6391c1b, 7d2181e, a7beb5a, 73d73ad, cabdbc0, da9ff65, 4bc0b25, a2d2ed9, 6456092, 173fc36, 0d90464, 9c2edf5, 2d1cd0a, 8dff43b, 2750ba4, 8e63d4c, bd6563e, 469ce5c, 64c0b11, 34bf1c1, 4a1156d, 176aadb, 0263ae9, 53a5c93, e8917a3, 9b785dc, dcdbc96). Arquivos do monitor presentes (src/components/monitor/, src/hooks/, src/lib/monitor.ts, src/views/MonitorView.tsx, database/07_agent_events.sql). Restam: SUB-35.32 (validação visual) e SUB-35.46 (validação automatizada).

#### [ ] SUB-35.32: Validação visual do monitor (SUB-35)
- **Status:** pendente
- **Prioridade:** MEDIA
- **Executor:** nenhum
- **Depende de:** SUB-35.31
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Contra o banco local, inserir eventos (SQL ou MCP `agent_event`) e conferir que cards, gráficos e feed atualizam sem recarregar; screenshots 1280x800 e 390x844, tema claro e escuro; registrar na anotação da SUB-35.
- **Critérios de Aceitação:** Screenshots conferidos; nenhum erro no console.
- **Commit:** pendente
- **Anotação:** Trava de DashboardAI-Clone 07 (Grok Bot) (desde 2026-10-12 01:49, commit `8d700c5`) liberada em 2026-10-12 a pedido do usuário, sem entrega registrada; tarefa volta a ficar livre.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 15:50 (Devin): pendente, sem executor. Não há registro de screenshots no `docs/VALIDACAO.md` nem na anotação; depende de navegador e banco local (não usado nesta verificação).

#### [ ] SUB-35.46: Validação automatizada da SUB-35
- **Status:** pendente
- **Prioridade:** MEDIA
- **Executor:** nenhum
- **Depende de:** SUB-35.7, SUB-35.12, SUB-35.13, SUB-35.32, SUB-35.34, SUB-35.38, SUB-35.39, SUB-35.41, SUB-35.43, SUB-35.44, SUB-35.45
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Rodar `npm run typecheck`, `npm test`, `npm run build`, `npm run test:integration` e os testes Python; registrar o resultado na anotação da SUB-35.
- **Critérios de Aceitação:** Tudo verde.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente`; a dependência SUB-35.32 continua `pendente` (marcador `⬜ NÃO IMPLEMENTADA`, Devin, 15:50), então a validação automatizada da SUB-35 não foi executada.

---

## 🛠️ FASE 13: Ajustes Técnicos e Alinhamento (sugeridas)

### [ ] SUB-39: Ajustes técnicos e alinhamento entre documentação e código
- **Status:** pendente (aguardando subtarefas)
- **Prioridade:** MEDIA
- **Executor:** nenhum
- **Depende de:** subtarefas SUB-39.1 a SUB-39.6
- **Subtarefas:** (criadas em 2026-10-12 por Claude Code a partir do `TASKS-SUGERIDAS.md`, investigação só-leitura feita em outro clone; números trocados de SUB-36.x para SUB-39.x porque a SUB-36 já existe)
  - `SUB-39.1`: Alinhar `maxDuration` do `README.md` ao `vercel.json` (`pendente`)
  - `SUB-39.2`: Alinhar a allowlist do contrato (`docs/langgraph-contrato.md`) ao `worker/ferramentas.ts` (`concluido`, `e7a08be`)
  - `SUB-39.3`: Remover `as any` de `worker/fila.ts` e `worker/falhas.ts` (`concluido`, `5df4f1d`)
  - `SUB-39.4`: Fábrica `criarGrafoComCheckpointer` em `worker/grafoFabrica.ts` usada pelo `worker/index.ts` (`concluido`, `e789db4`)
  - `SUB-39.5`: Usar a fábrica da SUB-39.4 em `api/aprovacao.ts` (`concluido`, `2ce9adf`)
  - `SUB-39.6`: Isolar `tests/unit/supabase.test.ts` das variáveis do `.env` local (`concluido`, `3c18f1f`)
- **Descrição:** Corrigir divergências entre documentação e código e reduzir castings inseguros e duplicação no worker LangGraph e na API de aprovação.
- **Critérios de Aceitação:** Todas as filhas `concluido`; `npm run validar` e `npm run typecheck:worker` verdes.
- **Commit:** pendente
- **Anotação:** Duas sugestões do `TASKS-SUGERIDAS.md` **não viraram tarefa** porque já estavam resolvidas na `main`: (1) "Corrigir referências de caminho no AGENTS.md" — os links `file:///c:/fontes/dashboard-ai/...` já foram trocados por links relativos em `4a615a1` (a correção sugerida, apontar para `dashboard-ai-kiro-dev`, também estaria errada: não é a pasta deste clone); (2) "Mitigar vulnerabilidade alta de langsmith" — feita na SUB-28.2 (`3642a8d`, `overrides` com `langsmith ^0.6.0`); `npm audit` em 2026-10-12 mostra 0 altas (restam 7 moderadas). Ajustes feitos nas sugeridas, conferidos no código: na SUB-39.2, o contrato **já tem** `brain_search` (a divergência real são `agent_event`, `task_create` e `brain_delete`); na SUB-39.3, o cast fica em `worker/fila.ts:35` (não 24) e a RPC devolve `id` numérico, `codigo`, `tentativas` e `instrucao` (a interface sugerida, com `id: string`, `titulo` e `tentativa`, estava errada); a antiga SUB-36.5 foi dividida em 2 (39.4 e 39.5) para caber em ~3 min e passa a incluir o `as unknown as any` de `api/aprovacao.ts:92`.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

#### [ ] SUB-39.1: Alinhar `maxDuration` do `README.md` ao `vercel.json`
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** A seção "Deploy na Vercel → 3. Limits e timeouts" do `README.md` (linhas ~201-218) mostra um `vercel.json` de exemplo com `"maxDuration": 60` e diz "padrão 60s". O `vercel.json` real usa `30` para `api/mcp.ts` e `15` para `api/embedding.ts`. Atualizar o exemplo e o texto para os valores reais, mantendo a nota de limites por plano da Vercel (conferir os limites atuais na documentação da Vercel antes de manter os números de Hobby/Pro).
- **Critérios de Aceitação:** Exemplo e texto do `README.md` iguais ao `vercel.json`; `npm run validar` verde.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

---

## 🔐 FASE 14: Login — Cadastro de Usuário e Administrador Inicial

### [ ] SUB-40: Login com opção de criar usuário (formulário de cadastro) e administrador inicial `gelvazio@gmail.com`
- **Status:** pendente (aguardando subtarefas)
- **Prioridade:** MEDIA
- **Executor:** nenhum
- **Depende de:** subtarefas SUB-40.1 a SUB-40.7
- **Subtarefas:** (criada e subdividida em 7 em 2026-10-12 por Claude Code (Opus 5.5) a pedido do usuário; a mãe só é concluída quando todas as filhas estiverem `concluido`)
  - `SUB-40.1`: SQL do administrador inicial (`database/08_admin_inicial.sql`) (`concluido`, `e64524e`)
  - `SUB-40.2`: Validação e mensagens do cadastro em `src/lib/auth.ts` (`concluido`, `b2a9289`)
  - `SUB-40.3`: Serviço `cadastrarUsuario` em `src/services/authService.ts` (`concluido`, `a48672a`)
  - `SUB-40.4`: Componente `src/components/auth/CadastroForm.tsx` (`concluido`, `a86f688`)
  - `SUB-40.5`: Alternar "Entrar" / "Criar usuário" na `LoginView` (`concluido`, `d7b0fba`)
  - `SUB-40.6`: Documentar o cadastro e o administrador inicial (`README.md` e `database/README.md`) (`concluido`, `7bc0f0e`)
  - `SUB-40.7`: Aplicar o `08_admin_inicial.sql` no Supabase do projeto (só com autorização do usuário) (`pendente`)
- **Descrição:** Na tela de login, oferecer o link **"Criar usuário"**, que abre um **novo formulário** de cadastro (nome, e-mail, senha e confirmação) usando o Supabase Auth (`signUp`). Regra pedida pelo usuário: se o e-mail cadastrado for **`gelvazio@gmail.com`** e ele **ainda não existir** no banco, o usuário é criado como **administrador** (`user_roles.role = 'admin'`). **Segurança:** o papel de administrador é dado **só pelo banco** (função `security definer` + trigger em `auth.users`), nunca pelo frontend (o cliente não escolhe o próprio papel), e **só depois do e-mail confirmado** (`email_confirmed_at` preenchido), para que ninguém se registre com esse e-mail sem ter acesso à caixa de entrada. Os demais cadastros entram sem papel global (acesso só pelos `project_members`, como hoje).
- **Critérios de Aceitação:** Todas as filhas `concluido`; `npm run validar` verde; cadastro com `gelvazio@gmail.com` (inexistente) gera `user_roles` admin após a confirmação do e-mail; cadastro com outro e-mail não ganha papel de administrador; se `gelvazio@gmail.com` já existir, nada muda.
- **Commit:** pendente
- **Anotação:** Criada a pedido do usuário em 2026-10-12. Sem testes automatizados novos (regra do usuário no `CLAUDE.md` global: só para correção de bug); a verificação de cada filha é por `npm run validar`, `npm run typecheck` e leitura do código/SQL.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE







#### [ ] SUB-40.7: Aplicar o `08_admin_inicial.sql` no Supabase do projeto (só com autorização do usuário)
- **Status:** pendente
- **Prioridade:** MEDIA
- **Executor:** nenhum
- **Depende de:** SUB-40.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** **Pedir autorização explícita do usuário no chat antes de qualquer comando no banco remoto.** Com a autorização, aplicar `database/08_admin_inicial.sql` no projeto Supabase e conferir com consultas só de leitura: a função e a trigger existem (`pg_trigger` em `auth.users`), e, se `gelvazio@gmail.com` já existir e estiver confirmado, há linha `admin` em `user_roles`. Sem autorização ou sem acesso ao banco, marcar ⛔ com o motivo na anotação e deixar a aplicação para o usuário.
- **Critérios de Aceitação:** Script aplicado sem erro e conferências registradas na anotação (sem e-mails de outros usuários, sem chaves ou tokens).
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

---

## 📚 FASE 15: Organização da Documentação

### [ ] SUB-41: Tirar do `AGENTS.md` o plano "🧠 Cérebro de Memória Persistente" (o `AGENTS.md` fica só com regras)
- **Status:** pendente (aguardando subtarefas)
- **Prioridade:** MEDIA
- **Executor:** nenhum
- **Depende de:** subtarefas SUB-41.1 a SUB-41.3
- **Subtarefas:** (subdividida em 3 em 2026-10-12 por Claude Code (Opus 5.5) a pedido do usuário, uma por seção do plano; as três editam os mesmos arquivos, por isso ficam em cadeia)
  - `SUB-41.1`: Criar `docs/plano-cerebro-memoria-persistente.md` e mover a seção "1. Arquitetura do Banco de Dados (Supabase)" (`em_execucao`, Devin (Cognition AI))
  - `SUB-41.2`: Mover a seção "2. Estrutura do Servidor MCP (Vercel Serverless)" (`pendente`)
  - `SUB-41.3`: Mover a seção "3. Ativação no Terminal (Claude Code)" e fechar a limpeza do `AGENTS.md` (`pendente`)
- **Descrição:** **Regra do usuário (2026-10-12):** o `AGENTS.md` deve conter **apenas regras de como executar tarefas**, e **nenhuma tarefa em si**. Hoje, depois da seção "✅ 5. Regra de confirmação de status", o arquivo traz o plano de implementação `# 🧠 Plano de Implementação: Cérebro de Memória Persistente (Estilo Jev-Mem)` (linhas ~345-525; números aproximados, conferir com `grep`), com as seções `## 1. Arquitetura do Banco de Dados (Supabase)` (SQL), `## 2. Estrutura do Servidor MCP (Vercel Serverless)` (nota da implementação real, estrutura de arquivos e exemplo ilustrativo de `api/mcp.ts`) e `## 3. Ativação no Terminal (Claude Code)`. Isso é tarefa/plano, não regra. O plano inteiro vai, **sem alterar o texto**, para `docs/plano-cerebro-memoria-persistente.md`, uma seção por subtarefa, ajustando os links relativos do trecho movido (`api/...` → `../api/...`, `database/...` → `../database/...`). No `AGENTS.md`, o bloco é apagado **sem deixar resumo de tarefa**.
- **Critérios de Aceitação:** Todas as filhas `concluido`; `docs/plano-cerebro-memoria-persistente.md` com o conteúdo completo das seções 1, 2 e 3; `AGENTS.md` sem o plano e só com regras de execução de tarefas; nenhum link relativo quebrado (inclusive links de outros arquivos que apontem para esse trecho do `AGENTS.md`); `npm run validar` verde.
- **Commit:** pendente
- **Anotação:** Criada a pedido do usuário em 2026-10-12 por Claude Code (Opus 5.5). Pedido original: "isso daqui *## 2. Estrutura do Servidor MCP (Vercel Serverless)* precisa estar numa tarefa separada"; ampliado na mesma conversa: "no agents.md, devem ficar apenas regras de como executar tarefas e nenhuma tarefa em si mesmo" — por isso a tarefa cobre o plano inteiro (seções 1, 2 e 3), não só a seção 2. O plano já está implementado (SUB-07 e seguintes; o SQL consolidado está em `database/`, scripts `01` a `04`); esta tarefa só reorganiza a documentação, sem nada a aplicar no banco. Os outros trechos do `AGENTS.md` que citam tarefas específicas foram separados na SUB-42. **Subdivisão (2026-10-12, a pedido do usuário):** a mãe, antes atômica, passou a ter as filhas SUB-41.1 a SUB-41.3 (uma por seção do plano).
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

#### [ ] SUB-41.1: Criar `docs/plano-cerebro-memoria-persistente.md` e mover a seção "1. Arquitetura do Banco de Dados (Supabase)"
- **Status:** em_execucao
- **Prioridade:** MEDIA
- **Executor:** Devin (Cognition AI) (início: 2026-10-12 18:40)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `docs/plano-cerebro-memoria-persistente.md` com: o título `# 🧠 Plano de Implementação: Cérebro de Memória Persistente (Estilo Jev-Mem)` e as linhas **Foco** e **Stack** (copiadas do `AGENTS.md`); um parágrafo inicial dizendo que o plano **já foi implementado** (SQL consolidado e idempotente em [`database/`](../database/README.md), scripts `01` a `04`; servidor em [`api/mcp.ts`](../api/mcp.ts) e [`api/_lib/`](../api/_lib/)) e que o SQL e o código do plano são a referência original; e a seção `## 1. Arquitetura do Banco de Dados (Supabase)` inteira (texto, nota sobre a pasta `database/` e bloco SQL), **sem alterar o conteúdo**, só corrigindo o link `database/README.md` → `../database/README.md`. No `AGENTS.md`, apagar o título do plano, as linhas Foco/Stack e a seção 1 (com os `---` correspondentes). As seções 2 e 3 continuam no `AGENTS.md` até as filhas seguintes.
- **Critérios de Aceitação:** Arquivo novo com título, introdução e seção 1 completos; seção 1 e cabeçalho do plano fora do `AGENTS.md`; links relativos do novo arquivo funcionando; `npm run validar` verde.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

#### [ ] SUB-41.2: Mover a seção "2. Estrutura do Servidor MCP (Vercel Serverless)"
- **Status:** pendente
- **Prioridade:** MEDIA
- **Executor:** nenhum
- **Depende de:** SUB-41.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Mover do `AGENTS.md` para o fim de `docs/plano-cerebro-memoria-persistente.md` a seção `## 2. Estrutura do Servidor MCP (Vercel Serverless)` inteira: a nota "ℹ️ Implementação real", a "Estrutura de Arquivos Recomendada" e o exemplo ilustrativo de `api/mcp.ts`, **sem alterar o conteúdo**, só corrigindo os links relativos da nota (`api/mcp.ts`, `api/_lib/`, `api/_lib/brain-tools.ts`, `api/_lib/supabase.ts` → `../api/...`). Apagar a seção (com o `---` correspondente) do `AGENTS.md`.
- **Critérios de Aceitação:** Seção 2 completa no novo arquivo e fora do `AGENTS.md`; todos os links `../api/...` apontando para arquivos que existem; `npm run validar` verde.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

#### [ ] SUB-41.3: Mover a seção "3. Ativação no Terminal (Claude Code)" e fechar a limpeza do `AGENTS.md`
- **Status:** pendente
- **Prioridade:** MEDIA
- **Executor:** nenhum
- **Depende de:** SUB-41.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Mover do `AGENTS.md` para o fim de `docs/plano-cerebro-memoria-persistente.md` a seção `## 3. Ativação no Terminal (Claude Code)` (texto e comando `claude mcp add --transport http dashboard-ai-brain ...`), **sem alterar o conteúdo**. Depois, conferir que o `AGENTS.md` termina na seção "✅ 5. Regra de confirmação de status" (sem `---` sobrando no fim) e que nenhum arquivo do repositório aponta para o trecho removido (procurar por "Cérebro de Memória", "Jev-Mem" e "Arquitetura do Banco de Dados" nos `.md`, fora de `node_modules`); se apontar, trocar o link para o novo arquivo. Avaliar se a ativação do MCP (`claude mcp add`) deve virar uma regra curta no `AGENTS.md` com link para o novo arquivo; registrar a decisão na anotação.
- **Critérios de Aceitação:** Seção 3 completa no novo arquivo; o `AGENTS.md` não tem mais "Plano de Implementação" nem as seções `## 1. Arquitetura`, `## 2. Estrutura` e `## 3. Ativação`; nenhum link quebrado para o trecho removido; `npm run validar` verde.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### [ ] SUB-42: Tirar do `AGENTS.md` as referências a tarefas específicas (regras genéricas)
- **Status:** pendente
- **Prioridade:** MEDIA
- **Executor:** nenhum
- **Depende de:** SUB-41 (mesmo arquivo; evita conflito de edição)
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Mesma regra do usuário da SUB-41 (o `AGENTS.md` só tem regras, nenhuma tarefa). Trechos encontrados em 2026-10-12 que tratam de tarefas específicas:
  1. **Seção 1.1, item 3 (linha ~113)** — "⛔ **KIRO-DEV-CLONE**: esta tarefa está TRAVADA PARA TODAS AS IAS…": é o **estado** de uma tarefa, que já está registrado no quadro (bloco `### 🔒 TRAVA ESPECIAL: KIRO-DEV-CLONE` do `task-principal.md`). Trocar por regra genérica: "Tarefas com bloco `### 🔒 TRAVA ESPECIAL: <código>` no `task-principal.md` estão travadas para todas as IAs (inclusive as subtarefas); só o usuário cria ou remove essa trava; ela tem precedência sobre o protocolo normal e sobre a prioridade (seção 1.2)". Ajustar a regra 3 da seção 1.2 ("🔴 trava especial") se precisar.
  2. **Seção 1.2, tabela (linha ~160)** — `MAXIMA` "(ex.: `SUB-38`, verificação geral)": tirar o exemplo da tarefa.
  3. **Seção 4 (linhas ~244-272)** — "monitor em tempo real (SUB-35)", exemplos com `SUB-35.45` e "espelho … (SUB-35.42/35.43)": tirar os códigos de tarefa e usar `SUB-XX` nos exemplos (a regra e os nomes de arquivos ficam).
  4. **Seção 5 (linha ~293 e a nota da linha ~299)** — "o marcador `VERIFICADOR-CLAUDE` da `SUB-38`" e "⚠️ Esta regra foi adicionada em 2026-10-12 após a restauração do quadro…": tirar a referência à SUB-38 (dizer só "o marcador `VERIFICADOR-CLAUDE`, quando existir") e tirar a nota histórica (o Git guarda o histórico).
  5. **Avisos do cabeçalho (linhas ~3 e ~5)** — "o antigo `quadro-task-principal.md` foi incorporado ao `task-principal.md`" e "Já houve agente lendo o quadro 'sincronizado' com o remoto vários commits à frente": são histórico, não regra. Deixar só a regra ("Travas, status e tarefas ficam só no `task-principal.md`; não criar outro quadro" e "rodar `git fetch --all --prune` antes do `pull`…"), sem o relato do que aconteceu.
  Não mudar o sentido de nenhuma regra; só tirar o que é tarefa ou histórico de tarefa. Exemplos genéricos (`SUB-XX`, `SUB-01.1`, `SUB-19.3`, nome de agente fictício e data de exemplo na tabela da seção 5) podem ficar.
- **Critérios de Aceitação:** `grep -n "SUB-[0-9]\|KIRO-DEV-CLONE" AGENTS.md` sem resultados (os `SUB-XX`/`SUB-01.1` genéricos de exemplo podem ficar); a trava da `KIRO-DEV-CLONE` continua valendo pelo bloco do `task-principal.md`; `npm run validar` verde.
- **Commit:** pendente
- **Anotação:** Criada a pedido do usuário em 2026-10-12 por Claude Code (Opus 5.5) ("veja se tem mais alguma"), depois da SUB-41. Varredura feita com `grep` no `AGENTS.md`; os itens acima são todos os que citam tarefas concretas. As seções 1 a 5 são regras e ficam. **Releitura completa (2026-10-12, Claude Code (Opus 5.5), a pedido do usuário):** o `AGENTS.md` (483 linhas, já com a regra 9 da seção 1.1, `26e949b`) foi lido do início ao fim. A única **tarefa** é o plano "🧠 Cérebro de Memória Persistente" (linhas ~345-525 depois das seções 6 e da regra 10, SUB-41); as referências a tarefas concretas e os relatos de histórico são os itens 1 a 5 acima. Os números de linha foram atualizados (+5 por causa da regra 9) e o item 5 foi acrescentado.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### [ ] SUB-43: ATUALIZADOR DE TASKS COMPLETAS
- **Status:** pendente
- **Prioridade:** MEDIA
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Ler o `task-principal.md` **inteiro** e mover para o `task_complete.md` **todo bloco concluído** que ainda estiver no quadro ativo, seguindo a regra 10 da seção 1.1 do [`AGENTS.md`](AGENTS.md). Bloco concluído = cabeçalho `[x]` **ou** `Status: concluido` (tarefa-mãe ou subtarefa). Para cada um:
  1. mover o bloco **inteiro**, sem alterar o texto (status, commit, anotação, `STATUS-TAREFA-CONFIRMADO-CONCLUIDO` e `VERIFICADOR-CLAUDE`), para o **fim da fase correspondente** no `task_complete.md`, com o mesmo título de fase (`## <emoji> FASE N: …`); se a fase ainda não existir lá, criar o cabeçalho dela;
  2. na lista `Subtarefas:` da tarefa-mãe que continua no quadro, deixar só a referência `(concluido, <sha>)`;
  3. **não mover**: bloco com trava ativa (`em_execucao`), tarefa-mãe com alguma filha não `concluido` e qualquer bloco sob 🔒 TRAVA ESPECIAL;
  4. no `📊 Resumo de Progresso`, as contagens não mudam (o bloco já contava como concluído); só corrigir o texto se ele citar o bloco movido como se estivesse no quadro.
  Na varredura de 2026-10-12 estavam no quadro ativo, já concluídas: `SUB-28.18`, `SUB-28.23`, `SUB-28.25` e `SUB-28.32` (fase 11, LangChain/LangGraph). Refazer a varredura na hora de executar, porque outros agentes podem ter concluído ou movido blocos.
- **Critérios de Aceitação:** `grep -n "^#\{3,4\} \[x\]\|Status:\*\* concluido" task-principal.md` sem resultados (fora os casos do item 3, citados na anotação); cada bloco movido aparece uma única vez, no `task_complete.md`, na fase certa; nenhum bloco perdido (contagem de blocos `### `/`#### ` dos dois arquivos somada antes = depois); commit `docs(board): mover concluídas para task_complete.md (SUB-43) por <agente>`.
- **Commit:** pendente
- **Anotação:** Criada a pedido do usuário em 2026-10-12 por Claude Code (Opus 5.5): "crie mais 1 tarefa de nome ATUALIZADOR DE TASKS COMPLETAS, onde deve ler o arquivo task-principal.md inteiro e toda tarefa que estiver concluída deve ser movida para task_complete.md". A regra permanente (qualquer agente que encontrar bloco concluído no quadro ativo deve movê-lo) foi registrada no `AGENTS.md` (regra 10 da seção 1.1).
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

---

## 📋 FASE 11: Clone do Kiro.dev

### [ ] KIRO-DEV-CLONE: Clone do Kiro.dev
- **Status:** pendente (aguardando subtarefas)
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** Nenhuma; subtarefas `KIRO-DEV-CLONE.1` a `KIRO-DEV-CLONE.30`
- **Subtarefas:** (subdividida em 30 em 2026-10-12 16:11 por DeepSeek Harness (deepseek-flash) a pedido do usuário; a mãe só é concluída quando todas as filhas estiverem `concluido`)
  - `KIRO-DEV-CLONE.1`: Link "KIRO DEV CLONE" no menu (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.2`: Rota `/kiro-dev-clone` (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.3`: Componente base `KiroDevClone` (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.4`: Componente de Specs (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.5`: Botão "Criar Spec" (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.6`: Endpoint para salvar specs (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.7`: Componente de Chat (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.8`: Conectar chat com LLM (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.9`: Componente de Steering (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.10`: Validação de steering (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.11`: Sistema de hooks (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.12`: Hook de file change (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.13`: Integrar MCP existente (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.14`: Ferramentas MCP específicas (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.15`: Componente de Permissions (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.16`: Controle de acesso (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.17`: Sistema de custom agents (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.18`: UI para custom agents (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.19`: Sistema de Skills (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.20`: UI para Skills (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.21`: Usar memória existente (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.22`: Integrar memória com chat (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.23`: Sistema de checkpoints (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.24`: UI para checkpoints (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.25`: Arquivo `.kiroignore` (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.26`: Leitura do `.kiroignore` (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.27`: Sistema de workflows (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.28`: UI para workflows (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.29`: `kiro-dev-clone/STATUS.md` (`pendente`, 🔒 reservada)
  - `KIRO-DEV-CLONE.30`: Pasta `kiro-dev-clone/docs/` (`pendente`, 🔒 reservada)
- **Descrição:** Detalhes na pasta [`kiro-dev-clone/`](kiro-dev-clone/AGENTS.md): as 30 subtarefas abaixo espelham, uma a uma, as tarefas descritas nesse arquivo.
- **Critérios de Aceitação:** A ser definido pelo usuário na pasta `kiro-dev-clone/`.
- **Commit:** pendente
- **Anotação:** ⛔ **TRAVADO PARA TODAS AS IAS** (2026-10-12 15:10): tarefa reservada para implementação manual pelo usuário; nenhuma IA pode assumir as filhas sem autorização explícita — ver a **🔒 TRAVA ESPECIAL** no início do quadro. **Subdivisão (2026-10-12 16:11, DeepSeek Harness (deepseek-flash), a pedido do usuário):** a mãe, antes atômica, passou a declarar as 30 filhas `KIRO-DEV-CLONE.1` a `.30`, espelhando [`kiro-dev-clone/AGENTS.md`](kiro-dev-clone/AGENTS.md), com `Prioridade: BAIXA` (herdada da mãe — regra 1.2.4) e as dependências de lá. A **🔒 trava especial permanece ativa**: as filhas ficam **reservadas** e só o usuário libera. **Pasta renomeada (2026-10-12 16:18, DeepSeek Harness (deepseek-flash), a pedido do usuário):** `KIRO-DEV-CLONE/` → `kiro-dev-clone/`, alinhando à convenção de minúsculas do repositório. O **código da tarefa-mãe** no quadro continua `KIRO-DEV-CLONE` (é identificador, não caminho).
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): tarefa-mãe `pendente (aguardando subtarefas)` e 🔒 travada para todas as IAs; as 30 filhas continuam `pendente` e **nada** do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.1: Link "KIRO DEV CLONE" no menu
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** KIRO-DEV-CLONE.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar item no menu principal com o nome exato "KIRO DEV CLONE", apontando para a rota `/kiro-dev-clone` e mantendo a consistência visual (Tarefa 1.1 de [`kiro-dev-clone/AGENTS.md`](kiro-dev-clone/AGENTS.md)).
- **Critérios de Aceitação:** Item visível no menu com o nome exato; clique leva à rota; `npm run typecheck` e `npm test` verdes.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.2: Rota `/kiro-dev-clone`
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** KIRO-DEV-CLONE.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar a rota `/kiro-dev-clone` no React Router (`src/App.tsx` ou arquivo de rotas), renderizando o componente base da v2 (Tarefa 1.2).
- **Critérios de Aceitação:** Acessar a rota e ver o componente renderizado, sem erro no console.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.3: Componente base `KiroDevClone`
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/views/KiroDevClone.tsx` com layout básico: cabeçalho, área de conteúdo e rodapé (Tarefa 1.3).
- **Critérios de Aceitação:** Componente renderiza sem erros; `npm run typecheck` verde.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.4: Componente de Specs
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/kiro/Specs.tsx` para planejamento de features, com os campos requirements, design e tasks (Tarefa 2.1).
- **Critérios de Aceitação:** Componente renderiza e o formulário funciona.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.5: Botão "Criar Spec"
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** KIRO-DEV-CLONE.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar botão que abre modal/formulário para criar um novo spec no componente Specs (Tarefa 2.2).
- **Critérios de Aceitação:** Botão abre o formulário de criação.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.6: Endpoint para salvar specs
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** KIRO-DEV-CLONE.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar RPC ou endpoint (em `database/` ou `api/`) que salve specs com title, requirements, design e tasks (Tarefa 2.3).
- **Critérios de Aceitação:** Endpoint salva a spec sem erros; teste cobrindo o caminho feliz.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.7: Componente de Chat
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/kiro/Chat.tsx` com lista de mensagens, campo de texto e botão enviar (Tarefa 3.1).
- **Critérios de Aceitação:** Chat renderiza e permite enviar mensagem.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.8: Conectar chat com LLM
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** KIRO-DEV-CLONE.7
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Integrar o chat com a API do modelo LLM (`src/components/kiro/Chat.tsx` + `api/`) — Tarefa 3.2.
- **Critérios de Aceitação:** Chat envia a mensagem e exibe a resposta do modelo; a chave do provedor fica só no servidor.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.9: Componente de Steering
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/kiro/Steering.tsx` para exibir as regras/padrões do projeto (Tarefa 4.1).
- **Critérios de Aceitação:** Componente exibe a lista de regras.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.10: Validação de steering
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** KIRO-DEV-CLONE.9
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Validar código contra as regras de steering em `src/lib/kiro/steering.ts` (Tarefa 4.2).
- **Critérios de Aceitação:** A validação identifica desvios das regras definidas; teste unitário cobrindo.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.11: Sistema de hooks
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar em `src/lib/kiro/hooks.ts` o sistema que executa ações em eventos (file changes, tool use, task completion) — Tarefa 5.1.
- **Critérios de Aceitação:** Hooks registram os eventos; teste unitário cobrindo o registro.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera. Atenção: não confundir com os hooks de Git da seção 1.3 do `AGENTS.md` — são coisas diferentes.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.12: Hook de file change
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** KIRO-DEV-CLONE.11
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar hook que detecta mudanças em arquivos e dispara a ação configurada (Tarefa 5.2).
- **Critérios de Aceitação:** Hook detecta a mudança de arquivo.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.13: Integrar MCP existente
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Disponibilizar na v2 o MCP já implementado no projeto principal (`api/mcp.ts`) — Tarefa 6.1.
- **Critérios de Aceitação:** MCP responde na v2 (`tools/list` funciona).
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.14: Ferramentas MCP específicas
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** KIRO-DEV-CLONE.13
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Registrar em `api/_lib/tools.ts` as ferramentas MCP específicas da v2 (Tarefa 6.2).
- **Critérios de Aceitação:** Ferramentas registradas respondem corretamente; testes atualizados.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.15: Componente de Permissions
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/kiro/Permissions.tsx` com a UI para configurar permissões do agente (Tarefa 7.1).
- **Critérios de Aceitação:** Componente renderiza e permite configurar as permissões.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.16: Controle de acesso
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** KIRO-DEV-CLONE.15
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Implementar a validação de permissões em `src/lib/kiro/permissions.ts` (Tarefa 7.2).
- **Critérios de Aceitação:** O agente acessa apenas os recursos permitidos; teste unitário cobrindo a negação.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.17: Sistema de custom agents
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar em `src/lib/kiro/agents.ts` o sistema de agentes especializados com instruções próprias (Tarefa 8.1).
- **Critérios de Aceitação:** O sistema permite definir agentes com instruções específicas.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.18: UI para custom agents
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** KIRO-DEV-CLONE.17
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/kiro/CustomAgents.tsx` com formulário para definir as instruções do agente (Tarefa 8.2).
- **Critérios de Aceitação:** A UI cria e edita custom agents.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.19: Sistema de Skills
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar em `src/lib/kiro/skills.ts` o sistema de pacotes de instruções reutilizáveis (Tarefa 9.1).
- **Critérios de Aceitação:** O sistema permite definir skills reutilizáveis.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.20: UI para Skills
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** KIRO-DEV-CLONE.19
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/kiro/Skills.tsx` para listar e criar skills (Tarefa 9.2).
- **Critérios de Aceitação:** A UI lista e cria skills.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.21: Usar memória existente
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Expor na v2 o sistema de memória já implementado (`src/lib/memoria/`) — Tarefa 10.1.
- **Critérios de Aceitação:** A memória funciona na v2.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.22: Integrar memória com chat
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** KIRO-DEV-CLONE.21, KIRO-DEV-CLONE.7
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Permitir salvar e carregar memórias a partir do chat (`src/components/kiro/Chat.tsx`) — Tarefa 10.2.
- **Critérios de Aceitação:** O chat salva e carrega memórias.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.23: Sistema de checkpoints
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar em `src/lib/kiro/checkpoints.ts` o sistema de salvar/restaurar estado (Tarefa 11.1).
- **Critérios de Aceitação:** Checkpoint é salvo e restaurado corretamente.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.24: UI para checkpoints
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** KIRO-DEV-CLONE.23
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/kiro/Checkpoints.tsx` para listar, criar e restaurar checkpoints (Tarefa 11.2).
- **Critérios de Aceitação:** A UI executa as três operações.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.25: Arquivo `.kiroignore`
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar o `.kiroignore` na raiz com padrões de ignore, no estilo do `.gitignore` (Tarefa 12.1).
- **Critérios de Aceitação:** Arquivo criado com os padrões definidos.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.26: Leitura do `.kiroignore`
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** KIRO-DEV-CLONE.25
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Ler o `.kiroignore` e filtrar arquivos em `src/lib/kiro/ignore.ts` (Tarefa 12.2).
- **Critérios de Aceitação:** A filtragem ignora os arquivos listados; teste unitário cobrindo.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.27: Sistema de workflows
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar em `src/lib/kiro/workflows.ts` o sistema de workflows automatizados com passos (Tarefa 13.1).
- **Critérios de Aceitação:** O sistema permite definir workflows com passos.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.28: UI para workflows
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** KIRO-DEV-CLONE.27
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/kiro/Workflows.tsx` para listar e executar workflows (Tarefa 13.2).
- **Critérios de Aceitação:** A UI lista e executa workflows.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.29: `kiro-dev-clone/STATUS.md`
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `kiro-dev-clone/STATUS.md` com o modelo de status da implementação (Tarefa 14.1).
- **Critérios de Aceitação:** Arquivo criado com o modelo de status.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

#### [ ] KIRO-DEV-CLONE.30: Pasta `kiro-dev-clone/docs/`
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar a pasta de documentação específica `kiro-dev-clone/docs/` (Tarefa 14.2).
- **Critérios de Aceitação:** Pasta existe no repositório.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.
