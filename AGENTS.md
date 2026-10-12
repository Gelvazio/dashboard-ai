# 🤖 DIRETRIZES DE AGENTES DE IA & PROTOCOLO DE CONCORRÊNCIA

> 📌 **Quadro único:** o antigo `quadro-task-principal.md` foi incorporado ao `task-principal.md`. Travas, status e tarefas ativas ficam só no `task-principal.md`; não recrie o arquivo antigo.

> 🔄 **Sincronizar SEMPRE com `fetch` antes do `pull`:** rode `git fetch --all --prune` **antes** de qualquer `git pull --rebase origin main`. Sem o `fetch`, a referência `origin/main` é **local e envelhece**: um `git status` mostrando `## main...origin/main` (sem `ahead`/`behind`) **não** prova que você está atualizado. Já houve agente lendo o quadro "sincronizado" com o remoto vários commits à frente. **Com os hooks da seção 1.3 instalados, o Git passa a barrar o push atrasado sozinho** — instale uma vez por clone.

> 📦 **Concluídas em arquivo separado:** os blocos `[x]` (tarefas e subtarefas `concluido`) ficam em [`task_complete.md`](task_complete.md). Para pegar tarefas, leia só o `task-principal.md`: a lista `Subtarefas:` das tarefas-mãe abertas já traz `(concluido, <sha>)`, e **dependência que não aparece como bloco no `task-principal.md` está `concluido` no `task_complete.md`**. Abra o `task_complete.md` só para consultar uma entrega ou reabrir uma tarefa (o bloco volta para o `task-principal.md` como `pendente`, com o motivo na anotação).
>
> 🗂️ **Scripts temporários:** cada agente guarda scripts auxiliares dentro da própria pasta de trabalho, nunca em `/tmp` ou outra pasta compartilhada (outro agente pode sobrescrevê-los).
>
> 🧭 **Skill do fluxo:** para pegar, executar, concluir ou liberar tarefas listadas no `task-principal.md`, use a skill [`proxima-task`](.agents/skills/proxima-task/SKILL.md) (no Devin: `@skills:proxima-task`). Ela resume o protocolo deste arquivo passo a passo; em caso de divergência, vale este `AGENTS.md`.

> **AVISO A TODOS OS AGENTES DE IA (Claude, Gemini, Grok, Copilot, Antigravity, etc.):**
> Este repositório opera com fluxo autônomo baseado em fila atômica de tarefas e trava contra conflitos de edição.
> Siga rigorosamente as regras abaixo **ANTES** de executar qualquer código.

---

## 🔒 1. PROTOCOLO OBRIGATÓRIO DE CAPTURA DE TAREFA (LOCK EM 3 PARTES) E CONCORRÊNCIA

Todo e qualquer agente de IA (Claude, Gemini, Grok, Copilot, Antigravity, etc.) que chegar à fila de tarefas **DEVE SEGUIR RIGOROSAMENTE O FLUXO EM 3 PARTES ANTES DE MEXER NO CÓDIGO DA TAREFA**:

**CHECKLIST OBRIGATÓRIO ANTES DE ASSUMIR QUALQUER TAREFA:**
☐ [ ] Instalei os hooks de sincronização (`git config core.hooksPath .githooks`, seção 1.3)?
☐ [ ] Fiz `git fetch --all --prune` para atualizar a referência `origin/main`?
☐ [ ] Fiz `git pull --rebase origin main` **PRIMEIRO** (depois do fetch)?
☐ [ ] Li o arquivo ATUALIZADO (task-principal.md)?
☐ [ ] Verifiquei que a trava está LIVRE ou que minha task não conflita?
☐ [ ] Confirmei que todas as dependências estão `concluido`?
☐ [ ] Escolhi o item livre de **maior prioridade** (`MAXIMA` → `ALTA` → `MEDIA` → `BAIXA`, seção 1.2)?
☐ [ ] Não tenho nenhum outro item travado (máximo 1 subtarefa ou 1 tarefa atômica por agente)?
☐ [ ] O item é uma subtarefa ou tarefa atômica (não uma tarefa-mãe com subtarefas)?
☐ [ ] Vou fazer commit + push do lock IMEDIATAMENTE antes de codificar?

