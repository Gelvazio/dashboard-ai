import type { ViewId } from '@/types';

/** Metadados de navegação das telas. */
export const VIEWS: ReadonlyArray<{ id: ViewId; titulo: string }> = [
  { id: 'fila', titulo: 'Fila de Tarefas' },
  { id: 'memoria', titulo: 'Cérebro de Memória' },
  { id: 'logs', titulo: 'Logs do Agendador' },
  { id: 'monitor', titulo: 'Monitor dos Agentes' },
  { id: 'configuracoes', titulo: 'Configurações' },
];

export const tituloDaView = (id: ViewId) => VIEWS.find((v) => v.id === id)?.titulo ?? id;
