/**
 * Regras de apresentação das tasks (rótulos, cores, progresso e dependências).
 * Funções puras — usadas pela tabela, pelos modais e pelos indicadores.
 */
import type { Task, TaskStatus } from '@/types';

export interface InfoStatus {
  rotulo: string;
  descricao: string;
  /** Classes do badge (fundo suave + texto) e do ponto colorido. */
  badge: string;
  ponto: string;
}

export const STATUS_INFO: Record<TaskStatus, InfoStatus> = {
  pendente: {
    rotulo: 'Pendente',
    descricao: 'Aguardando na fila para ser executada.',
    badge: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
    ponto: 'bg-status-pendente',
  },
  em_execucao: {
    rotulo: 'Em execução',
    descricao: 'Travada por um agente de IA, que está trabalhando nela agora.',
    badge: 'bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/30',
    ponto: 'bg-status-execucao',
  },
  concluida: {
    rotulo: 'Concluída',
    descricao: 'Finalizada com sucesso.',
    badge: 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
    ponto: 'bg-status-concluida',
  },
  recusada: {
    rotulo: 'Recusada',
    descricao: 'O agente recusou a task (instrução insegura, ambígua ou fora do escopo).',
    badge: 'bg-orange-50 text-orange-800 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/30',
    ponto: 'bg-status-recusada',
  },
  erro: {
    rotulo: 'Erro',
    descricao: 'A execução falhou; veja o resultado e os logs.',
    badge: 'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30',
    ponto: 'bg-status-erro',
  },
  cancelada: {
    rotulo: 'Cancelada',
    descricao: 'Cancelada manualmente; não será executada.',
    badge: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-500/30',
    ponto: 'bg-status-cancelada',
  },
};

export interface InfoPrioridade {
  rotulo: string;
  badge: string;
}

/** 1 = mais urgente … 5 = menos urgente (a fila ordena por prioridade crescente). */
export const PRIORIDADE_INFO: Record<number, InfoPrioridade> = {
  1: { rotulo: 'Crítica', badge: 'bg-rose-600 text-white' },
  2: { rotulo: 'Alta', badge: 'bg-orange-500 text-white' },
  3: { rotulo: 'Média', badge: 'bg-amber-400 text-amber-950' },
  4: { rotulo: 'Baixa', badge: 'bg-sky-500 text-white' },
  5: { rotulo: 'Mínima', badge: 'bg-slate-400 text-white' },
};

export function infoPrioridade(p: number): InfoPrioridade {
  return PRIORIDADE_INFO[Math.min(5, Math.max(1, Math.round(p)))] ?? PRIORIDADE_INFO[3];
}

/** Fração (0–1) das tentativas já usadas. */
export function progressoTentativas(t: Pick<Task, 'tentativas' | 'max_tentativas'>): number {
  if (t.max_tentativas <= 0) return 0;
  return Math.min(1, Math.max(0, t.tentativas / t.max_tentativas));
}

export type EstadoDependencia = 'concluida' | 'pendente' | 'desconhecida';

export interface DependenciaTask {
  codigo: string;
  estado: EstadoDependencia;
  status?: TaskStatus;
}

/** Situação de cada dependência, olhando as tasks carregadas do mesmo projeto. */
export function dependenciasDa(task: Pick<Task, 'dependencias'>, porCodigo: ReadonlyMap<string, Pick<Task, 'status'>>): DependenciaTask[] {
  return task.dependencias.map((codigo) => {
    const dep = porCodigo.get(codigo);
    if (!dep) return { codigo, estado: 'desconhecida' };
    return { codigo, estado: dep.status === 'concluida' ? 'concluida' : 'pendente', status: dep.status };
  });
}

/** A task está bloqueada se alguma dependência conhecida ainda não foi concluída. */
export function bloqueadaPorDependencia(deps: DependenciaTask[]): boolean {
  return deps.some((d) => d.estado === 'pendente');
}

const FORMATO_DATA = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

/** Data/hora curta no fuso do navegador (ex.: 11/10/2026, 22:40). */
export function formatarDataHora(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : FORMATO_DATA.format(d);
}

