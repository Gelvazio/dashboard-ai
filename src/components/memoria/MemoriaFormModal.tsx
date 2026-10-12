/**
 * Modal de nova memória canônica (SUB-20.6).
 *
 * Título, conteúdo em Markdown (`MarkdownEditor`), tags (`TagInput` +
 * `TagSugestoes` alimentado por `sugerirTags`) e opção "Memória global".
 * Valida com `validarMemoria` e salva com `useSalvarMemoria` (embedding pelo
 * `/api/embedding`); o erro do banco/RLS (ex.: global sem ser administrador)
 * aparece dentro do modal.
 */
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sugerirTags, validarMemoria, MAX_TITULO_MEMORIA, type ErrosMemoria } from '@/lib/memoriaForm';
import { useSalvarMemoria } from '@/hooks/useSalvarMemoria';
import type { Memoria } from '@/services/memoryService';
import type { Project } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Botao } from '@/components/ui/Botao';
import { MarkdownEditor } from '@/components/ui/MarkdownEditor';
import { TagInput } from '@/components/ui/TagInput';
import { TagSugestoes } from '@/components/ui/TagSugestoes';

interface Props {
  aberto: boolean;
  projeto: Project;
  onFechar: () => void;
  onSalvo: (memoria: Memoria) => void;
}

const CAMPO =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-950';
const ERRO = 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/30 dark:border-rose-500/60';

export function MemoriaFormModal({ aberto, projeto, onFechar, onSalvo }: Props) {
  const { salvar, salvando, erro: falha, limparErro } = useSalvarMemoria();
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [global, setGlobal] = useState(false);
  const [erros, setErros] = useState<ErrosMemoria>({});

  useEffect(() => {
    if (aberto) {
      setTitulo('');
      setConteudo('');
      setTags([]);
      setGlobal(false);
      setErros({});
      limparErro();
    }
  }, [aberto, limparErro]);

  const sugestoes = useMemo(() => sugerirTags(titulo, conteudo, 8), [titulo, conteudo]);

  const limpar = (k: keyof ErrosMemoria) => erros[k] && setErros((e) => ({ ...e, [k]: undefined }));

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const encontrados = validarMemoria({ titulo, conteudo, tags });
    setErros(encontrados);
    if (Object.keys(encontrados).length) {
      document.getElementById(`memoria-${Object.keys(encontrados)[0]}`)?.focus();
      return;
    }
    const salva = await salvar(global ? null : projeto.id, { title: titulo, content: conteudo, tags });
    if (salva) {
      onSalvo(salva);
      onFechar();
    }
  }

  return (
    <Modal
      aberto={aberto}
      onFechar={salvando ? () => {} : onFechar}
      titulo="Nova memória"
      descricao={
        global ? (
          <>Memória <strong>global</strong> · visível em todos os projetos (só administradores)</>
        ) : (
          <>Projeto <strong>{projeto.nome}</strong> · mesmo título atualiza a memória existente</>
        )
      }
      rodape={
        <>
          <Botao onClick={onFechar} disabled={salvando}>Cancelar</Botao>
          <Botao variante="primario" type="submit" form="form-memoria" carregando={salvando}>
            Salvar memória
          </Botao>
        </>
      }
    >
      <form id="form-memoria" onSubmit={enviar} noValidate className="flex flex-col gap-4">
        {falha && (
          <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            {falha}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="memoria-titulo" className="text-sm font-medium text-slate-700 dark:text-slate-300">Título *</label>
          <input
            id="memoria-titulo"
            data-autofocus
            className={cn(CAMPO, erros.titulo && ERRO)}
            value={titulo}
            maxLength={MAX_TITULO_MEMORIA}
            aria-invalid={Boolean(erros.titulo)}
            aria-describedby={erros.titulo ? 'memoria-titulo-erro' : undefined}
            onChange={(e) => { setTitulo(e.target.value); limpar('titulo'); }}
            placeholder="Ex.: Decisão: busca vetorial com pgvector + HNSW"
          />
          {erros.titulo && <p id="memoria-titulo-erro" className="text-xs text-rose-600 dark:text-rose-400">{erros.titulo}</p>}
        </div>

        <div id="memoria-conteudo" tabIndex={-1} className="outline-none">
          <MarkdownEditor
            rotulo="Conteúdo *"
            valor={conteudo}
            onChange={(v) => { setConteudo(v); limpar('conteudo'); }}
            erro={erros.conteudo}
          />
        </div>

        <div id="memoria-tags" tabIndex={-1} className="flex flex-col gap-2 outline-none">
          <TagInput rotulo="Tags" valor={tags} onChange={(t) => { setTags(t); limpar('tags'); }} erro={erros.tags} />
          {sugestoes.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Sugestões a partir do título e do conteúdo:</span>
              <TagSugestoes sugestoes={sugestoes} selecionadas={tags} onEscolher={(t) => { setTags((a) => (a.includes(t) ? a : [...a, t])); limpar('tags'); }} />
            </div>
          )}
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-0.5 size-4 rounded accent-brand-600" checked={global} onChange={(e) => setGlobal(e.target.checked)} />
          <span>
            <span className="inline-flex items-center gap-1 font-medium"><Globe className="size-3.5" aria-hidden /> Memória global</span>
            <span className="block text-xs text-slate-500">Compartilhada com todos os projetos. Só administradores podem gravar; caso contrário o banco recusa e o erro aparece aqui.</span>
          </span>
        </label>
      </form>
    </Modal>
  );
}
