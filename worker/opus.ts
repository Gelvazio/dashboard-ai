/**
 * Fallback com Opus (SUB-47.14): responde às mesmas perguntas do Laya (`laya.ts`) pela API de
 * Mensagens da Anthropic e devolve no MESMO formato (`RespostaLaya`), para o modo híbrido
 * (`classificador.ts`, SUB-47.15) trocar um pelo outro sem conversão.
 *
 * Só no servidor: lê a `ANTHROPIC_API_KEY` do ambiente e nunca a coloca em log ou mensagem de
 * erro. A resposta estruturada vem de uma ferramenta forçada (`tool_choice`), com um esquema
 * gerado a partir das perguntas, e é conferida antes de ser devolvida.
 * Referência: <https://platform.claude.com/docs/en/api/messages>.
 */
import type { Estado, Pergunta, Perguntas, Resposta, RespostaLaya } from './laya.js';

const URL_API = 'https://api.anthropic.com/v1/messages';
const VERSAO_API = '2023-06-01';
const MODELO_PADRAO = 'claude-opus-5-5';
const TIMEOUT_PADRAO_MS = 60_000;
const MAXIMO_TOKENS_SAIDA = 2_048;
const NOME_FERRAMENTA = 'registrar_decisoes';
const TAMANHO_MAXIMO_DETALHE = 300;
const INSTRUCOES_SISTEMA = [
  'Você classifica um estado (tarefa, texto ou documento) respondendo a perguntas tipadas.',
  'Responda SOMENTE pela ferramenta, uma entrada por pergunta, sem inventar opções.',
  'Em cada entrada, "confianca" é a sua probabilidade (0 a 1) de a resposta estar certa.',
].join(' ');

/** Configuração da chamada ao Opus. */
export interface ConfiguracaoOpus {
  chave?: string;
  modelo: string;
  timeoutMs: number;
  /** Injetável para testes ou outro cliente HTTP (padrão: `fetch` global do Node). */
  buscar?: typeof fetch;
}

export type MotivoErroOpus = 'configuracao' | 'conexao' | 'timeout' | 'http' | 'resposta';

/** Erro do Opus com o motivo (nunca contém a chave). */
export class ErroOpus extends Error {
  constructor(
    readonly motivo: MotivoErroOpus,
    mensagem: string,
    readonly status?: number,
  ) {
    super(mensagem);
    this.name = 'ErroOpus';
  }
}

/** Uma entrada da ferramenta: o valor da resposta e a confiança do modelo nela. */
interface EntradaDecisao {
  valor: string | number;
  confianca: number;
}

/**
 * Lê a configuração do Opus das variáveis de ambiente.
 * @param env - Variáveis (`ANTHROPIC_API_KEY`, `OPUS_MODELO`, `OPUS_TIMEOUT_MS`).
 * @returns Configuração com os padrões aplicados (a chave pode faltar; a chamada é que falha).
 */
export function lerConfiguracaoOpus(env: NodeJS.ProcessEnv = process.env): ConfiguracaoOpus {
  const timeoutInformado = Number(env.OPUS_TIMEOUT_MS);
  const timeoutValido = Number.isFinite(timeoutInformado) && timeoutInformado > 0;
  return {
    chave: env.ANTHROPIC_API_KEY?.trim() || undefined,
    modelo: env.OPUS_MODELO?.trim() || MODELO_PADRAO,
    timeoutMs: timeoutValido ? timeoutInformado : TIMEOUT_PADRAO_MS,
  };
}

/**
 * Esquema JSON do `valor` de uma pergunta, conforme o tipo.
 * @param pergunta - Pergunta do Laya.
 * @returns Esquema do valor (opção, índice do nível ou probabilidade do "sim").
 */
function esquemaDoValor(pergunta: Pergunta): Record<string, unknown> {
  const esquemas: Record<Pergunta['type'], () => Record<string, unknown>> = {
    choice: () => ({
      type: 'string',
      enum: Object.keys((pergunta as { criteria: object }).criteria),
    }),
    score: () => ({
      type: 'integer',
      minimum: 0,
      maximum: (pergunta as { criteria: string[] }).criteria.length - 1,
    }),
    noul: () => ({ type: 'number', minimum: 0, maximum: 1 }),
  };
  return esquemas[pergunta.type]();
}

