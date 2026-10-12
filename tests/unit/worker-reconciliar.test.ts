import { describe, expect, it } from 'vitest';
import { reconciliar, type TaskAtual } from '../../worker/reconciliar';

const agora = new Date('2026-10-12T12:00:00Z');
const esperado = { taskId: 7, agente: 'Worker A', tentativa: 2 };
const valida: TaskAtual = { status: 'em_execucao', trava_frente: 'Worker A', trava_em: '2026-10-12T11:30:00Z', tentativas: 2 };

function deps(task: TaskAtual | null) {
  return { lerTask: async () => task, agora: () => agora, lockMinutos: 90 };
}

describe('reconciliar', () => {
  it('libera quando a task continua travada pelo agente', async () => {
    expect(await reconciliar(esperado, deps(valida))).toEqual({ valido: true });
  });

  it.each([
    ['task removida', null, 'task não encontrada'],
    ['task já concluída', { ...valida, status: 'concluida' }, 'status concluida'],
    ['trava de outro agente', { ...valida, trava_frente: 'Worker B' }, 'trava de outro agente'],
    ['trava expirada', { ...valida, trava_em: '2026-10-12T10:00:00Z' }, 'trava expirada'],
    ['trava sem data', { ...valida, trava_em: null }, 'trava expirada'],
    ['nova tentativa', { ...valida, tentativas: 3 }, 'tentativa divergente'],
  ])('aborta com estado divergente: %s', async (_caso, task, motivo) => {
    expect(await reconciliar(esperado, deps(task as TaskAtual | null))).toEqual({ valido: false, motivo });
  });
});