⛔ **Se NÃO marcou todos os ☐ acima, NÃO assuma a tarefa.**

---

### 🔹 PARTE 1 — LER O QUADRO E IDENTIFICAR A TAREFA PENDENTE

⚠️ **ORDEM OBRIGATÓRIA DE EXECUÇÃO (NÃO PULAR PASSOS):**

✅ **PASSO 1 (CRÍTICO — PRIMEIRO):** Executar `git fetch --all --prune` e, **só depois**, `git pull --rebase origin main`, para garantir o estado mais recente do repositório.
   - ⛔ **NUNCA** confie em `git status` / `git log` antes do `fetch`: eles comparam com a referência **local** `origin/main`, que envelhece. Um `## main...origin/main` sem `ahead`/`behind` **não** significa "estou atualizado".
   - ⛔ **NÃO** ler nenhum arquivo local antes destes comandos
   - ⛔ **NÃO** assumir nenhuma tarefa sem garantir que está no estado mais recente
   - Se o `fetch` indicar que `origin/main` andou, **releia o quadro** mesmo quando o pull for fast-forward
   - Os hooks da seção 1.3 automatizam o `fetch` no push e na troca de branch, mas **não substituem** este PASSO 1
   - Se houver conflito no rebase, resolver antes de prosseguir

✅ **PASSO 2 (SÓ DEPOIS DO GIT PULL):** Ler obrigatoriamente o arquivo ATUALIZADO:
   - 📄 [`task-principal.md`](task-principal.md)

✅ **PASSO 3:** Conferir a seção **"🔒 TRAVA ATIVA NO MOMENTO"** em `task-principal.md`:
   - ⛔ **PROIBIÇÃO TOTAL DE CONFLITO:** Se já existir uma task com trava ativa (tabela principal ou bloco `### 🔒 TRAVA ADICIONAL`) ou status `em_execucao` associada a outro agente, **NENHUMA OUTRA IA PODE ASSUMIR AQUELA MESMA TAREFA**.

✅ **PASSO 4:** Localizar a próxima sub-task com status `pendente`, **pela prioridade** (seção 1.2):
   - Verificar se todas as dependências da sub-task estão com status `concluido`
   - Entre os itens livres, pegar o de **maior prioridade** (`MAXIMA` → `ALTA` → `MEDIA` → `BAIXA`); na mesma prioridade, o primeiro na ordem do quadro
   - ⛔ **NÃO** assumir uma tarefa cujas dependências não estejam 100% concluídas

---

### ⚠️ ERROS COMUNS A EVITAR (CAUSAM CONFLITOS)

❌ **CONFIAR NO `git status` SEM `git fetch`:** a referência `origin/main` é local e envelhece; sem o fetch você pode jurar que está sincronizado com um remoto vários commits à frente.
❌ **LER ARQUIVOS LOCAIS ANTES DE GIT PULL:** Os arquivos podem estar desatualizados. Sempre fazer `git fetch --all` e `git pull` primeiro.
❌ **ASSUMIR TAREFA SEM VERIFICAR TRAVAS:** Pode resultar em múltiplos agentes trabalhando na mesma tarefa.
❌ **IGNORAR DEPENDÊNCIAS:** Uma tarefa só pode ser assumida se todas as suas dependências estiverem `concluido`.
❌ **NÃO FAZER COMMIT/PUSH DO LOCK:** O lock não é válido até ser commitado e pushed para o remoto.

---

### 🔹 PARTE 2 — GRAVAR O BLOQUEIO NO QUADRO, FAZER COMMIT E PUSH IMEDIATOS
1. Gravar a tarefa como bloqueada no quadro para que nenhuma outra IA a pegue:
   - Em `task-principal.md`: mudar o status da sub-task para `em_execucao` e registrar o executor.
