import { HttpError } from './http-error.js';

/** Tamanho máximo do texto aceito por `POST /api/embedding`. */
export const MAX_TEXTO_EMBEDDING = 8_000;

/**
 * Lê `{ texto }` do corpo de `POST /api/embedding`.
 * Aceita objeto já parseado, string JSON ou Buffer (a Vercel pode entregar
 * qualquer um). Lança `HttpError` 400 (corpo vazio/inválido, sem `texto`) ou
 * 413 (mais de 8.000 caracteres).
 */
export function lerTextoEmbedding(body: unknown): string {
  let dados: unknown = body;
  if (typeof body === 'string' || Buffer.isBuffer(body)) {
    const bruto = body.toString();
    if (!bruto.trim()) throw new HttpError(400, 'Corpo da requisição vazio.');
    try {
      dados = JSON.parse(bruto);
    } catch {
      throw new HttpError(400, 'JSON inválido no corpo da requisição.');
    }
  }
  if (dados === undefined || dados === null) throw new HttpError(400, 'Corpo da requisição vazio.');
  if (typeof dados !== 'object' || Array.isArray(dados)) {
    throw new HttpError(400, 'O corpo deve ser um objeto JSON com o campo "texto".');
  }

  const texto = (dados as { texto?: unknown }).texto;
  if (typeof texto !== 'string' || !texto.trim()) {
    throw new HttpError(400, 'Informe "texto" (string não vazia).');
  }
  if (texto.length > MAX_TEXTO_EMBEDDING) {
    throw new HttpError(413, `"texto" passa do limite de ${MAX_TEXTO_EMBEDDING} caracteres.`);
  }
  return texto;
}
