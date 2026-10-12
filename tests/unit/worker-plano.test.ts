import { describe, it, expect } from 'vitest';
import { montarPromptPlano } from '../../worker/plano';

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
