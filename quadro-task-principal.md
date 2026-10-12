# 📌 QUADRO DE CONTROLE DE EXECUÇÃO: `quadro-task-principal.md`

> **REGRA FUNDAMENTAL DE CONCORRÊNCIA PARA AGENTES DE IA:**
> ⚠️ **TRAVA ATIVA (LOCK):** Se houver uma task marcada na seção **"🔒 TRAVA ATIVA NO MOMENTO"** com status `EM EXECUÇÃO`, **NENHUMA OUTRA IA PODE ASSUMIR AQUELA MESMA TAREFA**.
> Para assumir uma nova tarefa, o agente **DEVE OBRIGATORIAMENTE**:
> 1. Verificar se a trava está livre ou se a task anterior foi finalizada.
> 2. Confirmar que todas as **dependências** da sub-task estão com status `CONCLUÍDO`.
> 3. Registrar seu nome/ID de agente, data/hora e o código da sub-task neste quadro antes de iniciar o código.
> 4. Executar `git add quadro-task-principal.md task-principal.md`, `git commit` e `git push origin main` do lock imediatamente.
> 5. Ao finalizar, atualizar o status para `CONCLUÍDO`, anotar o hash do `git commit`, registrar a nota de entrega, executar `git push origin main` e liberar a trava.

---

## 🔒 TRAVA ATIVA NO MOMENTO (LOCK DE AGENTE)

| Propriedade | Valor Atual |
|---|---|
| **Status da Trava:** | � **OCUPADO** |
| **Sub-task em Execução:** | **—** |
| **Título da Sub-task:** | — |
| **Agente Responsável:** | — |
| **Data e Hora de Início:** | — |
| **Bloqueio para Outras IAs:** | Nenhum lock ativo no quadro principal |

### 🔒 TRAVA ADICIONAL — Codex (OpenAI)

| Propriedade | Valor Atual |
|---|---|
| **Status da Trava:** | 🔴 **OCUPADO** |
| **Sub-task em Execução:** | **SUB-33.9** |
| **Título da Sub-task:** | Documentar `/api/embedding` no `api/README.md` |
| **Agente Responsável:** | Codex (OpenAI) |
| **Data e Hora de Início:** | 2026-10-12 00:43 |
| **Bloqueio para Outras IAs:** | **ATIVADO** |

### 🔒 TRAVA ADICIONAL — DashboardAI-Clone 06 — SUB-20.6

| Propriedade | Valor Atual |
|---|---|
| **Status da Trava:** | 🔴 **OCUPADO** |
| **Sub-task em Execução:** | **SUB-20.6** |
| **Título da Sub-task:** | Modal `MemoriaFormModal` em `src/components/memoria/` |
| **Agente Responsável:** | DashboardAI-Clone 06 |
| **Data e Hora de Início:** | 2026-10-12 00:55 |
| **Bloqueio para Outras IAs:** | **ATIVADO** |

### 🔒 TRAVA ADICIONAL — DashboardAI-Clone 01 — SUB-27.26

| Propriedade | Valor Atual |
|---|---|
| **Status da Trava:** | 🔴 **OCUPADO** |
| **Sub-task em Execução:** | **SUB-27.26** |
| **Título da Sub-task:** | Hook `useAuth` em `src/hooks/useAuth.ts` |
| **Agente Responsável:** | DashboardAI-Clone 01 |
| **Data e Hora de Início:** | 2026-10-12 00:56 |
| **Bloqueio para Outras IAs:** | **ATIVADO** |

### 🔒 TRAVA ADICIONAL — DashboardAI-Clone 04 (Grok Bot) — SUB-19.2

| Propriedade | Valor Atual |
|---|---|
| **Status da Trava:** | 🔴 **OCUPADO** |
| **Sub-task em Execução:** | **SUB-19.2** |
| **Título da Sub-task:** | Hook `useDebounce(valor, ms)` em `src/hooks/useDebounce.ts` |
| **Agente Responsável:** | DashboardAI-Clone 04 (Grok Bot) |
| **Data e Hora de Início:** | 2026-10-12 00:56 |
| **Bloqueio para Outras IAs:** | **ATIVADO** |

### 🔒 TRAVA ADICIONAL — DashboardAI-Clone 10 (Grok Bot) — SUB-21.5

| Propriedade | Valor Atual |
|---|---|
| **Status da Trava:** | 🔴 **OCUPADO** |
| **Sub-task em Execução:** | **SUB-21.5** |
| **Título da Sub-task:** | Componente `MemoriaGrid` em `src/components/memoria/MemoriaGrid.tsx` |
| **Agente Responsável:** | DashboardAI-Clone 10 (Grok Bot) |
| **Data e Hora de Início:** | 2026-10-12 00:57 |
| **Bloqueio para Outras IAs:** | **ATIVADO** |

### 🔒 TRAVA ADICIONAL — DashboardAI-Clone 02 — SUB-23.10

| Propriedade | Valor Atual |
|---|---|
| **Status da Trava:** | 🔴 **OCUPADO** |
| **Sub-task em Execução:** | **SUB-23.10** |
| **Título da Sub-task:** | `TravaItem` em `src/components/tasks/TravaItem.tsx` |
| **Agente Responsável:** | DashboardAI-Clone 02 |
| **Data e Hora de Início:** | 2026-10-12 00:57 |
| **Bloqueio para Outras IAs:** | **ATIVADO** |

### 🔒 TRAVA ADICIONAL — DashboardAI-Clone 08 (Grok Bot) — SUB-08.9

| Propriedade | Valor Atual |
|---|---|
| **Status da Trava:** | 🔴 **OCUPADO** |
| **Sub-task em Execução:** | **SUB-08.9** |
| **Título da Sub-task:** | CLI `npm run check:env` (toda variável usada está no `.env.example`) |
| **Agente Responsável:** | DashboardAI-Clone 08 (Grok Bot) |
| **Data e Hora de Início:** | 2026-10-12 00:58 |
| **Bloqueio para Outras IAs:** | **ATIVADO** |

---

## 🚦 QUADRO KANBAN DE SUB-TASKS

### 🔄 EM EXECUÇÃO (5)

| Código | Título da Mini-task | Agente | Início | Depende de |
|---|---|---|---|---|
| **SUB-08.9** | CLI `npm run check:env` (toda variável usada está no `.env.example`) | DashboardAI-Clone 08 (Grok Bot) | 2026-10-12 00:58 | SUB-08.2, SUB-08.3, SUB-08.4, SUB-08.5, SUB-08.6, SUB-08.7, SUB-08.11 |
| **SUB-23.10** | `TravaItem` em `src/components/tasks/TravaItem.tsx` | DashboardAI-Clone 02 | 2026-10-12 00:57 | SUB-23.6 |
| **SUB-21.5** | Componente `MemoriaGrid` em `src/components/memoria/MemoriaGrid.tsx` | DashboardAI-Clone 10 (Grok Bot) | 2026-10-12 00:57 | SUB-21.4 |
| **SUB-19.2** | Hook `useDebounce(valor, ms)` em `src/hooks/useDebounce.ts` | DashboardAI-Clone 04 (Grok Bot) | 2026-10-12 00:56 | SUB-19.1 |
| **SUB-27.26** | Hook `useAuth` em `src/hooks/useAuth.ts` | DashboardAI-Clone 01 | 2026-10-12 00:56 | SUB-27.9 |
| **SUB-20.6** | Modal `MemoriaFormModal` em `src/components/memoria/` | DashboardAI-Clone 06 | 2026-10-12 00:55 | SUB-20.1, SUB-20.3, SUB-20.4, SUB-20.5, SUB-20.8, SUB-20.9 |
| **SUB-33.9** | Documentar `/api/embedding` no `api/README.md` | Codex (OpenAI) | 2026-10-12 00:43 | SUB-33.11 |

---

### ⏳ PENDENTES (173)

> Legenda: 🟢 livre = dependências concluídas, qualquer agente pode assumir (com lock + commit + push); ⛓️ bloqueada = aguarda dependências; 🔒 reservada = sob trava de outro agente. Subtarefas são atômicas (~3 min: um método, componente, arquivo de teste ou seção). A tarefa-mãe só fecha quando todas as filhas estiverem concluídas.

> **SUB-35 criada a pedido do usuário** (2026-10-12 00:39): monitor em tempo real dos agentes (tabela `agent_events` + Supabase Realtime + eventos do worker LangGraph e da ferramenta MCP `agent_event`), subdividida em 46 partes de ~3 min.

> **SUB-08 liberada pelo usuário** (2026-10-12 00:08; trava de xAI (Grok) desde 22:41 sem commits) e subdividida em SUB-08.1–08.9 por DashboardAI (Grok Bot).

> **SUB-27 liberada a pedido do usuário** (2026-10-11 23:55): mãe e 22 subtarefas estão disponíveis; cada agente deve respeitar as dependências indicadas. Nenhum código da SUB-27 havia sido enviado à main.

**🟢 Livres agora (22):** SUB-08.7, SUB-08.8, SUB-34.1, SUB-34.2, SUB-34.4, SUB-19.1, SUB-19.3, SUB-19.9, SUB-20.8, SUB-20.9, SUB-21.2, SUB-21.3, SUB-21.4, SUB-21.6, SUB-23.2, SUB-23.5, SUB-23.12, SUB-25.1, SUB-26.1, SUB-35.1, SUB-35.21

