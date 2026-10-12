import { FolderGit2 } from 'lucide-react';
import { useProjetoAtual } from '@/hooks/useProjetoAtual';
import { supabaseConfigurado } from '@/services/supabase';

/** Seletor do projeto ativo (todos os dados das telas são filtrados por ele). */
export function ProjectSelector() {
  const { projetos, projeto, selecionar, carregando, erro } = useProjetoAtual();
  const desabilitado = !supabaseConfigurado || carregando || projetos.length === 0;
  const rotulo = !supabaseConfigurado
    ? 'Supabase não configurado'
    : carregando
      ? 'Carregando projetos…'
      : erro
        ? 'Erro ao carregar projetos'
        : 'Nenhum projeto disponível';

  return (
    <label className="flex min-w-0 items-center gap-2 text-sm">
      <FolderGit2 className="size-4 shrink-0 text-slate-500" aria-hidden />
      <span className="sr-only">Projeto</span>
      <select
        className="min-w-0 max-w-56 truncate rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900"
        value={projeto?.slug ?? ''}
        onChange={(e) => selecionar(e.target.value)}
        disabled={desabilitado}
        title={erro ?? undefined}
      >
        {projetos.length === 0 ? (
          <option value="">{rotulo}</option>
        ) : (
          projetos.map((p) => (
            <option key={p.id} value={p.slug}>
              {p.nome}
            </option>
          ))
        )}
      </select>
    </label>
  );
}
