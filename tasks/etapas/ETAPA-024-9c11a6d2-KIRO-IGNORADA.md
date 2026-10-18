## Etapa 024-9c11a6d2 — SUB-63: Mover KIRO-DEV-CLONE para TASK_IGNORED.md

**Tarefa:** SUB-63 · **Pedido em:** 2026-10-17 · **Criada por:** Codex (local · main)
**Pedido:** “mova a tarefa KIRO-DEV-CLONE inteira para TASK_IGNORED.md”
**Objetivo:** retirar a tarefa KIRO-DEV-CLONE do quadro ativo e preservar seu conteúdo integral
em `TASK_IGNORED.md`.

### Escopo

- **Entra:** transferir a linha-mãe e as 30 subtarefas de KIRO-DEV-CLONE do quadro ativo;
  transferir o conteúdo detalhado da ETAPA-008 para `TASK_IGNORED.md`; deixar a ETAPA-008 como
  referência para o arquivo de tarefas ignoradas; manter a linha da ETAPA-008 no índice histórico.
- **Não entra:** apagar código ou dados do projeto KIRO; reativar ou executar qualquer subtarefa;
  remover os demais itens do quadro.
- **Arquivos previstos:** `tasks/STATUS.md`, `tasks/etapas/ETAPA-008-f301fc16-KIRO-DEV-CLONE.md`,
  `tasks/etapas/ETAPA-024-9c11a6d2-KIRO-IGNORADA.md` e `TASK_IGNORED.md`.

### Critério de pronto

As 31 linhas e o conteúdo integral da etapa original estão em `TASK_IGNORED.md`; não há linhas
KIRO-DEV-CLONE na tabela de tarefas abertas; a ETAPA-008 aponta para o arquivo de destino e
permanece acessível pelo índice de etapas. Nenhum conteúdo ou anotação é perdido.

### Riscos e plano B

- **Risco:** perder status, dependências, trava especial ou anotações ao mover muitas linhas.
- **Mitigação:** preservar literalmente os registros e comparar IDs e conteúdo antes/depois por
  leitura dos arquivos e contagem das linhas; sem testes ou navegador.
- **Plano B:** se a comparação encontrar diferença, restaurar os arquivos do diff antes do commit.

### Aprovação

Aprovado pelo usuário em 2026-10-17 21:35 (“faca a task sub-63”), registrado por
Claude Code (Opus 5.5) (local · main).

- **Decisão (2026-10-17, Claude Code):** o destino é `tasks/TASK_IGNORED.md`, ao lado do
  `task_complete.md`; o arquivo já existia vazio e sem versionar nessa pasta.

### SUB-63.1 — Transferir KIRO-DEV-CLONE inteira para TASK_IGNORED.md

**Próximo passo:** mover as 31 linhas e o conteúdo da ETAPA-008 para `tasks/TASK_IGNORED.md` e
conferir a preservação de todos os IDs.

- **Nível:** PESADO — mudança em massa de uma tarefa com 30 subtarefas em vários arquivos.
- **Modelo:** só Claude Code com Opus 5.5 ou superior, ou Fable.
- **Descrição:** transferir a tabela da tarefa e todo o conteúdo da ETAPA-008 para o arquivo
  `TASK_IGNORED.md`; manter a ETAPA-008 como referência e remover as linhas KIRO do quadro ativo.
- **Critérios de Aceitação:** todos os 31 IDs, estados, dependências, trava e descrições preservados;
  quadro ativo sem linhas KIRO; referência da etapa acessível; diff conferido.
- **Verificação:** comparar as linhas e seções de origem com o destino por leitura e contagem; não
  executar testes nem abrir navegador.
- **Entrega:** pendente.

### SUB-63.2 — Aceite do usuário

**Próximo passo:** depois da transferência, apresentar o resultado para o usuário confirmar.

- **Nível:** LEVE — aceite do usuário, sem alteração de arquivos.
- **Modelo:** Usuário.
- **Descrição:** confirmar que a tarefa inteira foi preservada no arquivo de ignoradas e saiu do
  quadro ativo.
- **Critérios de Aceitação:** aceite registrado nesta etapa.
- **Entrega:** pendente.