| Código | Título da Mini-task | Prioridade | Fase | Depende de |
|---|---|---|---|---|
| **SUB-08** | Configuração de Variáveis de Ambiente e `.env.example` (mãe) | 3 | Fase 3 | SUB-06; SUB-08.1 a SUB-08.11 |
| **SUB-23** | Diagnóstico de Travas e Saúde da Fila (mãe) | 4 | Fase 8 | SUB-09, SUB-11, SUB-12; SUB-23.1 a SUB-23.13 |
| **SUB-23.1** | `minutosDeTrava` em `src/lib/saudeFila.ts` | 4 | Fase 8 | Nenhuma — 🟢 livre |
| **SUB-23.4** | `liberarTrava()` em `src/services/taskService.ts` | 4 | Fase 8 | Nenhuma — 🟢 livre |
| **SUB-23.5** | Teste de integração de `liberarTrava`: expirada e forçada | 4 | Fase 8 | SUB-23.4 — 🟢 livre |
| **SUB-23.7** | Painel `SaudeFilaPanel` (composição) em `src/components/tasks/SaudeFilaPanel.tsx` | 4 | Fase 8 | SUB-23.10, SUB-23.11 — ⛓️ bloqueada |
| **SUB-23.8** | Integrar `SaudeFilaPanel` na `src/views/LogsView.tsx` | 4 | Fase 8 | SUB-23.7 — ⛓️ bloqueada |
| **SUB-23.9** | Alerta de trava presa na `src/views/FilaView.tsx` | 4 | Fase 8 | SUB-23.3 — ⛓️ bloqueada |
| **SUB-23.10** | `TravaItem` em `src/components/tasks/TravaItem.tsx` | 4 | Fase 8 | SUB-23.6 — 🔄 em execução por DashboardAI-Clone 02 |
| **SUB-23.12** | Teste de integração de `liberarTrava`: viewer e outro projeto | 4 | Fase 8 | SUB-23.4 — 🟢 livre |
| **SUB-23.13** | `travaExpirada` em `src/lib/saudeFila.ts` | 4 | Fase 8 | SUB-23.1 — ⛓️ bloqueada |
| **SUB-19** | Interface de Pesquisa Semântica Vetorial (mãe) | 4 | Fase 7 | SUB-10, SUB-12, SUB-33; SUB-19.1 a SUB-19.10 |
| **SUB-19.1** | `debounce(fn, ms)` em `src/lib/debounce.ts` | 4 | Fase 7 | Nenhuma — 🟢 livre |
| **SUB-19.2** | Hook `useDebounce(valor, ms)` em `src/hooks/useDebounce.ts` | 4 | Fase 7 | SUB-19.1 — ⛓️ bloqueada — 🔄 em execução por DashboardAI-Clone 04 (Grok Bot) |
| **SUB-19.3** | `formatarSimilaridade` em `src/lib/similaridade.ts` | 4 | Fase 7 | Nenhuma — 🟢 livre |
| **SUB-19.6** | Hook `useBuscaSemantica` em `src/hooks/useBuscaSemantica.ts` | 4 | Fase 7 | SUB-19.2, SUB-33.7 — ⛓️ bloqueada |
| **SUB-19.7** | Painel `BuscaSemanticaPanel` (campo, grade e estados) | 4 | Fase 7 | SUB-19.5, SUB-19.6, SUB-19.9 — ⛓️ bloqueada |
| **SUB-19.8** | Integrar a busca na `src/views/MemoriaView.tsx` | 4 | Fase 7 | SUB-19.7, SUB-21.9 — ⛓️ bloqueada |
| **SUB-19.9** | `BuscaControles` (limiar, globais, modo) em `src/components/memoria/BuscaControles.tsx` | 4 | Fase 7 | Nenhuma — 🟢 livre |
| **SUB-20** | Formulário de Nova Memória Canônica (mãe) | 4 | Fase 7 | SUB-10, SUB-12, SUB-33; SUB-20.1 a SUB-20.10 |
| **SUB-20.6** | Modal `MemoriaFormModal` em `src/components/memoria/` | 4 | Fase 7 | SUB-20.1, SUB-20.3, SUB-20.4, SUB-20.5, SUB-20.8, SUB-20.9 — 🔄 em execução por DashboardAI-Clone 06 |
| **SUB-20.7** | Botão "Nova memória" na `src/views/MemoriaView.tsx` | 4 | Fase 7 | SUB-20.6, SUB-19.8, SUB-21.9 — ⛓️ bloqueada |
| **SUB-20.8** | `MarkdownEditor` em `src/components/ui/MarkdownEditor.tsx` | 4 | Fase 7 | Nenhuma — 🟢 livre |
| **SUB-20.9** | Componente `TagSugestoes` em `src/components/ui/TagSugestoes.tsx` | 4 | Fase 7 | Nenhuma — 🟢 livre |
| **SUB-21** | Grid de Gerenciamento e Exclusão de Memórias (mãe) | 4 | Fase 7 | SUB-10, SUB-12; SUB-21.1 a SUB-21.14 |
| **SUB-21.3** | Hook `useMemorias` em `src/hooks/useMemorias.ts` | 4 | Fase 7 | Nenhuma — 🟢 livre |
| **SUB-21.5** | Componente `MemoriaGrid` em `src/components/memoria/MemoriaGrid.tsx` | 4 | Fase 7 | SUB-21.4 — 🔄 em execução por DashboardAI-Clone 10 (Grok Bot) |
| **SUB-21.6** | Modal `MemoriaDetailModal` em `src/components/memoria/MemoriaDetailModal.tsx` | 4 | Fase 7 | SUB-21.13 — 🟢 livre |
| **SUB-21.7** | Hook `useExcluirMemoria` em `src/hooks/useExcluirMemoria.ts` | 4 | Fase 7 | SUB-21.3 — ⛓️ bloqueada |
| **SUB-21.8** | Barra `MemoriaToolbar` em `src/components/memoria/MemoriaToolbar.tsx` | 4 | Fase 7 | SUB-21.14 — ⛓️ bloqueada |
| **SUB-21.9** | Montar a `MemoriaView` (toolbar + grade) | 4 | Fase 7 | SUB-21.3, SUB-21.5, SUB-21.8 — ⛓️ bloqueada |
| **SUB-21.10** | Validação visual da SUB-21 (screenshots) | 4 | Fase 7 | SUB-21.11 — ⛓️ bloqueada |
| **SUB-21.11** | Ligar detalhe e exclusão na `MemoriaView` | 4 | Fase 7 | SUB-21.9, SUB-21.6, SUB-21.7 — ⛓️ bloqueada |
| **SUB-21.12** | Conferir exclusão com editor e viewer | 4 | Fase 7 | SUB-21.11 — ⛓️ bloqueada |
| **SUB-34** | Carregamento Sob Demanda de Telas e Modais (code splitting) (mãe) | 4 | Fase 6 | SUB-13, SUB-14, SUB-16, SUB-17, SUB-18; SUB-34.1 a SUB-34.6 |
| **SUB-34.1** | Fallback `CarregandoTela` em `src/components/ui/CarregandoTela.tsx` | 4 | Fase 6 | Nenhuma — 🟢 livre |
| **SUB-34.2** | Telas com `React.lazy` em `src/views/index.ts` | 4 | Fase 6 | Nenhuma — 🟢 livre |
| **SUB-34.3** | Modais da fila sob demanda na `src/views/FilaView.tsx` | 4 | Fase 6 | SUB-34.1 — ⛓️ bloqueada |
| **SUB-34.4** | Separar dependências grandes no `vite.config.ts` | 4 | Fase 6 | Nenhuma — 🟢 livre |
| **SUB-34.5** | Checagem de tamanho `scripts/checar-chunks.mjs` | 4 | Fase 6 | SUB-34.6, SUB-34.3, SUB-34.4 — ⛓️ bloqueada |
| **SUB-34.6** | `Suspense` com `CarregandoTela` no `src/App.tsx` | 4 | Fase 6 | SUB-34.1, SUB-34.2 — ⛓️ bloqueada |
| **SUB-25** | Validação de Build e Execução Local (mãe) | 5 | Fase 10 | SUB-01 a SUB-24; SUB-25.1 a SUB-25.7 |
| **SUB-25.1** | Script `scripts/validar.sh` + `npm run validar` | 5 | Fase 10 | Nenhuma — 🟢 livre |
| **SUB-25.2** | Rodar `npm ci` + `npm run validar` e registrar em `docs/VALIDACAO.md` | 5 | Fase 10 | SUB-25.1, SUB-08.9, SUB-19, SUB-20, SUB-21, SUB-23, SUB-27 (inclui SUB-27.28), SUB-33, SUB-34 — ⛓️ bloqueada |
| **SUB-25.3** | Rodar `database/tests/run_tests.sh` | 5 | Fase 10 | SUB-25.2 — ⛓️ bloqueada |
| **SUB-25.4** | Teste rápido local: telas Fila e Logs | 5 | Fase 10 | SUB-25.2 — ⛓️ bloqueada |
| **SUB-25.6** | Rodar `npm run test:integration` | 5 | Fase 10 | SUB-25.2 — ⛓️ bloqueada |
| **SUB-25.7** | Teste rápido local: telas Memória e Configurações | 5 | Fase 10 | SUB-25.2 — ⛓️ bloqueada |
| **SUB-26** | Documentação Completa e Manual Operacional no `README.md` (mãe) | 5 | Fase 10 | SUB-25; SUB-26.1 a SUB-26.10 |
| **SUB-26.1** | Esqueleto do `README.md` | 5 | Fase 10 | Nenhuma — 🟢 livre |
| **SUB-26.2** | Seção Arquitetura | 5 | Fase 10 | SUB-26.1, SUB-33 — ⛓️ bloqueada |
| **SUB-26.3** | Seção Execução local | 5 | Fase 10 | SUB-26.1, SUB-08.9, SUB-25 — ⛓️ bloqueada |
| **SUB-26.4** | Seção Banco de dados | 5 | Fase 10 | SUB-26.1 — ⛓️ bloqueada |
| **SUB-26.5** | Seção Deploy na Vercel | 5 | Fase 10 | SUB-26.1, SUB-08.9, SUB-33 — ⛓️ bloqueada |
| **SUB-26.6** | Seção Agentes de IA: configurar clientes MCP | 5 | Fase 10 | SUB-26.1 — ⛓️ bloqueada |
| **SUB-26.7** | Seção Memória via MCP | 5 | Fase 10 | SUB-26.1 — ⛓️ bloqueada |
| **SUB-26.8** | Seção Segurança | 5 | Fase 10 | SUB-26.1, SUB-27.13, SUB-27.17, SUB-27.21 — ⛓️ bloqueada |
| **SUB-26.9** | Revisão final do README | 5 | Fase 10 | SUB-26.2, SUB-26.3, SUB-26.4, SUB-26.5, SUB-26.6, SUB-26.7, SUB-26.8, SUB-26.10, SUB-25 — ⛓️ bloqueada |
| **SUB-26.10** | Seção Agentes de IA: exemplos do ciclo da fila | 5 | Fase 10 | SUB-26.1 — ⛓️ bloqueada |
| **SUB-28** | Integração LangChain/LangGraph para Execução de Tasks (mãe) | 5 | Fase 11 (última) | SUB-01 a SUB-27, SUB-29, SUB-30; SUB-28.1 a SUB-28.32 |
| **SUB-28.1** | Contrato: identificadores e estado mínimo em `docs/langgraph-contrato.md` | 5 | Fase 11 (última) | SUB-01 a SUB-27, SUB-29 a SUB-34 — ⛓️ bloqueada |
| **SUB-28.2** | Dependências do worker no `package.json` | 5 | Fase 11 (última) | SUB-28.27 — ⛓️ bloqueada |
| **SUB-28.3** | Annotation `EstadoExecucao` em `worker/estado.ts` | 5 | Fase 11 (última) | SUB-28.28 — ⛓️ bloqueada |
| **SUB-28.4** | `reivindicar(agente, projeto)` em `worker/fila.ts` | 5 | Fase 11 (última) | SUB-28.28 — ⛓️ bloqueada |
| **SUB-28.5** | Allowlist e `obterFerramenta(nome)` em `worker/ferramentas.ts` | 5 | Fase 11 (última) | SUB-28.29 — ⛓️ bloqueada |
| **SUB-28.6** | Nó `carregarContexto` em `worker/nos/carregarContexto.ts` | 5 | Fase 11 (última) | SUB-28.29, SUB-28.19 — ⛓️ bloqueada |
| **SUB-28.7** | Nó `planejar` (chamada ao modelo) em `worker/nos/planejar.ts` | 5 | Fase 11 (última) | SUB-28.31 — ⛓️ bloqueada |
| **SUB-28.8** | Nó `politica` (aprovação humana) em `worker/nos/politica.ts` | 5 | Fase 11 (última) | SUB-28.19 — ⛓️ bloqueada |
| **SUB-28.9** | Nó `executar` em `worker/nos/executar.ts` | 5 | Fase 11 (última) | SUB-28.19 — ⛓️ bloqueada |
| **SUB-28.10** | Nó `revisar` (roteamento) em `worker/nos/revisar.ts` | 5 | Fase 11 (última) | SUB-28.21 — ⛓️ bloqueada |
| **SUB-28.11** | Nó `finalizar` em `worker/nos/finalizar.ts` | 5 | Fase 11 (última) | SUB-28.30 — ⛓️ bloqueada |
| **SUB-28.12** | Montagem do `StateGraph` em `worker/grafo.ts` | 5 | Fase 11 (última) | SUB-28.6, SUB-28.7, SUB-28.8, SUB-28.9, SUB-28.10, SUB-28.11 — ⛓️ bloqueada |
| **SUB-28.13** | Checkpointer durável em `worker/checkpointer.ts` | 5 | Fase 11 (última) | SUB-28.28 — ⛓️ bloqueada |
| **SUB-28.14** | Reconciliação na retomada em `worker/reconciliar.ts` | 5 | Fase 11 (última) | SUB-28.30 — ⛓️ bloqueada |
| **SUB-28.15** | CLI do worker em `worker/index.ts` | 5 | Fase 11 (última) | SUB-28.22 — ⛓️ bloqueada |
| **SUB-28.16** | Endpoint `api/aprovacao.ts`: autenticação e papel (401/403) | 5 | Fase 11 (última) | SUB-28.15, SUB-33.2, SUB-27.26 — ⛓️ bloqueada |
| **SUB-28.17** | Testes do worker: caminho feliz e erro | 5 | Fase 11 (última) | SUB-28.15 — ⛓️ bloqueada |
| **SUB-28.18** | Atualizar `LangChain_LangGraph.md` (status e desvios) | 5 | Fase 11 (última) | SUB-28.15, SUB-28.32 — ⛓️ bloqueada |
| **SUB-28.19** | Adaptar ferramentas para `tool()` do LangChain em `worker/ferramentas.ts` | 5 | Fase 11 (última) | SUB-28.5 — ⛓️ bloqueada |
| **SUB-28.20** | `PlanoSchema` em `worker/plano.ts` | 5 | Fase 11 (última) | SUB-28.29 — ⛓️ bloqueada |
| **SUB-28.21** | `classificarFalha(err)` em `worker/falhas.ts` | 5 | Fase 11 (última) | SUB-28.29 — ⛓️ bloqueada |
| **SUB-28.22** | `executarUmaTask(deps)` em `worker/executar.ts` | 5 | Fase 11 (última) | SUB-28.12, SUB-28.13, SUB-28.14 — ⛓️ bloqueada |
| **SUB-28.23** | Retomada da aprovação (`Command({ resume })`) em `api/aprovacao.ts` | 5 | Fase 11 (última) | SUB-28.16 — ⛓️ bloqueada |
| **SUB-28.24** | Testes do worker: interrupção e retomada sem duplicar efeitos | 5 | Fase 11 (última) | SUB-28.15 — ⛓️ bloqueada |
| **SUB-28.25** | Variáveis do worker no `api/README.md` | 5 | Fase 11 (última) | SUB-28.15, SUB-28.32 — ⛓️ bloqueada |
| **SUB-28.26** | Contrato: ferramentas permitidas e idempotência em `docs/langgraph-contrato.md` | 5 | Fase 11 (última) | SUB-28.1 — ⛓️ bloqueada |
| **SUB-28.27** | Contrato: mapeamento de erros para `finalizar_task` em `docs/langgraph-contrato.md` | 5 | Fase 11 (última) | SUB-28.26 — ⛓️ bloqueada |
| **SUB-28.28** | `worker/tsconfig.json` e `typecheck:worker` | 5 | Fase 11 (última) | SUB-28.2 — ⛓️ bloqueada |
| **SUB-28.29** | Schema zod `EstadoSchema` em `worker/estado.ts` | 5 | Fase 11 (última) | SUB-28.3 — ⛓️ bloqueada |
| **SUB-28.30** | `finalizar(...)` em `worker/fila.ts` | 5 | Fase 11 (última) | SUB-28.4 — ⛓️ bloqueada |
| **SUB-28.31** | `montarPromptPlano(estado)` em `worker/plano.ts` | 5 | Fase 11 (última) | SUB-28.20 — ⛓️ bloqueada |
| **SUB-28.32** | Registro de auditoria da aprovação | 5 | Fase 11 (última) | SUB-28.23 — ⛓️ bloqueada |
| **SUB-33** | Endpoint de Embeddings para o Frontend (`api/embedding.ts`) (mãe) | 3 | Fase 2B | SUB-07, SUB-03; SUB-33.1 a SUB-33.13 |
| **SUB-33.9** | Documentar `/api/embedding` no `api/README.md` | 3 | Fase 2B | SUB-33.11 — 🔄 em execução por Codex (OpenAI) |
| **SUB-27** | Autenticação e Login com Supabase Auth (mãe; pendente, liberada) | 3 | Fase 10 | SUB-03, SUB-29; SUB-27.1 a SUB-27.28 — 🟢 livre |
| **SUB-27.8** | Teste de integração dos papéis em `tests/integration/authService.integration.test.ts` | 3 | Fase 10 | SUB-27.25 — ⛓️ bloqueada |
| **SUB-27.10** | Formulário `LoginForm` (e-mail, senha, Entrar) em `src/components/auth/LoginForm.tsx` | 3 | Fase 10 | SUB-27.2, SUB-27.3 — ⛓️ bloqueada |
| **SUB-27.11** | Tela `LoginView` em `src/views/LoginView.tsx` | 3 | Fase 10 | SUB-27.10, SUB-27.19 — ⛓️ bloqueada |
| **SUB-27.12** | Guarda `RotaProtegida` em `src/components/auth/RotaProtegida.tsx` | 3 | Fase 10 | SUB-27.26, SUB-27.11 — ⛓️ bloqueada |
| **SUB-27.13** | Integrar autenticação no `src/App.tsx` | 3 | Fase 10 | SUB-27.12 — ⛓️ bloqueada |
| **SUB-27.14** | Componente `UserMenu` em `src/components/layout/UserMenu.tsx` | 3 | Fase 10 | SUB-27.26 — ⛓️ bloqueada |
| **SUB-27.15** | Rechecar conexão no login/logout em `src/hooks/useConexao.ts` | 3 | Fase 10 | SUB-27.26 — ⛓️ bloqueada |
| **SUB-27.17** | Documentar configuração do Supabase Auth em `src/README.md` | 3 | Fase 10 | SUB-27.13 — ⛓️ bloqueada |
| **SUB-27.18** | Validação automatizada da SUB-27 | 3 | Fase 10 | SUB-27.6, SUB-27.8, SUB-27.13, SUB-27.27, SUB-27.15, SUB-27.16, SUB-27.17, SUB-27.20, SUB-27.21 — ⛓️ bloqueada |
| **SUB-27.19** | `RecuperarAcesso` (link mágico e esqueci a senha) em `src/components/auth/RecuperarAcesso.tsx` | 3 | Fase 10 | SUB-27.24, SUB-27.16 — ⛓️ bloqueada |
| **SUB-27.20** | Limpar `ProjetoContext` ao sair | 3 | Fase 10 | SUB-27.26 — ⛓️ bloqueada |
| **SUB-27.21** | Documentar primeiro administrador e membros em `database/README.md` | 3 | Fase 10 | SUB-27.13 — ⛓️ bloqueada |
| **SUB-27.22** | Conferência no navegador (entrar, sair, restaurar sessão) — SUB-27 | 3 | Fase 10 | SUB-27.18 — ⛓️ bloqueada |
| **SUB-27.26** | Hook `useAuth` em `src/hooks/useAuth.ts` | 3 | Fase 10 | SUB-27.9 — ⛓️ bloqueada |
| **SUB-27.27** | Incluir `UserMenu` no `src/components/layout/Header.tsx` | 3 | Fase 10 | SUB-27.14 — ⛓️ bloqueada |
| **SUB-27.28** | Varredura do bundle por `service_role` (SUB-27) | 3 | Fase 10 | SUB-27.22 — ⛓️ bloqueada |
| **SUB-35** | Monitor em Tempo Real dos Agentes (mãe) | 4 | Fase 12 | SUB-12, SUB-29, SUB-30; SUB-35.1 a SUB-35.46 |
| **SUB-35.1** | Tabela `agent_events` em `database/07_agent_events.sql` | 4 | Fase 12 | SUB-29 — 🟢 livre |
| **SUB-35.2** | Trigger `validar_agent_event` em `database/07_agent_events.sql` | 4 | Fase 12 | SUB-35.1 — ⛓️ bloqueada |
| **SUB-35.3** | RLS de `agent_events` (viewer lê, editor inclui) em `database/07_agent_events.sql` | 4 | Fase 12 | SUB-35.1 — ⛓️ bloqueada |
| **SUB-35.4** | Publicar `agent_events` no Supabase Realtime | 4 | Fase 12 | SUB-35.1 — ⛓️ bloqueada |
| **SUB-35.5** | Função `atividade_atual_agentes(p_project_id)` em `database/07_agent_events.sql` | 4 | Fase 12 | SUB-35.3 — ⛓️ bloqueada |
| **SUB-35.6** | Teste de integração de `agent_events` (RLS e trigger) | 4 | Fase 12 | SUB-35.2, SUB-35.3 — ⛓️ bloqueada |
| **SUB-35.7** | Seção "Eventos dos agentes (07)" no `database/README.md` | 4 | Fase 12 | SUB-35.4, SUB-35.5 — ⛓️ bloqueada |
| **SUB-35.8** | Tipos `AgentEvent` e `AtividadeAgente` em `src/types/database.ts` | 4 | Fase 12 | SUB-35.5 — ⛓️ bloqueada |
| **SUB-35.9** | `listarEventos()` em `src/services/eventService.ts` | 4 | Fase 12 | SUB-35.8 — ⛓️ bloqueada |
| **SUB-35.10** | `atividadeAtual()` em `src/services/eventService.ts` | 4 | Fase 12 | SUB-35.9 — ⛓️ bloqueada |
| **SUB-35.11** | `assinarEventos()` (Supabase Realtime) em `src/services/eventService.ts` | 4 | Fase 12 | SUB-35.10 — ⛓️ bloqueada |
| **SUB-35.12** | Testes de `eventService` em `tests/unit/eventService.test.ts` | 4 | Fase 12 | SUB-35.11 — ⛓️ bloqueada |
| **SUB-35.13** | Teste de integração de `listarEventos`/`atividadeAtual` | 4 | Fase 12 | SUB-35.10, SUB-35.6 — ⛓️ bloqueada |
| **SUB-35.14** | `mesclarEvento()` em `src/lib/monitor.ts` | 4 | Fase 12 | SUB-35.8 — ⛓️ bloqueada |
| **SUB-35.15** | `estadoDoAgente()` em `src/lib/monitor.ts` | 4 | Fase 12 | SUB-35.14 — ⛓️ bloqueada |
| **SUB-35.16** | `contarPorStatus()` em `src/lib/monitor.ts` | 4 | Fase 12 | SUB-35.15 — ⛓️ bloqueada |
| **SUB-35.17** | `contarPorAgente()` em `src/lib/monitor.ts` | 4 | Fase 12 | SUB-35.16 — ⛓️ bloqueada |
| **SUB-35.18** | `segmentosLinhaDoTempo()` em `src/lib/monitor.ts` | 4 | Fase 12 | SUB-35.17 — ⛓️ bloqueada |
| **SUB-35.19** | Hook `useEventosAgentes(projectId)` em `src/hooks/useEventosAgentes.ts` | 4 | Fase 12 | SUB-35.11, SUB-35.14 — ⛓️ bloqueada |
| **SUB-35.20** | Hook `useAtividadeAgentes(projectId)` em `src/hooks/useAtividadeAgentes.ts` | 4 | Fase 12 | SUB-35.19, SUB-35.15 — ⛓️ bloqueada |
| **SUB-35.21** | Instalar `chart.js` e `react-chartjs-2` | 4 | Fase 12 | Nenhuma — 🟢 livre |
| **SUB-35.22** | Registro do Chart.js e paleta em `src/lib/charts.ts` | 4 | Fase 12 | SUB-35.21 — ⛓️ bloqueada |
| **SUB-35.23** | Componente `AgenteCard` em `src/components/monitor/AgenteCard.tsx` | 4 | Fase 12 | SUB-35.15 — ⛓️ bloqueada |
| **SUB-35.24** | Componente `AtividadeAgentesGrid` em `src/components/monitor/AtividadeAgentesGrid.tsx` | 4 | Fase 12 | SUB-35.23 — ⛓️ bloqueada |
| **SUB-35.25** | Gráfico `GraficoPorStatus` em `src/components/monitor/GraficoPorStatus.tsx` | 4 | Fase 12 | SUB-35.22, SUB-35.16 — ⛓️ bloqueada |
| **SUB-35.26** | Gráfico `GraficoPorAgente` em `src/components/monitor/GraficoPorAgente.tsx` | 4 | Fase 12 | SUB-35.22, SUB-35.17 — ⛓️ bloqueada |
| **SUB-35.27** | Linha do tempo `LinhaDoTempoAgentes` em `src/components/monitor/LinhaDoTempoAgentes.tsx` | 4 | Fase 12 | SUB-35.22, SUB-35.18 — ⛓️ bloqueada |
| **SUB-35.28** | Feed `FeedEventos` em `src/components/monitor/FeedEventos.tsx` | 4 | Fase 12 | SUB-35.8 — ⛓️ bloqueada |
| **SUB-35.29** | Indicador `IndicadorAoVivo` em `src/components/monitor/IndicadorAoVivo.tsx` | 4 | Fase 12 | SUB-35.19 — ⛓️ bloqueada |
| **SUB-35.30** | Tela `MonitorView` em `src/views/MonitorView.tsx` | 4 | Fase 12 | SUB-35.20, SUB-35.24, SUB-35.25, SUB-35.26, SUB-35.27, SUB-35.28, SUB-35.29 — ⛓️ bloqueada |
| **SUB-35.31** | Registrar a tela `monitor` (rota `#/monitor` e menu) | 4 | Fase 12 | SUB-35.30, SUB-34.2 — ⛓️ bloqueada |
| **SUB-35.32** | Validação visual do monitor (SUB-35) | 4 | Fase 12 | SUB-35.31 — ⛓️ bloqueada |
| **SUB-35.33** | `emitirEvento()` em `worker/eventos.ts` | 4 | Fase 12 | SUB-35.1, SUB-28.28 — ⛓️ bloqueada |
| **SUB-35.34** | Testes de `emitirEvento` em `tests/unit/worker-eventos.test.ts` | 4 | Fase 12 | SUB-35.33 — ⛓️ bloqueada |
| **SUB-35.35** | `comEventos(nome, no)` em `worker/eventos.ts` | 4 | Fase 12 | SUB-35.33, SUB-28.3 — ⛓️ bloqueada |
| **SUB-35.36** | Envolver os nós em `worker/grafo.ts` com `comEventos` | 4 | Fase 12 | SUB-35.35, SUB-28.12 — ⛓️ bloqueada |
| **SUB-35.37** | `iniciarHeartbeat()` em `worker/heartbeat.ts` | 4 | Fase 12 | SUB-35.33 — ⛓️ bloqueada |
| **SUB-35.38** | Ligar o heartbeat no CLI `worker/index.ts` | 4 | Fase 12 | SUB-35.37, SUB-28.15 — ⛓️ bloqueada |
| **SUB-35.39** | Teste do worker: eventos emitidos na ordem dos nós | 4 | Fase 12 | SUB-35.36, SUB-28.17 — ⛓️ bloqueada |
| **SUB-35.40** | Ferramenta MCP `agent_event` em `api/_lib/event-tools.ts` | 4 | Fase 12 | SUB-35.2 — ⛓️ bloqueada |
| **SUB-35.41** | Testes da ferramenta `agent_event` em `tests/unit/api-event-tools.test.ts` | 4 | Fase 12 | SUB-35.40 — ⛓️ bloqueada |
| **SUB-35.42** | `commits_para_eventos()` em `scripts/espelhar_quadro_eventos.py` | 4 | Fase 12 | SUB-35.1 — ⛓️ bloqueada |
| **SUB-35.43** | CLI `scripts/espelhar_quadro_eventos.py` (dry-run e `--aplicar`) | 4 | Fase 12 | SUB-35.42 — ⛓️ bloqueada |
| **SUB-35.44** | Seção "Monitor em tempo real" no `README.md` | 4 | Fase 12 | SUB-35.31, SUB-35.40, SUB-35.43 — ⛓️ bloqueada |
| **SUB-35.45** | Seção "Reporte de progresso (opcional)" no `AGENTS.md` | 4 | Fase 12 | SUB-35.41 — ⛓️ bloqueada |
| **SUB-35.46** | Validação automatizada da SUB-35 | 4 | Fase 12 | SUB-35.7, SUB-35.12, SUB-35.13, SUB-35.32, SUB-35.34, SUB-35.38, SUB-35.39, SUB-35.41, SUB-35.43, SUB-35.44, SUB-35.45 — ⛓️ bloqueada |

