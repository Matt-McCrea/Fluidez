/* ============================================================================
 * CONTENT GATE for the ORIGINAL app's content (data/*.js).
 *   npm run gate -- [--strict] [--json <path>] [--top N] [--quiet]
 * Ported from app/tools/gate (checks needing the tagger or the graph are left out).
 * Report mode: prints findings and counts, exits 0. --strict exits 1 on errors.
 * ========================================================================== */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { writeFileSync } from 'node:fs';
import { loadData, pcicTexts, strings, stripTags, type Data } from './load';
import { Sink, fmt, clip, type Finding } from './findings';
import {
  accentLint, buildAccentLexicon, setKnownNouns, clozeAnswer, dialectLint, dominantLength, genderDisagreement, hasDash, isTypeable, LENGTH_FACTOR, LEVEL_MEDIAN,
  LIST_SHARE_MAX, listShare, mcqAnswerability, OptionTally, shortAnswerability, validChoice, wordCount, type Gender,
} from './checks';
import { exactDuplicates, frameOveruse, nearDuplicates, normTokens, type DupItem } from './corpus';

export const CHECKS = ['dashes', 'dupe', 'frames', 'accent', 'dialect', 'typeable', 'options', 'list-passage', 'answerability', 'gender-agreement', 'length'] as const;

export function genderLexicon(vocab: any[]): Map<string, Gender> {
  const m = new Map<string, Gender>();
  for (const v of vocab) {
    const es = String(v.es ?? '');
    const art = /^(el|la|los|las)\s+([a-záéíóúñü]+)$/i.exec(es);
    if (art) m.set(art[2].toLowerCase(), /^(la|las)$/i.test(art[1]) ? 'f' : 'm');
    else if ((v.gender === 'm' || v.gender === 'f') && /^[a-záéíóúñü]+$/i.test(es)) m.set(es.toLowerCase(), v.gender);
  }
  return m;
}

