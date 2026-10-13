## Etapa 010-43fbb21f — SUB-48: Definir estrutura `projects/` para projetos de IA independentes

**Tarefa:** SUB-48 · **Migrada em:** 2026-10-13 (ETAPA-001) · **Executor:** por subtarefa (coluna "Em uso por" do `tasks/STATUS.md`)
**Próximo passo:** escolher uma subtarefa livre no `tasks/STATUS.md` (cada subtarefa tem o próprio próximo passo abaixo).

> Bloco migrado do `task-principal.md` sem alterar o texto. **Status, prioridade, dependências e reserva** de cada subtarefa ficam só no [`tasks/STATUS.md`](../STATUS.md); aqui ficam descrição, critérios, entrega e anotações. Quem reserva uma subtarefa edita só a seção dela.

### Tarefa-mãe

- **Descrição:** A pasta `projects/` (já criada na raiz) é onde serão colocados todos os projetos de IA independentes. Cada subpasta dentro de `projects/` (ex: `projects/meu-app-ia/`, `projects/analise-dados-ai/`) é um projeto de IA com seu próprio código, mas **compartilha a infraestrutura central do Dashboard AI** (banco, MCP, embeddings). **Opção A (Compartilhamento):**
  - **Banco de dados central compartilhado:** Todos os projetos usam o mesmo banco Supabase do Dashboard AI (8GB no plano Pro = muito mais econômico que múltiplas contas Free). Cada projeto tem seu registro na tabela `projects` e seus dados são isolados por `project_id` + RLS.
  - **MCP central compartilhado:** Todos os projetos usam o mesmo endpoint `/api/mcp` do Dashboard AI. As ferramentas MCP (`task_next`, `brain_store`, etc.) aceitam parâmetro `project` (slug) para operar nos dados do projeto específico.
  - **Embeddings central compartilhados:** Todos os projetos usam a mesma tabela `ai_memories` com `project_id`. O endpoint `/api/embedding` gera embeddings que ficam centralizados, com filtragem por projeto.
  - Cada projeto filho tem seu **próprio código** (src/, componentes, etc.) na pasta `projects/<nome>/`
  - Cada projeto filho pode ter suas **próprias regras em `AGENTS.md`** (específicas daquele projeto)
  - O Dashboard AI serve como **agregador central**: visualizador de quadros, banco compartilhado, MCP compartilhado, embeddings compartilhados, e compartilha a **lógica de classificação de tarefas por nível** (LEVE/MEDIO/PESADO) e **distribuição por modelo** (SUB-47)
  - Cada projeto filho pode ter seu **próprio quadro de tarefas** (task-principal.md na pasta do projeto) ou usar o quadro central (a definir em cada caso)
  - Isolamento é garantido por **RLS** e **project_id** - projeto A não vê dados do projeto B
- **Critérios de Aceitação:** Pasta `projects/` criada com esta documentação; estrutura clara definindo que cada projeto filho compartilha infraestrutura central (banco, MCP, embeddings) do Dashboard AI, com isolamento garantido por `project_id` + RLS. Dashboard AI é agregador central com banco compartilhado (mais econômico que múltiplas contas Free).
- **Commit:** pendente
- **Anotação:** Criada em 2026-10-13 a pedido do usuário para definir a estrutura multi-projeto. **Opção A definida (2026-10-13):** cada projeto filho compartilha infraestrutura central do Dashboard AI (banco, MCP, embeddings) com isolamento por `project_id` + RLS. Mais econômico que múltiplas contas Supabase Free (500MB cada). Dashboard AI é agregador central.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-48.1 — Definir estrutura `projects/` para projetos de IA independentes

**Próximo passo:** começar pelo escopo da tarefa-mãe.

Subtarefa criada na migração (regra: toda tarefa-mãe tem no mínimo 1 subtarefa). Executa todo o escopo da tarefa-mãe: descrição e critérios na seção **Tarefa-mãe** acima.
