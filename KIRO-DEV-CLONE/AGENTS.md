# KIRO-DEV-CLONE — V2 do Dashboard AI

**Objetivo:** Criar uma versão 2 (clone) do projeto Dashboard AI inspirada no Kiro.dev, implementando suas principais funcionalidades.

## Contexto

Esta é uma v2 do projeto Dashboard AI atual, operando como um clone independente mas compartilhando a mesma base de código. Inspirado no Kiro.dev, que é um ambiente de desenvolvimento AI-powered que ajuda a construir software de protótipo a produção.

## Visão Geral do Kiro.dev

Kiro oferece **5 superfícies** (surfaces) que compartilham a mesma configuração `.kiro/`:
- **IDE**: Editor desktop com chat, specs, hooks e integração full editor
- **CLI**: Agente terminal-native com headless mode, session management e CI integration
- **Web**: Agente browser-based para multi-repo tasks que planeja, implementa e abre PRs
- **Mobile**: Monitor tasks, review PRs e chat com o agente
- **Crew**: Agente AI pessoal com autonomous tasks, scheduling, memory e multi-channel access

## Tarefas de Implementação (≤ 5 min cada)

### FASE 1: Navegação e Estrutura

#### Tarefa 1.1: Adicionar link "KIRO DEV CLONE" no menu
- **Tempo estimado:** 3 min
- **Descrição:** Adicionar item no menu principal com nome "KIRO DEV CLONE"
- **Localização:** `src/components/` ou `src/views/index.ts`
- **Requisitos:** Nome exato "KIRO DEV CLONE", redirecionar para rota `/kiro-dev-clone`, manter consistência visual
- **Verificação:** Clicar no link e verificar redirecionamento

#### Tarefa 1.2: Criar rota `/kiro-dev-clone`
- **Tempo estimado:** 3 min
- **Descrição:** Adicionar rota no React Router para `/kiro-dev-clone`
- **Localização:** `src/App.tsx` ou arquivo de rotas
- **Requisitos:** Rota deve renderizar componente base da v2
- **Verificação:** Acessar `/kiro-dev-clone` e ver componente renderizado

#### Tarefa 1.3: Criar componente base `KiroDevClone`
- **Tempo estimado:** 4 min
- **Descrição:** Criar `src/views/KiroDevClone.tsx` com layout básico
- **Localização:** `src/views/KiroDevClone.tsx`
- **Requisitos:** Componente com cabeçalho, área de conteúdo e rodapé
- **Verificação:** Componente renderiza sem erros

### FASE 2: Specs (Planejamento)

#### Tarefa 2.1: Criar componente de Specs
- **Tempo estimado:** 5 min
- **Descrição:** Criar `src/components/kiro/Specs.tsx` para planejamento de features
- **Localização:** `src/components/kiro/Specs.tsx`
- **Requisitos:** Form com campos: requirements, design, tasks
- **Verificação:** Componente renderiza e form funciona

#### Tarefa 2.2: Adicionar botão "Criar Spec"
- **Tempo estimado:** 2 min
- **Descrição:** Adicionar botão para criar novo spec no componente Specs
- **Localização:** `src/components/kiro/Specs.tsx`
- **Requisitos:** Botão abre modal/form para criar spec
- **Verificação:** Botão abre form

#### Tarefa 2.3: Criar endpoint para salvar specs
- **Tempo estimado:** 5 min
- **Descrição:** Criar RPC ou endpoint para salvar specs no banco
- **Localização:** `database/` ou `api/`
- **Requisitos:** Salvar specs com: title, requirements, design, tasks
- **Verificação:** Endpoint salva spec sem erros

### FASE 3: Chat

#### Tarefa 3.1: Criar componente de Chat
- **Tempo estimado:** 5 min
- **Descrição:** Criar `src/components/kiro/Chat.tsx` com interface de chat
- **Localização:** `src/components/kiro/Chat.tsx`
- **Requisitos:** Lista de mensagens, input de texto, botão enviar
- **Verificação:** Chat renderiza e permite enviar mensagem