export function runGate(d: Data, sink: Sink): void {
  const push = (f: Finding) => sink.push(f);

  // ---- accent lexicon: engine paradigms + vocab + idioms + connectors + PCIC examples
  const known: string[] = [];
  d.VOCAB.forEach((v) => known.push(String(v.es ?? '')));
  d.IDIOMS.forEach((v) => known.push(String(v.es ?? '')));
  d.CONNECTORS.forEach((c: any) => (c.items ?? []).forEach((i: any) => known.push(String(i.es ?? ''))));
  buildAccentLexicon([...known, ...pcicTexts()]);
  setKnownNouns(d.VOCAB.flatMap((v) => (/^(el|la|los|las|un|una)\s/i.test(String(v.es)) ? [String(v.es).split(/\s+/)[1]?.toLowerCase() ?? ''] : [])));

  // ---- every string: dashes, accent, dialect
  for (const s of strings(d)) {
    if (!s.path.includes('.html.i[') && hasDash(s.text)) {
      push({ severity: 'error', check: 'dashes', file: s.file, path: s.path, problem: `dash in learner-facing text: "${clip(s.text, 60)}"`, fix: 'no em dashes, en dashes or spaced hyphens: put dialogue turns on separate lines; in English use a comma, colon, brackets or a full stop' });
    }
    if (!s.lint) continue;
    if (!s.noAccent) for (const a of accentLint(s.text)) push({ severity: a.severity, check: 'accent', file: s.file, path: s.path, problem: `${a.problem}: "${clip(a.word, 40)}"`, fix: a.fix });
    for (const h of dialectLint(s.text)) push({ severity: 'warning', check: 'dialect', file: s.file, path: s.path, problem: `${h.rule}: "${clip(h.word, 40)}": ${h.problem}`, fix: h.fix });
  }

  const opts = new OptionTally();
  const glex = genderLexicon(d.VOCAB);
  const F = 'data/passages.js';

  // ---- passages
  const dupItems: DupItem[] = [];
  const byLevel = new Map<number, string[]>();
  for (const p of d.PASSAGES) {
    const text = String(p.text ?? '');
    dupItems.push({ file: F, path: p.id, text });
    const L = byLevel.get(p.level) ?? []; L.push(text); byLevel.set(p.level, L);

    const words = wordCount(text), med = LEVEL_MEDIAN[p.level];
    if (med && words > LENGTH_FACTOR * med) push({ severity: 'warning', check: 'length', file: F, path: p.id, problem: `${words} words at level ${p.level} (${(words / med).toFixed(1)}x the median ${med})`, fix: 'split the passage or cut it to the level band' });

    const ls = listShare(text);
    if (ls.share > LIST_SHARE_MAX) push({ severity: 'warning', check: 'list-passage', file: F, path: p.id, problem: `${Math.round(ls.share * 100)}% of the tokens (${ls.enumTokens}/${ls.total}) sit inside enumerations`, fix: 'tell what happens instead of listing; keep lists to one short sentence' });

    (p.questions ?? []).forEach((q: any, i: number) => {
      const path = `${p.id}.questions[${i}]`;
      if (q.type === 'mcq' || Array.isArray(q.options)) {
        if (!validChoice(q)) { push({ severity: 'error', check: 'options', file: F, path, problem: 'mcq answer index does not resolve to an option' }); return; }
        opts.add('passages (all)', q); opts.add(`passages L${p.level}`, q);
        if (dominantLength(q.options, q.answer)) push({ severity: 'warning', check: 'options', file: F, path, problem: `the correct option "${clip(q.options[q.answer], 40)}" is at least 1.5x as long as every other option`, fix: 'lengthen the wrong options or shorten the right one' });
        for (const fl of mcqAnswerability(text, q)) push({ severity: 'warning', check: 'answerability', file: F, path, problem: fl.problem, fix: 'make the question answerable from the text, with options that are equally plausible' });
        const g = genderDisagreement(q, glex);
        if (g) push({ severity: 'warning', check: 'gender-agreement', file: F, path, problem: g, fix: 'make the options agree with the noun or name the question asks about' });
      } else if (q.type === 'short' || Array.isArray(q.accept)) {
        const acc: string[] = (q.accept ?? []).map(String);
        if (!acc.length || !acc.some(isTypeable)) push({ severity: 'error', check: 'typeable', file: F, path, problem: `no accepted answer a learner can type: ${JSON.stringify(acc).slice(0, 80)}`, fix: 'write each accepted answer as plain Spanish in accept[]' });
        else if (!shortAnswerability(text, acc)) push({ severity: 'warning', check: 'answerability', file: F, path, problem: `none of the accepted answers ${JSON.stringify(acc).slice(0, 60)} appears in the text`, fix: 'accept what the text says, or rewrite the question' });
      }
    });
  }
  for (const f of nearDuplicates(dupItems)) push(f);
  for (const [L, texts] of byLevel) for (const f of frameOveruse(`passages L${L}`, F, texts)) push(f);

  // ---- apply
  const AF = 'data/apply.js';
  const applyByLevel = new Map<number, string[]>();
  const applyKey = (a: any): string => (a.type === 'transform' ? `${a.from ?? ''} ${a.to ?? ''}` : String(a.text ?? ''));
  const applyDupes: DupItem[] = [];
  d.APPLY_ITEMS.forEach((a, i) => {
    const path = `apply[${i}]`;
    applyDupes.push({ file: AF, path, text: applyKey(a) });
    const L = applyByLevel.get(a.level) ?? []; L.push(applyKey(a)); applyByLevel.set(a.level, L);
    if (a.type === 'cloze') {
      const ans = clozeAnswer(a);
      if (ans === null) push({ severity: 'error', check: 'typeable', file: AF, path, problem: `cloze answer cannot be computed by the engine (${a.inf} / ${a.tense} / ${a.person})`, fix: 'fix the verb, tense or person' });
      else if (!isTypeable(ans)) push({ severity: 'error', check: 'typeable', file: AF, path, problem: `answer "${clip(ans)}" has no form a learner can type` });
    } else if (a.type === 'transform') {
      if (!isTypeable(a.to)) push({ severity: 'error', check: 'typeable', file: AF, path, problem: `answer "${clip(String(a.to ?? ''))}" has no form a learner can type` });
    } else if (a.type === 'choice') {
      if (!validChoice(a)) { push({ severity: 'error', check: 'options', file: AF, path, problem: 'choice answer index does not resolve to an option' }); return; }
      opts.add('apply choice (all)', a); opts.add(`apply choice L${a.level}`, a);
      if (dominantLength(a.options, a.answer)) push({ severity: 'warning', check: 'options', file: AF, path, problem: `the correct option "${clip(a.options[a.answer], 40)}" is at least 1.5x as long as every other option` });
    }
  });
  for (const f of exactDuplicates(applyDupes)) push(f);
  for (const [L, texts] of applyByLevel) for (const f of frameOveruse(`apply L${L}`, AF, texts)) push(f);

  // ---- writing
  const wd: DupItem[] = d.WRITING_TASKS.map((t) => ({ file: 'data/writing.js', path: t.id, text: String(t.prompt ?? '') }));
  for (const f of exactDuplicates(wd)) push(f);

  // ---- lesson probes
  const SF = 'data/strand-lessons.js';
  for (const l of d.STRAND_LESSONS) {
    (l.probes ?? []).forEach((p: any, i: number) => {
      const path = `${l.id}.probes[${i}]`;
      if (p.kind === 'mcq') {
        if (!validChoice(p)) { push({ severity: 'error', check: 'options', file: SF, path, problem: 'mcq answer index does not resolve to an option' }); return; }
        opts.add('lesson probes (all)', p); opts.add(`lesson probes L${l.level}`, p);
        if (dominantLength(p.options, p.answer)) push({ severity: 'warning', check: 'options', file: SF, path, problem: `the correct option "${clip(stripTags(p.options[p.answer]), 40)}" is at least 1.5x as long as every other option` });
      } else if (p.kind === 'cloze') {
        const acc: string[] = (p.accept ?? []).map(String);
        if (!acc.some(isTypeable)) push({ severity: 'error', check: 'typeable', file: SF, path, problem: `no accepted answer a learner can type: ${JSON.stringify(acc).slice(0, 80)}` });
      }
    });
  }
  for (const f of opts.findings()) push({ ...f, file: f.path?.startsWith('passages') ? F : f.path?.startsWith('apply') ? AF : SF });
}

