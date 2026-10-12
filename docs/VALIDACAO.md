# Validação local (SUB-25.2)

Registro da execução de `npm ci && npm run validar` com todas as tasks anteriores concluídas.
Nada foi corrigido nesta etapa: falhas viram subtarefas novas (SUB-25.8+).

- **Data:** 2026-10-12 13:33 UTC
- **Executor:** Devin (Cognition AI)
- **Commit validado:** `d284472` (`main`)
- **Node:** v22.12.0 (exigido pelo `engines`: `>=22.12`)
- **npm:** 10.8.3
- **`npm ci`:** OK (173 pacotes)

## Resultado do `npm run validar`

| Etapa | Comando | Resultado | Tempo |
|---|---|---|---|
| typecheck | `npm run typecheck` | OK | 12s |
| testes | `npm test` | OK | 9s |
| build | `npm run build` | OK | 8s |
| chunks | `npm run check:chunks` | OK | 0s |
| env | `npm run check:env` | OK | 0s |
| python | `python3 -m unittest discover -s scripts` | OK (13 testes) | 0s |
| audit | `npm audit --omit=dev --audit-level=high` | OK (0 vulnerabilidades) | 1s |

Fora do `validar`, `npm run typecheck:worker` também passou.

### Testes (`vitest run`)

- **Arquivos:** 39 aprovados, 8 pulados (47)
- **Testes:** 268 aprovados, 30 pulados (298), 0 falhas
- Os pulados dependem de banco e são pulados por `describe.skipIf` quando não há configuração:
  - os 8 arquivos `tests/integration/*.integration.test.ts` (rodam com `npm run test:integration`, SUB-25.6);
  - o bloco contra Postgres de `tests/unit/worker-checkpointer.test.ts` (exige `LANGGRAPH_DATABASE_URL`; o restante do arquivo roda).

### Chunks do build (`check:chunks`, limite 500 kB)

16 chunks, todos dentro do limite. Maiores:

| Chunk | Tamanho |
|---|---|
| `react-vendor` | 390.1 kB |
| `supabase` | 209.1 kB |
| `index` | 53.9 kB |
| `MemoriaView` | 35.8 kB |
| `FilaView` | 25.8 kB |
| `MonitorView` | 18.7 kB |
| `SaudeFilaPanel` | 12.6 kB |

CSS: `index.css` com 63.42 kB (10.79 kB gzip).

### Avisos (não bloqueiam)

`check:env` avisa que `LANGGRAPH_DATABASE_URL` e `WORKER_MODELO` estão no `.env.example`, mas não aparecem em `src/`, `api/` ou `scripts/`. As duas são usadas pelo worker (`worker/`), que o script não varre.

## Falhas encontradas

Nenhuma. Nenhuma subtarefa SUB-25.8+ foi criada.

## Suíte do banco (SUB-25.3)

`database/tests/run_tests.sh` em 2026-10-12 13:37 UTC, commit `24c10c5`, contra PostgreSQL 16.15 com pgvector (imagem `pgvector/pgvector:pg16` em Docker local, banco descartável `dashai_test`):

```bash
PSQL="docker exec -i -w /repo/database pg-dash psql -U postgres" bash database/tests/run_tests.sh
```

| Verificação | Resultado |
|---|---|
| Schema `00`–`06` aplicado 2x (idempotência) | OK |
| `tests/test_multi_projeto.sql` (RLS, fila, memória) | OK, 72 verificações |
| `tests/test_recados_regras.sql` (SUB-31) | OK, 46 verificações |
| `tests/test_paralelo.sh`: 12 agentes em paralelo | OK, 60 tasks de 3 projetos sem duplicidade |
| `tests/test_paralelo.sh`: `p_exclusivo=true` com 10 chamadas simultâneas | OK, 1 task entregue |

Saída: exit 0. Nenhuma falha, então nenhuma SUB-25.8+ foi criada.

## Integração do frontend (SUB-25.6)

`npm run test:integration` (`tests/integration/run.sh`) em 2026-10-12 13:40 UTC, commit `70481d6`, contra PostgreSQL 16.15 + pgvector (Docker `pgvector/pgvector:pg16`, porta 5432, banco descartável `dashai_front_test`) e PostgREST 12.2.3 (binário estático oficial) com segredo JWT aleatório:

```bash
PSQL="docker exec -i -w /repo pg-dash psql -U postgres" POSTGREST_BIN=/caminho/postgrest npm run test:integration
```

- **Arquivos:** 8 aprovados (8): `agentEvents`, `authService`, `eventService`, `logService`, `memoryService`, `projectService`, `supabase`, `taskService` (`*.integration.test.ts`)
- **Testes:** 29 aprovados (29), 0 falhas
- Saída: exit 0. Nenhuma falha, então nenhuma SUB-25.8+ foi criada.

## Telas Fila e Logs contra o Supabase de produção (SUB-25.4)

