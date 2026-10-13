---
name: proxima-task
description: Mostra o que fazer agora no quadro do projeto (tasks/STATUS.md) - frentes ativas (coluna "Em uso por") e o próximo passo de cada uma, as subtarefas livres para pegar por prioridade e o que está aguardando o usuário. Use quando perguntarem "qual a próxima tarefa?", "o que tem pendente?", "o que posso pegar?" ou "/proxima-task".
---

# Próxima tarefa (proxima-task)

Fonte das regras: `AGENTS.md` → `.claude/rules/tasks/` (quadro, reserva, ciclo). Esta skill só **lê**
o quadro; para pegar uma subtarefa, siga `.claude/rules/tasks/frentes-e-reserva.md`.

> Fonte única desta skill: `.agents/skills/proxima-task/SKILL.md`. A cópia em
> `.claude/skills/proxima-task/` existe só porque o Claude Code lê skills de lá — **não editar a cópia**.

## Processo

1. **Sincronizar:** `git fetch --all --prune` e `git pull --rebase origin main` (sem isso o quadro mente).
2. **Ler** `tasks/STATUS.md` e `tasks/RECADOS.md` (recados para você ou `todas`, principalmente
   avisos de quadro congelado).
3. **Frentes ativas** (não há tabela de frentes): cada nome que aparece na coluna "Em uso por"
   da tabela "📌 Tarefas", tirando o `(desde …)`, `—` e `🔒 Trava especial`. Para cada uma, abrir a
   etapa da subtarefa reservada e ler o `**Próximo passo:**` da seção dela. Marcar com ⭐ a frente
   atual (mesma IA/ambiente/branch desta sessão, se der para saber).
4. **Subtarefas livres agora** (tabela "📌 Tarefas"), na ordem 🔴 → 🟠 → 🟡 → 🟢 e, no empate, a
   ordem do quadro. Uma linha é livre quando:
   - não está em **negrito** (negrito = tarefa-mãe, não se reserva);
   - "Em uso por" = `—` (não reservada e sem `🔒 Trava especial`);
   - Status `⬜ Pendente`;
   - todas as dependências estão `✅` (procurar cada código na tabela; código que não aparece está
     concluído no histórico).
   🟢 Baixa só entra se o usuário tiver orientado. Marcar **(banco)** nas subtarefas de banco de
   dados: só o Claude Code local pode pegá-las (`.claude/rules/multiplas-ias.md`).
5. **Aguardando o usuário:** linhas `👀` e itens `👀` das etapas (aprovações, aceites).
6. **Mostrar** no formato abaixo. Não reservar nada sem o usuário pedir.

## Formato de saída

```
## 📌 Próximas tarefas

⭐ Frente atual: Claude Code (Opus 5.5) (local · main)
   Subtarefa: SUB-41.1 (ETAPA-005) · 🔄 Em execução
   ➡️ Próximo: mover a seção 1 do plano para docs/...

🟢 Livres agora (por prioridade)
   🔴 SUB-38.1 — Verificação geral (ETAPA-002)
   🟡 SUB-48.1 — Estrutura projects/ (ETAPA-010)
   🟡 SUB-45.19 — Revisar SQL da SUB-45.1 (ETAPA-007) (banco)

👀 Aguardando você
   SUB-47.x — aprovação do plano (ETAPA-009)
```

## Se algo faltar

- **Sem `tasks/STATUS.md`:** avisar que o quadro não foi encontrado.
- **Nenhuma frente ativa:** dizer isso e mostrar só as livres e as `👀`.
- **Nenhuma livre:** dizer o que está bloqueando (dependências, reservas ou trava especial).
