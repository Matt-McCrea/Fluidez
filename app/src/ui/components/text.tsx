// Text primitives. Spanish is always marked up as Spanish (lang="es", its own
// colour and weight) so the learner can tell at a glance which language a
// line is in, and screen readers switch voice.
import type { ComponentChildren } from 'preact';
import type { Txt as TxtT } from '../session/cards';

export function Es({ children, block }: { children: ComponentChildren; block?: boolean }) {
  return block ? <p class="es" lang="es">{children}</p> : <span class="es" lang="es">{children}</span>;
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
export function Rich({ text }: { text: string }) {
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
  return <>{out}</>;
}

/** Paragraphs from text with blank-line breaks. */
export function Paras({ text, cls }: { text: string; cls?: string }) {
  return <>{text.split(/\n\s*\n/).map((p, i) => <p key={i} class={cls}><Rich text={p} /></p>)}</>;
}

export function Heading({ title, lead }: { title: string; lead?: string }) {
  return (
    <header class="block-head">
      <h2 tabIndex={-1} data-autofocus>{title}</h2>
      {lead ? <p class="lead">{lead}</p> : null}
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
