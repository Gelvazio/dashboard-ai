# 📂 tasks/fila/ — Espelho local da fila de tasks

Cada arquivo `<CODIGO>.md` representa uma linha de `public.tasks` de **um projeto** no
Supabase e é sincronizado por [`scripts/sincronizar_tasks.py`](../../scripts/sincronizar_tasks.py).

```bash
python3 scripts/sincronizar_tasks.py --projeto meu-app consulta   # escolhe o projeto (padrão: default)
python3 scripts/sincronizar_tasks.py consulta              # lista a fila do banco
python3 scripts/sincronizar_tasks.py exportar              # banco -> tasks/fila/*.md
python3 scripts/sincronizar_tasks.py importar --dry-run    # mostra o que mudaria no banco
python3 scripts/sincronizar_tasks.py importar              # tasks/fila/*.md -> banco (upsert por código)
python3 scripts/sincronizar_tasks.py conferir              # aponta divergências (exit 1 se houver)
```

Requer `SUPABASE_URL` (ou `VITE_SUPABASE_URL`) e `SUPABASE_SERVICE_ROLE_KEY` no ambiente ou no
`.env` da raiz (a chave anon é bloqueada pelo RLS). O projeto vem de `--projeto <slug>` ou
`DASHBOARD_AI_PROJECT` (padrão `default`); os códigos são únicos por projeto e o `importar`
recusa arquivos marcados com outro `projeto:`. Python 3.8+, sem dependências externas.

## Formato

```markdown
---
codigo: TASK-0001          # omita para criar uma task nova (o banco gera o código e o arquivo é renomeado)
projeto: default           # informativo (escrito pelo exportar)
titulo: Criar tela de login
tipo: ia                   # ia (agente) | humano (aprovação/teste feito por pessoa)
prioridade: 2              # 1 (alta) a 5 (baixa)
ordem: 0
dependencias: [TASK-0000]
executar: true             # ON/OFF
executar_apos:             # opcional, ISO 8601
max_tentativas: 3
---
Instrução completa em Markdown para a IA.
```

- Campos editáveis (enviados no `importar`): `titulo`, instrução (corpo), `tipo`, `prioridade`, `ordem`,
  `dependencias`, `executar`, `executar_apos`, `max_tentativas`.
- Campos informativos escritos pelo `exportar` (`status`, `tentativas`, `trava_frente`, `pr_url`,
  `commit_sha`, `updated_at` e o bloco `RESULTADO`) não são enviados de volta — exceto `status`
  com `importar --com-status`.
