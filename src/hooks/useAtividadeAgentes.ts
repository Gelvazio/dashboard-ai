import { useCallback, useEffect, useRef, useState } from 'react';
import { atividadeAtual } from '@/services/eventService';
import type { AtividadeAgente } from '@/types/database';

/**
 * Atividade atual dos agentes (SUB-35.20): carrega `atividadeAtual`,
 * recarrega com debounce de 1 s quando `useEventosAgentes` recebe evento novo
 * e atualiza um relógio a cada 15 s para recalcular `estadoDoAgente`.
 */
export function useAtividadeAgentes(projectId: number | null | undefined) {
  const [atividades, setAtividades] = useState<AtividadeAgente[]>([]);
  const [agora, setAgora] = useState(Date.now());
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const geracao = useRef(0);

  const carregar = useCallback(async () => {
    if (projectId == null) return;
    const minha = ++geracao.current;
    try {
      setCarregando(true);
      const lista = await atividadeAtual(projectId);
      if (minha !== geracao.current) return;
      setAtividades(lista);
      setErro(null);
    } catch (e) {
      if (minha === geracao.current) setErro((e as Error).message);
    } finally {
      if (minha === geracao.current) setCarregando(false);
    }
  }, [projectId]);

  const recarregarDebounced = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void carregar();
    }, 1000);
  }, [carregar]);

  useEffect(() => {
    setAtividades([]);
    setErro(null);
    if (projectId == null) return;
    void carregar();
  }, [projectId, carregar]);

  // Relógio a cada 15 s para recalcular `estadoDoAgente`
  useEffect(() => {
    const intervalo = setInterval(() => {
      setAgora(Date.now());
    }, 15000);
    return () => clearInterval(intervalo);
  }, []);

  return { atividades, agora, carregando, erro, recarregar: carregar, recarregarDebounced };
}
