/**
 * Barras horizontais empilhadas por tipo de evento, uma barra por agente
 * (SUB-35.26). Dados de `contarPorAgente`; cores de `CORES_TIPO` no tema atual.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Chart, CORES_EIXO, CORES_TIPO, corDoTema } from '@/lib/charts';
import { contarPorAgente } from '@/lib/monitor';
import { TIPOS_EVENTO_AGENTE, type AgentEvent } from '@/types/database';

export interface GraficoPorAgenteProps {
  eventos: readonly Pick<AgentEvent, 'agente' | 'tipo'>[];
  className?: string;
}

/** Acompanha a classe `dark` do <html> (aplicada por `useTema`). */
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

export function GraficoPorAgente({ eventos, className = '' }: GraficoPorAgenteProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const escuro = useModoEscuro();
  const contagens = useMemo(() => contarPorAgente(eventos), [eventos]);

  useEffect(() => {
    if (!canvas.current || contagens.length === 0) return;
    const texto = corDoTema(CORES_EIXO.texto, escuro);
    const grade = corDoTema(CORES_EIXO.grade, escuro);
    const grafico = new Chart(canvas.current, {
      type: 'bar',
      data: {
        labels: contagens.map((c) => c.agente),
        datasets: TIPOS_EVENTO_AGENTE.map((tipo) => ({
          label: tipo,
          data: contagens.map((c) => c.porTipo[tipo] ?? 0),
          backgroundColor: corDoTema(CORES_TIPO[tipo], escuro),
        })),
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
          x: { stacked: true, beginAtZero: true, ticks: { color: texto, precision: 0 }, grid: { color: grade } },
          y: { stacked: true, ticks: { color: texto }, grid: { display: false } },
        },
        plugins: { legend: { position: 'bottom', labels: { color: texto, boxWidth: 12 } } },
      },
    });
    return () => grafico.destroy();
  }, [contagens, escuro]);

  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 ${className}`}
    >
      <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Eventos por agente</h3>
      {contagens.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Nenhum evento ainda.</p>
      ) : (
        <div style={{ height: Math.max(160, contagens.length * 36 + 80) }}>
          <canvas ref={canvas} role="img" aria-label={`Eventos por agente: ${contagens.map((c) => `${c.agente} ${c.total}`).join(', ')}`} />
        </div>
      )}
    </div>
  );
}
