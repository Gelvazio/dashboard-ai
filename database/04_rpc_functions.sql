-- =============================================================================
-- Dashboard AI — 04_rpc_functions.sql
-- Funções RPC (chamáveis via supabase.rpc(...)) da fila de tasks e da memória.
--
--   * pegar_proxima_task(p_agente, ...)       -> captura atômica da próxima task (lock de 90 min)
--   * finalizar_task(p_task_id, p_status, ...) -> encerra a task, libera o lock e grava log
--   * liberar_trava_task(p_task_id, ...)      -> liberação manual de lock expirado (diagnóstico)
--   * match_memories(query_embedding, ...)    -> busca vetorial por similaridade de cosseno
--   * eh_professor_administrador(p_user_id)   -> verificação de perfil administrador (para RLS)
--
-- Idempotente (create or replace / if not exists).
-- Depende de: 01_tasks_schema.sql, 02_logs_schema.sql, 03_memories_schema.sql.
-- Os triggers de tabela (updated_at, código TASK-NNNN, ciclo de vida da trava e
-- preenchimento de task_codigo nos logs) ficam junto de cada schema (01/02/03).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- pegar_proxima_task
-- Captura, de forma atômica, a próxima task elegível e a trava para o agente.
--
-- Elegível = não excluída, executar = ON, executar_apos já alcançado,
--            tentativas < max_tentativas, todas as dependências `concluida`, e
--            status `pendente` OU `em_execucao` com trava expirada (> p_lock_minutos).
-- Ordem    = prioridade (1 primeiro) -> ordem -> created_at.
-- p_exclusivo = true (padrão): fila serial — se já existir alguma task com trava
--            válida (dentro do prazo), nada é entregue.
-- Tasks com trava expirada que já esgotaram as tentativas viram `erro`.
-- Retorna 0 ou 1 linha de public.tasks.
-- -----------------------------------------------------------------------------
create or replace function public.pegar_proxima_task(
  p_agente       text,
  p_lock_minutos integer default 90,
  p_exclusivo    boolean default true
)
returns setof public.tasks
language plpgsql
volatile
as $$
declare
  v_limite timestamptz := now() - make_interval(mins => p_lock_minutos);
  v_task   public.tasks;
begin
  if p_agente is null or btrim(p_agente) = '' then
    raise exception 'pegar_proxima_task: p_agente é obrigatório';
  end if;

  -- Serializa capturas concorrentes (evita dois agentes pegarem tasks ao mesmo tempo
  -- quando a fila é exclusiva). O lock é liberado no fim da transação.
  perform pg_advisory_xact_lock(hashtext('dashboard_ai.pegar_proxima_task'));

  -- Travas expiradas sem tentativas restantes: encerra como erro
  update public.tasks t
     set status    = 'erro',
         resultado = coalesce(t.resultado || E'\n\n', '')
                     || format('[%s] Trava de %s expirou após %s min e as tentativas (%s/%s) se esgotaram.',
                               to_char(now(), 'YYYY-MM-DD HH24:MI'), t.trava_frente, p_lock_minutos,
                               t.tentativas, t.max_tentativas)
   where t.status = 'em_execucao'
     and t.trava_em < v_limite
     and t.tentativas >= t.max_tentativas;

  if p_exclusivo and exists (
       select 1 from public.tasks t
        where t.status = 'em_execucao'
          and not t.excluido
          and t.trava_em >= v_limite
     ) then
    return;  -- já existe uma task travada dentro do prazo
  end if;

  select t.* into v_task
    from public.tasks t
   where not t.excluido
     and t.executar
     and (t.executar_apos is null or t.executar_apos <= now())
     and t.tentativas < t.max_tentativas
     and (
           t.status = 'pendente'
        or (t.status = 'em_execucao' and t.trava_em < v_limite)
         )
     and not exists (
           select 1
             from unnest(t.dependencias) as dep(codigo)
            where not exists (
                    select 1 from public.tasks d
                     where d.codigo = dep.codigo
                       and d.status = 'concluida'
                       and not d.excluido
                  )
         )
   order by t.prioridade, t.ordem, t.created_at, t.id
   limit 1
   for update skip locked;

  if not found then
    return;
  end if;

  update public.tasks t
     set status       = 'em_execucao',
         trava_frente = p_agente,
         trava_em     = now(),
         iniciado_em  = now(),
         tentativas   = t.tentativas + 1
   where t.id = v_task.id
  returning t.* into v_task;

  return next v_task;