2. **Executar COMMIT e PUSH do bloqueio IMEDIATAMENTE (antes de criar código da tarefa):**
   ```bash
   git add task-principal.md
   git commit -m "lock: assumindo sub-task SUB-XX por [Nome do Agente]"
   git push origin main
   ```
   *Dessa forma, a main remota no GitHub é atualizada na hora, impedindo colisões de outros agentes.*

---

### 🔹 PARTE 3 — EXECUÇÃO, FINALIZAÇÃO, COMMIT E PUSH DA ENTREGA
1. Executar e validar o código da mini-task com qualidade.
2. Atualizar `task-principal.md`: alterar status para `concluido` e registrar a anotação técnica detalhada; em seguida **mover o bloco concluído** (inteiro, com commit, anotação e confirmação) para o fim da fase correspondente em `task_complete.md`. Na lista `Subtarefas:` da tarefa-mãe fica só a referência `(concluido, <sha>)`. Se a tarefa-mãe for fechada, o bloco dela também vai para o `task_complete.md`.
3. **Executar COMMIT e PUSH da conclusão IMEDIATAMENTE:**
   ```bash
   git add <arquivos da tarefa> task-principal.md task_complete.md
   git commit -m "feat(SUB-XX): descrição do que foi implementado"
   git push origin main
   ```

---

## ⚖️ 1.1 REGRAS COMPLEMENTARES DE CONCORRÊNCIA (OBRIGATÓRIAS)

1. **Uma tarefa por agente, no máximo:**
   - Cada agente pode ter **no máximo 1 item travado** por vez: **1 subtarefa** (ex: `SUB-19.3`) **ou 1 tarefa atômica** (tarefa sem subtarefas, `Subtarefas: Nenhuma (atômica)`).
   - ⛔ É proibido travar uma tarefa-mãe que tenha subtarefas (status `pendente (aguardando subtarefas)`). Ela só é concluída quando todas as filhas estiverem `concluido`.
   - Só depois de concluir e fazer push da entrega (ou liberar a trava) o agente pode pegar o próximo item.
   - Exceção: o planejamento/subdivisão de tarefas pedido pelo usuário, que trava as tarefas-mãe apenas durante a edição do quadro e as libera no mesmo ciclo, sem escrever código.

2. **Push da trava recusado (corrida entre agentes):**
   - Se o `git push` do lock for recusado, executar `git fetch --all --prune`, depois `git pull --rebase origin main` e **reler o quadro**.
   - Se outro agente travou o mesmo item, **desfazer o seu lock local** e escolher outro item livre. Nunca sobrescrever a trava de outro agente.
   - ⛔ Nunca usar `git push --force`.

3. **Tarefas travadas para todas as IAs:**
   - ⛔ **KIRO-DEV-CLONE**: esta tarefa está **TRAVADA PARA TODAS AS IAS** — nenhuma IA pode assumi-la (nem subtarefas que venham a ser criadas nela) sem autorização explícita do usuário.
   - Para liberar a trava, o usuário deve editar o `task-principal.md` e remover a trava manualmente.
   - Esta trava tem precedência sobre o protocolo normal de captura de tarefas e sobre a prioridade (seção 1.2).

4. **Travas em paralelo:**
   - Vários agentes podem trabalhar ao mesmo tempo, **cada um em um item diferente**.
   - Cada agente registra sua trava em um bloco próprio `### 🔒 TRAVA ADICIONAL — <Nome da IA> — <SUB-XX>` em `task-principal.md`, e nunca edita o bloco de outro agente.
   - A proibição vale para o **mesmo item**: ninguém assume um item que já tem trava de outro agente.

5. **Travas só são liberadas pelo usuário:**
   - Não existe tarefa "abandonada": uma tarefa travada é uma tarefa que ainda não terminou.
   - ⛔ Nenhum agente pode liberar, assumir ou alterar a trava de outro agente por conta própria, independentemente do tempo sem commits.
   - Se uma trava estiver causando problemas, quem decide e libera manualmente é o **usuário**.

6. **Estados das subtarefas no quadro:**
   - 🟢 **livre:** `pendente`, sem trava e com todas as dependências `concluido`; qualquer agente pode pegar.
   - ⛓️ **bloqueada:** `pendente`, mas com alguma dependência ainda não concluída; ninguém pode pegar.
   - 🔒 **reservada:** pertence a uma tarefa-mãe travada por um agente; só esse agente pode pegar.
   - 🔄 **em execução:** travada por um agente.

