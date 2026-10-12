-- Testes de SUB-29 (multi-projeto, papéis, RLS e fila). Rodar com run_tests.sh.
\set ON_ERROR_STOP 1
\set QUIET 1
set client_min_messages = notice;

-- ---------------------------------------------------------------- dados base
reset role; select teste.jwt(null);
insert into public.projects (slug, nome, prefixo_codigo, repositorio) values
  ('alpha', 'Projeto Alpha', 'ALP', 'acme/alpha'),
  ('beta',  'Projeto Beta',  'TASK', 'acme/beta'),
  ('gama',  'Projeto Gama (inativo)', 'GAM', null)
on conflict (slug) do nothing;
update public.projects set ativo = false where slug = 'gama';
select id as beta_id from public.projects where slug = 'beta' \gset

insert into public.user_roles (user_id, role) values ('00000000-0000-0000-0000-00000000000a', 'admin')
on conflict do nothing;
insert into public.project_members (project_id, user_id, role)
select p.id, u.uid, u.role from (values
  ('alpha', '00000000-0000-0000-0000-00000000000e'::uuid, 'editor'),
  ('alpha', '00000000-0000-0000-0000-0000000000f1'::uuid, 'viewer'),
  ('beta',  '00000000-0000-0000-0000-00000000000b'::uuid, 'editor'),
  ('alpha', '00000000-0000-0000-0000-0000000000c1'::uuid, 'owner')) u(slug, uid, role)
join public.projects p on p.slug = u.slug
on conflict do nothing;

-- ---------------------------------------------------------------- códigos por projeto
insert into public.tasks (project_id, titulo, instrucao, prioridade)
select id, 'A1', 'faça A1', 2 from public.projects where slug = 'alpha';
insert into public.tasks (project_id, titulo, instrucao, prioridade, dependencias)
select id, 'A2', 'faça A2', 1, '{ALP-0001}' from public.projects where slug = 'alpha';
insert into public.tasks (project_id, titulo, instrucao, tipo)
select id, 'A3 humano', 'aprovar', 'humano' from public.projects where slug = 'alpha';
insert into public.tasks (project_id, titulo, instrucao, prioridade)
select id, 'B1', 'faça B1', 3 from public.projects where slug = 'beta';
insert into public.tasks (project_id, titulo, instrucao, prioridade)
select id, 'G1', 'projeto inativo', 1 from public.projects where slug = 'gama';
insert into public.tasks (titulo, instrucao, prioridade) values ('D1', 'sem projeto -> default', 5);

select teste.ok((select string_agg(t.codigo, ',' order by t.id) from public.tasks t join public.projects p on p.id=t.project_id where p.slug='alpha') = 'ALP-0001,ALP-0002,ALP-0003', 'códigos sequenciais com prefixo por projeto');
select teste.ok((select codigo from public.tasks where titulo='B1') = 'TASK-0001', 'contador independente por projeto (beta começa em 0001)');
select teste.ok((select p.slug from public.tasks t join public.projects p on p.id=t.project_id where t.titulo='D1') = 'default', 'task sem projeto vai para o projeto default');
select teste.erro($$insert into public.tasks (project_id, codigo, titulo, instrucao) select id, 'ALP-0001', 'dup', 'x' from public.projects where slug='alpha'$$, 'código repetido no mesmo projeto é recusado', 'tasks_projeto_codigo_key');
insert into public.tasks (project_id, codigo, titulo, instrucao, excluido) select id, 'MANUAL-1', 'mesmo código noutro projeto', 'x', true from public.projects where slug in ('alpha', 'beta');
select teste.ok(true, 'mesmo código permitido em projetos diferentes');

-- ---------------------------------------------------------------- dependências
select teste.erro($$insert into public.tasks (project_id, titulo, instrucao, dependencias) select id, 'x', 'x', '{ALP-9999}' from public.projects where slug='alpha'$$, 'dependência inexistente é recusada', 'não existe');
select teste.erro($$insert into public.tasks (project_id, titulo, instrucao, dependencias) select id, 'x', 'x', '{TASK-0001}' from public.projects where slug='alpha'$$, 'dependência de outro projeto é recusada', 'não existe');
select teste.erro($$update public.tasks set dependencias = '{ALP-0002}' where codigo = 'ALP-0002'$$, 'task não depende dela mesma', 'dela mesma');
select teste.erro($$update public.tasks set dependencias = '{ALP-0002}' where codigo = 'ALP-0001'$$, 'ciclo de dependências é recusado', 'ciclo');
update public.tasks set dependencias = '{ALP-0001, ALP-0001 , ""}' where codigo = 'ALP-0003';
select teste.ok((select dependencias from public.tasks where codigo='ALP-0003') = '{ALP-0001}', 'dependências normalizadas (trim, sem repetição, sem vazios)');
update public.tasks set dependencias = '{}' where codigo = 'ALP-0003';
select teste.erro($$update public.tasks set project_id = (select id from public.projects where slug='beta') where codigo = 'ALP-0001'$$, 'project_id é imutável', 'project_id');

