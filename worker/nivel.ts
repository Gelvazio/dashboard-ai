/**
 * Nível da task no worker (SUB-47.18): se a task chegou sem `nivel_tarefa`, classifica com
 * `classificar()` (Laya + Opus, `classificador.ts`) e grava na tabela `tasks` (coluna criada em
 * `database/09_tasks_nivel.sql`, SUB-47.17). Nunca lança: classificar é acessório e não pode
 * impedir a task de rodar — sem nível, o worker segue com o modelo padrão (SUB-47.19).
 */
import { db, unwrap } from '../api/_lib/supabase.js';
import {
  classificar,
  type DecisaoClassificacao,
  type PedidoClassificacao,
} from './classificador.js';
import { emitirEvento, type EventoWorker } from './eventos.js';

import { ehNivel, type NivelTarefa } from './niveis.js';

export { NIVEIS, ehNivel, type NivelTarefa } from './niveis.js';

const TAMANHO_MAXIMO_INSTRUCAO = 4_000;
const ETAPA_EVENTO = 'classificar';

/** Mesma pergunta da skill `classificar-tarefa` (critérios iguais aos do `curl` de lá). */
export const PERGUNTA_NIVEL = {
  nivel: {
    type: 'choice' as const,
    instructions: 'Qual o nível de esforço e risco?',
    criteria: {
      LEVE: 'só documentação, textos, formatação ou configuração simples sem lógica',
      MEDIO: 'código com lógica em 1 a 3 arquivos, sem banco, segurança nem chaves',
      PESADO: 'banco, SQL, segurança, login, chaves, migração, arquitetura, 4+ arquivos',
    },
  },
};

/** O que o worker sabe da task ao reivindicá-la. */
export interface TaskParaNivel {
  taskId: number;
  taskCodigo: string;
  titulo?: string;
  instrucao: string;
  nivel?: NivelTarefa;
}

/** Resultado: o nível (ou null) e de onde veio. */
export interface ResultadoNivel {
  nivel: NivelTarefa | null;
  origem: 'task' | 'laya' | 'opus' | 'nenhuma';
  motivo?: string;
}

/** Dependências injetáveis (padrão: classificador, banco e eventos reais). */
export interface DependenciasNivel {
  agente: string;
  projeto: string;
  classificar?: (pedido: PedidoClassificacao) => Promise<DecisaoClassificacao>;
  gravar?: (taskId: number, nivel: NivelTarefa) => Promise<void>;
  emitir?: (evento: EventoWorker) => Promise<unknown>;
}

/**
 * Grava o nível na task (`update tasks set nivel_tarefa = … where id = …`, com a service_role).
 * @param taskId - Id da task.
 * @param nivel - Nível a gravar.
 * @throws {Error} Se o banco recusar (ex.: coluna ainda não criada).
 */
async function gravarNivelPadrao(taskId: number, nivel: NivelTarefa): Promise<void> {
  unwrap(await db().from('tasks').update({ nivel_tarefa: nivel }).eq('id', taskId));
}

/**
 * Classifica e grava o nível de uma task sem nível.
 * @param task - Task reivindicada.
 * @param deps - Classificador, gravação e eventos (padrão: os reais).
 * @returns O nível; nunca lança (falha vira `nivel: null` com `motivo`).
 */
async function classificarEGravar(
  task: TaskParaNivel,
  deps: DependenciasNivel,
): Promise<ResultadoNivel> {
  const executarClassificacao = deps.classificar ?? ((pedido) => classificar(pedido));
  const gravar = deps.gravar ?? gravarNivelPadrao;
  try {
    const estado = {
      titulo: task.titulo ?? task.taskCodigo,
      instrucao: task.instrucao.slice(0, TAMANHO_MAXIMO_INSTRUCAO),
    };
    const decisao = await executarClassificacao({ estado, perguntas: PERGUNTA_NIVEL });
    const resposta = decisao.resposta.answers.nivel;
    const nivel = resposta?.type === 'choice' ? resposta.choice : undefined;
    if (!ehNivel(nivel)) {
      return { nivel: null, origem: 'nenhuma', motivo: 'resposta sem nível válido' };
    }

    // Gravar falhou (ex.: coluna ainda não criada na nuvem): o nível ainda serve nesta execução.
    const naoGravado = await gravar(task.taskId, nivel).then(() => undefined, (erro: unknown) =>
      `não gravado: ${erro instanceof Error ? erro.message : String(erro)}`);
    return { nivel, origem: decisao.classificador, ...(naoGravado ? { motivo: naoGravado } : {}) };
  } catch (erro) {
    const motivo = erro instanceof Error ? erro.message : String(erro);
    return { nivel: null, origem: 'nenhuma', motivo };
  }
}

/**
 * Garante o nível da task: usa o que veio do banco ou classifica e grava. Emite um evento
 * `progresso` (etapa `classificar`) quando precisou classificar. Nunca lança.
 * @param task - Task reivindicada.
 * @param deps - Agente, projeto e dependências injetáveis.
 * @returns O nível (ou null) e a origem.
 */
export async function garantirNivel(
  task: TaskParaNivel,
  deps: DependenciasNivel,
): Promise<ResultadoNivel> {
  if (ehNivel(task.nivel)) return { nivel: task.nivel, origem: 'task' };

  const resultado = await classificarEGravar(task, deps);
  const emitir = deps.emitir ?? emitirEvento;
  const complemento = resultado.motivo ? `; ${resultado.motivo}` : '';
  const mensagem = resultado.nivel
    ? `Nível ${resultado.nivel} (${resultado.origem})${complemento}`
    : `Sem nível: ${resultado.motivo ?? 'motivo desconhecido'}`;
  await Promise.resolve(emitir({
    projeto: deps.projeto, agente: deps.agente, tipo: 'progresso', etapa: ETAPA_EVENTO,
    taskId: task.taskId, taskCodigo: task.taskCodigo, mensagem,
  })).catch(() => undefined);
  return resultado;
}
