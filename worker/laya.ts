/**
 * Wrapper do Laya Server (SUB-47.1): chama `POST /v1/systemone` e `GET /health` do servidor
 * HTTP oficial (<https://github.com/NandhaKishorM/laya>, versão 0.4.6, commit `c73908d`).
 * Contrato tirado de `docs/http-api.md` e `laya/serve.py` dessa versão, não deduzido.
 *
 * Só roda no servidor (worker, Node): fica fora de `src/` para nada daqui ir ao navegador.
 * O fallback com Opus fica em `opus.ts` (SUB-47.14) e o modo híbrido em `classificador.ts`
 * (SUB-47.15). Os nomes dos campos do protocolo (`state`, `answers`…) seguem a API em inglês.
 */

const URL_PADRAO = 'http://localhost:8000';
// A 1ª chamada pode baixar os pesos do modelo (LAYA_PRELOAD=0 no docker-compose.laya.yml).
const TIMEOUT_PADRAO_MS = 60_000;
const ROTA_DECISAO = '/v1/systemone';
const ROTA_SAUDE = '/health';

/** Pergunta de múltipla escolha: `criteria` mapeia cada opção à sua descrição. */
export interface PerguntaEscolha {
  type: 'choice';
  instructions: string;
  criteria: Record<string, string>;
}

/** Pergunta de nota ordinal: `criteria` lista os níveis, do menor para o maior. */
export interface PerguntaNota {
  type: 'score';
  instructions: string;
  criteria: string[];
}

/** Pergunta de sim/não: a resposta é a probabilidade do "sim". */
export interface PerguntaSimNao {
  type: 'noul';
  instructions: string;
  criteria?: Record<string, string>;
  labels?: { false: string; true: string };
}

export type Pergunta = PerguntaEscolha | PerguntaNota | PerguntaSimNao;

/** Perguntas por id (o id volta como chave em `answers`). */
export type Perguntas = Record<string, Pergunta>;

/** O que será decidido: texto, objeto JSON ou lista (`state` do protocolo). */
export type Estado = string | Record<string, unknown> | unknown[];

/** Campos que toda resposta traz no payload completo do Laya. */
interface RespostaBase {
  /** Entropia normalizada — NÃO é a probabilidade da resposta. */
  confidence?: number;
  /** Probabilidade da resposta dada (usada como "confiança" pelo modo híbrido). */
  answer_confidence?: number;
  low_confidence?: boolean;
}

export interface RespostaEscolha extends RespostaBase {
  type: 'choice';
  choice: string;
  probabilities: Record<string, number>;
}

export interface RespostaNota extends RespostaBase {
  type: 'score';
  /** Índice esperado do nível; pode cair entre dois níveis. */
  score: number;
  probabilities: Record<string, number>;
  legend: Record<string, string>;
}

export interface RespostaSimNao extends RespostaBase {
  type: 'noul';
  /** Probabilidade do "sim". */
  noul: number;
}

export type Resposta = RespostaEscolha | RespostaNota | RespostaSimNao;

/** Corpo da resposta de `POST /v1/systemone`. */
export interface RespostaLaya {
  model: string;
  answers: Record<string, Resposta>;
  usage: { input_tokens: number; output_tokens: number; truncated?: boolean };
  routing?: { model: string; repo?: string; reason?: string };
}

/** Configuração da conexão com o Laya. */
export interface ConfiguracaoLaya {
  url: string;
  chave?: string;
  timeoutMs: number;
  /** Injetável para testes ou outro cliente HTTP (padrão: `fetch` global do Node). */
  buscar?: typeof fetch;
}

export type MotivoErroLaya = 'conexao' | 'timeout' | 'http' | 'resposta';

/** Erro do Laya com o motivo, para o modo híbrido decidir se cai no Opus. */
export class ErroLaya extends Error {
  constructor(
    readonly motivo: MotivoErroLaya,
    mensagem: string,
    readonly status?: number,
  ) {
    super(mensagem);
    this.name = 'ErroLaya';
  }
}

/** Situação do servidor segundo `GET /health`. */
export interface StatusLaya {
  disponivel: boolean;
  /** Checkpoints na memória (vazio até a 1ª chamada, com LAYA_PRELOAD=0). */
  carregados: string[];
  dispositivo?: string;
  erro?: string;
}

/**
 * Lê a configuração do Laya das variáveis de ambiente.
 * @param env - Variáveis (`LAYA_SERVER_URL`, `LAYA_API_KEY`, `LAYA_TIMEOUT_MS`).
 * @returns Configuração com os padrões aplicados.
 */
export function lerConfiguracaoLaya(env: NodeJS.ProcessEnv = process.env): ConfiguracaoLaya {
  const timeoutInformado = Number(env.LAYA_TIMEOUT_MS);
  const timeoutValido = Number.isFinite(timeoutInformado) && timeoutInformado > 0;
  return {
    url: (env.LAYA_SERVER_URL?.trim() || URL_PADRAO).replace(/\/+$/, ''),
    chave: env.LAYA_API_KEY?.trim() || undefined,
    timeoutMs: timeoutValido ? timeoutInformado : TIMEOUT_PADRAO_MS,
  };
}