---

### ✅ CONCLUÍDAS (65)

| Código | Título da Mini-task | Agente | Início | Conclusão | Commit SHA |
|---|---|---|---|---|---|
| **SUB-08.11** | `listarArquivosFonte(dirs)` em `scripts/checar-env.mjs` + teste | DashboardAI-Clone 08 (Grok Bot) | 2026-10-12 00:57 | 2026-10-12 00:58 | `0ac9843` |
| **SUB-21.14** | `tagsDisponiveis` em `src/lib/memorias.ts` | DashboardAI-Clone 05 (Grok Bot) | 2026-10-12 00:57 | 2026-10-12 00:57 | `1734052` |
| **SUB-08.10** | `variaveisDoExemplo(texto)` em `scripts/checar-env.mjs` + testes | DashboardAI-Clone 08 (Grok Bot) | 2026-10-12 00:56 | 2026-10-12 00:56 | `ad56d9b` |
| **SUB-21.2** | `filtrarMemoriasLocal` em `src/lib/memorias.ts` | DashboardAI-Clone 05 (Grok Bot) | 2026-10-12 00:55 | 2026-10-12 00:56 | `0849e15` |
| **SUB-08.7** | Conferir `.gitignore` (`!.env.example`) | DashboardAI-Clone 04 (Grok Bot) | 2026-10-12 00:55 | 2026-10-12 00:56 | `4be4a20` |
| **SUB-27.9** | `AuthProvider` em `src/hooks/AuthContext.tsx` | DashboardAI-Clone 01 | 2026-10-12 00:55 | 2026-10-12 00:55 | `333f8b9` |
| **SUB-08.8** | `extrairVariaveis(texto)` em `scripts/checar-env.mjs` + testes | DashboardAI-Clone 08 (Grok Bot) | 2026-10-12 00:54 | 2026-10-12 00:55 | `fb7f8bf` |
| **SUB-27.6** | Testes unitários de `authService` em `tests/unit/authService.test.ts` | DashboardAI-Clone 01 | 2026-10-12 00:54 | 2026-10-12 00:55 | `f830757` |
| **SUB-20.5** | Hook `useSalvarMemoria` em `src/hooks/useSalvarMemoria.ts` | DashboardAI-Clone 06 | 2026-10-12 00:54 | 2026-10-12 00:54 | `3208e66` |
| **SUB-27.25** | `papelNoProjeto()` em `src/services/authService.ts` | DashboardAI-Clone 01 | 2026-10-12 00:53 | 2026-10-12 00:54 | `6223e85` |
| **SUB-27.24** | `redefinirSenha()` em `src/services/authService.ts` | DashboardAI-Clone 01 | 2026-10-12 00:53 | 2026-10-12 00:53 | `e5477d2` |
| **SUB-27.23** | `obterSessao()` em `src/services/authService.ts` | DashboardAI-Clone 01 | 2026-10-12 00:52 | 2026-10-12 00:53 | `c696d9f` |
| **SUB-20.4** | Componente `TagInput` em `src/components/ui/TagInput.tsx` | DashboardAI-Clone 06 | 2026-10-12 00:52 | 2026-10-12 00:53 | `3d44cd1` |
| **SUB-27.7** | `obterPapelGlobal()` em `src/services/authService.ts` | DashboardAI-Clone 01 | 2026-10-12 00:51 | 2026-10-12 00:52 | `5ebbd19` |
| **SUB-27.5** | `enviarLinkMagico()` em `src/services/authService.ts` | DashboardAI-Clone 01 | 2026-10-12 00:51 | 2026-10-12 00:51 | `500e307` |
| **SUB-27.4** | `sair()` em `src/services/authService.ts` | DashboardAI-Clone 01 | 2026-10-12 00:50 | 2026-10-12 00:51 | `7bc78da` |
| **SUB-20.2** | `parseTags(texto)` em `src/lib/memoriaForm.ts` | DashboardAI-Clone 06 | 2026-10-12 00:50 | 2026-10-12 00:51 | `78a1e70` |
| **SUB-27.3** | `entrarComSenha(email, senha)` em `src/services/authService.ts` | DashboardAI-Clone 01 | 2026-10-12 00:50 | 2026-10-12 00:50 | `c80c6c6` |
| **SUB-20.3** | `sugerirTags(titulo, conteudo)` em `src/lib/memoriaForm.ts` | DashboardAI-Clone 06 | 2026-10-12 00:49 | 2026-10-12 00:50 | `e5e67e5` |
| **SUB-27.16** | `urlDeRetorno()` para link mágico e redefinição de senha | DashboardAI-Clone 01 | 2026-10-12 00:49 | 2026-10-12 00:49 | `1e3240c` |
| **SUB-27.2** | `validarLogin({ email, senha })` em `src/lib/auth.ts` | DashboardAI-Clone 01 | 2026-10-12 00:48 | 2026-10-12 00:49 | `07a914b` |
| **SUB-20.1** | `validarMemoria(dados)` em `src/lib/memoriaForm.ts` | DashboardAI-Clone 06 | 2026-10-12 00:48 | 2026-10-12 00:48 | `5662f1a` |
| **SUB-27.1** | `mensagemErroAuth(erro)` em `src/lib/auth.ts` | DashboardAI-Clone 01 | 2026-10-12 00:48 | 2026-10-12 00:48 | `8ccaf5f` |
| **SUB-20.10** | `palavrasDe(texto)` em `src/lib/texto.ts` | DashboardAI-Clone 06 | 2026-10-12 00:46 | 2026-10-12 00:47 | `8090709` |
| **SUB-04** | Consolidação dos Schemas SQL na Pasta `database/` | DashboardAI (Grok Bot) | 2026-10-11 22:18 | 2026-10-11 22:20 | `f7d6e04` |
| **SUB-05** | Consolidação das Funções RPC e Triggers no Banco | DashboardAI (Grok Bot) | 2026-10-11 22:20 | 2026-10-11 22:21 | `ceb04a9` |
| **SUB-24** | Script de Sincronização de Tasks (`scripts/sincronizar_tasks.py`) | DashboardAI (Grok Bot) | 2026-10-11 22:21 | 2026-10-11 22:23 | `7132c1b` |
| **SUB-06** | Estrutura do Endpoint Serverless Vercel MCP | DashboardAI (Grok Bot) | 2026-10-11 22:23 | 2026-10-11 22:24 | `ce840a4` |
| **SUB-29** | Multi-projeto, Papéis e RLS no Banco | DashboardAI (Grok Bot) | 2026-10-11 22:37 | 2026-10-11 22:43 | `30fe077` |
| **SUB-30** | Ferramentas da Fila no MCP | DashboardAI (Grok Bot) | 2026-10-11 22:43 | 2026-10-11 22:45 | `5d7c995` |
| **SUB-07** | Implementação das Primitivas de Memória e Embeddings | DashboardAI (Grok Bot) | 2026-10-11 22:45 | 2026-10-11 22:47 | `746bd8d` |
| **SUB-31** | Recados entre Agentes e Regras por Projeto | DashboardAI (Grok Bot) | 2026-10-11 22:47 | 2026-10-11 22:49 | `0b34257` |
| **SUB-01.1** | Inicialização do package.json, Vite, React e TypeScript | DashboardAI (Grok Bot) | 2026-10-11 22:56 | 2026-10-11 22:57 | `374dc99` |
| **SUB-01.2** | Configuração do Tailwind CSS, PostCSS e Estilos Globais | DashboardAI (Grok Bot) | 2026-10-11 22:57 | 2026-10-11 22:58 | `97697e3` |
| **SUB-01.3** | Instalação de Lucide Icons e Utilitários Base | DashboardAI (Grok Bot) | 2026-10-11 22:58 | 2026-10-11 22:59 | `25b9664` |
| **SUB-32** | Trocar cliente fetch por `@supabase/supabase-js` em `api/_lib` | DashboardAI (Grok Bot) | 2026-10-11 22:59 | 2026-10-11 23:00 | `f7c52c6` |
| **SUB-02** | Estrutura Modular de Diretórios do Frontend | DashboardAI (Grok Bot) | 2026-10-11 23:01 | 2026-10-11 23:01 | `4b999f7` |
| **SUB-03** | Configuração do Cliente Supabase e Tipagem TypeScript | DashboardAI (Grok Bot) | 2026-10-11 23:02 | 2026-10-11 23:04 | `14992e4` |
| **SUB-12** | Layout Principal Responsivo (Sidebar + Header + Navegação) | DashboardAI (Grok Bot) | 2026-10-11 23:04 | 2026-10-11 23:06 | `69fa615` |
| **SUB-09** | Serviço de Tarefas (`src/services/taskService.ts`) | DashboardAI (Grok Bot) | 2026-10-11 23:06 | 2026-10-11 23:07 | `8b6829c` |
| **SUB-10** | Serviço de Memória Semântica (`src/services/memoryService.ts`) | DashboardAI (Grok Bot) | 2026-10-11 23:07 | 2026-10-11 23:08 | `086689f` |
| **SUB-11** | Serviço de Logs do Agendador (`src/services/logService.ts`) | DashboardAI (Grok Bot) | 2026-10-11 23:08 | 2026-10-11 23:09 | `c8879bb` |
| **SUB-14** | Tabela Avançada da Fila de Tasks | DashboardAI (Grok Bot) | 2026-10-11 23:11 | 2026-10-11 23:13 | `830979e` |
| **SUB-16** | Modal de Cadastro e Edição de Task | DashboardAI (Grok Bot) | 2026-10-11 23:13 | 2026-10-11 23:16 | `b8486f1` |
| **SUB-13** | Painel de Indicadores Gerais (KPI Cards) | DashboardAI (Grok Bot) | 2026-10-11 23:17 | 2026-10-11 23:19 | `4af10c9` |
| **SUB-18** | Controles de Ação Rápida na Linha da Tabela | DashboardAI (Grok Bot) | 2026-10-11 23:19 | 2026-10-11 23:21 | `1e8c3a7` |
| **SUB-17** | Modal de Visualização Detalhada da Task | DashboardAI (Grok Bot) | 2026-10-11 23:21 | 2026-10-11 23:23 | `231b665` |
| **SUB-15** | Barra de Ferramentas e Filtros em Tempo Real | DashboardAI (Grok Bot) | 2026-10-11 23:24 | 2026-10-11 23:26 | `1f94252` |
| **SUB-22** | Visualizador de Logs de Execução da IA | DashboardAI (Grok Bot) | 2026-10-11 23:26 | 2026-10-11 23:27 | `a88f12d` |
| **SUB-08.1** | Esqueleto do `.env.example` | DashboardAI (Grok Bot) | 2026-10-12 00:19 | 2026-10-12 00:19 | `5db1d43` |
| **SUB-33.13** | Classe `HttpError` em `api/_lib/http-error.ts` | DashboardAI (Grok Bot) | 2026-10-12 00:19 | 2026-10-12 00:20 | `4f98dc3` |
| **SUB-33.1** | `bearerToken(req)` em `api/_lib/auth.ts` | DashboardAI (Grok Bot) | 2026-10-12 00:20 | 2026-10-12 00:20 | `78a4689` |
| **SUB-33.4** | Esqueleto do handler `api/embedding.ts` (CORS, OPTIONS, 405) | DashboardAI (Grok Bot) | 2026-10-12 00:21 | 2026-10-12 00:21 | `8660199` |
| **SUB-21.1** | `memoriaComoMarkdown` em `src/lib/memorias.ts` | DashboardAI (Grok Bot) | 2026-10-12 00:22 | 2026-10-12 00:22 | `7b2ef64` |
| **SUB-33.2** | `verificarSessaoSupabase(token)` em `api/_lib/auth.ts` | DashboardAI (Grok Bot) | 2026-10-12 00:23 | 2026-10-12 00:23 | `b7d1188` |
| **SUB-33.3** | `lerTextoEmbedding(body)` em `api/_lib/embedding-input.ts` | DashboardAI (Grok Bot) | 2026-10-12 00:24 | 2026-10-12 00:24 | `593fad1` |
| **SUB-33.10** | Autenticação no handler `api/embedding.ts` (401) | DashboardAI (Grok Bot) | 2026-10-12 00:25 | 2026-10-12 00:25 | `e060ae6` |
| **SUB-33.11** | Corpo, geração do embedding e erros no handler (400/413/502/200) | DashboardAI (Grok Bot) | 2026-10-12 00:26 | 2026-10-12 00:26 | `0dca17d` |
| **SUB-21.13** | `escopoMemoria` em `src/lib/memorias.ts` | DashboardAI (Grok Bot) | 2026-10-12 00:26 | 2026-10-12 00:27 | `de3cc15` |
| **SUB-33.6** | Testes do handler: OPTIONS, 405 e 401 | DashboardAI (Grok Bot) | 2026-10-12 00:27 | 2026-10-12 00:28 | `4ba6702` |
| **SUB-33.12** | Testes do handler: 413, 502 e 200 | DashboardAI (Grok Bot) | 2026-10-12 00:28 | 2026-10-12 00:29 | `bf48093` |
| **SUB-33.7** | `criarGeradorEmbedding()` em `src/services/embeddingService.ts` | DashboardAI (Grok Bot) | 2026-10-12 00:29 | 2026-10-12 00:30 | `64aa288` |
| **SUB-08.3** | Seção Servidor Supabase: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `SUPABASE_REST_URL` | DashboardAI (Grok Bot) | 2026-10-12 00:30 | 2026-10-12 00:30 | `35aff13` |
| **SUB-33.5** | Registrar `api/embedding.ts` no `vercel.json` | Codex (OpenAI) | 2026-10-12 00:35 | 2026-10-12 00:41 | `1d68ea6` |
| **SUB-19.10** | `classeSimilaridade` em `src/lib/similaridade.ts` | DashboardAI-Clone 10 (Grok Bot) | 2026-10-12 00:51 | 2026-10-12 00:52 | `4f6700d` |
| **SUB-19.4** | Componente `SimilaridadeBadge` em `src/components/memoria/` | DashboardAI-Clone 10 (Grok Bot) | 2026-10-12 00:52 | 2026-10-12 00:53 | `ef9ec9b` |
| **SUB-19.5** | Componente `ResultadoBuscaCard` em `src/components/memoria/` | DashboardAI-Clone 10 (Grok Bot) | 2026-10-12 00:54 | 2026-10-12 00:54 | `c92d3f9` |
| **SUB-23.11** | `PendentesResumo` em `src/components/tasks/PendentesResumo.tsx` | DashboardAI-Clone 10 (Grok Bot) | 2026-10-12 00:55 | 2026-10-12 00:56 | `5bce2d7` |
| **SUB-21.4** | Componente `MemoriaCard` em `src/components/memoria/MemoriaCard.tsx` | DashboardAI-Clone 10 (Grok Bot) | 2026-10-12 00:56 | 2026-10-12 00:57 | `c03ffa6` |

