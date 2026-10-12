# 📋 TASK-PRINCIPAL: Projeto Dashboard AI

> **Objetivo:** Construção da solução unificada do **Dashboard AI**, integrando o controle e fila de tarefas da IA (`tasks`), a base de memória persistente vetorial (`ai_memories` / Jev-Mem) e o monitoramento em tempo real do agendador autônomo.
> **Fonte Base:** inspirado no motor de fila do `aulassenai-base` e na especificação de memória Jev-Mem.
> **Direção (2026-10-11):** o Dashboard AI é um **gerenciador genérico de tasks de IA, usável por qualquer projeto** (multi-projeto), não acoplado ao AulasSenai.
> **Regra Geral:** Toda tarefa pode ser subdividida em mini-tarefas menores. Cada tarefa/subtarefa declara obrigatoriamente suas **Dependências** e suas **Subtarefas**. Nenhuma IA pode assumir uma tarefa cujas dependências não estejam `concluido`.

---

## 📊 Resumo de Progresso
- **Total de Tasks Principais:** 35
- **Subtarefas atômicas (~3 min):** 199 (SUB-08.x, SUB-19.x, SUB-20.x, SUB-21.x, SUB-23.x, SUB-25.x, SUB-26.x, SUB-27.x, SUB-28.x, SUB-33.x, SUB-34.x, SUB-35.x; atualizado em 2026-10-12 00:39)
- **Em Execução:** 1 (SUB-33.9 — Codex (OpenAI))
- **Pendentes:** 12 principais aguardando subtarefas (SUB-08, 19, 20, 21, 23, 25, 26, 27, 28, 33, 34, 35) + 176 subtarefas
  - livres agora: 25 (SUB-08.7, SUB-08.8, SUB-34.1, SUB-34.2, SUB-34.4, SUB-19.1, SUB-19.3, SUB-19.9, SUB-20.1, SUB-20.5, SUB-20.8, SUB-20.9, SUB-20.10, SUB-21.2, SUB-21.3, SUB-21.4, SUB-21.6, SUB-23.2, SUB-23.5, SUB-23.12, SUB-25.1, SUB-26.1, SUB-27.1, SUB-35.1, SUB-35.21)
  - bloqueadas por dependência: 150
  - reservadas: 0
- **Concluídas:** 45
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
- **Depende de:** SUB-07, SUB-03; subtarefas SUB-33.1 a SUB-33.13
- **Subtarefas:** (subdividida em 2026-10-11 23:38 e refinada para 12 em 2026-10-11 23:47 por DashboardAI (Grok Bot); trava liberada a pedido do usuário, filhas livres conforme dependências; a mãe só é concluída quando todas estiverem `concluido`; nova revisão para 13 em 2026-10-12 00:17)
  - `SUB-33.1`: `bearerToken(req)` em `api/_lib/auth.ts` (`concluido`)
  - `SUB-33.2`: `verificarSessaoSupabase(token)` em `api/_lib/auth.ts` (`concluido`)
  - `SUB-33.3`: `lerTextoEmbedding(body)` em `api/_lib/embedding-input.ts` (`concluido`)
  - `SUB-33.4`: Esqueleto do handler `api/embedding.ts` (CORS, OPTIONS, 405) (`concluido`)
  - `SUB-33.5`: Registrar `api/embedding.ts` no `vercel.json` (`concluido`)
  - `SUB-33.6`: Testes do handler: OPTIONS, 405 e 401 (`concluido`)
  - `SUB-33.7`: `criarGeradorEmbedding()` em `src/services/embeddingService.ts` (`concluido`)
  - `SUB-33.8`: Testes de `embeddingService` em `tests/unit/embeddingService.test.ts` (`concluido`)
  - `SUB-33.9`: Documentar `/api/embedding` no `api/README.md` (`pendente`)
  - `SUB-33.10`: Autenticação no handler `api/embedding.ts` (401) (`concluido`)
  - `SUB-33.11`: Corpo, geração do embedding e erros no handler (400/413/502/200) (`concluido`)
  - `SUB-33.12`: Testes do handler: 413, 502 e 200 (`concluido`)
  - `SUB-33.13`: Classe `HttpError` em `api/_lib/http-error.ts` (`concluido`)
- **Descrição:** Criar a função serverless `POST /api/embedding` que valida o JWT da sessão Supabase do usuário (`Authorization: Bearer <access_token>`, conferido no Supabase Auth com a URL e a chave do servidor) e devolve o embedding do texto enviado, usando `OPENAI_API_KEY`, `EMBEDDING_MODEL` e `EMBEDDING_API_URL` somente no servidor (reaproveitar `api/_lib/embeddings.ts`). No frontend, expor um `GeradorEmbedding` que chama esse endpoint para `buscarMemorias`/`salvarMemoria` (SUB-10).
- **Critérios de Aceitação:** 401 sem sessão ou com JWT inválido; 405 para métodos diferentes de POST; limite de tamanho do texto; resposta com vetor de 1536 dimensões; nenhuma chave no navegador; `tsc` sem erros e testes cobrindo os casos.
- **Commit:** pendente
- **Anotação:** Trava de DashboardAI (Grok Bot) (desde 2026-10-11 23:34) liberada em 2026-10-11 23:47 a pedido do usuário, sem código escrito; SUB-33.4 (endpoint) e SUB-33.6 (testes) refinadas em SUB-33.4/33.10/33.11 e SUB-33.6/33.12.

#### [x] SUB-33.1: `bearerToken(req)` em `api/_lib/auth.ts`
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:20 → 2026-10-12 00:20)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `api/_lib/auth.ts` com `export function bearerToken(headers: McpRequest['headers']): string | null` que lê `authorization` (string ou array), aceita só o esquema `Bearer` (case-insensitive) e devolve o token sem espaços; `null` se ausente/malformado. Teste em `tests/unit/api-auth.test.ts`.
- **Critérios de Aceitação:** `npm test` passa (casos: ausente, `Basic x`, `Bearer` vazio, array, ok); `npm run typecheck:api` sem erros.
- **Commit:** `78a4689`
- **Anotação:** Criado `api/_lib/auth.ts` com `bearerToken(headers)`: lê `authorization` (string ou array, usa o primeiro), aceita só o esquema `Bearer` sem diferenciar maiúsculas e devolve o token sem espaços; `null` se ausente/malformado. Testes em `tests/unit/api-auth.test.ts` (ausente, `Basic`, `Bearer` vazio, array, ok). `npm run typecheck` (app + api) e `npm test` verdes.

#### [x] SUB-33.2: `verificarSessaoSupabase(token)` em `api/_lib/auth.ts`
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:23 → 2026-10-12 00:23)
- **Depende de:** SUB-33.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `export async function verificarSessaoSupabase(token: string, env = process.env): Promise<{ userId: string } | null>` que chama `GET ${SUPABASE_URL}/auth/v1/user` com `Authorization: Bearer <token>` e `apikey` (`SUPABASE_ANON_KEY` ou `SUPABASE_SERVICE_ROLE_KEY`), timeout 10 s; 200 com `id` -> `{ userId }`, 401/403 -> `null`, outros erros lançam `AuthError`. Testes com `fetch` simulado (`vi.stubGlobal`) em `tests/unit/api-auth.test.ts`.
- **Critérios de Aceitação:** Testes 200/401/500/timeout passam; nenhuma chave é logada ou devolvida; `typecheck:api` OK.
- **Commit:** `b7d1188`
- **Anotação:** Adicionados `AuthError` e `verificarSessaoSupabase(token, env)` em `api/_lib/auth.ts`: `GET ${SUPABASE_URL}/auth/v1/user` com `Authorization: Bearer` e `apikey` (`SUPABASE_ANON_KEY` ou `SUPABASE_SERVICE_ROLE_KEY`), timeout 10 s; 200 com `id` -> `{ userId }`, 401/403 -> `null`, demais casos (config ausente, rede, timeout, HTTP != 2xx, corpo sem id) -> `AuthError` sem chave/token na mensagem. Testes 200/401/403/500/timeout/sem config em `tests/unit/api-auth.test.ts`. typecheck (app + api) e `npm test` verdes.

#### [x] SUB-33.3: `lerTextoEmbedding(body)` em `api/_lib/embedding-input.ts`
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:24 → 2026-10-12 00:24)
- **Depende de:** SUB-33.13
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `api/_lib/embedding-input.ts` com `export function lerTextoEmbedding(body: unknown): string`: aceita objeto, string JSON ou Buffer; exige `texto` string não vazia (`HttpError` 400 da SUB-33.13), máximo 8.000 caracteres (413). Testes em `tests/unit/api-embedding-input.test.ts`.
- **Critérios de Aceitação:** Testes (vazio, JSON inválido, sem `texto`, longo demais, ok) passam; `typecheck:api` OK.
- **Commit:** `593fad1`
- **Anotação:** Criado `api/_lib/embedding-input.ts` com `MAX_TEXTO_EMBEDDING = 8000` e `lerTextoEmbedding(body)`: aceita objeto, string JSON ou Buffer; `HttpError` 400 para corpo vazio, JSON inválido, corpo não objeto ou `texto` ausente/não string/vazio; 413 acima de 8.000 caracteres. Testes em `tests/unit/api-embedding-input.test.ts` (vazio, JSON inválido, sem texto, longo demais, ok). typecheck (app + api) e `npm test` verdes.

#### [x] SUB-33.4: Esqueleto do handler `api/embedding.ts` (CORS, OPTIONS, 405)
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:21 → 2026-10-12 00:21)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `api/embedding.ts` com default export `handler(req: McpRequest, res: McpResponse)` (tipos de `api/_lib/http.ts`): cabeçalhos CORS iguais ao `api/mcp.ts` (`MCP_CORS_ORIGIN`, métodos `POST, OPTIONS`, `Authorization`), `OPTIONS` -> 204, não-POST -> 405 com `Allow: POST, OPTIONS` e JSON `{ erro }`; POST responde 501 provisório (substituído na SUB-33.11).
- **Critérios de Aceitação:** `npm run typecheck:api` OK.
- **Commit:** `8660199`
- **Anotação:** Criado `api/embedding.ts` (default export `handler(req: McpRequest, res: McpResponse)`): CORS como o `api/mcp.ts` (`MCP_CORS_ORIGIN`, métodos `POST, OPTIONS`, cabeçalhos `Content-Type, Authorization`), `OPTIONS` -> 204, não-POST -> 405 com `Allow: POST, OPTIONS` e `{ erro }`; POST -> 501 provisório (substituído na SUB-33.11). `npm run typecheck` (app + api) e `npm test` verdes.

#### [x] SUB-33.5: Registrar `api/embedding.ts` no `vercel.json`
- **Status:** concluido
- **Executor:** Codex (OpenAI) (início: 2026-10-12 00:35, conclusão: 2026-10-12 00:41)
- **Depende de:** SUB-33.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Em `vercel.json`, adicionar `"api/embedding.ts": { "maxDuration": 15 }` em `functions` (manter `api/mcp.ts` e o rewrite `/mcp`).
- **Critérios de Aceitação:** JSON válido (`node -e "JSON.parse(require('fs').readFileSync('vercel.json'))"`); build OK.
- **Commit:** `1d68ea6`
- **Anotação:** Registrado `api/embedding.ts` em `functions` no `vercel.json` com `maxDuration: 15`, mantendo `api/mcp.ts` com duração de 30 segundos e o rewrite `/mcp`. Publicado em `origin/main`. Testes não executados conforme AGENTS.md.

#### [x] SUB-33.6: Testes do handler: OPTIONS, 405 e 401
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:27 → 2026-10-12 00:28)
- **Depende de:** SUB-33.10
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `tests/unit/api-embedding.test.ts` com `req`/`res` falsos e `fetch` simulado: 204 em OPTIONS (com CORS), 405 em GET (com `Allow`), 401 sem token e 401 com JWT recusado pelo Auth.
- **Critérios de Aceitação:** `npm test` passa com os 4 casos.
- **Commit:** `4ba6702`
- **Anotação:** Criado `tests/unit/api-embedding.test.ts` com `req`/`res` falsos, `fetch` simulado e env de teste restaurado após cada caso: OPTIONS -> 204 com CORS; GET -> 405 com `Allow: POST, OPTIONS`; POST sem token -> 401 com `WWW-Authenticate` sem chamar o Auth; JWT recusado pelo Auth -> 401. typecheck (app + api) e `npm test` verdes (53 passed).

#### [x] SUB-33.7: `criarGeradorEmbedding()` em `src/services/embeddingService.ts`
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:29 → 2026-10-12 00:30)
- **Depende de:** SUB-33.11
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/services/embeddingService.ts` com `export function criarGeradorEmbedding(opcoes?: { url?: string; client?: DashboardClient }): GeradorEmbedding` que obtém o `access_token` de `client.auth.getSession()`, faz `POST /api/embedding` com `{ texto }`, converte 401 em `ServiceError('Faça login para usar a busca semântica.')`, outros erros em `ServiceError` e valida 1536 números. Exportar no barrel `src/services/index.ts`.
- **Critérios de Aceitação:** `npm run typecheck` OK; sem chave de embeddings no frontend.
- **Commit:** `64aa288`
- **Anotação:** Criado `src/services/embeddingService.ts` com `criarGeradorEmbedding({ url?, client? }): GeradorEmbedding`: pega o `access_token` de `client.auth.getSession()` (sem sessão -> `ServiceError('Faça login para usar a busca semântica.')`), faz `POST /api/embedding` com `{ texto }` e `Authorization: Bearer`; 401 -> mesma mensagem de login, falha de rede/HTTP -> `ServiceError` (usa `erro` do servidor), valida 1536 números finitos. Exportado em `src/services/index.ts`. Nenhuma chave de embeddings no frontend. typecheck, `npm test` e `npm run build` OK.

#### [x] SUB-33.8: Testes de `embeddingService` em `tests/unit/embeddingService.test.ts`
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:32 → 2026-10-12 00:32)
- **Depende de:** SUB-33.7
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Testes com `fetch` simulado e cliente falso (`auth.getSession`): sem sessão, 401, 500, vetor com tamanho errado, sucesso (envia `Authorization: Bearer`).
- **Critérios de Aceitação:** `npm test` passa com os 5 casos.
- **Commit:** `c0b75b6`
- **Anotação:** Criado `tests/unit/embeddingService.test.ts` com `fetch` simulado e cliente falso (`auth.getSession`): sem sessão (pede login, não chama o servidor), 401 (pede login), 500 (`ServiceError` com a mensagem do servidor), vetor com tamanho errado (erro cita 1536) e sucesso (POST com `Authorization: Bearer` e `{ texto }`, devolve 1536 números). typecheck (app + api) e `npm test` verdes (62 passed).

#### [🔄] SUB-33.9: Documentar `/api/embedding` no `api/README.md`
- **Status:** em_execucao
- **Executor:** Codex (OpenAI) (início: 2026-10-12 00:43)
- **Depende de:** SUB-33.11
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Seção no `api/README.md`: contrato (request/response, códigos 401/405/413/502), variáveis (`SUPABASE_URL`, `SUPABASE_ANON_KEY` ou service role, `OPENAI_API_KEY`, `EMBEDDING_MODEL`, `EMBEDDING_API_URL`) e exemplo `curl`. Conferir que o `.env.example` lista `SUPABASE_ANON_KEY` (SUB-08.3).
- **Critérios de Aceitação:** README revisado; nenhuma chave real.
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-33.10: Autenticação no handler `api/embedding.ts` (401)
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:25 → 2026-10-12 00:25)
- **Depende de:** SUB-33.4, SUB-33.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** No POST do handler, exigir `bearerToken` + `verificarSessaoSupabase`; ausente ou recusado -> 401 com `WWW-Authenticate: Bearer`; `AuthError` (Auth fora do ar) -> 503 com mensagem segura.
- **Critérios de Aceitação:** `npm run typecheck:api` OK.
- **Commit:** `e060ae6`
- **Anotação:** No POST de `api/embedding.ts`: `bearerToken` + `verificarSessaoSupabase`; token ausente ou sessão recusada -> 401 com `WWW-Authenticate: Bearer`; `AuthError` (Auth indisponível/config ausente) -> 503 com mensagem segura; sessão válida segue para o 501 provisório (SUB-33.11). typecheck (app + api) e `npm test` verdes; smoke local (não commitado) conferiu 401/401/503/501/405.

#### [x] SUB-33.11: Corpo, geração do embedding e erros no handler (400/413/502/200)
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:26 → 2026-10-12 00:26)
- **Depende de:** SUB-33.10, SUB-33.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Após a autenticação: `lerTextoEmbedding(req.body)` (`HttpError` -> status dela), `generateEmbedding` de `api/_lib/embeddings.ts` -> 200 `{ embedding, dimensoes: 1536, modelo }`; `EmbeddingError` -> 502 com mensagem sem chave. Remove o 501 provisório da SUB-33.4.
- **Critérios de Aceitação:** `npm run typecheck:api` OK; nenhuma chave no corpo de resposta.
- **Commit:** `0dca17d`
- **Anotação:** No `api/embedding.ts`, após a autenticação: `lerTextoEmbedding(req.body)` (`HttpError` -> status dela, 400/413), `generateEmbedding` -> 200 `{ embedding, dimensoes: 1536, modelo }`; `EmbeddingError` -> 502 com mensagem genérica (a mensagem do provedor pode ecoar parte da chave, então não é devolvida). 501 provisório removido. typecheck (app + api) e `npm test` verdes; smoke local (não commitado) conferiu 200/400/413/502 sem `sk-` no corpo.

#### [x] SUB-33.12: Testes do handler: 413, 502 e 200
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:28 → 2026-10-12 00:29)
- **Depende de:** SUB-33.11
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Em `tests/unit/api-embedding.test.ts`, adicionar: 413 com texto longo, 400 sem `texto`, 502 quando a API de embeddings falha (sem vazar a chave) e 200 com vetor de 1536 (Auth e embeddings simulados).
- **Critérios de Aceitação:** `npm test` passa com os 4 casos novos.
- **Commit:** `bf48093`
- **Anotação:** Em `tests/unit/api-embedding.test.ts`, bloco "POST autenticado" com Auth e API de embeddings simulados: 413 com 8.001 caracteres, 400 sem `texto`, 502 quando a API de embeddings recusa (corpo sem `sk-` e sem a chave anon) e 200 com vetor de 1536 (`dimensoes`, `modelo`, 2 chamadas a `fetch`). typecheck (app + api) e `npm test` verdes (57 passed).

#### [x] SUB-33.13: Classe `HttpError` em `api/_lib/http-error.ts`
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:19 → 2026-10-12 00:20)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `api/_lib/http-error.ts` com `export class HttpError extends Error { status: number }` (construtor `(status, mensagem)`, `name = 'HttpError'`). Teste curto em `tests/unit/api-http-error.test.ts`.
- **Critérios de Aceitação:** `npm test` passa; `npm run typecheck:api` OK.
- **Commit:** `4f98dc3`
- **Anotação:** Criado `api/_lib/http-error.ts` com `HttpError extends Error` (construtor `(status, mensagem)`, `status` somente leitura, `name = 'HttpError'`), para a `lerTextoEmbedding` (SUB-33.3) e o handler `/api/embedding`. Teste `tests/unit/api-http-error.test.ts`; `npm run typecheck` (app + api) e `npm test` verdes.

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

### [ ] SUB-08: Configuração de Variáveis de Ambiente e `.env.example`
- **Status:** pendente (aguardando subtarefas)
- **Executor:** nenhum
- **Depende de:** SUB-06; subtarefas SUB-08.1 a SUB-08.11
- **Subtarefas:** (subdividida em 9 em 2026-10-12 00:08 por DashboardAI (Grok Bot) a pedido do usuário; a mãe só é concluída quando todas estiverem `concluido`; nova revisão para 11 em 2026-10-12 00:17)
  - `SUB-08.1`: Esqueleto do `.env.example` (`concluido`)
  - `SUB-08.2`: Seção Frontend: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (`concluido`)
  - `SUB-08.3`: Seção Servidor Supabase: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `SUPABASE_REST_URL` (`concluido`)
  - `SUB-08.4`: Seção Embeddings: `OPENAI_API_KEY`, `EMBEDDING_API_URL`, `EMBEDDING_MODEL` (`concluido`)
  - `SUB-08.5`: Seção MCP: `MCP_AUTH_TOKEN`, `MCP_CORS_ORIGIN`, `MCP_DEFAULT_PROJECT`, `MCP_ALLOWED_PROJECTS` (`concluido`)
  - `SUB-08.6`: Seção Scripts: `DASHBOARD_AI_PROJECT` (`concluido`)
  - `SUB-08.7`: Conferir `.gitignore` (`!.env.example`) (`pendente`)
  - `SUB-08.8`: `extrairVariaveis(texto)` em `scripts/checar-env.mjs` + testes (`pendente`)
  - `SUB-08.9`: CLI `npm run check:env` (toda variável usada está no `.env.example`) (`pendente`)
  - `SUB-08.10`: `variaveisDoExemplo(texto)` em `scripts/checar-env.mjs` + testes (`pendente`)
  - `SUB-08.11`: `listarArquivosFonte(dirs)` em `scripts/checar-env.mjs` + teste (`pendente`)
- **Descrição:** Documentar e padronizar as variáveis `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (frontend) e `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `EMBEDDING_MODEL`, `MCP_AUTH_TOKEN`, `MCP_CORS_ORIGIN`, `MCP_DEFAULT_PROJECT`, `DASHBOARD_AI_PROJECT` (servidor/scripts) em `.env.example`.
- **Critérios de Aceitação:** Arquivo `.env.example` completo com instruções de preenchimento.
- **Commit:** pendente
- **Anotação:** Trava de xAI (Grok) (desde 2026-10-11 22:41, sem commits e sem `.env.example`) liberada pelo usuário em 2026-10-12 00:08; subdividida por DashboardAI (Grok Bot).

#### [x] SUB-08.1: Esqueleto do `.env.example`
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:19 → 2026-10-12 00:19)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `.env.example` na raiz só com o cabeçalho (copiar para `.env`/`.env.local`, nunca commitar valores reais, quais variáveis vão para o navegador `VITE_*` e quais ficam só no servidor) e os títulos vazios das seções: Frontend, Servidor Supabase, Embeddings, MCP, Scripts.
- **Critérios de Aceitação:** Arquivo criado; `git check-ignore .env.example` não o ignora; nenhum valor real.
- **Commit:** `5db1d43`
- **Anotação:** Criado `.env.example` na raiz: cabeçalho (copiar para `.env`/`.env.local`, nunca commitar valores reais, `VITE_*` vão para o navegador e segredos só no servidor) e seções vazias Frontend, Servidor Supabase, Embeddings, MCP e Scripts. `git check-ignore .env.example` não o ignora (`.env` e `.env.local` seguem ignorados); nenhum valor real.

#### [x] SUB-08.2: Seção Frontend: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:33 → 2026-10-12 00:33)
- **Depende de:** SUB-08.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Preencher a seção Frontend do `.env.example` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (valores de exemplo vazios), avisando que só a chave **anon** é permitida (o `getSupabase()` recusa `service_role`).
- **Critérios de Aceitação:** Seção preenchida; nenhum valor real.
- **Commit:** `cf3d955`
- **Anotação:** Preenchida a seção Frontend do `.env.example` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (valores vazios), avisando que são públicas (embutidas no bundle) e que só a chave anon é permitida (`getSupabase()` recusa service_role). São as únicas `VITE_*` usadas em `src/`.

#### [x] SUB-08.3: Seção Servidor Supabase: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `SUPABASE_REST_URL`
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:30 → 2026-10-12 00:30)
- **Depende de:** SUB-08.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Preencher a seção com `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (só servidor/scripts, nunca `VITE_`), `SUPABASE_ANON_KEY` (validação de sessão do `/api/embedding`, SUB-33.2) e `SUPABASE_REST_URL` (opcional, só testes locais com PostgREST).
- **Critérios de Aceitação:** Seção preenchida; nenhum valor real.
- **Commit:** `35aff13`
- **Anotação:** Preenchida a seção Servidor Supabase do `.env.example` com `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (só servidor/scripts, nunca `VITE_`), `SUPABASE_ANON_KEY` (validação de sessão do `/api/embedding`, SUB-33.2) e `SUPABASE_REST_URL` (opcional, só testes locais com PostgREST), conforme `api/_lib/supabase.ts`, `api/_lib/auth.ts` e `scripts/sincronizar_tasks.py`. Valores vazios; arquivo segue fora do `.gitignore`.

#### [x] SUB-08.4: Seção Embeddings: `OPENAI_API_KEY`, `EMBEDDING_API_URL`, `EMBEDDING_MODEL`
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:34 → 2026-10-12 00:34)
- **Depende de:** SUB-08.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Preencher a seção com `OPENAI_API_KEY` (só servidor), `EMBEDDING_API_URL` (padrão `https://api.openai.com/v1/embeddings`, aceita API compatível) e `EMBEDDING_MODEL` (padrão `text-embedding-3-small`; o vetor precisa ter 1536 dimensões), conforme `api/_lib/embeddings.ts`.
- **Critérios de Aceitação:** Seção preenchida; padrões iguais ao código.
- **Commit:** `ac47ab6`
- **Anotação:** Preenchida a seção Embeddings do `.env.example` com `OPENAI_API_KEY` (só servidor), `EMBEDDING_API_URL` (padrão `https://api.openai.com/v1/embeddings`, aceita API compatível) e `EMBEDDING_MODEL` (padrão `text-embedding-3-small`; vetor de 1536 dimensões), iguais aos padrões de `api/_lib/embeddings.ts`. Valores vazios.

