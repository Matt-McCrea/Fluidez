# Verb gaps: the Verbos sentence bank (spec)

Verbos shows a Spanish sentence with one verb missing and its infinitive in brackets.
The player taps (or, once they know it, types) the form. This bank is the most valuable
content in Juegos, so the bar is high.

## The one rule

**The Spanish sentence alone must decide the answer for someone who knows the rules.**
Not the English, not a label. A player who knows when Spanish uses the imperfect
subjunctive must be able to see, from the sentence, that it is *hiciera* and not *haga*. A player who does not know gets it wrong, reads the
one-line reason, and learns the rule. If two options could both be defended by a native
speaker, the item is broken.

So every sentence carries its **trigger** in plain sight: the time marker, the main verb,
the conjunction, the *si* clause, the vocative. Never "(subjunctive)", never a tense name.

## Format

One JSON file per tense in `tools/verbgaps/raw/<tense>.json`, an array of:

```json
{
  "q": "Ojalá que mañana no ___ (llover) durante el partido.",
  "inf": "llover",
  "tense": "presubj",
  "person": "él/ella",
  "answer": "llueva",
  "use": "ojalá + presente de subjuntivo: deseo posible",
  "confuse": ["presente", "impsubj", "futuro"],
  "why_es": "Ojalá con un deseo que todavía puede cumplirse pide presente de subjuntivo.",
  "why_en": "Ojalá with a wish that can still come true takes the present subjunctive.",
  "en": "I hope it doesn't rain during the match tomorrow.",
  "band": "B1"
}
```

- `q`: one gap written `___`, immediately followed by ` (infinitive)`. The gapped
  form is ONE verb form; compound tenses gap the whole thing (*había comido*, *hubiera
  dicho*). Reflexive pronouns stay OUTSIDE the gap ("Ella se ___ (levantar)"), and
  so do object pronouns before the verb ("Te lo ___ (decir)"). For imperatives, avoid
  attached pronouns; use a separate object instead ("___ (cerrar) la puerta, por favor").
  Negative imperative: the "no" is part of the answer (*no hagas*), and the sentence is
  written "___ (hacer) eso, por favor" with the trigger elsewhere, or "Por favor, ___
  (tocar) nada" etc. Make it read naturally.
- `tense`: one of `presente preterito imperfecto futuro condicional perfecto plusc
  futperf condperf presubj impsubj perfsubj pluscsubj imperativo impneg`.
  `pluscsubj` is *hubiera + participio* (the engine builds it from haber's imperfect
  subjunctive and the participle).
- `person`: exactly one of `yo`, `tú`, `él/ella` (also usted), `nosotros`, `ellos` (also
  ellas, ustedes). Imperatives: `tú`, `usted`, `nosotros`, `ustedes`. **Never vosotros.**
- `answer`: the form you intend. The builder recomputes it with the app's engine; a
  mismatch is an error, so this catches person slips. Imperfect subjunctive: use the
  -ra form (the builder also accepts -se).
- `confuse`: 2 to 4 tenses a learner would plausibly confuse HERE. The builder conjugates
  them in the same person to make the wrong options. Choose them to teach: for
  *si tuviera* the confusions are condicional and presubj; for *cuando llegue* they are
  futuro and presente. Never list a tense that would ALSO be correct in this sentence.
- `use`: which use of the tense this sentence practises (from the list below), in Spanish.
- `why_es` / `why_en`: one short sentence each, under 110 characters, naming the trigger
  and the rule. Shown after a miss. No jargon beyond tense names; no dashes.
- `en`: a natural English translation (shown only on request, after the attempt).
- `band`: A1, A2, B1, B2 or C1, by how hard the sentence and its use are.

## Language

- Latin American Spanish as spoken in Colombia: *ustedes*, never *vosotros*; *carro,
  celular, computador, manejar, papa, jugo, plata, apartamento, tomar el bus*. Never
  *coche, móvil, ordenador, conducir, vale, guay, tío* (as "guy"), *coger*.
