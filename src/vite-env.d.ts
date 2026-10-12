/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL do projeto Supabase (ex.: https://xxxx.supabase.co). */
  readonly VITE_SUPABASE_URL?: string;
  /** Chave pública anon (a RLS do banco decide o acesso). Nunca a service_role. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
