## Etapa 007-4d9b03e6 — SUB-45: Cadastro de projetos (campos novos na tabela `projects` e tela `#/projetos`)

**Tarefa:** SUB-45 · **Migrada em:** 2026-10-13 (ETAPA-001) · **Executor:** por subtarefa (coluna "Em uso por" do `tasks/STATUS.md`)
**Próximo passo:** escolher uma subtarefa livre no `tasks/STATUS.md` (cada subtarefa tem o próprio próximo passo abaixo).

> Bloco migrado do `task-principal.md` sem alterar o texto. **Status, prioridade, dependências e reserva** de cada subtarefa ficam só no [`tasks/STATUS.md`](../STATUS.md); aqui ficam descrição, critérios, entrega e anotações. Quem reserva uma subtarefa edita só a seção dela.

### Tarefa-mãe

- **Descrição:** Pedido do usuário: "criar os projetos; cada task deve ser ligada a um projeto; tabela no banco com descrição do projeto, status (1-ATIVO, 0-INATIVO) e data de criação". **O que já existe (SUB-29, `database/00_projects_roles.sql`):** a tabela `public.projects` com `nome`, `slug`, `descricao`, `repositorio`, `branch_padrao`, `prefixo_codigo`, `ativo` (boolean), `excluido`, `criado_por`, `created_at` e `updated_at`; e `tasks.project_id` já é `not null` com chave estrangeira para `projects` (toda task já pertence a um projeto). A RLS já deixa só o administrador criar projeto e só o owner (ou admin) editar. **O que falta:** os campos novos escolhidos pelo usuário (responsável, prazo, cor, ícone, URL de produção, URL de documentação, prioridade e tags) e a tela para listar, criar, editar e ativar/inativar projetos (no frontend só existe `listarProjetos()`).
- **Decisões do usuário (2026-10-12):** (1) o status **continua** sendo a coluna `ativo boolean` (as RPCs da fila já usam), exibido na tela como **1-ATIVO / 0-INATIVO**; (2) campos novos: `responsavel_id`, `data_prevista_fim`, `cor`, `icone`, `url_producao`, `url_documentacao`, `prioridade` e `tags`; (3) escopo: banco **e** tela de cadastro.
- **Critérios de Aceitação:** Todas as filhas `concluido`; `database/08_projects_campos.sql` idempotente e aplicado (com autorização); tela `#/projetos` funcionando (admin cria; owner edita; ativar/inativar); `npm run validar` verde.
- **Commit:** pendente
- **Anotação:** Tarefa grande (banco + várias partes): pela seção 6 do `AGENTS.md`, quem pegar a primeira subtarefa cria o plano em `docs/cadastro-de-projetos.md`. As filhas SUB-45.2 a SUB-45.6 (SQL, teste e aplicação no banco) e a SUB-45.18 (tela contra banco real) são tarefas de banco: pela regra 11 da seção 1.1, só o Claude Code local executa (não em sessão na nuvem). As demais (frontend e documentação) podem ser pegas por qualquer IA. O número do script (`08_`) é o próximo livre em `database/` depois da remoção do `08_admin_inicial.sql` na SUB-44 (`4f4c443`); se outro script ocupar o `08_` antes, usar o próximo número livre e corrigir as filhas. Sem testes unitários novos no frontend, seguindo a mesma orientação registrada na SUB-40 (só para correção de bug); o teste SQL da SUB-45.5 cobre os checks do banco.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE


### Plano (vindo de `docs/cadastro-de-projetos.md` em 2026-10-13)

- **Criado em:** 2026-10-12
- **Executor:** Claude Code (Opus 5.5, sessão em nuvem)
- **Tarefa no quadro:** [`SUB-45`](../../task-principal.md) (subtarefas SUB-45.1 a SUB-45.18)

#### Objetivo

Completar a tabela `public.projects` com os campos que o usuário escolheu e criar a tela `#/projetos` para listar, criar, editar e ativar/inativar projetos.

#### Escopo

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

#### Riscos e plano B