- In Latin America the **preterite** covers events of today and this week ("Hoy
  desayuné tarde"). Use the **present perfect** for experience, *ya / todavía no /
  alguna vez / nunca / últimamente*, and results that matter now. Never write a
  perfect that a Colombian would say in the preterite.
- Everyday, natural, specific sentences: people, places, work, family, food, plans,
  feelings. Varied subjects and names (Ana, Camilo, Valentina, mi jefe, los vecinos).
  No textbook filler ("El hombre come la manzana"). 5 to 14 words; most 7 to 11.
- Accents exactly right (sí/si, más/mas, él/el, tú/tu, qué/que, aún/aun).
- No dashes of any kind in Spanish or English.
- No two sentences with the same frame ("Espero que tú ___ ...") more than three times
  in a file; vary main verbs, triggers and word order.

## Verbs

Use `tools/verbgaps/verbs.txt` (the 260 most frequent verbs, in order). Weight toward the
top: the first 60 should appear most, every verb in the top 150 at least once across a
tense where it fits, and irregulars (ser, ir, tener, hacer, poder, decir, poner, venir,
saber, querer, salir, traer, dar, ver, -ducir verbs like traducir and producir) often. At most
4 sentences per verb per tense.

## Persons

Spread across persons. Make the person unambiguous from the sentence itself: an explicit
subject, a name, a vocative, a clitic, a possessive or agreement elsewhere. Never put the
person in the brackets ("(comer, tú)" is not allowed): the brackets hold only the
infinitive.

## Tenses: uses, triggers and confusions

Aim for **150 sentences per tense**, spread across the uses listed (roughly evenly unless
noted), and across bands where the use allows.

**presente**: habitual (siempre, todos los días, los lunes), current state or fact,
general truth, near future with a marker (mañana, esta noche), *desde hace*, *si* +
presente in real conditions. Confuse: preterito, imperfecto, presubj, futuro.

**preterito**: completed event with a time point (ayer, anoche, el sábado, hoy en la
mañana, hace dos años, en 2019), a sequence of completed events, sudden event
interrupting (cuando + preterito), a bounded period (durante tres horas, toda la tarde
as a closed event). Confuse: imperfecto, perfecto, presente.

**imperfecto**: habitual past (de niño, cuando vivía en, siempre, todos los veranos),
description and background (hacía frío, era tarde, estaba cansada), ongoing action
interrupted (*cuando sonó el teléfono, yo ___*), age and clock time in the past,
*mientras* + ongoing. Confuse: preterito, condicional, impsubj.

**futuro**: future with a marker (el próximo año, dentro de un mes, mañana), promises
and predictions, **probability in the present** ("¿Dónde está Ana? ___ en el trabajo";
"No contesta; ___ dormido"), *si* + presente, futuro. Confuse: presente, condicional,
presubj (especially to set up the *cuando* trap: a learner may wrongly use futuro after
*cuando*; in futuro items the main clause after *cuando* + presubj is futuro).

**condicional**: result of *si* + impsubj, politeness and soft requests (¿Me ___
ayudar?, Me ___ un café), advice (Yo que tú, ___; Deberías), future in the past (Dijo
que ___), probability in the past ("Serían las diez cuando llegó"). Confuse: futuro,
impsubj, imperfecto.

**perfecto** (he hecho): experience (alguna vez, nunca, jamás), *ya* and *todavía no*,
*últimamente*, *en lo que va del año*, results relevant now. Remember the LatAm rule
above. Confuse: preterito, plusc, perfsubj.

**plusc** (había hecho): past before another past (Cuando llegué, ya ___), *nunca
había* before a past moment, reported speech of a past-before-past (Me dijo que ya ___).
Confuse: preterito, perfecto, pluscsubj.

**futperf** (habré hecho): completed before a future point (Para el viernes ya ___;
Cuando vuelvas, ya ___), **probability about the past** ("No vino; ___ (olvidar)";
"¿Por qué llora? Se ___ caído"). Confuse: futuro, condperf, perfsubj.

**condperf** (habría hecho): unreal past result (Si hubiera sabido, te lo ___), what
would have happened, future perfect in the past (Dijo que para junio ya ___),
probability about a past before a past. Confuse: pluscsubj, condicional, futperf.

**presubj**: influence and wishes (quiero que, te pido que, ojalá with a possible wish,
espero que), emotion (me alegra que, me molesta que, siento que), doubt and denial (no
creo que, dudo que, no es verdad que), impersonal evaluations (es importante que, es
mejor que, es posible que), **cuando / en cuanto / hasta que / después de que + future
meaning**, *para que*, *antes de que*, *sin que*, *a menos que*, relative clause with an
unknown or nonexistent antecedent (Busco a alguien que ___; No hay nadie que ___),
*aunque* with a hypothetical, *tal vez / quizás* with doubt. Contrast items are welcome:
*creo que* + indicative is NOT this tense, but *no creo que* is. Confuse: presente,
impsubj, futuro, perfsubj.

**impsubj**: the same triggers with a PAST or conditional main verb (quería que, le pedí
que, me alegró que, no creía que, era importante que, para que after a past), *si* +
unreal present or future (Si ___ más tiempo, viajaría), *ojalá* with an unlikely or
impossible present wish, *como si*, *quisiera* politeness. Confuse: presubj, condicional,
imperfecto, pluscsubj.

**perfsubj** (haya hecho): subjunctive triggers about a completed action, with a present
or future main verb (Espero que ya ___ (llegar); No creo que ___ terminado; Me alegra
que ___; Cuando ___ terminado, avísame; Es posible que se ___ perdido). Confuse:
perfecto, presubj, pluscsubj.

**pluscsubj** (hubiera hecho): *si* + unreal past (Si ___ (saber), te habría llamado),
*ojalá* about the past (Ojalá no ___ dicho eso), past-main-clause triggers about an
earlier completed action (No creía que ya ___ salido; Me sorprendió que no ___ venido),
*como si* + earlier past. Confuse: plusc, impsubj, condperf.

**imperativo** (affirmative): instructions and requests with a clear addressee: a
vocative or a name (Camilo, ___...; Señora, ___...; Chicos, ___...), *por favor*,
recipes and directions for *usted/ustedes*, *nosotros* suggestions (___ (salir) ya,
que es tarde). Confuse: presente, presubj (only when the form differs), impneg.

**impneg** (no hagas): prohibitions and warnings with a clear addressee (Niños, no ___
(correr) en la cocina; Señor, no ___ aquí). Confuse: imperativo, presente, presubj only
where the form differs.

## Bands

A1: presente, simple imperatives, *ir a* contexts. A2: preterito, imperfecto, perfecto,
futuro, the common imperatives. B1: condicional, presubj (common triggers), plusc,
impneg. B2: impsubj, perfsubj, futperf, condperf, the harder presubj triggers. C1:
pluscsubj, mixed conditionals, subtle contrasts. A tense can have sentences above its
usual band when the use is harder.

## What the builder checks (tools/build-verb-gaps.js)

Answer equals the engine's form; every `confuse` tense yields a form different from the
answer; exactly one gap; the infinitive is in the verb list or the engine knows it; no
vosotros; length 5 to 14 words; no dashes; no tense names in `q`; why under 110
characters. Then `npm run gate` runs its dialect, accent and duplicate checks, and blind
judges solve every item without the key: an item two judges answer differently from
the key is rewritten or dropped.
