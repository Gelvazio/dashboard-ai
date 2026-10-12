# src/ — Frontend do Dashboard AI

React 19 + TypeScript + Vite + Tailwind CSS v4. Gerenciador **genérico e multi-projeto**:
todo dado exibido pertence ao projeto selecionado no header.

| Pasta | Conteúdo |
|---|---|
| `components/` | Componentes visuais reutilizáveis (só props; sem acesso a dados) |
| `services/` | Acesso ao Supabase (chave anon + JWT do usuário, RLS), sempre filtrado por `project_id` |
| `hooks/` | Hooks que ligam serviços à interface (`useTasks`, `useProjetoAtual`, ...) |
| `types/` | Tipos compartilhados (`database.ts` com as tabelas, `ViewId`, ...) |
| `views/` | Telas: Fila, Memória, Logs, Configurações |
| `styles/` | CSS global (`index.css`: Tailwind, tema, modo escuro) |
| `lib/` | Utilitários puros (`cn()` para classes) |

Convenções:
- Importe pelo alias `@/` (ex.: `import { cn } from '@/lib/utils'`); cada pasta tem um `index.ts` que reexporta o que é público.
- Nada de chaves no código: só `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` chegam ao navegador; a `service_role` fica no servidor (`api/`).
- Textos da interface em português; nada específico de um projeto (o produto serve a qualquer repositório).

## Autenticação (Supabase Auth)

O login usa o Supabase Auth do próprio projeto Supabase; nenhuma chave nova é necessária
além de `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (ver `.env.example`).

### 1. Habilitar o provedor de e-mail

No painel do Supabase: **Authentication → Sign In / Providers → Email**.

- Deixe **Enable Email provider** ligado (login com e-mail e senha, `entrarComSenha`).
- **Confirm email**: recomendado ligado; enquanto o usuário não confirmar, o login mostra
  "Confirme seu e-mail antes de entrar." (`mensagemErroAuth`).
- **Allow new users to sign up**: pode ficar desligado. O link mágico é enviado com
  `shouldCreateUser: false`, então só entra quem já foi cadastrado (ver
  `database/README.md` para o primeiro administrador e os membros dos projetos).

### 2. URLs de redirecionamento

O link mágico (`enviarLinkMagico`) e a redefinição de senha (`redefinirSenha`) voltam para a
URL calculada por `urlDeRetorno(location)` em `src/lib/auth.ts`: origem + caminho + tela do
hash (ex.: `https://seu-app.vercel.app/#/fila`), sem tokens de um acesso anterior.
Essa URL precisa estar liberada em **Authentication → URL Configuration**:

| Campo | Valor |
|---|---|
| **Site URL** | URL de produção, ex.: `https://seu-app.vercel.app` |
| **Redirect URLs** | `http://localhost:5173/**` (desenvolvimento com `npm run dev`) |
|  | `http://localhost:4173/**` (`npm run preview`) |
|  | `https://seu-app.vercel.app/**` (produção) |
|  | `https://*-sua-equipe.vercel.app/**` (previews da Vercel, opcional) |

Sem a URL na lista, o Supabase ignora o `redirectTo` e manda o usuário para a **Site URL**.

### 3. Sessão

- O cliente (`src/services/supabase.ts`) usa `persistSession: true`, `autoRefreshToken: true`
  e `detectSessionInUrl: true`: a sessão fica no `localStorage` do navegador (chave
  `sb-<ref>-auth-token`), o token é renovado sozinho e o retorno do link mágico/redefinição
  é lido da URL.
- `AuthProvider` (`src/hooks/AuthContext.tsx`) restaura a sessão ao abrir (`obterSessao`),
  acompanha `onAuthStateChange` e carrega o papel global (`obterPapelGlobal`); `useAuth()`
  expõe `sessao`, `usuario`, `papelGlobal`, `carregando` e `sair`.
- Sem sessão, `RotaProtegida` mostra a tela de login. `sair()` encerra a sessão e esquece o
  projeto selecionado (`localStorage['dashboard-ai:projeto']`).
- Todo acesso a dados continua decidido pela RLS a partir do JWT do usuário; a chave
  `service_role` nunca vai para o navegador.
