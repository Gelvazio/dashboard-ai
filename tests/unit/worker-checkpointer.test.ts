import { describe, expect, it } from 'vitest';
import { criarCheckpointer, SCHEMA_CHECKPOINTS } from '../../worker/checkpointer';

const url = process.env.LANGGRAPH_DATABASE_URL;

describe('criarCheckpointer', () => {
  it('exige LANGGRAPH_DATABASE_URL', async () => {
    await expect(criarCheckpointer({})).rejects.toThrow('LANGGRAPH_DATABASE_URL');
  });

  describe.skipIf(!url)('contra Postgres local (LANGGRAPH_DATABASE_URL)', () => {
    it('setup() é idempotente e grava/lê checkpoints no schema langgraph', async () => {
      const primeiro = await criarCheckpointer({ LANGGRAPH_DATABASE_URL: url });
      const segundo = await criarCheckpointer({ LANGGRAPH_DATABASE_URL: url });
      const config = { configurable: { thread_id: `teste-${Date.now()}`, checkpoint_ns: '' } };
      const checkpoint = {
        v: 1, id: '1ef00000-0000-6000-8000-000000000001', ts: new Date().toISOString(),
        channel_values: { instrucao: 'x' }, channel_versions: { instrucao: 1 }, versions_seen: {}, pending_sends: [],
      };
      await segundo.put(config, checkpoint, { source: 'input', step: -1, parents: {} }, {});
      const lido = await primeiro.getTuple(config);
      expect(lido?.checkpoint.id).toBe(checkpoint.id);
      const pool = (segundo as unknown as { pool: { query: (sql: string) => Promise<{ rows: { n: number }[] }>; end: () => Promise<void> } }).pool;
      const { rows } = await pool.query(
        `select count(*)::int as n from information_schema.tables where table_schema = '${SCHEMA_CHECKPOINTS}'`,
      );
      expect(rows[0].n).toBeGreaterThan(0);
      await Promise.all([primeiro.end(), segundo.end()]);
    });
  });
});