7. **Tamanho máximo (~3 minutos):**
   - Cada subtarefa deve caber em cerca de **3 minutos** de trabalho de uma IA: 1 função, 1 método, 1 componente, 1 classe, 1 arquivo de teste ou 1 seção de documentação.
   - Se o agente perceber que o item é maior, deve **subdividi-lo** (seção 2) antes de codificar, em vez de entregar parcialmente.

8. **Commits limpos:**
   - Rodar `git fetch --all --prune` antes de qualquer `git pull --rebase origin main` — e repetir o fetch imediatamente antes de publicar, para conferir se o remoto andou durante o seu trabalho.
   - Usar sempre `git pull --rebase origin main` (nunca merge) e adicionar **só os arquivos da tarefa** + quadro (nunca `git add .`).
   - ⛔ **Não** usar `git pull --all` nem `git pull` sem `--rebase`: sem o `--rebase` o comando cria um **merge**, proibido por esta seção. Para "pegar tudo de todos os remotos", a forma correta é `git fetch --all` seguido de `git pull --rebase origin main`.
   - Este item é **verificado mecanicamente** pelo hook [`.githooks/pre-merge-commit`](.githooks/pre-merge-commit), que recusa o merge (ver seção 1.3).

---

## 🎯 1.2 PRIORIDADE DAS TAREFAS (OBRIGATÓRIA)

Todo bloco de tarefa ou subtarefa, no `task-principal.md` e no `task_complete.md`, tem o campo logo abaixo de `Status:`:

```markdown
- **Prioridade:** ALTA
```

| Valor | Uso |
|---|---|
| `MAXIMA` | Acima de todas. Reservada para o que o usuário define como mais urgente (ex.: `SUB-38`, verificação geral) |
| `ALTA` | Bloqueia outras tarefas ou quebra a validação (build, typecheck, testes) |
| `MEDIA` | Trabalho normal do quadro; valor padrão quando nada for dito |
| `BAIXA` | Pode esperar; só é pega com orientação do usuário (ver regra 2) |

**Regras:**

1. **Ordem de captura:** entre os itens 🟢 livres, o agente pega sempre o de **maior prioridade** (`MAXIMA` → `ALTA` → `MEDIA` → `BAIXA`). Na mesma prioridade, vale a ordem do quadro. ⛔ Não pegar um item de prioridade menor enquanto houver item livre de prioridade maior.
2. **Exceção — orientação do usuário:** o agente só pega item de prioridade menor (ex.: `BAIXA`) quando **já recebeu orientação explícita do usuário** para isso (ou para uma tarefa específica). Registrar essa orientação na anotação do bloco.
3. **Prioridade não fura dependência nem trava:** item com dependência não `concluido`, travado por outro agente ou com 🔴 trava especial continua indisponível, qualquer que seja a prioridade.
4. **Quem define:** a prioridade é definida pelo usuário. Ao criar ou subdividir uma tarefa, o agente usa a da tarefa-mãe (ou `MEDIA`, se não houver) e não muda a prioridade de itens existentes sem pedido do usuário.
5. **Tarefas concluídas** mantêm o campo só como histórico; ele não tem efeito na fila.

---

## 🪝 1.3 HOOKS DE SINCRONIZAÇÃO (VERSIONADOS — INSTALAR 1x POR CLONE)

Três hooks em [`.githooks/`](.githooks/) transformam as regras de sincronização de "boa intenção" em **impedimento mecânico**: o Git barra, em vez de depender de o agente lembrar.

