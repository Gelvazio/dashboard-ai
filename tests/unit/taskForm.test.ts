import { describe, expect, it } from 'vitest';
import { isoParaLocal, listaDependencias, localParaIso, paraDadosTask, validarTask, valoresIniciais } from '@/lib/taskForm';
import type { Task } from '@/types';

describe('lib/taskForm', () => {
  it('valores padrão de uma task nova', () => {
    const v = valoresIniciais();
    expect(v).toMatchObject({ titulo: '', prioridade: 3, ordem: '0', maxTentativas: '3', executar: true, tipo: 'ia' });
  });

  it('carrega uma task existente', () => {
    const v = valoresIniciais({ titulo: 'T', instrucao: 'I', tipo: 'humano', prioridade: 1, ordem: 4, executar_apos: null, max_tentativas: 5, dependencias: ['A-1', 'A-2'], executar: false } as unknown as Task);
    expect(v).toMatchObject({ titulo: 'T', tipo: 'humano', prioridade: 1, ordem: '4', maxTentativas: '5', dependencias: 'A-1, A-2', executar: false, executarApos: '' });
  });

  it('exige título e instrução e valida números', () => {
    const e = validarTask({ ...valoresIniciais(), ordem: '1.5', maxTentativas: '0', executarApos: 'xx' });
    expect(Object.keys(e).sort()).toEqual(['executarApos', 'instrucao', 'maxTentativas', 'ordem', 'titulo']);
    expect(validarTask({ ...valoresIniciais(), titulo: 'a', instrucao: 'b' })).toEqual({});
    expect(validarTask({ ...valoresIniciais(), titulo: 'a', instrucao: 'b', maxTentativas: '21' }).maxTentativas).toBeTruthy();
  });

  it('não deixa a task depender de si mesma', () => {
    expect(validarTask({ ...valoresIniciais(), titulo: 'a', instrucao: 'b', dependencias: 'loja-0002' }, 'LOJA-0002').dependencias).toBeTruthy();
  });

  it('normaliza dependências', () => {
    expect(listaDependencias(' a-1, A-1;b-2  c-3,,')).toEqual(['A-1', 'B-2', 'C-3']);
  });

  it('converte datas locais <-> ISO', () => {
    const iso = localParaIso('2026-10-11T22:40');
    expect(iso).toMatch(/Z$/);
    expect(isoParaLocal(iso)).toBe('2026-10-11T22:40');
    expect(localParaIso('')).toBeNull();
    expect(isoParaLocal(null)).toBe('');
  });

  it('gera o payload do serviço', () => {
    const d = paraDadosTask({ ...valoresIniciais(), titulo: '  X ', instrucao: ' Y\n', ordem: '2', maxTentativas: '4', dependencias: 'a-1' });
    expect(d).toEqual({ titulo: 'X', instrucao: 'Y', tipo: 'ia', prioridade: 3, ordem: 2, executar_apos: null, max_tentativas: 4, dependencias: ['A-1'], executar: true });
  });
});
