import { describe, it, expect } from 'vitest';
import { EstadoSchema } from '../../worker/estado';

describe('EstadoSchema', () => {
  it('deve validar um estado válido', () => {
    const estado = {
      taskId: 1,
      taskCodigo: 'TASK-001',
      projeto: 'default',
      agente: 'claude',
      tentativa: 1,
      execucaoId: 'task-1-t1',
      instrucao: 'Teste',
      plano: 'Plano',
      passoAtual: 'passo1',
      resultados: { chave: 'valor' },
      aprovacao: null,
      final: false,
    };
    const resultado = EstadoSchema.parse(estado);
    expect(resultado).toEqual(estado);
  });

  it('deve recusar estado com campo faltando', () => {
    const estado = {
      taskId: 1,
      taskCodigo: 'TASK-001',
      // campos faltando
    };
    expect(() => EstadoSchema.parse(estado)).toThrow();
  });

  it('deve recusar estado com tipo errado', () => {
    const estado = {
      taskId: 'não é número',
      taskCodigo: 'TASK-001',
      projeto: 'default',
      agente: 'claude',
      tentativa: 1,
      execucaoId: 'task-1-t1',
      instrucao: 'Teste',
      plano: 'Plano',
      passoAtual: 'passo1',
      resultados: {},
      aprovacao: null,
      final: false,
    };
    expect(() => EstadoSchema.parse(estado)).toThrow();
  });
});
