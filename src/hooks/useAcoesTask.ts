import { useCallback, useState } from 'react';
import { alternarExecucao, cancelarTask, concluirTaskHumana, excluirTaskLogico, reabrirTask, restaurarTask } from '@/services/taskService';
import type { Task } from '@/types';
import { useToast } from './useToast';

interface Opcoes {
  projectId: number | null | undefined;
  substituir: (t: Task) => void;
  remover: (id: number) => void;
  recarregar: () => Promise<void>;
  /** Chamado depois de cada ação concluída (ex.: atualizar indicadores). */
  onMudou?: () => void;
}

export interface AcoesTask {
  /** Ids das tasks com ação em andamento. */
  ocupados: ReadonlySet<number>;
  alternar: (t: Task) => Promise<void>;
  reabrir: (t: Task) => Promise<void>;
  cancelar: (t: Task) => Promise<void>;
  concluir: (t: Task) => Promise<void>;
  excluir: (t: Task) => Promise<boolean>;
}

/** Ações rápidas da linha da tabela, com atualização otimista e avisos (SUB-18). */
export function useAcoesTask({ projectId, substituir, remover, recarregar, onMudou }: Opcoes): AcoesTask {
  const toast = useToast();
  const [ocupados, setOcupados] = useState<ReadonlySet<number>>(new Set());

  const marcar = (id: number, on: boolean) =>
    setOcupados((s) => {
      const n = new Set(s);
      if (on) n.add(id);
      else n.delete(id);
      return n;
    });

  const executar = useCallback(
    async (t: Task, acao: () => Promise<Task>, sucesso: string, otimista?: Task): Promise<boolean> => {
      if (projectId == null) return false;
      marcar(t.id, true);
      if (otimista) substituir(otimista);
      try {
        substituir(await acao());
        toast.sucesso(sucesso);
        onMudou?.();
        return true;
      } catch (e) {
        if (otimista) substituir(t); // desfaz a mudança otimista
        toast.erro((e as Error).message);
        void recarregar();
        return false;
      } finally {
        marcar(t.id, false);
      }
    },
    [projectId, substituir, recarregar, onMudou, toast],
  );

  const alternar = useCallback(
    async (t: Task) => {
      const novo = !t.executar;
      await executar(t, () => alternarExecucao(projectId!, t.id, novo), `${t.codigo} ${novo ? 'ligada (ON)' : 'desligada (OFF)'}.`, {
        ...t,
        executar: novo,
      });
    },
    [executar, projectId],
  );

  const reabrir = useCallback(
    async (t: Task) => {
      await executar(t, () => reabrirTask(projectId!, t.id), `${t.codigo} reaberta: volta para a fila com as tentativas zeradas.`);
    },
    [executar, projectId],
  );

  const cancelar = useCallback(
    async (t: Task) => {
      await executar(t, () => cancelarTask(projectId!, t.id), `${t.codigo} cancelada.`, { ...t, status: 'cancelada' });
    },
    [executar, projectId],
  );

  const concluir = useCallback(
    async (t: Task) => {
      await executar(t, () => concluirTaskHumana(projectId!, t.id), `${t.codigo} concluída.`);
    },
    [executar, projectId],
  );

  const excluir = useCallback(
    async (t: Task) => {
      if (projectId == null) return false;
      marcar(t.id, true);
      try {
        await excluirTaskLogico(projectId, t.id);
        remover(t.id);
        onMudou?.();
        toast.sucesso(`${t.codigo} excluída.`, {
          rotulo: 'Desfazer',
          onClick: () => {
            restaurarTask(projectId, t.id)
              .then(() => {
                toast.sucesso(`${t.codigo} restaurada (desligada).`);
                void recarregar();
                onMudou?.();
              })
              .catch((e: Error) => toast.erro(e.message));
          },
        });
        return true;
      } catch (e) {
        toast.erro((e as Error).message);
        return false;
      } finally {
        marcar(t.id, false);
      }
    },
    [projectId, remover, recarregar, onMudou, toast],
  );

  return { ocupados, alternar, reabrir, cancelar, concluir, excluir };
}
