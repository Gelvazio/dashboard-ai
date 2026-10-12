# Login com cadastro de usuário e administrador inicial (SUB-40)

- **Criado em:** 2026-10-12 · **Executor:** Claude Code (Opus 5.5) · **Aprovação:** pedido do usuário no chat ("PEGUE A TAREFA DE LOGIN E EXECUTE A SUB-40")
- **Quadro:** blocos `SUB-40` e `SUB-40.1` a `SUB-40.7` em [`task-principal.md`](../task-principal.md) (fonte da verdade do detalhamento de cada passo)
- **Conclusão:** pendente · **Tempo decorrido:** pendente

## Objetivo

Na tela de login, oferecer "Criar usuário" (formulário de cadastro com Supabase Auth `signUp`). Se o
e-mail cadastrado for `gelvazio@gmail.com` e ainda não existir, ele vira administrador
(`user_roles.role = 'admin'`) — decidido **só pelo banco** e **só após a confirmação do e-mail**.

## Escopo

- **Entra:** SQL `database/08_admin_inicial.sql`; `validarCadastro` e mensagens em `src/lib/auth.ts`;
  `cadastrarUsuario` em `src/services/authService.ts`; `src/components/auth/CadastroForm.tsx`;
  alternância Entrar/Criar usuário na `LoginView`; documentação (`README.md`, `database/README.md`);
  aplicação do SQL no Supabase **só com autorização explícita**.
- **Não entra:** testes automatizados novos (regra do usuário); papel escolhido pelo frontend;
  alteração de usuários existentes.

## Riscos

| Risco | Plano B |
|---|---|
| Alguém se cadastrar com o e-mail do administrador sem ter a caixa de entrada | Admin só com `email_confirmed_at` preenchido |
| Script quebrar em PostgreSQL puro (sem schema `auth`) | Trigger criada só se `to_regclass('auth.users')` existir |
| "Confirm email" desligado no Supabase | Documentar a configuração (SUB-40.6); sem confirmação o admin não é criado |
| Aplicar SQL no banco remoto sem querer | SUB-40.7 só com autorização explícita no chat |

## Passos

| # | Subtarefa | Arquivos | Verificação | Status |
|---|---|---|---|---|
| 1 | SUB-40.1 SQL do administrador inicial | `database/08_admin_inicial.sql` | leitura do SQL (idempotência, `security definer`, `revoke`) | ✅ Concluído (`e64524e`) |
| 2 | SUB-40.2 Validação e mensagens | `src/lib/auth.ts` | `npm run typecheck`, `npm test` | ✅ Concluído (`b2a9289`) |
| 3 | SUB-40.3 Serviço `cadastrarUsuario` | `src/services/authService.ts` | `npm run typecheck`, `npm test` | ✅ Concluído (`a48672a`) |
| 4 | SUB-40.4 Formulário de cadastro | `src/components/auth/CadastroForm.tsx`, `index.ts` | `npm run typecheck`, `lint`, `build` | ✅ Concluído (`a86f688`) |
| 5 | SUB-40.5 Alternar Entrar/Criar usuário | `src/views/LoginView.tsx` | `npm run validar` | ✅ Concluído (`d7b0fba`) |
| 6 | SUB-40.6 Documentação | `README.md`, `database/README.md` | `npm run validar` | ✅ Concluído (`7bc0f0e`) |
| 7 | SUB-40.7 Aplicar SQL no Supabase | banco remoto | consultas só de leitura | ⬜ Pendente (precisa de autorização) |
