import { afterEach, describe, expect, it, vi } from 'vitest';
import { criarGeradorEmbedding } from '@/services/embeddingService';
import { ServiceError, type DashboardClient } from '@/services/supabase';

const clienteFalso = (token: string | null) =>
  ({
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: token ? { access_token: token } : null },
        error: null,
      }),
    },
  }) as unknown as DashboardClient;

const resposta = (status: number, corpo: unknown) =>
  new Response(JSON.stringify(corpo), { status, headers: { 'Content-Type': 'application/json' } });

describe('services/embeddingService — criarGeradorEmbedding', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('sem sessão: pede login e não chama o servidor', async () => {
    const fetchFalso = vi.fn();
    vi.stubGlobal('fetch', fetchFalso);
    const gerar = criarGeradorEmbedding({ client: clienteFalso(null) });
    await expect(gerar('oi')).rejects.toThrowError('Faça login para usar a busca semântica.');
    expect(fetchFalso).not.toHaveBeenCalled();
  });

  it('401 do servidor: pede login', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta(401, { erro: 'Não autorizado' })));
    const gerar = criarGeradorEmbedding({ client: clienteFalso('jwt') });
    await expect(gerar('oi')).rejects.toThrowError('Faça login para usar a busca semântica.');
  });

  it('500 do servidor: ServiceError com a mensagem do servidor', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta(500, { erro: 'Falha interna.' })));
    const gerar = criarGeradorEmbedding({ client: clienteFalso('jwt') });
    const err = await gerar('oi').catch((e) => e);
    expect(err).toBeInstanceOf(ServiceError);
    expect(err.message).toBe('Falha interna.');
  });

  it('vetor com tamanho errado: ServiceError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta(200, { embedding: [0.1, 0.2] })));
    const gerar = criarGeradorEmbedding({ client: clienteFalso('jwt') });
    await expect(gerar('oi')).rejects.toThrowError(/1536/);
  });

  it('sucesso: envia Bearer e { texto } e devolve o vetor', async () => {
    const vetor = Array.from({ length: 1536 }, () => 0.5);
    const fetchFalso = vi.fn().mockResolvedValue(resposta(200, { embedding: vetor, dimensoes: 1536 }));
    vi.stubGlobal('fetch', fetchFalso);
    const gerar = criarGeradorEmbedding({ client: clienteFalso('jwt-123'), url: '/api/embedding' });
    await expect(gerar('busca')).resolves.toHaveLength(1536);
    const [url, init] = fetchFalso.mock.calls[0];
    expect(url).toBe('/api/embedding');
    expect(init.method).toBe('POST');
    expect(init.headers.Authorization).toBe('Bearer jwt-123');
    expect(JSON.parse(init.body)).toEqual({ texto: 'busca' });
  });
});
