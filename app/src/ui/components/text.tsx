// Text primitives. Spanish is always marked up as Spanish (lang="es", its own
// colour and weight) so the learner can tell at a glance which language a
// line is in, and screen readers switch voice.
import type { ComponentChildren } from 'preact';
import type { Txt as TxtT } from '../session/cards';

// ---------------------------------------------------------------- no dashes on screen
//
// Learner-facing text never shows an em or en dash. Content still has some
// (Spanish dialogue dashes, "A. \u2014 B." turn markers, "0\u201320" ranges)
// until the content pass removes them, so everything content-sourced goes
// through `lines` / `undash` on its way to the screen:
//   leading dialogue dash      dropped
//   " \u2014dice Vale\u2014."     an aside: ", dice Vale."
//   " \u2014 Igualmente."        a new speaker: a new line
//   "0\u201320"                  "0 to 20"
const DASHES = /[\u2014\u2013]/;

/** Content text as display lines, without dashes. */
export function lines(text: string): string[] {
  if (!text) return [];
  if (!DASHES.test(text) && !/\s-\s/.test(text)) return text.split('\n');
  return text.split('\n').flatMap((raw) => {
    let t = raw.replace(/^\s*[\u2014\u2013]\s*/, '');
    t = t.replace(/(\d)\s*[\u2013\u2014]\s*(\d)/g, '$1 to $2');
    t = t.replace(/\s*[\u2014\u2013](?=[.,;:!?)])/g, '');               // closing dash of an aside
    t = t.replace(/\s*[\u2014\u2013]\s*(?=\p{Ll})/gu, ', ');            // opening dash of an aside
    const parts = t.split(/\s*[\u2014\u2013]\s*(?=[\u00bf\u00a1"\u201c\u00ab\p{Lu}\d])/u);  // a new speaker
    return parts.map((x) => x.replace(/\s*[\u2014\u2013]\s*/g, ', ').replace(/\s+-\s+/g, ', ').replace(/,\s*,/g, ',').trim()).filter(Boolean);
  });
}

/** Content text on one line, without dashes (titles, labels). */
export function undash(text: string | undefined): string {
  if (!text) return '';
  if (!DASHES.test(text) && !/\s-\s/.test(text)) return text;
  return lines(text).map((l, i, a) => (i < a.length - 1 && !/[.?!:,;\u2026]$/.test(l) ? `${l}:` : l)).join(' ');
}

/** Lines separated by line breaks. */
function Lines({ text }: { text: string }) {
  const ls = lines(text);
  return <>{ls.map((l, i) => (i ? <><br />{l}</> : l))}</>;
}

export function Es({ children, block }: { children: ComponentChildren; block?: boolean }) {
  const c = typeof children === 'string' ? <Lines text={children} /> : children;
  return block ? <p class="es" lang="es">{c}</p> : <span class="es" lang="es">{c}</span>;
}

export function Txt({ t, block, big }: { t: TxtT | undefined; block?: boolean; big?: boolean }) {
  if (!t) return null;
  const cls = `${t.lang === 'es' ? 'es' : 'en'}${big ? ' big' : ''}`;
  return block
    ? <p class={cls} lang={t.lang}><Rich text={t.text} /></p>
    : <span class={cls} lang={t.lang}><Rich text={t.text} /></span>;
}

/**
 * Light inline markup used by content: *Spanish* in italics marks Spanish,
 * <b>x</b> (checker labels) is bold. Everything else is text; nothing is
 * injected as HTML.
 */
export function Rich({ text: raw }: { text: string }) {
  const text = lines(raw).join('\n');
  const out: ComponentChildren[] = [];
  const re = /\*([^*]+)\*|<b>(.*?)<\/b>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) out.push(<em key={k++} class="es" lang="es">{m[1]}</em>);
    else out.push(<strong key={k++}>{m[2].replace(/<[^>]+>/g, '')}</strong>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last).replace(/<[^>]+>/g, ''));
  // line breaks between dialogue turns
  return <>{out.flatMap((o, i) => (typeof o === 'string' && o.includes('\n')
    ? o.split('\n').flatMap((part, j) => (j ? [<br key={`b${i}-${j}`} />, part] : [part]))
    : [o]))}</>;
}

/** Paragraphs from text with blank-line breaks. */
export function Paras({ text, cls }: { text: string; cls?: string }) {
  return <>{text.split(/\n\s*\n/).map((p, i) => <p key={i} class={cls}><Rich text={p} /></p>)}</>;
}

export function Heading({ title, lead }: { title: string; lead?: string }) {
  return (
    <header class="block-head">
      <h2 tabIndex={-1} data-autofocus>{undash(title)}</h2>
      {lead ? <p class="lead">{undash(lead)}</p> : null}
    </header>
  );
}

export function Bar({ value, of, label }: { value: number; of: number; label: string }) {
  const pct = of > 0 ? Math.min(100, Math.round((value / of) * 100)) : 0;
  return (
    <div class="bar" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={of} aria-valuenow={value}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

export function fmtSeconds(s: number): string {
  const m = Math.floor(s / 60);
  const r = Math.round(s % 60);
  return m ? `${m}:${String(r).padStart(2, '0')}` : `${r} s`;
}
