/**
 * Componentes de interface reutilizáveis. Regras: componentes recebem dados por
 * props ou hooks — não chamam o Supabase direto (papel de `services/`).
 */
export { AppLayout } from './layout/AppLayout';
export { Header } from './layout/Header';
export { Sidebar } from './layout/Sidebar';
export { ProjectSelector } from './layout/ProjectSelector';
export { ConnectionStatus } from './layout/ConnectionStatus';
export { ThemeToggle } from './layout/ThemeToggle';
export { EmConstrucao } from './EmConstrucao';
export { Tooltip } from './ui/Tooltip';
export * from './tasks';
export { Modal } from './ui/Modal';
export { Botao } from './ui/Botao';
export * from './kpi';
export { Switch } from './ui/Switch';
export { ConfirmDialog } from './ui/ConfirmDialog';
