import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { EstadoExecucao } from '../estado.js';
import { ehNivel, type NivelTarefa } from '../niveis.js';
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
  return planejarComModelo(state, modelo);
}

/** Modelos por nível da task; nível ausente cai no modelo padrão. */
export type ModelosPorNivel = Partial<Record<NivelTarefa, ModeloPlano>>;

/** Nível usado quando a task não tem nível (vazio ou inválido). */
const NIVEL_PADRAO: NivelTarefa = 'MEDIO';

/**
 * Escolhe o modelo do nível da task (SUB-47.19).
 * @param nivel Nível do estado (`''` ou inválido usa o `MEDIO`).
 * @param modelo Modelo padrão, usado quando o nível não tem modelo próprio.
 * @param modelosPorNivel Modelos específicos por nível (opcional).
 * @returns O modelo a usar no planejamento.
 */
export function escolherModelo(
  nivel: string,
  modelo: ModeloPlano,
  modelosPorNivel?: ModelosPorNivel,
): ModeloPlano {
  const nivelEfetivo = ehNivel(nivel) ? nivel : NIVEL_PADRAO;
  return modelosPorNivel?.[nivelEfetivo] ?? modelo;
}

/**
 * Gera e valida o plano com o modelo informado.
 * @param state Estado do grafo.
 * @param modelo Modelo com saída estruturada.
 * @returns O plano (JSON) para gravar no estado.
 * @throws {ErroValidacaoPlano} Se a resposta não obedecer ao `PlanoSchema`.
 */
async function planejarComModelo(state: typeof EstadoExecucao.State, modelo: ModeloPlano) {
  const prompt = montarPromptPlano(state);
  const resposta = await modelo.withStructuredOutput(PlanoSchema).invoke(prompt);

  // O modelo pode ignorar o schema; a revalidação garante o formato antes de executar.
  const validacao = PlanoSchema.safeParse(resposta);
  if (!validacao.success) {
    throw new ErroValidacaoPlano(validacao.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; '));
  }

  return { plano: JSON.stringify(validacao.data) };
}

/**
 * Adapta `planejar` para o grafo, fixando o modelo padrão e os modelos por nível.
 * @param modelo Modelo padrão.
 * @param modelosPorNivel Modelos específicos por nível (opcional).
 * @returns Nó que escolhe o modelo pelo `nivel` do estado.
 */
export function criarNoPlanejar(modelo: ModeloPlano, modelosPorNivel?: ModelosPorNivel) {
  return (state: typeof EstadoExecucao.State) =>
    planejarComModelo(state, escolherModelo(state.nivel, modelo, modelosPorNivel));
}
