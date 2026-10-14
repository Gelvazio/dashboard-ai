# 🤝 Várias IAs neste projeto (Dashboard AI)

Regras **deste projeto** que completam `tasks/frentes-e-reserva.md` (genérico).

## Tamanho das subtarefas

- Cada subtarefa cabe em cerca de **3 minutos** de trabalho de uma IA: 1 função, 1 método,
  1 componente, 1 classe, 1 arquivo ou 1 seção de documentação.
- Percebeu que é maior → **dividir** antes de codificar (novas linhas no `STATUS.md`), em vez de
  entregar pela metade.

## Nível das subtarefas (SUB-47)

- Toda subtarefa tem um **nível** — `LEVE` (fácil), `MEDIO` (média) ou `PESADO` (difícil) — como 1º
  item da sua seção na etapa: `- **Nível:** MEDIO — motivo curto`. Quem cria ou divide a subtarefa
  classifica pela skill [`classificar-tarefa`](../../.agents/skills/classificar-tarefa/SKILL.md)
  (Laya + sinais; na dúvida, sobe o nível). Subtarefa antiga sem nível: classificar antes de pegar.
- Cada frente se identifica como **ferramenta + modelo** (o nome da frente) e só pega subtarefa com
  nível **até o máximo da sua linha** na matriz da skill (fonte única da matriz). Modelo forte pega
  nível mais leve **só se** não houver subtarefa livre do seu nível.
- **`PESADO` é só do Claude Code com Opus 5.5 ou superior, ou Fable.**
- **Equipe do Claude Code** (skill `liderar-equipe`): **uma subtarefa por vez, na mesma pasta**
  (decisão do usuário, 2026-10-13); cada executor conta como frente com nome próprio; só o líder
  mexe no Git e no quadro — exceto o agente `classificador-tarefas`, que só acrescenta a linha
  `- **Nível:**` nas seções das etapas (o líder commita).

## Tarefas de banco de dados: qualquer IA pode pegar

- **Não existe reserva por IA:** desde **2026-10-13**, a pedido do usuário, caiu a regra que dava as
  tarefas de banco só ao Claude Code local. Qualquer frente pega qualquer subtarefa de banco.
- É "de banco": criar ou alterar SQL, schema, trigger, função, RLS ou migração (`database/*.sql`);
  consultas; suítes do banco (`database/tests/`); `npm run test:integration`; aplicar scripts no
  Supabase; validar telas contra um banco real.
- **O que muda é o acesso, não a permissão:** a sessão que não conseguir falar com o banco (MCP do
  Supabase, Supabase local em Docker, `psql`, `docker exec`) entrega o que der, registra na seção da
  subtarefa o que não conseguiu conferir e deixa o resto para quem tiver — ou pede ajuda ao usuário.
- ⚠️ **Produção continua protegida:** aplicar SQL, criar usuário ou gravar dados no Supabase da
  **nuvem** exige **autorização explícita do usuário**, qualquer que seja a IA.
- Dá para dividir: quando a subtarefa tiver uma parte sem banco (frontend, documentação), separar em
  subtarefas menores deixa as duas partes mais fáceis de pegar.

## Trava especial

- Linha com `🔒 Trava especial (só o usuário libera)` em "Em uso por": nenhuma IA pega a tarefa nem
  as subtarefas, qualquer que seja a prioridade. Só o usuário cria ou remove.

## Hooks do Claude Code que exigem a tarefa (SUB-59)

- `exigir-reserva.mjs` (antes de `Edit`/`Write`): barra a edição de arquivo do projeto fora de
  `tasks/` quando não há no `STATUS.md` subtarefa `🔄 Em execução` de **Claude Code**. Abrir e
  reservar a tarefa (`tasks/ciclo-da-task.md`) libera; `tasks/` fica sempre livre para isso.
- `lembrar-task.mjs` (a cada pedido): lembrete curto da regra no contexto.
- **Não pegam:** outras IAs (o hook é só do Claude Code), edição por comando no terminal
  (`sed -i`, `>`) e qual sessão Claude Code reservou. A regra continua valendo para todos.
- Erro do hook libera a edição. `DASHBOARD_AI_SEM_TRAVA=1` desliga a trava, só com pedido do
  usuário (registrar na seção da subtarefa).

## Marcadores do quadro antigo

- `STATUS-TAREFA-CONFIRMADO-CONCLUIDO` e `VERIFICADOR-CLAUDE` existem nos blocos migrados e no
  histórico. Em subtarefas novas, a conferência fica no campo **Verificação** da seção.
  `VERIFICADOR-CLAUDE` não é mais preenchido (a verificação geral foi excluída em 2026-10-13).

## Reporte de progresso (opcional)

Ver `reporte-progresso.md`. O reporte **não** substitui a reserva no `STATUS.md`.
