import { useId, useState, type ChangeEvent, type FormEvent } from 'react';
import type { Project, PrioridadeProjeto } from '@/types';
import { Botao } from '@/components/ui/Botao';
import { validarProjeto, type DadosValidacaoProjeto } from '@/lib/projeto';
import { atualizarProjeto, criarProjeto } from '@/services/projectService';

type DadosFormularioProjeto = DadosValidacaoProjeto & {
  descricao: string;
  repositorio: string;
  branch_padrao: string;
};

type CampoFormularioProjeto = keyof DadosFormularioProjeto;

const CAMPO = [
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900',
  'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30',
  'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
].join(' ');

const PRIORIDADE_PADRAO: PrioridadeProjeto = 'MEDIA';
const DADOS_VAZIOS: DadosFormularioProjeto = {
  nome: '',
  slug: '',
  prefixo_codigo: 'TASK',
  descricao: '',
  repositorio: '',
  branch_padrao: 'main',
  cor: null,
  icone: null,
  url_producao: null,
  url_documentacao: null,
  prioridade: PRIORIDADE_PADRAO,
  data_prevista_fim: null,
};

export interface ProjetoFormProps {
  /** Projeto existente para editar; omitido no modo de criação. */
  projeto?: Project;
  /** Chamado após a criação ou atualização bem-sucedida. */
  onSalvou?: (projeto: Project) => void;
  /** Chamado quando a pessoa cancela o formulário. */
  onCancelar?: () => void;
}

/** Prepara somente os campos editáveis do projeto, sem enviar colunas de auditoria. */
function dadosDoProjeto(projeto?: Project): DadosFormularioProjeto {
  if (!projeto) return { ...DADOS_VAZIOS };
  return {
    nome: projeto.nome,
    slug: projeto.slug,
    prefixo_codigo: projeto.prefixo_codigo,
    descricao: projeto.descricao ?? '',
    repositorio: projeto.repositorio ?? '',
    branch_padrao: projeto.branch_padrao,
    cor: projeto.cor,
    icone: projeto.icone,
    url_producao: projeto.url_producao,
    url_documentacao: projeto.url_documentacao,
    prioridade: projeto.prioridade,
    data_prevista_fim: projeto.data_prevista_fim,
  };
}

/** Formulário para criar ou editar os campos básicos de um projeto. */
export function ProjetoForm({ projeto, onSalvou, onCancelar }: ProjetoFormProps) {
  const id = useId();
  const [dados, setDados] = useState<DadosFormularioProjeto>(() => dadosDoProjeto(projeto));
  const [erros, setErros] = useState<Partial<Record<CampoFormularioProjeto, string>>>({});
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  /** Atualiza um campo do formulário e mantém os demais valores. */
  function alterar(campo: CampoFormularioProjeto, valor: string) {
    setDados((atuais) => ({ ...atuais, [campo]: valor }));
  }

  /** Valida e persiste os campos básicos do projeto. */
  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const novosErros = validarProjeto(dados);
    setErros(novosErros);
    setErro(null);
    if (Object.keys(novosErros).length > 0) return;

    setCarregando(true);
    try {
      const salvo = projeto
        ? await atualizarProjeto(projeto.id, dados)
        : await criarProjeto(dados);
      onSalvou?.(salvo);
    } catch (falha) {
      setErro((falha as Error).message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={(evento) => void enviar(evento)} noValidate className="space-y-4">
      <CampoProjeto
        id={`${id}-nome`}
        rotulo="Nome"
        valor={dados.nome}
        erro={erros.nome}
        onChange={(valor) => alterar('nome', valor)}
      />
      <CampoProjeto
        id={`${id}-slug`}
        rotulo="Identificador"
        valor={dados.slug}
        erro={erros.slug}
        onChange={(valor) => alterar('slug', valor)}
      />
      <CampoProjeto
        id={`${id}-descricao`}
        rotulo="Descrição"
        valor={dados.descricao}
        onChange={(valor) => alterar('descricao', valor)}
        multiline
      />
      <CampoProjeto
        id={`${id}-prefixo`}
        rotulo="Prefixo do código"
        valor={dados.prefixo_codigo}
        erro={erros.prefixo_codigo}
        onChange={(valor) => alterar('prefixo_codigo', valor)}
      />
      <CampoProjeto
        id={`${id}-repositorio`}
        rotulo="Repositório"
        valor={dados.repositorio}
        onChange={(valor) => alterar('repositorio', valor)}
      />
      <CampoProjeto
        id={`${id}-branch`}
        rotulo="Branch padrão"
        valor={dados.branch_padrao}
        onChange={(valor) => alterar('branch_padrao', valor)}
      />
      {erro && <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">{erro}</p>}
      <div className="flex justify-end gap-2">
        {onCancelar && <Botao onClick={onCancelar}>Cancelar</Botao>}
        <Botao type="submit" variante="primario" carregando={carregando}>
          {projeto ? 'Salvar alterações' : 'Criar projeto'}
        </Botao>
      </div>
    </form>
  );
}

interface CampoProjetoProps {
  id: string;
  rotulo: string;
  valor: string;
  erro?: string;
  onChange: (valor: string) => void;
  multiline?: boolean;
}

/** Renderiza um campo básico com rótulo e erro acessíveis. */
function CampoProjeto({ id, rotulo, valor, erro, onChange, multiline = false }: CampoProjetoProps) {
  const a11y = {
    id,
    value: valor,
    onChange: (evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(evento.target.value),
    'aria-invalid': Boolean(erro),
    'aria-describedby': erro ? `${id}-erro` : undefined,
    className: CAMPO,
  };

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
        {rotulo}
      </label>
      {multiline ? <textarea {...a11y} rows={3} /> : <input {...a11y} type="text" />}
      {erro && <p id={`${id}-erro`} className="text-xs text-rose-600 dark:text-rose-400">{erro}</p>}
    </div>
  );
}