/** "há 5 min", "há 2 h", "há 3 dias" (ou "em 2 h" para datas futuras). */
export function tempoRelativo(iso: string | null | undefined, agora: number = Date.now()): string {
  if (!iso) return '—';
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return '—';
  const diff = Math.round((agora - t) / 1000);
  const abs = Math.abs(diff);
  const [n, u] = abs < 60 ? [abs, 's'] : abs < 3600 ? [Math.floor(abs / 60), 'min'] : abs < 86400 ? [Math.floor(abs / 3600), 'h'] : [Math.floor(abs / 86400), abs < 172800 ? 'dia' : 'dias'];
  if (abs < 10) return 'agora';
  return diff >= 0 ? `há ${n} ${u}` : `em ${n} ${u}`;
}

/** Primeira linha não vazia do texto, cortada (para células e tooltips). */
export function resumo(texto: string | null | undefined, max = 80): string {
  const linha = (texto ?? '').split('\n').map((l) => l.trim()).find(Boolean) ?? '';
  return linha.length > max ? `${linha.slice(0, max - 1)}…` : linha;
}

export interface AcoesDisponiveis {
  editar: boolean;
  alternar: boolean;
  reabrir: boolean;
  cancelar: boolean;
  concluir: boolean;
  excluir: boolean;
}

/**
 * Ações que a interface pode fazer na task (espelha a trigger de proteção do banco:
 * nada muda em `em_execucao`; só tasks `humano` são concluídas pela interface).
 */
export function acoesDisponiveis(t: Pick<Task, 'status' | 'tipo' | 'excluido'>): AcoesDisponiveis {
  if (t.excluido || t.status === 'em_execucao') {
    return { editar: false, alternar: false, reabrir: false, cancelar: false, concluir: false, excluir: false };
  }
  const aberta = t.status === 'pendente' || t.status === 'erro' || t.status === 'recusada';
  return {
    editar: true,
    alternar: aberta,
    reabrir: t.status === 'erro' || t.status === 'recusada' || t.status === 'cancelada',
    cancelar: aberta,
    concluir: t.tipo === 'humano' && t.status === 'pendente',
    excluir: true,
  };
}

/** Resumo da task em Markdown (botão "Copiar tudo" da visualização detalhada). */
export function taskComoMarkdown(t: Task, projeto?: { nome: string; slug: string }): string {
  const linhas = [
    `# ${t.codigo} — ${t.titulo}`,
    '',
    ...(projeto ? [`- **Projeto:** ${projeto.nome} (${projeto.slug})`] : []),
    `- **Status:** ${STATUS_INFO[t.status].rotulo}${t.executar ? '' : ' (OFF)'}`,
    `- **Prioridade:** ${t.prioridade} (${infoPrioridade(t.prioridade).rotulo}) · **Ordem:** ${t.ordem}`,
    `- **Executor:** ${t.tipo === 'humano' ? 'Humano' : 'IA'} · **Tentativas:** ${t.tentativas}/${t.max_tentativas}`,
    ...(t.dependencias.length ? [`- **Depende de:** ${t.dependencias.join(', ')}`] : []),
    ...(t.pr_url ? [`- **PR:** ${t.pr_url}`] : []),
    ...(t.commit_sha ? [`- **Commit:** ${t.commit_sha}`] : []),
    ...(t.concluido_em ? [`- **Concluída em:** ${formatarDataHora(t.concluido_em)}`] : []),
    '',
    '## Instrução',
    '',
    t.instrucao.trim(),
  ];
  if (t.resultado?.trim()) linhas.push('', '## Resultado', '', t.resultado.trim());
  return `${linhas.join('\n')}\n`;
}

export interface FiltroLocal {
  busca?: string;
  status?: TaskStatus | 'todos';
}

const semAcento = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/** Filtro instantâneo na lista já carregada (código, título e instrução; status). */
export function filtrarTasks<T extends Pick<Task, 'codigo' | 'titulo' | 'instrucao' | 'status'>>(tasks: T[], f: FiltroLocal): T[] {
  const termo = semAcento(f.busca?.trim() ?? '');
  return tasks.filter(
    (t) =>
      (!f.status || f.status === 'todos' || t.status === f.status) &&
      (!termo || semAcento(`${t.codigo} ${t.titulo} ${t.instrucao}`).includes(termo)),
  );
}
