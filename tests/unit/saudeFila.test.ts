import { describe, it, expect } from 'vitest';
import { LIMITE_TRAVA_MIN, classificarPendentes, diagnosticarFila, minutosDeTrava, travaExpirada } from '@/lib/saudeFila';
import type { Task } from '@/types';

describe('minutosDeTrava', () => {
  it('retorna null se não houver trava', () => {
    expect(minutosDeTrava({ trava_em: null })).toBe(null);
  });

  it('retorna null se a data da trava for inválida', () => {
    expect(minutosDeTrava({ trava_em: 'data-invalida' })).toBe(null);
  });

  it('calcula minutos corretamente para uma trava recente', () => {
    const agora = Date.now();
    const dezMinutosAtras = new Date(agora - 10 * 60 * 1000).toISOString();
    expect(minutosDeTrava({ trava_em: dezMinutosAtras }, agora)).toBeCloseTo(10, 0);
  });

  it('retorna 0 se a trava for no futuro', () => {
    const agora = Date.now();
    const futuro = new Date(agora + 10 * 60 * 1000).toISOString();
    expect(minutosDeTrava({ trava_em: futuro }, agora)).toBe(0);
  });

  it('calcula minutos corretamente para uma trava antiga', () => {
    const agora = Date.now();
    const umaHoraAtras = new Date(agora - 60 * 60 * 1000).toISOString();
    expect(minutosDeTrava({ trava_em: umaHoraAtras }, agora)).toBeCloseTo(60, 0);
  });

  it('LIMITE_TRAVA_MIN é 90 minutos', () => {
    expect(LIMITE_TRAVA_MIN).toBe(90);
  });
});

describe('travaExpirada', () => {
  it('retorna false se não houver trava', () => {
    expect(travaExpirada({ trava_em: null })).toBe(false);
  });

  it('retorna false se a data da trava for inválida', () => {
    expect(travaExpirada({ trava_em: 'data-invalida' })).toBe(false);
  });

  it('retorna false se a trava estiver dentro do limite', () => {
    const agora = Date.now();
    const dezMinutosAtras = new Date(agora - 10 * 60 * 1000).toISOString();
    expect(travaExpirada({ trava_em: dezMinutosAtras }, agora)).toBe(false);
  });

  it('retorna true se a trava expirou (acima do limite)', () => {
    const agora = Date.now();
    const noventaEUmMinutosAtras = new Date(agora - 91 * 60 * 1000).toISOString();
    expect(travaExpirada({ trava_em: noventaEUmMinutosAtras }, agora)).toBe(true);
  });

  it('retorna true se a trava estiver exatamente no limite', () => {
    const agora = Date.now();
    const noventaMinutosAtras = new Date(agora - 90 * 60 * 1000).toISOString();
    expect(travaExpirada({ trava_em: noventaMinutosAtras }, agora)).toBe(true);
  });

  it('respeita limite customizado', () => {
    const agora = Date.now();
    const cinquentaMinutosAtras = new Date(agora - 50 * 60 * 1000).toISOString();
    expect(travaExpirada({ trava_em: cinquentaMinutosAtras }, agora, 60)).toBe(false);
    expect(travaExpirada({ trava_em: cinquentaMinutosAtras }, agora, 30)).toBe(true);
  });
});

describe('classificarPendentes', () => {
  const agora = Date.parse('2026-10-12T12:00:00Z');
  const t = (codigo: string, extra: Partial<Task> = {}): Task =>
    ({
      codigo, status: 'pendente', executar: true, tentativas: 0, max_tentativas: 3,
      executar_apos: null, dependencias: [], excluido: false, ...extra,
    }) as Task;

  it('coloca cada pendente em um único grupo', () => {
    const tasks = [
      t('A'),
      t('B', { dependencias: ['C'] }),
      t('C', { executar: false }),
      t('D', { executar_apos: '2026-10-13T00:00:00Z' }),
      t('E', { tentativas: 3 }),
      t('F', { dependencias: ['G'] }),
      t('G', { status: 'concluida' }),
      t('H', { executar_apos: '2026-10-11T00:00:00Z' }),
      t('X', { excluido: true }),
    ];
    const g = classificarPendentes(tasks, agora);
    const cod = (l: Task[]) => l.map((x) => x.codigo);
    expect(cod(g.prontas)).toEqual(['A', 'F', 'H']);
    expect(cod(g.bloqueadas_dependencia)).toEqual(['B']);
    expect(cod(g.desligadas)).toEqual(['C']);
    expect(cod(g.agendadas)).toEqual(['D']);
    expect(cod(g.sem_tentativas)).toEqual(['E']);
  });
});

describe('diagnosticarFila', () => {
  const agora = Date.parse('2026-10-12T12:00:00Z');
  const min = (m: number) => new Date(agora - m * 60000).toISOString();
  const t = (codigo: string, extra: Partial<Task> = {}): Task =>
    ({
      codigo, status: 'pendente', executar: true, tentativas: 0, max_tentativas: 3,
      executar_apos: null, dependencias: [], excluido: false, trava_em: null, ...extra,
    }) as Task;

  it('ordena travas pela mais antiga e sinaliza alerta quando expirada', () => {
    const d = diagnosticarFila(
      [
        t('A', { status: 'em_execucao', trava_em: min(10) }),
        t('B', { status: 'em_execucao', trava_em: min(120) }),
        t('C', { status: 'em_execucao', trava_em: min(5), excluido: true }),
        t('D'),
      ],
      agora,
    );
    expect(d.travas.map((x) => x.task.codigo)).toEqual(['B', 'A']);
    expect(d.travas[0].expirada).toBe(true);
    expect(d.travas[1].expirada).toBe(false);
    expect(d.alerta).toBe(true);
    expect(d.pendentes.prontas.map((x) => x.codigo)).toEqual(['D']);
  });

  it('sem alerta quando nenhuma trava passou do limite', () => {
    const d = diagnosticarFila([t('A', { status: 'em_execucao', trava_em: min(30) })], agora, 60);
    expect(d.alerta).toBe(false);
    expect(d.travas[0].minutos).toBeCloseTo(30, 5);
  });
});
