import { useContext } from 'react';
import { ProjetoContext, type ProjetoContextValue } from './ProjetoContext';

/** Projeto selecionado no header (e a lista de projetos do usuário). */
export function useProjetoAtual(): ProjetoContextValue {
  const ctx = useContext(ProjetoContext);
  if (!ctx) throw new Error('useProjetoAtual precisa estar dentro de <ProjetoProvider>.');
  return ctx;
}
