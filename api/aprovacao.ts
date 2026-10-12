/**
 * POST /api/aprovacao — decisão humana sobre um passo sensível do worker LangGraph.
 *
 * SUB-28.16: exige JWT do Supabase Auth (`bearerToken` + `verificarSessaoSupabase`)
 * e papel editor no projeto da task (`tem_acesso_projeto`, avaliado com o JWT do
 * usuário): 401 sem sessão, 403 sem papel, 400 corpo inválido, 404 task inexistente.
 * SUB-28.23: retoma o grafo com `Command({ resume })` no `thread_id` da execução.
 * Corpo: `{ taskId, aprovado, motivo? }`.
 */
import { AuthError, bearerToken, verificarSessaoSupabase } from './_lib/auth.js';
import type { McpRequest, McpResponse } from './_lib/http.js';
import { HttpError } from './_lib/http-error.js';
import { db, unwrap } from './_lib/supabase.js';
import { criarGrafo } from '../worker/grafo.js';
import { criarCheckpointer } from '../worker/checkpointer.js';
import { ChatOpenAI } from '@langchain/openai';
import type { GrafoExecucao } from '../worker/executar.js';

export interface PedidoAprovacao {
  taskId: number;
  aprovado: boolean;
  motivo?: string;
}

export interface DepsAprovacao {
  verificarSessao: (token: string) => Promise<{ userId: string } | null>;
  /** `project_id` da task (service_role) ou `null` se não existir. */
  projetoDaTask: (taskId: number) => Promise<number | null>;
  /** `tem_acesso_projeto(projeto, 'editor')` avaliado com o JWT do usuário. */
  ehEditor: (token: string, projectId: number) => Promise<boolean>;
  /** Lê o `execucaoId` mais recente da task dos logs (service_role). */
  execucaoIdDaTask: (taskId: number) => Promise<string | null>;
  /** Cria o grafo compilado com checkpointer. */
  criarGrafoComCheckpointer: () => Promise<GrafoExecucao>;
}

const MOTIVO_MAX = 1000;

/** Valida o corpo `{ taskId, aprovado, motivo? }` (JSON, string ou Buffer). */
export function lerPedidoAprovacao(body: unknown): PedidoAprovacao {
  let dados = body;
  if (typeof dados === 'string' || Buffer.isBuffer(dados)) {
    try {
      dados = JSON.parse(dados.toString());
    } catch {
      throw new HttpError(400, 'Corpo inválido: envie JSON.');
    }
  }
  if (typeof dados !== 'object' || dados === null || Array.isArray(dados)) {
    throw new HttpError(400, 'Corpo inválido: envie { taskId, aprovado }.');
  }
  const { taskId, aprovado, motivo } = dados as Record<string, unknown>;
  if (typeof taskId !== 'number' || !Number.isSafeInteger(taskId) || taskId <= 0) {
    throw new HttpError(400, 'Campo "taskId" deve ser um inteiro positivo.');
  }
  if (typeof aprovado !== 'boolean') {
    throw new HttpError(400, 'Campo "aprovado" deve ser true ou false.');
  }
  if (motivo !== undefined && (typeof motivo !== 'string' || motivo.length > MOTIVO_MAX)) {
    throw new HttpError(400, `Campo "motivo" deve ser texto de até ${MOTIVO_MAX} caracteres.`);
  }
  return { taskId, aprovado, ...(motivo ? { motivo } : {}) };
}

async function projetoDaTaskNoSupabase(taskId: number): Promise<number | null> {
  const linhas = unwrap<{ project_id: number }[]>(await db().from('tasks').select('project_id').eq('id', taskId).limit(1));
  return linhas[0]?.project_id ?? null;
}

async function execucaoIdDaTaskNoSupabase(taskId: number): Promise<string | null> {
  const linhas = unwrap<{ execucao_id: string }[]>(
    await db()
      .from('agendamento_tarefa_logs')
      .select('execucao_id')
      .eq('task_id', taskId)
      .order('data_hora', { ascending: false })
      .limit(1),
  );
  return linhas[0]?.execucao_id ?? null;
}

