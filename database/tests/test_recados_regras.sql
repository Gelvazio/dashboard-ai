-- Testes de SUB-31 (agent_messages, project_rules, RLS). Rodar com run_tests.sh
-- (depois de test_multi_projeto.sql, que cria os projetos e membros alpha/beta).
\set ON_ERROR_STOP 1
\set QUIET 1
set client_min_messages = notice;

reset role; select teste.jwt(null);
select id as alpha_id from public.projects where slug = 'alpha' \gset
select id as beta_id  from public.projects where slug = 'beta' \gset
-- usuários (de test_multi_projeto.sql): ...0e editor alpha, ...f1 viewer alpha, ...c1 owner alpha,
-- ...0b editor beta, ...0a admin

-- ---------------------------------------------------------------- recados (service_role / agentes)
set role service_role; select teste.jwt('service_role');
insert into public.agent_messages (project_id, remetente, destinatario, mensagem, task_codigo)
values (:alpha_id, 'Agente A', 'Agente B', 'Terminei ALP-0001, pode seguir', 'ALP-0001');
select teste.ok((select task_id is not null from public.agent_messages where mensagem like 'Terminei%'), 'task_codigo resolve task_id');
insert into public.agent_messages (project_id, remetente, mensagem, tipo)
values (:alpha_id, 'Agente A', 'Atenção: não mexer em database/ hoje', 'alerta');
insert into public.agent_messages (project_id, remetente, destinatario, mensagem)
values (:alpha_id, 'Agente C', 'Agente A', 'Recado para A');
insert into public.agent_messages (project_id, remetente, destinatario, mensagem)
values (:beta_id, 'Agente X', 'Agente B', 'Recado do projeto beta');
select teste.erro(format($$insert into public.agent_messages (project_id, remetente, mensagem, task_codigo) values (%s, 'A', 'x', 'TASK-0001')$$, :alpha_id),
  'task de outro projeto é recusada (por código)', 'não existe no projeto');
select teste.erro(format($$insert into public.agent_messages (project_id, remetente, mensagem, task_id) select %s, 'A', 'x', id from public.tasks where codigo = 'TASK-0001'$$, :alpha_id),
  'task de outro projeto é recusada (por id)', 'não pertence');
select teste.erro(format($$insert into public.agent_messages (project_id, remetente, mensagem, resposta_de) select %s, 'A', 'x', id from public.agent_messages where project_id = %s$$, :alpha_id, :beta_id),
  'resposta a recado de outro projeto é recusada', 'não existe no projeto');
select teste.erro(format($$insert into public.agent_messages (project_id, remetente, mensagem) values (%s, '  ', 'x')$$, :alpha_id), 'remetente vazio recusado', 'remetente_check');
select teste.erro(format($$insert into public.agent_messages (project_id, remetente, mensagem, tipo) values (%s, 'A', 'x', 'spam')$$, :alpha_id), 'tipo inválido recusado', 'tipo_check');
select teste.erro($$update public.agent_messages set project_id = project_id + 1 where mensagem = 'Recado para A'$$, 'project_id imutável', 'não pode ser alterado');

-- caixa de entrada
select teste.ok((select count(*) from public.ler_recados('alpha', 'Agente B')) = 2, 'Agente B vê o recado dirigido + o recado para todos');
select teste.ok((select count(*) from public.ler_recados('alpha', 'Agente A')) = 1, 'remetente não vê os próprios recados (A vê só o recado de C)');
select teste.ok((select string_agg(mensagem, '|' order by id) from public.ler_recados('alpha', 'Agente B', true, true)) like 'Terminei%|Aten%', 'ler e marcar como lido');
select teste.ok((select lido_por from public.agent_messages where mensagem like 'Terminei%') = 'Agente B', 'lido_por gravado');
select teste.ok((select lido_em is null from public.agent_messages where tipo = 'alerta'), 'recado para todos não é marcado como lido');
select teste.ok((select count(*) from public.ler_recados('alpha', 'Agente B')) = 1, 'só não lidos: resta o recado para todos');
select teste.ok((select count(*) from public.ler_recados('alpha', 'Agente B', false)) = 2, 'p_somente_nao_lidos=false traz todos');
select teste.ok((select count(*) from public.ler_recados('alpha', 'Agente B', false, false, now() + interval '1 hour')) = 0, 'p_desde filtra por data');
select teste.erro($$select * from public.ler_recados('nao-existe', 'A')$$, 'ler_recados com projeto inexistente', 'não encontrado');
select teste.erro($$select * from public.ler_recados('alpha', ' ')$$, 'ler_recados sem agente', 'informe o agente');

