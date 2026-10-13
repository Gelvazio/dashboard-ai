# 🤝 Várias IAs neste projeto (Dashboard AI)

Regras **deste projeto** que completam `tasks/frentes-e-reserva.md` (genérico).

## Tamanho das subtarefas

- Cada subtarefa cabe em cerca de **3 minutos** de trabalho de uma IA: 1 função, 1 método,
  1 componente, 1 classe, 1 arquivo ou 1 seção de documentação.
- Percebeu que é maior → **dividir** antes de codificar (novas linhas no `STATUS.md`), em vez de
  entregar pela metade.

## Tarefas de banco de dados: só o Claude Code local

- Só o **Claude Code rodando localmente** (máquina do usuário, com o **MCP do Supabase**) pega
  subtarefa de banco.
- É "de banco": criar ou alterar SQL, schema, trigger, função, RLS ou migração (`database/*.sql`);
  consultas; suítes do banco (`database/tests/`); `npm run test:integration`; aplicar scripts no
  Supabase; validar telas contra um banco real.
- ⛔ Claude Code em **sessão na nuvem** não pega, mesmo tendo o MCP do Supabase. ⛔ As outras IAs
  (Gemini, Grok, Copilot, Devin, DeepSeek, Antigravity…) também não.
- Subtarefa com parte sem banco (frontend, documentação) → dividir: a parte sem banco fica livre
  para qualquer IA.
- Isso não libera nada: aplicar SQL, criar usuário ou gravar dados em produção continua exigindo
  **autorização explícita do usuário**.

## Trava especial

- Linha com `🔒 Trava especial (só o usuário libera)` em "Em uso por": nenhuma IA pega a tarefa nem
  as subtarefas, qualquer que seja a prioridade. Só o usuário cria ou remove.

## Marcadores do quadro antigo

- `STATUS-TAREFA-CONFIRMADO-CONCLUIDO` e `VERIFICADOR-CLAUDE` existem nos blocos migrados e no
  histórico. Em subtarefas novas, a conferência fica no campo **Verificação** da seção.
  `VERIFICADOR-CLAUDE` não é mais preenchido (a verificação geral foi excluída em 2026-10-13).

## Reporte de progresso (opcional)

Ver `reporte-progresso.md`. O reporte **não** substitui a reserva no `STATUS.md`.
