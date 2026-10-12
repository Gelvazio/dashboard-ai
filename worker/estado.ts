import { Annotation } from '@langchain/langgraph';

export const EstadoExecucao = Annotation.Root({
  taskId: Annotation<number>({
    reducer: (x, y) => y ?? x,
    default: () => 0,
  }),
  taskCodigo: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => '',
  }),
  projeto: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => '',
  }),
  agente: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => '',
  }),
  tentativa: Annotation<number>({
    reducer: (x, y) => y ?? x,
    default: () => 0,
  }),
  execucaoId: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => '',
  }),
  instrucao: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => '',
  }),
  plano: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => '',
  }),
  passoAtual: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => '',
  }),
  resultados: Annotation<Record<string, unknown>>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),
  aprovacao: Annotation<unknown>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  final: Annotation<boolean>({
    reducer: (x, y) => y ?? x,
    default: () => false,
  }),
});
