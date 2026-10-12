import { describe, expect, it } from 'vitest';
import { mesclarEvento } from '@/lib/monitor';
import type { AgentEvent } from '@/types/database';

function ev(id: number, minuto: number): AgentEvent {
  return {
    id,
    project_id: 1,
    task_id: null,
    task_codigo: null,
    agente: 'Agente',
    execucao_id: null,
    etapa: null,
    tipo: 'heartbeat' as AgentEvent['tipo'],
    status: null,
    mensagem: null,
    metadados: {},
    chave_idempotencia: null,
    criado_por: null,
    created_at: new Date(Date.UTC(2026, 9, 12, 4, minuto)).toISOString(),
  };
}
const ids = (l: AgentEvent[]) => l.map((e) => e.id);

describe('mesclarEvento', () => {
  it('coloca o evento mais novo no início', () => {
    expect(ids(mesclarEvento([ev(2, 2), ev(1, 1)], ev(3, 3)))).toEqual([3, 2, 1]);
  });

  it('ignora id repetido e devolve a mesma lista', () => {
    const lista = [ev(2, 2), ev(1, 1)];
    expect(mesclarEvento(lista, ev(2, 9))).toBe(lista);
  });

  it('insere evento atrasado na posição certa (created_at desc)', () => {
    expect(ids(mesclarEvento([ev(3, 3), ev(1, 1)], ev(2, 2)))).toEqual([3, 2, 1]);
    expect(ids(mesclarEvento([ev(3, 3)], ev(0, 0)))).toEqual([3, 0]);
  });

  it('desempata pelo id maior quando created_at é igual', () => {
    expect(ids(mesclarEvento([ev(5, 1), ev(3, 1)], ev(4, 1)))).toEqual([5, 4, 3]);
  });

  it('corta em max e não altera a lista original', () => {
    const lista = [ev(2, 2), ev(1, 1)];
    expect(ids(mesclarEvento(lista, ev(3, 3), 2))).toEqual([3, 2]);
    expect(ids(mesclarEvento(lista, ev(0, 0), 2))).toEqual([2, 1]);
    expect(ids(lista)).toEqual([2, 1]);
  });

  it('funciona com lista vazia', () => {
    expect(ids(mesclarEvento([], ev(1, 1)))).toEqual([1]);
  });
});
