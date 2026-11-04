// Reference: find a verb form, a piece of grammar or a word, instantly.
// One search box; Units, Grammar, Words and Verbs below it. Nothing here asks the
// learner to do anything; "Practise" hands a spec to the practice screen.
import { useEffect, useMemo, useState } from 'preact/hooks';
import type { TeachingScript } from '../../../content/schema';
import type { TenseKey } from '../../../engine';
import { practiceFor } from '../../../learner/weak';
import type { PracticeSpec } from '../../session/practice-spec';
import { Es, Heading, Paras, Rich, undash } from '../../components/text';
import { useApp } from '../../context';
import { exampleSentences, groupByTopic, grammarEntries, searchEntries, STRENGTH_TEXT, searchUnits, unitEntries, unitIdOfWeek, unmetWordEntries, wordEntries, type GrammarEntry, type UnitEntry, type WordEntry } from './model';
import { cellsFor, findVerbs, seCellsFor, shownPersons, type VerbMatch } from './verbs';
import { TENSE_ORDER, TENSE_PLAIN, taughtTenses } from './tenses';

type Section = 'units' | 'grammar' | 'words' | 'verbs';
const SECTIONS: Section[] = ['units', 'grammar', 'words', 'verbs'];
const SECTION_LABEL: Record<Section, string> = { units: 'Units', grammar: 'Grammar', words: 'Words', verbs: 'Verbs' };
const PAGE = 50;

export function Reference({ onPractise, open }: { onPractise: (spec: PracticeSpec) => void; open?: string }) {
  const { learner, bundle, ui } = useApp();
  const [q, setQ] = useState('');
  const [section, setSection] = useState<Section>('grammar');
  const [shown, setShown] = useState(open ? 100_000 : PAGE);
  const [unitOpen, setUnitOpen] = useState<string | undefined>();

  const met = useMemo(() => new Set<string>(learner.nodes()), [learner.nodes().length]);
  const grammar = useMemo(() => grammarEntries(bundle, met, learner), [bundle, met]);
  const words = useMemo(() => wordEntries(bundle, learner, ui.state.saved), [bundle, met, ui.state.saved.length]);
  const tenses = useMemo(() => taughtTenses(met, (id) => bundle.node(id)?.tags), [bundle, met]);

  const units = useMemo(() => unitEntries(bundle, met, (id) => learner.ledger.hasSeen('chapter', id), ui.path.unit), [bundle, met, ui.path.unit]);
  const uHits = useMemo(() => searchUnits(units, q), [units, q]);
  const verbs = useMemo(() => findVerbs(q), [q]);
  const gHits = useMemo(() => searchEntries(grammar, q), [grammar, q]);
  const wHits = useMemo(() => searchEntries(words, q), [words, q]);
  // words the course has not reached: only worked out once there is something to look up
  const unmet = useMemo(() => (q.trim() ? unmetWordEntries(bundle, met) : []), [bundle, met, q.trim() !== '']);
  const comingWords = useMemo(() => searchEntries(unmet, q), [unmet, q]);
  const counts = { units: uHits.reached.length, verbs: verbs.length, grammar: gHits.length, words: wHits.length };

  const change = (v: string) => {
    setQ(v);
    setShown(PAGE);
    // If this section has nothing for the new text, move to one that has.
    if (v.trim()) {
      const order: Section[] = ['grammar', 'words', 'units', 'verbs'];
      const c = { units: searchUnits(units, v).reached.length, verbs: findVerbs(v).length, grammar: searchEntries(grammar, v).length, words: searchEntries(words, v).length };
      if (!c[section]) { const next = order.find((s) => c[s]); if (next) setSection(next); }
    }
  };
  const pick = (s: Section) => { setSection(s); setShown(PAGE); };
  const goUnit = (id: string) => { setQ(''); setUnitOpen(id); setSection('units'); setShown(PAGE); };

  return (
    <main class="screen reference" id="main">
      <Heading title="Look up" lead="Look something up: a verb in any form, a bit of grammar, a word. Or go back over a unit, or a theme like family or food." />
      <input
        class="field" type="search" value={q} placeholder="Try pudimos, used to, casa, or travel"
        aria-label="Search the reference" autoCapitalize="off" autoCorrect="off" spellcheck={false}
        onInput={(e) => change((e.target as HTMLInputElement).value)}
      />
      <div class="chips" role="tablist" aria-label="What to look in">
        {SECTIONS.map((s) => (
          <button key={s} role="tab" aria-selected={section === s} class={`chip${section === s ? ' on' : ''}`} onClick={() => pick(s)}>
            {SECTION_LABEL[s]}{q.trim() ? ` (${counts[s]})` : ''}
          </button>
        ))}
      </div>
      {section === 'units' ? <UnitsView q={q} hits={uHits} words={words} focus={unitOpen} onPractise={onPractise} onUnit={goUnit} /> : null}
      {section === 'verbs' ? <VerbsView q={q} verbs={verbs} tenses={tenses} onPractise={onPractise} onPick={change} /> : null}
      {section === 'grammar' ? <GrammarView q={q} hits={gHits} shown={shown} more={() => setShown(shown + PAGE)} onPractise={onPractise} open={open} onUnit={goUnit} /> : null}
      {section === 'words' ? <WordsView q={q} hits={wHits} coming={comingWords} shown={shown} more={() => setShown(shown + PAGE)} onPractise={onPractise} /> : null}
    </main>
  );
}


