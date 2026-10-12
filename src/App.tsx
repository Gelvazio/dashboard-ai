import { Brain, ListTodo, ScrollText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VIEWS } from '@/views';

/**
 * Casca inicial do Dashboard AI. O layout real (sidebar, header com seletor de
 * projeto, abas de Fila, Memória, Logs e Configurações) chega na SUB-12.
 */
const MODULOS = [
  { icone: ListTodo, titulo: 'Fila de tasks', texto: 'Prioridade, dependências, travas e tentativas por projeto.' },
  { icone: Brain, titulo: 'Memória', texto: 'Decisões e regras com busca semântica (pgvector).' },
  { icone: ScrollText, titulo: 'Agendador', texto: 'Histórico de execuções dos agentes de IA.' },
];

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
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {MODULOS.map(({ icone: Icone, titulo, texto }, i) => (
            <li key={titulo} className={cn('rounded-lg border border-slate-200 p-4 dark:border-slate-800', i === 0 && 'border-brand-300 dark:border-brand-700')}>
              <Icone aria-hidden className="size-5 text-brand-600 dark:text-brand-400" />
              <p className="mt-2 font-medium">{titulo}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{texto}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-slate-500">Telas: {VIEWS.map((v) => v.titulo).join(' · ')}</p>
      </section>
    </main>
  );
}
