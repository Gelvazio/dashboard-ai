/**
 * Tailwind CSS v4 — configuração JS carregada por `@config` em src/index.css.
 * Os tokens de cor e tipografia principais ficam no `@theme` do CSS; aqui ficam
 * as fontes de conteúdo e extensões compartilhadas.
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 23 42 / 0.06), 0 1px 3px 0 rgb(15 23 42 / 0.10)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out both',
      },
    },
  },
};