// ---------------------------------------------------------------- units

function UnitsView({ q, hits, words, focus, onPractise, onUnit }: {
  q: string; hits: { reached: UnitEntry[]; coming: UnitEntry[] }; words: WordEntry[]; focus?: string;
  onPractise: (s: PracticeSpec) => void; onUnit: (id: string) => void;
}) {
  const { bundle } = useApp();
  const byId = useMemo(() => new Map(words.filter((w) => w.id).map((w) => [w.id!, w])), [words]);
  // browsing: newest first, so what you are on now is at the top; searching: best match first
  const reached = q.trim() ? hits.reached : [...hits.reached].reverse();
  return (
    <section>
      {!reached.length ? <p class="small">{q.trim() ? 'No unit you have reached matches that.' : 'Units you reach will collect here.'}</p> : null}
      {reached.map((u) => <UnitRow key={u.id} u={u} open={u.id === focus} words={byId} onPractise={onPractise} onUnit={onUnit} />)}
      {hits.coming.length ? (
        <details class="later">
          <summary>Coming up ({hits.coming.length})</summary>
          <ul class="coming">
            {hits.coming.slice(0, 20).map((u) => <li key={u.id}>Unit {u.num} {'\u00b7'} {undash(u.title)}</li>)}
          </ul>
        </details>
      ) : null}
    </section>
  );
}

