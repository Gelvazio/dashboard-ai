/**
 * Projetos visíveis ao usuário (a RLS devolve só os projetos em que ele é membro,
 * ou todos se for administrador).
 */
import type { Project } from '@/types';
import { getSupabase, resultado, type DashboardClient } from './supabase';

/** Projetos ativos e não excluídos, em ordem alfabética. */
export async function listarProjetos(client: DashboardClient = getSupabase()): Promise<Project[]> {
  return resultado(
    await client.from('projects').select('*').eq('excluido', false).eq('ativo', true).order('nome'),
    'Listar projetos',
  );
}
