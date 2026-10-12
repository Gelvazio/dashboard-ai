# 📋 TASK-PRINCIPAL: Projeto Dashboard AI

> **Objetivo:** Construção da solução unificada do **Dashboard AI**, integrando o controle e fila de tarefas da IA (`tasks`), a base de memória persistente vetorial (`ai_memories` / Jev-Mem) e o monitoramento em tempo real do agendador autônomo.
> **Fonte Base:** inspirado no motor de fila do `aulassenai-base` e na especificação de memória Jev-Mem.
> **Direção (2026-10-11):** o Dashboard AI é um **gerenciador genérico de tasks de IA, usável por qualquer projeto** (multi-projeto), não acoplado ao AulasSenai.
> **Regra Geral:** Toda tarefa pode ser subdividida em mini-tarefas menores. Cada tarefa/subtarefa declara obrigatoriamente suas **Dependências** e suas **Subtarefas**. Nenhuma IA pode assumir uma tarefa cujas dependências não estejam `concluido`.

---

## 📊 Resumo de Progresso
- **Total de Tasks Principais:** 32
- **Em Execução:** 3 (`SUB-01.1`, `SUB-27`, `SUB-08`)
- **Pendentes:** 23
- **Concluídas:** 8
- **Canceladas:** 0

---

## 🧩 FASE 1: Preparação do Ambiente e Infraestrutura Básica

### [ ] SUB-01: Setup do Projeto Frontend
- **Status:** em_execucao
- **Executor:** Gemini (Antigravity) (início: 2026-10-11 22:13)
- **Depende de:** Nenhuma
- **Subtarefas:**
  - `SUB-01.1`: Inicialização do package.json, Vite, React e TypeScript (`em_execucao`)
  - `SUB-01.2`: Configuração do Tailwind CSS, PostCSS e estilos globais (`pendente`)
  - `SUB-01.3`: Instalação e verificação de dependências base (Lucide Icons, clsx) (`pendente`)
- **Descrição:** Inicializar a estrutura base do frontend moderno em `c:\fontes\dashboard-ai`.
- **Critérios de Aceitação:** Aplicação compilando com Vite, React, TS e Tailwind.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-01.1: Inicialização do package.json, Vite, React e TypeScript
- **Status:** em_execucao
- **Executor:** Gemini (Antigravity)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Critérios de Aceitação:** `package.json`, `vite.config.ts`, `tsconfig.json` e `index.html` criados.
- **Nota (follow-up):** ao criar o `package.json`, incluir `typescript` e `@types/node` como devDependencies (checagem de `api/`); a troca do cliente fetch de `api/_lib` por `@supabase/supabase-js` fica na SUB-32, liberada após esta sub-task.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-01.2: Configuração do Tailwind CSS, PostCSS e Estilos Globais
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-01.1
- **Subtarefas:** Nenhuma (atômica)
- **Critérios de Aceitação:** `tailwind.config.js`, `postcss.config.js` e `src/index.css` configurados.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-01.3: Instalação e Verificação de Ícones e Dependências Base
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-01.2
- **Subtarefas:** Nenhuma (atômica)
- **Critérios de Aceitação:** `lucide-react`, `clsx`, `tailwind-merge` prontos para importação.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-02: Estrutura Modular de Diretórios do Frontend
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-01
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar árvore de pastas: `src/components`, `src/services`, `src/hooks`, `src/types`, `src/views`, `src/styles`.
- **Critérios de Aceitação:** Diretórios criados com arquivos de exportação e organização padrão.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-03: Configuração do Cliente Supabase e Tipagem TypeScript
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-02
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar cliente Supabase reutilizável em `src/services/supabase.ts` e interfaces em `src/types/database.ts` para `Task`, `AiMemory`, `AgendamentoLog`, `Project`, `ProjectMember` (multi-projeto, ver SUB-29).
- **Critérios de Aceitação:** Tipos e cliente exportados com suporte a variáveis de ambiente (sem chaves fixas no código; somente a chave anon no frontend).
- **Commit:** pendente
- **Anotação:** pendente

---

## 🗄️ FASE 2: Arquitetura de Banco de Dados e Scripts SQL

