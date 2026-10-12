import { beforeEach, describe, expect, it, vi } from 'vitest';

// Cliente falso: registra as chamadas de RPC e devolve a resposta configurada no teste.
const chamadas: { nome: string; args: Record<string, unknown> }[] = [];
let resposta: unknown = [];

vi.mock('../../api/_lib/supabase.js', async (importOriginal) => {
  const real = await importOriginal<typeof import('../../api/_lib/supabase.js')>();
  return {
    ...real,
    rpc: async (nome: string, args: Record<string, unknown>) => {
      chamadas.push({ nome, args });
      return resposta;
    },
  };
});

const { reivindicar } = await import('../../worker/fila.js');

describe('reivindicar', () => {
  beforeEach(() => {
    chamadas.length = 0;
    resposta = [];
  });

  it('chama pegar_proxima_task com agente, projeto e padrões de trava', async () => {
    await reivindicar('Worker 1', 'default');
    expect(chamadas).toEqual([
      {
        nome: 'pegar_proxima_task',
        args: { p_agente: 'Worker 1', p_projeto: 'default', p_lock_minutos: 90, p_exclusivo: false },
      },
    ]);
  });

  it('repassa lockMinutos e exclusivo', async () => {
    await reivindicar('Worker 1', 'meu-app', 30, true);
    expect(chamadas[0].args).toMatchObject({ p_lock_minutos: 30, p_exclusivo: true });
  });

  it('devolve null quando não há task disponível', async () => {
    expect(await reivindicar('Worker 1', 'default')).toBeNull();
    resposta = null;
    expect(await reivindicar('Worker 1', 'default')).toBeNull();
  });

  it('mapeia a primeira task devolvida', async () => {
    resposta = [{ id: 42, codigo: 'SUB-01', tentativas: 2, instrucao: 'Fazer algo' }];
    expect(await reivindicar('Worker 1', 'default')).toEqual({
      taskId: 42,
      taskCodigo: 'SUB-01',
      tentativa: 2,
      instrucao: 'Fazer algo',
    });
  });

  it('usa instrução vazia quando a task não tem instrução', async () => {
    resposta = [{ id: 1, codigo: 'SUB-02', tentativas: 1, instrucao: null }];
    expect((await reivindicar('Worker 1', 'default'))?.instrucao).toBe('');
  });
});