| Hook | Quando roda | O que faz |
|---|---|---|
| [`.githooks/pre-push`](.githooks/pre-push) | a cada `git push` | Roda `git fetch --all --prune` e **RECUSA** o push (exit 1) quando o remoto tem commits que você não tem — o caso que seria rejeitado depois e que empurraria para o `--force` (proibido) |
| [`.githooks/post-checkout`](.githooks/post-checkout) | ao trocar de branch | Roda `git fetch --all --prune` e **avisa** (sem bloquear) quantos commits você está atrás do upstream. Não dispara durante rebase/merge/cherry-pick |
| [`.githooks/pre-merge-commit`](.githooks/pre-merge-commit) | quando `git merge`/`git pull` criaria um commit de merge | **RECUSA o commit de merge** (exit 1) — fecha o item 8 da seção 1.1 ("nunca merge"). Não afeta `pull --rebase`, fast-forward nem `merge --squash`. ⚠️ O Git deixa o merge **preparado** (`MERGE_HEAD`): a recuperação é `git merge --abort` |

### Instalação (obrigatória, uma vez por clone)

```bash
git config core.hooksPath .githooks   # ativa os três hooks
git config pull.rebase true           # faz o `git pull` simples já usar rebase
```

Nenhuma das duas vive no repositório: `core.hooksPath` e `pull.rebase` ficam no `.git/config`, que **não** é versionado — cada clone/pasta de trabalho precisa rodar os comandos uma vez. Confira com:

```bash
git config --get core.hooksPath     # deve imprimir: .githooks
git config --get pull.rebase        # deve imprimir: true
```

O `pull.rebase true` é a **prevenção**: sem ele, um `git pull` distraído tenta merge e só é barrado no fim pelo `pre-merge-commit` — que deixa o merge preparado e exige `git merge --abort` para desfazer.

### Detalhes que importam

- **⛔ Não usar `--force`:** o hook também bloqueia force-push, porque o commit do remoto deixa de ser ancestral do seu. Se o hook bloqueou, o caminho é `git fetch --all --prune` → `git pull --rebase origin main` → **reler o quadro** → publicar de novo.
- **Escape hatch:** `git push --no-verify` pula o `pre-push`; `git merge --no-verify <ref>` pula o `pre-merge-commit`. Só usar com motivo registrado na anotação do bloco da tarefa.
- **Se o merge foi bloqueado:** quase sempre é um `git pull` sem `--rebase`. O repositório **fica no meio do merge**, então rode nesta ordem: `git merge --abort` → `git fetch --all --prune` → `git pull --rebase origin main`. Fast-forward (`--ff-only`) e `--squash` **não** são afetados, porque não geram commit de merge.
- **Se o hook não rodar**, quase sempre é fim de linha: o [`.gitattributes`](.gitattributes) força `eol=lf` em `.githooks/*` porque, com CRLF, o shebang `#!/bin/sh` quebra no Git Bash. Verificação:
  ```bash
  git ls-files --eol .githooks    # esperado: i/lf  w/lf  attr/text eol=lf
  ```
- **Desativar:** `git config --unset core.hooksPath`.
- **Nada disso substitui o PASSO 1:** os hooks cobrem o *push*, a *troca de branch* e o *merge*, mas não o momento de **pegar tarefa**. O `git fetch --all --prune` + `git pull --rebase origin main` antes de ler o quadro continua obrigatório.

---

## 🧩 2. SUBDIVISÃO EM SUBTAREFAS E CONTROLE DE DEPENDÊNCIAS

1. **Subdivisão Contínua (Granularidade Máxima):**
   - Qualquer tarefa ou subtarefa pode ser subdividida em tarefas menores (ex: `SUB-01.1`, `SUB-01.2`, `SUB-01.3`) caso o agente identifique etapas independentes.
   - Isso permite que qualquer IA assuma uma fração clara e objetiva do trabalho sem perder contexto.

2. **Declaração Obrigatória de Dependências e Subtarefas:**
   - Toda tarefa em [`task-principal.md`](task-principal.md) deve conter obrigatoriamente:
     - **`Depende de:`** Código das tasks que precisam estar `concluido` antes de iniciar (ex: `SUB-01` ou `Nenhuma`).
     - **`Subtarefas:`** Lista de subtarefas filhas em que ela se divide (ou `Nenhuma (atômica)`).
     - **`Prioridade:`** `MAXIMA`, `ALTA`, `MEDIA` ou `BAIXA` (seção 1.2).
   - ⛔ **REGRA DE BLOQUEIO POR DEPENDÊNCIA:** Nenhuma IA pode assumir uma tarefa cujas dependências ainda não estejam 100% `concluido`.

