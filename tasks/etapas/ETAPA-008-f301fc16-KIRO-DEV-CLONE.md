## Etapa 008-f301fc16 — KIRO-DEV-CLONE: Clone do Kiro.dev

**Tarefa:** KIRO-DEV-CLONE · **Migrada em:** 2026-10-13 (ETAPA-001) · **Executor:** por subtarefa (coluna "Em uso por" do `tasks/STATUS.md`)
**Próximo passo:** escolher uma subtarefa livre no `tasks/STATUS.md` (cada subtarefa tem o próprio próximo passo abaixo).

> Bloco migrado do `task-principal.md` sem alterar o texto. **Status, prioridade, dependências e reserva** de cada subtarefa ficam só no [`tasks/STATUS.md`](../STATUS.md); aqui ficam descrição, critérios, entrega e anotações. Quem reserva uma subtarefa edita só a seção dela.

### Tarefa-mãe

- **Descrição:** Clone do Kiro.dev (https://kiro.dev/docs/). As 30 subtarefas abaixo foram originalmente subdivididas com base na documentação do Kiro.dev e espelham as funcionalidades principais. Como projeto filho em `projects/kiro-dev-clone/`, compartilha infraestrutura central do Dashboard AI (banco, MCP, embeddings) com isolamento por `project_id` + RLS.
- **Critérios de Aceitação:** A ser definido pelo usuário na pasta `projects/kiro-dev-clone/`.
- **Commit:** pendente
- **Anotação:** ⛔ **TRAVADO PARA TODAS AS IAS** (2026-10-12 15:10): tarefa reservada para implementação manual pelo usuário; nenhuma IA pode assumir as filhas sem autorização explícita — ver a **🔒 TRAVA ESPECIAL** no início do quadro. **Subdivisão (2026-10-12 16:11, DeepSeek Harness (deepseek-flash), a pedido do usuário):** a mãe, antes atômica, passou a declarar as 30 filhas `KIRO-DEV-CLONE.1` a `.30`, espelhando as funcionalidades do Kiro.dev. A **🔒 trava especial permanece ativa**: as filhas ficam **reservadas** e só o usuário libera. **Movido para projects/ (2026-10-13):** pasta movida para `projects/kiro-dev-clone/` para seguir estrutura multi-projeto. **Opção A definida (2026-10-13):** projeto filho compartilha infraestrutura central do Dashboard AI (banco, MCP, embeddings) com isolamento por `project_id` + RLS.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): tarefa-mãe `pendente (aguardando subtarefas)` e 🔒 travada para todas as IAs; as 30 filhas continuam `pendente` e **nada** do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.1 — Link "KIRO DEV CLONE" no menu

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Adicionar item no menu principal com o nome exato "KIRO DEV CLONE", apontando para a rota `/kiro-dev-clone` e mantendo a consistência visual.
- **Critérios de Aceitação:** Item visível no menu com o nome exato; clique leva à rota; `npm run typecheck` e `npm test` verdes.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.2 — Rota `/kiro-dev-clone`

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Adicionar a rota `/kiro-dev-clone` no React Router (`src/App.tsx` ou arquivo de rotas), renderizando o componente base da v2 (Tarefa 1.2).
- **Critérios de Aceitação:** Acessar a rota e ver o componente renderizado, sem erro no console.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.3 — Componente base `KiroDevClone`

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar `src/views/KiroDevClone.tsx` com layout básico: cabeçalho, área de conteúdo e rodapé (Tarefa 1.3).
- **Critérios de Aceitação:** Componente renderiza sem erros; `npm run typecheck` verde.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.4 — Componente de Specs

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar `src/components/kiro/Specs.tsx` para planejamento de features, com os campos requirements, design e tasks (Tarefa 2.1).
- **Critérios de Aceitação:** Componente renderiza e o formulário funciona.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.5 — Botão "Criar Spec"

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Adicionar botão que abre modal/formulário para criar um novo spec no componente Specs (Tarefa 2.2).
- **Critérios de Aceitação:** Botão abre o formulário de criação.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.6 — Endpoint para salvar specs

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar RPC ou endpoint (em `database/` ou `api/`) que salve specs com title, requirements, design e tasks (Tarefa 2.3).
- **Critérios de Aceitação:** Endpoint salva a spec sem erros; teste cobrindo o caminho feliz.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.7 — Componente de Chat

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar `src/components/kiro/Chat.tsx` com lista de mensagens, campo de texto e botão enviar (Tarefa 3.1).
- **Critérios de Aceitação:** Chat renderiza e permite enviar mensagem.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.8 — Conectar chat com LLM

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Integrar o chat com a API do modelo LLM (`src/components/kiro/Chat.tsx` + `api/`) — Tarefa 3.2.
- **Critérios de Aceitação:** Chat envia a mensagem e exibe a resposta do modelo; a chave do provedor fica só no servidor.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.9 — Componente de Steering

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar `src/components/kiro/Steering.tsx` para exibir as regras/padrões do projeto (Tarefa 4.1).
- **Critérios de Aceitação:** Componente exibe a lista de regras.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.10 — Validação de steering

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Validar código contra as regras de steering em `src/lib/kiro/steering.ts` (Tarefa 4.2).
- **Critérios de Aceitação:** A validação identifica desvios das regras definidas; teste unitário cobrindo.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.11 — Sistema de hooks

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar em `src/lib/kiro/hooks.ts` o sistema que executa ações em eventos (file changes, tool use, task completion) — Tarefa 5.1.
- **Critérios de Aceitação:** Hooks registram os eventos; teste unitário cobrindo o registro.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera. Atenção: não confundir com os hooks de Git da seção 1.3 do `AGENTS.md` — são coisas diferentes.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.12 — Hook de file change

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Adicionar hook que detecta mudanças em arquivos e dispara a ação configurada (Tarefa 5.2).
- **Critérios de Aceitação:** Hook detecta a mudança de arquivo.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.13 — Integrar MCP existente

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Disponibilizar na v2 o MCP já implementado no projeto principal (`api/mcp.ts`) — Tarefa 6.1.
- **Critérios de Aceitação:** MCP responde na v2 (`tools/list` funciona).
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.14 — Ferramentas MCP específicas

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Registrar em `api/_lib/tools.ts` as ferramentas MCP específicas da v2 (Tarefa 6.2).
- **Critérios de Aceitação:** Ferramentas registradas respondem corretamente; testes atualizados.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.15 — Componente de Permissions

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar `src/components/kiro/Permissions.tsx` com a UI para configurar permissões do agente (Tarefa 7.1).
- **Critérios de Aceitação:** Componente renderiza e permite configurar as permissões.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.16 — Controle de acesso

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Implementar a validação de permissões em `src/lib/kiro/permissions.ts` (Tarefa 7.2).
- **Critérios de Aceitação:** O agente acessa apenas os recursos permitidos; teste unitário cobrindo a negação.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.17 — Sistema de custom agents

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar em `src/lib/kiro/agents.ts` o sistema de agentes especializados com instruções próprias (Tarefa 8.1).
- **Critérios de Aceitação:** O sistema permite definir agentes com instruções específicas.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.18 — UI para custom agents

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar `src/components/kiro/CustomAgents.tsx` com formulário para definir as instruções do agente (Tarefa 8.2).
- **Critérios de Aceitação:** A UI cria e edita custom agents.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.19 — Sistema de Skills

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar em `src/lib/kiro/skills.ts` o sistema de pacotes de instruções reutilizáveis (Tarefa 9.1).
- **Critérios de Aceitação:** O sistema permite definir skills reutilizáveis.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.20 — UI para Skills

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar `src/components/kiro/Skills.tsx` para listar e criar skills (Tarefa 9.2).
- **Critérios de Aceitação:** A UI lista e cria skills.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.21 — Usar memória existente

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Expor na v2 o sistema de memória já implementado (`src/lib/memoria/`) — Tarefa 10.1.
- **Critérios de Aceitação:** A memória funciona na v2.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.22 — Integrar memória com chat

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Permitir salvar e carregar memórias a partir do chat (`src/components/kiro/Chat.tsx`) — Tarefa 10.2.
- **Critérios de Aceitação:** O chat salva e carrega memórias.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.23 — Sistema de checkpoints

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar em `src/lib/kiro/checkpoints.ts` o sistema de salvar/restaurar estado (Tarefa 11.1).
- **Critérios de Aceitação:** Checkpoint é salvo e restaurado corretamente.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.24 — UI para checkpoints

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar `src/components/kiro/Checkpoints.tsx` para listar, criar e restaurar checkpoints (Tarefa 11.2).
- **Critérios de Aceitação:** A UI executa as três operações.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.25 — Arquivo `.kiroignore`

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar o `.kiroignore` na raiz com padrões de ignore, no estilo do `.gitignore` (Tarefa 12.1).
- **Critérios de Aceitação:** Arquivo criado com os padrões definidos.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.26 — Leitura do `.kiroignore`

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Ler o `.kiroignore` e filtrar arquivos em `src/lib/kiro/ignore.ts` (Tarefa 12.2).
- **Critérios de Aceitação:** A filtragem ignora os arquivos listados; teste unitário cobrindo.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.27 — Sistema de workflows

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar em `src/lib/kiro/workflows.ts` o sistema de workflows automatizados com passos (Tarefa 13.1).
- **Critérios de Aceitação:** O sistema permite definir workflows com passos.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.28 — UI para workflows

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar `src/components/kiro/Workflows.tsx` para listar e executar workflows (Tarefa 13.2).
- **Critérios de Aceitação:** A UI lista e executa workflows.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.29 — `projects/kiro-dev-clone/STATUS.md`

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar `projects/kiro-dev-clone/STATUS.md` com o modelo de status da implementação (Tarefa 14.1).
- **Critérios de Aceitação:** Arquivo criado com o modelo de status.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.

### KIRO-DEV-CLONE.30 — Pasta `projects/kiro-dev-clone/docs/`

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar a pasta de documentação específica `projects/kiro-dev-clone/docs/` (Tarefa 14.2).
- **Critérios de Aceitação:** Pasta existe no repositório.
- **Commit:** pendente
- **Anotação:** Filha criada na subdivisão de 2026-10-12 16:11 (DeepSeek Harness (deepseek-flash), a pedido do usuário); 🔒 sob a TRAVA ESPECIAL — só o usuário libera.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⬜ NÃO IMPLEMENTADA — 2026-10-12 16:30 (DeepSeek Harness (deepseek-flash)): bloco `pendente` e 🔒 reservado pela TRAVA ESPECIAL do KIRO-DEV-CLONE; nada do escopo existe no repositório (sem `src/components/kiro/`, `src/lib/kiro/` e `src/views/KiroDevClone.tsx`) — não há entrega a conferir.
