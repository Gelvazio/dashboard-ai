# STATUS — Dashboard AI

**Objetivo:** gerenciador genérico de tasks de IA multi-projeto (fila, memória persistente e monitor dos agentes).
**Partes interessadas:** Gelvazio (decide, aprova e usa) · agentes de IA (Claude Code, Grok, Gemini, DeepSeek, Devin…)
executam pelo quadro.
**Links:** [Regras](../AGENTS.md) · [Etapas](etapas/) · [Concluídas](task_complete.md) · [Recados](RECADOS.md) · [Histórico](historico/)

Legenda: ⬜ Pendente · 🔄 Em progresso · ✅ Concluído · ⛔ Bloqueado · 👀 Aguardando o usuário ·
Prioridade: 🔴 Máxima · 🟠 Alta · 🟡 Média · 🟢 Baixa

## 🧭 Frentes de trabalho

| Frente | Tarefa (etapa) | Situação | Atualizado em |
|---|---|---|---|
| Claude Code (Opus 5.5) (local · main) | SUB-41.1 ([ETAPA-005](etapas/ETAPA-005-6b941e1e-AGENTS-SEM-PLANO-CEREBRO.md)) | ✅ Entregue | 2026-10-13 15:11 |

## 📌 Tarefas

Cada **subtarefa** é uma linha própria e pode ser reservada por **qualquer IA** (coluna "Em uso por"). A linha em
**negrito** é a tarefa-mãe: não se reserva; ela fecha quando todas as subtarefas estiverem ✅. Aqui só ficam
tarefas **abertas ou em andamento**: linha que vira ✅ é movida para o [`task_complete.md`](task_complete.md).

