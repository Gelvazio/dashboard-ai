import { Monitor, Moon, Sun } from 'lucide-react';
import { useTema } from '@/hooks/useTema';

const INFO = {
  claro: { Icone: Sun, rotulo: 'Tema claro' },
  escuro: { Icone: Moon, rotulo: 'Tema escuro' },
  sistema: { Icone: Monitor, rotulo: 'Tema do sistema' },
} as const;

/** Alterna claro → escuro → sistema. */
export function ThemeToggle() {
  const { tema, alternar } = useTema();
  const { Icone, rotulo } = INFO[tema];
  return (
    <button
      type="button"
      onClick={alternar}
      className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      aria-label={`${rotulo} (clique para alternar)`}
      title={rotulo}
    >
      <Icone className="size-5" aria-hidden />
    </button>
  );
}
