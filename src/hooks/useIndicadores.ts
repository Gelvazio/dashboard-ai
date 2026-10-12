import { useCallback, useEffect, useRef, useState } from 'react';
import { contarTasksPorStatus } from '@/services/taskService';
import { contarMemorias, type ContagemMemorias } from '@/services/memoryService';
import { ultimaExecucao } from '@/services/logService';
import type { AgendamentoLog, TaskStatus } from '@/types';

export interface Indicadores {
  tasks: Record<TaskStatus, number> | null;
  memorias: ContagemMemorias | null;
  ultima: AgendamentoLog | null;
  carregando: boolean;
  /** Mensagens das consultas que falharam (as demais continuam exibidas). */
  erros: string[];
  recarregar: () => Promise<void>;
}

/** Números dos cards de indicadores do projeto (tasks, memórias e última execução). */
export function useIndicadores(projectId: number | null | undefined): Indicadores {
  const [estado, setEstado] = useState<Omit<Indicadores, 'recarregar'>>({ tasks: null, memorias: null, ultima: null, carregando: false, erros: [] });
  const geracao = useRef(0);

  const recarregar = useCallback(async () => {
    const minha = ++geracao.current;
    if (projectId == null) {
      setEstado({ tasks: null, memorias: null, ultima: null, carregando: false, erros: [] });
      return;
    }
    setEstado((e) => ({ ...e, carregando: true }));
    const [t, m, u] = await Promise.allSettled([contarTasksPorStatus(projectId), contarMemorias(projectId), ultimaExecucao(projectId)]);
    if (minha !== geracao.current) return;
    const erros = [t, m, u].filter((r): r is PromiseRejectedResult => r.status === 'rejected').map((r) => (r.reason as Error).message);
    setEstado({
      tasks: t.status === 'fulfilled' ? t.value : null,
      memorias: m.status === 'fulfilled' ? m.value : null,
      ultima: u.status === 'fulfilled' ? u.value : null,
      carregando: false,
      erros: [...new Set(erros)],
    });
  }, [projectId]);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  return { ...estado, recarregar };
}
