import { describe, expect, it, vi } from 'vitest';
import type { FinalizarArgs } from '../../worker/fila';
import { finalizarNode, resumoSeguro } from '../../worker/nos/finalizar';
import { EstadoExecucao } from '../../worker/estado';

type Estado = typeof EstadoExecucao.State;

function estado(parcial: Partial<Estado>): Estado {
  return {
    taskId: 9, taskCodigo: 'SUB-01', projeto: 'default', agente: 'Worker', tentativa: 1,
    execucaoId: 'exec-9', instrucao: 'x', plano: '', passoAtual: '', resultados: {}, aprovacao: null, final: false,
    ...parcial,
  } as Estado;
}

function adaptadorFalso() {
  const chamadas: FinalizarArgs[] = [];
  return { chamadas, deps: { finalizar: vi.fn(async (args: FinalizarArgs) => void chamadas.push(args)) } };
}

describe('finalizarNode', () => {
  it('conclui com resumo seguro e execucaoId', async () => {
    const { chamadas, deps } = adaptadorFalso();
    const saida = await finalizarNode(estado({ resultados: { 'passo-0': { segredo: 'nao-vazar' } } }), deps);
    expect(saida).toEqual({ final: true });
    expect(chamadas[0]).toMatchObject({ taskId: 9, status: 'concluida', execucaoId: 'exec-9', chaves: ['passo-0'] });
    expect(chamadas[0].resultado).not.toContain('nao-vazar');
  });

  it('marca erro com mensagem e passo falho', async () => {
    const { chamadas, deps } = adaptadorFalso();
    await finalizarNode(estado({ passoAtual: 'brain_search', resultados: { erro: 'timeout' } }), deps);
    expect(chamadas[0]).toMatchObject({ status: 'erro', erroMensagem: 'timeout', passoFalho: 'brain_search' });
  });

  it('marca recusada quando a aprovação foi negada', async () => {
    const { chamadas, deps } = adaptadorFalso();
    await finalizarNode(estado({ aprovacao: { aprovado: false } }), deps);
    expect(chamadas[0]).toMatchObject({ status: 'recusada', erroMensagem: 'Aprovação recusada' });
  });

  it('resumoSeguro limita o tamanho', () => {
    const muitos = Object.fromEntries(Array.from({ length: 500 }, (_, i) => [`passo-${i}`, i]));
    expect(resumoSeguro(muitos).length).toBeLessThanOrEqual(2000);
    expect(resumoSeguro({})).toBe('Nenhum passo executado');
  });
});
