import { useCallback, useEffect, useRef, useState } from 'react';
import { listarTasks, type FiltroTasks } from '@/services/taskService';
import type { Task } from '@/types';

export interface UseTasks {
  tasks: Task[];
  carregando: boolean;
  erro: string | null;
  /** Recarrega a lista (mantém a anterior visível enquanto busca). */
  recarregar: () => Promise<void>;
  /** Substitui uma task na lista local após uma ação (sem nova consulta). */
  substituir: (task: Task) => void;
  atualizadoEm: Date | null;
}

/** Tasks do projeto selecionado. Ignora respostas antigas se o projeto/filtro mudar. */
export function useTasks(projectId: number | null | undefined, filtro: FiltroTasks = {}): UseTasks {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizadoEm, setAtualizadoEm] = useState<Date | null>(null);
  const geracao = useRef(0);
  const ultimoProjeto = useRef<number | null | undefined>(undefined);
  const chaveFiltro = JSON.stringify(filtro);

  const recarregar = useCallback(async () => {
    const minha = ++geracao.current;
    if (ultimoProjeto.current !== projectId) {
      ultimoProjeto.current = projectId;
      setTasks([]); // não mostra tasks de outro projeto enquanto carrega
    }
    if (projectId == null) {
      setTasks([]);
      setCarregando(false);
      return;
    }
    setCarregando(true);
    try {
      const lista = await listarTasks(projectId, JSON.parse(chaveFiltro) as FiltroTasks);
      if (minha !== geracao.current) return;
      setTasks(lista);
      setErro(null);
      setAtualizadoEm(new Date());
    } catch (e) {
      if (minha !== geracao.current) return;
      setErro((e as Error).message);
    } finally {
      if (minha === geracao.current) setCarregando(false);
    }
  }, [projectId, chaveFiltro]);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  const substituir = useCallback((task: Task) => {
    setTasks((atual) => atual.map((t) => (t.id === task.id ? task : t)));
  }, []);

  return { tasks, carregando, erro, recarregar, substituir, atualizadoEm };
}
