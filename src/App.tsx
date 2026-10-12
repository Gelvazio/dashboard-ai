import { Suspense, type ReactNode } from 'react';
import { RotaProtegida } from '@/components/auth/RotaProtegida';
import { AppLayout } from '@/components/layout/AppLayout';
import { CarregandoTela } from '@/components/ui/CarregandoTela';
import { AuthProvider } from '@/hooks/AuthContext';
import { ProjetoProvider } from '@/hooks/ProjetoContext';
import { ToastProvider } from '@/hooks/ToastContext';
import { useAuth } from '@/hooks/useAuth';
import { useNavegacao } from '@/hooks/useNavegacao';
import { TELAS, tituloDaView } from '@/views';

/**
 * `ProjetoProvider` remontado a cada troca de usuário (`key`), para a lista de
 * projetos (filtrada pela RLS) e a seleção serem recarregadas para quem entrou.
 */
function ProjetoDoUsuario({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  return <ProjetoProvider key={usuario?.id ?? 'anonimo'}>{children}</ProjetoProvider>;
}

/** Tela atual (pelo hash da URL) dentro do layout. */
function Dashboard() {
  const { view, navegar } = useNavegacao();
  const Tela = TELAS[view];
  return (
    <AppLayout view={view} titulo={tituloDaView(view)} onNavegar={navegar}>
      {/* Telas são lazy (SUB-34.2): o fallback aparece enquanto o chunk da tela carrega (SUB-34.6). */}
      <Suspense fallback={<CarregandoTela mensagem="Carregando tela..." />}>
        <Tela />
      </Suspense>
    </AppLayout>
  );
}

/**
 * Raiz da aplicação: avisos + sessão do Supabase Auth (SUB-27.13). Sem sessão a
 * `RotaProtegida` mostra o login; com sessão, contexto do projeto + layout + tela atual.
 */
export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RotaProtegida>
          <ProjetoDoUsuario>
            <Dashboard />
          </ProjetoDoUsuario>
        </RotaProtegida>
      </AuthProvider>
    </ToastProvider>
  );
}
