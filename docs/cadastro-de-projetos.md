# Plano: cadastro de projetos (SUB-45)

- **Criado em:** 2026-10-12
- **Executor:** Claude Code (Opus 5.5, sessão em nuvem)
- **Tarefa no quadro:** [`SUB-45`](../task-principal.md) (subtarefas SUB-45.1 a SUB-45.18)

## Objetivo

Completar a tabela `public.projects` com os campos que o usuário escolheu e criar a tela `#/projetos` para listar, criar, editar e ativar/inativar projetos.

## Escopo

**Entra:**
- `database/08_projects_campos.sql`, idempotente, com 8 colunas novas: `responsavel_id`, `data_prevista_fim`, `cor`, `icone`, `url_producao`, `url_documentacao`, `prioridade` e `tags`, cada uma com o seu `check`;
- teste SQL dos campos novos e aplicação no Supabase (só com autorização do usuário);
- tipos, validação (`validarProjeto`), serviço (`criarProjeto`, `atualizarProjeto`, `definirProjetoAtivo`), componentes e a tela `ProjetosView`, com rota e menu;
- documentação no `README.md` e no `database/README.md`.

**Não entra:**
- trocar `ativo boolean` por `status smallint`: o usuário decidiu manter o boolean, exibido como 1-ATIVO / 0-INATIVO;
- mudar a RLS de `projects`: hoje só o administrador cria e só o owner (ou admin) edita, o que já atende;
- mudar a ligação task → projeto: `tasks.project_id` já é `not null` com chave estrangeira;
- testes unitários novos no frontend (orientação registrada na SUB-40).

## Riscos e plano B

| Risco | Plano B |
|---|---|
| Outro script ocupa o número `08_` antes da entrega | Usar o próximo número livre em `database/` e corrigir as filhas no quadro |
| Não existe projeto Supabase com o schema do Dashboard AI (visto na SUB-25.4) | A SUB-45.6 para e pergunta ao usuário qual é o projeto; nada é aplicado sem autorização |
| `on delete set null` em `responsavel_id` falha se `auth.users` não existir no banco de teste | O `database/tests/supabase_stub.sql` já cria `auth.users`; conferir na SUB-45.5 |
| Script aplicado duas vezes quebra | Tudo com `add column if not exists` e constraints criadas só se não existirem; o teste aplica 2x |

## Passos

| # | Subtarefa | Arquivos | Verificação | Status |
|---|---|---|---|---|
| 1 | SUB-45.1 — `responsavel_id` e `data_prevista_fim` | `database/08_projects_campos.sql` | SQL relido; idempotente | 🔄 Em progresso |
| 2 | SUB-45.2 — `cor` e `icone` | `database/08_projects_campos.sql` | checks idempotentes | ⬜ Pendente |
| 3 | SUB-45.3 — `url_producao` e `url_documentacao` | `database/08_projects_campos.sql` | checks idempotentes | ⬜ Pendente |
| 4 | SUB-45.4 — `prioridade` e `tags` | `database/08_projects_campos.sql` | check e índice GIN | ⬜ Pendente |
| 5 | SUB-45.5 — teste SQL | `database/tests/test_projects_campos.sql`, `database/tests/run_tests.sh` | `run_tests.sh` verde | ⬜ Pendente |
| 6 | SUB-45.6 — aplicar no Supabase | — | consultas só de leitura | ⬜ Pendente |
| 7 | SUB-45.7 — tipos | `src/types/database.ts` | `typecheck` e `test` | ⬜ Pendente |
| 8 | SUB-45.8 — `validarProjeto()` | `src/lib/projeto.ts` | `typecheck` e `lint` | ⬜ Pendente |
| 9 | SUB-45.9 — `criarProjeto()` | `src/services/projectService.ts` | `typecheck` | ⬜ Pendente |
| 10 | SUB-45.10 — `atualizarProjeto()` e `definirProjetoAtivo()` | `src/services/projectService.ts` | `typecheck` | ⬜ Pendente |
| 11 | SUB-45.11 — `StatusProjetoBadge` | `src/components/projetos/` | `typecheck` e `lint` | ⬜ Pendente |
| 12 | SUB-45.12 — `ProjetoForm`: campos básicos | `src/components/projetos/ProjetoForm.tsx` | `typecheck`, `lint`, `build` | ⬜ Pendente |
| 13 | SUB-45.13 — `ProjetoForm`: campos novos | `src/components/projetos/ProjetoForm.tsx` | `typecheck`, `lint`, `build` | ⬜ Pendente |
| 14 | SUB-45.14 — `ProjetosLista` | `src/components/projetos/ProjetosLista.tsx` | `typecheck`, `lint`, `build` | ⬜ Pendente |
| 15 | SUB-45.15 — `ProjetosView` | `src/views/ProjetosView.tsx` | `build` e `check:chunks` | ⬜ Pendente |
| 16 | SUB-45.16 — rota `#/projetos` e menu | `src/views/meta.ts`, `src/views/index.ts` | `npm run validar` | ⬜ Pendente |
| 17 | SUB-45.17 — documentação | `README.md`, `database/README.md` | `npm run validar` | ⬜ Pendente |
| 18 | SUB-45.18 — validação visual | `docs/VALIDACAO.md` | checklist sem erros no console | ⬜ Pendente |

## Conclusão

Pendente (preencher ao fechar a SUB-45, com o tempo decorrido).
