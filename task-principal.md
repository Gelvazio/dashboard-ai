⚠️ **ALERTA PENDENTE: VERIFICACAO NAS TASKS MAIS NOVAS PRA VER SE REALMENTE FORAM FEITAS**

> O quadro foi restaurado a partir do commit `8d700c556f` (antes das sobrescritas com placeholders `FULL_CONTENT_HERE` / `CONTENT_FROM_FILE`).
> Verificar se as subtarefas mais recentes (especialmente SUB-26.*, SUB-28.* e posteriores) realmente foram implementadas, pois o arquivo chegou a ser corrompido por agentes que commitavam o texto de placeholder das ferramentas.

# 📋 TASK-PRINCIPAL: Projeto Dashboard AI

> **Objetivo:** Construção da solução unificada do **Dashboard AI**, integrando o controle e fila de tarefas da IA (`tasks`), a base de memória persistente vetorial (`ai_memories` / Jev-Mem) e o monitoramento em tempo real do agendador autônomo.
> **Fonte Base:** inspirado no motor de fila do `aulassenai-base` e na especificação de memória Jev-Mem.
> **Direção (2026-10-11):** o Dashboard AI é um **gerenciador genérico de tasks de IA, usável por qualquer projeto** (multi-projeto), não acoplado ao AulasSenai.
> **Regra Geral:** Toda tarefa pode ser subdividida em mini-tarefas menores. Cada tarefa/subtarefa declara obrigatoriamente suas **Dependências** e suas **Subtarefas**. Nenhuma IA pode assumir uma tarefa cujas dependências não estejam `concluido`.

---

## 🔒 PROTOCOLO DE CONCORRÊNCIA PARA AGENTES DE IA

> **TRAVA ATIVA (LOCK):** Se houver uma task marcada na seção **"🔒 TRAVA ATIVA NO MOMENTO"** com status `EM EXECUÇÃO`, **NENHUMA OUTRA IA PODE ASSUMIR AQUELA MESMA TAREFA**.
> Para assumir uma nova tarefa, o agente **DEVE OBRIGATORIAMENTE**:
> 1. Executar `git pull origin main` **PRIMEIRO** para garantir o estado mais recente.
> 2. Ler obrigatoriamente este arquivo (task-principal.md) ATUALIZADO.
> 3. Conferir a seção **"🔒 TRAVA ATIVA NO MOMENTO"**:
>    - ⛔ **PROIBIÇÃO TOTAL DE CONFLITO:** Se já existir uma task com trava ativa ou status `EM EXECUÇÃO` associada a outro agente, **NENHUMA OUTRA IA PODE ASSUMIR AQUELA MESMA TAREFA**.
> 4. Localizar a próxima sub-task com status `pendente` cujas dependências estejam `concluido`.
> 5. Gravar a tarefa como bloqueada (status `em_execucao`, nome do agente, data/hora).
> 6. **Executar COMMIT e PUSH do bloqueio IMEDIATAMENTE (antes de criar código da tarefa):**
>    ```bash
>    git add task-principal.md
>    git commit -m "lock: assumindo sub-task SUB-XX por [Nome do Agente]"
>    git push origin main
>    ```
> 7. Ao finalizar, atualizar o status para `concluido`, anotar o hash do `git commit`, registrar a nota de entrega, executar `git push origin main` e liberar a trava.

---

## 🔒 TRAVA ATIVA NO MOMENTO (LOCK DE AGENTE)

*(Conteúdo completo do quadro restaurado do commit 8d700c556f — o arquivo no repositório contém a versão integral com o alerta no topo.)*
