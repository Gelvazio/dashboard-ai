/**
 * Tipos do banco do Dashboard AI (database/00–06, multi-projeto — ver SUB-29/SUB-31).
 * Escritos à mão no formato do `supabase gen types`, para tipar o cliente
 * `createClient<Database>()`. Ao mudar o SQL, atualize aqui.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ----------------------------------------------------------------- enums (checks do SQL)
export type TaskStatus = 'pendente' | 'em_execucao' | 'concluida' | 'recusada' | 'erro' | 'cancelada';
export type TaskTipo = 'ia' | 'humano';
export type TaskOrigem = 'ui' | 'repositorio' | 'mcp' | 'api' | 'script';
export type LogStatus = 'concluida' | 'recusada' | 'erro' | 'sem_tarefa';
export type ProjectRole = 'owner' | 'editor' | 'viewer';
export type UserRole = 'admin' | 'member';
export type MessageTipo = 'recado' | 'pergunta' | 'resposta' | 'alerta' | 'handoff';

export const TASK_STATUS: readonly TaskStatus[] = ['pendente', 'em_execucao', 'concluida', 'recusada', 'erro', 'cancelada'];
export const LOG_STATUS: readonly LogStatus[] = ['concluida', 'recusada', 'erro', 'sem_tarefa'];

// ----------------------------------------------------------------- linhas
export type Project = {
  id: number;
  slug: string;
  nome: string;
  descricao: string | null;
  repositorio: string | null;
  branch_padrao: string;
  prefixo_codigo: string;
  proximo_numero: number;
  ativo: boolean;
  excluido: boolean;
  criado_por: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectMember = {
  project_id: number;
  user_id: string;
  role: ProjectRole;
  created_at: string;
};

export type UserRoleRow = {
  user_id: string;
  role: UserRole;
  email: string | null;
  nome: string | null;
  created_at: string;
};

export type Task = {
  id: number;
  project_id: number;
  codigo: string;
  titulo: string;
  instrucao: string;
  tipo: TaskTipo;
  origem: TaskOrigem;
  prioridade: number;
  ordem: number;
  dependencias: string[];
  executar: boolean;
  status: TaskStatus;
  tentativas: number;
  max_tentativas: number;
  executar_apos: string | null;
  resultado: string | null;
  pr_url: string | null;
  commit_sha: string | null;
  trava_frente: string | null;
  trava_em: string | null;
  iniciado_em: string | null;
  concluido_em: string | null;
  arquivo_md: string | null;
  md5_md: string | null;
  sincronizado_em: string | null;
  log_id: number | null;
  excluido: boolean;
  excluido_em: string | null;
  criado_por: string | null;
  atualizado_por: string | null;
  created_at: string;
  updated_at: string;
};

export type AiMemory = {
  id: string;
  project_id: number | null; // null = memória global
  title: string;
  content: string;
  tags: string[];
  embedding: string | null; // pgvector serializado ("[0.1,...]")
  criado_por: string | null;
  created_at: string;
  updated_at: string;
};

export type AgendamentoLog = {
  id: number;
  project_id: number | null;
  data_hora: string;
  rotina: string;
  status: LogStatus;
  task_id: number | null;
  task_codigo: string | null;
  agente: string | null;
  detalhes: string | null;
  erro_mensagem: string | null;
  status_anterior: string | null;
  status_novo: string | null;
  instrucao_recebida: string | null;
  repositorio: string | null;
  branch: string | null;
  commit_sha: string | null;
  pr_url: string | null;
  sessao_url: string | null;
  arquivos_alterados: number | null;
  inicio_em: string | null;
  fim_em: string | null;
  duracao_ms: number | null;
  created_at: string;
};

export type AgentMessage = {
  id: number;
  project_id: number;
  task_id: number | null;
  task_codigo: string | null;
  remetente: string;
  destinatario: string | null;
  tipo: MessageTipo;
  assunto: string | null;
  mensagem: string;
  resposta_de: number | null;
  lido_em: string | null;
  lido_por: string | null;
  arquivado: boolean;
  metadados: Json;
  criado_por: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectRule = {
  id: number;
  project_id: number;
  arquivo: string;
  secao: string;
  ordem: number;
  conteudo: string;
  md5: string | null;
  commit_sha: string | null;
  sincronizado_em: string | null;
  ativo: boolean;
  criado_por: string | null;
  atualizado_por: string | null;
  created_at: string;
  updated_at: string;
};

/** Resultado de `match_memories`. */
export type MemoryMatch = {
  id: string;
  project_id: number | null;
  title: string;
  content: string;
  tags: string[];
  similarity: number;
  updated_at: string;
};

