# Supabase local (Docker) — `database/configlocal/`

Configuração do Supabase **local**, para desenvolver e testar sem mexer no banco da nuvem
(tarefa SUB-50). O projeto continua usando o Supabase na nuvem por padrão; o local é opcional.
Instalação do CLI e do Docker: [`docs/supabase-local-instalacao.md`](../../docs/supabase-local-instalacao.md).

## Como usar

O CLI está no projeto (`npm install -D supabase`), então se usa com `npx`. Como a configuração
não fica na pasta padrão `supabase/` da raiz, **todo comando leva `--workdir database/configlocal`**:

```bash
npx supabase --workdir database/configlocal start    # sobe os contêineres (precisa do Docker)
npx supabase --workdir database/configlocal status   # URLs e chaves locais
npx supabase --workdir database/configlocal stop     # para os contêineres
```

⚠️ O CLI não tem a opção `--config`; a pasta é escolhida com `--workdir`, que aponta para a pasta
que **contém** `supabase/`.

## Alternar entre local e nuvem (variáveis de ambiente)

O frontend (Vite) lê o `.env.local` **em qualquer modo** e ele **vence** o `.env` (que tem as
credenciais da nuvem). Por isso "alternar" é ligar/desligar o `.env.local`, e quem faz isso é o
script [`scripts/alternar-env.mjs`](../../scripts/alternar-env.mjs):

| Comando | O que faz |
|---|---|
| `npm run dev:local` | ativa o **local** (cria o `.env.local` a partir do `.env.local.example` se faltar) e sobe o Vite |
| `npm run dev` | ativa a **nuvem** (guarda o `.env.local` como `.env.local.off`) e sobe o Vite |
| `node scripts/alternar-env.mjs status` | mostra qual ambiente está ativo (também aceita `local` e `nuvem`) |

1. **Primeira vez no local:** `npm run dev:local` cria o `.env.local` a partir do
   [`.env.local.example`](../../.env.local.example) e avisa quais chaves faltam preencher.
2. **Pegue as chaves locais** com o stack no ar e copie para o `.env.local`:
   ```bash
   npx supabase --workdir database/configlocal status   # anon key e service_role key
   ```
   `VITE_SUPABASE_ANON_KEY` e `SUPABASE_ANON_KEY` = chave **anon**;
   `SUPABASE_SERVICE_ROLE_KEY` = chave **service_role** (só servidor/scripts).
3. **Voltar para a nuvem:** `npm run dev`. O `.env.local` **não é apagado** — vai para
   `.env.local.off` e volta quando você rodar `npm run dev:local` de novo.

> `.env`, `.env.local` e `.env.local.off` **nunca** vão para o Git; só os modelos
> (`.env.example` e `.env.local.example`) são versionados, com valores vazios.

## Estrutura

| Caminho | O que é | Vai para o Git? |
|---|---|---|
| `supabase/config.toml` | Configuração do Supabase local (portas, serviços, `project_id = "dashboard-ai"`) | ✅ Sim |
| `supabase/.gitignore` | Gerado pelo `supabase init`: ignora o estado local abaixo | ✅ Sim |
| `supabase/migrations/` | Migrações SQL aplicadas no `start` (criada na SUB-50.3, a partir de `database/*.sql`) | ✅ Sim |
| `supabase/seed.sql` | Dados iniciais opcionais (`[db.seed]` do `config.toml`) | ✅ Sim, se existir |
| `supabase/.temp/`, `supabase/.branches/` | Estado do CLI na máquina | ❌ Não (ignorado) |
| `supabase/.env.local`, `.env.*.local`, `.env.keys` | Segredos locais | ❌ Não (ignorado) |

## Portas padrão (`config.toml`)

| Serviço | Porta |
|---|---|
| API (REST, Auth, Realtime, Storage) | 54321 |
| Banco Postgres | 54322 |
| Studio (painel) | 54323 |
| E-mails de teste (`[local_smtp]`, painel web) | 54324 |

Os scripts de produção continuam em [`database/`](../README.md); esta pasta só guarda o ambiente
local.
