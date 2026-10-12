import { useCallback, useMemo, useRef, useState } from 'react';
import { criarGeradorEmbedding } from '@/services/embeddingService';
import { salvarMemoria, type DadosMemoria, type GeradorEmbedding, type Memoria } from '@/services/memoryService';
import { useToast } from './useToast';

export interface SalvarMemoria {
  /**
   * Grava (upsert pelo título) a memória no projeto, ou global com `projectId = null`.
   * Devolve a memória salva, ou `null` se falhou (o erro já foi avisado em toast).
   */
  salvar: (projectId: number | null, dados: DadosMemoria) => Promise<Memoria | null>;
  salvando: boolean;
}

/** Marca a falha do gerador para distinguir de erros do banco. */
class FalhaEmbedding extends Error {}

/**
 * Salvar memória canônica com embedding (SUB-20.5).
 *
 * Usa `salvarMemoria` (SUB-10) com o gerador do `/api/embedding`
 * (`criarGeradorEmbedding`, SUB-33.7). Se o gerador falhar (sem login, rede,
 * API de embeddings fora), salva sem vetor e avisa que a memória não aparece
 * na busca semântica até ser salva de novo.
 */
export function useSalvarMemoria(): SalvarMemoria {
  const toast = useToast();
  const [salvando, setSalvando] = useState(false);
  const emAndamento = useRef(false);
  const gerador = useMemo(() => criarGeradorEmbedding(), []);

  const salvar = useCallback(
    async (projectId: number | null, dados: DadosMemoria): Promise<Memoria | null> => {
      if (emAndamento.current) return null;
      emAndamento.current = true;
      setSalvando(true);
      try {
        let motivoSemVetor: string | null = null;
        const comVetor: GeradorEmbedding = async (texto) => {
          try {
            return await gerador(texto);
          } catch (e) {
            throw new FalhaEmbedding((e as Error).message);
          }
        };
        let memoria: Memoria;
        try {
          memoria = await salvarMemoria(projectId, dados, { gerador: comVetor });
        } catch (e) {
          if (!(e instanceof FalhaEmbedding)) throw e;
          motivoSemVetor = e.message;
          memoria = await salvarMemoria(projectId, dados);
        }
        if (motivoSemVetor) {
          toast.avisar(
            `Memória "${memoria.title}" salva sem embedding (${motivoSemVetor}). Ela não aparece na busca semântica até ser salva novamente.`,
            'info',
          );
        } else {
          toast.sucesso(`Memória "${memoria.title}" salva.`);
        }
        return memoria;
      } catch (e) {
        toast.erro((e as Error).message);
        return null;
      } finally {
        emAndamento.current = false;
        setSalvando(false);
      }
    },
    [gerador, toast],
  );

  return { salvar, salvando };
}
