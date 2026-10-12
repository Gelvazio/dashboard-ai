/**
 * Telas (páginas) do Dashboard, uma por item de navegação: Fila de Tasks,
 * Cérebro de Memória, Logs do Agendador e Configurações. Cada tela recebe o
 * projeto selecionado do contexto e compõe `components/` + `hooks/`.
 */
import type { ViewId } from '@/types';

/** Metadados de navegação das telas (rótulos usados pelo layout da SUB-12). */
export const VIEWS: ReadonlyArray<{ id: ViewId; titulo: string }> = [
  { id: 'fila', titulo: 'Fila de Tarefas' },
  { id: 'memoria', titulo: 'Cérebro de Memória' },
  { id: 'logs', titulo: 'Logs do Agendador' },
  { id: 'configuracoes', titulo: 'Configurações' },
];
