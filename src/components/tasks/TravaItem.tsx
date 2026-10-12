import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { Botao } from '@/components/ui/Botao';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { TravaDiagnostico } from '@/lib/saudeFila';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

export interface TravaItemProps {
  trava: TravaDiagnostico;
  /** `true` enquanto a trava desta task está sendo liberada. */
  liberando?: boolean;
  /** `liberar` do `useSaudeFila`. */
  onLiberar: (task: Task, forcar: boolean) => Promise<boolean>;
}

function formatarMinutos(min: number): string {
  const m = Math.floor(min);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

/** Linha de uma trava ativa no diagnóstico da fila (SUB-23.10). */
export function TravaItem({ trava, liberando, onLiberar }: TravaItemProps) {
  const { task, minutos, expirada } = trava;
  const [confirmando, setConfirmando] = useState(false);
  const forcar = !expirada;

  const confirmar = async () => {
    const ok = await onLiberar(task, forcar);
    if (ok) setConfirmando(false);
  };

  return (
    <li
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2 text-sm',
        expirada
          ? 'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100'
          : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200',
      )}
    >
      <Lock className={cn('size-4 shrink-0', expirada ? 'text-rose-500' : 'text-slate-400')} aria-hidden />
      <span className="font-mono font-semibold">{task.codigo}</span>
      <span className="min-w-0 flex-1 truncate" title={task.titulo}>{task.titulo}</span>
      <span className="text-xs text-slate-500 dark:text-slate-400">{task.trava_frente ?? 'agente desconhecido'}</span>
      <span className={cn('text-xs font-medium tabular-nums', expirada && 'text-rose-600 dark:text-rose-300')}>
        {formatarMinutos(minutos)}
        {expirada && ' (expirada)'}
      </span>
      <Botao variante={expirada ? 'perigo' : 'secundario'} onClick={() => setConfirmando(true)} carregando={liberando}>
        <Unlock className="size-4" aria-hidden />
        Liberar trava
      </Botao>
      <ConfirmDialog
        aberto={confirmando}
        titulo={`Liberar trava de ${task.codigo}?`}
        perigo
        ocupado={liberando}
        rotuloConfirmar={forcar ? 'Forçar liberação' : 'Liberar trava'}
        mensagem={
          forcar ? (
            <>
              <p>
                A trava ainda <strong>não expirou</strong> ({formatarMinutos(minutos)}). O agente{' '}
                {task.trava_frente ?? 'responsável'} pode estar trabalhando nela agora.
              </p>
              <p className="mt-2">Forçar a liberação devolve a task para a fila e pode gerar trabalho duplicado.</p>
            </>
          ) : (
            <p>A trava passou do limite e a task voltará para a fila como pendente.</p>
          )
        }
        onConfirmar={() => void confirmar()}
        onCancelar={() => setConfirmando(false)}
      />
    </li>
  );
}
