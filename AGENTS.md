# 🤖 AGENTS.md — Porta de entrada para todas as IAs (Dashboard AI)

Vale para **todas as IAs** (Claude, Gemini, Grok, Copilot, Devin, DeepSeek, Antigravity etc.).
Este arquivo **não repete regras**: ele diz onde cada uma está. Cada regra existe em **um arquivo
só**, dentro de [`.claude/rules/`](.claude/rules/INDEX.md).

- **Regra nova pedida pelo usuário** → vai para o arquivo do assunto em `.claude/rules/` (veja o
  [`INDEX.md`](.claude/rules/INDEX.md)). Pedido para "salvar no `CLAUDE.md`" (ou `GEMINI.md`,
  `.cursorrules`, `copilot-instructions.md`…) significa salvar lá. Arquivos de uma IA só apenas
  apontam para este `AGENTS.md`.
- **Tarefas** ficam no quadro [`tasks/STATUS.md`](tasks/STATUS.md) (etapas em
  [`tasks/etapas/`](tasks/etapas/)). Nunca neste arquivo e nunca em `docs/`.

## ⛔ Antes de qualquer tarefa, leia (nesta ordem)

| # | Arquivo | O que define |
|---|---------|--------------|
| 1 | [`.claude/rules/essentials.md`](.claude/rules/essentials.md) | Sincronizar, o que ler, checklist de início |
| 2 | [`.claude/rules/git-quick.md`](.claude/rules/git-quick.md) | Tudo na `main`, hooks, commits, proibições |
| 3 | [`.claude/rules/tasks/quadro.md`](.claude/rules/tasks/quadro.md) | Onde fica cada informação; tarefa × subtarefa |
| 4 | [`.claude/rules/tasks/frentes-e-reserva.md`](.claude/rules/tasks/frentes-e-reserva.md) | Pegar e reservar subtarefa, prioridade, limites |
| 5 | [`.claude/rules/tasks/ciclo-da-task.md`](.claude/rules/tasks/ciclo-da-task.md) | Abrir, plano na etapa, executar, encerrar, retomar |
| 6 | [`.claude/rules/multiplas-ias.md`](.claude/rules/multiplas-ias.md) | Banco só pelo Claude Code local, trava especial, tamanho das subtarefas |
| 7 | [`.claude/rules/testes-validacao.md`](.claude/rules/testes-validacao.md) | Nunca abrir navegador; nunca escrever testes (exceto bug) |
| 8 | [`.claude/rules/codigo-solid.md`](.claude/rules/codigo-solid.md) e [`codigo-limites-nomes.md`](.claude/rules/codigo-limites-nomes.md) | Como escrever código |

Opcional: [`.claude/rules/reporte-progresso.md`](.claude/rules/reporte-progresso.md) (eventos no
monitor). Skill do fluxo: [`proxima-task`](.claude/skills/proxima-task/SKILL.md).

**Se uma regra daqui parecer contradizer outra, vale a do arquivo do assunto; avise o usuário.**

---

# 📎 Anexo — plano a ser movido (tarefa SUB-41)

> O texto abaixo **não é regra**: é o plano original do "Cérebro de Memória Persistente", já
> implementado. A tarefa **SUB-41** (ver `tasks/STATUS.md`) vai movê-lo para
> `docs/plano-cerebro-memoria-persistente.md`. Até lá, fica aqui sem alterações.

# 🧠 Plano de Implementação: Cérebro de Memória Persistente (Estilo Jev-Mem)
**Foco:** Ultra-rápido, baseado em primitivas estruturadas, custo zero de infraestrutura e consumo mínimo de tokens.
**Stack:** Claude Code / Antigravity + Vercel Serverless (Node/TS) + Supabase (Postgres + pgvector).

---

## 1. Arquitetura do Banco de Dados (Supabase)

Execute o script SQL abaixo no painel do seu Supabase para criar a estrutura de tabelas e habilitar a busca vetorial por proximidade.

> ℹ️ A versão consolidada e idempotente destes scripts fica na pasta [`database/`](database/README.md) (aplicar `01` → `04` em ordem). O trecho abaixo é a referência original do plano.

```sql
-- 1. Habilitar a extensão de busca vetorial
create extension if not exists vector;

-- 2. Criar a tabela principal de memórias canonicas
create table public.ai_memories (
    id uuid default gen_random_uuid() primary key,
    title text not null unique,
    content text not null, -- Armazenamento em Markdown limpo
    tags text[] default '{}'::text[],
    embedding vector(1536), -- Padrão OpenAI (text-embedding-3-small)
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Criar índice para busca vetorial acelerada (IVFFlat ou HNSW)
create index on public.ai_memories using hnsw (embedding vector_cosine_ops);

-- 4. Função RPC para busca híbrida acelerada (Evita processamento pesado no LLM)
create or replace function match_memories (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  content text,
  tags text[],
  similarity float
)
language sql stable
as $$
  select
    ai_memories.id,
    ai_memories.title,
    ai_memories.content,
    ai_memories.tags,
    1 - (ai_memories.embedding <=> query_embedding) as similarity
  from ai_memories
  where 1 - (ai_memories.embedding <=> query_embedding) > match_threshold
  order by ai_memories.embedding <=> query_embedding
  limit match_count;
$$;
```

