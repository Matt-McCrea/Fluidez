// npm run pitfalls
//
// Writes content/_pitfalls/pitfalls.json: the wrong sentences of every lesson script, by node, as the canonical keys the
// matcher reads them by, with the lesson's own reason (src/check/traps/pitfalls.ts says what it is for and why it is derived).
// The app imports it on its own as part of the core bundle; the gate fails a file a script has gone stale under; the build
// writes it again before it builds, so what ships is always what the scripts say.
//
// A pitfall goes in only if it is safe to speak on a card. It is left out when the matcher would accept its wrong sentence
// as an answer to its right one (it is not wrong), when it is not a sentence (fewer than two words once read), and when a
// verified claim still stands against it: the audit's verdicts (docs/swarm-audit/verdicts/final.jsonl) name 79 pitfalls whose
// wrong sentence, right sentence or reason is itself at fault, and the pitfall stays out until the text the claim quotes is gone
// from the script (R14: trap rules wait for false pitfalls to be fixed).
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { matchTranslation } from '../../src/check/translate';
import { PITFALLS_ABOUT, pitfallKey, type PitfallFile } from '../../src/check/traps/pitfalls';
import { dirOf } from '../../src/content/kinds';
import type { Finding } from '../gate/findings';

const APP_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export const PITFALLS_DIR = '_pitfalls';
export const pitfallsFile = (contentDir: string): string => join(contentDir, PITFALLS_DIR, 'pitfalls.json');
const VERDICTS = join(APP_DIR, '../docs/swarm-audit/verdicts/final.jsonl');
/** A verdict that leaves the claim standing: the pitfall is at fault until the content is fixed. */
const STANDING = new Set(['confirmed', 'amended', 'rewrite-needed', 'native-check']);

/** Words only, in one case: the way a claim's quote and the script's text are compared. */
const squash = (s: string): string => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

interface Pitfall { wrong: string; right: string; why: string }
interface Script { node: string; pitfalls?: Pitfall[] }

/** The pitfall claims that still stand, by script file name: the index of the pitfall and the text the claim quotes. */
export function standingClaims(verdictsFile = VERDICTS): Map<string, Array<{ index: number; quote: string }>> {
  const out = new Map<string, Array<{ index: number; quote: string }>>();
  if (!existsSync(verdictsFile)) return out;
  for (const line of readFileSync(verdictsFile, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    let r: { verdict?: string; file?: string; field?: string; quote?: string };
    try { r = JSON.parse(line); } catch { continue; }
    const m = /^pitfalls\[(\d+)\]/.exec(r.field ?? '');
    if (!m || !r.file || !r.verdict || !STANDING.has(r.verdict)) continue;
    const name = r.file.replace(/^.*\//, '');
    // a claim may quote the whole pitfall as JSON: what it is about is the wrong sentence
    const quote = r.quote ?? '';
    out.set(name, [...(out.get(name) ?? []), { index: Number(m[1]), quote: /"wrong":\s*"([^"]+)"/.exec(quote)?.[1] ?? quote }]);
  }
  return out;
}

/** The pitfalls the scripts make, by node. */
export function buildPitfalls(contentDir: string, verdictsFile = VERDICTS): PitfallFile {
  const dir = join(contentDir, dirOf('script'));
  const claims = standingClaims(verdictsFile);
  const nodes: PitfallFile['nodes'] = {};
  for (const f of existsSync(dir) ? readdirSync(dir).filter((x) => x.endsWith('.json') && !x.startsWith('_')).sort() : []) {
    const text = readFileSync(join(dir, f), 'utf8');
    let script: Script;
    try { script = JSON.parse(text) as Script; } catch { continue; }
    if (!script.node || !Array.isArray(script.pitfalls)) continue;
    const rows: Array<[string, string]> = [];
    script.pitfalls.forEach((p, i) => {
      if (!p || typeof p.wrong !== 'string' || typeof p.why !== 'string' || typeof p.right !== 'string') return;
      // a claim stands against it while the text the claim quotes is still in it, read as words
      const own = squash(`${p.wrong} ${p.right} ${p.why}`);
      if ((claims.get(f) ?? []).some((c) => c.index === i && (!c.quote || own.includes(squash(c.quote))))) return;
      const key = pitfallKey(p.wrong);
      if (key.split(' ').length < 2 || key === pitfallKey(p.right)) return;
      // not wrong at all: the matcher takes it for the right sentence
      if (matchTranslation(p.wrong, { es: p.right, en: '' }, { accents: 'lenient' }).pass) return;
      if (!rows.some(([k]) => k === key)) rows.push([key, p.why.trim()]);
    });
    if (rows.length) nodes[script.node] = rows;
  }
  return { version: 1, about: PITFALLS_ABOUT, nodes };
}

/** One node to a line, so a pitfall added or changed is one line of a diff. */
export function serializePitfalls(file: PitfallFile): string {
  const rows = Object.entries(file.nodes).map(([node, ps]) => `  ${JSON.stringify(node)}: ${JSON.stringify(ps)}`).join(',\n');
  return `{\n "version": ${file.version},\n "about": ${JSON.stringify(file.about)},\n "nodes": {\n${rows}\n }\n}\n`;
}

/** The pitfalls on disk; undefined when the course has none. Throws when there is a file that cannot be read. */
export function readPitfalls(contentDir: string): PitfallFile | undefined {
  const file = pitfallsFile(contentDir);
  return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as PitfallFile) : undefined;
}

/** The gate's check: a pitfalls file that is there must be what the scripts make. A course with none is not checked. */
export function checkPitfalls(contentDir: string): Finding[] {
  const file = `content/${PITFALLS_DIR}/pitfalls.json`;
  if (!existsSync(pitfallsFile(contentDir))) return [];
  let kept: PitfallFile | undefined;
  try { kept = readPitfalls(contentDir); } catch (e) {
    return [{ severity: 'error', check: 'pitfalls', file, problem: `the pitfalls cannot be read: ${(e as Error).message}`, fix: 'npm run pitfalls writes them again' }];
  }
  if (isDeepStrictEqual(kept, buildPitfalls(contentDir))) return [];
  return [{ severity: 'error', check: 'pitfalls', file, problem: 'the pitfalls do not match content/scripts: a script was added, changed or removed since they were written, or the matcher reads a sentence otherwise', fix: 'npm run pitfalls writes them again' }];
}

function main(): void {
  const content = join(APP_DIR, 'content');
  const file = buildPitfalls(content);
  mkdirSync(join(content, PITFALLS_DIR), { recursive: true });
  const text = serializePitfalls(file);
  const path = pitfallsFile(content);
  if (!existsSync(path) || readFileSync(path, 'utf8') !== text) writeFileSync(path, text);
  const n = Object.values(file.nodes).reduce((s, r) => s + r.length, 0);
  console.log(`pitfalls: ${n} wrong sentences on ${Object.keys(file.nodes).length} nodes (${(text.length / 1024).toFixed(0)} KB)`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
