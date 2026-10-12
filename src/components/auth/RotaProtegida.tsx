import { useEffect, useRef, type ReactNode } from 'react';
import { CarregandoTela } from '@/components/ui/CarregandoTela';
import { useAuth } from '@/hooks/useAuth';
import { LoginView } from '@/views/LoginView';

export interface RotaProtegidaProps {
  children: ReactNode;
}

/** Hash de rota do app (ex.: `#/logs`); ignora fragmentos do Supabase como `#access_token=...`. */
function hashDeRota(hash: string): string | null {
  return hash.startsWith('#/') ? hash : null;
}

/**
 * Guarda de autenticação (SUB-27.12): enquanto a sessão carrega mostra um
 * fallback leve; sem sessão mostra a `LoginView`; com sessão renderiza `children`.
 *
 * A tela pedida (ex.: `#/logs`) é preservada: a `LoginView` não altera o hash e,
 * se o retorno do login trocar o fragmento (link mágico/redefinição de senha), o
 * hash original é restaurado assim que a sessão chega.
 */
export function RotaProtegida({ children }: RotaProtegidaProps) {
  const { sessao, carregando } = useAuth();
  const destino = useRef<string | null>(typeof window === 'undefined' ? null : hashDeRota(window.location.hash));

  // Sem sessão: lembra a última rota do app pedida (o usuário pode navegar pelo hash antes de entrar).
  useEffect(() => {
    if (sessao) return;
    const lembrar = () => {
      const h = hashDeRota(window.location.hash);
      if (h) destino.current = h;
    };
    lembrar();
    window.addEventListener('hashchange', lembrar);
    return () => window.removeEventListener('hashchange', lembrar);
  }, [sessao]);

  // Sessão chegou: volta para a rota pedida se o hash foi trocado no caminho.
  useEffect(() => {
    const alvo = destino.current;
    if (!sessao || !alvo || window.location.hash === alvo) return;
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${alvo}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }, [sessao]);

  if (carregando) return <CarregandoTela mensagem="Verificando sessão..." />;
  if (!sessao) return <LoginView />;
  return <>{children}</>;
}
