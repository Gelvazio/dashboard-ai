import { describe, it, expect } from 'vitest';
import { montarPromptPlano, PlanoSchema } from '../../worker/plano';

describe('montarPromptPlano', () => {
  it('deve incluir a instrucao da task', () => {
    const estado = {
      instrucao: 'Teste de instrucao',
      resultados: {},
    };
    const prompt = montarPromptPlano(estado);
    expect(prompt).toContain('Teste de instrucao');
  });

  it('deve incluir contexto de memorias se disponivel', () => {
    const estado = {
      instrucao: 'Teste',
      resultados: {
        brain_search: [
          { title: 'Memoria 1', content: 'Conteudo 1' },
          { title: 'Memoria 2', content: 'Conteudo 2' },
        ],
      },
    };
    const prompt = montarPromptPlano(estado);
    expect(prompt).toContain('Contexto de Memórias Relevantes');
    expect(prompt).toContain('Memoria 1');
    expect(prompt).toContain('Conteudo 1');
  });

  it('deve omitir contexto de memorias se vazio', () => {
    const estado = {
      instrucao: 'Teste',
      resultados: {},
    };
    const prompt = montarPromptPlano(estado);
    expect(prompt).not.toContain('Contexto de Memórias Relevantes');
  });

  it('deve incluir instrucoes de formato do plano', () => {
    const estado = {
      instrucao: 'Teste',
      resultados: {},
    };
    const prompt = montarPromptPlano(estado);
    expect(prompt).toContain('Plano de Execução');
    expect(prompt).toContain('brain_search');
    expect(prompt).toContain('brain_store');
    expect(prompt).toContain('sensivel');
  });
});

describe('PlanoSchema', () => {
  const passoValido = {
    ferramenta: 'brain_search',
    argumentos: { query: 'deploy' },
    sensivel: false,
    criterio: 'retorna ao menos uma memória',
  };

  it('aceita um plano válido', () => {
    const resultado = PlanoSchema.safeParse({ passos: [passoValido] });
    expect(resultado.success).toBe(true);
  });

  it('recusa passo sem ferramenta', () => {
    const { ferramenta: _ferramenta, ...semFerramenta } = passoValido;
    expect(PlanoSchema.safeParse({ passos: [semFerramenta] }).success).toBe(false);
  });

  it('recusa sensivel que não é booleano', () => {
    expect(PlanoSchema.safeParse({ passos: [{ ...passoValido, sensivel: 'nao' }] }).success).toBe(false);
  });

  it('recusa argumentos que não são objeto', () => {
    expect(PlanoSchema.safeParse({ passos: [{ ...passoValido, argumentos: 'query=deploy' }] }).success).toBe(false);
  });

  it('recusa plano sem a lista de passos', () => {
    expect(PlanoSchema.safeParse({}).success).toBe(false);
  });
});
