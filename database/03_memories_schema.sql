-- =============================================================================
-- Dashboard AI — 03_memories_schema.sql
-- Memória persistente vetorial (Jev-Mem): tabela `public.ai_memories` + pgvector.
--
-- Idempotente e autossuficiente (pode ser aplicado mesmo sem 01/02).
-- A função de busca `match_memories` fica em 04_rpc_functions.sql.
-- =============================================================================

-- 1. Extensão de busca vetorial (no Supabase: Database > Extensions > vector)
create extension if not exists vector;

-- 2. Função utilitária de updated_at (mesma definição de 01_tasks_schema.sql;
--    repetida aqui para o arquivo poder ser aplicado isoladamente)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- 3. Tabela de memórias canônicas
create table if not exists public.ai_memories (
    id          uuid        primary key default gen_random_uuid(),
    title       text        not null unique,             -- chave natural usada no upsert (onConflict: 'title')
    content     text        not null,                    -- conteúdo em Markdown limpo
    tags        text[]      not null default '{}'::text[],
    embedding   vector(1536),                            -- OpenAI text-embedding-3-small (1536 dimensões)
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

comment on table  public.ai_memories           is 'Memórias canônicas persistentes dos agentes de IA (Jev-Mem).';
comment on column public.ai_memories.title     is 'Título único da memória; usado como chave no upsert.';
comment on column public.ai_memories.content   is 'Conteúdo em Markdown.';
comment on column public.ai_memories.embedding is 'Vetor de 1536 dimensões (text-embedding-3-small).';

-- 4. Índices
-- Busca vetorial aproximada por distância de cosseno (HNSW)
create index if not exists ai_memories_embedding_hnsw_idx
    on public.ai_memories using hnsw (embedding vector_cosine_ops);

-- Filtro por tags
create index if not exists ai_memories_tags_idx
    on public.ai_memories using gin (tags);

-- Listagem cronológica no dashboard
create index if not exists ai_memories_updated_at_idx
    on public.ai_memories (updated_at desc);

-- 5. Trigger de updated_at
drop trigger if exists ai_memories_set_updated_at_trg on public.ai_memories;
create trigger ai_memories_set_updated_at_trg
    before update on public.ai_memories
    for each row execute function public.set_updated_at();