### [x] SUB-04: Consolidação dos Schemas SQL na Pasta `database/`
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 22:18, conclusão: 2026-10-11 22:20)
- **Depende de:** Nenhuma (independente de código frontend)
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Organizar na raiz os scripts SQL consolidados: `database/01_tasks_schema.sql` (tabela tasks, restrições e triggers), `database/02_logs_schema.sql` (tabela de logs) e `database/03_memories_schema.sql` (tabela ai_memories com pgvector).
- **Critérios de Aceitação:** Arquivos SQL idempotentes com comandos `create table if not exists` e comentários explicativos.
- **Commit:** `f7d6e04`
- **Anotação:** Scripts idempotentes (create if not exists / create or replace / drop trigger if exists) com comentários. 01: tabela tasks (codigo TASK-NNNN automático, prioridade 1-5, ordem, dependencias, executar ON/OFF, status pendente/em_execucao/concluida/recusada/erro/cancelada, tentativas/max_tentativas, executar_apos, resultado, pr_url, commit_sha, trava_frente/trava_em, exclusão lógica) + índices da fila + triggers de updated_at e ciclo de vida (libera trava ao sair de em_execucao, registra iniciado_em/concluido_em/excluido_em). 02: agendamento_tarefa_logs (status concluida/recusada/erro/sem_tarefa, FK para tasks, índice por data_hora desc). 03: extensão vector + ai_memories (vector(1536), HNSW cosseno, GIN em tags, trigger updated_at). Validado aplicando 2x em PostgreSQL 17 + pgvector local e testando triggers/constraints. Corrigido `order in by` em AGENTS.md.

### [x] SUB-05: Consolidação das Funções RPC e Triggers no Banco
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 22:20, conclusão: 2026-10-11 22:21)
- **Depende de:** SUB-04
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `database/04_rpc_functions.sql` contendo `pegar_proxima_task`, `finalizar_task`, `match_memories` e `eh_professor_administrador`.
- **Critérios de Aceitação:** Funções prontas para aplicação direta no Supabase com suporte a lock de 90min e similaridade de cosseno.
- **Commit:** `ceb04a9`
- **Anotação:** pegar_proxima_task(p_agente, p_lock_minutos=90, p_exclusivo=true): advisory lock + FOR UPDATE SKIP LOCKED; elegível se não excluída, executar ON, executar_apos alcançado, tentativas < max, dependências concluídas e status pendente ou trava expirada; ordena prioridade/ordem/created_at; fila serial por padrão; travas expiradas sem tentativas viram erro. finalizar_task(p_task_id, p_status concluida/recusada/erro, resultado, pr_url, commit_sha, p_agente, p_rotina): valida dono da trava, erro com tentativas restantes volta a pendente, libera trava e grava log em agendamento_tarefa_logs com duracao_ms. liberar_trava_task(p_task_id, p_forcar): liberação manual de trava expirada (para SUB-23). match_memories(query_embedding, match_threshold=0.7, match_count=5, filter_tags=null): cosseno com `order by` correto, compatível com a chamada do MCP. eh_professor_administrador(p_user_id=auth.uid()): security definer, via tabela professores_administradores ou JWT app_metadata.role; funciona também fora do Supabase. Validado 2x (idempotência) em PostgreSQL 17 + pgvector com cenários de dependência, exclusividade, expiração, retentativa, dono da trava, 6 capturas paralelas sem duplicidade e stub de auth.uid()/auth.jwt(). RLS não habilitado (exemplo documentado).

---

## 🌐 FASE 2B: Gerenciador Genérico Multi-projeto (fila, papéis, RLS e MCP)

