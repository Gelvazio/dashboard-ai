import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from '@/lib/debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('executa a função após o tempo especificado', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn('arg1', 'arg2');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('reinicia o timer se chamado novamente antes do tempo', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn('call1');
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();

    debouncedFn('call2');
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('call2');
  });

  it('o método cancelar impede a execução', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    debouncedFn.cancelar();

    vi.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();
  });

  it('pode ser chamado múltiplas vezes após cancelar', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    debouncedFn.cancelar();
    vi.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();

    debouncedFn('nova');
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('nova');
  });

  it('funciona com múltiplos argumentos', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 50);

    debouncedFn(1, 2, 3, 'test');
    vi.advanceTimersByTime(50);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1, 2, 3, 'test');
  });

  it('preserva o contexto (this)', () => {
    const obj = {
      value: 42,
      method: vi.fn(function(this: any) {
        return this.value;
      }),
    };

    const debouncedMethod = debounce(obj.method.bind(obj), 50);
    debouncedMethod();
    vi.advanceTimersByTime(50);

    expect(obj.method).toHaveBeenCalled();
  });
});
