import { Construction } from 'lucide-react';
import { useProjetoAtual } from '@/hooks/useProjetoAtual';
import { supabaseConfigurado } from '@/services/supabase';

/** Placeholder das telas ainda não implementadas (mostra o projeto selecionado). */
export function EmConstrucao({ titulo, tarefa }: { titulo: string; tarefa: string }) {
  const { projeto } = useProjetoAtual();
  return (
    <section className="card animate-fade-in p-8 text-center">
      <Construction className="mx-auto size-8 text-brand-500" aria-hidden />
      <h2 className="mt-3 text-xl font-semibold">{titulo}</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {projeto ? (
          <>
            Projeto: <strong>{projeto.nome}</strong> <code className="text-xs">({projeto.slug})</code>
          </>
        ) : supabaseConfigurado ? (
          'Nenhum projeto selecionado.'
        ) : (
          <>
            Configure <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> para carregar os projetos.
          </>
        )}
      </p>
      <p className="mt-1 text-xs text-slate-500">Conteúdo desta tela: {tarefa}.</p>
    </section>
  );
}
