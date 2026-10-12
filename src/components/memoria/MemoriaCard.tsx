import { Eye, FolderKanban, Globe, Tag, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { escopoMemoria, memoriaComoMarkdown } from '@/lib/memorias';
import { formatarDataHora, resumo, tempoRelativo } from '@/lib/tasks';
import type { Memoria } from '@/services/memoryService';
import { CopyButton } from '@/components/ui/CopyButton';

export interface MemoriaCardProps {
  memoria: Pick<Memoria, 'id' | 'title' | 'content' | 'tags' | 'project_id' | 'updated_at'>;
  onVer?: () => void;
  onExcluir?: () => void;
  className?: string;
}

const botaoAcao =
  'inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200';

/**
 * Cartão de uma memória na grade de gerenciamento (SUB-21.4): título, selo
 * Global/Projeto, tags, resumo (220 caracteres), atualização relativa e ações
 * Copiar (Markdown), Ver e Excluir.
 */
export function MemoriaCard({ memoria, onVer, onExcluir, className }: MemoriaCardProps) {
  const global = escopoMemoria(memoria) === 'global';
  return (
    <article
      className={cn(
        'flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 flex-1 truncate font-semibold text-slate-900 dark:text-slate-100" title={memoria.title}>
          {memoria.title}
        </h3>
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            global
              ? 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300'
              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-300',
          )}
          title={global ? 'Memória global: visível em todos os projetos' : 'Memória do projeto selecionado'}
        >
          {global ? <Globe className="size-3" aria-hidden="true" /> : <FolderKanban className="size-3" aria-hidden="true" />}
          {global ? 'Global' : 'Projeto'}
        </span>
      </div>

      {memoria.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {memoria.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <Tag className="size-3" aria-hidden="true" />
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm text-slate-600 dark:text-slate-400">{resumo(memoria.content, 220) || 'Sem conteúdo.'}</p>

      <div className="mt-auto flex items-center gap-1 border-t border-slate-100 pt-2 dark:border-slate-800">
        <time
          dateTime={memoria.updated_at}
          title={`Atualizada em ${formatarDataHora(memoria.updated_at)}`}
          className="mr-auto text-xs text-slate-500 dark:text-slate-400"
        >
          {tempoRelativo(memoria.updated_at)}
        </time>
        <CopyButton texto={memoriaComoMarkdown(memoria)} rotulo={`Copiar "${memoria.title}" em Markdown`} />
        {onVer && (
          <button type="button" onClick={onVer} className={botaoAcao} aria-label={`Ver "${memoria.title}"`} title="Ver">
            <Eye className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Ver</span>
          </button>
        )}
        {onExcluir && (
          <button
            type="button"
            onClick={onExcluir}
            className={cn(botaoAcao, 'hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-500/10 dark:hover:text-rose-300')}
            aria-label={`Excluir "${memoria.title}"`}
            title="Excluir"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Excluir</span>
          </button>
        )}
      </div>
    </article>
  );
}
