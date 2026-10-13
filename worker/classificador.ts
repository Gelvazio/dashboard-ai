/**
 * Classificador híbrido (SUB-47.15): junta o Laya (`laya.ts`, SUB-47.1) e o Opus (`opus.ts`,
 * SUB-47.14) conforme `CLASSIFICADOR_MODE`:
 * - `laya`: só o Laya;
 * - `opus`: só o Opus;
 * - `hybrid` (padrão): tenta o Laya; se alguma resposta tiver confiança abaixo do limiar, ou o
 *   Laya falhar, pede a decisão ao Opus.
 * Nunca inventa resposta: se ninguém conseguir responder, lança `ErroClassificador`.
 * Só no servidor (usa a `ANTHROPIC_API_KEY` pelo `opus.ts`).
 */
import { classificarLaya, type Estado, type Perguntas, type RespostaLaya } from './laya.js';
import { classificarComOpus } from './opus.js';

/** Política deste projeto (docs/laya-server.md), não um limiar universal do modelo. */
export const LIMIAR_CONFIANCA = 0.7;
const MODO_PADRAO: ModoClassificador = 'hybrid';
const MODOS_VALIDOS: readonly ModoClassificador[] = ['laya', 'opus', 'hybrid'];

export type ModoClassificador = 'laya' | 'opus' | 'hybrid';
export type NomeClassificador = 'laya' | 'opus';

/** Pedido de classificação: o estado e as perguntas (as mesmas para Laya e Opus). */
export interface PedidoClassificacao {
  estado: Estado;
  perguntas: Perguntas;
}

/** Decisão final, com os metadados de como foi tomada. */
export interface DecisaoClassificacao {
  resposta: RespostaLaya;
  classificador: NomeClassificador;
  /** Menor `answer_confidence` entre as respostas (null se alguma não trouxe). */
  confianca: number | null;
  tempoMs: number;
  /** Por que o Opus foi chamado no modo `hybrid` (ausente quando o Laya bastou). */
  motivoRevisao?: string;
  /**
   * true quando a confiança final ficou abaixo do limiar (ou não veio) — por exemplo, no modo
   * `laya`, ou no `hybrid` quando o Opus não conseguiu revisar. Quem usa deve tratar como incerta.
   */
  baixaConfianca: boolean;
}

/** Erro quando não há decisão (modo inválido ou classificadores falharam). */
export class ErroClassificador extends Error {
  constructor(
    mensagem: string,
    readonly causas: unknown[] = [],
  ) {
    super(mensagem);
    this.name = 'ErroClassificador';
  }
}

/** Dependências injetáveis (padrão: os classificadores reais e o relógio do sistema). */
export interface DependenciasClassificador {
  modo?: ModoClassificador;
  laya?: (pedido: PedidoClassificacao) => Promise<RespostaLaya>;
  opus?: (pedido: PedidoClassificacao) => Promise<RespostaLaya>;
  agora?: () => number;
}

/**
 * Lê o modo de `CLASSIFICADOR_MODE` (vazio = `hybrid`).
 * @param env - Variáveis de ambiente.
 * @returns O modo.
 * @throws {ErroClassificador} Se o valor não for `laya`, `opus` nem `hybrid`.
 */
export function lerModoClassificador(env: NodeJS.ProcessEnv = process.env): ModoClassificador {
  const informado = env.CLASSIFICADOR_MODE?.trim().toLowerCase();
  if (!informado) return MODO_PADRAO;
  if (!(MODOS_VALIDOS as readonly string[]).includes(informado)) {
    const permitidos = MODOS_VALIDOS.join(', ');
    throw new ErroClassificador(`CLASSIFICADOR_MODE inválido: "${informado}" (use ${permitidos})`);
  }
  return informado as ModoClassificador;
}

/**
 * Menor confiança entre as respostas (`answer_confidence`, a probabilidade da resposta dada).
 * @param resposta - Resposta do Laya ou do Opus.
 * @returns A menor confiança, ou null se alguma resposta não trouxer o campo.
 */
export function menorConfianca(resposta: RespostaLaya): number | null {
  const valores = Object.values(resposta.answers).map((item) => item.answer_confidence);
  const todasTemConfianca = valores.length > 0
    && valores.every((valor) => typeof valor === 'number');
  return todasTemConfianca ? Math.min(...(valores as number[])) : null;
}

/**
 * Diz se uma confiança deve ser tratada como incerta (abaixo do limiar ou ausente).
 * @param confianca - Menor confiança das respostas.
 * @returns true quando é incerta.
 */
function ehIncerta(confianca: number | null): boolean {
  return confianca === null || confianca < LIMIAR_CONFIANCA;
}

/**
 * Texto curto de um erro, para os metadados e a mensagem final.
 * @param erro - Erro capturado.
 * @returns Mensagem do erro.
 */
function descreverErro(erro: unknown): string {
  return erro instanceof Error ? erro.message : String(erro);
}

