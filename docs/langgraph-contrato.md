# Contrato do worker LangGraph (SUB-28)

Contrato entre o worker de execução, as RPCs do Supabase, o grafo LangGraph e as ferramentas
MCP, conforme a seção 9.1 do [`LangChain_LangGraph.md`](../LangChain_LangGraph.md). O Supabase
continua sendo a fonte de verdade da fila, das travas e do status; o grafo só coordena uma task
**já reivindicada** por `pegar_proxima_task`.

> Seções seguintes (ferramentas permitidas e idempotência; mapeamento de erros para
> `finalizar_task`) ficam nas SUB-28.26 e SUB-28.27.

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
