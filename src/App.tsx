/**
 * Casca inicial do Dashboard AI. O layout real (sidebar, header com seletor de
 * projeto, abas de Fila, Memória, Logs e Configurações) chega na SUB-12.
 */
export default function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-4 p-8">
      <section className="card animate-fade-in p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
          Dashboard AI
        </p>
        <h1 className="mt-2 text-3xl font-bold">Gerenciador de tasks de IA</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Fila com travas e dependências, memória persistente semântica e monitor do agendador — para
          qualquer projeto.
        </p>
      </section>
    </main>
  );
}
