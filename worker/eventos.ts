/**
 * Eventos do worker para o monitor em tempo real (SUB-35.33): grava uma linha em
 * `public.agent_events` (database/07) com a service_role, reaproveitando `db()`.
 * Emitir evento é acessório: `emitirEvento` nunca lança; uma falha vira aviso
 * no log (só o tipo do evento e a mensagem do erro, sem payload nem chaves).
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { db as dbPadrao, unwrap } from '../api/_lib/supabase.js';
import type { TipoEvento } from '../api/_lib/event-tools.js';

export const MENSAGEM_MAX = 2000;

export interface EventoWorker {
  /** Slug do projeto (o mesmo passado ao CLI com `--projeto`). */
  projeto: string;
  agente: string;
  tipo: TipoEvento;
  execucaoId?: string;
  etapa?: string;
  taskId?: number;
  taskCodigo?: string;
  status?: string;
  mensagem?: string;
  metadados?: unknown;
  chaveIdempotencia?: string;
}

export interface EventosDeps {
  db: () => SupabaseClient;
  avisar?: (mensagem: string) => void;
}

const avisoPadrao = (mensagem: string) => console.warn(mensagem);

const ehObjeto = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Monta a linha de `agent_events` (sem `project_id`). */
export function montarLinhaEvento(evento: EventoWorker): Record<string, unknown> {
  const linha: Record<string, unknown> = {
    agente: evento.agente,
    tipo: evento.tipo,
    metadados: ehObjeto(evento.metadados) ? evento.metadados : {},
  };
  if (evento.execucaoId) linha.execucao_id = evento.execucaoId;
  if (evento.etapa) linha.etapa = evento.etapa;
  if (evento.taskId !== undefined) linha.task_id = evento.taskId;
  if (evento.taskCodigo) linha.task_codigo = evento.taskCodigo;
  if (evento.status) linha.status = evento.status;
  if (evento.mensagem) linha.mensagem = evento.mensagem.slice(0, MENSAGEM_MAX);
  if (evento.chaveIdempotencia) linha.chave_idempotencia = evento.chaveIdempotencia;
  return linha;
}

/** Insere o evento; devolve `true` se gravou e `false` (com aviso no log) se falhou. */
export async function emitirEvento(evento: EventoWorker, deps: EventosDeps = { db: dbPadrao }): Promise<boolean> {
  const avisar = deps.avisar ?? avisoPadrao;
  try {
    const cliente = deps.db();
    const projetos = unwrap<{ id: number }[]>(
      await cliente.from('projects').select('id').eq('slug', evento.projeto).eq('excluido', false),
    );
    if (!projetos?.length) throw new Error(`projeto "${evento.projeto}" não encontrado`);
    const linha: Record<string, unknown> = { ...montarLinhaEvento(evento), project_id: projetos[0].id };
    if (linha.chave_idempotencia) {
      unwrap(
        await cliente
          .from('agent_events')
          .upsert(linha, { onConflict: 'project_id,chave_idempotencia', ignoreDuplicates: true }),
      );
    } else {
      unwrap(await cliente.from('agent_events').insert(linha));
    }
    return true;
  } catch (erro) {
    const motivo = erro instanceof Error ? erro.message : String(erro);
    avisar(`worker: evento "${evento.tipo}" não registrado (${motivo.slice(0, 200)})`);
    return false;
  }
}

/** Campos do estado do grafo usados nos eventos de etapa. */
export interface EstadoComEventos {
  projeto: string;
  agente: string;
  taskId: number;
  taskCodigo?: string;
  execucaoId: string;
}

const PADROES_SEGREDO: RegExp[] = [
  /\beyJ[\w-]+\.[\w-]+\.[\w-]+/g, // JWT
  /\b(?:sk|pk|rk|ghp|gho|ghs|github_pat|xox[abpr])[-_][\w-]{8,}/gi, // chaves de API
  /\b(Bearer|Basic)\s+[\w.~+/=-]+/gi,
  /\b(senha|password|token|secret|apikey|api_key|key)=([^\s&"']+)/gi,
  /\/\/[^/\s:@]+:[^@\s]+@/g, // credencial em URL
];

/** Mensagem de erro sem segredos aparentes, limitada a 500 caracteres. */
export function mensagemSegura(erro: unknown): string {
  let texto = erro instanceof Error ? `${erro.name}: ${erro.message}` : String(erro);
  for (const padrao of PADROES_SEGREDO) {
    texto = texto.replace(padrao, (trecho: string, g1: unknown) => {
      if (trecho.startsWith('//')) return '//***@';
      if (typeof g1 !== 'string') return '***';
      return /^(Bearer|Basic)$/i.test(g1) ? `${g1} ***` : `${g1}=***`;
    });
  }
  return texto.slice(0, 500);
}

/**
 * Envolve um nó do LangGraph (SUB-35.35): emite `inicio` antes, `fim` com a duração
 * depois e, se o nó falhar, `erro` com mensagem segura e relança o erro original.
 */
export function comEventos<S extends EstadoComEventos, A extends unknown[], R>(
  nome: string,
  no: (state: S, ...resto: A) => R | Promise<R>,
  deps?: EventosDeps,
  agora: () => number = Date.now,
): (state: S, ...resto: A) => Promise<R> {
  return async (state, ...resto) => {
    const base = {
      projeto: state.projeto,
      agente: state.agente,
      taskId: state.taskId,
      taskCodigo: state.taskCodigo,
      execucaoId: state.execucaoId,
      etapa: nome,
    };
    const inicio = agora();
    await emitirEvento({ ...base, tipo: 'inicio', status: 'em_execucao' }, deps);
    try {
      const resultado = await no(state, ...resto);
      const duracaoMs = agora() - inicio;
      await emitirEvento(
        { ...base, tipo: 'fim', status: 'ok', mensagem: `${nome} em ${duracaoMs} ms`, metadados: { duracao_ms: duracaoMs } },
        deps,
      );
      return resultado;
    } catch (erro) {
      const duracaoMs = agora() - inicio;
      await emitirEvento(
        { ...base, tipo: 'erro', status: 'erro', mensagem: mensagemSegura(erro), metadados: { duracao_ms: duracaoMs } },
        deps,
      );
      throw erro;
    }
  };
}
