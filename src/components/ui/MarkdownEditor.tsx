/**
 * Editor Markdown com pré-visualização (SUB-20.8).
 *
 * Componente com abas Escrever/Pré-visualizar, textarea com
 * contador de caracteres e pré-visualização segura (sem HTML cru).
 */

import { useState } from 'react';
import { Markdown } from '@/components/ui/Markdown';

interface MarkdownEditorProps {
  valor: string;
  onChange: (valor: string) => void;
  erro?: string;
  rotulo?: string;
}

export function MarkdownEditor({ valor, onChange, erro, rotulo }: MarkdownEditorProps) {
  const [aba, setAba] = useState<'escrever' | 'previsualizar'>('escrever');

  return (
    <div className="flex flex-col gap-2">
      {rotulo && (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {rotulo}
        </label>
      )}

      {/* Abas */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => setAba('escrever')}
          className={`border-b-2 px-3 py-1.5 text-sm font-medium transition-colors ${
            aba === 'escrever'
              ? 'border-slate-600 text-slate-900 dark:border-slate-400 dark:text-slate-100'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          Escrever
        </button>
        <button
          type="button"
          onClick={() => setAba('previsualizar')}
          className={`border-b-2 px-3 py-1.5 text-sm font-medium transition-colors ${
            aba === 'previsualizar'
              ? 'border-slate-600 text-slate-900 dark:border-slate-400 dark:text-slate-100'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          Pré-visualizar
        </button>
      </div>

      {/* Conteúdo */}
      {aba === 'escrever' ? (
        <div className="relative">
          <textarea
            value={valor}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[200px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-500/20"
            placeholder="Escreva em Markdown..."
            aria-invalid={!!erro}
          />
          {/* Contador de caracteres */}
          <div className="absolute bottom-2 right-2 rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {valor.length} caracteres
          </div>
        </div>
      ) : (
        <div className="min-h-[200px] rounded-md border border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
          {valor.trim() ? (
            <Markdown texto={valor} />
          ) : (
            <p className="text-sm text-slate-400 dark:text-slate-500 italic">
              A pré-visualização aparecerá aqui...
            </p>
          )}
        </div>
      )}

      {/* Erro de validação */}
      {erro && (
        <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
          {erro}
        </p>
      )}
    </div>
  );
}
