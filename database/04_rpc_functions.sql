-- =============================================================================
-- Dashboard AI — 04_rpc_functions.sql
-- Funções RPC da fila de tasks (multi-projeto) e da memória.
--
--   * pegar_proxima_task(p_agente, p_projeto, p_lock_minutos, p_exclusivo)
--        -> captura atômica da próxima task (FOR UPDATE SKIP LOCKED, lock de 90 min)
--   * finalizar_task(p_task_id, p_status, ...) -> encerra a task, libera o lock e grava log
--   * registrar_execucao_sem_tarefa(p_rotina, p_agente, p_projeto) -> log "sem_tarefa"
--   * liberar_trava_task(p_task_id, p_forcar, p_lock_minutos) -> liberação manual de lock
--   * match_memories(query_embedding, ..., p_projeto) -> busca vetorial por similaridade
--
-- Segurança: as funções da fila são `security definer` com `search_path` fixo e
-- só podem ser executadas por `service_role` (permissões em 05_rls_policies.sql).
-- Os papéis (eh_administrador, tem_acesso_projeto) ficam em 00_projects_roles.sql.
--
-- Idempotente. Depende de 00, 01, 02 e 03.
-- =============================================================================

-- Assinaturas da versão anterior (substituídas abaixo)
drop function if exists public.pegar_proxima_task(text, integer, boolean);
drop function if exists public.finalizar_task(bigint, text, text, text, text, text, text);
drop function if exists public.match_memories(vector, float, int, text[]);

-- -----------------------------------------------------------------------------
-- pegar_proxima_task
-- Captura, de forma atômica, a próxima task elegível e a trava para o agente.
--
-- p_projeto      slug do projeto; null = qualquer projeto ativo.
-- Elegível     = projeto ativo, tipo `ia`, não excluída, executar = ON,
--                executar_apos alcançado, tentativas < max_tentativas, todas as
--                dependências (do mesmo projeto) `concluida`, e status `pendente`
--                OU `em_execucao` com trava expirada (> p_lock_minutos).
-- Ordem        = prioridade (1 primeiro) -> ordem -> created_at -> id.
-- Concorrência = FOR UPDATE SKIP LOCKED: vários agentes pegam tasks diferentes
--                em paralelo, nunca a mesma.
-- p_exclusivo  = true: fila serial POR PROJETO — se o projeto já tem uma task com
--                trava válida, nada é entregue daquele projeto.
-- Tasks com trava expirada que já esgotaram as tentativas viram `erro`.
-- Retorna 0 ou 1 linha de public.tasks.
-- -----------------------------------------------------------------------------
create or replace function public.pegar_proxima_task(
  p_agente       text,
  p_projeto      text    default null,
  p_lock_minutos integer default 90,
  p_exclusivo    boolean default false
)
returns setof public.tasks
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_limite  timestamptz := now() - make_interval(mins => p_lock_minutos);
  v_projeto bigint;
  v_task    public.tasks;
begin
  if p_agente is null or btrim(p_agente) = '' then
    raise exception 'pegar_proxima_task: p_agente é obrigatório';
  end if;
  if p_lock_minutos is null or p_lock_minutos < 1 then
    raise exception 'pegar_proxima_task: p_lock_minutos deve ser >= 1';
  end if;

  if p_projeto is not null then
    select p.id into v_projeto from public.projects p
     where p.slug = lower(btrim(p_projeto)) and not p.excluido;
    if v_projeto is null then
      raise exception 'pegar_proxima_task: projeto "%" não encontrado', p_projeto;
    end if;
  end if;

  -- Travas expiradas sem tentativas restantes: encerra como erro
  update public.tasks t
     set status    = 'erro',
         resultado = coalesce(t.resultado || E'\n\n', '')
                     || format('[%s] Trava de %s expirou após %s min e as tentativas (%s/%s) se esgotaram.',
                               to_char(now(), 'YYYY-MM-DD HH24:MI'), t.trava_frente, p_lock_minutos,
                               t.tentativas, t.max_tentativas)
   where t.status = 'em_execucao'
     and t.trava_em < v_limite
     and t.tentativas >= t.max_tentativas
     and (v_projeto is null or t.project_id = v_projeto);

  if p_exclusivo then
    -- serializa capturas exclusivas do mesmo escopo (projeto ou global)
    perform pg_advisory_xact_lock(hashtext('dashboard_ai.fila'), coalesce(v_projeto, 0)::int);
  end if;

  select t.* into v_task
    from public.tasks t
    join public.projects p on p.id = t.project_id
   where p.ativo and not p.excluido
     and (v_projeto is null or t.project_id = v_projeto)
     and t.tipo = 'ia'
     and not t.excluido
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
                     where d.project_id = t.project_id
                       and d.codigo = dep.codigo
                       and d.status = 'concluida'
                       and not d.excluido
                  )
         )
     and (
           not p_exclusivo
        or not exists (
             select 1 from public.tasks x
              where x.project_id = t.project_id
                and x.status = 'em_execucao'
                and not x.excluido
                and x.trava_em >= v_limite
           )
         )
   order by t.prioridade, t.ordem, t.created_at, t.id
   limit 1
   for update of t skip locked;

  if not found then
    return;
  end if;

  update public.tasks t
     set status       = 'em_execucao',
         trava_frente = btrim(p_agente),
         trava_em     = now(),
         iniciado_em  = now(),
         tentativas   = t.tentativas + 1
   where t.id = v_task.id
  returning t.* into v_task;

  return next v_task;
