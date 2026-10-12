import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { copiarTexto } from '@/lib/clipboard';
import { useToast } from '@/hooks/useToast';

interface Props {
  texto: string;
  rotulo: string;
  /** Mostrar o rótulo ao lado do ícone (padrão: só ícone com aria-label). */
  comTexto?: boolean;
  className?: string;
}

/** Botão "copiar com um clique" com confirmação visual. */
export function CopyButton({ texto, rotulo, comTexto, className }: Props) {
  const toast = useToast();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!ok) return;
    const t = setTimeout(() => setOk(false), 1500);
    return () => clearTimeout(t);
  }, [ok]);

  return (
    <button
      type="button"
      aria-label={rotulo}
      title={rotulo}
      onClick={async () => {
        if (await copiarTexto(texto)) setOk(true);
        else toast.erro('Não foi possível copiar. Selecione o texto e copie manualmente.');
      }}
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200',
        ok && 'text-emerald-600 dark:text-emerald-400',
        className,
      )}
    >
      {ok ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      {comTexto && <span>{ok ? 'Copiado!' : rotulo}</span>}
      <span className="sr-only" aria-live="polite">{ok ? 'Copiado' : ''}</span>
    </button>
  );
}
