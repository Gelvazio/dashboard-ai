import { cn } from '@/lib/utils';
import { useConexao } from '@/hooks/useConexao';

const ROTULOS = {
  verificando: { texto: 'Verificando…', cor: 'bg-slate-400' },
  conectado: { texto: 'Conectado', cor: 'bg-status-concluida' },
  sem_sessao: { texto: 'Sem sessão', cor: 'bg-status-pendente' },
  sem_config: { texto: 'Não configurado', cor: 'bg-status-cancelada' },
  erro: { texto: 'Sem conexão', cor: 'bg-status-erro' },
} as const;

/** Indicador da conexão com o Supabase no header. */
export function ConnectionStatus() {
  const { estado, detalhe } = useConexao();
  const r = ROTULOS[estado];
  return (
    <span
      className="hidden items-center gap-2 rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 sm:inline-flex dark:border-slate-800 dark:text-slate-300"
      title={detalhe ?? 'Conexão com o Supabase'}
      role="status"
    >
      <span className={cn('size-2 rounded-full', r.cor, estado === 'verificando' && 'animate-pulse')} aria-hidden />
      {r.texto}
    </span>
  );
}
