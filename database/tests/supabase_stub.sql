-- Simula, num PostgreSQL local, o que o Supabase já traz pronto: papéis
-- anon/authenticated/service_role e privilégios padrão amplos no schema public
-- (o 05_rls_policies.sql precisa restringir mesmo partindo desse cenário).
-- SOMENTE PARA TESTES LOCAIS — não aplicar no Supabase.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if;
end $$;
grant usage on schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables    to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
create extension if not exists vector;

-- Helpers de teste (schema próprio)
create schema if not exists teste;
grant usage on schema teste to anon, authenticated, service_role;
create or replace function teste.ok(p_cond boolean, p_msg text) returns void language plpgsql as $$
begin
  if p_cond is distinct from true then raise exception 'FALHOU: %', p_msg; end if;
  raise notice 'ok: %', p_msg;
end $$;
-- executa SQL e exige erro (opcionalmente contendo p_trecho)
create or replace function teste.erro(p_sql text, p_msg text, p_trecho text default null) returns void language plpgsql as $$
begin
  begin
    execute p_sql;
  exception when others then
    if p_trecho is not null and position(p_trecho in sqlerrm) = 0 then
      raise exception 'FALHOU: % (erro inesperado: %)', p_msg, sqlerrm;
    end if;
    raise notice 'ok: % (%)', p_msg, sqlerrm;
    return;
  end;
  raise exception 'FALHOU: % (esperava erro)', p_msg;
end $$;
-- personifica um usuário da API (como o PostgREST faz)
create or replace function teste.jwt(p_role text, p_sub uuid default null, p_app_role text default null) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims',
    jsonb_strip_nulls(jsonb_build_object('role', p_role, 'sub', p_sub,
      'app_metadata', case when p_app_role is not null then jsonb_build_object('role', p_app_role) end))::text, false);
end $$;
grant execute on all functions in schema teste to anon, authenticated, service_role;
