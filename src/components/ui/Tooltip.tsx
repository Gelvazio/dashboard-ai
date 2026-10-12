import { useCallback, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * Tooltip leve: aparece ao passar o mouse ou focar com o teclado. Renderizado em
 * portal com posição fixa, para não ser cortado por tabelas com rolagem.
 */
export function Tooltip({ conteudo, children, className }: { conteudo: ReactNode; children: ReactNode; className?: string }) {
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number; acima: boolean } | null>(null);

  const mostrar = useCallback(() => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const acima = r.top > 80;
    setPos({ x: Math.min(Math.max(r.left + r.width / 2, 130), window.innerWidth - 130), y: acima ? r.top - 6 : r.bottom + 6, acima });
  }, []);
  const esconder = useCallback(() => setPos(null), []);

  if (conteudo == null || conteudo === '') return <>{children}</>;
  return (
    <span
      ref={ref}
      className={className ?? 'inline-flex'}
      onMouseEnter={mostrar}
      onMouseLeave={esconder}
      onFocus={mostrar}
      onBlur={esconder}
      aria-describedby={pos ? id : undefined}
    >
      {children}
      {pos &&
        createPortal(
          <span
            id={id}
            role="tooltip"
            style={{ left: pos.x, top: pos.y }}
            className={`pointer-events-none fixed z-50 max-w-60 -translate-x-1/2 whitespace-pre-line rounded-md bg-slate-900 px-2.5 py-1.5 text-xs leading-snug text-white shadow-lg dark:bg-slate-700 ${pos.acima ? '-translate-y-full' : ''}`}
          >
            {conteudo}
          </span>,
          document.body,
        )}
    </span>
  );
}
