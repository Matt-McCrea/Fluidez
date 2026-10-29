// Checking one typed turn of a scripted conversation. A reply passes when the
// translation matcher accepts it as one of the model answers, or when it
// meets every constraint the turn requires (so a true answer about yourself,
// "Me llamo Matt", passes a turn modelled on "Me llamo Tomás"). Feedback is on
// ONE thing: the first unmet constraint, else the matcher's hint. The constraint
// path also needs most of the reply to be Spanish.
import type { Scene } from '../../content/schema';
import { checkWriting, type Constraint } from '../../check';
import { matchTranslation } from '../../check/translate';
import { SPANISH_SHARE_MIN, addToLexicon, buildLexicon, spanishShare } from '../../check/personal';
import type { Bundle } from '../data/bundle';

const lexCache = new WeakMap<Bundle, Set<string>>();
/** Every Spanish word the vocabulary and the sentence bank hold, for the "is this Spanish" floor. */
export function bundleLexicon(b: Bundle): Set<string> {
  let lex = lexCache.get(b);
  if (!lex) { lex = buildLexicon(b.course.nodes.values(), b.bank.map((s) => s.es)); lexCache.set(b, lex); }
  return lex;
}

export type SceneTurn = Scene['turns'][number];

export interface TurnCheck {
  pass: boolean;
  /** one plain reason, when it did not pass */
  reason?: string;
  /** the model answer to show (the screen holds it back until a retry or a pass) */
  model: string;
}

const strip = (s: string) => s.replace(/<[^>]+>/g, '');

export function checkTurn(turn: SceneTurn, text: string, lexicon?: ReadonlySet<string>): TurnCheck {
  const model = turn.accept[0] ?? '';
  const t = text.trim();
  if (!t) return { pass: false, reason: 'Type a reply, even a short one.', model };
  const m = matchTranslation(t, { es: model, en: '', accept: turn.accept.slice(1) });
  const constraints = turn.require as unknown as Constraint[];
  const w = constraints.length ? checkWriting({ constraints }, t) : null;
  if (m.pass) return { pass: true, model };
  // The constraint path alone is substring-level, so it also needs Spanish:
  // an English sentence that happens to contain the words must not pass.
  const lex = lexicon ?? addToLexicon(addToLexicon(new Set<string>(), turn.npc), turn.accept.join(' '));
  const spanish = spanishShare(t, lex) >= SPANISH_SHARE_MIN;
  if (w && w.allPass && spanish) return { pass: true, model };
  const failed = w?.results.find((r) => !r.pass);
  const reason = w && w.allPass && !spanish ? 'Mostly English so far. Say it in Spanish.' : failed
    ? `To do this, ${lowerFirst(strip(failed.label))}.`
    : m.hint ?? "That doesn't quite answer them yet.";
  return { pass: false, reason, model };
}

function lowerFirst(s: string) { return s ? s[0].toLowerCase() + s.slice(1) : s; }

/** The turns in play order, following `next` from the first. */
export function turnOrder(scene: Scene): SceneTurn[] {
  const byId = new Map(scene.turns.map((t) => [t.id, t]));
  const out: SceneTurn[] = [];
  let cur: SceneTurn | undefined = scene.turns[0];
  while (cur && !out.includes(cur)) { out.push(cur); cur = cur.next ? byId.get(cur.next) : undefined; }
  return out;
}

/** Seconds allowed for a turn in the timed rerun. */
export function turnSeconds(turn: SceneTurn): number {
  const words = (turn.accept[0] ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(15, 8 + words * 3);
}
