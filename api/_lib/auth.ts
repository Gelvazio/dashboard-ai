import type { McpRequest } from './http.js';

/**
 * Lê o token do cabeçalho `Authorization: Bearer <token>`.
 * Aceita o valor como string ou array (usa o primeiro), esquema `Bearer`
 * sem diferenciar maiúsculas. Devolve `null` se ausente ou malformado.
 */
export function bearerToken(headers: McpRequest['headers']): string | null {
  const bruto = headers['authorization'] ?? headers['Authorization'];
  const valor = Array.isArray(bruto) ? bruto[0] : bruto;
  if (typeof valor !== 'string') return null;
  const m = /^\s*Bearer\s+(\S+)\s*$/i.exec(valor);
  return m ? m[1] : null;
}
