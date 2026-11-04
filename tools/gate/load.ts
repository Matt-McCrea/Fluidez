// Loads the old app's window-global data files into a vm sandbox, and walks every learner-facing string.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const FILES = ['data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/connectors.js', 'data/passages.js', 'data/apply.js', 'data/writing.js', 'data/topics.js', 'data/strand-lessons.js'];

export interface Data {
  PASSAGES: any[]; APPLY_ITEMS: any[]; WRITING_TASKS: any[]; STRAND_LESSONS: any[]; TOPICS: any[];
  VOCAB: any[]; IDIOMS: any[]; CONNECTORS: any[];
  /** Teaching scripts, one entry per window.SCRIPTS_<BAND> found in data/scripts/*.js. */
  SCRIPTS?: ScriptFile[];
}

export interface ScriptFile { file: string; scripts: Record<string, any> }

/** data/scripts/*.js are sidecar band files the learn view injects on demand; each sets window.SCRIPTS_<BAND>. */
export function loadScripts(root = ROOT): ScriptFile[] {
  const dir = root + 'data/scripts/', out: ScriptFile[] = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir).filter((n) => n.endsWith('.js')).sort()) {
    const sctx: { window: Record<string, any> } = { window: {} };
    vm.createContext(sctx);
    vm.runInContext(readFileSync(dir + name, 'utf8'), sctx, { filename: 'data/scripts/' + name });
    for (const [k, v] of Object.entries(sctx.window)) if (/^SCRIPTS_/.test(k) && v && typeof v === 'object') out.push({ file: 'data/scripts/' + name, scripts: v });
  }
  return out;
}

export function loadData(root = ROOT): Data {
  const ctx: { window: Record<string, any> } = { window: {} };
  vm.createContext(ctx);
  for (const f of FILES) {
    try { vm.runInContext(readFileSync(root + f, 'utf8'), ctx, { filename: f }); }
    catch (e) { if (f !== 'data/connectors.js') throw e; }
  }
  const w = ctx.window;
  return {
    PASSAGES: w.PASSAGES ?? [], APPLY_ITEMS: w.APPLY_ITEMS ?? [], WRITING_TASKS: w.WRITING_TASKS ?? [], STRAND_LESSONS: w.STRAND_LESSONS ?? [],
    TOPICS: w.TOPICS ?? [], VOCAB: w.VOCAB ?? [], IDIOMS: w.IDIOMS ?? [], CONNECTORS: w.CONNECTORS ?? [],
    SCRIPTS: loadScripts(root),
  };
}

/** Spanish known to be correct, for the accent lexicon: PCIC patterns and examples when spec/pcic.json is present. */
export function pcicTexts(root = ROOT): string[] {
  const p = root + 'spec/pcic.json';
  if (!existsSync(p)) return [];
  try {
    const out: string[] = [];
    for (const i of JSON.parse(readFileSync(p, 'utf8'))) { out.push(String(i.pattern ?? '')); for (const e of i.examples ?? []) out.push(String(e)); }
    return out;
  } catch { return []; }
}

export const stripTags = (h: string) => String(h).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
const italics = (h: string): string[] => [...String(h).matchAll(/<i>([^<]+)<\/i>/g)].map((m) => m[1]);
/** Spanish inside a script's English prose is marked *like this*. */
const starred = (h: string): string[] => [...String(h).matchAll(/\*([^*\n]+)\*/g)].map((m) => m[1]);

export interface Str {
  file: string;
  path: string;
  text: string;
  /** Spanish the learner reads or types: linted for accents and dialect. */
  lint: boolean;
  /** Only the dialect lint (accent lexicon is built from this field). */
  noAccent?: boolean;
}

