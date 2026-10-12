/**
 * Endpoint MCP (Model Context Protocol) serverless na Vercel — `POST /api/mcp`.
 *
 * Transporte: Streamable HTTP (JSON simples, sem SSE). Cada POST carrega uma
 * mensagem JSON-RPC 2.0 (ou um lote) e recebe a resposta no envelope
 * `{ jsonrpc: "2.0", id, result | error }`.
 *
 * Métodos suportados:
 *   - initialize                 -> handshake (versão do protocolo, capabilities, serverInfo)
 *   - notifications/initialized  -> notificação (HTTP 202, sem corpo)
 *   - ping                       -> {}
 *   - tools/list                 -> { tools: [...] }
 *   - tools/call                 -> despacha pelo nome em params.name, com params.arguments
 *
 * Segurança opcional: se a variável MCP_AUTH_TOKEN estiver definida, exige
 * `Authorization: Bearer <MCP_AUTH_TOKEN>`.
 */
import type { McpRequest, McpResponse } from './_lib/http.js';
import {
  ErrorCode,
  RpcError,
  assertJsonRpcRequest,
  fail,
  isNotification,
  ok,
  type JsonRpcId,
  type JsonRpcRequest,
  type JsonRpcResponse,
} from './_lib/jsonrpc.js';
import { getTool, listTools, textResult } from './_lib/tools.js';

export const SERVER_INFO = { name: 'dashboard-ai-brain', version: '0.1.0' } as const;
export const SUPPORTED_PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'] as const;
const LATEST_PROTOCOL_VERSION = SUPPORTED_PROTOCOL_VERSIONS[0];

/** Processa uma única mensagem JSON-RPC. Retorna `null` para notificações. */
export async function handleMessage(raw: unknown): Promise<JsonRpcResponse | null> {
  let id: JsonRpcId = null;
  try {
    assertJsonRpcRequest(raw);
    const msg: JsonRpcRequest = raw;
    id = msg.id ?? null;
    const result = await dispatch(msg);
    return isNotification(msg) ? null : ok(id, result);
  } catch (err) {
    const notification =
      typeof raw === 'object' && raw !== null && !Array.isArray(raw) && !('id' in raw);
    if (notification && !(err instanceof RpcError && err.code === ErrorCode.InvalidRequest)) return null;
    if (err instanceof RpcError) return fail(id, err.code, err.message, err.data);
    const message = err instanceof Error ? err.message : String(err);
    return fail(id, ErrorCode.InternalError, `Erro interno: ${message}`);
  }
}

async function dispatch(msg: JsonRpcRequest): Promise<unknown> {
  const params = msg.params ?? {};

  switch (msg.method) {
    case 'initialize': {
      const requested = typeof params.protocolVersion === 'string' ? params.protocolVersion : undefined;
      const protocolVersion =
        requested && (SUPPORTED_PROTOCOL_VERSIONS as readonly string[]).includes(requested)
          ? requested
          : LATEST_PROTOCOL_VERSION;
      return {
        protocolVersion,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions:
          'Cérebro de memória persistente do Dashboard AI. Use brain_search antes de decidir, ' +
          'brain_store para registrar decisões e brain_delete para remover memórias obsoletas.',
      };
    }

    case 'notifications/initialized':
    case 'notifications/cancelled':
      return {};

    case 'ping':
      return {};

    case 'tools/list':
      return { tools: listTools() };

    case 'tools/call': {
      const name = params.name;
      if (typeof name !== 'string' || name.length === 0) {
        throw new RpcError(ErrorCode.InvalidParams, 'tools/call exige "params.name" (nome da ferramenta).');
      }
      const tool = getTool(name);
      if (!tool) {
        throw new RpcError(ErrorCode.InvalidParams, `Ferramenta desconhecida: ${name}`);
      }
      const args = params.arguments ?? {};
      if (typeof args !== 'object' || args === null || Array.isArray(args)) {
        throw new RpcError(ErrorCode.InvalidParams, '"params.arguments" deve ser um objeto.');
      }
      try {
        return await tool.handler(args as Record<string, unknown>);
      } catch (err) {
        // Falhas de execução da ferramenta voltam como resultado com isError (padrão MCP),
        // para o modelo enxergar a mensagem e poder reagir.
        const message = err instanceof Error ? err.message : String(err);
        return textResult(`Erro ao executar ${name}: ${message}`, true);
      }
    }

    default:
      throw new RpcError(ErrorCode.MethodNotFound, `Método não encontrado: ${msg.method}`);
  }
}

function parseBody(body: unknown): unknown {
  if (body === undefined || body === null || body === '') {
    throw new RpcError(ErrorCode.InvalidRequest, 'Corpo da requisição vazio.');
  }
  if (typeof body === 'string' || (typeof Buffer !== 'undefined' && Buffer.isBuffer(body))) {
    try {
      return JSON.parse(body.toString());
    } catch {
      throw new RpcError(ErrorCode.ParseError, 'JSON inválido no corpo da requisição.');
    }
  }
  return body;
}

function setCors(res: McpResponse): void {
  res.setHeader('Access-Control-Allow-Origin', process.env.MCP_CORS_ORIGIN ?? '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version',
  );
}

function header(req: McpRequest, name: string): string | undefined {
  const v = req.headers[name.toLowerCase()];
  return Array.isArray(v) ? v[0] : v;
}

export default async function handler(req: McpRequest, res: McpResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res
      .status(405)
      .json(fail(null, ErrorCode.InvalidRequest, 'Apenas requisições POST são aceitas.'));
  }

  const token = process.env.MCP_AUTH_TOKEN;
  if (token && header(req, 'authorization') !== `Bearer ${token}`) {
    res.setHeader('WWW-Authenticate', 'Bearer');
    return res.status(401).json(fail(null, ErrorCode.InvalidRequest, 'Não autorizado.'));
  }

  let payload: unknown;
  try {
    payload = parseBody(req.body);
  } catch (err) {
    const e = err as RpcError;
    return res.status(400).json(fail(null, e.code, e.message));
  }

  // Lote JSON-RPC (array de mensagens)
  if (Array.isArray(payload)) {
    if (payload.length === 0) {
      return res.status(400).json(fail(null, ErrorCode.InvalidRequest, 'Lote JSON-RPC vazio.'));
    }
    const responses = (await Promise.all(payload.map(handleMessage))).filter(
      (r): r is JsonRpcResponse => r !== null,
    );
    return responses.length ? res.status(200).json(responses) : res.status(202).end();
  }

  const response = await handleMessage(payload);
  if (response === null) {
    return res.status(202).end(); // notificação: aceita, sem corpo
  }
  return res.status(200).json(response);
}