### [x] SUB-29: Multi-projeto, Papéis e RLS no Banco
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 22:37, conclusão: 2026-10-11 22:43)
- **Depende de:** SUB-04, SUB-05
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Tornar o banco genérico para qualquer projeto: tabela `projects` (com seed `default` e backfill), `project_id` em `tasks`, `ai_memories` e `agendamento_tarefa_logs` (código da task único por projeto; memória com `project_id` nulo = global), papéis `user_roles`/`project_members` com `eh_administrador()` e `tem_acesso_projeto()`, removendo `professores_administradores`/`eh_professor_administrador`. `pegar_proxima_task(p_agente, p_projeto, p_lock_minutos, p_exclusivo false)` paralela via `SKIP LOCKED`; RPCs da fila `security definer`, `search_path` fixo, `revoke` de public/anon/authenticated e `grant` a `service_role`; trigger de guarda da interface (só o backend põe/tira de `em_execucao`); trigger de validação de dependências; RLS em todas as tabelas; colunas úteis do motor original (`origem`, `tipo` ia/humano, `arquivo_md`, `md5_md`, `sincronizado_em`, `log_id`, `criado_por`/`atualizado_por`); logs genéricos expandidos; `match_memories` com `p_project_id`. Inclui `--projeto` no `scripts/sincronizar_tasks.py`.
- **Critérios de Aceitação:** SQL idempotente aplicado 2x em Postgres + pgvector; testes de RLS com `anon`/`authenticated`/`service_role`; captura paralela entre projetos sem duplicidade; testes Python passando.
- **Commit:** `30fe077`
- **Anotação:** Arquivos novos database/00_projects_roles.sql e database/05_rls_policies.sql; 01-04 reescritos e idempotentes (também migram instalações da versão anterior sem project_id: backfill no projeto default, unique (project_id, codigo), contador por projeto ajustado). Papéis: user_roles (admin/member) e project_members (owner/editor/viewer); eh_administrador() (user_roles ou JWT app_metadata.role=admin) e tem_acesso_projeto(project_id, papel); professores_administradores migrada para user_roles e removida junto com eh_professor_administrador. Fila: pegar_proxima_task(p_agente, p_projeto slug, p_lock_minutos=90, p_exclusivo=false) com FOR UPDATE SKIP LOCKED, só tipo ia, projeto ativo, dependências do mesmo projeto; p_exclusivo=true serializa por projeto (advisory lock). finalizar_task(..., p_metadados jsonb) sempre grava log genérico e tasks.log_id; registrar_execucao_sem_tarefa; liberar_trava_task exige editor do projeto quando chamada pela interface. match_memories(..., p_projeto, p_incluir_globais) security invoker sob RLS. Segurança: RPCs da fila security definer + search_path fixo, revoke de public/anon/authenticated, grant só a service_role; RLS em todas as tabelas (anon sem acesso; viewer lê; editor cria/edita; sem DELETE em tasks; logs só leitura). Trigger de guarda: interface não põe/tira de em_execucao, não mexe em trava/tentativas e só conclui tasks humano. Script sincronizar_tasks.py: --projeto/DASHBOARD_AI_PROJECT, campo tipo, projeto: no cabeçalho, recusa arquivo de outro projeto, sem fallback para chave anon. Validação: database/tests/run_tests.sh (00-05 aplicados 2x, 72 verificações com anon/authenticated/service_role, 12 agentes em paralelo em 3 projetos sem duplicidade, exclusivo entrega 1), upgrade a partir da versão anterior com dados, 8 testes Python e e2e do script contra PostgREST 12.

### [x] SUB-30: Ferramentas da Fila no MCP
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 22:43, conclusão: 2026-10-11 22:45)
- **Depende de:** SUB-06, SUB-29
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Publicar no `api/mcp.ts` as ferramentas `task_next`, `task_finish`, `task_list` e `task_create`, com argumento opcional `project` (padrão `MCP_DEFAULT_PROJECT`), chamando as RPCs da SUB-29 com a chave `service_role` no servidor, para que agentes de qualquer projeto operem a fila pelo MCP.
- **Critérios de Aceitação:** `tools/list` lista as 4 ferramentas com `inputSchema`; chamadas validadas e testadas; `tsc` sem erros.
- **Commit:** `5d7c995`
- **Anotação:** api/_lib/queue-tools.ts + api/_lib/supabase.ts (cliente fetch sem dependências). tsc strict OK; e2e com PostgREST local: 27 checagens (dependências, humano ignorado, dono da trava, erro volta à fila, log sem_tarefa, projeto padrão, allowlist, 401 sem token).

