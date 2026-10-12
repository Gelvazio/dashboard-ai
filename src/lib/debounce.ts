/**
 * Função debounce (SUB-19.1).
 *
 * Adia a execução de uma função até que passe um período de inatividade.
 * Útil para chamadas de API, eventos de digitação, etc.
 */

export interface DebouncedFunction<A extends unknown[]> {
  (...args: A): void;
  cancelar(): void;
}

/**
 * Cria uma função debounced que adia a execução de `fn` até que
 * passem `ms` milissegundos sem novas chamadas.
 *
 * @param fn - Função a ser executada
 * @param ms - Tempo de espera em milissegundos
 * @returns Função debounced com método `cancelar()` para cancelar
 */
export function debounce<A extends unknown[]>(fn: (...args: A) => void, ms: number): DebouncedFunction<A> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (...args: A) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, ms);
  } as DebouncedFunction<A>;

  debounced.cancelar = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}
