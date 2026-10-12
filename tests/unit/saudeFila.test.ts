import { describe, it, expect } from 'vitest';
import { LIMITE_TRAVA_MIN, minutosDeTrava, travaExpirada } from '@/lib/saudeFila';

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
