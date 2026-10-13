## Etapa 002-90cd9004 — SUB-38: Verificação geral de todas as tarefas (marcador `VERIFICADOR-CLAUDE`)

**Tarefa:** SUB-38 · **Migrada em:** 2026-10-13 (ETAPA-001) · **Executor:** por subtarefa (coluna "Em uso por" do `tasks/STATUS.md`)
**Próximo passo:** escolher uma subtarefa livre no `tasks/STATUS.md` (cada subtarefa tem o próprio próximo passo abaixo).

> Bloco migrado do `task-principal.md` sem alterar o texto. **Status, prioridade, dependências e reserva** de cada subtarefa ficam só no [`tasks/STATUS.md`](../STATUS.md); aqui ficam descrição, critérios, entrega e anotações. Quem reserva uma subtarefa edita só a seção dela.

### Tarefa-mãe

- **Descrição:** Ler todos os blocos do `task-principal.md` e do `task_complete.md` e conferir, um por vez, se a entrega está correta (commits citados existem, arquivos e funções existem e atendem aos critérios, testes e validação). O resultado vai no marcador `- **VERIFICADOR-CLAUDE:**` de cada bloco (já inserido como `PENDENTE`). Valores: `✅ OK`, `⚠️ RESSALVA`, `❌ FALHA` ou `⬜ NÃO IMPLEMENTADA`, sempre com data, hora, agente e evidência. Só leitura: problemas achados viram subtarefas novas, não são corrigidos aqui. **Método econômico (aprovado pelo usuário em 2026-10-13 13:57):** (1) script Python (`scripts/verificador/verificar_quadros.py`) faz a checagem mecânica de todos os blocos `PENDENTE` sem gastar tokens — commits citados existem (`git cat-file -e`), arquivos citados existem na `main` — e grava `⬜ NÃO IMPLEMENTADA`/`⚠️ RESSALVA` quando for objetivo; (2) a IA só revisa os blocos que o script marcou como duvidosos ou que pedem julgamento do critério de aceitação; (3) validação geral (`npm run typecheck`, `build`, `test`) roda **uma vez** para o projeto, não por bloco; (4) commit e push **por lote** de 20–30 blocos (`docs(verificador): lote N (SUB-XX a SUB-YY) por <agente>`), em vez de um por bloco. Plano e critérios: plano nesta etapa.
- **Critérios de Aceitação:** Nenhum marcador `VERIFICADOR-CLAUDE: PENDENTE` nos dois quadros; relatório final com a lista de ressalvas e falhas.
- **Commit:** pendente
- **Anotação:** **Restaurada ao quadro (2026-10-12 16:25, DeepSeek Harness (deepseek-flash), a pedido do usuário):** o bloco desta tarefa foi **apagado** do `task-principal.md` pelo commit `32d6f58` ("concluir SUB-38 (verificação parcial) e liberar trava de Devin") e **nunca foi registrado no `task_complete.md`** — ficou fora dos **dois** quadros, deixando a seção `⭐ PRIORIDADE MÁXIMA` vazia e o resumo contando uma pendente que não existia como bloco. Conferido no histórico: `SUB-38:` existe em `32d6f58^`, não existe em `32d6f58` e não aparece no `task_complete.md` daquele commit. Como o critério de aceitação **não** foi atendido — há **268 marcadores `VERIFICADOR-CLAUDE: PENDENTE`** (36 no quadro ativo + 232 no histórico) contra 9 verificados — a tarefa volta como pendente e é assumida na mesma hora pela trava normal. **Estado herdado:** marcador inserido em 246 blocos (`5fb92f7`, hoje 277 por causa das 30 filhas do KIRO e da SUB-25.8); validação geral registrada em plano nesta etapa (`npm run typecheck`/`build` falhavam com TS6133, corrigido na SUB-25.8); **Progresso (2026-10-12 16:40): 45 de 297 blocos verificados.** Herdados 9 (SUB-25, SUB-25.4, SUB-25.7, SUB-26, SUB-26.3, SUB-26.9 e a mãe SUB-28 com `⚠️ RESSALVA` — esta por citar o commit inexistente `76f243e` na SUB-28.33; confirmado: `cfe88af` existe, `76f243e` não). Meus 36: **4 com evidência real** (`✅ OK` — SUB-28.18, 28.23, 28.25 e 28.32: commits, arquivos e funções conferidos, `npm run typecheck:api` exit 0) e **32 factuais** (`⬜ NÃO IMPLEMENTADA` — SUB-35.46, `KIRO-DEV-CLONE` e as 30 filhas: nada do escopo existe no repositório). Com isso o quadro ativo chegou a **0 pendentes**; depois entraram tarefas novas de outros agentes (SUB-39/40/41/42), então a fila ativa voltou a ter pendentes. **Falta o histórico: ~237 blocos em `task_complete.md`**, na ordem, começando pela `SUB-01` (linha 27). A contagem ao vivo é `grep -c 'VERIFICADOR-CLAUDE: PENDENTE'` nos dois quadros — este texto é um retrato do momento. Sem navegador e sem Docker/Postgres local (restrição registrada em `STATUS.md`). **Liberação e novo método (2026-10-13 13:57, Claude Code (Opus 5.5), a pedido do usuário):** o usuário liberou a trava de DeepSeek Harness (deepseek-flash) para que outra IA assuma e aprovou a mudança de escopo para o método econômico (script para a parte mecânica + IA só nos duvidosos + validação única + commit por lote), por causa do custo estimado de 3 a 7 milhões de tokens no método bloco a bloco. Os marcadores já gravados continuam valendo. Recomendação: quem assumir deve ser um modelo capaz de tarefa média (escrever o script e julgar critérios), não um modelo só de tarefa fácil.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE


### Plano (vindo de `docs/verificador-claude.md` em 2026-10-13)

- **Criado em:** 2026-10-12 15:20
- **Pedido por:** Gelvazio (usuário), no chat
- **Executor:** Claude Code (Opus 5.5)
- **Status:** ⬜ Pendente, livre para outra IA — tarefa `SUB-38` (prioridade `MAXIMA`) no `task-principal.md`.
  Trava de DeepSeek Harness (deepseek-flash) liberada pelo usuário em 2026-10-13 13:57; método trocado
  pelo método econômico (seção abaixo), aprovado pelo usuário na mesma data.

#### Objetivo

Ler todas as tarefas e subtarefas do `task-principal.md` e do `task_complete.md` e conferir, uma por
vez, se o que foi entregue está correto. O resultado fica num marcador novo em cada bloco:

```markdown
- **VERIFICADOR-CLAUDE:** PENDENTE
```

#### Escopo

- **Entra:** os 246 blocos `### [ ]`/`### [x]`/`#### [ ]`/`#### [x]` dos dois quadros (15 no
  `task-principal.md`, 231 no `task_complete.md`), na ordem em que aparecem.
- **Não entra:** corrigir código. Se a verificação achar um problema, ele é registrado no marcador
  (e no relatório final); a correção é uma tarefa nova, aprovada pelo usuário.
- **Não entra:** mudar `Status`, `Commit`, `Anotação` ou `STATUS-TAREFA-CONFIRMADO-CONCLUIDO` dos
  blocos, nem as travas. O marcador é só leitura e conferência.

#### Como cada item é verificado

1. O bloco é lido inteiro (descrição, critérios, commit e anotação).
2. Os commits citados existem no histórico (`git cat-file -e <sha>`).
3. Os arquivos citados existem na `main` e têm o que o critério pede (funções, seções, colunas).
4. Os testes do item fazem parte da execução geral, conferida no início:

| Checagem | Resultado em 2026-10-12 15:23 |
|---|---|
| `npm ci` | OK |
| `npm run typecheck` | ❌ falha: `tests/unit/api-aprovacao.test.ts(111,21)` TS6133 `deps` sem uso |
| `npm run build` (`tsc -b && vite build`) | ❌ falha pelo mesmo erro do `tsc -b` |
| `npx vite build` (sem `tsc`) | OK |
| `npm run check:chunks` | OK (16 chunks, todos até 500 kB) |
| `npm run typecheck:worker` | OK |
| `npm test` (Vitest) | OK: 300 testes passam, 30 pulados (integração sem banco) |
| `npm run check:env` | OK (aviso: `LANGGRAPH_DATABASE_URL` não usada em src/api/scripts) |
| Testes Python (`unittest`) | OK: 13 testes |
| `npm run test:integration` / `database/tests` | ⛔ não executados: Docker parado e sem Postgres local |