/**
 * Monta a ferramenta forçada, com uma propriedade obrigatória por pergunta.
 * @param perguntas - Perguntas por id.
 * @returns Definição da ferramenta para o campo `tools` da API.
 */
function montarFerramenta(perguntas: Perguntas): Record<string, unknown> {
  const propriedades = Object.fromEntries(
    Object.entries(perguntas).map(([id, pergunta]) => [id, {
      type: 'object',
      properties: {
        valor: esquemaDoValor(pergunta),
        confianca: { type: 'number', minimum: 0, maximum: 1 },
      },
      required: ['valor', 'confianca'],
    }]),
  );
  return {
    name: NOME_FERRAMENTA,
    description: 'Registra a resposta a cada pergunta sobre o estado.',
    input_schema: { type: 'object', properties: propriedades, required: Object.keys(perguntas) },
  };
}

/**
 * Texto do pedido: o estado e cada pergunta com instruções e critérios.
 * @param estado - O que será decidido.
 * @param perguntas - Perguntas por id.
 * @returns Conteúdo da mensagem do usuário.
 */
function montarPedido(estado: Estado, perguntas: Perguntas): string {
  const textoEstado = typeof estado === 'string' ? estado : JSON.stringify(estado, null, 2);
  const textoPerguntas = Object.entries(perguntas)
    .map(([id, pergunta]) => {
      const sentido = pergunta.type === 'noul' ? ' (valor = probabilidade do "sim")' : '';
      const indice = pergunta.type === 'score' ? ' (valor = índice do nível, a partir de 0)' : '';
      const criterios = JSON.stringify(pergunta.criteria ?? {});
      const cabecalho = `- ${id} [${pergunta.type}]${sentido}${indice}: ${pergunta.instructions}`;
      return `${cabecalho}\n  ${criterios}`;
    })
    .join('\n');
  return `## Estado\n${textoEstado}\n\n## Perguntas\n${textoPerguntas}`;
}

/**
 * Converte a entrada da ferramenta numa resposta no formato do Laya.
 * @param pergunta - Pergunta original.
 * @param entrada - Valor e confiança dados pelo Opus.
 * @returns Resposta tipada, ou null se o valor não servir para a pergunta.
 */
function converterResposta(pergunta: Pergunta, entrada: EntradaDecisao): Resposta | null {
  const { valor, confianca } = entrada;
  const confiancaValida = typeof confianca === 'number' && confianca >= 0 && confianca <= 1;
  if (!confiancaValida) return null;

  if (pergunta.type === 'choice') {
    if (typeof valor !== 'string' || !(valor in pergunta.criteria)) return null;
    return { type: 'choice', choice: valor, probabilities: { [valor]: confianca },
      answer_confidence: confianca };
  }
  if (pergunta.type === 'score') {
    const nivelValido = Number.isInteger(valor) && Number(valor) >= 0
      && Number(valor) < pergunta.criteria.length;
    if (!nivelValido) return null;
    const legenda = Object.fromEntries(pergunta.criteria.map((texto, i) => [String(i), texto]));
    return { type: 'score', score: Number(valor), probabilities: { [String(valor)]: confianca },
      legend: legenda, answer_confidence: confianca };
  }
  if (typeof valor !== 'number' || valor < 0 || valor > 1) return null;
  return { type: 'noul', noul: valor, answer_confidence: confianca };
}

/**
 * Faz a chamada HTTP à API de Mensagens, com timeout, traduzindo falhas em `ErroOpus`.
 * @param config - Configuração (com a chave já conferida).
 * @param corpo - Corpo JSON da requisição.
 * @returns O JSON da resposta (status 2xx).
 * @throws {ErroOpus} `timeout`, `conexao` ou `http`.
 */