Em 2026-10-12, por Claude Code (Opus 5.5), com `npm run build` + `vite preview` (`http://localhost:4173`)
apontando para o Supabase de produção (`fcmntkzpjoetdabllabn`, scripts `00` a `07` aplicados).

| Conferência | Como | Resultado |
|---|---|---|
| Tela de login em 1280x800 e 390x844 | painel do navegador do app | OK: formulário, "Entrar com link", "Esqueci a senha" e "Criar usuário"; sem rolagem horizontal; sem aviso de Supabase não configurado |
| Console da tela de login | painel do navegador do app | OK: nenhuma mensagem |
| Telas **Fila** e **Logs** logado | navegador do usuário (relato no chat: "eu já validei isso") | OK segundo o usuário; tamanhos e console não informados |
| RLS das consultas das telas (`projects`, `tasks`, `agendamento_tarefa_logs`) como o admin `gelvazio@gmail.com` | MCP do Supabase, `set local role authenticated` + `request.jwt.claims`, transação desfeita | OK: administrador; vê o projeto `default`; 0 tasks e 0 logs (banco novo) |
| Mesmas consultas como usuário logado sem projeto | idem, `sub` aleatório | OK: 0 projetos, 0 tasks, 0 logs |
| Mesmas tabelas como `anon` | `has_table_privilege` | OK: sem permissão de leitura |

Ressalva: a sessão não pôde ser aberta no painel do navegador do app (o login do usuário foi feito
em outro navegador), então as telas logadas não foram conferidas pela IA. Banco ainda sem tasks e
logs: a conferência das telas foi do estado vazio.

## Telas Memória e Configurações contra o Supabase de produção (SUB-25.7)

Em 2026-10-12, por Claude Code (Opus 5.5), com o mesmo `vite preview` (`http://localhost:4173`) da SUB-25.4,
apontando para o Supabase de produção (`fcmntkzpjoetdabllabn`).

| Conferência | Como | Resultado |
|---|---|---|
| Telas **Memória** e **Configurações** logado | navegador do usuário (relato no chat: "eu já validei isso") | OK segundo o usuário; tamanhos e console não informados |
| `ai_memories` (do projeto e globais) como o admin | MCP do Supabase, `set local role authenticated` + `request.jwt.claims`, transação desfeita | OK: 0 e 0 (banco novo) |
| `projects` e `project_members` como o admin | idem | OK: 1 projeto (`default`), 0 membros |
| Mesmas tabelas como usuário logado sem projeto | idem, `sub` aleatório | OK: 0 memórias, 0 projetos, 0 membros |
| `ai_memories` e `match_memories` para `anon` | `has_table_privilege` / `has_function_privilege` | OK: sem leitura e sem execução; `authenticated` executa `match_memories` |

Ressalva: como na SUB-25.4, as telas logadas foram conferidas só pelo usuário (a sessão não abriu no
painel do navegador do app), no estado vazio do banco.

## Monitor em tempo real contra o Supabase de produção (SUB-35.32)

Em 2026-10-12, por Claude Code (Opus 5.5), com o `vite preview` (`http://localhost:4173`) apontando para
o Supabase de produção (`fcmntkzpjoetdabllabn`). Eventos de teste inseridos e apagados pelo MCP do
Supabase com autorização do usuário; tela **Monitor** observada pelo usuário no navegador dele, logado.

| Passo | Resultado |
|---|---|
| 5 eventos (`inicio`, `progresso`, `heartbeat`, `erro`, `fim`) do agente "Teste SUB-35.32", 21:58:33–21:59:01 UTC | Gravados; `atividade_atual_agentes()` mostra o agente com o último evento `fim` |
| Console da tela Monitor | **Falha encontrada:** `Uncaught Error: "bar" is not a registered controller` (Chart.js) |
| Causa | `src/lib/charts.ts` registrava o `BarElement`, mas não o `BarController`, usado por `GraficoPorAgente` e `LinhaDoTempoAgentes` (`new Chart({ type: 'bar' })`); o erro só aparece quando há eventos |
| Correção (`4f4e90f`) | `BarController` registrado; teste de regressão `tests/unit/charts.test.ts` (falhava antes, passa depois); `npm run validar` verde |
| Recarregar a tela com a correção | OK segundo o usuário: gráficos exibidos, sem o erro |
| 2 eventos novos (`progresso`, `fim`) de outro agente, "Teste SUB-35.32 (tempo real)", 22:01:55–22:01:58 UTC, com a tela aberta | OK segundo o usuário: cards, feed e gráficos atualizaram **sem recarregar** |
| Limpeza | 7 eventos de teste apagados (`chave_idempotencia like 'teste-sub-35.32:%'`); `agent_events` com 0 linhas |

Ressalva: screenshots não foram tirados (as telas logadas foram vistas só pelo usuário); temas claro e
escuro e o tamanho 390x844 não foram informados.