### [x] SUB-31: Recados entre Agentes e Regras por Projeto
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 22:47, conclusão: 2026-10-11 22:49)
- **Depende de:** SUB-29
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Tabelas genéricas `agent_messages` (recados entre agentes/frentes, por projeto e task) e `project_rules` (cópia por seção das regras do repositório de cada projeto, conferida por md5), com RLS por projeto.
- **Critérios de Aceitação:** SQL idempotente aplicado 2x e testado com RLS.
- **Commit:** `0b34257`
- **Anotação:** database/06_messages_rules.sql: agent_messages (remetente, destinatario nulo = todos, tipo recado/pergunta/resposta/alerta/handoff, task por id ou código do mesmo projeto, resposta_de, lido/arquivado) e ler_recados(projeto, agente, só não lidos, marcar lidos, desde, limite); project_rules (arquivo + seção únicos por projeto, md5 gerado do conteúdo, commit_sha, ativo) e conferir_regras(projeto, jsonb) -> igual/diverge/so_local/so_banco. RLS: viewer lê; editor cria recados e só altera lido/arquivado (sem DELETE); regras só owner/admin escrevem; criado_por forçado ao usuário logado; anon sem acesso. Validado: 00-06 aplicados 2x; 46 verificações novas (tests/test_recados_regras.sql) + 72 de SUB-29 + paralelo, todos OK.


### [ ] SUB-32: Trocar cliente fetch por `@supabase/supabase-js` em `api/_lib`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-01.1, SUB-30, SUB-07
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Depois que a SUB-01.1 criar o `package.json`, adicionar `@supabase/supabase-js` às dependências e substituir o cliente PostgREST com `fetch` de `api/_lib/supabase.ts` (usado por `queue-tools.ts` e `brain-tools.ts`) pelo `createClient` com a chave `service_role` (sem sessão persistida), mantendo as mesmas variáveis (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) e o mesmo comportamento das ferramentas MCP. Atualizar a nota da seção 3 do `AGENTS.md` e o `api/README.md`.
- **Critérios de Aceitação:** `tsc -p api/tsconfig.json` sem erros; ferramentas `task_*` e `brain_*` com o mesmo contrato e testadas novamente (mesmos cenários da SUB-30/SUB-07); nenhuma chave no código.
- **Commit:** pendente
- **Anotação:** pendente
---

## 🧠 FASE 3: Módulo Backend / API Serverless de Memória (Jev-Mem MCP)

### [x] SUB-06: Estrutura do Endpoint Serverless Vercel MCP
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 22:23, conclusão: 2026-10-11 22:24)
- **Depende de:** SUB-04, SUB-05
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Configurar `api/mcp.ts`, `api/tsconfig.json` e rotas serverless Vercel para responder no protocolo JSON-RPC.
- **Critérios de Aceitação:** Arquivo `api/mcp.ts` com validação de método POST e roteador para primitivas cognitivas.
- **Commit:** `ce840a4`
- **Anotação:** api/mcp.ts: handler default compatível com VercelRequest/VercelResponse; 405 para não-POST (Allow: POST, OPTIONS), 204 no preflight OPTIONS, CORS (MCP_CORS_ORIGIN), autenticação opcional via MCP_AUTH_TOKEN (401). Parse do corpo (objeto, string ou Buffer; -32700 para JSON inválido), validação JSON-RPC 2.0 (-32600), suporte a lote e notificações (HTTP 202 sem corpo). Métodos: initialize (negocia protocolVersion 2025-06-18/2025-03-26/2024-11-05, capabilities.tools, serverInfo), ping, notifications/initialized|cancelled, tools/list e tools/call (nome em params.name, argumentos em params.arguments; ferramenta desconhecida -32602; exceção do handler vira result com isError=true; método inexistente -32601). api/_lib/tools.ts: registro registerTool/listTools/getTool/textResult onde a SUB-07 vai plugar brain_store/brain_search/brain_delete. api/_lib/jsonrpc.ts: tipos, códigos de erro e helpers ok/fail/RpcError. api/tsconfig.json estrito (NodeNext). vercel.json: maxDuration 30s e rewrite /mcp -> /api/mcp. Sem dependências novas (tipos HTTP locais) para não conflitar com o package.json da SUB-01.1; para tsc local é preciso typescript + @types/node como devDependencies. Validado: tsc --noEmit sem erros e harness esbuild/node com 18 cenários. AGENTS.md seção 3 recebeu nota apontando para api/ e corrigindo tools/call + params.name, @supabase/supabase-js e https://api.openai.com/v1/embeddings.

