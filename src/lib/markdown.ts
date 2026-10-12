/**
 * Markdown mínimo e seguro para exibir instruções e relatórios das tasks.
 * Gera uma árvore de blocos (sem HTML cru) que o componente <Markdown> renderiza
 * como elementos React — nada de dangerouslySetInnerHTML, então não há XSS.
 * Suporta: títulos (#..###), parágrafos, listas (-, *, 1.), citações (>),
 * blocos de código (```), linha horizontal (---), e inline: `código`, **negrito**,
 * *itálico*, [link](https://...) e URLs soltas.
 */

export type Inline =
  | { t: 'texto'; v: string }
  | { t: 'codigo'; v: string }
  | { t: 'negrito'; v: Inline[] }
  | { t: 'italico'; v: Inline[] }
  | { t: 'link'; href: string; v: Inline[] };

export type Bloco =
  | { t: 'titulo'; nivel: 1 | 2 | 3; v: Inline[] }
  | { t: 'paragrafo'; v: Inline[] }
  | { t: 'lista'; ordenada: boolean; itens: Inline[][] }
  | { t: 'citacao'; v: Inline[] }
  | { t: 'codigo'; lang: string; v: string }
  | { t: 'linha' };

/** Só links http(s) e mailto viram <a>; o resto fica como texto. */
export function hrefSeguro(href: string): string | null {
  const h = href.trim();
  return /^(https?:\/\/|mailto:)/i.test(h) ? h : null;
}

const PADRAO_INLINE =
  /(`[^`\n]+`)|(\*\*[^*\n]+?\*\*)|(\*[^*\n]+?\*|_[^_\n]+?_)|(\[[^\]\n]+\]\([^)\s]+\))|(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])/;

export function parseInline(texto: string): Inline[] {
  const out: Inline[] = [];
  let resto = texto;
  while (resto) {
    const m = PADRAO_INLINE.exec(resto);
    if (!m) {
      out.push({ t: 'texto', v: resto });
      break;
    }
    if (m.index > 0) out.push({ t: 'texto', v: resto.slice(0, m.index) });
    const s = m[0];
    if (m[1]) out.push({ t: 'codigo', v: s.slice(1, -1) });
    else if (m[2]) out.push({ t: 'negrito', v: parseInline(s.slice(2, -2)) });
    else if (m[3]) out.push({ t: 'italico', v: parseInline(s.slice(1, -1)) });
    else if (m[4]) {
      const [, rotulo, href] = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(s)!;
      const seguro = hrefSeguro(href);
      if (seguro) out.push({ t: 'link', href: seguro, v: parseInline(rotulo) });
      else out.push({ t: 'texto', v: rotulo });
    } else out.push({ t: 'link', href: s, v: [{ t: 'texto', v: s }] });
    resto = resto.slice(m.index + s.length);
  }
  // junta textos vizinhos
  return out.reduce<Inline[]>((acc, i) => {
    const ult = acc[acc.length - 1];
    if (i.t === 'texto' && ult?.t === 'texto') ult.v += i.v;
    else acc.push(i);
    return acc;
  }, []);
}

export function parseMarkdown(md: string): Bloco[] {
  const linhas = md.replace(/\r\n?/g, '\n').split('\n');
  const blocos: Bloco[] = [];
  let i = 0;
  const item = /^\s*(?:([-*+])|(\d+)[.)])\s+(.*)$/;
  while (i < linhas.length) {
    const l = linhas[i];
    if (!l.trim()) {
      i++;
      continue;
    }
    const cerca = /^\s*```\s*([\w+-]*)\s*$/.exec(l);
    if (cerca) {
      const corpo: string[] = [];
      i++;
      while (i < linhas.length && !/^\s*```\s*$/.test(linhas[i])) corpo.push(linhas[i++]);
      i++; // fecha a cerca (ou fim do texto)
      blocos.push({ t: 'codigo', lang: cerca[1], v: corpo.join('\n') });
      continue;
    }
    const tit = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(l);
    if (tit) {
      blocos.push({ t: 'titulo', nivel: Math.min(3, tit[1].length) as 1 | 2 | 3, v: parseInline(tit[2]) });
      i++;
      continue;
    }
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(l)) {
      blocos.push({ t: 'linha' });
      i++;
      continue;
    }
    if (/^\s*>/.test(l)) {
      const partes: string[] = [];
      while (i < linhas.length && /^\s*>/.test(linhas[i])) partes.push(linhas[i++].replace(/^\s*>\s?/, ''));
      blocos.push({ t: 'citacao', v: parseInline(partes.join(' ')) });
      continue;
    }
    const mi = item.exec(l);
    if (mi) {
      const ordenada = Boolean(mi[2]);
      const itens: Inline[][] = [];
      while (i < linhas.length) {
        const m = item.exec(linhas[i]);
        if (m && Boolean(m[2]) === ordenada) {
          itens.push(parseInline(m[3]));
          i++;
        } else if (linhas[i].trim() && /^\s{2,}/.test(linhas[i]) && itens.length) {
          itens[itens.length - 1].push({ t: 'texto', v: ' ' }, ...parseInline(linhas[i].trim()));
          i++;
        } else break;
      }
      blocos.push({ t: 'lista', ordenada, itens });
      continue;
    }
    const partes: string[] = [];
    while (i < linhas.length && linhas[i].trim() && !/^\s*(```|#{1,6}\s|>)/.test(linhas[i]) && !item.test(linhas[i]))
      partes.push(linhas[i++].trim());
    blocos.push({ t: 'paragrafo', v: parseInline(partes.join('\n')) });
  }
  return blocos;
}
