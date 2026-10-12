/**
 * Indicador do estado da conexão Realtime do monitor (SUB-35.29).
 *
 * Pílula "Ao vivo" (pulsando), "Conectando…" ou "Sem conexão — recarregar",
 * com botão que chama `recarregar` (vindo de `useEventosAgentes`).
 */
import type { StatusConexaoEventos } from '@/hooks/useEventosAgentes';

interface IndicadorAoVivoProps {
  statusConexao: StatusConexaoEventos;
  recarregar: () => void | Promise<void>;
  className?: string;
}

const ESTILO: Record<StatusConexaoEventos, { rotulo: string; pilula: string; ponto: string }> = {
  ao_vivo: {
    rotulo: 'Ao vivo',
    pilula: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
    ponto: 'bg-emerald-500 animate-pulse',
  },
  conectando: {
    rotulo: 'Conectando…',
    pilula: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
    ponto: 'bg-amber-500',
  },
  erro: {
    rotulo: 'Sem conexão — recarregar',
    pilula: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
    ponto: 'bg-red-500',
  },
};

export function IndicadorAoVivo({ statusConexao, recarregar, className = '' }: IndicadorAoVivoProps) {
  const estilo = ESTILO[statusConexao];
  return (
    <div className={`inline-flex items-center gap-2 ${className}`} role="status" aria-live="polite">
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${estilo.pilula}`}>
        <span className={`h-2 w-2 rounded-full ${estilo.ponto}`} aria-hidden="true" />
        {estilo.rotulo}
      </span>
      <button
        type="button"
        onClick={() => void recarregar()}
        className="rounded px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        title="Recarregar eventos"
      >
        Recarregar
      </button>
    </div>
  );
}
