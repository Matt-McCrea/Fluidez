/* ============================================================================
 * ACCEPT PATTERNS. An author writes one line instead of many:
 *
 *   "(Yo) quiero (un) café"      round brackets: optional
 *   "Voy [al|a el] mercado"      square brackets with pipes: alternatives
 *   "(Yo) [quiero|deseo] (un) café"   and they nest: "[a (la)|al]"
 *
 * expandAccept turns a pattern into the list of strings it accepts, with
 * spaces tidied. Expansion is capped at MAX_EXPANSION strings (the first ones
 * in reading order: optional text present before absent, first alternative
 * first). A pattern with no brackets expands to itself, so plain strings
 * pass through untouched.
 * ========================================================================== */

export const MAX_EXPANSION = 64;

type Node = string | { opt: Node[][] } | { alt: Node[][] };

function parse(src: string): Node[] {
  let i = 0;
  // a sequence runs to the closing bracket that belongs to its parent
  const seq = (close: string | null): Node[][] => {
    const branches: Node[][] = [[]];
    let text = '';
    const flush = () => { if (text) { branches[branches.length - 1].push(text); text = ''; } };
    while (i < src.length) {
      const c = src[i];
      if (c === ')' || c === ']') {
        if (c !== close) throw new Error(`unbalanced "${c}" in accept pattern: ${src}`);
        flush();
        i++;
        return branches;
      }
      if (c === '(') {
        i++; flush();
        branches[branches.length - 1].push({ opt: seq(')') });
      } else if (c === '[') {
        i++; flush();
        branches[branches.length - 1].push({ alt: seq(']') });
      } else if (c === '|' && close === ']') {
        flush(); i++;
        branches.push([]);
      } else { text += c; i++; }
    }
    if (close) throw new Error(`unclosed "${close === ')' ? '(' : '['}" in accept pattern: ${src}`);
    flush();
    return branches;
  };
  const out = seq(null);
  return out[0];
}

const cap = (xs: string[]): string[] => (xs.length > MAX_EXPANSION ? xs.slice(0, MAX_EXPANSION) : xs);

function product(nodes: Node[]): string[] {
  let acc: string[] = [''];
  for (const n of nodes) {
    const opts = options(n);
    const next: string[] = [];
    outer: for (const a of acc) for (const o of opts) {
      next.push(a + o);
      if (next.length >= MAX_EXPANSION * 4) break outer;
    }
    acc = next;
  }
  return acc;
}

function options(n: Node): string[] {
  if (typeof n === 'string') return [n];
  if ('opt' in n) {
    // contents of round brackets are a plain sequence; present first, then absent
    return cap([...product(n.opt[0]), '']);
  }
  const all: string[] = [];
  for (const branch of n.alt) all.push(...cap(product(branch)));
  return cap(all);
}

const tidy = (s: string): string =>
  s.replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();

/** Every string an authored accept pattern stands for (deduplicated, at most 64). Throws on unbalanced brackets. */
export function expandAccept(pattern: string): string[] {
  if (!/[()[\]]/.test(pattern)) return [tidy(pattern)];
  const seen = new Set<string>();
  for (const s of product(parse(pattern))) {
    const t = tidy(s);
    if (t) seen.add(t);
    if (seen.size >= MAX_EXPANSION) break;
  }
  return [...seen];
}

/** Expand every entry of an `accept` list; a malformed pattern is kept as written rather than crashing a lesson. */
export function expandAcceptList(accept: readonly string[] | undefined): string[] | undefined {
  if (!accept) return accept as undefined;
  const out = new Set<string>();
  for (const a of accept) {
    let xs: string[];
    try { xs = expandAccept(a); } catch { xs = [a]; }
    for (const x of xs) out.add(x);
  }
  return [...out];
}
