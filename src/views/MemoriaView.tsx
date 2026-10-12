import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Brain } from 'lucide-react';
import { EmConstrucao } from '@/components/EmConstrucao';
import { MemoriaGrid } from '@/components/memoria/MemoriaGrid';
import { MemoriaToolbar } from '@/components/memoria/MemoriaToolbar';
import { useMemorias } from '@/hooks/useMemorias';
import { useProjetoAtual } from '@/hooks/useProjetoAtual';
import { filtrarMemoriasLocal, tagsDisponiveis, type FiltroMemoriasLocal } from '@/lib/memorias';

/**
 * Cérebro de memória do projeto (SUB-21.9): toolbar com filtros locais e grade
 * de memórias (projeto + globais).
 *
 * Pontos de extensão: a busca semântica entra na área do topo (SUB-19.8), o
 * botão "Nova memória" no cabeçalho da grade (SUB-20.7) e o detalhe/exclusão
 * nos callbacks da grade (SUB-21.11).
 */
export function MemoriaView() {
  const { projeto } = useProjetoAtual();
  const { memorias, carregando, erro, temMais, carregarMais, recarregar } = useMemorias(projeto?.id);
  const [filtro, setFiltro] = useState<FiltroMemoriasLocal>({});
  const [atualizadoEm, setAtualizadoEm] = useState<Date | null>(null);

  useEffect(() => {
    if (!carregando) setAtualizadoEm(new Date());
  }, [carregando]);

  // Ao trocar de projeto, os filtros (ex.: tag) do projeto anterior deixam de fazer sentido.
  useEffect(() => setFiltro({}), [projeto?.id]);

  const filtradas = useMemo(() => filtrarMemoriasLocal(memorias, filtro), [memorias, filtro]);
  const tags = useMemo(() => tagsDisponiveis(memorias), [memorias]);
  const filtroAtivo = Boolean(filtro.busca?.trim() || filtro.tag || (filtro.escopo && filtro.escopo !== 'todas'));

  if (!projeto) return <EmConstrucao titulo="Cérebro de Memória" tarefa="selecione um projeto" />;

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Área reservada para a busca semântica (SUB-19.8). */}

      <section className="card overflow-hidden">
        <header className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h2 className="mr-auto flex items-center gap-2 font-semibold">
            <Brain className="size-4 text-brand-500" aria-hidden />
            Memórias
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {memorias.length}
            </span>
          </h2>
          {/* Espaço para o botão "Nova memória" (SUB-20.7). */}
        </header>
        <MemoriaToolbar
          filtro={filtro}
          onFiltro={setFiltro}
          tags={tags}
          filtradas={filtradas.length}
          total={memorias.length}
          carregando={carregando}
          onRecarregar={() => void recarregar()}
          atualizadoEm={atualizadoEm}
        />
        {erro && (
          <p role="alert" className="flex items-center gap-2 bg-rose-50 px-4 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
            <AlertCircle className="size-4" aria-hidden />
            {erro}
          </p>
        )}
        <div className="p-4">
          <MemoriaGrid
            memorias={filtradas}
            carregando={carregando}
            filtroAtivo={filtroAtivo}
            temMais={temMais}
            carregandoMais={carregando && memorias.length > 0}
            onCarregarMais={() => void carregarMais()}
          />
        </div>
      </section>
    </div>
  );
}
