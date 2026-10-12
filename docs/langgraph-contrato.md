# Contrato do worker LangGraph (SUB-28)

Contrato entre o worker de execução, as RPCs do Supabase, o grafo LangGraph e as ferramentas
MCP, conforme a seção 9.1 do [`LangChain_LangGraph.md`](../LangChain_LangGraph.md). O Supabase
continua sendo a fonte de verdade da fila, das travas e do status; o grafo só coordena uma task
**já reivindicada** por `pegar_proxima_task`.

> A seção 2 (ferramentas permitidas e idempotência) veio na SUB-28.26; a seção 3 (mapeamento
> de erros para `finalizar_task`) veio na SUB-28.27.

## 1. Identificadores e estado mínimo

### 1.1 Identificador da execução

Cada execução do grafo corresponde a **uma tentativa** de uma task, tal como registrada pelo banco:

| Campo | Origem | Observação |
|---|---|---|
| `taskId` | `tasks.id` devolvido por `pegar_proxima_task` | Chave da task; nunca muda. |
| `tentativa` | `tasks.tentativas` **após** a reivindicação | A RPC soma 1 a cada reivindicação (`tentativas = tentativas + 1`); o worker não calcula tentativas por conta própria. |
| `agente` | `tasks.trava_frente` (= `p_agente`) | Dono da trava; checado antes de retomar (ver 1.3). |
| `travaEm` | `tasks.trava_em` | Momento da reivindicação; usado para detectar trava expirada (90 min por padrão). |

O identificador estável da execução é derivado desses valores:

```text
execucaoId = "task-<taskId>-t<tentativa>"        ex.: task-42-t2
```

- É usado como `thread_id` do checkpointer do LangGraph, como `execucao_id` nos eventos dos
  agentes e nos metadados de `finalizar_task` (`p_metadados.execucao_id`).
- **Retomada** (mesma tentativa, após pausa humana ou reinício do processo) reutiliza o mesmo
  `execucaoId` e, portanto, o mesmo checkpoint.
- **Nova tentativa** (a RPC devolveu a task com `tentativas` maior, depois de um `erro` ou de
  trava expirada) gera um `execucaoId` novo e começa do zero; efeitos já confirmados em
  tentativas anteriores são evitados pelas chaves de idempotência (SUB-28.26), não pelo
  checkpoint.
- Chaves de idempotência de ferramentas são derivadas de `execucaoId` + etapa do plano
  (ex.: `task-42-t2:passo-3`).

### 1.2 Estado mínimo persistido (checkpoint)

O checkpoint guarda **só** o necessário para retomar e auditar (seção 4 do
`LangChain_LangGraph.md`):

| Campo | Tipo | Conteúdo |
|---|---|---|
| `execucaoId` | string | Conforme 1.1. |
| `taskId`, `taskCodigo` | number, string | Identificação da task (`tasks.id`, `tasks.codigo`). |
| `projetoId` | number | `tasks.project_id`; limita o escopo das ferramentas. |
| `agente`, `tentativa`, `travaEm` | string, number, string ISO | Dono e validade da trava no momento da reivindicação. |
| `instrucao` | string | Instrução original da task (dado **não confiável**). |
| `criterios` | string[] | Critérios de aceitação extraídos da instrução, se houver. |
| `plano` | lista de passos validados | `{ id, ferramenta, argumentos, status }` (`pendente`, `feito`, `falhou`). |
| `etapaAtual` | string | Nó/passo em execução. |
| `resultados` | por id de passo | Resultado resumido de cada ferramenta já confirmada (sem segredos). |
| `aprovacao` | opcional | Ação pedida, decisão, quem aprovou e quando (sem credenciais). |
| `desfecho` | opcional | `{ status: 'concluida' \| 'erro' \| 'recusada', resumo, prUrl?, commitSha? }` para `finalizar_task`. |

**Não** entram no estado: senhas, chaves (`SUPABASE_SERVICE_ROLE_KEY`, chaves de modelo,
`MCP_AUTH_TOKEN`), tokens/JWT, prompts montados (são compostos a cada nó a partir do estado),
cópias integrais de memórias ou saídas grandes de ferramentas.

### 1.3 Regras de coerência com o banco

1. O grafo só começa depois de `pegar_proxima_task` devolver a task; sem linha devolvida, não há
   execução.
