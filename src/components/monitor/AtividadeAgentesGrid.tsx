/**
 * Grade responsiva de AgenteCard (SUB-35.24).
 *
 * Ordem: ativos primeiro, depois ociosos, sem sinal e finalizados;
 * dentro do mesmo estado, o sinal mais recente primeiro.
 */
import { estadoDoAgente, type EstadoAgente } from '@/lib/monitor';
import type { AtividadeAgente } from '@/types/database';
import { AgenteCard } from './AgenteCard';

interface AtividadeAgentesGridProps {
  atividades: AtividadeAgente[];
  agora?: number;
}

const ORDEM: Record<EstadoAgente, number> = { ativo: 0, ocioso: 1, sem_sinal: 2, finalizado: 3 };

export function AtividadeAgentesGrid({ atividades, agora = Date.now() }: AtividadeAgentesGridProps) {
  if (atividades.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Nenhum agente reportou atividade
      </p>
    );
  }

  const ordenadas = atividades
    .map((a) => ({ a, ordem: ORDEM[estadoDoAgente(a, agora)], t: Date.parse(a.ultimo_em) || 0 }))
    .sort((x, y) => x.ordem - y.ordem || y.t - x.t)
    .map(({ a }) => a);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {ordenadas.map((a) => (
        <AgenteCard key={a.agente} atividade={a} agora={agora} />
      ))}
    </div>
  );
}
