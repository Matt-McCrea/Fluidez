// Loads the OLD vanilla-JS engine (and optionally checker + data) into a fake
// window with node:vm, so the TypeScript port can be diffed against it.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const OLD_ROOT = fileURLToPath(new URL('../../../', import.meta.url));

export interface LegacyVerb { inf: string; en: string; type: string; [k: string]: unknown }
export interface LegacyAnalysis {
  inf: string; tense: string; person: string; form: string; type: string; accentExact: boolean; clitics?: string[];
}
export interface LegacyEngine {
  TENSES: Array<{ key: string; label: string; group: string }>;
  TENSE_LABEL: Record<string, string>;
  conjugate(v: LegacyVerb, tense: string): string[];
  participle(v: LegacyVerb): string;
  gerund(v: LegacyVerb): string;
  verbByInf(inf: string): LegacyVerb | null;
  analyzeToken(t: string): LegacyAnalysis[];
  analyzeSentence(t: string): {
    tokens: string[];
    verbs: Array<{ token: string; index: number; analyses: LegacyAnalysis[] }>;
    compounds: Array<{ haber: string; participle: string; parts: Array<{ inf: string; tense: string }> }>;
  };
  isIrregularIn(v: LegacyVerb, t: string): boolean;
  enPhrase(v: LegacyVerb, t: string, i: number): { text: string; marker: string | null };
  normalize(s: string): string;
}
export interface LegacyCheckResult { label: string; pass: boolean; detail: string }
export interface LegacyChecker {
  checkWriting(task: { constraints: unknown[] }, text: string): { results: LegacyCheckResult[]; allPass: boolean };
  checkExact(input: string, accepted: string | string[], opts?: unknown): { pass: boolean; near: boolean };
  meaningAlternatives(g: string): string[];
  answerForms(b: string): string[];
}
export interface LegacyWindow {
  VERBS: LegacyVerb[];
  ENGINE: LegacyEngine;
  Checker?: LegacyChecker;
  WRITING_TASKS?: Array<{ id: string; constraints: Array<Record<string, unknown>>; models?: string[] }>;
  CONNECTORS?: unknown[];
  VOCAB?: Array<{ es: string; en: string }>;
  LexMatch?: { index(t: string): { has(es: string): boolean }; countIn(t: string, w: unknown[]): number };
}

const cache = new Map<string, LegacyWindow>();

/** files: paths relative to the old repo root, loaded in order. */
export function loadLegacy(files: string[]): LegacyWindow {
  const key = files.join('|');
  const hit = cache.get(key);
  if (hit) return hit;
  const ctx: { window: Partial<LegacyWindow> } = { window: {} };
  vm.createContext(ctx);
  for (const f of files) vm.runInContext(readFileSync(OLD_ROOT + f, 'utf8'), ctx, { filename: f });
  const w = ctx.window as LegacyWindow;
  cache.set(key, w);
  return w;
}

export const legacyEngine = () => loadLegacy(['data/verbs.js', 'js/engine.js']);
