/**
 * Helpers dos testes de integração: clientes supabase-js apontando para um
 * PostgREST local (sem Supabase), com JWTs assinados pelo segredo de teste.
 *
 * Variáveis (definidas por tests/integration/run.sh):
 *   DASHBOARD_TEST_REST_URL     ex.: http://localhost:3399
 *   DASHBOARD_TEST_JWT_SECRET   jwt-secret do PostgREST de teste (nunca um segredo real)
 */
import { createHmac, randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import type { DashboardClient } from '@/services/supabase';
import type { Database } from '@/types/database';

export const REST_URL = process.env.DASHBOARD_TEST_REST_URL;
const SECRET = process.env.DASHBOARD_TEST_JWT_SECRET;
export const integracaoDisponivel = Boolean(REST_URL && SECRET);

const FAKE_URL = 'http://supabase.test';

const b64url = (v: string | Buffer) => Buffer.from(v).toString('base64url');

export function jwt(role: 'anon' | 'authenticated' | 'service_role', sub?: string): string {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64url(
    JSON.stringify({ role, ...(sub ? { sub } : {}), exp: Math.floor(Date.now() / 1000) + 3600 }),
  );
  const sig = createHmac('sha256', SECRET!).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${sig}`;
}

/** Cliente tipado que envia o JWT informado (como o supabase-js faz com a sessão do usuário). */
export function cliente(token: string): DashboardClient {
  const prefixo = `${FAKE_URL}/rest/v1`;
  return createClient<Database>(FAKE_URL, jwt('anon'), {
    accessToken: async () => token,
    global: {
      fetch: (input, init) => {
        const href = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
        return fetch(href.startsWith(prefixo) ? REST_URL + href.slice(prefixo.length) : input, init);
      },
    },
  });
}

export const servico = () => cliente(jwt('service_role'));
export const anonimo = () => cliente(jwt('anon'));
export const usuario = (id: string) => cliente(jwt('authenticated', id));

/** Cria um projeto isolado (slug único) com membros, via service_role. */
export async function criarProjeto(
  membros: { id: string; role: 'owner' | 'editor' | 'viewer' }[] = [],
  prefixo = 'TST',
) {
  const sb = servico();
  const slug = `t-${randomUUID().slice(0, 8)}`;
  const { data, error } = await sb
    .from('projects')
    .insert({ slug, nome: `Projeto ${slug}`, prefixo_codigo: prefixo })
    .select()
    .single();
  if (error) throw error;
  if (membros.length) {
    const r = await sb.from('project_members').insert(membros.map((m) => ({ project_id: data.id, user_id: m.id, role: m.role })));
    if (r.error) throw r.error;
  }
  return data;
}

export const novoUsuario = () => randomUUID();
