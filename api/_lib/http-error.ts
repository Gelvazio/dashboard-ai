/**
 * Erro com status HTTP para os handlers serverless (`api/*.ts`).
 * O handler devolve `err.status` e `err.message` ao cliente, então a mensagem
 * nunca deve conter chaves, tokens ou detalhes internos.
 */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.name = 'HttpError';
    this.status = status;
  }
}
