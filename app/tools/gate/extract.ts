// Which strings in a content file are Spanish, and what each one is for.
import { basename, dirname } from 'node:path';

export type Kind = 'graph' | 'unit' | 'bank' | 'script' | 'story' | 'scene' | 'writing' | 'vocab' | 'other';

export interface EsString {
  /** JSON path inside the file, e.g. [3].es or turns[2].accept[0] */
  path: string;
  text: string;
  /** A typed answer the learner must be able to produce exactly. */
  answer: boolean;
  /** Text the learner is shown or asked to produce: linted for accents and dialect. */
  lint: boolean;
  /** Intentionally wrong Spanish (pitfall "wrong"): never linted. */
  wrong?: boolean;
  /** Counts toward near-duplicate detection. */
  dedupe: boolean;
  /** Unit this string belongs to, when known. */
  unit?: string;
}

export function kindOf(file: string): Kind {
  const dir = basename(dirname(file));
  const name = basename(file);
  if (name.startsWith('_')) return 'other';
  switch (dir) {
    case 'graph': return 'graph';
    case 'units': return /^u\d{2}\.json$/.test(name) ? 'unit' : 'other';
    case 'bank': return 'bank';
    case 'scripts': return 'script';
    case 'story': return /^ch\d{3}\.json$/.test(name) ? 'story' : 'other';
    case 'scenes': return 'scene';
    case 'writing': return 'writing';
    case 'vocab': return 'vocab';
    default: return 'other';
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function extractSpanish(file: string, data: any, kind: Kind = kindOf(file)): EsString[] {
  const out: EsString[] = [];
  const add = (path: string, text: unknown, o: Partial<EsString> = {}) => {
    if (typeof text !== 'string' || !text.trim()) return;
    out.push({ path, text, answer: false, lint: true, dedupe: false, ...o });
  };
  const arr = (x: unknown): any[] => (Array.isArray(x) ? x : []);
  switch (kind) {
    case 'bank':
      arr(data).forEach((b, i) => {
        add(`[${i}].es`, b?.es, { dedupe: true, answer: true, unit: b?.unit });
        arr(b?.accept).forEach((a, k) => add(`[${i}].accept[${k}]`, a, { answer: true, unit: b?.unit }));
      });
      break;
    case 'script': {
      const d = data ?? {};
      add('hook.es', d.hook?.es);
      arr(d.examples).forEach((e, i) => add(`examples[${i}].es`, e?.es));
      arr(d.readAndPick).forEach((e, i) => add(`readAndPick[${i}].es`, e?.es));
      arr(d.yourTurn).forEach((e, i) => {
        add(`yourTurn[${i}].answer`, e?.answer, { answer: true });
        arr(e?.accept).forEach((a, k) => add(`yourTurn[${i}].accept[${k}]`, a, { answer: true }));
      });
      arr(d.pitfalls).forEach((e, i) => {
        add(`pitfalls[${i}].right`, e?.right);
        add(`pitfalls[${i}].wrong`, e?.wrong, { lint: false, wrong: true });
      });
      break;
    }
    case 'story': {
      const d = data ?? {};
      add('text', d.text, { dedupe: true, unit: d.unit });
      arr(d.gloss).forEach((g, i) => add(`gloss[${i}].es`, g?.es, { unit: d.unit }));
      break;
    }
    case 'scene': {
      const d = data ?? {};
      arr(d.turns).forEach((t, i) => {
        add(`turns[${i}].npc`, t?.npc, { dedupe: true, unit: d.unit });
        arr(t?.accept).forEach((a, k) => add(`turns[${i}].accept[${k}]`, a, { answer: true, unit: d.unit }));
      });
      break;
    }
    case 'writing':
      arr(data).forEach((w, i) => add(`[${i}].model`, w?.model, { unit: w?.unit }));
      break;
    case 'graph':
      arr(data).forEach((n, i) => {
        if (n?.kind === 'chunk') add(`[${i}].es`, n?.es);
        // every aligned form is Spanish a learner is shown: linted like a chunk's es
        if (n?.kind !== 'lexeme') arr(n?.forms).forEach((f, k) => add(`[${i}].forms[${k}].es`, f?.es));
      });
      break;
    default:
      break;
  }
  return out;
}
