# Supabase local — instalação, uso e alternância entre local e nuvem

Guia para instalar o **Supabase CLI** e o **Docker** e para rodar o Supabase na sua máquina
(Postgres, Auth, API REST, Realtime, Storage e o Studio), alternando entre o banco local e o da
nuvem. Cobre as subtarefas SUB-50.1 a SUB-50.7 da
[ETAPA-012](../tasks/etapas/ETAPA-012-f73bee11-SUPABASE-LOCAL.md): instalação, projeto local em
`database/configlocal`, migrations, variáveis, `supabase start`, validação e alternância.

> O projeto continua usando o **Supabase na nuvem por padrão**. O local é opcional, para
> desenvolver e testar sem custo e sem tocar no banco de produção.

- **Criado em:** 2026-10-13 · **Executor:** Claude Code (Opus 5.5) (nuvem · main)
- **Fonte dos comandos:** README oficial do CLI — <https://github.com/supabase/cli> (seção
  *Installation*). Se algo aqui divergir da fonte, vale a fonte.

---

## 1. Pré-requisitos

| Item | Por quê | Como conferir |
|------|---------|---------------|
| **Docker** rodando (Docker Desktop ou compatível) | O CLI sobe cada serviço do Supabase em um container | `docker info` sem erro |
| **Node.js >= 22.12** e npm | Só se for instalar o CLI pelo npm (o projeto já exige essa versão, ver `.nvmrc`) | `node --version` |
| Alguns **GB** livres em disco e memória suficiente para o Docker | As imagens do Supabase são grandes; o primeiro `supabase start` baixa todas | Configurações do Docker Desktop → *Resources* |
| Portas **54320 a 54329** livres | Portas padrão do Supabase local (tabela na seção 5) | Seção 6, "Porta ocupada" |

## 2. Instalar o Docker

### Windows

1. Ativar o **WSL 2** (PowerShell como administrador): `wsl --install` e reiniciar.
2. Baixar e instalar o **Docker Desktop**: <https://www.docker.com/products/docker-desktop/>.
3. Em *Settings → General*, deixar marcado **Use the WSL 2 based engine**.
4. Abrir o Docker Desktop e esperar o ícone ficar verde (*Engine running*).

### macOS

1. Instalar o **Docker Desktop** (escolher Apple Silicon ou Intel) pelo link acima, ou
   `brew install --cask docker`.
2. Abrir o Docker Desktop uma vez para concluir a configuração.
3. Alternativas compatíveis: OrbStack ou Colima.

### Linux

1. Instalar o **Docker Engine** pelo guia da sua distribuição: <https://docs.docker.com/engine/install/>
   (ou o Docker Desktop para Linux).
2. Permitir usar o Docker sem `sudo`: `sudo usermod -aG docker $USER` e abrir uma nova sessão.
3. Iniciar o serviço: `sudo systemctl enable --now docker`.

**Conferir (todos os sistemas):**

```bash
docker --version
docker info          # precisa responder sem "Cannot connect to the Docker daemon"
```

## 3. Instalar o Supabase CLI

Escolha **uma** forma. A recomendada para este projeto é a do sistema operacional (Scoop ou
Homebrew), porque deixa o comando `supabase` disponível em qualquer pasta.

### Windows — Scoop (recomendado)

```powershell
# Instalar o Scoop, se ainda não tiver: https://scoop.sh
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

Atualizar depois: `scoop update supabase`.

### macOS e Linux — Homebrew (recomendado)

```bash
brew install supabase/tap/supabase
```

Atualizar depois: `brew upgrade supabase`. (A fórmula oficial `brew install supabase` também existe,
mas pode demorar a receber versões novas.)

### Linux — pacote da distribuição

Baixar o pacote `.deb`, `.rpm`, `.apk` ou `.pkg.tar.zst` em
<https://github.com/supabase/cli/releases> e instalar, por exemplo:

```bash
sudo dpkg -i supabase_<versao>_linux_amd64.deb    # Debian/Ubuntu
sudo rpm -i supabase_<versao>_linux_amd64.rpm     # Fedora/RHEL
```

### Qualquer sistema — npm (como dependência de desenvolvimento)

```bash
npm install -D supabase
npx supabase --version
```

Pelo npm o CLI fica só neste projeto: use sempre **`npx supabase ...`** no lugar de `supabase ...`.
⚠️ Não use `npm install -g supabase`: o pacote não é feito para instalação global.

## 4. Conferir a instalação

```bash
supabase --version     # ou: npx supabase --version
supabase --help        # lista os comandos (init, start, stop, status, db, migration...)
```

Se a versão aparecer, o CLI está pronto. **Não** rode `supabase init` nem `supabase start` ainda:
isso é da SUB-50.2 em diante, com a pasta certa (`database/configlocal`).

## 5. Comandos e portas que você vai usar depois

| Comando | O que faz |
|---------|-----------|
| `supabase start` | Sobe os containers (o primeiro demora: baixa as imagens) |
| `supabase status` | Mostra URLs, portas e as chaves locais (`anon` e `service_role`) |
| `supabase stop` | Para os containers, mantendo os dados |
| `supabase --workdir <pasta> <comando>` | Roda o comando usando o projeto Supabase de outra pasta |

| Serviço (padrão do `config.toml`) | Porta | Endereço |
|-----------------------------------|-------|----------|
| API (REST, Auth, Storage) | 54321 | `http://localhost:54321` |
| Banco Postgres | 54322 | `postgresql://postgres:postgres@localhost:54322/postgres` |
| Studio (painel) | 54323 | `http://localhost:54323` |
| Caixa de e-mails de teste | 54324 | `http://localhost:54324` |