#### Tarefa 3.2: Conectar chat com LLM
- **Tempo estimado:** 4 min
- **Descrição:** Integrar chat com API do modelo LLM
- **Localização:** `src/components/kiro/Chat.tsx` + `api/`
- **Requisitos:** Enviar mensagem para LLM e exibir resposta
- **Verificação:** Chat responde com LLM

### FASE 4: Steering (Padrões)

#### Tarefa 4.1: Criar componente de Steering
- **Tempo estimado:** 4 min
- **Descrição:** Criar `src/components/kiro/Steering.tsx` para enforce padrões
- **Localização:** `src/components/kiro/Steering.tsx`
- **Requisitos:** Lista de regras/padrões do projeto
- **Verificação:** Componente exibe regras

#### Tarefa 4.2: Adicionar validação de steering
- **Tempo estimado:** 5 min
- **Descrição:** Validar código contra regras de steering
- **Localização:** `src/lib/kiro/steering.ts`
- **Requisitos:** Verificar se código segue padrões definidos
- **Verificação:** Validação funciona

### FASE 5: Hooks

#### Tarefa 5.1: Criar sistema de hooks
- **Tempo estimado:** 5 min
- **Descrição:** Criar sistema para executar ações em eventos
- **Localização:** `src/lib/kiro/hooks.ts`
- **Requisitos:** Hooks para: file changes, tool use, task completion
- **Verificação:** Hooks registram eventos

#### Tarefa 5.2: Adicionar hook de file change
- **Tempo estimado:** 3 min
- **Descrição:** Hook que detecta mudanças em arquivos
- **Localização:** `src/lib/kiro/hooks.ts`
- **Requisitos:** Executar ação quando arquivo muda
- **Verificação:** Hook detecta mudança

### FASE 6: MCP (Model Context Protocol)

#### Tarefa 6.1: Integrar MCP existente
- **Tempo estimado:** 3 min
- **Descrição:** Usar MCP já implementado no projeto principal
- **Localização:** `api/mcp.ts`
- **Requisitos:** MCP disponível na v2
- **Verificação:** MCP funciona na v2

#### Tarefa 6.2: Adicionar ferramentas MCP específicas
- **Tempo estimado:** 5 min
- **Descrição:** Registrar ferramentas MCP específicas da v2
- **Localização:** `api/_lib/tools.ts`
- **Requisitos:** Ferramentas específicas para Kiro v2
- **Verificação:** Ferramentas funcionam

### FASE 7: Permissions

#### Tarefa 7.1: Criar componente de Permissions
- **Tempo estimado:** 4 min
- **Descrição:** Criar `src/components/kiro/Permissions.tsx`
- **Localização:** `src/components/kiro/Permissions.tsx`
- **Requisitos:** UI para configurar permissões do agente
- **Verificação:** Componente renderiza

#### Tarefa 7.2: Implementar controle de acesso
- **Tempo estimado:** 5 min
- **Descrição:** Implementar validação de permissões
- **Localização:** `src/lib/kiro/permissions.ts`
- **Requisitos:** Agente só acessa recursos permitidos
- **Verificação:** Permissões funcionam

### FASE 8: Custom Agents

#### Tarefa 8.1: Criar sistema de custom agents
- **Tempo estimado:** 5 min
- **Descrição:** Criar sistema para agentes especializados
- **Localização:** `src/lib/kiro/agents.ts`
- **Requisitos:** Definir agentes com instruções específicas
- **Verificação:** Sistema funciona

#### Tarefa 8.2: Criar UI para custom agents
- **Tempo estimado:** 4 min
- **Descrição:** UI para criar/editar custom agents
- **Localização:** `src/components/kiro/CustomAgents.tsx`
- **Requisitos:** Form para definir instruções do agente
- **Verificação:** UI funciona

### FASE 9: Skills

#### Tarefa 9.1: Criar sistema de Skills
- **Tempo estimado:** 4 min
- **Descrição:** Criar sistema para pacotes de instruções reutilizáveis
- **Localização:** `src/lib/kiro/skills.ts`
- **Requisitos:** Definir skills que podem ser reutilizados
- **Verificação:** Sistema funciona

