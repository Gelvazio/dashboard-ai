import { beforeAll, describe, expect, it } from 'vitest';
import * as logs from '@/services/logService';
import type { Project } from '@/types';
import { criarProjeto, integracaoDisponivel, novoUsuario, servico, usuario } from '../helpers/postgrest';

describe.skipIf(!integracaoDisponivel)('logService (histórico do agendador)', () => {
  const viewer = novoUsuario();
  let p: Project;
  let outro: Project;

  beforeAll(async () => {
    p = await criarProjeto([{ id: viewer, role: 'viewer' }], 'LOG');
    outro = await criarProjeto([], 'OUT');
    const sb = servico();
    const { data: t } = await sb.from('tasks').insert({ project_id: p.id, titulo: 'T', instrucao: 'x' }).select().single();
    const base = Date.parse('2026-10-01T12:00:00Z');
    const linhas = [
      { status: 'concluida', rotina: 'noturna', agente: 'Agente A', task_id: t!.id, detalhes: 'feito com sucesso' },
      { status: 'erro', rotina: 'noturna', agente: 'Agente B', task_id: t!.id, erro_mensagem: 'timeout na API' },
      { status: 'sem_tarefa', rotina: 'horaria', agente: 'Agente A', detalhes: 'Fila vazia' },
      { status: 'sem_tarefa', rotina: 'horaria', agente: 'Agente A', detalhes: 'Fila vazia' },
      { status: 'recusada', rotina: 'horaria', agente: 'Agente C', task_id: t!.id, detalhes: 'instrução ambígua' },
    ].map((l, i) => ({ ...l, project_id: p.id, data_hora: new Date(base + i * 3_600_000).toISOString() }));
    const r = await sb.from('agendamento_tarefa_logs').insert(linhas as never);
    if (r.error) throw r.error;
    await sb.from('agendamento_tarefa_logs').insert({ project_id: outro.id, status: 'erro', rotina: 'x' } as never);
  });

  it('lista por data_hora desc, com paginação e total', async () => {
    const sb = usuario(viewer);
    const pg = await logs.listarLogs(p.id, { porPagina: 2 }, sb);
    expect(pg.total).toBe(5);
    expect(pg.logs.map((l) => l.status)).toEqual(['recusada', 'sem_tarefa']);
    const pg3 = await logs.listarLogs(p.id, { porPagina: 2, pagina: 2 }, sb);
    expect(pg3.logs.map((l) => l.status)).toEqual(['concluida']);
    expect(pg.logs[0].task_codigo).toBe('LOG-0001'); // preenchido pelo trigger
  });

  it('filtros por status, rotina, agente, task, período e busca', async () => {
    const sb = usuario(viewer);
    expect((await logs.listarLogs(p.id, { status: ['erro', 'recusada'] }, sb)).total).toBe(2);
    expect((await logs.listarLogs(p.id, { rotina: 'noturna' }, sb)).total).toBe(2);
    expect((await logs.listarLogs(p.id, { agente: 'Agente A' }, sb)).total).toBe(3);
    expect((await logs.listarLogs(p.id, { taskCodigo: 'LOG-0001' }, sb)).total).toBe(3);
    expect((await logs.listarLogs(p.id, { desde: '2026-10-01T14:00:00Z', ate: '2026-10-01T15:00:00Z' }, sb)).total).toBe(2);
    expect((await logs.listarLogs(p.id, { busca: 'timeout' }, sb)).logs.map((l) => l.status)).toEqual(['erro']);
    await expect(logs.listarLogs(p.id, { desde: 'ontem' }, sb)).rejects.toThrow(/Data inválida/);
  });

  it('contadores, última execução, opções de filtro e isolamento', async () => {
    const sb = usuario(viewer);
    expect(await logs.contarLogsPorStatus(p.id, {}, sb)).toEqual({ concluida: 1, recusada: 1, erro: 1, sem_tarefa: 2, total: 5 });
    expect((await logs.contarLogsPorStatus(p.id, { desde: '2026-10-01T15:00:00Z' }, sb)).total).toBe(2);
    expect((await logs.ultimaExecucao(p.id, sb))?.status).toBe('recusada');
    expect(await logs.opcoesDeFiltro(p.id, sb)).toEqual({ rotinas: ['horaria', 'noturna'], agentes: ['Agente A', 'Agente B', 'Agente C'] });
    expect((await logs.listarLogs(outro.id, {}, sb)).total).toBe(0); // não é membro
    expect(await logs.ultimaExecucao(outro.id, sb)).toBeNull();
    const ins = await sb.from('agendamento_tarefa_logs').insert({ project_id: p.id, status: 'erro', rotina: 'x' } as never);
    expect(ins.error).not.toBeNull(); // interface não grava logs
  });
});
