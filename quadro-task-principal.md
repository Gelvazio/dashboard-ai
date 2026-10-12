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
| **Status da Trava:** | 🟢 **LIVRE** |
| **Sub-task em Execução:** | — |
| **Título da Sub-task:** | — |
| **Agente Responsável:** | — |
| **Data e Hora de Início:** | — |
| **Bloqueio para Outras IAs:** | Trava de Gemini (Antigravity) em SUB-01.1 liberada pelo usuário em 2026-10-11 22:56 (parada desde 2026-10-11 22:13, sem pushes); ver travas adicionais abaixo |

### 🔒 TRAVA ADICIONAL — Codex (OpenAI)

| Propriedade | Valor Atual |
|---|---|
| **Status da Trava:** | 🔴 **OCUPADO** |
| **Sub-task em Execução:** | **SUB-27** |
| **Título da Sub-task:** | Autenticação e Login com Supabase Auth |
| **Agente Responsável:** | Codex (OpenAI) |
| **Data e Hora de Início:** | 2026-10-11 22:27 |
| **Bloqueio para Outras IAs:** | **ATIVADO** |

### 🔒 TRAVA ADICIONAL — xAI (Grok)

| Propriedade | Valor Atual |
|---|---|
| **Status da Trava:** | 🔴 **OCUPADO** |
| **Sub-task em Execução:** | **SUB-08** |
| **Título da Sub-task:** | Configuração de Variáveis de Ambiente e `.env.example` |
| **Agente Responsável:** | xAI (Grok) |
| **Data e Hora de Início:** | 2026-10-11 22:41 |
| **Bloqueio para Outras IAs:** | **ATIVADO** |

---

## 🚦 QUADRO KANBAN DE SUB-TASKS

### 🔄 EM EXECUÇÃO (2)

| Código | Título da Mini-task | Agente | Início | Depende de |
|---|---|---|---|---|
| **SUB-27** | Autenticação e Login com Supabase Auth | Codex (OpenAI) | 2026-10-11 22:27 | SUB-03, SUB-29 |
| **SUB-08** | Configuração de Variáveis de Ambiente e `.env.example` | xAI (Grok) | 2026-10-11 22:41 | SUB-06 |

---

### ⏳ PENDENTES (19)

| Código | Título da Mini-task | Prioridade | Fase | Depende de |
|---|---|---|---|---|
| **SUB-03** | Configuração do Cliente Supabase e Tipagem TypeScript | 1 (Alta) | Fase 1 | SUB-02 |
| **SUB-09** | Serviço de Tarefas (`src/services/taskService.ts`) | 3 | Fase 4 | SUB-03 |
| **SUB-10** | Serviço de Memória Semântica (`src/services/memoryService.ts`) | 3 | Fase 4 | SUB-03 |
| **SUB-11** | Serviço de Logs do Agendador (`src/services/logService.ts`) | 3 | Fase 4 | SUB-03 |
| **SUB-12** | Layout Principal Responsivo (Sidebar + Header + Navegação) | 3 | Fase 5 | SUB-01, SUB-02 |
| **SUB-13** | Painel de Indicadores Gerais (KPI Cards) | 3 | Fase 5 | SUB-09, SUB-10, SUB-11, SUB-12 |
| **SUB-14** | Tabela Avançada da Fila de Tasks | 3 | Fase 6 | SUB-09, SUB-12 |
| **SUB-15** | Barra de Ferramentas e Filtros em Tempo Real | 3 | Fase 6 | SUB-14 |
| **SUB-16** | Modal de Cadastro e Edição de Task | 3 | Fase 6 | SUB-09, SUB-12 |
| **SUB-17** | Modal de Visualização Detalhada da Task | 3 | Fase 6 | SUB-14 |
| **SUB-18** | Controles de Ação Rápida na Linha da Tabela | 3 | Fase 6 | SUB-09, SUB-14 |
| **SUB-19** | Interface de Pesquisa Semântica Vetorial | 4 | Fase 7 | SUB-10, SUB-12 |
| **SUB-20** | Formulário de Nova Memória Canônica | 4 | Fase 7 | SUB-10, SUB-12 |
| **SUB-21** | Grid de Gerenciamento e Exclusão de Memórias | 4 | Fase 7 | SUB-10, SUB-12 |
| **SUB-22** | Visualizador de Logs de Execução da IA | 4 | Fase 8 | SUB-11, SUB-12 |
| **SUB-23** | Diagnóstico de Travas e Saúde da Fila | 4 | Fase 8 | SUB-09, SUB-11, SUB-12 |
| **SUB-25** | Validação de Build e Execução Local | 5 | Fase 10 | SUB-01 a SUB-24 |
| **SUB-26** | Documentação Completa e Manual Operacional no `README.md` | 5 | Fase 10 | SUB-25 |
| **SUB-28** | Integração LangChain/LangGraph para Execução de Tasks | 5 | Fase 11 (última) | SUB-01 a SUB-27, SUB-29, SUB-30 |

---

### ✅ CONCLUÍDAS (13)

| Código | Título da Mini-task | Agente | Início | Conclusão | Commit SHA |
|---|---|---|---|---|---|
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

---

### ⛔ CANCELADAS (0)
*(Nenhuma cancelada)*

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
