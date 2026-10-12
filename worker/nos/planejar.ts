import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { EstadoExecucao } from '../estado.js';
import { montarPromptPlano, PlanoSchema } from '../plano.js';

/** Modelo com saída estruturada (LangChain `BaseChatModel` ou um modelo falso nos testes). */
export type ModeloPlano = Pick<BaseChatModel, 'withStructuredOutput'>;

/** Plano devolvido pelo modelo fora do `PlanoSchema` (classificado como falha de validação). */
export class ErroValidacaoPlano extends Error {
  constructor(detalhe: string) {
    super(`Plano inválido (validation): ${detalhe}`);
    this.name = 'ErroValidacaoPlano';
  }
}

/**
 * Nó que planeja a execução (SUB-28.7).
 * Chama o modelo injetável com o prompt de `montarPromptPlano` e saída estruturada
 * `PlanoSchema`; revalida a resposta e grava o plano (JSON) no estado.
 */
export async function planejar(state: typeof EstadoExecucao.State, modelo: ModeloPlano) {
  const prompt = montarPromptPlano(state);
  const resposta = await modelo.withStructuredOutput(PlanoSchema).invoke(prompt);

  // O modelo pode ignorar o schema; a revalidação garante o formato antes de executar.
  const validacao = PlanoSchema.safeParse(resposta);
  if (!validacao.success) {
    throw new ErroValidacaoPlano(validacao.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; '));
  }

  return { plano: JSON.stringify(validacao.data) };
}

/** Adapta `planejar` para o grafo, fixando o modelo. */
export function criarNoPlanejar(modelo: ModeloPlano) {
  return (state: typeof EstadoExecucao.State) => planejar(state, modelo);
}
