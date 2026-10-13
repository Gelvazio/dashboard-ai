## Etapa 005-6b941e1e — SUB-41: Tirar do `AGENTS.md` o plano "🧠 Cérebro de Memória Persistente" (o `AGENTS.md` fica só com regras)

**Tarefa:** SUB-41 · **Migrada em:** 2026-10-13 (ETAPA-001) · **Executor:** por subtarefa (coluna "Em uso por" do `tasks/STATUS.md`)
**Próximo passo:** escolher uma subtarefa livre no `tasks/STATUS.md` (cada subtarefa tem o próprio próximo passo abaixo).

> Bloco migrado do `task-principal.md` sem alterar o texto. **Status, prioridade, dependências e reserva** de cada subtarefa ficam só no [`tasks/STATUS.md`](../STATUS.md); aqui ficam descrição, critérios, entrega e anotações. Quem reserva uma subtarefa edita só a seção dela.

> ⚠️ **Nota da migração (2026-10-13, ETAPA-001):** o `AGENTS.md` foi reescrito como porta de entrada curta. O plano
> "Cérebro de Memória Persistente" continua **sem alterações**, agora no fim do arquivo, sob o título
> "📎 Anexo — plano a ser movido (tarefa SUB-41)". Onde as subtarefas abaixo dizem "o `AGENTS.md` termina na seção
> 5", leia: depois de mover o plano, apagar também o título e o aviso do anexo, e o `AGENTS.md` termina na tabela de
> leitura obrigatória.

### Tarefa-mãe

- **Descrição:** **Regra do usuário (2026-10-12):** o `AGENTS.md` deve conter **apenas regras de como executar tarefas**, e **nenhuma tarefa em si**. Hoje, depois da seção "✅ 5. Regra de confirmação de status", o arquivo traz o plano de implementação `# 🧠 Plano de Implementação: Cérebro de Memória Persistente (Estilo Jev-Mem)` (linhas ~345-525; números aproximados, conferir com `grep`), com as seções `## 1. Arquitetura do Banco de Dados (Supabase)` (SQL), `## 2. Estrutura do Servidor MCP (Vercel Serverless)` (nota da implementação real, estrutura de arquivos e exemplo ilustrativo de `api/mcp.ts`) e `## 3. Ativação no Terminal (Claude Code)`. Isso é tarefa/plano, não regra. O plano inteiro vai, **sem alterar o texto**, para `docs/plano-cerebro-memoria-persistente.md`, uma seção por subtarefa, ajustando os links relativos do trecho movido (`api/...` → `../api/...`, `database/...` → `../database/...`). No `AGENTS.md`, o bloco é apagado **sem deixar resumo de tarefa**.
- **Critérios de Aceitação:** Todas as filhas `concluido`; `docs/plano-cerebro-memoria-persistente.md` com o conteúdo completo das seções 1, 2 e 3; `AGENTS.md` sem o plano e só com regras de execução de tarefas; nenhum link relativo quebrado (inclusive links de outros arquivos que apontem para esse trecho do `AGENTS.md`); `npm run validar` verde.
- **Commit:** pendente
- **Anotação:** Criada a pedido do usuário em 2026-10-12 por Claude Code (Opus 5.5). Pedido original: "isso daqui *## 2. Estrutura do Servidor MCP (Vercel Serverless)* precisa estar numa tarefa separada"; ampliado na mesma conversa: "no agents.md, devem ficar apenas regras de como executar tarefas e nenhuma tarefa em si mesmo" — por isso a tarefa cobre o plano inteiro (seções 1, 2 e 3), não só a seção 2. O plano já está implementado (SUB-07 e seguintes; o SQL consolidado está em `database/`, scripts `01` a `04`); esta tarefa só reorganiza a documentação, sem nada a aplicar no banco. Os outros trechos do `AGENTS.md` que citam tarefas específicas foram separados na SUB-42. **Subdivisão (2026-10-12, a pedido do usuário):** a mãe, antes atômica, passou a ter as filhas SUB-41.1 a SUB-41.3 (uma por seção do plano).
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-41.1 — Criar `docs/plano-cerebro-memoria-persistente.md` e mover a seção "1. Arquitetura do Banco de Dados (Supabase)"

**Próximo passo:** nenhum (concluída).

