import { useState, type ReactNode } from 'react';
import { FolderKanban, Globe, Tag, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { escopoMemoria, memoriaComoMarkdown } from '@/lib/memorias';
import { formatarDataHora, tempoRelativo } from '@/lib/tasks';
import type { Memoria } from '@/services/memoryService';
import { Modal } from '@/components/ui/Modal';
import { Markdown } from '@/components/ui/Markdown';
import { CopyButton } from '@/components/ui/CopyButton';
import { Botao } from '@/components/ui/Botao';

export interface MemoriaDetailModalProps {
  /** Memória exibida; `null` mantém o modal fechado. */
  memoria: Memoria | null;
  onFechar: () => void;
  onExcluir?: (m: Memoria) => void;
}

type Modo = 'formatado' | 'texto';

function Meta({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{rotulo}</dt>
      <dd className="mt-0.5 text-sm text-slate-800 dark:text-slate-200">{children}</dd>
    </div>
  );
}

function Abas({ valor, onMudar }: { valor: Modo; onMudar: (v: Modo) => void }) {
  return (
    <div className="inline-flex rounded-md bg-slate-100 p-0.5 text-xs dark:bg-slate-800" role="tablist" aria-label="Modo de exibição do conteúdo">
      {(['formatado', 'texto'] as const).map((v) => (
        <button
          key={v}
          type="button"
          role="tab"
          aria-selected={valor === v}
          onClick={() => onMudar(v)}
          className={cn('rounded px-2 py-0.5 capitalize', valor === v ? 'bg-white font-medium shadow-sm dark:bg-slate-700' : 'text-slate-500')}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

function DataHora({ iso }: { iso: string }) {
  return (
    <time dateTime={iso} title={tempoRelativo(iso)}>
      {formatarDataHora(iso)}
    </time>
  );
}

/** Visualização completa de uma memória: conteúdo (Formatado/Texto), tags, escopo, datas e autor (SUB-21.6). */
export function MemoriaDetailModal({ memoria, onFechar, onExcluir }: MemoriaDetailModalProps) {
  const [modo, setModo] = useState<Modo>('formatado');
  if (!memoria) return null;
  const m = memoria;
  const global = escopoMemoria(m) === 'global';

  return (
    <Modal
      aberto
      titulo={m.title}
      descricao={global ? 'Memória global (visível em todos os projetos)' : 'Memória do projeto'}
      onFechar={onFechar}
      tamanho="xl"
      rodape={
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <CopyButton texto={memoriaComoMarkdown(m)} rotulo="Copiar tudo em Markdown" comTexto />
          <div className="flex gap-2">
            {onExcluir && (
              <Botao variante="perigo" onClick={() => onExcluir(m)}>
                <Trash2 className="size-4" aria-hidden="true" />
                Excluir
              </Botao>
            )}
            <Botao onClick={onFechar}>Fechar</Botao>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Meta rotulo="Escopo">
            <span className="inline-flex items-center gap-1">
              {global ? <Globe className="size-3.5 text-sky-600" aria-hidden="true" /> : <FolderKanban className="size-3.5 text-indigo-600" aria-hidden="true" />}
              {global ? 'Global' : 'Projeto'}
            </span>
          </Meta>
          <Meta rotulo="Autor">{m.criado_por || '—'}</Meta>
          <Meta rotulo="Criada em">
            <DataHora iso={m.created_at} />
          </Meta>
          <Meta rotulo="Atualizada em">
            <DataHora iso={m.updated_at} />
          </Meta>
        </dl>

        <div>
          <h3 className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Tags</h3>
          {m.tags.length ? (
            <div className="flex flex-wrap gap-1.5">
              {m.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Tag className="size-3" aria-hidden="true" />
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Sem tags.</p>
          )}
        </div>

        <section>
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Conteúdo</h3>
            <div className="flex items-center gap-1">
              <Abas valor={modo} onMudar={setModo} />
              <CopyButton texto={m.content} rotulo="Copiar conteúdo" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            {modo === 'formatado' ? (
              <Markdown texto={m.content} />
            ) : (
              <pre className="whitespace-pre-wrap break-words font-mono text-xs text-slate-800 dark:text-slate-200">{m.content}</pre>
            )}
          </div>
        </section>
      </div>
    </Modal>
  );
}
