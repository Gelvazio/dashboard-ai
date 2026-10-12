import { describe, expect, it } from 'vitest';
import { agruparPorDia, duracaoDoLog, formatarDuracao } from '@/lib/logs';

describe('lib/logs', () => {
  it('formata durações', () => {
    expect(formatarDuracao(850)).toBe('850 ms');
    expect(formatarDuracao(42_000)).toBe('42 s');
    expect(formatarDuracao(75_000)).toBe('1 min 15 s');
    expect(formatarDuracao(120_000)).toBe('2 min');
    expect(formatarDuracao(3_900_000)).toBe('1 h 5 min');
    expect(formatarDuracao(null)).toBe('—');
  });
  it('duração por início/fim', () => {
    expect(duracaoDoLog({ duracao_ms: null, inicio_em: '2026-10-11T10:00:00Z', fim_em: '2026-10-11T10:01:00Z' })).toBe(60_000);
    expect(duracaoDoLog({ duracao_ms: 5, inicio_em: null, fim_em: null })).toBe(5);
    expect(duracaoDoLog({ duracao_ms: null, inicio_em: null, fim_em: null })).toBeNull();
  });
  it('agrupa por dia mantendo a ordem', () => {
    const g = agruparPorDia([{ data_hora: '2026-10-11T15:00:00Z' }, { data_hora: '2026-10-11T14:00:00Z' }, { data_hora: '2026-10-09T15:00:00Z' }]);
    expect(g).toHaveLength(2);
    expect(g[0][1]).toHaveLength(2);
  });
});