-- ---------------------------------------------------------------- recados com RLS (interface)
reset role;
set role anon; select teste.jwt('anon');
select teste.erro($$select * from public.agent_messages$$, 'anon não lê recados', 'permission denied');
select teste.erro($$select * from public.ler_recados('alpha', 'X')$$, 'anon não executa ler_recados', 'permission denied');
reset role;

set role authenticated; select teste.jwt('authenticated', '00000000-0000-0000-0000-0000000000f1');  -- viewer alpha
select teste.ok((select count(*) from public.agent_messages) = 3, 'viewer de alpha lê só os recados de alpha');
select teste.erro(format($$insert into public.agent_messages (project_id, remetente, mensagem) values (%s, 'Viewer', 'x')$$, :alpha_id), 'viewer não cria recado', 'sem permissão');
reset role;

set role authenticated; select teste.jwt('authenticated', '00000000-0000-0000-0000-00000000000e');  -- editor alpha
insert into public.agent_messages (project_id, remetente, destinatario, mensagem, criado_por)
values (:alpha_id, 'Pessoa E', 'Agente A', 'Recado da interface', '00000000-0000-0000-0000-0000000000ff');
select teste.ok((select criado_por from public.agent_messages where mensagem = 'Recado da interface') = '00000000-0000-0000-0000-00000000000e', 'criado_por é sempre o usuário logado');
select teste.erro(format($$insert into public.agent_messages (project_id, remetente, mensagem) values (%s, 'E', 'x')$$, :beta_id), 'editor de alpha não escreve em beta', 'sem permissão');
select teste.erro(format($$insert into public.agent_messages (project_id, remetente, mensagem, task_codigo) values (%s, 'E', 'x', 'TASK-0001')$$, :beta_id), 'erro genérico: não sonda tasks de outro projeto', 'sem permissão');
update public.agent_messages set arquivado = true where mensagem = 'Recado para A';
select teste.ok((select count(*) from public.ler_recados('alpha', 'Agente A')) = 1, 'arquivado some da caixa (resta o recado da interface)');
select teste.erro($$update public.agent_messages set mensagem = 'editado' where mensagem = 'Recado da interface'$$, 'interface não edita o texto do recado', 'permission denied');
select teste.erro($$delete from public.agent_messages$$, 'interface não apaga recados', 'permission denied');
select teste.ok((select count(*) from public.ler_recados('alpha', 'Agente A', true, true)) = 1, 'editor marca como lido via ler_recados');
reset role;

-- ---------------------------------------------------------------- regras por projeto
set role service_role; select teste.jwt('service_role');
insert into public.project_rules (project_id, arquivo, secao, ordem, conteudo, commit_sha) values
  (:alpha_id, 'AGENTS.md', '## 1. Commits', 1, 'Sempre git pull --rebase antes do push.', 'abc1234'),
  (:alpha_id, 'AGENTS.md', '## 2. Travas', 2, 'Trave a task antes de começar.', 'abc1234'),
  (:alpha_id, 'CLAUDE.md', '', 0, 'Arquivo inteiro', 'abc1234'),
  (:beta_id,  'AGENTS.md', '## 1. Commits', 1, 'Regra do beta', 'def5678');