| Risco | Plano B |
|---|---|
| Outro script ocupa o número `08_` antes da entrega | Usar o próximo número livre em `database/` e corrigir as filhas no quadro |
| Não existe projeto Supabase com o schema do Dashboard AI (visto na SUB-25.4) | A SUB-45.6 para e pergunta ao usuário qual é o projeto; nada é aplicado sem autorização |
| `on delete set null` em `responsavel_id` falha se `auth.users` não existir no banco de teste | O `database/tests/supabase_stub.sql` já cria `auth.users`; conferir na SUB-45.5 |
| Script aplicado duas vezes quebra | Tudo com `add column if not exists` e constraints criadas só se não existirem; o teste aplica 2x |

#### Passos

| # | Subtarefa | Arquivos | Verificação | Status |
|---|---|---|---|---|
| 1 | SUB-45.1 — `responsavel_id` e `data_prevista_fim` | `database/08_projects_campos.sql` | SQL relido; idempotente | ✅ Concluído (`a4c068f`) |
| 2 | SUB-45.2 — `cor` e `icone` | `database/08_projects_campos.sql` | checks idempotentes | ⬜ Pendente |
| 3 | SUB-45.3 — `url_producao` e `url_documentacao` | `database/08_projects_campos.sql` | checks idempotentes | ⬜ Pendente |
| 4 | SUB-45.4 — `prioridade` e `tags` | `database/08_projects_campos.sql` | check e índice GIN | ⬜ Pendente |
| 5 | ~~SUB-45.5 — teste SQL~~ | — | — | ❌ Removida pelo usuário (2026-10-13) |
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

#### Conclusão

Pendente (preencher ao fechar a SUB-45, com o tempo decorrido).

### SUB-45.2 — Colunas `cor` e `icone` em `database/08_projects_campos.sql`

**Próximo passo:** nenhum — entregue. Seguir na SUB-45.3.

- **Descrição:** No mesmo arquivo: `cor text` com `check (cor is null or cor ~ '^#[0-9a-fA-F]{6}$')` e `icone text` (nome de ícone do lucide-react, ex.: `folder-kanban`) com `check (icone is null or icone ~ '^[a-z0-9-]{1,64}$')`. Constraints criadas de forma idempotente (bloco `do $$ ... if not exists (select 1 from pg_constraint ...)`). Comentários nas colunas. ⚠️ Tarefa de banco: pela regra 11 da seção 1.1 do `AGENTS.md`, só o Claude Code local executa (não em sessão na nuvem).
- **Critérios de Aceitação:** Colunas e checks no arquivo, idempotentes.
- **Entrega:** commit desta entrega (`feat(SUB-45.2)`) · **Verificação:** bloco "Personalização visual (SUB-45.2)" acrescentado a `database/08_projects_campos.sql` (e à cópia de migration `20261013000008_08_projects_campos.sql`, **hash idêntico** conferido); **aplicado 2× no Supabase local** (`psql -v ON_ERROR_STOP=1`) sem erro nem conflito; colunas `cor text` e `icone text` e as constraints `projects_cor_check` (`CHECK (((cor IS NULL) OR (cor ~ '^#[0-9a-fA-F]{6}$'::text)))`) e `projects_icone_check` (`CHECK (((icone IS NULL) OR (icone ~ '^[a-z0-9-]{1,64}$'::text)))`) presentes; **os checks foram testados** em transações com `rollback` (nenhum dado ficou no banco — o `projects` seguiu com 1 linha): aceitos `#1A2b3C` + `folder-kanban` e os dois nulos; recusados `vermelho`, `1A2b3C` (sem `#`) e `Folder_Kanban` (maiúscula/underscore).
- **Anotação:** O bloco segue o padrão da SUB-45.1, inclusive o filtro `conrelid = 'public.projects'::regclass` em cada teste de existência de constraint (a lição registrada na 45.1: sem o filtro, uma constraint de mesmo nome em outra tabela faria a criação ser pulada em silêncio). As constraints foram nomeadas `projects_cor_check` e `projects_icone_check`. Nada foi aplicado no Supabase da **nuvem** (isso é a SUB-45.6, que exige autorização explícita do usuário).
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** 2026-10-13 17:40 — confirmado por DeepSeek Harness (deepseek-flash): idempotência 2× e os 5 casos de teste dos checks
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-45.3 — Colunas `url_producao` e `url_documentacao` em `database/08_projects_campos.sql`

