import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';

/** Schema próprio dos checkpoints, separado das tabelas da aplicação. */
export const SCHEMA_CHECKPOINTS = 'langgraph';

/**
 * Checkpointer durável para o worker LangGraph (SUB-28.13).
 * Usa `PostgresSaver` no schema `langgraph` com `LANGGRAPH_DATABASE_URL`
 * (só no servidor; nunca no frontend). `setup()` cria as tabelas e é idempotente.
 */
export async function criarCheckpointer(env: NodeJS.ProcessEnv = process.env): Promise<PostgresSaver> {
  const url = env.LANGGRAPH_DATABASE_URL;
  if (!url) {
    throw new Error('LANGGRAPH_DATABASE_URL não definida');
  }
  const checkpointer = PostgresSaver.fromConnString(url, { schema: SCHEMA_CHECKPOINTS });
  await checkpointer.setup();
  return checkpointer;
}
