import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
// @ts-expect-error script .mjs sem declaração de tipos
import { extrairVariaveis, listarArquivosFonte, main, variaveisDoExemplo } from '../../scripts/checar-env.mjs';

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

describe('listarArquivosFonte', () => {
  let raiz = '';
  afterEach(() => {
    if (raiz) rmSync(raiz, { recursive: true, force: true });
  });

  it('varre recursivamente só as extensões de código, ignorando node_modules, dist e tests', () => {
    raiz = mkdtempSync(join(tmpdir(), 'checar-env-'));
    const criar = (rel: string) => {
      const caminho = join(raiz, rel);
      mkdirSync(dirname(caminho), { recursive: true });
      writeFileSync(caminho, '');
    };
    ['src/a.ts', 'src/ui/b.tsx', 'src/c.js', 'api/d.mjs', 'scripts/e.py', 'src/f.css', 'src/g.md',
      'src/node_modules/x.ts', 'api/dist/y.js', 'src/tests/z.ts'].forEach(criar);

    const dirs = ['src', 'api', 'scripts', 'inexistente'].map((d) => join(raiz, d));
    expect(listarArquivosFonte(dirs)).toEqual(
      ['api/d.mjs', 'scripts/e.py', 'src/a.ts', 'src/c.js', 'src/ui/b.tsx'].map((r) => join(raiz, r)),
    );
  });
});

describe('main (check:env)', () => {
  let raiz = '';
  afterEach(() => {
    vi.restoreAllMocks();
    if (raiz) rmSync(raiz, { recursive: true, force: true });
  });

  const montar = (exemplo: string) => {
    raiz = mkdtempSync(join(tmpdir(), 'checar-env-main-'));
    mkdirSync(join(raiz, 'api'), { recursive: true });
    writeFileSync(join(raiz, 'api', 'a.ts'), 'process.env.FOO_URL; import.meta.env.DEV;');
    writeFileSync(join(raiz, '.env.example'), exemplo);
  };

  it('passa quando toda variável usada está no .env.example (ignora DEV do Vite)', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {});
    montar('FOO_URL=\nSOBRANDO=\n');
    expect(main(raiz)).toBe(0);
    expect(aviso).toHaveBeenCalledWith(expect.stringContaining('SOBRANDO'));
  });

  it('falha quando falta uma variável no .env.example', () => {
    const erro = vi.spyOn(console, 'error').mockImplementation(() => {});
    montar('# vazio\n');
    expect(main(raiz)).toBe(1);
    expect(erro.mock.calls.flat().join('\n')).toContain('FOO_URL');
  });
});