#### [x] SUB-08.5: Seção MCP: `MCP_AUTH_TOKEN`, `MCP_CORS_ORIGIN`, `MCP_DEFAULT_PROJECT`, `MCP_ALLOWED_PROJECTS`
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:34 → 2026-10-12 00:35)
- **Depende de:** SUB-08.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Preencher a seção com `MCP_AUTH_TOKEN` (obrigatório para as ferramentas de dados; gerar com `openssl rand -hex 32`), `MCP_CORS_ORIGIN` (padrão `*`; restringir em produção), `MCP_DEFAULT_PROJECT` (slug padrão) e `MCP_ALLOWED_PROJECTS` (lista de slugs separada por vírgula), conforme `api/mcp.ts` e `api/_lib/args.ts`.
- **Critérios de Aceitação:** Seção preenchida; comportamento descrito igual ao código.
- **Commit:** `212cc43`
- **Anotação:** Preenchida a seção MCP do `.env.example` com `MCP_AUTH_TOKEN` (exigido no `/mcp`; sem ele as ferramentas de dados ficam desativadas; gerar com `openssl rand -hex 32`), `MCP_CORS_ORIGIN` (padrão `*`, restringir em produção; também usada pelo `/api/embedding`), `MCP_DEFAULT_PROJECT` e `MCP_ALLOWED_PROJECTS` (lista por vírgula; quando preenchida recusa memória global), conforme `api/mcp.ts`, `api/_lib/args.ts` e `api/_lib/brain-tools.ts`. Valores vazios.

#### [x] SUB-08.6: Seção Scripts: `DASHBOARD_AI_PROJECT`
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:35 → 2026-10-12 00:35)
- **Depende de:** SUB-08.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Preencher a seção Scripts com `DASHBOARD_AI_PROJECT` (projeto padrão do `scripts/sincronizar_tasks.py`, equivalente a `--projeto`), lembrando que o script lê o `.env` da raiz e usa as variáveis do servidor Supabase.
- **Critérios de Aceitação:** Seção preenchida.
- **Commit:** `86e701c`
- **Anotação:** Preenchida a seção Scripts do `.env.example` com `DASHBOARD_AI_PROJECT` (slug padrão do `scripts/sincronizar_tasks.py`, equivale a `--projeto`, padrão `default`), lembrando que o script lê o `.env` da raiz sem sobrescrever o ambiente e usa `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`. Nenhum valor real no arquivo.

#### [x] SUB-08.7: Conferir `.gitignore` (`!.env.example`)
- **Status:** concluido
- **Executor:** DashboardAI-Clone 04 (Grok Bot) (2026-10-12 00:55 → 2026-10-12 00:56)
- **Depende de:** SUB-08.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Garantir no `.gitignore` que `.env` e `.env.*` continuam ignorados e que `!.env.example` vem depois de **todas** as regras de `.env` (hoje há uma segunda linha `.env` no fim do arquivo). Conferir com `git check-ignore -v .env.example .env .env.local`.
- **Critérios de Aceitação:** `.env.example` não ignorado; `.env` e `.env.local` ignorados.
- **Commit:** `4be4a20`
- **Anotação:** Removida a segunda linha `.env` no fim do `.gitignore` (redundante e posterior ao `!.env.example`) e comentado que `!.env.example` deve ficar depois de todas as regras de `.env`. `git check-ignore -v --no-index`: `.env.example` não ignorado (`!.env.example`), `.env` e `.env.local` ignorados (`.env` / `.env.*`).

#### [x] SUB-08.8: `extrairVariaveis(texto)` em `scripts/checar-env.mjs` + testes
- **Status:** concluido
- **Executor:** DashboardAI-Clone 08 (Grok Bot) (2026-10-12 00:54 → 2026-10-12 00:55)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `scripts/checar-env.mjs` (Node, sem dependências) exportando só `extrairVariaveis(texto): string[]` (reconhece `process.env.X`, `import.meta.env.X`, `env.X` em maiúsculas e `os.environ.get("X")`/`os.environ["X"]`; sem repetidos, ordenada). Testes em `tests/unit/checar-env.test.ts`.
- **Critérios de Aceitação:** `npm test` passa (um caso por padrão reconhecido); `npm run typecheck` OK.
- **Commit:** `fb7f8bf`
- **Anotação:** Criado `scripts/checar-env.mjs` (Node, sem dependências) exportando `extrairVariaveis(texto)`: reconhece `process.env.X`, `import.meta.env.X`, `env.X` (só maiúsculas), `env['X']`, `os.environ.get('X')`, `os.environ['X']` e `os.getenv('X')`; sem repetidos, ordenada. 8 testes em `tests/unit/checar-env.test.ts`. `npm run typecheck` e `npm test` verdes.

#### [x] SUB-08.9: CLI `npm run check:env` (toda variável usada está no `.env.example`)
- **Status:** concluido
- **Executor:** DashboardAI-Clone 08 (Grok Bot) (2026-10-12 00:58 → 2026-10-12 00:59)
- **Depende de:** SUB-08.2, SUB-08.3, SUB-08.4, SUB-08.5, SUB-08.6, SUB-08.7, SUB-08.11
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar ao `scripts/checar-env.mjs` só o bloco de execução direta (`main()`): usar `listarArquivosFonte` (SUB-08.11), `extrairVariaveis` e `variaveisDoExemplo`, sair com código 1 listando as variáveis que faltam no `.env.example` (e avisar as listadas que não são usadas). Adicionar `"check:env"` no `package.json`.
- **Critérios de Aceitação:** `npm run check:env` passa no repositório; remover uma variável do `.env.example` faz falhar.
- **Commit:** `dd2b3d5`
- **Anotação:** Adicionado `main(raiz)` + execução direta em `scripts/checar-env.mjs` e `"check:env": "node scripts/checar-env.mjs"` no `package.json`: varre `src/`, `api/` e `scripts/` com `listarArquivosFonte` (pula o próprio script), extrai com `extrairVariaveis` (ignora embutidas do Vite: DEV/PROD/MODE/BASE_URL/SSR), compara com `variaveisDoExemplo`; sai 1 listando as faltantes com os arquivos e avisa as não usadas. `npm run check:env` passa (14 variáveis); removendo `EMBEDDING_MODEL` do `.env.example` falha com código 1. 2 testes de `main` em `tests/unit/checar-env.test.ts`. typecheck e `npm test` verdes.

#### [x] SUB-08.10: `variaveisDoExemplo(texto)` em `scripts/checar-env.mjs` + testes
- **Status:** concluido
- **Executor:** DashboardAI-Clone 08 (Grok Bot) (2026-10-12 00:56 → 2026-10-12 00:56)
- **Depende de:** SUB-08.8
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar a `scripts/checar-env.mjs` `variaveisDoExemplo(texto): string[]` (nomes das linhas `NOME=` do `.env.example`, ignorando comentários e linhas vazias). Testes em `tests/unit/checar-env.test.ts`.
- **Critérios de Aceitação:** `npm test` passa; `npm run typecheck` OK.
- **Commit:** `ad56d9b`
- **Anotação:** Adicionado `variaveisDoExemplo(texto)` em `scripts/checar-env.mjs`: nomes das linhas `NOME=` (aceita `export NOME=` e CRLF) do `.env.example`, ignorando comentários e linhas vazias; sem repetidos, ordenada. No `.env.example` atual devolve as 14 variáveis. 2 testes novos em `tests/unit/checar-env.test.ts`. `npm run typecheck` e `npm test` verdes.

#### [x] SUB-08.11: `listarArquivosFonte(dirs)` em `scripts/checar-env.mjs` + teste
- **Status:** concluido
- **Executor:** DashboardAI-Clone 08 (Grok Bot) (2026-10-12 00:57 → 2026-10-12 00:58)
- **Depende de:** SUB-08.10
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `listarArquivosFonte(dirs: string[]): string[]` (varre `src/`, `api/` e `scripts/` recursivamente, só `.ts/.tsx/.js/.mjs/.py`, ignorando `node_modules`, `dist` e `tests`). Teste com pasta temporária.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** `0ac9843`
- **Anotação:** Adicionado `listarArquivosFonte(dirs)` em `scripts/checar-env.mjs` (só `node:fs`/`node:path`): varre as pastas recursivamente, só `.ts/.tsx/.js/.mjs/.py` (`EXTENSOES_FONTE`), ignorando `node_modules`, `dist` e `tests` (`PASTAS_IGNORADAS`) e pastas inexistentes; devolve caminhos sem repetição e ordenados. Teste com pasta temporária em `tests/unit/checar-env.test.ts`. `npm run typecheck` e `npm test` verdes.

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
- **Depende de:** SUB-13, SUB-14, SUB-16, SUB-17, SUB-18; subtarefas SUB-34.1 a SUB-34.6
- **Subtarefas:** (subdividida em 5 em 2026-10-11 23:38 por DashboardAI (Grok Bot); a mãe só é concluída quando todas estiverem `concluido`; nova revisão para 6 em 2026-10-12 00:17)
  - `SUB-34.1`: Fallback `CarregandoTela` em `src/components/ui/CarregandoTela.tsx` (`pendente`)
  - `SUB-34.2`: Telas com `React.lazy` em `src/views/index.ts` (`pendente`)
  - `SUB-34.3`: Modais da fila sob demanda na `src/views/FilaView.tsx` (`concluido`, `964764e`)
  - `SUB-34.4`: Separar dependências grandes no `vite.config.ts` (`pendente`)
  - `SUB-34.5`: Checagem de tamanho `scripts/checar-chunks.mjs` (`pendente`)
  - `SUB-34.6`: `Suspense` com `CarregandoTela` no `src/App.tsx` (`concluido`, `67d89b6`)
- **Descrição:** Carregar as telas (Fila, Memória, Logs, Configurações) e os modais pesados com `React.lazy` + `Suspense` (fallback leve), e separar dependências grandes (ex.: supabase-js) em chunks próprios, eliminando o aviso de bundle > 500 kB do Vite.
- **Escopo por projeto:** não altera dados; apenas o empacotamento do frontend.
- **Critérios de Aceitação:** `npm run build` sem o aviso de chunk > 500 kB; navegação e modais continuam funcionando; typecheck e testes verdes.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-34.1: Fallback `CarregandoTela` em `src/components/ui/CarregandoTela.tsx`
- **Status:** concluido
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar componente leve (sem dependências pesadas) com esqueleto/spinner e `aria-busy`, para usar como `fallback` do `Suspense` em telas e modais.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-34.2: Telas com `React.lazy` em `src/views/index.ts`
- **Status:** concluido
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Trocar os imports estáticos de `TELAS` em `src/views/index.ts` por `lazy(() => import('./FilaView').then((m) => ({ default: m.FilaView })))` (idem Memória, Logs, Configurações). O `Suspense` no `App.tsx` fica na SUB-34.6.
- **Critérios de Aceitação:** `npm run typecheck` OK; `npm run build` gera um chunk por tela.
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-34.3: Modais da fila sob demanda na `src/views/FilaView.tsx`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 10 (Grok Bot) (início: 2026-10-12 01:08, conclusão: 2026-10-12 01:10)
- **Depende de:** SUB-34.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Carregar `TaskFormModal` e `TaskDetailModal` com `lazy` (import direto do arquivo, não do barrel `@/components/tasks`) e renderizá-los só quando abertos, dentro de `Suspense`.
- **Critérios de Aceitação:** `npm run build` gera chunks dos modais; abrir/editar/detalhar task funciona.
- **Commit:** `964764e`
- **Anotação:** Na `src/views/FilaView.tsx`, `TaskFormModal` e `TaskDetailModal` passam a ser `React.lazy` com import direto do arquivo e só são montados quando abertos (`form.aberto` / task de detalhe encontrada), dentro de `<Suspense fallback={null}>`. Para o split ser efetivo, os dois saíram do barrel `src/components/tasks/index.ts` (o Rolldown acusava `INEFFECTIVE_DYNAMIC_IMPORT`; nenhum outro arquivo os importava pelo barrel). Resultado do build: chunks próprios `TaskFormModal` (8,6 kB) e `TaskDetailModal` (6,7 kB); `FilaView` caiu de 40,4 kB para 26,3 kB. `npm run typecheck`, `npm test` e `npm run build` OK.

#### [ ] SUB-34.4: Separar dependências grandes no `vite.config.ts`
- **Status:** concluido
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Configurar `build.rolldownOptions.output` (Vite 8/Rolldown; conferir a opção atual: `advancedChunks.groups` ou `codeSplitting`) com grupos `react`, `supabase` (`@supabase/*`) e `icons` (`lucide-react`).
- **Critérios de Aceitação:** `npm run build` mostra os chunks `react`, `supabase` e `icons`; app abre no `vite preview`.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-34.5: Checagem de tamanho `scripts/checar-chunks.mjs`
- **Status:** em_execucao
- **Executor:** DashboardAI-Clone 09 (Grok Bot)
- **Depende de:** SUB-34.6, SUB-34.3, SUB-34.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `scripts/checar-chunks.mjs` (Node, sem dependências) que lê `dist/assets/*.js` e falha se algum passar de 500 kB; adicionar `"check:chunks"` no `package.json`.
- **Critérios de Aceitação:** `npm run build && npm run check:chunks` passa sem o aviso de chunk > 500 kB; `npm test` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-34.6: `Suspense` com `CarregandoTela` no `src/App.tsx`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 10 (Grok Bot) (início: 2026-10-12 01:03, conclusão: 2026-10-12 01:03)
- **Depende de:** SUB-34.1, SUB-34.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Envolver `<Tela />` em `<Suspense fallback={<CarregandoTela />}>` no `src/App.tsx`.
- **Critérios de Aceitação:** `npm run build` OK; navegação entre `#/fila`, `#/memoria`, `#/logs`, `#/configuracoes` funciona.
- **Commit:** `67d89b6`
- **Anotação:** No `src/App.tsx`, `<Tela />` (telas `React.lazy` da SUB-34.2) agora fica dentro de `<Suspense fallback={<CarregandoTela mensagem="Carregando tela..." />}>`, dentro do `AppLayout` (sidebar e header continuam visíveis enquanto o chunk da tela carrega). Sem isso, a primeira renderização de uma tela lazy suspendia sem fronteira. `npm run typecheck`, `npm test` e `npm run build` OK.

### [ ] SUB-19: Interface de Pesquisa Semântica Vetorial
- **Status:** pendente (aguardando subtarefas)
- **Executor:** nenhum
- **Depende de:** SUB-10, SUB-12, SUB-33; subtarefas SUB-19.1 a SUB-19.10
- **Subtarefas:** (subdividida em 8 em 2026-10-11 23:38 por DashboardAI (Grok Bot); a mãe só é concluída quando todas estiverem `concluido`; refinada para 9 em 2026-10-11 23:51; nova revisão para 10 em 2026-10-12 00:17)
  - `SUB-19.1`: `debounce(fn, ms)` em `src/lib/debounce.ts` (`pendente`)
  - `SUB-19.2`: Hook `useDebounce(valor, ms)` em `src/hooks/useDebounce.ts` (`pendente`)
  - `SUB-19.3`: `formatarSimilaridade` em `src/lib/similaridade.ts` (`pendente`)
  - `SUB-19.4`: Componente `SimilaridadeBadge` em `src/components/memoria/` (`concluido`, `ef9ec9b`)
  - `SUB-19.5`: Componente `ResultadoBuscaCard` em `src/components/memoria/` (`concluido`, `c92d3f9`)
  - `SUB-19.6`: Hook `useBuscaSemantica` em `src/hooks/useBuscaSemantica.ts` (`pendente`)
  - `SUB-19.7`: Painel `BuscaSemanticaPanel` (campo, grade e estados) (`pendente`)
  - `SUB-19.8`: Integrar a busca na `src/views/MemoriaView.tsx` (`pendente`)
  - `SUB-19.9`: `BuscaControles` (limiar, globais, modo) em `src/components/memoria/BuscaControles.tsx` (`pendente`)
  - `SUB-19.10`: `classeSimilaridade` em `src/lib/similaridade.ts` (`concluido`, `4f6700d`)
- **Descrição:** Criar componente de busca semântica onde o usuário insere uma consulta e o sistema busca memórias similares via RPC `match_memories`, exibindo a porcentagem de similaridade.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Campo de busca com debounce, exibição de cards de resultado com badge de similaridade (ex: 89%).
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-19.1: `debounce(fn, ms)` em `src/lib/debounce.ts`
- **Status:** concluido
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/lib/debounce.ts` com `export function debounce<A extends unknown[]>(fn: (...a: A) => void, ms: number): ((...a: A) => void) & { cancelar(): void }`. Testes com `vi.useFakeTimers()` em `tests/unit/debounce.test.ts`.
- **Critérios de Aceitação:** `npm test` passa (chama 1x após `ms`, reinicia o timer, `cancelar` impede); `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-19.2: Hook `useDebounce(valor, ms)` em `src/hooks/useDebounce.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 04 (Grok Bot) (2026-10-12 00:56 → 2026-10-12 00:58)
- **Depende de:** SUB-19.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/hooks/useDebounce.ts`: `export function useDebounce<T>(valor: T, ms = 400): T` (usa `setTimeout`/cleanup no `useEffect`). Exportar em `src/hooks/index.ts`.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** `ac94aa6`
- **Anotação:** Criado `src/hooks/useDebounce.ts` com `useDebounce<T>(valor, ms = 400): T` (`useState` + `setTimeout` no `useEffect`, `clearTimeout` no cleanup ao mudar valor/ms ou desmontar) e exportado em `src/hooks/index.ts`. `npm run typecheck`, `npm test` e `npm run build` OK.

