import { useState, type ReactNode } from 'react';
import { Bot, ExternalLink, GitCommit, GitPullRequest, Lock, Pencil, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { acoesDisponiveis, dependenciasDa, formatarDataHora, STATUS_INFO, taskComoMarkdown, tempoRelativo } from '@/lib/tasks';
import type { Project, Task } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Botao } from '@/components/ui/Botao';
import { CopyButton } from '@/components/ui/CopyButton';
import { Markdown } from '@/components/ui/Markdown';
import { StatusBadge } from './StatusBadge';
import { PrioridadeBadge } from './PrioridadeBadge';
import { TentativasBar } from './TentativasBar';
import { Dependencias } from './Dependencias';

interface Props {
  task: Task | null;
  projeto: Project;
  /** Tasks do projeto para resolver a situação das dependências. */
  referencia?: Task[];
  onFechar: () => void;
  onEditar?: (t: Task) => void;
}

function Secao({ titulo, acao, children }: { titulo: string; acao?: ReactNode; children: ReactNode }) {
  return (
    <section className="mt-5 first:mt-0">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{titulo}</h3>
        {acao}
      </div>
      {children}
    </section>
  );
}

function Meta({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{rotulo}</dt>
      <dd className="mt-0.5 text-sm text-slate-800 dark:text-slate-200">{children}</dd>
    </div>
  );
}

