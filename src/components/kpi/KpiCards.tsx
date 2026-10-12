import type { ComponentType, ReactNode } from 'react';
import { Activity, Brain, CheckCircle2, Clock, History, Layers, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatarDataHora, tempoRelativo } from '@/lib/tasks';
import { useContagemAnimada } from '@/hooks/useContagemAnimada';
import type { Indicadores } from '@/hooks/useIndicadores';
import type { LogStatus } from '@/types';
import { Tooltip } from '@/components/ui/Tooltip';

const COR = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
  sky: 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
} as const;

const ROTULO_LOG: Record<LogStatus, string> = { concluida: 'Concluída', recusada: 'Recusada', erro: 'Erro', sem_tarefa: 'Sem task na fila' };
const COR_LOG: Record<LogStatus, string> = {
  concluida: 'text-emerald-600 dark:text-emerald-400',
  recusada: 'text-orange-600 dark:text-orange-400',
  erro: 'text-rose-600 dark:text-rose-400',
  sem_tarefa: 'text-slate-500',
};

interface CardProps {
  titulo: string;
  icone: ComponentType<{ className?: string }>;
  cor: keyof typeof COR;
  valor: ReactNode;
  rodape?: ReactNode;
  dica?: string;
  atraso: number;
  girando?: boolean;
}

function Card({ titulo, icone: Icone, cor, valor, rodape, dica, atraso, girando }: CardProps) {
  return (
    <Tooltip conteudo={dica} className="flex">
      <article
        tabIndex={dica ? 0 : undefined}
        className="card flex w-full animate-fade-in flex-col items-start gap-2 p-3 sm:flex-row sm:gap-3 sm:p-4 transition hover:-translate-y-0.5 hover:shadow-md"
        style={{ animationDelay: `${atraso}ms` }}
      >
        <span className={cn('rounded-lg p-2', COR[cor])}>
          <Icone className={cn('size-5', girando && 'animate-spin [animation-duration:2.5s]')} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase sm:truncate sm:text-xs tracking-wide text-slate-500 dark:text-slate-400">{titulo}</p>
          <p className="mt-0.5 truncate text-xl sm:text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">{valor}</p>
          {rodape && <p className="mt-0.5 text-xs sm:truncate text-slate-500 dark:text-slate-400">{rodape}</p>}
        </div>
      </article>
    </Tooltip>
  );
}

const Esqueleto = ({ largura = 'w-10' }: { largura?: string }) => (
  <span className={cn('inline-block h-7 animate-pulse rounded bg-slate-200 align-middle dark:bg-slate-700', largura)} />
);

function Numero({ valor, carregando }: { valor: number | null | undefined; carregando: boolean }) {
  const n = useContagemAnimada(valor ?? 0);
  if (valor == null) return carregando ? <Esqueleto /> : <>—</>;
  return <>{n}</>;
}

/** Cards de indicadores do projeto selecionado (SUB-13). */
export function KpiCards({ dados }: { dados: Indicadores }) {
  const { tasks, memorias, ultima, carregando } = dados;
  const total = tasks ? Object.values(tasks).reduce((a, b) => a + b, 0) : null;
  const pct = tasks && total ? Math.round((tasks.concluida / total) * 100) : 0;
  const falhas = tasks ? tasks.erro + tasks.recusada : 0;
  const executando = tasks?.em_execucao ?? 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-6" aria-busy={carregando}>
      <Card
        atraso={0}
        titulo="Total de tasks"
        icone={Layers}
        cor="brand"
        valor={<Numero valor={total} carregando={carregando} />}
        rodape={tasks ? `${pct}% concluídas` : undefined}
        dica={tasks ? `Todas as tasks não excluídas do projeto.\nCanceladas: ${tasks.cancelada}` : undefined}
      />
      <Card
        atraso={40}
        titulo="Pendentes"
        icone={Clock}
        cor="amber"
        valor={<Numero valor={tasks?.pendente} carregando={carregando} />}
        rodape="aguardando na fila"
        dica="Tasks com status pendente (ON e OFF)."
      />
      <Card
        atraso={80}
        titulo="Em execução"
        icone={executando ? Loader2 : Activity}
        girando={executando > 0}
        cor="sky"
        valor={<Numero valor={tasks?.em_execucao} carregando={carregando} />}
        rodape={executando ? 'agente trabalhando agora' : 'nenhum agente ativo'}
        dica="Tasks travadas por um agente de IA neste momento."
      />
      <Card
        atraso={120}
        titulo="Concluídas"
        icone={CheckCircle2}
        cor="emerald"
        valor={<Numero valor={tasks?.concluida} carregando={carregando} />}
        rodape={tasks ? (falhas ? `${falhas} com erro/recusada` : 'sem falhas') : undefined}
        dica={tasks ? `Erro: ${tasks.erro} · Recusadas: ${tasks.recusada}` : undefined}
      />
      <Card
        atraso={160}
        titulo="Memórias"
        icone={Brain}
        cor="violet"
        valor={<Numero valor={memorias?.total} carregando={carregando} />}
        rodape={memorias ? `${memorias.projeto} do projeto · ${memorias.globais} globais` : undefined}
        dica="Memórias que os agentes consultam: do projeto e globais (compartilhadas)."
      />
      <Card
        atraso={200}
        titulo="Última execução"
        icone={History}
        cor="slate"
        valor={ultima ? tempoRelativo(ultima.data_hora) : carregando ? <Esqueleto largura="w-20" /> : 'nunca'}
        rodape={
          ultima ? (
            <span className={COR_LOG[ultima.status]}>
              {ROTULO_LOG[ultima.status]}
              {ultima.task_codigo ? ` · ${ultima.task_codigo}` : ''}
            </span>
          ) : (
            'sem registros do agendador'
          )
        }
        dica={ultima ? `${formatarDataHora(ultima.data_hora)} · ${ultima.rotina}${ultima.agente ? ` · ${ultima.agente}` : ''}` : undefined}
      />
    </div>
  );
}
