/**
 * Tipos HTTP mínimos compatíveis com o runtime Node.js da Vercel
 * (`VercelRequest` / `VercelResponse` de `@vercel/node`).
 *
 * Declarados localmente para o endpoint compilar sem depender de pacotes extras;
 * os objetos reais da Vercel satisfazem estas interfaces.
 */
export interface McpRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  /** A Vercel já entrega o JSON parseado; pode chegar como string/Buffer sem Content-Type JSON. */
  body?: unknown;
}

export interface McpResponse {
  status(code: number): McpResponse;
  setHeader(name: string, value: string | number | readonly string[]): unknown;
  json(body: unknown): unknown;
  end(body?: string): unknown;
}
