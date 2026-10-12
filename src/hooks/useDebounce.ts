import { useEffect, useState } from 'react';

/**
 * Devolve `valor` só depois de `ms` milissegundos sem mudanças (SUB-19.2).
 * Útil para adiar buscas enquanto o usuário digita. Cada nova mudança
 * reinicia o prazo; o timer pendente é limpo ao mudar ou desmontar.
 */
export function useDebounce<T>(valor: T, ms = 400): T {
  const [atrasado, setAtrasado] = useState<T>(valor);

  useEffect(() => {
    const id = setTimeout(() => setAtrasado(valor), ms);
    return () => clearTimeout(id);
  }, [valor, ms]);

  return atrasado;
}
