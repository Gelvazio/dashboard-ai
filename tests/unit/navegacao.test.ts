import { describe, expect, it } from 'vitest';
import { hashDaView, proximoTema, temaEscuro, viewDoHash } from '@/lib/navegacao';

describe('navegação e tema', () => {
  it('lê a tela do hash, com padrão para valores desconhecidos', () => {
    expect(viewDoHash('#/memoria')).toBe('memoria');
    expect(viewDoHash('#logs')).toBe('logs');
    expect(viewDoHash('#/configuracoes?x=1')).toBe('configuracoes');
    expect(viewDoHash('')).toBe('fila');
    expect(viewDoHash('#/nao-existe')).toBe('fila');
    expect(hashDaView('logs')).toBe('#/logs');
    expect(viewDoHash('#/monitor')).toBe('monitor');
    expect(hashDaView('monitor')).toBe('#/monitor');
  });

  it('tema efetivo e ciclo do botão', () => {
    expect(temaEscuro('escuro', false)).toBe(true);
    expect(temaEscuro('claro', true)).toBe(false);
    expect(temaEscuro('sistema', true)).toBe(true);
    expect(proximoTema('claro')).toBe('escuro');
    expect(proximoTema('escuro')).toBe('sistema');
    expect(proximoTema('sistema')).toBe('claro');
  });
});
