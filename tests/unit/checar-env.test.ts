import { describe, expect, it } from 'vitest';
// @ts-expect-error script .mjs sem declaração de tipos
import { extrairVariaveis, variaveisDoExemplo } from '../../scripts/checar-env.mjs';

describe('extrairVariaveis', () => {
  it('reconhece process.env.X', () => {
    expect(extrairVariaveis('const u = process.env.SUPABASE_URL;')).toEqual(['SUPABASE_URL']);
  });

  it('reconhece import.meta.env.X', () => {
    expect(extrairVariaveis('import.meta.env.VITE_SUPABASE_ANON_KEY')).toEqual(['VITE_SUPABASE_ANON_KEY']);
  });

  it('reconhece env.X só em maiúsculas', () => {
    expect(extrairVariaveis('env.MCP_AUTH_TOKEN; env.modo; import.meta.env.DEV')).toEqual(['DEV', 'MCP_AUTH_TOKEN']);
  });

  it('reconhece env["X"]', () => {
    expect(extrairVariaveis("process.env['OPENAI_API_KEY']")).toEqual(['OPENAI_API_KEY']);
  });

  it('reconhece os.environ.get("X")', () => {
    expect(extrairVariaveis('os.environ.get("DASHBOARD_AI_PROJECT", "default")')).toEqual(['DASHBOARD_AI_PROJECT']);
  });

  it('reconhece os.environ["X"]', () => {
    expect(extrairVariaveis("os.environ['SUPABASE_SERVICE_ROLE_KEY']")).toEqual(['SUPABASE_SERVICE_ROLE_KEY']);
  });

  it('remove repetidos e ordena', () => {
    const texto = 'process.env.B_VAR; env.A_VAR; os.environ.get("B_VAR"); process.env.A_VAR';
    expect(extrairVariaveis(texto)).toEqual(['A_VAR', 'B_VAR']);
  });

  it('ignora textos sem variáveis e nomes parecidos', () => {
    expect(extrairVariaveis('myenv.FOO; environment.BAR; const x = 1')).toEqual([]);
    expect(extrairVariaveis('')).toEqual([]);
  });
});

describe('variaveisDoExemplo', () => {
  it('lê os nomes das linhas NOME=, ignorando comentários e linhas vazias', () => {
    const texto = [
      '# comentário com FOO=1',
      '',
      'VITE_SUPABASE_URL=',
      '  # OUTRA=2',
      'OPENAI_API_KEY=sk-exemplo',
      'export MCP_AUTH_TOKEN=',
      'linha solta sem igual',
    ].join('\n');
    expect(variaveisDoExemplo(texto)).toEqual(['MCP_AUTH_TOKEN', 'OPENAI_API_KEY', 'VITE_SUPABASE_URL']);
  });

  it('remove repetidos, aceita CRLF e texto vazio', () => {
    expect(variaveisDoExemplo('B=\r\nA=\r\nB=x\r\n')).toEqual(['A', 'B']);
    expect(variaveisDoExemplo('')).toEqual([]);
  });
});
