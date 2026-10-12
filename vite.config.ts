import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Frontend (SPA) do Dashboard AI. As funções serverless ficam em api/ (Vercel) e
// têm tsconfig próprio (api/tsconfig.json); o Vite só empacota src/.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5173 },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // SUB-34.4: Separar dependências grandes em chunks próprios (Vite 8/Rolldown)
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Supabase e suas dependências em chunk separado
          if (id.includes('@supabase/supabase-js')) {
            return 'supabase';
          }
          // React e ReactDOM em chunk separado
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          // Lucide icons em chunk separado
          if (id.includes('lucide-react')) {
            return 'icons';
          }
        },
      },
    },
  },
});
