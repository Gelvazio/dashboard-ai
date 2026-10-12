import { describe, it, expect } from 'vitest';
import { segmentosLinhaDoTempo } from '@/lib/monitor';

describe('segmentosLinhaDoTempo', () => {
  const agora = Date.parse('2026-10-12T12:00:00Z');
  const evt = (tipo: string, execucao: string, etapa: string | null, minutosAtras: number) => ({
    agente: 'Claude',
    execucao_id: execucao,
    etapa,
    tipo,
    created_at: new Date(agora - minutosAtras * 60000).toISOString(),
  }) as const;

  it('cria segmento aberto para inicio', () => {
    const eventos = [evt('inicio', 'e1', 'planejar', 5)];
    const s = segmentosLinhaDoTempo(eventos, agora);
    expect(s).toHaveLength(1);
    expect(s[0].agente).toBe('Claude');
    expect(s[0].etapa).toBe('planejar');
    expect(s[0].status).toBe('aberta');
    expect(s[0].fim).toBe(agora);
  });

  it('fecha segmento com fim', () => {
    const eventos = [evt('inicio', 'e1', 'planejar', 10), evt('fim', 'e1', 'planejar', 5)];
    const s = segmentosLinhaDoTempo(eventos, agora);
    expect(s[0].status).toBe('concluida');
    expect(s[0].fim).toBe(agora - 5 * 60000);
  });

  it('fecha segmento com erro', () => {
    const eventos = [evt('inicio', 'e1', 'executar', 10), evt('erro', 'e1', 'executar', 5)];
    const s = segmentosLinhaDoTempo(eventos, agora);
    expect(s[0].status).toBe('erro');
  });

  it('ignora eventos sem inicio correspondente', () => {
    const eventos = [evt('fim', 'e1', 'planejar', 5)];
    const s = segmentosLinhaDoTempo(eventos, agora);
    expect(s).toHaveLength(0);
  });

  it('ignora datas inválidas', () => {
    const eventos = [{ agente: 'Claude', execucao_id: 'e1', etapa: 'planejar', tipo: 'inicio', created_at: 'invalid' }] as const;
    const s = segmentosLinhaDoTempo(eventos, agora);
    expect(s).toHaveLength(0);
  });
});