n|| **SUB-20.8** | `MarkdownEditor` em `src/components/ui/MarkdownEditor.tsx` | Claude Code | 2026-10-12 00:50 | 2026-10-12 00:51 | `fc4c3ee` |
|| **SUB-20.1** | `validarMemoria(dados)` em `src/lib/memoriaForm.ts` | DashboardAI-Clone 06 | 2026-10-12 00:46 | 2026-10-12 00:47 | `5662f1a` |
|| **SUB-19.3** | `formatarSimilaridade` em `src/lib/similaridade.ts` | Claude Code | 2026-10-12 00:45 | 2026-10-12 00:45 | `21d035c` |
|| **SUB-19.1** | `debounce(fn, ms)` em `src/lib/debounce.ts` | Claude Code | 2026-10-12 00:44 | 2026-10-12 00:44 | `b07cfb8` |
|| **SUB-20.8** | `MarkdownEditor` em `src/components/ui/MarkdownEditor.tsx` | Claude Code | 2026-10-12 00:50 | 2026-10-12 00:51 | `595a1bb` |
|| **SUB-19.9** | `BuscaControles` (limiar, globais, modo) em `src/components/memoria/BuscaControles.tsx` | Claude Code | 2026-10-12 00:46 | 2026-10-12 00:47 | `2bac1b6` |
|| **SUB-34.1** | Fallback `CarregandoTela` em `src/components/ui/CarregandoTela.tsx` | Claude Code | 2026-10-12 00:37 | 2026-10-12 00:38 | `0d7cbd9` |
|| **SUB-34.2** | Telas com `React.lazy` em `src/views/index.ts` | Claude Code | 2026-10-12 00:39 | 2026-10-12 00:40 | `662348b` |
|| **SUB-34.4** | Separar dependências grandes no `vite.config.ts` | Claude Code | 2026-10-12 00:41 | 2026-10-12 00:42 | `6abd3f4` |
| **SUB-23.2** | `classificarPendentes(tasks)` em `src/lib/saudeFila.ts` | DashboardAI-Clone 02 | 2026-10-12 00:52 | 2026-10-12 00:53 | `84011c8` |
| **SUB-23.3** | `diagnosticarFila(tasks)` em `src/lib/saudeFila.ts` | DashboardAI-Clone 02 | 2026-10-12 00:53 | 2026-10-12 00:54 | `40fa920` |
| **SUB-23.6** | Hook `useSaudeFila` em `src/hooks/useSaudeFila.ts` | DashboardAI-Clone 02 | 2026-10-12 00:54 | 2026-10-12 00:57 | `40bb5e0` |
---

