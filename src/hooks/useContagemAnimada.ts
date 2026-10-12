import { useEffect, useRef, useState } from 'react';

/** Anima um número do valor anterior até o novo (ease-out). Respeita "reduzir movimento". */
export function useContagemAnimada(alvo: number, duracaoMs = 600): number {
  const [valor, setValor] = useState(alvo);
  const anterior = useRef(0);

  useEffect(() => {
    const inicio = anterior.current;
    anterior.current = alvo;
    const reduzir = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduzir || inicio === alvo) {
      setValor(alvo);
      return;
    }
    let quadro = 0;
    const t0 = performance.now();
    const passo = (agora: number) => {
      const p = Math.min(1, (agora - t0) / duracaoMs);
      setValor(Math.round(inicio + (alvo - inicio) * (1 - (1 - p) ** 3)));
      if (p < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [alvo, duracaoMs]);

  return valor;
}
