import { AlertCircle, ListTodo } from 'lucide-react';
import { useProjetoAtual } from '@/hooks/useProjetoAtual';
import { useTasks } from '@/hooks/useTasks';
import { EmConstrucao } from '@/components/EmConstrucao';
import { ProgressoFila, TaskTable } from '@/components/tasks';

/** Fila de tarefas do projeto selecionado. */
export function FilaView() {
  const { projeto } = useProjetoAtual();
  const { tasks, carregando, erro } = useTasks(projeto?.id);

  if (!projeto) return <EmConstrucao titulo="Fila de Tarefas" tarefa="selecione um projeto para ver a fila" />;

  return (
    <section className="card animate-fade-in overflow-hidden">
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <h2 className="flex items-center gap-2 font-semibold">
          <ListTodo className="size-4 text-brand-500" aria-hidden />
          Tasks
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{tasks.length}</span>
        </h2>
        <ProgressoFila tasks={tasks} />
      </header>
      {erro && (
        <p role="alert" className="flex items-center gap-2 border-b border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {erro}
        </p>
      )}
      <TaskTable tasks={tasks} carregando={carregando} />
    </section>
  );
}
