import { RefreshCw, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_INFO, type FiltroLocal } from '@/lib/tasks';
import { TASK_STATUS, type TaskStatus } from '@/types';

interface Props {
  filtro: FiltroLocal;
  onFiltro: (f: FiltroLocal) => void;
  contagem: Partial<Record<TaskStatus, number>>;
  carregando: boolean;
  onRecarregar: () => void;
  atualizadoEm?: Date | null;
}

const CAMPO = 'h-9 rounded-lg border border-slate-300 bg-white text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-950';

/** Busca textual, filtro por status e recarregar (SUB-15). Filtra no cliente: sem latência. */
export function TaskToolbar({ filtro, onFiltro, contagem, carregando, onRecarregar, atualizadoEm }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-2.5 dark:border-slate-800">
      <label className="relative min-w-48 flex-1">
        <span className="sr-only">Buscar tasks</span>
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
        <input
          type="text"
          value={filtro.busca ?? ''}
          onChange={(e) => onFiltro({ ...filtro, busca: e.target.value })}
          placeholder="Buscar por código, título ou instrução…"
          className={cn(CAMPO, 'w-full pl-8 pr-8')}
        />
        {filtro.busca && (
          <button type="button" onClick={() => onFiltro({ ...filtro, busca: '' })} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="Limpar busca">
            <X className="size-4" />
          </button>
        )}
      </label>
      <label>
        <span className="sr-only">Filtrar por status</span>
        <select aria-label="Filtrar por status" value={filtro.status ?? 'todos'} onChange={(e) => onFiltro({ ...filtro, status: e.target.value as FiltroLocal['status'] })} className={cn(CAMPO, 'px-2.5')}>
          <option value="todos">Todos os status</option>
          {TASK_STATUS.map((s) => (
            <option key={s} value={s}>
              {STATUS_INFO[s].rotulo} ({contagem[s] ?? 0})
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={onRecarregar}
        disabled={carregando}
        title={atualizadoEm ? `Atualizado às ${atualizadoEm.toLocaleTimeString('pt-BR')}` : 'Recarregar'}
        className={cn(CAMPO, 'inline-flex items-center gap-1.5 px-3 text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:text-slate-200 dark:hover:bg-slate-800')}
      >
        <RefreshCw className={cn('size-4', carregando && 'animate-spin')} aria-hidden />
        <span className="hidden sm:inline">Recarregar</span>
      </button>
    </div>
  );
}
