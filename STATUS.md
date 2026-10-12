# STATUS — Dashboard AI

**Objetivo:** gerenciador genérico de tasks de IA multi-projeto (fila, memória persistente e monitor dos agentes).
**Partes interessadas:** Gelvazio (decide, aprova e usa) · agentes de IA (executam pelo quadro)
**Links:** [Regras](AGENTS.md) · [Planos](docs/) · [Quadro](task-principal.md) · [Concluídas](task_complete.md)
**Próximo passo:** aceite do usuário da Etapa 2 (prioridades e revisão do `AGENTS.md`). A verificação geral ficou para depois como `SUB-38` (prioridade `MAXIMA`), a partir do bloco SUB-28

Legenda: ⬜ Pendente · 🔄 Em progresso · ✅ Concluído · ⛔ Bloqueado

## Histórico anterior

| Subtarefa | Status | Nota |
|---|---|---|
| SUB-33.5 | Concluída | `api/embedding.ts` configurado no Vercel com duração máxima de 15 segundos; commit `1d68ea6` publicado em `origin/main`. |

## Escopo
- **Entra:** verificação (somente leitura) de todas as tarefas e subtarefas dos quadros, com o marcador `VERIFICADOR-CLAUDE`.
- **Não entra:** correção de código; mudança de status, travas ou confirmações já registradas.
- **Critério de pronto:** nenhum marcador `PENDENTE`; relatório de ressalvas e falhas entregue ao usuário.
- **Premissas e restrições:** sem navegador; commit e push a cada item verificado; sem Docker/Postgres local (integração não roda).

## Etapa 1 — Verificação geral `VERIFICADOR-CLAUDE` (pedida em 2026-10-12)
| Item | Descrição | Status | Concluído em | Verificação |
|------|-----------|--------|--------------|-------------|
| 1.1 | Plano em `docs/verificador-claude.md` | ✅ Concluído | 2026-10-12 15:25 | arquivo criado |
| 1.2 | Marcador `PENDENTE` nos 246 blocos | ✅ Concluído | 2026-10-12 15:25 | 15 + 231 marcadores (`grep -c`) |
| 1.3 | Validação geral (typecheck, testes, build, Python) | ✅ Concluído | 2026-10-12 15:25 | tabela em `docs/verificador-claude.md` |
| 1.4 | Verificar os 15 blocos do `task-principal.md` | ⛔ Bloqueado | — | 6 feitos; adiado pelo usuário → `SUB-38` |
| 1.5 | Verificar os 231 blocos do `task_complete.md` | ⬜ Pendente | — | marcador de cada bloco |
| 1.6 | Relatório final de ressalvas e falhas | ⬜ Pendente | — | — |
| 1.7 | Aceite do usuário | ⬜ Pendente | — | — |

## Etapa 2 — Prioridade das tarefas e revisão do `AGENTS.md` (pedida em 2026-10-12)
| Item | Descrição | Status | Concluído em | Verificação |
|------|-----------|--------|--------------|-------------|
| 2.1 | Revisar os textos do `AGENTS.md` e corrigir erros | ✅ Concluído | 2026-10-12 15:55 | links, numeração, `--force`, regra de confirmação e exemplo do plano conferidos |
| 2.2 | Regra de prioridade (seção 1.2 do `AGENTS.md`, quadro e skill `proxima-task`) | ✅ Concluído | 2026-10-12 15:55 | `MAXIMA` → `ALTA` → `MEDIA` → `BAIXA`; `BAIXA` só com orientação do usuário |
| 2.3 | Campo `Prioridade` em todos os blocos | ✅ Concluído | 2026-10-12 15:55 | 15 + 231 blocos; SUB-25.8 fica para depois (travada por outro agente) |
| 2.4 | Verificação geral como tarefa `SUB-38` (`MAXIMA`) | ✅ Concluído | 2026-10-12 15:55 | bloco no `task-principal.md` |
| 2.5 | Aceite do usuário | ⬜ Pendente | — | — |

## Riscos
| Risco | Chance | Impacto | Plano B | Situação |
|-------|--------|---------|---------|----------|
| Outro agente editar o quadro ao mesmo tempo | Média | Conflito no push | `git pull --rebase` antes de cada push | Acompanhando |
| Testes de integração não rodam aqui | Certa | Itens de banco sem prova local | Conferir código, SQL e registros do `docs/VALIDACAO.md`; marcar ressalva | Aceito |

## Bloqueios
| Data | Item | Motivo | O que destrava | Resolvido em |
|------|------|--------|----------------|--------------|
| 2026-10-12 | 1.4 / 1.5 | Usuário pediu para deixar a verificação geral para depois | Um agente assumir a `SUB-38` | — |

## Registro de decisões
| Data | Decisão | Quem | Por quê |
|------|---------|------|---------|
| 2026-10-12 | Verificar todas as tarefas com o marcador `VERIFICADOR-CLAUDE`, commit e push por item | Gelvazio | Pedido explícito no chat |
| 2026-10-12 | Problemas achados são só registrados, não corrigidos | Claude Code | O pedido foi "apenas leia e verifique" |
| 2026-10-12 | Verificação geral adiada e registrada como `SUB-38`, prioridade `MAXIMA` | Gelvazio | Pedido no chat |
| 2026-10-12 | Prioridade em todas as tarefas; agentes pegam pela maior prioridade, `BAIXA` só com orientação do usuário | Gelvazio | Pedido no chat |
| 2026-10-12 | Prioridades iniciais: SUB-38 `MAXIMA`; SUB-25 e SUB-25.8 `ALTA` (build quebrado); KIRO-DEV-CLONE `BAIXA`; demais `MEDIA` (concluídas só como histórico) | Claude Code | Padrão `MEDIA`; o usuário pode ajustar |

## Pendências (ficou para depois)
| Item | Motivo | Quando retomar |
|------|--------|----------------|
| `Prioridade: ALTA` e `VERIFICADOR-CLAUDE` na SUB-25.8 | Bloco travado por DeepSeek Harness; editar causaria conflito | Quando a trava for liberada |

## Lições aprendidas
| Data | O que aconteceu | Lição / nova regra |
|------|-----------------|--------------------|
