/**
 * Funções puras da tela Memória (SUB-21): exportação e filtros das memórias
 * do projeto e globais.
 */
import type { Memoria } from '@/services/memoryService';

/**
 * Converte a memória em Markdown para copiar/colar em outro agente:
 * `# título`, linha de tags, escopo e o conteúdo.
 */
export function memoriaComoMarkdown(m: Pick<Memoria, 'title' | 'content' | 'tags' | 'project_id'>): string {
  const linhas = [`# ${m.title.trim()}`, ''];
  const tags = (m.tags ?? []).map((t) => t.trim()).filter(Boolean);
  if (tags.length) linhas.push(`**Tags:** ${tags.map((t) => `\`${t}\``).join(', ')}`);
  linhas.push(`**Escopo:** ${escopoMemoria(m)}`, '', m.content.trim());
  return linhas.join('\n') + '\n';
}

/** Escopo da memória: `project_id` nulo = global (compartilhada entre projetos). */
export function escopoMemoria(m: Pick<Memoria, 'project_id'>): 'global' | 'projeto' {
  return m.project_id === null || m.project_id === undefined ? 'global' : 'projeto';
}
