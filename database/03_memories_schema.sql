-- =============================================================================
-- Dashboard AI — 03_memories_schema.sql
-- Memória persistente vetorial (Jev-Mem): tabela `public.ai_memories` + pgvector.
-- Cada memória pertence a um projeto (`project_id`) ou é GLOBAL (`project_id` nulo,
-- compartilhada por todos os projetos).
--
-- Idempotente; atualiza instalações da versão anterior. Depende de 00.
-- A função de busca `match_memories` fica em 04_rpc_functions.sql.
-- =============================================================================

-- 1. Extensão de busca vetorial (no Supabase: Database > Extensions > vector)
create extension if not exists vector;

-- 2. set_updated_at() e usuario_atual() vêm de 00_projects_roles.sql

-- 3. Tabela de memórias canônicas
create table if not exists public.ai_memories (
    id          uuid        primary key default gen_random_uuid(),
    project_id  bigint      references public.projects (id) on delete cascade, -- null = memória global
    title       text        not null,                    -- único por projeto (upsert: onConflict 'project_id,title')
    content     text        not null,                    -- conteúdo em Markdown limpo
    tags        text[]      not null default '{}'::text[],
    embedding   vector(1536),                            -- OpenAI text-embedding-3-small (1536 dimensões)
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

-- Atualização de instalações anteriores (title era único globalmente)
alter table public.ai_memories add column if not exists project_id bigint;
alter table public.ai_memories add column if not exists criado_por uuid default public.usuario_atual();

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ai_memories_project_id_fkey') then
    alter table public.ai_memories add constraint ai_memories_project_id_fkey
      foreign key (project_id) references public.projects (id) on delete cascade;
  end if;
  if exists (select 1 from pg_constraint where conname = 'ai_memories_title_key') then
    alter table public.ai_memories drop constraint ai_memories_title_key;
  end if;
  -- único por projeto; memórias globais (project_id nulo) também não repetem título
  if not exists (select 1 from pg_constraint where conname = 'ai_memories_projeto_title_key') then
    alter table public.ai_memories add constraint ai_memories_projeto_title_key
      unique nulls not distinct (project_id, title);
  end if;
end $$;

comment on table  public.ai_memories            is 'Memórias canônicas persistentes dos agentes de IA (Jev-Mem), por projeto ou globais.';
comment on column public.ai_memories.project_id is 'Projeto dono da memória; null = memória global (todos os projetos).';
comment on column public.ai_memories.title      is 'Título da memória, único por projeto; chave do upsert (project_id, title).';
comment on column public.ai_memories.content   is 'Conteúdo em Markdown.';
comment on column public.ai_memories.embedding is 'Vetor de 1536 dimensões (text-embedding-3-small).';

-- 4. Índices
-- Busca vetorial aproximada por distância de cosseno (HNSW)
create index if not exists ai_memories_embedding_hnsw_idx
    on public.ai_memories using hnsw (embedding vector_cosine_ops);

-- Filtro por projeto
create index if not exists ai_memories_projeto_idx
    on public.ai_memories (project_id);

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
