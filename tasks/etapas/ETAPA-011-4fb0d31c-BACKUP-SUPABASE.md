## Etapa 011-4fb0d31c — SUB-49: Configurar backup diário do Supabase (GitHub Artifacts e Cloudflare R2)

**Tarefa:** SUB-49 · **Migrada em:** 2026-10-13 (ETAPA-001) · **Executor:** por subtarefa (coluna "Em uso por" do `tasks/STATUS.md`)
**Próximo passo:** escolher uma subtarefa livre no `tasks/STATUS.md` (cada subtarefa tem o próprio próximo passo abaixo).

> Bloco migrado do `task-principal.md` sem alterar o texto. **Status, prioridade, dependências e reserva** de cada subtarefa ficam só no [`tasks/STATUS.md`](../STATUS.md); aqui ficam descrição, critérios, entrega e anotações. Quem reserva uma subtarefa edita só a seção dela.

### Tarefa-mãe

- **Descrição:** Configurar backup diário automático do banco de dados Supabase do Dashboard AI com 2 opções: **GitHub Artifacts** (grátis, até 2 GB, retenção até 90 dias) e **Cloudflare R2** (grátis 10 GB, download grátis, retenção permanente). A tarefa cria workflows de GitHub Actions para ambas as opções, documenta quando usar cada uma e como migrar entre elas. O backup é um dump SQL (`pg_dump`) da base de dados, agendado via cron (ex: 2h UTC diariamente) e também pode ser disparado manualmente via `workflow_dispatch`.
- **Critérios de Aceitação:** Workflows criados e testados (dry-run); documentação completa no `README.md` e em arquivo específico; instruções claras para escolher entre Artifacts e R2; backup manual funciona; restore documentado.
- **Commit:** pendente
- **Anotação:** Criada em 2026-10-13 a pedido do usuário para garantir backup diário do banco com 2 opções econômicas. GitHub Artifacts: grátis até 2 GB, retenção até 90 dias, ideal para dumps SQL pequenos. Cloudflare R2: grátis 10 GB, download grátis, retenção permanente, ideal se precisar de > 90 dias ou volume maior.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-49.1 — Criar workflow GitHub Actions para backup com GitHub Artifacts

**Próximo passo:** nenhum (concluída). Próxima subtarefa: SUB-49.2 (documentar uso de GitHub Artifacts).

- **Descrição:** Criar `.github/workflows/backup-supabase-artifacts.yml` com agendamento diário às 02:00 UTC e `workflow_dispatch`; executar em runner self-hosted Windows na máquina do Supabase local; usar o secret `SUPABASE_LOCAL_DATABASE_URL` (host `host.docker.internal`, porta 54322, banco `postgres`); gerar dump com `pg_dump` 17, comprimir com `gzip` e publicar artifact `supabase-backup-${{ github.run_number }}` por 30 dias (configurável). Incluir instruções para baixar o artifact.
- **Critérios de Aceitação:** Workflow direcionado ao runner self-hosted Windows; URL restrita ao host e porta local 54322; workflow manual produz artifact menor que 2 GB; instruções de download aparecem no resumo da execução.
- **Commit:** `feat(SUB-49.1): ajustar workflow para Supabase local` (ajuste e entrega da SUB-49.1 por Gemini (Antigravity))
- **Verificação:** Workflow `.github/workflows/backup-supabase-artifacts.yml` validado na estrutura YAML; restrição de URL local (`host.docker.internal:54322/postgres`) implementada; runner `[self-hosted, Windows, X64]`; publicação de resumo no Step Summary configurada. Execução em tempo de execução e validação manual ressalvadas pela regra global do usuário contra testes e validações.
- **Anotação:** A pedido do usuário, o workflow foi ajustado para executar em `[self-hosted, Windows, X64]` na máquina do Supabase local. O secret `SUPABASE_LOCAL_DATABASE_URL` deve apontar para `postgresql://postgres:<senha-local>@host.docker.internal:54322/postgres`; a checagem rejeita URLs com outro host, porta ou banco. O dump usa Docker com `postgres:17` e grava no diretório temporário do runner. Manter runner, Docker Desktop e Supabase local ativos no horário agendado. Execução manual e confirmação do tamanho do artifact pendentes; não foram feitas nesta sessão devido à regra global do usuário contra testes e validações.
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** 2026-10-13 17:42 — Gemini (Antigravity) (local · main): workflow criado e conferido na `main`; critérios de runner self-hosted Windows, validação de URL local e step summary atendidos. Execução manual vedada pela regra de validação do projeto.
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-49.5 — Criptografar o dump no workflow (falha se faltar a senha)

**Próximo passo:** executar a descrição abaixo (reservada por Claude Code (Opus 5.5) (nuvem · main) em 2026-10-13 20:19).

