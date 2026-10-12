import { describe, it, expect, vi } from 'vitest';
import { obterFerramenta, ALLOWLIST, criarFerramentaLangChain, schemaDoInputSchema } from '../../worker/ferramentas';
import type { ToolDefinition } from '../../api/_lib/tools';
import { listTools } from '../../api/_lib/tools';

vi.mock('../../api/_lib/tools');

describe('obterFerramenta', () => {
  it('deve retornar ferramenta permitida se existir no registro MCP', async () => {
    vi.mocked(listTools).mockResolvedValue([
      { name: 'brain_search', description: 'Busca memórias', inputSchema: { type: 'object', properties: {} } },
    ]);
    const resultado = await obterFerramenta('brain_search');
    expect(resultado).toEqual(ALLOWLIST['brain_search']);
  });

  it('deve retornar null se ferramenta não estiver na allowlist', async () => {
    vi.mocked(listTools).mockResolvedValue([
      { name: 'ferramenta_perigosa', description: 'Não permitida', inputSchema: { type: 'object', properties: {} } },
    ]);
    const resultado = await obterFerramenta('ferramenta_perigosa');
    expect(resultado).toBeNull();
  });

  it('deve retornar null se ferramenta da allowlist não existir no registro MCP', async () => {
    vi.mocked(listTools).mockResolvedValue([
      { name: 'outra_ferramenta', description: 'Não é brain_search', inputSchema: { type: 'object', properties: {} } },
    ]);
    const resultado = await obterFerramenta('brain_search');
    expect(resultado).toBeNull();
  });

  it('recusa brain_delete mesmo existindo no registro MCP', async () => {
    vi.mocked(listTools).mockResolvedValue([
      { name: 'brain_delete', description: 'Exclui memória', inputSchema: { type: 'object', properties: {} } },
    ]);
    expect(await obterFerramenta('brain_delete')).toBeNull();
  });

  it('a allowlist contém só brain_search, brain_store e task_list', () => {
    expect(Object.keys(ALLOWLIST).sort()).toEqual(['brain_search', 'brain_store', 'task_list']);
  });
});

const definicaoBusca: ToolDefinition = {
  name: 'brain_search',
  description: 'Busca memórias',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      limit: { type: 'integer', minimum: 1, maximum: 20 },
      tags: { type: 'array', items: { type: 'string' }, maxItems: 2 },
      include_global: { type: 'boolean' },
    },
    required: ['query'],
  },
};

describe('criarFerramentaLangChain', () => {
  it('chama o handler com argumentos válidos', async () => {
    vi.mocked(listTools).mockResolvedValue([definicaoBusca]);
    const handler = vi.fn(async () => 'ok');
    const ferramenta = criarFerramentaLangChain(definicaoBusca, handler);
    expect(await ferramenta.invoke({ query: 'deploy', limit: 3 })).toBe('ok');
    expect(handler).toHaveBeenCalledWith({ query: 'deploy', limit: 3 });
  });

  it.each([
    ['tipo errado', { query: 42 }],
    ['obrigatório ausente', { limit: 3 }],
    ['inteiro fora do limite', { query: 'x', limit: 50 }],
    ['campo desconhecido', { query: 'x', apagar_tudo: true }],
    ['lista longa demais', { query: 'x', tags: ['a', 'b', 'c'] }],
  ])('recusa argumento inválido (%s) sem chamar o handler', async (_caso, args) => {
    vi.mocked(listTools).mockResolvedValue([definicaoBusca]);
    const handler = vi.fn(async () => 'ok');
    const ferramenta = criarFerramentaLangChain(definicaoBusca, handler);
    await expect(ferramenta.invoke(args as Record<string, unknown>)).rejects.toThrow();
    expect(handler).not.toHaveBeenCalled();
  });

  it('recusa criar ferramenta fora da allowlist', () => {
    expect(() => criarFerramentaLangChain({ ...definicaoBusca, name: 'brain_delete' }, async () => 'x')).toThrow(
      'Ferramenta não permitida',
    );
  });

  it('schemaDoInputSchema deriva campos opcionais e obrigatórios', () => {
    const schema = schemaDoInputSchema(definicaoBusca.inputSchema);
    expect(schema.safeParse({ query: 'x' }).success).toBe(true);
    expect(schema.safeParse({ query: 'x', include_global: 'sim' }).success).toBe(false);
  });
});

