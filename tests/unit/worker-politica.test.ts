import { describe, expect, it, vi } from 'vitest';
import { END, MemorySaver, START, StateGraph } from '@langchain/langgraph';
import { EstadoExecucao } from '../../worker/estado';
import { classificarFalha } from '../../worker/falhas';
import { politica } from '../../worker/nos/politica';

type Estado = typeof EstadoExecucao.State;

function passo(ferramenta: string, sensivel: boolean) {
  return { ferramenta, argumentos: { query: 'x' }, sensivel, criterio: 'ok' };
}

function estado(passos: ReturnType<typeof passo>[]): Estado {
  return {
    taskId: 1, taskCodigo: 'SUB-01', projeto: 'default', agente: 'Worker', tentativa: 1, execucaoId: 'exec-1',
    instrucao: 'x', plano: JSON.stringify({ passos }), passoAtual: '', resultados: {}, aprovacao: null, final: false,
  } as Estado;
}

describe('politica', () => {
  it('não sensível segue sem pedir aprovação', async () => {
    const pedir = vi.fn();
    expect(await politica(estado([passo('brain_search', false)]), pedir)).toEqual({ aprovacao: null });
    expect(pedir).not.toHaveBeenCalled();
  });

  it('passo sensível pede aprovação e grava a resposta', async () => {
    const pedir = vi.fn(() => ({ aprovado: true }));
    const saida = await politica(estado([passo('brain_search', false), passo('brain_store', true)]), pedir);
    expect(pedir).toHaveBeenCalledWith(
      expect.objectContaining({ tipo: 'aprovacao', taskCodigo: 'SUB-01', passos: [expect.objectContaining({ ferramenta: 'brain_store' })] }),
    );
    expect(saida).toEqual({ aprovacao: { aprovado: true } });
  });

  it('ferramenta fora da allowlist é erro de permissão', async () => {
    const erro = await politica(estado([passo('brain_delete', false)]), vi.fn()).catch((e: unknown) => e);
    expect(classificarFalha(erro)).toBe('permissao');
  });

  it('com interrupt() real, o grafo pausa no passo sensível', async () => {
    const grafo = new StateGraph(EstadoExecucao)
      .addNode('politica', (s: Estado) => politica(s))
      .addEdge(START, 'politica')
      .addEdge('politica', END)
      .compile({ checkpointer: new MemorySaver() });
    const config = { configurable: { thread_id: 't1' } };
    await grafo.invoke(estado([passo('brain_store', true)]), config);
    const snapshot = await grafo.getState(config);
    expect(snapshot.next).toEqual(['politica']);
    expect(snapshot.tasks[0].interrupts[0].value).toMatchObject({ tipo: 'aprovacao' });
  });
});
