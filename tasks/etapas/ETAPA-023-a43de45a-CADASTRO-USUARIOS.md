## Etapa 023-a43de45a — SUB-62: Cadastro de usuários (mensagem enganosa e acesso após o cadastro)

**Tarefa:** SUB-62 · **Aberta em:** 2026-10-13 · **Executor:** por subtarefa (coluna "Em uso por" do [`tasks/STATUS.md`](../STATUS.md))
**Próximo passo:** ⏸️ o plano abaixo **precisa do "sim" do usuário** (tarefa **grande**: mexe em login/cadastro) antes de qualquer código. Nenhuma subtarefa reservada.

> Tarefa aberta a pedido do usuário, a partir do relato: *"criar usuário diz que criou, mas não tem nada no banco"* (2026-10-13).

### Tarefa-mãe

- **Descrição:** o formulário "Criar usuário" mostra **"Usuário criado…"** mesmo quando **nada é criado** (e-mail já cadastrado) e, quando o usuário é criado de fato, ele **não ganha papel nenhum** — então entra e não vê projeto algum, parecendo que "não foi criado". Corrigir a mensagem, explicar o acesso e documentar a diferença entre *usuário criado* (Auth) e *acesso liberado* (`user_roles`/`project_members`).
- **Nível:** **PESADO** — mexe em fluxo de login/cadastro e papéis (sinal de `PESADO` na skill `classificar-tarefa`), mesmo sendo poucos arquivos.
- **Critérios de Aceitação:** quem tenta cadastrar um e-mail que já existe recebe mensagem que **não afirma** que criou; usuário logado **sem papel** vê explicação do que falta; documentação do fluxo (Auth × papéis) atualizada; nada de papel atribuído automaticamente pelo frontend.
- **Status:** ⬜ Pendente — **plano aguardando aprovação do usuário**.

### Plano (objetivo, escopo, critério de pronto, premissas, riscos)

- **Objetivo:** acabar com a mensagem enganosa do cadastro e com o "logado mas sem acesso" sem explicação; deixar claro na documentação como um administrador libera o acesso.
- **Entra:** mensagens/estados do formulário de cadastro e do login; a detecção de "e-mail já cadastrado" no serviço de auth; documentação em `README.md` e `database/README.md`.
- **Não entra:** permitir que o frontend atribua papel (decisão de segurança do projeto: papel só pelo banco, por administrador); mudar RLS; aplicar qualquer coisa no Supabase de produção sem autorização; criar testes novos (regra do projeto).
- **Critério de pronto:** os três itens acima entregues, com `npm run typecheck`, `npm run build` e `npm test` verdes e as mensagens conferidas por leitura de código.
- **Premissas:** o Supabase Auth está com confirmação de e-mail ligada na nuvem; o projeto mantém a regra "papel só pelo banco"; quem usa a tela é o próprio usuário (admin) para validar.
- **Riscos e plano B:** (1) a detecção de e-mail existente depende do formato da resposta do `signUp` (`identities` vazio) — se mudar de versão, cair para uma mensagem neutra do tipo "confira seu e-mail **ou** entre com sua conta"; (2) mexer em mensagens de login pode afetar testes existentes — rodar a suíte antes e depois.
- **Verificação de cada subtarefa:** 62.1 e 62.2 — `typecheck` + `build` + suíte, e leitura das mensagens no código; 62.3 — links do Markdown conferidos; 62.4 — aceite do usuário.

### Diagnóstico (2026-10-13, DeepSeek Harness (deepseek-flash)) — evidências levantadas

