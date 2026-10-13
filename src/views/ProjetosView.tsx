import { useCallback, useEffect, useState } from 'react';
import { ProjetosLista, ProjetoForm } from '@/components/projetos';
import { Botao } from '@/components/ui/Botao';
import { useAuth } from '@/hooks/useAuth';
import { useProjetoAtual } from '@/hooks/useProjetoAtual';
import { listarProjetosParaGerenciamento } from '@/services/projectService';
import { getSupabase } from '@/services/supabase';
import type { Project } from '@/types';

/** Tela para administrar projetos visíveis ao usuário autenticado. */
export function ProjetosView() {
  const { usuario, papelGlobal } = useAuth();
  const { recarregar: recarregarSeletor } = useProjetoAtual();
  const [projetos, setProjetos] = useState<Project[]>([]);
  const [projetosEditaveis, setProjetosEditaveis] = useState<Set<number>>(() => new Set());
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [formAberto, setFormAberto] = useState(false);
  const [projetoEditando, setProjetoEditando] = useState<Project | undefined>();

  /** Carrega projetos via RLS e identifica os que o usuário pode editar. */
  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const client = getSupabase();
      setProjetos(await listarProjetosParaGerenciamento(client));
      if (!usuario || papelGlobal === 'admin') {
        setProjetosEditaveis(new Set());
      } else {
        const { data, error: erroMembros } = await client
          .from('project_members')
          .select('project_id')
          .eq('user_id', usuario.id)
          .eq('role', 'owner');
        if (erroMembros) throw new Error(erroMembros.message);
        setProjetosEditaveis(new Set((data ?? []).map((membro) => membro.project_id)));
      }
      setErro(null);
    } catch (falha) {
      setProjetos([]);
      setErro((falha as Error).message);
    } finally {
      setCarregando(false);
    }
  }, [papelGlobal, usuario]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  /** Fecha o formulário e atualiza tanto a lista quanto o seletor global. */
  function aposSalvar() {
    setFormAberto(false);
    setProjetoEditando(undefined);
    void Promise.all([carregar(), recarregarSeletor()]);
  }

  const podeGerenciar = useCallback(
    (projeto: Project) => papelGlobal === 'admin' || projetosEditaveis.has(projeto.id),
    [papelGlobal, projetosEditaveis],
  );

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Projetos</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Projetos disponíveis para sua conta.
          </p>
        </div>
        {papelGlobal === 'admin' && !formAberto && (
          <Botao variante="primario" onClick={() => setFormAberto(true)}>
            Novo projeto
          </Botao>
        )}
      </header>

      {formAberto && (
        <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-medium text-slate-900 dark:text-slate-100">
            {projetoEditando ? 'Editar projeto' : 'Novo projeto'}
          </h2>
          <ProjetoForm
            projeto={projetoEditando}
            onSalvou={aposSalvar}
            onCancelar={() => {
              setFormAberto(false);
              setProjetoEditando(undefined);
            }}
          />
        </section>
      )}

      {carregando && <p role="status" className="text-sm text-slate-500">Carregando projetos…</p>}
      {erro && (
        <div
          role="alert"
          className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
        >
          <p>{erro}</p>
          <Botao className="mt-3" onClick={() => void carregar()}>
            Tentar novamente
          </Botao>
        </div>
      )}
      {!carregando && !erro && (
        <ProjetosLista
          projetos={projetos}
          podeGerenciar={podeGerenciar}
          onEditar={(projeto) => {
            setProjetoEditando(projeto);
            setFormAberto(true);
          }}
          onMudou={() => void Promise.all([carregar(), recarregarSeletor()])}
        />
      )}
    </section>
  );
}
