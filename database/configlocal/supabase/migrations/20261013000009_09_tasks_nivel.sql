-- =============================================================================
-- Dashboard AI — 09_tasks_nivel.sql  (SUB-47.17)
-- Nível de esforço/risco de cada task, para o worker escolher o modelo
-- (SUB-47.19) e a fila respeitar a matriz ferramenta × modelo × nível da skill
-- `classificar-tarefa`. Complementa a tabela public.tasks (01_tasks_schema.sql).
--
--   LEVE   = tarefa fácil  (textos, .md, configuração simples)
--   MEDIO  = tarefa média  (código com lógica em 1 a 3 arquivos)
--   PESADO = tarefa difícil (banco, segurança, chaves, arquitetura, mudança em massa)
--
-- A coluna é OPCIONAL e sem default: null = ainda não classificada (o worker
-- classifica na SUB-47.18). Nenhuma linha existente muda.
--
-- Idempotente. Depende de 00 a 08 (aplicar depois do 08).
-- =============================================================================

alter table public.tasks add column if not exists nivel_tarefa text;

-- O filtro por `conrelid` evita pular a criação por causa de uma constraint de
-- MESMO NOME em outra tabela (mesmo cuidado do 08_projects_campos.sql).
do $$
begin
  if not exists (select 1 from pg_constraint
                 where conname = 'tasks_nivel_tarefa_check'
                   and conrelid = 'public.tasks'::regclass) then
    alter table public.tasks add constraint tasks_nivel_tarefa_check
      check (nivel_tarefa is null or nivel_tarefa in ('LEVE', 'MEDIO', 'PESADO'));
  end if;
end $$;

comment on column public.tasks.nivel_tarefa is
  'Nível da task: LEVE (fácil), MEDIO (média) ou PESADO (difícil); null = ainda não classificada. '
  'Definido pela skill classificar-tarefa / worker (Laya + Opus). SUB-47.17.';