2. Ao iniciar **e** ao retomar, o worker relê a task e só continua se `status = 'em_execucao'`,
   `trava_frente = agente` e `tentativas = tentativa` do checkpoint. Caso contrário, o checkpoint
   é descartado (outro agente/tentativa assumiu ou a trava expirou) e nenhum efeito é repetido.
3. O status oficial só muda por `finalizar_task(taskId, status, ...)`, que também libera a
   trava; o checkpoint concluído **não** significa task concluída.

## 2. Ferramentas permitidas e idempotência

### 2.1 Allowlist

O grafo só enxerga as ferramentas abaixo (seção 6 do `LangChain_LangGraph.md`). Qualquer outro
nome vindo do plano do modelo é rejeitado pelo nó `politica` antes de executar; texto da task,
memórias ou saídas de ferramentas **não** ampliam a lista. Todas rodam com o `projetoId` do
estado (1.2) e passam pela autenticação do MCP (`MCP_AUTH_TOKEN` obrigatório).

| Ferramenta MCP | Efeito | Sensível (pausa para aprovação humana) | Idempotência |
|---|---|---|---|
| `brain_search` | leitura | não | não se aplica (sem efeito) |
| `task_list` | leitura | não | não se aplica (sem efeito) |
| `brain_store` | escrita | não | natural: upsert por `(project_id, title)`; repetir grava o mesmo conteúdo |
| `agent_event` | escrita (só-inclusão) | não | `chave_idempotencia` única por projeto em `agent_events` |
| `task_create` | escrita | **sim** (cria trabalho para outros agentes) | chave do passo gravada no checkpoint; só executa após aprovação |
| `brain_delete` | escrita destrutiva | **sim** (apaga dados) | natural: apagar o que já não existe não muda nada |

**Fora da allowlist do grafo:** `task_next` e `task_finish`. A reivindicação e o desfecho da task
são feitos pelo **worker** direto nas RPCs (`pegar_proxima_task` / `finalizar_task`), nunca
pelo modelo. Também ficam fora: push/deploy, envio a terceiros e execução arbitrária de código
(não fazem parte da primeira versão; se entrarem, entram como sensíveis).

Regras da allowlist:

1. Ferramenta **sensível** sempre interrompe o grafo (`interrupt`) com a ação, os argumentos
   (sem segredos) e o motivo; só segue com decisão humana registrada em `aprovacao` (1.2).
2. Argumentos são validados pelo schema da ferramenta **e** no servidor; `projetoId` vem do
   estado, nunca dos argumentos sugeridos pelo modelo.
3. Uma recusa na aprovação não é falha transitória: o passo vira `falhou` e o desfecho segue
   o mapeamento da SUB-28.27.

### 2.2 Chaves de idempotência

Formato (derivado de 1.1):

```text
chave = "<execucaoId>:<passoId>"                  ex.: task-42-t2:passo-3
```

- `passoId` é o `id` estável do passo no `plano` validado (não muda em retomadas).
- Para efeitos que **devem valer entre tentativas** (ex.: não criar a mesma task de novo na
  tentativa 3), usa-se a chave da task sem a tentativa: `task-<taskId>:<passoId>`.

Onde a chave é gravada:

| Local | O que guarda | Para quê |
|---|---|---|
| Checkpoint (`plano[i].status` + `resultados[passoId]`) | passo `feito` com resumo do resultado e a chave usada | retomada da **mesma** tentativa não repete o passo |
| `agent_events.chave_idempotencia` | evento do passo (ex.: `progresso`/`commit`) com a chave | auditoria e deduplicação no banco (constraint única por projeto); nova tentativa consulta antes de repetir efeito externo |
| `p_metadados` de `finalizar_task` | `execucao_id` e lista de chaves dos passos confirmados | rastreabilidade no relatório final da task |

Ordem obrigatória num passo de escrita: **persistir no checkpoint que o passo vai rodar →
chamar a ferramenta → persistir o resultado (`feito`) e emitir o evento com a chave → só então
avançar** (seção 7 do `LangChain_LangGraph.md`). Se o processo cair entre a chamada e a
persistência, a retomada consulta `agent_events` pela chave antes de repetir; ferramentas com
idempotência natural (`brain_store`, `brain_delete`) podem simplesmente ser repetidas.

## 3. Mapeamento de erros para `finalizar_task`

