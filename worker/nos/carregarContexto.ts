import { EstadoExecucao } from '../estado.js';
import { getTool } from '../../api/_lib/tools.js';

/** Memória vinda de `brain_search`: sempre tratada como dado não confiável no prompt. */
export interface MemoriaContexto {
  title: string;
  content: string;
  naoConfiavel: true;
}

export interface DepsContexto {
  /** Executa `brain_search` e devolve o texto da resposta MCP. */
  buscar: (args: { query: string; project?: string }) => Promise<{ texto: string; erro: boolean }>;
}

async function buscarNoRegistro(args: { query: string; project?: string }) {
  const ferramenta = getTool('brain_search');
  if (!ferramenta) return { texto: '', erro: true };
  const resposta = await ferramenta.handler(args);
  const texto = resposta.content.map((parte) => ('text' in parte ? parte.text : '')).join('\n');
  return { texto, erro: resposta.isError === true };
}

/**
 * Nó que carrega o contexto inicial (SUB-28.6).
 * Busca memórias relevantes com `brain_search` para a instrução e guarda em
 * `resultados.brain_search`, marcadas como não confiáveis. Falha na busca não
 * derruba a execução: segue sem contexto.
 */
export async function carregarContexto(
  state: typeof EstadoExecucao.State,
  deps: DepsContexto = { buscar: buscarNoRegistro },
) {
  const { instrucao, projeto } = state;
  let memorias: MemoriaContexto[] = [];
  if (instrucao.trim()) {
    try {
      const { texto, erro } = await deps.buscar({ query: instrucao, ...(projeto ? { project: projeto } : {}) });
      if (!erro && texto.trim()) memorias = [{ title: 'brain_search', content: texto, naoConfiavel: true }];
    } catch {
      memorias = [];
    }
  }
  return { resultados: { brain_search: memorias } };
}
