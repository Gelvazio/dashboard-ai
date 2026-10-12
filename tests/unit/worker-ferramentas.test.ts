import { describe, it, expect, vi } from 'vitest';
import { obterFerramenta, ALLOWLIST } from '../../worker/ferramentas';
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