end;
$$;

comment on function public.pegar_proxima_task(text, integer, boolean) is
  'Captura atômica da próxima task elegível (prioridade, ordem, criação) com lock de 90 min por padrão.';

-- -----------------------------------------------------------------------------
-- finalizar_task
-- Encerra uma task em execução, libera a trava e (opcionalmente) grava o log
-- em agendamento_tarefa_logs.
--
-- p_status: 'concluida' | 'recusada' | 'erro'
--   * 'erro' com tentativas restantes devolve a task para 'pendente' (nova tentativa);
--     sem tentativas restantes, fica 'erro'.
-- p_agente: quando informado, precisa ser o dono da trava.
-- p_rotina: quando informado, insere uma linha no histórico do agendador.
-- -----------------------------------------------------------------------------
create or replace function public.finalizar_task(
  p_task_id    bigint,
  p_status     text,
  p_resultado  text default null,
  p_pr_url     text default null,
  p_commit_sha text default null,
  p_agente     text default null,
  p_rotina     text default null
)
returns public.tasks
language plpgsql
volatile
as $$
declare
  v_task       public.tasks;
  v_novo       text;
  v_duracao_ms integer;
begin
  if p_status not in ('concluida', 'recusada', 'erro') then
    raise exception 'finalizar_task: status inválido "%" (use concluida, recusada ou erro)', p_status;
  end if;

  select * into v_task from public.tasks where id = p_task_id for update;
  if not found then
    raise exception 'finalizar_task: task % não encontrada', p_task_id;
  end if;

  if v_task.status <> 'em_execucao' then
    raise exception 'finalizar_task: task % não está em execução (status atual: %)', v_task.codigo, v_task.status;
  end if;

  if p_agente is not null and v_task.trava_frente is distinct from p_agente then
    raise exception 'finalizar_task: a trava da task % pertence a "%", não a "%"',
      v_task.codigo, v_task.trava_frente, p_agente;
  end if;

  v_novo := case
              when p_status = 'erro' and v_task.tentativas < v_task.max_tentativas then 'pendente'
              else p_status
            end;

  v_duracao_ms := case
                    when v_task.iniciado_em is not null
                      then (extract(epoch from (now() - v_task.iniciado_em)) * 1000)::integer
                  end;

  update public.tasks t
     set status     = v_novo,
         resultado  = coalesce(p_resultado, t.resultado),
         pr_url     = coalesce(p_pr_url, t.pr_url),
         commit_sha = coalesce(p_commit_sha, t.commit_sha)
   where t.id = p_task_id
  returning t.* into v_task;   -- trigger de ciclo de vida libera trava_frente/trava_em

  if p_rotina is not null then
    insert into public.agendamento_tarefa_logs (rotina, status, task_id, task_codigo, agente, detalhes, duracao_ms)
    values (p_rotina, p_status, v_task.id, v_task.codigo, p_agente, p_resultado, v_duracao_ms);
  end if;

  return v_task;
end;
$$;

comment on function public.finalizar_task(bigint, text, text, text, text, text, text) is
  'Finaliza task em execução (concluida/recusada/erro), libera a trava e opcionalmente registra log do agendador.';

-- -----------------------------------------------------------------------------
-- liberar_trava_task
-- Devolve para 'pendente' uma task cuja trava expirou (ou à força, com p_forcar).
-- Usado pelo painel de diagnóstico de travas.
-- -----------------------------------------------------------------------------
create or replace function public.liberar_trava_task(
  p_task_id      bigint,
  p_forcar       boolean default false,
  p_lock_minutos integer default 90
)
returns public.tasks
language plpgsql
volatile
as $$
declare
  v_task public.tasks;
