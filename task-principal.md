# 📋 TASK-PRINCIPAL: Projeto Dashboard AI

> **Objetivo:** Construção da solução unificada do **Dashboard AI**, integrando o controle e fila de tarefas da IA (`tasks`), a base de memória persistente vetorial (`ai_memories` / Jev-Mem) e o monitoramento em tempo real do agendador autônomo.
> **Fonte Base:** inspirado no motor de fila do `aulassenai-base` e na especificação de memória Jev-Mem.
> **Direção (2026-10-11):** o Dashboard AI é um **gerenciador genérico de tasks de IA, usável por qualquer projeto** (multi-projeto), não acoplado ao AulasSenai.
> **Regra Geral:** Toda tarefa pode ser subdividida em mini-tarefas menores. Cada tarefa/subtarefa declara obrigatoriamente suas **Dependências** e suas **Subtarefas**. Nenhuma IA pode assumir uma tarefa cujas dependências não estejam `concluido`.

---

## 📊 Resumo de Progresso
- **Total de Tasks Principais:** 34
- **Subtarefas atômicas (~3 min):** 121 (SUB-19.x, SUB-20.x, SUB-21.x, SUB-23.x, SUB-25.x, SUB-26.x, SUB-27.x, SUB-28.x, SUB-33.x, SUB-34.x; atualizado em 2026-10-11 23:51)
- **Em Execução:** 2 (`SUB-27`, `SUB-08`)
- **Pendentes:** 9 principais aguardando subtarefas (SUB-19, 20, 21, 23, 25, 26, 28, 33, 34) + 121 subtarefas
  - livres agora: 16 (SUB-33.1, SUB-33.3, SUB-33.4, SUB-34.1, SUB-34.4, SUB-19.1, SUB-19.3, SUB-19.9, SUB-20.1, SUB-20.8, SUB-21.1, SUB-21.3, SUB-23.1, SUB-23.4, SUB-25.1, SUB-26.1)
  - reservadas sob a trava da SUB-27 (Codex (OpenAI)): 22
  - bloqueadas por dependência: 83
- **Concluídas:** 25
- **Canceladas:** 0

---

## 🧩 FASE 1: Preparação do Ambiente e Infraestrutura Básica

### [x] SUB-01: Setup do Projeto Frontend
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 22:56; assumida após liberação, pelo usuário, da trava de Gemini (Antigravity) de 2026-10-11 22:13; conclusão: 2026-10-11 22:59)
- **Depende de:** Nenhuma
- **Subtarefas:**
  - `SUB-01.1`: Inicialização do package.json, Vite, React e TypeScript (`concluido`, `374dc99`)
  - `SUB-01.2`: Configuração do Tailwind CSS, PostCSS e estilos globais (`concluido`, `97697e3`)
  - `SUB-01.3`: Instalação e verificação de dependências base (Lucide Icons, clsx) (`concluido`, `25b9664`)
- **Descrição:** Inicializar a estrutura base do frontend moderno na raiz do repositório `dashboard-ai`.
- **Critérios de Aceitação:** Aplicação compilando com Vite, React, TS e Tailwind.
- **Commit:** `374dc99`, `97697e3`, `25b9664` (SUB-01.1, SUB-01.2, SUB-01.3)
- **Anotação:** Todas as subtarefas concluídas: Vite 8 + React 19 + TypeScript 5.9, Tailwind CSS v4 (PostCSS, tema, modo escuro) e lucide-react/clsx/tailwind-merge com cn(). `npm run build` e `npm run typecheck` (frontend + api/) OK.

#### [x] SUB-01.1: Inicialização do package.json, Vite, React e TypeScript
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 22:56, conclusão: 2026-10-11 22:57)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Critérios de Aceitação:** `package.json`, `vite.config.ts`, `tsconfig.json` e `index.html` criados.
- **Nota (follow-up):** ao criar o `package.json`, incluir `typescript` e `@types/node` como devDependencies (checagem de `api/`); a troca do cliente fetch de `api/_lib` por `@supabase/supabase-js` fica na SUB-32, liberada após esta sub-task.
- **Commit:** `374dc99`
- **Anotação:** package.json (type module, Node >= 20.19; scripts dev, build = tsc -b && vite build, preview, typecheck, typecheck:api), package-lock.json, vite.config.ts (plugin-react, dist com sourcemap), tsconfig.json com referências para tsconfig.app.json (só src/, moduleResolution bundler, strict) e tsconfig.node.json (vite.config.ts); api/ segue com api/tsconfig.json próprio (NodeNext) e não é incluída pelo tsconfig do frontend. devDependencies typescript ~5.9 (TS 7 nativo ainda novo para o ecossistema) e @types/node ^20 conforme a nota. index.html (pt-BR), public/favicon.svg, src/main.tsx e src/App.tsx (casca genérica). Validado: npm install sem vulnerabilidades, npm run build OK, npm run typecheck (frontend + api) OK, vite preview servindo o index.

#### [x] SUB-01.2: Configuração do Tailwind CSS, PostCSS e Estilos Globais
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 22:57, conclusão: 2026-10-11 22:58)
- **Depende de:** SUB-01.1
- **Subtarefas:** Nenhuma (atômica)
- **Critérios de Aceitação:** `tailwind.config.js`, `postcss.config.js` e `src/index.css` configurados.
- **Commit:** `97697e3`
- **Anotação:** postcss.config.js (@tailwindcss/postcss), tailwind.config.js (content, sombra card e animação fade-in, carregado por @config), src/index.css (@import tailwindcss; @theme com fontes, paleta brand neutra e cores de status da fila pendente/execucao/concluida/recusada/erro/cancelada; variante dark por classe .dark no html; base de body/foco/seleção; componente .card; prefers-reduced-motion). src/main.tsx importa o CSS e App.tsx usa as classes. Decisão: Tailwind v4 (atual) em vez da v3, mantendo os 3 arquivos pedidos. Validado: build OK (CSS gerado com utilitários do @theme e da config JS), typecheck OK.

#### [x] SUB-01.3: Instalação e Verificação de Ícones e Dependências Base
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 22:58, conclusão: 2026-10-11 22:59)
- **Depende de:** SUB-01.2
- **Subtarefas:** Nenhuma (atômica)
- **Critérios de Aceitação:** `lucide-react`, `clsx`, `tailwind-merge` prontos para importação.
- **Commit:** `25b9664`
- **Anotação:** Dependências lucide-react, clsx e tailwind-merge; src/lib/utils.ts com cn(...classes) = twMerge(clsx(...)) para classes condicionais sem conflito de Tailwind; App.tsx usa ícones Lucide e cn() (cards Fila, Memória, Agendador). Validado: cn('px-2 py-1', true && 'bg-brand-600', false && 'hidden', 'px-4') = 'py-1 bg-brand-600 px-4'; build e typecheck (frontend + api) OK; npm audit sem vulnerabilidades.

### [x] SUB-02: Estrutura Modular de Diretórios do Frontend
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 23:01, conclusão: 2026-10-11 23:01)
- **Depende de:** SUB-01
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar árvore de pastas: `src/components`, `src/services`, `src/hooks`, `src/types`, `src/views`, `src/styles`.
- **Critérios de Aceitação:** Diretórios criados com arquivos de exportação e organização padrão.
- **Commit:** `4b999f7`
- **Anotação:** Pastas src/components, src/services, src/hooks, src/types, src/views e src/styles, cada uma com index.ts (barrel) documentando a responsabilidade e as regras (serviços sempre filtrados por project_id, só chave anon + RLS no navegador; componentes sem acesso a dados). types/index.ts com ViewId e ProjectSlug; views/index.ts com VIEWS (Fila de Tarefas, Cérebro de Memória, Logs do Agendador, Configurações) para a navegação da SUB-12. CSS global movido para src/styles/index.css. Alias @/ -> src/ no vite.config.ts e em tsconfig.app.json (paths). src/README.md com a estrutura e convenções do produto genérico multi-projeto. Validado: build e typecheck (frontend + api) OK.

### [x] SUB-03: Configuração do Cliente Supabase e Tipagem TypeScript
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 23:02, conclusão: 2026-10-11 23:04)
- **Depende de:** SUB-02
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar cliente Supabase reutilizável em `src/services/supabase.ts` e interfaces em `src/types/database.ts` para `Task`, `AiMemory`, `AgendamentoLog`, `Project`, `ProjectMember` (multi-projeto, ver SUB-29).
- **Critérios de Aceitação:** Tipos e cliente exportados com suporte a variáveis de ambiente (sem chaves fixas no código; somente a chave anon no frontend).
- **Commit:** `14992e4`
- **Anotação:** src/types/database.ts: Database no formato do supabase gen types (Tables projects, project_members, user_roles, tasks, agendamento_tarefa_logs, ai_memories, agent_messages, project_rules; Functions match_memories, liberar_trava_task, tem_acesso_projeto, eh_administrador, ler_recados, conferir_regras) + tipos Task, AiMemory, AgendamentoLog, Project, ProjectMember, inserts/updates e enums de status. src/services/supabase.ts: getSupabase() sob demanda só com VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY (sessão persistida para o Auth da SUB-27), recusa chave service_role no navegador, supabaseConfigurado, resultado() que converte erros em ServiceError com mensagens em português, verificarConexao() (sem_config/sem_sessao/conectado/erro) e definirClienteSupabase() para testes. src/vite-env.d.ts tipa as variáveis. Testes: Vitest (npm test) com tests/unit e tests/integration/run.sh (npm run test:integration: banco temporário com 00-06, PostgREST com segredo aleatório, supabase-js real com JWTs anon/authenticated/service_role). Validado: 4 unitários + 3 de integração (RLS, código TIP-0001, tipos), build e typecheck OK.

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


### [x] SUB-32: Trocar cliente fetch por `@supabase/supabase-js` em `api/_lib`
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 22:59, conclusão: 2026-10-11 23:00)
- **Depende de:** SUB-01.1, SUB-30, SUB-07
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Depois que a SUB-01.1 criar o `package.json`, adicionar `@supabase/supabase-js` às dependências e substituir o cliente PostgREST com `fetch` de `api/_lib/supabase.ts` (usado por `queue-tools.ts` e `brain-tools.ts`) pelo `createClient` com a chave `service_role` (sem sessão persistida), mantendo as mesmas variáveis (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) e o mesmo comportamento das ferramentas MCP. Atualizar a nota da seção 3 do `AGENTS.md` e o `api/README.md`.
- **Critérios de Aceitação:** `tsc -p api/tsconfig.json` sem erros; ferramentas `task_*` e `brain_*` com o mesmo contrato e testadas novamente (mesmos cenários da SUB-30/SUB-07); nenhuma chave no código.
- **Commit:** `f7c52c6`
- **Anotação:** api/_lib/supabase.ts reescrito: db() com createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) sem sessão, fetch com timeout de 20 s e redirecionamento opcional via SUPABASE_REST_URL (testes), unwrap() que converte PostgrestError em SupabaseError, rpc(). queue-tools, brain-tools e args usam o query builder (from/select/eq/in/order/limit, insert().select().single(), upsert onConflict project_id,title, delete().is/eq().select()). Contrato das ferramentas inalterado. Achado: supabase-js 2.117 exige WebSocket nativo e quebra no Node 20 (EOL desde 2026-04), então engines.node passou a >=22.12, .nvmrc 22 e @types/node ^22. Validado com Node 22.23: build e typecheck OK; e2e contra PostgREST local: 27 cenários da fila e 36 da memória, todos OK; AGENTS.md e api/README.md atualizados.

