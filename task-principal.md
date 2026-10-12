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
| **Status da Trava:** | 🔒 **OCUPADO** |
| **Sub-task em Execução:** | **SUB-38** |
| **Título da Sub-task:** | Verificação geral de todas as tarefas (marcador `VERIFICADOR-CLAUDE`) |
| **Agente Responsável:** | Devin (Cognition AI) |
| **Data e Hora de Início:** | 2026-10-12 15:35 |
| **Bloqueio para Outras IAs:** | Nenhuma outra IA pode assumir a SUB-38 (a 🔒 TRAVA ESPECIAL do KIRO-DEV-CLONE continua ativa logo abaixo) |

---

### 🔒 TRAVA ADICIONAL — Devin (Cognition AI) — SUB-38

| Propriedade | Valor Atual |
|---|---|
| **Status da Trava:** | 🔴 **OCUPADO** |
| **Sub-task em Execução:** | **SUB-38** |
| **Título da Sub-task:** | Verificação geral de todas as tarefas (marcador `VERIFICADOR-CLAUDE`) |
| **Agente Responsável:** | Devin (Cognition AI) |
| **Data e Hora de Início:** | 2026-10-12 15:35 |
| **Bloqueio para Outras IAs:** | Nenhuma outra IA pode assumir a SUB-38 |

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
- **Total de Tasks Principais:** 39
- **Subtarefas atômicas (~3 min):** 205
- **Em Execução:** 1 (SUB-38)
- **Pendentes:** 6 principais (SUB-38, 25, 26, 28, 35, KIRO-DEV-CLONE) + 6 subtarefas
  - livres agora, pela prioridade (seção 1.2 do [`AGENTS.md`](AGENTS.md)): 3 — SUB-25.4, SUB-25.7 e SUB-35.32 (`MEDIA`). A atômica KIRO-DEV-CLONE (`BAIXA`) está 🔴 travada para todas as IAs
  - bloqueadas por dependência: 3 — SUB-26.3 e SUB-26.9 (dependem da mãe SUB-25, ainda pendente) e SUB-35.46 (depende da SUB-35.32)
  - em execução: 1 — SUB-38 (Devin)
  - reservadas: 0
- **Concluídas:** 227 de 243 blocos (33 principais + 194 subtarefas) — blocos em [`task_complete.md`](task_complete.md)
- **Canceladas:** 0

---

## ⭐ PRIORIDADE MÁXIMA

### [ ] SUB-38: Verificação geral de todas as tarefas (marcador `VERIFICADOR-CLAUDE`)
- **Status:** em_execucao
- **Prioridade:** MAXIMA
- **Executor:** Devin (Cognition AI) (início: 2026-10-12 15:35)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica; mantida como 1 tarefa por decisão do usuário em 2026-10-12, apesar de passar de ~3 min)
- **Descrição:** Ler todos os blocos do `task-principal.md` e do `task_complete.md` e conferir, um por vez, se a entrega está correta (commits citados existem, arquivos e funções existem e atendem aos critérios, testes e validação). O resultado vai no marcador `- **VERIFICADOR-CLAUDE:**` de cada bloco (já inserido como `PENDENTE`). Valores: `✅ OK`, `⚠️ RESSALVA`, `❌ FALHA` ou `⬜ NÃO IMPLEMENTADA`, sempre com data, hora, agente e evidência. Só leitura: problemas achados viram subtarefas novas, não são corrigidos aqui. Commit e push a cada bloco verificado (`docs(verificador): SUB-XX verificada (<resultado>) por <agente>`). Plano e critérios: [`docs/verificador-claude.md`](docs/verificador-claude.md).
- **Critérios de Aceitação:** Nenhum marcador `VERIFICADOR-CLAUDE: PENDENTE` nos dois quadros; relatório final com a lista de ressalvas e falhas.
- **Commit:** pendente
- **Anotação:** Iniciada por Claude Code em 2026-10-12 15:20 e adiada a pedido do usuário. Feito até agora: marcador inserido em 246 blocos (`5fb92f7`); validação geral registrada em `docs/verificador-claude.md` (`npm run typecheck`/`build` falhavam com TS6133, tratado na SUB-25.8); 6 blocos já verificados: SUB-25, SUB-25.4, SUB-25.7, SUB-26, SUB-26.3 e SUB-26.9 (`⬜ NÃO IMPLEMENTADA`). Próximo bloco: SUB-28. A SUB-25.8 (travada por DeepSeek Harness no momento) ainda não tem os campos `Prioridade` (`ALTA`) e `VERIFICADOR-CLAUDE`: incluir quando a trava for liberada.
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
  - `SUB-25.4`: Teste rápido local: telas Fila e Logs (`pendente`)
  - `SUB-25.6`: Rodar `npm run test:integration` (`concluido`, `7c9891f`)
  - `SUB-25.7`: Teste rápido local: telas Memória e Configurações (`pendente`)
  - `SUB-25.8`: Corrigir erro de tipagem TS6133 em `tests/unit/api-aprovacao.test.ts` (`concluido`, `c933a99`)