O grafo **classifica** a falha; quem decide o status oficial e se haverá nova tentativa é a RPC
`finalizar_task` (`database/04_rpc_functions.sql`), chamada **só pelo worker** com
`p_agente = agente` do checkpoint (1.3). Com `p_status = 'erro'`, a RPC devolve a task para
`pendente` enquanto `tentativas < max_tentativas` e só a encerra como `erro` quando as tentativas
se esgotam; `concluida` e `recusada` são sempre finais. Toda chamada grava o log em
`agendamento_tarefa_logs` e libera a trava.

### 3.1 Tabela de mapeamento

| Classe da falha | Exemplos | Tratamento no grafo | `p_status` | Nova tentativa da task |
|---|---|---|---|---|
| **Transitória** | timeout/rede, HTTP 429 ou 5xx do modelo ou do MCP, Supabase indisponível (503) | repete **o nó** com espera progressiva (até 3 vezes, ex.: 2 s, 4 s, 8 s); se passar, segue normalmente | `erro` (só se esgotar as repetições do nó) | sim, decidida pela RPC (`tentativas < max_tentativas`) |
| **Validação / permissão** | argumentos rejeitados pelo schema ou pelo servidor, ferramenta fora da allowlist (2.1), 401/403 do MCP, `projetoId` divergente, RLS recusou | não repete; o passo vira `falhou` | `erro` | sim pela RPC, mas a próxima tentativa só deve prosseguir se algo mudou (config, permissão); o resumo diz o que corrigir |
| **Permanente** | instrução impossível ou contraditória, dependência externa inexistente, critérios de aceitação não atingidos após o plano completo, limite de passos do grafo atingido | não repete | `erro` | pela RPC; quando a nova tentativa não pode mudar o resultado, preferir `recusada` (linha abaixo) |
| **Recusa** | humano negou a aprovação de uma ação sensível (2.1, regra 3), instrução pede algo proibido (seção 6 do `LangChain_LangGraph.md`), task fora do escopo do projeto | encerra sem efeitos adicionais | `recusada` | não (final) |
| **Trava perdida** | na retomada, `status`, `trava_frente` ou `tentativas` não batem com o checkpoint (1.3, regra 2) | descarta o checkpoint | **nenhum**: não chamar `finalizar_task` (a RPC recusaria; a task já é de outro agente/tentativa) | não se aplica |
| **Sucesso** | todos os critérios atendidos | — | `concluida` | não (final) |

Regras:

1. Sem status intermediário: o grafo nunca grava `tasks.status` diretamente nem cria um segundo
   sistema de status (seção 9 do `LangChain_LangGraph.md`).
2. A classificação usa o tipo do erro (código HTTP, classe da exceção, código do Postgres), não o
   texto livre devolvido por modelo ou ferramenta, que é dado **não confiável**.
3. Se a própria chamada a `finalizar_task` falhar de forma transitória, o worker repete só a
   chamada (mesmos argumentos); se a RPC responder que a task não está em execução ou que a trava
   pertence a outro agente, o worker para e registra o evento, sem repetir.

### 3.2 Argumentos e metadados

| Argumento | Conteúdo |
|---|---|
| `p_resultado` | resumo seguro (sem segredos, tokens, prompts ou saídas grandes): o que foi feito ou, em falha, classe + passo + motivo curto |
| `p_pr_url`, `p_commit_sha` | só quando houver efeito confirmado (passo `feito`) |
| `p_agente` | `agente` do checkpoint (a RPC confere o dono da trava) |
| `p_rotina` | `langgraph` |
| `p_metadados.execucao_id` | `execucaoId` (1.1) |
| `p_metadados.chaves` | chaves de idempotência dos passos confirmados (2.2) |
| `p_metadados.classe_falha` | `transitoria`, `validacao`, `permanente` ou `recusa` (ausente no sucesso) |
| `p_metadados.passo_falho` | `passoId` do passo que falhou, se houver |
| `p_metadados.erro_mensagem` | mensagem segura copiada para `agendamento_tarefa_logs.erro_mensagem` |
| `p_metadados.branch`, `sessao_url`, `arquivos_alterados` | quando aplicável (copiados para o log pela RPC) |

Antes de chamar a RPC, o worker emite um `agent_event` do tipo `fim` (sucesso) ou `erro` com a
mesma `classe_falha` e a chave `task-<taskId>-t<tentativa>:finalizar`, para o monitor em tempo real.
