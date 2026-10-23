# STATUS — Dashboard AI

**Objetivo:** gerenciador genérico de tasks de IA multi-projeto (fila, memória persistente e monitor dos agentes).
**Partes interessadas:** Gelvazio (decide, aprova e usa) · agentes de IA (Claude Code, Grok, Gemini, DeepSeek, Devin…)
executam pelo quadro.
**Links:** [Regras](../AGENTS.md) · [Etapas](etapas/) · [Concluídas](task_complete.md) · [Recados](RECADOS.md) · [Histórico](historico/)

Legenda: ⬜ Pendente · 🔄 Em progresso · ✅ Concluído · ⛔ Bloqueado · 👀 Aguardando o usuário ·
Prioridade: 🔴 Máxima · 🟠 Alta · 🟡 Média · 🟢 Baixa

## 📌 Tarefas

Cada **subtarefa** é uma linha própria e pode ser reservada por **qualquer IA** (coluna "Em uso por"). A linha em
**negrito** é a tarefa-mãe: não se reserva; ela fecha quando todas as subtarefas estiverem ✅. Aqui só ficam
tarefas **abertas ou em andamento**: linha que vira ✅ é movida para o [`task_complete.md`](task_complete.md).

| Tarefa | Título | Prioridade | Depende de | Status | Em uso por | Etapa |
|---|---|---|---|---|---|---|
| SUB-45 | **Cadastro de projetos (campos novos na tabela `projects` e tela `#/projetos`)** · `PESADO · effort high` | 🟡 Média | Nenhuma | ⬜ Pendente (mãe: pegue uma subtarefa) | — (não reservável) | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-45.18 | Validação visual da tela Projetos · `MEDIO · effort medium` | 🟡 Média | SUB-45.6, SUB-45.16 | ⬜ Pendente | — | [ETAPA-007](etapas/ETAPA-007-4d9b03e6-CADASTRO-PROJETOS.md) |
| SUB-47 | **Equipe de agentes: classificar tarefas por nível com Laya Server (System-One)** · `MEDIO · effort medium` | 🟡 Média | Nenhuma | ⬜ Pendente (mãe: pegue uma subtarefa) | — (não reservável) | [ETAPA-009](etapas/ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md) |
| SUB-47.11 | Piloto da equipe em 1 item livre + aceite do usuário | 🟡 Média | SUB-47.6, SUB-47.8, SUB-47.9 | 👀 Aguardando o usuário | — | [ETAPA-009](etapas/ETAPA-009-5ca65c0a-EQUIPE-DE-AGENTES.md) |
| SUB-62 | **Cadastro de usuários: mensagem enganosa e acesso após o cadastro** · `MEDIO · effort medium` | 🟡 Média | Nenhuma | ⬜ Pendente (mãe: pegue uma subtarefa) | — (não reservável) | [ETAPA-023](etapas/ETAPA-023-a43de45a-CADASTRO-USUARIOS.md) |
| SUB-62.1 | Cadastro: não afirmar "criado" quando o e-mail já existe · `MEDIO · effort medium` | 🟡 Média | Nenhuma | ⬜ Pendente | — | [ETAPA-023](etapas/ETAPA-023-a43de45a-CADASTRO-USUARIOS.md) |
| SUB-62.2 | Logado sem acesso: dizer que falta um administrador liberar · `MEDIO · effort medium` | 🟡 Média | Nenhuma | ⬜ Pendente | — | [ETAPA-023](etapas/ETAPA-023-a43de45a-CADASTRO-USUARIOS.md) |
| SUB-62.3 | Documentar: usuário criado ≠ acesso liberado (`README.md` e `database/README.md`) | 🟢 Baixa | Nenhuma | 🔄 Em execução | Qoder (local · main) (desde 2026-10-13 22:01) | [ETAPA-023](etapas/ETAPA-023-a43de45a-CADASTRO-USUARIOS.md) |
| **RL-4F19D945-NIVEIS-E-MODELOS** | **Ajustar o projeto à regra niveis-e-modelos.md (rules-local 2026-10-23-4f19d945)** | 🟡 Média | Nenhuma | ⬜ Pendente (mãe: pegue uma subtarefa) | — (não reservável) | [ETAPA-027](etapas/ETAPA-027-d6731c13-RL-4F19D945-NIVEIS-E-MODELOS.md) |
| RL-4F19D945-NIVEIS-E-MODELOS.1 | Alinhar a matriz de níveis do projeto à C48 · `LEVE · effort low` | 🟡 Média | Nenhuma | ⬜ Pendente | — | [ETAPA-027](etapas/ETAPA-027-d6731c13-RL-4F19D945-NIVEIS-E-MODELOS.md) |
| **JEV-NAO** | **Marcar JEV-AI-SUGGESTION: NAO nas etapas do projeto (C47)** | 🟡 Média | Nenhuma | ⬜ Pendente (mãe: pegue uma subtarefa) | — (não reservável) | [ETAPA-028](etapas/ETAPA-028-5ed68e33-JEV-NAO-MARCAR-SUGESTAO.md) |
| JEV-NAO.1 | Rodar o script que marca JEV-AI-SUGGESTION: NAO nas subtarefas · `LEVE · effort low` | 🟡 Média | Nenhuma | ⬜ Pendente | — | [ETAPA-028](etapas/ETAPA-028-5ed68e33-JEV-NAO-MARCAR-SUGESTAO.md) |

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
| 015-074d37b0 | SUB-54: Tirar a tabela "🧭 Frentes" do quadro (fica só o "Em uso por") | [ETAPA-015-074d37b0-SEM-TABELA-FRENTES.md](etapas/ETAPA-015-074d37b0-SEM-TABELA-FRENTES.md) |
| 016-95657172 | SUB-55: Visualizador de regras e tarefas lendo os `.md` direto | [ETAPA-016-95657172-VISUALIZADOR-REGRAS.md](etapas/ETAPA-016-95657172-VISUALIZADOR-REGRAS.md) |
| 017-c31f8a42 | SUB-56: Consultar tarefas concluídas antes de afirmar status ou dependências | [ETAPA-017-c31f8a42-CONSULTAR-TASK-COMPLETE.md](etapas/ETAPA-017-c31f8a42-CONSULTAR-TASK-COMPLETE.md) |
| 018-a9bba1c3 | SUB-57: Remover a validação de integração SUB-35.46.2 por decisão do usuário | [ETAPA-018-a9bba1c3-REMOVER-SUB35-46-2.md](etapas/ETAPA-018-a9bba1c3-REMOVER-SUB35-46-2.md) |
| 019-5280d730 | SUB-58: Completar a estrutura do Claude Code (`.mcp.json`, hook de início, `CLAUDE.local.md`, `settings.json` limpo) | [ETAPA-019-5280d730-ESTRUTURA-CLAUDE-CODE.md](etapas/ETAPA-019-5280d730-ESTRUTURA-CLAUDE-CODE.md) |
| 020-83241354 | SUB-59: Hooks que obrigam o Claude Code a registrar a tarefa no quadro antes de editar | [ETAPA-020-83241354-HOOK-EXIGIR-TASK.md](etapas/ETAPA-020-83241354-HOOK-EXIGIR-TASK.md) |
| 021-1181a9a3 | SUB-60: Comandos (skills) para todas as IAs, sempre sincronizados | [ETAPA-021-1181a9a3-COMANDOS-TODAS-IAS.md](etapas/ETAPA-021-1181a9a3-COMANDOS-TODAS-IAS.md) |
| 022-c00b3c7f | SUB-61: Sincronia automática das skills no commit e Gemini CLI lendo o `AGENTS.md` | [ETAPA-022-c00b3c7f-SINCRONIA-AUTOMATICA.md](etapas/ETAPA-022-c00b3c7f-SINCRONIA-AUTOMATICA.md) |
| 023-a43de45a | SUB-62: Cadastro de usuários (mensagem enganosa e acesso após o cadastro) | [ETAPA-023-a43de45a-CADASTRO-USUARIOS.md](etapas/ETAPA-023-a43de45a-CADASTRO-USUARIOS.md) |
| 024-9c11a6d2 | SUB-63: Mover KIRO-DEV-CLONE para `TASK_IGNORED.md` | [ETAPA-024-9c11a6d2-KIRO-IGNORADA.md](etapas/ETAPA-024-9c11a6d2-KIRO-IGNORADA.md) |
| 025-630177ec | SUB-64: A IA sempre aceita, nunca pede aceite (C32) | [ETAPA-025-630177ec-SEM-ACEITE.md](etapas/ETAPA-025-630177ec-SEM-ACEITE.md) |
| 026-722fcf66 | COMMIT.INICIAL.RULES-AI: commit e push inicial do quadro | [ETAPA-026-722fcf66-COMMIT-INICIAL-RULES-AI.md](etapas/ETAPA-026-722fcf66-COMMIT-INICIAL-RULES-AI.md) |
| 028-5ed68e33 | JEV-NAO: Marcar JEV-AI-SUGGESTION: NAO nas etapas do projeto (C47) | [ETAPA-028-5ed68e33-JEV-NAO-MARCAR-SUGESTAO.md](etapas/ETAPA-028-5ed68e33-JEV-NAO-MARCAR-SUGESTAO.md) |

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
| 2026-10-17 21:50 | Regra global C32 aplicada: a IA sempre aceita e nunca pede aceite; aceites do quadro fechados (SUB-64) | Gelvazio | "1-SEMPRE ACEITE,NUNCA PERGUNTE;2-SIM;3-SIM" |
| 2026-10-13 21:05 | Toda subtarefa tem `Nível` (LEVE/MEDIO/PESADO) na sua seção da etapa; cada frente só pega até o nível da sua linha na matriz da skill `classificar-tarefa`; equipe do Claude Code faz 1 subtarefa por vez na mesma pasta (regra em `.claude/rules/multiplas-ias.md`, SUB-47.7) | Gelvazio | Matriz confirmada no chat (SUB-47.2) e "1 por vez, pasta única" |
| 2026-10-13 20:14 | `pre-commit` sincroniza as skills sozinho quando o commit mexe em `.agents/`; `GEMINI.md` importa o `AGENTS.md` para o Gemini CLI (SUB-61) | Gelvazio | Pedido no chat ("Sim") e plano aprovado |
| 2026-10-13 20:05 | Skills/comandos com fonte única em `.agents/skills/`; cópias geradas em `.claude/`, `.grok/` e `.gemini/commands/` por `npm run sync:agentes`; o `pre-push` recusa push com cópia desatualizada (SUB-60) | Gelvazio | Pedido no chat: "crie versões de comandos pra todas e deixe eles sincronizados"; plano aprovado |
| 2026-10-13 19:51 | Hooks do Claude Code exigem subtarefa reservada antes de editar arquivo fora de `tasks/` e lembram a regra a cada pedido (SUB-59; regra em `.claude/rules/multiplas-ias.md`) | Gelvazio | Pedido no chat: "E o hook pra gravar a task no quadro" → "Faça isso"; plano aprovado |
| 2026-10-13 14:27 | Quadro migrado para `tasks/STATUS.md` + `tasks/etapas/`; `task-principal.md`, `task_complete.md` e `STATUS.md` antigos congelados em `tasks/historico/` | Gelvazio | Pedido no chat: "migre tudo pro modelo novo e evite duplicatas de regras" |
| 2026-10-13 14:30 | Toda subtarefa continua podendo ser assumida por qualquer IA (uma linha por subtarefa) | Gelvazio | Pedido no chat |
| 2026-10-13 14:32 | Toda tarefa-mãe tem no mínimo 1 subtarefa | Gelvazio | Pedido no chat |
| 2026-10-13 12:25–12:35 | Matriz ferramenta × modelo × nível (fácil/média/difícil) da SUB-47: difícil só Claude Code com Opus 5.5+ ou Fable | Gelvazio | Pedidos no chat (detalhe na ETAPA-009) |
| 2026-10-13 14:22 | SUB-47 mantém o Laya Server; fonte oficial <https://github.com/NandhaKishorM/laya> | Gelvazio | Pedido no chat (opção C) |
| 2026-10-13 14:49 | Migração do quadro aceita (ETAPA-001) | Gelvazio | Aceite no chat |
| 2026-10-13 14:49 | SUB-45.5 (teste SQL novo) removida; SUB-45.6 passa a depender da SUB-45.4 | Gelvazio | Regra "nunca escrever testes, exceto para corrigir bug" |
| 2026-10-13 16:04 | `.claude/rules/index.html` deixa de ser cópia gerada do aulasenai e passa a ler as regras e o quadro direto dos `.md` da `main` (SUB-55) | Gelvazio | Aprovado no chat ("sim") |
| 2026-10-13 15:48 | Tabela "🧭 Frentes" sai do `STATUS.md` (SUB-54): quem está fazendo o quê fica só na coluna "Em uso por" (fonte única; acaba o conflito de linhas vizinhas) | Gelvazio | Aprovado no chat ("sim") |
| 2026-10-13 15:27 | Ferramentas **só de leitura** do MCP do Supabase (listar projetos, tabelas, migrações, extensões, logs, advisors, docs, tipos) liberadas no `.claude/settings.json`; `execute_sql` e `apply_migration` continuam pedindo confirmação (podem gravar no banco, e gravar exige autorização do usuário) | Gelvazio | Pedido no chat: "anote esta regra, pra nunca mais me perguntar, só faça" (pedido de permissão do "List projects") |
| 2026-10-13 15:16 | Comandos recorrentes (git sem `--force`, leitura, `npm run validar/typecheck/build/test`) liberados no `.claude/settings.json` versionado; `git push --force`/`-f`, `git add .` e `git add -A` negados. Caminhos da pasta temporária de cada sessão ficam só no `settings.local.json` | Gelvazio | Pedidos no chat: "libere os comandos recorrentes agora" e "já envie eles pro main" |
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
| Juntar os passos repetidos dos workflows de backup (senha, URL, dump) numa ação composta | Fora da SUB-49.3; evita mexer no workflow de Artifacts antes do 1º disparo real | Depois que os dois workflows rodarem no runner |
| Aceites de etapas antigas (1 a 9 do `historico/STATUS-antigo.md`) | Aguardam o usuário desde 2026-10-12 | Quando o usuário revisar |
| SUB-28: decidir o fechamento da SUB-28 (todas as filhas concluídas, com a ressalva do commit `76f243e`) | Fechar mãe é decisão do usuário | Quando o usuário revisar |
| ~~Link quebrado no `README.md` para `dashboard-task-principal.html`~~ | ✅ Resolvido na ETAPA-001 (item 001.9): o README aponta para o `index.html` | — |

