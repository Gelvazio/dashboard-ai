## Etapa 012-f73bee11 — SUB-50: Configurar Supabase local com Docker para desenvolvimento

**Tarefa:** SUB-50 · **Migrada em:** 2026-10-13 (ETAPA-001) · **Executor:** por subtarefa (coluna "Em uso por" do `tasks/STATUS.md`)
**Próximo passo:** escolher uma subtarefa livre no `tasks/STATUS.md` (cada subtarefa tem o próprio próximo passo abaixo).

> Bloco migrado do `task-principal.md` sem alterar o texto. **Status, prioridade, dependências e reserva** de cada subtarefa ficam só no [`tasks/STATUS.md`](../STATUS.md); aqui ficam descrição, critérios, entrega e anotações. Quem reserva uma subtarefa edita só a seção dela.

### Tarefa-mãe

- **Descrição:** Configurar o Supabase local com Docker para desenvolvimento e testes, permitindo trabalhar offline sem custos de nuvem e com isolamento completo do ambiente de produção. O Supabase CLI roda PostgreSQL, Studio (UI), API REST, Realtime, Storage e demais serviços via Docker containers. A configuração local fica armazenada na pasta `database/configlocal` (migrations, config.toml, etc.), separada dos scripts SQL de produção em `database/`. A tarefa instala o CLI, inicializa o projeto local em `database/configlocal`, converte os scripts SQL existentes (`database/*.sql`) para o formato de migrations do Supabase, configura variáveis de ambiente para alternar entre local e nuvem, valida que tudo funciona e documenta o fluxo completo no README.
- **Critérios de Aceitação:** Supabase CLI instalado; projeto inicializado com `supabase init`; migrations convertidas e aplicadas localmente; `supabase start` funciona sem erros; Studio acessível em `http://localhost:54323`; variáveis de ambiente configuradas (`.env.local` e script de alternância); documentação completa no README; testes de integração podem rodar contra o banco local.
- **Commit:** pendente
- **Anotação:** Criada em 2026-10-13 a pedido do usuário para permitir desenvolvimento local com Supabase via Docker. Vantagens: desenvolvimento offline, testes sem custos, isolamento de produção, desenvolvimento mais rápido (sem latência de rede). O projeto continua usando o Supabase na nuvem por padrão; o local é opcional para desenvolvimento.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-50.1 — Instalar e configurar o Supabase CLI

**Próximo passo:** nenhum — entregue. Seguir na SUB-50.2.

