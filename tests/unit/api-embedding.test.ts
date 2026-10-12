import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { McpRequest, McpResponse } from '../../api/_lib/http';
import handler from '../../api/embedding';

type RespostaFalsa = McpResponse & {
  codigo: number;
  cabecalhos: Record<string, unknown>;
  corpo: unknown;
};

function respostaFalsa(): RespostaFalsa {
  const r = { codigo: 0, cabecalhos: {}, corpo: undefined } as RespostaFalsa;
  r.status = (c: number) => ((r.codigo = c), r);
  r.setHeader = (k: string, v: unknown) => ((r.cabecalhos[k] = v), r);
  r.json = (b: unknown) => ((r.corpo = b), r);
  r.end = () => r;
  return r;
}

async function chamar(req: McpRequest): Promise<RespostaFalsa> {
  const res = respostaFalsa();
  await handler(req, res);
  return res;
}

const ENV_TESTE = {
  SUPABASE_URL: 'https://exemplo.supabase.co',
  SUPABASE_ANON_KEY: 'anon-de-teste',
  OPENAI_API_KEY: 'sk-chave-de-teste',
};

describe('api/embedding — handler', () => {
  const envOriginal = { ...process.env };

  beforeEach(() => {
    Object.assign(process.env, ENV_TESTE);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    for (const k of Object.keys(ENV_TESTE)) {
      if (envOriginal[k] === undefined) delete process.env[k];
      else process.env[k] = envOriginal[k];
    }
  });

  it('OPTIONS -> 204 com CORS', async () => {
    const res = await chamar({ method: 'OPTIONS', headers: {} });
    expect(res.codigo).toBe(204);
    expect(res.cabecalhos['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
    expect(res.cabecalhos['Access-Control-Allow-Headers']).toContain('Authorization');
    expect(res.cabecalhos['Access-Control-Allow-Origin']).toBeDefined();
  });

  it('GET -> 405 com Allow', async () => {
    const res = await chamar({ method: 'GET', headers: {} });
    expect(res.codigo).toBe(405);
    expect(res.cabecalhos['Allow']).toBe('POST, OPTIONS');
    expect(res.corpo).toHaveProperty('erro');
  });

  it('POST sem token -> 401 com WWW-Authenticate', async () => {
    const fetchFalso = vi.fn();
    vi.stubGlobal('fetch', fetchFalso);
    const res = await chamar({ method: 'POST', headers: {}, body: { texto: 'oi' } });
    expect(res.codigo).toBe(401);
    expect(res.cabecalhos['WWW-Authenticate']).toBe('Bearer');
    expect(fetchFalso).not.toHaveBeenCalled();
  });

  it('POST com JWT recusado pelo Auth -> 401', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 401 })));
    const res = await chamar({
      method: 'POST',
      headers: { authorization: 'Bearer jwt-invalido' },
      body: { texto: 'oi' },
    });
    expect(res.codigo).toBe(401);
    expect(res.cabecalhos['WWW-Authenticate']).toBe('Bearer');
  });
});
