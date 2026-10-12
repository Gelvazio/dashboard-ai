import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from './AuthContext';

/** Sessão atual do Supabase Auth. Precisa estar dentro do `AuthProvider`. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa ser usado dentro do AuthProvider.');
  return ctx;
}
