# STATUS — Dashboard AI

**Objetivo:** gerenciador genérico de tasks de IA multi-projeto (fila, memória persistente e monitor dos agentes).
**Partes interessadas:** Gelvazio (decide, aprova e usa) · agentes de IA (executam pelo quadro)
**Links:** [Regras](AGENTS.md) · [Planos](docs/) · [Quadro](task-principal.md) · [Concluídas](task_complete.md)
**Próximo passo:** Etapa 7 — executar SUB-40.1 a 40.6 em sequência (uma trava por vez) e pedir autorização para a 40.7. Pendentes também: aceite da Etapa 2 e a verificação geral `SUB-38` (`MAXIMA`), a partir do bloco SUB-28

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

## Etapa 3 — Tarefas do `TASKS-SUGERIDAS.md` no quadro (pedida em 2026-10-12)
| Item | Descrição | Status | Concluído em | Verificação |
|------|-----------|--------|--------------|-------------|
| 3.1 | Conferir cada sugestão contra o código da `main` | ✅ Concluído | 2026-10-12 16:45 | 36.1 e 36.6 já resolvidas; 36.3 e 36.4 com dados corrigidos |
| 3.2 | Criar SUB-39 (mãe) e SUB-39.1 a 39.5 com prioridade | ✅ Concluído | 2026-10-12 16:45 | 39.1 `BAIXA`; demais `MEDIA`; resumo do quadro recalculado |
| 3.3 | Aceite do usuário | ⬜ Pendente | — | — |

## Etapa 4 — Executar SUB-39.2, SUB-39.3 e SUB-39.4 (pedida em 2026-10-12)
| Item | Descrição | Status | Concluído em | Verificação |
|------|-----------|--------|--------------|-------------|
| 4.1 | SUB-39.2: allowlist do contrato igual ao `worker/ferramentas.ts` | ✅ Concluído | 2026-10-12 17:58 | `e7a08be`; `typecheck:worker` verde |
| 4.2 | SUB-39.3: sem `as any` em `worker/fila.ts` e `worker/falhas.ts` | ✅ Concluído | 2026-10-12 | `5df4f1d`; typecheck e testes verdes |
| 4.3 | SUB-39.4: fábrica `worker/grafoFabrica.ts` usada pelo `worker/index.ts` | ✅ Concluído | 2026-10-12 | `e789db4`; typecheck e testes verdes |
| 4.4 | Achado: teste do supabase falha com `.env` local → SUB-39.6 | ✅ Concluído | 2026-10-12 | bloco criado no quadro |
| 4.5 | Aceite do usuário | ⬜ Pendente | — | — |

## Etapa 5 — Task de login com cadastro de usuário e administrador inicial (pedida em 2026-10-12)
| Item | Descrição | Status | Concluído em | Verificação |
|------|-----------|--------|--------------|-------------|
| 5.1 | Criar SUB-40 (mãe) e SUB-40.1 a 40.7 no quadro, com dependências e prioridade `MEDIA` | ✅ Concluído | 2026-10-12 | resumo do quadro recalculado; commit e push para outro agente assumir |
| 5.2 | Execução das SUB-40.x por algum agente (fila do quadro) | ⬜ Pendente | — | — |
| 5.3 | Aceite do usuário | ⬜ Pendente | — | — |

## Etapa 5 — Executar SUB-39.5 e SUB-39.6 (pedida em 2026-10-12)
| Item | Descrição | Status | Concluído em | Verificação |
|------|-----------|--------|--------------|-------------|
| 5.1 | SUB-39.5: `api/aprovacao.ts` usa a fábrica do worker | ✅ Concluído | 2026-10-12 | `2ce9adf`; typecheck e testes verdes |
| 5.2 | SUB-39.6: teste `sem_config` independente do `.env` local | ✅ Concluído | 2026-10-12 | `3c18f1f`; `npm test` verde com e sem `.env` |
| 5.3 | Aceite do usuário | ⬜ Pendente | — | — |

## Etapa 6 — Lição do resumo como regra no `AGENTS.md` (pedida em 2026-10-12)
| Item | Descrição | Status | Concluído em | Verificação |
|------|-----------|--------|--------------|-------------|
| 6.1 | Regra 9 da seção 1.1 do `AGENTS.md`: no resumo, editar só o próprio item | ✅ Concluído | 2026-10-12 | `26e949b`; texto genérico, sem citar tarefas |

## Etapa 7 — Executar a SUB-40 (login com cadastro e admin inicial) (pedida em 2026-10-12)
Plano: [`docs/login-cadastro-admin-inicial.md`](docs/login-cadastro-admin-inicial.md)
| Item | Descrição | Status | Concluído em | Verificação |
|------|-----------|--------|--------------|-------------|
| 7.1 | SUB-40.1 SQL `database/08_admin_inicial.sql` | ✅ Concluído | 2026-10-12 18:15 | `e64524e`; leitura do SQL (sem Postgres local) |
| 7.2 | SUB-40.2 `validarCadastro` e mensagens em `src/lib/auth.ts` | ✅ Concluído | 2026-10-12 18:24 | `b2a9289`; typecheck e testes verdes |
| 7.3 | SUB-40.3 `cadastrarUsuario` em `src/services/authService.ts` | ✅ Concluído | 2026-10-12 18:25 | `a48672a`; typecheck e testes verdes |
| 7.4 | SUB-40.4 `CadastroForm.tsx` | ✅ Concluído | 2026-10-12 18:27 | `a86f688`; typecheck e build verdes; sem script de lint no projeto |
| 7.5 | SUB-40.5 Entrar/Criar usuário na `LoginView` | ✅ Concluído | 2026-10-12 18:29 | `d7b0fba`; npm run validar verde |
| 7.6 | SUB-40.6 Documentação | 🔄 Em progresso | — | — |
| 7.7 | SUB-40.7 Aplicar SQL no Supabase (só com autorização) | ⬜ Pendente | — | — |
| 7.8 | Aceite do usuário | ⬜ Pendente | — | — |

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
| 2026-10-12 | Regras novas só no `AGENTS.md` (vale para todas as IAs); `CLAUDE.md` do projeto só importa o `AGENTS.md`; tarefa concluída sempre movida para o `task_complete.md` | Gelvazio | Pedido no chat |
| 2026-10-12 | Plano em `docs/` obrigatório para tarefas grandes vale para todas as IAs (seção 6 do `AGENTS.md`, `efc7719`) | Gelvazio | Pedido no chat: outras IAs devem fazer o mesmo que o Claude Code |
| 2026-10-12 | Admin `gelvazio@gmail.com` criado só pelo banco (trigger em `auth.users`) e só após a confirmação do e-mail | Claude Code | Evitar que o frontend escolha papel e que alguém se registre com o e-mail sem acesso à caixa |
| 2026-10-12 | Sugestões viram SUB-39.x (SUB-36 já existe); 36.1 e 36.6 descartadas por já estarem feitas; 36.5 dividida em 39.4 e 39.5 | Claude Code | Pedido do usuário para ajustar as tarefas |
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
| 2026-10-12 | Ao concluir a SUB-39.6, o resumo do quadro foi reescrito com uma lista fixa de "livres" e apagou SUB-40.1/40.2, criadas por outro agente no meio do trabalho | Editar o resumo só por trechos (adicionar/remover o próprio item), nunca reescrever a linha inteira; reler o quadro após o `pull` antes de cada edição |
