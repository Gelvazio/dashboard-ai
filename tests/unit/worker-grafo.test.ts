import { describe, expect, it, vi } from 'vitest';
import { Command, MemorySaver } from '@langchain/langgraph';
import type { ToolDefinition } from '../../api/_lib/tools';
import type { FinalizarArgs } from '../../worker/fila';
import { executarUmaTask } from '../../worker/executar';
import { criarGrafo } from '../../worker/grafo';
import { reconciliar } from '../../worker/reconciliar';
import type { ModeloPlano } from '../../worker/nos/planejar';

// RPC falsa: `finalizar` real (worker/fila) grava aqui a chamada de `finalizar_task`.
const rpcs: { nome: string; args: Record<string, unknown> }[] = [];
vi.mock('../../api/_lib/supabase', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../api/_lib/supabase')>()),
  rpc: vi.fn(async (nome: string, args: Record<string, unknown>) => {
    rpcs.push({ nome, args });
    return null;
  }),
}));

vi.mock('../../api/_lib/tools', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../api/_lib/tools')>()),
  listTools: vi.fn(async () => [definicao]),
}));

const definicao: ToolDefinition = {
  name: 'brain_search',
  description: 'Busca',
  inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
};

function passo(query: string, sensivel = false) {
  return { ferramenta: 'brain_search', argumentos: { query }, sensivel, criterio: 'ok' };
}

function montar(passos: ReturnType<typeof passo>[], aprovacao: unknown = { aprovado: true }) {
  const modelo = { withStructuredOutput: () => ({ invoke: async () => ({ passos }) }) } as unknown as ModeloPlano;
  const chamar = vi.fn(async (_nome: string, args: Record<string, unknown>, _chave: string) => `ok ${args.query}`);
  const finalizacoes: FinalizarArgs[] = [];
  const grafo = criarGrafo({
    modelo,
    contexto: { buscar: async () => ({ texto: '[Deploy]: Vercel', erro: false }) },
    pedirAprovacao: () => aprovacao,
    executar: { obterDefinicao: async () => definicao, chamar },
    esperar: async () => {},
    finalizar: { finalizar: async (args) => void finalizacoes.push(args) },
  });
  return { grafo, chamar, finalizacoes };
}

const entrada = { taskId: 5, taskCodigo: 'SUB-05', projeto: 'default', agente: 'Worker', tentativa: 1, execucaoId: 'exec-5', instrucao: 'Buscar deploy' };

describe('criarGrafo', () => {
  it('caminho feliz: contexto, plano, execução de todos os passos e finalização', async () => {
    const { grafo, chamar, finalizacoes } = montar([passo('a'), passo('b')]);
    const final = await grafo.invoke(entrada);
    expect(chamar.mock.calls.map((c) => c[2])).toEqual(['exec-5:passo-0', 'exec-5:passo-1']);
    expect(final.resultados).toMatchObject({ 'passo-0': 'ok a', 'passo-1': 'ok b' });
    expect(finalizacoes).toHaveLength(1);
    expect(finalizacoes[0]).toMatchObject({ taskId: 5, status: 'concluida', execucaoId: 'exec-5' });
  });

  it('aprovação negada finaliza como recusada sem executar', async () => {
    const { grafo, chamar, finalizacoes } = montar([passo('a', true)], { aprovado: false });
    await grafo.invoke(entrada);
    expect(chamar).not.toHaveBeenCalled();
    expect(finalizacoes[0]).toMatchObject({ status: 'recusada' });
  });
});

// SUB-28.17: grafo completo com modelo, ferramentas e RPC falsos, finalizando pela RPC `finalizar_task`.
describe('criarGrafo até finalizar_task (RPC falsa)', () => {
  const semEventos = {
    db: () => {
      throw new Error('sem banco nos testes');
    },
    avisar: () => {},
  };

  function montarComRpc(passos: ReturnType<typeof passo>[], chamar: (nome: string, args: Record<string, unknown>, chave: string) => Promise<string>) {
    rpcs.length = 0;
    const espiao = vi.fn(chamar);
    const grafo = criarGrafo({
      modelo: { withStructuredOutput: () => ({ invoke: async () => ({ passos }) }) } as unknown as ModeloPlano,
      contexto: { buscar: async () => ({ texto: '', erro: false }) },
      pedirAprovacao: () => ({ aprovado: true }),
      executar: { obterDefinicao: async () => definicao, chamar: espiao },
      esperar: async () => {},
      eventos: semEventos,
    });
    return { grafo, chamar: espiao };
  }

  it('caminho feliz: executa todos os passos e chama finalizar_task com concluida', async () => {
    const { grafo, chamar } = montarComRpc([passo('a'), passo('b')], async (_n, args) => `ok ${args.query}`);
    await grafo.invoke({ ...entrada, agente: 'Worker 1' });

    expect(chamar).toHaveBeenCalledTimes(2);
    expect(rpcs).toHaveLength(1);
    expect(rpcs[0].nome).toBe('finalizar_task');
    expect(rpcs[0].args).toMatchObject({
      p_task_id: 5,
      p_status: 'concluida',
      p_resultado: '2 passo(s) concluído(s): passo-0, passo-1',
      p_metadados: {
        execucao_id: 'exec-5',
        chaves: ['passo-0', 'passo-1'],
        erro_mensagem: null,
        passo_falho: null,
      },
    });
  });

  it('erro permanente: não repete o passo e chama finalizar_task com erro', async () => {
    const { grafo, chamar } = montarComRpc([passo('a'), passo('b'), passo('c')], async (_n, args) => {
      if (args.query === 'b') throw new Error('registro corrompido');
      return `ok ${args.query}`;
    });
    const final = await grafo.invoke(entrada);

    expect(chamar.mock.calls.map((c) => c[2])).toEqual(['exec-5:passo-0', 'exec-5:passo-1']);
    expect(final.resultados).toMatchObject({ classe_falha: 'permanente' });
    expect(rpcs).toHaveLength(1);
    expect(rpcs[0].nome).toBe('finalizar_task');
    expect(rpcs[0].args).toMatchObject({
      p_task_id: 5,
      p_status: 'erro',
      p_metadados: { execucao_id: 'exec-5', passo_falho: 'brain_search' },
    });
    expect((rpcs[0].args.p_metadados as { erro_mensagem: string }).erro_mensagem).toContain('registro corrompido');
  });
});

