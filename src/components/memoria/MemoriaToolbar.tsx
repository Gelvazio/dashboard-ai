import { RefreshCw, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EscopoFiltroMemoria, FiltroMemoriasLocal, TagDisponivel } from '@/lib/memorias';

export interface MemoriaToolbarProps {
  /** Filtro atual (controlado); aplicar com `filtrarMemoriasLocal`. */
  filtro: FiltroMemoriasLocal;
  onFiltro: (f: FiltroMemoriasLocal) => void;
  /** Tags para o seletor, normalmente `tagsDisponiveis(memorias)`. */
  tags: readonly TagDisponivel[];
  /** Quantidade exibida após o filtro. */
  filtradas: number;
  /** Quantidade carregada antes do filtro. */
  total: number;
  carregando: boolean;
  onRecarregar: () => void;
  atualizadoEm?: Date | null;
}

const CAMPO =
  'h-9 rounded-lg border border-slate-300 bg-white text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-950';

const ESCOPOS: { valor: EscopoFiltroMemoria; rotulo: string }[] = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'projeto', rotulo: 'Projeto' },
  { valor: 'global', rotulo: 'Globais' },
];

/** Busca instantânea, filtro por tag e escopo, contador e recarregar da grade de memórias (SUB-21.8). */
export function MemoriaToolbar({ filtro, onFiltro, tags, filtradas, total, carregando, onRecarregar, atualizadoEm }: MemoriaToolbarProps) {
  const escopo = filtro.escopo ?? 'todas';
  const tagAtual = filtro.tag ?? '';
  const filtroAtivo = Boolean(filtro.busca?.trim() || tagAtual || escopo !== 'todas');

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-2.5 dark:border-slate-800">
      <label className="relative min-w-48 flex-1">
        <span className="sr-only">Buscar memórias</span>
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
        <input
          type="text"
          value={filtro.busca ?? ''}
          onChange={(e) => onFiltro({ ...filtro, busca: e.target.value })}
          placeholder="Buscar por título, conteúdo ou tag…"
          className={cn(CAMPO, 'w-full pl-8 pr-8')}
        />
        {filtro.busca && (
          <button
            type="button"
            onClick={() => onFiltro({ ...filtro, busca: '' })}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label="Limpar busca"
          >
            <X className="size-4" />
          </button>
        )}
      </label>

      <select
        aria-label="Filtrar por tag"
        value={tagAtual}
        onChange={(e) => onFiltro({ ...filtro, tag: e.target.value || null })}
        className={cn(CAMPO, 'max-w-48 px-2.5')}
      >
        <option value="">Todas as tags</option>
        {tagAtual && !tags.some((t) => t.tag === tagAtual) && <option value={tagAtual}>#{tagAtual} (0)</option>}
        {tags.map((t) => (
          <option key={t.tag} value={t.tag}>
            #{t.tag} ({t.total})
          </option>
        ))}
      </select>

      <div role="radiogroup" aria-label="Escopo das memórias" className="inline-flex h-9 overflow-hidden rounded-lg border border-slate-300 text-sm shadow-sm dark:border-slate-700">
        {ESCOPOS.map((e) => (
          <button
            key={e.valor}
            type="button"
            role="radio"
            aria-checked={escopo === e.valor}
            onClick={() => onFiltro({ ...filtro, escopo: e.valor })}
            className={cn(
              'px-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/40',
              escopo === e.valor
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800',
            )}
          >
            {e.rotulo}
          </button>
        ))}
      </div>

      <span className="text-sm tabular-nums text-slate-500 dark:text-slate-400" aria-live="polite">
        {filtroAtivo ? `${filtradas} de ${total}` : `${total}`} {total === 1 ? 'memória' : 'memórias'}
      </span>

      <button
        type="button"
        onClick={onRecarregar}
        disabled={carregando}
        title={atualizadoEm ? `Atualizado às ${atualizadoEm.toLocaleTimeString('pt-BR')}` : 'Recarregar'}
        className={cn(CAMPO, 'ml-auto inline-flex items-center gap-1.5 px-3 text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:text-slate-200 dark:hover:bg-slate-800')}
      >
        <RefreshCw className={cn('size-4', carregando && 'animate-spin')} aria-hidden />
        <span className="hidden sm:inline">Recarregar</span>
      </button>
    </div>
  );
}
