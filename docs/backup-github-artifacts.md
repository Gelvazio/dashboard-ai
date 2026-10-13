# 💾 Backup do Supabase no GitHub Artifacts

Workflow: [`backup-supabase-artifacts.yml`](../.github/workflows/backup-supabase-artifacts.yml)
(SUB-49.1, criptografia na SUB-49.5). Roda todo dia às **02:00 UTC (23:00 de Brasília)** e também
pelo botão **Run workflow** (`workflow_dispatch`).

## ⚠️ Antes de tudo: o repositório é público

Num repositório público, **qualquer pessoa com conta no GitHub** tem acesso de leitura e pode baixar
os artifacts. Por isso o dump sai **criptografado** (AES-256, `gpg`) e o workflow **para antes do
dump** se o secret `SUPABASE_BACKUP_PASSPHRASE` não existir ou tiver menos de 20 caracteres.

- O artifact é baixável por qualquer um, mas só abre com a senha.
- **Perder a senha = perder os backups.** Guarde-a fora do GitHub (gerenciador de senhas).
- Trocar a senha vale só para os próximos backups; os antigos continuam com a senha antiga.

## O que é o GitHub Artifacts

Arquivos que um workflow publica ao terminar, guardados pelo GitHub junto da execução e apagados
sozinhos depois do prazo de retenção. Não é armazenamento permanente.

| Item | Valor |
|---|---|
| Retenção padrão do GitHub | 90 dias |
| Retenção máxima em repositório público | 90 dias |
| Retenção máxima em repositório privado | 400 dias (configurável por organização) |
| Retenção usada pelo workflow | 30 dias (variável `SUPABASE_BACKUP_RETENTION_DAYS`) |
| Armazenamento incluso no plano Free (repositório privado) | 500 MB, dividido com o GitHub Packages |
| Minutos de runner self-hosted | Não são cobrados |

O armazenamento é medido por hora (GB-hora): cada backup conta até expirar. Em repositório público,
a documentação de cobrança diz que o Actions é gratuito com runners padrão, mas não detalha o
armazenamento de artifacts; acompanhe pelo uso da conta (abaixo).

**Quando usar:** dump comprimido pequeno e histórico de até 90 dias. Precisa de mais tempo ou mais
espaço → Cloudflare R2 (SUB-49.3).

## Configurar (1x)

1. **Settings → Secrets and variables → Actions → Secrets**:
   - `SUPABASE_LOCAL_DATABASE_URL` = `postgresql://postgres:<senha-local>@host.docker.internal:54322/postgres`
   - `SUPABASE_BACKUP_PASSPHRASE` = senha longa e aleatória (≥ 20 caracteres), por exemplo a saída de
     `openssl rand -base64 32`.
2. Opcional, em **Variables**: `SUPABASE_BACKUP_RETENTION_DAYS` (1 a 90).
3. Runner self-hosted Windows (`[self-hosted, Windows, X64]`) com Docker Desktop e o Supabase local
   ligados no horário do backup.

## Baixar um backup

- **Pela tela:** aba **Actions** → *Backup Supabase para GitHub Artifacts* → execução → seção
  **Artifacts** → `supabase-backup-<número>`. O GitHub entrega um `.zip` com o
  `supabase-backup.sql.gz.gpg` dentro.
- **Pelo terminal** (GitHub CLI):

```bash
gh run list --workflow backup-supabase-artifacts.yml --limit 5   # ID da execução
gh run download <ID> --name supabase-backup-<número>   # já descompacta o .zip
```

## Restaurar

```bash
# Pede a senha do SUPABASE_BACKUP_PASSPHRASE; gunzip descompacta; psql aplica no destino.
gpg --decrypt supabase-backup.sql.gz.gpg | gunzip | psql "postgresql://postgres:<senha>@localhost:54322/postgres"
```

- Restaure primeiro num banco **vazio ou de teste** (ex.: o Supabase local, `docs/supabase-local.md`).
- O dump é feito com `--no-owner --no-privileges`: donos e permissões ficam com quem restaura.
- ⚠️ Restaurar no Supabase da **nuvem** exige autorização explícita do usuário
  (`.claude/rules/multiplas-ias.md`).

## Ajustar a retenção

Crie ou mude a variável `SUPABASE_BACKUP_RETENTION_DAYS` (Settings → Secrets and variables →
Actions → Variables). Vale para os próximos backups; os já publicados mantêm o prazo com que foram
criados. Sem a variável, o workflow usa 30 dias (`retention-days` no passo *Publicar backup como
artifact*).

## Acompanhar o uso

- **Uso da conta:** configurações da sua conta no GitHub → **Billing and licensing** → uso do
  Actions e do armazenamento.
- **Artifacts do repositório:** `gh api repos/Gelvazio/dashboard-ai/actions/artifacts` lista nome,
  tamanho e validade de cada backup.

## Fontes

- [Baixar artifacts de workflow (GitHub Docs)](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/download-workflow-artifacts)
- [Retenção de artifacts e logs (GitHub Docs)](https://docs.github.com/en/organizations/managing-organization-settings/configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-organization)
- [Cobrança do GitHub Actions (GitHub Docs)](https://docs.github.com/en/billing/concepts/product-billing/github-actions)