### [x] SUB-07: Implementação das Primitivas de Memória e Embeddings
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 22:45, conclusão: 2026-10-11 22:47)
- **Depende de:** SUB-06, SUB-29
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Implementar no `api/mcp.ts` as ferramentas `brain_store`, `brain_search`, `brain_delete` e `tools/list` com geração de vetores de embedding, escopo por projeto (argumento `project`; memória global com `project_id` nulo).
- **Critérios de Aceitação:** Endpoints respondendo a chamadas MCP com armazenamento e busca por similaridade.
- **Commit:** `746bd8d`
- **Anotação:** api/_lib/brain-tools.ts (upsert por project_id+title, busca via match_memories com globais, delete por título/id), api/_lib/embeddings.ts (OPENAI_API_KEY, EMBEDDING_MODEL, EMBEDDING_API_URL; valida 1536 dimensões), api/_lib/args.ts (helpers compartilhados com a fila). Exige MCP_AUTH_TOKEN; servidor com MCP_ALLOWED_PROJECTS lê mas não grava memória global. tsc strict OK; e2e contra PostgREST local + embedder falso: 36 checagens (upsert, isolamento entre projetos, globais, tags, limiar, allowlist, erros da API sem vazar chave) e as 27 da fila seguem OK.

### [🔄] SUB-08: Configuração de Variáveis de Ambiente e `.env.example`
- **Status:** em_execucao
- **Executor:** xAI (Grok) (início: 2026-10-11 22:41)
- **Depende de:** SUB-06
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Documentar e padronizar as variáveis `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (frontend) e `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `EMBEDDING_MODEL`, `MCP_AUTH_TOKEN`, `MCP_CORS_ORIGIN`, `MCP_DEFAULT_PROJECT`, `DASHBOARD_AI_PROJECT` (servidor/scripts) em `.env.example`.
- **Critérios de Aceitação:** Arquivo `.env.example` completo com instruções de preenchimento.
- **Commit:** pendente
- **Anotação:** pendente

---

## ⚡ FASE 4: Serviços do Frontend (Data Layer)

### [ ] SUB-09: Serviço de Tarefas (`src/services/taskService.ts`)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-03
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Implementar operações de `listarTasks`, `criarTask`, `atualizarTask`, `alternarExecucao` (ON/OFF), `cancelarTask`, `reabrirTask` e `excluirTaskLogico`.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Funções assíncronas com tratamento de erro e ordenação por prioridade, ordem e criação.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-10: Serviço de Memória Semântica (`src/services/memoryService.ts`)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-03
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Implementar `buscarMemoriasSimilares`, `listarMemorias`, `salvarMemoria` e `excluirMemoria`.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Integração com RPC `match_memories` e tabela `ai_memories`.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-11: Serviço de Logs do Agendador (`src/services/logService.ts`)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-03
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Implementar consulta e filtros de histórico da tabela `agendamento_tarefa_logs`.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Listagem de histórico ordenado por `data_hora desc` com contadores de status.
- **Commit:** pendente
- **Anotação:** pendente

---

## 🎨 FASE 5: Interface do Usuário - Componentes Base e Layout

### [ ] SUB-12: Layout Principal Responsivo (Sidebar + Header + Navegação)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-01, SUB-02
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Construir o shell do Dashboard com barra lateral de navegação (Fila de Tarefas, Cérebro de Memória, Logs do Agendador, Configurações), Header com seletor de projeto, status da conexão Supabase e toggle de tema.
- **Critérios de Aceitação:** Navegação fluida entre abas/visões sem recarregar página, responsivo para desktop e mobile.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-13: Painel de Indicadores Gerais (KPI Cards)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-09, SUB-10, SUB-11, SUB-12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Construir cards de estatísticas no topo da tela: Total de Tasks, Tasks Pendentes, Em Execução, Concluídas, Total de Memórias e Última Execução da IA.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Cards com ícones, números calculados dinamicamente e animação visual.
- **Commit:** pendente
- **Anotação:** pendente

