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

**Próximo passo:** executar conforme a descrição.

- **Descrição:** Criar `.github/workflows/backup-supabase-artifacts.yml` com: agendamento cron diário (2h UTC), gatilho manual (`workflow_dispatch`), passo de dump do banco usando `pg_dump` com a connection string do Supabase (secret `SUPABASE_DATABASE_URL`), compressão do dump (`gzip`), upload como artifact com nome `supabase-backup-${{ github.run_number }}`, retenção de 30 dias (configurável), e documentação de como baixar o artifact (aba Actions → run → Artifacts). Variáveis de ambiente: `SUPABASE_DATABASE_URL` (obrigatória, secret).
- **Critérios de Aceitação:** Workflow criado; sintaxe YAML válida; dry-run (workflow_dispatch) funciona; artifact gerado com tamanho aceitável (< 2 GB); documentação de download presente.
- **Commit:** pendente
- **Anotação:** pendente
- **STATUS-TAREFA-CONFIRMADO-CONCLUIDO:** PENDENTE
- **VERIFICADOR-CLAUDE:** PENDENTE

### SUB-49.2 — Documentar uso de GitHub Artifacts (limites, retenção, download)

**Próximo passo:** executar conforme a descrição.

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