select teste.ok((select md5 from public.project_rules where project_id = :alpha_id and secao = '## 1. Commits') = md5('Sempre git pull --rebase antes do push.'), 'md5 calculado do conteúdo');
select teste.erro(format($$insert into public.project_rules (project_id, arquivo, secao, conteudo) values (%s, 'AGENTS.md', '## 1. Commits', 'dup')$$, :alpha_id), 'seção única por arquivo no projeto', 'project_rules_secao_key');
select teste.erro(format($$insert into public.project_rules (project_id, arquivo, conteudo) values (%s, '../segredo', 'x')$$, :alpha_id), 'caminho com .. recusado', 'arquivo_check');
select teste.erro($$update public.project_rules set md5 = 'x'$$, 'md5 não é editável (coluna gerada)', 'DEFAULT');
update public.project_rules set ativo = false where arquivo = 'CLAUDE.md';

select teste.ok((select string_agg(situacao, ',' order by arquivo, secao) from public.conferir_regras('alpha', jsonb_build_array(
    jsonb_build_object('arquivo', 'AGENTS.md', 'secao', '## 1. Commits', 'md5', md5('Sempre git pull --rebase antes do push.')),
    jsonb_build_object('arquivo', 'AGENTS.md', 'secao', '## 3. Nova', 'md5', md5('nova')),
    jsonb_build_object('arquivo', 'README.md', 'secao', '', 'md5', md5('x'))
  ))) = 'igual,so_banco,so_local,so_local', 'conferir_regras: igual, so_banco (## 2), so_local; inativa ignorada');
select teste.ok((select situacao from public.conferir_regras('alpha', '[{"arquivo":"AGENTS.md","secao":"## 2. Travas","md5":"0"}]') where secao = '## 2. Travas') = 'diverge', 'conferir_regras: diverge');
select teste.erro($$select * from public.conferir_regras('alpha', '{}')$$, 'conferir_regras exige array', 'array JSON');
reset role;

set role authenticated; select teste.jwt('authenticated', '00000000-0000-0000-0000-00000000000e');  -- editor alpha
select teste.ok((select count(*) from public.project_rules) = 3, 'editor de alpha lê só as regras de alpha');
select teste.erro(format($$insert into public.project_rules (project_id, arquivo, conteudo) values (%s, 'X.md', 'x')$$, :alpha_id), 'editor não escreve regras', 'row-level security');
update public.project_rules set conteudo = 'hack' where secao = '## 2. Travas';
select teste.ok(true, 'update de editor é filtrado pela RLS');
reset role;
select teste.ok((select conteudo from public.project_rules where secao = '## 2. Travas') = 'Trave a task antes de começar.', 'editor não alterou a regra');

set role authenticated; select teste.jwt('authenticated', '00000000-0000-0000-0000-0000000000c1');  -- owner alpha
insert into public.project_rules (project_id, arquivo, secao, conteudo, criado_por) values (:alpha_id, 'AGENTS.md', '## 3. Nova', 'nova', '00000000-0000-0000-0000-0000000000ff');
select teste.ok((select criado_por = '00000000-0000-0000-0000-0000000000c1' and atualizado_por = criado_por from public.project_rules where secao = '## 3. Nova'), 'owner grava regra (autor forçado)');
update public.project_rules set conteudo = 'nova v2' where secao = '## 3. Nova';
select teste.ok((select md5 from public.project_rules where secao = '## 3. Nova') = md5('nova v2'), 'owner atualiza e md5 acompanha');
select teste.erro(format($$insert into public.project_rules (project_id, arquivo, conteudo) values (%s, 'X.md', 'x')$$, :beta_id), 'owner de alpha não escreve em beta', 'row-level security');
select teste.erro($$update public.project_rules set project_id = project_id + 1 where secao = '## 3. Nova'$$, 'project_id da regra imutável', 'não pode ser alterado');
delete from public.project_rules where secao = '## 3. Nova';
select teste.ok(not exists (select 1 from public.project_rules where secao = '## 3. Nova'), 'owner apaga regra');
reset role;

set role authenticated; select teste.jwt('authenticated', '00000000-0000-0000-0000-00000000000a');  -- admin
select teste.ok((select count(*) from public.project_rules) = 4 and (select count(*) from public.agent_messages) >= 5, 'administrador lê tudo');
reset role;
set role anon; select teste.jwt('anon');
select teste.erro($$select * from public.project_rules$$, 'anon não lê regras', 'permission denied');
reset role; select teste.jwt(null);
\echo TODOS_OS_TESTES_PASSARAM
