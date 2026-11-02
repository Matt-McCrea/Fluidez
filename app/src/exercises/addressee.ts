/* ============================================================================
 * WHO A QUESTION IS FOR: can a learner answer it about themselves.
 *
 * "Answer for yourself" picks questions from the bank. Many are put to a
 * character ("¿De dónde eres, Vale?"), to a group ("¿Ustedes son Mariana y
 * Hernando?") or are about the story ("¿Qué dirá Altamira?"): nobody can
 * answer those for themselves, and the card then shows "Soy …" as the way to
 * answer. A question is the learner's own when it is put to one person (tú
 * or usted) and nobody else is named in it. Anything else is not asked.
 * ========================================================================== */
import { low, parseClause, toToks } from './spanish';

/** Words that put the question to one listener. */
const TO_YOU = new Set(['tú', 'tu', 'tus', 'te', 'ti', 'contigo', 'usted']);
/** Words that put it to a group or about somebody else. */
const NOT_YOU = new Set(['ustedes', 'vosotros', 'vosotras', 'vos', 'él', 'ella', 'ellos', 'ellas', 'nosotros', 'nosotras']);

/** A capital word in the middle of the question is fine when it is a place (licence.ts placesOf) and nobody is being addressed by it. */
const placeAt = (ts: ReturnType<typeof toToks>, i: number, places: ReadonlySet<string>) => !/[,;:]/.test(ts[i - 1].post) && places.has(low(ts[i]));

/** `names` and `places`: the names in the bank, and which of them are places (licence.ts namesOf, placesOf). */
export function askedOfYou(es: string, names: ReadonlySet<string>, places: ReadonlySet<string>): boolean {
  if (!/[?]/.test(es) || /\n/.test(es)) return false;
  const ts = toToks(es);
  // one question: a remark in front of it or a second sentence after it is somebody's line, not a prompt
  if (ts.slice(0, -1).some((t) => /[.?!…]/.test(t.post))) return false;
  let marked = false;
  for (let i = 0; i < ts.length; i++) {
    const core = ts[i].core;
    if (!core) continue;
    const w = low(ts[i]);
    if (NOT_YOU.has(w)) return false;
    if (TO_YOU.has(w)) marked = true;
    if (!/^\p{Lu}/u.test(core)) continue;
    // a capital that opens the question is a name only if the bank says so; any other is a name
    // unless it is a place ("¿Usted vive en Bogotá?", "¿Eres de Bogotá o de Medellín?")
    if (i === 0 ? names.has(w) : !placeAt(ts, i, places)) return false;
  }
  return marked || parseClause(es, '')?.choice.person === 'tú';
}