#### [ ] SUB-19.3: `formatarSimilaridade` em `src/lib/similaridade.ts`
- **Status:** concluido
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/lib/similaridade.ts` só com `formatarSimilaridade(s: number): string` (`0.894` -> `'89%'`; limita a 0–100 e arredonda). Testes em `tests/unit/similaridade.test.ts`.
- **Critérios de Aceitação:** `npm test` passa; `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-19.4: Componente `SimilaridadeBadge` em `src/components/memoria/`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 10 (Grok Bot) (início: 2026-10-12 00:52, conclusão: 2026-10-12 00:53)
- **Depende de:** SUB-19.10
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/memoria/SimilaridadeBadge.tsx` (`{ similaridade: number }` -> pílula com `formatarSimilaridade` + `classeSimilaridade`, `title` acessível "Similaridade de 89%"). Criar/atualizar `src/components/memoria/index.ts` sem remover exports de outros agentes (SUB-21 pode usar a mesma pasta).
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** `ef9ec9b`
- **Anotação:** Criado `src/components/memoria/SimilaridadeBadge.tsx` (`{ similaridade, className? }`): pílula arredondada com `formatarSimilaridade` (ex.: `89%`) e cor de `classeSimilaridade` (verde/âmbar/cinza, com `dark:`), `title` e `aria-label` "Similaridade de 89%". Criado `src/components/memoria/index.ts` exportando `BuscaControles` (SUB-19.9) e `SimilaridadeBadge`. `npm run typecheck`, `npm test` e `npm run build` OK.

#### [x] SUB-19.5: Componente `ResultadoBuscaCard` em `src/components/memoria/`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 10 (Grok Bot) (início: 2026-10-12 00:54, conclusão: 2026-10-12 00:54)
- **Depende de:** SUB-19.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/memoria/ResultadoBuscaCard.tsx` com props `{ titulo, conteudo, tags, similaridade?: number, global: boolean, atualizadoEm }`: título, resumo do conteúdo (`resumo()` de `src/lib/tasks.ts`, 200 caracteres), chips de tags, selo "Global" e `SimilaridadeBadge` quando houver similaridade.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** `c92d3f9`
- **Anotação:** Criado `src/components/memoria/ResultadoBuscaCard.tsx` (`{ titulo, conteudo, tags, similaridade?, global, atualizadoEm, onClick?, className? }`): título truncado com `title`, resumo do conteúdo via `resumo(conteudo, 200)` de `src/lib/tasks.ts`, chips de tags, selo "Global" (ícone Globe) quando `global`, `SimilaridadeBadge` só quando há similaridade e data relativa (`tempoRelativo`, `title` com `formatarDataHora`); vira `<button>` acessível quando recebe `onClick`, senão `<article>`. Exportado em `src/components/memoria/index.ts`. `npm run typecheck`, `npm test` e `npm run build` OK.

#### [x] SUB-19.6: Hook `useBuscaSemantica` em `src/hooks/useBuscaSemantica.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 04 (Grok Bot) (2026-10-12 01:01 → 2026-10-12 01:02)
- **Depende de:** SUB-19.2, SUB-33.7
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/hooks/useBuscaSemantica.ts`: `useBuscaSemantica(projeto, consulta, { limiar, incluirGlobais })` -> `{ resultado: ResultadoBusca | null, carregando, erro }`, usando `useDebounce(consulta, 400)`, `buscarMemorias` (SUB-10) com `gerador: criarGeradorEmbedding()`, ignorando respostas antigas (contador de requisição) e sem buscar com texto vazio.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `f145aab`
- **Anotação:** Criado `src/hooks/useBuscaSemantica.ts` (exportado em `src/hooks/index.ts`): `useBuscaSemantica(projeto | null, consulta, { limiar, incluirGlobais })` -> `{ resultado: ResultadoBusca | null, carregando, erro }`. Usa `useDebounce(consulta.trim(), 400)` (SUB-19.2), `buscarMemorias` (SUB-10) com `gerador` de `criarGeradorEmbedding()` (SUB-33.7, memoizado); texto vazio ou sem projeto não busca e limpa o resultado; respostas antigas descartadas por contador de requisição (também invalidado ao desmontar). `npm run typecheck`, `npm test` e `npm run build` OK.

#### [x] SUB-19.7: Painel `BuscaSemanticaPanel` (campo, grade e estados)
- **Status:** concluido
- **Executor:** DashboardAI-Clone 04 (Grok Bot) (2026-10-12 01:04 → 2026-10-12 01:07)
- **Depende de:** SUB-19.5, SUB-19.6, SUB-19.9
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/memoria/BuscaSemanticaPanel.tsx` que só compõe: campo de busca, `BuscaControles` (SUB-19.9), grade responsiva de `ResultadoBuscaCard` e estados carregando/vazio/erro, usando `useBuscaSemantica`.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK; screenshot 1280x800 e 390x844.
- **Commit:** `3187754`
- **Anotação:** Criado `src/components/memoria/BuscaSemanticaPanel.tsx` (`{ projeto | null, onAbrir?(id) }`, exportado em `src/components/memoria/index.ts`), só composição: campo de busca com ícone e spinner (desativado sem projeto), `BuscaControles` (limiar padrão 70%, globais, selo do modo), grade responsiva 1/2/3 colunas (`grid-cols-1` + `min-w-0` para não estourar no celular) de `ResultadoBuscaCard` (similaridade só na busca semântica, Global quando `project_id` nulo) e estados: dica inicial, esqueleto carregando, vazio e erro (`role=alert`), dados de `useBuscaSemantica` (SUB-19.6). `npm run typecheck`, `npm test` e `npm run build` OK; screenshots 1280x800 e 390x844 conferidos com serviços simulados num harness local não commitado.

#### [x] SUB-19.8: Integrar a busca na `src/views/MemoriaView.tsx`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 04 (Grok Bot) (2026-10-12 01:07 → 2026-10-12 01:09)
- **Depende de:** SUB-19.7, SUB-21.9
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar a seção "Busca semântica" (`BuscaSemanticaPanel` com o projeto de `useProjetoAtual`) no topo da `MemoriaView`, acima da grade. Depende da SUB-21.9, que cria a tela (área reservada no topo).
- **Critérios de Aceitação:** `npm run typecheck`, `npm run build` e `npm test` OK; navegação `#/memoria` funciona.
- **Commit:** `37df2a9`
- **Anotação:** Na `src/views/MemoriaView.tsx`, a área reservada do topo virou a seção "Busca semântica" (título com ícone `Sparkles`, `aria-labelledby`) com `BuscaSemanticaPanel` (SUB-19.7) recebendo o projeto de `useProjetoAtual`, acima da grade; clicar num resultado abre o `MemoriaDetailModal` (SUB-21.11) quando a memória está na lista carregada. Conflito de comentário com a SUB-21.11 resolvido. `npm run typecheck`, `npm test` e `npm run build` OK; `#/memoria` conferido no navegador (sem Supabase local mostra o aviso de configuração).

#### [ ] SUB-19.9: `BuscaControles` (limiar, globais, modo) em `src/components/memoria/BuscaControles.tsx`
- **Status:** concluido
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Componente controlado `{ limiar, onLimiar, incluirGlobais, onIncluirGlobais, modo?: 'semantica'|'texto' }`: controle de limiar 0,5–0,95 com valor em %, checkbox incluir globais e selo do modo da última busca.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-19.10: `classeSimilaridade` em `src/lib/similaridade.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 10 (Grok Bot) (início: 2026-10-12 00:51, conclusão: 2026-10-12 00:52)
- **Depende de:** SUB-19.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `classeSimilaridade(s: number): string` com classes Tailwind (>= 0.85 verde, >= 0.7 âmbar, senão cinza, com variantes `dark:`). Testes no mesmo arquivo de teste (limites 0.85 e 0.7).
- **Critérios de Aceitação:** `npm test` passa; `npm run typecheck` OK.
- **Commit:** `4f6700d`
- **Anotação:** Adicionado `classeSimilaridade(s)` em `src/lib/similaridade.ts` com classes Tailwind de badge (fundo, texto e ring, com variantes `dark:`): `>= 0.85` verde (emerald), `>= 0.7` âmbar, abaixo disso ou valor não finito cinza (slate); limiares exportados como `LIMIAR_SIMILARIDADE_ALTA`/`LIMIAR_SIMILARIDADE_MEDIA`. 4 testes novos em `tests/unit/similaridade.test.ts` (limites 0.85 e 0.7). `npm run typecheck` e `npm test` verdes.

### [ ] SUB-20: Formulário de Nova Memória Canônica
- **Status:** pendente (aguardando subtarefas)
- **Executor:** nenhum
- **Depende de:** SUB-10, SUB-12, SUB-33; subtarefas SUB-20.1 a SUB-20.10
- **Subtarefas:** (subdividida em 7 em 2026-10-11 23:38 por DashboardAI (Grok Bot); a mãe só é concluída quando todas estiverem `concluido`; refinada para 8 em 2026-10-11 23:51; nova revisão para 10 em 2026-10-12 00:17)
  - `SUB-20.1`: `validarMemoria(dados)` em `src/lib/memoriaForm.ts` (`concluido`, `5662f1a`)
  - `SUB-20.2`: `parseTags(texto)` em `src/lib/memoriaForm.ts` (`concluido`, `78a1e70`)
  - `SUB-20.3`: `sugerirTags(titulo, conteudo)` em `src/lib/memoriaForm.ts` (`concluido`, `e5e67e5`)
  - `SUB-20.4`: Componente `TagInput` em `src/components/ui/TagInput.tsx` (`concluido`, `3d44cd1`)
  - `SUB-20.5`: Hook `useSalvarMemoria` em `src/hooks/useSalvarMemoria.ts` (`concluido`, `3208e66`)
  - `SUB-20.6`: Modal `MemoriaFormModal` em `src/components/memoria/` (`concluido`, `62dea7a`)
  - `SUB-20.7`: Botão "Nova memória" na `src/views/MemoriaView.tsx` (`pendente`)
  - `SUB-20.8`: `MarkdownEditor` em `src/components/ui/MarkdownEditor.tsx` (`pendente`)
  - `SUB-20.9`: Componente `TagSugestoes` em `src/components/ui/TagSugestoes.tsx` (`pendente`)
  - `SUB-20.10`: `palavrasDe(texto)` em `src/lib/texto.ts` (`concluido`, `8090709`)
- **Descrição:** Componente para adicionar nova memória: Título único, Conteúdo estruturado em Markdown e Tags de categorização.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Criação persistida no banco Supabase com geração de tags dinâmicas.
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-20.1: `validarMemoria(dados)` em `src/lib/memoriaForm.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 06 (início: 2026-10-12 00:48; conclusão: 2026-10-12 00:48)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/lib/memoriaForm.ts` com `export function validarMemoria({ titulo, conteudo, tags }): Partial<Record<'titulo'|'conteudo'|'tags', string>>` (título obrigatório até 200, conteúdo obrigatório, até 20 tags de até 40 caracteres). Testes em `tests/unit/memoriaForm.test.ts`.
- **Critérios de Aceitação:** `npm test` passa; `npm run typecheck` OK.
- **Commit:** `5662f1a`
- **Anotação:** Criado `src/lib/memoriaForm.ts` com `validarMemoria({ titulo, conteudo, tags })` -> `Partial<Record<"titulo"|"conteudo"|"tags", string>>` (objeto vazio = válido): título obrigatório até 200 caracteres, conteúdo obrigatório (espaços nas pontas não contam), até 20 tags, sem tags vazias, cada uma até 40 caracteres; constantes `MAX_TITULO_MEMORIA`, `MAX_TAGS_MEMORIA`, `MAX_TAMANHO_TAG` e tipos `DadosMemoriaForm`/`ErrosMemoria` exportados. Testes em `tests/unit/memoriaForm.test.ts` (6). `npm run typecheck` e `npm test` verdes.

#### [x] SUB-20.2: `parseTags(texto)` em `src/lib/memoriaForm.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 06 (início: 2026-10-12 00:50; conclusão: 2026-10-12 00:51)
- **Depende de:** SUB-20.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `export function parseTags(texto: string): string[]`: separa por vírgula, espaço ou `#`, minúsculas, remove vazios e duplicados (mesma regra de `normalizarTags` do `memoryService`). Testes no mesmo arquivo de teste.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** `78a1e70`
- **Anotação:** Adicionado `parseTags(texto)` em `src/lib/memoriaForm.ts`: separa por vírgula, qualquer espaço em branco ou `#`, `trim` + minúsculas, remove vazios e duplicados mantendo a ordem da 1ª ocorrência (mesma regra do `normalizarTags` do `memoryService`); hífens, acentos e pontos dentro da tag são preservados. 4 testes novos em `tests/unit/memoriaForm.test.ts`. `npm run typecheck` e `npm test` verdes.

#### [x] SUB-20.3: `sugerirTags(titulo, conteudo)` em `src/lib/memoriaForm.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 06 (início: 2026-10-12 00:49; conclusão: 2026-10-12 00:50)
- **Depende de:** SUB-20.1, SUB-20.10
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `export function sugerirTags(titulo: string, conteudo: string, max = 5): string[]` em `src/lib/memoriaForm.ts`: usa `palavrasDe` (SUB-20.10) no título e no conteúdo, conta frequência (título vale 2x), desempata por ordem alfabética e devolve as `max` primeiras. É a "geração de tags dinâmicas". Testes.
- **Critérios de Aceitação:** `npm test` passa (determinístico).
- **Commit:** `e5e67e5`
- **Anotação:** Adicionado `sugerirTags(titulo, conteudo, max = 5)` em `src/lib/memoriaForm.ts`: usa `palavrasDe` (SUB-20.10) no título (peso 2) e no conteúdo (peso 1), soma a frequência, ordena por pontuação decrescente com desempate alfabético e devolve as `max` primeiras (`max <= 0` -> vazio). Determinística. 6 testes novos em `tests/unit/memoriaForm.test.ts`. `npm run typecheck` e `npm test` verdes.

#### [x] SUB-20.4: Componente `TagInput` em `src/components/ui/TagInput.tsx`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 06 (início: 2026-10-12 00:52; conclusão: 2026-10-12 00:53)
- **Depende de:** SUB-20.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/ui/TagInput.tsx` com props `{ valor: string[]; onChange; erro?: string }`: chips removíveis, adiciona com Enter/vírgula usando `parseTags`, Backspace no campo vazio remove o último. As sugestões ficam no `TagSugestoes` (SUB-20.9).
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** `3d44cd1`
- **Anotação:** Criado `src/components/ui/TagInput.tsx` (`{ valor, onChange, erro?, rotulo?, placeholder?, desabilitado? }`): chips `#tag` com botão de remover (aria-label), Enter/vírgula adicionam o texto via `parseTags` (ignora tags já presentes), Backspace com campo vazio remove a última, colar texto com separadores adiciona várias, perder o foco confirma o texto pendente; erro com `aria-invalid`/`aria-describedby` e borda vermelha; modo escuro. Sugestões ficam no `TagSugestoes` (SUB-20.9). `npm run typecheck`, `npm run build` e `npm test` OK.

#### [x] SUB-20.5: Hook `useSalvarMemoria` em `src/hooks/useSalvarMemoria.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 06 (início: 2026-10-12 00:54; conclusão: 2026-10-12 00:54)
- **Depende de:** SUB-33.7
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/hooks/useSalvarMemoria.ts`: `{ salvar(projectId | null, dados): Promise<Memoria | null>, salvando }` chamando `salvarMemoria` (SUB-10) com `gerador: criarGeradorEmbedding()`, toast de sucesso/erro (`useToast`). Se o gerador falhar, salva sem vetor e avisa.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `3208e66`
- **Anotação:** Criado `src/hooks/useSalvarMemoria.ts` (exportado em `src/hooks/index.ts`): `{ salvar(projectId | null, dados): Promise<Memoria | null>, salvando }` chamando `salvarMemoria` (SUB-10) com o gerador de `criarGeradorEmbedding()` (SUB-33.7, memoizado). Se o gerador falhar (marcado com erro próprio para não confundir com erro do banco), salva de novo sem vetor e avisa em toast (`info`) que a memória não aparece na busca semântica; sucesso -> `toast.sucesso`; erro do banco/RLS -> `toast.erro` e devolve `null`. Ignora cliques repetidos enquanto salva. `npm run typecheck`, `npm test` e `npm run build` OK.

#### [x] SUB-20.6: Modal `MemoriaFormModal` em `src/components/memoria/`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 06 (início: 2026-10-12 00:55; conclusão: 2026-10-12 01:00)
- **Depende de:** SUB-20.1, SUB-20.3, SUB-20.4, SUB-20.5, SUB-20.8, SUB-20.9
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/memoria/MemoriaFormModal.tsx` (usa `Modal`/`Botao`): Título, Conteúdo com `MarkdownEditor` (SUB-20.8), Tags (`TagInput` + `TagSugestoes` alimentado por `sugerirTags`), opção "Memória global" (erro da RLS exibido no modal). Validação com `validarMemoria`; `onSalvo(memoria)`.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK; screenshot do modal.
- **Commit:** `62dea7a`
- **Anotação:** Criado `src/components/memoria/MemoriaFormModal.tsx` (exportado no `index.ts`): `{ aberto, projeto, onFechar, onSalvo(memoria) }` com `Modal`/`Botao`; Título (até 200), Conteúdo com `MarkdownEditor`, Tags com `TagInput` + `TagSugestoes` alimentado por `sugerirTags(titulo, conteudo, 8)`, opção "Memória global" (`projectId = null`). Valida com `validarMemoria` (erro por campo, foco no 1º inválido), salva com `useSalvarMemoria`; o hook ganhou `erro`/`limparErro` para o erro do banco/RLS aparecer no modal (além do toast). Estado zerado ao abrir. `npm run typecheck`, `npm run build` e `npm test` OK; screenshots headless 1280x800 e 390x844 conferidos (harness temporário, não commitado).

#### [🔄] SUB-20.7: Botão "Nova memória" na `src/views/MemoriaView.tsx`
- **Status:** em_execucao
- **Executor:** DashboardAI-Clone 04 (Grok Bot) (início: 2026-10-12 01:10)
- **Depende de:** SUB-20.6, SUB-19.8, SUB-21.9
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar botão "Nova memória" no cabeçalho da `MemoriaView` que abre o `MemoriaFormModal` e recarrega a grade (`recarregar` do `useMemorias`, SUB-21.3/21.9) e a busca após salvar. Depende da SUB-19.8 para editar a view em sequência.
- **Critérios de Aceitação:** `npm run typecheck`, `npm run build` e `npm test` OK; memória criada aparece na grade (teste manual contra banco local).
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-20.8: `MarkdownEditor` em `src/components/ui/MarkdownEditor.tsx`
- **Status:** concluido
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Componente `{ valor, onChange, erro?, rotulo }`: abas Escrever/Pré-visualizar, textarea com contador de caracteres e pré-visualização com `components/ui/Markdown` (sem HTML cru).
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-20.9: Componente `TagSugestoes` em `src/components/ui/TagSugestoes.tsx`
- **Status:** concluido
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/ui/TagSugestoes.tsx` com props `{ sugestoes: string[]; selecionadas: string[]; onEscolher(tag) }`: botões-pílula clicáveis, ocultando as já selecionadas; nada renderizado se a lista ficar vazia.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-20.10: `palavrasDe(texto)` em `src/lib/texto.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 06 (início: 2026-10-12 00:46; conclusão: 2026-10-12 00:47)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/lib/texto.ts` com `palavrasDe(texto: string): string[]`: remove Markdown (código, links, `#`, `*`, `_`), passa para minúsculas, separa em palavras e descarta as com menos de 4 letras e as stopwords pt/en (constante `STOPWORDS` no mesmo arquivo). Testes em `tests/unit/texto.test.ts`.
- **Critérios de Aceitação:** `npm test` passa; `npm run typecheck` OK.
- **Commit:** `8090709`
- **Anotação:** Criado `src/lib/texto.ts` com `STOPWORDS` (pt/en) e `palavrasDe(texto)`: remove blocos de código, código inline, imagens/links (mantém o texto), URLs e `#*_>~`; minúsculas (pt-BR, acentos preservados); separa por não letra/dígito (Unicode); descarta < 4 letras e stopwords; mantém repetições e ordem (para a contagem do `sugerirTags`, SUB-20.3). Testes em `tests/unit/texto.test.ts` (8). `npm run typecheck` e `npm test` verdes.

### [ ] SUB-21: Grid de Gerenciamento e Exclusão de Memórias
- **Status:** pendente (aguardando subtarefas)
- **Executor:** nenhum
- **Depende de:** SUB-10, SUB-12; subtarefas SUB-21.1 a SUB-21.14
- **Subtarefas:** (subdividida em 10 em 2026-10-11 23:47 por DashboardAI (Grok Bot) a pedido do usuário; a mãe só é concluída quando todas estiverem `concluido`; refinada para 12 em 2026-10-11 23:51; nova revisão para 14 em 2026-10-12 00:17)
  - `SUB-21.1`: `memoriaComoMarkdown` em `src/lib/memorias.ts` (`concluido`)
  - `SUB-21.2`: `filtrarMemoriasLocal` em `src/lib/memorias.ts` (`concluido`)
  - `SUB-21.3`: Hook `useMemorias` em `src/hooks/useMemorias.ts` (`concluido`, `b9634c5`)
  - `SUB-21.4`: Componente `MemoriaCard` em `src/components/memoria/MemoriaCard.tsx` (`concluido`, `c03ffa6`)
  - `SUB-21.5`: Componente `MemoriaGrid` em `src/components/memoria/MemoriaGrid.tsx` (`concluido`, `197eb97`)
  - `SUB-21.6`: Modal `MemoriaDetailModal` em `src/components/memoria/MemoriaDetailModal.tsx` (`concluido`, `4cab033`)
  - `SUB-21.7`: Hook `useExcluirMemoria` em `src/hooks/useExcluirMemoria.ts` (`concluido`, `ad9bd52`)
  - `SUB-21.8`: Barra `MemoriaToolbar` em `src/components/memoria/MemoriaToolbar.tsx` (`concluido`)
  - `SUB-21.9`: Montar a `MemoriaView` (toolbar + grade) (`concluido`, `4b8d62b`)
  - `SUB-21.10`: Validação visual da SUB-21 (screenshots) (`pendente`)
  - `SUB-21.11`: Ligar detalhe e exclusão na `MemoriaView` (`concluido`, `e4bacb0`)
  - `SUB-21.12`: Conferir exclusão com editor e viewer (`em_execucao`)
  - `SUB-21.13`: `escopoMemoria` em `src/lib/memorias.ts` (`concluido`)
  - `SUB-21.14`: `tagsDisponiveis` em `src/lib/memorias.ts` (`concluido`)
