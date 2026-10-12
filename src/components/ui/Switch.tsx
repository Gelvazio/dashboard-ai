import { cn } from '@/lib/utils';

interface Props {
  ligado: boolean;
  onAlternar: (novo: boolean) => void;
  rotulo: string;
  desabilitado?: boolean;
  ocupado?: boolean;
}

/** Chave liga/desliga acessível (role="switch"). */
export function Switch({ ligado, onAlternar, rotulo, desabilitado, ocupado }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      aria-label={rotulo}
      aria-busy={ocupado}
      disabled={desabilitado}
      onClick={(e) => {
        e.stopPropagation();
        onAlternar(!ligado);
      }}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        ligado ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600',
        ocupado && 'animate-pulse',
      )}
    >
      <span
        className={cn(
          'inline-block size-4 rounded-full bg-white shadow transition-transform',
          ligado ? 'translate-x-4.5' : 'translate-x-0.5',
        )}
      />
    </button>
  );
}
