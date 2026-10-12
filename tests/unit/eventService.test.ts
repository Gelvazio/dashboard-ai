import { describe, expect, it, vi } from 'vitest';
import { assinarEventos, atividadeAtual, listarEventos } from '@/services/eventService';
import { ServiceError, type DashboardClient } from '@/services/supabase';

/** Query builder falso: registra as chamadas e resolve com `resultado`. */
function consultaFalsa(resultado: { data: unknown; error: unknown }) {
  const chamadas: [string, unknown[]][] = [];
  const q: Record<string, unknown> = {};
  for (const m of ['select', 'eq', 'gte', 'order', 'limit']) {
    q[m] = (...args: unknown[]) => {
      chamadas.push([m, args]);
      return q;
    };
  }
  q.then = (ok: (v: unknown) => unknown, erro?: (e: unknown) => unknown) => Promise.resolve(resultado).then(ok, erro);
  return { q, chamadas };
}

describe('services/eventService — listarEventos', () => {
  it('aplica projeto, filtros, ordenação e limite', async () => {
    const { q, chamadas } = consultaFalsa({ data: [{ id: 1 }], error: null });
    const from = vi.fn().mockReturnValue(q);
    const client = { from } as unknown as DashboardClient;
    const r = await listarEventos(7, { desde: '2026-10-12T00:00:00Z', agente: ' Clone 09 ', limite: 5000 }, client);
    expect(r).toEqual([{ id: 1 }]);
    expect(from).toHaveBeenCalledWith('agent_events');
    expect(chamadas).toEqual([
      ['select', ['*']],
      ['eq', ['project_id', 7]],
      ['gte', ['created_at', '2026-10-12T00:00:00Z']],
      ['eq', ['agente', 'Clone 09']],
      ['order', ['created_at', { ascending: false }]],
      ['order', ['id', { ascending: false }]],
      ['limit', [1000]],
    ]);
  });

  it('limite padrão 200 e mínimo 1', async () => {
    const a = consultaFalsa({ data: [], error: null });
    await listarEventos(1, {}, { from: () => a.q } as unknown as DashboardClient);
    expect(a.chamadas.at(-1)).toEqual(['limit', [200]]);
    const b = consultaFalsa({ data: [], error: null });
    await listarEventos(1, { limite: 0 }, { from: () => b.q } as unknown as DashboardClient);
    expect(b.chamadas.at(-1)).toEqual(['limit', [1]]);
  });

  it('data inválida em "desde" gera ServiceError sem consultar', async () => {
    const from = vi.fn();
    await expect(listarEventos(1, { desde: 'ontem' }, { from } as unknown as DashboardClient)).rejects.toBeInstanceOf(
      ServiceError,
    );
    expect(from).not.toHaveBeenCalled();
  });
});

describe('services/eventService — atividadeAtual', () => {
  it('chama a RPC e ordena por ultimo_em desc', async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [
        { agente: 'A', ultimo_em: '2026-10-12T01:00:00Z' },
        { agente: 'B', ultimo_em: '2026-10-12T03:00:00Z' },
        { agente: 'C', ultimo_em: '2026-10-12T02:00:00Z' },
      ],
      error: null,
    });
    const r = await atividadeAtual(3, { rpc } as unknown as DashboardClient);
    expect(rpc).toHaveBeenCalledWith('atividade_atual_agentes', { p_project_id: 3 });
    expect(r.map((a) => a.agente)).toEqual(['B', 'C', 'A']);
  });

  it('erro da RPC vira ServiceError', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: 'falhou' } });
    await expect(atividadeAtual(3, { rpc } as unknown as DashboardClient)).rejects.toBeInstanceOf(ServiceError);
  });
});

describe('services/eventService — assinarEventos', () => {
  it('cria o canal com filtro do projeto, repassa eventos e status e remove ao cancelar', () => {
    let handler: ((p: { new: unknown }) => void) | undefined;
    let statusCb: ((s: string, e?: Error) => void) | undefined;
    const canal = {
      on: vi.fn((_tipo: string, _cfg: unknown, cb: (p: { new: unknown }) => void) => {
        handler = cb;
        return canal;
      }),
      subscribe: vi.fn((cb: (s: string, e?: Error) => void) => {
        statusCb = cb;
        return canal;
      }),
    };
    const channel = vi.fn().mockReturnValue(canal);
    const removeChannel = vi.fn().mockResolvedValue('ok');
    const client = { channel, removeChannel } as unknown as DashboardClient;
    const onEvento = vi.fn();
    const onStatus = vi.fn();

    const cancelar = assinarEventos(42, { onEvento, onStatus }, client);

    expect(channel).toHaveBeenCalledWith('agent_events:42');
    expect(canal.on).toHaveBeenCalledWith(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'agent_events', filter: 'project_id=eq.42' },
      expect.any(Function),
    );
    handler?.({ new: { id: 9, agente: 'X' } });
    expect(onEvento).toHaveBeenCalledWith({ id: 9, agente: 'X' });
    statusCb?.('SUBSCRIBED');
    const erro = new Error('caiu');
    statusCb?.('CHANNEL_ERROR', erro);
    expect(onStatus).toHaveBeenNthCalledWith(1, 'SUBSCRIBED', undefined);
    expect(onStatus).toHaveBeenNthCalledWith(2, 'CHANNEL_ERROR', erro);

    expect(removeChannel).not.toHaveBeenCalled();
    cancelar();
    expect(removeChannel).toHaveBeenCalledWith(canal);
  });
});