- **Descrição:** Exibição em cartões de todas as memórias cadastradas, com botão para copiar conteúdo Markdown, visualizar detalhes e excluir memória.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Grid responsivo com paginação/scroll e feedback de exclusão.
- **Commit:** pendente
- **Anotação:** Reserva liberada a pedido do usuário antes do início da implementação; disponível para outro agente.

#### [x] SUB-21.1: `memoriaComoMarkdown` em `src/lib/memorias.ts`
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:22 → 2026-10-12 00:22)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/lib/memorias.ts` só com `memoriaComoMarkdown(m: Memoria): string` (`# título`, linha de tags, escopo, conteúdo). Testes em `tests/unit/memorias.test.ts`.
- **Critérios de Aceitação:** `npm test` passa; `npm run typecheck` OK.
- **Commit:** `7b2ef64`
- **Anotação:** Criado `src/lib/memorias.ts` com `memoriaComoMarkdown(m)`: `# título`, linha `**Tags:**` (omitida se vazia), `**Escopo:** global|projeto` (`project_id` nulo = global) e o conteúdo. Testes em `tests/unit/memorias.test.ts`. `npm run typecheck` (app + api) e `npm test` verdes.

#### [x] SUB-21.2: `filtrarMemoriasLocal` em `src/lib/memorias.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 05 (Grok Bot) (início: 2026-10-12 00:55; conclusão: 2026-10-12 00:56)
- **Depende de:** SUB-21.13
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `filtrarMemoriasLocal(memorias, { busca, tag, escopo: 'todas'|'projeto'|'global' })` (busca sem acento/maiúsculas em título, conteúdo e tags; escopo via `escopoMemoria`). Testes no mesmo arquivo de teste.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** `0849e15`
- **Anotação:** Adicionado `filtrarMemoriasLocal(memorias, { busca?, tag?, escopo? })` em `src/lib/memorias.ts` (tipos `EscopoFiltroMemoria`/`FiltroMemoriasLocal` exportados): busca sem acento/maiúsculas em título, conteúdo e tags; tag exata sem diferenciar maiúsculas; escopo `todas`/`projeto`/`global` via `escopoMemoria`; preserva a ordem e o tipo da entrada. 4 testes novos em `tests/unit/memorias.test.ts`. `npm run typecheck` e `npm test` verdes.

#### [x] SUB-21.3: Hook `useMemorias` em `src/hooks/useMemorias.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 06 (início: 2026-10-12 01:00; conclusão: 2026-10-12 01:01)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `useMemorias(projectId, { porPagina = 30 })` -> `{ memorias, carregando, erro, temMais, carregarMais, recarregar, remover(id), reinserir(memoria) }` usando `listarMemorias` (SUB-10) com `limite` crescente (`temMais` = veio o limite cheio); ignora respostas de projeto antigo. Exportar em `src/hooks/index.ts`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `b9634c5`
- **Anotação:** Criado `src/hooks/useMemorias.ts` (exportado em `src/hooks/index.ts`): `useMemorias(projectId, { porPagina = 30 })` -> `{ memorias, carregando, erro, temMais, carregarMais, recarregar, remover(id), reinserir(memoria) }` sobre `listarMemorias` (SUB-10, projeto + globais) com `limite` crescente (`carregarMais` pede `porPagina` a mais; `temMais` = veio o limite cheio; `recarregar` mantém o limite atual). Contador de geração descarta respostas de projeto antigo/consulta superada; projeto nulo limpa a lista. `reinserir` substitui pelo id e reordena por `updated_at` desc. `npm run typecheck` e `npm test` OK.

#### [x] SUB-21.4: Componente `MemoriaCard` em `src/components/memoria/MemoriaCard.tsx`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 10 (Grok Bot) (início: 2026-10-12 00:56, conclusão: 2026-10-12 00:57)
- **Depende de:** SUB-21.13
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Cartão com título, selo Global/Projeto, chips de tags, resumo do conteúdo (`resumo()` de `src/lib/tasks.ts`, 220 caracteres), atualização relativa (`tempoRelativo`) e botões Copiar (`CopyButton` com `memoriaComoMarkdown`), Ver e Excluir (callbacks `onVer`/`onExcluir`). Criar/atualizar `src/components/memoria/index.ts` sem remover exports de outras subtarefas (SUB-19.4).
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** `c03ffa6`
- **Anotação:** Criado `src/components/memoria/MemoriaCard.tsx` (`{ memoria, onVer?, onExcluir?, className? }`): título truncado, selo Global/Projeto via `escopoMemoria` (ícones Globe/FolderKanban, com `title` explicativo), chips de tags, resumo via `resumo(content, 220)`, atualização relativa (`tempoRelativo`, `title` com `formatarDataHora`) e ações Copiar (`CopyButton` com `memoriaComoMarkdown`), Ver e Excluir (só renderizadas quando há callback; `aria-label` com o título). Exportado em `src/components/memoria/index.ts` mantendo os exports da SUB-19. `npm run typecheck`, `npm test` e `npm run build` OK.

#### [x] SUB-21.5: Componente `MemoriaGrid` em `src/components/memoria/MemoriaGrid.tsx`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 10 (Grok Bot) (início: 2026-10-12 00:57, conclusão: 2026-10-12 00:58)
- **Depende de:** SUB-21.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Grade responsiva (1/2/3 colunas) de `MemoriaCard`, esqueletos de carregamento, estado vazio (com texto diferente para filtro ativo) e botão "Carregar mais" quando `temMais`.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** `197eb97`
- **Anotação:** Criado `src/components/memoria/MemoriaGrid.tsx` (`{ memorias, carregando?, filtroAtivo?, temMais?, carregandoMais?, onCarregarMais?, onVer?, onExcluir?, className? }`): grade 1/2/3 colunas (`sm`/`xl`) de `MemoriaCard`; 6 esqueletos `animate-pulse` (`role="status"`) na primeira carga; estado vazio com textos distintos para "sem memórias" e "nenhuma corresponde aos filtros"; botão "Carregar mais" (`Botao` com `carregando`) quando `temMais`. Exportado em `src/components/memoria/index.ts`. `npm run typecheck`, `npm test` e `npm run build` OK.

#### [x] SUB-21.6: Modal `MemoriaDetailModal` em `src/components/memoria/MemoriaDetailModal.tsx`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 10 (Grok Bot) (início: 2026-10-12 00:59, conclusão: 2026-10-12 01:01)
- **Depende de:** SUB-21.13
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Modal (`components/ui/Modal`) com conteúdo renderizado por `components/ui/Markdown` (abas Formatado/Texto), tags, escopo, datas de criação/atualização, autor (`criado_por`), botão Copiar tudo (`memoriaComoMarkdown`) e botão Excluir (`onExcluir`).
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** `4cab033`
- **Anotação:** Criado `src/components/memoria/MemoriaDetailModal.tsx` (`{ memoria: Memoria | null, onFechar, onExcluir? }`; `null` = fechado) sobre `components/ui/Modal` (xl): metadados Escopo (Global/Projeto via `escopoMemoria`), Autor (`criado_por`), Criada em e Atualizada em (`formatarDataHora`, `title` relativo), tags, conteúdo com abas Formatado (`components/ui/Markdown`, sem HTML cru) / Texto (`pre`) e botão copiar conteúdo; rodapé com "Copiar tudo em Markdown" (`memoriaComoMarkdown`), Excluir (`Botao` perigo, só com `onExcluir`) e Fechar. Exportado em `src/components/memoria/index.ts` (mantidos os exports de MemoriaFormModal/MemoriaToolbar). `npm run typecheck`, `npm test` e `npm run build` OK.

#### [x] SUB-21.7: Hook `useExcluirMemoria` em `src/hooks/useExcluirMemoria.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 06 (início: 2026-10-12 01:03; conclusão: 2026-10-12 01:05)
- **Depende de:** SUB-21.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Exclusão com remoção otimista: recebe `remover`/`reinserir` do `useMemorias`, chama `excluirMemoria` (SUB-10), reinsere e mostra toast de erro se a RLS recusar; toast de sucesso. Expõe `{ excluir(memoria), excluindo }`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `ad9bd52`
- **Anotação:** Criado `src/hooks/useExcluirMemoria.ts` (exportado em `src/hooks/index.ts`): `useExcluirMemoria({ remover, reinserir, onExcluida? })` -> `{ excluir(memoria): Promise<boolean>, excluindo: Set<id> }`. Remove da lista na hora (otimista), chama `excluirMemoria` (SUB-10, que já recusa quando a RLS não apaga nenhuma linha); em erro reinsere a memória e mostra `toast.erro`, em sucesso `toast.sucesso` e `onExcluida`. `npm run typecheck` e `npm test` OK.

#### [x] SUB-21.8: Barra `MemoriaToolbar` em `src/components/memoria/MemoriaToolbar.tsx`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 05 (Grok Bot) (início: 2026-10-12 00:59; conclusão: 2026-10-12 01:00)
- **Depende de:** SUB-21.14
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Busca instantânea, filtro por tag (`tagsDisponiveis`), escopo (todas/projeto/globais), contador filtradas/total e botão Recarregar.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** `3217841`
- **Anotação:** Criado `src/components/memoria/MemoriaToolbar.tsx` (`{ filtro, onFiltro, tags, filtradas, total, carregando, onRecarregar, atualizadoEm? }`, controlado com `FiltroMemoriasLocal`): busca instantânea com botão limpar, seletor de tag com contagem (`tagsDisponiveis`; mantém a tag escolhida mesmo se sumir da lista), escopo Todas/Projeto/Globais (radiogroup acessível), contador `filtradas de total` quando há filtro (`aria-live`) e Recarregar com ícone girando e hora da última atualização no `title`; mesmo visual da `TaskToolbar`. Exportado em `src/components/memoria/index.ts`. `npm run typecheck` e `npm run build` OK.

#### [x] SUB-21.9: Montar a `MemoriaView` (toolbar + grade)
- **Status:** concluido
- **Executor:** DashboardAI-Clone 10 (Grok Bot) (início: 2026-10-12 01:04, conclusão: 2026-10-12 01:05)
- **Depende de:** SUB-21.3, SUB-21.5, SUB-21.8
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Substituir o `EmConstrucao` da `src/views/MemoriaView.tsx`: projeto de `useProjetoAtual`, `useMemorias`, `MemoriaToolbar` + `filtrarMemoriasLocal` e `MemoriaGrid`. Deixar uma área no topo para a busca semântica (SUB-19.8) e espaço no cabeçalho para o botão "Nova memória" (SUB-20.7). Detalhe e exclusão entram na SUB-21.11.
- **Critérios de Aceitação:** `npm run typecheck`, `npm run build` e `npm test` OK; `#/memoria` mostra a grade.
- **Commit:** `4b8d62b`
- **Anotação:** Substituído o `EmConstrucao` da `src/views/MemoriaView.tsx`: projeto de `useProjetoAtual` (sem projeto mantém o aviso "selecione um projeto"), dados de `useMemorias(projeto.id)`, cartão com cabeçalho "Memórias" + contador, `MemoriaToolbar` (filtro controlado, `tagsDisponiveis`, contador filtradas/total, recarregar com hora da última carga), aviso de erro (`role="alert"`) e `MemoriaGrid` com `filtrarMemoriasLocal`, estado vazio por filtro e "Carregar mais". Filtros zerados ao trocar de projeto. Pontos reservados por comentário: busca semântica no topo (SUB-19.8), botão "Nova memória" no cabeçalho (SUB-20.7); detalhe/exclusão ficam para a SUB-21.11. `npm run typecheck`, `npm test` e `npm run build` OK (conferência visual em `#/memoria` com Supabase real não feita neste ambiente).

#### [ ] SUB-21.10: Validação visual da SUB-21 (screenshots)
- **Status:** em_execucao
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-21.11
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Contra o banco local (`tests/integration/run.sh` + `vite`), conferir a grade, copiar e detalhes em 1280x800 e 390x844; registrar na anotação da SUB-21.
- **Critérios de Aceitação:** Screenshots conferidos; nenhum erro no console.
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-21.11: Ligar detalhe e exclusão na `MemoriaView`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 10 (Grok Bot) (início: 2026-10-12 01:06, conclusão: 2026-10-12 01:08)
- **Depende de:** SUB-21.9, SUB-21.6, SUB-21.7
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Na `src/views/MemoriaView.tsx`: `onVer` abre `MemoriaDetailModal`; `onExcluir` (cartão ou modal) abre `ConfirmDialog` e chama `useExcluirMemoria`.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** `e4bacb0`
- **Anotação:** Na `src/views/MemoriaView.tsx`: `onVer` do `MemoriaGrid` abre o `MemoriaDetailModal`; `onExcluir` (cartão ou modal) fecha o detalhe e abre `ConfirmDialog` (perigo, avisa quando a memória é global e que a exclusão é definitiva e some do `brain_search`); ao confirmar chama `useExcluirMemoria({ remover, reinserir })` do `useMemorias` (remoção otimista, reinsere e mostra toast se o banco/RLS recusar). `npm run typecheck`, `npm test` e `npm run build` OK.

#### [🔄] SUB-21.12: Conferir exclusão com editor e viewer
- **Status:** em_execucao
- **Executor:** DashboardAI-Clone 02
- **Depende de:** SUB-21.11
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Contra o banco local: editor exclui (some da grade, toast de sucesso); viewer tenta excluir e a memória é reinserida com toast de erro. Registrar na anotação da SUB-21.
- **Critérios de Aceitação:** Checklist registrado.
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-21.13: `escopoMemoria` em `src/lib/memorias.ts`
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot) (2026-10-12 00:26 → 2026-10-12 00:27)
- **Depende de:** SUB-21.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `escopoMemoria(m): 'global' | 'projeto'` (`project_id` nulo = global). Testes em `tests/unit/memorias.test.ts`.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** `de3cc15`
- **Anotação:** Adicionado `escopoMemoria(m): 'global' | 'projeto'` em `src/lib/memorias.ts` (`project_id` nulo/indefinido = global; 0 conta como projeto) e reutilizado em `memoriaComoMarkdown`. Testes em `tests/unit/memorias.test.ts`. typecheck (app + api) e `npm test` verdes.

#### [x] SUB-21.14: `tagsDisponiveis` em `src/lib/memorias.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 05 (Grok Bot) (início: 2026-10-12 00:57; conclusão: 2026-10-12 00:57)
- **Depende de:** SUB-21.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `tagsDisponiveis(memorias): { tag, total }[]` (contagem por tag, ordenada por total desc e depois por nome). Testes no mesmo arquivo de teste.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** `1734052`
- **Anotação:** Adicionado `tagsDisponiveis(memorias): { tag, total }[]` em `src/lib/memorias.ts` (tipo `TagDisponivel` exportado): conta memórias por tag (trim + minúsculas, vazias ignoradas, cada memória conta uma vez por tag), ordena por total desc e depois por nome (`localeCompare` pt-BR). 2 testes novos em `tests/unit/memorias.test.ts`. `npm run typecheck` e `npm test` verdes.

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
- **Depende de:** SUB-09, SUB-11, SUB-12; subtarefas SUB-23.1 a SUB-23.13
- **Subtarefas:** (subdividida em 9 em 2026-10-11 23:38 por DashboardAI (Grok Bot); a mãe só é concluída quando todas estiverem `concluido`; refinada para 12 em 2026-10-11 23:51; nova revisão para 13 em 2026-10-12 00:17)
  - `SUB-23.1`: `minutosDeTrava` em `src/lib/saudeFila.ts` (`pendente`)
  - `SUB-23.2`: `classificarPendentes(tasks)` em `src/lib/saudeFila.ts` (`concluido`)
  - `SUB-23.3`: `diagnosticarFila(tasks)` em `src/lib/saudeFila.ts` (`concluido`)
  - `SUB-23.4`: `liberarTrava()` em `src/services/taskService.ts` (`pendente`)
  - `SUB-23.5`: Teste de integração de `liberarTrava`: expirada e forçada (`concluido`)
  - `SUB-23.6`: Hook `useSaudeFila` em `src/hooks/useSaudeFila.ts` (`concluido`)
  - `SUB-23.7`: Painel `SaudeFilaPanel` (composição) em `src/components/tasks/SaudeFilaPanel.tsx` (`concluido`)
  - `SUB-23.8`: Integrar `SaudeFilaPanel` na `src/views/LogsView.tsx` (`concluido`)
  - `SUB-23.9`: Alerta de trava presa na `src/views/FilaView.tsx` (`concluido`)
  - `SUB-23.10`: `TravaItem` em `src/components/tasks/TravaItem.tsx` (`concluido`)
  - `SUB-23.11`: `PendentesResumo` em `src/components/tasks/PendentesResumo.tsx` (`concluido`, `5bce2d7`)
  - `SUB-23.12`: Teste de integração de `liberarTrava`: viewer e outro projeto (`concluido`)
  - `SUB-23.13`: `travaExpirada` em `src/lib/saudeFila.ts` (`pendente`)
- **Descrição:** Painel indicando se há lock ativo (task com `trava_frente` e `trava_em` dentro dos 90 minutos) e botão de liberação manual de trava caso expire.
- **Escopo por projeto:** dados filtrados pelo projeto selecionado (`project_id`, ver SUB-29).
- **Critérios de Aceitação:** Alerta visual se uma task estiver presa além do tempo limite.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-23.1: `minutosDeTrava` em `src/lib/saudeFila.ts`
- **Status:** concluido
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/lib/saudeFila.ts` com `LIMITE_TRAVA_MIN = 90` e `minutosDeTrava(task: Pick<Task,'trava_em'>, agora = Date.now()): number | null`. Testes em `tests/unit/saudeFila.test.ts`.
- **Critérios de Aceitação:** `npm test` passa (sem trava, 10 min, data inválida).
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-23.2: `classificarPendentes(tasks)` em `src/lib/saudeFila.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 02
- **Depende de:** SUB-23.13
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `classificarPendentes(tasks: Task[], agora)` -> `{ prontas, bloqueadas_dependencia, desligadas, agendadas, sem_tentativas }` para tasks `pendente` não excluídas (usa `dependenciasDa`/`bloqueadaPorDependencia` de `src/lib/tasks.ts`; `executar=false` desligada; `executar_apos` futuro agendada; `tentativas >= max_tentativas`). Testes.
- **Critérios de Aceitação:** `npm test` passa com um caso de cada grupo.
- **Commit:** `84011c8`
- **Anotação:** Adicionado `classificarPendentes(tasks, agora)` em `src/lib/saudeFila.ts`: agrupa pendentes não excluídas em prontas/bloqueadas_dependencia/desligadas/agendadas/sem_tentativas (um grupo por task; precedência desligada > sem tentativas > agendada > dependência) usando `dependenciasDa`/`bloqueadaPorDependencia`. Teste com um caso de cada grupo em `tests/unit/saudeFila.test.ts`. typecheck e `npm test` verdes.

#### [x] SUB-23.3: `diagnosticarFila(tasks)` em `src/lib/saudeFila.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 02
- **Depende de:** SUB-23.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `diagnosticarFila(tasks, agora, limite = 90)` -> `{ travas: { task, minutos, expirada }[], pendentes: ReturnType<classificarPendentes>, alerta: boolean }` (travas = tasks `em_execucao`, ordenadas pela mais antiga; `alerta` = alguma expirada). Testes.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** `40fa920`
- **Anotação:** Adicionado `diagnosticarFila(tasks, agora, limite = 90)` em `src/lib/saudeFila.ts` -> `{ travas: { task, minutos, expirada }[], pendentes, alerta }` (travas = `em_execucao` não excluídas, da mais antiga; pendentes via `classificarPendentes`; `alerta` se alguma expirada). Tipos `TravaDiagnostico`/`DiagnosticoFila` exportados. Testes em `tests/unit/saudeFila.test.ts`. typecheck e `npm test` verdes.

#### [ ] SUB-23.4: `liberarTrava()` em `src/services/taskService.ts`
- **Status:** concluido
- **Executor:** nenhum
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `export async function liberarTrava(projectId: number, id: number, forcar = false, client = getSupabase()): Promise<Task>` que confere se a task é do projeto (`obterTask`) e chama a RPC `liberar_trava_task({ p_task_id, p_forcar })`, com erro em português via `resultado()`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-23.5: Teste de integração de `liberarTrava`: expirada e forçada
- **Status:** concluido
- **Executor:** DashboardAI-Clone 02
- **Depende de:** SUB-23.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Em `tests/integration/taskService.integration.test.ts`: task travada há 100 min (via `service_role`) é liberada por editor; trava recente é recusada sem `forcar` e liberada com `forcar`.
- **Critérios de Aceitação:** `npm run test:integration` passa (ou o teste fica skipped sem PostgREST, e `npm test` segue verde).
- **Commit:** `af0214b`
- **Anotação:** Em `tests/integration/taskService.integration.test.ts`, bloco 'liberarTrava: expirada e forçada' (projeto LIB, editor): trava de 100 min (via `servico()`) é liberada sem forçar (status `pendente`, resultado com 'liberada manualmente'); trava de 5 min é recusada sem `forcar` (continua `em_execucao`) e liberada com `forcar`. Sem PostgREST no ambiente do clone o bloco fica skipped; `npm test` verde (162 passed, 16 skipped).

