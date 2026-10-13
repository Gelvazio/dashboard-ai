/**
 * Lista de projetos cadastrados: tabela no desktop e cards no celular.
 *
 * Só apresenta e dispara ações — a persistência fica em `projectService` e o
 * que fazer ao clicar em Editar é decidido por quem usa o componente.
 */
import { useState } from 'react';
import { Pencil, Power, PowerOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatarDataHora } from '@/lib/tasks';
import { definirProjetoAtivo } from '@/services/projectService';
import type { PrioridadeProjeto, Project } from '@/types';
import { Botao } from '@/components/ui/Botao';
import { StatusProjetoBadge } from './StatusProjetoBadge';

export interface ProjetosListaProps {
  projetos: Project[];
  /** Abre o formulário de edição (quem usa decide se é modal, inline…). */
  onEditar?: (projeto: Project) => void;
  /** Chamado com o projeto atualizado depois de ativar/inativar. */
  onMudou?: (projeto: Project) => void;
  /** Define quais projetos o usuário pode editar e ativar/inativar. */
  podeGerenciar?: (projeto: Project) => boolean;
  className?: string;
}

const TH =
  'whitespace-nowrap px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400';
const TD = 'px-3 py-2.5 align-middle';

const ROTULO_PRIORIDADE: Record<PrioridadeProjeto, string> = {
  MAXIMA: 'Máxima',
  ALTA: 'Alta',
  MEDIA: 'Média',
  BAIXA: 'Baixa',
};

const ESTILO_PRIORIDADE: Record<PrioridadeProjeto, string> = {
  MAXIMA: 'bg-rose-100 text-rose-700 ring-rose-600/20 dark:bg-rose-500/15 dark:text-rose-300',
  ALTA: 'bg-amber-100 text-amber-800 ring-amber-600/20 dark:bg-amber-500/15 dark:text-amber-300',
  MEDIA: 'bg-sky-100 text-sky-800 ring-sky-600/20 dark:bg-sky-500/15 dark:text-sky-300',
  BAIXA: 'bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-700 dark:text-slate-300',
};

/** Prioridade do projeto: `prioridade` da tabela `projects` (MAXIMA/ALTA/MEDIA/BAIXA). */
function PrioridadeProjetoBadge({ prioridade }: { prioridade: PrioridadeProjeto }) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        ESTILO_PRIORIDADE[prioridade],
      )}
    >
      {ROTULO_PRIORIDADE[prioridade]}
    </span>
  );
}

/** Bolinha com a cor do projeto. A cor vem do banco (`#RRGGBB`), então vai no `fill` do SVG. */
function BolaCor({ cor, nome }: { cor: string | null; nome: string }) {
  return (
    <svg viewBox="0 0 12 12" className="size-3 shrink-0" role="img" aria-label={`Cor do projeto ${nome}`}>
      <circle
        cx="6"
        cy="6"
        r="5"
        strokeWidth="1"
        fill={cor ?? undefined}
        className={
          cor
            ? 'stroke-slate-300 dark:stroke-slate-600'
            : 'fill-slate-200 stroke-slate-300 dark:fill-slate-700 dark:stroke-slate-600'
        }
      />
    </svg>
  );
}

export function ProjetosLista({
  projetos,
  onEditar,
  onMudou,
  podeGerenciar,
  className,
}: ProjetosListaProps) {
  const [ocupado, setOcupado] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function alternarAtivo(projeto: Project) {
    setOcupado(projeto.id);
    setErro(null);
    try {
      onMudou?.(await definirProjetoAtivo(projeto.id, !projeto.ativo));
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível alterar o status do projeto.');
    } finally {
      setOcupado(null);
    }
  }

  if (projetos.length === 0) {
    return (
      <p className={cn('px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400', className)}>
        Nenhum projeto cadastrado.
      </p>
    );
  }

  const acoes = (p: Project) => (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {onEditar && (!podeGerenciar || podeGerenciar(p)) && (
        <Botao variante="fantasma" onClick={() => onEditar(p)} aria-label={`Editar ${p.nome}`}>
          <Pencil className="size-4" aria-hidden /> Editar
        </Botao>
      )}
      {(!podeGerenciar || podeGerenciar(p)) && (
        <Botao
          variante={p.ativo ? 'secundario' : 'primario'}
          carregando={ocupado === p.id}
          onClick={() => void alternarAtivo(p)}
          aria-label={p.ativo ? `Inativar ${p.nome}` : `Ativar ${p.nome}`}
        >
          {p.ativo ? <PowerOff className="size-4" aria-hidden /> : <Power className="size-4" aria-hidden />}
          {p.ativo ? 'Inativar' : 'Ativar'}
        </Botao>
      )}
    </div>
  );

  return (
    <div className={className}>
      {erro && (
        <p
          role="alert"
          className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
        >
          {erro}
        </p>
      )}

      {/* Desktop/tablet */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/60">
            <tr>
              <th className={TH}>Projeto</th>
              <th className={TH}>Identificador</th>
              <th className={TH}>Prioridade</th>
              <th className={TH}>Status</th>
              <th className={TH}>Criado em</th>
              <th className={cn(TH, 'text-right')}>Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {projetos.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td className={TD}>
                  <div className="flex items-center gap-2">
                    <BolaCor cor={p.cor} nome={p.nome} />
                    <span className="font-medium text-slate-800 dark:text-slate-100">{p.nome}</span>
                  </div>
                </td>
                <td className={cn(TD, 'font-mono text-xs text-slate-600 dark:text-slate-400')}>{p.slug}</td>
                <td className={TD}>
                  <PrioridadeProjetoBadge prioridade={p.prioridade} />
                </td>
                <td className={TD}>
                  <StatusProjetoBadge ativo={p.ativo} />
                </td>
                <td className={cn(TD, 'whitespace-nowrap text-slate-600 dark:text-slate-400')}>
                  {formatarDataHora(p.created_at)}
                </td>
                <td className={cn(TD, 'whitespace-nowrap text-right')}>{acoes(p)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Celular */}
      <ul className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
        {projetos.map((p) => (
          <li key={p.id} className="flex flex-col gap-2 px-4 py-3">
            <div className="flex items-center gap-2">
              <BolaCor cor={p.cor} nome={p.nome} />
              <span className="font-medium text-slate-800 dark:text-slate-100">{p.nome}</span>
              <span className="ml-auto">
                <StatusProjetoBadge ativo={p.ativo} />
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-mono">{p.slug}</span>
              <PrioridadeProjetoBadge prioridade={p.prioridade} />
              <span>Criado em {formatarDataHora(p.created_at)}</span>
            </div>
            <div className="flex justify-end">{acoes(p)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
