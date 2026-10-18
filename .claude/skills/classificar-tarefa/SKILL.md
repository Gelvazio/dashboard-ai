---
name: classificar-tarefa
description: Classifica uma subtarefa do quadro (tasks/STATUS.md + etapa) no nível LEVE (fácil), MEDIO (média) ou PESADO (difícil) pelo Laya Server ou pelos sinais desta skill, e diz qual ferramenta e modelo de IA pode pegá-la (matriz ferramenta × modelo × nível). Use ao criar ou dividir subtarefa, quando perguntarem "qual o nível desta tarefa?", "quem pode pegar?", "esta tarefa é para mim?" ou "/classificar-tarefa".
---

# Classificar tarefa (classificar-tarefa)

Fonte das regras do quadro: `AGENTS.md` → `.claude/rules/tasks/`. Esta skill só **define o nível** e
**quem pode pegar**; reservar continua sendo pela `frentes-e-reserva.md`.

> Fonte única desta skill: `.agents/skills/classificar-tarefa/SKILL.md`. As cópias em `.claude/`,
> `.grok/` e `.gemini/commands/` são geradas no commit — **não editar as cópias**.

## Níveis

| Nível | Em palavras simples | Sinais concretos |
|---|---|---|
| `PESADO` | tarefa difícil | `database/`, SQL, RLS, login/papéis/permissões, **chaves ou segredos**, migração, segurança, arquitetura, mais de 3 arquivos ligados, mudança em massa, apagar dados |
| `MEDIO` | tarefa média | código com lógica em `src/`, `api/`, `worker/`, `scripts/` ou workflows, de 1 a 3 arquivos |
| `LEVE` | tarefa fácil | só `.md`, mover linhas do quadro, textos, formatação, configuração simples sem lógica |

## Ordem de decisão

1. **A regra mais restritiva vence:** basta um sinal de `PESADO`
   ("1 arquivo, mas é SQL" = `PESADO`).
2. **Na dúvida, sobe o nível** (`LEVE` → `MEDIO` → `PESADO`).
3. **Pergunte ao Laya** (abaixo) quando ele estiver no ar. Se a confiança (`answer_confidence`)
   ficar **abaixo de 0,7**, ou o Laya estiver fora, decida pelos sinais da tabela — e, se você
não for Claude Code com Opus 5.5+ ou Fable nem DeepSeek (`PESADO`, C35), aplique o passo 2.
4. Se o Laya e os sinais discordarem, **vale o nível mais alto** dos dois.

### Pergunta ao Laya Server

Servidor: `docker-compose.laya.yml` (`docs/laya-server.md`). Monte o `state` com o título, a
descrição e os arquivos da subtarefa:

```bash
AUTENTICACAO=(); [ -n "$LAYA_API_KEY" ] && AUTENTICACAO=(-H "Authorization: Bearer $LAYA_API_KEY")
curl -s "${LAYA_SERVER_URL:-http://localhost:8000}/v1/systemone" \
  -H 'content-type: application/json' \
  "${AUTENTICACAO[@]}" --data '{
  "state": {"titulo": "<título>", "descricao": "<descrição>", "arquivos": ["<caminho>"]},
  "questions": {"nivel": {"type": "choice", "instructions": "Qual o nível de esforço e risco?",
    "criteria": {
      "LEVE": "só documentação, textos, formatação ou configuração simples sem lógica",
      "MEDIO": "código com lógica em 1 a 3 arquivos, sem banco, segurança nem chaves",
      "PESADO": "banco, SQL, segurança, login, chaves, migração, arquitetura, 4+ arquivos"}}}}'
```

Leia `answers.nivel.choice` e `answers.nivel.answer_confidence`. No código do worker, o mesmo vem
pronto em `classificar()` de `worker/classificador.ts` (Laya + Opus como revisor).

## Matriz ferramenta × modelo × nível

