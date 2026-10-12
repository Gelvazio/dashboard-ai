import { Brain, SearchX } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Memoria } from '@/services/memoryService';
import { Botao } from '@/components/ui/Botao';
import { MemoriaCard } from './MemoriaCard';

export interface MemoriaGridProps {
  memorias: Memoria[];
  /** Primeira carga: mostra esqueletos no lugar da grade. */
  carregando?: boolean;
  /** Há filtro/busca ativo (muda o texto do estado vazio). */
  filtroAtivo?: boolean;
  /** Há mais páginas no servidor: mostra "Carregar mais". */
  temMais?: boolean;
  /** Carregando a próxima página (botão em estado ocupado). */
  carregandoMais?: boolean;
  onCarregarMais?: () => void;
  onVer?: (m: Memoria) => void;
  onExcluir?: (m: Memoria) => void;
  className?: string;
}

const GRADE = 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3';

function CardEsqueleto() {
  return (
    <div className="flex animate-pulse flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" aria-hidden="true">
      <div className="flex items-center justify-between gap-2">
        <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-14 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

/** Grade responsiva (1/2/3 colunas) de `MemoriaCard` com carregamento, vazio e paginação (SUB-21.5). */
export function MemoriaGrid({
  memorias,
  carregando,
  filtroAtivo,
  temMais,
  carregandoMais,
  onCarregarMais,
  onVer,
  onExcluir,
  className,
}: MemoriaGridProps) {
  if (carregando && memorias.length === 0) {
    return (
      <div className={cn(GRADE, className)} role="status" aria-label="Carregando memórias">
        {Array.from({ length: 6 }, (_, i) => (
          <CardEsqueleto key={i} />
        ))}
      </div>
    );
  }

  if (memorias.length === 0) {
    const Icone = filtroAtivo ? SearchX : Brain;
    return (
      <div
        className={cn(
          'flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700',
          className,
        )}
      >
        <Icone className="size-8 text-slate-400" aria-hidden="true" />
        <p className="font-medium text-slate-700 dark:text-slate-200">
          {filtroAtivo ? 'Nenhuma memória corresponde aos filtros.' : 'Nenhuma memória cadastrada ainda.'}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {filtroAtivo
            ? 'Ajuste a busca, a tag ou o escopo para ver mais resultados.'
            : 'As memórias salvas pelos agentes (brain_store) ou pelo formulário aparecem aqui.'}
        </p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className={GRADE}>
        {memorias.map((m) => (
          <MemoriaCard
            key={m.id}
            memoria={m}
            onVer={onVer ? () => onVer(m) : undefined}
            onExcluir={onExcluir ? () => onExcluir(m) : undefined}
          />
        ))}
      </div>
      {temMais && onCarregarMais && (
        <div className="flex justify-center">
          <Botao onClick={onCarregarMais} carregando={carregandoMais} disabled={carregandoMais}>
            Carregar mais
          </Botao>
        </div>
      )}
    </div>
  );
}