---

## 🏷️ 3. IDENTIFICAÇÃO OBRIGATÓRIA DA IA EXECUTORA

Sempre que uma IA assumir uma sub-task, deve identificar explicitamente seu nome/modelo em todos os registros:
- **Exemplos de identificação:** `Claude Code`, `xAI (Grok)`, `Gemini (Antigravity)`, `Copilot / OpenAI`.
- **Onde registrar o nome da IA:**
  - 1. No campo `Executor:` em [`task-principal.md`](task-principal.md).
  - 2. No campo `Agente Responsável:` da Trava Ativa e na tabela em `task-principal.md`.
  - 3. Na mensagem de commit do lock: `git commit -m "lock: assumindo sub-task SUB-XX por [Nome da IA]"`.
  - 4. Na anotação do bloco e no commit da entrega final.

---

## 📡 4. REPORTE DE PROGRESSO (OPCIONAL)

Agentes conectados ao MCP do DashboardAI podem reportar o andamento ao **monitor em tempo real** (SUB-35) com a ferramenta `agent_event` ([`api/_lib/event-tools.ts`](api/_lib/event-tools.ts)), que grava em `agent_events`.

> ⚠️ **O reporte é complementar e NÃO substitui o protocolo de lock das seções 1 e 1.1.** A trava só vale quando está commitada e com push no `task-principal.md`; um evento `trava`, `inicio` ou `fim` no monitor não trava, não libera e não conclui nada. Se o MCP estiver indisponível, siga normalmente só com o quadro.

**Quando emitir (um evento por momento, sempre com `agente` igual ao nome usado no quadro e `task_codigo` da subtarefa):**

| Momento | `tipo` | Exemplo de `mensagem` |
|---|---|---|
| Logo após o push do lock | `inicio` | `Assumida SUB-35.45` |
| Etapas relevantes (implementação, testes, build) | `progresso` (com `etapa`) | `npm test verde (194 testes)` |
| Trabalho longo, a cada ~5 min sem outro evento | `heartbeat` | `Ainda em SUB-35.45` |
| Falha que impede a entrega | `erro` (com `status`) | `typecheck falhou em src/lib/x.ts` |
| Depois do push da entrega e da liberação da trava | `fim` | `Entregue em abc1234` |

**Exemplo (`tools/call`):**

```json
{ "jsonrpc": "2.0", "id": 1, "method": "tools/call",
  "params": { "name": "agent_event", "arguments": {
    "project": "default", "agente": "DashboardAI-Clone 08 (Grok Bot)", "tipo": "fim",
    "task_codigo": "SUB-35.45", "mensagem": "Entregue em abc1234",
    "chave_idempotencia": "fim:SUB-35.45:abc1234" } } }
```

**Regras:**
- Use `chave_idempotencia` em eventos que podem ser reenviados (ex.: `inicio:SUB-XX`, `fim:SUB-XX:<sha>`, `git:<sha>`): reenvios com a mesma chave são ignorados.
- Mensagens curtas (≤ 2.000 caracteres), sem segredos, tokens, chaves ou dados pessoais.
- Falha ao emitir um evento **não** bloqueia a subtarefa: registre no relatório e continue o protocolo do quadro.
- Agentes que só usam o quadro em Markdown não precisam emitir nada: o espelho `scripts/espelhar_quadro_eventos.py` (SUB-35.42/35.43) converte os commits `lock:`/`feat(...)`/`docs(board): concluir` em eventos.

---

## ✅ 5. REGRA DE CONFIRMAÇÃO DE STATUS DAS TAREFAS

Após qualquer verificação de conclusão de subtarefa (pelo usuário ou por um agente), **obrigatoriamente** adicione a seguinte linha no bloco da subtarefa (no `task-principal.md` ou, se já concluída, no `task_complete.md`):

```markdown
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** <valor>
```

### Valores permitidos

