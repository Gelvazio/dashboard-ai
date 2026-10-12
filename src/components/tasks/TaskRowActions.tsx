import type { ComponentType } from 'react';
import { Ban, CheckCheck, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { acoesDisponiveis } from '@/lib/tasks';
import type { AcoesTask } from '@/hooks/useAcoesTask';
import type { Task } from '@/types';
import { Tooltip } from '@/components/ui/Tooltip';

interface Props {
  task: Task;
  acoes: AcoesTask;
  onEditar: (t: Task) => void;
  onPedirExcluir: (t: Task) => void;
}

function Acao({
  icone: Icone,
  rotulo,
  onClick,
  cor,
  desabilitado,
}: {
  icone: ComponentType<{ className?: string }>;
  rotulo: string;
  onClick: () => void;
  cor: string;
  desabilitado?: boolean;
}) {
  return (
    <Tooltip conteudo={rotulo}>
      <button
        type="button"
        onClick={onClick}
        disabled={desabilitado}
        aria-label={rotulo}
        className={cn(
          'rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800',
          cor,
        )}
      >
        <Icone className="size-4" />
      </button>
    </Tooltip>
  );
}

/** Botões de ação rápida da linha (só aparecem os permitidos para o status). */
export function TaskRowActions({ task, acoes, onEditar, onPedirExcluir }: Props) {
  const pode = acoesDisponiveis(task);
  const ocupado = acoes.ocupados.has(task.id);
  if (!pode.editar) {
    return (
      <span className="text-[11px] text-slate-400" title="Em execução: só a fila pode alterar">
        bloqueada
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-end gap-0.5">
      {pode.concluir && (
        <Acao
          icone={CheckCheck}
          rotulo={`Concluir ${task.codigo} (task humana)`}
          cor="hover:text-emerald-600"
          desabilitado={ocupado}
          onClick={() => void acoes.concluir(task)}
        />
      )}
      {pode.reabrir && (
        <Acao
          icone={RotateCcw}
          rotulo={`Reabrir ${task.codigo} (volta para a fila)`}
          cor="hover:text-sky-600"
          desabilitado={ocupado}
          onClick={() => void acoes.reabrir(task)}
        />
      )}
      {pode.cancelar && (
        <Acao
          icone={Ban}
          rotulo={`Cancelar ${task.codigo}`}
          cor="hover:text-orange-600"
          desabilitado={ocupado}
          onClick={() => void acoes.cancelar(task)}
        />
      )}
      <Acao
        icone={Pencil}
        rotulo={`Editar ${task.codigo}`}
        cor="hover:text-brand-600"
        desabilitado={ocupado}
        onClick={() => onEditar(task)}
      />
      {pode.excluir && (
        <Acao
          icone={Trash2}
          rotulo={`Excluir ${task.codigo}`}
          cor="hover:text-rose-600"
          desabilitado={ocupado}
          onClick={() => onPedirExcluir(task)}
        />
      )}
    </span>
  );
}
