/**
 * Bug da SUB-35.32: os gráficos de barras do monitor (`new Chart(..., { type: 'bar' })`)
 * quebravam com `"bar" is not a registered controller` porque `src/lib/charts.ts`
 * registrava o `BarElement`, mas não o `BarController`.
 */
import { describe, expect, it } from 'vitest';
import { Chart } from '@/lib/charts';

describe('registro do Chart.js (src/lib/charts.ts)', () => {
  it('registra o controller de barras usado por GraficoPorAgente e LinhaDoTempoAgentes', () => {
    expect(() => Chart.registry.getController('bar')).not.toThrow();
  });
});
