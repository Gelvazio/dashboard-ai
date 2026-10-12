/**
 * Campo de tags com chips removíveis (SUB-20.4).
 *
 * Enter ou vírgula confirmam o texto digitado (convertido com `parseTags`,
 * então "a, b #c" vira três tags); Backspace com o campo vazio remove a última
 * tag; colar texto com separadores também adiciona as tags. Ao perder o foco,
 * o texto pendente é confirmado. As sugestões ficam no `TagSugestoes` (SUB-20.9).
 */
import { useId, useState, type ClipboardEvent, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { parseTags } from '@/lib/memoriaForm';
import { cn } from '@/lib/utils';

interface TagInputProps {
  valor: string[];
  onChange: (tags: string[]) => void;
  erro?: string;
  rotulo?: string;
  placeholder?: string;
  desabilitado?: boolean;
}

export function TagInput({ valor, onChange, erro, rotulo, placeholder = 'Digite e tecle Enter ou vírgula', desabilitado }: TagInputProps) {
  const [texto, setTexto] = useState('');
  const id = useId();
  const idErro = `${id}-erro`;

  const adicionar = (entrada: string) => {
    const novas = parseTags(entrada).filter((t) => !valor.includes(t));
    if (novas.length) onChange([...valor, ...novas]);
    setTexto('');
  };

  const remover = (tag: string) => onChange(valor.filter((t) => t !== tag));

  const aoTeclar = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (texto.trim()) adicionar(texto);
    } else if (e.key === 'Backspace' && texto === '' && valor.length) {
      e.preventDefault();
      onChange(valor.slice(0, -1));
    }
  };

  const aoColar = (e: ClipboardEvent<HTMLInputElement>) => {
    const colado = e.clipboardData.getData('text');
    if (/[,#\s]/.test(colado.trim())) {
      e.preventDefault();
      adicionar(texto + colado);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {rotulo && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {rotulo}
        </label>
      )}
      <div
        className={cn(
          'flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border bg-white px-2 py-1.5 focus-within:ring-2 dark:bg-slate-900',
          erro
            ? 'border-red-400 focus-within:ring-red-300 dark:border-red-500'
            : 'border-slate-300 focus-within:ring-slate-300 dark:border-slate-600 dark:focus-within:ring-slate-500',
          desabilitado && 'cursor-not-allowed opacity-60',
        )}
      >
        {valor.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 py-0.5 pl-2.5 pr-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            #{tag}
            <button
              type="button"
              onClick={() => remover(tag)}
              disabled={desabilitado}
              aria-label={`Remover tag ${tag}`}
              className="rounded-full p-0.5 text-slate-500 hover:bg-slate-200 hover:text-slate-800 disabled:cursor-not-allowed dark:hover:bg-slate-700 dark:hover:text-slate-100"
            >
              <X className="size-3" aria-hidden />
            </button>
          </span>
        ))}
        <input
          id={id}
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={aoTeclar}
          onPaste={aoColar}
          onBlur={() => texto.trim() && adicionar(texto)}
          disabled={desabilitado}
          placeholder={valor.length ? '' : placeholder}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? idErro : undefined}
          className="min-w-24 flex-1 bg-transparent px-1 py-0.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-slate-100"
        />
      </div>
      {erro && (
        <p id={idErro} role="alert" className="text-xs text-red-600 dark:text-red-400">
          {erro}
        </p>
      )}
    </div>
  );
}