function UnitRow({ u, open, words, onPractise, onUnit }: {
  u: UnitEntry; open: boolean; words: Map<string, WordEntry>;
  onPractise: (s: PracticeSpec) => void; onUnit: (id: string) => void;
}) {
  const { bundle, learner } = useApp();
  const [on, setOn] = useState(open);
  const gram = useMemo(() => (on ? grammarEntries(bundle, new Set(u.grammar), learner).filter((g) => g.met) : []), [on, u.id]);
  return (
    <details class="entry unit" open={open || undefined} onToggle={(ev) => setOn((ev.target as HTMLDetailsElement).open)}>
      <summary>
        <span class="unit-head">
          <span>Unit {u.num} {'\u00b7'} {undash(u.title)}</span>
          <span class="small">{u.band} {'\u00b7'} {undash(u.canDo)}</span>
        </span>
      </summary>
      {on ? <>
        {gram.length ? <><h3 class="topic-head">Grammar and patterns</h3>{gram.map((g) => <GrammarItem key={g.id} e={g} onPractise={onPractise} />)}</> : null}
        {u.chunks.length ? (
          <>
            <h3 class="topic-head">Phrases</h3>
            {u.chunks.map((id) => {
              const s = bundle.segments(id)[0];
              return s ? <div key={id} class="example"><Es block>{s.es}</Es><p class="en">{undash(s.en)}</p></div> : null;
            })}
          </>
        ) : null}
        {u.words.length ? (
          <>
            <h3 class="topic-head">Words</h3>
            <ul class="words">
              {u.words.map((id) => {
                const w = words.get(id);
                if (!w) return null;
                return (
                  <li key={id} class="word">
                    <span class={`dot ${w.strength}`} role="img" aria-label={STRENGTH_TEXT[w.strength]} title={STRENGTH_TEXT[w.strength]} />
                    <span class="word-text"><Es>{w.word}</Es><span class="word-gloss"> {undash(w.gloss)}</span></span>
                    <button class="btn quiet" onClick={() => onPractise({ kind: 'nodes', nodes: [id] })} aria-label={`Practise ${w.word}`}>Practise</button>
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}
        {u.chapters.length ? (
          <>
            <h3 class="topic-head">Story</h3>
            <ul class="coming">{u.chapters.map((c) => <li key={c.id}>{undash(c.title)}</li>)}</ul>
            <p class="small">Read them again in the Story tab.</p>
          </>
        ) : null}
        {u.met.length ? (
          <div class="actions">
            <button class="btn primary" onClick={() => onPractise({ kind: 'translate', unit: u.id, title: `Unit ${u.num}` })}>Practise this unit</button>
          </div>
        ) : null}
      </> : null}
    </details>
  );
}

// ---------------------------------------------------------------- verbs

function VerbsView({ q, verbs, tenses, onPractise, onPick }: {
  q: string; verbs: VerbMatch[]; tenses: TenseKey[]; onPractise: (s: PracticeSpec) => void; onPick: (v: string) => void;
}) {
  const { learner, bundle } = useApp();
  const [chosen, setChosen] = useState<string | null>(null);
  const mine = useMemo(() => learner.nodes()
    .map((id) => bundle.node(id))
    .filter((n) => n && n.kind === 'lexeme' && n.pos === 'verb' && n.es)
    .sort((a, b) => (a!.freqRank ?? 1e9) - (b!.freqRank ?? 1e9))
    .slice(0, 30)
    .map((n) => n!.es!), [learner.nodes().length]);

  if (!q.trim()) {
    return (
      <section class="card">
        <p>Type a verb, or any form of it. <Es>pudimos</Es> finds <Es>poder</Es>.</p>
        {mine.length ? <>
          <p class="small">Verbs you have met</p>
          <div class="chips">{mine.map((v) => <button key={v} class="chip" onClick={() => onPick(v)}><Es>{v}</Es></button>)}</div>
        </> : null}
      </section>
    );
  }
  if (!verbs.length) return <p class="small">No verb found for "{q.trim()}". Try the infinitive, like <Es>hablar</Es>.</p>;
  const cur = verbs.find((v) => v.verb.inf === chosen) ?? verbs[0];
  const inf = cur.verb.inf;
  const en = bundle.node(`l:${inf}`)?.en ?? cur.verb.en;
  const later = TENSE_ORDER.filter((t) => !tenses.includes(t));
  return (
    <section>
      {verbs.length > 1 ? (
        <div class="chips" aria-label="Other matches">
          {verbs.map((v) => <button key={v.verb.inf} class={`chip${v.verb.inf === inf ? ' on' : ''}`} onClick={() => setChosen(v.verb.inf)}><Es>{v.verb.inf}</Es></button>)}
        </div>
      ) : null}
      <div class="card">
        <h3><Es>{inf}</Es></h3>
        <p>{undash(en)}</p>
        {cur.via === 'form' && cur.hits.length ? (
          <p class="small"><Es>{q.trim().toLowerCase()}</Es> is {cur.hits.map((h) => `${TENSE_PLAIN[h.tense].toLowerCase()}${h.se ? ' (the -se form)' : ''}, ${h.person.replace('él/ella', 'él / ella / usted').replace('ellos', 'ellos / ustedes')}`).join('; or ')}.</p>
        ) : null}
        <button class="btn primary" onClick={() => onPractise({ kind: 'conjugate', verbs: [inf], tenses: tenses.length ? tenses : ['presente'] })}>Practise this verb</button>
      </div>
      {tenses.length ? tenses.map((t) => <TenseTable key={t} inf={inf} tense={t} hits={cur.hits} />) : <p class="small">You have not met a verb tense yet. They all wait under Later.</p>}
      {later.length ? (
        <details class="later">
          <summary>Later ({later.length})</summary>
          {later.map((t) => <TenseTable key={t} inf={inf} tense={t} hits={cur.hits} />)}
        </details>
      ) : null}
    </section>
  );
}

function TenseTable({ inf, tense, hits }: { inf: string; tense: TenseKey; hits: VerbMatch['hits'] }) {
  const forms = cellsFor(inf, tense);
  const se = seCellsFor(inf, tense);
  if (!forms.length) return null;
  return (
    <table class="forms">
      <caption>{TENSE_PLAIN[tense]}</caption>
      <tbody>
        {shownPersons(tense).map((p) => {
          const hit = hits.some((h) => h.tense === tense && h.person === p.key);
          return (
            <tr key={p.key} class={hit ? 'hit' : undefined} aria-current={hit ? 'true' : undefined}>
              <th scope="row">{p.label}</th>
              <td><Es>{forms[p.idx] ?? ''}</Es>{se[p.idx] && se[p.idx] !== forms[p.idx] ? <> or <Es>{se[p.idx]}</Es></> : null}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ---------------------------------------------------------------- grammar

function GrammarView({ q, hits, shown, more, onPractise, open, onUnit }: {
  open?: string; onUnit: (id: string) => void; q: string; hits: GrammarEntry[]; shown: number; more: () => void; onPractise: (s: PracticeSpec) => void;
}) {
  const met = hits.filter((e) => e.met);
  const coming = hits.filter((e) => !e.met);
  // In search order when searching, grouped by topic when browsing.
  const page = met.slice(0, shown);
  const groups = q.trim() ? [{ topic: 'results', label: 'Results', entries: page }] : groupByTopic(page);
  const left = Math.max(0, shown - met.length);
  return (
    <section>
      {!met.length ? <p class="small">{q.trim() ? 'Nothing you have met matches that.' : 'Grammar you meet will collect here.'}</p> : null}
      {groups.map((g) => (
        <div key={g.topic} class="topic">
          <h3 class="topic-head">{g.label}</h3>
          {g.entries.map((e) => <GrammarItem key={e.id} e={e} onPractise={onPractise} open={e.id === open} onUnit={onUnit} />)}
        </div>
      ))}
      {met.length > shown ? <button class="btn quiet" onClick={more}>Show more ({met.length - shown})</button> : null}
      {coming.length ? (
        <details class="later">
          <summary>Coming up ({coming.length})</summary>
          <ul class="coming">
            {coming.slice(0, Math.max(10, left)).map((e) => <li key={e.id}>{undash(e.title)}</li>)}
          </ul>
          {coming.length > Math.max(10, left) ? <button class="btn quiet" onClick={more}>Show more</button> : null}
        </details>
      ) : null}
    </section>
  );
}

function GrammarItem({ e, onPractise, open: openFirst, onUnit }: { e: GrammarEntry; onPractise: (s: PracticeSpec) => void; open?: boolean; onUnit?: (id: string) => void }) {
  const { bundle, learner } = useApp();
  const [open, setOpen] = useState(!!openFirst);
  const unitId = unitIdOfWeek(bundle, e.week);
  const examples = useMemo(() => (open ? exampleSentences(bundle, learner, e.id) : []), [open, e.id]);
  const [script, setScript] = useState<TeachingScript | undefined>(() => bundle.scripts.get(e.id));
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!open) return;
    const have = bundle.scripts.get(e.id);
    if (have) { setScript(have); return; }
    let live = true;
    setLoading(true);
    void bundle.scriptFor(e.id).then((s) => { if (live) { setScript(s); setLoading(false); } }, () => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [open, e.id]);
  return (
    <details class="entry" open={openFirst || undefined} onToggle={(ev) => setOpen((ev.target as HTMLDetailsElement).open)}>
      <summary>{e.met ? <span class={`dot ${e.strength}`} role="img" aria-label={STRENGTH_TEXT[e.strength]} title={STRENGTH_TEXT[e.strength]} /> : null}{undash(e.title)}</summary>
      {open ? <>
        {script ? <ScriptView script={script} /> : loading ? <p class="small" data-loading>Loading</p> : <Short id={e.id} />}
        {examples.length ? (
          <div class="from-bank">
            <p class="small">From the bank</p>
            {examples.map((id) => {
              const s = bundle.sentence(id);
              return s ? <div key={id} class="example"><Es block>{s.es}</Es><p class="en">{undash(s.en)}</p></div> : null;
            })}
          </div>
        ) : null}
        <div class="actions">
          <button class="btn primary" onClick={() => onPractise(practiceFor(e.id, (id) => bundle.node(id), (id) => learner.isIntroduced(id)))}>Practise this</button>
        </div>
        {e.week ? (
          <p class="small-print">
            {unitId && onUnit ? <button class="btn link" onClick={() => onUnit(unitId)}>From unit {e.week}</button> : <>From unit {e.week}</>}
          </p>
        ) : null}
      </> : null}
    </details>
  );
}

/** Nodes without a lesson (chunks, many patterns): their aligned pairs. */
function Short({ id }: { id: string }) {
  const { bundle } = useApp();
  const segs = bundle.segments(id).slice(0, 4);
  if (!segs.length) return null;
  return <>{segs.map((s, i) => <div key={i} class="example"><Es block>{s.es}</Es><p class="en">{undash(s.en)}</p></div>)}</>;
}

function ScriptView({ script }: { script: TeachingScript }) {
  return (
    <div class="script">
      <p class="lead"><Rich text={script.hook.line} /></p>
      <div class="example"><Es block>{script.hook.es}</Es><p class="en">{undash(script.hook.en)}</p></div>
      {script.examples.map((x, i) => <div key={i} class="example"><Es block>{x.es}</Es><p class="en">{undash(x.en)}</p></div>)}
      <div class="rule"><Paras text={script.rule} /></div>
      {script.smallPrint ? <p class="small-print"><Rich text={script.smallPrint} /></p> : null}
      {script.pitfalls.length ? (
        <div class="pitfalls">
          <p class="small">Watch out</p>
          {script.pitfalls.map((p, i) => (
            <div key={i} class="example">
              <p><s class="es">{p.wrong}</s> then <Es>{p.right}</Es></p>
              <p class="small"><Rich text={p.why} /></p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------- words

function WordsView({ q, hits, coming, shown, more, onPractise }: {
  q: string; hits: WordEntry[]; coming: WordEntry[]; shown: number; more: () => void; onPractise: (s: PracticeSpec) => void;
}) {
  const later = coming.length ? (
    <details class="later">
      <summary>Coming up ({coming.length})</summary>
      <ul class="coming">
        {coming.slice(0, 20).map((w) => <li key={w.id}><Es>{w.word}</Es> <span class="word-gloss">{undash(w.gloss)}</span></li>)}
      </ul>
    </details>
  ) : null;
  if (!hits.length) {
    return (
      <section>
        <p class="small">{q.trim() ? 'No word you have met matches that.' : 'Words you meet will collect here.'}</p>
        {later}
      </section>
    );
  }
  return (
    <section>
      <ul class="words">
        {hits.slice(0, shown).map((w, i) => (
          <li key={w.id ?? `s${i}`} class="word">
            <span class={`dot ${w.strength}`} role="img" aria-label={STRENGTH_TEXT[w.strength]} title={STRENGTH_TEXT[w.strength]} />
            <span class="word-text">
              <Es>{w.word}</Es>{w.gender === 'mf' ? <span class="small"> (m or f)</span> : null}
              <span class="word-gloss"> {undash(w.gloss)}</span>
              {w.saved ? <span class="small"> Saved</span> : null}
            </span>
            {w.id ? <button class="btn quiet" onClick={() => onPractise({ kind: 'nodes', nodes: [w.id!] })} aria-label={`Practise ${w.word}`}>Practise</button> : null}
          </li>
        ))}
      </ul>
      {hits.length > shown ? <button class="btn quiet" onClick={more}>Show more ({hits.length - shown})</button> : null}
      {later}
    </section>
  );
}