begin
  select * into v_task from public.tasks where id = p_task_id for update;
  if not found then
    raise exception 'liberar_trava_task: task % não encontrada', p_task_id;
  end if;

  if v_task.status <> 'em_execucao' then
    return v_task;  -- nada a liberar
  end if;

  if not p_forcar and v_task.trava_em >= now() - make_interval(mins => p_lock_minutos) then
    raise exception 'liberar_trava_task: a trava da task % ainda está válida (desde %); use p_forcar => true',
      v_task.codigo, v_task.trava_em;
  end if;

  update public.tasks t
     set status = 'pendente'
   where t.id = p_task_id
  returning t.* into v_task;

  return v_task;
end;
$$;

comment on function public.liberar_trava_task(bigint, boolean, integer) is
  'Libera manualmente a trava de uma task (somente se expirada, a menos que p_forcar = true).';

-- -----------------------------------------------------------------------------
-- match_memories
-- Busca vetorial por similaridade de cosseno (1 - distância) em ai_memories.
-- Compatível com a chamada do endpoint MCP:
--   supabase.rpc('match_memories', { query_embedding, match_threshold, match_count })
-- filter_tags (opcional): só retorna memórias que contenham TODAS as tags.
-- (Corrige o `order in by` do plano original para `order by`.)
-- -----------------------------------------------------------------------------
create or replace function public.match_memories(
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count     int   default 5,
  filter_tags     text[] default null
)
returns table (
  id         uuid,
  title      text,
  content    text,
  tags       text[],
  similarity float,
  updated_at timestamptz
)
language sql
stable
as $$
  select
    m.id,
    m.title,
    m.content,
    m.tags,
    1 - (m.embedding <=> query_embedding) as similarity,
    m.updated_at
  from public.ai_memories m
  where m.embedding is not null
    and 1 - (m.embedding <=> query_embedding) > match_threshold
    and (filter_tags is null or m.tags @> filter_tags)
  order by m.embedding <=> query_embedding
  limit least(greatest(match_count, 1), 100);
$$;

comment on function public.match_memories(vector, float, int, text[]) is
  'Busca semântica em ai_memories por similaridade de cosseno, com limiar, limite e filtro opcional de tags.';

-- -----------------------------------------------------------------------------
-- eh_professor_administrador
-- Retorna true se o usuário (padrão: o usuário autenticado, auth.uid()) é
-- professor administrador. Critérios (qualquer um basta):
--   1. está cadastrado em public.professores_administradores;
--   2. o JWT traz app_metadata.role = 'admin' ou 'professor_administrador'.
-- security definer: pode ser usada em políticas RLS sem expor a tabela.
--
-- Exemplo de uso em RLS (não habilitado por padrão):
--   alter table public.tasks enable row level security;
--   create policy tasks_admin_all on public.tasks
--     for all using (public.eh_professor_administrador())
--     with check (public.eh_professor_administrador());
-- -----------------------------------------------------------------------------
create table if not exists public.professores_administradores (
    user_id    uuid        primary key,          -- auth.users.id
    email      text,
    nome       text,
    created_at timestamptz not null default now()
);

comment on table public.professores_administradores is
  'Usuários (auth.users.id) com perfil de professor administrador do Dashboard AI.';

create or replace function public.eh_professor_administrador(p_user_id uuid default null)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid  uuid;
  v_role text;
begin
  -- auth.uid()/auth.jwt() existem no Supabase; fora dele, retornam null com segurança
  begin
    v_uid  := coalesce(p_user_id, auth.uid());
    v_role := case when p_user_id is null then auth.jwt() -> 'app_metadata' ->> 'role' end;
  exception when undefined_function or invalid_schema_name then
    v_uid  := p_user_id;
    v_role := null;
  end;

  if v_role in ('admin', 'professor_administrador') then
    return true;
  end if;

  if v_uid is null then
    return false;
  end if;

  return exists (select 1 from public.professores_administradores pa where pa.user_id = v_uid);
end;
$$;

comment on function public.eh_professor_administrador(uuid) is
  'true se o usuário (padrão auth.uid()) é professor administrador (tabela professores_administradores ou JWT app_metadata.role).';
