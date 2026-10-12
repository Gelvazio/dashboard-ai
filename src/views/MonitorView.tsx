import { useEffect, type ReactNode } from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import { EmConstrucao } from '@/components/EmConstrucao';
import { AtividadeAgentesGrid } from '@/components/monitor/AtividadeAgentesGrid';
import { FeedEventos } from '@/components/monitor/FeedEventos';
import { GraficoPorAgente } from '@/components/monitor/GraficoPorAgente';
import { GraficoPorStatus } from '@/components/monitor/GraficoPorStatus';
import { IndicadorAoVivo } from '@/components/monitor/IndicadorAoVivo';
import { LinhaDoTempoAgentes } from '@/components/monitor/LinhaDoTempoAgentes';
import { useAtividadeAgentes } from '@/hooks/useAtividadeAgentes';
import { useEventosAgentes } from '@/hooks/useEventosAgentes';
import { useProjetoAtual } from '@/hooks/useProjetoAtual';

function Cartao({ titulo, children, className = '' }: { titulo: string; children: ReactNode; className?: string }) {
  return (
    <section className={`card overflow-hidden ${className}`}>
      <h2 className="border-b border-slate-200 px-4 py-3 text-sm font-semibold dark:border-slate-800">{titulo}</h2>
      <div className="p-4">{children}</div>
    </section>
  );
}

/** Monitor em tempo real dos agentes do projeto (SUB-35.30): atividade, gráficos, linha do tempo e feed. */
export function MonitorView() {
  const { projeto } = useProjetoAtual();
  const ev = useEventosAgentes(projeto?.id);
  const at = useAtividadeAgentes(projeto?.id);
  const { recarregarDebounced } = at;

  // Cada evento novo (Realtime) pode mudar o estado dos agentes: reconsulta a atividade com debounce.
  useEffect(() => {
    if (ev.eventos.length) recarregarDebounced();
  }, [ev.eventos, recarregarDebounced]);

  if (!projeto) return <EmConstrucao titulo="Monitor dos Agentes" tarefa="selecione um projeto" />;

  const erro = ev.erro ?? at.erro;
  const carregando = at.carregando && at.atividades.length === 0;
  const escuro = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <header className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto flex items-center gap-2 text-lg font-semibold">
          <Activity className="size-5 text-brand-500" aria-hidden />
          Agentes em tempo real
        </h2>
        <IndicadorAoVivo
          statusConexao={ev.statusConexao}
          recarregar={() => {
            void ev.recarregar();
            void at.recarregar();
          }}
        />
      </header>

      {erro && (
        <p role="alert" className="flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
          <AlertCircle className="size-4" aria-hidden />
          {erro}
        </p>
      )}

      <Cartao titulo="Atividade atual">
        {carregando ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Carregando atividade">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : (
          <AtividadeAgentesGrid atividades={at.atividades} agora={at.agora} />
        )}
      </Cartao>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <Cartao titulo="Agentes por status">
          <GraficoPorStatus atividades={at.atividades} agora={at.agora} escuro={escuro} />
        </Cartao>
        <Cartao titulo="Eventos por agente">
          <GraficoPorAgente eventos={ev.eventos} />
        </Cartao>
      </div>

      <Cartao titulo="Linha do tempo (última hora)">
        <LinhaDoTempoAgentes eventos={ev.eventos} agora={at.agora} />
      </Cartao>

      <Cartao titulo="Feed de eventos">
        <FeedEventos eventos={ev.eventos} />
      </Cartao>
    </div>
  );
}
