// Worker LangGraph para execução de tasks (SUB-28)
// Este arquivo será implementado nas subtarefas seguintes
export type EstadoExecucao = {
  taskId: number;
  taskCodigo: string;
  projeto: string;
  agente: string;
  tentativa: number;
  execucaoId: string;
  instrucao: string;
  plano: string;
  passoAtual: string;
  resultados: Record<string, unknown>;
  aprovacao: unknown;
  final: boolean;
};
