import { describe, expect, it } from 'vitest';
import {
  acoesDisponiveis, bloqueadaPorDependencia, filtrarTasks, dependenciasDa, formatarDataHora, infoPrioridade, progressoTentativas, resumo, STATUS_INFO, tempoRelativo,
} from '@/lib/tasks';
import { TASK_STATUS, type Task } from '@/types';

describe('lib/tasks', () => {
  it('tem rótulo e cor para todos os status', () => {
    for (const s of TASK_STATUS) expect(STATUS_INFO[s].rotulo).toBeTruthy();
  });

  it('prioridade limita a 1..5', () => {
    expect(infoPrioridade(1).rotulo).toBe('Crítica');
    expect(infoPrioridade(9).rotulo).toBe('Mínima');
    expect(infoPrioridade(0).rotulo).toBe('Crítica');
  });

  it('progresso das tentativas', () => {
    expect(progressoTentativas({ tentativas: 1, max_tentativas: 4 })).toBe(0.25);
    expect(progressoTentativas({ tentativas: 5, max_tentativas: 3 })).toBe(1);
    expect(progressoTentativas({ tentativas: 0, max_tentativas: 0 })).toBe(0);
  });

  it('resolve dependências pelo código', () => {
    const mapa = new Map<string, Pick<Task, 'status'>>([['A-1', { status: 'concluida' }], ['A-2', { status: 'erro' }]]);
    const deps = dependenciasDa({ dependencias: ['A-1', 'A-2', 'X-9'] }, mapa);
    expect(deps.map((d) => d.estado)).toEqual(['concluida', 'pendente', 'desconhecida']);
    expect(bloqueadaPorDependencia(deps)).toBe(true);
    expect(bloqueadaPorDependencia(deps.slice(0, 1))).toBe(false);
    expect(bloqueadaPorDependencia([{ codigo: 'X', estado: 'desconhecida' }])).toBe(false);
  });

  it('tempo relativo e datas', () => {
    const agora = Date.parse('2026-10-11T12:00:00Z');
    expect(tempoRelativo('2026-10-11T11:55:00Z', agora)).toBe('há 5 min');
    expect(tempoRelativo('2026-10-11T09:00:00Z', agora)).toBe('há 3 h');
    expect(tempoRelativo('2026-10-08T12:00:00Z', agora)).toBe('há 3 dias');
    expect(tempoRelativo('2026-10-11T14:00:00Z', agora)).toBe('em 2 h');
    expect(tempoRelativo('2026-10-11T12:00:03Z', agora)).toBe('agora');
    expect(tempoRelativo(null)).toBe('—');
    expect(formatarDataHora(null)).toBe('—');
    expect(formatarDataHora('lixo')).toBe('—');
    expect(formatarDataHora('2026-10-11T12:00:00Z')).toMatch(/2026/);
  });

  it('resumo usa a primeira linha não vazia e corta', () => {
    expect(resumo('\n  Olá mundo\nsegunda')).toBe('Olá mundo');
    expect(resumo('x'.repeat(100), 10)).toBe(`${'x'.repeat(9)}…`);
    expect(resumo(null)).toBe('');
  });

  it('ações disponíveis espelham a proteção do banco', () => {
    const nada = { editar: false, alternar: false, reabrir: false, cancelar: false, concluir: false, excluir: false };
    expect(acoesDisponiveis({ status: 'em_execucao', tipo: 'ia', excluido: false })).toEqual(nada);
    expect(acoesDisponiveis({ status: 'pendente', tipo: 'ia', excluido: true })).toEqual(nada);
    expect(acoesDisponiveis({ status: 'pendente', tipo: 'ia', excluido: false })).toEqual({ editar: true, alternar: true, reabrir: false, cancelar: true, concluir: false, excluir: true });
    expect(acoesDisponiveis({ status: 'pendente', tipo: 'humano', excluido: false }).concluir).toBe(true);
    expect(acoesDisponiveis({ status: 'erro', tipo: 'ia', excluido: false })).toMatchObject({ reabrir: true, cancelar: true, alternar: true });
    expect(acoesDisponiveis({ status: 'recusada', tipo: 'ia', excluido: false }).reabrir).toBe(true);
    expect(acoesDisponiveis({ status: 'cancelada', tipo: 'ia', excluido: false })).toMatchObject({ reabrir: true, cancelar: false, alternar: false });
    expect(acoesDisponiveis({ status: 'concluida', tipo: 'ia', excluido: false })).toMatchObject({ reabrir: false, cancelar: false, alternar: false, editar: true });
  });
});

describe('filtrarTasks', () => {
  const lista = [
    { codigo: 'LOJA-0001', titulo: 'Criar página de checkout', instrucao: 'Usar Stripe', status: 'pendente' as const },
    { codigo: 'LOJA-0002', titulo: 'Corrigir frete', instrucao: 'Cálculo por CEP', status: 'erro' as const },
  ];
  it('busca em código, título e instrução sem acento/maiúsculas', () => {
    expect(filtrarTasks(lista, { busca: 'pagina' }).map((t) => t.codigo)).toEqual(['LOJA-0001']);
    expect(filtrarTasks(lista, { busca: 'calculo' }).map((t) => t.codigo)).toEqual(['LOJA-0002']);
    expect(filtrarTasks(lista, { busca: '0002' })).toHaveLength(1);
    expect(filtrarTasks(lista, {})).toHaveLength(2);
  });
  it('filtra por status', () => {
    expect(filtrarTasks(lista, { status: 'erro' }).map((t) => t.codigo)).toEqual(['LOJA-0002']);
    expect(filtrarTasks(lista, { status: 'todos', busca: 'stripe' })).toHaveLength(1);
  });
});
