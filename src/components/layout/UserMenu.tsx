/**
 * Menu do usuário logado no header: e-mail, selo Admin (papel global) e botão Sair.
 * Precisa estar dentro do `AuthProvider` e do `ToastProvider`. Sem sessão, não renderiza nada.
 */
import { useState } from 'react';
import { LogOut, ShieldCheck, UserCircle2 } from 'lucide-react';
import { Botao } from '@/components/ui/Botao';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export function UserMenu() {
  const { usuario, papelGlobal, sair } = useAuth();
  const toast = useToast();
  const [saindo, setSaindo] = useState(false);

  if (!usuario) return null;

  async function aoSair() {
    setSaindo(true);
    try {
      await sair();
      toast.sucesso('Você saiu da sua conta.');
    } catch (e) {
      toast.erro((e as Error).message);
    } finally {
      setSaindo(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <UserCircle2 className="size-5 shrink-0 text-slate-500" aria-hidden />
      <span className="hidden max-w-[16rem] truncate text-sm text-slate-700 sm:inline dark:text-slate-200" title={usuario.email ?? undefined}>
        {usuario.email ?? 'Usuário'}
      </span>
      {papelGlobal === 'admin' && (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
          <ShieldCheck className="size-3.5" aria-hidden />
          Admin
        </span>
      )}
      <Botao variante="fantasma" carregando={saindo} onClick={() => void aoSair()} aria-label="Sair da conta">
        {!saindo && <LogOut className="size-4" aria-hidden />}
        <span className="hidden sm:inline">Sair</span>
      </Botao>
    </div>
  );
}
