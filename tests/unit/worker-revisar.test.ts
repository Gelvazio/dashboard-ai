import { describe, expect, it, vi } from 'vitest';
import { decidirRevisao, revisar } from '../../worker/nos/revisar';
import { EstadoExecucao } from '../../worker/estado';

type Estado = typeof EstadoExecucao.State;
const opcoes = { limitePorNo: 3, esperaBaseMs: 100 };

function estado(resultados: Record<string, unknown>, passoAtual = 'brain_search'): Estado {
  return {
    taskId: 1, taskCodigo: 'SUB-01', projeto: 'default', agente: 'Worker', tentativa: 1,
    execucaoId: 'exec-1', instrucao: 'x', plano: '', passoAtual, resultados, aprovacao: null, final: false,
  } as Estado;
}

describe('decidirRevisao', () => {
  it('transitória repete até o limite com espera progressiva', () => {
    const erro = new Error('timeout');
    expect(decidirRevisao(erro, 1, opcoes)).toMatchObject({ acao: 'repetir', esperaMs: 100 });
    expect(decidirRevisao(erro, 2, opcoes)).toMatchObject({ acao: 'repetir', esperaMs: 200 });
    expect(decidirRevisao(erro, 3, opcoes)).toMatchObject({ acao: 'finalizar', classe: 'transitoria' });
  });

  it('permanente finaliza sem repetir', () => {
    expect(decidirRevisao(new Error('falha inesperada'), 1, opcoes)).toMatchObject({ acao: 'finalizar', classe: 'permanente' });
  });

  it('sem erro segue', () => {
    expect(decidirRevisao(null, 1, opcoes)).toEqual({ acao: 'seguir', esperaMs: 0 });
  });
});

describe('revisar', () => {
  it('repete o passo transitório, esperando e contando a tentativa', async () => {
    const esperar = vi.fn(async () => {});
    const saida = await revisar(estado({ erro: new Error('timeout') }), opcoes, esperar);
    expect(esperar).toHaveBeenCalledWith(100);
    expect(saida).toEqual({ final: false, resultados: { erro: null, 'tentativas:brain_search': 2 } });
  });

  it('finaliza quando a transitória atinge o limite', async () => {
    const esperar = vi.fn(async () => {});
    const saida = await revisar(estado({ erro: new Error('timeout'), 'tentativas:brain_search': 3 }), opcoes, esperar);
    expect(esperar).not.toHaveBeenCalled();
    expect(saida).toEqual({ final: true, resultados: { classe_falha: 'transitoria' } });
  });

  it('finaliza falha permanente', async () => {
    expect(await revisar(estado({ erro: new Error('falha inesperada') }), opcoes)).toEqual({
      final: true,
      resultados: { classe_falha: 'permanente' },
    });
  });

  it('sem erro continua enquanto houver passo atual', async () => {
    expect(await revisar(estado({}), opcoes)).toEqual({ final: false });
    expect(await revisar(estado({}, ''), opcoes)).toEqual({ final: true });
  });
});