**Próximo passo:** executar conforme a descrição.

- **Descrição:** No mesmo arquivo: `url_producao text` e `url_documentacao text`, cada uma com `check (<col> is null or <col> ~ '^https?://')`, idempotentes. Comentários nas colunas. ⚠️ Tarefa de banco: pela regra 11 da seção 1.1 do `AGENTS.md`, só o Claude Code local executa (não em sessão na nuvem).
- **Critérios de Aceitação:** Colunas e checks no arquivo, idempotentes.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-45.4 — Colunas `prioridade` e `tags` em `database/08_projects_campos.sql`

**Próximo passo:** executar conforme a descrição.

- **Descrição:** No mesmo arquivo: `prioridade text not null default 'MEDIA'` com `check (prioridade in ('MAXIMA','ALTA','MEDIA','BAIXA'))` (mesmos valores da seção 1.2 do `AGENTS.md`) e `tags text[] not null default '{}'`. Índice GIN em `tags` (`create index if not exists`). Comentários. **Status continua sendo a coluna `ativo boolean`** (decisão do usuário): na tela aparece como 1-ATIVO / 0-INATIVO. ⚠️ Tarefa de banco: pela regra 11 da seção 1.1 do `AGENTS.md`, só o Claude Code local executa (não em sessão na nuvem).
- **Critérios de Aceitação:** Colunas, check e índice no arquivo, idempotentes.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### ~~SUB-45.5 — Teste SQL `database/tests/test_projects_campos.sql`~~ (removida)

