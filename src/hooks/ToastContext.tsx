/**
 * Avisos rápidos (toasts) de sucesso/erro. `useToast()` dispara; o provider
 * renderiza a pilha no canto da tela (região aria-live).
 */
import { createContext, useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TipoToast = 'sucesso' | 'erro' | 'info';
interface Toast { id: number; tipo: TipoToast; mensagem: string }

export interface ToastContextValue {
  avisar: (mensagem: string, tipo?: TipoToast) => void;
  sucesso: (mensagem: string) => void;
  erro: (mensagem: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

const ICONE = { sucesso: CheckCircle2, erro: XCircle, info: Info };
const COR = {
  sucesso: 'border-emerald-200 text-emerald-800 dark:border-emerald-500/30 dark:text-emerald-300',
  erro: 'border-rose-200 text-rose-800 dark:border-rose-500/30 dark:text-rose-300',
  info: 'border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const proximo = useRef(1);

  const remover = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const avisar = useCallback((mensagem: string, tipo: TipoToast = 'info') => {
    const id = proximo.current++;
    setToasts((t) => [...t.slice(-3), { id, tipo, mensagem }]);
    setTimeout(() => remover(id), tipo === 'erro' ? 7000 : 4000);
  }, [remover]);

  const valor = useMemo<ToastContextValue>(
    () => ({ avisar, sucesso: (m) => avisar(m, 'sucesso'), erro: (m) => avisar(m, 'erro') }),
    [avisar],
  );

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end">
        {toasts.map((t) => {
          const Icone = ICONE[t.tipo];
          return (
            <div key={t.id} role={t.tipo === 'erro' ? 'alert' : 'status'} className={cn('pointer-events-auto flex w-full max-w-sm items-start gap-2 rounded-lg border bg-white px-3 py-2.5 text-sm shadow-lg animate-fade-in dark:bg-slate-900', COR[t.tipo])}>
              <Icone className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span className="flex-1">{t.mensagem}</span>
              <button type="button" onClick={() => remover(t.id)} className="text-slate-400 hover:text-slate-600" aria-label="Fechar aviso">
                <X className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
