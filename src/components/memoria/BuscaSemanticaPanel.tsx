import { useState } from 'react';
import { AlertTriangle, Loader2, Search, SearchX } from 'lucide-react';
import { useBuscaSemantica } from '@/hooks/useBuscaSemantica';
import { BuscaControles } from './BuscaControles';
import { ResultadoBuscaCard } from './ResultadoBuscaCard';

export interface BuscaSemanticaPanelProps {
  /** Projeto selecionado; sem projeto a busca fica desativada. */
  projeto: { id: number; slug: string } | null;
  /** Abre a memória clicada (ex.: modal de detalhe). */
  onAbrir?: (id: string) => void;
}

/**
 * Painel de busca semântica de memórias (SUB-19.7). Só compõe: campo de busca,
 * `BuscaControles` (SUB-19.9), grade de `ResultadoBuscaCard` (SUB-19.5) e os
 * estados carregando/vazio/erro, com os dados de `useBuscaSemantica` (SUB-19.6).
 */
export function BuscaSemanticaPanel({ projeto, onAbrir }: BuscaSemanticaPanelProps) {
  const [consulta, setConsulta] = useState('');
  const [limiar, setLimiar] = useState(0.7);
  const [incluirGlobais, setIncluirGlobais] = useState(true);
  const { resultado, carregando, erro } = useBuscaSemantica(projeto, consulta, { limiar, incluirGlobais });
  const temConsulta = consulta.trim().length > 0;

  return (
    <section aria-label="Busca semântica de memórias" className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <label className="relative block">
          <span className="sr-only">Buscar memórias</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            disabled={!projeto}
            placeholder={projeto ? 'Descreva o que procura (ex.: como configurar o RLS)…' : 'Selecione um projeto para buscar'}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-10 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          {carregando && (
            <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-indigo-500" aria-label="Buscando" />
          )}
        </label>
        <BuscaControles
          limiar={limiar}
          onLimiar={setLimiar}
          incluirGlobais={incluirGlobais}
          onIncluirGlobais={setIncluirGlobais}
          modo={resultado?.modo}
        />
      </div>

      <div aria-live="polite">
        {erro ? (
          <p role="alert" className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {erro}
          </p>
        ) : carregando && !resultado ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : !temConsulta ? (
          <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Digite uma pergunta ou assunto para encontrar memórias parecidas.
          </p>
        ) : resultado && resultado.resultados.length === 0 ? (
          <p className="flex flex-col items-center gap-2 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            <SearchX className="size-6" aria-hidden="true" />
            Nenhuma memória encontrada. Tente outras palavras ou baixe o limiar.
          </p>
        ) : resultado ? (
          <ul className={`grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 ${carregando ? 'opacity-60' : ''}`}>
            {resultado.resultados.map((m) => (
              <li key={m.id} className="flex min-w-0">
                <ResultadoBuscaCard
                  titulo={m.title}
                  conteudo={m.content}
                  tags={m.tags}
                  similaridade={'similarity' in m ? m.similarity : undefined}
                  global={m.project_id === null}
                  atualizadoEm={m.updated_at}
                  onClick={onAbrir ? () => onAbrir(m.id) : undefined}
                  className="min-w-0"
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
