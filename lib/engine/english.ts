// English phrasing for "translate + conjugate" prompts — ported from the old
// engine's enPhrase. Turns a verb's `en` gloss + a tense/person into a natural
// English phrase ("he ate"), plus a small marker when English collapses a
// distinction Spanish makes (subjunctive mood; tú/usted/vosotros/ustedes
// commands all read as bare "you, ...!").
import type { TenseKey, Verb } from './types';

const EN_SUBJECTS = ['I', 'you', 'he/she', 'we', 'you all', 'they'];
const EN_IMP_PERSONS = ['tú', 'usted', 'nosotros', 'vosotros', 'ustedes'];

// base -> [simple past, past participle]; anything else is formed by the
// regular -ed/-d/-ied rules below.
const EN_IRREGULAR: Readonly<Record<string, readonly [string, string]>> = {
    be: ['was', 'been'], have: ['had', 'had'], do: ['did', 'done'],
    go: ['went', 'gone'], say: ['said', 'said'], see: ['saw', 'seen'],
    give: ['gave', 'given'], know: ['knew', 'known'], put: ['put', 'put'],
    come: ['came', 'come'], leave: ['left', 'left'], bring: ['brought', 'brought'],
    fall: ['fell', 'fallen'], hear: ['heard', 'heard'], sleep: ['slept', 'slept'],
    feel: ['felt', 'felt'], read: ['read', 'read'], drive: ['drove', 'driven'],
    think: ['thought', 'thought'], begin: ['began', 'begun'],
    understand: ['understood', 'understood'], lose: ['lost', 'lost'],
    find: ['found', 'found'], show: ['showed', 'shown'], cost: ['cost', 'cost'],
    pay: ['paid', 'paid'], take: ['took', 'taken'], write: ['wrote', 'written'],
    break: ['broke', 'broken'], speak: ['spoke', 'spoken'], buy: ['bought', 'bought'],
    win: ['won', 'won'], sing: ['sang', 'sung'], eat: ['ate', 'eaten'],
    drink: ['drank', 'drunk'], run: ['ran', 'run'], sell: ['sold', 'sold'],
    forget: ['forgot', 'forgotten'], draw: ['drew', 'drawn'], swim: ['swam', 'swum'],
    hide: ['hid', 'hidden'], build: ['built', 'built'],
    /* The sixty heads below are irregular in English and were producing
     * "I have geted", "I have becomed", "I have seted out" — get alone is the
     * gloss head of 29 Spanish verbs, so this was visible everywhere a
     * conjugation is prompted by meaning rather than by label. */
    get: ['got', 'got'], become: ['became', 'become'], make: ['made', 'made'],
    throw: ['threw', 'thrown'], cut: ['cut', 'cut'], freeze: ['froze', 'frozen'],
    grow: ['grew', 'grown'], sit: ['sat', 'sat'], spread: ['spread', 'spread'],
    broadcast: ['broadcast', 'broadcast'], choose: ['chose', 'chosen'],
    fight: ['fought', 'fought'], hold: ['held', 'held'], keep: ['kept', 'kept'],
    let: ['let', 'let'], send: ['sent', 'sent'], shrink: ['shrank', 'shrunk'],
    spend: ['spent', 'spent'], stick: ['stuck', 'stuck'], bear: ['bore', 'borne'],
    bend: ['bent', 'bent'], bet: ['bet', 'bet'], blow: ['blew', 'blown'],
    deal: ['dealt', 'dealt'], feed: ['fed', 'fed'], flee: ['fled', 'fled'],
    fly: ['flew', 'flown'], forbid: ['forbade', 'forbidden'],
    forgive: ['forgave', 'forgiven'], grind: ['ground', 'ground'],
    hang: ['hung', 'hung'], hurt: ['hurt', 'hurt'], lend: ['lent', 'lent'],
    lie: ['lay', 'lain'], mean: ['meant', 'meant'], meet: ['met', 'met'],
    overcome: ['overcame', 'overcome'], ride: ['rode', 'ridden'],
    rise: ['rose', 'risen'], set: ['set', 'set'], sew: ['sewed', 'sewn'],
    shine: ['shone', 'shone'], shoot: ['shot', 'shot'], sink: ['sank', 'sunk'],
    slide: ['slid', 'slid'], sow: ['sowed', 'sown'], spin: ['spun', 'spun'],
    spit: ['spat', 'spat'], split: ['split', 'split'], stand: ['stood', 'stood'],
    steal: ['stole', 'stolen'], sting: ['stung', 'stung'], swear: ['swore', 'sworn'],
    teach: ['taught', 'taught'], upset: ['upset', 'upset'], wake: ['woke', 'woken'],
    wear: ['wore', 'worn'], withdraw: ['withdrew', 'withdrawn'],
    // regular verbs whose -ed spelling doubles the final consonant
    prefer: ['preferred', 'preferred'], occur: ['occurred', 'occurred'],
    permit: ['permitted', 'permitted'], admit: ['admitted', 'admitted']
};

