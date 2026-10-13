import {
  Activity,
  Brain,
  FolderKanban,
  ListTodo,
  ScrollText,
  Settings,
  X,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ViewId } from '@/types';
import { VIEWS } from '@/views/meta';

const ICONES: Record<ViewId, LucideIcon> = {
  fila: ListTodo,
  memoria: Brain,
  logs: ScrollText,
  monitor: Activity,
  configuracoes: Settings,
  projetos: FolderKanban,
};

interface Props {
  view: ViewId;
  onNavegar: (v: ViewId) => void;
  aberta: boolean;
  onFechar: () => void;
}

/** Navegação lateral: fixa no desktop, gaveta no mobile. */
export function Sidebar({ view, onNavegar, aberta, onFechar }: Props) {
  return (
    <>
      <div
        className={cn('fixed inset-0 z-30 bg-slate-950/40 lg:hidden', aberta ? 'block' : 'hidden')}
        onClick={onFechar}
        aria-hidden
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-900',
          'lg:static lg:translate-x-0',
          aberta ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Navegação principal"
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <span className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">D</span>
            Dashboard AI
          </span>
          <button
            type="button"
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
            onClick={onFechar}
            aria-label="Fechar menu"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {VIEWS.map(({ id, titulo }) => {
            const Icone = ICONES[id];
            const ativo = id === view;
            return (
              <a
                key={id}
                href={`#/${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavegar(id);
                  onFechar();
                }}
                aria-current={ativo ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  ativo
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
                )}
              >
                <Icone className="size-5 shrink-0" aria-hidden />
                {titulo}
              </a>
            );
          })}
        </nav>
        <p className="border-t border-slate-200 p-4 text-xs text-slate-500 dark:border-slate-800">
          Gerenciador de tasks de IA multi-projeto
        </p>
      </aside>
    </>
  );
}
