/**
 * Feed ao vivo dos eventos dos agentes (monitor em tempo real, SUB-35).
 * Mostra hora, agente, tipo, task, etapa e mensagem; pode pausar a rolagem
 * (congela a lista e conta os novos) e destaca por instantes os eventos novos.
 * O destaque usa `motion-safe:`, então some com `prefers-reduced-motion`.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, Radio } from 'lucide-react';
import { Botao } from '@/components/ui/Botao';
import { cn } from '@/lib/utils';
import type { AgentEvent, TipoEventoAgente } from '@/types/database';

export interface FeedEventosProps {
  /** Eventos já ordenados do mais novo para o mais antigo. */
  eventos: AgentEvent[];
  /** Máximo de linhas exibidas (padrão 100). */
  limite?: number;
  className?: string;
}

const DESTAQUE_MS = 2000;

const NEUTRO = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
const COR_TIPO: Record<TipoEventoAgente, string> = {
  inicio: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  progresso: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  fim: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  erro: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  heartbeat: NEUTRO,
  trava: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  liberacao: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  commit: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
};

const hora = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

export function FeedEventos({ eventos, limite = 100, className }: FeedEventosProps) {
  const [pausado, setPausado] = useState(false);
  const [congelados, setCongelados] = useState<AgentEvent[]>([]);
  const [novos, setNovos] = useState<Set<number>>(new Set());
  const vistos = useRef<Set<number> | null>(null);

  // Marca como "novos" (destaque curto) os ids que não estavam na lista anterior.
  useEffect(() => {
    const ids = new Set(eventos.map((e) => e.id));
    if (vistos.current) {
      const chegaram = eventos.filter((e) => !vistos.current!.has(e.id)).map((e) => e.id);
      if (chegaram.length) {
        setNovos((s) => new Set([...s, ...chegaram]));
        const t = window.setTimeout(
          () => setNovos((s) => new Set([...s].filter((id) => !chegaram.includes(id)))),
          DESTAQUE_MS,
        );
        vistos.current = ids;
        return () => window.clearTimeout(t);
      }
    }
    vistos.current = ids;
  }, [eventos]);

  const alternar = () => {
    if (!pausado) setCongelados(eventos);
    setPausado((p) => !p);
  };

  const exibidos = (pausado ? congelados : eventos).slice(0, limite);
  const pendentes = useMemo(() => {
    if (!pausado) return 0;
    const ids = new Set(congelados.map((e) => e.id));
    return eventos.filter((e) => !ids.has(e.id)).length;
  }, [pausado, congelados, eventos]);

  return (
    <section className={cn('flex flex-col rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900', className)} aria-labelledby="titulo-feed-eventos">
      <header className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <h2 id="titulo-feed-eventos" className="flex items-center gap-2 font-semibold">
          <Radio className="size-4 text-brand-500" aria-hidden />
          Eventos ao vivo
          {pendentes > 0 && (
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              +{pendentes} novos
            </span>
          )}
        </h2>
        <Botao variante="fantasma" onClick={alternar} aria-pressed={pausado}>
          {pausado ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
          {pausado ? 'Retomar' : 'Pausar'}
        </Botao>
      </header>

      {exibidos.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-slate-500">Nenhum evento ainda.</p>
      ) : (
        <ol className="max-h-[28rem] divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800" aria-live={pausado ? 'off' : 'polite'} aria-relevant="additions">
          {exibidos.map((e) => (
            <li
              key={e.id}
              className={cn(
                'grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 px-4 py-2 text-sm',
                novos.has(e.id) && 'motion-safe:animate-pulse bg-brand-50 dark:bg-brand-950/30',
              )}
            >
              <time dateTime={e.created_at} className="font-mono text-xs text-slate-500 tabular-nums">
                {hora(e.created_at)}
              </time>
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-medium text-slate-900 dark:text-slate-100">{e.agente}</span>
                <span className={cn('rounded px-1.5 py-0.5 text-xs font-medium', COR_TIPO[e.tipo] ?? NEUTRO)}>{e.tipo}</span>
                {e.task_codigo && <span className="font-mono text-xs text-slate-600 dark:text-slate-300">{e.task_codigo}</span>}
                {e.etapa && <span className="text-xs text-slate-500">· {e.etapa}</span>}
              </div>
              {e.mensagem && (
                <p className="col-start-2 min-w-0 break-words text-slate-600 dark:text-slate-300">{e.mensagem}</p>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