---

## 📋 FASE 6: Interface do Usuário - Painel da Fila de Tasks (`tasks`)

### [ ] SUB-14: Tabela Avançada da Fila de Tasks
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-09, SUB-12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Renderizar tabela com colunas: Código, Título, Prioridade (Badges coloridos 1-5), Ordem, Dependências, ON/OFF, Status, Tentativas, Resultado e Ações.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Tabela legível, com suporte a tooltips e indicadores de progresso.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-15: Barra de Ferramentas e Filtros em Tempo Real
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-14
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar barra de filtros com busca textual (por código, título e instrução), filtro dropdown por status e botão de recarregamento manual.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Filtros aplicados instantaneamente na tabela sem latência perceptível.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-16: Modal de Cadastro e Edição de Task
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-09, SUB-12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar modal com campos: Título, Instrução (editor Markdown/textarea responsivo), Prioridade (1 a 5), Ordem, Executar Após (datetime), e Máximo de Tentativas.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Validação de campos obrigatórios, salvamento no Supabase e feedback visual de sucesso/erro.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-17: Modal de Visualização Detalhada da Task
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-14
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Modal de visualização completa contendo instrução formatada, relatório de resultado gravado pela IA, link do PR no GitHub e SHA do commit.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Renderização rica dos metadados e botão para copiar dados com um clique.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-18: Controles de Ação Rápida na Linha da Tabela
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-09, SUB-14
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Ações rápidas: Switch ON/OFF com persistência imediata, botão "Reabrir" (para recusadas/erros), botão "Cancelar" e botão "Excluir" com confirmação.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Ações executadas com atualização otimista ou recarregamento automático da tabela.
- **Commit:** pendente
- **Anotação:** pendente

---

## 🧠 FASE 7: Interface do Usuário - Painel de Memória Persistente (Jev-Mem)

### [ ] SUB-19: Interface de Pesquisa Semântica Vetorial
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-10, SUB-12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar componente de busca semântica onde o usuário insere uma consulta e o sistema busca memórias similares via RPC `match_memories`, exibindo a porcentagem de similaridade.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Campo de busca com debounce, exibição de cards de resultado com badge de similaridade (ex: 89%).
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-20: Formulário de Nova Memória Canônica
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-10, SUB-12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Componente para adicionar nova memória: Título único, Conteúdo estruturado em Markdown e Tags de categorização.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Criação persistida no banco Supabase com geração de tags dinâmicas.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-21: Grid de Gerenciamento e Exclusão de Memórias
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-10, SUB-12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Exibição em cartões de todas as memórias cadastradas, com botão para copiar conteúdo Markdown, visualizar detalhes e excluir memória.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Grid responsivo com paginação/scroll e feedback de exclusão.
- **Commit:** pendente
- **Anotação:** pendente

---

## ⏱️ FASE 8: Interface do Usuário - Monitor do Agendador e Telemetria

### [ ] SUB-22: Visualizador de Logs de Execução da IA
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-11, SUB-12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Aba com linha do tempo de execuções lidas de `agendamento_tarefa_logs`, mostrando data/hora, status (`concluida`, `recusada`, `erro`, `sem_tarefa`), nome da rotina e detalhes.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Lista visual cronológica com badges de status e tempo de execução.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-23: Diagnóstico de Travas e Saúde da Fila
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-09, SUB-11, SUB-12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Painel indicando se há lock ativo (task com `trava_frente` e `trava_em` dentro dos 90 minutos) e botão de liberação manual de trava caso expire.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Alerta visual se uma task estiver presa além do tempo limite.
- **Commit:** pendente
- **Anotação:** pendente

---

## 🔄 FASE 9: Sincronização e Utilitários

