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

/** Escopo do filtro da grade: todas, só do projeto ou só globais. */
export type EscopoFiltroMemoria = 'todas' | 'projeto' | 'global';

/** Filtro local (no cliente) da grade de memórias. */
export interface FiltroMemoriasLocal {
  /** Texto livre: procurado em título, conteúdo e tags, sem acento e sem diferenciar maiúsculas. */
  busca?: string;
  /** Tag exata (sem diferenciar maiúsculas); vazia ou ausente = qualquer tag. */
  tag?: string | null;
  /** Escopo da memória (padrão `todas`). */
  escopo?: EscopoFiltroMemoria;
}

const semAcento = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/**
 * Filtra as memórias já carregadas (sem ir ao banco), preservando a ordem:
 * busca em título/conteúdo/tags (sem acento/maiúsculas), tag exata e escopo
 * (via `escopoMemoria`). Filtro vazio devolve todas.
 */
export function filtrarMemoriasLocal<M extends Pick<Memoria, 'title' | 'content' | 'tags' | 'project_id'>>(
  memorias: readonly M[],
  filtro: FiltroMemoriasLocal = {},
): M[] {
  const termo = semAcento(filtro.busca?.trim() ?? '');
  const tag = filtro.tag?.trim().toLowerCase() ?? '';
  const escopo = filtro.escopo ?? 'todas';
  return memorias.filter((m) => {
    const tags = m.tags ?? [];
    if (escopo !== 'todas' && escopoMemoria(m) !== escopo) return false;
    if (tag && !tags.some((t) => t.trim().toLowerCase() === tag)) return false;
    if (termo && !semAcento(`${m.title}\n${m.content}\n${tags.join(' ')}`).includes(termo)) return false;
    return true;
  });
}

/** Tag com a quantidade de memórias que a usam (para o filtro por tag). */
export interface TagDisponivel {
  tag: string;
  total: number;
}

/**
 * Lista as tags das memórias com a contagem de memórias por tag, ordenada por
 * total (desc) e depois por nome (pt-BR). Tags são comparadas sem espaços nas
 * pontas e em minúsculas; cada memória conta no máximo uma vez por tag.
 */
export function tagsDisponiveis(memorias: readonly Pick<Memoria, 'tags'>[]): TagDisponivel[] {
  const contagem = new Map<string, number>();
  for (const m of memorias) {
    const unicas = new Set((m.tags ?? []).map((t) => t.trim().toLowerCase()).filter(Boolean));
    for (const t of unicas) contagem.set(t, (contagem.get(t) ?? 0) + 1);
  }
  return [...contagem]
    .map(([tag, total]) => ({ tag, total }))
    .sort((a, b) => b.total - a.total || a.tag.localeCompare(b.tag, 'pt-BR'));
}