Não se abre navegador (regra do usuário). Itens de validação visual são conferidos pelo registro
deixado no `docs/VALIDACAO.md` e na anotação.

#### Valores do marcador

| Valor | Quando |
|---|---|
| `✅ OK — <data hora> (Claude Code): <evidência>` | Entrega conferida e de acordo com o critério |
| `⚠️ RESSALVA — <data hora> (Claude Code): <o quê>` | Entregue, mas com ponto a corrigir ou não conferível aqui |
| `❌ FALHA — <data hora> (Claude Code): <o quê>` | Entrega não atende o critério ou quebra a validação |
| `⬜ NÃO IMPLEMENTADA — <data hora> (Claude Code): <situação>` | Tarefa ainda pendente no quadro |

#### Método econômico (aprovado pelo usuário em 2026-10-13 13:57)

**Por quê:** o método bloco a bloco (a IA lê cada bloco, abre commits e arquivos e faz commit + push a
cada um) foi estimado em 3 a 7 milhões de tokens para os ~250 blocos restantes. A maior parte da
conferência é mecânica e pode ser feita por script, sem gastar tokens.

1. **Script para a parte mecânica** — `scripts/verificador/verificar_quadros.py` (Python, só leitura
   do Git e dos arquivos):
   - acha os blocos com `VERIFICADOR-CLAUDE: PENDENTE` nos dois quadros;
   - extrai os SHAs citados e confere com `git cat-file -e <sha>`;
   - extrai os caminhos de arquivo citados e confere se existem na `main`;
   - classifica: bloco `pendente` sem nada no repositório → `⬜ NÃO IMPLEMENTADA`; commit citado
     inexistente → `⚠️ RESSALVA`; tudo existe → **candidato a OK** (vai para a IA);
   - gera um relatório (`docs/verificador-relatorio.md`) com a lista por classificação.
2. **IA só nos casos que pedem julgamento** — os candidatos a OK e os duvidosos: a IA lê o critério de
   aceitação e confere se o conteúdo do arquivo atende (funções, seções, colunas).
3. **Validação geral uma vez só** — `npm run typecheck`, `npm run build` e `npm test` rodam uma vez para
   o projeto; o resultado vale para todos os blocos e fica na tabela acima.
4. **Commit por lote** — commit + push a cada 20–30 blocos verificados
   (`docs(verificador): lote N (SUB-XX a SUB-YY) por <agente>`), em vez de um por bloco.

Quem assumir deve ser um modelo capaz de **tarefa média** (escrever o script e julgar critérios).

#### Passos

| # | Passo | Status |
|---|---|---|
| 1 | Inserir `VERIFICADOR-CLAUDE: PENDENTE` nos 246 blocos; commit e push | ✅ Concluído |
| 2 | Rodar a validação geral (tabela acima) | ✅ Concluído (refazer uma vez no início do método econômico) |
| 3 | Verificar os itens um por um, na ordem dos quadros (método antigo) | ⏹️ Substituído em 2026-10-13 (45 de 297 feitos; marcadores gravados continuam valendo) |
| 3.1 | Escrever `scripts/verificador/verificar_quadros.py` e rodar nos blocos `PENDENTE` | ⬜ Pendente |
| 3.2 | Gravar os marcadores objetivos (`⬜ NÃO IMPLEMENTADA`, `⚠️ RESSALVA`) em lotes | ⬜ Pendente |
| 3.3 | IA revisa os candidatos a OK e os duvidosos, em lotes de 20–30 | ⬜ Pendente |
| 4 | Relatório final: lista de ressalvas e falhas | ⬜ Pendente |

### SUB-38.1 — Verificação geral de todas as tarefas (marcador `VERIFICADOR-CLAUDE`)

**Próximo passo:** começar pelo escopo da tarefa-mãe.

Subtarefa criada na migração (regra: toda tarefa-mãe tem no mínimo 1 subtarefa). Executa todo o escopo da tarefa-mãe: descrição e critérios na seção **Tarefa-mãe** acima.