- **Descrição:** Criar `docs/plano-cerebro-memoria-persistente.md` com: o título `# 🧠 Plano de Implementação: Cérebro de Memória Persistente (Estilo Jev-Mem)` e as linhas **Foco** e **Stack** (copiadas do `AGENTS.md`); um parágrafo inicial dizendo que o plano **já foi implementado** (SQL consolidado e idempotente em [`database/`](../../database/README.md), scripts `01` a `04`; servidor em [`api/mcp.ts`](../../api/mcp.ts) e [`api/_lib/`](../../api/_lib/)) e que o SQL e o código do plano são a referência original; e a seção `## 1. Arquitetura do Banco de Dados (Supabase)` inteira (texto, nota sobre a pasta `database/` e bloco SQL), **sem alterar o conteúdo**, só corrigindo o link `database/README.md` → `../database/README.md`. No `AGENTS.md`, apagar o título do plano, as linhas Foco/Stack e a seção 1 (com os `---` correspondentes). As seções 2 e 3 continuam no `AGENTS.md` até as filhas seguintes.
- **Critérios de Aceitação:** Arquivo novo com título, introdução e seção 1 completos; seção 1 e cabeçalho do plano fora do `AGENTS.md`; links relativos do novo arquivo funcionando; `npm run validar` verde.
- **Commit:** `feat(SUB-41.1)` (Claude Code (Opus 5.5) (local · main), 2026-10-13)
- **Anotação:** Trava de Devin (Cognition AI) (lock `74e061f`, 2026-10-12 18:40) liberada pelo usuário em 2026-10-13 14:18 (registro por Claude Code (Opus 5.5)). Nada tinha sido entregue: `docs/plano-cerebro-memoria-persistente.md` não existe e não há commit da entrega. Livre para qualquer IA. **Entrega (2026-10-13 15:10, Claude Code (Opus 5.5) (local · main)):** criado `docs/plano-cerebro-memoria-persistente.md` com título, Foco/Stack, aviso de "já implementado" e a seção 1 copiados sem alterar o texto (só o link `database/README.md` → `../database/README.md`); apagados do `AGENTS.md` o título do plano, Foco/Stack e a seção 1. **Verificação:** links do arquivo novo conferidos (`database/README.md`, `api/mcp.ts`, `api/_lib/` existem); `npm run validar`: typecheck, testes, build, env, python e audit OK; `chunks` FALHOU por problema anterior e sem relação (o build gera só `dist/index.html`, porque o `index.html` da raiz virou o painel estático no commit `62e215d`).
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-41.2 — Mover a seção "2. Estrutura do Servidor MCP (Vercel Serverless)"

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Mover do `AGENTS.md` para o fim de `docs/plano-cerebro-memoria-persistente.md` a seção `## 2. Estrutura do Servidor MCP (Vercel Serverless)` inteira: a nota "ℹ️ Implementação real", a "Estrutura de Arquivos Recomendada" e o exemplo ilustrativo de `api/mcp.ts`, **sem alterar o conteúdo**, só corrigindo os links relativos da nota (`api/mcp.ts`, `api/_lib/`, `api/_lib/brain-tools.ts`, `api/_lib/supabase.ts` → `../api/...`). Apagar a seção (com o `---` correspondente) do `AGENTS.md`.
- **Critérios de Aceitação:** Seção 2 completa no novo arquivo e fora do `AGENTS.md`; todos os links `../api/...` apontando para arquivos que existem; `npm run validar` verde.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-41.3 — Mover a seção "3. Ativação no Terminal (Claude Code)" e fechar a limpeza do `AGENTS.md`

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Mover do `AGENTS.md` para o fim de `docs/plano-cerebro-memoria-persistente.md` a seção `## 3. Ativação no Terminal (Claude Code)` (texto e comando `claude mcp add --transport http dashboard-ai-brain ...`), **sem alterar o conteúdo**. Depois, conferir que o `AGENTS.md` termina na seção "✅ 5. Regra de confirmação de status" (sem `---` sobrando no fim) e que nenhum arquivo do repositório aponta para o trecho removido (procurar por "Cérebro de Memória", "Jev-Mem" e "Arquitetura do Banco de Dados" nos `.md`, fora de `node_modules`); se apontar, trocar o link para o novo arquivo. Avaliar se a ativação do MCP (`claude mcp add`) deve virar uma regra curta no `AGENTS.md` com link para o novo arquivo; registrar a decisão na anotação.
- **Critérios de Aceitação:** Seção 3 completa no novo arquivo; o `AGENTS.md` não tem mais "Plano de Implementação" nem as seções `## 1. Arquitetura`, `## 2. Estrutura` e `## 3. Ativação`; nenhum link quebrado para o trecho removido; `npm run validar` verde.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE
