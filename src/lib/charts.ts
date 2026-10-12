/**
 * Registro do Chart.js e paleta dos gráficos do monitor (SUB-35.22).
 *
 * Só os elementos usados pelos gráficos da SUB-35 são registrados (rosca por
 * estado, barras por agente e linha do tempo em barras horizontais), para o
 * tree-shaking manter o bundle pequeno. A linha do tempo usa `LinearScale` com
 * timestamps em milissegundos, dispensando o `TimeScale` e um adaptador de
 * datas. Importar este módulo antes de renderizar qualquer gráfico.
 *
 * O Chart.js 4 exige o controller de cada tipo usado em `new Chart(...)`: sem o
 * `BarController`, os gráficos de barras quebram com `"bar" is not a registered
 * controller`. A rosca usa o `<Doughnut>` do react-chartjs-2, que registra o seu.
 */
import { ArcElement, BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, Tooltip } from 'chart.js';

Chart.register(ArcElement, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export { Chart };

/** Cor de uma série nos temas claro e escuro. */
export interface CorTema {
  claro: string;
  escuro: string;
}

/** Estado exibido de um agente (ver `estadoDoAgente`, SUB-35.15). */
export type EstadoAgenteGrafico = 'ativo' | 'ocioso' | 'sem_sinal' | 'finalizado';

/** Tipo de evento da tabela `agent_events` (check `agent_events_tipo_check`). */
export type TipoEventoGrafico = 'inicio' | 'progresso' | 'fim' | 'erro' | 'heartbeat' | 'trava' | 'liberacao' | 'commit';

/** Cores por estado do agente (Tailwind: emerald, amber, slate, sky). */
export const CORES_ESTADO: Readonly<Record<EstadoAgenteGrafico, CorTema>> = {
  ativo: { claro: '#10b981', escuro: '#34d399' },
  ocioso: { claro: '#f59e0b', escuro: '#fbbf24' },
  sem_sinal: { claro: '#94a3b8', escuro: '#64748b' },
  finalizado: { claro: '#0ea5e9', escuro: '#38bdf8' },
};

/** Cores por tipo de evento (Tailwind 500 no claro, 400 no escuro). */
export const CORES_TIPO: Readonly<Record<TipoEventoGrafico, CorTema>> = {
  inicio: { claro: '#6366f1', escuro: '#818cf8' },
  progresso: { claro: '#0ea5e9', escuro: '#38bdf8' },
  fim: { claro: '#10b981', escuro: '#34d399' },
  erro: { claro: '#f43f5e', escuro: '#fb7185' },
  heartbeat: { claro: '#94a3b8', escuro: '#64748b' },
  trava: { claro: '#f59e0b', escuro: '#fbbf24' },
  liberacao: { claro: '#14b8a6', escuro: '#2dd4bf' },
  commit: { claro: '#8b5cf6', escuro: '#a78bfa' },
};

/** Escolhe a variante da cor conforme o tema atual. */
export function corDoTema(cor: CorTema, escuro: boolean): string {
  return escuro ? cor.escuro : cor.claro;
}

/** Cores de eixos, grade e texto dos gráficos em cada tema. */
export const CORES_EIXO: Readonly<Record<'texto' | 'grade', CorTema>> = {
  texto: { claro: '#475569', escuro: '#cbd5e1' },
  grade: { claro: '#e2e8f0', escuro: '#334155' },
};
