/**
 * Sessão do Supabase Auth (contexto global): sessão, usuário, papel global e `sair`.
 * O hook `useAuth` fica em `src/hooks/useAuth.ts` (SUB-27.26).
 */
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { obterPapelGlobal, obterSessao, sair as sairDoAuth } from '@/services/authService';
import { getSupabase, supabaseConfigurado } from '@/services/supabase';
import type { UserRole } from '@/types/database';

export interface AuthContextValue {
  sessao: Session | null;
  usuario: User | null;
  papelGlobal: UserRole | null;
  carregando: boolean;
  sair: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Session | null>(null);
  const [papelGlobal, setPapelGlobal] = useState<UserRole | null>(null);
  const [carregando, setCarregando] = useState(supabaseConfigurado);

  useEffect(() => {
    if (!supabaseConfigurado) return;
    let ativo = true;
    obterSessao()
      .then((s) => ativo && setSessao(s))
      .catch(() => ativo && setSessao(null))
      .finally(() => ativo && setCarregando(false));
    const { data } = getSupabase().auth.onAuthStateChange((_evento, nova) => {
      if (ativo) setSessao(nova);
    });
    return () => {
      ativo = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const userId = sessao?.user.id ?? null;
  useEffect(() => {
    if (!userId) {
      setPapelGlobal(null);
      return;
    }
    let ativo = true;
    obterPapelGlobal(userId)
      .then((p) => ativo && setPapelGlobal(p))
      .catch(() => ativo && setPapelGlobal(null));
    return () => {
      ativo = false;
    };
  }, [userId]);

  const sair = useCallback(async () => {
    await sairDoAuth();
    setSessao(null);
  }, []);

  const valor = useMemo<AuthContextValue>(
    () => ({ sessao, usuario: sessao?.user ?? null, papelGlobal, carregando, sair }),
    [sessao, papelGlobal, carregando, sair],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
