import { EstadoExecucao } from '../estado.js';
import { classificarFalha, type ClasseFalha } from '../falhas.js';

export interface OpcoesRevisao {
  /** Máximo de tentativas do mesmo passo (inclui a primeira). */
  limitePorNo: number;
  /** Espera da primeira repetição; dobra a cada nova tentativa. */
  esperaBaseMs: number;
}

export const OPCOES_REVISAO_PADRAO: OpcoesRevisao = { limitePorNo: 3, esperaBaseMs: 1000 };

export interface DecisaoRevisao {
  acao: 'seguir' | 'repetir' | 'finalizar';
  esperaMs: number;
  classe?: ClasseFalha;
}

/** Decide o próximo passo: só falha transitória repete, até o limite, com espera progressiva. */
export function decidirRevisao(erro: unknown, tentativas: number, opcoes = OPCOES_REVISAO_PADRAO): DecisaoRevisao {
  if (!erro) return { acao: 'seguir', esperaMs: 0 };
  const classe = classificarFalha(erro instanceof Error ? erro : new Error(String(erro)));
  if (classe === 'transitoria' && tentativas < opcoes.limitePorNo) {
    return { acao: 'repetir', esperaMs: opcoes.esperaBaseMs * 2 ** (tentativas - 1), classe };
  }
  return { acao: 'finalizar', esperaMs: 0, classe };
}

/**
 * Nó que revisa o resultado do passo (SUB-28.10).
 * Usa `classificarFalha` (SUB-28.21): transitória repete o passo até `limitePorNo`
 * (contador em `resultados["tentativas:<passo>"]`); demais falhas seguem para finalizar.
 */
export async function revisar(
  state: typeof EstadoExecucao.State,
  opcoes = OPCOES_REVISAO_PADRAO,
  esperar: (ms: number) => Promise<void> = (ms) => new Promise((ok) => setTimeout(ok, ms)),
) {
  const { passoAtual, resultados } = state;
  const chave = `tentativas:${passoAtual}`;
  const tentativas = Number(resultados[chave] ?? 1);
  const decisao = decidirRevisao(resultados['erro'], tentativas, opcoes);

  if (decisao.acao === 'repetir') {
    await esperar(decisao.esperaMs);
    return { final: false, resultados: { erro: null, [chave]: tentativas + 1 } };
  }
  if (decisao.acao === 'finalizar') {
    return { final: true, resultados: { classe_falha: decisao.classe } };
  }
  return { final: !passoAtual };
}
