import { useCallback, useEffect, useRef, useState } from 'react';
import { assinarEventos, listarEventos } from '@/services/eventService';
import { mesclarEvento } from '@/lib/monitor';
import type { AgentEvent } from '@/types';

export type StatusConexaoEventos = 'conectando' | 'ao_vivo' | 'erro';

/**
 * Feed ao vivo dos eventos dos agentes do projeto (SUB-35.19): carrega
 * `listarEventos` ao montar/trocar de projeto, assina o Realtime
 * (`assinarEventos`) e mescla cada INSERT com `mesclarEvento`. Remove o canal no cleanup.
 */
export function useEventosAgentes(projectId: number | null | undefined, limite = 200) {
  const [eventos, setEventos] = useState<AgentEvent[]>([]);
  const [statusConexao, setStatusConexao] = useState<StatusConexaoEventos>('conectando');
  const [erro, setErro] = useState<string | null>(null);
  const geracao = useRef(0);

  const carregar = useCallback(async () => {
    if (projectId == null) return;
    const minha = ++geracao.current;
    try {
      const lista = await listarEventos(projectId, { limite });
      if (minha !== geracao.current) return;
      // Mantém eventos que chegaram pelo Realtime durante a carga.
      setEventos((atual) => atual.reduce((acc, ev) => mesclarEvento(acc, ev, limite), lista));
      setErro(null);
    } catch (e) {
      if (minha === geracao.current) setErro((e as Error).message);
    }
  }, [projectId, limite]);

  useEffect(() => {
    setEventos([]);
    setErro(null);
    if (projectId == null) return;
    setStatusConexao('conectando');
    const cancelar = assinarEventos(projectId, {
      onEvento: (ev) => setEventos((atual) => mesclarEvento(atual, ev, limite)),
      onStatus: (status, e) => {
        if (status === 'SUBSCRIBED') setStatusConexao('ao_vivo');
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setStatusConexao('erro');
          setErro(e?.message ?? 'Conexão em tempo real indisponível.');
        } else setStatusConexao('conectando');
      },
    });
    void carregar();
    return () => {
      geracao.current++;
      cancelar();
    };
  }, [projectId, limite, carregar]);

  return { eventos, statusConexao, erro, recarregar: carregar };
}
