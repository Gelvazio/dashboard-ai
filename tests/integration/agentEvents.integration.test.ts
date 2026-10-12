import { beforeAll, describe, expect, it } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { DashboardClient } from '@/services/supabase';
import type { Project } from '@/types';
import { criarProjeto, integracaoDisponivel, novoUsuario, servico, usuario } from '../helpers/postgrest';

// `agent_events` (database/07_agent_events.sql, SUB-35.1–35.3) é só-inclusão: no tipo
// `Database` (SUB-35.8) o `Update` é `never`. O teste usa o cliente sem tipagem de
// tabelas para conseguir tentar o update proibido.
const semTipo = (c: DashboardClient) => c as unknown as SupabaseClient;
const eventos = (c: DashboardClient) => semTipo(c).from('agent_events');

describe.skipIf(!integracaoDisponivel)('agent_events (RLS e trigger)', () => {
  const editor = novoUsuario();
  const viewer = novoUsuario();
  let p: Project;
  let outro: Project;
  let taskOutro: number;

  beforeAll(async () => {
    p = await criarProjeto([{ id: editor, role: 'editor' }, { id: viewer, role: 'viewer' }], 'EVA');
    outro = await criarProjeto([{ id: editor, role: 'editor' }], 'EVB');
    const sb = servico();
    const ins = await eventos(sb).insert([
      { project_id: p.id, agente: 'Agente A', tipo: 'inicio', mensagem: `evento ${p.slug}` },
      { project_id: outro.id, agente: 'Agente B', tipo: 'inicio', mensagem: `evento ${outro.slug}` },
    ]);
    if (ins.error) throw ins.error;
    const t = await sb.from('tasks').insert({ project_id: outro.id, titulo: 'Task do outro projeto', instrucao: 'x' }).select().single();
    if (t.error) throw t.error;
    taskOutro = t.data.id;
  });

  it('viewer lê os eventos do próprio projeto e não os de outro', async () => {
    const { data, error } = await eventos(usuario(viewer)).select('project_id, agente, mensagem');
    expect(error).toBeNull();
    expect(data!.length).toBeGreaterThan(0);
    expect(data!.every((e) => e.project_id === p.id)).toBe(true);
    const deOutro = await eventos(usuario(viewer)).select('id').eq('project_id', outro.id);
    expect(deOutro.data).toEqual([]);
  });

  it('viewer não inclui eventos', async () => {
    const { error } = await eventos(usuario(viewer)).insert({ project_id: p.id, agente: 'Viewer', tipo: 'progresso' });
    expect(error).not.toBeNull();
    expect(error!.message).toMatch(/row-level security/);
  });

  it('editor inclui eventos no próprio projeto (autor gravado)', async () => {
    const { data, error } = await eventos(usuario(editor))
      .insert({ project_id: p.id, agente: '  Agente Editor ', tipo: 'progresso', etapa: 'planejar' })
      .select('agente, criado_por, etapa')
      .single();
    expect(error).toBeNull();
    expect(data).toEqual({ agente: 'Agente Editor', criado_por: editor, etapa: 'planejar' });
  });

  it('update é recusado (eventos são só-inclusão)', async () => {
    const sb = usuario(editor);
    const { error } = await eventos(sb).update({ mensagem: 'alterado' }).eq('project_id', p.id);
    expect(error).not.toBeNull();
    expect(error!.message).toMatch(/permission denied/);
    const { data } = await eventos(sb).select('mensagem').eq('mensagem', 'alterado');
    expect(data).toEqual([]);
  });

  it('task de outro projeto é recusada pelo trigger', async () => {
    const { error } = await eventos(servico()).insert({ project_id: p.id, task_id: taskOutro, agente: 'Agente A', tipo: 'commit' });
    expect(error).not.toBeNull();
    expect(error!.message).toMatch(/não pertence ao projeto do evento/);
  });
});