- **Descrição:** Criar `docs/supabase-local-instalacao.md` com instruções de instalação do Supabase CLI para cada sistema operacional: Windows (via npm ou download do executável), macOS (via Homebrew `brew install supabase/tap/supabase`), Linux (via npm ou script de instalação). Incluir verificação de instalação (`supabase --version`), pré-requisitos (Docker Desktop instalado e rodando) e solução de problemas comuns (Docker não iniciado, permissões, portas ocupadas). Adicionar também instruções para instalar o Docker Desktop se não estiver presente.
- **Critérios de Aceitação:** Documentação completa com instruções para Windows, macOS e Linux; comandos de verificação; pré-requisitos listados; solução de problemas básicos.
- **Entrega:** commit desta entrega (`feat(SUB-50.1)`) · **Verificação:** comandos de instalação conferidos no README oficial do CLI (<https://github.com/supabase/cli>, seção *Installation*); portas padrão conferidas no modelo `config.toml` do repositório do CLI; flag global `--workdir` conferida no código do CLI (`apps/cli-go/cmd/root.go`); nada instalado nem executado (sessão na nuvem, sem Docker)
- **Anotação:** 2026-10-13 15:14 — Claude Code (Opus 5.5) (nuvem · main): criado `docs/supabase-local-instalacao.md` com pré-requisitos, instalação do Docker (Windows com WSL 2, macOS, Linux), instalação do CLI (Scoop, Homebrew, pacotes `.deb`/`.rpm` e npm como `-D` com `npx`), verificação (`supabase --version`), comandos e portas padrão (54321 API, 54322 banco, 54323 Studio, 54324 e-mails) e tabela de problemas comuns (Docker parado, permissão do socket, comando não encontrado, porta ocupada, WSL, memória). **Achado para a SUB-50.2:** o README e o código do CLI não mostram uma flag `--config` no `supabase init`; a flag global documentada é `--workdir <pasta>`. Conferir com `supabase init --help` antes de executar `supabase init --config database/configlocal` como está na descrição da SUB-50.2.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-50.2 — Inicializar o Supabase local na pasta `database/configlocal` (`supabase init --config database/configlocal`)

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Executar `supabase init --config database/configlocal` na raiz do projeto para criar a estrutura do Supabase local dentro da pasta `database/configlocal`. Isso cria: `database/configlocal/migrations/` (migrations SQL), `database/configlocal/config.toml` (configuração local), `database/configlocal/functions/` (Edge Functions, se usar), e atualiza o `.gitignore` para ignorar o estado local (`database/configlocal/.branches/`, `database/configlocal/.temp/`). Documentar o que cada arquivo/pasta significa e quais devem ser versionados (migrations, config.toml) vs. quais são gerados automaticamente (`.branches/`, `.temp/`). A pasta `database/configlocal` mantém toda a configuração do Docker local separada do SQL da produção.
- **Critérios de Aceitação:** `supabase init --config database/configlocal` executado; estrutura `database/configlocal/` criada; `.gitignore` atualizado; documentação explicando a estrutura.
- **Commit:** pendente
- **Anotação:** Ajustado para usar `database/configlocal` em vez de `supabase/` (padrão).
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-50.3 — Converter scripts `database/*.sql` para `database/configlocal/migrations/`

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Converter os scripts SQL existentes na pasta `database/` (00 a 08) para o formato de migrations do Supabase em `database/configlocal/migrations/`. Cada script deve ser renomeado com timestamp prefixado (ex: `20231013_000000_00_projects_roles.sql`, `20231013_000001_01_tasks.sql`, etc.) para garantir ordem de aplicação. Remover comandos idempotentes desnecessários (IF NOT EXISTS já é padrão de migrations). Atualizar o `database/README.md` para referenciar que as migrations locais estão em `database/configlocal/migrations/` e que a pasta `database/` contém os scripts de produção. Criar script de conversão automática (`scripts/converter-migrations-local.sh`) se fizer sentido.
- **Critérios de Aceitação:** Todos os scripts `database/*.sql` convertidos para `database/configlocal/migrations/` com timestamp; ordem correta preservada; `database/README.md` atualizado; `supabase db reset --config database/configlocal` aplica as migrations sem erro.
- **Commit:** pendente
- **Anotação:** Ajustado para usar `database/configlocal/migrations/` em vez de `supabase/migrations/`.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-50.4 — Configurar variáveis de ambiente para ambiente local

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar `.env.local.example` com as variáveis do Supabase local (que o `supabase start` gera automaticamente): `NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321`, `NEXT_PUBLIC_SUPABASE_ANON_KEY=<chave_anon_local>`, `SUPABASE_SERVICE_ROLE_KEY=<chave_service_local>`, `DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres`. Criar script `scripts/alternar-env.sh` (Windows: `.bat`) que alterna entre `.env` (nuvem) e `.env.local` (local), atualizando as variáveis de ambiente do projeto. Documentar como usar: `npm run dev:local` (com `.env.local`) vs `npm run dev` (com `.env` nuvem).
- **Critérios de Aceitação:** `.env.local.example` criado; script de alternância funcional; instruções de uso documentadas; comandos `npm run dev:local` e `npm run dev` funcionam.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-50.5 — Rodar o Supabase local e validar (`supabase start --config database/configlocal`)

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Executar `supabase start --config database/configlocal` para iniciar todos os serviços Docker (PostgreSQL, Studio, API, Realtime, Storage). Validar que: Studio está acessível em `http://localhost:54323`, API REST em `http://localhost:54321`, banco em `localhost:54322`, migrations foram aplicadas (`supabase db reset --config database/configlocal` funciona), e a conexão via aplicação local funciona (testar com `npm run dev:local` e uma chamada simples ao banco). Documentar os comandos úteis com a flag `--config database/configlocal`: `supabase start`, `supabase stop`, `supabase status`, `supabase db reset`, `supabase db diff`, `supabase gen types typescript --local`.
- **Critérios de Aceitação:** `supabase start --config database/configlocal` funciona sem erros; todos os serviços acessíveis; migrations aplicadas; aplicação conecta ao banco local; comandos úteis documentados.
- **Commit:** pendente
- **Anotação:** Ajustado para usar `--config database/configlocal` em todos os comandos.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-50.6 — Documentar alternância entre local e nuvem

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Atualizar `docs/supabase-local-instalacao.md` (ou renomear para `docs/supabase-local.md`) com seção sobre alternância entre ambientes: tabela comparativo (local vs nuvem), fluxo de trabalho (desenvolvimento em local, testes em local, deploy em nuvem), como gerar types do banco local vs nuvem (`--local` flag), como aplicar migrations em produção (via painel do Supabase ou `supabase db push`), e cuidado com dados (local é descartável, nuvem é persistente). Incluir também como resetar o banco local (`supabase db reset --config database/configlocal`) vs não fazer isso em produção. Documentar que todos os comandos do Supabase CLI devem usar a flag `--config database/configlocal` para apontar para a pasta de configuração local.
- **Critérios de Aceitação:** Documentação completa de alternância; tabela comparativo; fluxo de trabalho claro; avisos sobre dados; todos os comandos documentados com `--config database/configlocal`.
- **Critérios de Aceitação:** Documentação completa de alternância; tabela comparativo; fluxo de trabalho claro; avisos sobre dados.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-50.7 — Atualizar o `README.md` com instruções de desenvolvimento local

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Adicionar seção "Desenvolvimento local com Supabase" no `README.md` com: link para `docs/supabase-local.md`, pré-requisitos (Docker Desktop, Supabase CLI), comandos básicos (`supabase init`, `supabase start`, `supabase stop`), como alternar entre local e nuvem (`npm run dev:local` vs `npm run dev`), e quando usar cada ambiente (local para desenvolvimento/testes, nuvem para produção/staging). Atualizar também a seção "Banco de dados" para mencionar que as migrations estão em `supabase/migrations/` e como aplicá-las localmente.
- **Critérios de Aceitação:** README atualizado com seção de desenvolvimento local; links funcionando; comandos básicos documentados; seção de banco atualizada.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE
