import { CalendarClock, CircleCheck, Link2Off, PowerOff, RotateCcw, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PendentesClassificadas } from '@/lib/saudeFila';
import { Tooltip } from '@/components/ui/Tooltip';

type Grupo = keyof PendentesClassificadas;

const GRUPOS: { chave: Grupo; rotulo: string; dica: string; Icone: LucideIcon; cor: string }[] = [
  {
    chave: 'prontas',
    rotulo: 'Prontas',
    dica: 'Ligadas, com tentativas, sem agendamento futuro e com dependências concluídas: o próximo agente pode pegar.',
    Icone: CircleCheck,
    cor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    chave: 'bloqueadas_dependencia',
    rotulo: 'Bloqueadas',
    dica: 'Aguardam alguma dependência ainda não concluída.',
    Icone: Link2Off,
    cor: 'text-amber-600 dark:text-amber-400',
  },
  {
    chave: 'desligadas',
    rotulo: 'Desligadas',
    dica: 'Com o switch ON/OFF desligado: nenhum agente as pega até serem ligadas.',
    Icone: PowerOff,
    cor: 'text-slate-500 dark:text-slate-400',
  },
  {
    chave: 'agendadas',
    rotulo: 'Agendadas',
    dica: 'Com "Executar após" no futuro: entram na fila quando a data chegar.',
    Icone: CalendarClock,
    cor: 'text-sky-600 dark:text-sky-400',
  },
  {
    chave: 'sem_tentativas',
    rotulo: 'Sem tentativas',
    dica: 'Atingiram o máximo de tentativas: reabra ou aumente o limite para voltarem à fila.',
    Icone: RotateCcw,
    cor: 'text-rose-600 dark:text-rose-400',
  },
];

export interface PendentesResumoProps {
  pendentes: PendentesClassificadas;
  className?: string;
}

/** Contadores das tasks pendentes por grupo de `classificarPendentes` (SUB-23.11). */
export function PendentesResumo({ pendentes, className }: PendentesResumoProps) {
  return (
    <ul className={cn('grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5', className)} aria-label="Pendentes por situação">
      {GRUPOS.map(({ chave, rotulo, dica, Icone, cor }) => {
        const total = pendentes[chave].length;
        return (
          <li key={chave}>
            <Tooltip conteudo={dica} className="block">
              <span
                tabIndex={0}
                aria-label={`${rotulo}: ${total}. ${dica}`}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
              >
                <Icone className={cn('size-4 shrink-0', cor)} aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-xs text-slate-600 dark:text-slate-400">{rotulo}</span>
                <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">{total}</span>
              </span>
            </Tooltip>
          </li>
        );
      })}
    </ul>
  );
}