- **Nuvem** (`fcmntkzpjoetdabllabn`, só leitura): `auth.users` = **2** (ambos confirmados, criados em **2026-10-12 21:43** e **21:50**, logins em 21:58 e 21:51); `public.user_roles` = **1** (papel `admin`); `public.project_members` = **0**; `public.projects` = **1**. **Nenhum usuário foi criado em 2026-10-13** — a tentativa relatada não gravou nada.
- **Código:** `src/components/auth/CadastroForm.tsx` tem duas mensagens: *"Usuário criado. Confira seu e-mail para confirmar o cadastro e depois entre."* (`precisaConfirmar`) e *"Usuário criado. Você já pode entrar."* — as duas afirmam criação. O `cadastrarUsuario()` (`src/services/authService.ts`) só lança erro quando o Supabase devolve `error`; sem sessão assume "precisa confirmar".
- **Comportamento do Supabase Auth (hipótese principal, a confirmar com e-mail novo):** com confirmação de e-mail ligada, `signUp` de um **e-mail já cadastrado** devolve **sucesso sem erro e sem sessão** (anti-enumeração) — a tela mostra "Usuário criado. Confira seu e-mail…" e nada é criado. O relato casa exatamente com isso.
- **Banco local** (para testes): `auth.users` = 0, `GOTRUE_MAILER_AUTOCONFIRM=true` e `GOTRUE_DISABLE_SIGNUP=false` — ou seja, no local o cadastro entra **já confirmado**.
- **Ambiente do app:** `.env` aponta para a **nuvem**; `.env.local` (que aponta para o local) está como `.env.local.off` — `npm run dev` usa a nuvem, `npm run dev:local` usa o local.
- **Papel do segundo usuário:** existe no Auth e **não** tem papel nem projeto — por desenho (o frontend não atribui papel). Ele entra e não vê nada; é o que dá a impressão de "não foi criado".

### SUB-62.1 — Cadastro: não afirmar criação quando o e-mail já existe

- **Nível:** PESADO — fluxo de login/cadastro (`src/services/authService.ts` + `src/components/auth/CadastroForm.tsx`).
- **Descrição:** no `cadastrarUsuario()`, detectar o caso "e-mail já cadastrado" (resposta do `signUp` sem sessão e com `identities` vazio) e devolver um estado diferente; o formulário passa a mostrar uma mensagem neutra e útil: *"Se este e-mail já tem conta, use **Entrar** ou recupere a senha. Se não tem, confira seu e-mail para confirmar."* — sem afirmar que criou.
- **Critérios de Aceitação:** mensagens distintas para os três casos (criado com sessão, criado aguardando confirmação, e-mail já existente); nenhuma mensagem afirma criação no terceiro caso; `typecheck`, `build` e suíte verdes.
- **Próximo passo:** executar conforme a descrição (depois da aprovação do plano).
- **Anotação:** pendente

### SUB-62.2 — Logado sem acesso: dizer o que falta

- **Nível:** PESADO — login/papéis na tela de entrada/estado vazio.
- **Descrição:** quando o usuário entra e não tem papel global nem vínculo em `project_members`, mostrar aviso claro: *"Sua conta existe, mas ainda não tem acesso a nenhum projeto. Peça a um administrador para liberar."* (em vez de tela vazia silenciosa).
- **Critérios de Aceitação:** o aviso aparece só nesse caso (tem papel ou tem projeto → não aparece); `typecheck`, `build` e suíte verdes.
- **Próximo passo:** executar conforme a descrição (depois da aprovação do plano).
- **Anotação:** pendente

### SUB-62.3 — Documentar: usuário criado ≠ acesso liberado

- **Nível:** LEVE — só `.md` (`README.md`, `database/README.md`).
- **Descrição:** explicar em um lugar só: o cadastro cria o usuário no **Auth**; o acesso vem de `user_roles` (admin/member) e `project_members` (owner/editor/viewer), gravados por um **administrador**; incluir o exemplo de `insert` para liberar, com o aviso de que é banco de produção (autorização do usuário).
- **Critérios de Aceitação:** links relativos funcionando; texto coerente com o `database/README.md` ("Primeiro administrador e membros").
- **Próximo passo:** executar conforme a descrição (depois da aprovação do plano).
- **Anotação:** pendente

### SUB-62.4 — Aceite do usuário

- **Nível:** LEVE — confirmação do solicitante.
- **Descrição:** o usuário confere a mensagem do cadastro (com um e-mail que já existe e com um novo) e o aviso de "sem acesso", e confirma o aceite.
- **Critérios de Aceitação:** aceite registrado nesta seção.
- **Próximo passo:** ⏸️ depende de 62.1–62.3.
- **Anotação:** pendente

### Decisões

- **2026-10-13 (abertura da tarefa):** o usuário pediu que o caso relatado virasse tarefa no quadro ("atualize as tasks") e, antes, pediu para eu **não** executar sem o "sim" de tarefa grande (regra do projeto). Classificação PESADO feita **pelos sinais** da skill `classificar-tarefa` (o Laya não foi consultado nesta sessão) — pela matriz, **`PESADO` é só do Claude Code com Opus 5.5 ou superior, ou Fable**. Registrado por DeepSeek Harness (deepseek-flash) (local · main).
