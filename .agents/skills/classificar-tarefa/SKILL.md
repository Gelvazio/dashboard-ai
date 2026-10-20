---
name: classificar-tarefa
description: Classifica uma subtarefa do quadro (tasks/STATUS.md + etapa) no nível LEVE (fácil), MEDIO (média) ou PESADO (difícil) pelo Jev ou pelos sinais desta skill, e diz qual ferramenta e modelo de IA pode pegá-la (matriz ferramenta × modelo × nível). Use ao criar ou dividir subtarefa, quando perguntarem "qual o nível desta tarefa?", "quem pode pegar?", "esta tarefa é para mim?" ou "/classificar-tarefa".
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
3. **Pergunte ao Jev** (abaixo). Se a confiança (`confianca`) ficar **abaixo de 0,60**, ou o Jev
   estiver fora, decida pelos sinais da tabela — e, se você não for Claude Code com Opus 5.5+ ou
   Fable nem DeepSeek (`PESADO`, C35), aplique o passo 2.
4. Se o Jev e os sinais discordarem, **vale o nível mais alto** dos dois.

### Pergunta ao Jev

Antes de decidir só pelos sinais, tente o **Jev** (C39, C42, C43; regra em
`C:/fontes/rules-ai/regras/jev.md`). Somente leitura: não grava no quadro e não reserva.

```bash
node C:/fontes/rules-ai/scripts/jev.mjs classificar --id <ID> --quadro tasks/STATUS.md --json
```

- A chave `TYPESAFE_API_KEY` fica **só** no `rules-ai` (ambiente ou `.env` da raiz dele). ⛔ Nunca
  copiar a chave para este projeto.
- Leia `nivel_final_proposto`, `confianca` e `acao` da saída.
- `confianca` **abaixo de 0,60** (ou `acao: humano`) → decida pelos sinais e peça a conferência
  do usuário.
- Se o Jev e os sinais discordarem, **vale o nível mais alto** dos dois. O Jev nunca rebaixa nível.
- Falhou (código 1 sem chave, 2 com `JEV_MODO=off`, 5 Jev indisponível) → **só os sinais** desta
  skill; na dúvida, sobe o nível. Nunca há outro servidor de reserva.
- Mensagem do usuário: o gancho do Jev (C43) já põe a sugestão de nível e modelo no contexto da
  IA; para **subtarefa do quadro**, a sugestão continua sendo só conselho.

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
- **Nível:** MEDIO — código com lógica em 1 arquivo de `worker/`, sem chave (Jev 0,91)
```

A justificativa é curta: o sinal que decidiu e, se usou o Jev, a confiança. Gravar o nível segue o
ciclo normal (commit com o quadro; `docs(board): …` se for só classificar).

## Proibido

- ⛔ Mudar a **prioridade** (é do usuário).
- ⛔ Reclassificar subtarefa **reservada por outra frente** ou sob **🔒 trava especial**.
- ⛔ Baixar o nível para caber na sua ferramenta: se não cabe, deixe para quem pode.