/* ---- report ------------------------------------------------------------------- */
function arg(name: string): string | null { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] ?? null : null; }

export function summaryRows(sink: Sink) {
  return CHECKS.map((c) => ({ check: c, errors: sink.counts.get(c)?.error ?? 0, warnings: sink.counts.get(c)?.warning ?? 0 }));
}

function main(): void {
  const strict = process.argv.includes('--strict');
  const quiet = process.argv.includes('--quiet');
  const top = Number(arg('--top') ?? 10);
  const jsonPath = arg('--json');
  const d = loadData();
  const sink = new Sink();
  runGate(d, sink);

  const rows = summaryRows(sink);
  const out: string[] = [];
  out.push(`gate over data/*.js: ${d.PASSAGES.length} passages, ${d.APPLY_ITEMS.length} apply, ${d.WRITING_TASKS.length} writing, ${d.STRAND_LESSONS.length} lessons, ${d.VOCAB.length} vocab`);
  out.push('', 'check              errors  warnings');
  for (const r of rows) out.push(`${r.check.padEnd(18)} ${String(r.errors).padStart(6)}  ${String(r.warnings).padStart(8)}`);
  out.push(`${'TOTAL'.padEnd(18)} ${String(rows.reduce((a, r) => a + r.errors, 0)).padStart(6)}  ${String(rows.reduce((a, r) => a + r.warnings, 0)).padStart(8)}`);
  if (!quiet) {
    for (const c of CHECKS) {
      const list = sink.kept.filter((f) => f.check === c).sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'error' ? -1 : 1));
      if (!list.length) continue;
      out.push('', `-- ${c}: first ${Math.min(top, list.length)} of ${rows.find((r) => r.check === c)!.errors + rows.find((r) => r.check === c)!.warnings}`);
      for (const f of list.slice(0, top)) out.push('  ' + fmt(f));
    }
    const dia = sink.byFile.get('dialect');
    if (dia) {
      out.push('', '-- dialect worklist (warnings per file, not errors)');
      for (const [f, n] of [...dia].sort((a, b) => b[1] - a[1])) out.push(`  ${String(n).padStart(6)}  ${f}`);
    }
  }
  console.log(out.join('\n'));
  if (jsonPath) {
    writeFileSync(jsonPath, JSON.stringify({ summary: rows, dialectByFile: Object.fromEntries(sink.byFile.get('dialect') ?? []), keptCapPerCheck: 4000, findings: sink.kept }, null, 1));
    console.log(`\njson report: ${jsonPath}`);
  }
  if (strict && sink.errors > 0) process.exit(1);
}

if (process.argv[1] && /tools[\\/]gate[\\/]index\.ts$/.test(process.argv[1])) main();
void normTokens;
