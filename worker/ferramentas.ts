import { listTools } from '../api/_lib/tools.js';

export interface FerramentaPermitida {
  nome: string;
  sensivel: boolean;
}

/** Allowlist de ferramentas MCP permitidas para o worker (SUB-28.5). */
export const ALLOWLIST: Record<string, FerramentaPermitida> = {
  brain_search: { nome: 'brain_search', sensivel: false },
  brain_store: { nome: 'brain_store', sensivel: false },
  brain_delete: { nome: 'brain_delete', sensivel: false },
  task_list: { nome: 'task_list', sensivel: false },
};

/**
 * Consulta o registro MCP (`api/_lib/tools.ts`) e recusa nomes fora da allowlist.
 * @param nome Nome da ferramenta MCP
 * @returns Definição da ferramenta ou null se não permitida
 */
export async function obterFerramenta(nome: string): Promise<FerramentaPermitida | null> {
  const permitida = ALLOWLIST[nome];
  if (!permitida) {
    return null;
  }

  // Consultar o registro MCP para validar que a ferramenta existe
  const tools = await listTools();
  const ferramenta = tools.find((t) => t.name === nome);
  if (!ferramenta) {
    return null;
  }

  return permitida;
}
