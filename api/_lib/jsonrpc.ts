/**
 * Utilitários JSON-RPC 2.0 usados pelo endpoint MCP.
 * Especificação: https://www.jsonrpc.org/specification
 */
export type JsonRpcId = string | number | null;

export interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: JsonRpcId;
  method: string;
  params?: Record<string, unknown>;
}

export interface JsonRpcSuccess {
  jsonrpc: '2.0';
  id: JsonRpcId;
  result: unknown;
}

export interface JsonRpcFailure {
  jsonrpc: '2.0';
  id: JsonRpcId;
  error: { code: number; message: string; data?: unknown };
}

export type JsonRpcResponse = JsonRpcSuccess | JsonRpcFailure;

/** Códigos de erro padrão do JSON-RPC 2.0. */
export const ErrorCode = {
  ParseError: -32700,
  InvalidRequest: -32600,
  MethodNotFound: -32601,
  InvalidParams: -32602,
  InternalError: -32603,
} as const;

/** Erro de protocolo que vira um objeto `error` na resposta JSON-RPC. */
export class RpcError extends Error {
  constructor(public readonly code: number, message: string, public readonly data?: unknown) {
    super(message);
    this.name = 'RpcError';
  }
}

export const ok = (id: JsonRpcId, result: unknown): JsonRpcSuccess => ({ jsonrpc: '2.0', id, result });

export const fail = (id: JsonRpcId, code: number, message: string, data?: unknown): JsonRpcFailure => ({
  jsonrpc: '2.0',
  id,
  error: data === undefined ? { code, message } : { code, message, data },
});

/** Notificação = requisição sem `id` (não recebe resposta). */
export const isNotification = (msg: JsonRpcRequest): boolean => !('id' in msg) || msg.id === undefined;

/** Valida a forma de uma mensagem JSON-RPC 2.0. Lança RpcError(InvalidRequest) se inválida. */
export function assertJsonRpcRequest(msg: unknown): asserts msg is JsonRpcRequest {
  if (typeof msg !== 'object' || msg === null || Array.isArray(msg)) {
    throw new RpcError(ErrorCode.InvalidRequest, 'A requisição deve ser um objeto JSON-RPC 2.0.');
  }
  const m = msg as Record<string, unknown>;
  if (m.jsonrpc !== '2.0') {
    throw new RpcError(ErrorCode.InvalidRequest, 'Campo "jsonrpc" deve ser "2.0".');
  }
  if (typeof m.method !== 'string' || m.method.length === 0) {
    throw new RpcError(ErrorCode.InvalidRequest, 'Campo "method" ausente ou inválido.');
  }
  if ('id' in m && m.id !== null && typeof m.id !== 'string' && typeof m.id !== 'number') {
    throw new RpcError(ErrorCode.InvalidRequest, 'Campo "id" deve ser string, número ou null.');
  }
  if ('params' in m && m.params !== undefined && (typeof m.params !== 'object' || m.params === null)) {
    throw new RpcError(ErrorCode.InvalidRequest, 'Campo "params" deve ser um objeto.');
  }
}
