/**
 * Helpers compartilhados pelas ferramentas MCP que acessam o banco (fila e memória):
 * validação de argumentos, resolução do projeto (slug, MCP_DEFAULT_PROJECT,
 * MCP_ALLOWED_PROJECTS) e a exigência de MCP_AUTH_TOKEN (o servidor usa a service_role).
 */
import { textResult, type CallToolResult } from './tools.js';
import { rest } from './supabase.js';

const SLUG_RE = /^[a-z0-9][a-z0-9_-]{0,62}$/;

export class ToolInputError extends Error {}

// ----------------------------------------------------------------- helpers de entrada
export function str(args: Record<string, unknown>, key: string, opts: { required?: boolean; max?: number } = {}) {
  const v = args[key];
  if (v === undefined || v === null || v === '') {
    if (opts.required) throw new ToolInputError(`"${key}" é obrigatório.`);
    return undefined;
  }
  if (typeof v !== 'string') throw new ToolInputError(`"${key}" deve ser texto.`);
  const t = v.trim();
  if (opts.required && !t) throw new ToolInputError(`"${key}" é obrigatório.`);
  if (opts.max && t.length > opts.max) throw new ToolInputError(`"${key}" excede ${opts.max} caracteres.`);
  return t || undefined;
}

export function int(args: Record<string, unknown>, key: string, min: number, max: number, required = false) {
  const v = args[key];
  if (v === undefined || v === null || v === '') {
    if (required) throw new ToolInputError(`"${key}" é obrigatório.`);
    return undefined;
  }
  const n = typeof v === 'string' && /^-?\d+$/.test(v.trim()) ? Number(v) : v;
  if (typeof n !== 'number' || !Number.isInteger(n) || n < min || n > max) {
    throw new ToolInputError(`"${key}" deve ser um inteiro entre ${min} e ${max}.`);
  }
  return n;
}

export function bool(args: Record<string, unknown>, key: string) {
  const v = args[key];
  if (v === undefined || v === null) return undefined;
  if (typeof v !== 'boolean') throw new ToolInputError(`"${key}" deve ser true ou false.`);
  return v;
}

export function oneOf<T extends string>(value: string | undefined, allowed: readonly T[], key: string): T | undefined {
  if (value === undefined) return undefined;
  if (!(allowed as readonly string[]).includes(value)) {
    throw new ToolInputError(`"${key}" deve ser um de: ${allowed.join(', ')}.`);
  }
  return value as T;
}

export function strList(args: Record<string, unknown>, key: string): string[] | undefined {
  const v = args[key];
  if (v === undefined || v === null) return undefined;
  const list = typeof v === 'string' ? v.split(',') : v;
  if (!Array.isArray(list) || list.some((x) => typeof x !== 'string')) {
    throw new ToolInputError(`"${key}" deve ser uma lista de textos.`);
  }
  return [...new Set(list.map((x: string) => x.trim()).filter(Boolean))];
}

/** Projeto efetivo: argumento > MCP_DEFAULT_PROJECT; valida o slug e a allowlist. */
export function resolveProject(arg: unknown, env: NodeJS.ProcessEnv = process.env): string | undefined {
  const raw = arg ?? env.MCP_DEFAULT_PROJECT;
  if (raw !== undefined && raw !== null && typeof raw !== 'string') {
    throw new ToolInputError('"project" deve ser o slug do projeto (texto).');
  }
  const slug = typeof raw === 'string' && raw.trim() ? raw.trim().toLowerCase() : undefined;
  if (slug && !SLUG_RE.test(slug)) throw new ToolInputError(`Slug de projeto inválido: "${slug}".`);
  const allowed = (env.MCP_ALLOWED_PROJECTS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length) {
    if (!slug) throw new ToolInputError(`Informe "project" (permitidos: ${allowed.join(', ')}).`);
    if (!allowed.includes(slug)) throw new ToolInputError(`Projeto "${slug}" não permitido neste servidor.`);
  }
  return slug;
}

export function requireAuthToken(env: NodeJS.ProcessEnv = process.env) {
  if (!env.MCP_AUTH_TOKEN) {
    throw new ToolInputError(
      'Ferramentas de dados (fila e memória) desativadas: defina MCP_AUTH_TOKEN no servidor (o endpoint usa a chave service_role).',
    );
  }
}

export async function projectId(slug: string): Promise<number> {
  const rows = await rest<{ id: number }[]>('GET', 'projects', {
    query: { select: 'id', slug: `eq.${slug}`, excluido: 'eq.false' },
  });
  if (!rows.length) throw new ToolInputError(`Projeto "${slug}" não encontrado.`);
  return rows[0].id;
}

export const json = (value: unknown): CallToolResult => textResult(JSON.stringify(value, null, 2));

export function guard(fn: (args: Record<string, unknown>) => Promise<CallToolResult>) {
  return async (args: Record<string, unknown>): Promise<CallToolResult> => {
    try {
      requireAuthToken();
      return await fn(args);
    } catch (err) {
      if (err instanceof ToolInputError) return textResult(err.message, true);
      throw err; // o roteador transforma em resultado com isError
    }
  };
}

export const PROJECT_PROP = {
  type: 'string',
  description: 'Slug do projeto (padrão: MCP_DEFAULT_PROJECT do servidor).',
};
