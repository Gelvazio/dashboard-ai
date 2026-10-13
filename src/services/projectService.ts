/**
 * Projetos visíveis ao usuário (a RLS devolve só os projetos em que ele é membro,
 * ou todos se for administrador).
 */
import type { Project, ProjectInsert, ProjectUpdate } from '@/types';
import { getSupabase, resultado, ServiceError, type DashboardClient } from './supabase';

/** Projetos ativos e não excluídos, em ordem alfabética. */
export async function listarProjetos(client: DashboardClient = getSupabase()): Promise<Project[]> {
  return resultado(
    await client.from('projects').select('*').eq('excluido', false).eq('ativo', true).order('nome'),
    'Listar projetos',
  );
}

/** Lista projetos ativos e inativos visíveis ao usuário, sem os excluídos. */
export async function listarProjetosParaGerenciamento(
  client: DashboardClient = getSupabase(),
): Promise<Project[]> {
  return resultado(
    await client.from('projects').select('*').eq('excluido', false).order('nome'),
    'Listar projetos para gerenciamento',
  );
}

/** Cria um projeto e traduz os erros comuns de permissão e identificador duplicado. */
export async function criarProjeto(
  dados: ProjectInsert,
  client: DashboardClient = getSupabase(),
): Promise<Project> {
  try {
    return resultado(
      await client.from('projects').insert(dados).select('*').single(),
      'Criar projeto',
    );
  } catch (erro) {
    if (!(erro instanceof ServiceError)) throw erro;
    if (erro.code === '42501') throw new ServiceError('Só administradores podem criar projetos.', erro.code);
    if (erro.code === '23505') {
      throw new ServiceError('Já existe um projeto com esse identificador.', erro.code);
    }
    throw erro;
  }
}

/** Atualiza os campos fornecidos de um projeto acessível ao usuário. */
export async function atualizarProjeto(
  id: number,
  campos: ProjectUpdate,
  client: DashboardClient = getSupabase(),
): Promise<Project> {
  try {
    return resultado(
      await client.from('projects').update(campos).eq('id', id).select('*').single(),
      'Atualizar projeto',
    );
  } catch (erro) {
    if (!(erro instanceof ServiceError)) throw erro;
    if (erro.code === '42501') {
      throw new ServiceError('Só responsáveis ou administradores podem editar projetos.', erro.code);
    }
    throw erro;
  }
}

/** Ativa ou inativa um projeto, preservando os demais campos. */
export async function definirProjetoAtivo(
  id: number,
  ativo: boolean,
  client: DashboardClient = getSupabase(),
): Promise<Project> {
  return atualizarProjeto(id, { ativo }, client);
}
