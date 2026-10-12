-- =============================================================================
-- Dashboard AI — 05_rls_policies.sql
-- Row Level Security e permissões de todas as tabelas e funções.
--
-- Modelo (Supabase: papéis anon, authenticated e service_role):
--   * anon           -> nenhum acesso a tabelas ou funções.
--   * authenticated  -> só os projetos em que é membro (project_members) ou tudo,
--                       se administrador (eh_administrador()). Sem DELETE nas tasks
--                       (exclusão lógica). Logs só leitura.
--   * service_role   -> backend/agentes (MCP, scripts, rotinas): ignora RLS e é o
--                       único que executa as funções da fila.
--
-- Idempotente. Depende de 00 a 04. Aplicar por último.
-- =============================================================================

-- Fora do Supabase, cria os papéis para o script poder ser aplicado (sem login).
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin bypassrls;
  end if;
end $$;

grant usage on schema public to anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- Tabelas: liga RLS e define permissões de base
-- -----------------------------------------------------------------------------
alter table public.projects                enable row level security;
alter table public.user_roles              enable row level security;
alter table public.project_members         enable row level security;
alter table public.tasks                   enable row level security;
alter table public.agendamento_tarefa_logs enable row level security;
alter table public.ai_memories             enable row level security;

revoke all on public.projects, public.user_roles, public.project_members, public.tasks,
              public.agendamento_tarefa_logs, public.ai_memories from anon;
revoke all on public.projects, public.user_roles, public.project_members, public.tasks,
              public.agendamento_tarefa_logs, public.ai_memories from authenticated;

grant select, insert, update         on public.projects                to authenticated;
grant select, insert, update, delete on public.user_roles              to authenticated;
grant select, insert, update, delete on public.project_members         to authenticated;
grant select, insert, update         on public.tasks                   to authenticated;  -- sem DELETE
grant select                         on public.agendamento_tarefa_logs to authenticated;
grant select, insert, update, delete on public.ai_memories             to authenticated;

grant all on public.projects, public.user_roles, public.project_members, public.tasks,
             public.agendamento_tarefa_logs, public.ai_memories to service_role;
grant usage, select on all sequences in schema public to service_role;

-- -----------------------------------------------------------------------------
-- projects: membros leem; administrador cria e altera; owner altera o próprio.
-- -----------------------------------------------------------------------------
drop policy if exists projects_select on public.projects;
create policy projects_select on public.projects for select to authenticated
  using (public.tem_acesso_projeto(id, 'viewer'));

drop policy if exists projects_insert on public.projects;
create policy projects_insert on public.projects for insert to authenticated
  with check (public.eh_administrador());

drop policy if exists projects_update on public.projects;
create policy projects_update on public.projects for update to authenticated
  using (public.tem_acesso_projeto(id, 'owner'))
  with check (public.tem_acesso_projeto(id, 'owner'));

-- -----------------------------------------------------------------------------
-- user_roles: cada um lê o próprio papel; só administrador gerencia.
-- -----------------------------------------------------------------------------
drop policy if exists user_roles_select on public.user_roles;
create policy user_roles_select on public.user_roles for select to authenticated
  using (user_id = public.usuario_atual() or public.eh_administrador());

drop policy if exists user_roles_admin_write on public.user_roles;
create policy user_roles_admin_write on public.user_roles for all to authenticated
  using (public.eh_administrador())
  with check (public.eh_administrador());

-- -----------------------------------------------------------------------------
-- project_members: membros do projeto veem a equipe; owner/administrador gerencia.
-- -----------------------------------------------------------------------------
drop policy if exists project_members_select on public.project_members;
create policy project_members_select on public.project_members for select to authenticated
  using (user_id = public.usuario_atual() or public.tem_acesso_projeto(project_id, 'viewer'));

drop policy if exists project_members_owner_write on public.project_members;
create policy project_members_owner_write on public.project_members for all to authenticated
  using (public.tem_acesso_projeto(project_id, 'owner'))
  with check (public.tem_acesso_projeto(project_id, 'owner'));

-- -----------------------------------------------------------------------------
-- tasks: viewer lê; editor cria e altera (o trigger de guarda impede mexer na
-- execução/trava). Sem DELETE: excluir = excluido = true.
-- -----------------------------------------------------------------------------
drop policy if exists tasks_select on public.tasks;
create policy tasks_select on public.tasks for select to authenticated
  using (public.tem_acesso_projeto(project_id, 'viewer'));

