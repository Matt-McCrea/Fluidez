/* ============================================================================
 * VOCAB / CURATED — the hand-written word files under tools/vocab/curated/.
 *
 * One entry per line, tab-separated:
 *   lemma <TAB> pos <TAB> English gloss <TAB> options
 * pos: n:m n:f n:mf (noun + gender), v, adj, adv, num, prep, conj, pron, det,
 *      interj, x.  Options, space-separated key=value: pen=<Peninsular form>
 *      (comma-separated, underscores for spaces), forms=<extra surface forms>,
 *      sense=<sense key> (the id becomes l:<lemma>#<sense>), theme=<theme>,
 *      drop (never a lexeme: junk, a name, a Peninsular-only word),
 *      es=<display form> (underscores for spaces), band=<A1..C1> (floor).
 * Lines starting with # are comments.
 * ========================================================================== */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = join(dirname(fileURLToPath(import.meta.url)), 'curated');

export interface Curated {
  lemma: string; pos: string; gender?: 'm' | 'f' | 'mf'; en: string;
  pen?: string; forms?: string[]; sense?: string; theme?: string; drop?: boolean; es?: string; band?: string; file: string;
}

export function loadCurated(files?: string[]): Curated[] {
  const out: Curated[] = [];
  const names = (files ?? readdirSync(DIR).filter((f) => f.endsWith('.tsv')).sort());
  for (const f of names) {
    for (const raw of readFileSync(join(DIR, f), 'utf8').split('\n')) {
      const line = raw.replace(/\s+$/, '');
      if (!line || line.startsWith('#')) continue;
      const [lemma, posRaw = 'x', en = '', opts = ''] = line.split('\t');
      const o: Record<string, string> = {};
      for (const kv of opts.split(/\s+/).filter(Boolean)) { const i = kv.indexOf('='); if (i < 0) o[kv] = '1'; else o[kv.slice(0, i)] = kv.slice(i + 1); }
      const [pos, g] = posRaw.split(':');
      out.push({
        lemma: lemma.trim(), pos: pos === 'n' ? 'noun' : pos, gender: g as Curated['gender'], en: en.trim(),
        pen: o.pen?.replace(/_/g, ' ').replace(/,/g, ', '), forms: o.forms?.split(','), sense: o.sense, theme: o.theme,
        drop: !!o.drop, es: o.es?.replace(/_/g, ' '), band: o.band, file: f,
      });
    }
  }
  return out;
}