- **Descrição:** Rodar compilação de produção (`npm run build`), validar ausência de erros de tipagem TypeScript e verificar integridade de pacotes.
- **Critérios de Aceitação:** Build gerado com sucesso na pasta `dist/` sem alertas impeditivos.
- **Commit:** pendente
- **Anotação:** pendente
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 15:25 (Claude Code): tarefa-mãe pendente: filhas 25.1, 25.2, 25.3 e 25.6 concluídas; 25.4, 25.7 (validação no navegador) e 25.8 (em execução) abertas. Critério ainda não atendido: `npm run build` falha no `tsc -b` (TS6133 em `tests/unit/api-aprovacao.test.ts:111`, corrigido pela SUB-25.8); `npx vite build` sozinho gera `dist/` e `check:chunks` passa (16 chunks ≤ 500 kB).

#### [ ] SUB-25.4: Teste rápido local: telas Fila e Logs
- **Status:** pendente
- **Prioridade:** MEDIA
- **Executor:** nenhum
- **Depende de:** SUB-25.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Subir `npm run preview` contra o banco local e conferir as telas Fila e Logs em 1280x800 e 390x844; registrar no `docs/VALIDACAO.md` (sem commitar screenshots grandes).
- **Critérios de Aceitação:** Sem erros no console; checklist registrado.
- **Commit:** pendente
- **Anotação:** pendente
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 15:25 (Claude Code): pendente, sem executor. Não há registro das telas Fila e Logs no `docs/VALIDACAO.md`; depende de navegador (não usado nesta verificação).

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
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 15:25 (Claude Code): pendente, sem executor. Não há registro das telas Memória e Configurações no `docs/VALIDACAO.md`; depende de navegador (não usado nesta verificação).

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
- **VERIFICADOR-CLAUDE:** PENDENTE

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
- **VERIFICADOR-CLAUDE:** PENDENTE

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
- **VERIFICADOR-CLAUDE:** PENDENTE

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
- **VERIFICADOR-CLAUDE:** PENDENTE

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
- **VERIFICADOR-CLAUDE:** PENDENTE

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
- **VERIFICADOR-CLAUDE:** PENDENTE

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
- **VERIFICADOR-CLAUDE:** PENDENTE

---

## 📋 FASE 11: Clone do Kiro.dev

### [ ] KIRO-DEV-CLONE: Clone do Kiro.dev
- **Status:** pendente
- **Prioridade:** BAIXA
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Detalhes na pasta `kiro-dev-clone/`. O usuário preencherá os detalhes nesta pasta.
- **Critérios de Aceitação:** A ser definido pelo usuário na pasta `kiro-dev-clone/`.
- **Commit:** pendente
- **Anotação:** ⛔ **TRAVADO PARA TODAS AS IAS** (2026-10-12 15:10): Tarefa reservada para implementação manual pelo usuário. Nenhuma IA pode assumir subtarefas sem autorização explícita. Ver trava especial no início do quadro.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE
