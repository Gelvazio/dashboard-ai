import { useCallback, useState } from 'react';
import { excluirMemoria, type Memoria } from '@/services/memoryService';
import { useToast } from './useToast';

interface Opcoes {
  /** `remover` do `useMemorias`: tira da lista local. */
  remover: (id: string) => void;
  /** `reinserir` do `useMemorias`: devolve à lista se a exclusão falhar. */
  reinserir: (memoria: Memoria) => void;
  /** Chamado depois de excluir com sucesso (ex.: atualizar contadores). */
  onExcluida?: (memoria: Memoria) => void;
}

export interface ExcluirMemoria {
  /** Exclui com remoção otimista; devolve `true` se o banco confirmou. */
  excluir: (memoria: Memoria) => Promise<boolean>;
  /** Ids das memórias com exclusão em andamento. */
  excluindo: ReadonlySet<string>;
}

/**
 * Exclusão de memória com remoção otimista (SUB-21.7).
 *
 * Remove da lista na hora, chama `excluirMemoria` (SUB-10) e, se o banco/RLS
 * recusar (ex.: viewer, ou memória global sem ser administrador), reinsere a
 * memória e mostra o erro em toast; no sucesso, toast de confirmação.
 */
export function useExcluirMemoria({ remover, reinserir, onExcluida }: Opcoes): ExcluirMemoria {
  const toast = useToast();
  const [excluindo, setExcluindo] = useState<ReadonlySet<string>>(new Set());

  const marcar = (id: string, on: boolean) =>
    setExcluindo((s) => {
      const n = new Set(s);
      if (on) n.add(id);
      else n.delete(id);
      return n;
    });

  const excluir = useCallback(
    async (memoria: Memoria): Promise<boolean> => {
      marcar(memoria.id, true);
      remover(memoria.id);
      try {
        await excluirMemoria(memoria.id);
        toast.sucesso(`Memória "${memoria.title}" excluída.`);
        onExcluida?.(memoria);
        return true;
      } catch (e) {
        reinserir(memoria);
        toast.erro((e as Error).message);
        return false;
      } finally {
        marcar(memoria.id, false);
      }
    },
    [remover, reinserir, onExcluida, toast],
  );

  return { excluir, excluindo };
}