### [ ] SUB-33: Endpoint de Embeddings para o Frontend (`api/embedding.ts`)
- **Status:** pendente (aguardando subtarefas)
- **Executor:** nenhum
- **Depende de:** SUB-07, SUB-03; subtarefas SUB-33.1 a SUB-33.12
- **Subtarefas:** (subdividida em 2026-10-11 23:38 e refinada para 12 em 2026-10-11 23:47 por DashboardAI (Grok Bot); trava liberada a pedido do usuário, filhas livres conforme dependências; a mãe só é concluída quando todas estiverem `concluido`)
  - `SUB-33.1`: `bearerToken(req)` em `api/_lib/auth.ts` (`pendente`)
  - `SUB-33.2`: `verificarSessaoSupabase(token)` em `api/_lib/auth.ts` (`pendente`)
  - `SUB-33.3`: `lerTextoEmbedding(body)` em `api/_lib/embedding-input.ts` (`pendente`)
  - `SUB-33.4`: Esqueleto do handler `api/embedding.ts` (CORS, OPTIONS, 405) (`pendente`)
  - `SUB-33.5`: Registrar `api/embedding.ts` no `vercel.json` (`pendente`)
  - `SUB-33.6`: Testes do handler: OPTIONS, 405 e 401 (`pendente`)
  - `SUB-33.7`: `criarGeradorEmbedding()` em `src/services/embeddingService.ts` (`pendente`)
  - `SUB-33.8`: Testes de `embeddingService` em `tests/unit/embeddingService.test.ts` (`pendente`)
  - `SUB-33.9`: Documentar `/api/embedding` no `api/README.md` (`pendente`)
  - `SUB-33.10`: Autenticação no handler `api/embedding.ts` (401) (`pendente`)
  - `SUB-33.11`: Corpo, geração do embedding e erros no handler (400/413/502/200) (`pendente`)
  - `SUB-33.12`: Testes do handler: 413, 502 e 200 (`pendente`)
- **Descrição:** Criar a função serverless `POST /api/embedding` que valida o JWT da sessão Supabase do usuário (`Authorization: Bearer <access_token>`, conferido no Supabase Auth com a URL e a chave do servidor) e devolve o embedding do texto enviado, usando `OPENAI_API_KEY`, `EMBEDDING_MODEL` e `EMBEDDING_API_URL` somente no servidor (reaproveitar `api/_lib/embeddings.ts`). No frontend, expor um `GeradorEmbedding` que chama esse endpoint para `buscarMemorias`/`salvarMemoria` (SUB-10).
- **Critérios de Aceitação:** 401 sem sessão ou com JWT inválido; 405 para métodos diferentes de POST; limite de tamanho do texto; resposta com vetor de 1536 dimensões; nenhuma chave no navegador; `tsc` sem erros e testes cobrindo os casos.
- **Commit:** pendente
- **Anotação:** Trava de DashboardAI (Grok Bot) (desde 2026-10-11 23:34) liberada em 2026-10-11 23:47 a pedido do usuário, sem código escrito; SUB-33.4 (endpoint) e SUB-33.6 (testes) refinadas em SUB-33.4/33.10/33.11 e SUB-33.6/33.12.

