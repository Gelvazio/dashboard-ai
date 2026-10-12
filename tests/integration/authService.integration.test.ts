import { describe, expect, it } from 'vitest';
import { obterPapelGlobal, papelNoProjeto } from '@/services/authService';
import { criarProjeto, integracaoDisponivel, novoUsuario, servico, usuario } from '../helpers/postgrest';

async function definirPapelGlobal(userId: string, role: 'admin' | 'member') {
  const { error } = await servico().from('user_roles').insert({ user_id: userId, role });
  if (error) throw error;
}

describe.skipIf(!integracaoDisponivel)('authService (papéis)', () => {
  it('usuário vê o próprio papel global, mas não o de outro', async () => {
    const eu = novoUsuario();
    const outro = novoUsuario();
    await definirPapelGlobal(eu, 'member');
    await definirPapelGlobal(outro, 'admin');
    expect(await obterPapelGlobal(eu, usuario(eu))).toBe('member');
    expect(await obterPapelGlobal(outro, usuario(eu))).toBeNull();
  });

  it('admin global recebe "admin" em qualquer projeto', async () => {
    const admin = novoUsuario();
    await definirPapelGlobal(admin, 'admin');
    const p = await criarProjeto([]);
    expect(await papelNoProjeto(p.id, admin, usuario(admin))).toBe('admin');
  });

  it('editor e viewer recebem o papel do projeto; não membro recebe null', async () => {
    const editor = novoUsuario();
    const viewer = novoUsuario();
    const fora = novoUsuario();
    const p = await criarProjeto([
      { id: editor, role: 'editor' },
      { id: viewer, role: 'viewer' },
    ]);
    expect(await papelNoProjeto(p.id, editor, usuario(editor))).toBe('editor');
    expect(await papelNoProjeto(p.id, viewer, usuario(viewer))).toBe('viewer');
    expect(await papelNoProjeto(p.id, fora, usuario(fora))).toBeNull();
  });
});
