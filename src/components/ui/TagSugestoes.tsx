/**
 * Componente de sugestões de tags (SUB-20.9).
 *
 * Botões-pílula clicáveis para escolher tags, ocultando as já
 * selecionadas. Nada renderizado se a lista ficar vazia.
 */

interface TagSugestoesProps {
  sugestoes: string[];
  selecionadas: string[];
  onEscolher: (tag: string) => void;
}

export function TagSugestoes({ sugestoes, selecionadas, onEscolher }: TagSugestoesProps) {
  // Filtra sugestões que não estão selecionadas
  const disponiveis = sugestoes.filter((tag) => !selecionadas.includes(tag));

  // Não renderiza nada se não houver sugestões disponíveis
  if (disponiveis.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {disponiveis.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onEscolher(tag)}
          className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:focus:ring-slate-500/20"
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