#### [x] SUB-23.6: Hook `useSaudeFila` em `src/hooks/useSaudeFila.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 02
- **Depende de:** SUB-23.3, SUB-23.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/hooks/useSaudeFila.ts`: recebe `tasks` e `recarregar` (de `useTasks`), recalcula `diagnosticarFila` a cada 30 s (relógio), expõe `liberar(task, forcar)` com toast e recarregamento, e `liberando`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `40bb5e0`
- **Anotação:** Criado `src/hooks/useSaudeFila.ts`: `useSaudeFila({ projectId, tasks, recarregar, limite? })` -> `{ diagnostico, liberando, liberar(task, forcar?) }`; recalcula `diagnosticarFila` com relógio de 30 s (`useMemo` + `setInterval` com cleanup); `liberar` chama `liberarTrava` (SUB-23.4), avisa por toast (sucesso/erro), marca `liberando` e recarrega. Exportado em `src/hooks/index.ts`. typecheck e build OK.

#### [x] SUB-23.7: Painel `SaudeFilaPanel` (composição) em `src/components/tasks/SaudeFilaPanel.tsx`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 02
- **Depende de:** SUB-23.10, SUB-23.11
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Compor o painel: título, lista de `TravaItem` (SUB-23.10) ou mensagem "Nenhuma trava ativa", e `PendentesResumo` (SUB-23.11). Exportar em `src/components/tasks/index.ts`.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** `e587121`
- **Anotação:** Criado `src/components/tasks/SaudeFilaPanel.tsx` (`{ diagnostico, liberando, onLiberar, className? }`, ligado ao `useSaudeFila`): título 'Saúde da fila' com selo 'Trava expirada' quando `alerta`, lista de `TravaItem` (contagem) ou 'Nenhuma trava ativa', e `PendentesResumo`. Exportado em `src/components/tasks/index.ts`. typecheck e build OK.

#### [x] SUB-23.8: Integrar `SaudeFilaPanel` na `src/views/LogsView.tsx`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 02
- **Depende de:** SUB-23.7
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Na `LogsView`, carregar `useTasks(projeto.id)` e exibir o `SaudeFilaPanel` acima da linha do tempo de logs.
- **Critérios de Aceitação:** `npm run typecheck`, `npm run build` e `npm test` OK; screenshot.
- **Commit:** `6c409d3`
- **Anotação:** Na `src/views/LogsView.tsx`: `useTasks(projeto?.id)` + `useSaudeFila` e `SaudeFilaPanel` exibido acima da linha do tempo de execuções. typecheck, build e `npm test` verdes (162 passed). Screenshot não gerado (sem Supabase configurado no ambiente do clone).

#### [x] SUB-23.9: Alerta de trava presa na `src/views/FilaView.tsx`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 02
- **Depende de:** SUB-23.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Na `FilaView`, calcular `diagnosticarFila(tasks)` e, se `alerta`, mostrar faixa de aviso (role=alert) "N task(s) presa(s) há mais de 90 min" com link para `#/logs`.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** `15257fd`
- **Anotação:** Na `src/views/FilaView.tsx`: `diagnosticarFila(tasks)` (memo) conta travas expiradas e, se houver, mostra faixa `role=alert` abaixo dos KPIs: 'N task(s) presa(s) há mais de 90 min' com link 'Ver saúde da fila' para `#/logs`. typecheck e build OK.

#### [x] SUB-23.10: `TravaItem` em `src/components/tasks/TravaItem.tsx`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 02
- **Depende de:** SUB-23.6
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Linha de uma trava: código, título, agente (`trava_frente`), minutos, destaque vermelho se expirada, botão "Liberar trava" com `ConfirmDialog` (forçar só com aviso extra quando não expirou), chamando `liberar(task, forcar)` do `useSaudeFila`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `e617cbf`
- **Anotação:** Criado `src/components/tasks/TravaItem.tsx` (`{ trava: TravaDiagnostico, liberando?, onLiberar(task, forcar) }`): código, título, agente (`trava_frente`), minutos (min/h), destaque vermelho e '(expirada)' quando expirada; botão 'Liberar trava' abre `ConfirmDialog` — se a trava não expirou, confirma como 'Forçar liberação' com aviso extra de trabalho duplicado e chama `onLiberar(task, true)`. Exportado em `src/components/tasks/index.ts`. typecheck e build OK.

#### [x] SUB-23.11: `PendentesResumo` em `src/components/tasks/PendentesResumo.tsx`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 10 (Grok Bot) (início: 2026-10-12 00:55, conclusão: 2026-10-12 00:56)
- **Depende de:** SUB-23.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Contadores das pendentes por grupo (`classificarPendentes`: prontas, bloqueadas por dependência, desligadas, agendadas, sem tentativas) com ícones e tooltips.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `5bce2d7`
- **Anotação:** Criado `src/components/tasks/PendentesResumo.tsx` (`{ pendentes: PendentesClassificadas, className? }`): grade responsiva com 5 contadores (Prontas, Bloqueadas por dependência, Desligadas, Agendadas, Sem tentativas) na ordem de `classificarPendentes`, cada um com ícone lucide colorido (claro/escuro), `Tooltip` explicando o grupo e `aria-label` com rótulo, total e dica (focável por teclado). Exportado em `src/components/tasks/index.ts`. `npm run typecheck`, `npm test` e `npm run build` OK.

#### [x] SUB-23.12: Teste de integração de `liberarTrava`: viewer e outro projeto
- **Status:** concluido
- **Executor:** DashboardAI-Clone 02
- **Depende de:** SUB-23.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Em `tests/integration/taskService.integration.test.ts`: viewer é recusado ao liberar trava; task de outro projeto é recusada por `liberarTrava(projectId errado, id)`.
- **Critérios de Aceitação:** `npm run test:integration` passa (skipped sem PostgREST; `npm test` segue verde).
- **Commit:** `a276f7f`
- **Anotação:** Em `tests/integration/taskService.integration.test.ts`, bloco 'liberarTrava: viewer e outro projeto' (projetos LBV/LBO): viewer recebe 'Sem permissão' ao liberar (mesmo forçando) e a task segue `em_execucao`; `liberarTrava(projectId errado, id)` rejeita com `ServiceError` (`obterTask` não acha a task no projeto) sem alterar a trava. Skipped sem PostgREST no clone; `npm test` verde.

#### [ ] SUB-23.13: `travaExpirada` em `src/lib/saudeFila.ts`
- **Status:** concluido
- **Executor:** nenhum
- **Depende de:** SUB-23.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `travaExpirada(task, agora = Date.now(), limite = LIMITE_TRAVA_MIN): boolean` usando `minutosDeTrava` (sem trava ou data inválida -> `false`). Testes em `tests/unit/saudeFila.test.ts`.
- **Critérios de Aceitação:** `npm test` passa (sem trava, 10 min, 91 min, data inválida).
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

#### [x] SUB-25.1: Script `scripts/validar.sh` + `npm run validar`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 08 (Grok Bot) (2026-10-12 00:59 → 2026-10-12 01:00)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `scripts/validar.sh` (bash, `set -euo pipefail`) que roda em sequência: `npm run typecheck`, `npm test`, `npm run build`, `npm run check:chunks` (se existir), `python3 -m unittest discover -s scripts` e `npm audit --omit=dev --audit-level=high`, com resumo final. Adicionar `"validar"` no `package.json`.
- **Critérios de Aceitação:** `npm run validar` executa no estado atual e mostra o resumo (falhas pendentes de outras tasks são relatadas, não escondidas).
- **Commit:** `2c9664c`
- **Anotação:** Criado `scripts/validar.sh` (bash, `set -euo pipefail`) e `"validar": "bash scripts/validar.sh"` no `package.json`: roda typecheck, `npm test`, build, `check:chunks` (pulada se o script não existir), `check:env` (se existir), `python3 -m unittest discover -s scripts` e `npm audit --omit=dev --audit-level=high` sem parar na primeira falha; resumo final com OK/FALHOU/PULADA e duração; sai 1 se alguma etapa falhar. `npm run validar` no estado atual: todas OK (chunks pulada, SUB-34.5 pendente).

#### [ ] SUB-25.2: Rodar `npm ci` + `npm run validar` e registrar em `docs/VALIDACAO.md`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-25.1, SUB-08.9, SUB-19, SUB-20, SUB-21, SUB-23, SUB-27 (inclui SUB-27.28), SUB-33, SUB-34
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

#### [x] SUB-26.1: Esqueleto do `README.md`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 08 (Grok Bot) (2026-10-12 01:00 → 2026-10-12 01:01)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Reescrever o `README.md` com título, descrição do produto genérico multi-projeto, badges simples e sumário com âncoras para as seções: Arquitetura, Execução local, Banco de dados, Deploy na Vercel, Agentes de IA (fila via MCP), Memória via MCP, Segurança, Validação. Cada seção com um parágrafo provisório.
- **Critérios de Aceitação:** Markdown renderiza no GitHub; âncoras do sumário funcionam.
- **Commit:** `67e13c2`
- **Anotação:** Reescrito o `README.md`: título, descrição do gerenciador genérico multi-projeto (fila via MCP, travas, dependências, memória pgvector, painel React), badges (Node 22+, React 19, TS, Supabase, Vercel, licença) e sumário com âncoras para Arquitetura, Execução local, Banco de dados, Deploy na Vercel, Agentes de IA (fila via MCP), Memória via MCP, Segurança e Validação, cada uma com parágrafo provisório apontando a SUB-26.x que a detalha. Âncoras conferidas no formato do GitHub (todas casam com os títulos). Só documentação.

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
- **Depende de:** SUB-26.1, SUB-08.9, SUB-25
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Node 22 (`.nvmrc`), `npm ci`, copiar `.env.example`, `npm run dev`, `npm test`, `npm run test:integration`, `npm run validar`.
- **Critérios de Aceitação:** Comandos conferidos contra o `package.json`.
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-26.4: Seção Banco de dados
- **Status:** concluido
- **Executor:** DashboardAI-Clone 08 (Grok Bot) (2026-10-12 01:02 → 2026-10-12 01:02)
- **Depende de:** SUB-26.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Como aplicar `database/00`–`06` no Supabase (SQL editor ou `psql`), criar projeto e membros (`projects`, `project_members`, `user_roles`), e rodar `database/tests/run_tests.sh`. Referenciar `database/README.md`.
- **Critérios de Aceitação:** Seção completa.
- **Commit:** `62ea6c0`
- **Anotação:** Seção Banco de dados do `README.md` completa: requisitos (Postgres 15+, pgvector ≥ 0.5), tabela dos scripts `00`–`06` e como aplicar (SQL Editor ou laço `psql -v ON_ERROR_STOP=1`), criação do primeiro admin (`user_roles`), de um projeto (`projects`: slug/nome/prefixo_codigo) e de membros (`project_members`, upsert por `(project_id, user_id)`), tabela de papéis viewer/editor/owner/admin, uso de `service_role` x anon, e testes locais com `database/tests/run_tests.sh` (aviso de nunca rodar contra o Supabase). Referencia `database/README.md`; SQL conferido com as colunas/constraints de `00_projects_roles.sql`. Só documentação.

#### [ ] SUB-26.5: Seção Deploy na Vercel
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-26.1, SUB-08.9, SUB-33
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Node 22 no projeto Vercel, variáveis de frontend (`VITE_*`) e de servidor (Supabase, OpenAI/embeddings, `MCP_*`), rewrite `/mcp`, limites de `maxDuration`.
- **Critérios de Aceitação:** Lista de variáveis igual ao `.env.example` (`npm run check:env` verde).
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-26.6: Seção Agentes de IA: configurar clientes MCP
- **Status:** concluido
- **Executor:** DashboardAI-Clone 08 (Grok Bot) (2026-10-12 01:06 → 2026-10-12 01:07)
- **Depende de:** SUB-26.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Como configurar o MCP em clientes (Claude Code, Codex etc.) com `Authorization: Bearer <MCP_AUTH_TOKEN>`, URL `/mcp`, argumento `project` e protocolo do quadro (`AGENTS.md`).
- **Critérios de Aceitação:** Configuração conferida com `api/mcp.ts`.
- **Commit:** `d7f05f6`
- **Anotação:** Subseção "Configurar o cliente MCP" em Agentes de IA do `README.md`: transporte Streamable HTTP (POST, protocolos 2025-06-18/2025-03-26/2024-11-05), URL `/mcp` (rewrite do `vercel.json`), `Authorization: Bearer <MCP_AUTH_TOKEN>` (sem token no servidor as ferramentas ficam desativadas; token errado -> 401), argumento `project`/`MCP_DEFAULT_PROJECT` e `MCP_ALLOWED_PROJECTS` para endpoint por projeto; exemplos para Claude Code (`claude mcp add --transport http ... --header`), Codex (`config.toml` com `url` + `bearer_token_env_var` e `codex mcp add --url --bearer-token-env-var`, conferido na documentação atual do Codex), JSON genérico (Cursor/Gemini CLI etc.), `curl` de `tools/list` e resumo do protocolo do `AGENTS.md`. Conferido com `api/mcp.ts` e `api/_lib/args.ts`. Só documentação.

#### [x] SUB-26.7: Seção Memória via MCP
- **Status:** concluido
- **Executor:** DashboardAI-Clone 08 (Grok Bot) (2026-10-12 01:03 → 2026-10-12 01:04)
- **Depende de:** SUB-26.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** `brain_store`, `brain_search`, `brain_delete`, memórias globais vs. por projeto, limiar e tags; exemplos.
- **Critérios de Aceitação:** Exemplos conferidos com `api/_lib/brain-tools.ts`.
- **Commit:** `7fa647b`
- **Anotação:** Seção Memória via MCP do `README.md`: visão geral (`ai_memories`, embedding 1536, `match_memories`, exige `MCP_AUTH_TOKEN`), escopo projeto (`project` → `MCP_DEFAULT_PROJECT` → `default`, título único por projeto/upsert) x global (`global: true`, não combina com `project`, recusada com `MCP_ALLOWED_PROJECTS`, busca inclui globais por padrão), tabela de argumentos e limites de `brain_store`/`brain_search`/`brain_delete`, explicação do limiar (padrão 0.5) e das tags (todas precisam casar), exemplos JSON-RPC `tools/call` (store por projeto, search com tags/limit/threshold, store global, delete) e `curl`, e boas práticas. Tudo conferido com `api/_lib/brain-tools.ts`, `api/_lib/args.ts`, `api/mcp.ts` e `database/04_rpc_functions.sql`; JSONs validados. Só documentação.

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

#### [x] SUB-26.10: Seção Agentes de IA: exemplos do ciclo da fila
- **Status:** concluido
- **Executor:** DashboardAI-Clone 08 (Grok Bot) (2026-10-12 01:05 → 2026-10-12 01:06)
- **Depende de:** SUB-26.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Exemplos JSON-RPC de `task_next` -> trabalho -> `task_finish` (concluida/recusada/erro) e de `task_list`/`task_create`.
- **Critérios de Aceitação:** Exemplos conferidos com `api/_lib/queue-tools.ts`.
- **Commit:** `23153af`
- **Anotação:** Subseção "Ciclo da fila (exemplos)" em Agentes de IA do `README.md`: JSON-RPC `tools/call` de `task_next` (agent, project, lock_minutes, routine; resposta `task`/`task: null` e log `sem_tarefa`; `exclusive`), `task_finish` como `concluida` (result, pr_url, commit_sha, metadata), `recusada` e `erro` (metadata.erro_mensagem), tabela do efeito de cada status (erro volta a `pendente` com tentativas sobrando), `task_list` (status/limit/include_instruction) e `task_create` (código gerado, type ia/humano, priority, order, dependencies, execute_after, max_attempts). Conferido com `api/_lib/queue-tools.ts` e `finalizar_task` em `database/04_rpc_functions.sql`; JSONs validados. A parte de configuração de clientes ficou marcada para a SUB-26.6. Só documentação.

### [ ] SUB-27: Autenticação e Login com Supabase Auth
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-03, SUB-29 (papéis `user_roles`/`project_members` e RLS); subtarefas SUB-27.1 a SUB-27.28
- **Subtarefas:** (22 filhas; subdividida em 18 em 2026-10-11 23:41 e refinada em 22 em 2026-10-11 23:51 por DashboardAI (Grok Bot); liberadas a pedido do usuário em 2026-10-11 23:55 conforme dependências; a mãe só é concluída quando todas estiverem `concluido`; nova revisão para 28 em 2026-10-12 00:17)
  - `SUB-27.1`: `mensagemErroAuth(erro)` em `src/lib/auth.ts` (`pendente`)
  - `SUB-27.2`: `validarLogin({ email, senha })` em `src/lib/auth.ts` (`pendente`)
  - `SUB-27.3`: `entrarComSenha(email, senha)` em `src/services/authService.ts` (`pendente`)
  - `SUB-27.4`: `sair()` em `src/services/authService.ts` (`pendente`)
  - `SUB-27.5`: `enviarLinkMagico()` em `src/services/authService.ts` (`pendente`)
  - `SUB-27.6`: Testes unitários de `authService` em `tests/unit/authService.test.ts` (`pendente`)
  - `SUB-27.7`: `obterPapelGlobal()` em `src/services/authService.ts` (`pendente`)
  - `SUB-27.8`: Teste de integração dos papéis em `tests/integration/authService.integration.test.ts` (`pendente`)
  - `SUB-27.9`: `AuthProvider` em `src/hooks/AuthContext.tsx` (`pendente`)
  - `SUB-27.10`: Formulário `LoginForm` (e-mail, senha, Entrar) em `src/components/auth/LoginForm.tsx` (`pendente`)
  - `SUB-27.11`: Tela `LoginView` em `src/views/LoginView.tsx` (`em_execucao`)
  - `SUB-27.12`: Guarda `RotaProtegida` em `src/components/auth/RotaProtegida.tsx` (`pendente`)
  - `SUB-27.13`: Integrar autenticação no `src/App.tsx` (`pendente`)
  - `SUB-27.14`: Componente `UserMenu` em `src/components/layout/UserMenu.tsx` (`pendente`)
  - `SUB-27.15`: Rechecar conexão no login/logout em `src/hooks/useConexao.ts` (`pendente`)
  - `SUB-27.16`: `urlDeRetorno()` para link mágico e redefinição de senha (`pendente`)
  - `SUB-27.17`: Documentar configuração do Supabase Auth em `src/README.md` (`pendente`)
  - `SUB-27.18`: Validação automatizada da SUB-27 (`pendente`)
  - `SUB-27.19`: `RecuperarAcesso` (link mágico e esqueci a senha) em `src/components/auth/RecuperarAcesso.tsx` (`pendente`)
  - `SUB-27.20`: Limpar `ProjetoContext` ao sair (`pendente`)
  - `SUB-27.21`: Documentar primeiro administrador e membros em `database/README.md` (`pendente`)
  - `SUB-27.22`: Conferência no navegador (entrar, sair, restaurar sessão) — SUB-27 (`pendente`)
  - `SUB-27.23`: `obterSessao()` em `src/services/authService.ts` (`pendente`)
  - `SUB-27.24`: `redefinirSenha()` em `src/services/authService.ts` (`pendente`)
  - `SUB-27.25`: `papelNoProjeto()` em `src/services/authService.ts` (`pendente`)
  - `SUB-27.26`: Hook `useAuth` em `src/hooks/useAuth.ts` (`pendente`)
  - `SUB-27.27`: Incluir `UserMenu` no `src/components/layout/Header.tsx` (`em_execucao`)
  - `SUB-27.28`: Varredura do bundle por `service_role` (SUB-27) (`pendente`)
- **Descrição:** Implementar tela e fluxo de login do Dashboard usando Supabase Auth, mantendo a sessão do usuário, protegendo as áreas autenticadas e oferecendo logout.
- **Critérios de Aceitação:** Login e logout funcionam via Supabase Auth; sessão é restaurada e páginas privadas redirecionam usuários não autenticados; chamadas ao banco usam o JWT do usuário e respeitam RLS; somente a chave pública anon pode estar no frontend, sem senha persistida nem chave service_role exposta.
- **Commit:** pendente
- **Anotação:** Subdivisão (DashboardAI (Grok Bot), 2026-10-11 23:41, a pedido do usuário): até este momento não havia nenhum commit de código da SUB-27 na main, então nada foi marcado como concluído; a trava e a execução continuam com Codex (OpenAI). Original: Iniciado por solicitação do usuário; a dependência SUB-03 permanece pendente e a integração com o cliente Supabase depende da conclusão dela.

#### [x] SUB-27.1: `mensagemErroAuth(erro)` em `src/lib/auth.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/lib/auth.ts` com `export function mensagemErroAuth(erro: { message?: string; code?: string; status?: number } | null): string` que traduz os erros do Supabase Auth para português (`invalid_credentials`/"Invalid login credentials" -> "E-mail ou senha inválidos.", `email_not_confirmed`, `over_request_rate_limit`/429, `user_banned`, falha de rede, genérico). Testes em `tests/unit/auth.test.ts`.
- **Critérios de Aceitação:** `npm test` passa (um caso por código + genérico); `npm run typecheck` OK.
- **Commit:** `8ccaf5f`
- **Anotação:** Criado `src/lib/auth.ts` com `mensagemErroAuth(erro)` (invalid_credentials, email_not_confirmed, rate limit/429, user_banned, rede, genérico; null -> ''). Testes em `tests/unit/auth.test.ts` (7). typecheck e vitest verdes.

#### [x] SUB-27.2: `validarLogin({ email, senha })` em `src/lib/auth.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-27.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `export function validarLogin(d: { email: string; senha: string }): Partial<Record<'email'|'senha', string>>` (e-mail obrigatório e com formato válido após `trim`, senha obrigatória com no mínimo 6 caracteres). Testes no mesmo arquivo de teste.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** `07a914b`
- **Anotação:** Adicionado `validarLogin` em `src/lib/auth.ts` (e-mail obrigatório/formato após trim; senha obrigatória, mín. 6). 4 testes em `tests/unit/auth.test.ts`; vitest e typecheck verdes.

#### [x] SUB-27.3: `entrarComSenha(email, senha)` em `src/services/authService.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-27.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/services/authService.ts` com `export async function entrarComSenha(email: string, senha: string, client = getSupabase()): Promise<Session>` usando `client.auth.signInWithPassword`; erro vira `ServiceError(mensagemErroAuth(error), 'AUTH')`. A senha nunca é guardada nem logada. Exportar no barrel `src/services/index.ts`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `c80c6c6`
- **Anotação:** Criado `src/services/authService.ts` com `entrarComSenha(email, senha, client = getSupabase())` via `signInWithPassword` (e-mail com trim); erro -> `ServiceError(mensagemErroAuth(error), 'AUTH')`; senha não guardada/logada. Exportado no barrel `src/services/index.ts`. typecheck e vitest verdes.

