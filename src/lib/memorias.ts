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
  linhas.push(`**Escopo:** ${m.project_id === null ? 'global' : 'projeto'}`, '', m.content.trim());
  return linhas.join('\n') + '\n';
}