/**
 * Roda um único classificador e mede o tempo.
 * @param opcoes - Nome, função e relógio.
 * @returns Decisão, ou lança o erro do classificador como `ErroClassificador`.
 */
async function usarSo(opcoes: {
  nome: NomeClassificador;
  executar: () => Promise<RespostaLaya>;
  agora: () => number;
}): Promise<DecisaoClassificacao> {
  const inicio = opcoes.agora();
  try {
    const resposta = await opcoes.executar();
    const confianca = menorConfianca(resposta);
    return { resposta, classificador: opcoes.nome, confianca,
      tempoMs: opcoes.agora() - inicio, baixaConfianca: ehIncerta(confianca) };
  } catch (erro) {
    throw new ErroClassificador(`O ${opcoes.nome} falhou: ${descreverErro(erro)}`, [erro]);
  }
}

/**
 * Modo `hybrid`: Laya primeiro; Opus revisa quando a confiança é baixa ou o Laya falha.
 * @param pedido - Estado e perguntas.
 * @param dependencias - Classificadores e relógio já resolvidos.
 * @returns A decisão.
 * @throws {ErroClassificador} Quando nem o Laya nem o Opus deram resposta.
 */
async function classificarHibrido(
  pedido: PedidoClassificacao,
  dependencias: Required<Omit<DependenciasClassificador, 'modo'>>,
): Promise<DecisaoClassificacao> {
  const { laya, opus, agora } = dependencias;
  const inicio = agora();
  let respostaLaya: RespostaLaya | undefined;
  let motivoRevisao: string;
  try {
    respostaLaya = await laya(pedido);
    const confianca = menorConfianca(respostaLaya);
    if (!ehIncerta(confianca)) {
      return { resposta: respostaLaya, classificador: 'laya', confianca,
        tempoMs: agora() - inicio, baixaConfianca: false };
    }
    motivoRevisao = confianca === null
      ? 'Laya não informou a confiança de todas as respostas'
      : `confiança do Laya ${confianca.toFixed(2)} abaixo de ${LIMIAR_CONFIANCA}`;
  } catch (erro) {
    motivoRevisao = `Laya falhou: ${descreverErro(erro)}`;
  }
  return revisarComOpus({ pedido, respostaLaya, motivoRevisao, opus, agora, inicio });
}

/**
 * Pede a decisão ao Opus; se ele falhar, mantém o Laya (marcado como incerto) ou lança.
 * @param contexto - Pedido, resposta do Laya (se houve), motivo, Opus, relógio e início.
 * @returns A decisão.
 * @throws {ErroClassificador} Quando o Opus falha e não há resposta do Laya.
 */
async function revisarComOpus(contexto: {
  pedido: PedidoClassificacao;
  respostaLaya?: RespostaLaya;
  motivoRevisao: string;
  opus: (pedido: PedidoClassificacao) => Promise<RespostaLaya>;
  agora: () => number;
  inicio: number;
}): Promise<DecisaoClassificacao> {
  const { pedido, respostaLaya, motivoRevisao, opus, agora, inicio } = contexto;
  try {
    const resposta = await opus(pedido);
    const confianca = menorConfianca(resposta);
    return { resposta, classificador: 'opus', confianca,
      tempoMs: agora() - inicio, motivoRevisao, baixaConfianca: ehIncerta(confianca) };
  } catch (erroOpus) {
    const motivoCompleto = `${motivoRevisao}; Opus falhou: ${descreverErro(erroOpus)}`;
    if (!respostaLaya) {
      throw new ErroClassificador(`Nenhum classificador respondeu (${motivoCompleto})`, [erroOpus]);
    }
    const confianca = menorConfianca(respostaLaya);
    return { resposta: respostaLaya, classificador: 'laya', confianca,
      tempoMs: agora() - inicio, motivoRevisao: motivoCompleto,
      baixaConfianca: ehIncerta(confianca) };
  }
}

/**
 * Classifica o estado conforme o modo (`CLASSIFICADOR_MODE`, padrão `hybrid`).
 * @param pedido - Estado e perguntas.
 * @param dependencias - Opcional: modo, classificadores e relógio (para testes ou outro uso).
 * @returns A decisão, com qual classificador respondeu, a confiança e o tempo.
 * @throws {ErroClassificador} Modo inválido ou nenhum classificador respondeu.
 */
export async function classificar(
  pedido: PedidoClassificacao,
  dependencias: DependenciasClassificador = {},
): Promise<DecisaoClassificacao> {
  const resolvidas = {
    laya: dependencias.laya ?? ((itens: PedidoClassificacao) => classificarLaya(itens)),
    opus: dependencias.opus ?? ((itens: PedidoClassificacao) => classificarComOpus(itens)),
    agora: dependencias.agora ?? Date.now,
  };
  const modo = dependencias.modo ?? lerModoClassificador();
  if (modo === 'hybrid') return classificarHibrido(pedido, resolvidas);

  const executar = () => resolvidas[modo](pedido);
  return usarSo({ nome: modo, executar, agora: resolvidas.agora });
}
