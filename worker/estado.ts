import { Annotation } from '@langchain/langgraph';
import { z } from 'zod';

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
  /** Nível da task (`LEVE`/`MEDIO`/`PESADO`; vazio = sem nível) — SUB-47.18. */
  nivel: Annotation<string>({
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

export const EstadoSchema = z.object({
  taskId: z.number(),
  taskCodigo: z.string(),
  projeto: z.string(),
  agente: z.string(),
  tentativa: z.number(),
  execucaoId: z.string(),
  instrucao: z.string(),
  nivel: z.string().optional(),
  plano: z.string(),
  passoAtual: z.string(),
  resultados: z.record(z.unknown()),
  aprovacao: z.unknown().nullable(),
  final: z.boolean(),
});
