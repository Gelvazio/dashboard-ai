# 📌 QUADRO DE CONTROLE DE EXECUÇÃO: `quadro-task-principal.md`

> **REGRA FUNDAMENTAL DE CONCORRÊNCIA PARA AGENTES DE IA:**
> ⚠️ **TRAVA ATIVA (LOCK):** Se houver uma task marcada na seção **"🔒 TRAVA ATIVA NO MOMENTO"** com status `EM EXECUÇÃO`, **NENHUMA OUTRA IA PODE ASSUMIR AQUELA MESMA TAREFA**.
> Para assumir uma nova tarefa, o agente **DEVE OBRIGATORIAMENTE**:
> 1. Verificar se a trava está livre ou se a task anterior foi finalizada.
> 2. Registrar seu nome/ID de agente, data/hora e o código da sub-task neste quadro antes de iniciar o código.
> 3. Ao finalizar, atualizar o status para `CONCLUÍDO`, anotar o hash do `git commit`, registrar a nota de entrega e liberar a trava.

---

## 🔒 TRAVA ATIVA NO MOMENTO (LOCK DE AGENTE)

| Propriedade | Valor Atual |
|---|---|
| **Status da Trava:** | 🟢 **LIVRE** (Nenhuma sub-task travada no momento) |
| **Sub-task em Execução:** | *Nenhuma* |
| **Título da Sub-task:** | *Aguardando próximo agente* |
| **Agente Responsável:** | *Nenhum* |
| **Data e Hora de Início:** | *--* |
| **Bloqueio para Outras IAs:** | **DESATIVADO** (Fila liberada para a próxima sub-task pendente) |

---

## 🚦 QUADRO KANBAN DE SUB-TASKS

### 🔄 EM EXECUÇÃO (0)
*(Nenhuma no momento)*

---

### ⏳ PENDENTES (26)

| Código | Título da Mini-task | Prioridade | Fase |
|---|---|---|---|
| **SUB-01** | Setup do Projeto Frontend (Vite + React + TS + Tailwind) | 1 (Alta) | Fase 1 |
| **SUB-02** | Estrutura Modular de Diretórios do Frontend | 1 (Alta) | Fase 1 |
| **SUB-03** | Configuração do Cliente Supabase e Tipagem TypeScript | 1 (Alta) | Fase 1 |
| **SUB-04** | Consolidação dos Schemas SQL na Pasta `database/` | 2 | Fase 2 |
| **SUB-05** | Consolidação das Funções RPC e Triggers no Banco | 2 | Fase 2 |
| **SUB-06** | Estrutura do Endpoint Serverless Vercel MCP | 2 | Fase 3 |
| **SUB-07** | Implementação das Primitivas de Memória e Embeddings | 2 | Fase 3 |
| **SUB-08** | Configuração de Variáveis de Ambiente e `.env.example` | 2 | Fase 3 |
| **SUB-09** | Serviço de Tarefas (`src/services/taskService.ts`) | 3 | Fase 4 |
| **SUB-10** | Serviço de Memória Semântica (`src/services/memoryService.ts`) | 3 | Fase 4 |
| **SUB-11** | Serviço de Logs do Agendador (`src/services/logService.ts`) | 3 | Fase 4 |
| **SUB-12** | Layout Principal Responsivo (Sidebar + Header + Navegação) | 3 | Fase 5 |
| **SUB-13** | Painel de Indicadores Gerais (KPI Cards) | 3 | Fase 5 |
| **SUB-14** | Tabela Avançada da Fila de Tasks | 3 | Fase 6 |
| **SUB-15** | Barra de Ferramentas e Filtros em Tempo Real | 3 | Fase 6 |
| **SUB-16** | Modal de Cadastro e Edição de Task | 3 | Fase 6 |
| **SUB-17** | Modal de Visualização Detalhada da Task | 3 | Fase 6 |
| **SUB-18** | Controles de Ação Rápida na Linha da Tabela | 3 | Fase 6 |
| **SUB-19** | Interface de Pesquisa Semântica Vetorial | 4 | Fase 7 |
| **SUB-20** | Formulário de Nova Memória Canônica | 4 | Fase 7 |
| **SUB-21** | Grid de Gerenciamento e Exclusão de Memórias | 4 | Fase 7 |
| **SUB-22** | Visualizador de Logs de Execução da IA | 4 | Fase 8 |
| **SUB-23** | Diagnóstico de Travas e Saúde da Fila | 4 | Fase 8 |
| **SUB-24** | Script de Sincronização de Tasks (`scripts/sincronizar_tasks.py`) | 5 | Fase 9 |
| **SUB-25** | Validação de Build e Execução Local | 5 | Fase 10 |
| **SUB-26** | Documentação Completa e Manual Operacional no `README.md` | 5 | Fase 10 |

---

### ✅ CONCLUÍDAS (0)
*(Aguardando conclusões)*

---

### ⛔ CANCELADAS (0)
*(Nenhuma cancelada)*

---

## 📜 HISTÓRICO DE COMMITS E ENTREGAS DOS AGENTES

| Data/Hora | Agente | Sub-task | Commit SHA | Anotação / O que foi feito |
|---|---|---|---|---|
| *Aguardando primeiro commit* | | | | |