### [x] SUB-24: Script de Sincronização de Tasks (`scripts/sincronizar_tasks.py`)
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 22:21, conclusão: 2026-10-11 22:23)
- **Depende de:** SUB-04, SUB-05
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adaptar e consolidar o script Python para sincronizar tasks entre o banco Supabase e arquivos markdown locais em `tasks/fila/`.
- **Critérios de Aceitação:** Script executável via terminal com comandos `consulta`, `importar`, `exportar` e `conferir`.
- **Commit:** `7132c1b`
- **Anotação:** Script Python 3.8+ sem dependências externas que usa a API REST (PostgREST) do Supabase com SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (ou VITE_*; lê .env da raiz). Comandos: consulta (tabela ou --json, filtros --status/--codigo, contadores por status), exportar (banco -> tasks/fila/<CODIGO>.md com cabeçalho e bloco RESULTADO somente leitura; --dry-run; idempotente), importar (upsert por código, só campos editáveis; arquivo sem código cria task e é renomeado para o código gerado pelo banco; --dry-run; --com-status), conferir (SÓ LOCAL / SÓ BANCO / DIVERGE por campo, exit 1 se houver divergência). Validação de cabeçalho (titulo obrigatório, prioridade 1-5, status válido). Testes: scripts/test_sincronizar_tasks.py (6 testes unitários, python3 -m unittest discover -s scripts) + teste ponta a ponta contra PostgREST 12 + PostgreSQL 17 com database/01-04 aplicados (criar, atualizar, exportar após finalizar_task, executar_apos, divergências).

---

## 🚀 FASE 10: Build, Validação e Documentação

### [ ] SUB-25: Validação de Build e Execução Local
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-01 a SUB-24
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Rodar compilação de produção (`npm run build`), validar ausência de erros de tipagem TypeScript e verificar integridade de pacotes.
- **Critérios de Aceitação:** Build gerado com sucesso na pasta `dist/` sem alertas impeditivos.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-26: Documentação Completa e Manual Operacional no `README.md`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-25
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Documentar no `README.md` a arquitetura da solução, guia de execução local, deploy na Vercel e instruções para agentes de IA operarem a fila e a memória.
- **Critérios de Aceitação:** Documentação clara, completa e em conformidade com as regras do projeto.
- **Commit:** pendente
- **Anotação:** pendente

### [🔄] SUB-27: Autenticação e Login com Supabase Auth
- **Status:** em_execucao
- **Executor:** Codex (OpenAI) (início: 2026-10-11 22:27)
- **Depende de:** SUB-03, SUB-29 (papéis `user_roles`/`project_members` e RLS)
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Implementar tela e fluxo de login do Dashboard usando Supabase Auth, mantendo a sessão do usuário, protegendo as áreas autenticadas e oferecendo logout.
- **Critérios de Aceitação:** Login e logout funcionam via Supabase Auth; sessão é restaurada e páginas privadas redirecionam usuários não autenticados; chamadas ao banco usam o JWT do usuário e respeitam RLS; somente a chave pública anon pode estar no frontend, sem senha persistida nem chave service_role exposta.
- **Commit:** pendente
- **Anotação:** Iniciado por solicitação do usuário; a dependência SUB-03 permanece pendente e a integração com o cliente Supabase depende da conclusão dela.

---

## 🚀 FASE 11: Orquestração de Tasks com LangChain/LangGraph (última fase)

### [ ] SUB-28: Integração LangChain/LangGraph para Execução de Tasks
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-01 a SUB-27, SUB-29, SUB-30 (todas as tasks anteriores concluídas)
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Implementar a orquestração multi-etapas de execução descrita em `LangChain_LangGraph.md`, mantendo Supabase como autoridade sobre a fila, dependências, locks, tentativas e resultado. Integrar o worker LangGraph às RPCs existentes e às ferramentas MCP autorizadas, com checkpoint durável, retomada, tratamento de falhas e aprovação humana para ações sensíveis.
- **Critérios de Aceitação:** A task só inicia após todas as dependências SUB-01 a SUB-27 concluídas; execução reivindicada por `pegar_proxima_task`; estado do grafo é retomável e não duplica efeitos; escrita ocorre por ferramentas autenticadas e autorizadas; ações sensíveis pausam para aprovação; conclusão/erro e liberação do lock passam por `finalizar_task`; documentação de operação e segurança atualizada conforme `LangChain_LangGraph.md`.
- **Commit:** pendente
- **Anotação:** pendente
