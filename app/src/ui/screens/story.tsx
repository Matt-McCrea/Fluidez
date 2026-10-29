// Story: the chapters you've unlocked, in order. Opening one again is a
// labelled, deliberate re-read (recorded as such in the exposure ledger).
import { useState } from 'preact/hooks';
import { Reader, wordCount } from '../blocks/read';
import { Es, Heading, undash } from '../components/text';
import { useApp } from '../context';

export function Story() {
  const app = useApp();
  const { learner, bundle, ui } = app;
  const [open, setOpen] = useState<string | null>(null);
  const [, force] = useState(0);
  const unlocked = bundle.index.chapters.filter((c) => learner.ledger.hasSeen('chapter', c.id));
  const chapter = open ? bundle.chapters.get(open) : undefined;

  if (chapter) {
    return (
      <main class="screen" id="main">
        <button class="btn link" onClick={() => setOpen(null)}>← All chapters</button>
        <Heading title={chapter.title} lead="Read it again. Notice how much easier it is now." />
        <p class="tag">Re-reading</p>
        <Reader
          chapter={chapter} bundle={bundle} ui={ui} finishLabel="Done"
          onFinish={async () => {
            learner.ledger.markSeen('chapter', chapter.id, { deliberate: true, at: app.now() });
            await ui.update((s) => { s.stats.wordsRead += wordCount(chapter.text); });
            await learner.flush();
            setOpen(null);
          }}
        />
      </main>
    );
  }

  return (
    <main class="screen" id="main">
      <Heading title="Story" lead="Tomás, Vale and the café in La Candelaria." />
      {unlocked.length ? (
        <ol class="chapters">
          {unlocked.map((c, i) => {
            const full = bundle.chapters.get(c.id);
            return (
              <li key={c.id}>
                <button class="row" onClick={() => setOpen(c.id)}>
                  <span class="num">{i + 1}</span>
                  <span>{undash(full?.title ?? c.id)}</span>
                  <span class="small">{learner.ledger.views('chapter', c.id).length > 1 ? 'Read again' : 'Read'}</span>
                </button>
              </li>
            );
          })}
        </ol>
      ) : <p>Your first chapter comes with your first lesson.</p>}

      <h3>Saved words</h3>
      {ui.state.saved.length ? (
        <ul class="saved">
          {ui.state.saved.map((w, i) => (
            <li key={`${w.es}-${i}`}>
              <Es>{w.es}</Es> <span class="en">{undash(w.en)}</span>
              <button class="btn link small" aria-label={`Remove ${w.es}`} onClick={async () => { await ui.update((s) => { s.saved.splice(i, 1); }); force((n) => n + 1); }}>Remove</button>
            </li>
          ))}
        </ul>
      ) : <p class="small">Tap a word while you read, then "Save word".</p>}
    </main>
  );
}
