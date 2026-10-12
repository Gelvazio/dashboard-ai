import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  aberto: boolean;
  titulo: ReactNode;
  descricao?: ReactNode;
  onFechar: () => void;
  children: ReactNode;
  rodape?: ReactNode;
  tamanho?: 'md' | 'lg' | 'xl';
}

const LARGURA = { md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', xl: 'sm:max-w-4xl' };

/** Diálogo modal acessível: Esc fecha, foco preso no diálogo, tela cheia no celular. */
export function Modal({ aberto, titulo, descricao, onFechar, children, rodape, tamanho = 'lg' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const idTitulo = useId();
  const fechar = useRef(onFechar);
  useEffect(() => {
    fechar.current = onFechar;
  });

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const primeiro =
      ref.current?.querySelector<HTMLElement>('[data-autofocus]') ?? ref.current?.querySelector<HTMLElement>('input, textarea, select, button');
    primeiro?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); fechar.current(); }
      if (e.key === 'Tab' && ref.current) {
        const foco = [...ref.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')];
        if (!foco.length) return;
        const [ini, fim] = [foco[0], foco[foco.length - 1]];
        if (e.shiftKey && document.activeElement === ini) { e.preventDefault(); fim.focus(); }
        else if (!e.shiftKey && document.activeElement === fim) { e.preventDefault(); ini.focus(); }
      }
    };
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('keydown', tecla);
      document.body.style.overflow = overflow;
      anterior?.focus();
    };
  }, [aberto]);

  if (!aberto) return null;
  return createPortal(
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] animate-fade-in" onClick={onFechar} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        className={cn('relative flex max-h-[100dvh] w-full flex-col bg-white shadow-xl animate-fade-in sm:max-h-[90vh] sm:rounded-xl dark:bg-slate-900', 'rounded-t-xl', LARGURA[tamanho])}
      >
        <header className="flex items-start gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="min-w-0 flex-1">
            <h2 id={idTitulo} className="text-base font-semibold">{titulo}</h2>
            {descricao && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{descricao}</p>}
          </div>
          <button type="button" onClick={onFechar} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800" aria-label="Fechar">
            <X className="size-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {rodape && <footer className="flex flex-wrap justify-end gap-2 border-t border-slate-200 px-5 py-3 dark:border-slate-800">{rodape}</footer>}
      </div>
    </div>,
    document.body,
  );
}
