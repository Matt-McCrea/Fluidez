# Linguistics audit: band A2 (units 15 to 27)

Prefix LA2. Claims file: `docs/swarm-audit/claims/L-A2.jsonl` (72 claims: 5 high, 29 medium, 38 low, no critical).

## Verdict in one paragraph

The Spanish itself is very good. In 737 sampled bank sentences, 6 sample chapters and every A2 script, I found no ungrammatical Spanish taught as correct and only one clearly wrong translation. What is weak is the explanation layer. Too many rules state an absolute that real Spanish, and often the app's own bank, contradicts: pitfalls that brand good Spanish as wrong, and take-away tests that fail on the lesson's own examples. The worst is the old "a stretch of time takes the imperfect" fallacy in `g:cuando-indicative`. These are cheap text fixes. The content is more accurate than the rules that describe it, so a learner who trusts the examples does better than one who trusts the rules, which is the wrong way round.

## 1. What was investigated

Fully read, from source JSON (long lines were cut off when reading the evidence pack, so I re-rendered every field):

- All 37 A2 grammar scripts: hook, examples, rule, small print, every Read and Pick, every Your Turn with accepts and whys, every pitfall.
- All 35 A2 pattern scripts (the evidence file's "sample" is the complete A2 set in that file: "every 1th of 35").
- All 16 A2 contrast scripts. Not required by the brief, but they carry half the rule content.
- The 737-row bank sample, line by line for wrong or unnatural Spanish and wrong English.
- The 6 sample chapters (of 44).

Measured across all 13,263 A2 bank sentences (units 15 to 27) with scripts: mood after *si*, *cuando*, *ojalá*, *espero que*, *aunque*; clitic order; enclitic accents; personal *a*; noun gender; *hay* with definite articles; *gustar*-type agreement; participle agreement; Peninsular vocabulary; tú and usted labels against verb forms; dashes; inverted punctuation; accents on *tu/tú*, *el/él*, *se/sé*, *esta/está*. Also a script-wide extraction of every "always, never, only" claim in A2, each tested against the bank.

Cross-read for context: `g:pret-vs-imperfect`, `x:pret-imp`, `g:imperfect-progressive`, `g:comparatives`, `g:commands-usted`, `g:subj-purpose-full`, `g:subj-past-triggers`.

Played: one real session through `tools/playtest/render.ts` (unit 17, day 1). I confirmed in `src/ui/blocks/teach.tsx` and `src/ui/screens/reference/index.tsx` that pitfalls reach the learner twice, as a teach card and again in Reference, and that `bundle.title` shows node titles.

## 2. Evidence from the actual application

**The mechanical gate works.** Every one of these scans over 13,263 sentences came back empty or with only false positives:

| Check | Real hits |
|---|---|
| *si* or *cuando* with future; *cuando* with subjunctive before u32 | 0 |
| *ojalá* or *espero que* with indicative; *aunque* with subjunctive before u44 | 0 |
| *le lo*, *lo me*, *hay el*, *más mejor*, *muy riquísimo* | 0 |
| Gender mismatches on *mano, foto, día, problema, mapa* and similar | 0 |
| Enclitic forms missing an accent (*dámelo*, *lavándose*) | 0 |
| Peninsular vocabulary (*coche, zumo, móvil, ordenador, conducir*) | 0 |
| usted label with tú forms, or the reverse | 0 |
| Missing personal *a* with names or relatives | 0 |
| Dashes in learner text | 0 |

**The rules are contradicted by the bank.** This is the core pattern. Examples, each checked in source:

| Rule says | The app also says |
|---|---|
| "A stretch of time ... takes the describing past" (`g:cuando-indicative`) | 28 A2 sentences with a duration in the preterite, including *Hernando fue taxista durante cuarenta años* (u21-0386) |
| Both sides of *mientras* usually take the describing past | *Mientras esperábamos, tomamos un tinto* (u17-t-cuando-indicative-0024), in that same node's own set |
| *Me cae bien* is for people, never food | *Esta comida me cae mal* (u15-1009), tagged to that lesson |
| *Mariana dijo que va a llamar* is wrong | *Vale me dijo que se va para Medellín* (u26-0033) |
| *Para que* "always takes the present subjunctive" | *Llamé para que me explicaran el contrato* (u41-0127) |
| "Right before a noun, use *qué*" | *¿Cuál camisa?* (`p:el-rojo-la-grande` hook), *¿Cuáles botas quiere?* (`p:el-azul`) |
| With a past verb, "plain *hace*, no *que*" | About 14 sentences tagged `g:hace-que-desde`, such as *Hace seis meses que me mudé a este barrio* (u24-0521) |
| *quien* "needs a comma or a word like *con*" | *Fue Vale quien hizo el pan*, in that same script's examples |
| "*Había un accidente*" marked wrong | *Había un accidente en la carretera y esperamos dos horas* (u18-0400) |

In every row the sentence is right and the rule is wrong.

**In a real session,** Your Turn cards follow the rule, with the `why` as the feedback, so a false `why` is the last thing the learner reads after getting something right. The `accept` lists are short and hand-written, so correct alternatives such as *Hace dos años que vine aquí* are rejected and then explained with a false reason.

## 3. Specific problems discovered

Full evidence, authority and paste-ready replacements are in the claims file. IDs below refer to it.

### High

**P1. The length fallacy in the past tenses.** LA2-001, 002, 003. `g:cuando-indicative`, u17 d7.
Quote: "A stretch of time or an old habit takes the describing past"; "Being a kid is a whole stretch of time"; "Childhood isn't one moment, it's a whole stretch, so *era*."
Why it matters: length does not choose the past, viewpoint does. This is the exact belief that produces *Vivía en Toronto diez años* and *Hernando era taxista durante cuarenta años*, the most persistent past-tense error among English speakers. It also undoes `x:pret-imp` (u12), which already has the right idea: *llovió toda la noche* "wraps a whole night up as one finished thing". The right model exists and gets overwritten five units later.
Fix: reuse the u12 wording. Background you stand inside, against an event wrapped up as finished, with a line saying length does not decide it.

**P2. Correct reported speech marked as an error.** LA2-004, 006. `g:reported-past-basic`, u25 d7.
Quote: wrong *Mariana dijo que va a llamar*, "the same shift English makes".
Why it matters: when a plan still stands, the present is normal in both languages. The learner is taught to hear natural Spanish as a mistake, and the answer is rejected in Your Turn.
Fix: replace the pitfall with a real error, and add one line to the rule saying a fact or plan that still holds can stay in the present.

**P3. The article test fails on its own hook.** LA2-005. `g:article-uses`, u19 d7.
Quote: "Quick test: if English could add in general, Spanish wants the article."
Why it matters: "I don't drink coffee in general at night" passes the test, and the hook's answer is *No tomo café*. Pitfall 3 then marks *Tomo el café todos los días* wrong. This is the sentence the lesson exists to give the learner to keep, and it points the wrong way for every habit with *tomar, comprar, tener*.
Fix: the whole category against some of it. Replacement in the claim.

### Medium

| Ref | Locus | Problem | Learner consequence |
|---|---|---|---|
| P4, LA2-007 | `g:para-que` small print | "always takes the present subjunctive" is false | Blocks *para que viniera* at B1 |
| P5, LA2-008, 009 | `g:parecer-quedar` | *caer bien* with food denied | Misreads "it disagreed with me" as a dislike |
| P6, LA2-010, 011 | `g:cuando-indicative` | *mientras* with an event in the main clause hidden | Writes *sonaba el teléfono* |
| P7, LA2-012 to 015, 035 to 037 | `g:relatives-donde-lo-que`, `g:cuando-indicative` | Hidden questions absent: "the accent is only for questions", "in a statement ... *lo que*", yet u17 taught *No sé qué hacer*, *No sé dónde dejar el carro*. *No entiendo qué dices* is correct and treated as wrong. *quien* rule contradicted by its own example | Two lessons a few days apart appear to conflict; drops accents in *no sé dónde* |
| P8, LA2-016, 017 | `g:que-vs-cual` | *cuál* plus noun denied, though the app uses it | Told that what they hear in Bogotá is wrong |
| P9, LA2-018, 019 | `p:no-es-nada-adj` | *demasiado* "always a complaint" | Reads Latin American praise as criticism |
| P10, LA2-020 | `g:ser-estar-adjectives` | *está* = "right now" | Stuck on *está casado*, *están separados desde hace años*. The portrait and snapshot model sits unused in the next day's small print |
| P11, LA2-021 to 023 | `x:hace-desde-hace`, `g:hace-que-desde` | "no *que*" with a past verb is false | Correct answer rejected, and 14 tagged sentences go unexplained |
| P12, LA2-024, 025 | `x:ir-a-future`, `g:future-promises` | Nothing explains on-the-spot "I'll" as the present, though the bank does it constantly (*yo pago*, *yo cierro*) | Says *Yo pagaré*, stilted, for life |
| P13, LA2-026 | `g:conditional` | "would or could" = *-ría*, with no warning about *could* as *podía* | Says *Podría nadar a los diez años* |
| P14, LA2-027 | `g:subj-wishes` against `g:subj-emotion-intro` | "A hope isn't a fact yet" is then contradicted by "it's a fact" and the same form | Model collapses at u27, and again at B1 |
| P15, LA2-028 | `g:subj-irregulars` | No rule for boot verbs in the we form. The I-form trick yields *piensemos*, *duermamos* | Wrong forms, with no way to self-correct |
| P16, LA2-029 | `g:cuando-indicative` | *siempre que* taught, *cada vez que* absent until u30 | First tool for "whenever" is the ambiguous one |
| P17, LA2-030 | bank u20-0624 | *¿Cómo se llamará el nuevo socio?* = "What will the new partner be called?" Tagged conjecture. This is the one clear mistranslation I found | Reinforces the confusion the unit exists to prevent |
| P18, LA2-031 | `p:event-ser-en` | Good Spanish marked wrong, against the scene and event model | Undermines the two-pasts model |
| P19, LA2-032 | `g:diminutives` | Rule covers only *-o* and *-a*, yet the script says *Pobrecito* and the bank says *cafecito* | *cafeíto* |
| P20, LA2-033 | `g:exclamations` title | *¡Qué tan lindo!* not what the script teaches (*¡Tan lindo!*) | Learns a phrase no lesson supports |
| P21, LA2-034 | `g:subj-emotion-intro` | *¡Qué bueno que viniste!* in the bank, unexplained | Thinks the bank is wrong, or the rule is |

### Low

LA2-038 to 063 cover small overclaims and polish: "Never *en*", "Per is always *por*", "*sino* only after *no*", "*Haya* has just the one form", `momentito` as a mistake, *Soy cansado* explained wrongly, *si tendrás* shown three units before the future exists, "wishing form" against "wish form", and missing *usted* in the *se la di* gloss. LA2-064 to 072 fix *se rió* to *se rio*: the app writes *rio* 87 times and *rió* 24 times, so it is also inconsistent within the same story arc (ch055 against ch063).

## 4. What the application does well and must be preserved

- **Bridges from what's known.** "It's the *usted* command, with the usual ending for the person" (`g:subj-wanting`) is the best possible introduction to the subjunctive: no new paradigm, one old one reused. Keep it.
- **`g:hace-que-desde`**: "Spanish notices that you still live here." A true, reusable reason in one line. This is the standard the other rules should meet.
- **`g:subj-emotion-intro`**: "you're reacting to the fact, not reporting it." The real unifying idea of the subjunctive, stated honestly.
- **`g:por-para-1`**: *para* as an arrow pointing ahead. Holds up, and *x:por-para*'s *para ti / por ti* pair is clean.
- **`g:le-doubling` pitfall 0**: "It isn't wrong grammar, but it sounds like a form." That is the correct way to write a pitfall, and the model for most fixes here.
- **`x:ser-event-estar-location` pitfall 1**: "You'll hear *está* in casual speech, but *es* is always right." Same honesty.
- **Colombian accuracy.** *Quedo atento a su respuesta*, *Cordial saludo*, *¿Me la puedo medir?*, *me da pena* as embarrassment, *Qué pena con usted*, *ir a cine*, *la pasé*, *¿Me regala...?*, *mija* with *usted* from a paisa mother, *dizque*, *cuadremos*, *consignar*, *estrato*, *-ico* after *t*. Rare and valuable.
- **Pattern scripts generally.** Sharper than the grammar scripts. `p:llevar-traer`, `p:te-importaria` ("hopes for a no") and `p:el-rojo-la-grande` are excellent.
- **Story Spanish.** Natural, funny, and level-appropriate in all six chapters sampled. Nothing to correct apart from the *rió* spelling.
- **The gate.** See section 2. It should be credited for the absence of mechanical errors.

## 5. Missing capabilities

1. **Preterite meaning shifts.** *Supe* (found out), *conocí* (met), *no quise* (refused), *quise* (tried), *pude* (managed), *tuve* (got). In rule and small-print text across all 916 scripts I found only one line on this, about *no pude*, in `g:preterite-irregular-strong`. Bank translations are right (u26-0565 *¿Cómo supo la verdad?* = "find out") but nothing tells the learner why. This is a real gap in the past-tense strand.
2. **The we command.** *Cuadremos*, *Evitemos*, *Adelantemos*, *No peleemos*: 39 A2 sentences translate as "Let's" with a form other than *vamos*. No grammar node teaches it. Only the chunk *cuadremos* and passing lines in two pattern scripts (`p:brindo-por`, `p:ajustarse-a`) touch it.
3. **Hidden questions before u37.** A one-line note from u17 would solve P7, without moving the node.
4. **A checker response for "correct, but not what we're practising".** Rejecting *Mariana dijo que va a llamar* and *Hace dos años que vine aquí* is the wrong outcome. The learner should hear that it's correct, then be asked for the target form.
5. **A lint for over-absolute rules.** See recommendation 4.
6. ***Aún*.** Lexicon rank 231, band A1, yet only 8 of 72,693 bank sentences use it, none before u40, while it is routine in written Latin American Spanish. A reader moving to real text meets it constantly.

## 6. Recommended improvements

1. **Apply the 5 high and 29 medium claims.** Almost all are one-sentence text changes.
2. **Rewrite pitfalls that aren't errors using the "Not wrong, but..." voice** the app already has. Reserve the wrong slot for real errors: LA2-004, 015, 031, 040, 042, 044, 048.
3. **One unified idea for the subjunctive, stated early.** Keep the friendly label "wish form", but give the reason from day one: Spanish uses it when the clause isn't what you're telling. You want it, hope it or react to it. Then u21, u22 and u27 tell one story, and B1 doubt and value slot in.
4. **Add a content check that flags "always", "never" and "only" in rule, small print and pitfall text,** then have the owner or a model confirm each. I extracted about 150 such sentences in A2 alone; about a dozen were false. Cheap and repeatable for every band.
5. **Check pitfalls against the bank.** For every `wrong` sentence, search the bank for the same construction. That single check would have caught P2, P5, P8, P11 and P18 automatically.
6. **Widen `accept` wherever a pitfall is softened,** as noted in the claims.

## 7. Uncertainties and limitations

**Not inspected:** A2 scenes and writing tasks; A2 chapters beyond the 6 sampled (38 of 44 unread, apart from a *rió* search); bank sentences outside the 737 sampled except through the scans listed, which catch form, not meaning. So the count of mistranslations is a floor. I played one session, not a whole unit, and did not use the browser driver.

**Sources.** rae.es returned 403 to direct fetches, so I could not open DPD entries. *Demasiado* as an intensifier in much of America and the *rio* spelling are supported by search summaries of RAE material; *se los dije* by a search summary of the RAE grammar and Moreno de Alba (2013). The rest of the authority cited in claims is from memory of the standard references. **Least verified:**

- LA2-016, *cuál* plus noun: my recollection of the DPD could not be confirmed, and two searches found nothing either way. The case rests on the app's own Latin American content. Generated scripts are not proof of native usage, so this deserves a native check.
- LA2-018, 019: the source says "much of America"; that Colombia is included is my own knowledge.
- LA2-034, LA2-055: Colombian frequency is judgement.
- LA2-029: "the one you'll hear most" is judgement, with no corpus count.
- LA2-043, 044, 045: lowest confidence, 0.6 to 0.65. A native Colombian reader should rule on them first.

**Wording of claims.** Replacements for the two pitfall pairs (LA2-004, 015) are JSON objects, not plain strings. LA2-050 has a null replacement: delete that pitfall. Several claims say to widen `accept`, which sits outside the quoted field.

**Standing decisions.** *Hasta* in Colombian speech can carry "not until" (*Abrimos hasta las dos*, u22-0311), which may confuse a learner in Bogotá. I recall the DPD describing this but could not open it, so I raise it here rather than as a claim. Both *por la mañana* and *en la mañana* appear; my impression is that *en la* is more usual in Colombia, but the checkers accept both where I looked, so I did not file it. The English mixes "mum" (53) with "mom" (178) and "neighbour" (152) with "neighbor" (171) in A2. That is polish, outside my remit, but noted. Bank row u25-0227 *Es un amor* is tagged `c:pan-de-dios`, which looks like a tagging slip.

**Sequencing opinion, not a defect.** The *-ré* forms arrive through conjecture (u20 d1) before plain future (u20 d3). `app/docs/unit-map.md` records this as deliberate. I would teach forecasts first, since conjecture is the rarer use, but it's defensible.

## 8. Suggested implementation priorities

1. **Today, under an hour of editing:** LA2-001 to 005 and 006. The past-tense model, reported speech and the article test.
2. **Next:** the contradictions the bank already exposes, LA2-007 to 015, 021 to 023, 031. Mechanical and high confidence.
3. **Then the missing teaching lines:** LA2-024 to 026 and 028, the "I'll", "could" and boot-verb gaps. Highest learner value per word added.
4. **Native review before applying:** LA2-016 to 019, 033, 034, 043 to 045, 048, 055.
5. **Spelling sweep:** LA2-064 to 072, plus the same fix in later bands, and *guión* in u47 and ch151, ch152.
6. **Then build:** the absolute-claim lint and the pitfall-against-bank check, and run both on every band. Add the two teaching gaps: preterite meaning shifts and the we command.
