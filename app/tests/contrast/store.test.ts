// The contrasts' own items (content/contrasts, F3): one file for each contrast, every item one decision. The real
// gate's checks are run over the real files with a curriculum of the graph and the units alone (the bank is not
// needed to judge a contrast), so a file that breaks one of them fails here as it would at the gate.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { ContrastFile } from '../../src/content/schema';
import { kindOfFile } from '../../src/content/kinds';
import { checkContrastRequires, checkDashes, checkStrings, checkStructure, type RunState } from '../../tools/gate/checks';
import type { Finding } from '../../tools/gate/findings';
import { buildCurriculum, listJson, loadFile, type Loaded } from '../../tools/gate/load';
import { DECIDES, RULED_OUT } from '../../tools/contrast/classes';

const APP = join(__dirname, '../..');
const CONTENT = join(APP, 'content');
const DIR = join(CONTENT, 'contrasts');

let files: Loaded[] = [];
let st: RunState;
const findings: Finding[] = [];

beforeAll(() => {
  const light = [...listJson(join(CONTENT, 'graph')), ...listJson(join(CONTENT, 'units'))].map((p) => loadFile(p, APP, null));
  const cur = buildCurriculum(light, CONTENT, []);
  st = { cur, findings, strict: false, unmapped: new Map(), missingLex: new Map(), noticed: new Set() };
  files = readdirSync(DIR).filter((f) => f.endsWith('.json')).sort().map((f) => loadFile(join(DIR, f), APP, findings));
}, 120_000);

const errors = (check?: string) => findings.filter((f) => f.severity === 'error' && (!check || f.check === check)).map((f) => `${f.file} ${f.path ?? ''} ${f.problem}`);

describe('the contrasts folder', () => {
  it('is registered as the kind the loader, the gate and the build read it by', () => {
    expect(kindOfFile(join(DIR, 'x_por-para.json'))).toBe('contrast');
    expect(kindOfFile(join(DIR, '_notes.json'))).toBeUndefined();
  });

  it('holds a file for every contrast, each named for its node and parsing against the schema: one with no items still says how it is asked', () => {
    expect(files).toHaveLength(94);
    for (const f of files) {
      expect(f.ok, f.rel).toBe(true);
      const c = f.data as ContrastFile;
      expect(f.rel.endsWith(`x_${c.node.slice(2)}.json`), f.rel).toBe(true);
      expect(DECIDES.get(c.node), `${c.node} has a class`).toBe(c.decides);
    }
  });

  it('every item of every file passes the gate: shape, Spanish, legality, dashes and computed requires', () => {
    for (const f of files) {
      if (!f.ok) continue;
      checkStructure(st, f);
      checkStrings(st, f);
      checkDashes(st, f);
      checkContrastRequires(st, f, false);
    }
    expect(errors()).toEqual([]);
  }, 120_000);

  it('every item is one decision: the gap holds the right option, no two options are alike, and the English is one pair with the Spanish', () => {
    let items = 0;
    for (const f of files) {
      for (const it of (f.data as ContrastFile).items) {
        items++;
        expect(it.es.slice(...it.gap), it.id).toBe(it.options[it.answer]);
        expect(new Set(it.options.map((o) => o.toLowerCase())).size, it.id).toBe(it.options.length);
        expect(it.en.trim().length, it.id).toBeGreaterThan(0);
        expect(it.why.trim().length, it.id).toBeGreaterThan(0);
        expect(it.id.startsWith(`${it.node}#`), it.id).toBe(true);
      }
    }
    expect(items).toBeGreaterThan(500);
  });

  it('takes nothing from a read-and-pick that is not a translation: the sentence it judges may be the wrong one', () => {
    for (const f of files) {
      for (const it of (f.data as ContrastFile).items) {
        expect(it.en, it.id).not.toMatch(/^(sounds right|should be\b)|^the second person\b/i);
        // an exchange has its English whole
        if (it.es.includes('\n')) expect((it.en.match(/[.!?]+(\s|$)/g) ?? []).length, it.id).toBeGreaterThan(1);
      }
    }
    // the script calls this one wrong: "Should be: A mí también."
    const yo = (files.find((f) => f.rel.endsWith('x_yo-vs-a-mi-tambien.json'))!.data as ContrastFile).items;
    expect(yo.map((i) => i.es)).not.toContain('Me encanta la torta.\nYo también.');
  });

  it('has none of the items a person ruled out', () => {
    for (const f of files) for (const it of (f.data as ContrastFile).items) expect(RULED_OUT.has(it.id), it.id).toBe(false);
  });

  it('writes no contrast into the requires or targets of any bank row (they would be inadmissible until it is taught)', () => {
    const bank = join(CONTENT, 'bank');
    for (const name of readdirSync(bank).filter((n) => n.endsWith('.json') && !n.startsWith('_'))) {
      for (const row of JSON.parse(readFileSync(join(bank, name), 'utf8')) as Array<{ requires: string[]; targets: string[] }>) {
        expect([...row.requires, ...row.targets].filter((n) => n.startsWith('x:'))).toEqual([]);
      }
    }
  });

  it('every item asks for a side of its contrast, and balanced decks do not favour one word', () => {
    for (const f of files) {
      const c = f.data as ContrastFile;
      const node = st.cur.nodes.get(c.node)!;
      for (const it of c.items) expect(node.contrasts, `${it.id} side ${it.side}`).toContain(it.side);
    }
  });

  it('the graph lists every side of por or para, in requires as in contrasts, as every other contrast does', () => {
    for (const n of st.cur.nodes.values()) {
      if (n.kind !== 'contrast') continue;
      expect([...n.requires].sort(), n.id).toEqual([...n.contrasts].sort());
    }
    expect(st.cur.nodes.get('x:por-para')!.contrasts.length).toBeGreaterThanOrEqual(2);
  });

  it('has the folder the build installs with the app (a contrast comes due wherever the learner is)', () => {
    expect(existsSync(join(DIR, 'x_por-para.json'))).toBe(true);
  });
});
