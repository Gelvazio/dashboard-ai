import { useEffect, useState } from 'react';
import { verificarConexao, type EstadoConexao } from '@/services/supabase';

/** Estado da conexão com o Supabase, verificado ao abrir e a cada `intervaloMs`. */
export function useConexao(intervaloMs = 60_000) {
  const [estado, setEstado] = useState<EstadoConexao | 'verificando'>('verificando');
  const [detalhe, setDetalhe] = useState<string>();

  useEffect(() => {
    let ativo = true;
    const checar = async () => {
      const r = await verificarConexao();
      if (ativo) {
        setEstado(r.estado);
        setDetalhe(r.detalhe);
      }
    };
    void checar();
    const id = window.setInterval(checar, intervaloMs);
    return () => {
      ativo = false;
      window.clearInterval(id);
    };
  }, [intervaloMs]);

  return { estado, detalhe };
}
