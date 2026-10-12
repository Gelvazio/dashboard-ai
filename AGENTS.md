# 🤖 DIRETRIZES DE AGENTES DE IA & PROTOCOLO DE CONCORRÊNCIA

> **AVISO A TODOS OS AGENTES DE IA (Claude, Gemini, Grok, Copilot, Antigravity, etc.):**
> Este repositório opera com fluxo autônomo baseado em fila atômica de tarefas e trava contra conflitos de edição.
> Siga rigorosamente as regras abaixo **ANTES** de executar qualquer código.

---

## 🔒 1. PROTOCOLO OBRIGATÓRIO DE TRAVA (LOCK) E CONCORRÊNCIA

1. **Leitura Obrigatória Inicial:**
   - Antes de qualquer ação, leia os arquivos:
     - 📄 [`quadro-task-principal.md`](file:///c:/fontes/dashboard-ai/quadro-task-principal.md)
     - 📄 [`task-principal.md`](file:///c:/fontes/dashboard-ai/task-principal.md)

2. **Verificação de Trava Ativa:**
   - Verifique a seção **"🔒 TRAVA ATIVA NO MOMENTO"** em `quadro-task-principal.md`.
   - ⛔ **PROIBIÇÃO DE CONFLITO:** Se já existir uma sub-task com status `EM EXECUÇÃO` associada a outro agente, **NENHUMA OUTRA IA PODE ASSUMIR AQUELA MESMA TAREFA**. O agente deve aguardar ou escolher a próxima sub-task pendente sem dependências não atendidas.

3. **Bloqueio Antes de Iniciar:**
   - Para assumir uma sub-task com status `pendente`:
     - Atualize o `quadro-task-principal.md`: marque a trava como `OCUPADO`, informe o nome do seu agente, a data/hora de início e o código da sub-task.
     - Atualize o status da sub-task para `em_execucao` em `task-principal.md`.

4. **Status Oficiais Permitidos:**
   - `pendente`: Aguardando execução.
   - `em_execucao`: Bloqueada pelo agente ativo (trava ativa).
   - `concluido`: Entregue com sucesso e validada.
   - `cancelado`: Descontinuada ou substituída.

5. **Commit e Anotação Imediatos Pós-Finalização:**
   - Toda e qualquer mini-task concluída **DEVE OBRIGATORIAMENTE** gerar:
     - Atualização do status em `task-principal.md` para `concluido` com a anotação detalhada do que foi feito.
     - Atualização em `quadro-task-principal.md`: liberação da trava (`LIVRE`), inserção da linha no histórico com o hash do commit (`Commit SHA`), agente responsável e nota técnica.
     - Execução imediata do comando `git commit` registrando o código da sub-task na mensagem.

---

# 🧠 Plano de Implementação: Cérebro de Memória Persistente (Estilo Jev-Mem)
**Foco:** Ultra-rápido, baseado em primitivas estruturadas, custo zero de infraestrutura e consumo mínimo de tokens.
**Stack:** Claude Code / Antigravity + Vercel Serverless (Node/TS) + Supabase (Postgres + pgvector).

---

## 2. Arquitetura do Banco de Dados (Supabase)

Execute o script SQL abaixo no painel do seu Supabase para criar a estrutura de tabelas e habilitar a busca vetorial por proximidade.

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
  order in by ai_memories.embedding <=> query_embedding
  limit match_count;
$$;
```

---

## 3. Estrutura do Servidor MCP (Vercel Serverless)

O Claude Code precisa de respostas em formato JSON-RPC padrão do protocolo MCP. Crie o endpoint na Vercel utilizando a estrutura abaixo para processar os três verbos cognitivos principais.

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
import { createClient } from '@supabase/supabase-client';

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
  const response = await fetch('https://openai.com', {
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

## 4. Ativação no Terminal (Claude Code)

Após realizar o deploy do código acima na Vercel e configurar as variáveis de ambiente (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `OPENAI_API_KEY`), ative a sua memória compartilhada direto no Claude Code rodando o comando:

```bash
claude mcp add meu-brain-barato https://vercel.app
```
