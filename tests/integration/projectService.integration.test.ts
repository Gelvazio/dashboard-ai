import { describe, expect, it } from 'vitest';
import { listarProjetos } from '@/services/projectService';
import { criarProjeto, integracaoDisponivel, novoUsuario, servico, usuario } from '../helpers/postgrest';

describe.skipIf(!integracaoDisponivel)('projectService', () => {
  it('lista só projetos ativos em que o usuário é membro', async () => {
    const u = novoUsuario();
    const a = await criarProjeto([{ id: u, role: 'viewer' }]);
    const b = await criarProjeto([{ id: u, role: 'editor' }]);
    await criarProjeto([]); // sem acesso
    const inativo = await criarProjeto([{ id: u, role: 'owner' }]);
    await servico().from('projects').update({ ativo: false }).eq('id', inativo.id);

    const lista = await listarProjetos(usuario(u));
    expect(lista.map((p) => p.id).sort()).toEqual([a.id, b.id].sort());
  });
});
