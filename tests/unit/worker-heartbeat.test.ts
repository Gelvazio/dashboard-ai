import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { EventoWorker } from '../../worker/eventos.js';
import { INTERVALO_HEARTBEAT_MS, iniciarHeartbeat } from '../../worker/heartbeat.js';

describe('iniciarHeartbeat', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const emissor = () => {
    const eventos: EventoWorker[] = [];
    return { eventos, emitir: vi.fn(async (e: EventoWorker) => (eventos.push(e), true)) };
  };

  it('emite heartbeat ao iniciar e a cada intervalo (padrão 30 s)', async () => {
    const { eventos, emitir } = emissor();
    const parar = iniciarHeartbeat({ agente: 'Worker 1', projeto: 'meu-app', emitir });
    await vi.advanceTimersByTimeAsync(0);
    expect(eventos).toHaveLength(1);
    expect(eventos[0]).toEqual({ projeto: 'meu-app', agente: 'Worker 1', tipo: 'heartbeat', status: 'livre' });

    expect(INTERVALO_HEARTBEAT_MS).toBe(30_000);
    await vi.advanceTimersByTimeAsync(30_000 * 2);
    expect(eventos).toHaveLength(3);
    parar();
  });

  it('inclui a task e a etapa atuais informadas pelo callback', async () => {
    const { eventos, emitir } = emissor();
    let posicao: { taskId?: number; etapa?: string } | undefined;
    const parar = iniciarHeartbeat({ agente: 'W', projeto: 'p', intervaloMs: 1000, emitir, atual: () => posicao });
    await vi.advanceTimersByTimeAsync(0);
    posicao = { taskId: 7, etapa: 'executar' };
    await vi.advanceTimersByTimeAsync(1000);
    expect(eventos[0]).not.toHaveProperty('taskId');
    expect(eventos[1]).toMatchObject({ tipo: 'heartbeat', taskId: 7, etapa: 'executar', status: 'ocupado' });
    parar();
  });

  it('a função devolvida para o heartbeat (e pode ser chamada de novo)', async () => {
    const { emitir } = emissor();
    const parar = iniciarHeartbeat({ agente: 'W', projeto: 'p', intervaloMs: 1000, emitir });
    await vi.advanceTimersByTimeAsync(2000);
    expect(emitir).toHaveBeenCalledTimes(3);
    parar();
    parar();
    await vi.advanceTimersByTimeAsync(5000);
    expect(emitir).toHaveBeenCalledTimes(3);
  });

  it('falhas do emissor ou do callback não derrubam o heartbeat', async () => {
    const emitir = vi.fn(async () => {
      throw new Error('offline');
    });
    const parar = iniciarHeartbeat({
      agente: 'W',
      projeto: 'p',
      intervaloMs: 1000,
      emitir,
      atual: () => {
        throw new Error('estado indisponível');
      },
    });
    await vi.advanceTimersByTimeAsync(1000);
    expect(emitir).toHaveBeenCalledTimes(2);
    parar();
  });
});
