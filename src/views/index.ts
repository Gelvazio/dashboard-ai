/**
 * Telas (páginas) do Dashboard, uma por item de navegação. Cada tela lê o projeto
 * selecionado (`useProjetoAtual`) e compõe `components/` + `hooks/`.
 *
 * SUB-34.2: Telas carregadas sob demanda com React.lazy para code splitting.
 */
import { lazy } from 'react';
import type { ComponentType } from 'react';
import type { ViewId } from '@/types';

export { VIEWS, tituloDaView } from './meta';

// SUB-34.2: Lazy loading das telas para code splitting
const FilaView = lazy(() => import('./FilaView').then((m) => ({ default: m.FilaView })));
const MemoriaView = lazy(() => import('./MemoriaView').then((m) => ({ default: m.MemoriaView })));
const LogsView = lazy(() => import('./LogsView').then((m) => ({ default: m.LogsView })));
const MonitorView = lazy(() => import('./MonitorView').then((m) => ({ default: m.MonitorView })));
const ConfiguracoesView = lazy(() => import('./ConfiguracoesView').then((m) => ({ default: m.ConfiguracoesView })));
const ProjetosView = lazy(() => import('./ProjetosView').then((m) => ({ default: m.ProjetosView })));

export const TELAS: Record<ViewId, ComponentType> = {
  fila: FilaView,
  memoria: MemoriaView,
  logs: LogsView,
  monitor: MonitorView,
  configuracoes: ConfiguracoesView,
  projetos: ProjetosView,
};
