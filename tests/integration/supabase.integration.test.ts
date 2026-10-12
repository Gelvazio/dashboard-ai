import { describe, expect, it } from 'vitest';
import { verificarConexao } from '@/services/supabase';
import type { Task } from '@/types';
import { anonimo, criarProjeto, integracaoDisponivel, novoUsuario, servico, usuario } from '../helpers/postgrest';

describe.skipIf(!integracaoDisponivel)('cliente Supabase tipado contra PostgREST local', () => {
  it('estado da conexão: anon = sem_sessao; usuário = conectado', async () => {
    expect((await verificarConexao(anonimo())).estado).toBe('sem_sessao');
    expect((await verificarConexao(usuario(novoUsuario()))).estado).toBe('conectado');
  });

  it('tipos Database casam com o banco (insert/select de tasks com RLS)', async () => {
    const editor = novoUsuario();
    const p = await criarProjeto([{ id: editor, role: 'editor' }], 'TIP');
    const sb = usuario(editor);
    const { data, error } = await sb
      .from('tasks')
      .insert({ project_id: p.id, titulo: 'Tipada', instrucao: 'x' })
      .select()
      .single();
    expect(error).toBeNull();
    const t: Task = data!;
    expect(t.codigo).toBe('TIP-0001');
    expect(t.status).toBe('pendente');
    expect(t.origem).toBe('ui');

    const outro = await criarProjeto([], 'OUT');
    const { data: visiveis } = await sb.from('tasks').select('id,project_id');
    expect(visiveis!.every((r) => r.project_id === p.id)).toBe(true);
    const neg = await sb.from('tasks').insert({ project_id: outro.id, titulo: 'x', instrucao: 'x' });
    expect(neg.error?.code).toBe('42501');
  });

  it('service_role (testes) enxerga todos os projetos', async () => {
    const { count } = await servico().from('projects').select('id', { count: 'exact', head: true });
    expect(count).toBeGreaterThan(0);
  });
});