end;
$$;

comment on function public.pegar_proxima_task(text, text, integer, boolean) is
  'Captura atômica (SKIP LOCKED) da próxima task elegível de um projeto (ou de qualquer projeto ativo), com lock de 90 min por padrão.';

-- -----------------------------------------------------------------------------
-- finalizar_task
-- Encerra uma task em execução, libera a trava e grava o log da execução em
-- agendamento_tarefa_logs (sempre; p_rotina padrão 'agente'), apontando tasks.log_id.
--
-- p_status: 'concluida' | 'recusada' | 'erro'
--   * 'erro' com tentativas restantes devolve a task para 'pendente' (nova tentativa).
-- p_agente: quando informado, precisa ser o dono da trava.
-- p_metadados (jsonb, opcional): repositorio, branch, sessao_url, arquivos_alterados,
--   erro_mensagem — copiados para o log.
-- -----------------------------------------------------------------------------
create or replace function public.finalizar_task(
  p_task_id    bigint,
  p_status     text,
  p_resultado  text  default null,
  p_pr_url     text  default null,
  p_commit_sha text  default null,
  p_agente     text  default null,
  p_rotina     text  default null,
  p_metadados  jsonb default '{}'::jsonb
)
returns public.tasks
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_task     public.tasks;
  v_inicio   timestamptz;
  v_instr    text;
  v_novo     text;
  v_log_id   bigint;
  v_meta     jsonb := coalesce(p_metadados, '{}'::jsonb);
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

  if p_agente is not null and v_task.trava_frente is distinct from btrim(p_agente) then
    raise exception 'finalizar_task: a trava da task % pertence a "%", não a "%"',
      v_task.codigo, v_task.trava_frente, p_agente;
  end if;

  v_inicio := v_task.iniciado_em;
  v_instr  := v_task.instrucao;
  v_novo   := case
                when p_status = 'erro' and v_task.tentativas < v_task.max_tentativas then 'pendente'
                else p_status
              end;

  insert into public.agendamento_tarefa_logs (
    project_id, rotina, status, task_id, task_codigo, agente, detalhes, erro_mensagem,
    status_anterior, status_novo, instrucao_recebida, repositorio, branch, commit_sha, pr_url,
    sessao_url, arquivos_alterados, inicio_em, fim_em, duracao_ms)
  values (
    v_task.project_id, coalesce(nullif(btrim(p_rotina), ''), 'agente'), p_status, v_task.id, v_task.codigo,
    coalesce(p_agente, v_task.trava_frente), p_resultado,
    coalesce(v_meta ->> 'erro_mensagem', case when p_status = 'erro' then p_resultado end),
    'em_execucao', v_novo, v_instr,
    coalesce(v_meta ->> 'repositorio', (select p.repositorio from public.projects p where p.id = v_task.project_id)),
    v_meta ->> 'branch', p_commit_sha, p_pr_url, v_meta ->> 'sessao_url',
    nullif(v_meta ->> 'arquivos_alterados', '')::integer,
    v_inicio, now(),
    case when v_inicio is not null then (extract(epoch from (now() - v_inicio)) * 1000)::integer end)
  returning id into v_log_id;

  update public.tasks t
     set status     = v_novo,
         resultado  = coalesce(p_resultado, t.resultado),
         pr_url     = coalesce(p_pr_url, t.pr_url),
         commit_sha = coalesce(p_commit_sha, t.commit_sha),
         log_id     = v_log_id
   where t.id = p_task_id
  returning t.* into v_task;   -- trigger de ciclo de vida libera trava_frente/trava_em

  return v_task;
end;
$$;

comment on function public.finalizar_task(bigint, text, text, text, text, text, text, jsonb) is
  'Finaliza task em execução (concluida/recusada/erro), libera a trava e registra a execução em agendamento_tarefa_logs.';

