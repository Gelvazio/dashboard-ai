/**
 * Camada de dados (Supabase): cliente, tasks, memória, logs e projetos.
 * Regras: toda consulta é filtrada pelo projeto selecionado (`project_id`), usa só
 * a chave anon + JWT do usuário (RLS decide o acesso) e nunca a service_role.
 * Funções assíncronas que lançam ServiceError tratável pela interface.
 */
export * from './supabase';
export * from './projectService';
export * from './taskService';
export * from './memoryService';
export * from './logService';
export * from './embeddingService';
