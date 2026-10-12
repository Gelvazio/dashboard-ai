import { useCallback, useEffect, useRef, useState } from 'react';
import { contarLogsPorStatus, listarLogs, type ContadoresLogs, type FiltroLogs } from '@/services/logService';
import type { AgendamentoLog } from '@/types';

/** Histórico do agendador do projeto, com "carregar mais" e contadores por status. */
export function useLogs(projectId: number | null | undefined, filtro: Omit<FiltroLogs, 'pagina' | 'porPagina'>, porPagina = 30) {
  const [logs, setLogs] = useState<AgendamentoLog[]>([]);
  const [total, setTotal] = useState(0);
  const [contadores, setContadores] = useState<ContadoresLogs | null>(null);
  const [pagina, setPagina] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const geracao = useRef(0);
  const chave = JSON.stringify(filtro);

  const carregar = useCallback(async (pag: number) => {
    if (projectId == null) return;
    const minha = ++geracao.current;
    setCarregando(true);
    try {
      const [res, cont] = await Promise.all([
        listarLogs(projectId, { ...(JSON.parse(chave) as FiltroLogs), pagina: pag, porPagina }),
        pag === 0 ? contarLogsPorStatus(projectId) : Promise.resolve(null),
      ]);
      if (minha !== geracao.current) return;
      setLogs((atual) => (pag === 0 ? res.logs : [...atual, ...res.logs]));
      setTotal(res.total);
      setPagina(pag);
      if (cont) setContadores(cont);
      setErro(null);
    } catch (e) {
      if (minha === geracao.current) setErro((e as Error).message);
    } finally {
      if (minha === geracao.current) setCarregando(false);
    }
  }, [projectId, chave, porPagina]);

  useEffect(() => {
    setLogs([]);
    void carregar(0);
  }, [carregar]);

  return {
    logs, total, contadores, carregando, erro,
    temMais: logs.length < total,
    carregarMais: () => carregar(pagina + 1),
    recarregar: () => carregar(0),
  };
}
