import { useCallback, useEffect, useState } from 'react';
import { hashDaView, viewDoHash } from '@/lib/navegacao';
import type { ViewId } from '@/types';

/** Tela atual sincronizada com o hash da URL (navegação sem recarregar a página). */
export function useNavegacao() {
  const [view, setView] = useState<ViewId>(() => viewDoHash(window.location.hash));

  useEffect(() => {
    const aoMudar = () => setView(viewDoHash(window.location.hash));
    window.addEventListener('hashchange', aoMudar);
    return () => window.removeEventListener('hashchange', aoMudar);
  }, []);

  const navegar = useCallback((destino: ViewId) => {
    if (window.location.hash !== hashDaView(destino)) window.location.hash = hashDaView(destino);
    setView(destino);
  }, []);

  return { view, navegar };
}
