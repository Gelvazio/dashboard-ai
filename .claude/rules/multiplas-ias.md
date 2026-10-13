# 🤝 Várias IAs neste projeto (Dashboard AI)

Regras **deste projeto** que completam `tasks/frentes-e-reserva.md` (genérico).

## Tamanho das subtarefas

- Cada subtarefa cabe em cerca de **3 minutos** de trabalho de uma IA: 1 função, 1 método,
  1 componente, 1 classe, 1 arquivo ou 1 seção de documentação.
- Percebeu que é maior → **dividir** antes de codificar (novas linhas no `STATUS.md`), em vez de
  entregar pela metade.

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

## Marcadores do quadro antigo

- `STATUS-TAREFA-CONFIRMADO-CONCLUIDO` e `VERIFICADOR-CLAUDE` existem nos blocos migrados e no
  histórico. Em subtarefas novas, a conferência fica no campo **Verificação** da seção.
  `VERIFICADOR-CLAUDE` não é mais preenchido (a verificação geral foi excluída em 2026-10-13).

## Reporte de progresso (opcional)

Ver `reporte-progresso.md`. O reporte **não** substitui a reserva no `STATUS.md`.