function Abas({ valor, onMudar }: { valor: 'formatado' | 'texto'; onMudar: (v: 'formatado' | 'texto') => void }) {
  return (
    <div className="inline-flex rounded-md bg-slate-100 p-0.5 text-xs dark:bg-slate-800" role="tablist">
      {(['formatado', 'texto'] as const).map((v) => (
        <button
          key={v}
          type="button"
          role="tab"
          aria-selected={valor === v}
          onClick={() => onMudar(v)}
          className={cn(
            'rounded px-2 py-0.5 capitalize',
            valor === v ? 'bg-white font-medium shadow-sm dark:bg-slate-700' : 'text-slate-500',
          )}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

/** Visualização completa da task: instrução, relatório da IA, PR, commit e metadados (SUB-17). */
export function TaskDetailModal({ task, projeto, referencia, onFechar, onEditar }: Props) {
  const [modo, setModo] = useState<'formatado' | 'texto'>('formatado');
  if (!task) return null;
  const t = task;
  const deps = dependenciasDa(t, new Map((referencia ?? []).map((x) => [x.codigo, x])));
  const podeEditar = acoesDisponiveis(t).editar && onEditar;

  return (
    <Modal
      aberto
      tamanho="xl"
      onFechar={onFechar}
      titulo={
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm text-slate-500">{t.codigo}</span>
          <span>{t.titulo}</span>
        </span>
      }
      descricao={
        <span className="mt-1 flex flex-wrap items-center gap-2">
          <StatusBadge status={t.status} />
          <PrioridadeBadge prioridade={t.prioridade} />
          <span className="inline-flex items-center gap-1 text-xs">
            {t.tipo === 'humano' ? <User className="size-3.5" aria-hidden /> : <Bot className="size-3.5" aria-hidden />}
            {t.tipo === 'humano' ? 'Task humana' : 'Executada por IA'}
          </span>
          {!t.executar && (
            <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              OFF
            </span>
          )}
        </span>
      }
      rodape={
        <>
          <CopyButton texto={taskComoMarkdown(t, projeto)} rotulo="Copiar tudo (Markdown)" comTexto className="mr-auto" />
          {podeEditar && (
            <Botao
              onClick={() => {
                onFechar();
                onEditar(t);
              }}
            >
              <Pencil className="size-4" aria-hidden /> Editar
            </Botao>
          )}
          <Botao variante="primario" onClick={onFechar} data-autofocus>
            Fechar
          </Botao>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_17rem]">
        <div className="min-w-0">
          {t.status === 'em_execucao' && t.trava_frente && (
            <p className="mb-4 flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300">
              <Lock className="size-4 shrink-0" aria-hidden />
              Travada por <strong>{t.trava_frente}</strong> {tempoRelativo(t.trava_em)} — só a fila pode alterá-la agora.
            </p>
          )}
          <Secao
            titulo="Instrução"
            acao={
              <span className="flex items-center gap-1">
                <Abas valor={modo} onMudar={setModo} />
                <CopyButton texto={t.instrucao} rotulo="Copiar instrução" />
              </span>
            }
          >
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              {modo === 'formatado' ? (
                <Markdown texto={t.instrucao} />
              ) : (
                <pre className="whitespace-pre-wrap break-words font-mono text-xs">{t.instrucao}</pre>
              )}
            </div>
          </Secao>
          <Secao
            titulo={t.tipo === 'humano' ? 'Resultado' : 'Relatório da IA'}
            acao={t.resultado ? <CopyButton texto={t.resultado} rotulo="Copiar relatório" /> : undefined}
          >
            {t.resultado?.trim() ? (
              <div
                className={cn(
                  'rounded-lg border p-4',
                  t.status === 'erro'
                    ? 'border-rose-200 bg-rose-50/50 dark:border-rose-500/30 dark:bg-rose-500/5'
                    : t.status === 'recusada'
                      ? 'border-orange-200 bg-orange-50/50 dark:border-orange-500/30 dark:bg-orange-500/5'
                      : 'border-slate-200 dark:border-slate-800',
                )}
              >
                <Markdown texto={t.resultado} />
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700">
                {t.status === 'pendente'
                  ? 'Ainda não executada.'
                  : t.status === 'em_execucao'
                    ? 'Em execução — o relatório aparece aqui ao terminar.'
                    : 'Sem relatório gravado.'}
              </p>
            )}
          </Secao>
        </div>

        <aside className="min-w-0 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/40">
          <dl className="grid grid-cols-2 gap-x-3 gap-y-4 lg:grid-cols-1">
            <Meta rotulo="Pull request">
              {t.pr_url ? (
                <span className="flex items-center gap-1">
                  <a
                    href={t.pr_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex min-w-0 items-center gap-1 text-brand-600 hover:underline dark:text-brand-400"
                  >
                    <GitPullRequest className="size-3.5 shrink-0" aria-hidden />
                    <span className="truncate">{t.pr_url.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
                    <ExternalLink className="size-3 shrink-0" aria-hidden />
                  </a>
                  <CopyButton texto={t.pr_url} rotulo="Copiar link do PR" />
                </span>
              ) : (
                '—'
              )}
            </Meta>
            <Meta rotulo="Commit">
              {t.commit_sha ? (
                <span className="flex items-center gap-1">
                  <GitCommit className="size-3.5 shrink-0 text-slate-400" aria-hidden />
                  <code className="truncate text-xs" title={t.commit_sha}>
                    {t.commit_sha.slice(0, 12)}
                  </code>
                  <CopyButton texto={t.commit_sha} rotulo="Copiar SHA do commit" />
                </span>
              ) : (
                '—'
              )}
            </Meta>
            <Meta rotulo="Tentativas">
              <TentativasBar task={t} />
            </Meta>
            <Meta rotulo="Ordem">{t.ordem}</Meta>
            <Meta rotulo="Depende de">
              <Dependencias deps={deps} />
            </Meta>
            <Meta rotulo="Executar após">{t.executar_apos ? formatarDataHora(t.executar_apos) : 'assim que possível'}</Meta>
            <Meta rotulo="Criada">
              {formatarDataHora(t.created_at)} <span className="text-xs text-slate-500">via {t.origem}</span>
            </Meta>
            <Meta rotulo="Atualizada">{formatarDataHora(t.updated_at)}</Meta>
            {t.iniciado_em && <Meta rotulo="Iniciada">{formatarDataHora(t.iniciado_em)}</Meta>}
            {t.concluido_em && <Meta rotulo={STATUS_INFO[t.status].rotulo}>{formatarDataHora(t.concluido_em)}</Meta>}
            {t.arquivo_md && (
              <Meta rotulo="Arquivo de origem">
                <code className="break-all text-xs">{t.arquivo_md}</code>
              </Meta>
            )}
          </dl>
        </aside>
      </div>
    </Modal>
  );
}
