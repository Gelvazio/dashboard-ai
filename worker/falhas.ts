export type ClasseFalha = 'transitoria' | 'validacao' | 'permissao' | 'permanente' | 'recusa';

/**
 * Classifica erros em tipos (SUB-28.21).
 * - transitoria: rede, 429, timeout (repetir)
 * - validacao/permissao: 400, 403, erro de schema (não repetir, novo erro)
 * - permanente: 500 sem recuperação, erro fatal (erro, nova tentativa decidida pela RPC)
 * - recusa: recusa explícita do usuário
 */
export function classificarFalha(err: unknown): ClasseFalha {
  if (!(err instanceof Error)) {
    return 'permanente';
  }

  const mensagem = err.message.toLowerCase();
  const erro = err as Error & { status?: number; statusCode?: number; code?: string };

  // Código de status HTTP (se disponível)
  const status = erro.status ?? erro.statusCode;

  // Erros transitórios (rede, timeout, rate limit)
  if (
    mensagem.includes('network') ||
    mensagem.includes('timeout') ||
    mensagem.includes('etimedout') ||
    mensagem.includes('econnrefused') ||
    mensagem.includes('econnreset') ||
    status === 429 ||
    status === 503 ||
    status === 504
  ) {
    return 'transitoria';
  }

  // Erros de validação/permissão
  if (
    status === 400 ||
    status === 403 ||
    mensagem.includes('validation') ||
    mensagem.includes('permission') ||
    mensagem.includes('unauthorized') ||
    mensagem.includes('zod')
  ) {
    return status === 403 ? 'permissao' : 'validacao';
  }

  // Recusa explícita
  if (mensagem.includes('recusado') || mensagem.includes('recusa') || mensagem.includes('rejeitado')) {
    return 'recusa';
  }

  // Erros permanentes por padrão
  return 'permanente';
}
