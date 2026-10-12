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
