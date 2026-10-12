/**
 * Tipos compartilhados do frontend. Os tipos das tabelas do banco
 * (`Task`, `AiMemory`, `AgendamentoLog`, `Project`, `ProjectMember`) ficam em
 * `database.ts` (SUB-03) e são reexportados aqui.
 */

/** Telas principais do Dashboard (navegação da SUB-12). */
export type ViewId = 'fila' | 'memoria' | 'logs' | 'configuracoes';

/** Slug de projeto (tabela `projects`): todo dado da interface pertence a um projeto. */
export type ProjectSlug = string;
