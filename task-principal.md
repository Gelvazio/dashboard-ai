# 📋 TASK-PRINCIPAL: Projeto Dashboard AI

> **Objetivo:** Construção da solução unificada do **Dashboard AI**, integrando o controle e fila de tarefas da IA (`tasks`), a base de memória persistente vetorial (`ai_memories` / Jev-Mem) e o monitoramento em tempo real do agendador autônomo.
> **Fonte Base:** `C:\fontes\dashboard-ai\aulassenai-base` e especificação de memória Jev-Mem.
> **Regra Geral:** Cada mini-task abaixo é atômica. Qualquer agente de IA pode assumir uma mini-task livre (`pendente`), desde que registre a trava no [quadro-task-principal.md](file:///c:/fontes/dashboard-ai/quadro-task-principal.md) antes de iniciar, e execute o commit + anotação após concluir.

---

## 📊 Resumo de Progresso
- **Total de Mini-tasks:** 26
- **Pendentes:** 26
- **Em Execução:** 0
- **Concluídas:** 0
- **Canceladas:** 0

---

## 🧩 FASE 1: Preparação do Ambiente e Infraestrutura Básica

### [ ] SUB-01: Setup do Projeto Frontend (Vite + React + TypeScript + Tailwind CSS)
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Inicializar a estrutura base do frontend moderno em `c:\fontes\dashboard-ai` utilizando Vite, React, TypeScript, Tailwind CSS e ícones Lucide.
- **Critérios de Aceitação:** `package.json` configurado com scripts `dev` e `build`, Tailwind funcionando, dependências instaladas.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-02: Estrutura Modular de Diretórios do Frontend
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Criar a árvore de pastas organizada: `src/components`, `src/services`, `src/hooks`, `src/types`, `src/views`, `src/styles`.
- **Critérios de Aceitação:** Diretórios criados com arquivos de exportação e organização padrão.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-03: Configuração do Cliente Supabase e Tipagem TypeScript
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Criar cliente Supabase reutilizável em `src/services/supabase.ts` e interfaces em `src/types/database.ts` para `Task`, `AiMemory`, `AgendamentoLog`.
- **Critérios de Aceitação:** Tipos e cliente exportados com suporte a variáveis de ambiente e fallback para as chaves do projeto.
- **Commit:** pendente
- **Anotação:** pendente

---

## 🗄️ FASE 2: Arquitetura de Banco de Dados e Scripts SQL

### [ ] SUB-04: Consolidação dos Schemas SQL na Pasta `database/`
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Organizar na raiz os scripts SQL consolidados: `database/01_tasks_schema.sql` (tabela tasks, restrições e triggers), `database/02_logs_schema.sql` (tabela de logs) e `database/03_memories_schema.sql` (tabela ai_memories com pgvector).
- **Critérios de Aceitação:** Arquivos SQL idempotentes com comandos `create table if not exists` e comentários explicativos.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-05: Consolidação das Funções RPC e Triggers no Banco
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Criar `database/04_rpc_functions.sql` contendo `pegar_proxima_task`, `finalizar_task`, `match_memories` e `eh_professor_administrador`.
- **Critérios de Aceitação:** Funções prontas para aplicação direta no Supabase com suporte a lock de 90min e similaridade de cosseno.
- **Commit:** pendente
- **Anotação:** pendente

---

## 🧠 FASE 3: Módulo Backend / API Serverless de Memória (Jev-Mem MCP)

### [ ] SUB-06: Estrutura do Endpoint Serverless Vercel MCP
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Configurar `api/mcp.ts`, `api/tsconfig.json` e rotas serverless Vercel para responder no protocolo JSON-RPC.
- **Critérios de Aceitação:** Arquivo `api/mcp.ts` com validação de método POST e roteador para primitivas cognitivas.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-07: Implementação das Primitivas de Memória e Embeddings
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Implementar no `api/mcp.ts` as ferramentas `brain_store`, `brain_search`, `brain_delete` e `tools/list` com geração de vetores de embedding.
- **Critérios de Aceitação:** Endpoints respondendo a chamadas MCP com armazenamento e busca por similaridade.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-08: Configuração de Variáveis de Ambiente e `.env.example`
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Documentar e padronizar as variáveis `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY` em `.env.example`.
- **Critérios de Aceitação:** Arquivo `.env.example` completo com instruções de preenchimento.
- **Commit:** pendente
- **Anotação:** pendente

---

## ⚡ FASE 4: Serviços do Frontend (Data Layer)

### [ ] SUB-09: Serviço de Tarefas (`src/services/taskService.ts`)
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Implementar operações de `listarTasks`, `criarTask`, `atualizarTask`, `alternarExecucao` (ON/OFF), `cancelarTask`, `reabrirTask` e `excluirTaskLogico`.
- **Critérios de Aceitação:** Funções assíncronas com tratamento de erro e ordenação por prioridade, ordem e criação.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-10: Serviço de Memória Semântica (`src/services/memoryService.ts`)
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Implementar `buscarMemoriasSimilares`, `listarMemorias`, `salvarMemoria` e `excluirMemoria`.
- **Critérios de Aceitação:** Integração com RPC `match_memories` e tabela `ai_memories`.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-11: Serviço de Logs do Agendador (`src/services/logService.ts`)
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Implementar consulta e filtros de histórico da tabela `agendamento_tarefa_logs`.
- **Critérios de Aceitação:** Listagem de histórico ordenado por `data_hora desc` com contadores de status.
- **Commit:** pendente
- **Anotação:** pendente

---

## 🎨 FASE 5: Interface do Usuário - Componentes Base e Layout

### [ ] SUB-12: Layout Principal Responsivo (Sidebar + Header + Navegação)
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Construir o shell do Dashboard com barra lateral de navegação (Fila de Tarefas, Cérebro de Memória, Logs do Agendador, Configurações), Header com status da conexão Supabase e toggle de tema.
- **Critérios de Aceitação:** Navegação fluida entre abas/visões sem recarregar página, responsivo para desktop e mobile.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-13: Painel de Indicadores Gerais (KPI Cards)
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Construir cards de estatísticas no topo da tela: Total de Tasks, Tasks Pendentes, Em Execução, Concluídas, Total de Memórias e Última Execução da IA.
- **Critérios de Aceitação:** Cards com ícones, números calculados dinamicamente e animação visual.
- **Commit:** pendente
- **Anotação:** pendente

---

## 📋 FASE 6: Interface do Usuário - Painel da Fila de Tasks (`tasks`)

### [ ] SUB-14: Tabela Avançada da Fila de Tasks
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Renderizar tabela com colunas: Código, Título, Prioridade (Badges coloridos 1-5), Ordem, Dependências, ON/OFF, Status, Tentativas, Resultado e Ações.
- **Critérios de Aceitação:** Tabela legível, com suporte a tooltips e indicadores de progresso.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-15: Barra de Ferramentas e Filtros em Tempo Real
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Adicionar barra de filtros com busca textual (por código, título e instrução), filtro dropdown por status e botão de recarregamento manual.
- **Critérios de Aceitação:** Filtros aplicados instantaneamente na tabela sem latência perceptível.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-16: Modal de Cadastro e Edição de Task
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Criar modal com campos: Título, Instrução (editor Markdown/textarea responsivo), Prioridade (1 a 5), Ordem, Executar Após (datetime), e Máximo de Tentativas.
- **Critérios de Aceitação:** Validação de campos obrigatórios, salvamento no Supabase e feedback visual de sucesso/erro.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-17: Modal de Visualização Detalhada da Task
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Modal de visualização completa contendo instrução formatada, relatório de resultado gravado pela IA, link do PR no GitHub e SHA do commit.
- **Critérios de Aceitação:** Renderização rica dos metadados e botão para copiar dados com um clique.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-18: Controles de Ação Rápida na Linha da Tabela
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Ações rápidas: Switch ON/OFF com persistência imediata, botão "Reabrir" (para recusadas/erros), botão "Cancelar" e botão "Excluir" com confirmação.
- **Critérios de Aceitação:** Ações executadas com atualização otimista ou recarregamento automático da tabela.
- **Commit:** pendente
- **Anotação:** pendente

---

## 🧠 FASE 7: Interface do Usuário - Painel de Memória Persistente (Jev-Mem)

### [ ] SUB-19: Interface de Pesquisa Semântica Vetorial
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Criar componente de busca semântica onde o usuário insere uma consulta e o sistema busca memórias similares via RPC `match_memories`, exibindo a porcentagem de similaridade.
- **Critérios de Aceitação:** Campo de busca com debounce, exibição de cards de resultado com badge de similaridade (ex: 89%).
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-20: Formulário de Nova Memória Canônica
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Componente para adicionar nova memória: Título único, Conteúdo estruturado em Markdown e Tags de categorização.
- **Critérios de Aceitação:** Criação persistida no banco Supabase com geração de tags dinâmicas.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-21: Grid de Gerenciamento e Exclusão de Memórias
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Exibição em cartões de todas as memórias cadastradas, com botão para copiar conteúdo Markdown, visualizar detalhes e excluir memória.
- **Critérios de Aceitação:** Grid responsivo com paginação/scroll e feedback de exclusão.
- **Commit:** pendente
- **Anotação:** pendente

---

## ⏱️ FASE 8: Interface do Usuário - Monitor do Agendador e Telemetria

### [ ] SUB-22: Visualizador de Logs de Execução da IA
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Aba com linha do tempo de execuções lidas de `agendamento_tarefa_logs`, mostrando data/hora, status (`concluida`, `recusada`, `erro`, `sem_tarefa`), nome da rotina e detalhes.
- **Critérios de Aceitação:** Lista visual cronológica com badges de status e tempo de execução.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-23: Diagnóstico de Travas e Saúde da Fila
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Painel indicando se há lock ativo (task com `trava_frente` e `trava_em` dentro dos 90 minutos) e botão de liberação manual de trava caso expire.
- **Critérios de Aceitação:** Alerta visual se uma task estiver presa além do tempo limite.
- **Commit:** pendente
- **Anotação:** pendente

---

## 🔄 FASE 9: Sincronização e Utilitários

### [ ] SUB-24: Script de Sincronização de Tasks (`scripts/sincronizar_tasks.py`)
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Adaptar e consolidar o script Python para sincronizar tasks entre o banco Supabase e arquivos markdown locais em `tasks/fila/`.
- **Critérios de Aceitação:** Script executável via terminal com comandos `consulta`, `importar`, `exportar` e `conferir`.
- **Commit:** pendente
- **Anotação:** pendente

---

## 🚀 FASE 10: Build, Validação e Documentação

### [ ] SUB-25: Validação de Build e Execução Local
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Rodar compilação de produção (`npm run build`), validar ausência de erros de tipagem TypeScript e verificar integridade de pacotes.
- **Critérios de Aceitação:** Build gerado com sucesso na pasta `dist/` sem alertas impeditivos.
- **Commit:** pendente
- **Anotação:** pendente

### [ ] SUB-26: Documentação Completa e Manual Operacional no `README.md`
- **Status:** pendente
- **Executor:** nenhum
- **Descrição:** Documentar no `README.md` a arquitetura da solução, guia de execução local, deploy na Vercel e instruções para agentes de IA operarem a fila e a memória.
- **Critérios de Aceitação:** Documentação clara, completa e em conformidade com as regras do projeto.
- **Commit:** pendente
- **Anotação:** pendente
