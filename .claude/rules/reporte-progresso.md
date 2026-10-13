# 📡 Reporte de progresso ao monitor (opcional)

Agentes conectados ao MCP do Dashboard AI podem reportar o andamento ao **monitor em tempo real**
com a ferramenta `agent_event` ([`api/_lib/event-tools.ts`](../../api/_lib/event-tools.ts)), que
grava em `agent_events`.

> ⚠️ **Complementar:** a reserva só vale quando está commitada e com push no `tasks/STATUS.md`. Um
> evento `trava`, `inicio` ou `fim` no monitor não reserva, não libera e não conclui nada. MCP fora
> do ar → seguir só com o quadro.

## Quando emitir

Um evento por momento, com `agente` igual ao nome da frente e `task_codigo` da subtarefa.

| Momento | `tipo` | Exemplo de `mensagem` |
|---|---|---|
| Logo após o push da reserva | `inicio` | `Assumida SUB-XX.N` |
| Etapas relevantes (implementação, testes, build) | `progresso` (com `etapa`) | `npm test verde` |
| Trabalho longo, a cada ~5 min sem outro evento | `heartbeat` | `Ainda em SUB-XX.N` |
| Falha que impede a entrega | `erro` (com `status`) | `typecheck falhou em src/lib/x.ts` |
| Depois do push da entrega | `fim` | `Entregue em abc1234` |

## Exemplo (`tools/call`)

```json
{ "jsonrpc": "2.0", "id": 1, "method": "tools/call",
  "params": { "name": "agent_event", "arguments": {
    "project": "default", "agente": "Grok (Grok 4.7) (nuvem · main)", "tipo": "fim",
    "task_codigo": "SUB-XX.N", "mensagem": "Entregue em abc1234",
    "chave_idempotencia": "fim:SUB-XX.N:abc1234" } } }
```

## Regras

- `chave_idempotencia` em eventos que podem ser reenviados (`inicio:<COD>`, `fim:<COD>:<sha>`):
  reenvios com a mesma chave são ignorados.
- Mensagens curtas (≤ 2.000 caracteres), sem segredos, tokens, chaves ou dados pessoais.
- Falha ao emitir **não** bloqueia a subtarefa: anotar na seção e seguir.
- Quem não usa o MCP não precisa emitir: `scripts/espelhar_quadro_eventos.py` converte os commits
  `lock:` / `feat(<COD>)` / `docs(board): concluir <COD>` em eventos.
