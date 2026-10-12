import { describe, it, expect, vi } from 'vitest';
import { obterFerramenta, ALLOWLIST } from '../../worker/ferramentas';
import { listTools } from '../../api/_lib/tools';

vi.mock('../../api/_lib/tools');

describe('obterFerramenta', () => {
  it('deve retornar ferramenta permitida se existir no registro MCP', async () => {
    vi.mocked(listTools).mockResolvedValue([
      { name: 'brain_search', description: 'Busca memórias' },
    ]);
    const resultado = await obterFerramenta('brain_search');
    expect(resultado).toEqual(ALLOWLIST['brain_search']);
  });

  it('deve retornar null se ferramenta não estiver na allowlist', async () => {
    vi.mocked(listTools).mockResolvedValue([
      { name: 'ferramenta_perigosa', description: 'Não permitida' },
    ]);
    const resultado = await obterFerramenta('ferramenta_perigosa');
    expect(resultado).toBeNull();
  });

  it('deve retornar null se ferramenta da allowlist não existir no registro MCP', async () => {
    vi.mocked(listTools).mockResolvedValue([
      { name: 'outra_ferramenta', description: 'Não é brain_search' },
    ]);
    const resultado = await obterFerramenta('brain_search');
    expect(resultado).toBeNull();
  });
});
