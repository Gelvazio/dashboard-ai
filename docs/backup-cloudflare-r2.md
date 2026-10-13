# ☁️ Backup do Supabase no Cloudflare R2

Workflow: [`backup-supabase-r2.yml`](../.github/workflows/backup-supabase-r2.yml) (SUB-49.3).
Alternativa ao [GitHub Artifacts](backup-github-artifacts.md) para guardar backups por **mais de 90
dias** ou com **mais espaço**. Mesmo runner, mesmo horário (02:00 UTC, 23:00 de Brasília) e o mesmo
dump **criptografado** (AES-256, `gpg`), enviado para um bucket privado do R2.

- **Desligado por padrão:** o agendamento só roda com a variável `SUPABASE_BACKUP_R2_ENABLED` =
  `true`. O botão **Run workflow** roda sempre, para testar antes de ligar.
- **Senha obrigatória:** sem o secret `SUPABASE_BACKUP_PASSPHRASE` (≥ 20 caracteres) o job para
  antes do dump. É a mesma senha do workflow de Artifacts. **Perder a senha = perder os backups.**

## Custos (Cloudflare, R2 Standard)

| Item | Grátis por mês | Acima do grátis |
|---|---|---|
| Armazenamento | 10 GB-mês | US$ 0,015 por GB-mês |
| Operações Classe A (gravar, listar) | 1 milhão | US$ 4,50 por milhão |
| Operações Classe B (ler) | 10 milhões | US$ 0,36 por milhão |
| Saída (download) | Grátis | Grátis |

Um backup por dia são cerca de 30 gravações por mês: o que pesa é o **armazenamento**. Exemplo: dump
cifrado de 50 MB guardado por 1 ano ≈ 18 GB → cerca de 8 GB acima do grátis ≈ US$ 0,12 por mês.

## Configurar (1x)

1. **Bucket:** no painel da Cloudflare, **R2 object storage** → **Create bucket** (ex.:
   `dashboard-ai-backups`). Deixe sem acesso público.
2. **Token só deste bucket:** em **R2 object storage**, **Account Details** → **Manage** (ao lado de
   **API Tokens**) → **Create Account API token** → permissão **Object Read & Write** → limite ao
   bucket do passo 1 → criar. Anote o **Access Key ID** e o **Secret Access Key** — o secret só
   aparece **uma vez**.
3. **Account ID:** aparece no painel da Cloudflare (página da conta / R2). O endereço do R2 é
   `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` (o painel não mostra; o workflow monta sozinho).
4. **Secrets do GitHub** (Settings → Secrets and variables → Actions → Secrets):

   | Secret | Valor |
   |---|---|
   | `CLOUDFLARE_R2_ACCOUNT_ID` | Account ID |
   | `CLOUDFLARE_R2_ACCESS_KEY` | Access Key ID do token |
   | `CLOUDFLARE_R2_SECRET_KEY` | Secret Access Key do token |
   | `CLOUDFLARE_R2_BUCKET` | Nome do bucket |
   | `SUPABASE_BACKUP_PASSPHRASE` | Senha de criptografia (a mesma do Artifacts) |
   | `SUPABASE_LOCAL_DATABASE_URL` | `postgresql://postgres:<senha>@host.docker.internal:54322/postgres` |

5. **Testar:** aba **Actions** → *Backup Supabase para Cloudflare R2* → **Run workflow**. O resumo
   da execução mostra o objeto gravado.
6. **Ligar o agendamento:** variável `SUPABASE_BACKUP_R2_ENABLED` = `true` (Settings → Secrets and
   variables → Actions → **Variables**). Para desligar, apague a variável ou ponha `false`.

## Retenção (regra de ciclo de vida)

Sem regra, os objetos **ficam guardados** (e o armazenamento cresce). Para apagar sozinho depois de
N dias: **R2 object storage** → bucket → **Settings** → **Object Lifecycle Rules** → **Add rule** →
prefixo `supabase/` e o prazo de expiração → **Save changes**.

## Onde fica cada backup

`s3://<bucket>/supabase/AAAA/MM/DD/supabase-backup-<número da execução>.sql.gz.gpg` (data em UTC).

## Baixar e restaurar

Com o [AWS CLI](https://aws.amazon.com/cli/) (o R2 é compatível com S3) e as chaves do token:

```bash
export AWS_ACCESS_KEY_ID=<Access Key ID> AWS_SECRET_ACCESS_KEY=<Secret Access Key>
export AWS_DEFAULT_REGION=auto
R2="https://<ACCOUNT_ID>.r2.cloudflarestorage.com"

aws s3 ls "s3://<bucket>/supabase/" --recursive --endpoint-url "$R2"          # listar
aws s3 cp "s3://<bucket>/supabase/AAAA/MM/DD/supabase-backup-N.sql.gz.gpg" . \
  --endpoint-url "$R2"                                                          # baixar

# Pede a senha do SUPABASE_BACKUP_PASSPHRASE; gunzip descompacta; psql aplica no destino.
gpg --decrypt supabase-backup-N.sql.gz.gpg | gunzip \
  | psql "postgresql://postgres:<senha>@localhost:54322/postgres"
```

- Restaure primeiro num banco **vazio ou de teste** (ex.: o Supabase local,
  `docs/supabase-local.md`).
- ⚠️ Restaurar no Supabase da **nuvem** exige autorização explícita do usuário
  (`.claude/rules/multiplas-ias.md`).
- Erro de checksum com AWS CLI recente: use `AWS_REQUEST_CHECKSUM_CALCULATION=WHEN_REQUIRED` e
  `AWS_RESPONSE_CHECKSUM_VALIDATION=WHEN_REQUIRED` (o workflow já usa).

## Fontes

- [Preços do R2 (Cloudflare)](https://developers.cloudflare.com/r2/pricing/)
- [Tokens de API do R2 (Cloudflare)](https://developers.cloudflare.com/r2/api/tokens/)
- [AWS CLI com o R2 (Cloudflare)](https://developers.cloudflare.com/r2/examples/aws/aws-cli/)
- [Ciclo de vida de objetos no R2 (Cloudflare)](https://developers.cloudflare.com/r2/buckets/object-lifecycles/)
