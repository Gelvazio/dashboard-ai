# ⚡ Essentials — Checklist de início de sessão

**Abra SEMPRE ao iniciar.** Índice completo das regras: `INDEX.md`.

## 1. Sincronizar

Trazer a `main` antes de ler qualquer coisa: `git fetch --all --prune` + `git pull --rebase origin
main` (comandos, hooks e proibições: `git-quick.md`).

## 2. Ler, nesta ordem

| Arquivo | Para quê |
|---------|----------|
| `AGENTS.md` | Porta de entrada: lista das regras (precedência máxima) |
| `tasks/STATUS.md` | Quadro: frentes, tarefas, subtarefas e reservas (`tasks/quadro.md`) |
| Etapa da sua subtarefa | Próximo passo — retomar de onde parou (`tasks/ciclo-da-task.md`) |
| `tasks/RECADOS.md` | Recados de outras frentes para você ou `todas` |
| `docs/` | Documentação do que vai editar (ex.: `docs/langgraph-contrato.md`, `docs/VALIDACAO.md`) |

## 3. Checklist

```
☐ Hooks instalados neste clone (git config --get core.hooksPath = .githooks)?
☐ Trouxe a main (fetch + pull --rebase)?
☐ Li o STATUS.md, a etapa da minha subtarefa e os recados?
☐ A subtarefa está livre, com dependências ✅ e sem trava especial?
☐ Se for tarefa de banco, eu tenho como falar com o banco nesta sessão (multiplas-ias.md)?
☐ Sei se a tarefa é pequena ou grande (tasks/ciclo-da-task.md)?
```

---

**Data e hora:** sempre de Brasília. No Windows local, `date` ou `Get-Date` (o relógio já está em
Brasília) — `TZ=America/Sao_Paulo date` no Git Bash sai em UTC (3 h a mais). Na nuvem:
`TZ=America/Sao_Paulo date`.
