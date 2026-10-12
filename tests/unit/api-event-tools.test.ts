import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// `db` falso: registra as chamadas e devolve respostas no formato do supabase-js.
const chamadas: { tabela: string; op: string; payload?: unknown; opcoes?: unknown; filtros: [string, unknown][] }[] = [];
let respostaInsercao: { data: unknown; error: unknown } = { data: [], error: null };

function construtor(tabela: string) {
  const c = { tabela, op: 'select', payload: undefined as unknown, opcoes: undefined as unknown, filtros: [] as [string, unknown][] };
  chamadas.push(c);
  const b: Record<string, unknown> = {
    select: () => b,
    eq: (col: string, v: unknown) => (c.filtros.push([col, v]), b),
    insert: (p: unknown) => ((c.op = 'insert'), (c.payload = p), b),
    upsert: (p: unknown, o: unknown) => ((c.op = 'upsert'), (c.payload = p), (c.opcoes = o), b),
    then: (ok: (r: unknown) => unknown, erro?: (e: unknown) => unknown) => {
      const r =
        tabela === 'projects'
          ? { data: c.filtros.some(([k, v]) => k === 'slug' && ['meu-app', 'default'].includes(v as string)) ? [{ id: 7 }] : [], error: null }
          : respostaInsercao;
      return Promise.resolve(r).then(ok, erro);
    },
  };
  return b;
}

vi.mock('../../api/_lib/supabase.js', async (importOriginal) => {
  const real = await importOriginal<typeof import('../../api/_lib/supabase.js')>();
  return { ...real, db: () => ({ from: construtor }) };
});

const { getTool } = await import('../../api/_lib/tools.js');
await import('../../api/_lib/event-tools.js');

async function chamar(args: Record<string, unknown>) {
  const tool = getTool('agent_event');
  if (!tool) throw new Error('agent_event não registrada');
  const r = await tool.handler(args);
  return { erro: r.isError === true, texto: r.content.map((c) => ('text' in c ? c.text : '')).join('') };
}

describe('ferramenta MCP agent_event', () => {
  beforeEach(() => {
    chamadas.length = 0;
    respostaInsercao = { data: [], error: null };
    vi.stubEnv('MCP_AUTH_TOKEN', 'token-de-teste');
    vi.stubEnv('MCP_DEFAULT_PROJECT', '');
    vi.stubEnv('MCP_ALLOWED_PROJECTS', '');
  });
  afterEach(() => vi.unstubAllEnvs());

  it('recusa tipo fora da lista sem tocar no banco', async () => {
    const r = await chamar({ agente: 'Claude Code', tipo: 'xyz' });
    expect(r.erro).toBe(true);
    expect(r.texto).toContain('"tipo" deve ser um de');
    expect(chamadas).toHaveLength(0);
  });

  it('recusa agente vazio', async () => {
    const r = await chamar({ agente: '   ', tipo: 'fim' });
    expect(r.erro).toBe(true);
    expect(r.texto).toContain('"agente" é obrigatório');
    expect(chamadas).toHaveLength(0);
  });

  it('recusa projeto fora de MCP_ALLOWED_PROJECTS', async () => {
    vi.stubEnv('MCP_ALLOWED_PROJECTS', 'meu-app');
    const r = await chamar({ project: 'outro', agente: 'Codex', tipo: 'inicio' });
    expect(r.erro).toBe(true);
    expect(r.texto).toContain('não permitido');
    expect(chamadas).toHaveLength(0);
  });

  it('fica desativada sem MCP_AUTH_TOKEN', async () => {
    vi.stubEnv('MCP_AUTH_TOKEN', '');
    const r = await chamar({ agente: 'Codex', tipo: 'inicio' });
    expect(r.erro).toBe(true);
    expect(r.texto).toContain('MCP_AUTH_TOKEN');
  });

  it('insere o payload esperado no projeto', async () => {
    respostaInsercao = {
      data: [{ id: 1, tipo: 'progresso', agente: 'Claude Code', task_codigo: 'SUB-35.41', created_at: '2026-10-12T04:00:00Z' }],
      error: null,
    };
    const r = await chamar({
      project: 'meu-app', agente: ' Claude Code ', tipo: 'progresso', task_codigo: 'SUB-35.41',
      etapa: 'testes', status: 'ok', mensagem: 'rodando vitest',
    });
    expect(r.erro).toBe(false);
    const insercao = chamadas.find((c) => c.tabela === 'agent_events')!;
    expect(insercao.op).toBe('insert');
    expect(insercao.payload).toEqual({
      project_id: 7, agente: 'Claude Code', tipo: 'progresso', task_codigo: 'SUB-35.41',
      etapa: 'testes', status: 'ok', mensagem: 'rodando vitest',
    });
    expect(JSON.parse(r.texto)).toMatchObject({ project: 'meu-app', duplicate: false, event: { id: 1 } });
  });

  it('com chave_idempotencia usa upsert ignorando duplicados', async () => {
    const r = await chamar({ agente: 'Codex', tipo: 'commit', chave_idempotencia: 'git:abc123' });
    const insercao = chamadas.find((c) => c.tabela === 'agent_events')!;
    expect(insercao.op).toBe('upsert');
    expect(insercao.payload).toEqual({ project_id: 7, agente: 'Codex', tipo: 'commit', chave_idempotencia: 'git:abc123' });
    expect(insercao.opcoes).toEqual({ onConflict: 'project_id,chave_idempotencia', ignoreDuplicates: true });
    expect(JSON.parse(r.texto)).toMatchObject({ project: 'default', duplicate: true, event: null });
  });
});