#### [x] SUB-27.4: `sair()` em `src/services/authService.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-27.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `sair(client)` (`auth.signOut()`, limpando também `localStorage['dashboard-ai:projeto']`; erro -> `ServiceError`).
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `7bc78da`
- **Anotação:** Adicionado `sair(client = getSupabase())` em `src/services/authService.ts`: `auth.signOut()`, remove `localStorage['dashboard-ai:projeto']` (constante `CHAVE_PROJETO_LOCAL`, tolerante sem localStorage); erro -> `ServiceError(..., 'AUTH')`. typecheck e vitest verdes.

#### [x] SUB-27.5: `enviarLinkMagico()` em `src/services/authService.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-27.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `enviarLinkMagico(email, redirectTo, client)` (`auth.signInWithOtp` com `emailRedirectTo` e `shouldCreateUser: false`), com mensagens via `mensagemErroAuth`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `500e307`
- **Anotação:** Adicionado `enviarLinkMagico(email, redirectTo, client = getSupabase())` em `src/services/authService.ts`: `auth.signInWithOtp` com `emailRedirectTo` e `shouldCreateUser: false` (e-mail com trim); erro -> `ServiceError(mensagemErroAuth(error), 'AUTH')`. typecheck e vitest verdes.

#### [x] SUB-27.6: Testes unitários de `authService` em `tests/unit/authService.test.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-27.23, SUB-27.24
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Testar com cliente falso (`auth.signInWithPassword/signOut/getSession/signInWithOtp/resetPasswordForEmail` simulados): sucesso, credenciais inválidas traduzidas, `sair` limpa o projeto salvo (stub de `localStorage`), `shouldCreateUser: false` no link mágico.
- **Critérios de Aceitação:** `npm test` passa com os casos.
- **Commit:** `f830757`
- **Anotação:** Criado `tests/unit/authService.test.ts` com cliente falso: entrar (sucesso/trim e credenciais inválidas -> ServiceError 'AUTH' traduzido), `sair` limpa o projeto salvo (stub de localStorage), `obterSessao` (sessão/null), link mágico com `shouldCreateUser: false` e `redefinirSenha` (redirectTo + 429). 6 testes verdes; typecheck OK.

#### [x] SUB-27.7: `obterPapelGlobal()` em `src/services/authService.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-27.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `obterPapelGlobal(userId, client): Promise<UserRole | null>` (lê a própria linha em `user_roles`, permitido pela policy `user_roles_select`; sem linha -> `null`).
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `5ebbd19`
- **Anotação:** Adicionado `obterPapelGlobal(userId, client = getSupabase())` em `src/services/authService.ts`: lê `role` da própria linha em `user_roles` (`maybeSingle`, policy `user_roles_select`); sem linha -> `null`; erro -> `ServiceError`. typecheck e vitest verdes.

#### [x] SUB-27.8: Teste de integração dos papéis em `tests/integration/authService.integration.test.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-27.25
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Com `tests/helpers/postgrest.ts` (JWT `authenticated` com `sub`): usuário vê o próprio papel e não o de outro; admin retorna `admin` em qualquer projeto; editor/viewer retornam o papel do projeto; não membro retorna `null`.
- **Critérios de Aceitação:** `npm run test:integration` passa (skipped sem PostgREST; `npm test` segue verde).
- **Commit:** `ca52028`
- **Anotação:** Criado `tests/integration/authService.integration.test.ts` (PostgREST local, JWT `authenticated`): usuário vê o próprio papel global e não o de outro; admin global -> `admin` em qualquer projeto; editor/viewer -> papel do projeto; não membro -> `null`. `npm run test:integration` 21/21 (Node 20 da box precisou de `NODE_OPTIONS=--experimental-websocket`; o projeto exige Node 22+); `npm test` verde (skipped sem PostgREST).

#### [x] SUB-27.9: `AuthProvider` em `src/hooks/AuthContext.tsx`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-27.23, SUB-27.25
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `AuthContext` e `AuthProvider` com `{ sessao, usuario, papelGlobal, carregando, sair }`: lê `obterSessao()` ao montar, assina `auth.onAuthStateChange` (cancelando no cleanup), recarrega `papelGlobal` quando o usuário muda; sem Supabase configurado fica `carregando=false`, `sessao=null`. O hook `useAuth` fica na SUB-27.26.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `333f8b9`
- **Anotação:** Criado `src/hooks/AuthContext.tsx` com `AuthContext`/`AuthProvider` (`sessao, usuario, papelGlobal, carregando, sair`): `obterSessao()` ao montar, `onAuthStateChange` com unsubscribe no cleanup, `papelGlobal` recarregado quando o usuário muda; sem Supabase configurado: `carregando=false`, `sessao=null`. typecheck e vitest verdes.

#### [x] SUB-27.10: Formulário `LoginForm` (e-mail, senha, Entrar) em `src/components/auth/LoginForm.tsx`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-27.2, SUB-27.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Formulário acessível (labels, `autocomplete=email/current-password`, mostrar/ocultar senha) com validação `validarLogin`, botão Entrar com estado carregando (`Botao`) e erro em `role=alert`. Criar `src/components/auth/index.ts`. Recuperação de acesso fica na SUB-27.19.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** `a082736`
- **Anotação:** Criado `src/components/auth/LoginForm.tsx` (props `onEntrou`, `onEmailChange`): labels, `autocomplete=email/current-password`, mostrar/ocultar senha (aria-pressed), `validarLogin` por campo (aria-invalid/describedby), `entrarComSenha` com `Botao` carregando e erro em `role=alert`; senha limpa após entrar. Criado `src/components/auth/index.ts` (LoginForm + RecuperarAcesso). typecheck e build OK.

#### [ ] SUB-27.11: Tela `LoginView` em `src/views/LoginView.tsx`
- **Status:** em_execucao
- **Executor:** DashboardAI-Clone 10 (Grok Bot) (início: 2026-10-12 01:11)
- **Depende de:** SUB-27.10, SUB-27.19
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Página cheia centralizada (fora do `AppLayout`): nome do produto, descrição curta, `LoginForm`, `RecuperarAcesso` (SUB-27.19), `ThemeToggle` e aviso quando o Supabase não estiver configurado (`supabaseConfigurado`). Responsiva 390x844.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK; screenshots 1280x800 e 390x844.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.12: Guarda `RotaProtegida` em `src/components/auth/RotaProtegida.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-27.26, SUB-27.11
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Componente `{ children }`: enquanto `carregando` mostra fallback leve; sem sessão renderiza `LoginView` (preservando o hash atual, ex. `#/logs`, para voltar após o login); com sessão renderiza `children`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.13: Integrar autenticação no `src/App.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-27.12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Envolver a árvore em `AuthProvider` e `RotaProtegida` (acima de `ProjetoProvider`), e dar `key={usuario?.id}` ao `ProjetoProvider` para recarregar os projetos (RLS) quando o usuário trocar.
- **Critérios de Aceitação:** `npm run typecheck`, `npm run build` e `npm test` OK; sem sessão aparece o login, com sessão o dashboard.
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-27.14: Componente `UserMenu` em `src/components/layout/UserMenu.tsx`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-27.26
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/components/layout/UserMenu.tsx` (e-mail do usuário, selo Admin quando `papelGlobal === 'admin'`, botão Sair com `sair()` e toast). A inclusão no `Header` fica na SUB-27.27.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `54bf3a6`
- **Anotação:** Criado `src/components/layout/UserMenu.tsx`: e-mail do usuário (truncado, oculto no celular), selo Admin quando `papelGlobal === 'admin'`, botão Sair com `sair()` do `useAuth` + toast de sucesso/erro; sem sessão não renderiza. typecheck OK.

#### [x] SUB-27.15: Rechecar conexão no login/logout em `src/hooks/useConexao.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-27.26
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Em `useConexao`, verificar a conexão de novo quando `auth.onAuthStateChange` disparar (estado `sem_sessao` -> `conectado` sem esperar 60 s), cancelando a assinatura no cleanup.
- **Critérios de Aceitação:** `npm run typecheck` OK; status do header atualiza logo após entrar/sair.
- **Commit:** `65932ae`
- **Anotação:** Em `src/hooks/useConexao.ts`, assinatura de `auth.onAuthStateChange` (só com Supabase configurado) que roda a verificação na hora (sem_sessao -> conectado sem esperar 60 s), cancelada no cleanup junto com o intervalo. typecheck e vitest verdes.

#### [x] SUB-27.16: `urlDeRetorno()` para link mágico e redefinição de senha
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-27.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar em `src/lib/auth.ts` `urlDeRetorno(loc: Pick<Location,'origin'|'pathname'|'hash'>): string` (origem + caminho + hash da tela, sem tokens anteriores). Testes. Quem a usa como `redirectTo` é o `RecuperarAcesso` (SUB-27.19).
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** `1e3240c`
- **Anotação:** Adicionado `urlDeRetorno(loc)` em `src/lib/auth.ts`: origem + caminho + tela do hash (`#/rota`), descartando tokens/parâmetros anteriores. 4 testes em `tests/unit/auth.test.ts`; vitest e typecheck verdes.

#### [ ] SUB-27.17: Documentar configuração do Supabase Auth em `src/README.md`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-27.13
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** No `src/README.md`: habilitar provedor e-mail no Supabase Auth, URLs de redirecionamento (local e Vercel) usadas por `urlDeRetorno`, e como a sessão é persistida. Sem chaves reais.
- **Critérios de Aceitação:** Documentação revisada.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.18: Validação automatizada da SUB-27
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-27.6, SUB-27.8, SUB-27.13, SUB-27.27, SUB-27.15, SUB-27.16, SUB-27.17, SUB-27.20, SUB-27.21
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Rodar `npm run typecheck`, `npm test`, `npm run build` e `npm run test:integration`; registrar o resultado na anotação da SUB-27.
- **Critérios de Aceitação:** Tudo verde.
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-27.19: `RecuperarAcesso` (link mágico e esqueci a senha) em `src/components/auth/RecuperarAcesso.tsx`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-27.24, SUB-27.16
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Dois botões/links: "Entrar com link por e-mail" (`enviarLinkMagico`) e "Esqueci a senha" (`redefinirSenha`), usando o e-mail informado e `urlDeRetorno(location)`; mostra confirmação de envio ou erro.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `c81668e`
- **Anotação:** Criado `src/components/auth/RecuperarAcesso.tsx` (props `{ email }`): botões "Entrar com link por e-mail" (`enviarLinkMagico`) e "Esqueci a senha" (`redefinirSenha`) com `urlDeRetorno(window.location)`, carregando por ação e aviso de confirmação/erro (role status/alert); e-mail vazio pede preenchimento. typecheck OK.

#### [x] SUB-27.20: Limpar `ProjetoContext` ao sair
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-27.26
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Em `src/hooks/ProjetoContext.tsx`, limpar `projetos` e erro quando não houver sessão (usando `useAuth`), sem perder o slug salvo.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `74588f7`
- **Anotação:** Em `src/hooks/ProjetoContext.tsx`, lê a sessão do `AuthContext` (equivalente a `useAuth`, porém tolerante fora do `AuthProvider` até a SUB-27.13 integrar o provider no App): sem sessão limpa `projetos` e `erro` mantendo o slug salvo; ao logar recarrega. typecheck, vitest e build OK.

#### [ ] SUB-27.21: Documentar primeiro administrador e membros em `database/README.md`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-27.13
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Como criar o primeiro admin (`insert into user_roles (user_id, role) values (..., 'admin')` no SQL editor) e adicionar membros em `project_members` (owner/editor/viewer). Sem chaves reais.
- **Critérios de Aceitação:** Documentação revisada.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.22: Conferência no navegador (entrar, sair, restaurar sessão) — SUB-27
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-27.18
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Conferir no navegador entrar, sair e restaurar sessão (recarregar a página); registrar na anotação da SUB-27.
- **Critérios de Aceitação:** Fluxos conferidos; nenhum erro no console.
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-27.23: `obterSessao()` em `src/services/authService.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-27.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `obterSessao(client): Promise<Session | null>` (`auth.getSession()`, erro -> `ServiceError`).
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `c696d9f`
- **Anotação:** Adicionado `obterSessao(client = getSupabase())` em `src/services/authService.ts`: `auth.getSession()` -> sessão ou `null`; erro -> `ServiceError(mensagemErroAuth(error), 'AUTH')`. typecheck verde.

#### [x] SUB-27.24: `redefinirSenha()` em `src/services/authService.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-27.5
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `redefinirSenha(email, redirectTo, client)` (`auth.resetPasswordForEmail` com `redirectTo`), com mensagens via `mensagemErroAuth`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `e5477d2`
- **Anotação:** Adicionado `redefinirSenha(email, redirectTo, client = getSupabase())` em `src/services/authService.ts`: `auth.resetPasswordForEmail` com `redirectTo` (e-mail com trim); erro -> `ServiceError(mensagemErroAuth(error), 'AUTH')`. typecheck verde.

#### [x] SUB-27.25: `papelNoProjeto()` em `src/services/authService.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-27.7
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `papelNoProjeto(projectId, userId, client): Promise<ProjectRole | 'admin' | null>` (admin global via `obterPapelGlobal` tem acesso total; senão `project_members.role`; não membro -> `null`).
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `6223e85`
- **Anotação:** Adicionado `papelNoProjeto(projectId, userId, client = getSupabase())` em `src/services/authService.ts`: admin global (`obterPapelGlobal`) -> `'admin'`; senão `project_members.role` (`maybeSingle`); não membro -> `null`; erro -> `ServiceError`. typecheck verde.