async function chamarApi(config: ConfiguracaoOpus, corpo: unknown): Promise<unknown> {
  const buscar = config.buscar ?? fetch;
  let resposta: Response;
  try {
    resposta = await buscar(URL_API, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'anthropic-version': VERSAO_API,
        'x-api-key': config.chave ?? '' },
      body: JSON.stringify(corpo),
      signal: AbortSignal.timeout(config.timeoutMs),
    });
  } catch (erro) {
    const estourouTempo = erro instanceof Error && erro.name === 'TimeoutError';
    if (estourouTempo) {
      throw new ErroOpus('timeout', `Opus não respondeu em ${config.timeoutMs} ms`);
    }
    throw new ErroOpus('conexao', `Sem conexão com a API da Anthropic: ${(erro as Error).message}`);
  }
  if (!resposta.ok) {
    const detalhe = (await resposta.text().catch(() => '')).slice(0, TAMANHO_MAXIMO_DETALHE);
    throw new ErroOpus('http', `API da Anthropic respondeu ${resposta.status}: ${detalhe}`,
      resposta.status);
  }
  return resposta.json().catch(() => null);
}

/**
 * Tira do corpo da API a entrada da ferramenta e o uso de tokens.
 * @param corpo - JSON devolvido pela API.
 * @returns Entradas por pergunta e o uso.
 * @throws {ErroOpus} `resposta` se não houver chamada da ferramenta.
 */
function extrairChamada(corpo: unknown): {
  entradas: Record<string, EntradaDecisao>;
  uso: { input_tokens: number; output_tokens: number };
} {
  type CorpoApi = {
    content?: { type?: string; name?: string; input?: Record<string, EntradaDecisao> }[];
    usage?: { input_tokens?: number; output_tokens?: number };
  };
  const { content, usage } = (corpo ?? {}) as CorpoApi;
  const ehDecisao = (bloco: { type?: string; name?: string }) =>
    bloco.type === 'tool_use' && bloco.name === NOME_FERRAMENTA;
  const chamada = content?.find(ehDecisao);
  if (!chamada?.input) {
    throw new ErroOpus('resposta', 'O Opus não devolveu a ferramenta de decisões');
  }
  return {
    entradas: chamada.input,
    uso: { input_tokens: usage?.input_tokens ?? 0, output_tokens: usage?.output_tokens ?? 0 },
  };
}

/**
 * Responde às perguntas sobre o estado com o Opus, no formato de resposta do Laya.
 * @param pedido - `estado` a decidir e `perguntas` por id (as mesmas do `classificarLaya`).
 * @param config - Configuração (padrão: lida das variáveis de ambiente).
 * @returns Resposta com `model` = modelo usado e uma entrada em `answers` por pergunta.
 * @throws {ErroOpus} `configuracao` (sem chave), `conexao`, `timeout`, `http` ou `resposta`.
 */
export async function classificarComOpus(
  pedido: { estado: Estado; perguntas: Perguntas },
  config: ConfiguracaoOpus = lerConfiguracaoOpus(),
): Promise<RespostaLaya> {
  if (!config.chave) {
    throw new ErroOpus('configuracao', 'Defina ANTHROPIC_API_KEY para usar o Opus');
  }

  const corpo = await chamarApi(config, {
    model: config.modelo,
    max_tokens: MAXIMO_TOKENS_SAIDA,
    system: INSTRUCOES_SISTEMA,
    messages: [{ role: 'user', content: montarPedido(pedido.estado, pedido.perguntas) }],
    tools: [montarFerramenta(pedido.perguntas)],
    tool_choice: { type: 'tool', name: NOME_FERRAMENTA },
  });
  const { entradas, uso } = extrairChamada(corpo);

  const respostas: Record<string, Resposta> = {};
  for (const [id, pergunta] of Object.entries(pedido.perguntas)) {
    const convertida = entradas[id] ? converterResposta(pergunta, entradas[id]) : null;
    if (!convertida) throw new ErroOpus('resposta', `Resposta do Opus inválida para "${id}"`);
    respostas[id] = convertida;
  }
  return { model: config.modelo, answers: respostas, usage: uso };
}
