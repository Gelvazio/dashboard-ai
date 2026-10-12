/**
 * Formulário de login (e-mail + senha) com validação local e erro acessível.
 * A recuperação de acesso fica em `RecuperarAcesso` (a tela compõe os dois).
 */
import { useId, useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Eye, EyeOff } from 'lucide-react';
import { Botao } from '@/components/ui/Botao';
import { validarLogin } from '@/lib/auth';
import { entrarComSenha } from '@/services/authService';

export interface LoginFormProps {
  /** Chamado após entrar com sucesso. */
  onEntrou?: (sessao: Session) => void;
  /** Avisa o e-mail digitado (usado pelo `RecuperarAcesso`). */
  onEmailChange?: (email: string) => void;
}

const CAMPO =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';

export function LoginForm({ onEntrou, onEmailChange }: LoginFormProps) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [erros, setErros] = useState<Partial<Record<'email' | 'senha', string>>>({});
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const v = validarLogin({ email, senha });
    setErros(v);
    setErro(null);
    if (Object.keys(v).length) return;
    setCarregando(true);
    try {
      const sessao = await entrarComSenha(email, senha);
      setSenha('');
      onEntrou?.(sessao);
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={(e) => void enviar(e)} noValidate className="space-y-4">
      <div className="space-y-1">
        <label htmlFor={`${id}-email`} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          E-mail
        </label>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            onEmailChange?.(e.target.value);
          }}
          aria-invalid={Boolean(erros.email)}
          aria-describedby={erros.email ? `${id}-email-erro` : undefined}
          className={CAMPO}
        />
        {erros.email && (
          <p id={`${id}-email-erro`} className="text-xs text-rose-600 dark:text-rose-400">
            {erros.email}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor={`${id}-senha`} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Senha
        </label>
        <div className="relative">
          <input
            id={`${id}-senha`}
            type={verSenha ? 'text' : 'password'}
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            aria-invalid={Boolean(erros.senha)}
            aria-describedby={erros.senha ? `${id}-senha-erro` : undefined}
            className={`${CAMPO} pr-10`}
          />
          <button
            type="button"
            onClick={() => setVerSenha((v) => !v)}
            aria-label={verSenha ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={verSenha}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            {verSenha ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        </div>
        {erros.senha && (
          <p id={`${id}-senha-erro`} className="text-xs text-rose-600 dark:text-rose-400">
            {erros.senha}
          </p>
        )}
      </div>

      {erro && (
        <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {erro}
        </p>
      )}

      <Botao type="submit" variante="primario" carregando={carregando} className="w-full">
        Entrar
      </Botao>
    </form>
  );
}
