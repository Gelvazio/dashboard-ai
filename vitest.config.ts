import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

// Testes: tests/unit (sempre) e tests/integration (só com PostgREST local; ver tests/README.md).
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ['tests/**/*.test.ts'],
      environment: 'node',
      testTimeout: 20_000,
    },
  }),
);
