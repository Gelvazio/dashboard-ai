/**
 * Tipos compartilhados do frontend. Os tipos das tabelas do banco ficam em
 * `database.ts` e são reexportados aqui.
 */
export * from './database';

/** Telas principais do Dashboard (navegação da SUB-12). */
export type ViewId = 'fila' | 'memoria' | 'logs' | 'monitor' | 'configuracoes';

/** Slug de projeto (tabela `projects`): todo dado da interface pertence a um projeto. */
export type ProjectSlug = string;
