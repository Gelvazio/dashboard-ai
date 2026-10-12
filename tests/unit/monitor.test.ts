import { describe, expect, it } from 'vitest';
import { estadoDoAgente, mesclarEvento } from '@/lib/monitor';
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

describe('estadoDoAgente', () => {
  const agora = Date.UTC(2026, 9, 12, 4, 0, 0);
  const haSeg = (s: number) => new Date(agora - s * 1000).toISOString();
  const at = (tipo: AgentEvent['tipo'], ultimo: string, heartbeat: string | null = null) => ({
    tipo,
    ultimo_em: ultimo,
    ultimo_heartbeat_em: heartbeat,
  });

  it('ativo: sinal recente (até 120 s)', () => {
    expect(estadoDoAgente(at('progresso', haSeg(30)), agora)).toBe('ativo');
    expect(estadoDoAgente(at('progresso', haSeg(120)), agora)).toBe('ativo');
  });

  it('ocioso: entre 120 s e 900 s', () => {
    expect(estadoDoAgente(at('inicio', haSeg(300)), agora)).toBe('ocioso');
  });

  it('sem_sinal: acima de 900 s ou sem data válida', () => {
    expect(estadoDoAgente(at('trava', haSeg(901)), agora)).toBe('sem_sinal');
    expect(estadoDoAgente(at('trava', 'invalida'), agora)).toBe('sem_sinal');
  });

  it('finalizado: último tipo fim ou liberacao, mesmo antigo', () => {
    expect(estadoDoAgente(at('fim', haSeg(5000)), agora)).toBe('finalizado');
    expect(estadoDoAgente(at('liberacao', haSeg(10)), agora)).toBe('finalizado');
  });

  it('usa o heartbeat quando é mais recente que o último evento', () => {
    expect(estadoDoAgente(at('progresso', haSeg(2000), haSeg(60)), agora)).toBe('ativo');
  });

  it('respeita limites personalizados', () => {
    expect(estadoDoAgente(at('progresso', haSeg(60)), agora, { ativoAteSeg: 30, ociosoAteSeg: 45 })).toBe('sem_sinal');
  });
});