#### Tarefa 9.2: Criar UI para Skills
- **Tempo estimado:** 3 min
- **Descrição:** UI para gerenciar skills
- **Localização:** `src/components/kiro/Skills.tsx`
- **Requisitos:** Listar e criar skills
- **Verificação:** UI funciona

### FASE 10: Memory

#### Tarefa 10.1: Usar memória existente
- **Tempo estimado:** 2 min
- **Descrição:** Usar sistema de memória já implementado
- **Localização:** `src/lib/memoria/`
- **Requisitos:** Memória disponível na v2
- **Verificação:** Memória funciona

#### Tarefa 10.2: Integrar memória com chat
- **Tempo estimado:** 3 min
- **Descrição:** Chat pode salvar/carregar memórias
- **Localização:** `src/components/kiro/Chat.tsx`
- **Requisitos:** Botões para salvar/carregar memórias
- **Verificação:** Chat integra memória

### FASE 11: Checkpoints

#### Tarefa 11.1: Criar sistema de checkpoints
- **Tempo estimado:** 5 min
- **Descrição:** Sistema para salvar/restaurar estado
- **Localização:** `src/lib/kiro/checkpoints.ts`
- **Requisitos:** Salvar checkpoint e restaurar
- **Verificação:** Sistema funciona

#### Tarefa 11.2: Criar UI para checkpoints
- **Tempo estimado:** 3 min
- **Descrição:** UI para gerenciar checkpoints
- **Localização:** `src/components/kiro/Checkpoints.tsx`
- **Requisitos:** Listar, criar, restaurar checkpoints
- **Verificação:** UI funciona

### FASE 12: Kiroignore

#### Tarefa 12.1: Criar arquivo `.kiroignore`
- **Tempo estimado:** 2 min
- **Descrição:** Criar arquivo para ignorar arquivos sensíveis
- **Localização:** `.kiroignore` na raiz
- **Requisitos:** Padrões de ignore (como .gitignore)
- **Verificação:** Arquivo criado

#### Tarefa 12.2: Implementar leitura do `.kiroignore`
- **Tempo estimado:** 3 min
- **Descrição:** Ler `.kiroignore` e filtrar arquivos
- **Localização:** `src/lib/kiro/ignore.ts`
- **Requisitos:** Filtrar arquivos sensíveis
- **Verificação:** Filtragem funciona

### FASE 13: Workflows

#### Tarefa 13.1: Criar sistema de workflows
- **Tempo estimado:** 5 min
- **Descrição:** Sistema para workflows automatizados
- **Localização:** `src/lib/kiro/workflows.ts`
- **Requisitos:** Definir workflows com passos
- **Verificação:** Sistema funciona

#### Tarefa 13.2: Criar UI para workflows
- **Tempo estimado:** 4 min
- **Descrição:** UI para criar/executar workflows
- **Localização:** `src/components/kiro/Workflows.tsx`
- **Requisitos:** Listar e executar workflows
- **Verificação:** UI funciona

### FASE 14: Documentação

#### Tarefa 14.1: Criar `STATUS.md`
- **Tempo estimado:** 2 min
- **Descrição:** Criar arquivo de status da implementação
- **Localização:** `KIRO-DEV-CLONE/STATUS.md`
- **Requisitos:** Modelo de status com tarefas
- **Verificação:** Arquivo criado

#### Tarefa 14.2: Criar pasta `docs/`
- **Tempo estimado:** 1 min
- **Descrição:** Criar pasta para documentação específica
- **Localização:** `KIRO-DEV-CLONE/docs/`
- **Requisitos:** Pasta criada
- **Verificação:** Pasta existe

## Regras do Projeto Principal

Seguir as mesmas regras do `AGENTS.md` principal:
- Protocolo de trava no `task-principal.md`
- Commits com formato padrão
- Validação com `npm run typecheck`, `npm test`, `npm run build`
- Não usar `git push --force`

## Próximos Passos

1. Executar tarefas em ordem das fases
2. Cada tarefa deve levar ≤ 5 minutos
3. Atualizar `STATUS.md` após cada tarefa
4. Commit e push após cada fase concluída