/** Streams every learner-facing string. Tags are stripped; Spanish in lesson prose is taken from <i> spans. */
export function* strings(d: Data): Generator<Str> {
  const S = (file: string, path: string, v: unknown, lint = false, noAccent = false): Str | null =>
    typeof v === 'string' && v.trim() ? { file, path, text: stripTags(v), lint, noAccent } : null;
  const arr = (x: unknown): any[] => (Array.isArray(x) ? x : []);

  let f = 'data/passages.js';
  for (const p of d.PASSAGES) {
    const id = p.id;
    for (const s of [S(f, `${id}.title`, p.title, true), S(f, `${id}.text`, p.text, true)]) if (s) yield s;
    for (const [i, g] of arr(p.gloss).entries()) { const a = S(f, `${id}.gloss[${i}].es`, g?.es, true), b = S(f, `${id}.gloss[${i}].en`, g?.en); if (a) { yield a; } if (b) yield b; }
    for (const [i, q] of arr(p.questions).entries()) {
      const base = `${id}.questions[${i}]`;
      for (const s of [S(f, `${base}.q`, q.q, true), S(f, `${base}.line`, q.line, true), S(f, `${base}.model`, q.model)]) if (s) yield s;
      for (const [k, o] of arr(q.options).entries()) { const s = S(f, `${base}.options[${k}]`, o, true); if (s) { s.noAccent = false; yield s; } }
      for (const [k, o] of arr(q.accept).entries()) { const s = S(f, `${base}.accept[${k}]`, o, false); if (s) yield s; }
    }
  }
  f = 'data/apply.js';
  for (const [i, a] of d.APPLY_ITEMS.entries()) {
    const id = `apply[${i}]`;
    for (const s of [S(f, `${id}.text`, a.text, true), S(f, `${id}.from`, a.from, true), S(f, `${id}.to`, a.to, true), S(f, `${id}.instruction`, a.instruction), S(f, `${id}.en`, a.en), S(f, `${id}.why`, a.why)]) if (s) yield s;
    for (const [k, o] of arr(a.options).entries()) { const s = S(f, `${id}.options[${k}]`, o, true); if (s) yield s; }
  }
  f = 'data/writing.js';
  for (const t of d.WRITING_TASKS) {
    for (const k of ['prompt', 'hint', 'brief']) { const s = S(f, `${t.id}.${k}`, t[k]); if (s) yield s; }
    for (const [i, m] of arr(t.models).entries()) { const s = S(f, `${t.id}.models[${i}]`, m, true); if (s) yield s; }
    for (const [i, m] of arr(t.plan).entries()) { const s = S(f, `${t.id}.plan[${i}]`, m); if (s) yield s; }
  }
  f = 'data/topics.js';
  for (const t of d.TOPICS) {
    const ts = S(f, `${t.id}.topic`, t.topic); if (ts) yield ts;
    for (const [j, p] of arr(t.prompts).entries()) {
      for (const k of ['prompt', 'hint']) { const s = S(f, `${t.id}.prompts[${j}].${k}`, p[k]); if (s) yield s; }
      for (const [i, m] of arr(p.models).entries()) { const s = S(f, `${t.id}.prompts[${j}].models[${i}]`, m, true); if (s) yield s; }
    }
  }
  f = 'data/vocab.js';
  for (const [i, v] of d.VOCAB.entries()) { if (v.variety) continue; const a = S(f, `vocab[${i}].es`, v.es, true, true), b = S(f, `vocab[${i}].en`, v.en); if (a) yield a; if (b) yield b; }
  f = 'data/idioms.js';
  for (const [i, v] of d.IDIOMS.entries()) { const a = S(f, `idioms[${i}].es`, v.es, true, true), b = S(f, `idioms[${i}].en`, v.en), c = S(f, `idioms[${i}].lit`, v.lit); if (a) yield a; if (b) yield b; if (c) yield c; }
  f = 'data/strand-lessons.js';
  for (const l of d.STRAND_LESSONS) {
    const id = l.id;
    for (const s of [S(f, `${id}.title`, l.title), S(f, `${id}.canDo`, l.canDo), S(f, `${id}.summary`, l.summary)]) if (s) yield s;
    for (const k of ['moment', 'examples', 'exponents', 'contrasts', 'keywords'] as const) {
      for (const [i, e] of arr(l[k]).entries()) {
        const a = S(f, `${id}.${k}[${i}].es`, e?.es, k !== 'contrasts' && k !== 'keywords', k === 'keywords');
        const b = S(f, `${id}.${k}[${i}].en`, e?.en), c = S(f, `${id}.${k}[${i}].note`, e?.note);
        if (a) yield a; if (b) yield b; if (c) yield c;
      }
    }
    for (const [i, s] of arr(l.sections).entries()) {
      const h = S(f, `${id}.sections[${i}].h`, s?.h), b = S(f, `${id}.sections[${i}].html`, s?.html);
      if (h) yield h;
      if (b) yield b;
      for (const [k, t] of italics(s?.html ?? '').entries()) { const it = S(f, `${id}.sections[${i}].html.i[${k}]`, t, true); if (it) yield it; }
    }
    for (const [i, p] of arr(l.pitfalls).entries()) { const s = S(f, `${id}.pitfalls[${i}]`, typeof p === 'string' ? p : p?.html ?? p?.text, false); if (s) yield s; }
    if (l.model?.text) { const s = S(f, `${id}.model.text`, l.model.text, true); if (s) yield s; }
    for (const [i, p] of arr(l.probes).entries()) {
      const base = `${id}.probes[${i}]`;
      for (const s of [S(f, `${base}.q`, p.q), S(f, `${base}.front`, p.front), S(f, `${base}.back`, p.back), S(f, `${base}.text`, p.text, p.kind === 'cloze')]) if (s) yield s;
      for (const [k, o] of arr(p.options).entries()) { const s = S(f, `${base}.options[${k}]`, o); if (s) yield s; }
      for (const [k, o] of arr(p.accept).entries()) { const s = S(f, `${base}.accept[${k}]`, o); if (s) yield s; }
    }
  }
  // teaching scripts: Spanish fields are linted; English prose is dash-checked and its *starred* Spanish linted.
  // Pitfalls quote the slip they warn about, so (as with lesson pitfalls) they are dash-checked only.
  for (const sf of d.SCRIPTS ?? []) {
    f = sf.file;
    for (const [id, s] of Object.entries(sf.scripts)) {
      const out: Str[] = [];
      const es = (p: string, v: unknown) => { const x = S(f, `${id}.${p}`, v, true); if (x) out.push(x); };
      const en = (p: string, v: unknown, stars = true) => {
        const x = S(f, `${id}.${p}`, v); if (x) out.push(x);
        if (stars) for (const [k, t] of starred(String(v ?? '')).entries()) { const y = S(f, `${id}.${p}.star[${k}]`, t, true); if (y) out.push(y); }
      };
      en('hook.line', s.hook?.line); es('hook.es', s.hook?.es); en('hook.en', s.hook?.en);
      for (const [i, e] of arr(s.examples).entries()) { es(`examples[${i}].es`, e?.es); en(`examples[${i}].en`, e?.en); }
      en('rule', s.rule);
      for (const [i, r] of arr(s.readAndPick).entries()) {
        en(`readAndPick[${i}].q`, r?.q); es(`readAndPick[${i}].es`, r?.es); en(`readAndPick[${i}].why`, r?.why);
        for (const [k, o] of arr(r?.options).entries()) es(`readAndPick[${i}].options[${k}]`, o);
      }
      for (const [i, y] of arr(s.yourTurn).entries()) {
        en(`yourTurn[${i}].en`, y?.en); es(`yourTurn[${i}].es`, y?.es);
        for (const [k, a] of arr(y?.accept).entries()) en(`yourTurn[${i}].accept[${k}]`, a, false);
      }
      en('personal.prompt', s.personal?.prompt); es('personal.model', s.personal?.model);
      for (const [k, c] of arr(s.personal?.constraints).entries()) en(`personal.constraints[${k}].label`, c?.label);
      for (const [i, p] of arr(s.pitfalls).entries()) en(`pitfalls[${i}]`, p, false);
      yield* out;
    }
  }
}
