import { Globe, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatarDataHora, resumo, tempoRelativo } from '@/lib/tasks';
import { SimilaridadeBadge } from './SimilaridadeBadge';

export interface ResultadoBuscaCardProps {
  titulo: string;
  conteudo: string;
  tags: string[];
  /** Similaridade (0–1) da busca semântica; omitida na busca textual. */
  similaridade?: number;
  /** Memória global (`project_id` nulo), visível em todos os projetos. */
  global: boolean;
  /** ISO do `updated_at` da memória. */
  atualizadoEm: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Cartão de um resultado da busca de memórias (SUB-19.5): título, resumo do
 * conteúdo (200 caracteres), tags, selo "Global" e badge de similaridade.
 */
export function ResultadoBuscaCard({
  titulo,
  conteudo,
  tags,
  similaridade,
  global,
  atualizadoEm,
  onClick,
  className,
}: ResultadoBuscaCardProps) {
  const Raiz = onClick ? 'button' : 'article';
  return (
    <Raiz
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'flex w-full flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition dark:border-slate-800 dark:bg-slate-900',
        onClick && 'hover:border-indigo-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-indigo-500 dark:hover:border-indigo-700',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 flex-1 truncate font-semibold text-slate-900 dark:text-slate-100" title={titulo}>
          {titulo}
        </h3>
        <div className="flex shrink-0 items-center gap-1.5">
          {global && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-500/15 dark:text-sky-300">
              <Globe className="size-3" aria-hidden="true" />
              Global
            </span>
          )}
          {similaridade !== undefined && <SimilaridadeBadge similaridade={similaridade} />}
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">{resumo(conteudo, 200) || 'Sem conteúdo.'}</p>
      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <Tag className="size-3" aria-hidden="true" />
            {tag}
          </span>
        ))}
        <time
          dateTime={atualizadoEm}
          title={`Atualizada em ${formatarDataHora(atualizadoEm)}`}
          className="ml-auto text-xs text-slate-500 dark:text-slate-400"
        >
          {tempoRelativo(atualizadoEm)}
        </time>
      </div>
    </Raiz>
  );
}