Confirmada pelo usuário em 2026-10-13 (SUB-47.2); atualizada em 2026-10-18 (**C35**: DeepSeek em
`PESADO`; **C37**: OpenCode com os modelos DeepSeek). `⛔` = não pega.

| Ferramenta | `LEVE` | `MEDIO` | `PESADO` |
|---|---|---|---|
| **Claude Code** (local ou nuvem) | Haiku | Sonnet | **Opus 5.5 ou superior, ou Fable** |
| **Gemini CLI** | modelo Flash | modelo Pro | ⛔ |
| **Antigravity** (Starter Quota) | Gemini Flash | ⛔ | ⛔ |
| **Grok** (SuperGrok) | modelo rápido | Grok 4.7 | ⛔ |
| **DeepSeek** | DeepSeek V4.1 Flash | modelo de raciocínio | ✅ |
| **OpenCode** | DeepSeek V4.1 Flash (`deepseek-flash`) | DeepSeek V4.1 Flash com thinking (`deepseek-flash`) | **DeepSeek V4 Pro (`deepseek-v4-pro`)** |
| **Codex** (Free) | ✅ | ✅ | ⛔ |
| **Cursor** (free) | ✅ | ✅ | ⛔ |
| **Qoder** | ✅ | ✅ | ⛔ |
| **Devin** (Free) | ✅ | ⛔ | ⛔ |
| **Grok Bot** | ✅ | ⛔ | ⛔ |

- **`PESADO` é só do Claude Code com Opus 5.5 ou superior, Fable, ou DeepSeek** (C35) — no OpenCode,
  com `deepseek-v4-pro` (C37). Nenhuma outra ferramenta pega.
- Cada agente se identifica como **ferramenta + modelo** (o nome da frente) e só pega subtarefa com
  nível **igual ou abaixo** do máximo da sua linha.
- Modelo forte pega subtarefa mais leve **só se** não houver nenhuma livre do seu nível (a fila não
  para, mas o trabalho difícil não espera).
- Tarefa de banco no Claude Code na nuvem: depende de a sessão ter acesso ao banco
  (`.claude/rules/multiplas-ias.md`).

## Exemplos reais do quadro

| Subtarefa | Nível | Por quê |
|---|---|---|
| SUB-45.4 — script `08_projects_campos.sql` | `PESADO` | SQL em `database/` |
| SUB-49.5 — criptografar o backup no workflow | `PESADO` | segurança e segredo (`SUPABASE_BACKUP_PASSPHRASE`) |
| SUB-47.14 — fallback com Opus (`worker/opus.ts`) | `PESADO` | lida com a `ANTHROPIC_API_KEY` |
| SUB-45.15 — tela `src/views/ProjetosView.tsx` | `MEDIO` | 1 componente com lógica, sem banco direto |
| SUB-47.15 — modo híbrido (`worker/classificador.ts`) | `MEDIO` | lógica em 1 arquivo; a chave fica no `opus.ts` |
| SUB-49.2 — documentar o backup | `LEVE` | só `.md` |
| SUB-58.3 — `CLAUDE.local.md` no `.gitignore` | `LEVE` | configuração simples sem lógica |

## Formato de saída

Na **seção da subtarefa** dentro da etapa (`tasks/etapas/…`), como primeiro item da lista (a
prioridade fica na linha do `STATUS.md`):

```markdown
- **Nível:** MEDIO — código com lógica em 1 arquivo de `worker/`, sem chave (Laya 0,82)
```

A justificativa é curta: o sinal que decidiu e, se usou o Laya, a confiança. Gravar o nível segue o
ciclo normal (commit com o quadro; `docs(board): …` se for só classificar).

## Proibido

- ⛔ Mudar a **prioridade** (é do usuário).
- ⛔ Reclassificar subtarefa **reservada por outra frente** ou sob **🔒 trava especial**.
- ⛔ Baixar o nível para caber na sua ferramenta: se não cabe, deixe para quem pode.
