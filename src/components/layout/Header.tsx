import { Menu } from 'lucide-react';
import { ConnectionStatus } from './ConnectionStatus';
import { ProjectSelector } from './ProjectSelector';
import { ThemeToggle } from './ThemeToggle';

/** Barra superior: menu (mobile), título da tela, seletor de projeto, conexão e tema. */
export function Header({ titulo, onAbrirMenu }: { titulo: string; onAbrirMenu: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6 dark:border-slate-800 dark:bg-slate-900/80">
      <button
        type="button"
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
        onClick={onAbrirMenu}
        aria-label="Abrir menu"
      >
        <Menu className="size-5" />
      </button>
      <h1 className="truncate text-lg font-semibold">{titulo}</h1>
      <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">
        <ProjectSelector />
        <ConnectionStatus />
        <ThemeToggle />
      </div>
    </header>
  );
}
