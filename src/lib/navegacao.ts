import type { ViewId } from '@/types';

export const VIEW_IDS: readonly ViewId[] = [
  'fila',
  'memoria',
  'logs',
  'monitor',
  'configuracoes',
  'projetos',
];
export const VIEW_PADRAO: ViewId = 'fila';

/** Lê a tela atual do hash (`#/memoria`). Valores desconhecidos caem na tela padrão. */
export function viewDoHash(hash: string): ViewId {
  const id = hash.replace(/^#\/?/, '').split(/[/?]/)[0];
  return (VIEW_IDS as readonly string[]).includes(id) ? (id as ViewId) : VIEW_PADRAO;
}

export const hashDaView = (view: ViewId) => `#/${view}`;

export type Tema = 'claro' | 'escuro' | 'sistema';

/** Tema efetivo: 'sistema' segue a preferência do sistema operacional. */
export function temaEscuro(tema: Tema, sistemaEscuro: boolean): boolean {
  return tema === 'escuro' || (tema === 'sistema' && sistemaEscuro);
}

/** Próximo tema do botão (claro -> escuro -> sistema -> claro). */
export function proximoTema(tema: Tema): Tema {
  return tema === 'claro' ? 'escuro' : tema === 'escuro' ? 'sistema' : 'claro';
}
