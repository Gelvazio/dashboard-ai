import { EstadoExecucao } from '../estado.js';
import { criarFerramentaLangChain } from '../ferramentas.js';
import { PlanoSchema } from '../plano.js';
import { getTool, listTools, type ToolDefinition } from '../../api/_lib/tools.js';

export interface DepsExecutar {
  /** Definição MCP da ferramenta (`inputSchema` vira o schema zod da SUB-28.19). */
  obterDefinicao: (nome: string) => Promise<ToolDefinition | undefined>;
  /** Chama o handler MCP; a chave de idempotência acompanha a chamada. */
  chamar: (nome: string, args: Record<string, unknown>, chaveIdempotencia: string) => Promise<string>;
}

async function chamarNoRegistro(nome: string, args: Record<string, unknown>) {
  const ferramenta = getTool(nome);
  if (!ferramenta) throw new Error(`Ferramenta não disponível: ${nome}`);
  const resposta = await ferramenta.handler(args);
  const texto = resposta.content.map((parte) => ('text' in parte ? parte.text : '')).join('\n');
  if (resposta.isError) throw new Error(texto || `Falha em ${nome}`);
  return texto;
}

const DEPS_PADRAO: DepsExecutar = {
  obterDefinicao: async (nome) => (await listTools()).find((definicao) => definicao.name === nome),
  chamar: chamarNoRegistro,
};

/** Chave de idempotência do passo `indice` da execução. */
export function chaveDoPasso(execucaoId: string, indice: number): string {
  return `${execucaoId}:passo-${indice}`;
}

/**
 * Nó que executa o passo atual (SUB-28.9).
 * Pega o primeiro passo do plano sem resultado em `resultados["passo-<i>"]` e o executa
 * com a chave `${execucaoId}:passo-<i>`; passos com resultado no estado (retomada do
 * checkpoint) não são repetidos. Falha vai para `resultados.erro` (o nó `revisar` decide).
 */
export async function executar(state: typeof EstadoExecucao.State, deps: DepsExecutar = DEPS_PADRAO) {
  const { execucaoId, resultados, plano } = state;
  const { passos } = PlanoSchema.parse(JSON.parse(plano || '{"passos":[]}'));

  const indice = passos.findIndex((_passo, posicao) => resultados[`passo-${posicao}`] === undefined);
  if (indice === -1) {
    return { passoAtual: '', final: true };
  }

  const passo = passos[indice];
  const chaveIdempotencia = chaveDoPasso(execucaoId, indice);
  try {
    const definicao = await deps.obterDefinicao(passo.ferramenta);
    if (!definicao) throw new Error(`Ferramenta não disponível: ${passo.ferramenta}`);
    const ferramenta = criarFerramentaLangChain(definicao, (args) => deps.chamar(passo.ferramenta, args, chaveIdempotencia));
    const resultado = await ferramenta.invoke(passo.argumentos);
    return { passoAtual: passo.ferramenta, resultados: { [`passo-${indice}`]: resultado, erro: null } };
  } catch (erro) {
    return { passoAtual: passo.ferramenta, resultados: { erro: erro instanceof Error ? erro.message : String(erro) } };
  }
}
