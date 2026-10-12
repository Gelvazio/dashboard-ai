import { beforeAll, describe, expect, it } from 'vitest';
import * as tasks from '@/services/taskService';
import { ServiceError } from '@/services/supabase';
import type { Project } from '@/types';
import { criarProjeto, integracaoDisponivel, novoUsuario, servico, usuario } from '../helpers/postgrest';

describe.skipIf(!integracaoDisponivel)('taskService (RLS + guarda da fila)', () => {
  const editor = novoUsuario();
  const viewer = novoUsuario();
  let p: Project;
  let outro: Project;

  beforeAll(async () => {
    p = await criarProjeto([{ id: editor, role: 'editor' }, { id: viewer, role: 'viewer' }], 'FIL');
    outro = await criarProjeto([{ id: editor, role: 'editor' }], 'OUT');
  });

  it('cria, lista na ordem da fila, busca e filtra', async () => {
    const sb = usuario(editor);
    const a = await tasks.criarTask(p.id, { titulo: ' Primeira ', instrucao: 'Fazer A', prioridade: 3 }, sb);
    const b = await tasks.criarTask(p.id, { titulo: 'Urgente', instrucao: 'Fazer B (100%)', prioridade: 1, dependencias: [a.codigo, a.codigo] }, sb);
    const c = await tasks.criarTask(p.id, { titulo: 'Aprovar', instrucao: 'Revisão humana', tipo: 'humano', prioridade: 3, ordem: -1 }, sb);
    await tasks.criarTask(outro.id, { titulo: 'Outro projeto', instrucao: 'x' }, sb);
    expect(a.codigo).toBe('FIL-0001');
    expect(a.titulo).toBe('Primeira');
    expect(b.dependencias).toEqual(['FIL-0001']);

    const lista = await tasks.listarTasks(p.id, {}, sb);
    expect(lista.map((t) => t.codigo)).toEqual([b.codigo, c.codigo, a.codigo]); // prioridade, ordem, criação
    expect((await tasks.listarTasks(p.id, { busca: 'revisão' }, sb)).map((t) => t.id)).toEqual([c.id]);
    expect((await tasks.listarTasks(p.id, { busca: 'fil-0002' }, sb)).map((t) => t.id)).toEqual([b.id]);
    expect((await tasks.listarTasks(p.id, { busca: '100%' }, sb)).map((t) => t.id)).toEqual([b.id]);
    expect(await tasks.listarTasks(p.id, { busca: 'a,b(c)*' }, sb)).toEqual([]);
    expect((await tasks.listarTasks(p.id, { status: ['concluida'] }, sb)).length).toBe(0);
  });

  it('edita, liga/desliga, cancela, reabre, exclui e restaura', async () => {
    const sb = usuario(editor);
    const t = await tasks.criarTask(p.id, { titulo: 'Ciclo', instrucao: 'x' }, sb);
    expect((await tasks.atualizarTask(p.id, t.id, { prioridade: 2, instrucao: 'y' }, sb)).prioridade).toBe(2);
    expect((await tasks.alternarExecucao(p.id, t.id, false, sb)).executar).toBe(false);
    const canc = await tasks.cancelarTask(p.id, t.id, sb);
    expect(canc.status).toBe('cancelada');
    expect(canc.concluido_em).not.toBeNull();
    const reab = await tasks.reabrirTask(p.id, t.id, sb);
    expect([reab.status, reab.tentativas, reab.executar, reab.concluido_em]).toEqual(['pendente', 0, true, null]);
    const exc = await tasks.excluirTaskLogico(p.id, t.id, sb);
    expect([exc.excluido, exc.executar]).toEqual([true, false]);
    expect((await tasks.listarTasks(p.id, {}, sb)).some((x) => x.id === t.id)).toBe(false);
    expect((await tasks.listarTasks(p.id, { incluirExcluidas: true }, sb)).some((x) => x.id === t.id)).toBe(true);
    expect((await tasks.restaurarTask(p.id, t.id, sb)).excluido).toBe(false);
  });

  it('respeita a guarda da fila e a RLS', async () => {
    const sb = usuario(editor);
    const ia = await tasks.criarTask(p.id, { titulo: 'IA', instrucao: 'x' }, sb);
    await expect(tasks.concluirTaskHumana(p.id, ia.id, undefined, sb)).rejects.toThrow(/tipo humano/);
    const humana = await tasks.criarTask(p.id, { titulo: 'Teste manual', instrucao: 'x', tipo: 'humano' }, sb);
    expect((await tasks.concluirTaskHumana(p.id, humana.id, 'ok', sb)).status).toBe('concluida');

    // task em execução (pela fila/service_role) não pode ser alterada pela interface
    await servico().from('tasks').update({ status: 'em_execucao', trava_frente: 'Agente X', trava_em: new Date().toISOString() }).eq('id', ia.id);
    await expect(tasks.alternarExecucao(p.id, ia.id, false, sb)).rejects.toThrow(/em execução/);

    await expect(tasks.criarTask(p.id, { titulo: 'x', instrucao: 'x', dependencias: ['FIL-9999'] }, sb)).rejects.toThrow(/não existe/);
    await expect(tasks.criarTask(p.id, { titulo: ' ', instrucao: 'x' }, sb)).rejects.toThrow(ServiceError);
    await expect(tasks.criarTask(p.id, { titulo: 'x', instrucao: 'x', prioridade: 9 }, sb)).rejects.toThrow(/1 a 5/);

    const v = usuario(viewer);
    expect((await tasks.listarTasks(p.id, {}, v)).length).toBeGreaterThan(0);
    await expect(tasks.criarTask(p.id, { titulo: 'x', instrucao: 'x' }, v)).rejects.toThrow(/Sem permissão/);
    expect(await tasks.listarTasks(outro.id, {}, v)).toEqual([]); // viewer não é membro do outro projeto
  });

  it('contagem por status', async () => {
    const c = await tasks.contarTasksPorStatus(p.id, usuario(editor));
    expect(c.em_execucao).toBe(1);
    expect(c.concluida).toBe(1);
    expect(Object.values(c).reduce((a, b) => a + b, 0)).toBeGreaterThanOrEqual(6);
  });
});