| Tarefa | Título | Prioridade | Depende de | Status | Em uso por | Etapa |
|---|---|---|---|---|---|---|
| SUB-35 | **Monitor em Tempo Real dos Agentes** | 🟡 Média | SUB-12, SUB-29, SUB-30 | ⬜ Pendente (mãe: pegue uma subtarefa) | — (não reservável) | [ETAPA-004](etapas/ETAPA-004-57a86337-MONITOR-TEMPO-REAL.md) |
| SUB-35.46 | Validação automatizada da SUB-35 | 🟡 Média | SUB-35.7, SUB-35.12, SUB-35.13, SUB-35.32, SUB-35.34, SUB-35.38, SUB-35.39, SUB-35.41, SUB-35.43, SUB-35.44, SUB-35.45 | ⬜ Pendente | — | [ETAPA-004](etapas/ETAPA-004-57a86337-MONITOR-TEMPO-REAL.md) |
| SUB-41 | **Tirar do `AGENTS.md` o plano "🧠 Cérebro de Memória Persistente" (o `AGENTS.md` fica só com regras)** | 🟡 Média | Nenhuma | ⬜ Pendente (mãe: pegue uma subtarefa) | — (não reservável) | [ETAPA-005](etapas/ETAPA-005-6b941e1e-AGENTS-SEM-PLANO-CEREBRO.md) |
| SUB-41.2 | Mover a seção "2. Estrutura do Servidor MCP (Vercel Serverless)" | 🟡 Média | SUB-41.1 | ⬜ Pendente | — | [ETAPA-005](etapas/ETAPA-005-6b941e1e-AGENTS-SEM-PLANO-CEREBRO.md) |
| SUB-41.3 | Mover a seção "3. Ativação no Terminal (Claude Code)" e fechar a limpeza do `AGENTS.md` | 🟡 Média | SUB-41.2 | ⬜ Pendente | — | [ETAPA-005](etapas/ETAPA-005-6b941e1e-AGENTS-SEM-PLANO-CEREBRO.md) |
| SUB-45 | **Cadastro de projetos (campos novos na tabela `projects` e tela `#/projetos`)** | 🟡 Média | Nenhuma | ⬜ Pendente (mãe: pegue uma subtarefa) | — (não reservável) | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-45.2 | Colunas `cor` e `icone` em `database/08_projects_campos.sql` | 🟡 Média | SUB-45.1, SUB-45.19 | ⬜ Pendente | — | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-45.3 | Colunas `url_producao` e `url_documentacao` em `database/08_projects_campos.sql` | 🟡 Média | SUB-45.2 | ⬜ Pendente | — | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-45.4 | Colunas `prioridade` e `tags` em `database/08_projects_campos.sql` | 🟡 Média | SUB-45.3 | ⬜ Pendente | — | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-45.6 | Aplicar o `database/08_projects_campos.sql` no Supabase (só com autorização do usuário) | 🟡 Média | SUB-45.4 | ⬜ Pendente | — | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-45.7 | Tipos novos de `Project` em `src/types/database.ts` | 🟡 Média | SUB-45.4 | ⬜ Pendente | — | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-45.8 | `validarProjeto()` em `src/lib/projeto.ts` | 🟡 Média | SUB-45.7 | ⬜ Pendente | — | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-45.9 | `criarProjeto()` em `src/services/projectService.ts` | 🟡 Média | SUB-45.7 | ⬜ Pendente | — | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-45.10 | `atualizarProjeto()` e `definirProjetoAtivo()` em `src/services/projectService.ts` | 🟡 Média | SUB-45.9 | ⬜ Pendente | — | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-45.11 | Componente `src/components/projetos/StatusProjetoBadge.tsx` | 🟡 Média | SUB-45.7 | ⬜ Pendente | — | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-45.12 | `ProjetoForm.tsx`: campos básicos | 🟡 Média | SUB-45.8, SUB-45.9 | ⬜ Pendente | — | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-45.13 | `ProjetoForm.tsx`: campos novos | 🟡 Média | SUB-45.12, SUB-45.10 | ⬜ Pendente | — | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-45.14 | Componente `src/components/projetos/ProjetosLista.tsx` | 🟡 Média | SUB-45.10, SUB-45.11 | ⬜ Pendente | — | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-45.15 | Tela `src/views/ProjetosView.tsx` | 🟡 Média | SUB-45.13, SUB-45.14 | ⬜ Pendente | — | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-45.16 | Registrar a tela `projetos` (rota `#/projetos` e menu) | 🟡 Média | SUB-45.15 | ⬜ Pendente | — | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-45.17 | Documentar projetos no `README.md` e no `database/README.md` | 🟡 Média | SUB-45.4, SUB-45.16 | ⬜ Pendente | — | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-45.18 | Validação visual da tela Projetos | 🟡 Média | SUB-45.6, SUB-45.16 | ⬜ Pendente | — | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-45.19 | Revisar a SUB-45.1 (`database/08_projects_campos.sql`) com o MCP do Supabase — só Claude Code local | 🟡 Média | SUB-45.1 | ⬜ Pendente | — | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| KIRO-DEV-CLONE | **Clone do Kiro.dev** | 🟢 Baixa | Nenhuma | ⬜ Pendente (mãe: pegue uma subtarefa) | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.1 | Link "KIRO DEV CLONE" no menu | 🟢 Baixa | KIRO-DEV-CLONE.2 | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.2 | Rota `/kiro-dev-clone` | 🟢 Baixa | KIRO-DEV-CLONE.3 | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.3 | Componente base `KiroDevClone` | 🟢 Baixa | Nenhuma | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.4 | Componente de Specs | 🟢 Baixa | Nenhuma | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.5 | Botão "Criar Spec" | 🟢 Baixa | KIRO-DEV-CLONE.4 | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.6 | Endpoint para salvar specs | 🟢 Baixa | KIRO-DEV-CLONE.4 | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.7 | Componente de Chat | 🟢 Baixa | Nenhuma | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.8 | Conectar chat com LLM | 🟢 Baixa | KIRO-DEV-CLONE.7 | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.9 | Componente de Steering | 🟢 Baixa | Nenhuma | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.10 | Validação de steering | 🟢 Baixa | KIRO-DEV-CLONE.9 | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.11 | Sistema de hooks | 🟢 Baixa | Nenhuma | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.12 | Hook de file change | 🟢 Baixa | KIRO-DEV-CLONE.11 | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.13 | Integrar MCP existente | 🟢 Baixa | Nenhuma | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.14 | Ferramentas MCP específicas | 🟢 Baixa | KIRO-DEV-CLONE.13 | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.15 | Componente de Permissions | 🟢 Baixa | Nenhuma | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.16 | Controle de acesso | 🟢 Baixa | KIRO-DEV-CLONE.15 | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.17 | Sistema de custom agents | 🟢 Baixa | Nenhuma | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.18 | UI para custom agents | 🟢 Baixa | KIRO-DEV-CLONE.17 | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.19 | Sistema de Skills | 🟢 Baixa | Nenhuma | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.20 | UI para Skills | 🟢 Baixa | KIRO-DEV-CLONE.19 | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.21 | Usar memória existente | 🟢 Baixa | Nenhuma | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.22 | Integrar memória com chat | 🟢 Baixa | KIRO-DEV-CLONE.21, KIRO-DEV-CLONE.7 | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.23 | Sistema de checkpoints | 🟢 Baixa | Nenhuma | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.24 | UI para checkpoints | 🟢 Baixa | KIRO-DEV-CLONE.23 | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.25 | Arquivo `.kiroignore` | 🟢 Baixa | Nenhuma | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.26 | Leitura do `.kiroignore` | 🟢 Baixa | KIRO-DEV-CLONE.25 | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.27 | Sistema de workflows | 🟢 Baixa | Nenhuma | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.28 | UI para workflows | 🟢 Baixa | KIRO-DEV-CLONE.27 | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.29 | `projects/kiro-dev-clone/STATUS.md` | 🟢 Baixa | Nenhuma | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| KIRO-DEV-CLONE.30 | Pasta `projects/kiro-dev-clone/docs/` | 🟢 Baixa | Nenhuma | ⬜ Pendente | 🔒 Trava especial (só o usuário libera) | [ETAPA-008](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| SUB-47 | **Equipe de agentes: classificar tarefas por nível com Laya Server (System-One)** | 🟡 Média | Nenhuma | ⬜ Pendente (mãe: pegue uma subtarefa) | — (não reservável) | [ETAPA-009](etapas/ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md) |
| SUB-47.0 | Configurar Laya Server via Docker Compose | 🟡 Média | Nenhuma | ⬜ Pendente | — | [ETAPA-009](etapas/ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md) |
| SUB-47.1 | Criar wrapper TypeScript para API do Laya com Opus como revisor/fallback (`src/lib/laya.ts`) | 🟡 Média | SUB-47.0 | ⬜ Pendente | — | [ETAPA-009](etapas/ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md) |
| SUB-47.2 | Skill `classificar-tarefa` (níveis, sinais, matriz ferramenta × modelo) | 🟡 Média | SUB-47.1 | ⬜ Pendente | — | [ETAPA-009](etapas/ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md) |
| SUB-47.3 | Script `scripts/sincronizar-agentes.mjs` (`.agents/` → `.claude/`) | 🟡 Média | Nenhuma | ⬜ Pendente | — | [ETAPA-009](etapas/ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md) |
| SUB-47.4 | Agente `classificador-tarefas` (usa Laya, não Opus) | 🟡 Média | SUB-47.2, SUB-47.3 | ⬜ Pendente | — | [ETAPA-009](etapas/ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md) |
| SUB-47.5 | Executores `executor-leve` (Haiku), `executor-medio` (Sonnet), `executor-pesado` (Opus) | 🟡 Média | SUB-47.3 | ⬜ Pendente | — | [ETAPA-009](etapas/ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md) |
| SUB-47.6 | Skill `liderar-equipe` (fluxo do líder) | 🟡 Média | SUB-47.4, SUB-47.5 | ⬜ Pendente | — | [ETAPA-009](etapas/ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md) |
| SUB-47.7 | Regra nova no `AGENTS.md`: campo `Nível`, matriz e equipe | 🟡 Média | SUB-47.2 | ⬜ Pendente | — | [ETAPA-009](etapas/ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md) |
| SUB-47.8 | `proxima-task` filtra por nível | 🟡 Média | SUB-47.7 | ⬜ Pendente | — | [ETAPA-009](etapas/ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md) |
| SUB-47.9 | Classificar os blocos pendentes do quadro | 🟡 Média | SUB-47.4, SUB-47.7 | ⬜ Pendente | — | [ETAPA-009](etapas/ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md) |
| SUB-47.10 | Instalação global em `~/.agents/` e `~/.claude/` (só com autorização) | 🟡 Média | SUB-47.6 | ⬜ Pendente | — | [ETAPA-009](etapas/ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md) |
| SUB-47.11 | Piloto da equipe em 1 item livre + aceite do usuário | 🟡 Média | SUB-47.6, SUB-47.8, SUB-47.9 | ⬜ Pendente | — | [ETAPA-009](etapas/ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md) |
| SUB-47.12 | Integrar classificação Laya no worker LangGraph | 🟡 Média | SUB-47.1 | ⬜ Pendente | — | [ETAPA-009](etapas/ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md) |
| SUB-47.13 | Documentar Laya Server e Opus no README | 🟡 Média | SUB-47.0 | ⬜ Pendente | — | [ETAPA-009](etapas/ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md) |
| SUB-48 | **Definir estrutura `projects/` para projetos de IA independentes** | 🟡 Média | Nenhuma | ⬜ Pendente (mãe: pegue uma subtarefa) | — (não reservável) | [ETAPA-010](etapas/ETAPA-010-43fbb21f-ESTRUTURA-PROJECTS.md) |
| SUB-48.1 | Definir estrutura `projects/` para projetos de IA independentes | 🟡 Média | Nenhuma | ⬜ Pendente | — | [ETAPA-010](etapas/ETAPA-010-43fbb21f-ESTRUTURA-PROJECTS.md) |
| SUB-49 | **Configurar backup diário do Supabase (GitHub Artifacts e Cloudflare R2)** | 🟡 Média | SUB-48 | ⬜ Pendente (mãe: pegue uma subtarefa) | — (não reservável) | [ETAPA-011](etapas/ETAPA-011-4fb0d31c-BACKUP-SUPABASE.md) |
| SUB-49.1 | Criar workflow GitHub Actions para backup com GitHub Artifacts | 🟡 Média | Nenhuma | ⬜ Pendente | — | [ETAPA-011](etapas/ETAPA-011-4fb0d31c-BACKUP-SUPABASE.md) |
| SUB-49.2 | Documentar uso de GitHub Artifacts (limites, retenção, download) | 🟡 Média | SUB-49.1 | ⬜ Pendente | — | [ETAPA-011](etapas/ETAPA-011-4fb0d31c-BACKUP-SUPABASE.md) |
| SUB-49.3 | Criar workflow alternativo para Cloudflare R2 (retenção > 90 dias) | 🟡 Média | SUB-49.2 | ⬜ Pendente | — | [ETAPA-011](etapas/ETAPA-011-4fb0d31c-BACKUP-SUPABASE.md) |
| SUB-49.4 | Documentar escolha entre as 2 opções e migração | 🟡 Média | SUB-49.3 | ⬜ Pendente | — | [ETAPA-011](etapas/ETAPA-011-4fb0d31c-BACKUP-SUPABASE.md) |
| SUB-50 | **Configurar Supabase local com Docker para desenvolvimento** | 🟡 Média | Nenhuma | ⬜ Pendente (mãe: pegue uma subtarefa) | — (não reservável) | [ETAPA-012](etapas/ETAPA-012-f73bee11-SUPABASE-LOCAL.md) |
| SUB-50.1 | Instalar e configurar o Supabase CLI | 🟡 Média | Nenhuma | ⬜ Pendente | — | [ETAPA-012](etapas/ETAPA-012-f73bee11-SUPABASE-LOCAL.md) |
| SUB-50.2 | Inicializar o Supabase local na pasta `database/configlocal` (`supabase init --config database/configlocal`) | 🟡 Média | SUB-50.1 | ⬜ Pendente | — | [ETAPA-012](etapas/ETAPA-012-f73bee11-SUPABASE-LOCAL.md) |
| SUB-50.3 | Converter scripts `database/*.sql` para `database/configlocal/migrations/` | 🟡 Média | SUB-50.2 | ⬜ Pendente | — | [ETAPA-012](etapas/ETAPA-012-f73bee11-SUPABASE-LOCAL.md) |
| SUB-50.4 | Configurar variáveis de ambiente para ambiente local | 🟡 Média | SUB-50.3 | ⬜ Pendente | — | [ETAPA-012](etapas/ETAPA-012-f73bee11-SUPABASE-LOCAL.md) |
| SUB-50.5 | Rodar o Supabase local e validar (`supabase start --config database/configlocal`) | 🟡 Média | SUB-50.4 | ⬜ Pendente | — | [ETAPA-012](etapas/ETAPA-012-f73bee11-SUPABASE-LOCAL.md) |
| SUB-50.6 | Documentar alternância entre local e nuvem | 🟡 Média | SUB-50.5 | ⬜ Pendente | — | [ETAPA-012](etapas/ETAPA-012-f73bee11-SUPABASE-LOCAL.md) |
| SUB-50.7 | Atualizar o `README.md` com instruções de desenvolvimento local | 🟡 Média | SUB-50.6 | ⬜ Pendente | — | [ETAPA-012](etapas/ETAPA-012-f73bee11-SUPABASE-LOCAL.md) |

## Escopo do projeto

- **Entra:** fila de tasks por projeto (Supabase + RLS), memória persistente com embeddings (MCP), monitor em tempo
  real dos agentes, worker LangGraph e as telas do painel.
- **Não entra:** os projetos filhos de `projects/` (cada um tem as próprias regras e quadro).

## 🗂️ Etapas

| Etapa | Assunto | Arquivo |
|---|---|---|
| 001-ef019419 | MIGRA-QUADRO: migrar o quadro para o modelo novo | [ETAPA-001-ef019419-MIGRACAO-QUADRO.md](etapas/ETAPA-001-ef019419-MIGRACAO-QUADRO.md) |
| 002-90cd9004 | SUB-38: Verificação geral de todas as tarefas (marcador `VERIFICADOR-CLAUDE`) — ❌ excluída em 2026-10-13 | [ETAPA-002-90cd9004-VERIFICACAO-GERAL.md](etapas/ETAPA-002-90cd9004-VERIFICACAO-GERAL.md) |
| 003-6df4b821 | SUB-28: Integração LangChain/LangGraph para Execução de Tasks | [ETAPA-003-6df4b821-LANGGRAPH.md](etapas/ETAPA-003-6df4b821-LANGGRAPH.md) |
| 004-57a86337 | SUB-35: Monitor em Tempo Real dos Agentes | [ETAPA-004-57a86337-MONITOR-TEMPO-REAL.md](etapas/ETAPA-004-57a86337-MONITOR-TEMPO-REAL.md) |
| 005-6b941e1e | SUB-41: Tirar do `AGENTS.md` o plano "🧠 Cérebro de Memória Persistente" (o `AGENTS.md` fica só com regras) | [ETAPA-005-6b941e1e-AGENTS-SEM-PLANO-CEREBRO.md](etapas/ETAPA-005-6b941e1e-AGENTS-SEM-PLANO-CEREBRO.md) |
| 006-5d507457 | SUB-42: Tirar do `AGENTS.md` as referências a tarefas específicas (regras genéricas) | [ETAPA-006-5d507457-AGENTS-SEM-TAREFAS.md](etapas/ETAPA-006-5d507457-AGENTS-SEM-TAREFAS.md) |
| 007-4d9b03e6 | SUB-45: Cadastro de projetos (campos novos na tabela `projects` e tela `#/projetos`) | [ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| 008-f301fc16 | KIRO-DEV-CLONE: Clone do Kiro.dev | [ETAPA-008-f301fc16-KIRO-DEV-CLONE.md](etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md) |
| 009-5ca65c0a | SUB-47: Equipe de agentes: classificar tarefas por nível com Laya Server (System-One) | [ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md](etapas/ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md) |
| 010-43fbb21f | SUB-48: Definir estrutura `projects/` para projetos de IA independentes | [ETAPA-010-43fbb21f-ESTRUTURA-PROJECTS.md](etapas/ETAPA-010-43fbb21f-ESTRUTURA-PROJECTS.md) |
| 011-4fb0d31c | SUB-49: Configurar backup diário do Supabase (GitHub Artifacts e Cloudflare R2) | [ETAPA-011-4fb0d31c-BACKUP-SUPABASE.md](etapas/ETAPA-011-4fb0d31c-BACKUP-SUPABASE.md) |
| 012-f73bee11 | SUB-50: Configurar Supabase local com Docker para desenvolvimento | [ETAPA-012-f73bee11-SUPABASE-LOCAL.md](etapas/ETAPA-012-f73bee11-SUPABASE-LOCAL.md) |
| 013-2aa270f6 | SUB-52: Restaurar o `task_complete.md` e mover para ele toda tarefa concluída | [ETAPA-013-2aa270f6-TASK-COMPLETE.md](etapas/ETAPA-013-2aa270f6-TASK-COMPLETE.md) |
| 014-7d3c51e9 | SUB-53: Listar as tarefas pendentes depois de cada push na `main` | [ETAPA-014-7d3c51e9-LISTAR-PENDENTES-APOS-PUSH.md](etapas/ETAPA-014-7d3c51e9-LISTAR-PENDENTES-APOS-PUSH.md) |

**Histórico (antes de 2026-10-13, congelado — não editar):** quadro antigo, concluídas e etapas 1 a 9 do
`STATUS.md` antigo estão em [`historico/`](historico/).

## Riscos

| Risco | Chance | Impacto | Plano B | Situação |
|---|---|---|---|---|
| Duas frentes editarem o `STATUS.md` ao mesmo tempo | Média | Conflito no push | Cada frente mexe só nas próprias linhas; sincronizar e reler antes do push | Acompanhando |
| Testes de integração não rodam nesta máquina (sem Docker/Postgres local) | Certa | Itens de banco sem prova local | Conferir código, SQL e `docs/VALIDACAO.md`; marcar ressalva | Aceito |

## Bloqueios gerais (sem tarefa)

| Data | Motivo | O que destrava | Resolvido em |
|---|---|---|---|

## Registro de decisões

Decisões de 2026-10-12 a 2026-10-13 12:10: ver `historico/STATUS-antigo.md`. Daqui para a frente:

| Data | Decisão | Quem | Por quê |
|---|---|---|---|
| 2026-10-13 14:27 | Quadro migrado para `tasks/STATUS.md` + `tasks/etapas/`; `task-principal.md`, `task_complete.md` e `STATUS.md` antigos congelados em `tasks/historico/` | Gelvazio | Pedido no chat: "migre tudo pro modelo novo e evite duplicatas de regras" |
| 2026-10-13 14:30 | Toda subtarefa continua podendo ser assumida por qualquer IA (uma linha por subtarefa) | Gelvazio | Pedido no chat |
| 2026-10-13 14:32 | Toda tarefa-mãe tem no mínimo 1 subtarefa | Gelvazio | Pedido no chat |
| 2026-10-13 12:25–12:35 | Matriz ferramenta × modelo × nível (fácil/média/difícil) da SUB-47: difícil só Claude Code com Opus 5.5+ ou Fable | Gelvazio | Pedidos no chat (detalhe na ETAPA-009) |
| 2026-10-13 14:22 | SUB-47 mantém o Laya Server; fonte oficial <https://github.com/NandhaKishorM/laya> | Gelvazio | Pedido no chat (opção C) |
| 2026-10-13 14:49 | Migração do quadro aceita (ETAPA-001) | Gelvazio | Aceite no chat |
| 2026-10-13 14:49 | SUB-45.5 (teste SQL novo) removida; SUB-45.6 passa a depender da SUB-45.4 | Gelvazio | Regra "nunca escrever testes, exceto para corrigir bug" |
| 2026-10-13 15:08 | Depois de cada push para a `main`, a IA mostra a tela de tarefas pendentes antes da frase final (regra em `.claude/rules/git-quick.md`) | Gelvazio | Pedido no chat: "ao final de cada push ao main, automaticamente já liste a tela de tarefas pendentes" |
| 2026-10-13 15:03 | SUB-38 (verificação geral, marcador `VERIFICADOR-CLAUDE`) **excluída** do quadro; etapa mantida como histórico. Os marcadores já gravados ficam como estão e ninguém preenche os `PENDENTE` | Gelvazio | Pedido no chat: "exclua ela" |
| 2026-10-13 15:03 | Tarefa do `task_complete.md` renumerada de `SUB-51` para `SUB-52` (`SUB-51` já tinha sido usado pelo Laya Server, fundido na SUB-47) | Claude Code (Opus 5.5) | Evitar código repetido |
| 2026-10-13 15:05 | `task_complete.md` restaurado em `tasks/`; no `STATUS.md` só ficam tarefas abertas ou em andamento e toda linha ✅ é movida para o `task_complete.md` no commit da entrega (regra em `.claude/rules/tasks/quadro.md`) | Gelvazio | Pedidos no chat: "restaure o task_complete.md…", "no quadro deve ficar apenas tarefa aberta ou em andamento" e "registre a regra também, pra evitar erros futuros" |
| 2026-10-13 15:00 | Toda a pasta `.claude/` vai para o Git (inclusive as sobras da skill `proxima-task`), **menos** `settings.local.json` e `launch.json`, que ficam no `.gitignore` | Gelvazio | Pedidos no chat: "tudo da pasta .claude deve ir pro git" e "settings.local.json e o launch.json, estes 2 mantenha fora do git" |
| 2026-10-13 14:49 | Não apagar `test_output.md` e `evals/` em `.claude/skills/proxima-task/` (ficam fora do Git) | Gelvazio | Pedido no chat: "não apague nada" |
| 2026-10-13 15:09 | SUB-28 fechada: todas as subtarefas já estavam concluídas; linha da mãe movida para o `task_complete.md` | Gelvazio | Pedido no chat: "feche a sub-28" |
| 2026-10-13 15:09 | Plano da SUB-47 (ETAPA-009) **aprovado**; a dependência "aprovação do plano pelo usuário" sai das subtarefas SUB-47.0 a SUB-47.13 | Gelvazio | Pedido no chat: "sub-47 aprovada" |

## Pendências (ficou para depois)

| Item | Motivo | Quando retomar |
|---|---|---|
| Aceites de etapas antigas (1 a 9 do `historico/STATUS-antigo.md`) | Aguardam o usuário desde 2026-10-12 | Quando o usuário revisar |
| SUB-28: decidir o fechamento da SUB-28 (todas as filhas concluídas, com a ressalva do commit `76f243e`) | Fechar mãe é decisão do usuário | Quando o usuário revisar |
| ~~Link quebrado no `README.md` para `dashboard-task-principal.html`~~ | ✅ Resolvido na ETAPA-001 (item 001.9): o README aponta para o `index.html` | — |

## Lições aprendidas

| Data | O que aconteceu | Lição / nova regra |
|---|---|---|
| 2026-10-12 | Um resumo do quadro reescrito por inteiro apagou itens criados por outro agente | Cada frente edita só as próprias linhas; nada de contagens mantidas à mão (o modelo novo não tem resumo) |
| 2026-10-13 | O mesmo bloco ficou no quadro ativo e no de concluídas (SUB-26.9), e a SUB-47 ficou com código duplicado | Fonte única: cada informação em um lugar só |
