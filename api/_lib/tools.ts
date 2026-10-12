/**
 * Registro das ferramentas (primitivas cognitivas) expostas pelo servidor MCP.
 *
 * O roteador em `api/mcp.ts` usa este registro para responder `tools/list` e
 * despachar `tools/call` pelo nome em `params.name` (padrão MCP).
 *
 * As primitivas `brain_store`, `brain_search` e `brain_delete` (Supabase +
 * embeddings) são registradas na SUB-07 via `registerTool(...)`.
 */

/** Bloco de conteúdo de resultado de ferramenta (MCP). */
export interface TextContent {
  type: 'text';
  text: string;
}

/** Resultado de `tools/call` (MCP CallToolResult). */
export interface CallToolResult {
  content: TextContent[];
  isError?: boolean;
}

/** Definição pública da ferramenta, como aparece em `tools/list`. */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export type ToolHandler = (args: Record<string, unknown>) => Promise<CallToolResult>;

export interface Tool extends ToolDefinition {
  handler: ToolHandler;
}

const registry = new Map<string, Tool>();

export function registerTool(tool: Tool): void {
  registry.set(tool.name, tool);
}

export function getTool(name: string): Tool | undefined {
  return registry.get(name);
}

/** Lista as definições públicas (sem o handler). */
export function listTools(): ToolDefinition[] {
  return [...registry.values()].map(({ handler: _handler, ...def }) => def);
}

/** Atalho para montar um resultado textual. */
export const textResult = (text: string, isError = false): CallToolResult =>
  isError ? { content: [{ type: 'text', text }], isError: true } : { content: [{ type: 'text', text }] };
