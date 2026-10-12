/**
 * Hooks React que ligam os serviços à interface (estado, carregamento, erro,
 * recarregamento). Nome sempre começando por `use`, um hook por arquivo.
 */
export { ProjetoProvider } from './ProjetoContext';
export { useProjetoAtual } from './useProjetoAtual';
export { useNavegacao } from './useNavegacao';
export { useTema } from './useTema';
export { useConexao } from './useConexao';
export { useTasks } from './useTasks';
export { ToastProvider } from './ToastContext';
export { useToast } from './useToast';
export { useIndicadores } from './useIndicadores';
export { useContagemAnimada } from './useContagemAnimada';
export { useAcoesTask } from './useAcoesTask';
export { useLogs } from './useLogs';
