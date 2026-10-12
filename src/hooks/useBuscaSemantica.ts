import { useEffect, useMemo, useRef, useState } from 'react';
import { criarGeradorEmbedding } from '@/services/embeddingService';
import { buscarMemorias, type ResultadoBusca } from '@/services/memoryService';
import { useDebounce } from './useDebounce';

export interface OpcoesBuscaSemantica {
  /** Similaridade mínima de 0 a 1 (padrão do serviço: 0.5). */
  limiar?: number;
  /** Inclui memórias globais (`project_id` nulo); padrão do serviço: sim. */
  incluirGlobais?: boolean;
  /** Mude o número para refazer a busca atual (ex.: após salvar uma memória). */
  versao?: number;
}

export interface EstadoBuscaSemantica {
  /** Último resultado da consulta atual, ou `null` sem consulta/antes da 1ª resposta. */
  resultado: ResultadoBusca | null;
  carregando: boolean;
  /** Mensagem do erro da última busca, ou `null`. */
  erro: string | null;
}

/**
 * Busca semântica de memórias enquanto o usuário digita (SUB-19.6).
 *
 * Espera 400 ms sem digitação (`useDebounce`), gera o embedding pelo
 * `/api/embedding` (`criarGeradorEmbedding`, SUB-33.7) e chama `buscarMemorias`
 * (SUB-10). Texto vazio (ou sem projeto) não busca e limpa o resultado.
 * Respostas de consultas antigas são descartadas por um contador de requisição.
 */
export function useBuscaSemantica(
  projeto: { id: number; slug: string } | null,
  consulta: string,
  { limiar, incluirGlobais, versao = 0 }: OpcoesBuscaSemantica = {},
): EstadoBuscaSemantica {
  const termo = useDebounce(consulta.trim(), 400);
  const gerador = useMemo(() => criarGeradorEmbedding(), []);
  const requisicao = useRef(0);
  const [estado, setEstado] = useState<EstadoBuscaSemantica>({ resultado: null, carregando: false, erro: null });

  const projetoId = projeto?.id;
  const projetoSlug = projeto?.slug;

  useEffect(() => {
    const atual = ++requisicao.current;
    if (!termo || projetoId === undefined || projetoSlug === undefined) {
      setEstado({ resultado: null, carregando: false, erro: null });
      return;
    }
    setEstado((e) => ({ ...e, carregando: true, erro: null }));
    buscarMemorias({ id: projetoId, slug: projetoSlug }, termo, { limiar, incluirGlobais, gerador })
      .then((resultado) => {
        if (atual === requisicao.current) setEstado({ resultado, carregando: false, erro: null });
      })
      .catch((e: unknown) => {
        if (atual === requisicao.current) {
          setEstado((s) => ({ ...s, carregando: false, erro: e instanceof Error ? e.message : String(e) }));
        }
      });
  }, [termo, projetoId, projetoSlug, limiar, incluirGlobais, gerador, versao]);

  // Ao desmontar, invalida a requisição em voo para não atualizar estado depois.
  useEffect(() => () => void ++requisicao.current, []);

  return estado;
}