-- ---------------------------------------------------------------- anon
set role anon; select teste.jwt('anon');
select teste.erro('select * from public.tasks', 'anon não lê tasks', 'permission denied');
select teste.erro('select * from public.ai_memories', 'anon não lê memórias', 'permission denied');
select teste.erro('select * from public.projects', 'anon não lê projetos', 'permission denied');
select teste.erro($$select * from public.pegar_proxima_task('x')$$, 'anon não pega task', 'permission denied');
select teste.erro($$select public.finalizar_task(1, 'concluida')$$, 'anon não finaliza task', 'permission denied');
select teste.erro($$select public.liberar_trava_task(1)$$, 'anon não libera trava', 'permission denied');
reset role;

-- ---------------------------------------------------------------- viewer de alpha
set role authenticated; select teste.jwt('authenticated', '00000000-0000-0000-0000-0000000000f1');
select teste.ok((select count(*) from public.tasks where not excluido) = 3 and (select count(*) from public.tasks t join public.projects p on p.id = t.project_id where p.slug <> 'alpha') = 0, 'viewer vê só as tasks de alpha');
select teste.ok((select count(*) from public.projects) = 1, 'viewer vê só o projeto alpha');
select teste.erro($$insert into public.tasks (project_id, titulo, instrucao) select id, 'v', 'v' from public.projects where slug='alpha'$$, 'viewer não cria task', 'row-level security');
update public.tasks set titulo = 'hack' where codigo = 'ALP-0001';
select teste.ok((select titulo from public.tasks where codigo='ALP-0001') = 'A1', 'viewer não altera task (update filtrado pelo RLS)');
reset role;

-- ---------------------------------------------------------------- editor de alpha
set role authenticated; select teste.jwt('authenticated', '00000000-0000-0000-0000-00000000000e');
insert into public.tasks (project_id, titulo, instrucao, prioridade, origem)
select id, 'A4 editor', 'criada pela interface', 4, 'ui' from public.projects where slug='alpha';
select teste.ok((select codigo = 'ALP-0004' and criado_por = '00000000-0000-0000-0000-00000000000e' from public.tasks where titulo='A4 editor'), 'editor cria task (código gerado, criado_por = usuário)');
select teste.erro(format($$insert into public.tasks (project_id, titulo, instrucao) values (%s, 'x', 'x')$$, :beta_id), 'editor de alpha não cria task em beta', 'row-level security');
select teste.ok((select count(*) from public.projects where slug='beta') = 0, 'editor de alpha não enxerga beta');
select teste.erro($$insert into public.tasks (project_id, titulo, instrucao, status) select id, 'x', 'x', 'em_execucao' from public.projects where slug='alpha'$$, 'interface não cria task em execução', 'só pode nascer');
select teste.erro($$update public.tasks set status = 'em_execucao' where codigo = 'ALP-0001'$$, 'interface não põe em execução', 'só a fila');
select teste.erro($$update public.tasks set status = 'concluida' where codigo = 'ALP-0001'$$, 'interface não conclui task de IA', 'humano');
select teste.erro($$update public.tasks set tentativas = 2 where codigo = 'ALP-0001'$$, 'interface não altera tentativas', 'tentativas');
select teste.erro($$delete from public.tasks where codigo = 'ALP-0004'$$, 'sem DELETE nas tasks', 'permission denied');
select teste.erro($$select * from public.pegar_proxima_task('editor')$$, 'editor não chama pegar_proxima_task', 'permission denied');
select teste.erro($$insert into public.agendamento_tarefa_logs (rotina, status) values ('x', 'erro')$$, 'interface não grava logs', 'permission denied');
update public.projects set nome = 'hack' where slug='alpha';
select teste.ok((select nome from public.projects where slug='alpha') = 'Projeto Alpha', 'editor não altera o projeto (só owner)');
reset role;

-- ---------------------------------------------------------------- owner de alpha
set role authenticated; select teste.jwt('authenticated', '00000000-0000-0000-0000-0000000000c1');
update public.projects set descricao = 'editado pelo owner' where slug='alpha';
select teste.ok((select descricao from public.projects where slug='alpha') = 'editado pelo owner', 'owner altera o próprio projeto');
insert into public.project_members (project_id, user_id, role) select id, '00000000-0000-0000-0000-0000000000f2', 'viewer' from public.projects where slug='alpha';
select teste.ok(true, 'owner adiciona membro ao projeto');
select teste.erro($$insert into public.projects (slug, nome) values ('novo', 'Novo')$$, 'owner (não admin) não cria projeto', 'row-level security');
select teste.erro($$insert into public.user_roles (user_id, role) values ('00000000-0000-0000-0000-0000000000c1', 'admin')$$, 'não-admin não se promove a admin', 'row-level security');
reset role;

