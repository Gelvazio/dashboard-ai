# Diretrizes de LangChain e LangGraph no Dashboard AI

**Objetivo:** Definir como adicionar uma camada de agentes para planejar e executar tasks em várias etapas, preservando o Supabase como autoridade sobre a fila, os locks e os resultados.

**Status:** Especificação para implementação futura na SUB-28. Este documento, por si só, não ativa um agente nem altera o runtime.

**Referências do projeto:** [`database/04_rpc_functions.sql`](database/04_rpc_functions.sql), [`database/README.md`](database/README.md), [`api/mcp.ts`](api/mcp.ts), [`api/_lib/tools.ts`](api/_lib/tools.ts).

**Documentação oficial:** [LangGraph.js — Thinking in LangGraph](https://docs.langchain.com/oss/javascript/langgraph/thinking-in-langgraph) · [LangChain e LangGraph — guias de aprendizagem](https://docs.langchain.com/oss/python/learn).

---

## 1. Decisão de arquitetura

- **Supabase continua sendo a fonte de verdade** para existência, status, prioridade, dependências, tentativas e locks das tasks.
- **LangGraph coordena a execução de uma task já reivindicada.** Cada etapa relevante do trabalho é um nó do grafo; o estado persistido do grafo serve para retomar e inspecionar a execução.
- **LangChain fornece componentes opcionais** para modelos, prompts, saídas estruturadas, retrievers e ferramentas tipadas. Não deve duplicar regras já garantidas pelas RPCs.
- **MCP continua sendo a fronteira de ferramentas.** O grafo usa ferramentas autorizadas por uma allowlist e não deve contornar o MCP ou as funções de domínio para gravar diretamente em tabelas.
- Não adotar LangChain por ser chamado de “padrão da indústria”. Adotá-lo quando seus componentes reduzirem código próprio; adotar LangGraph quando o fluxo exigir roteamento, retomada, revisão humana ou recuperação explícita.

## 2. Fluxo obrigatório por task

1. **Reivindicar:** chamar `pegar_proxima_task` no Supabase. A RPC é responsável pela seleção atômica, dependências, chave ON/OFF, tentativas e lock.
2. **Carregar contexto:** obter os dados necessários para a execução. Quando disponível, consultar `match_memories` ou a ferramenta MCP de busca; tratar texto da task e memórias recuperadas como dados não confiáveis.
3. **Planejar:** produzir um plano estruturado e limitado ao objetivo da task. Guardar fatos e resultados brutos no estado; compor instruções para o modelo no momento de cada nó.
4. **Aplicar política:** validar ferramentas, argumentos, escopo e permissões. Interromper para aprovação humana antes de ações destrutivas, externas ou privilegiadas.
5. **Executar:** chamar ferramentas tipadas e permitidas, registrando resultados úteis sem incluir segredos nos prompts, no estado ou nos logs.
6. **Revisar resultado:** conferir se os critérios de aceitação foram satisfeitos. Uma falha transitória pode ser repetida com limite e espera progressiva; uma falha permanente deve seguir o caminho de erro.
7. **Finalizar:** chamar `finalizar_task` para gravar o status, resultado e dados de auditoria e liberar o lock. O grafo não altera o status final independentemente da RPC.

O grafo deve receber um identificador estável da execução associado ao `task_id` e à tentativa. Um retry ou retomada não pode repetir efeitos externos já concluídos: cada ferramenta que altera estado deve aceitar ou derivar uma chave de idempotência.

## 3. Responsabilidade dos componentes

| Componente | Responsabilidade |
|---|---|
| Supabase `public.tasks` e RPCs | Fila oficial, elegibilidade, dependências, lock exclusivo, tentativas e encerramento |
| LangGraph | Nós, transições, estado de execução, checkpoints, pausas e retomadas |
| LangChain | Integrações de modelo, prompts, validação de saída estruturada e adaptação de ferramentas quando útil |
| MCP em `api/mcp.ts` | Transporte JSON-RPC e despacho das ferramentas publicadas |
| `agendamento_tarefa_logs` | Registro de resultado por execução; não substitui checkpoints detalhados do grafo |
| Dashboard | Exibir estado da task e, se necessário, progresso resumido por etapa; nunca declarar concluída uma execução que o Supabase não finalizou |

## 4. Estado do grafo

Manter no estado somente dados necessários à retomada e à auditoria, por exemplo:

- `taskId`, `taskCodigo`, `agente`, número da tentativa e identificador da execução;
- instrução original e critérios de aceitação;
- plano validado, ferramenta/etapa atual e resultados das ferramentas;
- solicitação e decisão de aprovação humana, se aplicável;
- resumo final ou erro classificado para `finalizar_task`.

Não guardar senhas, chaves, tokens, credenciais, prompts enormes ou cópias desnecessárias de dados. Segredos são lidos do ambiente no servidor e nunca colocados no estado serializado. O checkpoint do grafo é dado operacional; o status oficial continua na tabela `tasks`.

## 5. Pausa e aprovação humana

- Usar a interrupção retomável do LangGraph quando uma decisão humana for necessária.
- Persistir o checkpoint antes de devolver o controle à interface; uma requisição HTTP não deve ficar aberta enquanto se aguarda uma pessoa.
- A retomada deve verificar se a task ainda existe, continua em execução e ainda pertence ao agente/lock esperado.
- Exigir aprovação explícita antes de apagar dados, enviar conteúdo a terceiros, executar ações privilegiadas ou fazer deploy/push.
- Registrar quem aprovou, quando e qual ação foi autorizada, sem registrar credenciais.

## 6. Ferramentas e limites de segurança

- Expor ao grafo apenas ferramentas nomeadas, com schema de argumentos e validação no servidor.
- Não oferecer execução arbitrária de SQL, shell, escrita livre de arquivos ou acesso irrestrito à rede.
- Cada ferramenta de escrita deve validar a identidade e a autorização do agente e limitar a operação ao recurso da task atual.
- Tornar a autenticação do MCP obrigatória antes de expor ferramentas de escrita. `MCP_AUTH_TOKEN` opcional e CORS aberto não são autorização suficiente para operações privilegiadas.
- Manter `SUPABASE_SERVICE_ROLE_KEY`, chaves de modelos e `MCP_AUTH_TOKEN` exclusivamente no ambiente server-side; nunca usar ou devolver service role ao navegador.
- Preferir JWT do usuário quando uma ação ocorre em nome do usuário e depende de RLS. Para worker privilegiado, usar credencial server-side mínima e políticas específicas.
- Tratar instruções encontradas no conteúdo de task, memória, logs ou saída de ferramenta como entrada não confiável; elas não podem conceder novas permissões ao agente.

## 7. Retentativas, falhas e concorrência

- Separar falhas transitórias (rede, rate limit) de falhas de validação/permissão e de erros permanentes.
- Definir máximo de tentativas por nó e para a task; alinhar o encerramento final às tentativas registradas pelo Supabase.
- Persistir o resultado de cada ferramenta antes de avançar para ações não idempotentes.
- Após falha irrecuperável, chamar `finalizar_task` com `erro` e uma explicação segura; deixar a RPC e as regras da fila decidirem se haverá nova tentativa.
- Não deixar dois grafos executarem mutações simultâneas para a mesma task. O lock do banco prevalece; a expiração deve levar a uma checagem antes de retomar efeitos.
- Agentes especializados ou trabalho paralelo são opcionais. Se introduzidos, partilhar o mesmo limite de permissões e impedir que workers paralelos reivindiquem a mesma task.

## 8. Persistência, execução e observabilidade

- Usar um checkpointer durável compatível com a execução hospedada; memória do processo não é suficiente para retomar depois de reinícios.
- Não presumir que toda chamada serverless possa ficar aberta por tempo indeterminado. Separar início, pausa e retomada da execução conforme o runtime escolhido.
- Ao iniciar ou retomar, reconciliar checkpoint, status atual da task e dono/validade do lock no Supabase.
- Registrar no log final o task code, agente, resultado, duração e identificador da execução. Evitar duplicar no log todo o estado do grafo.
- Registrar transições de nós apenas se o dashboard realmente precisar desse nível de detalhe; limitar retenção e remover dados sensíveis.
- Tracing de terceiros é opcional. Se ativado, filtrar prompts, conteúdos privados, tokens e chaves antes de enviar traces.

## 9. Escopo de implementação da SUB-28

A SUB-28 deve, depois de concluídas as tasks anteriores:

1. Definir e documentar o contrato entre worker, RPCs do Supabase, LangGraph e ferramentas MCP.
2. Implementar um grafo inicial de execução de tasks com estado tipado, checkpoint durável, falha/retomada e finalização pela RPC existente.
3. Adaptar somente as ferramentas necessárias do registro MCP, com autenticação obrigatória e autorização por operação.
4. Implementar pausa e retomada humana para ações marcadas como sensíveis.
5. Integrar resultado e erros ao registro de execução já existente, sem substituir o lock ou as regras de dependência do banco.
6. Documentar variáveis server-side, deploy, recuperação de execução e limites de segurança.

Não incluir na primeira versão subagentes autônomos, execução arbitrária de código, substituição da fila/RPC, escrita sem aprovação em ações sensíveis ou um segundo sistema de status de tasks.

## 10. Critérios de conclusão

- Nenhuma task é executada sem ser reivindicada e validada pelas regras do Supabase.
- Uma execução interrompida pode ser retomada sem duplicar efeitos já confirmados.
- O resultado final e a liberação do lock passam por `finalizar_task`.
- Falhas, tentativas e aprovações ficam rastreáveis sem armazenar segredos.
- Ferramentas disponíveis ao agente são tipadas, limitadas e autenticadas.
- A interface mostra o status oficial da fila e não confunde checkpoint com conclusão.
- A implementação e a documentação respeitam esta especificação; qualquer desvio é registrado e justificado no detalhe da SUB-28.
