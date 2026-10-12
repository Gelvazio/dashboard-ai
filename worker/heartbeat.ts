/**
 * Heartbeat do worker para o monitor em tempo real (SUB-35.37): emite
 * `tipo = 'heartbeat'` ao iniciar e a cada `intervaloMs`, com a task e a etapa
 * atuais (callback opcional). Devolve a função que para o heartbeat.
 */
import { emitirEvento, type EventoWorker } from './eventos.js';

/** Onde o worker está agora (sem task, só o agente aparece como vivo). */
export interface PosicaoAtual {
  taskId?: number;
  taskCodigo?: string;
  execucaoId?: string;
  etapa?: string;
}

export interface OpcoesHeartbeat {
  agente: string;
  projeto: string;
  intervaloMs?: number;
  emitir?: (evento: EventoWorker) => Promise<unknown>;
  atual?: () => PosicaoAtual | undefined;
}

export const INTERVALO_HEARTBEAT_MS = 30_000;

export function iniciarHeartbeat({
  agente,
  projeto,
  intervaloMs = INTERVALO_HEARTBEAT_MS,
  emitir = emitirEvento,
  atual,
}: OpcoesHeartbeat): () => void {
  const pulsar = () => {
    let posicao: PosicaoAtual | undefined;
    try {
      posicao = atual?.();
    } catch {
      posicao = undefined;
    }
    // O heartbeat é acessório: nenhuma falha pode derrubar o worker.
    Promise.resolve()
      .then(() => emitir({ ...posicao, projeto, agente, tipo: 'heartbeat', status: posicao?.taskId ? 'ocupado' : 'livre' }))
      .catch(() => {});
  };

  pulsar();
  const timer = setInterval(pulsar, intervaloMs);
  timer.unref?.();
  let parado = false;
  return () => {
    if (parado) return;
    parado = true;
    clearInterval(timer);
  };
}