/* "to know (facts)" -> { base: 'know', qualifier: 'facts' }. A gloss lists
 * alternatives with a slash OR a comma ("to dress, to wear"); only the first
 * is the phrase to build an English tense from. */
function enBaseAndQualifier(en: string): { base: string; qualifier: string | null } {
  let qualifier: string | null = null;
  let rest = en;
  const m = rest.match(/\(([^)]+)\)/);
  if (m) { qualifier = m[1]; rest = rest.replace(m[0], '').replace(/\s+/g, ' ').trim(); }
  const first = rest.split(/\s*[/,]\s*/)[0].trim().replace(/^to\s+/, '');
  return { base: first, qualifier };
}

function enPresent3rd(head: string): string {
  if (head === 'have') return 'has';
  if (/[^aeiou]y$/.test(head)) return head.slice(0, -1) + 'ies';
  if (/(sh|ch|[sxzo])$/.test(head)) return head + 'es';
  return head + 's';
}
function enPast(head: string): string {
  const irr = EN_IRREGULAR[head];
  if (irr) return irr[0];
  if (/[^aeiou]y$/.test(head)) return head.slice(0, -1) + 'ied';
  if (/e$/.test(head)) return head + 'd';
  return head + 'ed';
}
function enParticiple(head: string): string {
  const irr = EN_IRREGULAR[head];
  return irr ? irr[1] : enPast(head);
}
const reattach = (h: string, rest: string) => (rest ? h + ' ' + rest : h);

export interface EnPhrase { text: string; marker: string | null }

/** marker is non-null only when English can't distinguish this form from
 *  another Spanish form without more context. */
export function enPhrase(v: Pick<Verb, 'en'>, tense: TenseKey, personIdx: number): EnPhrase {
  const bq = enBaseAndQualifier(v.en);
  const parts = bq.base.split(' ');
  const head = parts[0], rest = parts.slice(1).join(' ');
  const q = bq.qualifier ? ' (' + bq.qualifier + ')' : '';
  let marker: string | null = null;
  let phrase: string | undefined;

  if (tense === 'imperativo' || tense === 'impneg') {
    const p = EN_IMP_PERSONS[personIdx];
    const neg = tense === 'impneg';
    if (p === 'nosotros') phrase = (neg ? "let's not " : "let's ") + bq.base + '!';
    else { phrase = (neg ? "don't " : '') + reattach(head, rest) + '!'; marker = p; }
    return { text: phrase + q, marker };
  }

  const subj = EN_SUBJECTS[personIdx];
  const withSubj = (vp: string) => subj + ' ' + vp;
  const has = personIdx === 2 ? 'has' : 'have';
  const subjunctive = tense === 'presubj' || tense === 'impsubj' || tense === 'impsubjse' || tense === 'perfsubj' ||
    tense === 'pluscsubj' || tense === 'pluscsubjse' || tense === 'futsubj';

  if (head === 'be' && tense === 'presente') {
    phrase = withSubj(reattach(['am', 'are', 'is', 'are', 'are', 'are'][personIdx], rest));
  } else if (head === 'be' && (tense === 'preterito' || tense === 'impsubj' || tense === 'impsubjse')) {
    phrase = withSubj(reattach(['was', 'were', 'was', 'were', 'were', 'were'][personIdx], rest));
  } else {
    switch (tense) {
      case 'presente': phrase = withSubj(personIdx === 2 ? reattach(enPresent3rd(head), rest) : reattach(head, rest)); break;
      case 'preterito': phrase = withSubj(reattach(enPast(head), rest)); break;
      case 'imperfecto': phrase = withSubj('used to ' + reattach(head, rest)); break;
      case 'futuro': phrase = withSubj('will ' + reattach(head, rest)); break;
      case 'condicional': phrase = withSubj('would ' + reattach(head, rest)); break;
      case 'perfecto': case 'perfsubj': phrase = withSubj(has + ' ' + reattach(enParticiple(head), rest)); break;
      case 'plusc': case 'pluscsubj': case 'pluscsubjse': phrase = withSubj('had ' + reattach(enParticiple(head), rest)); break;
      case 'futperf': phrase = withSubj('will have ' + reattach(enParticiple(head), rest)); break;
      case 'condperf': phrase = withSubj('would have ' + reattach(enParticiple(head), rest)); break;
      case 'presubj': case 'futsubj': phrase = withSubj(reattach(head, rest)); break;
      case 'impsubj': case 'impsubjse': phrase = withSubj(reattach(enPast(head), rest)); break;
    }
  }
  if (subjunctive) marker = 'subjunctive';
  return { text: phrase + q, marker };
}
