import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { listTools, type ToolDefinition } from '../api/_lib/tools.js';

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

type PropriedadeJson = {
  type?: string;
  enum?: unknown[];
  minimum?: number;
  maximum?: number;
  maxLength?: number;
  maxItems?: number;
  items?: PropriedadeJson;
};

/** Converte uma propriedade do JSON Schema do MCP em schema zod (tipos usados em `api/_lib`). */
function zodDaPropriedade(propriedade: PropriedadeJson): z.ZodTypeAny {
  switch (propriedade.type) {
    case 'string': {
      if (propriedade.enum?.length) return z.enum(propriedade.enum.map(String) as [string, ...string[]]);
      let texto = z.string();
      if (propriedade.maxLength !== undefined) texto = texto.max(propriedade.maxLength);
      return texto;
    }
    case 'integer':
    case 'number': {
      let numero = propriedade.type === 'integer' ? z.number().int() : z.number();
      if (propriedade.minimum !== undefined) numero = numero.min(propriedade.minimum);
      if (propriedade.maximum !== undefined) numero = numero.max(propriedade.maximum);
      return numero;
    }
    case 'boolean':
      return z.boolean();
    case 'array': {
      let lista = z.array(propriedade.items ? zodDaPropriedade(propriedade.items) : z.unknown());
      if (propriedade.maxItems !== undefined) lista = lista.max(propriedade.maxItems);
      return lista;
    }
    case 'object':
      return z.record(z.unknown());
    default:
      return z.unknown();
  }
}

/** Deriva o schema zod (estrito: recusa campos desconhecidos) do `inputSchema` MCP. */
export function schemaDoInputSchema(inputSchema: ToolDefinition['inputSchema']) {
  const obrigatorios = new Set(inputSchema.required ?? []);
  const formato: Record<string, z.ZodTypeAny> = {};
  for (const [campo, propriedade] of Object.entries(inputSchema.properties)) {
    const schemaCampo = zodDaPropriedade(propriedade as PropriedadeJson);
    formato[campo] = obrigatorios.has(campo) ? schemaCampo : schemaCampo.optional();
  }
  return z.object(formato).strict();
}

/**
 * Cria um tool() do LangChain para uma ferramenta MCP permitida (SUB-28.19).
 * O schema zod vem do `inputSchema` MCP; argumentos inválidos são recusados
 * pelo LangChain antes de chamar o handler.
 */
export function criarFerramentaLangChain(
  definicao: ToolDefinition,
  handler: (args: Record<string, unknown>) => Promise<string>,
) {
  const nome = definicao.name;
  if (!ALLOWLIST[nome]) {
    throw new Error(`Ferramenta não permitida: ${nome}`);
  }

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
      description: definicao.description,
      schema: schemaDoInputSchema(definicao.inputSchema),
    },
  );
}
