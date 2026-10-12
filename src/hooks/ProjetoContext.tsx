/**
 * Projeto selecionado (contexto global). Todas as telas e serviços leem o projeto
 * daqui; a escolha fica salva no navegador por slug.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { listarProjetos } from '@/services/projectService';
import { supabaseConfigurado } from '@/services/supabase';
import type { Project } from '@/types';

const CHAVE = 'dashboard-ai:projeto';

export interface ProjetoContextValue {
  projetos: Project[];
  projeto: Project | null;
  selecionar: (slug: string) => void;
  carregando: boolean;
  erro: string | null;
  recarregar: () => Promise<void>;
}

export const ProjetoContext = createContext<ProjetoContextValue | null>(null);

export function ProjetoProvider({ children }: { children: ReactNode }) {
  const [projetos, setProjetos] = useState<Project[]>([]);
  const [slug, setSlug] = useState<string | null>(() => localStorage.getItem(CHAVE));
  const [carregando, setCarregando] = useState(supabaseConfigurado);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    if (!supabaseConfigurado) return;
    setCarregando(true);
    try {
      setProjetos(await listarProjetos());
      setErro(null);
    } catch (e) {
      setErro((e as Error).message);
      setProjetos([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  // Sessão do Supabase Auth (equivalente a `useAuth`, mas tolerante fora do AuthProvider:
  // sem provider, `logado` fica indefinido e o comportamento anterior é mantido).
  const auth = useContext(AuthContext);
  const logado = auth && !auth.carregando ? Boolean(auth.sessao) : undefined;

  useEffect(() => {
    if (logado === false) {
      // Sem sessão: esquece a lista e o erro (a RLS bloquearia), mas mantém o slug salvo.
      setProjetos([]);
      setErro(null);
      setCarregando(false);
      return;
    }
    void recarregar();
  }, [recarregar, logado]);

  const projeto = useMemo(
    () => projetos.find((p) => p.slug === slug) ?? projetos[0] ?? null,
    [projetos, slug],
  );

  const selecionar = useCallback((novo: string) => {
    localStorage.setItem(CHAVE, novo);
    setSlug(novo);
  }, []);

  const valor = useMemo(
    () => ({ projetos, projeto, selecionar, carregando, erro, recarregar }),
    [projetos, projeto, selecionar, carregando, erro, recarregar],
  );
  return <ProjetoContext.Provider value={valor}>{children}</ProjetoContext.Provider>;
}
