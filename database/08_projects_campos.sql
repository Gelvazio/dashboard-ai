-- =============================================================================
-- Dashboard AI — 08_projects_campos.sql  (SUB-45)
-- Campos novos do cadastro de projetos, complementando a tabela
-- public.projects criada no 00_projects_roles.sql (SUB-29). O status continua
-- sendo a coluna `ativo boolean` (exibida na tela como 1-ATIVO / 0-INATIVO).
--
-- Partes deste arquivo (cada uma é uma subtarefa):
--   SUB-45.1 responsavel_id e data_prevista_fim (este bloco)
--   SUB-45.2 cor e icone
--   SUB-45.3 url_producao e url_documentacao
--   SUB-45.4 prioridade e tags
--
-- Idempotente. Depende de 00 a 07 (aplicar depois do 07).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Responsável e prazo (SUB-45.1)
-- -----------------------------------------------------------------------------
alter table public.projects add column if not exists responsavel_id    uuid;  -- auth.users.id
alter table public.projects add column if not exists data_prevista_fim date;

-- A chave estrangeira para auth.users só existe no Supabase: o banco de teste
-- (database/tests/supabase_stub.sql) não tem o schema auth.
do $$
begin
  if to_regclass('auth.users') is not null
     and not exists (select 1 from pg_constraint
                     where conname = 'projects_responsavel_id_fkey'
                       and conrelid = 'public.projects'::regclass) then
    alter table public.projects add constraint projects_responsavel_id_fkey
      foreign key (responsavel_id) references auth.users (id) on delete set null;
  end if;
end $$;

comment on column public.projects.responsavel_id    is 'Usuário dono do projeto (auth.users.id); vira null se o usuário for apagado.';
comment on column public.projects.data_prevista_fim is 'Prazo previsto para o fim do projeto (opcional).';
