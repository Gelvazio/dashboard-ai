import { beforeAll, describe, expect, it } from 'vitest';
import { atividadeAtual, listarEventos } from '@/services/eventService';
import type { AgentEventInsert, Project } from '@/types';
import { criarProjeto, integracaoDisponivel, novoUsuario, servico, usuario } from '../helpers/postgrest';

const em = (min: number) => new Date(Date.UTC(2026, 9, 12, 3, min)).toISOString();

describe.skipIf(!integracaoDisponivel)('eventService (listarEventos e atividadeAtual)', () => {
  const viewer = novoUsuario();
  let p: Project;
  let outro: Project;

  beforeAll(async () => {
    p = await criarProjeto([{ id: viewer, role: 'viewer' }], 'EVS');
    outro = await criarProjeto([{ id: viewer, role: 'viewer' }], 'EVO');
    const linhas: AgentEventInsert[] = [
      { project_id: p.id, agente: 'Agente A', tipo: 'inicio', etapa: 'carregarContexto', task_codigo: 'SUB-1', created_at: em(0) },
      { project_id: p.id, agente: 'Agente A', tipo: 'heartbeat', created_at: em(1) },
      { project_id: p.id, agente: 'Agente A', tipo: 'progresso', etapa: 'executar', task_codigo: 'SUB-1', mensagem: 'rodando testes', created_at: em(2) },
      { project_id: p.id, agente: 'Agente B', tipo: 'inicio', etapa: 'planejar', task_codigo: 'SUB-2', created_at: em(3) },
      { project_id: p.id, agente: 'Agente B', tipo: 'erro', etapa: 'executar', task_codigo: 'SUB-2', mensagem: 'falhou', created_at: em(4) },
      { project_id: outro.id, agente: 'Agente C', tipo: 'inicio', created_at: em(5) },
    ];
    const { error } = await servico().from('agent_events').insert(linhas);
    if (error) throw error;
  });

  it('atividadeAtual devolve um por agente com o último evento e o último heartbeat', async () => {
    const atividade = await atividadeAtual(p.id, usuario(viewer));
    expect(atividade.map((a) => a.agente)).toEqual(['Agente B', 'Agente A']); // ultimo_em desc
    const [b, a] = atividade;
    expect(b).toMatchObject({ tipo: 'erro', etapa: 'executar', task_codigo: 'SUB-2', mensagem: 'falhou', ultimo_heartbeat_em: null });
    expect(Date.parse(b.ultimo_em)).toBe(Date.parse(em(4)));
    expect(a).toMatchObject({ tipo: 'progresso', etapa: 'executar', task_codigo: 'SUB-1', mensagem: 'rodando testes' });
    expect(Date.parse(a.ultimo_em)).toBe(Date.parse(em(2)));
    expect(Date.parse(a.ultimo_heartbeat_em!)).toBe(Date.parse(em(1)));
  });

  it('listarEventos traz os mais recentes primeiro e respeita agente e limite', async () => {
    const sb = usuario(viewer);
    const todos = await listarEventos(p.id, {}, sb);
    expect(todos.map((e) => e.tipo)).toEqual(['erro', 'inicio', 'progresso', 'heartbeat', 'inicio']);
    const deA = await listarEventos(p.id, { agente: ' Agente A ' }, sb);
    expect(deA).toHaveLength(3);
    expect(deA.every((e) => e.agente === 'Agente A')).toBe(true);
    expect((await listarEventos(p.id, { limite: 2 }, sb)).map((e) => e.tipo)).toEqual(['erro', 'inicio']);
    expect((await listarEventos(p.id, { desde: em(3) }, sb)).map((e) => e.agente)).toEqual(['Agente B', 'Agente B']);
  });

  it('eventos de outro projeto não aparecem', async () => {
    const sb = usuario(viewer);
    expect((await listarEventos(p.id, {}, sb)).some((e) => e.agente === 'Agente C')).toBe(false);
    expect((await atividadeAtual(p.id, sb)).some((a) => a.agente === 'Agente C')).toBe(false);
    expect((await atividadeAtual(outro.id, sb)).map((a) => a.agente)).toEqual(['Agente C']);
    // sem acesso ao projeto: a RLS esconde tudo
    expect(await listarEventos(p.id, {}, usuario(novoUsuario()))).toEqual([]);
    expect(await atividadeAtual(p.id, usuario(novoUsuario()))).toEqual([]);
  });
});
