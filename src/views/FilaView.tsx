import { useState } from 'react';
import { AlertCircle, ListTodo, Pencil, Plus } from 'lucide-react';
import { useProjetoAtual } from '@/hooks/useProjetoAtual';
import { useTasks } from '@/hooks/useTasks';
import { useIndicadores } from '@/hooks/useIndicadores';
import { KpiCards } from '@/components/kpi';
import { EmConstrucao } from '@/components/EmConstrucao';
import { Botao } from '@/components/ui/Botao';
import { Tooltip } from '@/components/ui/Tooltip';
import { ProgressoFila, TaskFormModal, TaskTable } from '@/components/tasks';
import type { Task } from '@/types';

/** Fila de tarefas do projeto selecionado. */
export function FilaView() {
  const { projeto } = useProjetoAtual();
  const { tasks, carregando, erro, recarregar } = useTasks(projeto?.id);
  const indicadores = useIndicadores(projeto?.id);
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
          acoes={(t) => (
            <Tooltip conteudo={`Editar ${t.codigo}`}>
              <button
                type="button"
                onClick={() => editar(t)}
                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800"
                aria-label={`Editar ${t.codigo}`}
              >
                <Pencil className="size-4" />
              </button>
            </Tooltip>
          )}
        />
        <TaskFormModal
          aberto={form.aberto}
          projeto={projeto}
          task={form.task}
          onFechar={() => setForm((f) => ({ ...f, aberto: false }))}
          onSalva={atualizarTudo}
        />
      </section>
    </div>
  );
}
