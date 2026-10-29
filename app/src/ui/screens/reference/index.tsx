// Reference: find a verb form, a piece of grammar or a word, instantly.
// One search box; Verbs, Grammar and Words below it. Nothing here asks the
// learner to do anything; "Practise" hands a spec to the practice screen.
import { useMemo, useState } from 'preact/hooks';
import type { TeachingScript } from '../../../content/schema';
import type { TenseKey } from '../../../engine';
import type { PracticeSpec } from '../../session/practice-spec';
import { Es, Heading, Paras, Rich, undash } from '../../components/text';
import { useApp } from '../../context';
import { groupByTopic, grammarEntries, searchEntries, STRENGTH_TEXT, wordEntries, type GrammarEntry, type WordEntry } from './model';
import { cellsFor, findVerbs, shownPersons, type VerbMatch } from './verbs';
import { TENSE_ORDER, TENSE_PLAIN, taughtTenses } from './tenses';

type Section = 'verbs' | 'grammar' | 'words';
const PAGE = 50;

export function Reference({ onPractise }: { onPractise: (spec: PracticeSpec) => void }) {
  const { learner, bundle, ui } = useApp();
  const [q, setQ] = useState('');
  const [section, setSection] = useState<Section>('grammar');
  const [shown, setShown] = useState(PAGE);

  const met = useMemo(() => new Set<string>(learner.nodes()), [learner.nodes().length]);
  const grammar = useMemo(() => grammarEntries(bundle, met), [bundle, met]);
  const words = useMemo(() => wordEntries(bundle, learner, ui.state.saved), [bundle, met, ui.state.saved.length]);
  const tenses = useMemo(() => taughtTenses(met, (id) => bundle.node(id)?.tags), [bundle, met]);

  const verbs = useMemo(() => findVerbs(q), [q]);
  const gHits = useMemo(() => searchEntries(grammar, q), [grammar, q]);
  const wHits = useMemo(() => searchEntries(words, q), [words, q]);
  const counts = { verbs: verbs.length, grammar: gHits.length, words: wHits.length };

  const change = (v: string) => {
    setQ(v);
    setShown(PAGE);
    // If this section has nothing for the new text, move to one that has.
    if (v.trim()) {
      const order: Section[] = ['verbs', 'grammar', 'words'];
      const c = { verbs: findVerbs(v).length, grammar: searchEntries(grammar, v).length, words: searchEntries(words, v).length };
      if (!c[section]) { const next = order.find((s) => c[s]); if (next) setSection(next); }
    }
  };
  const pick = (s: Section) => { setSection(s); setShown(PAGE); };

  return (
    <main class="screen reference" id="main">
      <Heading title="Reference" lead="Look something up: a verb in any form, a bit of grammar, a word." />
      <input
        class="field" type="search" value={q} placeholder="Try pudimos, used to, or casa"
        aria-label="Search the reference" autoCapitalize="off" autoCorrect="off" spellcheck={false}
        onInput={(e) => change((e.target as HTMLInputElement).value)}
      />
      <div class="chips" role="tablist" aria-label="What to look in">
        {(['verbs', 'grammar', 'words'] as Section[]).map((s) => (
          <button key={s} role="tab" aria-selected={section === s} class={`chip${section === s ? ' on' : ''}`} onClick={() => pick(s)}>
            {s === 'verbs' ? 'Verbs' : s === 'grammar' ? 'Grammar' : 'Words'}{q.trim() ? ` (${counts[s]})` : ''}
          </button>
        ))}
      </div>
      {section === 'verbs' ? <VerbsView q={q} verbs={verbs} tenses={tenses} onPractise={onPractise} onPick={change} /> : null}
      {section === 'grammar' ? <GrammarView q={q} hits={gHits} shown={shown} more={() => setShown(shown + PAGE)} onPractise={onPractise} /> : null}
      {section === 'words' ? <WordsView q={q} hits={wHits} shown={shown} more={() => setShown(shown + PAGE)} onPractise={onPractise} /> : null}
    </main>
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
          <p class="small"><Es>{q.trim().toLowerCase()}</Es> is {cur.hits.map((h) => `${TENSE_PLAIN[h.tense].toLowerCase()}, ${h.person.replace('él/ella', 'él / ella / usted').replace('ellos', 'ellos / ustedes')}`).join('; or ')}.</p>
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
              <td><Es>{forms[p.idx] ?? ''}</Es></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ---------------------------------------------------------------- grammar

function GrammarView({ q, hits, shown, more, onPractise }: {
  q: string; hits: GrammarEntry[]; shown: number; more: () => void; onPractise: (s: PracticeSpec) => void;
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
          {g.entries.map((e) => <GrammarItem key={e.id} e={e} onPractise={onPractise} />)}
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

function GrammarItem({ e, onPractise }: { e: GrammarEntry; onPractise: (s: PracticeSpec) => void }) {
  const { bundle } = useApp();
  const [open, setOpen] = useState(false);
  const script = open ? bundle.scripts.get(e.id) : undefined;
  return (
    <details class="entry" onToggle={(ev) => setOpen((ev.target as HTMLDetailsElement).open)}>
      <summary>{undash(e.title)}</summary>
      {open ? <>
        {script ? <ScriptView script={script} /> : <Short id={e.id} />}
        <div class="actions">
          <button class="btn primary" onClick={() => onPractise({ kind: 'nodes', nodes: [e.id] })}>Practise this</button>
        </div>
        {e.week ? <p class="small-print">From week {e.week}</p> : null}
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

function WordsView({ q, hits, shown, more, onPractise }: {
  q: string; hits: WordEntry[]; shown: number; more: () => void; onPractise: (s: PracticeSpec) => void;
}) {
  if (!hits.length) return <p class="small">{q.trim() ? 'No word you have met matches that.' : 'Words you meet will collect here.'}</p>;
  return (
    <section>
      <ul class="words">
        {hits.slice(0, shown).map((w, i) => (
          <li key={w.id ?? `s${i}`} class="word">
            <span class={`dot ${w.strength}`} role="img" aria-label={STRENGTH_TEXT[w.strength]} title={STRENGTH_TEXT[w.strength]} />
            <span class="word-text">
              <Es>{w.word}</Es>{w.gender === 'mf' ? <span class="small"> (m or f)</span> : null}
              <span class="gloss"> {undash(w.gloss)}</span>
              {w.saved ? <span class="small"> Saved</span> : null}
            </span>
            {w.id ? <button class="btn quiet" onClick={() => onPractise({ kind: 'nodes', nodes: [w.id!] })} aria-label={`Practise ${w.word}`}>Practise</button> : null}
          </li>
        ))}
      </ul>
      {hits.length > shown ? <button class="btn quiet" onClick={more}>Show more ({hits.length - shown})</button> : null}
    </section>
  );
}

