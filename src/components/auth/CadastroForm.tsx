/**
 * Formulário de cadastro ("Criar usuário"): nome, e-mail, senha e confirmação.
 * Usa o Supabase Auth (`signUp`); o papel do usuário é decidido só pelo banco.
 */
import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Botao } from '@/components/ui/Botao';
import { urlDeRetorno, validarCadastro, type DadosCadastro } from '@/lib/auth';
import { cadastrarUsuario } from '@/services/authService';

export interface CadastroFormProps {
  /** Chamado após criar o usuário com sucesso. */
  onCadastrou?: () => void;
  /** Volta para o formulário de login ("Já tenho conta — Entrar"). */
  onVoltar?: () => void;
}

type Campo = keyof DadosCadastro;

const CAMPO =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';

const AVISO_CONFIRMAR = 'Usuário criado. Confira seu e-mail para confirmar o cadastro e depois entre.';
const AVISO_CRIADO = 'Usuário criado. Você já pode entrar.';

const VAZIO: DadosCadastro = { nome: '', email: '', senha: '', confirmacao: '' };

interface CampoCadastroProps {
  id: string;
  rotulo: string;
  erro?: string;
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode;
}

/** Rótulo + campo + mensagem de erro acessível (`aria-invalid`/`aria-describedby`). */
function CampoCadastro({ id, rotulo, erro, children }: CampoCadastroProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
        {rotulo}
      </label>
      {children({ id, 'aria-invalid': Boolean(erro), 'aria-describedby': erro ? `${id}-erro` : undefined })}
      {erro && (
        <p id={`${id}-erro`} className="text-xs text-rose-600 dark:text-rose-400">
          {erro}
        </p>
      )}
    </div>
  );
}

export function CadastroForm({ onCadastrou, onVoltar }: CadastroFormProps) {
  const id = useId();
  const [dados, setDados] = useState<DadosCadastro>(VAZIO);
  const [verSenha, setVerSenha] = useState(false);
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const alterar = (campo: Campo) => (valor: string) => setDados((d) => ({ ...d, [campo]: valor }));

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const v = validarCadastro(dados);
    setErros(v);
    setErro(null);
    setAviso(null);
    if (Object.keys(v).length) return;
    setCarregando(true);
    try {
      const { precisaConfirmar } = await cadastrarUsuario({
        ...dados,
        redirectTo: urlDeRetorno(window.location),
      });
      setDados((d) => ({ ...d, senha: '', confirmacao: '' }));
      setAviso(precisaConfirmar ? AVISO_CONFIRMAR : AVISO_CRIADO);
      onCadastrou?.();
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setCarregando(false);
    }
  }

  const tipoSenha = verSenha ? 'text' : 'password';
  const botaoVerSenha = (
    <button
      type="button"
      onClick={() => setVerSenha((v) => !v)}
      aria-label={verSenha ? 'Ocultar senha' : 'Mostrar senha'}
      aria-pressed={verSenha}
      className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
    >
      {verSenha ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
    </button>
  );

  return (
    <form onSubmit={(e) => void enviar(e)} noValidate className="space-y-4">
      <CampoCadastro id={`${id}-nome`} rotulo="Nome" erro={erros.nome}>
        {(a11y) => (
          <input {...a11y} type="text" autoComplete="name" value={dados.nome} onChange={(e) => alterar('nome')(e.target.value)} className={CAMPO} />
        )}
      </CampoCadastro>

      <CampoCadastro id={`${id}-email`} rotulo="E-mail" erro={erros.email}>
        {(a11y) => (
          <input {...a11y} type="email" autoComplete="email" value={dados.email} onChange={(e) => alterar('email')(e.target.value)} className={CAMPO} />
        )}
      </CampoCadastro>

      <CampoCadastro id={`${id}-senha`} rotulo="Senha" erro={erros.senha}>
        {(a11y) => (
          <div className="relative">
            <input {...a11y} type={tipoSenha} autoComplete="new-password" value={dados.senha} onChange={(e) => alterar('senha')(e.target.value)} className={`${CAMPO} pr-10`} />
            {botaoVerSenha}
          </div>
        )}
      </CampoCadastro>

      <CampoCadastro id={`${id}-confirmacao`} rotulo="Confirmar senha" erro={erros.confirmacao}>
        {(a11y) => (
          <input {...a11y} type={tipoSenha} autoComplete="new-password" value={dados.confirmacao} onChange={(e) => alterar('confirmacao')(e.target.value)} className={CAMPO} />
        )}
      </CampoCadastro>

      {erro && (
        <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {erro}
        </p>
      )}
      {aviso && (
        <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          {aviso}
        </p>
      )}

      <Botao type="submit" variante="primario" carregando={carregando} className="w-full">
        Criar usuário
      </Botao>
      {onVoltar && (
        <button type="button" onClick={onVoltar} className="w-full text-center text-sm text-brand-600 hover:underline dark:text-brand-400">
          Já tenho conta — Entrar
        </button>
      )}
    </form>
  );
}