describe.skipIf(!integracaoDisponivel)('taskService.liberarTrava: expirada e forçada (SUB-23.5)', () => {
  const editor = novoUsuario();
  let p: Project;

  beforeAll(async () => {
    p = await criarProjeto([{ id: editor, role: 'editor' }], 'LIB');
  });

  const travar = async (id: number, minutosAtras: number) => {
    const { error } = await servico()
      .from('tasks')
      .update({ status: 'em_execucao', trava_frente: 'Agente X', trava_em: new Date(Date.now() - minutosAtras * 60_000).toISOString() })
      .eq('id', id);
    expect(error).toBeNull();
  };

  it('libera por editor uma trava expirada (100 min)', async () => {
    const sb = usuario(editor);
    const t = await tasks.criarTask(p.id, { titulo: 'Presa', instrucao: 'x' }, sb);
    await travar(t.id, 100);
    const liberada = await tasks.liberarTrava(p.id, t.id, false, sb);
    expect(liberada.status).toBe('pendente');
    expect(liberada.resultado).toMatch(/liberada manualmente/);
  });

  it('recusa trava recente sem forcar e libera com forcar', async () => {
    const sb = usuario(editor);
    const t = await tasks.criarTask(p.id, { titulo: 'Recente', instrucao: 'x' }, sb);
    await travar(t.id, 5);
    await expect(tasks.liberarTrava(p.id, t.id, false, sb)).rejects.toThrow(/ainda está válida|forcar/);
    expect((await tasks.obterTask(p.id, t.id, sb)).status).toBe('em_execucao');
    expect((await tasks.liberarTrava(p.id, t.id, true, sb)).status).toBe('pendente');
  });
});

describe.skipIf(!integracaoDisponivel)('taskService.liberarTrava: viewer e outro projeto (SUB-23.12)', () => {
  const editor = novoUsuario();
  const viewer = novoUsuario();
  let p: Project;
  let outro: Project;

  beforeAll(async () => {
    p = await criarProjeto([{ id: editor, role: 'editor' }, { id: viewer, role: 'viewer' }], 'LBV');
    outro = await criarProjeto([{ id: editor, role: 'editor' }], 'LBO');
  });

  const travarExpirada = async (id: number) => {
    const { error } = await servico()
      .from('tasks')
      .update({ status: 'em_execucao', trava_frente: 'Agente Y', trava_em: new Date(Date.now() - 100 * 60_000).toISOString() })
      .eq('id', id);
    expect(error).toBeNull();
  };

  it('recusa o viewer ao liberar trava', async () => {
    const t = await tasks.criarTask(p.id, { titulo: 'Trava viewer', instrucao: 'x' }, usuario(editor));
    await travarExpirada(t.id);
    await expect(tasks.liberarTrava(p.id, t.id, true, usuario(viewer))).rejects.toThrow(/Sem permissão/);
    expect((await tasks.obterTask(p.id, t.id, usuario(editor))).status).toBe('em_execucao');
  });

  it('recusa liberar task de outro projeto pelo projectId errado', async () => {
    const sb = usuario(editor);
    const t = await tasks.criarTask(outro.id, { titulo: 'Outro', instrucao: 'x' }, sb);
    await travarExpirada(t.id);
    await expect(tasks.liberarTrava(p.id, t.id, true, sb)).rejects.toThrow(ServiceError);
    expect((await tasks.obterTask(outro.id, t.id, sb)).status).toBe('em_execucao');
  });
});