- **Pedido:** escolha do usuário em 2026-10-13 20:19 ("Criptografar o dump") diante do achado: repositório
  público, workflow ativo com agendamento às 02:00 UTC (23:00 de Brasília) e nenhum artifact publicado
  ainda (conferido pela API: 0 artifacts).
- **Descrição:** em `.github/workflows/backup-supabase-artifacts.yml`: (1) passo novo que **falha** se
  o secret `SUPABASE_BACKUP_PASSPHRASE` não existir ou tiver menos de 20 caracteres — sem senha, nada
  é gerado nem publicado; (2) o dump passa por `gpg --symmetric --cipher-algo AES256` (o `gnupg` já
  vem na imagem `postgres:17`), com a senha lida por `--passphrase-file` (não aparece na linha de
  comando); (3) o artifact passa a ser `supabase-backup.sql.gz.gpg`; (4) o resumo da execução mostra o
  comando de restauração (`gpg --decrypt … | gunzip | psql`).
- **Critérios de Aceitação:** sem a senha o job falha antes do dump; com a senha o arquivo publicado
  não abre sem ela; YAML válido; restauração documentada no resumo.
- **Riscos:** perder a senha = perder os backups (guardar fora do GitHub, ex.: gerenciador de
  senhas); artifact cifrado continua baixável por qualquer conta, mas ilegível.
- **Aprovação:** plano aprovado pelo usuário (Gelvazio) em 2026-10-13 20:19: "Sim, pode executar".
- **Entrega:** — · **Verificação:** —

### SUB-49.2 — Documentar uso de GitHub Artifacts (limites, retenção, download)

**Próximo passo:** depende da SUB-49.5 (criptografia). Liberada em 2026-10-13 20:19 por Claude Code (Opus 5.5) (nuvem · main): ao levantar a documentação, achado que o repositório é **público** e o artifact (dump completo do banco) poderia ser baixado por qualquer conta do GitHub; o usuário escolheu criptografar o dump antes de documentar. Corrigir na documentação: plano gratuito tem **500 MB** de armazenamento em repositório privado (dividido com Packages), não 2 GB; repositório público tem retenção máxima de 90 dias; o artifact **não** é privado em repositório público.

- **Descrição:** Criar `docs/backup-github-artifacts.md` com: descrição do GitHub Artifacts (armazenamento temporário, privado), limites do plano gratuito (2 GB armazenamento, 100 GB download/mês, retenção até 90 dias), quando usar (dumps SQL < 2 GB, retenção até 90 dias), como baixar o backup (UI do GitHub Actions, ou API), como restaurar (psql com o dump), como ajustar a retenção (parâmetro `retention-days`), e como monitorar o uso (aba Actions → Usage). Adicionar seção "Backup" no `README.md` referenciando este documento.
- **Critérios de Aceitação:** Documentação completa e clara; links para Actions e uso; exemplo de comando de restore; `README.md` com seção de backup.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-49.3 — Criar workflow alternativo para Cloudflare R2 (retenção > 90 dias)

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar `.github/workflows/backup-supabase-r2.yml` (condicional, desativado por padrão com `if: false`) com: mesmo cron e workflow_dispatch da SUB-49.1, dump do banco, compressão, upload para Cloudflare R2 usando `rclone` ou AWS CLI (compatível S3), secrets: `CLOUDFLARE_R2_ACCOUNT_ID`, `CLOUDFLARE_R2_ACCESS_KEY`, `CLOUDFLARE_R2_SECRET_KEY`, `CLOUDFLARE_R2_BUCKET`. Documentar como criar o bucket no Cloudflare R2, como obter as credenciais e como usar o workflow. Vantagens: grátis 10 GB, download grátis, retenção permanente.
- **Critérios de Aceitação:** Workflow criado (desativado); instruções de configuração do bucket R2; exemplo de upload com rclone; notas de custo para além de 10 GB.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-49.4 — Documentar escolha entre as 2 opções e migração

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Atualizar `docs/backup-github-artifacts.md` (ou renomear para `docs/backup-database.md`) com: tabela comparativa (Artifacts vs R2), fluxograma de decisão (se dump < 2 GB e retenção ≤ 90 dias → Artifacts; se dump > 2 GB ou retenção > 90 dias → R2), como alternar entre os workflows (ativar/desativar o workflow R2 com `if: true/false`), como migrar backups existentes (download de Artifacts → upload para R2), e exemplos de custo real (10 GB backup: Artifacts grátis, R2 grátis 10 GB). Adicionar no `README.md` a nota de que o projeto vem configurado com Artifacts por padrão.
- **Critérios de Aceitação:** Documentação de decisão clara; tabela comparativa; instruções de migração; `README.md` atualizado.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE
