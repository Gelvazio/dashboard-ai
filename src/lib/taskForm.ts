/**
 * Estado e validação do formulário de cadastro/edição de task (SUB-16).
 * Funções puras: o modal só cuida da interface.
 */
import type { Task, TaskTipo } from '@/types';
import type { DadosTask } from '@/services/taskService';

export interface ValoresTask {
  titulo: string;
  instrucao: string;
  tipo: TaskTipo;
  prioridade: number;
  ordem: string;
  /** Valor de <input type="datetime-local"> (hora local, sem fuso) ou ''. */
  executarApos: string;
  maxTentativas: string;
  dependencias: string;
  executar: boolean;
}

export type ErrosTask = Partial<Record<keyof ValoresTask, string>>;

const dois = (n: number) => String(n).padStart(2, '0');

/** ISO (UTC) → "AAAA-MM-DDTHH:mm" na hora local do navegador. */
export function isoParaLocal(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}T${dois(d.getHours())}:${dois(d.getMinutes())}`;
}

/** "AAAA-MM-DDTHH:mm" (hora local) → ISO UTC, ou null se vazio/inválido. */
export function localParaIso(local: string): string | null {
  if (!local.trim()) return null;
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function valoresIniciais(task?: Task | null): ValoresTask {
  return {
    titulo: task?.titulo ?? '',
    instrucao: task?.instrucao ?? '',
    tipo: task?.tipo ?? 'ia',
    prioridade: task?.prioridade ?? 3,
    ordem: String(task?.ordem ?? 0),
    executarApos: isoParaLocal(task?.executar_apos),
    maxTentativas: String(task?.max_tentativas ?? 3),
    dependencias: (task?.dependencias ?? []).join(', '),
    executar: task?.executar ?? true,
  };
}

export function listaDependencias(texto: string): string[] {
  return [...new Set(texto.split(/[\s,;]+/).map((d) => d.trim().toUpperCase()).filter(Boolean))];
}

/** Valida e devolve os erros por campo (objeto vazio = válido). */
export function validarTask(v: ValoresTask, codigoAtual?: string): ErrosTask {
  const e: ErrosTask = {};
  if (!v.titulo.trim()) e.titulo = 'Informe o título.';
  else if (v.titulo.trim().length > 200) e.titulo = 'Máximo de 200 caracteres.';
  if (!v.instrucao.trim()) e.instrucao = 'Informe a instrução para o agente.';
  if (!Number.isInteger(v.prioridade) || v.prioridade < 1 || v.prioridade > 5) e.prioridade = 'Escolha de 1 a 5.';
  if (!/^-?\d+$/.test(v.ordem.trim())) e.ordem = 'Use um número inteiro.';
  const max = Number(v.maxTentativas);
  if (!/^\d+$/.test(v.maxTentativas.trim()) || max < 1 || max > 20) e.maxTentativas = 'De 1 a 20.';
  if (v.executarApos.trim() && !localParaIso(v.executarApos)) e.executarApos = 'Data/hora inválida.';
  if (codigoAtual && listaDependencias(v.dependencias).includes(codigoAtual.toUpperCase())) {
    e.dependencias = 'A task não pode depender de si mesma.';
  }
  return e;
}

/** Converte o formulário no payload do serviço (criarTask/atualizarTask). */
export function paraDadosTask(v: ValoresTask): DadosTask {
  return {
    titulo: v.titulo.trim(),
    instrucao: v.instrucao.trim(),
    tipo: v.tipo,
    prioridade: v.prioridade,
    ordem: Number(v.ordem),
    executar_apos: localParaIso(v.executarApos),
    max_tentativas: Number(v.maxTentativas),
    dependencias: listaDependencias(v.dependencias),
    executar: v.executar,
  };
}