/**
 * Monta os cabeçalhos, com o bearer só quando o servidor exige (`LAYA_API_KEY`).
 * @param chave - Chave do Laya, se houver.
 * @returns Cabeçalhos HTTP.
 */
function montarCabecalhos(chave?: string): Record<string, string> {
  const cabecalhos: Record<string, string> = { 'content-type': 'application/json' };
  if (chave) cabecalhos.authorization = `Bearer ${chave}`;
  return cabecalhos;
}

/**
 * Faz a requisição com timeout e traduz falhas de rede em `ErroLaya`.
 * @param config - Configuração da conexão.
 * @param rota - Caminho (ex.: `/health`).
 * @param corpo - Corpo JSON, para `POST`; sem ele faz `GET`.
 * @returns A resposta HTTP.
 * @throws {ErroLaya} `timeout` ou `conexao`.
 */
async function requisitar(
  config: ConfiguracaoLaya,
  rota: string,
  corpo?: unknown,
): Promise<Response> {
  const buscar = config.buscar ?? fetch;
  try {
    return await buscar(`${config.url}${rota}`, {
      method: corpo === undefined ? 'GET' : 'POST',
      headers: montarCabecalhos(config.chave),
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      signal: AbortSignal.timeout(config.timeoutMs),
    });
  } catch (erro) {
    const estourouTempo = erro instanceof Error && erro.name === 'TimeoutError';
    if (estourouTempo) {
      throw new ErroLaya('timeout', `Laya não respondeu em ${config.timeoutMs} ms`);
    }
    const detalhe = erro instanceof Error ? erro.message : String(erro);
    throw new ErroLaya('conexao', `Sem conexão com o Laya em ${config.url}: ${detalhe}`);
  }
}

/**
 * Confere se a resposta tem `answers` para todas as perguntas, cada uma com o tipo pedido.
 * @param corpo - JSON recebido.
 * @param perguntas - Perguntas enviadas.
 * @returns O corpo tipado.
 * @throws {ErroLaya} `resposta` quando o formato não bate com o contrato.
 */
function validarRespostaLaya(corpo: unknown, perguntas: Perguntas): RespostaLaya {
  const respostas = (corpo as Partial<RespostaLaya> | null)?.answers;
  if (!respostas || typeof respostas !== 'object') {
    throw new ErroLaya('resposta', 'Resposta do Laya sem o campo "answers"');
  }
  for (const [id, pergunta] of Object.entries(perguntas)) {
    const tipoRecebido = respostas[id]?.type;
    if (tipoRecebido !== pergunta.type) {
      throw new ErroLaya('resposta', `Resposta do Laya sem "${id}" do tipo "${pergunta.type}"`);
    }
  }
  return corpo as RespostaLaya;
}

/**
 * Pede ao Laya Server as decisões sobre um estado (`POST /v1/systemone`).
 * @param pedido - `estado` a decidir e `perguntas` por id.
 * @param config - Conexão (padrão: lida das variáveis de ambiente).
 * @returns Resposta do Laya, com uma entrada em `answers` por pergunta.
 * @throws {ErroLaya} `conexao`, `timeout`, `http` (status fora de 2xx) ou `resposta`.
 */
export async function classificarLaya(
  pedido: { estado: Estado; perguntas: Perguntas },
  config: ConfiguracaoLaya = lerConfiguracaoLaya(),
): Promise<RespostaLaya> {
  const resposta = await requisitar(config, ROTA_DECISAO, {
    state: pedido.estado,
    questions: pedido.perguntas,
  });
  if (!resposta.ok) {
    const detalhe = (await resposta.text().catch(() => '')).slice(0, 300);
    throw new ErroLaya('http', `Laya respondeu ${resposta.status}: ${detalhe}`, resposta.status);
  }

  const corpo: unknown = await resposta.json().catch(() => null);
  return validarRespostaLaya(corpo, pedido.perguntas);
}

/**
 * Consulta a saúde do Laya (`GET /health`). Nunca lança: falha vira `disponivel: false`.
 * @param config - Conexão (padrão: lida das variáveis de ambiente).
 * @returns Disponibilidade, checkpoints carregados e dispositivo (quando o servidor informa).
 */
export async function statusLaya(
  config: ConfiguracaoLaya = lerConfiguracaoLaya(),
): Promise<StatusLaya> {
  try {
    const resposta = await requisitar(config, ROTA_SAUDE);
    if (!resposta.ok) {
      return { disponivel: false, carregados: [], erro: `HTTP ${resposta.status}` };
    }

    type CorpoSaude = { status?: string; loaded?: string[]; device?: string };
    const corpo = (await resposta.json()) as CorpoSaude;
    return {
      disponivel: corpo.status === 'ok',
      carregados: Array.isArray(corpo.loaded) ? corpo.loaded : [],
      dispositivo: corpo.device,
    };
  } catch (erro) {
    const detalhe = erro instanceof Error ? erro.message : String(erro);
    return { disponivel: false, carregados: [], erro: detalhe };
  }
}