**Próximo passo:** nenhum — ❌ **removida a pedido do usuário em 2026-10-13 14:49** (regra "nunca escrever testes,
exceto para corrigir bug"). Saiu do `tasks/STATUS.md`; a SUB-45.6 passou a depender da SUB-45.4. Texto original
mantido abaixo só como histórico.

- **Descrição:** Teste no padrão de `database/tests/test_multi_projeto.sql` (`raise notice 'ok: ...'` e `TODOS_OS_TESTES_PASSARAM`): defaults de `prioridade` e `tags`; checks recusam cor `azul`, ícone `Folder Kanban`, URL `ftp://x` e prioridade `URGENTE`; aceitam valores válidos; `responsavel_id` vira `null` quando o usuário é apagado. Incluir o arquivo no `database/tests/run_tests.sh` e corrigir a mensagem "schema 00-06" para o intervalo real. ⚠️ Exige banco: pela regra 11 da seção 1.1 do `AGENTS.md`, só o Claude Code local executa (não em sessão na nuvem).
- **Critérios de Aceitação:** `database/tests/run_tests.sh` verde contra um Postgres com pgvector descartável (nunca o Supabase de produção).
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-45.6 — Aplicar o `database/08_projects_campos.sql` no Supabase (só com autorização do usuário)

**Próximo passo:** executar conforme a descrição.

- **Descrição:** **Pedir autorização explícita do usuário no chat antes de qualquer comando no banco remoto** e confirmar com ele qual é o projeto Supabase do Dashboard AI. Com a autorização, aplicar o script e conferir com consultas só de leitura que as 8 colunas e os checks existem (`information_schema.columns`, `pg_constraint`). ⚠️ Exige banco: pela regra 11 da seção 1.1 do `AGENTS.md`, só o Claude Code local executa (não em sessão na nuvem).
- **Critérios de Aceitação:** Script aplicado sem erro; conferências registradas na anotação (sem chaves, tokens ou dados de usuários).
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-45.7 — Tipos novos de `Project` em `src/types/database.ts`

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Acrescentar ao tipo `Project` os campos `responsavel_id: string | null`, `data_prevista_fim: string | null`, `cor: string | null`, `icone: string | null`, `url_producao: string | null`, `url_documentacao: string | null`, `prioridade: PrioridadeProjeto` e `tags: string[]`, e exportar `type PrioridadeProjeto = 'MAXIMA' | 'ALTA' | 'MEDIA' | 'BAIXA'`. Ajustar `ProjectInsert`/`ProjectUpdate` se precisar e corrigir mocks de teste que montam `Project`.
- **Critérios de Aceitação:** `npm run typecheck` e `npm test` verdes.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-45.8 — `validarProjeto()` em `src/lib/projeto.ts`

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Função pura que recebe os campos do formulário e devolve `{ campo: mensagem }` só com os erros: `nome` obrigatório; `slug` e `prefixo_codigo` com as mesmas regex do `00_projects_roles.sql`; `cor` hex `#RRGGBB`; `icone` `^[a-z0-9-]{1,64}$`; URLs `http(s)://`; `prioridade` na lista; `data_prevista_fim` data válida. Mensagens em português, no estilo de `src/lib/auth.ts`. Exportar em `src/lib/index.ts`, se existir.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run lint` verdes.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-45.9 — `criarProjeto()` em `src/services/projectService.ts`

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Insere em `projects` (`insert(...).select().single()`) e devolve o `Project` criado, no padrão de `listarProjetos()` (recebe `client` opcional). Erro de RLS (não admin) vira mensagem clara: "Só administradores podem criar projetos."; slug repetido vira "Já existe um projeto com esse identificador.".
- **Critérios de Aceitação:** `npm run typecheck` verde.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-45.10 — `atualizarProjeto()` e `definirProjetoAtivo()` em `src/services/projectService.ts`

**Próximo passo:** executar conforme a descrição.

- **Descrição:** `atualizarProjeto(id, campos)` faz `update` e devolve o projeto; `definirProjetoAtivo(id, ativo)` é um atalho para ativar/inativar. Mesmo tratamento de erro da SUB-45.9 (RLS: só o owner do projeto ou admin).
- **Critérios de Aceitação:** `npm run typecheck` verde.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-45.11 — Componente `src/components/projetos/StatusProjetoBadge.tsx`

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Badge que recebe `ativo: boolean` e mostra **1-ATIVO** (verde) ou **0-INATIVO** (cinza), no visual dos badges já usados na tela Fila. Criar `src/components/projetos/index.ts` exportando o componente.
- **Critérios de Aceitação:** `npm run typecheck` e `npm run lint` verdes.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-45.12 — `ProjetoForm.tsx`: campos básicos

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar `src/components/projetos/ProjetoForm.tsx` no visual do `LoginForm`/`CadastroForm` (classe `CAMPO`, `Botao`, `useId`, erros com `aria-invalid`/`aria-describedby`), com os campos Nome, Identificador (slug), Descrição, Prefixo do código, Repositório e Branch padrão. Valida com `validarProjeto` e, no modo criar, chama `criarProjeto`. Props: `projeto?` (modo editar), `onSalvou?(projeto)` e `onCancelar?()`.
- **Critérios de Aceitação:** `npm run typecheck`, `npm run lint` e `npm run build` verdes.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-45.13 — `ProjetoForm.tsx`: campos novos

**Próximo passo:** executar conforme a descrição.

- **Descrição:** No mesmo formulário: Responsável (select com os membros do projeto, ou campo de texto do e-mail se não houver lista), Prazo (date), Cor (`input type=color`), Ícone, URL de produção, URL de documentação, Prioridade (select) e Tags (texto separado por vírgula → `string[]`). No modo editar, chama `atualizarProjeto`.
- **Critérios de Aceitação:** `npm run typecheck`, `npm run lint` e `npm run build` verdes.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-45.14 — Componente `src/components/projetos/ProjetosLista.tsx`

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Tabela (cards no celular) com: bolinha da cor, nome, slug, prioridade, `StatusProjetoBadge`, data de criação (`created_at` formatada) e botões Editar e Ativar/Inativar (`definirProjetoAtivo`). Estado vazio: "Nenhum projeto cadastrado.".
- **Critérios de Aceitação:** `npm run typecheck`, `npm run lint` e `npm run build` verdes.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-45.15 — Tela `src/views/ProjetosView.tsx`

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Tela com a `ProjetosLista` e o botão "Novo projeto" (abre o `ProjetoForm`). Só administrador vê o botão "Novo projeto"; quem não é admin vê a lista dos projetos a que tem acesso. Depois de salvar, recarrega a lista e o seletor de projeto do `ProjetoContext`.
- **Critérios de Aceitação:** `npm run typecheck`, `npm run lint` e `npm run build` verdes; `npm run check:chunks` sem chunk acima de 500 kB.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-45.16 — Registrar a tela `projetos` (rota `#/projetos` e menu)

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Adicionar `{ id: 'projetos', titulo: 'Projetos' }` em `src/views/meta.ts`, exportar em `src/views/index.ts` e ligar a rota e o item de menu do mesmo jeito que a tela `monitor` (SUB-35.31), com carregamento preguiçoso (lazy).
- **Critérios de Aceitação:** `npm run validar` verde.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-45.17 — Documentar projetos no `README.md` e no `database/README.md`

**Próximo passo:** executar conforme a descrição.

- **Descrição:** No `database/README.md`: incluir o `08_projects_campos.sql` na ordem de aplicação, com a lista de colunas novas e os checks. No `README.md`: descrever a tela Projetos (quem cria, quem edita, status 1-ATIVO/0-INATIVO, toda task pertence a um projeto via `tasks.project_id`).
- **Critérios de Aceitação:** `npm run validar` verde; links relativos funcionando.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-45.18 — Validação visual da tela Projetos

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Com `npm run preview` contra o Supabase do Dashboard AI (já com o `08` aplicado), entrar como admin, criar, editar, inativar e reativar um projeto de teste, em 1280x800 e 390x844; conferir que o projeto aparece no seletor e que uma task nova fica ligada a ele. Registrar no `docs/VALIDACAO.md` (sem screenshots grandes). Apagar o projeto de teste só com autorização do usuário. ⚠️ Exige banco: pela regra 11 da seção 1.1 do `AGENTS.md`, só o Claude Code local executa (não em sessão na nuvem).
- **Critérios de Aceitação:** Sem erros no console; checklist registrado.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-45.19 — Revisar a SUB-45.1 (`database/08_projects_campos.sql`) com o MCP do Supabase — só Claude Code local

**Próximo passo:** nenhum — entregue. A SUB-50 já estava ✅; seguir na SUB-45.2.

- **Descrição:** Pedido do usuário (2026-10-12): a SUB-45.1 (`a4c068f`) foi feita por Claude Code (Opus 5.5, sessão em nuvem), antes da regra 11 da seção 1.1 do `AGENTS.md` proibir tarefas de banco em sessão na nuvem, e deve ser **revisada pelo Claude Code local usando o MCP do Supabase**. Revisar o bloco "Responsável e prazo (SUB-45.1)" de `database/08_projects_campos.sql`: (1) tipos e nomes das colunas `responsavel_id uuid` e `data_prevista_fim date` coerentes com o `00_projects_roles.sql`; (2) idempotência (`add column if not exists`, constraint só se não existir); (3) a FK condicional para `auth.users` (`to_regclass('auth.users')`, `on delete set null`) — confirmar com o MCP do Supabase, **só com consultas de leitura** (`information_schema`, `pg_constraint`, `to_regclass`), que o projeto do Dashboard AI tem `auth.users` e que nada conflita com colunas/constraints já existentes em `public.projects`; (4) comentários. Corrigir o arquivo se achar problema. **Não aplicar** o script nesta subtarefa (a aplicação é a SUB-45.6, com autorização do usuário). ⚠️ Tarefa de banco: pela regra 11 da seção 1.1 do `AGENTS.md`, só o Claude Code local executa (não em sessão na nuvem).
- **Critérios de Aceitação:** Revisão registrada na anotação (o que foi conferido e as consultas de leitura usadas, sem chaves ou dados de usuários); arquivo corrigido, se preciso, com commit; `STATUS-TAREFA-CONFIRMADO-CONCLUIDO` da SUB-45.1 (no `task_complete.md`) atualizado com o resultado.
- **Entrega:** commit desta entrega (`feat(SUB-45.19)`) · **Verificação:** os 4 itens conferidos **no Supabase local** (o MCP desta máquina não tem acesso ao projeto da nuvem — ver a nota de dependência abaixo), com consultas **só de leitura**: `select to_regclass('auth.users')` → `auth.users` (existe); `information_schema.columns` de `public.projects` → 15 colunas, incluindo `responsavel_id uuid` e `data_prevista_fim date`; `pg_constraint` de `public.projects` → `projects_pkey`, `projects_slug_key`, 3 `CHECK` e **`projects_responsavel_id_fkey | f | FOREIGN KEY (responsavel_id) REFERENCES auth.users(id) ON DELETE SET NULL`**; `col_description` → os dois `comment on column` presentes; **idempotência provada na prática** aplicando `database/08_projects_campos.sql` **duas vezes** no banco local (`psql -v ON_ERROR_STOP=1`): as duas passadas sem erro e sem conflito, com o resultado final igual ao esperado. Nenhuma correção foi necessária no arquivo.
- **Anotação:** **Revisão parcial (2026-10-13 15:30, Claude Code (Opus 5.5) (local · main)):**
  (1) tipos e nomes: `responsavel_id uuid` segue o padrão de `criado_por uuid` do `00_projects_roles.sql` (o projeto não usa FK para `auth.users` nas outras colunas, por causa do banco de teste); `data_prevista_fim date` ok; nenhum outro arquivo de `database/`, `src/` ou `api/` usa esses nomes ✅.
  (2) idempotência: `add column if not exists` ok; **corrigido** o teste da constraint, que procurava `conname` no banco inteiro e agora também filtra `conrelid = 'public.projects'::regclass` (outra tabela com o mesmo nome de constraint faria a FK ser pulada sem aviso) ✅.
  (3) FK condicional para `auth.users`: **não conferida no banco**. O MCP do Supabase desta máquina está ligado à organização "Sistemas" (projetos "Canil Doce Lar" e "AULAS SENAI"); o projeto do Dashboard AI do `.env` (`fcmntkzpjoetdabllabn`) responde "You do not have permission" ao `get_project`. ⛔ **Destrava:** o usuário conectar o MCP do Supabase à conta/organização dona desse projeto (ou dar acesso a ela). Consultas previstas, só leitura: `select to_regclass('auth.users')`; colunas de `information_schema.columns` em `public.projects`; `select conname from pg_constraint where conrelid = 'public.projects'::regclass`.
  (4) comentários `comment on column` ok ✅. Nada aplicado no banco.
- **Dependência nova (2026-10-13 16:05, pedido do usuário: "adicione 1 trava nesta task, que precisa da task SUB-50 primeiro"):** a revisão do item (3) será feita no **Supabase local** da SUB-50, e não no projeto da nuvem pelo MCP. A linha no `STATUS.md` passou a depender de `SUB-45.1, SUB-50` e saiu de ⛔ para ⬜ (espera a dependência). Registrado por Claude Code (Opus 5.5) (local · main).
- **Revisão concluída (2026-10-13 17:39, DeepSeek Harness (deepseek-flash) (local · main), a pedido do usuário: "faça todas da SUB-45"):** item (3) fechado no Supabase local. `auth.users` **existe** e a FK `projects_responsavel_id_fkey` está criada com `ON DELETE SET NULL`; as constraints de `public.projects` não conflitam com nada. Itens (1), (2) e (4) revalidados: tipos/nomes coerentes com o `00_projects_roles.sql` (0 ocorrências de `responsavel_id`/`data_prevista_fim` lá e nenhum outro arquivo do projeto usa esses nomes), idempotência **provada aplicando o script 2× sem erro** e comentários presentes. **`database/08_projects_campos.sql` não precisou de correção** (o ajuste do filtro `conrelid` feito às 15:30 continua válido). Nada foi aplicado no Supabase da **nuvem** — isso é a SUB-45.6, que exige autorização explícita do usuário. **Autorização registrada:** em 2026-10-13, no chat ("faça todas da SUB-45"), o usuário autorizou a frente **DeepSeek Harness (deepseek-flash) (local · main)** a executar as subtarefas de banco da SUB-45, sobrepondo a regra 11 que reserva tarefa de banco ao Claude Code local — mesmo tipo de autorização dada para a SUB-50. O `STATUS-TAREFA-CONFIRMADO-CONCLUIDO` da SUB-45.1, no `task_complete.md`, foi atualizado com este resultado (critério da subtarefa).
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** 2026-10-13 17:39 — confirmado por DeepSeek Harness (deepseek-flash): 4 itens conferidos no Supabase local, idempotência provada 2× e arquivo sem correção
- **VERIFICADOR-CLAUDE:** PENDENTE
