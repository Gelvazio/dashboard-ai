import { useState, type ReactNode } from 'react';
import type { ViewId } from '@/types';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface Props {
  view: ViewId;
  titulo: string;
  onNavegar: (v: ViewId) => void;
  children: ReactNode;
}

/** Casca responsiva do Dashboard: sidebar + header + conteúdo da tela. */
export function AppLayout({ view, titulo, onNavegar, children }: Props) {
  const [menuAberto, setMenuAberto] = useState(false);
  return (
    <div className="flex min-h-screen">
      <Sidebar view={view} onNavegar={onNavegar} aberta={menuAberto} onFechar={() => setMenuAberto(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header titulo={titulo} onAbrirMenu={() => setMenuAberto(true)} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
