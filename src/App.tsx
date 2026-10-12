import { AppLayout } from '@/components/layout/AppLayout';
import { ProjetoProvider } from '@/hooks/ProjetoContext';
import { useNavegacao } from '@/hooks/useNavegacao';
import { TELAS, tituloDaView } from '@/views';

/** Raiz da aplicação: contexto do projeto + layout + tela atual (pelo hash da URL). */
export default function App() {
  const { view, navegar } = useNavegacao();
  const Tela = TELAS[view];
  return (
    <ProjetoProvider>
      <AppLayout view={view} titulo={tituloDaView(view)} onNavegar={navegar}>
        <Tela />
      </AppLayout>
    </ProjetoProvider>
  );
}
