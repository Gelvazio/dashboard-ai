import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { listTools } from '../api/_lib/tools.js';

export interface FerramentaPermitida {
  nome: string;
  sensivel: boolean;
}

/** Allowlist de ferramentas MCP permitidas para o worker (SUB-28.5). */
export const ALLOWLIST: Record<string, FerramentaPermitida> = {
  brain_search: { nome: 'brain_search', sensivel: false },
  brain_store: { nome: 'brain_store', sensivel: false },
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

/**
 * Cria um tool() do LangChain para uma ferramenta MCP permitida (SUB-28.19).
 * Valida a allowlist e converte o inputSchema MCP para schema zod.
 */
export function criarFerramentaLangChain(nome: string, handler: (args: Record<string, unknown>) => Promise<string>) {
  const permitida = ALLOWLIST[nome];
  if (!permitida) {
    throw new Error(`Ferramenta não permitida: ${nome}`);
  }

  // Schema zod base (será refinado com o inputSchema real do MCP)
  const schema = z.object({
    query: z.string().optional(),
    title: z.string().optional(),
    content: z.string().optional(),
    tags: z.array(z.string()).optional(),
  });

  return tool(
    async (args: Record<string, unknown>) => {
      // Validar que a ferramenta ainda está permitida no registro MCP
      const ferramenta = await obterFerramenta(nome);
      if (!ferramenta) {
        throw new Error(`Ferramenta não disponível: ${nome}`);
      }

      return handler(args);
    },
    {
      name: nome,
      description: `Ferramenta MCP: ${nome}`,
      schema,
    },
  );
}