## Lições aprendidas

| Data | O que aconteceu | Lição / nova regra |
|---|---|---|
| 2026-10-12 | Um resumo do quadro reescrito por inteiro apagou itens criados por outro agente | Cada frente edita só as próprias linhas; nada de contagens mantidas à mão (o modelo novo não tem resumo) |
| 2026-10-13 | O mesmo bloco ficou no quadro ativo e no de concluídas (SUB-26.9), e a SUB-47 ficou com código duplicado | Fonte única: cada informação em um lugar só |
| 2026-10-13 | Claude Code (local) publicou duas vezes marcas de conflito (`<<<<<<<`) na `main` (`5d885d1`, `8b1402b`): editou antes de sincronizar, usou `git pull --autostash` (fora da regra) e encadeou comandos com `;`, então o commit saiu com o conflito aberto | Seguir o `git-quick.md` à risca: sincronizar antes de editar; commitar e só então `pull --rebase`; encadear com `&&`; conflito → parar, resolver, procurar `<<<<<<<` e só então push. Nunca `--autostash` |
| 2026-10-13 | Reserva fora da regra: SUB-53 reservada e entregue no mesmo commit; o `lock:` da SUB-47.3 (`ae50c56`) levou também a etapa; liberação de permissões (`31084ef`, `b8057ae`) feita sem tarefa no quadro; SUB-52 (7 arquivos, regras) tratada como pequena | Reserva = commit `lock:` só com o `tasks/STATUS.md` + push **antes** do trabalho; todo pedido que muda arquivo vira tarefa antes; mais de ~3 arquivos ou regra nova = tarefa grande (plano na etapa + aprovação) |
| 2026-10-13 | Código SUB-51 reaproveitado (já usado pelo Laya, fundido na SUB-47) | Antes de criar código novo, procurar o código em `tasks/`, `tasks/historico/` e no `git log` |
