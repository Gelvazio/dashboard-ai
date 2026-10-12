/**
 * Telas (páginas) do Dashboard, uma por item de navegação. Cada tela lê o projeto
 * selecionado (`useProjetoAtual`) e compõe `components/` + `hooks/`.
 */
import type { ComponentType } from 'react';
import type { ViewId } from '@/types';
import { ConfiguracoesView } from './ConfiguracoesView';
import { FilaView } from './FilaView';
import { LogsView } from './LogsView';
import { MemoriaView } from './MemoriaView';

export { VIEWS, tituloDaView } from './meta';

export const TELAS: Record<ViewId, ComponentType> = {
  fila: FilaView,
  memoria: MemoriaView,
  logs: LogsView,
  configuracoes: ConfiguracoesView,
};
