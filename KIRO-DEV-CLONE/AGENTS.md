# KIRO-DEV-CLONE — V2 do Dashboard AI

**Objetivo:** Criar uma versão 2 (clone) do projeto Dashboard AI inspirada no Kiro.dev, implementando suas principais funcionalidades.

## Contexto

Esta é uma v2 do projeto Dashboard AI atual, operando como um clone independente mas compartilhando a mesma base de código. Inspirado no Kiro.dev, que é um ambiente de desenvolvimento AI-powered que ajuda a construir software de protótipo a produção.

---

## 🔁 REGRA OBRIGATÓRIA — ESTE ARQUIVO SEGUE O `AGENTS.md` DA RAIZ

> ⛔ **Sempre que uma regra nova for adicionada (ou alterada) no [`AGENTS.md`](../AGENTS.md) da raiz, ESTE arquivo deve ser atualizado no mesmo ciclo** — no mesmo commit, ou no máximo na tarefa seguinte do agente que mexeu na raiz.

O [`AGENTS.md`](../AGENTS.md) da raiz é a **fonte única da verdade** do protocolo. Este arquivo apenas **espelha** o protocolo para a pasta do Kiro; **nunca** pode divergir dele. Em caso de divergência, **vale o da raiz**, e a divergência é tratada como defeito a corrigir.

**Como cumprir (obrigatório):**