-- -----------------------------------------------------------------------------
-- registrar_execucao_sem_tarefa
-- Log de uma execução de rotina que encontrou a fila vazia (status sem_tarefa).
-- -----------------------------------------------------------------------------
create or replace function public.registrar_execucao_sem_tarefa(
  p_rotina  text,
  p_agente  text default null,
  p_projeto text default null
)
returns bigint
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_id bigint;
begin
  insert into public.agendamento_tarefa_logs (project_id, rotina, status, agente, detalhes, inicio_em, fim_em, duracao_ms)
  values (case when p_projeto is not null then public.projeto_id_por_slug(p_projeto) end,
          coalesce(nullif(btrim(p_rotina), ''), 'agente'), 'sem_tarefa', p_agente,
          'Fila vazia: nenhuma task elegível.', now(), now(), 0)
  returning id into v_id;
  return v_id;
end;
$$;

-- -----------------------------------------------------------------------------
-- liberar_trava_task
-- Devolve para 'pendente' uma task cuja trava expirou (ou à força, com p_forcar).
-- Pode ser chamada pela interface (painel de diagnóstico): usuários da API
-- precisam ser editores do projeto da task (ou administradores).
-- -----------------------------------------------------------------------------
create or replace function public.liberar_trava_task(
  p_task_id      bigint,
  p_forcar       boolean default false,
  p_lock_minutos integer default 90
)
returns public.tasks
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_task public.tasks;
begin
  select * into v_task from public.tasks where id = p_task_id for update;
  if not found then
    raise exception 'liberar_trava_task: task % não encontrada', p_task_id;
  end if;

  if coalesce(public.papel_requisicao(), '') in ('anon', 'authenticated')
     and not public.tem_acesso_projeto(v_task.project_id, 'editor') then
    raise exception 'liberar_trava_task: sem permissão no projeto da task %', v_task.codigo
      using errcode = '42501';
  end if;

  if v_task.status <> 'em_execucao' then
    return v_task;  -- nada a liberar
  end if;

  if not p_forcar and v_task.trava_em >= now() - make_interval(mins => p_lock_minutos) then
    raise exception 'liberar_trava_task: a trava da task % ainda está válida (desde %); use p_forcar => true',
      v_task.codigo, v_task.trava_em;
  end if;

  update public.tasks t
     set status    = 'pendente',
         resultado = coalesce(t.resultado || E'\n\n', '')
                     || format('[%s] Trava de %s liberada manualmente.', to_char(now(), 'YYYY-MM-DD HH24:MI'), t.trava_frente)
   where t.id = p_task_id
  returning t.* into v_task;

  return v_task;
end;
$$;

comment on function public.liberar_trava_task(bigint, boolean, integer) is
  'Libera manualmente a trava de uma task (somente se expirada, a menos que p_forcar = true). Interface: exige papel editor no projeto.';

-- -----------------------------------------------------------------------------
-- match_memories
-- Busca vetorial por similaridade de cosseno (1 - distância) em ai_memories.
--   p_projeto (slug, opcional): memórias do projeto + globais (p_incluir_globais);
--             null = todas as memórias visíveis.
--   filter_tags (opcional): só memórias que contenham TODAS as tags.
-- security invoker: para usuários da API, o RLS de ai_memories decide o que aparece.
-- -----------------------------------------------------------------------------
create or replace function public.match_memories(
  query_embedding   vector(1536),
  match_threshold   float   default 0.7,
  match_count       int     default 5,
  filter_tags       text[]  default null,
  p_projeto         text    default null,
  p_incluir_globais boolean default true
)
returns table (
  id         uuid,
  project_id bigint,
  title      text,
  content    text,
  tags       text[],
  similarity float,
  updated_at timestamptz
)
language sql
stable
set search_path = public
as $$
  with alvo as (select public.projeto_id_por_slug(p_projeto) as pid)
  select
    m.id,
    m.project_id,
    m.title,
    m.content,
    m.tags,
    1 - (m.embedding <=> query_embedding) as similarity,
    m.updated_at
  from public.ai_memories m, alvo
  where m.embedding is not null
    and 1 - (m.embedding <=> query_embedding) > match_threshold
    and (filter_tags is null or m.tags @> filter_tags)
    and (
          p_projeto is null
       or m.project_id = alvo.pid
       or (p_incluir_globais and m.project_id is null)
        )
  order by m.embedding <=> query_embedding
  limit least(greatest(match_count, 1), 100);
$$;

comment on function public.match_memories(vector, float, int, text[], text, boolean) is
  'Busca semântica em ai_memories (cosseno) com limiar, limite, tags e escopo por projeto (+ memórias globais).';
