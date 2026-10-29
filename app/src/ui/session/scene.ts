// Checking one typed turn of a scripted conversation. A reply passes when the
// translation matcher accepts it as one of the model answers, or when it
// meets every constraint the turn requires (so a true answer about yourself,
// "Me llamo Matt", passes a turn modelled on "Me llamo Tomás"). Feedback is on
// ONE thing: the first unmet constraint, else the matcher's hint.
import type { Scene } from '../../content/schema';
import { checkWriting, type Constraint } from '../../check';
import { matchTranslation } from '../../check/translate';

export type SceneTurn = Scene['turns'][number];

export interface TurnCheck {
  pass: boolean;
  /** one plain reason, when it did not pass */
  reason?: string;
  /** the model answer to show */
  model: string;
}

const strip = (s: string) => s.replace(/<[^>]+>/g, '');

export function checkTurn(turn: SceneTurn, text: string): TurnCheck {
  const model = turn.accept[0] ?? '';
  const t = text.trim();
  if (!t) return { pass: false, reason: 'Type a reply, even a short one.', model };
  const m = matchTranslation(t, { es: model, en: '', accept: turn.accept.slice(1) });
  const constraints = turn.require as unknown as Constraint[];
  const w = constraints.length ? checkWriting({ constraints }, t) : null;
  if (m.pass || (w && w.allPass)) return { pass: true, model };
  const failed = w?.results.find((r) => !r.pass);
  const reason = failed
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
