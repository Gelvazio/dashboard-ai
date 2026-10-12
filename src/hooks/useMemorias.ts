import { useCallback, useEffect, useRef, useState } from 'react';
import { listarMemorias, type Memoria } from '@/services/memoryService';

export interface OpcoesUseMemorias {
  /** Quantas memórias a mais cada "carregar mais" busca (padrão 30). */
  porPagina?: number;
}

export interface EstadoMemorias {
  memorias: Memoria[];
  carregando: boolean;
  erro: string | null;
  /** Há mais memórias além das carregadas (a última consulta veio com o limite cheio). */
  temMais: boolean;
  carregarMais: () => Promise<void>;
  recarregar: () => Promise<void>;
  /** Remove da lista local (ex.: exclusão otimista). */
  remover: (id: string) => void;
  /** Recoloca/atualiza na lista local (ex.: desfazer exclusão ou memória salva), mais recente primeiro. */
  reinserir: (memoria: Memoria) => void;
}

const porData = (a: Memoria, b: Memoria) => (a.updated_at < b.updated_at ? 1 : a.updated_at > b.updated_at ? -1 : 0);

/**
 * Memórias do projeto (e globais) para a grade da `MemoriaView` (SUB-21.3).
 *
 * Usa `listarMemorias` (SUB-10) com `limite` crescente: cada "carregar mais"
 * pede `porPagina` a mais. `temMais` = a última consulta veio com o limite
 * cheio. Respostas de um projeto anterior (ou de uma consulta superada) são
 * ignoradas.
 */
export function useMemorias(projectId: number | null | undefined, { porPagina = 30 }: OpcoesUseMemorias = {}): EstadoMemorias {
  const [memorias, setMemorias] = useState<Memoria[]>([]);
  const [limite, setLimite] = useState(porPagina);
  const [temMais, setTemMais] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const geracao = useRef(0);

  const carregar = useCallback(
    async (novoLimite: number) => {
      const minha = ++geracao.current;
      if (projectId == null) {
        setMemorias([]);
        setTemMais(false);
        setCarregando(false);
        return;
      }
      setCarregando(true);
      try {
        const lista = await listarMemorias(projectId, { limite: novoLimite });
        if (minha !== geracao.current) return;
        setMemorias(lista);
        setLimite(novoLimite);
        setTemMais(lista.length >= novoLimite);
        setErro(null);
      } catch (e) {
        if (minha === geracao.current) setErro((e as Error).message);
      } finally {
        if (minha === geracao.current) setCarregando(false);
      }
    },
    [projectId],
  );

  useEffect(() => {
    setMemorias([]);
    setTemMais(false);
    setErro(null);
    void carregar(porPagina);
  }, [carregar, porPagina]);

  const carregarMais = useCallback(() => carregar(limite + porPagina), [carregar, limite, porPagina]);
  const recarregar = useCallback(() => carregar(Math.max(limite, porPagina)), [carregar, limite, porPagina]);
  const remover = useCallback((id: string) => setMemorias((l) => l.filter((m) => m.id !== id)), []);
  const reinserir = useCallback(
    (memoria: Memoria) => setMemorias((l) => [...l.filter((m) => m.id !== memoria.id), memoria].sort(porData)),
    [],
  );

  return { memorias, carregando, erro, temMais, carregarMais, recarregar, remover, reinserir };
}
