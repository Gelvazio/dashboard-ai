import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { infoPrioridade } from '@/lib/tasks';
import { paraDadosTask, validarTask, valoresIniciais, type ErrosTask, type ValoresTask } from '@/lib/taskForm';
import { atualizarTask, criarTask } from '@/services/taskService';
import { useToast } from '@/hooks/useToast';
import type { Project, Task } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Botao } from '@/components/ui/Botao';

interface Props {
  aberto: boolean;
  projeto: Project;
  /** Task a editar; ausente = cadastro de nova task. */
  task?: Task | null;
  onFechar: () => void;
  onSalva: (task: Task, nova: boolean) => void;
}

const CAMPO = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-950';
const ERRO = 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/30 dark:border-rose-500/60';

function Campo({ id, rotulo, erro, ajuda, children, className }: { id: string; rotulo: string; erro?: string; ajuda?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">{rotulo}</label>
      {children}
      {erro ? <p id={`${id}-erro`} className="text-xs text-rose-600 dark:text-rose-400">{erro}</p> : ajuda && <p className="text-xs text-slate-500">{ajuda}</p>}
    </div>
  );
}

/** Modal de cadastro/edição de task do projeto selecionado (SUB-16). */
export function TaskFormModal({ aberto, projeto, task, onFechar, onSalva }: Props) {
  const toast = useToast();
  const [v, setV] = useState<ValoresTask>(() => valoresIniciais(task));
  const [erros, setErros] = useState<ErrosTask>({});
  const [salvando, setSalvando] = useState(false);
  const [falha, setFalha] = useState<string | null>(null);
  const editando = Boolean(task);

  useEffect(() => {
    if (aberto) { setV(valoresIniciais(task)); setErros({}); setFalha(null); }
  }, [aberto, task]);

  const mudar = <K extends keyof ValoresTask>(k: K, valor: ValoresTask[K]) => {
    setV((a) => ({ ...a, [k]: valor }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: undefined }));
  };
  const attrs = (k: keyof ValoresTask) => ({ id: `task-${k}`, 'aria-invalid': Boolean(erros[k]), 'aria-describedby': erros[k] ? `task-${k}-erro` : undefined });

  async function salvar(e: FormEvent) {
    e.preventDefault();
    const encontrados = validarTask(v, task?.codigo);
    setErros(encontrados);
    if (Object.keys(encontrados).length) {
      document.getElementById(`task-${Object.keys(encontrados)[0]}`)?.focus();
      return;
    }
    setSalvando(true);
    setFalha(null);
    try {
      const dados = paraDadosTask(v);
      const salva = task ? await atualizarTask(projeto.id, task.id, dados) : await criarTask(projeto.id, dados);
      toast.sucesso(task ? `Task ${salva.codigo} atualizada.` : `Task ${salva.codigo} criada em ${projeto.nome}.`);
      onSalva(salva, !task);
      onFechar();
    } catch (err) {
      const msg = (err as Error).message;
      setFalha(msg);
      toast.erro(msg);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal
      aberto={aberto}
      onFechar={salvando ? () => {} : onFechar}
      titulo={editando ? `Editar ${task?.codigo}` : 'Nova task'}
      descricao={<>Projeto <strong>{projeto.nome}</strong>{editando ? '' : ` · código gerado automaticamente (${projeto.prefixo_codigo}-NNNN)`}</>}
      rodape={
        <>
          <Botao onClick={onFechar} disabled={salvando}>Cancelar</Botao>
          <Botao variante="primario" type="submit" form="form-task" carregando={salvando}>
            {editando ? 'Salvar alterações' : 'Criar task'}
          </Botao>
        </>
      }
    >
      <form id="form-task" onSubmit={salvar} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-6">
        {falha && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 sm:col-span-6 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">{falha}</p>}

        <Campo id="task-titulo" rotulo="Título *" erro={erros.titulo} className="sm:col-span-6">
          <input {...attrs('titulo')} data-autofocus className={cn(CAMPO, erros.titulo && ERRO)} value={v.titulo} maxLength={200} onChange={(e) => mudar('titulo', e.target.value)} placeholder="Ex.: Adicionar paginação na listagem de pedidos" />
        </Campo>

        <Campo id="task-instrucao" rotulo="Instrução *" erro={erros.instrucao} ajuda={<>Markdown aceito. Descreva o objetivo, critérios de aceite e restrições. <span className="tabular-nums">{v.instrucao.length} caracteres</span></>} className="sm:col-span-6">
          <textarea {...attrs('instrucao')} className={cn(CAMPO, 'min-h-40 resize-y font-mono text-[13px] leading-relaxed', erros.instrucao && ERRO)} value={v.instrucao} onChange={(e) => mudar('instrucao', e.target.value)} placeholder={'## Objetivo\n...\n\n## Critérios de aceite\n- ...'} />
        </Campo>

        <fieldset className="flex flex-col gap-1 sm:col-span-4">
          <legend className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Prioridade *</legend>
          <div className="flex gap-1.5" role="radiogroup">
            {[1, 2, 3, 4, 5].map((p) => {
              const info = infoPrioridade(p);
              const ativo = v.prioridade === p;
              return (
                <button key={p} type="button" role="radio" aria-checked={ativo} onClick={() => mudar('prioridade', p)} title={info.rotulo}
                  className={cn('flex flex-1 flex-col items-center rounded-lg border px-1 py-1.5 text-xs transition', ativo ? cn(info.badge, 'border-transparent shadow-sm') : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800')}>
                  <span className="text-sm font-bold">{p}</span>
                  <span className="hidden sm:block">{info.rotulo}</span>
                </button>
              );
            })}
          </div>
          {erros.prioridade && <p className="text-xs text-rose-600">{erros.prioridade}</p>}
        </fieldset>

        <Campo id="task-ordem" rotulo="Ordem" erro={erros.ordem} ajuda="Desempate dentro da prioridade." className="sm:col-span-2">
          <input {...attrs('ordem')} type="number" step={1} className={cn(CAMPO, erros.ordem && ERRO)} value={v.ordem} onChange={(e) => mudar('ordem', e.target.value)} />
        </Campo>

        <Campo id="task-executarApos" rotulo="Executar após" erro={erros.executarApos} ajuda="Vazio = assim que possível." className="sm:col-span-3">
          <input {...attrs('executarApos')} type="datetime-local" className={cn(CAMPO, erros.executarApos && ERRO)} value={v.executarApos} onChange={(e) => mudar('executarApos', e.target.value)} />
        </Campo>

        <Campo id="task-maxTentativas" rotulo="Máximo de tentativas *" erro={erros.maxTentativas} ajuda="De 1 a 20." className="sm:col-span-3">
          <input {...attrs('maxTentativas')} type="number" min={1} max={20} className={cn(CAMPO, erros.maxTentativas && ERRO)} value={v.maxTentativas} onChange={(e) => mudar('maxTentativas', e.target.value)} />
        </Campo>

        <Campo id="task-dependencias" rotulo="Depende de" erro={erros.dependencias} ajuda="Códigos separados por vírgula (ex.: LOJA-0001, LOJA-0002)." className="sm:col-span-4">
          <input {...attrs('dependencias')} className={cn(CAMPO, 'font-mono', erros.dependencias && ERRO)} value={v.dependencias} onChange={(e) => mudar('dependencias', e.target.value)} placeholder={`${projeto.prefixo_codigo}-0001`} />
        </Campo>

        <fieldset className="flex flex-col gap-1 sm:col-span-2">
          <legend className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Executor</legend>
          <div className="flex gap-1.5">
            {([['ia', 'IA', Bot], ['humano', 'Humano', User]] as const).map(([tipo, rotulo, Icone]) => (
              <button key={tipo} type="button" aria-pressed={v.tipo === tipo} onClick={() => mudar('tipo', tipo)}
                className={cn('flex flex-1 items-center justify-center gap-1 rounded-lg border px-2 py-2 text-sm', v.tipo === tipo ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300' : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800')}>
                <Icone className="size-4" aria-hidden />{rotulo}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="flex items-center gap-2 text-sm sm:col-span-6">
          <input type="checkbox" className="size-4 rounded accent-brand-600" checked={v.executar} onChange={(e) => mudar('executar', e.target.checked)} />
          <span><strong>ON</strong> — liberada para a fila executar (desmarque para cadastrar pausada)</span>
        </label>
      </form>
    </Modal>
  );
}
