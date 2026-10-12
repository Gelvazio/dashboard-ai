import { describe, expect, it } from 'vitest';
import { ServiceError, papelDaChave, resultado, verificarConexao } from '@/services/supabase';

const chave = (role: string) =>
  `x.${Buffer.from(JSON.stringify({ role })).toString('base64url')}.y`;

describe('services/supabase', () => {
  it('resultado devolve data quando não há erro', () => {
    expect(resultado({ data: [1, 2], error: null })).toEqual([1, 2]);
  });

  it('resultado traduz códigos conhecidos e mantém mensagens de trigger', () => {
    expect(() => resultado({ data: null, error: { message: 'new row violates row-level security', code: '42501' } }))
      .toThrowError('Sem permissão para esta operação neste projeto.');
    try {
      resultado({ data: null, error: { message: 'tasks: a dependência "X-1" não existe', code: 'P0001' } }, 'Salvar task');
    } catch (e) {
      expect(e).toBeInstanceOf(ServiceError);
      expect((e as ServiceError).message).toBe('Salvar task: tasks: a dependência "X-1" não existe');
      expect((e as ServiceError).code).toBe('P0001');
    }
  });

  it('papelDaChave lê o role do JWT (detecta service_role no frontend)', () => {
    expect(papelDaChave(chave('anon'))).toBe('anon');
    expect(papelDaChave(chave('service_role'))).toBe('service_role');
    expect(papelDaChave('não-é-jwt')).toBeUndefined();
  });

  it('sem variáveis de ambiente a conexão fica "sem_config"', async () => {
    expect(await verificarConexao()).toEqual({ estado: 'sem_config' });
  });
});
