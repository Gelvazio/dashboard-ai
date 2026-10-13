## Etapa 003-6df4b821 — SUB-28: Integração LangChain/LangGraph para Execução de Tasks

**Tarefa:** SUB-28 · **Migrada em:** 2026-10-13 (ETAPA-001) · **Executor:** por subtarefa (coluna "Em uso por" do `tasks/STATUS.md`)
**Próximo passo:** escolher uma subtarefa livre no `tasks/STATUS.md` (cada subtarefa tem o próprio próximo passo abaixo).

> Bloco migrado do `task-principal.md` sem alterar o texto. **Status, prioridade, dependências e reserva** de cada subtarefa ficam só no [`tasks/STATUS.md`](../STATUS.md); aqui ficam descrição, critérios, entrega e anotações. Quem reserva uma subtarefa edita só a seção dela.

### Tarefa-mãe

- **Descrição:** Implementar a orquestração multi-etapas de execução descrita em `LangChain_LangGraph.md`, mantendo Supabase como autoridade sobre a fila, dependências, locks, tentativas e resultado. Integrar o worker LangGraph às RPCs existentes e às ferramentas MCP autorizadas, com checkpoint durável, retomada, tratamento de falhas e aprovação humana para ações sensíveis.
- **Critérios de Aceitação:** A task só inicia após todas as dependências SUB-01 a SUB-27 concluídas; execução reivindicada por `pegar_proxima_task`; estado do grafo é retomável e não duplica efeitos; escrita ocorre por ferramentas autenticadas e autorizadas; ações sensíveis pausam para aprovação; conclusão/erro e liberação do lock passam por `finalizar_task`; documentação de operação e segurança atualizada conforme `LangChain_LangGraph.md`.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** ⚠️ RESSALVA — 2026-10-12 15:40 (Devin): Todas as 34 subtarefas marcadas como concluídas com commits; 33 commits verificados (fc379a6, 3642a8d, 21c908b, 06e7e4b, 999d1e0, 463b3d9, 07ca06f, 6ebd647, 9cf0e2a, b1c35a9, 9575b13, 0d9c835, 1bd4ca7, 206ba39, ba04cc1, 2adb51d, 46718f9, 18c8d9d, a9bb258, 048e647, 04c0f02, c18fcbd, fa99fe2, 057b3a1, 3345ccd, 07b64cc, 52df1e7, fbef4e8, 0e7a40c, 9b27e51, 8a43f2b, ff049de, 8bc3b99). 1 commit incorreto no quadro: SUB-28.33 cita 76f243e (não existe), mas o commit cfe88af existe e é a entrega real. Arquivos do worker todos presentes (worker/ com 15 arquivos).
