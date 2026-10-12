/**
 * Linha do tempo dos agentes (SUB-35.27): Gantt simples com barras flutuantes
 * `[inicio, fim]` por agente na última hora, a partir de `segmentosLinhaDoTempo`.
 * Tooltip mostra etapa e status. Eixo X linear em ms (sem adaptador de datas).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Chart, CORES_EIXO, CORES_TIPO, corDoTema } from '@/lib/charts';
import { segmentosLinhaDoTempo, type SegmentoLinhaDoTempo } from '@/lib/monitor';
import type { AgentEvent } from '@/types/database';

export interface LinhaDoTempoAgentesProps {
  eventos: readonly Pick<AgentEvent, 'agente' | 'execucao_id' | 'etapa' | 'tipo' | 'created_at'>[];
  agora?: number;
  /** Janela exibida em ms (padrão: 1 h). */
  janelaMs?: number;
  className?: string;
}

const COR_STATUS: Record<SegmentoLinhaDoTempo['status'], keyof typeof CORES_TIPO> = {
  aberta: 'progresso',
  concluida: 'fim',
  erro: 'erro',
};
const ROTULO_STATUS: Record<SegmentoLinhaDoTempo['status'], string> = {
  aberta: 'em andamento',
  concluida: 'concluída',
  erro: 'erro',
};

function useModoEscuro(): boolean {
  const [escuro, setEscuro] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const raiz = document.documentElement;
    const obs = new MutationObserver(() => setEscuro(raiz.classList.contains('dark')));
    obs.observe(raiz, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return escuro;
}

const hora = (ms: number) => new Date(ms).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export function LinhaDoTempoAgentes({ eventos, agora = Date.now(), janelaMs = 60 * 60 * 1000, className = '' }: LinhaDoTempoAgentesProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const escuro = useModoEscuro();
  const minimo = agora - janelaMs;
  const segmentos = useMemo(
    () =>
      segmentosLinhaDoTempo(
        eventos.map((e) => ({ ...e, execucao_id: e.execucao_id ?? '' })),
        agora,
      )
        .filter((s) => s.fim >= minimo)
        .map((s) => ({ ...s, inicio: Math.max(s.inicio, minimo) })),
    [eventos, agora, minimo],
  );
  const agentes = useMemo(() => [...new Set(segmentos.map((s) => s.agente))].sort((a, b) => a.localeCompare(b, 'pt-BR')), [segmentos]);

  useEffect(() => {
    if (!canvas.current || segmentos.length === 0) return;
    const texto = corDoTema(CORES_EIXO.texto, escuro);
    const grade = corDoTema(CORES_EIXO.grade, escuro);
    const grafico = new Chart(canvas.current, {
      type: 'bar',
      data: {
        labels: agentes,
        datasets: [
          {
            label: 'Execuções',
            data: segmentos.map((s) => ({ x: [s.inicio, s.fim], y: s.agente })) as unknown as number[],
            backgroundColor: segmentos.map((s) => corDoTema(CORES_TIPO[COR_STATUS[s.status]], escuro)),
            borderSkipped: false,
            barPercentage: 0.6,
            grouped: false,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
          x: {
            type: 'linear',
            min: minimo,
            max: agora,
            ticks: { color: texto, callback: (v) => hora(Number(v)), maxTicksLimit: 7 },
            grid: { color: grade },
          },
          y: { type: 'category', ticks: { color: texto }, grid: { display: false } },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (itens) => segmentos[itens[0]?.dataIndex ?? 0]?.agente ?? '',
              label: (item) => {
                const s = segmentos[item.dataIndex];
                if (!s) return '';
                return `${s.etapa ?? 'sem etapa'} · ${ROTULO_STATUS[s.status]} (${hora(s.inicio)}–${hora(s.fim)})`;
              },
            },
          },
        },
      },
    });
    return () => grafico.destroy();
  }, [segmentos, agentes, escuro, minimo, agora]);

  return (
    <div className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 ${className}`}>
      <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Linha do tempo (última hora)</h3>
      {segmentos.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Nenhuma execução na última hora.</p>
      ) : (
        <div style={{ height: Math.max(160, agentes.length * 36 + 60) }}>
          <canvas ref={canvas} role="img" aria-label={`Linha do tempo: ${segmentos.length} execuções de ${agentes.length} agentes`} />
        </div>
      )}
    </div>
  );
}