1. Ao alterar o `AGENTS.md` da raiz, revisar este arquivo **no mesmo commit** e replicar a regra (checklist, fluxo de 3 partes, regras de concorrência e campos obrigatórios de tarefa).
2. Se a regra nova afetar as tarefas do Kiro, atualizar também a seção [Tarefas de Implementação](#tarefas-de-implementação--5-min-cada).
3. Mensagem de commit da sincronização: `docs(KIRO-DEV-CLONE): sincronizar AGENTS.md com a raiz (<sha da raiz>)`.
4. ⛔ **Não deixar para depois:** regra nova na raiz sem espelho aqui deixa o protocolo inválido para quem trabalha na pasta do Kiro.
5. Quem **detecta** a divergência (mesmo sem ter sido quem mudou a raiz) deve abrir uma tarefa no quadro raiz ou corrigir na hora, registrando na anotação.

**Checklist de sincronização (rodar sempre que a raiz mudar):**

☐ [ ] Novo item do checklist da raiz foi copiado para o checklist abaixo?
☐ [ ] Mudança no fluxo de 3 partes (`fetch`/`pull`/lock/entrega) foi replicada?
☐ [ ] Nova regra de concorrência (prioridade, travas, proibições) foi replicada?
☐ [ ] Campos obrigatórios de tarefa (`Prioridade`, `Depende de`, `Subtarefas`, `STATUS-TAREFA-CONFIRMADO-CONCLUIDO`) refletidos nas tarefas abaixo?
☐ [ ] Commit + push feitos, com o `<sha>` da raiz na mensagem?

---

## 🔒 PROTOCOLO DE CONCORRÊNCIA (IGUAL AO `AGENTS.md` DA RAIZ)

> **IMPORTANTE:** Este projeto usa o mesmo protocolo de trava do [`AGENTS.md`](../AGENTS.md) principal.
> O quadro único é o [`task-principal.md`](../task-principal.md) na raiz do projeto.

> ⛔ **KIRO-DEV-CLONE ESTÁ TRAVADO PARA TODAS AS IAS:** a tarefa-mãe `KIRO-DEV-CLONE` e **todas** as tarefas desta pasta estão **reservadas para implementação manual pelo usuário**. Nenhuma IA pode assumi-las (nem criar subtarefas delas) sem **autorização explícita do usuário**. Só o usuário remove a trava, editando o `task-principal.md` da raiz. Ver seção **"🔒 TRAVA ESPECIAL: KIRO-DEV-CLONE"** no quadro.

**CHECKLIST OBRIGATÓRIO ANTES DE ASSUMIR QUALQUER TAREFA:**
☐ [ ] Fiz `git fetch --all --prune` para atualizar a referência `origin/main`?
☐ [ ] Fiz `git pull --rebase origin main` **PRIMEIRO** (depois do fetch)?
☐ [ ] Li o arquivo ATUALIZADO (task-principal.md)?
☐ [ ] Verifiquei que a trava está LIVRE ou que minha task não conflita?
☐ [ ] Confirmei que todas as dependências estão `concluido`?
☐ [ ] Escolhi o item livre de **maior prioridade** (`MAXIMA` → `ALTA` → `MEDIA` → `BAIXA`)?
☐ [ ] Não tenho nenhum outro item travado (máximo 1 subtarefa ou 1 tarefa atômica por agente)?
☐ [ ] O item é uma subtarefa ou tarefa atômica (não uma tarefa-mãe com subtarefas)?
☐ [ ] Vou fazer commit + push do lock IMEDIATAMENTE antes de codificar?

⛔ **Se NÃO marcou todos os ☐ acima, NÃO assuma a tarefa.**

### Fluxo de Trava (3 Partes)

**PARTE 1 — LER O QUADRO:**
1. `git fetch --all --prune` (CRÍTICO — primeiro passo: sem o fetch a referência `origin/main` envelhece e o `git status` mente)
2. `git pull --rebase origin main`
3. Ler `task-principal.md` ATUALIZADO
4. Conferir se a trava está LIVRE (e se o item não é de outro agente)
5. Localizar sub-task com status `pendente`, **de maior prioridade**, e dependências `concluido`

**PARTE 2 — GRAVAR LOCK:**
1. Mudar status da sub-task para `em_execucao` em `task-principal.md`
2. `git add task-principal.md`
3. `git commit -m "lock: assumindo sub-task SUB-XX por [Nome do Agente]"`
4. `git push origin main`

**PARTE 3 — EXECUÇÃO E ENTREGA:**
1. Implementar e validar a tarefa
2. Mudar status para `concluido`, registrar commit SHA e a anotação técnica
3. Mover bloco concluído para `task_complete.md`
4. `git add <arquivos> task-principal.md task_complete.md`
5. `git commit -m "feat(SUB-XX): descrição"`
6. `git push origin main`

### Regras de Concorrência

- **Máximo 1 item travado por agente** (1 subtarefa ou 1 tarefa atômica)
- **Proibido travar tarefa-mãe com subtarefas**
- **Push do lock recusado?** → `git fetch --all --prune`, depois `git pull --rebase origin main` e **reler o quadro**; se outro agente pegou, liberar e escolher outro
- **Prioridade obrigatória:** entre os itens livres, pegar sempre o de maior prioridade (`MAXIMA` → `ALTA` → `MEDIA` → `BAIXA`); item de prioridade menor só com orientação explícita do usuário
- **Campos obrigatórios de toda tarefa:** `Status`, `Prioridade`, `Depende de`, `Subtarefas`, `Descrição`, `Critérios de Aceitação`, `Commit`, `Anotação`, `STATUS-TAREFA-CONFIRMADO-CONCLUIDO` e `VERIFICADOR-CLAUDE`
- **Travas só são liberadas pelo usuário** — nenhum agente libera ou altera trava de outro
- **⛔ KIRO-DEV-CLONE:** travado para todas as IAs (ver aviso acima)
- **⛔ Nunca** usar `git push --force`
- **⛔ Nunca** usar `git pull --all` nem `git pull` sem `--rebase` (cria *merge*, proibido); para trazer tudo, use `git fetch --all` + `git pull --rebase origin main`
- **Usar skill `proxima-task`** para o fluxo automatizado

---

## Visão Geral do Kiro.dev

Kiro oferece **5 superfícies** (surfaces) que compartilham a mesma configuração `.kiro/`:
- **IDE**: Editor desktop com chat, specs, hooks e integração full editor
- **CLI**: Agente terminal-native com headless mode, session management e CI integration
- **Web**: Agente browser-based para multi-repo tasks que planeja, implementa e abre PRs
- **Mobile**: Monitor tasks, review PRs e chat com o agente
- **Crew**: Agente AI pessoal com autonomous tasks, scheduling, memory e multi-channel access

---

## Tarefas de Implementação (≤ 5 min cada)

> **Campos obrigatórios** (seção 2.2 do [`AGENTS.md`](../AGENTS.md) da raiz): toda tarefa declara **`Prioridade`**, **`Depende de`** e **`Subtarefas`**, além de `Status`, `Commit`, `Anotação` e as linhas de confirmação.
>
> **Prioridade:** todas as tarefas abaixo herdam **`BAIXA`** da tarefa-mãe `KIRO-DEV-CLONE` (regra 1.2.4 da raiz) — o agente usa a da mãe e não altera prioridade sem pedido do usuário.
>
> **⛔ Trava:** nenhuma destas tarefas pode ser assumida por IA enquanto a **🔒 TRAVA ESPECIAL do KIRO-DEV-CLONE** estiver ativa no quadro raiz.
>
> ⚠️ **Pendência estrutural:** no `task-principal.md` a tarefa-mãe `KIRO-DEV-CLONE` está registrada como **`Subtarefas: Nenhuma (atômica)`**, mas aqui ela se desdobra nas 28 tarefas abaixo. Se estas tarefas forem para a fila, **o usuário precisa** subdividir a mãe no quadro (e liberar a trava) antes de qualquer agente pegá-las.
>
> **Dependências:** derivadas das descrições (ex.: `Tarefa 2.2` precisa do componente da `Tarefa 2.1`); ajuste pelo usuário se a ordem real for outra.

### FASE 1: Navegação e Estrutura

#### Tarefa 1.1: Adicionar link "KIRO DEV CLONE" no menu
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Tarefa 1.2
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 3 min
- **Descrição:** Adicionar item no menu principal com nome "KIRO DEV CLONE"
- **Localização:** `src/components/` ou `src/views/index.ts`
- **Requisitos:** Nome exato "KIRO DEV CLONE", redirecionar para rota `/kiro-dev-clone`, manter consistência visual
- **Verificação:** Clicar no link e verificar redirecionamento

#### Tarefa 1.2: Criar rota `/kiro-dev-clone`
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Tarefa 1.3
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 3 min
- **Descrição:** Adicionar rota no React Router para `/kiro-dev-clone`
- **Localização:** `src/App.tsx` ou arquivo de rotas
- **Requisitos:** Rota deve renderizar componente base da v2
- **Verificação:** Acessar `/kiro-dev-clone` e ver componente renderizado

#### Tarefa 1.3: Criar componente base `KiroDevClone`
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 4 min
- **Descrição:** Criar `src/views/KiroDevClone.tsx` com layout básico
- **Localização:** `src/views/KiroDevClone.tsx`
- **Requisitos:** Componente com cabeçalho, área de conteúdo e rodapé
- **Verificação:** Componente renderiza sem erros

### FASE 2: Specs (Planejamento)

#### Tarefa 2.1: Criar componente de Specs
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 5 min
- **Descrição:** Criar `src/components/kiro/Specs.tsx` para planejamento de features
- **Localização:** `src/components/kiro/Specs.tsx`
- **Requisitos:** Form com campos: requirements, design, tasks
- **Verificação:** Componente renderiza e form funciona

#### Tarefa 2.2: Adicionar botão "Criar Spec"
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Tarefa 2.1
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 2 min
- **Descrição:** Adicionar botão para criar novo spec no componente Specs
- **Localização:** `src/components/kiro/Specs.tsx`
- **Requisitos:** Botão abre modal/form para criar spec
- **Verificação:** Botão abre form

#### Tarefa 2.3: Criar endpoint para salvar specs
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Tarefa 2.1
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 5 min
- **Descrição:** Criar RPC ou endpoint para salvar specs no banco
- **Localização:** `database/` ou `api/`
- **Requisitos:** Salvar specs com: title, requirements, design, tasks
- **Verificação:** Endpoint salva spec sem erros

### FASE 3: Chat

#### Tarefa 3.1: Criar componente de Chat
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 5 min
- **Descrição:** Criar `src/components/kiro/Chat.tsx` com interface de chat
- **Localização:** `src/components/kiro/Chat.tsx`
- **Requisitos:** Lista de mensagens, input de texto, botão enviar
- **Verificação:** Chat renderiza e permite enviar mensagem

#### Tarefa 3.2: Conectar chat com LLM
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Tarefa 3.1
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 4 min
- **Descrição:** Integrar chat com API do modelo LLM
- **Localização:** `src/components/kiro/Chat.tsx` + `api/`
- **Requisitos:** Enviar mensagem para LLM e exibir resposta
- **Verificação:** Chat responde com LLM

### FASE 4: Steering (Padrões)

#### Tarefa 4.1: Criar componente de Steering
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 4 min
- **Descrição:** Criar `src/components/kiro/Steering.tsx` para enforce padrões
- **Localização:** `src/components/kiro/Steering.tsx`
- **Requisitos:** Lista de regras/padrões do projeto
- **Verificação:** Componente exibe regras

#### Tarefa 4.2: Adicionar validação de steering
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Tarefa 4.1
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 5 min
- **Descrição:** Validar código contra regras de steering
- **Localização:** `src/lib/kiro/steering.ts`
- **Requisitos:** Verificar se código segue padrões definidos
- **Verificação:** Validação funciona

### FASE 5: Hooks

#### Tarefa 5.1: Criar sistema de hooks
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 5 min
- **Descrição:** Criar sistema para executar ações em eventos
- **Localização:** `src/lib/kiro/hooks.ts`
- **Requisitos:** Hooks para: file changes, tool use, task completion
- **Verificação:** Hooks registram eventos

#### Tarefa 5.2: Adicionar hook de file change
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Tarefa 5.1
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 3 min
- **Descrição:** Hook que detecta mudanças em arquivos
- **Localização:** `src/lib/kiro/hooks.ts`
- **Requisitos:** Executar ação quando arquivo muda
- **Verificação:** Hook detecta mudança

### FASE 6: MCP (Model Context Protocol)

#### Tarefa 6.1: Integrar MCP existente
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 3 min
- **Descrição:** Usar MCP já implementado no projeto principal
- **Localização:** `api/mcp.ts`
- **Requisitos:** MCP disponível na v2
- **Verificação:** MCP funciona na v2

#### Tarefa 6.2: Adicionar ferramentas MCP específicas
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Tarefa 6.1
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 5 min
- **Descrição:** Registrar ferramentas MCP específicas da v2
- **Localização:** `api/_lib/tools.ts`
- **Requisitos:** Ferramentas específicas para Kiro v2
- **Verificação:** Ferramentas funcionam

### FASE 7: Permissions

#### Tarefa 7.1: Criar componente de Permissions
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 4 min
- **Descrição:** Criar `src/components/kiro/Permissions.tsx`
- **Localização:** `src/components/kiro/Permissions.tsx`
- **Requisitos:** UI para configurar permissões do agente
- **Verificação:** Componente renderiza

#### Tarefa 7.2: Implementar controle de acesso
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Tarefa 7.1
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 5 min
- **Descrição:** Implementar validação de permissões
- **Localização:** `src/lib/kiro/permissions.ts`
- **Requisitos:** Agente só acessa recursos permitidos
- **Verificação:** Permissões funcionam

### FASE 8: Custom Agents

#### Tarefa 8.1: Criar sistema de custom agents
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 5 min
- **Descrição:** Criar sistema para agentes especializados
- **Localização:** `src/lib/kiro/agents.ts`
- **Requisitos:** Definir agentes com instruções específicas
- **Verificação:** Sistema funciona

#### Tarefa 8.2: Criar UI para custom agents
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Tarefa 8.1
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 4 min
- **Descrição:** UI para criar/editar custom agents
- **Localização:** `src/components/kiro/CustomAgents.tsx`
- **Requisitos:** Form para definir instruções do agente
- **Verificação:** UI funciona

### FASE 9: Skills

#### Tarefa 9.1: Criar sistema de Skills
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 4 min
- **Descrição:** Criar sistema para pacotes de instruções reutilizáveis
- **Localização:** `src/lib/kiro/skills.ts`
- **Requisitos:** Definir skills que podem ser reutilizados
- **Verificação:** Sistema funciona

#### Tarefa 9.2: Criar UI para Skills
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Tarefa 9.1
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 3 min
- **Descrição:** UI para gerenciar skills
- **Localização:** `src/components/kiro/Skills.tsx`
- **Requisitos:** Listar e criar skills
- **Verificação:** UI funciona

### FASE 10: Memory

#### Tarefa 10.1: Usar memória existente
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 2 min
- **Descrição:** Usar sistema de memória já implementado
- **Localização:** `src/lib/memoria/`
- **Requisitos:** Memória disponível na v2
- **Verificação:** Memória funciona

#### Tarefa 10.2: Integrar memória com chat
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Tarefa 10.1, Tarefa 3.1
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 3 min
- **Descrição:** Chat pode salvar/carregar memórias
- **Localização:** `src/components/kiro/Chat.tsx`
- **Requisitos:** Botões para salvar/carregar memórias
- **Verificação:** Chat integra memória

### FASE 11: Checkpoints

#### Tarefa 11.1: Criar sistema de checkpoints
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 5 min
- **Descrição:** Sistema para salvar/restaurar estado
- **Localização:** `src/lib/kiro/checkpoints.ts`
- **Requisitos:** Salvar checkpoint e restaurar
- **Verificação:** Sistema funciona

#### Tarefa 11.2: Criar UI para checkpoints
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Tarefa 11.1
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 3 min
- **Descrição:** UI para gerenciar checkpoints
- **Localização:** `src/components/kiro/Checkpoints.tsx`
- **Requisitos:** Listar, criar, restaurar checkpoints
- **Verificação:** UI funciona

### FASE 12: Kiroignore

#### Tarefa 12.1: Criar arquivo `.kiroignore`
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 2 min
- **Descrição:** Criar arquivo para ignorar arquivos sensíveis
- **Localização:** `.kiroignore` na raiz
- **Requisitos:** Padrões de ignore (como .gitignore)
- **Verificação:** Arquivo criado

#### Tarefa 12.2: Implementar leitura do `.kiroignore`
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Tarefa 12.1
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 3 min
- **Descrição:** Ler `.kiroignore` e filtrar arquivos
- **Localização:** `src/lib/kiro/ignore.ts`
- **Requisitos:** Filtrar arquivos sensíveis
- **Verificação:** Filtragem funciona

### FASE 13: Workflows

#### Tarefa 13.1: Criar sistema de workflows
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 5 min
- **Descrição:** Sistema para workflows automatizados
- **Localização:** `src/lib/kiro/workflows.ts`
- **Requisitos:** Definir workflows com passos
- **Verificação:** Sistema funciona

#### Tarefa 13.2: Criar UI para workflows
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Tarefa 13.1
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 4 min
- **Descrição:** UI para criar/executar workflows
- **Localização:** `src/components/kiro/Workflows.tsx`
- **Requisitos:** Listar e executar workflows
- **Verificação:** UI funciona

### FASE 14: Documentação

#### Tarefa 14.1: Criar `STATUS.md`
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 2 min
- **Descrição:** Criar arquivo de status da implementação
- **Localização:** `KIRO-DEV-CLONE/STATUS.md`
- **Requisitos:** Modelo de status com tarefas
- **Verificação:** Arquivo criado

#### Tarefa 14.2: Criar pasta `docs/`
- **Status:** pendente
- **Prioridade:** BAIXA
- **Depende de:** Nenhuma
- **Subtarefas:** Nenhuma (atômica)
- **Tempo estimado:** 1 min
- **Descrição:** Criar pasta para documentação específica
- **Localização:** `KIRO-DEV-CLONE/docs/`
- **Requisitos:** Pasta criada
- **Verificação:** Pasta existe

---

## Regras do Projeto Principal

Seguir as mesmas regras do [`AGENTS.md`](../AGENTS.md) principal:

- Protocolo de trava no [`task-principal.md`](../task-principal.md) (ver seção acima)
- Sincronizar **este arquivo** sempre que o `AGENTS.md` da raiz mudar (ver primeira seção)
- Commits com formato padrão: `feat(SUB-XX): descrição` / `docs(SUB-XX): descrição` / `lock: assumindo sub-task SUB-XX por <agente>`
- Antes de qualquer `git pull --rebase origin main`, rodar `git fetch --all --prune`
- Validação com `npm run typecheck`, `npm test` e `npm run build`
- Não usar `git push --force` nem `git pull --all`
- Usar skill `proxima-task` para fluxo automatizado de tarefas

## Próximos Passos

1. ⛔ **Antes de qualquer implementação:** o usuário precisa **liberar a 🔒 trava especial** e **subdividir a tarefa-mãe** no `task-principal.md` (hoje a mãe está registrada como atômica, mas aqui ela tem 28 tarefas)
2. Executar tarefas em ordem das fases, respeitando `Depende de:`
3. Cada tarefa deve levar ≤ 5 minutos
4. Atualizar `STATUS.md` após cada tarefa
5. Commit e push após cada fase concluída
6. **Sempre seguir o protocolo de trava antes de implementar**
7. **Sempre que o `AGENTS.md` da raiz mudar, sincronizar este arquivo no mesmo ciclo**