#### [ ] SUB-33.1: `bearerToken(req)` em `api/_lib/auth.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `api/_lib/auth.ts` com `export function bearerToken(headers: McpRequest['headers']): string | null` que lê `authorization` (string ou array), aceita só o esquema `Bearer` (case-insensitive) e devolve o token sem espaços; `null` se ausente/malformado. Teste em `tests/unit/api-auth.test.ts`.
- **Critérios de Aceitação:** `npm test` passa (casos: ausente, `Basic x`, `Bearer` vazio, array, ok); `npm run typecheck:api` sem erros.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-33.2: `verificarSessaoSupabase(token)` em `api/_lib/auth.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-33.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `export async function verificarSessaoSupabase(token: string, env = process.env): Promise<{ userId: string } | null>` que chama `GET ${SUPABASE_URL}/auth/v1/user` com `Authorization: Bearer <token>` e `apikey` (`SUPABASE_ANON_KEY` ou `SUPABASE_SERVICE_ROLE_KEY`), timeout 10 s; 200 com `id` -> `{ userId }`, 401/403 -> `null`, outros erros lançam `AuthError`. Testes com `fetch` simulado (`vi.stubGlobal`) em `tests/unit/api-auth.test.ts`.
- **Critérios de Aceitação:** Testes 200/401/500/timeout passam; nenhuma chave é logada ou devolvida; `typecheck:api` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-33.3: `lerTextoEmbedding(body)` em `api/_lib/embedding-input.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `api/_lib/embedding-input.ts` com `export class HttpError extends Error { status }` e `export function lerTextoEmbedding(body: unknown): string`: aceita objeto, string JSON ou Buffer; exige `texto` string não vazia (400), máximo 8.000 caracteres (413). Testes em `tests/unit/api-embedding-input.test.ts`.
- **Critérios de Aceitação:** Testes (vazio, JSON inválido, sem `texto`, longo demais, ok) passam; `typecheck:api` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-33.4: Esqueleto do handler `api/embedding.ts` (CORS, OPTIONS, 405)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `api/embedding.ts` com default export `handler(req: McpRequest, res: McpResponse)` (tipos de `api/_lib/http.ts`): cabeçalhos CORS iguais ao `api/mcp.ts` (`MCP_CORS_ORIGIN`, métodos `POST, OPTIONS`, `Authorization`), `OPTIONS` -> 204, não-POST -> 405 com `Allow: POST, OPTIONS` e JSON `{ erro }`; POST responde 501 provisório (substituído na SUB-33.11).
- **Critérios de Aceitação:** `npm run typecheck:api` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-33.5: Registrar `api/embedding.ts` no `vercel.json`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-33.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Em `vercel.json`, adicionar `"api/embedding.ts": { "maxDuration": 15 }` em `functions` (manter `api/mcp.ts` e o rewrite `/mcp`).
- **Critérios de Aceitação:** JSON válido (`node -e "JSON.parse(require('fs').readFileSync('vercel.json'))"`); build OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-33.6: Testes do handler: OPTIONS, 405 e 401
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-33.10
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `tests/unit/api-embedding.test.ts` com `req`/`res` falsos e `fetch` simulado: 204 em OPTIONS (com CORS), 405 em GET (com `Allow`), 401 sem token e 401 com JWT recusado pelo Auth.
- **Critérios de Aceitação:** `npm test` passa com os 4 casos.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-33.7: `criarGeradorEmbedding()` em `src/services/embeddingService.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-33.11
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/services/embeddingService.ts` com `export function criarGeradorEmbedding(opcoes?: { url?: string; client?: DashboardClient }): GeradorEmbedding` que obtém o `access_token` de `client.auth.getSession()`, faz `POST /api/embedding` com `{ texto }`, converte 401 em `ServiceError('Faça login para usar a busca semântica.')`, outros erros em `ServiceError` e valida 1536 números. Exportar no barrel `src/services/index.ts`.
- **Critérios de Aceitação:** `npm run typecheck` OK; sem chave de embeddings no frontend.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-33.8: Testes de `embeddingService` em `tests/unit/embeddingService.test.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-33.7
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Testes com `fetch` simulado e cliente falso (`auth.getSession`): sem sessão, 401, 500, vetor com tamanho errado, sucesso (envia `Authorization: Bearer`).
- **Critérios de Aceitação:** `npm test` passa com os 5 casos.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-33.9: Documentar `/api/embedding` no `api/README.md`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-33.11
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Seção no `api/README.md`: contrato (request/response, códigos 401/405/413/502), variáveis (`SUPABASE_URL`, `SUPABASE_ANON_KEY` ou service role, `OPENAI_API_KEY`, `EMBEDDING_MODEL`, `EMBEDDING_API_URL`) e exemplo `curl`. Anotar no detalhe da SUB-08 as variáveis novas (sem editar a SUB-08, que está com outro agente).
- **Critérios de Aceitação:** README revisado; nenhuma chave real.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-33.10: Autenticação no handler `api/embedding.ts` (401)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-33.4, SUB-33.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** No POST do handler, exigir `bearerToken` + `verificarSessaoSupabase`; ausente ou recusado -> 401 com `WWW-Authenticate: Bearer`; `AuthError` (Auth fora do ar) -> 503 com mensagem segura.
- **Critérios de Aceitação:** `npm run typecheck:api` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-33.11: Corpo, geração do embedding e erros no handler (400/413/502/200)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-33.10, SUB-33.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Após a autenticação: `lerTextoEmbedding(req.body)` (`HttpError` -> status dela), `generateEmbedding` de `api/_lib/embeddings.ts` -> 200 `{ embedding, dimensoes: 1536, modelo }`; `EmbeddingError` -> 502 com mensagem sem chave. Remove o 501 provisório da SUB-33.4.
- **Critérios de Aceitação:** `npm run typecheck:api` OK; nenhuma chave no corpo de resposta.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-33.12: Testes do handler: 413, 502 e 200
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-33.11
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Em `tests/unit/api-embedding.test.ts`, adicionar: 413 com texto longo, 400 sem `texto`, 502 quando a API de embeddings falha (sem vazar a chave) e 200 com vetor de 1536 (Auth e embeddings simulados).
- **Critérios de Aceitação:** `npm test` passa com os 4 casos novos.
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

### [x] SUB-09: Serviço de Tarefas (`src/services/taskService.ts`)
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 23:06, conclusão: 2026-10-11 23:07)
- **Depende de:** SUB-03
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Implementar operações de `listarTasks`, `criarTask`, `atualizarTask`, `alternarExecucao` (ON/OFF), `cancelarTask`, `reabrirTask` e `excluirTaskLogico`.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Funções assíncronas com tratamento de erro e ordenação por prioridade, ordem e criação.
- **Commit:** `8b6829c`
- **Anotação:** src/services/taskService.ts: listarTasks(projectId, {status, busca em código/título/instrução com curingas escapados, incluirExcluidas, limite}) ordenado por prioridade, ordem, criação e id; obterTask; criarTask (pendente, origem ui, código gerado pelo banco, dependências sem duplicatas, validação de título/instrução/prioridade 1-5/tentativas 1-20/data); atualizarTask (só campos editáveis); alternarExecucao; cancelarTask; reabrirTask (pendente, tentativas 0, ligada); concluirTaskHumana; excluirTaskLogico/restaurarTask; contarTasksPorStatus. Recusas da RLS e da guarda da fila chegam como ServiceError em português. Validado com supabase-js real contra PostgREST local: 4 cenários (ordem da fila, busca, filtros, ciclo cancelar/reabrir/excluir/restaurar, task em execução bloqueada, só humano concluído pela interface, dependência inexistente, viewer só lê, isolamento entre projetos, contagem); build e typecheck OK.

### [x] SUB-10: Serviço de Memória Semântica (`src/services/memoryService.ts`)
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 23:07, conclusão: 2026-10-11 23:08)
- **Depende de:** SUB-03
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Implementar `buscarMemoriasSimilares`, `listarMemorias`, `salvarMemoria` e `excluirMemoria`.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Integração com RPC `match_memories` e tabela `ai_memories`.
- **Commit:** `086689f`
- **Anotação:** src/services/memoryService.ts: listarMemorias(projectId, {incluirGlobais, tags, busca, limite}) sem trafegar o vetor; buscarMemoriasSimilares(slug, embedding 1536, {limiar, limite, tags, incluirGlobais}) via RPC match_memories; buscarMemorias(projeto, consulta, {gerador}) semântica quando há GeradorEmbedding, senão busca textual em título/conteúdo; salvarMemoria(projectId | null para global, {title, content, tags}) com upsert por project_id+title, tags normalizadas e embedding opcional; excluirMemoria(id) com erro claro quando a RLS não deixa. Decisão: o navegador não tem chave de embeddings; a busca semântica recebe um gerador injetável (endpoint de servidor a criar) e sem ele cai para busca textual. Validado contra PostgREST local com gerador determinístico: 3 cenários (upsert, globais, filtros, busca semântica e textual, isolamento entre projetos, viewer não grava, não-admin não grava/exclui global, editor exclui); build e typecheck OK.

### [x] SUB-11: Serviço de Logs do Agendador (`src/services/logService.ts`)
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 23:08, conclusão: 2026-10-11 23:09)
- **Depende de:** SUB-03
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Implementar consulta e filtros de histórico da tabela `agendamento_tarefa_logs`.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Listagem de histórico ordenado por `data_hora desc` com contadores de status.
- **Commit:** `c8879bb`
- **Anotação:** src/services/logService.ts: listarLogs(projectId, {status, rotina, agente, taskCodigo, desde, ate, busca em detalhes/erro/código, pagina, porPagina até 500}) ordenado por data_hora desc e id, com total exato; contarLogsPorStatus(projectId, período) usando só contagens (concluida, recusada, erro, sem_tarefa e total); ultimaExecucao(projectId) para o KPI; opcoesDeFiltro (rotinas e agentes distintos). Somente leitura: a interface não grava logs (RLS). Validado contra PostgREST local: 3 cenários (ordem, paginação, todos os filtros, data inválida, contadores, última execução, opções, isolamento entre projetos, insert negado); build e typecheck OK.

---

## 🎨 FASE 5: Interface do Usuário - Componentes Base e Layout

### [x] SUB-12: Layout Principal Responsivo (Sidebar + Header + Navegação)
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 23:04, conclusão: 2026-10-11 23:06)
- **Depende de:** SUB-01, SUB-02
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Construir o shell do Dashboard com barra lateral de navegação (Fila de Tarefas, Cérebro de Memória, Logs do Agendador, Configurações), Header com seletor de projeto, status da conexão Supabase e toggle de tema.
- **Critérios de Aceitação:** Navegação fluida entre abas/visões sem recarregar página, responsivo para desktop e mobile.
- **Commit:** `69fa615`
- **Anotação:** src/components/layout (AppLayout, Sidebar fixa no desktop e gaveta no mobile, Header, ProjectSelector, ConnectionStatus, ThemeToggle) e EmConstrucao; ProjetoProvider/useProjetoAtual (projetos visíveis pela RLS, seleção salva por slug no navegador), useNavegacao (tela no hash #/fila, #/memoria, #/logs, #/configuracoes, sem recarregar), useTema (claro/escuro/sistema salvo, classe dark no html), useConexao (verificarConexao a cada 60 s); services/projectService.listarProjetos (ativos, não excluídos); views com TELAS e placeholders que mostram o projeto selecionado. Sem Supabase configurado a app abre e explica o que falta. Validado: 6 unitários (hash/tema) + 4 de integração (listarProjetos respeita membros e projetos inativos), build e typecheck OK, screenshots headless 1280x800 e 390x844 conferidos.

### [x] SUB-13: Painel de Indicadores Gerais (KPI Cards)
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 23:17, conclusão: 2026-10-11 23:19)
- **Depende de:** SUB-09, SUB-10, SUB-11, SUB-12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Construir cards de estatísticas no topo da tela: Total de Tasks, Tasks Pendentes, Em Execução, Concluídas, Total de Memórias e Última Execução da IA.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Cards com ícones, números calculados dinamicamente e animação visual.
- **Commit:** `4af10c9`
- **Anotação:** Arquivos: src/components/kpi/KpiCards.tsx, src/hooks/{useIndicadores,useContagemAnimada}.ts, memoryService.contarMemorias, FilaView; títulos da tabela quebram linha no celular.

---

## 📋 FASE 6: Interface do Usuário - Painel da Fila de Tasks (`tasks`)

### [x] SUB-14: Tabela Avançada da Fila de Tasks
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 23:11, conclusão: 2026-10-11 23:13)
- **Depende de:** SUB-09, SUB-12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Renderizar tabela com colunas: Código, Título, Prioridade (Badges coloridos 1-5), Ordem, Dependências, ON/OFF, Status, Tentativas, Resultado e Ações.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Tabela legível, com suporte a tooltips e indicadores de progresso.
- **Commit:** `830979e`
- **Anotação:** Arquivos: src/lib/tasks.ts, src/hooks/useTasks.ts, src/components/ui/Tooltip.tsx, src/components/tasks/*, src/views/FilaView.tsx, tests/unit/tasks.test.ts.

### [x] SUB-15: Barra de Ferramentas e Filtros em Tempo Real
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 23:24, conclusão: 2026-10-11 23:26)
- **Depende de:** SUB-14
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar barra de filtros com busca textual (por código, título e instrução), filtro dropdown por status e botão de recarregamento manual.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Filtros aplicados instantaneamente na tabela sem latência perceptível.
- **Commit:** `1f94252`
- **Anotação:** Arquivos: src/components/tasks/TaskToolbar.tsx, lib/tasks.filtrarTasks (+testes), FilaView.

### [x] SUB-16: Modal de Cadastro e Edição de Task
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 23:13, conclusão: 2026-10-11 23:16)
- **Depende de:** SUB-09, SUB-12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar modal com campos: Título, Instrução (editor Markdown/textarea responsivo), Prioridade (1 a 5), Ordem, Executar Após (datetime), e Máximo de Tentativas.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Validação de campos obrigatórios, salvamento no Supabase e feedback visual de sucesso/erro.
- **Commit:** `b8486f1`
- **Anotação:** Arquivos: src/lib/taskForm.ts, src/components/ui/{Modal,Botao}.tsx, src/hooks/{ToastContext.tsx,useToast.ts}, src/components/tasks/TaskFormModal.tsx, FilaView, App (ToastProvider), tests/unit/taskForm.test.ts. Ajuste de larguras da tabela (SUB-14) para caber em 1280px.

### [x] SUB-17: Modal de Visualização Detalhada da Task
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 23:21, conclusão: 2026-10-11 23:23)
- **Depende de:** SUB-14
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Modal de visualização completa contendo instrução formatada, relatório de resultado gravado pela IA, link do PR no GitHub e SHA do commit.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Renderização rica dos metadados e botão para copiar dados com um clique.
- **Commit:** `231b665`
- **Anotação:** Arquivos: src/lib/{markdown,clipboard}.ts, src/components/ui/{Markdown,CopyButton}.tsx, src/components/tasks/TaskDetailModal.tsx, lib/tasks.taskComoMarkdown, TaskTable (código clicável), FilaView, tests/unit/markdown.test.ts.

### [x] SUB-18: Controles de Ação Rápida na Linha da Tabela
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 23:19, conclusão: 2026-10-11 23:21)
- **Depende de:** SUB-09, SUB-14
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Ações rápidas: Switch ON/OFF com persistência imediata, botão "Reabrir" (para recusadas/erros), botão "Cancelar" e botão "Excluir" com confirmação.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Ações executadas com atualização otimista ou recarregamento automático da tabela.
- **Commit:** `1e8c3a7`
- **Anotação:** Arquivos: src/hooks/useAcoesTask.ts, src/components/tasks/TaskRowActions.tsx, src/components/ui/{Switch,ConfirmDialog}.tsx, lib/tasks.acoesDisponiveis, toast com ação, useTasks.remover, FilaView.

---

## 🧠 FASE 7: Interface do Usuário - Painel de Memória Persistente (Jev-Mem)

### [ ] SUB-34: Carregamento Sob Demanda de Telas e Modais (code splitting)
- **Status:** pendente (aguardando subtarefas)
- **Executor:** nenhum
- **Depende de:** SUB-13, SUB-14, SUB-16, SUB-17, SUB-18; subtarefas SUB-34.1 a SUB-34.5
- **Subtarefas:** (subdividida em 5 em 2026-10-11 23:38 por DashboardAI (Grok Bot); a mãe só é concluída quando todas estiverem `concluido`)
  - `SUB-34.1`: Fallback `CarregandoTela` em `src/components/ui/CarregandoTela.tsx` (`pendente`)
  - `SUB-34.2`: Telas com `React.lazy` em `src/views/index.ts` e `Suspense` no `App.tsx` (`pendente`)
  - `SUB-34.3`: Modais da fila sob demanda na `src/views/FilaView.tsx` (`pendente`)
  - `SUB-34.4`: Separar dependências grandes no `vite.config.ts` (`pendente`)
  - `SUB-34.5`: Checagem de tamanho `scripts/checar-chunks.mjs` (`pendente`)
- **Descrição:** Carregar as telas (Fila, Memória, Logs, Configurações) e os modais pesados com `React.lazy` + `Suspense` (fallback leve), e separar dependências grandes (ex.: supabase-js) em chunks próprios, eliminando o aviso de bundle > 500 kB do Vite.
- **Escopo por projeto:** não altera dados; apenas o empacotamento do frontend.
- **Critérios de Aceitação:** `npm run build` sem o aviso de chunk > 500 kB; navegação e modais continuam funcionando; typecheck e testes verdes.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-34.1: Fallback `CarregandoTela` em `src/components/ui/CarregandoTela.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar componente leve (sem dependências pesadas) com esqueleto/spinner e `aria-busy`, para usar como `fallback` do `Suspense` em telas e modais.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-34.2: Telas com `React.lazy` em `src/views/index.ts` e `Suspense` no `App.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-34.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Trocar os imports estáticos de `TELAS` por `lazy(() => import('./FilaView').then((m) => ({ default: m.FilaView })))` (idem Memória, Logs, Configurações) e envolver `<Tela />` em `<Suspense fallback={<CarregandoTela />}>` no `src/App.tsx`.
- **Critérios de Aceitação:** `npm run build` gera um chunk por tela; navegação entre `#/fila`, `#/memoria`, `#/logs`, `#/configuracoes` funciona.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-34.3: Modais da fila sob demanda na `src/views/FilaView.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-34.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Carregar `TaskFormModal` e `TaskDetailModal` com `lazy` (import direto do arquivo, não do barrel `@/components/tasks`) e renderizá-los só quando abertos, dentro de `Suspense`.
- **Critérios de Aceitação:** `npm run build` gera chunks dos modais; abrir/editar/detalhar task funciona.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-34.4: Separar dependências grandes no `vite.config.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Configurar `build.rolldownOptions.output` (Vite 8/Rolldown; conferir a opção atual: `advancedChunks.groups` ou `codeSplitting`) com grupos `react`, `supabase` (`@supabase/*`) e `icons` (`lucide-react`).
- **Critérios de Aceitação:** `npm run build` mostra os chunks `react`, `supabase` e `icons`; app abre no `vite preview`.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-34.5: Checagem de tamanho `scripts/checar-chunks.mjs`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-34.2, SUB-34.3, SUB-34.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `scripts/checar-chunks.mjs` (Node, sem dependências) que lê `dist/assets/*.js` e falha se algum passar de 500 kB; adicionar `"check:chunks"` no `package.json`.
- **Critérios de Aceitação:** `npm run build && npm run check:chunks` passa sem o aviso de chunk > 500 kB; `npm test` OK.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-19: Interface de Pesquisa Semântica Vetorial
- **Status:** pendente (aguardando subtarefas)
- **Executor:** nenhum
- **Depende de:** SUB-10, SUB-12, SUB-33; subtarefas SUB-19.1 a SUB-19.9
- **Subtarefas:** (subdividida em 8 em 2026-10-11 23:38 por DashboardAI (Grok Bot); a mãe só é concluída quando todas estiverem `concluido`; refinada para 9 em 2026-10-11 23:51)
  - `SUB-19.1`: `debounce(fn, ms)` em `src/lib/debounce.ts` (`pendente`)
  - `SUB-19.2`: Hook `useDebounce(valor, ms)` em `src/hooks/useDebounce.ts` (`pendente`)
  - `SUB-19.3`: `formatarSimilaridade` e `classeSimilaridade` em `src/lib/similaridade.ts` (`pendente`)
  - `SUB-19.4`: Componente `SimilaridadeBadge` em `src/components/memoria/` (`pendente`)
  - `SUB-19.5`: Componente `ResultadoBuscaCard` em `src/components/memoria/` (`pendente`)
  - `SUB-19.6`: Hook `useBuscaSemantica` em `src/hooks/useBuscaSemantica.ts` (`pendente`)
  - `SUB-19.7`: Painel `BuscaSemanticaPanel` (campo, grade e estados) (`pendente`)
  - `SUB-19.8`: Integrar a busca na `src/views/MemoriaView.tsx` (`pendente`)
  - `SUB-19.9`: `BuscaControles` (limiar, globais, modo) em `src/components/memoria/BuscaControles.tsx` (`pendente`)
- **Descrição:** Criar componente de busca semântica onde o usuário insere uma consulta e o sistema busca memórias similares via RPC `match_memories`, exibindo a porcentagem de similaridade.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Campo de busca com debounce, exibição de cards de resultado com badge de similaridade (ex: 89%).
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-19.1: `debounce(fn, ms)` em `src/lib/debounce.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/lib/debounce.ts` com `export function debounce<A extends unknown[]>(fn: (...a: A) => void, ms: number): ((...a: A) => void) & { cancelar(): void }`. Testes com `vi.useFakeTimers()` em `tests/unit/debounce.test.ts`.
- **Critérios de Aceitação:** `npm test` passa (chama 1x após `ms`, reinicia o timer, `cancelar` impede); `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-19.2: Hook `useDebounce(valor, ms)` em `src/hooks/useDebounce.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-19.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/hooks/useDebounce.ts`: `export function useDebounce<T>(valor: T, ms = 400): T` (usa `setTimeout`/cleanup no `useEffect`). Exportar em `src/hooks/index.ts`.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-19.3: `formatarSimilaridade` e `classeSimilaridade` em `src/lib/similaridade.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/lib/similaridade.ts`: `formatarSimilaridade(0.894) === '89%'` (limita 0-100, arredonda) e `classeSimilaridade(s)` com classes Tailwind (>= 0.85 verde, >= 0.7 âmbar, senão cinza, com variantes `dark:`). Testes em `tests/unit/similaridade.test.ts`.
- **Critérios de Aceitação:** `npm test` passa; `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-19.4: Componente `SimilaridadeBadge` em `src/components/memoria/`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-19.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/memoria/SimilaridadeBadge.tsx` (`{ similaridade: number }` -> pílula com `formatarSimilaridade` + `classeSimilaridade`, `title` acessível "Similaridade de 89%"). Criar/atualizar `src/components/memoria/index.ts` sem remover exports de outros agentes (SUB-21 pode usar a mesma pasta).
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-19.5: Componente `ResultadoBuscaCard` em `src/components/memoria/`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-19.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/memoria/ResultadoBuscaCard.tsx` com props `{ titulo, conteudo, tags, similaridade?: number, global: boolean, atualizadoEm }`: título, resumo do conteúdo (`resumo()` de `src/lib/tasks.ts`, 200 caracteres), chips de tags, selo "Global" e `SimilaridadeBadge` quando houver similaridade.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-19.6: Hook `useBuscaSemantica` em `src/hooks/useBuscaSemantica.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-19.2, SUB-33.7
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/hooks/useBuscaSemantica.ts`: `useBuscaSemantica(projeto, consulta, { limiar, incluirGlobais })` -> `{ resultado: ResultadoBusca | null, carregando, erro }`, usando `useDebounce(consulta, 400)`, `buscarMemorias` (SUB-10) com `gerador: criarGeradorEmbedding()`, ignorando respostas antigas (contador de requisição) e sem buscar com texto vazio.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-19.7: Painel `BuscaSemanticaPanel` (campo, grade e estados)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-19.5, SUB-19.6, SUB-19.9
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/memoria/BuscaSemanticaPanel.tsx` que só compõe: campo de busca, `BuscaControles` (SUB-19.9), grade responsiva de `ResultadoBuscaCard` e estados carregando/vazio/erro, usando `useBuscaSemantica`.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK; screenshot 1280x800 e 390x844.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-19.8: Integrar a busca na `src/views/MemoriaView.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-19.7, SUB-21.9
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar a seção "Busca semântica" (`BuscaSemanticaPanel` com o projeto de `useProjetoAtual`) no topo da `MemoriaView`, acima da grade. Depende da SUB-21.9, que cria a tela (área reservada no topo).
- **Critérios de Aceitação:** `npm run typecheck`, `npm run build` e `npm test` OK; navegação `#/memoria` funciona.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-19.9: `BuscaControles` (limiar, globais, modo) em `src/components/memoria/BuscaControles.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Componente controlado `{ limiar, onLimiar, incluirGlobais, onIncluirGlobais, modo?: 'semantica'|'texto' }`: controle de limiar 0,5–0,95 com valor em %, checkbox incluir globais e selo do modo da última busca.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-20: Formulário de Nova Memória Canônica
- **Status:** pendente (aguardando subtarefas)
- **Executor:** nenhum
- **Depende de:** SUB-10, SUB-12, SUB-33; subtarefas SUB-20.1 a SUB-20.8
- **Subtarefas:** (subdividida em 7 em 2026-10-11 23:38 por DashboardAI (Grok Bot); a mãe só é concluída quando todas estiverem `concluido`; refinada para 8 em 2026-10-11 23:51)
  - `SUB-20.1`: `validarMemoria(dados)` em `src/lib/memoriaForm.ts` (`pendente`)
  - `SUB-20.2`: `parseTags(texto)` em `src/lib/memoriaForm.ts` (`pendente`)
  - `SUB-20.3`: `sugerirTags(titulo, conteudo)` em `src/lib/memoriaForm.ts` (`pendente`)
  - `SUB-20.4`: Componente `TagInput` em `src/components/ui/TagInput.tsx` (`pendente`)
  - `SUB-20.5`: Hook `useSalvarMemoria` em `src/hooks/useSalvarMemoria.ts` (`pendente`)
  - `SUB-20.6`: Modal `MemoriaFormModal` em `src/components/memoria/` (`pendente`)
  - `SUB-20.7`: Botão "Nova memória" na `src/views/MemoriaView.tsx` (`pendente`)
  - `SUB-20.8`: `MarkdownEditor` em `src/components/ui/MarkdownEditor.tsx` (`pendente`)
- **Descrição:** Componente para adicionar nova memória: Título único, Conteúdo estruturado em Markdown e Tags de categorização.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Criação persistida no banco Supabase com geração de tags dinâmicas.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-20.1: `validarMemoria(dados)` em `src/lib/memoriaForm.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/lib/memoriaForm.ts` com `export function validarMemoria({ titulo, conteudo, tags }): Partial<Record<'titulo'|'conteudo'|'tags', string>>` (título obrigatório até 200, conteúdo obrigatório, até 20 tags de até 40 caracteres). Testes em `tests/unit/memoriaForm.test.ts`.
- **Critérios de Aceitação:** `npm test` passa; `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-20.2: `parseTags(texto)` em `src/lib/memoriaForm.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-20.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `export function parseTags(texto: string): string[]`: separa por vírgula, espaço ou `#`, minúsculas, remove vazios e duplicados (mesma regra de `normalizarTags` do `memoryService`). Testes no mesmo arquivo de teste.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-20.3: `sugerirTags(titulo, conteudo)` em `src/lib/memoriaForm.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-20.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `export function sugerirTags(titulo: string, conteudo: string, max = 5): string[]`: palavras com 4+ letras, sem stopwords em português/inglês e sem Markdown, ordenadas por frequência (título vale 2x). É a "geração de tags dinâmicas". Testes.
- **Critérios de Aceitação:** `npm test` passa (determinístico).
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-20.4: Componente `TagInput` em `src/components/ui/TagInput.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-20.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/ui/TagInput.tsx` com props `{ valor: string[]; onChange; sugestoes?: string[]; erro?: string }`: chips removíveis, adiciona com Enter/vírgula usando `parseTags`, Backspace remove o último, sugestões clicáveis.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-20.5: Hook `useSalvarMemoria` em `src/hooks/useSalvarMemoria.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-33.7
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/hooks/useSalvarMemoria.ts`: `{ salvar(projectId | null, dados): Promise<Memoria | null>, salvando }` chamando `salvarMemoria` (SUB-10) com `gerador: criarGeradorEmbedding()`, toast de sucesso/erro (`useToast`). Se o gerador falhar, salva sem vetor e avisa.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-20.6: Modal `MemoriaFormModal` em `src/components/memoria/`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-20.1, SUB-20.3, SUB-20.4, SUB-20.5, SUB-20.8
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/memoria/MemoriaFormModal.tsx` (usa `Modal`/`Botao`): Título, Conteúdo com `MarkdownEditor` (SUB-20.8), Tags (`TagInput` + `sugerirTags`), opção "Memória global" (erro da RLS exibido no modal). Validação com `validarMemoria`; `onSalvo(memoria)`.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK; screenshot do modal.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-20.7: Botão "Nova memória" na `src/views/MemoriaView.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-20.6, SUB-19.8, SUB-21.9
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar botão "Nova memória" no cabeçalho da `MemoriaView` que abre o `MemoriaFormModal` e recarrega a grade (`recarregar` do `useMemorias`, SUB-21.3/21.9) e a busca após salvar. Depende da SUB-19.8 para editar a view em sequência.
- **Critérios de Aceitação:** `npm run typecheck`, `npm run build` e `npm test` OK; memória criada aparece na grade (teste manual contra banco local).
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-20.8: `MarkdownEditor` em `src/components/ui/MarkdownEditor.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Componente `{ valor, onChange, erro?, rotulo }`: abas Escrever/Pré-visualizar, textarea com contador de caracteres e pré-visualização com `components/ui/Markdown` (sem HTML cru).
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-21: Grid de Gerenciamento e Exclusão de Memórias
- **Status:** pendente (aguardando subtarefas)
- **Executor:** nenhum
- **Depende de:** SUB-10, SUB-12; subtarefas SUB-21.1 a SUB-21.12
- **Subtarefas:** (subdividida em 10 em 2026-10-11 23:47 por DashboardAI (Grok Bot) a pedido do usuário; a mãe só é concluída quando todas estiverem `concluido`; refinada para 12 em 2026-10-11 23:51)
  - `SUB-21.1`: `memoriaComoMarkdown` e `escopoMemoria` em `src/lib/memorias.ts` (`pendente`)
  - `SUB-21.2`: `filtrarMemoriasLocal` e `tagsDisponiveis` em `src/lib/memorias.ts` (`pendente`)
  - `SUB-21.3`: Hook `useMemorias` em `src/hooks/useMemorias.ts` (`pendente`)
  - `SUB-21.4`: Componente `MemoriaCard` em `src/components/memoria/MemoriaCard.tsx` (`pendente`)
  - `SUB-21.5`: Componente `MemoriaGrid` em `src/components/memoria/MemoriaGrid.tsx` (`pendente`)
  - `SUB-21.6`: Modal `MemoriaDetailModal` em `src/components/memoria/MemoriaDetailModal.tsx` (`pendente`)
  - `SUB-21.7`: Hook `useExcluirMemoria` em `src/hooks/useExcluirMemoria.ts` (`pendente`)
  - `SUB-21.8`: Barra `MemoriaToolbar` em `src/components/memoria/MemoriaToolbar.tsx` (`pendente`)
  - `SUB-21.9`: Montar a `MemoriaView` (toolbar + grade) (`pendente`)
  - `SUB-21.10`: Validação visual da SUB-21 (screenshots) (`pendente`)
  - `SUB-21.11`: Ligar detalhe e exclusão na `MemoriaView` (`pendente`)
  - `SUB-21.12`: Conferir exclusão com editor e viewer (`pendente`)
- **Descrição:** Exibição em cartões de todas as memórias cadastradas, com botão para copiar conteúdo Markdown, visualizar detalhes e excluir memória.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Grid responsivo com paginação/scroll e feedback de exclusão.
- **Commit:** pendente
- **Anotação:** Reserva liberada a pedido do usuário antes do início da implementação; disponível para outro agente.

#### [ ] SUB-21.1: `memoriaComoMarkdown` e `escopoMemoria` em `src/lib/memorias.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/lib/memorias.ts` com `memoriaComoMarkdown(m: Memoria): string` (`# título`, linha de tags, escopo, conteúdo) e `escopoMemoria(m): 'global' | 'projeto'` (`project_id` nulo = global). Testes em `tests/unit/memorias.test.ts`.
- **Critérios de Aceitação:** `npm test` passa; `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-21.2: `filtrarMemoriasLocal` e `tagsDisponiveis` em `src/lib/memorias.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-21.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `filtrarMemoriasLocal(memorias, { busca, tag, escopo: 'todas'|'projeto'|'global' })` (busca sem acento/maiúsculas em título, conteúdo e tags) e `tagsDisponiveis(memorias): { tag, total }[]` ordenado por total. Testes no mesmo arquivo.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-21.3: Hook `useMemorias` em `src/hooks/useMemorias.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `useMemorias(projectId, { porPagina = 30 })` -> `{ memorias, carregando, erro, temMais, carregarMais, recarregar, remover(id), reinserir(memoria) }` usando `listarMemorias` (SUB-10) com `limite` crescente (`temMais` = veio o limite cheio); ignora respostas de projeto antigo. Exportar em `src/hooks/index.ts`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-21.4: Componente `MemoriaCard` em `src/components/memoria/MemoriaCard.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-21.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Cartão com título, selo Global/Projeto, chips de tags, resumo do conteúdo (`resumo()` de `src/lib/tasks.ts`, 220 caracteres), atualização relativa (`tempoRelativo`) e botões Copiar (`CopyButton` com `memoriaComoMarkdown`), Ver e Excluir (callbacks `onVer`/`onExcluir`). Criar/atualizar `src/components/memoria/index.ts` sem remover exports de outras subtarefas (SUB-19.4).
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-21.5: Componente `MemoriaGrid` em `src/components/memoria/MemoriaGrid.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-21.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Grade responsiva (1/2/3 colunas) de `MemoriaCard`, esqueletos de carregamento, estado vazio (com texto diferente para filtro ativo) e botão "Carregar mais" quando `temMais`.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-21.6: Modal `MemoriaDetailModal` em `src/components/memoria/MemoriaDetailModal.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-21.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Modal (`components/ui/Modal`) com conteúdo renderizado por `components/ui/Markdown` (abas Formatado/Texto), tags, escopo, datas de criação/atualização, autor (`criado_por`), botão Copiar tudo (`memoriaComoMarkdown`) e botão Excluir (`onExcluir`).
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-21.7: Hook `useExcluirMemoria` em `src/hooks/useExcluirMemoria.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-21.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Exclusão com remoção otimista: recebe `remover`/`reinserir` do `useMemorias`, chama `excluirMemoria` (SUB-10), reinsere e mostra toast de erro se a RLS recusar; toast de sucesso. Expõe `{ excluir(memoria), excluindo }`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-21.8: Barra `MemoriaToolbar` em `src/components/memoria/MemoriaToolbar.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-21.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Busca instantânea, filtro por tag (`tagsDisponiveis`), escopo (todas/projeto/globais), contador filtradas/total e botão Recarregar.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-21.9: Montar a `MemoriaView` (toolbar + grade)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-21.3, SUB-21.5, SUB-21.8
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Substituir o `EmConstrucao` da `src/views/MemoriaView.tsx`: projeto de `useProjetoAtual`, `useMemorias`, `MemoriaToolbar` + `filtrarMemoriasLocal` e `MemoriaGrid`. Deixar uma área no topo para a busca semântica (SUB-19.8) e espaço no cabeçalho para o botão "Nova memória" (SUB-20.7). Detalhe e exclusão entram na SUB-21.11.
- **Critérios de Aceitação:** `npm run typecheck`, `npm run build` e `npm test` OK; `#/memoria` mostra a grade.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-21.10: Validação visual da SUB-21 (screenshots)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-21.11
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Contra o banco local (`tests/integration/run.sh` + `vite`), conferir a grade, copiar e detalhes em 1280x800 e 390x844; registrar na anotação da SUB-21.
- **Critérios de Aceitação:** Screenshots conferidos; nenhum erro no console.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-21.11: Ligar detalhe e exclusão na `MemoriaView`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-21.9, SUB-21.6, SUB-21.7
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Na `src/views/MemoriaView.tsx`: `onVer` abre `MemoriaDetailModal`; `onExcluir` (cartão ou modal) abre `ConfirmDialog` e chama `useExcluirMemoria`.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-21.12: Conferir exclusão com editor e viewer
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-21.11
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Contra o banco local: editor exclui (some da grade, toast de sucesso); viewer tenta excluir e a memória é reinserida com toast de erro. Registrar na anotação da SUB-21.
- **Critérios de Aceitação:** Checklist registrado.
- **Commit:** pendente
- **Anotação:** pendente

---

## ⏱️ FASE 8: Interface do Usuário - Monitor do Agendador e Telemetria

### [x] SUB-22: Visualizador de Logs de Execução da IA
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (início: 2026-10-11 23:26, conclusão: 2026-10-11 23:27)
- **Depende de:** SUB-11, SUB-12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Aba com linha do tempo de execuções lidas de `agendamento_tarefa_logs`, mostrando data/hora, status (`concluida`, `recusada`, `erro`, `sem_tarefa`), nome da rotina e detalhes.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Lista visual cronológica com badges de status e tempo de execução.
- **Commit:** `a88f12d`
- **Anotação:** Arquivos: src/lib/logs.ts (+testes), src/hooks/useLogs.ts, src/views/LogsView.tsx.

### [ ] SUB-23: Diagnóstico de Travas e Saúde da Fila
- **Status:** pendente (aguardando subtarefas)
- **Executor:** nenhum
- **Depende de:** SUB-09, SUB-11, SUB-12; subtarefas SUB-23.1 a SUB-23.12
- **Subtarefas:** (subdividida em 9 em 2026-10-11 23:38 por DashboardAI (Grok Bot); a mãe só é concluída quando todas estiverem `concluido`; refinada para 12 em 2026-10-11 23:51)
  - `SUB-23.1`: `minutosDeTrava` e `travaExpirada` em `src/lib/saudeFila.ts` (`pendente`)
  - `SUB-23.2`: `classificarPendentes(tasks)` em `src/lib/saudeFila.ts` (`pendente`)
  - `SUB-23.3`: `diagnosticarFila(tasks)` em `src/lib/saudeFila.ts` (`pendente`)
  - `SUB-23.4`: `liberarTrava()` em `src/services/taskService.ts` (`pendente`)
  - `SUB-23.5`: Teste de integração de `liberarTrava`: expirada e forçada (`pendente`)
  - `SUB-23.6`: Hook `useSaudeFila` em `src/hooks/useSaudeFila.ts` (`pendente`)
  - `SUB-23.7`: Painel `SaudeFilaPanel` (composição) em `src/components/tasks/SaudeFilaPanel.tsx` (`pendente`)
  - `SUB-23.8`: Integrar `SaudeFilaPanel` na `src/views/LogsView.tsx` (`pendente`)
  - `SUB-23.9`: Alerta de trava presa na `src/views/FilaView.tsx` (`pendente`)
  - `SUB-23.10`: `TravaItem` em `src/components/tasks/TravaItem.tsx` (`pendente`)
  - `SUB-23.11`: `PendentesResumo` em `src/components/tasks/PendentesResumo.tsx` (`pendente`)
  - `SUB-23.12`: Teste de integração de `liberarTrava`: viewer e outro projeto (`pendente`)
- **Descrição:** Painel indicando se há lock ativo (task com `trava_frente` e `trava_em` dentro dos 90 minutos) e botão de liberação manual de trava caso expire.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Alerta visual se uma task estiver presa além do tempo limite.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-23.1: `minutosDeTrava` e `travaExpirada` em `src/lib/saudeFila.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/lib/saudeFila.ts` com `LIMITE_TRAVA_MIN = 90`, `minutosDeTrava(task: Pick<Task,'trava_em'>, agora = Date.now()): number | null` e `travaExpirada(task, agora, limite = 90): boolean`. Testes em `tests/unit/saudeFila.test.ts`.
- **Critérios de Aceitação:** `npm test` passa (sem trava, 10 min, 91 min, data inválida).
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-23.2: `classificarPendentes(tasks)` em `src/lib/saudeFila.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-23.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `classificarPendentes(tasks: Task[], agora)` -> `{ prontas, bloqueadas_dependencia, desligadas, agendadas, sem_tentativas }` para tasks `pendente` não excluídas (usa `dependenciasDa`/`bloqueadaPorDependencia` de `src/lib/tasks.ts`; `executar=false` desligada; `executar_apos` futuro agendada; `tentativas >= max_tentativas`). Testes.
- **Critérios de Aceitação:** `npm test` passa com um caso de cada grupo.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-23.3: `diagnosticarFila(tasks)` em `src/lib/saudeFila.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-23.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `diagnosticarFila(tasks, agora, limite = 90)` -> `{ travas: { task, minutos, expirada }[], pendentes: ReturnType<classificarPendentes>, alerta: boolean }` (travas = tasks `em_execucao`, ordenadas pela mais antiga; `alerta` = alguma expirada). Testes.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-23.4: `liberarTrava()` em `src/services/taskService.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `export async function liberarTrava(projectId: number, id: number, forcar = false, client = getSupabase()): Promise<Task>` que confere se a task é do projeto (`obterTask`) e chama a RPC `liberar_trava_task({ p_task_id, p_forcar })`, com erro em português via `resultado()`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-23.5: Teste de integração de `liberarTrava`: expirada e forçada
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-23.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Em `tests/integration/taskService.integration.test.ts`: task travada há 100 min (via `service_role`) é liberada por editor; trava recente é recusada sem `forcar` e liberada com `forcar`.
- **Critérios de Aceitação:** `npm run test:integration` passa (ou o teste fica skipped sem PostgREST, e `npm test` segue verde).
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-23.6: Hook `useSaudeFila` em `src/hooks/useSaudeFila.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-23.3, SUB-23.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/hooks/useSaudeFila.ts`: recebe `tasks` e `recarregar` (de `useTasks`), recalcula `diagnosticarFila` a cada 30 s (relógio), expõe `liberar(task, forcar)` com toast e recarregamento, e `liberando`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-23.7: Painel `SaudeFilaPanel` (composição) em `src/components/tasks/SaudeFilaPanel.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-23.10, SUB-23.11
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Compor o painel: título, lista de `TravaItem` (SUB-23.10) ou mensagem "Nenhuma trava ativa", e `PendentesResumo` (SUB-23.11). Exportar em `src/components/tasks/index.ts`.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-23.8: Integrar `SaudeFilaPanel` na `src/views/LogsView.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-23.7
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Na `LogsView`, carregar `useTasks(projeto.id)` e exibir o `SaudeFilaPanel` acima da linha do tempo de logs.
- **Critérios de Aceitação:** `npm run typecheck`, `npm run build` e `npm test` OK; screenshot.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-23.9: Alerta de trava presa na `src/views/FilaView.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-23.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Na `FilaView`, calcular `diagnosticarFila(tasks)` e, se `alerta`, mostrar faixa de aviso (role=alert) "N task(s) presa(s) há mais de 90 min" com link para `#/logs`.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-23.10: `TravaItem` em `src/components/tasks/TravaItem.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-23.6
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Linha de uma trava: código, título, agente (`trava_frente`), minutos, destaque vermelho se expirada, botão "Liberar trava" com `ConfirmDialog` (forçar só com aviso extra quando não expirou), chamando `liberar(task, forcar)` do `useSaudeFila`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-23.11: `PendentesResumo` em `src/components/tasks/PendentesResumo.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-23.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Contadores das pendentes por grupo (`classificarPendentes`: prontas, bloqueadas por dependência, desligadas, agendadas, sem tentativas) com ícones e tooltips.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-23.12: Teste de integração de `liberarTrava`: viewer e outro projeto
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-23.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Em `tests/integration/taskService.integration.test.ts`: viewer é recusado ao liberar trava; task de outro projeto é recusada por `liberarTrava(projectId errado, id)`.
- **Critérios de Aceitação:** `npm run test:integration` passa (skipped sem PostgREST; `npm test` segue verde).
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
- **Status:** pendente (aguardando subtarefas)
- **Executor:** nenhum
- **Depende de:** SUB-01 a SUB-24; subtarefas SUB-25.1 a SUB-25.7
- **Subtarefas:** (subdividida em 4 em 2026-10-11 23:38 por DashboardAI (Grok Bot); a mãe só é concluída quando todas estiverem `concluido`; refinada para 6 em 2026-10-11 23:51)
  - `SUB-25.1`: Script `scripts/validar.sh` + `npm run validar` (`pendente`)
  - `SUB-25.2`: Rodar `npm ci` + `npm run validar` e registrar em `docs/VALIDACAO.md` (`pendente`)
  - `SUB-25.3`: Rodar `database/tests/run_tests.sh` (`pendente`)
  - `SUB-25.4`: Teste rápido local: telas Fila e Logs (`pendente`)
  - `SUB-25.6`: Rodar `npm run test:integration` (`pendente`)
  - `SUB-25.7`: Teste rápido local: telas Memória e Configurações (`pendente`)
- **Descrição:** Rodar compilação de produção (`npm run build`), validar ausência de erros de tipagem TypeScript e verificar integridade de pacotes.
- **Critérios de Aceitação:** Build gerado com sucesso na pasta `dist/` sem alertas impeditivos.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-25.1: Script `scripts/validar.sh` + `npm run validar`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `scripts/validar.sh` (bash, `set -euo pipefail`) que roda em sequência: `npm run typecheck`, `npm test`, `npm run build`, `npm run check:chunks` (se existir), `python3 -m unittest discover -s scripts` e `npm audit --omit=dev --audit-level=high`, com resumo final. Adicionar `"validar"` no `package.json`.
- **Critérios de Aceitação:** `npm run validar` executa no estado atual e mostra o resumo (falhas pendentes de outras tasks são relatadas, não escondidas).
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-25.2: Rodar `npm ci` + `npm run validar` e registrar em `docs/VALIDACAO.md`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-25.1, SUB-08, SUB-19, SUB-20, SUB-21, SUB-23, SUB-27 (inclui SUB-27.22), SUB-33, SUB-34
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Com todas as tasks anteriores concluídas, rodar `npm ci && npm run validar` e registrar o resultado em `docs/VALIDACAO.md` (versões de Node/npm, tamanhos dos chunks, nº de testes). **Sem corrigir nada aqui:** cada falha encontrada vira uma subtarefa nova (SUB-25.8, 25.9…), atômica, criada no quadro com lock + commit + push.
- **Critérios de Aceitação:** `docs/VALIDACAO.md` criado; falhas (se houver) cadastradas como SUB-25.8+.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-25.3: Rodar `database/tests/run_tests.sh`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-25.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Rodar a suíte do banco (`database/tests/run_tests.sh`: PostgreSQL + pgvector local) e anexar o resultado ao `docs/VALIDACAO.md`.
- **Critérios de Aceitação:** Suíte do banco verde; resultado registrado.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-25.4: Teste rápido local: telas Fila e Logs
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-25.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Subir `npm run preview` contra o banco local e conferir as telas Fila e Logs em 1280x800 e 390x844; registrar no `docs/VALIDACAO.md` (sem commitar screenshots grandes).
- **Critérios de Aceitação:** Sem erros no console; checklist registrado.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-25.6: Rodar `npm run test:integration`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-25.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Rodar a integração do frontend (`tests/integration/run.sh`: PostgreSQL + pgvector + PostgREST locais) e anexar o resultado ao `docs/VALIDACAO.md`.
- **Critérios de Aceitação:** Testes de integração verdes; resultado registrado.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-25.7: Teste rápido local: telas Memória e Configurações
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-25.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Com `npm run preview` contra o banco local, conferir as telas Memória e Configurações em 1280x800 e 390x844; registrar no `docs/VALIDACAO.md`.
- **Critérios de Aceitação:** Sem erros no console; checklist registrado.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-26: Documentação Completa e Manual Operacional no `README.md`
- **Status:** pendente (aguardando subtarefas)
- **Executor:** nenhum
- **Depende de:** SUB-25; subtarefas SUB-26.1 a SUB-26.10
- **Subtarefas:** (subdividida em 9 em 2026-10-11 23:38 por DashboardAI (Grok Bot); a mãe só é concluída quando todas estiverem `concluido`; refinada para 10 em 2026-10-11 23:51)
  - `SUB-26.1`: Esqueleto do `README.md` (`pendente`)
  - `SUB-26.2`: Seção Arquitetura (`pendente`)
  - `SUB-26.3`: Seção Execução local (`pendente`)
  - `SUB-26.4`: Seção Banco de dados (`pendente`)
  - `SUB-26.5`: Seção Deploy na Vercel (`pendente`)
  - `SUB-26.6`: Seção Agentes de IA: configurar clientes MCP (`pendente`)
  - `SUB-26.7`: Seção Memória via MCP (`pendente`)
  - `SUB-26.8`: Seção Segurança (`pendente`)
  - `SUB-26.9`: Revisão final do README (`pendente`)
  - `SUB-26.10`: Seção Agentes de IA: exemplos do ciclo da fila (`pendente`)
- **Descrição:** Documentar no `README.md` a arquitetura da solução, guia de execução local, deploy na Vercel e instruções para agentes de IA operarem a fila e a memória.
- **Critérios de Aceitação:** Documentação clara, completa e em conformidade com as regras do projeto.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-26.1: Esqueleto do `README.md`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Reescrever o `README.md` com título, descrição do produto genérico multi-projeto, badges simples e sumário com âncoras para as seções: Arquitetura, Execução local, Banco de dados, Deploy na Vercel, Agentes de IA (fila via MCP), Memória via MCP, Segurança, Validação. Cada seção com um parágrafo provisório.
- **Critérios de Aceitação:** Markdown renderiza no GitHub; âncoras do sumário funcionam.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-26.2: Seção Arquitetura
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-26.1, SUB-33
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Descrever SPA Vite/React (`src/`), funções Vercel (`api/mcp.ts`, `api/embedding.ts`), Supabase (Postgres + pgvector + RLS) e scripts; diagrama em texto/Mermaid do fluxo agente -> MCP -> RPCs.
- **Critérios de Aceitação:** Seção completa, sem placeholders.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-26.3: Seção Execução local
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-26.1, SUB-08, SUB-25
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Node 22 (`.nvmrc`), `npm ci`, copiar `.env.example`, `npm run dev`, `npm test`, `npm run test:integration`, `npm run validar`.
- **Critérios de Aceitação:** Comandos conferidos contra o `package.json`.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-26.4: Seção Banco de dados
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-26.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Como aplicar `database/00`–`06` no Supabase (SQL editor ou `psql`), criar projeto e membros (`projects`, `project_members`, `user_roles`), e rodar `database/tests/run_tests.sh`. Referenciar `database/README.md`.
- **Critérios de Aceitação:** Seção completa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-26.5: Seção Deploy na Vercel
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-26.1, SUB-08, SUB-33
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Node 22 no projeto Vercel, variáveis de frontend (`VITE_*`) e de servidor (Supabase, OpenAI/embeddings, `MCP_*`), rewrite `/mcp`, limites de `maxDuration`.
- **Critérios de Aceitação:** Lista de variáveis igual ao `.env.example`.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-26.6: Seção Agentes de IA: configurar clientes MCP
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-26.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Como configurar o MCP em clientes (Claude Code, Codex etc.) com `Authorization: Bearer <MCP_AUTH_TOKEN>`, URL `/mcp`, argumento `project` e protocolo do quadro (`AGENTS.md`).
- **Critérios de Aceitação:** Configuração conferida com `api/mcp.ts`.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-26.7: Seção Memória via MCP
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-26.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** `brain_store`, `brain_search`, `brain_delete`, memórias globais vs. por projeto, limiar e tags; exemplos.
- **Critérios de Aceitação:** Exemplos conferidos com `api/_lib/brain-tools.ts`.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-26.8: Seção Segurança
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-26.1, SUB-27.13, SUB-27.17, SUB-27.21
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Somente a chave anon no navegador, service_role e chaves de IA só no servidor, RLS por projeto e papéis, `MCP_AUTH_TOKEN` obrigatório para ferramentas de dados, login (SUB-27.13; configuração do Auth na SUB-27.17 e primeiro administrador na SUB-27.21) e rotação de chaves.
- **Critérios de Aceitação:** Seção completa e coerente com `database/05_rls_policies.sql`.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-26.9: Revisão final do README
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-26.2, SUB-26.3, SUB-26.4, SUB-26.5, SUB-26.6, SUB-26.7, SUB-26.8, SUB-26.10, SUB-25
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Remover placeholders, conferir links e comandos, incluir a seção Validação com o resultado da SUB-25.
- **Critérios de Aceitação:** Nenhum placeholder; links válidos.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-26.10: Seção Agentes de IA: exemplos do ciclo da fila
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-26.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Exemplos JSON-RPC de `task_next` -> trabalho -> `task_finish` (concluida/recusada/erro) e de `task_list`/`task_create`.
- **Critérios de Aceitação:** Exemplos conferidos com `api/_lib/queue-tools.ts`.
- **Commit:** pendente
- **Anotação:** pendente

### [🔄] SUB-27: Autenticação e Login com Supabase Auth
- **Status:** em_execucao
- **Executor:** Codex (OpenAI) (início: 2026-10-11 22:27)
- **Depende de:** SUB-03, SUB-29 (papéis `user_roles`/`project_members` e RLS); subtarefas SUB-27.1 a SUB-27.22
- **Subtarefas:** (subdividida em 18 em 2026-10-11 23:41 por DashboardAI (Grok Bot) **a pedido do usuário**; todas **reservadas para Codex (OpenAI) — SUB-27 travada**; a mãe só é concluída quando todas estiverem `concluido`; refinada para 22 em 2026-10-11 23:51)
  - `SUB-27.1`: `mensagemErroAuth(erro)` em `src/lib/auth.ts` (`pendente`, reservada)
  - `SUB-27.2`: `validarLogin({ email, senha })` em `src/lib/auth.ts` (`pendente`, reservada)
  - `SUB-27.3`: `entrarComSenha(email, senha)` em `src/services/authService.ts` (`pendente`, reservada)
  - `SUB-27.4`: `sair()` e `obterSessao()` em `src/services/authService.ts` (`pendente`, reservada)
  - `SUB-27.5`: `enviarLinkMagico()` e `redefinirSenha()` em `src/services/authService.ts` (`pendente`, reservada)
  - `SUB-27.6`: Testes unitários de `authService` em `tests/unit/authService.test.ts` (`pendente`, reservada)
  - `SUB-27.7`: `obterPapelGlobal()` e `papelNoProjeto()` em `src/services/authService.ts` (`pendente`, reservada)
  - `SUB-27.8`: Teste de integração dos papéis em `tests/integration/authService.integration.test.ts` (`pendente`, reservada)
  - `SUB-27.9`: `AuthProvider` e `useAuth` em `src/hooks/AuthContext.tsx` / `src/hooks/useAuth.ts` (`pendente`, reservada)
  - `SUB-27.10`: Formulário `LoginForm` (e-mail, senha, Entrar) em `src/components/auth/LoginForm.tsx` (`pendente`, reservada)
  - `SUB-27.11`: Tela `LoginView` em `src/views/LoginView.tsx` (`pendente`, reservada)
  - `SUB-27.12`: Guarda `RotaProtegida` em `src/components/auth/RotaProtegida.tsx` (`pendente`, reservada)
  - `SUB-27.13`: Integrar autenticação no `src/App.tsx` (`pendente`, reservada)
  - `SUB-27.14`: Menu do usuário `UserMenu` no header (`pendente`, reservada)
  - `SUB-27.15`: Rechecar conexão no login/logout em `src/hooks/useConexao.ts` (`pendente`, reservada)
  - `SUB-27.16`: `urlDeRetorno()` para link mágico e redefinição de senha (`pendente`, reservada)
  - `SUB-27.17`: Documentar configuração do Supabase Auth em `src/README.md` (`pendente`, reservada)
  - `SUB-27.18`: Validação automatizada da SUB-27 (`pendente`, reservada)
  - `SUB-27.19`: `RecuperarAcesso` (link mágico e esqueci a senha) em `src/components/auth/RecuperarAcesso.tsx` (`pendente`, reservada)
  - `SUB-27.20`: Limpar `ProjetoContext` ao sair (`pendente`, reservada)
  - `SUB-27.21`: Documentar primeiro administrador e membros em `database/README.md` (`pendente`, reservada)
  - `SUB-27.22`: Conferência no navegador e varredura do bundle (SUB-27) (`pendente`, reservada)
- **Descrição:** Implementar tela e fluxo de login do Dashboard usando Supabase Auth, mantendo a sessão do usuário, protegendo as áreas autenticadas e oferecendo logout.
- **Critérios de Aceitação:** Login e logout funcionam via Supabase Auth; sessão é restaurada e páginas privadas redirecionam usuários não autenticados; chamadas ao banco usam o JWT do usuário e respeitam RLS; somente a chave pública anon pode estar no frontend, sem senha persistida nem chave service_role exposta.
- **Commit:** pendente
- **Anotação:** Subdivisão (DashboardAI (Grok Bot), 2026-10-11 23:41, a pedido do usuário): até este momento não havia nenhum commit de código da SUB-27 na main, então nada foi marcado como concluído; a trava e a execução continuam com Codex (OpenAI). Original: Iniciado por solicitação do usuário; a dependência SUB-03 permanece pendente e a integração com o cliente Supabase depende da conclusão dela.

#### [ ] SUB-27.1: `mensagemErroAuth(erro)` em `src/lib/auth.ts`
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/lib/auth.ts` com `export function mensagemErroAuth(erro: { message?: string; code?: string; status?: number } | null): string` que traduz os erros do Supabase Auth para português (`invalid_credentials`/"Invalid login credentials" -> "E-mail ou senha inválidos.", `email_not_confirmed`, `over_request_rate_limit`/429, `user_banned`, falha de rede, genérico). Testes em `tests/unit/auth.test.ts`.
- **Critérios de Aceitação:** `npm test` passa (um caso por código + genérico); `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.2: `validarLogin({ email, senha })` em `src/lib/auth.ts`
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `export function validarLogin(d: { email: string; senha: string }): Partial<Record<'email'|'senha', string>>` (e-mail obrigatório e com formato válido após `trim`, senha obrigatória com no mínimo 6 caracteres). Testes no mesmo arquivo de teste.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.3: `entrarComSenha(email, senha)` em `src/services/authService.ts`
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/services/authService.ts` com `export async function entrarComSenha(email: string, senha: string, client = getSupabase()): Promise<Session>` usando `client.auth.signInWithPassword`; erro vira `ServiceError(mensagemErroAuth(error), 'AUTH')`. A senha nunca é guardada nem logada. Exportar no barrel `src/services/index.ts`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.4: `sair()` e `obterSessao()` em `src/services/authService.ts`
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `sair(client)` (`auth.signOut()`, limpando também `localStorage['dashboard-ai:projeto']`) e `obterSessao(client): Promise<Session | null>` (`auth.getSession()`, erro -> `ServiceError`).
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.5: `enviarLinkMagico()` e `redefinirSenha()` em `src/services/authService.ts`
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `enviarLinkMagico(email, redirectTo, client)` (`auth.signInWithOtp` com `emailRedirectTo` e `shouldCreateUser: false`) e `redefinirSenha(email, redirectTo, client)` (`auth.resetPasswordForEmail`), com mensagens via `mensagemErroAuth`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.6: Testes unitários de `authService` em `tests/unit/authService.test.ts`
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.4, SUB-27.5
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Testar com cliente falso (`auth.signInWithPassword/signOut/getSession/signInWithOtp/resetPasswordForEmail` simulados): sucesso, credenciais inválidas traduzidas, `sair` limpa o projeto salvo (stub de `localStorage`), `shouldCreateUser: false` no link mágico.
- **Critérios de Aceitação:** `npm test` passa com os casos.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.7: `obterPapelGlobal()` e `papelNoProjeto()` em `src/services/authService.ts`
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `obterPapelGlobal(userId, client): Promise<UserRole | null>` (lê a própria linha em `user_roles`, permitido pela policy `user_roles_select`) e `papelNoProjeto(projectId, userId, client): Promise<ProjectRole | 'admin' | null>` (admin global tem acesso total; senão `project_members.role`).
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.8: Teste de integração dos papéis em `tests/integration/authService.integration.test.ts`
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.7
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Com `tests/helpers/postgrest.ts` (JWT `authenticated` com `sub`): usuário vê o próprio papel e não o de outro; admin retorna `admin` em qualquer projeto; editor/viewer retornam o papel do projeto; não membro retorna `null`.
- **Critérios de Aceitação:** `npm run test:integration` passa (skipped sem PostgREST; `npm test` segue verde).
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.9: `AuthProvider` e `useAuth` em `src/hooks/AuthContext.tsx` / `src/hooks/useAuth.ts`
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.4, SUB-27.7
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar contexto com `{ sessao, usuario, papelGlobal, carregando, sair }`: lê `obterSessao()` ao montar, assina `auth.onAuthStateChange` (cancelando no cleanup), recarrega `papelGlobal` quando o usuário muda; sem Supabase configurado fica `carregando=false`, `sessao=null`. `useAuth()` lança erro fora do provider. Exportar em `src/hooks/index.ts`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.10: Formulário `LoginForm` (e-mail, senha, Entrar) em `src/components/auth/LoginForm.tsx`
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.2, SUB-27.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Formulário acessível (labels, `autocomplete=email/current-password`, mostrar/ocultar senha) com validação `validarLogin`, botão Entrar com estado carregando (`Botao`) e erro em `role=alert`. Criar `src/components/auth/index.ts`. Recuperação de acesso fica na SUB-27.19.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.11: Tela `LoginView` em `src/views/LoginView.tsx`
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.10, SUB-27.19
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Página cheia centralizada (fora do `AppLayout`): nome do produto, descrição curta, `LoginForm`, `RecuperarAcesso` (SUB-27.19), `ThemeToggle` e aviso quando o Supabase não estiver configurado (`supabaseConfigurado`). Responsiva 390x844.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK; screenshots 1280x800 e 390x844.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.12: Guarda `RotaProtegida` em `src/components/auth/RotaProtegida.tsx`
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.9, SUB-27.11
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Componente `{ children }`: enquanto `carregando` mostra fallback leve; sem sessão renderiza `LoginView` (preservando o hash atual, ex. `#/logs`, para voltar após o login); com sessão renderiza `children`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.13: Integrar autenticação no `src/App.tsx`
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Envolver a árvore em `AuthProvider` e `RotaProtegida` (acima de `ProjetoProvider`), e dar `key={usuario?.id}` ao `ProjetoProvider` para recarregar os projetos (RLS) quando o usuário trocar.
- **Critérios de Aceitação:** `npm run typecheck`, `npm run build` e `npm test` OK; sem sessão aparece o login, com sessão o dashboard.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.14: Menu do usuário `UserMenu` no header
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.9
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/layout/UserMenu.tsx` (e-mail do usuário, selo Admin quando `papelGlobal === 'admin'`, botão Sair com `sair()` e toast) e incluí-lo no `src/components/layout/Header.tsx` ao lado do `ThemeToggle`.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK; screenshot do header.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.15: Rechecar conexão no login/logout em `src/hooks/useConexao.ts`
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.9
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Em `useConexao`, verificar a conexão de novo quando `auth.onAuthStateChange` disparar (estado `sem_sessao` -> `conectado` sem esperar 60 s), cancelando a assinatura no cleanup.
- **Critérios de Aceitação:** `npm run typecheck` OK; status do header atualiza logo após entrar/sair.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.16: `urlDeRetorno()` para link mágico e redefinição de senha
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.5
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar em `src/lib/auth.ts` `urlDeRetorno(loc: Pick<Location,'origin'|'pathname'|'hash'>): string` (origem + caminho + hash da tela, sem tokens anteriores) e usá-la como `redirectTo` nas chamadas da 27.5. Testes.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.17: Documentar configuração do Supabase Auth em `src/README.md`
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.13
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** No `src/README.md`: habilitar provedor e-mail no Supabase Auth, URLs de redirecionamento (local e Vercel) usadas por `urlDeRetorno`, e como a sessão é persistida. Sem chaves reais.
- **Critérios de Aceitação:** Documentação revisada.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.18: Validação automatizada da SUB-27
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.6, SUB-27.8, SUB-27.13, SUB-27.14, SUB-27.15, SUB-27.16, SUB-27.17, SUB-27.20, SUB-27.21
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Rodar `npm run typecheck`, `npm test`, `npm run build` e `npm run test:integration`; registrar o resultado na anotação da SUB-27.
- **Critérios de Aceitação:** Tudo verde.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.19: `RecuperarAcesso` (link mágico e esqueci a senha) em `src/components/auth/RecuperarAcesso.tsx`
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.5, SUB-27.16
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Dois botões/links: "Entrar com link por e-mail" (`enviarLinkMagico`) e "Esqueci a senha" (`redefinirSenha`), usando o e-mail informado e `urlDeRetorno(location)`; mostra confirmação de envio ou erro.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.20: Limpar `ProjetoContext` ao sair
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.9
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Em `src/hooks/ProjetoContext.tsx`, limpar `projetos` e erro quando não houver sessão (usando `useAuth`), sem perder o slug salvo.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.21: Documentar primeiro administrador e membros em `database/README.md`
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.13
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Como criar o primeiro admin (`insert into user_roles (user_id, role) values (..., 'admin')` no SQL editor) e adicionar membros em `project_members` (owner/editor/viewer). Sem chaves reais.
- **Critérios de Aceitação:** Documentação revisada.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.22: Conferência no navegador e varredura do bundle (SUB-27)
- **Status:** pendente (reservada para Codex (OpenAI) — SUB-27 travada)
- **Executor:** Codex (OpenAI) (reserva da trava de 2026-10-11 22:27)
- **Depende de:** SUB-27.18
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Conferir no navegador entrar, sair e restaurar sessão (recarregar a página) e rodar `rg -n service_role dist/` (só mensagens de recusa); registrar na anotação da SUB-27.
- **Critérios de Aceitação:** Critérios de aceitação da SUB-27 atendidos.
- **Commit:** pendente
- **Anotação:** pendente

---

## 🚀 FASE 11: Orquestração de Tasks com LangChain/LangGraph (última fase)

### [ ] SUB-28: Integração LangChain/LangGraph para Execução de Tasks
- **Status:** pendente (aguardando subtarefas)
- **Executor:** nenhum
- **Depende de:** SUB-01 a SUB-27, SUB-29, SUB-30 (todas as tasks anteriores concluídas); subtarefas SUB-28.1 a SUB-28.25
- **Subtarefas:** (subdividida em 18 em 2026-10-11 23:38 por DashboardAI (Grok Bot); a mãe só é concluída quando todas estiverem `concluido`; refinada para 25 em 2026-10-11 23:51)
  - `SUB-28.1`: Contrato worker ↔ RPC ↔ MCP em `docs/langgraph-contrato.md` (`pendente`)
  - `SUB-28.2`: Dependências e `worker/tsconfig.json` (`pendente`)
  - `SUB-28.3`: Estado tipado do grafo em `worker/estado.ts` (`pendente`)
  - `SUB-28.4`: Adaptador de RPCs em `worker/fila.ts` (`pendente`)
  - `SUB-28.5`: Allowlist e `obterFerramenta(nome)` em `worker/ferramentas.ts` (`pendente`)
  - `SUB-28.6`: Nó `carregarContexto` em `worker/nos/carregarContexto.ts` (`pendente`)
  - `SUB-28.7`: Nó `planejar` (chamada ao modelo) em `worker/nos/planejar.ts` (`pendente`)
  - `SUB-28.8`: Nó `politica` (aprovação humana) em `worker/nos/politica.ts` (`pendente`)
  - `SUB-28.9`: Nó `executar` em `worker/nos/executar.ts` (`pendente`)
  - `SUB-28.10`: Nó `revisar` (roteamento) em `worker/nos/revisar.ts` (`pendente`)
  - `SUB-28.11`: Nó `finalizar` em `worker/nos/finalizar.ts` (`pendente`)
  - `SUB-28.12`: Montagem do `StateGraph` em `worker/grafo.ts` (`pendente`)
  - `SUB-28.13`: Checkpointer durável em `worker/checkpointer.ts` (`pendente`)
  - `SUB-28.14`: Reconciliação na retomada em `worker/reconciliar.ts` (`pendente`)
  - `SUB-28.15`: CLI do worker em `worker/index.ts` (`pendente`)
  - `SUB-28.16`: Endpoint `api/aprovacao.ts`: autenticação e papel (401/403) (`pendente`)
  - `SUB-28.17`: Testes do worker: caminho feliz e erro (`pendente`)
  - `SUB-28.18`: Atualizar `LangChain_LangGraph.md` (status e desvios) (`pendente`)
  - `SUB-28.19`: Adaptar ferramentas para `tool()` do LangChain em `worker/ferramentas.ts` (`pendente`)
  - `SUB-28.20`: `PlanoSchema` e `montarPromptPlano` em `worker/plano.ts` (`pendente`)
  - `SUB-28.21`: `classificarFalha(err)` em `worker/falhas.ts` (`pendente`)
  - `SUB-28.22`: `executarUmaTask(deps)` em `worker/executar.ts` (`pendente`)
  - `SUB-28.23`: Retomada da aprovação em `api/aprovacao.ts` (`pendente`)
  - `SUB-28.24`: Testes do worker: interrupção e retomada sem duplicar efeitos (`pendente`)
  - `SUB-28.25`: Variáveis do worker no `api/README.md` (`pendente`)
- **Descrição:** Implementar a orquestração multi-etapas de execução descrita em `LangChain_LangGraph.md`, mantendo Supabase como autoridade sobre a fila, dependências, locks, tentativas e resultado. Integrar o worker LangGraph às RPCs existentes e às ferramentas MCP autorizadas, com checkpoint durável, retomada, tratamento de falhas e aprovação humana para ações sensíveis.
- **Critérios de Aceitação:** A task só inicia após todas as dependências SUB-01 a SUB-27 concluídas; execução reivindicada por `pegar_proxima_task`; estado do grafo é retomável e não duplica efeitos; escrita ocorre por ferramentas autenticadas e autorizadas; ações sensíveis pausam para aprovação; conclusão/erro e liberação do lock passam por `finalizar_task`; documentação de operação e segurança atualizada conforme `LangChain_LangGraph.md`.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.1: Contrato worker ↔ RPC ↔ MCP em `docs/langgraph-contrato.md`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-01 a SUB-27, SUB-29 a SUB-34
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Documentar o contrato da seção 9.1 do `LangChain_LangGraph.md`: identificador da execução (`task_id` + tentativa), estado mínimo, ferramentas permitidas, chaves de idempotência, mapeamento de erros para `finalizar_task`.
- **Critérios de Aceitação:** Documento revisado e referenciado no `LangChain_LangGraph.md`.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.2: Dependências e `worker/tsconfig.json`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `@langchain/langgraph`, `@langchain/core`, `@langchain/langgraph-checkpoint-postgres` e `zod` ao `package.json`; criar `worker/tsconfig.json` (NodeNext, strict) e `"typecheck:worker"`.
- **Critérios de Aceitação:** `npm ci` sem vulnerabilidades altas; `npm run typecheck:worker` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.3: Estado tipado do grafo em `worker/estado.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Definir `EstadoExecucao` (Annotation do LangGraph + schema zod): `taskId`, `taskCodigo`, `projeto`, `agente`, `tentativa`, `execucaoId`, `instrucao`, `plano`, `passoAtual`, `resultados` (por chave de idempotência), `aprovacao`, `final`. Sem segredos.
- **Critérios de Aceitação:** `typecheck:worker` OK; teste de parse do schema.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.4: Adaptador de RPCs em `worker/fila.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Funções `reivindicar(agente, projeto)` (`pegar_proxima_task`) e `finalizar(taskId, status, resultado, agente, metadados)` (`finalizar_task`), reutilizando `db()` de `api/_lib/supabase.ts`.
- **Critérios de Aceitação:** `typecheck:worker` OK; teste com cliente falso.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.5: Allowlist e `obterFerramenta(nome)` em `worker/ferramentas.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Definir a allowlist (`brain_search`, `brain_store`, `task_list`) com flag `sensivel` e `obterFerramenta(nome)` que consulta o registro MCP (`api/_lib/tools.ts`) e recusa nomes fora da lista. A adaptação para o LangChain fica na SUB-28.19.
- **Critérios de Aceitação:** Teste: ferramenta fora da allowlist é recusada.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.6: Nó `carregarContexto` em `worker/nos/carregarContexto.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.3, SUB-28.19
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Busca memórias relevantes (`brain_search`) para a instrução e guarda no estado como dado não confiável.
- **Critérios de Aceitação:** Teste unitário com ferramenta falsa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.7: Nó `planejar` (chamada ao modelo) em `worker/nos/planejar.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.20
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Chama o modelo injetável (LangChain `BaseChatModel`, saída estruturada com `PlanoSchema` da SUB-28.20) com o prompt de `montarPromptPlano` e grava o plano no estado.
- **Critérios de Aceitação:** Teste com modelo falso; plano inválido vira erro de validação.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.8: Nó `politica` (aprovação humana) em `worker/nos/politica.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.19
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Valida passos contra a allowlist e, para passo sensível, chama `interrupt()` com pedido de aprovação.
- **Critérios de Aceitação:** Teste: passo sensível interrompe; não sensível segue.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.9: Nó `executar` em `worker/nos/executar.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.19
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Executa o passo atual com chave de idempotência `${execucaoId}:${passo}`; se o resultado já existe no estado, não repete.
- **Critérios de Aceitação:** Teste: retomada não duplica a chamada.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.10: Nó `revisar` (roteamento) em `worker/nos/revisar.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.21
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Usa `classificarFalha` (SUB-28.21) e decide repetir o passo (limite por nó, espera progressiva) ou seguir para finalizar.
- **Critérios de Aceitação:** Teste: transitória repete até o limite; permanente finaliza.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.11: Nó `finalizar` em `worker/nos/finalizar.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Chama `finalizar` (RPC `finalizar_task`) com `concluida`/`recusada`/`erro`, resumo seguro e `execucaoId` nos metadados.
- **Critérios de Aceitação:** Teste com adaptador falso.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.12: Montagem do `StateGraph` em `worker/grafo.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.6, SUB-28.7, SUB-28.8, SUB-28.9, SUB-28.10, SUB-28.11
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Conectar nós e rotas condicionais: contexto -> planejar -> politica -> executar -> revisar -> (executar | finalizar).
- **Critérios de Aceitação:** `typecheck:worker` OK; teste de caminho feliz com fakes.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.13: Checkpointer durável em `worker/checkpointer.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Configurar `PostgresSaver` em schema próprio (`langgraph`) com `LANGGRAPH_DATABASE_URL` no servidor; `setup()` idempotente.
- **Critérios de Aceitação:** Teste contra Postgres local (ou skipped sem banco).
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.14: Reconciliação na retomada em `worker/reconciliar.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Antes de iniciar/retomar, conferir no Supabase se a task continua `em_execucao` com `trava_frente` = agente e trava válida; caso contrário abortar sem efeitos.
- **Critérios de Aceitação:** Teste com estados divergentes.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.15: CLI do worker em `worker/index.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.22
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Opções `--projeto`, `--agente`, `--uma-vez`; loop chamando `executarUmaTask` (SUB-28.22) até não haver task; `"worker"` no `package.json`.
- **Critérios de Aceitação:** `npm run worker -- --uma-vez` roda contra banco local.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.16: Endpoint `api/aprovacao.ts`: autenticação e papel (401/403)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.15, SUB-33.2, SUB-27.9
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** `POST /api/aprovacao` exige JWT (`bearerToken` + `verificarSessaoSupabase`) e papel editor no projeto da task (`tem_acesso_projeto`); 401 sem sessão, 403 sem papel, 400 corpo inválido. A retomada fica na SUB-28.23.
- **Critérios de Aceitação:** `typecheck:api` OK; testes 401/403/400.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.17: Testes do worker: caminho feliz e erro
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.15
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Em `tests/unit/worker-grafo.test.ts`, com modelo, ferramentas e RPC falsos: caminho feliz até `finalizar_task` concluida e erro permanente -> `finalizar_task` com `erro`.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.18: Atualizar `LangChain_LangGraph.md` (status e desvios)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.15, SUB-28.23
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Atualizar `LangChain_LangGraph.md`: status implementado, nós, retomada, aprovação e desvios justificados.
- **Critérios de Aceitação:** Documentação coerente com o código.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.19: Adaptar ferramentas para `tool()` do LangChain em `worker/ferramentas.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.5
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Converter cada ferramenta permitida em `tool()` do LangChain com schema zod derivado do `inputSchema` MCP, validando argumentos antes de chamar o handler.
- **Critérios de Aceitação:** Teste: argumento inválido é recusado sem chamar o handler.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.20: `PlanoSchema` e `montarPromptPlano` em `worker/plano.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Schema zod do plano (passos com ferramenta, argumentos, `sensivel`, critério) e função pura `montarPromptPlano(estado)` que trata instrução e memórias como dados não confiáveis.
- **Critérios de Aceitação:** Testes do schema e do prompt (sem segredos).
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.21: `classificarFalha(err)` em `worker/falhas.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Função pura que classifica erros em `transitoria` (rede, 429, timeout), `validacao`/`permissao` e `permanente`. Testes.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.22: `executarUmaTask(deps)` em `worker/executar.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.12, SUB-28.13, SUB-28.14
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Uma execução: `reivindicar` -> `reconciliar` -> `grafo.invoke` com `thread_id = execucaoId` e checkpointer -> garantir `finalizar` em caso de exceção. Dependências injetáveis.
- **Critérios de Aceitação:** Teste com fakes: sem task retorna `null`; exceção finaliza com `erro`.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.23: Retomada da aprovação em `api/aprovacao.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.16
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Após autorizar, retomar o grafo com `Command({ resume: { aprovado, por, em } })` no `thread_id` da execução e registrar quem aprovou, quando e a ação (sem credenciais).
- **Critérios de Aceitação:** `typecheck:api` OK; teste de retomada com grafo falso.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.24: Testes do worker: interrupção e retomada sem duplicar efeitos
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.15
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Em `tests/unit/worker-grafo.test.ts`: passo sensível interrompe; retomada aprovada executa uma única vez (chave de idempotência); retomada após trava expirada aborta.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.25: Variáveis do worker no `api/README.md`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.15, SUB-28.23
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Documentar `LANGGRAPH_DATABASE_URL`, variáveis do modelo, endpoint de aprovação e operação do worker no `api/README.md`.
- **Critérios de Aceitação:** Documentação coerente com o código.
- **Commit:** pendente
- **Anotação:** pendente
