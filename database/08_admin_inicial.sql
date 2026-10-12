-- =============================================================================
-- Dashboard AI — 08_admin_inicial.sql  (SUB-40.1)
-- Administrador inicial: quem se cadastrar com o e-mail definido em
-- email_administrador_inicial() vira administrador global (user_roles.role = 'admin').
--
-- Regras (o papel é decidido SÓ pelo banco; o frontend nunca escolhe papel):
--   * só depois do e-mail confirmado (auth.users.email_confirmed_at preenchido),
--     para ninguém se registrar com o e-mail sem ter acesso à caixa de entrada;
--   * só se o usuário ainda não tiver linha em user_roles (papel existente não muda);
--   * qualquer outro e-mail não ganha papel global (acesso só por project_members).
--
-- Partes:
--   email_administrador_inicial() : único lugar com o e-mail do administrador inicial
--   garantir_admin_inicial()      : função da trigger em auth.users (security definer)
--   trigger em auth.users         : criada só se o schema auth existir (Supabase)
--   backfill                      : aplica a regra se o usuário já existir e estiver confirmado
--
-- Idempotente. Depende de 00 (user_roles). Funciona em PostgreSQL puro sem o
-- schema auth: as funções são criadas e a trigger/backfill são ignorados.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- E-mail do administrador inicial
-- -----------------------------------------------------------------------------
create or replace function public.email_administrador_inicial()
returns text
language sql
immutable
set search_path = public
as $$
  select 'gelvazio@gmail.com'::text;
$$;

comment on function public.email_administrador_inicial() is
  'E-mail que vira administrador global ao confirmar o cadastro (único lugar com esse valor).';

-- -----------------------------------------------------------------------------
-- Função da trigger: cria o papel admin quando o e-mail do administrador inicial
-- está confirmado e o usuário ainda não tem papel global.
-- -----------------------------------------------------------------------------
create or replace function public.garantir_admin_inicial()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_eh_email_admin boolean := lower(btrim(coalesce(new.email, ''))) = public.email_administrador_inicial();
  v_confirmado     boolean := new.email_confirmed_at is not null;
begin
  if not (v_eh_email_admin and v_confirmado) then
    return new;
  end if;

  insert into public.user_roles (user_id, role, email, nome)
  values (new.id, 'admin', new.email, new.raw_user_meta_data ->> 'nome')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

comment on function public.garantir_admin_inicial() is
  'Trigger em auth.users: e-mail do administrador inicial confirmado e sem papel -> user_roles admin.';

revoke execute on function public.email_administrador_inicial() from public;
revoke execute on function public.garantir_admin_inicial() from public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke execute on function public.email_administrador_inicial() from anon;
    revoke execute on function public.garantir_admin_inicial() from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke execute on function public.email_administrador_inicial() from authenticated;
    revoke execute on function public.garantir_admin_inicial() from authenticated;
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- Trigger em auth.users (só no Supabase) e backfill do usuário já existente
-- -----------------------------------------------------------------------------
do $$
begin
  if to_regclass('auth.users') is null then
    raise notice '08_admin_inicial: schema auth ausente; trigger e backfill ignorados.';
    return;
  end if;

  execute 'drop trigger if exists garantir_admin_inicial_trg on auth.users';
  execute 'create trigger garantir_admin_inicial_trg
             after insert or update of email_confirmed_at on auth.users
             for each row execute function public.garantir_admin_inicial()';

  execute $sql$
    insert into public.user_roles (user_id, role, email, nome)
    select u.id, 'admin', u.email, u.raw_user_meta_data ->> 'nome'
      from auth.users u
     where lower(btrim(u.email)) = public.email_administrador_inicial()
       and u.email_confirmed_at is not null
    on conflict (user_id) do nothing
  $sql$;
end $$;