// ----------------------------------------------------------------- inserts / updates
type Opcionais<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Campos que o banco preenche (id, código, contadores, auditoria, datas). */
type TaskGerados =
  | 'id' | 'project_id' | 'codigo' | 'tipo' | 'origem' | 'prioridade' | 'ordem' | 'dependencias' | 'executar'
  | 'status' | 'tentativas' | 'max_tentativas' | 'executar_apos' | 'resultado' | 'pr_url' | 'commit_sha'
  | 'trava_frente' | 'trava_em' | 'iniciado_em' | 'concluido_em' | 'arquivo_md' | 'md5_md' | 'sincronizado_em'
  | 'log_id' | 'excluido' | 'excluido_em' | 'criado_por' | 'atualizado_por' | 'created_at' | 'updated_at';

export type TaskInsert = Opcionais<Task, TaskGerados>;
export type TaskUpdate = Partial<Task>;

export type AiMemoryInsert = Opcionais<AiMemory, 'id' | 'project_id' | 'tags' | 'embedding' | 'criado_por' | 'created_at' | 'updated_at'>;
export type AiMemoryUpdate = Partial<AiMemory>;

export type ProjectInsert = Opcionais<
  Project,
  'id' | 'descricao' | 'repositorio' | 'branch_padrao' | 'prefixo_codigo' | 'proximo_numero' | 'ativo' | 'excluido' | 'criado_por' | 'created_at' | 'updated_at'
>;
export type ProjectUpdate = Partial<Project>;

export type ProjectMemberInsert = Opcionais<ProjectMember, 'role' | 'created_at'>;
export type UserRoleInsert = Opcionais<UserRoleRow, 'role' | 'email' | 'nome' | 'created_at'>;

export type AgentMessageInsert = Opcionais<
  AgentMessage,
  'id' | 'task_id' | 'task_codigo' | 'destinatario' | 'tipo' | 'assunto' | 'resposta_de' | 'lido_em' | 'lido_por' | 'arquivado' | 'metadados' | 'criado_por' | 'created_at' | 'updated_at'
>;
export type ProjectRuleInsert = Opcionais<
  Omit<ProjectRule, 'md5'>,
  'id' | 'secao' | 'ordem' | 'commit_sha' | 'sincronizado_em' | 'ativo' | 'criado_por' | 'atualizado_por' | 'created_at' | 'updated_at'
>;

type Tabela<Row, Insert, Update> = { Row: Row; Insert: Insert; Update: Update; Relationships: [] };

// ----------------------------------------------------------------- Database (supabase-js)
export type Database = {
  public: {
    Tables: {
      projects: Tabela<Project, ProjectInsert, ProjectUpdate>;
      project_members: Tabela<ProjectMember, ProjectMemberInsert, Partial<ProjectMember>>;
      user_roles: Tabela<UserRoleRow, UserRoleInsert, Partial<UserRoleRow>>;
      tasks: Tabela<Task, TaskInsert, TaskUpdate>;
      agendamento_tarefa_logs: Tabela<AgendamentoLog, never, never>; // somente leitura na interface
      ai_memories: Tabela<AiMemory, AiMemoryInsert, AiMemoryUpdate>;
      agent_messages: Tabela<AgentMessage, AgentMessageInsert, Pick<Partial<AgentMessage>, 'lido_em' | 'lido_por' | 'arquivado'>>;
      project_rules: Tabela<ProjectRule, ProjectRuleInsert, Partial<Omit<ProjectRule, 'md5'>>>;
    };
    Views: { [_ in never]: never };
    Functions: {
      match_memories: {
        Args: {
          query_embedding: string;
          match_threshold?: number;
          match_count?: number;
          filter_tags?: string[] | null;
          p_projeto?: string | null;
          p_incluir_globais?: boolean;
        };
        Returns: MemoryMatch[];
      };
      liberar_trava_task: {
        Args: { p_task_id: number; p_forcar?: boolean; p_lock_minutos?: number };
        Returns: Task;
      };
      tem_acesso_projeto: { Args: { p_project_id: number; p_min_role?: ProjectRole }; Returns: boolean };
      eh_administrador: { Args: { p_user_id?: string }; Returns: boolean };
      ler_recados: {
        Args: {
          p_projeto: string;
          p_agente: string;
          p_somente_nao_lidos?: boolean;
          p_marcar_lidos?: boolean;
          p_desde?: string | null;
          p_limite?: number;
        };
        Returns: AgentMessage[];
      };
      conferir_regras: {
        Args: { p_projeto: string; p_secoes: Json };
        Returns: { arquivo: string; secao: string; situacao: 'igual' | 'diverge' | 'so_local' | 'so_banco'; md5_local: string | null; md5_banco: string | null }[];
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
