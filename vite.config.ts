import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Frontend (SPA) do Dashboard AI. As funções serverless ficam em api/ (Vercel) e
// têm tsconfig próprio (api/tsconfig.json); o Vite só empacota src/.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: { outDir: 'dist', sourcemap: true },
});