### ⛔ CANCELADAS (0)
*(Nenhuma cancelada)*
| **SUB-33.8** | Testes de `embeddingService` em `tests/unit/embeddingService.test.ts` | DashboardAI (Grok Bot) | 2026-10-12 00:32 | 2026-10-12 00:32 | `c0b75b6` |
| **SUB-08.2** | Seção Frontend: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` | DashboardAI (Grok Bot) | 2026-10-12 00:33 | 2026-10-12 00:33 | `cf3d955` |
| **SUB-08.4** | Seção Embeddings: `OPENAI_API_KEY`, `EMBEDDING_API_URL`, `EMBEDDING_MODEL` | DashboardAI (Grok Bot) | 2026-10-12 00:34 | 2026-10-12 00:34 | `ac47ab6` |
| **SUB-08.5** | Seção MCP: `MCP_AUTH_TOKEN`, `MCP_CORS_ORIGIN`, `MCP_DEFAULT_PROJECT`, `MCP_ALLOWED_PROJECTS` | DashboardAI (Grok Bot) | 2026-10-12 00:34 | 2026-10-12 00:35 | `212cc43` |
| **SUB-08.6** | Seção Scripts: `DASHBOARD_AI_PROJECT` | DashboardAI (Grok Bot) | 2026-10-12 00:35 | 2026-10-12 00:35 | `86e701c` |

---

## 📜 HISTÓRICO DE COMMITS E ENTREGAS DOS AGENTES

| Data/Hora | Agente | Sub-task | Commit SHA | Anotação / O que foi feito |
|---|---|---|---|---|
| 2026-10-11 22:08 | Antigravity AI | Setup Inicial | `c225b9f` | Inicialização do task-principal.md, quadro de locks e protocolo em AGENTS.md |
| 2026-10-11 22:10 | Antigravity AI | Protocolo Push | `1aed730` | Obrigatoriedade de git push origin main em AGENTS.md |
| 2026-10-11 22:12 | Antigravity AI | Protocolo 2 Partes | `58c8af1` | Formalização de leitura (Pt 1) e lock com commit+push (Pt 2) |
| 2026-10-11 22:13 | Antigravity AI | Lock SUB-01 | `fb34a6b` | Ativação de lock para início da primeira sub-task |
| 2026-10-11 22:20 | DashboardAI (Grok Bot) | SUB-04 | `f7d6e04` | Criados database/01_tasks_schema.sql, 02_logs_schema.sql, 03_memories_schema.sql e database/README.md (idempotentes, validados 2x em Postgres 17 + pgvector). Corrigido `order in by` -> `order by` em AGENTS.md |
| 2026-10-11 22:21 | DashboardAI (Grok Bot) | SUB-05 | `ceb04a9` | Criado database/04_rpc_functions.sql: pegar_proxima_task (lock 90 min, atômica), finalizar_task, liberar_trava_task, match_memories (order by corrigido, filtro de tags) e eh_professor_administrador (+ tabela professores_administradores). Validado em Postgres 17 + pgvector, incl. concorrência |
| 2026-10-11 22:23 | DashboardAI (Grok Bot) | SUB-24 | `7132c1b` | Criado scripts/sincronizar_tasks.py (stdlib, REST do Supabase) com consulta/exportar/importar/conferir + testes unitários e tasks/fila/README.md. Validado ponta a ponta contra PostgREST + Postgres 17 local |
| 2026-10-11 22:24 | DashboardAI (Grok Bot) | SUB-06 | `ce840a4` | Criados api/mcp.ts (roteador JSON-RPC 2.0/MCP: POST-only, CORS, token opcional, initialize/ping/tools/list/tools/call por params.name, lotes, notificações 202), api/_lib/{jsonrpc,tools,http}.ts, api/tsconfig.json, api/README.md e vercel.json. tsc estrito OK + 18 cenários de runtime testados |
| 2026-10-11 22:43 | DashboardAI (Grok Bot) | SUB-29 | `30fe077` | Banco multi-projeto: projects, user_roles/project_members, eh_administrador/tem_acesso_projeto (removido professores_administradores), project_id + código por projeto, tipo ia/humano, guarda da interface, validação de dependências, logs genéricos, memórias por projeto/globais, pegar_proxima_task paralela com p_projeto, RPCs security definer só para service_role, RLS em tudo; --projeto no sincronizar_tasks.py. Testes: 00-05 aplicados 2x, upgrade da versão anterior, 72 verificações RLS/fila, 12 agentes paralelos sem duplicidade, PostgREST e2e |
| 2026-10-11 22:45 | DashboardAI (Grok Bot) | SUB-30 | `5d7c995` | task_next/finish/list/create via RPCs com service_role; exige MCP_AUTH_TOKEN; MCP_ALLOWED_PROJECTS |
| 2026-10-11 22:47 | DashboardAI (Grok Bot) | SUB-07 | `746bd8d` | brain_store/search/delete por projeto + memória global; embeddings OpenAI-compatível 1536d |
| 2026-10-11 22:49 | DashboardAI (Grok Bot) | SUB-31 | `0b34257` | agent_messages + ler_recados; project_rules com md5 + conferir_regras; RLS por projeto |
| 2026-10-11 22:56 | DashboardAI (Grok Bot) | Liberação SUB-01.1 | — | Trava de Gemini (Antigravity) em SUB-01.1/SUB-01 liberada por decisão do usuário (parada desde 2026-10-11 22:13, sem pushes); SUB-01.1 assumida por DashboardAI (Grok Bot) |
| 2026-10-11 22:57 | DashboardAI (Grok Bot) | SUB-01.1 | `374dc99` | package.json, Vite 8 + React 19 + TS 5.9 (tsconfig app/node com referências), index.html, src/main.tsx e App.tsx; typecheck de api/ preservado; build OK |
| 2026-10-11 22:58 | DashboardAI (Grok Bot) | SUB-01.2 | `97697e3` | Tailwind v4 via @tailwindcss/postcss, tailwind.config.js (@config), src/index.css com @theme, dark por classe e estilos base |
| 2026-10-11 22:59 | DashboardAI (Grok Bot) | SUB-01.3 | `25b9664` | lucide-react, clsx, tailwind-merge + src/lib/utils.ts (cn); casca usa ícones |
| 2026-10-11 22:59 | DashboardAI (Grok Bot) | SUB-01 | `25b9664` | SUB-01 concluída: subtarefas SUB-01.1 (`374dc99`), SUB-01.2 (`97697e3`) e SUB-01.3 (`25b9664`) entregues; build e typecheck OK |
| 2026-10-11 23:00 | DashboardAI (Grok Bot) | SUB-32 | `f7c52c6` | api/_lib com @supabase/supabase-js (createClient service_role, sem sessão); Node 22+; 27+36 cenários MCP OK |
| 2026-10-11 23:01 | DashboardAI (Grok Bot) | SUB-02 | `4b999f7` | src/components, services, hooks, types, views, styles com index.ts e regras; alias @/; CSS movido para src/styles |
| 2026-10-11 23:04 | DashboardAI (Grok Bot) | SUB-03 | `14992e4` | src/services/supabase.ts (anon + RLS, ServiceError, verificarConexao) e src/types/database.ts (Database multi-projeto); Vitest + integração PostgREST |
| 2026-10-11 23:06 | DashboardAI (Grok Bot) | SUB-12 | `69fa615` | Layout responsivo: sidebar/gaveta, header com seletor de projeto (contexto global), status da conexão, tema claro/escuro/sistema; navegação por hash |
| 2026-10-11 23:07 | DashboardAI (Grok Bot) | SUB-09 | `8b6829c` | taskService: listar/criar/atualizar/alternarExecucao/cancelar/reabrir/excluirLogico (+obter, concluir humana, restaurar, contar por status), sempre por project_id |
| 2026-10-11 23:08 | DashboardAI (Grok Bot) | SUB-10 | `086689f` | memoryService: listarMemorias, buscarMemoriasSimilares (match_memories), buscarMemorias (semântica com gerador ou textual), salvarMemoria (upsert), excluirMemoria |
| 2026-10-11 23:09 | DashboardAI (Grok Bot) | SUB-11 | `c8879bb` | logService: listarLogs (data_hora desc, filtros, paginação com total), contarLogsPorStatus, ultimaExecucao, opcoesDeFiltro |
| 2026-10-11 23:13 | DashboardAI (Grok Bot) | SUB-14 | `830979e` | Tabela da fila escopada pelo projeto selecionado: Código, Título, Prioridade (badges 1-5), Ordem, Dependências (chips coloridos pela situação), ON/OFF, Status (spinner em execução com agente da trava), Tentativas (barra), Resultado (PR/commit/resumo) e coluna Ações (render prop para SUB-18); tooltips acessíveis em portal; barra de progresso da fila; cartões no celular; esqueleto de carregamento. Validado: typecheck, build, vitest (unit+integração) e screenshots 1280x800/390x844. |
| 2026-10-11 23:16 | DashboardAI (Grok Bot) | SUB-16 | `b8486f1` | Modal acessível (Esc, foco preso, tela cheia no celular) para criar/editar tasks do projeto selecionado: Título, Instrução (textarea Markdown com contador), Prioridade 1-5 (seletor colorido), Ordem, Executar após (datetime-local convertido para ISO), Máximo de tentativas, Depende de, Executor IA/Humano e ON/OFF. Validação por campo (lib/taskForm puro + testes), erros do banco/RLS exibidos no modal e em toast; botão Nova task e ação Editar na tabela. Validado: typecheck, build, vitest (unit+integração), criação real via PostgREST e screenshots 1280x800/390x844. |
| 2026-10-11 23:19 | DashboardAI (Grok Bot) | SUB-13 | `4af10c9` | Seis cards no topo da Fila escopados pelo projeto: Total de tasks (% concluídas), Pendentes, Em execução (ícone girando quando há agente), Concluídas (com erro/recusadas), Memórias (projeto + globais, novo contarMemorias com count head) e Última execução (tempo relativo, status e task; tooltip com data/rotina/agente). Números com contagem animada (respeita reduzir movimento), entrada escalonada, esqueletos de carregamento e falhas parciais isoladas (Promise.allSettled). Recarregam junto com a tabela após salvar task. Validado: typecheck, build, vitest (unit+integração, contarMemorias testado) e screenshots 1280x800/390x844. |
| 2026-10-11 23:21 | DashboardAI (Grok Bot) | SUB-18 | `1e8c3a7` | Switch ON/OFF na coluna da tabela com atualização otimista (reverte em erro); botões Reabrir (erro/recusada/cancelada, zera tentativas), Cancelar, Concluir (só tasks humanas pendentes), Editar e Excluir (confirmação em diálogo; exclusão lógica com Desfazer no aviso). Ações exibidas conforme acoesDisponiveis(), que espelha a trigger do banco (task em execução fica bloqueada). Indicadores recarregam após cada ação. Validado: typecheck, build, vitest (unit+integração), persistência conferida no banco local e screenshots 1280x800/390x844. |
| 2026-10-11 23:23 | DashboardAI (Grok Bot) | SUB-17 | `231b665` | Clique na linha (ou no código, acessível por teclado) abre a visualização completa: instrução formatada (abas Formatado/Texto), relatório da IA destacado por status, link do PR, SHA do commit, tentativas, dependências, datas, origem e arquivo; aviso de trava quando em execução. Botões de copiar (instrução, relatório, PR, SHA) e Copiar tudo em Markdown. Renderizador Markdown próprio sem HTML cru (sem XSS; só links http/https/mailto), testado. Validado: typecheck, build, vitest (unit+integração) e screenshots 1280x800/390x844. |
| 2026-10-11 23:26 | DashboardAI (Grok Bot) | SUB-15 | `1f94252` | Busca instantânea no cliente (código, título e instrução; sem acento/maiúsculas), filtro por status com contagem, contador filtradas/total, botão Recarregar (tabela + indicadores, com hora da última atualização) e mensagem de vazio por filtro. Dependências seguem resolvidas pela lista completa. Validado: typecheck, build, vitest (unit+integração) e screenshot. |
| 2026-10-11 23:27 | DashboardAI (Grok Bot) | SUB-22 | `a88f12d` | Tela Logs com linha do tempo agrupada por dia (mais recente primeiro): hora, badge de status (concluida/recusada/erro/sem_tarefa), rotina, task, agente, tempo de execução, link de PR e SHA; detalhes/erro expansíveis. Filtro por status com contadores, busca em detalhes/erro/task, recarregar e Carregar mais (paginação do logService). Validado: typecheck, build, vitest (unit+integração) e screenshot. |
| 2026-10-11 23:36 | DashboardAI (Grok Bot) | Lock planejamento | — | Trava de planejamento em SUB-23, SUB-19, SUB-20, SUB-34, SUB-25, SUB-26 e SUB-28 para subdividir em subtarefas de ~3 min (pedido do usuário); SUB-33 segue travada por DashboardAI (Grok Bot) |
| 2026-10-11 23:38 | DashboardAI (Grok Bot) | Subdivisão | (este commit) | Tarefas livres subdivididas em 69 subtarefas atômicas (~3 min): SUB-19.1–19.8, SUB-20.1–20.7, SUB-23.1–23.9, SUB-25.1–25.4, SUB-26.1–26.9, SUB-28.1–28.18, SUB-33.1–33.9 (reservadas sob a trava da SUB-33), SUB-34.1–34.5. Trava de planejamento liberada; 9 livres, 51 bloqueadas por dependência. Sem código implementado. SUB-08, SUB-21 e SUB-27 (outros agentes) não foram tocadas |
| 2026-10-11 23:41 | DashboardAI (Grok Bot) | Subdivisão SUB-27 | (este commit) | A pedido do usuário, SUB-27 subdividida em 18 subtarefas (SUB-27.1–27.18: lib/auth, authService, papéis, AuthProvider, LoginForm, LoginView, RotaProtegida, App, UserMenu, conexão/projeto, link de retorno, docs, validação), todas reservadas para Codex (OpenAI); trava e status em_execucao da SUB-27 mantidos. Nenhum código de SUB-27 existia na main. Dependentes atualizados: SUB-26.8 -> SUB-27.13/27.17, SUB-28.16 -> +SUB-27.9, SUB-25.2 cita SUB-27.18. Lista de livres inclui SUB-21 (liberada pelo usuário em 9fedf35) |
| 2026-10-11 23:45 | DashboardAI (Grok Bot) | Lock planejamento SUB-21 | — | Trava de planejamento na SUB-21 (livre desde 9fedf35) para subdividir em subtarefas de ~3 min, a pedido do usuário |
| 2026-10-11 23:47 | DashboardAI (Grok Bot) | Subdivisão SUB-21 + liberação SUB-33 | (este commit) | A pedido do usuário: SUB-21 subdividida em 10 subtarefas (SUB-21.1–21.10; a 21.9 cria a `MemoriaView`, e SUB-19.8/20.7 agora dependem dela); trava de planejamento da SUB-21 liberada. Trava da SUB-33 (DashboardAI (Grok Bot), desde 23:34) liberada sem código; SUB-33.4 e 33.6 refinadas (novas 33.10, 33.11, 33.12), total 12, filhas livres conforme dependências. Livres: 14; reservadas (SUB-27, Codex): 18; bloqueadas: 68 |
| 2026-10-11 23:50 | DashboardAI (Grok Bot) | Lock refino | — | Trava de planejamento em SUB-19, 20, 21, 23, 25, 26 e 28 (e subtarefas) para refinar as subtarefas grandes, a pedido do usuário; SUB-27 (Codex) e SUB-08 (xAI) não travadas por mim |
| 2026-10-11 23:51 | DashboardAI (Grok Bot) | Refino de subdivisão | (este commit) | A pedido do usuário, 21 subtarefas grandes refinadas (19.7, 20.6, 21.9, 21.10, 23.5, 23.7, 25.2, 25.3, 25.4, 26.6, 27.10, 27.15, 27.17, 27.18, 28.5, 28.7, 28.10, 28.15, 28.16, 28.17, 28.18) gerando 21 novas: 19.9, 20.8, 21.11, 21.12, 23.10–23.12, 25.6, 25.7, 26.10, 27.19–27.22 (reservadas para Codex), 28.19–28.25; dependências religadas (26.8 -> 27.17/27.21, 26.9 -> +26.10, 25.2 cita 27.22, 28.6/28.8/28.9 -> 28.19). Falhas da SUB-25.2 viram SUB-25.8+. Travas de refino liberadas; SUB-27 (Codex) e SUB-08 (xAI) intactas. Total 121; livres 16; reservadas 22; bloqueadas 83 |
| 2026-10-11 23:55 | Codex (OpenAI) | Liberação SUB-27 | — | Por solicitação do usuário, trava liberada, mãe retornada a pendente e as 22 subtarefas disponibilizadas conforme suas dependências; sem implementação. |
| 2026-10-12 00:07 | DashboardAI (Grok Bot) | Liberação SUB-08 (xAI) | — | Trava de xAI (Grok) na SUB-08 (desde 2026-10-11 22:41, sem nenhum commit e sem `.env.example`) liberada por decisão do usuário |
| 2026-10-12 00:07 | DashboardAI (Grok Bot) | Lock planejamento SUB-08 | — | SUB-08 travada por DashboardAI (Grok Bot) para subdividir em subtarefas de ~3 min, a pedido do usuário |
| 2026-10-12 00:08 | DashboardAI (Grok Bot) | Subdivisão SUB-08 | (este commit) | SUB-08 subdividida em 9 subtarefas (08.1 esqueleto do `.env.example`; 08.2 frontend; 08.3 servidor Supabase; 08.4 embeddings; 08.5 MCP; 08.6 scripts; 08.7 `.gitignore`; 08.8 extração em `scripts/checar-env.mjs` + testes; 08.9 `npm run check:env`). SUB-25.2, 26.3 e 26.5 passam a depender de SUB-08.9. Trava de planejamento liberada. Corrigido no quadro o texto trocado no commit 687f149 ("SUB-26.1" virou "SUB-26.1, SUB-27.1" e "SUB-26.10" virou "SUB-26.1, SUB-27.10"). Total 130; livres 19; reservadas 0; bloqueadas 111 |
| 2026-10-12 00:16 | DashboardAI (Grok Bot) | Lock revisão | — | Trava de planejamento (exceção da seção 1.1 do AGENTS.md: subdivisão pedida pelo usuário) em SUB-08, 19, 20, 21, 23, 27, 28, 33 e 34 para subdividir subtarefas ainda grandes |
| 2026-10-12 00:17 | DashboardAI (Grok Bot) | Nova revisão da subdivisão | (este commit) | Revisão rigorosa (~3 min = 1 função/componente/arquivo de teste/seção): 22 subtarefas divididas gerando 23 novas — 08.8->08.10, 08.9->08.11, 19.3->19.10, 20.3->20.10, 20.4->20.9, 21.1->21.13, 21.2->21.14, 23.1->23.13, 27.4->27.23, 27.5->27.24, 27.7->27.25, 27.9->27.26, 27.14->27.27, 27.22->27.28, 33.3->33.13, 34.2->34.6, 28.1->28.26/28.27, 28.2->28.28, 28.3->28.29, 28.4->28.30, 28.20->28.31, 28.23->28.32; 27.16 reduzida (só `urlDeRetorno`, depende de 27.1). Dependentes religados para a última parte (ex.: 27.12/14/15/20 e 28.16 -> 27.26; 27.18 -> 27.27; 25.2 cita 27.28; 28.5/6/20/21 -> 28.29; 34.5 -> 34.6). Travas de planejamento liberadas. Total 153; livres 22; reservadas 0; bloqueadas 131 |
| 2026-10-12 00:19 | DashboardAI (Grok Bot) | SUB-08.1 | — | Lock: assumindo SUB-08.1 (Esqueleto do `.env.example`) |
| 2026-10-12 00:19 | DashboardAI (Grok Bot) | SUB-08.1 | `5db1d43` | Criado `.env.example` na raiz: cabeçalho (copiar para `.env`/`.env.local`, nunca commitar valores reais, `VITE_*` vão para o navegador e segredos só no servidor) e seções vazias Frontend, Servidor Supabase, Embeddings, MCP e Scripts. `git check-ignore .env.example` não o ignora (`.env` e `.env.local` seguem ignorados); nenhum valor real. |
| 2026-10-12 00:19 | DashboardAI (Grok Bot) | SUB-33.13 | — | Lock: assumindo SUB-33.13 (Classe `HttpError` em `api/_lib/http-error.ts`) |
| 2026-10-12 00:20 | DashboardAI (Grok Bot) | SUB-33.13 | `4f98dc3` | Criado `api/_lib/http-error.ts` com `HttpError extends Error` (construtor `(status, mensagem)`, `status` somente leitura, `name = 'HttpError'`), para a `lerTextoEmbedding` (SUB-33.3) e o handler `/api/embedding`. Teste `tests/unit/api-http-error.test.ts`; `npm run typecheck` (app + api) e `npm test` verdes. |
| 2026-10-12 00:20 | DashboardAI (Grok Bot) | SUB-33.1 | — | Lock: assumindo SUB-33.1 (`bearerToken(req)` em `api/_lib/auth.ts`) |
| 2026-10-12 00:20 | DashboardAI (Grok Bot) | SUB-33.1 | `78a4689` | Criado `api/_lib/auth.ts` com `bearerToken(headers)`: lê `authorization` (string ou array, usa o primeiro), aceita só o esquema `Bearer` sem diferenciar maiúsculas e devolve o token sem espaços; `null` se ausente/malformado. Testes em `tests/unit/api-auth.test.ts` (ausente, `Basic`, `Bearer` vazio, array, ok). `npm run typecheck` (app + api) e `npm test` verdes. |
| 2026-10-12 00:21 | DashboardAI (Grok Bot) | SUB-33.4 | — | Lock: assumindo SUB-33.4 (Esqueleto do handler `api/embedding.ts` (CORS, OPTIONS, 405)) |
| 2026-10-12 00:21 | DashboardAI (Grok Bot) | SUB-33.4 | `8660199` | Criado `api/embedding.ts` (default export `handler(req: McpRequest, res: McpResponse)`): CORS como o `api/mcp.ts` (`MCP_CORS_ORIGIN`, métodos `POST, OPTIONS`, cabeçalhos `Content-Type, Authorization`), `OPTIONS` -> 204, não-POST -> 405 com `Allow: POST, OPTIONS` e `{ erro }`; POST -> 501 provisório (substituído na SUB-33.11). `npm run typecheck` (app + api) e `npm test` verdes. |
| 2026-10-12 00:22 | DashboardAI (Grok Bot) | SUB-21.1 | — | Lock: assumindo SUB-21.1 (`memoriaComoMarkdown` em `src/lib/memorias.ts`) |
| 2026-10-12 00:22 | DashboardAI (Grok Bot) | SUB-21.1 | `7b2ef64` | Criado `src/lib/memorias.ts` com `memoriaComoMarkdown(m)`: `# título`, linha `**Tags:**` (omitida se vazia), `**Escopo:** global|projeto` (`project_id` nulo = global) e o conteúdo. Testes em `tests/unit/memorias.test.ts`. `npm run typecheck` (app + api) e `npm test` verdes. |
| 2026-10-12 00:23 | DashboardAI (Grok Bot) | SUB-33.2 | — | Lock: assumindo SUB-33.2 (`verificarSessaoSupabase(token)` em `api/_lib/auth.ts`) |
| 2026-10-12 00:23 | DashboardAI (Grok Bot) | SUB-33.2 | `b7d1188` | Adicionados `AuthError` e `verificarSessaoSupabase(token, env)` em `api/_lib/auth.ts`: `GET ${SUPABASE_URL}/auth/v1/user` com `Authorization: Bearer` e `apikey` (`SUPABASE_ANON_KEY` ou `SUPABASE_SERVICE_ROLE_KEY`), timeout 10 s; 200 com `id` -> `{ userId }`, 401/403 -> `null`, demais casos (config ausente, rede, timeout, HTTP != 2xx, corpo sem id) -> `AuthError` sem chave/token na mensagem. Testes 200/401/403/500/timeout/sem config em `tests/unit/api-auth.test.ts`. typecheck (app + api) e `npm test` verdes. |
| 2026-10-12 00:24 | DashboardAI (Grok Bot) | SUB-33.3 | — | Lock: assumindo SUB-33.3 (`lerTextoEmbedding(body)` em `api/_lib/embedding-input.ts`) |
| 2026-10-12 00:24 | DashboardAI (Grok Bot) | SUB-33.3 | `593fad1` | Criado `api/_lib/embedding-input.ts` com `MAX_TEXTO_EMBEDDING = 8000` e `lerTextoEmbedding(body)`: aceita objeto, string JSON ou Buffer; `HttpError` 400 para corpo vazio, JSON inválido, corpo não objeto ou `texto` ausente/não string/vazio; 413 acima de 8.000 caracteres. Testes em `tests/unit/api-embedding-input.test.ts` (vazio, JSON inválido, sem texto, longo demais, ok). typecheck (app + api) e `npm test` verdes. |
| 2026-10-12 00:25 | DashboardAI (Grok Bot) | SUB-33.10 | — | Lock: assumindo SUB-33.10 (Autenticação no handler `api/embedding.ts` (401)) |
| 2026-10-12 00:25 | DashboardAI (Grok Bot) | SUB-33.10 | `e060ae6` | No POST de `api/embedding.ts`: `bearerToken` + `verificarSessaoSupabase`; token ausente ou sessão recusada -> 401 com `WWW-Authenticate: Bearer`; `AuthError` (Auth indisponível/config ausente) -> 503 com mensagem segura; sessão válida segue para o 501 provisório (SUB-33.11). typecheck (app + api) e `npm test` verdes; smoke local (não commitado) conferiu 401/401/503/501/405. |
| 2026-10-12 00:26 | DashboardAI (Grok Bot) | SUB-33.11 | — | Lock: assumindo SUB-33.11 (Corpo, geração do embedding e erros no handler (400/413/502/200)) |
| 2026-10-12 00:26 | DashboardAI (Grok Bot) | SUB-33.11 | `0dca17d` | No `api/embedding.ts`, após a autenticação: `lerTextoEmbedding(req.body)` (`HttpError` -> status dela, 400/413), `generateEmbedding` -> 200 `{ embedding, dimensoes: 1536, modelo }`; `EmbeddingError` -> 502 com mensagem genérica (a mensagem do provedor pode ecoar parte da chave, então não é devolvida). 501 provisório removido. typecheck (app + api) e `npm test` verdes; smoke local (não commitado) conferiu 200/400/413/502 sem `sk-` no corpo. |
| 2026-10-12 00:26 | DashboardAI (Grok Bot) | SUB-21.13 | — | Lock: assumindo SUB-21.13 (`escopoMemoria` em `src/lib/memorias.ts`) |
| 2026-10-12 00:27 | DashboardAI (Grok Bot) | SUB-21.13 | `de3cc15` | Adicionado `escopoMemoria(m): 'global' | 'projeto'` em `src/lib/memorias.ts` (`project_id` nulo/indefinido = global; 0 conta como projeto) e reutilizado em `memoriaComoMarkdown`. Testes em `tests/unit/memorias.test.ts`. typecheck (app + api) e `npm test` verdes. |
| 2026-10-12 00:27 | DashboardAI (Grok Bot) | SUB-33.6 | — | Lock: assumindo SUB-33.6 (Testes do handler: OPTIONS, 405 e 401) |
| 2026-10-12 00:28 | DashboardAI (Grok Bot) | SUB-33.6 | `4ba6702` | Criado `tests/unit/api-embedding.test.ts` com `req`/`res` falsos, `fetch` simulado e env de teste restaurado após cada caso: OPTIONS -> 204 com CORS; GET -> 405 com `Allow: POST, OPTIONS`; POST sem token -> 401 com `WWW-Authenticate` sem chamar o Auth; JWT recusado pelo Auth -> 401. typecheck (app + api) e `npm test` verdes (53 passed). |
| 2026-10-12 00:28 | DashboardAI (Grok Bot) | SUB-33.12 | — | Lock: assumindo SUB-33.12 (Testes do handler: 413, 502 e 200) |
| 2026-10-12 00:29 | DashboardAI (Grok Bot) | SUB-33.12 | `bf48093` | Em `tests/unit/api-embedding.test.ts`, bloco "POST autenticado" com Auth e API de embeddings simulados: 413 com 8.001 caracteres, 400 sem `texto`, 502 quando a API de embeddings recusa (corpo sem `sk-` e sem a chave anon) e 200 com vetor de 1536 (`dimensoes`, `modelo`, 2 chamadas a `fetch`). typecheck (app + api) e `npm test` verdes (57 passed). |
| 2026-10-12 00:29 | DashboardAI (Grok Bot) | SUB-33.7 | — | Lock: assumindo SUB-33.7 (`criarGeradorEmbedding()` em `src/services/embeddingService.ts`) |
| 2026-10-12 00:30 | DashboardAI (Grok Bot) | SUB-33.7 | `64aa288` | Criado `src/services/embeddingService.ts` com `criarGeradorEmbedding({ url?, client? }): GeradorEmbedding`: pega o `access_token` de `client.auth.getSession()` (sem sessão -> `ServiceError('Faça login para usar a busca semântica.')`), faz `POST /api/embedding` com `{ texto }` e `Authorization: Bearer`; 401 -> mesma mensagem de login, falha de rede/HTTP -> `ServiceError` (usa `erro` do servidor), valida 1536 números finitos. Exportado em `src/services/index.ts`. Nenhuma chave de embeddings no frontend. typecheck, `npm test` e `npm run build` OK. |
| 2026-10-12 00:30 | DashboardAI (Grok Bot) | SUB-08.3 | — | Lock: assumindo SUB-08.3 (Seção Servidor Supabase: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `SUPABASE_REST_URL`) |
| 2026-10-12 00:30 | DashboardAI (Grok Bot) | SUB-08.3 | `35aff13` | Preenchida a seção Servidor Supabase do `.env.example` com `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (só servidor/scripts, nunca `VITE_`), `SUPABASE_ANON_KEY` (validação de sessão do `/api/embedding`, SUB-33.2) e `SUPABASE_REST_URL` (opcional, só testes locais com PostgREST), conforme `api/_lib/supabase.ts`, `api/_lib/auth.ts` e `scripts/sincronizar_tasks.py`. Valores vazios; arquivo segue fora do `.gitignore`. |
| 2026-10-12 00:32 | DashboardAI (Grok Bot) | SUB-33.8 | — | Lock: assumindo SUB-33.8 (Testes de `embeddingService` em `tests/unit/embeddingService.test.ts`) |
| 2026-10-12 00:32 | DashboardAI (Grok Bot) | SUB-33.8 | `c0b75b6` | Criado `tests/unit/embeddingService.test.ts` com `fetch` simulado e cliente falso (`auth.getSession`): sem sessão (pede login, não chama o servidor), 401 (pede login), 500 (`ServiceError` com a mensagem do servidor), vetor com tamanho errado (erro cita 1536) e sucesso (POST com `Authorization: Bearer` e `{ texto }`, devolve 1536 números). typecheck (app + api) e `npm test` verdes (62 passed). |
| 2026-10-12 00:33 | DashboardAI (Grok Bot) | SUB-08.2 | — | Lock: assumindo SUB-08.2 (Seção Frontend: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`) |
| 2026-10-12 00:33 | DashboardAI (Grok Bot) | SUB-08.2 | `cf3d955` | Preenchida a seção Frontend do `.env.example` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (valores vazios), avisando que são públicas (embutidas no bundle) e que só a chave anon é permitida (`getSupabase()` recusa service_role). São as únicas `VITE_*` usadas em `src/`. |
| 2026-10-12 00:34 | DashboardAI (Grok Bot) | SUB-08.4 | — | Lock: assumindo SUB-08.4 (Seção Embeddings: `OPENAI_API_KEY`, `EMBEDDING_API_URL`, `EMBEDDING_MODEL`) |
| 2026-10-12 00:34 | DashboardAI (Grok Bot) | SUB-08.4 | `ac47ab6` | Preenchida a seção Embeddings do `.env.example` com `OPENAI_API_KEY` (só servidor), `EMBEDDING_API_URL` (padrão `https://api.openai.com/v1/embeddings`, aceita API compatível) e `EMBEDDING_MODEL` (padrão `text-embedding-3-small`; vetor de 1536 dimensões), iguais aos padrões de `api/_lib/embeddings.ts`. Valores vazios. |
| 2026-10-12 00:34 | DashboardAI (Grok Bot) | SUB-08.5 | — | Lock: assumindo SUB-08.5 (Seção MCP: `MCP_AUTH_TOKEN`, `MCP_CORS_ORIGIN`, `MCP_DEFAULT_PROJECT`, `MCP_ALLOWED_PROJECTS`) |
| 2026-10-12 00:35 | DashboardAI (Grok Bot) | SUB-08.5 | `212cc43` | Preenchida a seção MCP do `.env.example` com `MCP_AUTH_TOKEN` (exigido no `/mcp`; sem ele as ferramentas de dados ficam desativadas; gerar com `openssl rand -hex 32`), `MCP_CORS_ORIGIN` (padrão `*`, restringir em produção; também usada pelo `/api/embedding`), `MCP_DEFAULT_PROJECT` e `MCP_ALLOWED_PROJECTS` (lista por vírgula; quando preenchida recusa memória global), conforme `api/mcp.ts`, `api/_lib/args.ts` e `api/_lib/brain-tools.ts`. Valores vazios. |
| 2026-10-12 00:35 | DashboardAI (Grok Bot) | SUB-08.6 | — | Lock: assumindo SUB-08.6 (Seção Scripts: `DASHBOARD_AI_PROJECT`) |
| 2026-10-12 00:35 | DashboardAI (Grok Bot) | SUB-08.6 | `86e701c` | Preenchida a seção Scripts do `.env.example` com `DASHBOARD_AI_PROJECT` (slug padrão do `scripts/sincronizar_tasks.py`, equivale a `--projeto`, padrão `default`), lembrando que o script lê o `.env` da raiz sem sobrescrever o ambiente e usa `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`. Nenhum valor real no arquivo. |
| 2026-10-12 00:39 | DashboardAI (Grok Bot) | Nova tarefa SUB-35 | (este commit) | A pedido do usuário, criada a SUB-35 (Monitor em Tempo Real dos Agentes, Fase 12) e subdividida em 46 subtarefas de ~3 min: SQL (35.1–35.7: tabela `agent_events`, trigger, RLS, publicação Realtime, `atividade_atual_agentes`, teste de integração, README do banco), dados no frontend (35.8–35.13), funções puras (35.14–35.18), hooks (35.19–35.20), gráficos com Chart.js + `react-chartjs-2` (35.21–35.27), feed/indicador/tela/rota/validação visual (35.28–35.32), eventos do worker LangGraph (35.33–35.39), ferramenta MCP `agent_event` (35.40–35.41), espelho do quadro via `git log` (35.42–35.43), documentação e validação (35.44–35.46). Sem código; nenhuma trava de outro agente alterada. |
| 2026-10-12 00:41 | Codex (OpenAI) | SUB-33.5 | `1d68ea6` | Em `vercel.json`, registrado `api/embedding.ts` com `maxDuration: 15`, preservando a função MCP e o rewrite `/mcp`; alteração publicada em `origin/main`. Testes não executados conforme AGENTS.md. |
| 2026-10-12 00:43 | Codex (OpenAI) | SUB-33.9 | — | Lock: assumindo SUB-33.9 (Documentar `/api/embedding` no `api/README.md`) |
| 2026-10-12 00:46 | DashboardAI-Clone 06 | SUB-20.10 | — | Lock: assumindo SUB-20.10 (`palavrasDe(texto)` em `src/lib/texto.ts`) |
| 2026-10-12 00:47 | DashboardAI-Clone 06 | SUB-20.10 | `8090709` | Criado `src/lib/texto.ts` com `STOPWORDS` (pt/en) e `palavrasDe(texto)`: remove blocos de código, código inline, imagens/links (mantém o texto), URLs e `#*_>~`; minúsculas (pt-BR, acentos preservados); separa por não letra/dígito (Unicode); descarta < 4 letras e stopwords; mantém repetições e ordem (para a contagem do `sugerirTags`, SUB-20.3). Testes em `tests/unit/texto.test.ts` (8). `npm run typecheck` e `npm test` verdes. |
| 2026-10-12 00:48 | DashboardAI-Clone 01 | SUB-27.1 | — | Lock: assumindo SUB-27.1 (`mensagemErroAuth(erro)` em `src/lib/auth.ts`) |
| 2026-10-12 00:48 | DashboardAI-Clone 06 | SUB-20.1 | — | Lock: assumindo SUB-20.1 (`validarMemoria(dados)` em `src/lib/memoriaForm.ts`) |
| 2026-10-12 00:48 | DashboardAI-Clone 01 | SUB-27.1 | `8ccaf5f` | Criado `src/lib/auth.ts` com `mensagemErroAuth(erro)` (invalid_credentials, email_not_confirmed, rate limit/429, user_banned, rede, genérico; null -> ''). Testes em `tests/unit/auth.test.ts` (7). typecheck e vitest verdes. |
| 2026-10-12 00:48 | DashboardAI-Clone 01 | SUB-27.2 | — | Lock: assumindo SUB-27.2 (`validarLogin({ email, senha })` em `src/lib/auth.ts`) |
| 2026-10-12 00:48 | DashboardAI-Clone 06 | SUB-20.1 | `5662f1a` | Criado `src/lib/memoriaForm.ts` com `validarMemoria({ titulo, conteudo, tags })` -> `Partial<Record<"titulo"|"conteudo"|"tags", string>>` (objeto vazio = válido): título obrigatório até 200 caracteres, conteúdo obrigatório (espaços nas pontas não contam), até 20 tags, sem tags vazias, cada uma até 40 caracteres; constantes `MAX_TITULO_MEMORIA`, `MAX_TAGS_MEMORIA`, `MAX_TAMANHO_TAG` e tipos `DadosMemoriaForm`/`ErrosMemoria` exportados. Testes em `tests/unit/memoriaForm.test.ts` (6). `npm run typecheck` e `npm test` verdes. |
| 2026-10-12 00:49 | DashboardAI-Clone 01 | SUB-27.2 | `07a914b` | Adicionado `validarLogin` em `src/lib/auth.ts` (e-mail obrigatório/formato após trim; senha obrigatória, mín. 6). 4 testes em `tests/unit/auth.test.ts`; vitest e typecheck verdes. |
| 2026-10-12 00:49 | DashboardAI-Clone 01 | SUB-27.16 | — | Lock: assumindo SUB-27.16 (`urlDeRetorno()` para link mágico e redefinição de senha) |
| 2026-10-12 00:49 | DashboardAI-Clone 06 | SUB-20.3 | — | Lock: assumindo SUB-20.3 (`sugerirTags(titulo, conteudo)` em `src/lib/memoriaForm.ts`) |
| 2026-10-12 00:49 | DashboardAI-Clone 01 | SUB-27.16 | `1e3240c` | Adicionado `urlDeRetorno(loc)` em `src/lib/auth.ts`: origem + caminho + tela do hash (`#/rota`), descartando tokens/parâmetros anteriores. 4 testes em `tests/unit/auth.test.ts`; vitest e typecheck verdes. |
| 2026-10-12 00:50 | DashboardAI-Clone 01 | SUB-27.3 | — | Lock: assumindo SUB-27.3 (`entrarComSenha(email, senha)` em `src/services/authService.ts`) |
| 2026-10-12 00:50 | DashboardAI-Clone 06 | SUB-20.3 | `e5e67e5` | Adicionado `sugerirTags(titulo, conteudo, max = 5)` em `src/lib/memoriaForm.ts`: usa `palavrasDe` (SUB-20.10) no título (peso 2) e no conteúdo (peso 1), soma a frequência, ordena por pontuação decrescente com desempate alfabético e devolve as `max` primeiras (`max <= 0` -> vazio). Determinística. 6 testes novos em `tests/unit/memoriaForm.test.ts`. `npm run typecheck` e `npm test` verdes. |
| 2026-10-12 00:50 | DashboardAI-Clone 01 | SUB-27.3 | `c80c6c6` | Criado `src/services/authService.ts` com `entrarComSenha(email, senha, client = getSupabase())` via `signInWithPassword` (e-mail com trim); erro -> `ServiceError(mensagemErroAuth(error), 'AUTH')`; senha não guardada/logada. Exportado no barrel `src/services/index.ts`. typecheck e vitest verdes. |
| 2026-10-12 00:50 | DashboardAI-Clone 06 | SUB-20.2 | — | Lock: assumindo SUB-20.2 (`parseTags(texto)` em `src/lib/memoriaForm.ts`) |
| 2026-10-12 00:50 | DashboardAI-Clone 01 | SUB-27.4 | — | Lock: assumindo SUB-27.4 (`sair()` em `src/services/authService.ts`) |
| 2026-10-12 00:51 | DashboardAI-Clone 06 | SUB-20.2 | `78a1e70` | Adicionado `parseTags(texto)` em `src/lib/memoriaForm.ts`: separa por vírgula, qualquer espaço em branco ou `#`, `trim` + minúsculas, remove vazios e duplicados mantendo a ordem da 1ª ocorrência (mesma regra do `normalizarTags` do `memoryService`); hífens, acentos e pontos dentro da tag são preservados. 4 testes novos em `tests/unit/memoriaForm.test.ts`. `npm run typecheck` e `npm test` verdes. |
| 2026-10-12 00:51 | DashboardAI-Clone 01 | SUB-27.4 | `7bc78da` | Adicionado `sair(client = getSupabase())` em `src/services/authService.ts`: `auth.signOut()`, remove `localStorage['dashboard-ai:projeto']` (constante `CHAVE_PROJETO_LOCAL`, tolerante sem localStorage); erro -> `ServiceError(..., 'AUTH')`. typecheck e vitest verdes. |
| 2026-10-12 00:51 | DashboardAI-Clone 01 | SUB-27.5 | — | Lock: assumindo SUB-27.5 (`enviarLinkMagico()` em `src/services/authService.ts`) |
| 2026-10-12 00:51 | DashboardAI-Clone 10 (Grok Bot) | SUB-19.10 | — | Lock: assumindo SUB-19.10 (`classeSimilaridade` em `src/lib/similaridade.ts`) |
| 2026-10-12 00:51 | DashboardAI-Clone 01 | SUB-27.5 | `500e307` | Adicionado `enviarLinkMagico(email, redirectTo, client = getSupabase())` em `src/services/authService.ts`: `auth.signInWithOtp` com `emailRedirectTo` e `shouldCreateUser: false` (e-mail com trim); erro -> `ServiceError(mensagemErroAuth(error), 'AUTH')`. typecheck e vitest verdes. |
| 2026-10-12 00:51 | DashboardAI-Clone 01 | SUB-27.7 | — | Lock: assumindo SUB-27.7 (`obterPapelGlobal()` em `src/services/authService.ts`) |
| 2026-10-12 00:52 | DashboardAI-Clone 06 | SUB-20.4 | — | Lock: assumindo SUB-20.4 (Componente `TagInput` em `src/components/ui/TagInput.tsx`) |
| 2026-10-12 00:52 | DashboardAI-Clone 10 (Grok Bot) | SUB-19.10 | `4f6700d` | Adicionado `classeSimilaridade(s)` em `src/lib/similaridade.ts` com classes Tailwind de badge (fundo, texto e ring, com variantes `dark:`): `>= 0.85` verde (emerald), `>= 0.7` âmbar, abaixo disso ou valor não finito cinza (slate); limiares exportados como `LIMIAR_SIMILARIDADE_ALTA`/`LIMIAR_SIMILARIDADE_MEDIA`. 4 testes novos em `tests/unit/similaridade.test.ts` (limites 0.85 e 0.7). `npm run typecheck` e `npm test` verdes. |
| 2026-10-12 00:52 | DashboardAI-Clone 01 | SUB-27.7 | `5ebbd19` | Adicionado `obterPapelGlobal(userId, client = getSupabase())` em `src/services/authService.ts`: lê `role` da própria linha em `user_roles` (`maybeSingle`, policy `user_roles_select`); sem linha -> `null`; erro -> `ServiceError`. typecheck e vitest verdes. |
| 2026-10-12 00:52 | DashboardAI-Clone 02 | SUB-23.2 | — | Lock: assumindo SUB-23.2 (`classificarPendentes(tasks)` em `src/lib/saudeFila.ts`) |
| 2026-10-12 00:52 | DashboardAI-Clone 01 | SUB-27.23 | — | Lock: assumindo SUB-27.23 (`obterSessao()` em `src/services/authService.ts`) |
| 2026-10-12 00:52 | DashboardAI-Clone 10 (Grok Bot) | SUB-19.4 | — | Lock: assumindo SUB-19.4 (Componente `SimilaridadeBadge` em `src/components/memoria/`) |
| 2026-10-12 00:53 | DashboardAI-Clone 06 | SUB-20.4 | `3d44cd1` | Criado `src/components/ui/TagInput.tsx` (`{ valor, onChange, erro?, rotulo?, placeholder?, desabilitado? }`): chips `#tag` com botão de remover (aria-label), Enter/vírgula adicionam o texto via `parseTags` (ignora tags já presentes), Backspace com campo vazio remove a última, colar texto com separadores adiciona várias, perder o foco confirma o texto pendente; erro com `aria-invalid`/`aria-describedby` e borda vermelha; modo escuro. Sugestões ficam no `TagSugestoes` (SUB-20.9). `npm run typecheck`, `npm run build` e `npm test` OK. |
| 2026-10-12 00:53 | DashboardAI-Clone 02 | SUB-23.2 | `84011c8` | Adicionado `classificarPendentes(tasks, agora)` em `src/lib/saudeFila.ts`: agrupa pendentes não excluídas em prontas/bloqueadas_dependencia/desligadas/agendadas/sem_tentativas (um grupo por task; precedência desligada > sem tentativas > agendada > dependência) usando `dependenciasDa`/`bloqueadaPorDependencia`. Teste com um caso de cada grupo em `tests/unit/saudeFila.test.ts`. typecheck e `npm test` verdes. |
| 2026-10-12 00:53 | DashboardAI-Clone 01 | SUB-27.23 | `c696d9f` | Adicionado `obterSessao(client = getSupabase())` em `src/services/authService.ts`: `auth.getSession()` -> sessão ou `null`; erro -> `ServiceError(mensagemErroAuth(error), 'AUTH')`. typecheck verde. |
| 2026-10-12 00:53 | DashboardAI-Clone 01 | SUB-27.24 | — | Lock: assumindo SUB-27.24 (`redefinirSenha()` em `src/services/authService.ts`) |
| 2026-10-12 00:53 | DashboardAI-Clone 10 (Grok Bot) | SUB-19.4 | `ef9ec9b` | Criado `src/components/memoria/SimilaridadeBadge.tsx` (`{ similaridade, className? }`): pílula arredondada com `formatarSimilaridade` (ex.: `89%`) e cor de `classeSimilaridade` (verde/âmbar/cinza, com `dark:`), `title` e `aria-label` "Similaridade de 89%". Criado `src/components/memoria/index.ts` exportando `BuscaControles` (SUB-19.9) e `SimilaridadeBadge`. `npm run typecheck`, `npm test` e `npm run build` OK. |
| 2026-10-12 00:53 | DashboardAI-Clone 02 | SUB-23.3 | — | Lock: assumindo SUB-23.3 (`diagnosticarFila(tasks)` em `src/lib/saudeFila.ts`) |
| 2026-10-12 00:53 | DashboardAI-Clone 01 | SUB-27.24 | `e5477d2` | Adicionado `redefinirSenha(email, redirectTo, client = getSupabase())` em `src/services/authService.ts`: `auth.resetPasswordForEmail` com `redirectTo` (e-mail com trim); erro -> `ServiceError(mensagemErroAuth(error), 'AUTH')`. typecheck verde. |
| 2026-10-12 00:53 | DashboardAI-Clone 01 | SUB-27.25 | — | Lock: assumindo SUB-27.25 (`papelNoProjeto()` em `src/services/authService.ts`) |
| 2026-10-12 00:54 | DashboardAI-Clone 06 | SUB-20.5 | — | Lock: assumindo SUB-20.5 (Hook `useSalvarMemoria` em `src/hooks/useSalvarMemoria.ts`) |
| 2026-10-12 00:54 | DashboardAI-Clone 10 (Grok Bot) | SUB-19.5 | — | Lock: assumindo SUB-19.5 (Componente `ResultadoBuscaCard` em `src/components/memoria/`) |
| 2026-10-12 00:54 | DashboardAI-Clone 01 | SUB-27.25 | `6223e85` | Adicionado `papelNoProjeto(projectId, userId, client = getSupabase())` em `src/services/authService.ts`: admin global (`obterPapelGlobal`) -> `'admin'`; senão `project_members.role` (`maybeSingle`); não membro -> `null`; erro -> `ServiceError`. typecheck verde. |
| 2026-10-12 00:54 | DashboardAI-Clone 02 | SUB-23.3 | `40fa920` | Adicionado `diagnosticarFila(tasks, agora, limite = 90)` em `src/lib/saudeFila.ts` -> `{ travas: { task, minutos, expirada }[], pendentes, alerta }` (travas = `em_execucao` não excluídas, da mais antiga; pendentes via `classificarPendentes`; `alerta` se alguma expirada). Tipos `TravaDiagnostico`/`DiagnosticoFila` exportados. Testes em `tests/unit/saudeFila.test.ts`. typecheck e `npm test` verdes. |
| 2026-10-12 00:54 | DashboardAI-Clone 08 (Grok Bot) | SUB-08.8 | — | Lock: assumindo SUB-08.8 (`extrairVariaveis(texto)` em `scripts/checar-env.mjs` + testes) |
| 2026-10-12 00:54 | DashboardAI-Clone 02 | SUB-23.6 | — | Lock: assumindo SUB-23.6 (Hook `useSaudeFila` em `src/hooks/useSaudeFila.ts`) |
| 2026-10-12 00:54 | DashboardAI-Clone 01 | SUB-27.6 | — | Lock: assumindo SUB-27.6 (Testes unitários de `authService` em `tests/unit/authService.test.ts`) |
| 2026-10-12 00:54 | DashboardAI-Clone 06 | SUB-20.5 | `3208e66` | Criado `src/hooks/useSalvarMemoria.ts` (exportado em `src/hooks/index.ts`): `{ salvar(projectId | null, dados): Promise<Memoria | null>, salvando }` chamando `salvarMemoria` (SUB-10) com o gerador de `criarGeradorEmbedding()` (SUB-33.7, memoizado). Se o gerador falhar (marcado com erro próprio para não confundir com erro do banco), salva de novo sem vetor e avisa em toast (`info`) que a memória não aparece na busca semântica; sucesso -> `toast.sucesso`; erro do banco/RLS -> `toast.erro` e devolve `null`. Ignora cliques repetidos enquanto salva. `npm run typecheck`, `npm test` e `npm run build` OK. |
| 2026-10-12 00:54 | DashboardAI-Clone 10 (Grok Bot) | SUB-19.5 | `c92d3f9` | Criado `src/components/memoria/ResultadoBuscaCard.tsx` (`{ titulo, conteudo, tags, similaridade?, global, atualizadoEm, onClick?, className? }`): título truncado com `title`, resumo do conteúdo via `resumo(conteudo, 200)` de `src/lib/tasks.ts`, chips de tags, selo "Global" (ícone Globe) quando `global`, `SimilaridadeBadge` só quando há similaridade e data relativa (`tempoRelativo`, `title` com `formatarDataHora`); vira `<button>` acessível quando recebe `onClick`, senão `<article>`. Exportado em `src/components/memoria/index.ts`. `npm run typecheck`, `npm test` e `npm run build` OK. |
| 2026-10-12 00:55 | DashboardAI-Clone 01 | SUB-27.6 | `f830757` | Criado `tests/unit/authService.test.ts` com cliente falso: entrar (sucesso/trim e credenciais inválidas -> ServiceError 'AUTH' traduzido), `sair` limpa o projeto salvo (stub de localStorage), `obterSessao` (sessão/null), link mágico com `shouldCreateUser: false` e `redefinirSenha` (redirectTo + 429). 6 testes verdes; typecheck OK. |
| 2026-10-12 00:55 | DashboardAI-Clone 01 | SUB-27.9 | — | Lock: assumindo SUB-27.9 (`AuthProvider` em `src/hooks/AuthContext.tsx`) |
| 2026-10-12 00:55 | DashboardAI-Clone 10 (Grok Bot) | SUB-23.11 | — | Lock: assumindo SUB-23.11 (`PendentesResumo` em `src/components/tasks/PendentesResumo.tsx`) |
| 2026-10-12 00:55 | DashboardAI-Clone 06 | SUB-20.6 | — | Lock: assumindo SUB-20.6 (Modal `MemoriaFormModal` em `src/components/memoria/`) |
| 2026-10-12 00:55 | DashboardAI-Clone 08 (Grok Bot) | SUB-08.8 | `fb7f8bf` | Criado `scripts/checar-env.mjs` (Node, sem dependências) exportando `extrairVariaveis(texto)`: reconhece `process.env.X`, `import.meta.env.X`, `env.X` (só maiúsculas), `env['X']`, `os.environ.get('X')`, `os.environ['X']` e `os.getenv('X')`; sem repetidos, ordenada. 8 testes em `tests/unit/checar-env.test.ts`. `npm run typecheck` e `npm test` verdes. |
| 2026-10-12 00:55 | DashboardAI-Clone 04 (Grok Bot) | SUB-08.7 | — | Lock: assumindo SUB-08.7 (Conferir `.gitignore` (`!.env.example`)) |
| 2026-10-12 00:55 | DashboardAI-Clone 05 (Grok Bot) | SUB-21.2 | — | Lock: assumindo SUB-21.2 (`filtrarMemoriasLocal` em `src/lib/memorias.ts`) |
| 2026-10-12 00:55 | DashboardAI-Clone 01 | SUB-27.9 | `333f8b9` | Criado `src/hooks/AuthContext.tsx` com `AuthContext`/`AuthProvider` (`sessao, usuario, papelGlobal, carregando, sair`): `obterSessao()` ao montar, `onAuthStateChange` com unsubscribe no cleanup, `papelGlobal` recarregado quando o usuário muda; sem Supabase configurado: `carregando=false`, `sessao=null`. typecheck e vitest verdes. |
| 2026-10-12 00:56 | DashboardAI-Clone 04 (Grok Bot) | SUB-08.7 | `4be4a20` | Removida a segunda linha `.env` no fim do `.gitignore` (redundante e posterior ao `!.env.example`) e comentado que `!.env.example` deve ficar depois de todas as regras de `.env`. `git check-ignore -v --no-index`: `.env.example` não ignorado (`!.env.example`), `.env` e `.env.local` ignorados (`.env` / `.env.*`). |
| 2026-10-12 00:56 | DashboardAI-Clone 01 | SUB-27.26 | — | Lock: assumindo SUB-27.26 (Hook `useAuth` em `src/hooks/useAuth.ts`) |
| 2026-10-12 00:56 | DashboardAI-Clone 08 (Grok Bot) | SUB-08.10 | — | Lock: assumindo SUB-08.10 (`variaveisDoExemplo(texto)` em `scripts/checar-env.mjs` + testes) |
| 2026-10-12 00:56 | DashboardAI-Clone 04 (Grok Bot) | SUB-19.2 | — | Lock: assumindo SUB-19.2 (Hook `useDebounce(valor, ms)` em `src/hooks/useDebounce.ts`) |
| 2026-10-12 00:56 | DashboardAI-Clone 10 (Grok Bot) | SUB-23.11 | `5bce2d7` | Criado `src/components/tasks/PendentesResumo.tsx` (`{ pendentes: PendentesClassificadas, className? }`): grade responsiva com 5 contadores (Prontas, Bloqueadas por dependência, Desligadas, Agendadas, Sem tentativas) na ordem de `classificarPendentes`, cada um com ícone lucide colorido (claro/escuro), `Tooltip` explicando o grupo e `aria-label` com rótulo, total e dica (focável por teclado). Exportado em `src/components/tasks/index.ts`. `npm run typecheck`, `npm test` e `npm run build` OK. |
| 2026-10-12 00:56 | DashboardAI-Clone 05 (Grok Bot) | SUB-21.2 | `0849e15` | Adicionado `filtrarMemoriasLocal(memorias, { busca?, tag?, escopo? })` em `src/lib/memorias.ts` (tipos `EscopoFiltroMemoria`/`FiltroMemoriasLocal` exportados): busca sem acento/maiúsculas em título, conteúdo e tags; tag exata sem diferenciar maiúsculas; escopo `todas`/`projeto`/`global` via `escopoMemoria`; preserva a ordem e o tipo da entrada. 4 testes novos em `tests/unit/memorias.test.ts`. `npm run typecheck` e `npm test` verdes. |
| 2026-10-12 00:56 | DashboardAI-Clone 10 (Grok Bot) | SUB-21.4 | — | Lock: assumindo SUB-21.4 (Componente `MemoriaCard` em `src/components/memoria/MemoriaCard.tsx`) |
| 2026-10-12 00:56 | DashboardAI-Clone 08 (Grok Bot) | SUB-08.10 | `ad56d9b` | Adicionado `variaveisDoExemplo(texto)` em `scripts/checar-env.mjs`: nomes das linhas `NOME=` (aceita `export NOME=` e CRLF) do `.env.example`, ignorando comentários e linhas vazias; sem repetidos, ordenada. No `.env.example` atual devolve as 14 variáveis. 2 testes novos em `tests/unit/checar-env.test.ts`. `npm run typecheck` e `npm test` verdes. |
| 2026-10-12 00:57 | DashboardAI-Clone 02 | SUB-23.6 | `40bb5e0` | Criado `src/hooks/useSaudeFila.ts`: `useSaudeFila({ projectId, tasks, recarregar, limite? })` -> `{ diagnostico, liberando, liberar(task, forcar?) }`; recalcula `diagnosticarFila` com relógio de 30 s (`useMemo` + `setInterval` com cleanup); `liberar` chama `liberarTrava` (SUB-23.4), avisa por toast (sucesso/erro), marca `liberando` e recarrega. Exportado em `src/hooks/index.ts`. typecheck e build OK. |
| 2026-10-12 00:57 | DashboardAI-Clone 08 (Grok Bot) | SUB-08.11 | — | Lock: assumindo SUB-08.11 (`listarArquivosFonte(dirs)` em `scripts/checar-env.mjs` + teste) |
| 2026-10-12 00:57 | DashboardAI-Clone 10 (Grok Bot) | SUB-21.4 | `c03ffa6` | Criado `src/components/memoria/MemoriaCard.tsx` (`{ memoria, onVer?, onExcluir?, className? }`): título truncado, selo Global/Projeto via `escopoMemoria` (ícones Globe/FolderKanban, com `title` explicativo), chips de tags, resumo via `resumo(content, 220)`, atualização relativa (`tempoRelativo`, `title` com `formatarDataHora`) e ações Copiar (`CopyButton` com `memoriaComoMarkdown`), Ver e Excluir (só renderizadas quando há callback; `aria-label` com o título). Exportado em `src/components/memoria/index.ts` mantendo os exports da SUB-19. `npm run typecheck`, `npm test` e `npm run build` OK. |
| 2026-10-12 00:57 | DashboardAI-Clone 05 (Grok Bot) | SUB-21.14 | — | Lock: assumindo SUB-21.14 (`tagsDisponiveis` em `src/lib/memorias.ts`) |
| 2026-10-12 00:57 | DashboardAI-Clone 10 (Grok Bot) | SUB-21.5 | — | Lock: assumindo SUB-21.5 (Componente `MemoriaGrid` em `src/components/memoria/MemoriaGrid.tsx`) |
| 2026-10-12 00:57 | DashboardAI-Clone 02 | SUB-23.10 | — | Lock: assumindo SUB-23.10 (`TravaItem` em `src/components/tasks/TravaItem.tsx`) |
| 2026-10-12 00:57 | DashboardAI-Clone 05 (Grok Bot) | SUB-21.14 | `1734052` | Adicionado `tagsDisponiveis(memorias): { tag, total }[]` em `src/lib/memorias.ts` (tipo `TagDisponivel` exportado): conta memórias por tag (trim + minúsculas, vazias ignoradas, cada memória conta uma vez por tag), ordena por total desc e depois por nome (`localeCompare` pt-BR). 2 testes novos em `tests/unit/memorias.test.ts`. `npm run typecheck` e `npm test` verdes. |
| 2026-10-12 00:58 | DashboardAI-Clone 08 (Grok Bot) | SUB-08.11 | `0ac9843` | Adicionado `listarArquivosFonte(dirs)` em `scripts/checar-env.mjs` (só `node:fs`/`node:path`): varre as pastas recursivamente, só `.ts/.tsx/.js/.mjs/.py` (`EXTENSOES_FONTE`), ignorando `node_modules`, `dist` e `tests` (`PASTAS_IGNORADAS`) e pastas inexistentes; devolve caminhos sem repetição e ordenados. Teste com pasta temporária em `tests/unit/checar-env.test.ts`. `npm run typecheck` e `npm test` verdes. |
| 2026-10-12 00:58 | DashboardAI-Clone 08 (Grok Bot) | SUB-08.9 | — | Lock: assumindo SUB-08.9 (CLI `npm run check:env` (toda variável usada está no `.env.example`)) |