-- ---------------------------------------------------------------- tasks humanas pela interface
set role authenticated; select teste.jwt('authenticated', '00000000-0000-0000-0000-00000000000e');
update public.tasks set status = 'concluida' where codigo = 'ALP-0003';
select teste.ok((select status = 'concluida' and concluido_em is not null from public.tasks where codigo='ALP-0003'), 'editor conclui task humana pela interface');
update public.tasks set status = 'pendente', tentativas = 0 where codigo = 'ALP-0003';
select teste.ok((select status from public.tasks where codigo='ALP-0003') = 'pendente', 'editor reabre task (tentativas zeradas)');
reset role;

-- ---------------------------------------------------------------- fila (service_role)
set role service_role; select teste.jwt('service_role');
do $$
declare v public.tasks;
begin
  select * into v from public.pegar_proxima_task('agente-1', 'alpha');
  perform teste.ok(v.codigo = 'ALP-0001', 'alpha: ALP-0002 (prioridade 1) espera a dependência; pega ALP-0001; humana ignorada');
  perform teste.ok(v.status = 'em_execucao' and v.trava_frente = 'agente-1' and v.tentativas = 1, 'trava gravada');
  select * into v from public.pegar_proxima_task('agente-2', 'alpha');
  perform teste.ok(v.codigo = 'ALP-0004', 'paralelo (p_exclusivo=false): outro agente pega a próxima task de alpha');
  select * into v from public.pegar_proxima_task('agente-3', 'alpha');
  perform teste.ok(v.id is null, 'alpha sem mais tasks elegíveis');
  select * into v from public.pegar_proxima_task('agente-3', 'beta', 90, true);
  perform teste.ok(v.codigo = 'TASK-0001', 'beta: exclusivo pega a primeira');
  select * into v from public.pegar_proxima_task('agente-4', 'beta', 90, true);
  perform teste.ok(v.id is null, 'beta exclusivo: com trava ativa no projeto, nada é entregue');
  select * into v from public.pegar_proxima_task('agente-5', 'gama');
  perform teste.ok(v.id is null, 'projeto inativo não entrega tasks');
  select * into v from public.pegar_proxima_task('agente-5');
  perform teste.ok(v.titulo = 'D1', 'sem projeto: pega de qualquer projeto ativo (default)');
end $$;
select teste.erro($$select * from public.pegar_proxima_task('x', 'nao-existe')$$, 'projeto inexistente gera erro', 'não encontrado');
select teste.erro($$select public.finalizar_task((select id from public.tasks where codigo='ALP-0001'), 'concluida', 'ok', null, null, 'agente-errado')$$, 'só o dono da trava finaliza', 'pertence');

do $$
declare v public.tasks; l public.agendamento_tarefa_logs;
begin
  v := public.finalizar_task((select id from public.tasks where codigo='ALP-0001'), 'concluida', 'feito', 'https://example.com/pr/1', 'abc1234', 'agente-1', 'rotina-teste', '{"branch":"feat/x","arquivos_alterados":3}');
  perform teste.ok(v.status = 'concluida' and v.trava_frente is null and v.log_id is not null, 'finalizar_task conclui, libera trava e aponta log_id');
  select * into l from public.agendamento_tarefa_logs where id = v.log_id;
  perform teste.ok(l.project_id = v.project_id and l.task_codigo = 'ALP-0001' and l.status_anterior = 'em_execucao'
                   and l.status_novo = 'concluida' and l.repositorio = 'acme/alpha' and l.branch = 'feat/x'
                   and l.arquivos_alterados = 3 and l.instrucao_recebida = 'faça A1' and l.duracao_ms >= 0,
                   'log genérico preenchido (projeto, status, repositório, branch, instrução, duração)');
  v := public.finalizar_task((select id from public.tasks where codigo='ALP-0004'), 'erro', 'falhou', null, null, 'agente-2');
  perform teste.ok(v.status = 'pendente', 'erro com tentativas restantes volta para pendente');
  select * into v from public.pegar_proxima_task('agente-1', 'alpha');
  perform teste.ok(v.codigo = 'ALP-0002', 'dependência concluída libera ALP-0002 (prioridade 1)');
  perform teste.ok(public.registrar_execucao_sem_tarefa('rotina-teste', 'agente-9', 'alpha') > 0, 'log sem_tarefa');
end $$;
reset role;

