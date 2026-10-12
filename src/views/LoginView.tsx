import { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AlertTriangle } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RecuperarAcesso } from '@/components/auth/RecuperarAcesso';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { supabaseConfigurado } from '@/services/supabase';

export interface LoginViewProps {
  /** Chamado após entrar com e-mail e senha (a guarda de rota troca para o app). */
  onEntrou?: (sessao: Session) => void;
}

/**
 * Tela de login em página cheia, fora do `AppLayout` (SUB-27.11): marca do produto,
 * `LoginForm`, alternativas de acesso (`RecuperarAcesso`), alternância de tema e
 * aviso quando o Supabase não está configurado no `.env`.
 */
export function LoginView({ onEntrou }: LoginViewProps) {
  const [email, setEmail] = useState('');

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-slate-50 px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <main className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="grid size-12 place-items-center rounded-xl bg-brand-600 text-lg font-bold text-white shadow-sm" aria-hidden>
            D
          </span>
          <div>
            <h1 className="text-xl font-semibold">Dashboard AI</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Fila de tarefas, memória persistente e monitor dos agentes de IA.
            </p>
          </div>
        </div>

        {!supabaseConfigurado && (
          <div
            role="alert"
            className="mb-4 flex gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>
              Supabase não configurado: defina <code className="font-mono text-xs">VITE_SUPABASE_URL</code> e{' '}
              <code className="font-mono text-xs">VITE_SUPABASE_ANON_KEY</code> no <code className="font-mono text-xs">.env</code> (veja o{' '}
              <code className="font-mono text-xs">.env.example</code>) e reinicie o servidor.
            </p>
          </div>
        )}

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900" aria-label="Entrar">
          <LoginForm onEntrou={onEntrou} onEmailChange={setEmail} />
          <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800">
            <RecuperarAcesso email={email} />
          </div>
        </section>
      </main>
    </div>
  );
}
