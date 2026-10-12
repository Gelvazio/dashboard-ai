import { useCallback, useEffect, useMemo, useState } from 'react';
import { diagnosticarFila, LIMITE_TRAVA_MIN, type DiagnosticoFila } from '@/lib/saudeFila';
import { liberarTrava } from '@/services/taskService';
import type { Task } from '@/types';
import { useToast } from './useToast';

/** Intervalo do relógio que recalcula o diagnóstico (ms). */
const INTERVALO_MS = 30_000;

interface Opcoes {
  projectId: number | null | undefined;
  /** Tasks do projeto (de `useTasks`). */
  tasks: readonly Task[];
  /** Recarrega as tasks (de `useTasks`). */
  recarregar: () => Promise<void>;
  /** Limite da trava em minutos (padrão 90). */
  limite?: number;
}

export interface SaudeFila {
  diagnostico: DiagnosticoFila;
  /** Id da task cuja trava está sendo liberada, ou `null`. */
  liberando: number | null;
  /** Libera a trava (`forcar` ignora o limite); avisa e recarrega. Retorna se deu certo. */
  liberar: (task: Task, forcar?: boolean) => Promise<boolean>;
}

/** Diagnóstico da saúde da fila, recalculado a cada 30 s, e liberação de travas (SUB-23.6). */
export function useSaudeFila({ projectId, tasks, recarregar, limite = LIMITE_TRAVA_MIN }: Opcoes): SaudeFila {
  const toast = useToast();
  const [agora, setAgora] = useState(() => Date.now());
  const [liberando, setLiberando] = useState<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), INTERVALO_MS);
    return () => clearInterval(id);
  }, []);

  const diagnostico = useMemo(() => diagnosticarFila(tasks, agora, limite), [tasks, agora, limite]);

  const liberar = useCallback(
    async (task: Task, forcar = false): Promise<boolean> => {
      if (projectId == null) return false;
      setLiberando(task.id);
      try {
        await liberarTrava(projectId, task.id, forcar, undefined);
        toast.sucesso(`Trava de ${task.codigo} liberada.`);
        return true;
      } catch (e) {
        toast.erro((e as Error).message);
        return false;
      } finally {
        setLiberando(null);
        setAgora(Date.now());
        void recarregar();
      }
    },
    [projectId, recarregar, toast],
  );

  return { diagnostico, liberando, liberar };
}
