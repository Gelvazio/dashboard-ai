import { useState } from 'react';
import { AlertCircle, ListTodo, Plus } from 'lucide-react';
import { useProjetoAtual } from '@/hooks/useProjetoAtual';
import { useTasks } from '@/hooks/useTasks';
import { useIndicadores } from '@/hooks/useIndicadores';
import { KpiCards } from '@/components/kpi';
import { EmConstrucao } from '@/components/EmConstrucao';
import { Botao } from '@/components/ui/Botao';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAcoesTask } from '@/hooks/useAcoesTask';
import { ProgressoFila, TaskDetailModal, TaskFormModal, TaskRowActions, TaskTable } from '@/components/tasks';
import type { Task } from '@/types';

/** Fila de tarefas do projeto selecionado. */
export function FilaView() {
  const { projeto } = useProjetoAtual();
  const { tasks, carregando, erro, recarregar, substituir, remover } = useTasks(projeto?.id);
  const indicadores = useIndicadores(projeto?.id);
  const acoes = useAcoesTask({ projectId: projeto?.id, substituir, remover, recarregar, onMudou: () => void indicadores.recarregar() });
  const [excluindo, setExcluindo] = useState<Task | null>(null);
  const [detalhe, setDetalhe] = useState<number | null>(null);
  const [form, setForm] = useState<{ aberto: boolean; task: Task | null }>({
    aberto: false,
    task: null,
  });

  if (!projeto) return <EmConstrucao titulo="Fila de Tarefas" tarefa="selecione um projeto para ver a fila" />;

  const editar = (task: Task) => setForm({ aberto: true, task });
  const atualizarTudo = () => {
    void recarregar();
    void indicadores.recarregar();
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <KpiCards dados={indicadores} />
      <section className="card animate-fade-in overflow-hidden">
        <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h2 className="flex items-center gap-2 font-semibold">
            <ListTodo className="size-4 text-brand-500" aria-hidden />
            Tasks
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {tasks.length}
            </span>
          </h2>
          <ProgressoFila tasks={tasks} />
          <Botao variante="primario" onClick={() => setForm({ aberto: true, task: null })} className="ml-auto">
            <Plus className="size-4" aria-hidden />
            Nova task
          </Botao>
        </header>
        {erro && (
          <p
            role="alert"
            className="flex items-center gap-2 border-b border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <AlertCircle className="size-4 shrink-0" aria-hidden />
            {erro}
          </p>
        )}
        <TaskTable
          tasks={tasks}
          carregando={carregando}
          onAbrir={(t) => setDetalhe(t.id)}
          onAlternar={(t) => void acoes.alternar(t)}
          ocupados={acoes.ocupados}
          acoes={(t) => <TaskRowActions task={t} acoes={acoes} onEditar={editar} onPedirExcluir={setExcluindo} />}
        />
        <TaskFormModal
          aberto={form.aberto}
          projeto={projeto}
          task={form.task}
          onFechar={() => setForm((f) => ({ ...f, aberto: false }))}
          onSalva={atualizarTudo}
        />
        <TaskDetailModal
          task={tasks.find((t) => t.id === detalhe) ?? null}
          projeto={projeto}
          referencia={tasks}
          onFechar={() => setDetalhe(null)}
          onEditar={editar}
        />
        <ConfirmDialog
          aberto={excluindo !== null}
          titulo={`Excluir ${excluindo?.codigo ?? ''}?`}
          perigo
          rotuloConfirmar="Excluir task"
          ocupado={excluindo ? acoes.ocupados.has(excluindo.id) : false}
          mensagem={
            <>
              <p>
                A task <strong>{excluindo?.titulo}</strong> sai da fila e não será executada.
              </p>
              <p className="mt-2 text-slate-500">
                A exclusão é lógica: dá para desfazer logo em seguida (o histórico e os logs são mantidos).
              </p>
            </>
          }
          onCancelar={() => setExcluindo(null)}
          onConfirmar={() => {
            if (excluindo) void acoes.excluir(excluindo).then(() => setExcluindo(null));
          }}
        />
      </section>
    </div>
  );
}
