# Supabase local — instalação do Supabase CLI e do Docker (SUB-50.1)

Guia para instalar o **Supabase CLI** e o **Docker**, que juntos rodam o Supabase na sua máquina
(Postgres, Auth, API REST, Realtime, Storage e o Studio). É o primeiro passo da SUB-50; os próximos
(iniciar o projeto local em `database/configlocal`, migrações, variáveis e `supabase start`) ficam
nas subtarefas SUB-50.2 a SUB-50.7 ([ETAPA-012](../tasks/etapas/ETAPA-012-f73bee11-SUPABASE-LOCAL.md)).

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

## Próximos passos

- **SUB-50.2:** iniciar o projeto local em `database/configlocal`.
- **SUB-50.3 a SUB-50.5:** migrações, variáveis de ambiente e `supabase start`.
- **SUB-50.6 e SUB-50.7:** alternar entre local e nuvem e documentar no `README.md`.
