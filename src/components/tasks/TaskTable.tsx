import { useMemo, type ReactNode } from 'react';
import { ExternalLink, GitCommit, Inbox, Lock, Power, PowerOff, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { bloqueadaPorDependencia, dependenciasDa, formatarDataHora, resumo, tempoRelativo } from '@/lib/tasks';
import type { Task } from '@/types';
import { Tooltip } from '@/components/ui/Tooltip';
import { StatusBadge } from './StatusBadge';
import { PrioridadeBadge } from './PrioridadeBadge';
import { TentativasBar } from './TentativasBar';
import { Dependencias } from './Dependencias';

export interface TaskTableProps {
  tasks: Task[];
  carregando?: boolean;
  /**
   * Tasks usadas para resolver dependências (padrão: `tasks`). Passe a lista
   * completa do projeto quando `tasks` estiver filtrada.
   */
  referencia?: Task[];
  /** Clique na linha/código (ex.: abrir a visualização detalhada). */
  onAbrir?: (task: Task) => void;
  /** Conteúdo da coluna Ações (botões de ação rápida). */
  acoes?: (task: Task) => ReactNode;
  vazio?: ReactNode;
}

const TH = 'whitespace-nowrap px-2 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400';
const TD = 'px-2 py-2.5 align-middle';

function detalheStatus(t: Task): string | undefined {
  if (t.status === 'em_execucao' && t.trava_frente) return `Travada por ${t.trava_frente} ${tempoRelativo(t.trava_em)}`;
  if (t.concluido_em) return `Finalizada em ${formatarDataHora(t.concluido_em)}`;
  if (t.executar_apos && Date.parse(t.executar_apos) > Date.now()) return `Agendada para ${formatarDataHora(t.executar_apos)}`;
  return undefined;
}

function OnOff({ ligado }: { ligado: boolean }) {
  return (
    <Tooltip conteudo={ligado ? 'ON — a fila pode executar esta task' : 'OFF — pausada; a fila não vai pegá-la'}>
      <span
        tabIndex={0}
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
          ligado ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
        )}
      >
        {ligado ? <Power className="size-3" aria-hidden /> : <PowerOff className="size-3" aria-hidden />}
        {ligado ? 'ON' : 'OFF'}
      </span>
    </Tooltip>
  );
}

function Resultado({ task }: { task: Task }) {
  const texto = resumo(task.resultado, 60);
  return (
    <span className="flex min-w-0 max-w-36 items-center gap-2">
      {task.pr_url && (
        <Tooltip conteudo={`Abrir PR: ${task.pr_url}`}>
          <a href={task.pr_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="shrink-0 text-brand-600 hover:text-brand-800 dark:text-brand-400" aria-label="Abrir pull request">
            <ExternalLink className="size-3.5" />
          </a>
        </Tooltip>
      )}
      {task.commit_sha && (
        <Tooltip conteudo={`Commit ${task.commit_sha}`}>
          <span tabIndex={0} className="inline-flex shrink-0 items-center gap-0.5 font-mono text-[11px] text-slate-500">
            <GitCommit className="size-3" aria-hidden />
            {task.commit_sha.slice(0, 7)}
          </span>
        </Tooltip>
      )}
      {texto ? (
        <Tooltip conteudo={resumo(task.resultado, 240)} className="flex min-w-0">
          <span tabIndex={0} className="block truncate text-xs text-slate-600 dark:text-slate-400">
            {texto}
          </span>
        </Tooltip>
      ) : (
        !task.pr_url && !task.commit_sha && <span className="text-xs text-slate-400">—</span>
      )}
    </span>
  );
}

function Titulo({ task, bloqueada }: { task: Task; bloqueada: boolean }) {
  return (
    <span className="flex min-w-0 flex-col md:max-w-48">
      <span className="flex items-center gap-1.5">
        <Tooltip conteudo={resumo(task.instrucao, 240)} className="flex min-w-0">
          <span className="block font-medium text-slate-900 md:truncate dark:text-slate-100">{task.titulo}</span>
        </Tooltip>
        {task.tipo === 'humano' && (
          <Tooltip conteudo="Task humana — concluída por uma pessoa, não pela IA">
            <User className="size-3.5 shrink-0 text-violet-500" aria-label="Task humana" />
          </Tooltip>
        )}
        {bloqueada && (
          <Tooltip conteudo="Aguardando dependências serem concluídas">
            <Lock className="size-3.5 shrink-0 text-amber-500" aria-label="Bloqueada por dependência" />
          </Tooltip>
        )}
      </span>
      {task.status === 'em_execucao' && task.trava_frente && (
        <span className="text-[11px] text-sky-600 dark:text-sky-400">
          {task.trava_frente} · {tempoRelativo(task.trava_em)}
        </span>
      )}
    </span>
  );
}

function Esqueleto() {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800" aria-busy="true" aria-label="Carregando tasks">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-4 px-4 py-3.5">
          <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 flex-1 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  );
}