#### [x] SUB-27.26: Hook `useAuth` em `src/hooks/useAuth.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 01
- **Depende de:** SUB-27.9
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/hooks/useAuth.ts` com `useAuth()` que lê o `AuthContext` e lança erro fora do `AuthProvider`. Exportar `AuthProvider` e `useAuth` em `src/hooks/index.ts` sem remover exports existentes.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `9a947eb`
- **Anotação:** Criado `src/hooks/useAuth.ts` (`useAuth()` lê o `AuthContext` e lança erro fora do `AuthProvider`); `AuthProvider`, `AuthContext` e `useAuth` exportados em `src/hooks/index.ts` mantendo os exports existentes. typecheck OK.

#### [ ] SUB-27.27: Incluir `UserMenu` no `src/components/layout/Header.tsx`
- **Status:** em_execucao
- **Executor:** DashboardAI-Clone 06 (início: 2026-10-12 01:10)
- **Depende de:** SUB-27.14
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Renderizar `UserMenu` no `Header` ao lado do `ThemeToggle` (só com sessão), sem quebrar o layout em 390 px.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK; screenshot do header.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-27.28: Varredura do bundle por `service_role` (SUB-27)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-27.22
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Após `npm run build`, rodar `rg -n service_role dist/` e conferir que só aparecem as mensagens de recusa do `getSupabase()`; registrar na anotação da SUB-27.
- **Critérios de Aceitação:** Critérios de aceitação da SUB-27 atendidos; nenhuma chave no bundle.
- **Commit:** pendente
- **Anotação:** pendente

---

## 🚀 FASE 11: Orquestração de Tasks com LangChain/LangGraph (última fase)

### [ ] SUB-28: Integração LangChain/LangGraph para Execução de Tasks
- **Status:** pendente (aguardando subtarefas)
- **Executor:** nenhum
- **Depende de:** SUB-01 a SUB-27, SUB-29, SUB-30 (todas as tasks anteriores concluídas); subtarefas SUB-28.1 a SUB-28.32
- **Subtarefas:** (subdividida em 18 em 2026-10-11 23:38 por DashboardAI (Grok Bot); a mãe só é concluída quando todas estiverem `concluido`; refinada para 25 em 2026-10-11 23:51; nova revisão para 32 em 2026-10-12 00:17)
  - `SUB-28.1`: Contrato: identificadores e estado mínimo em `docs/langgraph-contrato.md` (`pendente`)
  - `SUB-28.2`: Dependências do worker no `package.json` (`pendente`)
  - `SUB-28.3`: Annotation `EstadoExecucao` em `worker/estado.ts` (`pendente`)
  - `SUB-28.4`: `reivindicar(agente, projeto)` em `worker/fila.ts` (`pendente`)
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
  - `SUB-28.20`: `PlanoSchema` em `worker/plano.ts` (`pendente`)
  - `SUB-28.21`: `classificarFalha(err)` em `worker/falhas.ts` (`pendente`)
  - `SUB-28.22`: `executarUmaTask(deps)` em `worker/executar.ts` (`pendente`)
  - `SUB-28.23`: Retomada da aprovação (`Command({ resume })`) em `api/aprovacao.ts` (`pendente`)
  - `SUB-28.24`: Testes do worker: interrupção e retomada sem duplicar efeitos (`pendente`)
  - `SUB-28.25`: Variáveis do worker no `api/README.md` (`pendente`)
  - `SUB-28.26`: Contrato: ferramentas permitidas e idempotência em `docs/langgraph-contrato.md` (`pendente`)
  - `SUB-28.27`: Contrato: mapeamento de erros para `finalizar_task` em `docs/langgraph-contrato.md` (`pendente`)
  - `SUB-28.28`: `worker/tsconfig.json` e `typecheck:worker` (`pendente`)
  - `SUB-28.29`: Schema zod `EstadoSchema` em `worker/estado.ts` (`pendente`)
  - `SUB-28.30`: `finalizar(...)` em `worker/fila.ts` (`pendente`)
  - `SUB-28.31`: `montarPromptPlano(estado)` em `worker/plano.ts` (`pendente`)
  - `SUB-28.32`: Registro de auditoria da aprovação (`pendente`)
- **Descrição:** Implementar a orquestração multi-etapas de execução descrita em `LangChain_LangGraph.md`, mantendo Supabase como autoridade sobre a fila, dependências, locks, tentativas e resultado. Integrar o worker LangGraph às RPCs existentes e às ferramentas MCP autorizadas, com checkpoint durável, retomada, tratamento de falhas e aprovação humana para ações sensíveis.
- **Critérios de Aceitação:** A task só inicia após todas as dependências SUB-01 a SUB-27 concluídas; execução reivindicada por `pegar_proxima_task`; estado do grafo é retomável e não duplica efeitos; escrita ocorre por ferramentas autenticadas e autorizadas; ações sensíveis pausam para aprovação; conclusão/erro e liberação do lock passam por `finalizar_task`; documentação de operação e segurança atualizada conforme `LangChain_LangGraph.md`.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.1: Contrato: identificadores e estado mínimo em `docs/langgraph-contrato.md`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-01 a SUB-27, SUB-29 a SUB-34
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `docs/langgraph-contrato.md` com a primeira seção do contrato da seção 9.1 do `LangChain_LangGraph.md`: identificador da execução (`task_id` + tentativa) e estado mínimo persistido.
- **Critérios de Aceitação:** Seção escrita e coerente com o `LangChain_LangGraph.md`.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.2: Dependências do worker no `package.json`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.27
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `@langchain/langgraph`, `@langchain/core`, `@langchain/langgraph-checkpoint-postgres` e `zod` ao `package.json` (versões fixadas no lockfile). O `worker/tsconfig.json` fica na SUB-28.28.
- **Critérios de Aceitação:** `npm ci` sem vulnerabilidades altas; `npm test` segue verde.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.3: Annotation `EstadoExecucao` em `worker/estado.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.28
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Definir `EstadoExecucao` (Annotation do LangGraph): `taskId`, `taskCodigo`, `projeto`, `agente`, `tentativa`, `execucaoId`, `instrucao`, `plano`, `passoAtual`, `resultados` (por chave de idempotência), `aprovacao`, `final`. Sem segredos. O schema zod fica na SUB-28.29.
- **Critérios de Aceitação:** `typecheck:worker` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.4: `reivindicar(agente, projeto)` em `worker/fila.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.28
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `worker/fila.ts` com `reivindicar(agente, projeto)` (RPC `pegar_proxima_task`), reutilizando `db()` de `api/_lib/supabase.ts`. `finalizar` fica na SUB-28.30.
- **Critérios de Aceitação:** `typecheck:worker` OK; teste com cliente falso.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.5: Allowlist e `obterFerramenta(nome)` em `worker/ferramentas.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.29
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Definir a allowlist (`brain_search`, `brain_store`, `task_list`) com flag `sensivel` e `obterFerramenta(nome)` que consulta o registro MCP (`api/_lib/tools.ts`) e recusa nomes fora da lista. A adaptação para o LangChain fica na SUB-28.19.
- **Critérios de Aceitação:** Teste: ferramenta fora da allowlist é recusada.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.6: Nó `carregarContexto` em `worker/nos/carregarContexto.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.29, SUB-28.19
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Busca memórias relevantes (`brain_search`) para a instrução e guarda no estado como dado não confiável.
- **Critérios de Aceitação:** Teste unitário com ferramenta falsa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.7: Nó `planejar` (chamada ao modelo) em `worker/nos/planejar.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.31
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
- **Depende de:** SUB-28.30
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
- **Depende de:** SUB-28.28
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Configurar `PostgresSaver` em schema próprio (`langgraph`) com `LANGGRAPH_DATABASE_URL` no servidor; `setup()` idempotente.
- **Critérios de Aceitação:** Teste contra Postgres local (ou skipped sem banco).
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.14: Reconciliação na retomada em `worker/reconciliar.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.30
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
- **Depende de:** SUB-28.15, SUB-33.2, SUB-27.26
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
- **Depende de:** SUB-28.15, SUB-28.32
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

#### [ ] SUB-28.20: `PlanoSchema` em `worker/plano.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.29
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `worker/plano.ts` com o schema zod `PlanoSchema` (passos com ferramenta, argumentos, `sensivel`, critério). O prompt fica na SUB-28.31.
- **Critérios de Aceitação:** Testes do schema (válido e inválido).
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.21: `classificarFalha(err)` em `worker/falhas.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.29
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

#### [ ] SUB-28.23: Retomada da aprovação (`Command({ resume })`) em `api/aprovacao.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.16
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Após autorizar, retomar o grafo com `Command({ resume: { aprovado, por, em } })` no `thread_id` da execução. O registro de auditoria fica na SUB-28.32.
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
- **Depende de:** SUB-28.15, SUB-28.32
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Documentar `LANGGRAPH_DATABASE_URL`, variáveis do modelo, endpoint de aprovação e operação do worker no `api/README.md`.
- **Critérios de Aceitação:** Documentação coerente com o código.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.26: Contrato: ferramentas permitidas e idempotência em `docs/langgraph-contrato.md`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar a seção de ferramentas permitidas (allowlist e quais são sensíveis) e chaves de idempotência (formato e onde são gravadas).
- **Critérios de Aceitação:** Seção escrita e coerente com o `LangChain_LangGraph.md`.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.27: Contrato: mapeamento de erros para `finalizar_task` em `docs/langgraph-contrato.md`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.26
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar a seção que mapeia cada tipo de falha (transitória, validação/permissão, permanente, recusa) para o status e os metadados de `finalizar_task`, e referenciar o documento no `LangChain_LangGraph.md`.
- **Critérios de Aceitação:** Documento completo e referenciado no `LangChain_LangGraph.md`.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.28: `worker/tsconfig.json` e `typecheck:worker`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `worker/tsconfig.json` (NodeNext, strict) e o script `"typecheck:worker"` no `package.json`.
- **Critérios de Aceitação:** `npm run typecheck:worker` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.29: Schema zod `EstadoSchema` em `worker/estado.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `EstadoSchema` (zod) espelhando a `EstadoExecucao` para validar o estado carregado/retomado. Teste de parse em `tests/unit/worker-estado.test.ts`.
- **Critérios de Aceitação:** `typecheck:worker` OK; teste de parse (válido e inválido) passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.30: `finalizar(...)` em `worker/fila.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.4
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `finalizar(taskId, status, resultado, agente, metadados)` (RPC `finalizar_task`), reutilizando `db()`. Teste com cliente falso cobrindo `reivindicar` e `finalizar`.
- **Critérios de Aceitação:** `typecheck:worker` OK; teste com cliente falso passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.31: `montarPromptPlano(estado)` em `worker/plano.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.20
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar a função pura `montarPromptPlano(estado)` que trata instrução e memórias como dados não confiáveis (delimitadas) e descreve o formato do `PlanoSchema`.
- **Critérios de Aceitação:** Testes do prompt (sem segredos; conteúdo não confiável delimitado).
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-28.32: Registro de auditoria da aprovação
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-28.23
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Após a retomada em `api/aprovacao.ts`, registrar quem aprovou, quando, a task e a ação (sem credenciais) nos metadados da execução/log. Teste com grafo falso.
- **Critérios de Aceitação:** `typecheck:api` OK; teste confere o registro sem credenciais.
- **Commit:** pendente
- **Anotação:** pendente

---

## 📡 FASE 12: Monitor em Tempo Real dos Agentes

### [ ] SUB-35: Monitor em Tempo Real dos Agentes
- **Status:** pendente (aguardando subtarefas)
- **Executor:** nenhum
- **Depende de:** SUB-12, SUB-29, SUB-30; subtarefas SUB-35.1 a SUB-35.46 (as partes do worker dependem de SUB-28.x)
- **Subtarefas:** (criada e subdividida em 46 em 2026-10-12 00:39 por DashboardAI (Grok Bot) a pedido do usuário; a mãe só é concluída quando todas estiverem `concluido`)
  - `SUB-35.1`: Tabela `agent_events` em `database/07_agent_events.sql` (`concluido`)
  - `SUB-35.2`: Trigger `validar_agent_event` em `database/07_agent_events.sql` (`concluido`)
  - `SUB-35.3`: RLS de `agent_events` (viewer lê, editor inclui) em `database/07_agent_events.sql` (`concluido`)
  - `SUB-35.4`: Publicar `agent_events` no Supabase Realtime (`concluido`)
  - `SUB-35.5`: Função `atividade_atual_agentes(p_project_id)` em `database/07_agent_events.sql` (`concluido`)
  - `SUB-35.6`: Teste de integração de `agent_events` (RLS e trigger) (`concluido`)
  - `SUB-35.7`: Seção "Eventos dos agentes (07)" no `database/README.md` (`concluido`)
  - `SUB-35.8`: Tipos `AgentEvent` e `AtividadeAgente` em `src/types/database.ts` (`concluido`)
  - `SUB-35.9`: `listarEventos()` em `src/services/eventService.ts` (`em_execucao`)
  - `SUB-35.10`: `atividadeAtual()` em `src/services/eventService.ts` (`pendente`)
  - `SUB-35.11`: `assinarEventos()` (Supabase Realtime) em `src/services/eventService.ts` (`pendente`)
  - `SUB-35.12`: Testes de `eventService` em `tests/unit/eventService.test.ts` (`pendente`)
  - `SUB-35.13`: Teste de integração de `listarEventos`/`atividadeAtual` (`pendente`)
  - `SUB-35.14`: `mesclarEvento()` em `src/lib/monitor.ts` (`pendente`)
  - `SUB-35.15`: `estadoDoAgente()` em `src/lib/monitor.ts` (`pendente`)
  - `SUB-35.16`: `contarPorStatus()` em `src/lib/monitor.ts` (`pendente`)
  - `SUB-35.17`: `contarPorAgente()` em `src/lib/monitor.ts` (`pendente`)
  - `SUB-35.18`: `segmentosLinhaDoTempo()` em `src/lib/monitor.ts` (`pendente`)
  - `SUB-35.19`: Hook `useEventosAgentes(projectId)` em `src/hooks/useEventosAgentes.ts` (`pendente`)
  - `SUB-35.20`: Hook `useAtividadeAgentes(projectId)` em `src/hooks/useAtividadeAgentes.ts` (`pendente`)
  - `SUB-35.21`: Instalar `chart.js` e `react-chartjs-2` (`concluido`, `73d73ad`)
  - `SUB-35.22`: Registro do Chart.js e paleta em `src/lib/charts.ts` (`concluido`, `cabdbc0`)
  - `SUB-35.23`: Componente `AgenteCard` em `src/components/monitor/AgenteCard.tsx` (`pendente`)
  - `SUB-35.24`: Componente `AtividadeAgentesGrid` em `src/components/monitor/AtividadeAgentesGrid.tsx` (`pendente`)
  - `SUB-35.25`: Gráfico `GraficoPorStatus` em `src/components/monitor/GraficoPorStatus.tsx` (`pendente`)
  - `SUB-35.26`: Gráfico `GraficoPorAgente` em `src/components/monitor/GraficoPorAgente.tsx` (`pendente`)
  - `SUB-35.27`: Linha do tempo `LinhaDoTempoAgentes` em `src/components/monitor/LinhaDoTempoAgentes.tsx` (`pendente`)
  - `SUB-35.28`: Feed `FeedEventos` em `src/components/monitor/FeedEventos.tsx` (`pendente`)
  - `SUB-35.29`: Indicador `IndicadorAoVivo` em `src/components/monitor/IndicadorAoVivo.tsx` (`pendente`)
  - `SUB-35.30`: Tela `MonitorView` em `src/views/MonitorView.tsx` (`pendente`)
  - `SUB-35.31`: Registrar a tela `monitor` (rota `#/monitor` e menu) (`pendente`)
  - `SUB-35.32`: Validação visual do monitor (SUB-35) (`pendente`)
  - `SUB-35.33`: `emitirEvento()` em `worker/eventos.ts` (`pendente`)
  - `SUB-35.34`: Testes de `emitirEvento` em `tests/unit/worker-eventos.test.ts` (`pendente`)
  - `SUB-35.35`: `comEventos(nome, no)` em `worker/eventos.ts` (`pendente`)
  - `SUB-35.36`: Envolver os nós em `worker/grafo.ts` com `comEventos` (`pendente`)
  - `SUB-35.37`: `iniciarHeartbeat()` em `worker/heartbeat.ts` (`pendente`)
  - `SUB-35.38`: Ligar o heartbeat no CLI `worker/index.ts` (`pendente`)
  - `SUB-35.39`: Teste do worker: eventos emitidos na ordem dos nós (`pendente`)
  - `SUB-35.40`: Ferramenta MCP `agent_event` em `api/_lib/event-tools.ts` (`pendente`)
  - `SUB-35.41`: Testes da ferramenta `agent_event` em `tests/unit/api-event-tools.test.ts` (`pendente`)
  - `SUB-35.42`: `commits_para_eventos()` em `scripts/espelhar_quadro_eventos.py` (`concluido`)
  - `SUB-35.43`: CLI `scripts/espelhar_quadro_eventos.py` (dry-run e `--aplicar`) (`concluido`)
  - `SUB-35.44`: Seção "Monitor em tempo real" no `README.md` (`pendente`)
  - `SUB-35.45`: Seção "Reporte de progresso (opcional)" no `AGENTS.md` (`pendente`)
  - `SUB-35.46`: Validação automatizada da SUB-35 (`pendente`)
- **Descrição:** Tela `#/monitor` que mostra, ao vivo, o que cada agente de IA está fazendo agora — versão do `dashboard-task-principal.html` (que lê o quadro em Markdown do GitHub a cada `POLL_MS` e desenha gráficos Chart.js por status, fase e agente) apoiada no **banco**: nova tabela `agent_events` (por projeto, com RLS e publicação no Supabase Realtime), assinatura Realtime no frontend (sem polling), cartões de atividade atual por agente (heartbeat), gráficos por estado e por agente, linha do tempo das etapas e feed de eventos. Os eventos vêm do worker LangGraph (SUB-28, cada nó emite `inicio`/`fim`/`erro` + heartbeat), da ferramenta MCP `agent_event` (agentes como Claude Code e Codex) e, opcionalmente, de um espelho dos commits de lock/entrega do quadro. Biblioteca de gráficos: Chart.js via `react-chartjs-2` (mesma do HTML atual, registro só dos elementos usados, canvas leve para atualização contínua). **Só exibição:** não há regra de expiração de trava; travas continuam sendo liberadas só pelo usuário.
- **Escopo por projeto:** eventos, atividade e assinatura filtrados pelo projeto selecionado (`project_id`, ver SUB-29); genérico para qualquer projeto.
- **Critérios de Aceitação:** Com dois agentes emitindo eventos, a tela atualiza em segundos sem recarregar; viewer de outro projeto não vê os eventos; build sem chunk acima de 500 kB (gráficos em chunk da tela).
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-35.1: Tabela `agent_events` em `database/07_agent_events.sql`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 05 (Grok Bot) (início: 2026-10-12 01:01; conclusão: 2026-10-12 01:02)
- **Depende de:** SUB-29
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `database/07_agent_events.sql` só com a tabela `public.agent_events`: `id` identity, `project_id` (FK `projects`, cascade), `task_id` (FK `tasks`, set null), `task_codigo`, `agente` (texto não vazio, ≤120), `execucao_id` (thread do LangGraph, ≤200), `etapa` (nó/passo, ≤120), `tipo` (check: `inicio`, `progresso`, `fim`, `erro`, `heartbeat`, `trava`, `liberacao`, `commit`), `status`, `mensagem` (≤2000), `metadados` jsonb objeto, `chave_idempotencia` (unique com `project_id`), `criado_por` (`usuario_atual()`), `created_at`. Índices `(project_id, created_at desc)` e `(project_id, agente, created_at desc)`; comentário da tabela. Sem RLS aqui.
- **Critérios de Aceitação:** Arquivo aplica em banco limpo após 00–06 (`tests/integration/run.sh` ou `psql -f`); reaplicar não falha (`if not exists`).
- **Commit:** `9f5692f`
- **Anotação:** Criado `database/07_agent_events.sql` (cabeçalho com as partes 35.1–35.5) com `public.agent_events`: `id` identity, `project_id` (FK projects, cascade), `task_id` (FK tasks, set null), `task_codigo`, `agente` (não vazio, ≤120), `execucao_id` (≤200), `etapa` (≤120), `tipo` (check inicio/progresso/fim/erro/heartbeat/trava/liberacao/commit), `status`, `mensagem` (≤2000), `metadados` jsonb objeto, `chave_idempotencia` (unique com `project_id`), `criado_por` (`usuario_atual()`), `created_at`; índices `(project_id, created_at desc)` e `(project_id, agente, created_at desc)`; comentário da tabela; sem RLS (SUB-35.3). Validado em Postgres 17 local: aplicado após 00–06 em banco limpo e reaplicado sem erro; checks de agente vazio, tipo inválido, metadados não objeto e chave de idempotência duplicada recusam como esperado.

#### [x] SUB-35.2: Trigger `validar_agent_event` em `database/07_agent_events.sql`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 05 (Grok Bot) (início: 2026-10-12 01:02; conclusão: 2026-10-12 01:03)
- **Depende de:** SUB-35.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar função + trigger `before insert or update`: task (se informada) precisa ser do mesmo projeto, preenche `task_codigo` a partir da task, e em update recusa mudar `project_id`/`agente`/`created_at` (eventos são só-inclusão). Mesmo padrão do trigger de `agent_messages` (06).
- **Critérios de Aceitação:** Aplicação limpa; inserir evento com task de outro projeto falha com mensagem clara.
- **Commit:** `54cdea9`
- **Anotação:** Adicionados `public.validar_agent_event()` (plpgsql, `security invoker`, `search_path = public`) e o trigger `validar_agent_event_trg` (`before insert or update`) em `database/07_agent_events.sql`, no padrão de `agent_messages_preparar` (06): task informada precisa ser do mesmo projeto (erro "a task N não pertence ao projeto do evento"), `task_codigo` preenchido a partir da task; no insert, `task_codigo` sem `task_id` resolve a task do projeto (código sem task é aceito, ex. subtarefa só no quadro); `agente` com trim; interface (anon/authenticated) não escolhe `criado_por`; em update recusa mudar `project_id`, `agente` e `created_at` e preserva `criado_por`. Validado em Postgres 17 local: 00–07 aplicados em banco limpo e 07 reaplicado; task de outro projeto e as 3 alterações proibidas falham com mensagem clara; resolução por código e update de `mensagem` OK.

#### [x] SUB-35.3: RLS de `agent_events` (viewer lê, editor inclui) em `database/07_agent_events.sql`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 05 (Grok Bot) (início: 2026-10-12 01:05; conclusão: 2026-10-12 01:05)
- **Depende de:** SUB-35.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Habilitar RLS e criar as policies: `select` para quem tem `tem_acesso_projeto(project_id, 'viewer')`; `insert` para `tem_acesso_projeto(project_id, 'editor')`; sem policies de `update`/`delete` (só o service_role/administração apaga). `grant select, insert` para `authenticated`.
- **Critérios de Aceitação:** Aplicação limpa; `\dp agent_events` mostra RLS ativa.
- **Commit:** `2d714d4`
- **Anotação:** Em `database/07_agent_events.sql`: RLS habilitada em `agent_events`; `revoke all` de anon/authenticated, `grant select, insert` para `authenticated` e `all` para `service_role`; policies `agent_events_select` (`tem_acesso_projeto(project_id, 'viewer')`) e `agent_events_insert` (`tem_acesso_projeto(project_id, 'editor')`); sem policies/grants de update/delete (eventos só-inclusão). Validado em Postgres 17 local (00–07 + 07 reaplicado; `\\dp agent_events` mostra as policies e `relrowsecurity = t`); smoke com `test_multi_projeto.sql`: viewer só lê o próprio projeto e não inclui; editor inclui no próprio projeto (`criado_por` = ele), é recusado em outro projeto e não tem update/delete; anon sem acesso.

#### [x] SUB-35.4: Publicar `agent_events` no Supabase Realtime
- **Status:** concluido
- **Executor:** DashboardAI-Clone 02
- **Depende de:** SUB-35.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Em `database/07_agent_events.sql`, bloco `do $$` que executa `alter publication supabase_realtime add table public.agent_events` só se a publicação existir e a tabela ainda não estiver nela (no Postgres local de testes a publicação não existe e o bloco não falha).
- **Critérios de Aceitação:** Reaplicar o arquivo não falha; no Supabase a tabela aparece em `pg_publication_tables`.
- **Commit:** `95f12ff`
- **Anotação:** Em `database/07_agent_events.sql`, bloco `do $$` que faz `alter publication supabase_realtime add table public.agent_events` só se a publicação existir e a tabela ainda não estiver nela. Validado em Postgres local (banco temporário): 00–07 aplicados 2x sem a publicação (não falha); com `create publication supabase_realtime`, 07 reaplicado 2x e `pg_publication_tables` mostra `agent_events`.

#### [x] SUB-35.5: Função `atividade_atual_agentes(p_project_id)` em `database/07_agent_events.sql`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 02
- **Depende de:** SUB-35.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Função SQL `stable`, `security invoker` (respeita a RLS), que devolve o último evento de cada agente do projeto (`distinct on (agente) ... order by agente, created_at desc`): `agente`, `task_codigo`, `etapa`, `tipo`, `status`, `mensagem`, `execucao_id`, `ultimo_em`, mais `ultimo_heartbeat_em` (último `tipo = 'heartbeat'`). `grant execute` para `authenticated`. Só exibe atividade; não altera travas.
- **Critérios de Aceitação:** Aplicação limpa; `select * from atividade_atual_agentes(<id>)` devolve uma linha por agente.
- **Commit:** `d9d9a6c`
- **Anotação:** Adicionada `atividade_atual_agentes(p_project_id bigint)` em `database/07_agent_events.sql`: SQL `stable`, `security invoker` (respeita a RLS), `distinct on (agente)` ordenado por `created_at desc` -> agente, task_codigo, etapa, tipo, status, mensagem, execucao_id, ultimo_em e ultimo_heartbeat_em (máximo dos `tipo = 'heartbeat'`). `drop function if exists` + create (reaplicável); execute só para `authenticated`/`service_role`. Validado em Postgres local: 00–07 aplicados 2x; com eventos de 2 agentes devolve 1 linha por agente com o último evento e heartbeat correto.

#### [x] SUB-35.6: Teste de integração de `agent_events` (RLS e trigger)
- **Status:** concluido
- **Executor:** DashboardAI-Clone 05 (Grok Bot) (início: 2026-10-12 01:07; conclusão: 2026-10-12 01:09)
- **Depende de:** SUB-35.2, SUB-35.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `tests/integration/agentEvents.integration.test.ts` (helpers de `tests/helpers/postgrest.ts`): viewer lê eventos do próprio projeto e não os de outro; viewer não inclui; editor inclui; `update` é recusado; task de outro projeto é recusada.
- **Critérios de Aceitação:** `npm run test:integration` passa (skipped sem PostgREST; `npm test` segue verde).
- **Commit:** `e7a39cd`
- **Anotação:** Criado `tests/integration/agentEvents.integration.test.ts` (helpers de `tests/helpers/postgrest.ts`; cliente sem tipagem de tabela até a SUB-35.8 incluir `agent_events` no tipo `Database`): viewer lê só eventos do próprio projeto; viewer não inclui (RLS); editor inclui no próprio projeto com `agente` aparado e `criado_por` = ele; update recusado (permission denied, nada alterado); task de outro projeto recusada pelo trigger ("não pertence ao projeto do evento"). `npm run test:integration` (PostgREST + Postgres 17 locais, Node 22) verde: 6 arquivos, 23 testes; `npm test` verde (skipped sem PostgREST); `npm run typecheck` OK. Obs.: no box o Node padrão é 20 e o supabase-js exige Node 22+ para a integração.

#### [x] SUB-35.7: Seção "Eventos dos agentes (07)" no `database/README.md`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 02
- **Depende de:** SUB-35.4, SUB-35.5
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Documentar colunas, tipos de evento, RLS, publicação Realtime, `atividade_atual_agentes` e a `chave_idempotencia`; incluir `07_agent_events.sql` na ordem de aplicação.
- **Critérios de Aceitação:** README revisado e coerente com o SQL.
- **Commit:** `b518611`
- **Anotação:** No `database/README.md`: `07_agent_events.sql` na tabela de ordem de aplicação (e 'Como aplicar' 00 → 07) e nova seção 'Eventos dos agentes (07)' com colunas, tipos de evento, `chave_idempotencia` (única por projeto; exemplo `git:<sha>` do espelho do quadro), trigger `validar_agent_event`, RLS (viewer lê, editor inclui, sem UPDATE/DELETE), publicação Realtime condicional e `atividade_atual_agentes`. Conferido contra o SQL.

#### [x] SUB-35.8: Tipos `AgentEvent` e `AtividadeAgente` em `src/types/database.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 05 (Grok Bot) (início: 2026-10-12 01:10; conclusão: 2026-10-12 01:11)
- **Depende de:** SUB-35.5
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `AgentEvent`, `AgentEventInsert`, `TipoEventoAgente` e `AtividadeAgente`, e registrar a tabela `agent_events` e a função `atividade_atual_agentes` no tipo `Database`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** `5a09109`
- **Anotação:** Em `src/types/database.ts`: `TIPOS_EVENTO_AGENTE` (const) + `TipoEventoAgente`, `AgentEvent` (colunas de `agent_events`, SUB-35.1), `AtividadeAgente` (retorno de `atividade_atual_agentes`, SUB-35.5, incl. `ultimo_heartbeat_em`) e `AgentEventInsert` (opcionais: id, task, execução, etapa, status, mensagem, metadados, chave, autor, data); `Database` registra `agent_events` (`Update: never`, só-inclusão) e a função `atividade_atual_agentes({ p_project_id })`. Reexportados por `src/types/index.ts`. Comentário do teste de integração da SUB-35.6 atualizado (segue sem tipagem para tentar o update proibido). `npm run typecheck` e `npm test` verdes.

