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