| Situação | Valor da linha | Exemplo |
|----------|----------------|---------|
| Tarefa **confirmada** como realmente concluída (código/documentação verificados) | Data e hora da confirmação + agente | `2026-10-12 08:43 (reconfirmado por Grok)` |
| Tarefa **não confirmada** ou ainda em verificação | `PENDENTE` | `PENDENTE` |

### Regras

1. A linha deve ficar no final do bloco da subtarefa (depois de **Anotação**; o marcador `VERIFICADOR-CLAUDE` da `SUB-38`, quando existir, vem logo abaixo dela).
2. Só marque com data/hora se a entrega foi **explicitamente verificada** (arquivo existe, conteúdo atende aos critérios, commit correspondente).
3. Subtarefas ainda `[ ]` ou com implementação placeholder/incompleta devem permanecer `PENDENTE`.
4. Ao reconfirmar uma tarefa já marcada, atualize a linha com a nova data e indique “reconfirmado”.
5. Esta confirmação é **complementar** ao status normal (`concluido` / `pendente`) e ao protocolo de lock. Não substitui o commit da entrega nem a atualização do status principal.

> ⚠️ Esta regra foi adicionada em 2026-10-12 após a restauração do quadro e a verificação das entregas recentes.

---

# 🧠 Plano de Implementação: Cérebro de Memória Persistente (Estilo Jev-Mem)
**Foco:** Ultra-rápido, baseado em primitivas estruturadas, custo zero de infraestrutura e consumo mínimo de tokens.
**Stack:** Claude Code / Antigravity + Vercel Serverless (Node/TS) + Supabase (Postgres + pgvector).

---

## 1. Arquitetura do Banco de Dados (Supabase)

Execute o script SQL abaixo no painel do seu Supabase para criar a estrutura de tabelas e habilitar a busca vetorial por proximidade.

> ℹ️ A versão consolidada e idempotente destes scripts fica na pasta [`database/`](database/README.md) (aplicar `01` → `04` em ordem). O trecho abaixo é a referência original do plano.

```sql
-- 1. Habilitar a extensão de busca vetorial
create extension if not exists vector;

-- 2. Criar a tabela principal de memórias canonicas
create table public.ai_memories (
    id uuid default gen_random_uuid() primary key,
    title text not null unique,
    content text not null, -- Armazenamento em Markdown limpo
    tags text[] default '{}'::text[],
    embedding vector(1536), -- Padrão OpenAI (text-embedding-3-small)
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Criar índice para busca vetorial acelerada (IVFFlat ou HNSW)
create index on public.ai_memories using hnsw (embedding vector_cosine_ops);

-- 4. Função RPC para busca híbrida acelerada (Evita processamento pesado no LLM)
create or replace function match_memories (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  content text,
  tags text[],
  similarity float
)
language sql stable
as $$
  select
    ai_memories.id,
    ai_memories.title,
    ai_memories.content,
    ai_memories.tags,
    1 - (ai_memories.embedding <=> query_embedding) as similarity
  from ai_memories
  where 1 - (ai_memories.embedding <=> query_embedding) > match_threshold
  order by ai_memories.embedding <=> query_embedding
  limit match_count;
$$;
```

---

## 2. Estrutura do Servidor MCP (Vercel Serverless)

O Claude Code precisa de respostas em formato JSON-RPC padrão do protocolo MCP. Crie o endpoint na Vercel utilizando a estrutura abaixo para processar os três verbos cognitivos principais.

> ℹ️ **Implementação real:** [`api/mcp.ts`](api/mcp.ts) (roteador JSON-RPC 2.0 / MCP Streamable HTTP) + [`api/_lib/`](api/_lib/) (registro de ferramentas). Diferente do exemplo abaixo, no MCP o método é sempre **`tools/call`** com o nome da ferramenta em **`params.name`** (não `tools/call/brain_store`), e toda resposta vai no envelope `{ "jsonrpc": "2.0", "id", "result" | "error" }`. O handshake `initialize` também é obrigatório. As primitivas `brain_store`/`brain_search`/`brain_delete` (SUB-07) estão em [`api/_lib/brain-tools.ts`](api/_lib/brain-tools.ts), com escopo por projeto (upsert por `project_id,title`, memória global com `project_id` nulo) e embeddings em `https://api.openai.com/v1/embeddings`; o acesso ao Supabase usa `@supabase/supabase-js` com a chave `service_role` ([`api/_lib/supabase.ts`](api/_lib/supabase.ts)); runtime Node.js 22+. O exemplo abaixo é apenas ilustrativo.

