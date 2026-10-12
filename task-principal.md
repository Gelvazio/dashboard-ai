# 📋 TASK-PRINCIPAL: Projeto Dashboard AI

> **Objetivo:** Construção da solução unificada do **Dashboard AI**, integrando o controle e fila de tarefas da IA (`tasks`), a base de memória persistente vetorial (`ai_memories` / Jev-Mem) e o monitoramento em tempo real do agendador autônomo.
> **Fonte Base:** `C:\fontes\dashboard-ai\aulassenai-base` e especificação de memória Jev-Mem.
> **Regra Geral:** Toda tarefa pode ser subdividida em mini-tarefas menores. Cada tarefa/subtarefa declara obrigatoriamente suas **Dependências** e suas **Subtarefas**. Nenhuma IA pode assumir uma tarefa cujas dependências não estejam `concluido`.

---

## 📊 Resumo de Progresso
- **Total de Tasks Principais:** 26
- **Em Execução:** 1 (`SUB-01.1`)
- **Pendentes:** 23
- **Concluídas:** 4
- **Canceladas:** 0

---

## 🧩 FASE 1: Preparação do Ambiente e Infraestrutura Básica

### [ ] SUB-01: Setup do Projeto Frontend
- **Status:** em_execucao
- **Executor:** Antigravity AI (início: 2026-10-11 22:13)
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
- **Executor:** Antigravity AI
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Critérios de Aceitação:** `package.json`, `vite.config.ts`, `tsconfig.json` e `index.html` criados.
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
- **Descrição:** Criar cliente Supabase reutilizável em `src/services/supabase.ts` e interfaces em `src/types/database.ts` para `Task`, `AiMemory`, `AgendamentoLog`.
- **Critérios de Aceitação:** Tipos e cliente exportados com suporte a variáveis de ambiente e fallback para as chaves do projeto.
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

### [ ] SUB-07: Implementação das Primitivas de Memória e Embeddings
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-06
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Implementar no `api/mcp.ts` as ferramentas `brain_store`, `brain_search`, `brain_delete` e `tools/list` com geração de vetores de embedding.
- **Critérios de Aceitação:** Endpoints respondendo a chamadas MCP com armazenamento e busca por similaridade.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-08: Configuração de Variáveis de Ambiente e `.env.example`
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-06
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Documentar e padronizar as variáveis `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY` em `.env.example`.
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
- **Critérios de Aceitação:** Funções assíncronas com tratamento de erro e ordenação por prioridade, ordem e criação.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-10: Serviço de Memória Semântica (`src/services/memoryService.ts`)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-03
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Implementar `buscarMemoriasSimilares`, `listarMemorias`, `salvarMemoria` e `excluirMemoria`.
- **Critérios de Aceitação:** Integração com RPC `match_memories` e tabela `ai_memories`.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-11: Serviço de Logs do Agendador (`src/services/logService.ts`)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-03
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Implementar consulta e filtros de histórico da tabela `agendamento_tarefa_logs`.
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
- **Descrição:** Construir o shell do Dashboard com barra lateral de navegação (Fila de Tarefas, Cérebro de Memória, Logs do Agendador, Configurações), Header com status da conexão Supabase e toggle de tema.
- **Critérios de Aceitação:** Navegação fluida entre abas/visões sem recarregar página, responsivo para desktop e mobile.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-13: Painel de Indicadores Gerais (KPI Cards)
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-09, SUB-10, SUB-11, SUB-12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Construir cards de estatísticas no topo da tela: Total de Tasks, Tasks Pendentes, Em Execução, Concluídas, Total de Memórias e Última Execução da IA.
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
- **Critérios de Aceitação:** Tabela legível, com suporte a tooltips e indicadores de progresso.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-15: Barra de Ferramentas e Filtros em Tempo Real
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-14
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Adicionar barra de filtros com busca textual (por código, título e instrução), filtro dropdown por status e botão de recarregamento manual.
- **Critérios de Aceitação:** Filtros aplicados instantaneamente na tabela sem latência perceptível.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-16: Modal de Cadastro e Edição de Task
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-09, SUB-12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Criar modal com campos: Título, Instrução (editor Markdown/textarea responsivo), Prioridade (1 a 5), Ordem, Executar Após (datetime), e Máximo de Tentativas.
- **Critérios de Aceitação:** Validação de campos obrigatórios, salvamento no Supabase e feedback visual de sucesso/erro.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-17: Modal de Visualização Detalhada da Task
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-14
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Modal de visualização completa contendo instrução formatada, relatório de resultado gravado pela IA, link do PR no GitHub e SHA do commit.
- **Critérios de Aceitação:** Renderização rica dos metadados e botão para copiar dados com um clique.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-18: Controles de Ação Rápida na Linha da Tabela
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-09, SUB-14
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Ações rápidas: Switch ON/OFF com persistência imediata, botão "Reabrir" (para recusadas/erros), botão "Cancelar" e botão "Excluir" com confirmação.
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
- **Critérios de Aceitação:** Campo de busca com debounce, exibição de cards de resultado com badge de similaridade (ex: 89%).
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-20: Formulário de Nova Memória Canônica
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-10, SUB-12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Componente para adicionar nova memória: Título único, Conteúdo estruturado em Markdown e Tags de categorização.
- **Critérios de Aceitação:** Criação persistida no banco Supabase com geração de tags dinâmicas.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-21: Grid de Gerenciamento e Exclusão de Memórias
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-10, SUB-12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Exibição em cartões de todas as memórias cadastradas, com botão para copiar conteúdo Markdown, visualizar detalhes e excluir memória.
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
- **Critérios de Aceitação:** Lista visual cronológica com badges de status e tempo de execução.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-23: Diagnóstico de Travas e Saúde da Fila
- **Status:** pendente
- **Executor:** nenhum
- **Depende de:** SUB-09, SUB-11, SUB-12
- **Subtarefas:** Nenhuma (atômica)
- **Descrição:** Painel indicando se há lock ativo (task com `trava_frente` e `trava_em` dentro dos 90 minutos) e botão de liberação manual de trava caso expire.
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
