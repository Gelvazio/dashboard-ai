/**
 * Controles de busca semântica (SUB-19.9).
 *
 * Componente controlado com:
 * - Controle de limiar (0.5–0.95) exibido em %
 * - Checkbox para incluir memórias globais
 * - Selo do modo da última busca (semântica ou texto)
 */

interface BuscaControlesProps {
  limiar: number;
  onLimiar: (valor: number) => void;
  incluirGlobais: boolean;
  onIncluirGlobais: (valor: boolean) => void;
  modo?: 'semantica' | 'texto';
}

export function BuscaControles({
  limiar,
  onLimiar,
  incluirGlobais,
  onIncluirGlobais,
  modo,
}: BuscaControlesProps) {
  const limiarPercentual = Math.round(limiar * 100);

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      {/* Controle de limiar */}
      <div className="flex items-center gap-2">
        <label htmlFor="limiar" className="text-slate-700 dark:text-slate-300">
          Limiar:
        </label>
        <input
          id="limiar"
          type="range"
          min="50"
          max="95"
          step="5"
          value={limiarPercentual}
          onChange={(e) => onLimiar(Number(e.target.value) / 100)}
          className="h-2 w-24 cursor-pointer accent-slate-600 dark:accent-slate-400"
          aria-label="Limiar de similaridade"
        />
        <span className="min-w-[3rem] text-right font-mono text-slate-700 dark:text-slate-300">
          {limiarPercentual}%
        </span>
      </div>

      {/* Checkbox incluir globais */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={incluirGlobais}
          onChange={(e) => onIncluirGlobais(e.target.checked)}
          className="h-4 w-4 cursor-pointer accent-slate-600 dark:accent-slate-400"
          aria-label="Incluir memórias globais"
        />
        <span className="text-slate-700 dark:text-slate-300">Globais</span>
      </label>

      {/* Selo do modo */}
      {modo && (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          {modo === 'semantica' ? 'Semântica' : 'Texto'}
        </span>
      )}
    </div>
  );
}
