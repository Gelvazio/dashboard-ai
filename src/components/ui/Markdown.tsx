import { Fragment, useMemo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { parseMarkdown, type Bloco, type Inline } from '@/lib/markdown';

function inline(nos: Inline[]): ReactNode {
  return nos.map((n, i) => {
    switch (n.t) {
      case 'texto':
        return <Fragment key={i}>{n.v}</Fragment>;
      case 'codigo':
        return (
          <code key={i} className="rounded bg-slate-100 px-1 py-0.5 text-[0.85em] dark:bg-slate-800">
            {n.v}
          </code>
        );
      case 'negrito':
        return (
          <strong key={i} className="font-semibold">
            {inline(n.v)}
          </strong>
        );
      case 'italico':
        return <em key={i}>{inline(n.v)}</em>;
      case 'link':
        return (
          <a
            key={i}
            href={n.href}
            target="_blank"
            rel="noreferrer noopener"
            className="break-all text-brand-600 underline underline-offset-2 hover:text-brand-800 dark:text-brand-400"
          >
            {inline(n.v)}
          </a>
        );
    }
  });
}

function bloco(b: Bloco, i: number): ReactNode {
  switch (b.t) {
    case 'titulo': {
      const cls = [
        'mt-4 text-lg font-semibold first:mt-0',
        'mt-4 text-base font-semibold first:mt-0',
        'mt-3 text-sm font-semibold uppercase tracking-wide text-slate-600 first:mt-0 dark:text-slate-300',
      ][b.nivel - 1];
      const Tag = (['h3', 'h4', 'h5'] as const)[b.nivel - 1];
      return (
        <Tag key={i} className={cls}>
          {inline(b.v)}
        </Tag>
      );
    }
    case 'paragrafo':
      return (
        <p key={i} className="mt-2 whitespace-pre-line first:mt-0">
          {inline(b.v)}
        </p>
      );
    case 'lista': {
      const Tag = b.ordenada ? 'ol' : 'ul';
      return (
        <Tag key={i} className={cn('mt-2 space-y-1 pl-5 first:mt-0', b.ordenada ? 'list-decimal' : 'list-disc')}>
          {b.itens.map((it, j) => (
            <li key={j}>{inline(it)}</li>
          ))}
        </Tag>
      );
    }
    case 'citacao':
      return (
        <blockquote
          key={i}
          className="mt-2 border-l-4 border-slate-300 pl-3 text-slate-600 first:mt-0 dark:border-slate-600 dark:text-slate-400"
        >
          {inline(b.v)}
        </blockquote>
      );
    case 'codigo':
      return (
        <pre
          key={i}
          className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-100 first:mt-0"
          data-lang={b.lang || undefined}
        >
          <code>{b.v}</code>
        </pre>
      );
    case 'linha':
      return <hr key={i} className="my-3 border-slate-200 dark:border-slate-700" />;
  }
}

/** Renderiza Markdown simples com segurança (sem HTML cru). */
export function Markdown({ texto, className }: { texto: string; className?: string }) {
  const blocos = useMemo(() => parseMarkdown(texto), [texto]);
  return <div className={cn('break-words text-sm leading-relaxed text-slate-800 dark:text-slate-200', className)}>{blocos.map(bloco)}</div>;
}
