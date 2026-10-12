import { beforeAll, describe, expect, it } from 'vitest';
import * as mem from '@/services/memoryService';
import type { Project } from '@/types';
import { criarProjeto, integracaoDisponivel, novoUsuario, servico, usuario } from '../helpers/postgrest';

// Gerador determinístico (bag-of-words com hash) para testar a busca semântica sem API externa.
const gerador: mem.GeradorEmbedding = async (texto) => {
  const v = new Array(mem.DIMENSOES_EMBEDDING).fill(0);
  for (const w of texto.toLowerCase().normalize('NFD').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((x) => x.length > 2)) {
    let h = 0;
    for (const c of w) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    v[h % v.length] += 1;
  }
  const n = Math.hypot(...v) || 1;
  return v.map((x) => x / n);
};

describe.skipIf(!integracaoDisponivel)('memoryService (RLS, globais e busca)', () => {
  const editor = novoUsuario();
  const viewer = novoUsuario();
  let p: Project;
  let outro: Project;

  beforeAll(async () => {
    p = await criarProjeto([{ id: editor, role: 'editor' }, { id: viewer, role: 'viewer' }]);
    outro = await criarProjeto([{ id: editor, role: 'editor' }]);
    // memória global (só administrador/service_role grava)
    await servico().from('ai_memories').upsert(
      { project_id: null, title: `Global ${p.slug}`, content: 'Commits seguem conventional commits', tags: ['git'], embedding: `[${(await gerador('Commits seguem conventional commits')).join(',')}]` },
      { onConflict: 'project_id,title' },
    );
  });

  it('salva (upsert por título), lista com globais e filtra', async () => {
    const sb = usuario(editor);
    const m1 = await mem.salvarMemoria(p.id, { title: 'Banco', content: 'PostgreSQL com pgvector e RLS', tags: ['Banco', 'banco', 'arq'] }, { gerador }, sb);
    expect(m1.tags).toEqual(['banco', 'arq']);
    const m1b = await mem.salvarMemoria(p.id, { title: 'Banco', content: 'PostgreSQL 17 com pgvector, HNSW e RLS', tags: ['banco'] }, { gerador }, sb);
    expect(m1b.id).toBe(m1.id);
    await mem.salvarMemoria(p.id, { title: 'Sem vetor', content: 'Deploy na Vercel' }, {}, sb);
    await mem.salvarMemoria(outro.id, { title: 'Banco', content: 'MySQL legado' }, {}, sb);

    const todas = await mem.listarMemorias(p.id, {}, sb);
    expect(todas.map((m) => m.title).sort()).toEqual(['Banco', `Global ${p.slug}`, 'Sem vetor'].sort());
    expect(todas.some((m) => 'embedding' in m)).toBe(false);
    expect((await mem.listarMemorias(p.id, { incluirGlobais: false }, sb)).length).toBe(2);
    const cont = await mem.contarMemorias(p.id, sb);
    expect(cont.projeto).toBe(2);
    expect(cont.globais).toBeGreaterThanOrEqual(1);
    expect(cont.total).toBe(cont.projeto + cont.globais);
    expect((await mem.contarMemorias(outro.id, sb)).projeto).toBe(1);
    expect((await mem.listarMemorias(p.id, { tags: ['banco'] }, sb)).map((m) => m.title)).toEqual(['Banco']);
    expect((await mem.listarMemorias(p.id, { busca: 'vercel' }, sb)).map((m) => m.title)).toEqual(['Sem vetor']);
  });

  it('busca semântica (com gerador) e textual (sem gerador)', async () => {
    const sb = usuario(viewer);
    const sem = await mem.buscarMemorias(p, 'qual banco PostgreSQL pgvector', { gerador, limiar: 0.2 }, sb);
    if (sem.modo !== 'semantica') throw new Error('esperava busca semântica');
    expect(sem.resultados[0].title).toBe('Banco');
    expect(sem.resultados.every((r) => r.similarity > 0.2)).toBe(true);
    const glob = await mem.buscarMemoriasSimilares(p.slug, await gerador('conventional commits'), { limiar: 0.2 }, sb);
    expect(glob.some((r) => r.project_id === null)).toBe(true);
    const semGlob = await mem.buscarMemoriasSimilares(p.slug, await gerador('conventional commits'), { limiar: 0.2, incluirGlobais: false }, sb);
    expect(semGlob.some((r) => r.project_id === null)).toBe(false);
    const txt = await mem.buscarMemorias(p, 'MySQL', {}, sb);
    expect(txt.modo).toBe('texto');
    expect(txt.resultados).toEqual([]); // MySQL é de outro projeto
    await expect(mem.buscarMemoriasSimilares(p.slug, [1, 2, 3], {}, sb)).rejects.toThrow(/1536/);
  });

  it('permissões: viewer não grava; não-admin não grava/exclui global; editor exclui', async () => {
    await expect(mem.salvarMemoria(p.id, { title: 'x', content: 'y' }, {}, usuario(viewer))).rejects.toThrow(/Sem permissão/);
    await expect(mem.salvarMemoria(null, { title: 'g', content: 'y' }, {}, usuario(editor))).rejects.toThrow(/Sem permissão/);
    const glob = (await mem.listarMemorias(p.id, {}, usuario(editor))).find((m) => m.project_id === null)!;
    await expect(mem.excluirMemoria(glob.id, usuario(editor))).rejects.toThrow(/não encontrada ou sem permissão/);
    const alvo = (await mem.listarMemorias(p.id, { busca: 'vercel' }, usuario(editor)))[0];
    await mem.excluirMemoria(alvo.id, usuario(editor));
    expect((await mem.listarMemorias(p.id, { busca: 'vercel' }, usuario(editor))).length).toBe(0);
    await expect(mem.salvarMemoria(p.id, { title: ' ', content: 'y' }, {}, usuario(editor))).rejects.toThrow(/título/);
  });
});
