import type { PrioridadeProjeto } from '@/types/database';

const SLUG_PROJETO_RE = /^[a-z0-9][a-z0-9_-]{0,62}$/;
const PREFIXO_PROJETO_RE = /^[A-Z][A-Z0-9]{0,15}$/;
const COR_PROJETO_RE = /^#[0-9a-fA-F]{6}$/;
const ICONE_PROJETO_RE = /^[a-z0-9-]{1,64}$/;
const URL_PROJETO_RE = /^https?:\/\//i;
const PRIORIDADES_PROJETO: readonly PrioridadeProjeto[] = ['MAXIMA', 'ALTA', 'MEDIA', 'BAIXA'];

/** Campos editáveis necessários para validar o formulário de projeto. */
export interface DadosValidacaoProjeto {
  nome: string;
  slug: string;
  prefixo_codigo: string;
  cor: string | null;
  icone: string | null;
  url_producao: string | null;
  url_documentacao: string | null;
  prioridade: PrioridadeProjeto;
  data_prevista_fim: string | null;
}

/** Valida uma data ISO completa e rejeita datas impossíveis do calendário. */
function dataIsoValida(data: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const dataConvertida = new Date(`${data}T00:00:00.000Z`);
  return !Number.isNaN(dataConvertida.getTime()) && dataConvertida.toISOString().startsWith(data);
}

/** Valida os campos do cadastro e devolve somente as mensagens de erro. */
export function validarProjeto(
  dados: DadosValidacaoProjeto,
): Partial<Record<keyof DadosValidacaoProjeto, string>> {
  const erros: Partial<Record<keyof DadosValidacaoProjeto, string>> = {};
  if (!dados.nome?.trim()) erros.nome = 'Informe o nome do projeto.';
  if (!SLUG_PROJETO_RE.test(dados.slug ?? '')) {
    erros.slug = 'Use letras minúsculas, números, hífen ou sublinhado.';
  }
  if (!PREFIXO_PROJETO_RE.test(dados.prefixo_codigo ?? '')) {
    erros.prefixo_codigo = 'Use letras maiúsculas e números; comece por uma letra.';
  }
  if (dados.cor && !COR_PROJETO_RE.test(dados.cor)) {
    erros.cor = 'Informe uma cor hexadecimal no formato #RRGGBB.';
  }
  if (dados.icone && !ICONE_PROJETO_RE.test(dados.icone)) {
    erros.icone = 'O ícone deve conter letras minúsculas, números ou hífen.';
  }
  if (dados.url_producao && !URL_PROJETO_RE.test(dados.url_producao)) {
    erros.url_producao = 'A URL de produção deve começar com http:// ou https://.';
  }
  if (dados.url_documentacao && !URL_PROJETO_RE.test(dados.url_documentacao)) {
    erros.url_documentacao = 'A URL da documentação deve começar com http:// ou https://.';
  }
  if (!PRIORIDADES_PROJETO.includes(dados.prioridade)) {
    erros.prioridade = 'Selecione uma prioridade válida.';
  }
  if (dados.data_prevista_fim && !dataIsoValida(dados.data_prevista_fim)) {
    erros.data_prevista_fim = 'Informe uma data válida.';
  }
  return erros;
}
