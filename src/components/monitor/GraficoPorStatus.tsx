import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import '@/lib/charts';
import { CORES_EIXO, CORES_ESTADO, corDoTema } from '@/lib/charts';
import { contarPorStatus, type EstadoAgente, type LimitesEstadoAgente } from '@/lib/monitor';
import type { AtividadeAgente } from '@/types';
import { cn } from '@/lib/utils';

const ROTULOS: Record<EstadoAgente, string> = {
  ativo: 'Ativo',
  ocioso: 'Ocioso',
  sem_sinal: 'Sem sinal',
  finalizado: 'Finalizado',
};

export interface GraficoPorStatusProps {
  atividades: readonly Pick<AtividadeAgente, 'tipo' | 'ultimo_em' | 'ultimo_heartbeat_em'>[];
  /** Timestamp atual em ms (padrão: Date.now()). */
  agora?: number;
  limites?: LimitesEstadoAgente;
  /** Tema escuro; padrão: classe `dark` no `<html>`. */
  escuro?: boolean;
  className?: string;
}

/** Rosca com a quantidade de agentes por estado (SUB-35.25). */
export function GraficoPorStatus({ atividades, agora, limites, escuro, className }: GraficoPorStatusProps) {
  const dark = escuro ?? (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
  const contagem = useMemo(() => contarPorStatus(atividades, agora, limites), [atividades, agora, limites]);
  const total = contagem.reduce((a, c) => a + c.total, 0);
  const descricao =
    total === 0
      ? 'Nenhum agente com atividade.'
      : `Agentes por estado: ${contagem.map((c) => `${ROTULOS[c.estado]} ${c.total}`).join(', ')}.`;

  const dados = useMemo(
    () => ({
      labels: contagem.map((c) => ROTULOS[c.estado]),
      datasets: [
        {
          data: contagem.map((c) => c.total),
          backgroundColor: contagem.map((c) => corDoTema(CORES_ESTADO[c.estado], dark)),
          borderWidth: 0,
        },
      ],
    }),
    [contagem, dark],
  );

  return (
    <figure className={cn('relative flex flex-col items-center gap-2', className)}>
      <div className="relative h-56 w-full max-w-xs">
        <Doughnut
          data={dados}
          aria-label={descricao}
          role="img"
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
              legend: { position: 'bottom', labels: { color: corDoTema(CORES_EIXO.texto, dark), boxWidth: 12 } },
            },
          }}
        />
      </div>
      <figcaption className="sr-only">{descricao}</figcaption>
    </figure>
  );
}
