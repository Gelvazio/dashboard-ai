import { describe, expect, it, vi } from 'vitest';
import type { McpRequest, McpResponse } from '../../api/_lib/http';
import { AuthError } from '../../api/_lib/auth';
import { criarHandlerAprovacao, lerPedidoAprovacao, type DepsAprovacao } from '../../api/aprovacao';

type RespostaFalsa = McpResponse & { codigo: number; cabecalhos: Record<string, unknown>; corpo: unknown };

function respostaFalsa(): RespostaFalsa {
  const r = { codigo: 0, cabecalhos: {}, corpo: undefined } as RespostaFalsa;
  r.status = (c: number) => ((r.codigo = c), r);
  r.setHeader = (k: string, v: unknown) => ((r.cabecalhos[k] = v), r);
  r.json = (b: unknown) => ((r.corpo = b), r);
  r.end = () => r;
  return r;
}

function montar(over: Partial<DepsAprovacao> = {}) {
  const deps: DepsAprovacao = {
    verificarSessao: vi.fn(async (token: string) => (token === 'jwt-ok' ? { userId: 'u-1' } : null)),
    projetoDaTask: vi.fn(async (taskId: number) => (taskId === 5 ? 10 : null)),
    ehEditor: vi.fn(async () => true),
    ...over,
  };
  const handler = criarHandlerAprovacao(deps);
  return {
    deps,
    chamar: async (req: Partial<McpRequest>) => {
      const res = respostaFalsa();
      await handler({ method: 'POST', headers: {}, ...req }, res);
      return res;
    },
  };
}

const autenticado = { authorization: 'Bearer jwt-ok' };
const corpo = { taskId: 5, aprovado: true };

describe('api/aprovacao — autenticação e papel (SUB-28.16)', () => {
  it('OPTIONS -> 204 e GET -> 405', async () => {
    const { chamar } = montar();
    expect((await chamar({ method: 'OPTIONS' })).codigo).toBe(204);
    const get = await chamar({ method: 'GET' });
    expect(get.codigo).toBe(405);
    expect(get.cabecalhos['Allow']).toBe('POST, OPTIONS');
  });

  it('401 sem token ou com sessão inválida, sem consultar a task', async () => {
    const { chamar, deps } = montar();
    const sem = await chamar({ body: corpo });
    expect(sem.codigo).toBe(401);
    expect(sem.cabecalhos['WWW-Authenticate']).toBe('Bearer');
    expect((await chamar({ headers: { authorization: 'Bearer expirado' }, body: corpo })).codigo).toBe(401);
    expect(deps.projetoDaTask).not.toHaveBeenCalled();
  });

  it('403 sem papel editor no projeto da task', async () => {
    const { chamar, deps } = montar({ ehEditor: vi.fn(async () => false) });
    const res = await chamar({ headers: autenticado, body: corpo });
    expect(res.codigo).toBe(403);
    expect(deps.ehEditor).toHaveBeenCalledWith('jwt-ok', 10);
  });

  it('400 com corpo inválido (sessão válida)', async () => {
    const { chamar, deps } = montar();
    for (const body of [undefined, 'não-json', [], { taskId: '5', aprovado: true }, { taskId: 5 }, { taskId: 0, aprovado: true }]) {
      expect((await chamar({ headers: autenticado, body })).codigo).toBe(400);
    }
    expect(deps.projetoDaTask).not.toHaveBeenCalled();
  });

  it('404 para task inexistente', async () => {
    const { chamar } = montar();
    expect((await chamar({ headers: autenticado, body: { taskId: 99, aprovado: false } })).codigo).toBe(404);
  });

  it('503 quando a validação de sessão ou de papel está indisponível', async () => {
    const semAuth = montar({ verificarSessao: vi.fn(async () => Promise.reject(new AuthError('x'))) });
    expect((await semAuth.chamar({ headers: autenticado, body: corpo })).codigo).toBe(503);
    const semPapel = montar({ ehEditor: vi.fn(async () => Promise.reject(new AuthError('x'))) });
    expect((await semPapel.chamar({ headers: autenticado, body: corpo })).codigo).toBe(503);
  });

  it('editor autorizado: 501 até a retomada existir; com `retomar` devolve 200', async () => {
    expect((await montar().chamar({ headers: autenticado, body: corpo })).codigo).toBe(501);
    const retomar = vi.fn(async () => ({ situacao: 'retomada' }));
    const res = await montar({ retomar }).chamar({ headers: autenticado, body: JSON.stringify({ ...corpo, motivo: 'ok' }) });
    expect(res.codigo).toBe(200);
    expect(retomar).toHaveBeenCalledWith({ taskId: 5, aprovado: true, motivo: 'ok' }, { userId: 'u-1' });
  });
});

describe('lerPedidoAprovacao', () => {
  it('aceita JSON em string/Buffer e limita o motivo', () => {
    expect(lerPedidoAprovacao(Buffer.from('{"taskId":3,"aprovado":false}'))).toEqual({ taskId: 3, aprovado: false });
    expect(() => lerPedidoAprovacao({ taskId: 3, aprovado: true, motivo: 'x'.repeat(1001) })).toThrow('motivo');
  });
});