As chaves locais são de desenvolvimento e **não** servem para o projeto da nuvem (nem o contrário).

## 6. Problemas comuns

| Sintoma | Causa provável | Solução |
|---------|----------------|---------|
| `Cannot connect to the Docker daemon` ou `docker: command not found` | Docker não instalado ou não iniciado | Abrir o Docker Desktop (Windows/macOS) ou `sudo systemctl start docker` (Linux) e conferir com `docker info` |
| `permission denied ... /var/run/docker.sock` (Linux) | Usuário fora do grupo `docker` | `sudo usermod -aG docker $USER`, sair e entrar de novo na sessão |
| `supabase: command not found` | CLI instalado pelo npm, ou terminal aberto antes da instalação | Usar `npx supabase`, ou fechar e abrir o terminal (Scoop/Homebrew atualizam o `PATH`) |
| `port is already allocated` / `address already in use` | Outra aplicação (ou outro projeto Supabase) usando 54321–54329 | Descobrir quem usa: `netstat -ano \| findstr :54322` (Windows) ou `lsof -i :54322` (macOS/Linux); parar o outro projeto com `supabase stop` ou trocar a porta no `config.toml` |
| WSL 2 não instalado / erro de virtualização (Windows) | Virtualização desligada na BIOS ou WSL ausente | `wsl --install`, ativar a virtualização na BIOS e reiniciar |
| Primeiro `supabase start` muito lento ou falha ao baixar imagens | Download grande ou rede instável | Esperar e rodar de novo; conferir espaço em disco e memória do Docker |
| Containers caem por falta de memória | Docker com pouca RAM | Docker Desktop → *Settings → Resources*: aumentar a memória e reiniciar o Docker |

## 7. Alternar entre local e nuvem

O frontend (Vite) lê o `.env.local` **em qualquer modo** e ele vence o `.env` (que tem as credenciais
da nuvem). Então alternar é ligar/desligar o `.env.local`, e quem faz isso é
[`scripts/alternar-env.mjs`](../scripts/alternar-env.mjs) — detalhes em
[`database/configlocal/README.md`](../database/configlocal/README.md).

| Comando | Ambiente | O que faz |
|---|---|---|
| `npm run dev:local` | **Local** | ativa o `.env.local` (cria a partir do `.env.local.example` se faltar) e sobe o Vite |
| `npm run dev` | **Nuvem** | guarda o `.env.local` como `.env.local.off` e sobe o Vite |
| `node scripts/alternar-env.mjs status` | — | mostra qual está ativo e quais chaves faltam preencher |

### Local × nuvem, lado a lado

| | **Local** (`database/configlocal/`) | **Nuvem** (projeto Supabase) |
|---|---|---|
| O que é | Contêineres Docker na sua máquina | Projeto hospedado no Supabase |
| Para quê | Desenvolver e testar sem custo e sem risco | Produção/staging, com dados reais |
| Custo | Zero (usa CPU/RAM da máquina) | Plano do Supabase |
| **Dados** | **Descartáveis** — recriados do zero a qualquer momento | **Persistentes** — apagar não tem volta |
| Schema | Aplicado pelas migrations no `start`/`db reset` | Scripts `database/*.sql` (painel, ou `db push`) |
| Chaves | `anon`/`service_role` locais (de demonstração; só valem em `localhost`) | Chaves do projeto (*Settings → API*) |
| Endereços | API `http://localhost:54321` · Studio `:54323` · banco `:54322` | `https://<projeto>.supabase.co` |
| Internet | Funciona offline (depois de baixar as imagens) | Exige conexão |
| Velocidade | Sem latência de rede | Latência da rede |

### Fluxo de trabalho

1. **Desenvolver no local:** `npm run dev:local`.
2. **Testar no local:** o que toca banco roda contra os contêineres — `npm run test:integration`
   sobe o próprio PostgREST, e o worker usa o `DATABASE_URL` local do `.env.local`.
3. **Mudou o schema?** Escreva o script em `database/*.sql` **e** a migration correspondente em
   `database/configlocal/supabase/migrations/` — as duas cópias andam juntas
   ([`database/README.md`](../database/README.md)).
4. **Antes de publicar:** `npm run typecheck`, `npm test` e `npm run build` verdes.

### Gerar os tipos TypeScript

```bash
# Do banco LOCAL (usa os contêineres)
npx supabase --workdir database/configlocal gen types typescript --local

# Do banco da NUVEM (projeto vinculado)
npx supabase gen types typescript --project-id <id-do-projeto>
```
> Os tipos usados hoje são escritos à mão em `src/types/database.ts`; o comando serve para conferir
> se eles continuam iguais ao banco.

### Aplicar migrations em produção

⚠️ **Isso altera o banco de produção: só com autorização explícita do usuário** (regra do projeto).

- **Painel do Supabase (caminho usado hoje):** *SQL Editor* → executar `database/*.sql` na ordem
  (`00` → `08`).
- **CLI:** `npx supabase link --project-ref <ref>` e depois, como as migrations ficam em
  `database/configlocal/supabase/`, `npx supabase --workdir database/configlocal db push`.

### Resetar o banco local (e **nunca** em produção)

```bash
npx supabase --workdir database/configlocal db reset   # apaga e recria o local, aplicando as 9 migrations
npx supabase --workdir database/configlocal stop       # para os contêineres
```

⛔ **Nunca** rode `db reset`, `drop` ou `truncate` contra a nuvem: lá os dados são reais e não há
volta. O banco local é descartável **de propósito** — é isso que permite recomeçar limpo.

## 8. Próximos passos

- **SUB-50.7:** seção de desenvolvimento local no [`README.md`](../README.md).
- No dia a dia: [`database/configlocal/README.md`](../database/configlocal/README.md).
