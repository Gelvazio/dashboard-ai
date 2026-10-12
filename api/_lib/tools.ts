/**
 * Registro das ferramentas (primitivas cognitivas) expostas pelo servidor MCP.
 *
 * O roteador em `api/mcp.ts` usa este registro para responder `tools/list` e
 * despachar `tools/call` pelo nome em `params.name` (padrão MCP).
 *
 * Cada módulo registra as suas via `registerTool(...)` ao ser importado em mcp.ts:
 *   - `queue-tools.ts`: task_next, task_finish, task_list, task_create (fila)
 *   - `brain-tools.ts`: brain_store, brain_search, brain_delete (memória + embeddings)
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