-- ---------------------------------------------------------------- liberar trava pela interface
select t.id as alp2_id from public.tasks t join public.projects p on p.id = t.project_id where p.slug = 'alpha' and t.codigo = 'ALP-0002' \gset
set role authenticated; select teste.jwt('authenticated', '00000000-0000-0000-0000-00000000000b');
select teste.erro(format('select public.liberar_trava_task(%s, true)', :alp2_id), 'editor de outro projeto não libera trava', 'permissão');
reset role;
set role authenticated; select teste.jwt('authenticated', '00000000-0000-0000-0000-00000000000e');
select teste.erro($$select public.liberar_trava_task((select id from public.tasks where codigo='ALP-0002'))$$, 'trava válida não é liberada sem p_forcar', 'ainda está válida');
select teste.ok((select (public.liberar_trava_task((select id from public.tasks where codigo='ALP-0002'), true)).status) = 'pendente', 'editor do projeto libera trava com p_forcar');
select teste.ok((select count(*) from public.agendamento_tarefa_logs) >= 2, 'editor lê os logs de alpha');
select teste.ok((select count(*) from public.agendamento_tarefa_logs l join public.projects p on p.id = l.project_id where p.slug <> 'alpha') = 0, 'editor não lê logs de outros projetos');
reset role;

-- ---------------------------------------------------------------- administrador
set role authenticated; select teste.jwt('authenticated', '00000000-0000-0000-0000-00000000000a');
select teste.ok((select count(*) from public.projects) = 4, 'admin (user_roles) vê todos os projetos');
insert into public.projects (slug, nome) values ('criado-pelo-admin', 'Criado pelo admin');
select teste.ok(true, 'admin cria projeto');
reset role;
set role authenticated; select teste.jwt('authenticated', '00000000-0000-0000-0000-0000000000dd', 'admin');
select teste.ok((select count(*) from public.projects) = 5, 'admin via JWT app_metadata.role vê todos os projetos');
reset role;

-- ---------------------------------------------------------------- memórias
reset role; select teste.jwt(null);
insert into public.ai_memories (project_id, title, content, tags, embedding) values
  (null, 'Regra global', 'vale para todos', '{regra}', array_fill(0.1::real, array[1536])::vector),
  ((select id from public.projects where slug='alpha'), 'Arquitetura alpha', 'só alpha', '{arq}', array_fill(0.1::real, array[1536])::vector),
  ((select id from public.projects where slug='beta'),  'Arquitetura beta',  'só beta',  '{arq}', array_fill(0.1::real, array[1536])::vector);
insert into public.ai_memories (project_id, title, content) values ((select id from public.projects where slug='beta'), 'Arquitetura alpha', 'mesmo título noutro projeto');
select teste.ok(true, 'mesmo título de memória em projetos diferentes');
select teste.erro($$insert into public.ai_memories (project_id, title, content) values (null, 'Regra global', 'dup')$$, 'título global repetido é recusado', 'ai_memories_projeto_title_key');
insert into public.ai_memories (project_id, title, content) values (null, 'Regra global', 'upsert')
  on conflict (project_id, title) do update set content = excluded.content;
select teste.ok((select content from public.ai_memories where project_id is null and title='Regra global') = 'upsert', 'upsert por (project_id, title) funciona com memória global');

set role authenticated; select teste.jwt('authenticated', '00000000-0000-0000-0000-00000000000b');
select teste.ok((select string_agg(title, ',' order by title) from public.ai_memories) = 'Arquitetura alpha,Arquitetura beta,Regra global', 'editor de beta vê memórias de beta + globais');
select teste.ok((select count(*) from public.match_memories(array_fill(0.1::real, array[1536])::vector, 0.5, 10)) = 2, 'match_memories respeita RLS (2 com embedding visíveis)');
select teste.ok((select count(*) from public.match_memories(array_fill(0.1::real, array[1536])::vector, 0.5, 10, null, 'beta', false)) = 1, 'match_memories só do projeto (sem globais)');
select teste.erro($$insert into public.ai_memories (project_id, title, content) values (null, 'x', 'x')$$, 'não-admin não grava memória global', 'row-level security');
insert into public.ai_memories (project_id, title, content) values ((select id from public.projects where slug='beta'), 'Nova beta', 'ok');
select teste.ok(true, 'editor grava memória do projeto');
reset role;
set role service_role; select teste.jwt('service_role');
select teste.ok((select count(*) from public.match_memories(array_fill(0.1::real, array[1536])::vector, 0.5, 10, null, 'alpha')) = 2, 'service_role: alpha + global');
reset role; select teste.jwt(null);

select teste.ok(not exists (select 1 from pg_proc where proname = 'eh_professor_administrador'), 'eh_professor_administrador removida');
select teste.ok(to_regclass('public.professores_administradores') is null, 'professores_administradores removida');
\echo TODOS_OS_TESTES_PASSARAM