### Estrutura de Arquivos Recomendada
```text
📦 meu-mcp-brain
 ┣ 📂 api
 ┃ ┗ 📜 mcp.ts        # Endpoint principal Serverless
 ┣ 📜 package.json
 ┗ 📜 tsconfig.json
```

### Arquivo: `api/mcp.ts`
```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Apenas requisições POST são aceitas.' });
  }

  const { method, params } = req.body;

  try {
    switch (method) {
      // PRIMITIVA 1: ARMAZENAR (brain_store)
      case 'tools/call/brain_store': {
        const { title, content, tags } = params.arguments;
        
        // Gerar embedding leve (Ex: usando API gratuita do Gemini ou OpenAI barata)
        const embedding = await generateEmbedding(content);

        const { data, error } = await supabase
          .from('ai_memories')
          .upsert({ title, content, tags, embedding }, { onConflict: 'title' })
          .select();

        if (error) throw error;
        return res.json({ content: [{ type: 'text', text: `Memória "${title}" salva com sucesso.` }] });
      }

      // PRIMITIVA 2: PESQUISAR (brain_search) - O "Filtro Jev" Rápido
      case 'tools/call/brain_search': {
        const { query } = params.arguments;
        const queryEmbedding = await generateEmbedding(query);

        // Busca rápida por similaridade direto no banco (Sem gastar token de LLM caro)
        const { data: memories, error } = await supabase.rpc('match_memories', {
          query_embedding: queryEmbedding,
          match_threshold: 0.7,
          match_count: 3
        });

        if (error) throw error;

        const formattedResult = memories.map((m: any) => `[${m.title}]: ${m.content}`).join('\n\n');
        return res.json({ content: [{ type: 'text', text: formattedResult || 'Nenhuma memória relevante encontrada.' }] });
      }

      // PRIMITIVA 3: DELETAR (brain_delete)
      case 'tools/call/brain_delete': {
        const { title } = params.arguments;
        const { error } = await supabase.from('ai_memories').delete().eq('title', title);
        
        if (error) throw error;
        return res.json({ content: [{ type: 'text', text: `Memória "${title}" apagada.` }] });
      }

      // Listar Ferramentas disponíveis para o Claude Code reconhecer automaticamente
      case 'tools/list': {
        return res.json({
          tools: [
            { name: 'brain_store', description: 'Salva uma nova decisão ou contexto em Markdown', inputSchema: { type: 'object', properties: { title: { type: 'string' }, content: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } } }, required: ['title', 'content'] } },
            { name: 'brain_search', description: 'Busca memórias antigas relevantes para a tarefa atual', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
            { name: 'brain_delete', description: 'Remove uma memória pelo título', inputSchema: { type: 'object', properties: { title: { type: 'string' } }, required: ['title'] } }
          ]
        });
      }

      default:
        return res.status(404).json({ error: 'Método não encontrado' });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

// Helper para gerar embeddings usando a API de sua escolha
async function generateEmbedding(text: string): Promise<number[]> {
  // Exemplo com OpenAI text-embedding-3-small (Custo insignificante: \$0.00002 por 1k tokens)
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ input: text, model: 'text-embedding-3-small' })
  });
  const json = await response.json();
  return json.data[0].embedding;
}
```

---

## 3. Ativação no Terminal (Claude Code)

Após realizar o deploy do código acima na Vercel e configurar as variáveis de ambiente (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `OPENAI_API_KEY`), ative a sua memória compartilhada direto no Claude Code rodando o comando:

```bash
claude mcp add --transport http dashboard-ai-brain https://<seu-projeto>.vercel.app/api/mcp
```
