/**
 * Camada de dados (Supabase): cliente, tasks, memória, logs e projetos.
 * Regras: toda consulta é filtrada pelo projeto selecionado (`project_id`), usa só
 * a chave anon + JWT do usuário (RLS decide o acesso) e nunca a service_role.
 * Funções assíncronas que lançam erro tratável pela interface.
 * Ex.: `export * from './taskService.ts';` (SUB-03, SUB-09 a SUB-11).
 */
export {};
