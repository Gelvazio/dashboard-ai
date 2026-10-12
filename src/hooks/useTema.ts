import { useCallback, useEffect, useState } from 'react';
import { proximoTema, temaEscuro, type Tema } from '@/lib/navegacao';

const CHAVE = 'dashboard-ai:tema';

function temaSalvo(): Tema {
  const v = localStorage.getItem(CHAVE);
  return v === 'claro' || v === 'escuro' || v === 'sistema' ? v : 'sistema';
}

/** Tema claro/escuro/sistema, salvo no navegador e aplicado como classe `dark` no <html>. */
export function useTema() {
  const [tema, setTema] = useState<Tema>(temaSalvo);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const aplicar = () => document.documentElement.classList.toggle('dark', temaEscuro(tema, mq.matches));
    aplicar();
    localStorage.setItem(CHAVE, tema);
    mq.addEventListener('change', aplicar);
    return () => mq.removeEventListener('change', aplicar);
  }, [tema]);

  const alternar = useCallback(() => setTema((t) => proximoTema(t)), []);
  return { tema, alternar };
}
