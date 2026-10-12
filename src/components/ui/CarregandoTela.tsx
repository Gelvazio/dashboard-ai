/**
 * Fallback leve para Suspense (SUB-34.1).
 *
 * Componente sem dependências pesadas (não importa lucide-react nem
 * componentes complexos), apenas HTML + CSS para evitar carregar
 * bibliotecas desnecessárias durante o lazy loading.
 */
export function CarregandoTela({ mensagem = 'Carregando...' }: { mensagem?: string }) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center p-4"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="relative">
        {/* Spinner CSS puro (sem dependências externas) */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600 dark:border-slate-700 dark:border-t-slate-300" />
      </div>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{mensagem}</p>
    </div>
  );
}
