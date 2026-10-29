// Learner-facing copy: no em or en dashes and no " - " anywhere in the UI's
// own strings (string literals, templates, JSX text), and content dashes are
// turned into lines or commas on their way to the screen.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { lines, undash } from '../../src/ui/components/text';

const ROOT = join(__dirname, '../../src/ui');
/** Sample lessons are content, not UI copy: they go through the same dash-free rendering. */
const SKIP = new Set(['fixtures']);

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return SKIP.has(f) ? [] : files(p);
    return /\.(ts|tsx)$/.test(f) ? [p] : [];
  });
}

/**
 * The code with comments removed, and every string-ish piece of it: quoted
 * strings, template text, and (in .tsx) JSX text between tags. A small lexer;
 * regex literals are skipped, not reported.
 */
function scan(src: string, jsx: boolean): { code: string; strings: string[] } {
  const strings: string[] = [];
  let code = '';
  let i = 0;
  let prev = '';
  const n = src.length;
  const regexOk = () => /[(,=:[!&|?{};+\-*%~^]$|^$|\breturn$|\btypeof$/.test(prev.trimEnd());
  const readQuoted = (q: string) => {
    let s = '';
    i++;
    while (i < n && src[i] !== q) {
      if (src[i] === '\\') { s += src[i] + src[i + 1]; i += 2; continue; }
      if (q === '`' && src[i] === '$' && src[i + 1] === '{') {
        strings.push(s); s = '';
        i += 2;
        let depth = 1;
        let inner = '';
        while (i < n && depth) {
          if (src[i] === '{') depth++;
          else if (src[i] === '}') { depth--; if (!depth) break; }
          inner += src[i]; i++;
        }
        const sub = scan(inner, jsx);
        strings.push(...sub.strings);
        code += sub.code;
        i++;
        continue;
      }
      s += src[i]; i++;
    }
    i++;
    strings.push(s);
    code += q + s + q;
  };
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === '/' && d === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') { i = src.indexOf('*/', i + 2); i = i < 0 ? n : i + 2; continue; }
    if (c === '"' || c === "'" || c === '`') { readQuoted(c); prev = 'x'; continue; }
    if (c === '/' && regexOk()) {
      // a regex literal: skip it (with its classes and flags)
      i++;
      let cls = false;
      while (i < n && (src[i] !== '/' || cls)) {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === '[') cls = true;
        else if (src[i] === ']') cls = false;
        i++;
      }
      i++;
      while (i < n && /[a-z]/.test(src[i])) i++;
      prev = 'x';
      continue;
    }
    if (jsx && c === '>' && /[\w"'}\/]\s*$|<\w+\s*$/.test(code.slice(-40))) {
      // text after a tag closes, up to the next tag or expression
      code += c; i++;
      let j = i;
      let t = '';
      while (j < n && src[j] !== '<' && src[j] !== '{') { t += src[j]; j++; }
      if (/\p{L}/u.test(t) && !/[;=()`'"]/.test(t)) { strings.push(t.trim()); i = j; }
      prev = '>';
      continue;
    }
    code += c;
    if (!/\s/.test(c)) prev = (prev + c).slice(-12);
    i++;
  }
  return { code, strings };
}

describe('UI copy', () => {
  // the UI, and the exercise builders whose questions reach the screen verbatim
  const all = [...files(ROOT), ...files(join(__dirname, '../../src/exercises'))];

  it('finds the UI sources', () => {
    expect(all.length).toBeGreaterThan(15);
  });

  for (const f of all) {
    const rel = f.slice(f.indexOf('/src/') + 5);
    it(`${rel}: no em/en dashes, no " - " in strings`, () => {
      const { code, strings } = scan(readFileSync(f, 'utf8'), f.endsWith('.tsx'));
      const bad = [...code.matchAll(/.{0,30}[—–].{0,30}/g)].map((m) => m[0]);
      expect(bad, `dashes in ${rel}`).toEqual([]);
      const hyphen = strings.filter((s) => /\s-\s/.test(s) && /\p{L}/u.test(s));
      expect(hyphen, `" - " in ${rel}`).toEqual([]);
    });
  }
});

describe('the copy scanner', () => {
  it('sees JSX text, strings and templates, not comments or regexes', () => {
    const r = scan('// a \u2014 comment\nconst x = <p class="a">Hi \u2014 there</p>;\nconst y = `n - ${a - b}`;\nconst z = /\u2014/;', true);
    expect(r.strings).toContain('Hi \u2014 there');
    expect(r.strings.some((s) => s.includes('n - '))).toBe(true);
    expect(r.code).not.toContain('comment');
  });
});

describe('content dashes on screen', () => {
  it('dialogue: the leading dash goes, each speaker gets a line, asides become commas', () => {
    expect(lines('—¿Te gusta el café? —Sí, me gusta.')).toEqual(['¿Te gusta el café?', 'Sí, me gusta.']);
    expect(lines('—Hola. Buenos días —dice Tomás.')).toEqual(['Hola. Buenos días, dice Tomás.']);
    expect(lines('—Es don Hernando —dice Vale—. Es de aquí.')).toEqual(['Es don Hernando, dice Vale. Es de aquí.']);
    expect(lines('Mucho gusto. — Igualmente.')).toEqual(['Mucho gusto.', 'Igualmente.']);
  });

  it('titles and ranges', () => {
    expect(undash('Hello — who I am')).toBe('Hello, who I am');
    expect(undash('numbers 0–20')).toBe('numbers 0 to 20');
    expect(undash('How are you? — Fine, and you?')).toBe('How are you? Fine, and you?');
    for (const s of ['A — b', 'x – y', 'one - two', '—Hola —dijo—.']) expect(undash(s)).not.toMatch(/[—–]|\s-\s/);
  });
});
