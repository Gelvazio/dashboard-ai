/**
 * Projetos visíveis ao usuário (a RLS devolve só os projetos em que ele é membro,
 * ou todos se for administrador).
 */
import type { Project, ProjectInsert } from '@/types';
import { getSupabase, resultado, ServiceError, type DashboardClient } from './supabase';

/** Projetos ativos e não excluídos, em ordem alfabética. */
export async function listarProjetos(client: DashboardClient = getSupabase()): Promise<Project[]> {
  return resultado(
    await client.from('projects').select('*').eq('excluido', false).eq('ativo', true).order('nome'),
    'Listar projetos',
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
