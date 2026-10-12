// TaskFormModal e TaskDetailModal ficam fora do barrel: são carregados sob demanda pela FilaView (SUB-34.3).
export { TaskTable, ProgressoFila, type TaskTableProps } from './TaskTable';
export { StatusBadge } from './StatusBadge';
export { PrioridadeBadge } from './PrioridadeBadge';
export { TentativasBar } from './TentativasBar';
export { Dependencias } from './Dependencias';
export { TaskRowActions } from './TaskRowActions';
export { TaskToolbar } from './TaskToolbar';
export { PendentesResumo, type PendentesResumoProps } from './PendentesResumo';
export { TravaItem, type TravaItemProps } from './TravaItem';
export { SaudeFilaPanel, type SaudeFilaPanelProps } from './SaudeFilaPanel';
