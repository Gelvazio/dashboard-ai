import { describe, expect, it, vi } from 'vitest';
import { classificarFalha } from '../../worker/falhas';
import { EstadoExecucao } from '../../worker/estado';
import { criarNoPlanejar, ErroValidacaoPlano, planejar, type ModeloPlano } from '../../worker/nos/planejar';

type Estado = typeof EstadoExecucao.State;

const estado = {
  taskId: 1, taskCodigo: 'SUB-01', projeto: 'default', agente: 'Worker', tentativa: 1, execucaoId: 'exec-1',
  instrucao: 'Buscar memórias de deploy', plano: '', passoAtual: '', resultados: {}, aprovacao: null, final: false,
} as Estado;

function modeloFalso(resposta: unknown) {
  const invoke = vi.fn(async (_prompt: string) => resposta);
  const withStructuredOutput = vi.fn(() => ({ invoke }));
  return { modelo: { withStructuredOutput } as unknown as ModeloPlano, invoke, withStructuredOutput };
}

const planoValido = {
  passos: [{ ferramenta: 'brain_search', argumentos: { query: 'deploy' }, sensivel: false, criterio: 'acha memória' }],
};

describe('planejar', () => {
  it('chama o modelo com o prompt e grava o plano no estado', async () => {
    const { modelo, invoke, withStructuredOutput } = modeloFalso(planoValido);
    const saida = await planejar(estado, modelo);
    expect(withStructuredOutput).toHaveBeenCalledTimes(1);
    expect(invoke.mock.calls[0][0]).toContain('Buscar memórias de deploy');
    expect(JSON.parse(saida.plano)).toEqual(planoValido);
  });

  it('plano inválido vira erro de validação', async () => {
    const { modelo } = modeloFalso({ passos: [{ ferramenta: 'brain_search', sensivel: 'nao' }] });
    const erro = await planejar(estado, modelo).catch((e: unknown) => e);
    expect(erro).toBeInstanceOf(ErroValidacaoPlano);
    expect(classificarFalha(erro)).toBe('validacao');
  });

  it('criarNoPlanejar fixa o modelo', async () => {
    const { modelo } = modeloFalso(planoValido);
    expect(JSON.parse((await criarNoPlanejar(modelo)(estado)).plano)).toEqual(planoValido);
  });
});