// SUB-28.24: interrupção no passo sensível, retomada aprovada sem duplicar efeitos e retomada com trava expirada.
describe('criarGrafo: interrupção e retomada', () => {
  const config = { configurable: { thread_id: 'exec-5' } };

  function montarComCheckpoint() {
    const chamar = vi.fn(async (_nome: string, args: Record<string, unknown>, _chave: string) => `ok ${args.query}`);
    const finalizacoes: FinalizarArgs[] = [];
    const grafo = criarGrafo({
      modelo: { withStructuredOutput: () => ({ invoke: async () => ({ passos: [passo('a', true)] }) }) } as unknown as ModeloPlano,
      checkpointer: new MemorySaver(),
      contexto: { buscar: async () => ({ texto: '', erro: false }) },
      executar: { obterDefinicao: async () => definicao, chamar },
      esperar: async () => {},
      finalizar: { finalizar: async (args) => void finalizacoes.push(args) },
      eventos: { db: () => ({}) as never, avisar: () => {} },
    });
    return { grafo, chamar, finalizacoes };
  }

  it('passo sensível interrompe antes de executar', async () => {
    const { grafo, chamar, finalizacoes } = montarComCheckpoint();
    await grafo.invoke(entrada, config);
    const snapshot = await grafo.getState(config);

    expect(snapshot.next).toEqual(['politica']);
    expect(snapshot.tasks[0].interrupts[0].value).toMatchObject({ tipo: 'aprovacao', taskCodigo: 'SUB-05', passos: [{ ferramenta: 'brain_search' }] });
    expect(chamar).not.toHaveBeenCalled();
    expect(finalizacoes).toHaveLength(0);
  });

  it('retomada aprovada executa o passo uma única vez (chave de idempotência)', async () => {
    const { grafo, chamar, finalizacoes } = montarComCheckpoint();
    await grafo.invoke(entrada, config);
    const final = await grafo.invoke(new Command({ resume: { aprovado: true } }), config);

    expect(chamar).toHaveBeenCalledTimes(1);
    expect(chamar.mock.calls[0][2]).toBe('exec-5:passo-0');
    expect(final.resultados).toMatchObject({ 'passo-0': 'ok a' });
    expect(finalizacoes).toEqual([expect.objectContaining({ status: 'concluida', chaves: ['passo-0'] })]);

    // Repetir a retomada na mesma thread não reexecuta o passo nem finaliza de novo.
    await grafo.invoke(new Command({ resume: { aprovado: true } }), config);
    expect(chamar).toHaveBeenCalledTimes(1);
    expect(finalizacoes).toHaveLength(1);
  });

  it('retomada após trava expirada aborta sem efeitos', async () => {
    const { grafo, chamar, finalizacoes } = montarComCheckpoint();
    await grafo.invoke(entrada, config);

    const agora = new Date('2026-10-12T12:00:00Z');
    const lerTask = async () => ({
      status: 'em_execucao',
      trava_frente: 'Worker',
      trava_em: new Date(agora.getTime() - 91 * 60_000).toISOString(),
      tentativas: 1,
    });
    const invoke = vi.fn((e: Record<string, unknown>, c: typeof config) => grafo.invoke(e, c));
    const encerrar = vi.fn(async () => {});
    const resultado = await executarUmaTask({
      agente: 'Worker',
      projeto: 'default',
      grafo: { invoke },
      reivindicar: async () => ({ taskId: 5, taskCodigo: 'SUB-05', tentativa: 1, instrucao: 'Buscar deploy' }),
      reconciliar: (esperado) => reconciliar(esperado, { lerTask, agora: () => agora, lockMinutos: 90 }),
      finalizar: encerrar,
    });

    expect(resultado).toMatchObject({ taskId: 5, situacao: 'abortada', motivo: 'trava expirada' });
    expect(invoke).not.toHaveBeenCalled();
    expect(chamar).not.toHaveBeenCalled();
    expect(finalizacoes).toHaveLength(0);
    expect(encerrar).not.toHaveBeenCalled();
  });
});