---

## 2. Estrutura do Servidor MCP (Vercel Serverless)

O Claude Code precisa de respostas em formato JSON-RPC padrão do protocolo MCP. Crie o endpoint na Vercel utilizando a estrutura abaixo para processar os três verbos cognitivos principais.

> ℹ️ **Implementação real:** [`api/mcp.ts`](api/mcp.ts) (roteador JSON-RPC 2.0 / MCP Streamable HTTP) + [`api/_lib/`](api/_lib/) (registro de ferramentas). Diferente do exemplo abaixo, no MCP o método é sempre **`tools/call`** com o nome da ferramenta em **`params.name`** (não `tools/call/brain_store`), e toda resposta vai no envelope `{ "jsonrpc": "2.0", "id", "result" | "error" }`. O handshake `initialize` também é obrigatório. As primitivas `brain_store`/`brain_search`/`brain_delete` (SUB-07) estão em [`api/_lib/brain-tools.ts`](api/_lib/brain-tools.ts), com escopo por projeto (upsert por `project_id,title`, memória global com `project_id` nulo) e embeddings em `https://api.openai.com/v1/embeddings`; o acesso ao Supabase usa `@supabase/supabase-js` com a chave `service_role` ([`api/_lib/supabase.ts`](api/_lib/supabase.ts)); runtime Node.js 22+. O exemplo abaixo é apenas ilustrativo.

### Estrutura de Arquivos Recomendada
```text
📦 meu-mcp-brain
 ┣ 📂 api
 ┃ ┗ 📜 mcp.ts        # Endpoint principal Serverless
 ┣ 📜 package.json
 ┗ 📜 tsconfig.json
```

### Arquivo: `api/mcp.ts`
```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Apenas requisições POST são aceitas.' });
  }

  const { method, params } = req.body;

  try {
    switch (method) {
      // PRIMITIVA 1: ARMAZENAR (brain_store)
      case 'tools/call/brain_store': {
        const { title, content, tags } = params.arguments;
        
        // Gerar embedding leve (Ex: usando API gratuita do Gemini ou OpenAI barata)
        const embedding = await generateEmbedding(content);

        const { data, error } = await supabase
          .from('ai_memories')
          .upsert({ title, content, tags, embedding }, { onConflict: 'title' })
          .select();

        if (error) throw error;
        return res.json({ content: [{ type: 'text', text: `Memória "${title}" salva com sucesso.` }] });
      }

      // PRIMITIVA 2: PESQUISAR (brain_search) - O "Filtro Jev" Rápido
      case 'tools/call/brain_search': {
        const { query } = params.arguments;
        const queryEmbedding = await generateEmbedding(query);

        // Busca rápida por similaridade direto no banco (Sem gastar token de LLM caro)
        const { data: memories, error } = await supabase.rpc('match_memories', {
          query_embedding: queryEmbedding,
          match_threshold: 0.7,
          match_count: 3
        });

        if (error) throw error;

        const formattedResult = memories.map((m: any) => `[${m.title}]: ${m.content}`).join('\n\n');
        return res.json({ content: [{ type: 'text', text: formattedResult || 'Nenhuma memória relevante encontrada.' }] });
      }

      // PRIMITIVA 3: DELETAR (brain_delete)
      case 'tools/call/brain_delete': {
        const { title } = params.arguments;
        const { error } = await supabase.from('ai_memories').delete().eq('title', title);
        
        if (error) throw error;
        return res.json({ content: [{ type: 'text', text: `Memória "${title}" apagada.` }] });
      }

      // Listar Ferramentas disponíveis para o Claude Code reconhecer automaticamente
      case 'tools/list': {
        return res.json({
          tools: [
            { name: 'brain_store', description: 'Salva uma nova decisão ou contexto em Markdown', inputSchema: { type: 'object', properties: { title: { type: 'string' }, content: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } } }, required: ['title', 'content'] } },
            { name: 'brain_search', description: 'Busca memórias antigas relevantes para a tarefa atual', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
            { name: 'brain_delete', description: 'Remove uma memória pelo título', inputSchema: { type: 'object', properties: { title: { type: 'string' } }, required: ['title'] } }
          ]
        });
      }

      default:
        return res.status(404).json({ error: 'Método não encontrado' });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

// Helper para gerar embeddings usando a API de sua escolha
async function generateEmbedding(text: string): Promise<number[]> {
  // Exemplo com OpenAI text-embedding-3-small (Custo insignificante: \$0.00002 por 1k tokens)
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ input: text, model: 'text-embedding-3-small' })
  });
  const json = await response.json();
  return json.data[0].embedding;
}
```

---

## 3. Ativação no Terminal (Claude Code)

Após realizar o deploy do código acima na Vercel e configurar as variáveis de ambiente (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `OPENAI_API_KEY`), ative a sua memória compartilhada direto no Claude Code rodando o comando:

```bash
claude mcp add --transport http dashboard-ai-brain https://<seu-projeto>.vercel.app/api/mcp
```