#### [ ] SUB-35.9: `listarEventos()` em `src/services/eventService.ts`
- **Status:** em_execucao
- **Executor:** DashboardAI-Clone 05 (Grok Bot) (início: 2026-10-12 01:12)
- **Depende de:** SUB-35.8
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/services/eventService.ts` com `listarEventos(projectId, { desde?, agente?, limite = 200 }, client?)` (mais recentes primeiro, erros via `resultado`/`ServiceError`). Exportar no barrel `src/services/index.ts` sem remover exports.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.10: `atividadeAtual()` em `src/services/eventService.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.9
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `atividadeAtual(projectId, client?)`: chama a RPC `atividade_atual_agentes` e devolve `AtividadeAgente[]` ordenado por `ultimo_em` desc.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.11: `assinarEventos()` (Supabase Realtime) em `src/services/eventService.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.10
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `assinarEventos(projectId, { onEvento, onStatus }, client?): () => void`: canal `agent_events:<projectId>` com `postgres_changes` (`INSERT`, filtro `project_id=eq.<id>`), repassa o status do canal (`SUBSCRIBED`, `CHANNEL_ERROR`, `TIMED_OUT`, `CLOSED`) e devolve a função que remove o canal. Sem polling.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.12: Testes de `eventService` em `tests/unit/eventService.test.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.11
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Com cliente falso: `listarEventos` aplica filtros e limite; `atividadeAtual` chama a RPC e ordena; `assinarEventos` cria o canal com o filtro do projeto, repassa eventos e status e remove o canal ao cancelar.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.13: Teste de integração de `listarEventos`/`atividadeAtual`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.10, SUB-35.6
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `tests/integration/eventService.integration.test.ts`: com eventos de dois agentes, `atividadeAtual` devolve um por agente com o último evento e `ultimo_heartbeat_em`; `listarEventos` respeita `agente` e `limite`; outro projeto não aparece.
- **Critérios de Aceitação:** `npm run test:integration` passa (skipped sem PostgREST).
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.14: `mesclarEvento()` em `src/lib/monitor.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.8
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `src/lib/monitor.ts` com `mesclarEvento(lista, novo, max = 200)`: ignora `id` repetido, mantém ordem por `created_at` desc e corta em `max`. Testes em `tests/unit/monitor.test.ts`.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.15: `estadoDoAgente()` em `src/lib/monitor.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.14
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `estadoDoAgente(atividade, agora = Date.now(), { ativoAteSeg = 120, ociosoAteSeg = 900 })` -> `'ativo' | 'ocioso' | 'sem_sinal' | 'finalizado'` a partir de `ultimo_em`/`ultimo_heartbeat_em` e do último `tipo`. **Só exibição:** não sugere nem libera travas. Testes no mesmo arquivo.
- **Critérios de Aceitação:** `npm test` passa (um caso por estado).
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.16: `contarPorStatus()` em `src/lib/monitor.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.15
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `contarPorStatus(atividades, agora)` -> `{ estado, total }[]` usando `estadoDoAgente`, em ordem fixa (para o gráfico de rosca). Testes.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.17: `contarPorAgente()` em `src/lib/monitor.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.16
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `contarPorAgente(eventos)` -> `{ agente, porTipo: Record<TipoEventoAgente, number> }[]` ordenado por total desc (para o gráfico de barras empilhadas). Testes.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.18: `segmentosLinhaDoTempo()` em `src/lib/monitor.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.17
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar `segmentosLinhaDoTempo(eventos, agora)` -> `{ agente, etapa, inicio, fim, status }[]`: une `inicio` e `fim`/`erro` da mesma `execucao_id` + `etapa`; etapa ainda aberta termina em `agora`. Testes (abrir/fechar, erro, aberta).
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.19: Hook `useEventosAgentes(projectId)` em `src/hooks/useEventosAgentes.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.11, SUB-35.14
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Carrega `listarEventos` ao montar/trocar de projeto, assina `assinarEventos` e aplica `mesclarEvento` a cada INSERT; expõe `{ eventos, statusConexao: 'conectando' | 'ao_vivo' | 'erro', erro, recarregar }`; remove o canal no cleanup. Exportar em `src/hooks/index.ts`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.20: Hook `useAtividadeAgentes(projectId)` em `src/hooks/useAtividadeAgentes.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.19, SUB-35.15
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Carrega `atividadeAtual`, recarrega (com debounce de 1 s) quando `useEventosAgentes` recebe evento novo e atualiza um relógio a cada 15 s para recalcular `estadoDoAgente`; expõe `{ atividades, agora, carregando, erro }`. Exportar em `src/hooks/index.ts`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-35.21: Instalar `chart.js` e `react-chartjs-2`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 06 (início: 2026-10-12 01:06; conclusão: 2026-10-12 01:08)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** `npm install chart.js react-chartjs-2` (versões fixadas no lockfile). Sem uso no código ainda.
- **Critérios de Aceitação:** `npm ci` sem vulnerabilidades altas; `npm run build` OK.
- **Commit:** `73d73ad`
- **Anotação:** Instalados `chart.js@^4.5.1` e `react-chartjs-2@^5.3.1` em `dependencies` (versões fixadas no `package-lock.json`); ainda sem uso no código (registro/paleta na SUB-35.22). `npm ci` e `npm audit --audit-level=high` sem vulnerabilidades; `npm run build` OK.

#### [x] SUB-35.22: Registro do Chart.js e paleta em `src/lib/charts.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 06 (início: 2026-10-12 01:08; conclusão: 2026-10-12 01:09)
- **Depende de:** SUB-35.21
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Registrar só os elementos usados (`ArcElement`, `BarElement`, `CategoryScale`, `LinearScale`, `TimeScale` ou escala linear de tempo, `Tooltip`, `Legend`) para manter o bundle pequeno, e exportar `CORES_ESTADO`/`CORES_TIPO` com variantes claro/escuro.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** `cabdbc0`
- **Anotação:** Criado `src/lib/charts.ts`: `Chart.register` só com `ArcElement`, `BarElement`, `CategoryScale`, `LinearScale`, `Tooltip` e `Legend` (linha do tempo usará `LinearScale` com ms, sem `TimeScale`/adaptador de datas), reexporta `Chart`; paletas `CORES_ESTADO` (ativo/ocioso/sem_sinal/finalizado) e `CORES_TIPO` (os 8 tipos do check de `agent_events`) com variantes `claro`/`escuro`, mais `CORES_EIXO` e `corDoTema(cor, escuro)`. `npm run typecheck`, `npm run build` e `npm test` OK.

#### [ ] SUB-35.23: Componente `AgenteCard` em `src/components/monitor/AgenteCard.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.15
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Cartão de um agente: nome, selo do estado (`estadoDoAgente`), task atual (`task_codigo`), etapa/nó, última mensagem e "há X s" (`tempoRelativo`). Criar `src/components/monitor/index.ts`.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.24: Componente `AtividadeAgentesGrid` em `src/components/monitor/AtividadeAgentesGrid.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.23
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Grade responsiva de `AgenteCard` (ordem: ativos primeiro) com estado vazio "Nenhum agente reportou atividade". Exportar no barrel sem remover exports.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.25: Gráfico `GraficoPorStatus` em `src/components/monitor/GraficoPorStatus.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.22, SUB-35.16
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Rosca (`Doughnut` do `react-chartjs-2`) com `contarPorStatus`, cores de `CORES_ESTADO`, legenda e texto alternativo acessível. Exportar no barrel.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.26: Gráfico `GraficoPorAgente` em `src/components/monitor/GraficoPorAgente.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.22, SUB-35.17
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Barras horizontais empilhadas por tipo de evento (`contarPorAgente`), cores de `CORES_TIPO`. Exportar no barrel.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.27: Linha do tempo `LinhaDoTempoAgentes` em `src/components/monitor/LinhaDoTempoAgentes.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.22, SUB-35.18
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Gantt simples (barras flutuantes `[inicio, fim]` por agente, eixo de tempo da última 1 h) com `segmentosLinhaDoTempo`; tooltip com etapa e status. Exportar no barrel.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.28: Feed `FeedEventos` em `src/components/monitor/FeedEventos.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.8
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Lista ao vivo dos eventos (hora, agente, tipo, task, etapa, mensagem) com botão Pausar/Retomar a rolagem e destaque curto no evento novo; respeita `prefers-reduced-motion`. Exportar no barrel.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.29: Indicador `IndicadorAoVivo` em `src/components/monitor/IndicadorAoVivo.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.19
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Pílula com o `statusConexao` do Realtime ("Ao vivo" pulsando, "Conectando…", "Sem conexão — recarregar") e botão que chama `recarregar`. Exportar no barrel.
- **Critérios de Aceitação:** `npm run typecheck` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.30: Tela `MonitorView` em `src/views/MonitorView.tsx`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.20, SUB-35.24, SUB-35.25, SUB-35.26, SUB-35.27, SUB-35.28, SUB-35.29
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Compor a tela: projeto de `useProjetoAtual`, `useEventosAgentes` + `useAtividadeAgentes`, cabeçalho com `IndicadorAoVivo`, `AtividadeAgentesGrid`, os três gráficos e o `FeedEventos`; estados carregando/erro/sem projeto.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run build` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.31: Registrar a tela `monitor` (rota `#/monitor` e menu)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.30, SUB-34.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Mudança única de registro (o `Record<ViewId, …>` obriga a fazer junto): `'monitor'` em `ViewId` (`src/types/index.ts`), `VIEW_IDS` (`src/lib/navegacao.ts`), `VIEWS` (`src/views/meta.ts`, título "Monitor dos Agentes"), `TELAS` com `lazy` (`src/views/index.ts`) e ícone `Activity` no `ICONES` do `Sidebar`. Atualizar `tests/unit/navegacao.test.ts`.
- **Critérios de Aceitação:** `npm run typecheck`, `npm test` e `npm run build` OK; `#/monitor` abre a tela em chunk próprio.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.32: Validação visual do monitor (SUB-35)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.31
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Contra o banco local, inserir eventos (SQL ou MCP `agent_event`) e conferir que cards, gráficos e feed atualizam sem recarregar; screenshots 1280x800 e 390x844, tema claro e escuro; registrar na anotação da SUB-35.
- **Critérios de Aceitação:** Screenshots conferidos; nenhum erro no console.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.33: `emitirEvento()` em `worker/eventos.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.1, SUB-28.28
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `worker/eventos.ts` com `emitirEvento(evento, deps = { db })`: insere em `agent_events` (service_role, reutilizando `db()` de `api/_lib/supabase.ts`), corta `mensagem` em 2000 caracteres, só aceita `metadados` objeto e **nunca lança** (falha vira aviso no log sem segredos), para não derrubar a execução.
- **Critérios de Aceitação:** `npm run typecheck:worker` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.34: Testes de `emitirEvento` em `tests/unit/worker-eventos.test.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.33
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Com `db` falso: payload correto (projeto, agente, execução, etapa, tipo), mensagem cortada, falha do banco não lança.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.35: `comEventos(nome, no)` em `worker/eventos.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.33, SUB-28.3
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Função de ordem superior que envolve um nó do LangGraph: emite `inicio` antes, `fim` com duração depois e `erro` (mensagem segura, relançando o erro) com `agente`, `taskId`, `execucaoId` e `etapa = nome` do estado. Testes no mesmo arquivo de teste da SUB-35.34.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.36: Envolver os nós em `worker/grafo.ts` com `comEventos`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.35, SUB-28.12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** No `StateGraph`, registrar cada nó (`carregarContexto`, `planejar`, `politica`, `executar`, `revisar`, `finalizar`) como `comEventos('<nome>', no)`, sem mudar o roteamento.
- **Critérios de Aceitação:** `npm run typecheck:worker` OK; testes existentes do worker seguem verdes.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.37: `iniciarHeartbeat()` em `worker/heartbeat.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.33
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar `iniciarHeartbeat({ agente, projeto, intervaloMs = 30000, emitir = emitirEvento }): () => void` que emite `tipo = 'heartbeat'` (com `taskId`/`etapa` atuais via callback opcional) e devolve a função de parada. Teste com timers falsos (`vi.useFakeTimers`) em `tests/unit/worker-heartbeat.test.ts`.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.38: Ligar o heartbeat no CLI `worker/index.ts`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.37, SUB-28.15
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Iniciar o heartbeat ao subir o worker e pará-lo em `SIGINT`/`SIGTERM` e no fim do loop.
- **Critérios de Aceitação:** `npm run typecheck:worker` OK.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.39: Teste do worker: eventos emitidos na ordem dos nós
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.36, SUB-28.17
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Em `tests/unit/worker-grafo-eventos.test.ts`, rodar o grafo com modelo/fila falsos e emissor espião: sequência `inicio`/`fim` por nó na ordem esperada e `erro` no nó que falha.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** pendente
- **Anotação:** pendente

#### [x] SUB-35.40: Ferramenta MCP `agent_event` em `api/_lib/event-tools.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 08 (Grok Bot) (2026-10-12 01:08 → 2026-10-12 01:09)
- **Depende de:** SUB-35.2
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Registrar `agent_event` (`registerTool`) para agentes fora do LangGraph (Claude Code, Codex…): args `project?`, `agente`, `tipo`, `task_codigo?`, `etapa?`, `status?`, `mensagem?`, `chave_idempotencia?`; exige `MCP_AUTH_TOKEN` (`requireAuth`), resolve o projeto (`resolveProject`) e insere em `agent_events`. Importar em `api/mcp.ts` junto das outras ferramentas.
- **Critérios de Aceitação:** `npm run typecheck:api` OK; aparece em `tools/list`.
- **Commit:** `176aadb`
- **Anotação:** Criado `api/_lib/event-tools.ts` registrando a ferramenta MCP `agent_event` (args `project?`, `agente` ≤120, `tipo` em inicio/progresso/fim/erro/heartbeat/trava/liberacao/commit, `task_codigo?`, `etapa?` ≤120, `status?`, `mensagem?` ≤2000, `chave_idempotencia?` ≤200): `guard` (exige `MCP_AUTH_TOKEN`), `resolveProject` (respeita `MCP_ALLOWED_PROJECTS`, padrão `default`) + `projectId`, insere em `agent_events`; com chave usa upsert `ignoreDuplicates` em `project_id,chave_idempotencia` (reenvio devolve `duplicate: true`). `montarEvento(args)` e `TIPOS_EVENTO` exportados para os testes da SUB-35.41. Importado em `api/mcp.ts`. `npm run typecheck` (app + api) e `npm test` verdes; conferido (teste local não commitado) que `agent_event` aparece em `tools/list`.

#### [x] SUB-35.41: Testes da ferramenta `agent_event` em `tests/unit/api-event-tools.test.ts`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 08 (Grok Bot) (2026-10-12 01:10 → 2026-10-12 01:11)
- **Depende de:** SUB-35.40
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Com `db` falso: argumentos inválidos (tipo fora da lista, agente vazio) viram erro de ferramenta; projeto fora de `MCP_ALLOWED_PROJECTS` é recusado; caso ok insere o payload esperado.
- **Critérios de Aceitação:** `npm test` passa.
- **Commit:** `0263ae9`
- **Anotação:** Criado `tests/unit/api-event-tools.test.ts` com `db` falso (`vi.mock` de `api/_lib/supabase.js`, construtor encadeável que registra tabela/operação/payload/opções): tipo fora da lista e agente vazio viram erro de ferramenta sem tocar no banco; projeto fora de `MCP_ALLOWED_PROJECTS` é recusado; sem `MCP_AUTH_TOKEN` a ferramenta fica desativada; caso ok insere `{ project_id, agente (trim), tipo, task_codigo, etapa, status, mensagem }`; com `chave_idempotencia` usa upsert `{ onConflict: 'project_id,chave_idempotencia', ignoreDuplicates: true }` e devolve `duplicate: true` sem linha. 6 testes; `npm run typecheck` e `npm test` verdes.

#### [x] SUB-35.42: `commits_para_eventos()` em `scripts/espelhar_quadro_eventos.py`
- **Status:** concluido
- **Executor:** DashboardAI-Clone 02
- **Depende de:** SUB-35.1
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Função pura que recebe linhas de `git log --format='%H%x09%aI%x09%s'` e devolve eventos: `lock: assumindo sub-task SUB-X por <agente>` -> `trava`; `feat(SUB-X): …` -> `commit`; `docs(board): concluir SUB-X …` -> `fim`; `chave_idempotencia = 'git:<sha>'`. Testes em `scripts/test_espelhar_quadro_eventos.py` (unittest).
- **Critérios de Aceitação:** `python3 -m unittest scripts/test_espelhar_quadro_eventos.py` passa.
- **Commit:** `53a5c93`
- **Anotação:** Criado `scripts/espelhar_quadro_eventos.py` com a função pura `commits_para_eventos(linhas)` (entrada `git log --format='%H%x09%aI%x09%s'`): `lock: assumindo sub-task SUB-X por <agente>` -> `trava`; `feat(SUB-X): … — <agente>` -> `commit`; `docs(board): concluir SUB-X … de <agente>` -> `fim`; agente ausente vira 'desconhecido'; `chave_idempotencia = 'git:<sha>'`, `metadados.sha`, `created_at` = data do commit; linhas malformadas/outros commits ignorados. Testes em `scripts/test_espelhar_quadro_eventos.py` (4, unittest OK); conferido contra o `git log` real do repo.

#### [x] SUB-35.43: CLI `scripts/espelhar_quadro_eventos.py` (dry-run e `--aplicar`)
- **Status:** concluido
- **Executor:** DashboardAI-Clone 02
- **Depende de:** SUB-35.42
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Ler `git log` (`--desde`, `--projeto`), por padrão só listar; com `--aplicar` enviar ao PostgREST com a service_role do `.env` e `Prefer: resolution=ignore-duplicates` em `on_conflict=project_id,chave_idempotencia` (reexecutar não duplica). Para agentes que só usam o quadro em Markdown.
- **Critérios de Aceitação:** Dry-run lista os eventos do repositório; teste da função segue verde; nenhuma chave impressa.
- **Commit:** `e8917a3`
- **Anotação:** CLI em `scripts/espelhar_quadro_eventos.py`: lê `git log --reverse` (`--desde`, `--repo`), lista os eventos (dry-run por padrão) e com `--aplicar` envia em lotes a `agent_events` via `ClienteSupabase`/`.env` do `sincronizar_tasks.py` (service_role, `--projeto` ou `DASHBOARD_AI_PROJECT`) com `on_conflict=project_id,chave_idempotencia` e `Prefer: resolution=ignore-duplicates`. Teste unitário de `enviar_eventos` (5 testes OK). Validado ponta a ponta com Postgres + PostgREST locais: 216 eventos enviados 2x -> 216 linhas, sem duplicar.

#### [ ] SUB-35.44: Seção "Monitor em tempo real" no `README.md`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.31, SUB-35.40, SUB-35.43
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Explicar o fluxo (worker LangGraph -> `agent_events` -> Realtime -> `#/monitor`), como outros agentes reportam via MCP `agent_event`, o espelho do quadro e o significado dos estados (só exibição; travas só o usuário libera).
- **Critérios de Aceitação:** README revisado.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.45: Seção "Reporte de progresso (opcional)" no `AGENTS.md`
- **Status:** em_execucao
- **Executor:** DashboardAI-Clone 08 (Grok Bot) (início: 2026-10-12 01:11)
- **Depende de:** SUB-35.41
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Orientar os agentes a emitir `agent_event` (`inicio`/`progresso`/`fim`/`erro` e `heartbeat`) ao trabalhar numa subtarefa, sem substituir o protocolo de lock do quadro.
- **Critérios de Aceitação:** Seção revisada; protocolo de lock inalterado.
- **Commit:** pendente
- **Anotação:** pendente

#### [ ] SUB-35.46: Validação automatizada da SUB-35
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-35.7, SUB-35.12, SUB-35.13, SUB-35.32, SUB-35.34, SUB-35.38, SUB-35.39, SUB-35.41, SUB-35.43, SUB-35.44, SUB-35.45
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Rodar `npm run typecheck`, `npm test`, `npm run build`, `npm run test:integration` e os testes Python; registrar o resultado na anotação da SUB-35.
- **Critérios de Aceitação:** Tudo verde.
- **Commit:** pendente
- **Anotação:** pendente

### [x] SUB-36: Gráfico em rede (cérebro) dos agentes no `dashboard-task-principal.html`
- **Status:** concluido
- **Executor:** DashboardAI (Grok Bot)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** (criada em 2026-10-12 01:01 a pedido do usuário) Grafo de força estilo cérebro: nó central do quadro, um nó por agente ligado à subtarefa travada agora e às últimas entregas; agentes sem trava como ociosos; atualiza a cada leitura do painel.
- **Critérios de Aceitação:** Gráfico renderiza com o quadro atual sem erros de console; gráficos existentes intactos.
- **Commit:** `cdbf35b`
- **Anotação:** Concluída em 2026-10-12 01:02; validado com servidor estático + Chrome headless (9 agentes, sem erros de console, gráficos antigos intactos).

### [ ] SUB-37: Ranking e prêmios dos agentes no `dashboard-task-principal.html`
- **Status:** em_execucao
- **Executor:** DashboardAI (Grok Bot)
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** (criada em 2026-10-12 01:09 a pedido do usuário) Cartão "Ranking e prêmios": conta entregas concluídas por agente (histórico + CONCLUÍDAS, nomes normalizados), pódio 🥇🥈🥉 com coroa para o 1º, tabela com todos e medalhas (🔥 mais rápido da última hora, ⚡ última entrega, 🎯 marcos 10/25/50/100); destaque animado quando o líder muda; atualiza no polling.
- **Critérios de Aceitação:** Cartão renderiza com o quadro atual sem erros de console; contagens batem com contagem manual; gráficos e grafo existentes intactos.
- **Commit:** pendente
- **Anotação:** pendente