async function criarGrafoComCheckpointerPadrao(): Promise<GrafoExecucao> {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY não definida');
  const checkpointer = await criarCheckpointer();
  const modelo = new ChatOpenAI({
    model: process.env.WORKER_MODELO || 'gpt-4o-mini',
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
  });
  return criarGrafo({ modelo, checkpointer: checkpointer as unknown as any }) as unknown as GrafoExecucao;
}

async function ehEditorNoSupabase(token: string, projectId: number): Promise<boolean> {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, '');
  const apikey = process.env.SUPABASE_ANON_KEY;
  if (!url || !apikey) throw new AuthError('Verificação de papel indisponível: SUPABASE_URL ou SUPABASE_ANON_KEY ausente.');
  let resp: Response;
  try {
    resp = await fetch(`${url}/rest/v1/rpc/tem_acesso_projeto`, {
      method: 'POST',
      headers: { apikey, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_project_id: projectId, p_min_role: 'editor' }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new AuthError('Falha de rede ao verificar o papel no projeto.');
  }
  if (!resp.ok) throw new AuthError(`Falha ao verificar o papel no projeto (HTTP ${resp.status}).`);
  return (await resp.json().catch(() => false)) === true;
}

const DEPS_PADRAO: DepsAprovacao = {
  verificarSessao: (token) => verificarSessaoSupabase(token),
  projetoDaTask: projetoDaTaskNoSupabase,
  ehEditor: ehEditorNoSupabase,
  execucaoIdDaTask: execucaoIdDaTaskNoSupabase,
  criarGrafoComCheckpointer: criarGrafoComCheckpointerPadrao,
};

/**
 * Retoma o grafo LangGraph com o comando de aprovação (SUB-28.23).
 * Usa o `thread_id` da execução (`execucaoId`) e envia `Command({ resume })`
 * com a decisão do usuário.
 */
async function retomarGrafo(pedido: PedidoAprovacao, grafo: GrafoExecucao, execucaoId: string): Promise<unknown> {
  return grafo.invoke(
    {
      aprovacao: {
        aprovado: pedido.aprovado,
        por: 'humano',
        em: new Date().toISOString(),
        motivo: pedido.motivo,
      },
    },
    { configurable: { thread_id: execucaoId } },
  );
}

function setCors(res: McpResponse): void {
  res.setHeader('Access-Control-Allow-Origin', process.env.MCP_CORS_ORIGIN ?? '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function criarHandlerAprovacao(deps: DepsAprovacao = DEPS_PADRAO) {
  return async function handler(req: McpRequest, res: McpResponse) {
    setCors(res);
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST, OPTIONS');
      return res.status(405).json({ erro: 'Apenas requisições POST são aceitas.' });
    }

    try {
      const token = bearerToken(req.headers);
      const sessao = token ? await deps.verificarSessao(token) : null;
      if (!token || !sessao) {
        res.setHeader('WWW-Authenticate', 'Bearer');
        return res.status(401).json({ erro: 'Não autorizado: faça login novamente.' });
      }

      const pedido = lerPedidoAprovacao(req.body);
      const projectId = await deps.projetoDaTask(pedido.taskId);
      if (projectId === null) return res.status(404).json({ erro: 'Task não encontrada.' });
      if (!(await deps.ehEditor(token, projectId))) {
        return res.status(403).json({ erro: 'Sem permissão: é preciso ser editor do projeto da task.' });
      }

      const execucaoId = await deps.execucaoIdDaTask(pedido.taskId);
      if (!execucaoId) return res.status(404).json({ erro: 'Execução não encontrada para esta task.' });

      const grafo = await deps.criarGrafoComCheckpointer();
      const resultado = await retomarGrafo(pedido, grafo, execucaoId);
      return res.status(200).json({ taskId: pedido.taskId, aprovado: pedido.aprovado, resultado });
    } catch (err) {
      if (err instanceof HttpError) return res.status(err.status).json({ erro: err.message });
      if (err instanceof AuthError) {
        return res.status(503).json({ erro: 'Serviço de autenticação indisponível. Tente novamente.' });
      }
      throw err;
    }
  };
}

export default criarHandlerAprovacao();
