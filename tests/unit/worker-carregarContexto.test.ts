import { describe, expect, it, vi } from 'vitest';
import { carregarContexto } from '../../worker/nos/carregarContexto';
import { EstadoExecucao } from '../../worker/estado';

type Estado = typeof EstadoExecucao.State;

function estado(instrucao: string, projeto = 'meu-app'): Estado {
  return {
    taskId: 1, taskCodigo: 'SUB-01', projeto, agente: 'Worker', tentativa: 1,
    execucaoId: 'exec-1', instrucao, plano: '', passoAtual: '', resultados: {}, aprovacao: null, final: false,
  } as Estado;
}

describe('carregarContexto', () => {
  it('busca memórias da instrução no projeto e marca como não confiáveis', async () => {
    const buscar = vi.fn(async () => ({ texto: '[Deploy]: usar Vercel', erro: false }));
    const saida = await carregarContexto(estado('Como fazer deploy?'), { buscar });
    expect(buscar).toHaveBeenCalledWith({ query: 'Como fazer deploy?', project: 'meu-app' });
    expect(saida).toEqual({
      resultados: { brain_search: [{ title: 'brain_search', content: '[Deploy]: usar Vercel', naoConfiavel: true }] },
    });
  });

  it('segue sem contexto quando a ferramenta falha ou responde erro', async () => {
    const lanca = vi.fn(async () => {
      throw new Error('rede');
    });
    expect(await carregarContexto(estado('x'), { buscar: lanca })).toEqual({ resultados: { brain_search: [] } });
    const erro = vi.fn(async () => ({ texto: 'sem permissão', erro: true }));
    expect(await carregarContexto(estado('x'), { buscar: erro })).toEqual({ resultados: { brain_search: [] } });
  });

  it('não chama a ferramenta com instrução vazia', async () => {
    const buscar = vi.fn(async () => ({ texto: 'x', erro: false }));
    expect(await carregarContexto(estado('  '), { buscar })).toEqual({ resultados: { brain_search: [] } });
    expect(buscar).not.toHaveBeenCalled();
  });
});