/** Resumo do progresso da fila: barra empilhada por status (concluídas em destaque). */
export function ProgressoFila({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const concluidas = tasks.filter((t) => t.status === 'concluida').length;
  const execucao = tasks.filter((t) => t.status === 'em_execucao').length;
  const falhas = tasks.filter((t) => t.status === 'erro' || t.status === 'recusada').length;
  if (!total) return null;
  const pct = (n: number) => `${(n / total) * 100}%`;
  return (
    <Tooltip conteudo={`${concluidas} concluída(s), ${execucao} em execução, ${falhas} com erro/recusada, de ${total}`} className="flex min-w-40 flex-1 items-center gap-2">
      <span tabIndex={0} className="flex h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={concluidas} aria-label="Progresso da fila">
        <span className="bg-status-concluida" style={{ width: pct(concluidas) }} />
        <span className="bg-status-execucao" style={{ width: pct(execucao) }} />
        <span className="bg-status-erro" style={{ width: pct(falhas) }} />
      </span>
      <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
        {Math.round((concluidas / total) * 100)}%
      </span>
    </Tooltip>
  );
}

/** Tabela da fila de tasks do projeto (vira lista de cartões em telas pequenas). */
export function TaskTable({ tasks, carregando, referencia, onAbrir, acoes, vazio }: TaskTableProps) {
  const porCodigo = useMemo(() => new Map((referencia ?? tasks).map((t) => [t.codigo, t])), [referencia, tasks]);
  const linhas = useMemo(
    () => tasks.map((t) => { const deps = dependenciasDa(t, porCodigo); return { t, deps, bloqueada: bloqueadaPorDependencia(deps) }; }),
    [tasks, porCodigo],
  );

  if (carregando && !tasks.length) return <Esqueleto />;
  if (!tasks.length) {
    return (
      <div className="flex flex-col items-center gap-2 px-6 py-14 text-center text-sm text-slate-500">
        <Inbox className="size-8 text-slate-300 dark:text-slate-600" aria-hidden />
        {vazio ?? 'Nenhuma task neste projeto ainda.'}
      </div>
    );
  }

  const abrivel = onAbrir ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50' : '';
  return (
    <>
      {/* Desktop/tablet */}
      <div className={cn('hidden overflow-x-auto md:block', carregando && 'opacity-60 transition-opacity')}>
        <table className="w-full min-w-[900px] text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/60">
            <tr>
              <th className={TH}>Código</th>
              <th className={TH}>Título</th>
              <th className={cn(TH, 'text-center')} title="Prioridade (1 = mais urgente)">P</th>
              <th className={cn(TH, 'text-center')} title="Ordem dentro da prioridade">Ord.</th>
              <th className={TH}>Depende de</th>
              <th className={TH}>ON/OFF</th>
              <th className={TH}>Status</th>
              <th className={TH} title="Tentativas usadas / máximo">Tent.</th>
              <th className={TH}>Resultado</th>
              <th className={cn(TH, 'text-right')}>Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {linhas.map(({ t, deps, bloqueada }) => (
              <tr key={t.id} className={cn('transition-colors', abrivel, !t.executar && 'opacity-70')} onClick={onAbrir ? () => onAbrir(t) : undefined}>
                <td className={cn(TD, 'whitespace-nowrap font-mono text-xs font-medium text-slate-700 dark:text-slate-300')}>{t.codigo}</td>
                <td className={cn(TD, 'max-w-64')}><Titulo task={t} bloqueada={bloqueada} /></td>
                <td className={cn(TD, 'text-center')}><PrioridadeBadge prioridade={t.prioridade} /></td>
                <td className={cn(TD, 'text-center tabular-nums text-slate-600 dark:text-slate-400')}>{t.ordem}</td>
                <td className={TD}><Dependencias deps={deps} /></td>
                <td className={TD}><OnOff ligado={t.executar} /></td>
                <td className={TD}><StatusBadge status={t.status} detalhe={detalheStatus(t)} /></td>
                <td className={TD}><TentativasBar task={t} /></td>
                <td className={TD}><Resultado task={t} /></td>
                <td className={cn(TD, 'whitespace-nowrap text-right')} onClick={(e) => e.stopPropagation()}>
                  {acoes ? acoes(t) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Celular */}
      <ul className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
        {linhas.map(({ t, deps, bloqueada }) => (
          <li key={t.id} className={cn('flex flex-col gap-2 px-4 py-3', abrivel, !t.executar && 'opacity-70')} onClick={onAbrir ? () => onAbrir(t) : undefined}>
            <div className="flex items-center gap-2">
              <PrioridadeBadge prioridade={t.prioridade} />
              <span className="font-mono text-xs font-medium text-slate-600 dark:text-slate-400">{t.codigo}</span>
              <span className="ml-auto"><StatusBadge status={t.status} detalhe={detalheStatus(t)} /></span>
            </div>
            <Titulo task={t} bloqueada={bloqueada} />
            <div className="flex flex-wrap items-center gap-3">
              <OnOff ligado={t.executar} />
              <TentativasBar task={t} />
              {deps.length > 0 && <Dependencias deps={deps} />}
            </div>
            {(t.resultado || t.pr_url || t.commit_sha) && <Resultado task={t} />}
            {acoes && <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>{acoes(t)}</div>}
          </li>
        ))}
      </ul>
    </>
  );
}

