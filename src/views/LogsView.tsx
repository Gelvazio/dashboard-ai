import { useState } from 'react';
import { AlertCircle, Bot, ExternalLink, GitCommit, History, RefreshCw, Search, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { agruparPorDia, duracaoDoLog, formatarDuracao, LOG_INFO } from '@/lib/logs';
import { tempoRelativo } from '@/lib/tasks';
import { useProjetoAtual } from '@/hooks/useProjetoAtual';
import { useLogs } from '@/hooks/useLogs';
import { useTasks } from '@/hooks/useTasks';
import { useSaudeFila } from '@/hooks/useSaudeFila';
import { SaudeFilaPanel } from '@/components/tasks/SaudeFilaPanel';
import { EmConstrucao } from '@/components/EmConstrucao';
import { Botao } from '@/components/ui/Botao';
import { LOG_STATUS, type AgendamentoLog, type LogStatus } from '@/types';

const HORA = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

function ItemLog({ log }: { log: AgendamentoLog }) {
  const [aberto, setAberto] = useState(false);
  const info = LOG_INFO[log.status];
  const dur = duracaoDoLog(log);
  const texto = log.erro_mensagem || log.detalhes;
  return (
    <li className="relative pb-4 pl-6 last:pb-0">
      <span className="absolute left-[5px] top-2 h-full w-px bg-slate-200 dark:bg-slate-700" aria-hidden />
      <span className={cn('absolute left-0 top-1.5 size-[11px] rounded-full ring-2 ring-white dark:ring-slate-900', info.ponto)} aria-hidden />
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <time dateTime={log.data_hora} title={tempoRelativo(log.data_hora)} className="font-mono text-xs tabular-nums text-slate-500">{HORA.format(new Date(log.data_hora))}</time>
        <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset', info.badge)}>{info.rotulo}</span>
        <span className="font-medium">{log.rotina}</span>
        {log.task_codigo && <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] dark:bg-slate-800">{log.task_codigo}</span>}
        {log.agente && <span className="inline-flex items-center gap-1 text-xs text-slate-500"><Bot className="size-3.5" aria-hidden />{log.agente}</span>}
        {dur != null && <span className="inline-flex items-center gap-1 text-xs text-slate-500" title="Tempo de execução"><Timer className="size-3.5" aria-hidden />{formatarDuracao(dur)}</span>}
        {log.pr_url && <a href={log.pr_url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-0.5 text-xs text-brand-600 hover:underline dark:text-brand-400">PR<ExternalLink className="size-3" aria-hidden /></a>}
        {log.commit_sha && <span className="inline-flex items-center gap-0.5 font-mono text-[11px] text-slate-500"><GitCommit className="size-3" aria-hidden />{log.commit_sha.slice(0, 7)}</span>}
      </div>
      {texto && (
        <button type="button" onClick={() => setAberto((a) => !a)} className={cn('mt-1 block w-full text-left text-xs', log.erro_mensagem ? 'text-rose-700 dark:text-rose-300' : 'text-slate-600 dark:text-slate-400', !aberto && 'line-clamp-2')} aria-expanded={aberto} title={aberto ? 'Recolher' : 'Expandir'}>
          {log.erro_mensagem && log.detalhes && aberto ? `${log.erro_mensagem}\n\n${log.detalhes}` : texto}
        </button>
      )}
    </li>
  );
}

/** Linha do tempo das execuções do agendador no projeto (SUB-22). */
export function LogsView() {
  const { projeto } = useProjetoAtual();
  const [status, setStatus] = useState<LogStatus | null>(null);
  const [busca, setBusca] = useState('');
  const [termo, setTermo] = useState('');
  const { logs, total, contadores, carregando, erro, temMais, carregarMais, recarregar } = useLogs(projeto?.id, { status: status ?? undefined, busca: termo });
  const fila = useTasks(projeto?.id);
  const saude = useSaudeFila({ projectId: projeto?.id, tasks: fila.tasks, recarregar: fila.recarregar });

  if (!projeto) return <EmConstrucao titulo="Logs do Agendador" tarefa="selecione um projeto" />;

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <SaudeFilaPanel diagnostico={saude.diagnostico} liberando={saude.liberando} onLiberar={saude.liberar} />
      <section className="card overflow-hidden">
        <header className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h2 className="mr-auto flex items-center gap-2 font-semibold"><History className="size-4 text-brand-500" aria-hidden />Execuções<span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{total}</span></h2>
          <form onSubmit={(e) => { e.preventDefault(); setTermo(busca); }} className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} onBlur={() => setTermo(busca)} placeholder="Buscar em detalhes, erro ou task…" aria-label="Buscar nos logs" className="h-9 w-64 max-w-full rounded-lg border border-slate-300 bg-white pl-8 pr-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          </form>
          <Botao onClick={() => void recarregar()} disabled={carregando} aria-label="Recarregar"><RefreshCw className={cn('size-4', carregando && 'animate-spin')} aria-hidden /></Botao>
        </header>
        <div className="flex flex-wrap gap-1.5 border-b border-slate-200 px-4 py-2.5 dark:border-slate-800" role="group" aria-label="Filtrar por status">
          <button type="button" onClick={() => setStatus(null)} aria-pressed={status === null} className={cn('rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset', status === null ? 'bg-brand-600 text-white ring-brand-600' : 'ring-slate-300 text-slate-600 dark:ring-slate-700 dark:text-slate-300')}>Todos {contadores ? `(${contadores.total})` : ''}</button>
          {LOG_STATUS.map((s) => (
            <button key={s} type="button" onClick={() => setStatus(status === s ? null : s)} aria-pressed={status === s} className={cn('rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset', status === s ? LOG_INFO[s].badge : 'ring-slate-300 text-slate-600 dark:ring-slate-700 dark:text-slate-300')}>
              {LOG_INFO[s].rotulo} {contadores ? `(${contadores[s]})` : ''}
            </button>
          ))}
        </div>
        {erro && <p role="alert" className="flex items-center gap-2 bg-rose-50 px-4 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"><AlertCircle className="size-4" aria-hidden />{erro}</p>}
        <div className="px-4 py-4">
          {!logs.length ? (
            <p className="py-10 text-center text-sm text-slate-500">{carregando ? 'Carregando…' : 'Nenhuma execução registrada com esses filtros.'}</p>
          ) : (
            agruparPorDia(logs).map(([dia, itens]) => (
              <div key={dia} className="mb-5 last:mb-0">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{dia}</h3>
                <ol>{itens.map((l) => <ItemLog key={l.id} log={l} />)}</ol>
              </div>
            ))
          )}
          {temMais && (
            <div className="mt-4 text-center">
              <Botao onClick={() => void carregarMais()} carregando={carregando}>Carregar mais ({logs.length} de {total})</Botao>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
