import { useEffect, useState } from 'react';
import { getSupabase, supabaseConfigurado, verificarConexao, type EstadoConexao } from '@/services/supabase';

/**
 * Estado da conexão com o Supabase, verificado ao abrir, a cada `intervaloMs` e logo
 * após login/logout (`auth.onAuthStateChange`).
 */
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
    const assinatura = supabaseConfigurado
      ? getSupabase().auth.onAuthStateChange(() => {
          void checar();
        }).data.subscription
      : undefined;
    return () => {
      ativo = false;
      window.clearInterval(id);
      assinatura?.unsubscribe();
    };
  }, [intervaloMs]);

  return { estado, detalhe };
}