drop policy if exists tasks_insert on public.tasks;
create policy tasks_insert on public.tasks for insert to authenticated
  with check (public.tem_acesso_projeto(project_id, 'editor'));

drop policy if exists tasks_update on public.tasks;
create policy tasks_update on public.tasks for update to authenticated
  using (public.tem_acesso_projeto(project_id, 'editor'))
  with check (public.tem_acesso_projeto(project_id, 'editor'));

-- -----------------------------------------------------------------------------
-- agendamento_tarefa_logs: viewer do projeto lê; só o backend grava.
-- -----------------------------------------------------------------------------
drop policy if exists logs_select on public.agendamento_tarefa_logs;
create policy logs_select on public.agendamento_tarefa_logs for select to authenticated
  using (public.tem_acesso_projeto(project_id, 'viewer'));

-- -----------------------------------------------------------------------------
-- ai_memories: memória do projeto segue o papel no projeto; memória global
-- (project_id nulo) é lida por qualquer usuário autenticado e escrita só pelo
-- administrador.
-- -----------------------------------------------------------------------------
drop policy if exists ai_memories_select on public.ai_memories;
create policy ai_memories_select on public.ai_memories for select to authenticated
  using (project_id is null or public.tem_acesso_projeto(project_id, 'viewer'));

drop policy if exists ai_memories_insert on public.ai_memories;
create policy ai_memories_insert on public.ai_memories for insert to authenticated
  with check (case when project_id is null then public.eh_administrador()
                   else public.tem_acesso_projeto(project_id, 'editor') end);

drop policy if exists ai_memories_update on public.ai_memories;
create policy ai_memories_update on public.ai_memories for update to authenticated
  using (case when project_id is null then public.eh_administrador()
              else public.tem_acesso_projeto(project_id, 'editor') end)
  with check (case when project_id is null then public.eh_administrador()
                   else public.tem_acesso_projeto(project_id, 'editor') end);

drop policy if exists ai_memories_delete on public.ai_memories;
create policy ai_memories_delete on public.ai_memories for delete to authenticated
  using (case when project_id is null then public.eh_administrador()
              else public.tem_acesso_projeto(project_id, 'editor') end);

-- -----------------------------------------------------------------------------
-- Funções: por padrão o PostgreSQL concede EXECUTE a PUBLIC (e o Supabase a
-- anon/authenticated). Revoga tudo e concede só o necessário.
-- -----------------------------------------------------------------------------
do $$
declare
  f record;
begin
  for f in
    select p.oid::regprocedure as assinatura
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.proname in (
         'set_updated_at', 'jwt_claims', 'usuario_atual', 'papel_requisicao',
         'projeto_padrao_id', 'projeto_id_por_slug', 'eh_administrador', 'tem_acesso_projeto',
         'tasks_guarda_interface', 'tasks_gerar_codigo', 'tasks_validar_dependencias',
         'tasks_ciclo_de_vida', 'agendamento_logs_preencher_codigo',
         'pegar_proxima_task', 'finalizar_task', 'registrar_execucao_sem_tarefa',
         'liberar_trava_task', 'match_memories')
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f.assinatura);
    execute format('grant execute on function %s to service_role', f.assinatura);
  end loop;
end $$;

-- Usadas pelas políticas RLS, pelos defaults das colunas e pela interface
grant execute on function public.jwt_claims()                     to authenticated;
grant execute on function public.usuario_atual()                  to authenticated;
grant execute on function public.papel_requisicao()               to authenticated;
grant execute on function public.projeto_padrao_id()              to authenticated;
grant execute on function public.projeto_id_por_slug(text)        to authenticated;
grant execute on function public.eh_administrador(uuid)           to authenticated;
grant execute on function public.tem_acesso_projeto(bigint, text) to authenticated;
-- RPCs liberadas para a interface (a própria função confere o papel no projeto / RLS)
grant execute on function public.liberar_trava_task(bigint, boolean, integer)                  to authenticated;
grant execute on function public.match_memories(vector, float, int, text[], text, boolean)     to authenticated;
-- pegar_proxima_task, finalizar_task e registrar_execucao_sem_tarefa: só service_role.
