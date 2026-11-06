# Juegos frequency report (6 Nov 2026)

Stage 2 of docs/juegos-refocus.md. Data: `data/word-rank.js` (496 KB), built by
`node tools/build-frequency.js` from `tools/freq/es_50k.txt` (OpenSubtitles 2018 via
hermitdave/FrequencyWords, CC BY-SA 4.0; the derived ranking is shared under the same licence).
Nothing in gameplay uses it yet.

## What was built

| List | Entries | Notes |
|---|---|---|
| words | 4,898 | VOCAB plus graph lexemes, merged and deduped (cap is 6,000, fewer exist). 309 at the tail have no count in the list. |
| verbs | 1,422 | All 1,166 in data/verbs.js plus 256 verbs found only in VOCAB or the graph (conjugated by the engine's regular rules plus stem hints). 238 are reflexives; 146 of those sit directly after their base verb. |
| phrases | 2,000 | Top 2,000 of 2,744 multi-word entries. |

Left out: 1 notation entry (`válido de... a...`), 14 proper names and acronyms (la Torá, Europa, la UCI, el ADN, Venus, Renfe...), 1 vulgar verb (follar), 58 phrases that are only a verb pattern
(`irse a`, `ir salir estar`, `hacer de`, `vivir con`). `el/la estudiante` style entries were kept (the slash is a gender marker, not notation).
Entries are deduped on the Spanish without its article, VOCAB first, so a homograph with two glosses (bajo under/low) keeps one; musical-note glosses never shadow the real word (mi, si).

## Sanity check: the top of each list as ranked

### Top 60 words
| # | es | en | score |
|---|---|---|---|
| 1 | de | of, from | 14,459,520 |
| 2 | que | that; than | 14,421,005 |
| 3 | no | no | 12,379,505 |
| 4 | a | to, at | 9,549,646 |
| 5 | la | the | 9,125,471 |
| 6 | el | the | 7,531,226 |
| 7 | y | and | 7,128,745 |
| 8 | en | in, on, at | 6,817,324 |
| 9 | lo | him, it; the thing that is | 6,041,793 |
| 10 | un | a, an; (pl.) some | 5,605,577 |
| 11 | por | for, by, through, because of | 4,454,673 |
| 12 | qué | what | 4,166,708 |
| 13 | me | me, to me, myself | 3,927,712 |
| 14 | una | a, an | 3,846,322 |
| 15 | los | the | 3,069,193 |
| 16 | se | himself, herself, themselves; (impersonal) one | 3,058,120 |
| 17 | te | you, to you, yourself | 3,034,375 |
| 18 | con | with | 3,028,045 |
| 19 | para | for, in order to | 2,832,100 |
| 20 | esto | this (thing) | 2,743,123 |
| 21 | mi | my | 2,403,204 |
| 22 | pero | but | 2,369,484 |
| 23 | sí | yes | 2,350,514 |
| 24 | si | if, whether | 2,348,665 |
| 25 | bien | well | 2,045,290 |
| 26 | eso | that (thing) | 2,029,720 |
| 27 | su | his, her, its, their, your (formal) | 2,005,512 |
| 28 | las | the | 2,001,203 |
| 29 | yo | I | 1,915,934 |
| 30 | como | like, as; since | 1,630,651 |
| 31 | aquí | here | 1,625,090 |
| 32 | tu | your | 1,618,746 |
| 33 | bueno | good | 1,517,665 |
| 34 | más | more | 1,503,527 |
| 35 | le | to him, to her, to you (formal) | 1,432,173 |
| 36 | todo | everything / all | 1,296,897 |
| 37 | ya | already; now | 1,115,265 |
| 38 | ahora | now | 1,088,174 |
| 39 | muy | very | 1,086,248 |
| 40 | así | like this, like that | 1,050,332 |
| 41 | algo | something | 1,040,990 |
| 42 | la vez | time, instance | 962,983 |
| 43 | él | he; it | 931,487 |
| 44 | cuando | when | 931,329 |
| 45 | tú | you (informal) | 906,053 |
| 46 | nos | us, to us, ourselves | 866,968 |
| 47 | nada | nothing | 863,844 |
| 48 | cómo | how | 862,349 |
| 49 | o | or | 843,972 |
| 50 | ella | she; it | 800,671 |
| 51 | gracias | thank you | 779,503 |
| 52 | solo | only; alone, lonely | 707,562 |
| 53 | la cosa | thing | 693,855 |
| 54 | porque | because | 685,059 |
| 55 | el día | the day | 638,134 |
| 56 | ese | that | 624,205 |
| 57 | usted | you (formal) | 618,844 |
| 58 | el hombre | the man | 611,731 |
| 59 | entonces | then / so | 609,938 |
| 60 | la casa | the house | 608,025 |

### Top 40 verbs
| # | es | en | score |
|---|---|---|---|
| 1 | estar | to be (state) | 7,194,088 |
| 2 | ser | to be (essence) | 6,760,238 |
| 3 | tener | to have | 4,626,637 |
| 4 | ir | to go | 4,596,453 |
| 5 | irse | to leave / to go away | 4,562,902 |
| 6 | haber | to have (auxiliary) | 4,054,864 |
| 7 | hacer | to do / to make | 3,671,043 |
| 8 | hacerse | to become | 3,568,544 |
| 9 | poder | to be able / can | 3,583,212 |
| 10 | querer | to want / to love | 2,557,833 |
| 11 | decir | to say / to tell | 2,553,755 |
| 12 | saber | to know (facts) | 1,917,660 |
| 13 | ver | to see | 1,784,726 |
| 14 | deber | to owe / ought to | 1,183,000 |
| 15 | pasar | to pass / to happen | 1,102,832 |
| 16 | pasarse | to go too far, to overdo it | 1,100,635 |
| 17 | creer | to believe / to think | 1,097,457 |
| 18 | hablar | to speak / to talk | 899,565 |
| 19 | venir | to come | 809,954 |
| 20 | pensar | to think | 771,080 |
| 21 | esperar | to wait / to hope | 770,857 |
| 22 | dar | to give | 751,387 |
| 23 | darse | to happen, to occur; to give oneself to | 1,418,764 |
| 24 | sentir | to feel / to regret | 740,812 |
| 25 | sentirse | to feel | 743,322 |
| 26 | necesitar | to need | 676,001 |
| 27 | dejar | to leave / to let | 675,414 |
| 28 | dejarse | to let oneself, to leave behind | 671,796 |
| 29 | volver | to return / to come back | 667,395 |
| 30 | volverse | to become, to turn (change of state) | 662,636 |
| 31 | llamar | to call | 639,834 |
| 32 | llamarse | to be called | 637,957 |
| 33 | mirar | to look / to watch | 617,888 |
| 34 | parecer | to seem / to appear | 548,799 |
| 35 | parecerse | to resemble, to look alike | 548,799 |
| 36 | gustar | to be pleasing / to like | 515,875 |
| 37 | morir | to die | 513,933 |
| 38 | morirse | to die | 486,725 |
| 39 | encontrar | to find | 506,164 |
| 40 | encontrarse | to feel (health), to find oneself | 505,710 |

### Top 30 phrases
| # | es | en | score |
|---|---|---|---|
| 1 | por qué | why | 4,166,708 |
| 2 | estar bien | to be well situated/located | 2,051,444 |
| 3 | ir a ver | to go and see (a flat) | 1,784,726 |
| 4 | darse de sí | to stretch out of shape | 1,418,764 |
| 5 | de nada | you're welcome | 864,187 |
| 6 | dar la vez | to indicate whose turn it is (queue) | 751,387 |
| 7 | sentirse bien | to feel well | 743,322 |
| 8 | hacer un día | for the weather to be (nice/bad) | 638,134 |
| 9 | hacer una casa | to build a house | 608,025 |
| 10 | dejar pasar el tiempo | to let time pass | 583,571 |
| 11 | por favor | please | 530,966 |
| 12 | lo siento | I'm sorry | 512,907 |
| 13 | creer en Dios | to believe in God | 490,158 |
| 14 | tomar algo | to have a drink or bite | 475,987 |
| 15 | llevar años | to have been (doing something) for years | 461,852 |
| 16 | salir con alguien | to go out with someone | 447,141 |
| 17 | hablar bien de alguien | to speak well of someone | 447,141 |
| 18 | ponerse bien | to get better | 429,906 |
| 19 | quedarse sin | to lose (one's voice) | 397,515 |
| 20 | tener trabajo | to have a job | 375,609 |
| 21 | tener un hijo | to have a child | 352,876 |
| 22 | esperar un hijo | to be expecting a child | 352,876 |
| 23 | quedar bien | to look good, to fit well | 335,702 |
| 24 | vivir en una casa | to live in a house | 301,954 |
| 25 | deber dinero | to owe money | 300,518 |
| 26 | dejar dinero | to lend money | 300,518 |
| 27 | tener un seguro | to have insurance | 296,175 |
| 28 | ir a comer algo | to go out for a bite | 293,928 |
| 29 | comer como | to eat like (a horse, etc.) | 293,928 |
| 30 | buscar trabajo | to look for work | 286,384 |


Reading it: the top words are the glue of speech (de, que, no, a...), then verbs' friends and high-frequency nouns, which is what a subtitle corpus gives. The verb order is
estar, ser, tener, ir, haber, hacer, poder, querer, decir, saber, ver... The phrase list is dominated by PCIC verb collocations (the rarest-content-word rule lets a phrase borrow
its verb's huge total), so real everyday phrases (por qué, de nada, por favor, lo siento, buenos días) are mixed with "tener un hijo". Stage 3's phrase list should replace it, not extend it.

## Homographs and overrides handled

`tools/freq/overrides.json`. `demote` counts only 5% of the form's frequency unless a share is given; `exclude` drops the entry; `show` shows the word without its stray article.

| entry | action | note |
|---|---|---|
| la gracia | demote | gracias (thanks) is the same count; plural of gracia is not meant |
| el do | demote | 'do' is mostly English in subtitles and dos (two) is its plural spelling |
| el dicho | demote (10%) | dicho is mostly the participle of decir |
| el dado | demote (10%) | dado is mostly the participle of dar |
| el estado | demote (20%) | estado is mostly the participle of estar |
| el oído | demote (15%) | oído is mostly the participle of oír |
| el ganado | demote (15%) | ganado is mostly the participle of ganar |
| el vino | demote (30%) | vino is mostly the preterite of venir |
| el recuerdo | demote (50%) | recuerdo is often the verb (I remember) |
| el puesto | demote (40%) | puesto is often the participle of poner |
| el odio | demote (30%) | odio is often the verb (I hate) |
| el traje | demote (50%) | traje is often the verb (I brought) |
| el encuentro | demote (40%) | encuentro is often the verb (I find) |
| la muestra | demote (30%) | muestra is often the verb mostrar |
| el partido | demote (50%) | partido is often the participle of partir |
| el pedido | demote (50%) | pedido is often the participle of pedir |
| la sal | demote (50%) | sal is often the imperative of salir |
| la disculpa | demote (50%) | disculpa is often the imperative of disculpar |
| la pregunta | demote (60%) | pregunta is often the verb preguntar |
| el vestido | demote (60%) | vestido is often the participle of vestir |
| la llamada | demote (60%) | llamada is often the participle of llamar |
| el trato | demote (60%) | trato is often the verb tratar |
| el deseo | demote (60%) | deseo is often the verb (I wish) |
| el regalo | demote (70%) | regalo is often the verb (I give) |
| el sobre | demote | sobre is a preposition |
| el este | demote | este is a demonstrative |
| la buena | exclude | gloss is a layout/phrase note, unusable as a prompt |
| la mala | exclude | gloss is a layout/phrase note, unusable as a prompt |
| el buen | exclude | gloss is a layout/phrase note, unusable as a prompt |
| gran | exclude | gloss is a layout/phrase note, unusable as a prompt |
| el serio | show "serio" | adjective stored with a stray article in VOCAB; shown without it |
| el rico | show "rico" | adjective stored with a stray article in VOCAB; shown without it |
| el duro | show "duro" | adjective stored with a stray article in VOCAB; shown without it |
| la agradable | show "agradable" | adjective stored with a stray article in VOCAB; shown without it |
| el justo | show "justo" | adjective stored with a stray article in VOCAB; shown without it |
| el joven | show "joven" | adjective stored with a stray article in VOCAB; shown without it |
| el contento | show "contento" | adjective stored with a stray article in VOCAB; shown without it |
| el abierto | show "abierto" | adjective stored with a stray article in VOCAB; shown without it |
| el limpio | show "limpio" | adjective stored with a stray article in VOCAB; shown without it |
| el sucio | show "sucio" | adjective stored with a stray article in VOCAB; shown without it |
| el privado | show "privado" | adjective stored with a stray article in VOCAB; shown without it |
| el nacional | show "nacional" | adjective stored with a stray article in VOCAB; shown without it |
| el antiguo | show "antiguo" | adjective stored with a stray article in VOCAB; shown without it |
| el político | show "político" | adjective stored with a stray article in VOCAB; shown without it |
| el trabajador | show "trabajador" | adjective stored with a stray article in VOCAB; shown without it |
| el bravo | show "bravo" | adjective stored with a stray article in VOCAB; shown without it |

Automatic: noun entries whose bare form is a function word or an infinitive are demoted to 5% (only `el bajo` fired). Plural entries (personas, huevos, gracias) own their plural form, so the singular is not scored twice.
Verb forms that are really function words (para, como, sobre, entre, bajo, salvo, ...) are not counted for any verb. A verb form that is also a noun's form (cosa, trabajo, casa) counts 15%
(participles and gerunds 100%). A form two verbs share (creo: creer and crear; siento: sentir and sentar) is split in proportion to each verb's unshared total.

Not checked one by one: nouns whose form is also a verb form below rank ~1,000 (el cuento, el uso, la cena...). They are over-ranked by at most a few hundred places.

## Missing common words

Frequent forms in the top 12,000 (the top 5,000 alone give only about 60 after names are removed) that are in neither VOCAB nor the graph, folded to lemmas
(plurals, feminines, clitics such as dímelo, regular verb forms; names, profanity, interjections, foreign words and acronyms removed through `tools/freq/exclude.json`).
1,200 lemmas in total; 47 have a count over 10,000 and 113 over 5,000. `node tools/freq/missing.js` regenerates the full list.
The most important: **hay, del, algún, cualquier, ningún, demás, través, embargo, respecto, tercer, ambas, nosotras, vosotras, hubiese/estuviese/pudiese/tuviese (past subjunctive -se forms), muchísimo, poquito, cuán**.
Also note `hacerlo`-type forms are covered by their verb and not listed. Mild insults (imbécil, maldito, desgraciado, tontería) are listed on purpose; strong profanity is not.

| # | lemma | count | forms seen |
|---|---|---|---|
| 1 | del | 1,648,131 | del, deles |
| 2 | hay | 1,016,631 | hay, hayes |
| 3 | algún | 163,790 | algún |
| 4 | cualquier | 150,946 | cualquier |
| 5 | ningún | 107,193 | ningún |
| 6 | auto | 106,829 | auto, autos |
| 7 | maldita | 82,514 | maldita, malditas |
| 8 | maldito | 80,619 | maldito, malditos |
| 9 | señorita | 74,451 | señorita, señoritas |
| 10 | demás | 58,811 | demás |
| 11 | cállate | 55,856 | cállate |
| 12 | través | 47,295 | través |
| 13 | embargo | 41,642 | embargo |
| 14 | maldición | 41,392 | maldición, maldiciones |
| 15 | teniente | 39,097 | teniente, tenientes |
| 16 | prisión | 34,820 | prisión, prisiones |
| 17 | sargento | 33,525 | sargento, sargentos |
| 18 | respecto | 33,340 | respecto, respecta |
| 19 | coronel | 32,219 | coronel |
| 20 | tontería | 31,718 | tonterías, tontería |
| 21 | imbécil | 30,333 | imbécil, imbéciles |
| 22 | nena | 30,309 | nena, nenas |
| 23 | menudo | 28,249 | menudo, menudos, menuda |
| 24 | ciento | 27,976 | cientos, ciento |
| 25 | majestad | 27,624 | majestad, majestades |
| 26 | embarazada | 25,946 | embarazada, embarazadas |
| 27 | hubiese | 25,508 | hubiese, hubieses |
| 28 | señoría | 22,020 | señoría, señorías |
| 29 | nosotras | 21,518 | nosotras |
| 30 | muchísimo | 20,819 | muchísimo, muchísimos, muchísima, muchísimas |
| 31 | prisionero | 20,568 | prisioneros, prisionera, prisioneras, prisionero |
| 32 | rostro | 18,140 | rostro, rostros |
| 33 | homicidio | 18,116 | homicidio, homicidios |
| 34 | bordo | 16,829 | bordo, borda |
| 35 | violar | 15,906 | violar, violo, violas, viola |
| 36 | tercer | 15,377 | tercer |
| 37 | ambas | 14,632 | ambas |
| 38 | desgraciado | 14,496 | desgraciado, desgraciados, desgraciada |
| 39 | poquito | 13,774 | poquito |
| 40 | suicidio | 13,170 | suicidio, suicidios |
| 41 | sangrar (verb) | 12,628 | sangrar, sangro, sangras, sangra |
| 42 | cruz | 11,388 | cruz |
| 43 | hagámoslo | 11,150 | hagámoslo |
| 44 | jefa | 11,141 | jefa |
| 45 | robot | 11,029 | robot, robots |
| 46 | cuán | 10,324 | cuán |
| 47 | paliza | 10,301 | paliza, palizas |
| 48 | golf | 9,456 | golf |
| 49 | drogar (verb) | 8,713 | drogar, drogo, drogan, drogaste |
| 50 | porquería | 8,538 | porquería, porquerías |
| 51 | heroína | 8,106 | heroína, heroínas |
| 52 | envenenar (verb) | 8,000 | envenenar, envenena, envenené, envenenaste |
| 53 | resuelto | 7,949 | resuelto, resueltos, resuelta |
| 54 | háblame | 7,913 | háblame |
| 55 | enhorabuena | 7,871 | enhorabuena |
| 56 | rifle | 7,780 | rifle, rifles |
| 57 | algun | 7,529 | algun |
| 58 | reverendo | 7,521 | reverendo, reverenda |
| 59 | apuñalar (verb) | 7,397 | apuñalar, apuñalo, apuñala, apuñalé |
| 60 | alienígena | 7,266 | alienígena, alienígenas |
| 61 | chaval | 7,242 | chaval, chavales |
| 62 | gatito | 7,224 | gatito, gatitos, gatita, gatitas |
| 63 | hermanito | 7,088 | hermanito, hermanita |
| 64 | infeliz | 7,060 | infeliz, infelices |
| 65 | pervertido | 6,932 | pervertido, pervertidos, pervertida |
| 66 | duque | 6,659 | duque, duques |
| 67 | estuviese | 6,643 | estuviese, estuvieses |
| 68 | jovencita | 6,566 | jovencita, jovencitas |
| 69 | espantoso | 6,543 | espantoso, espantosos, espantosa, espantosas |
| 70 | posar (verb) | 6,538 | posar, posa, posó, posado |
| 71 | tirador | 6,466 | tirador, tiradores |
| 72 | atascado | 6,440 | atascado, atascados, atascada |
| 73 | vagabundo | 6,382 | vagabundo, vagabundos, vagabunda |
| 74 | cigarro | 6,235 | cigarro, cigarros |
| 75 | cocaína | 6,230 | cocaína |
| 76 | granjero | 6,200 | granjero, granjeros, granjera |
| 77 | alguacil | 6,198 | alguacil, alguaciles |
| 78 | matón | 6,160 | matones, matón |
| 79 | ejecución | 6,156 | ejecución, ejecuciones |
| 80 | encubierto | 6,135 | encubierto, encubiertos, encubierta, encubiertas |
| 81 | supremo | 6,120 | supremo, suprema |
| 82 | conspiración | 6,050 | conspiración, conspiraciones |
| 83 | sirviente | 5,992 | sirviente, sirvientes |
| 84 | lente | 5,926 | lentes, lente |
| 85 | vodka | 5,908 | vodka |
| 86 | bobo | 5,874 | bobo, bobos, boba |
| 87 | alfa | 5,850 | alfa, alfas |
| 88 | psicópata | 5,843 | psicópata, psicópatas |
| 89 | amiguito | 5,795 | amiguito, amiguitos, amiguita |
| 90 | ataúd | 5,781 | ataúd, ataúdes |
| 91 | latir (verb) | 5,765 | latir, latía, latido, latiendo |
| 92 | presentimiento | 5,763 | presentimiento, presentimientos |
| 93 | ebrio | 5,754 | ebrio, ebrios, ebria |
| 94 | cretino | 5,683 | cretino, cretinos, cretina |
| 95 | vagina | 5,661 | vagina, vaginas |
| 96 | gatillo | 5,635 | gatillo |
| 97 | merced | 5,624 | mercedes, merced |
| 98 | chiflado | 5,614 | chiflado, chiflados, chiflada |
| 99 | siesta | 5,540 | siesta, siestas |
| 100 | vosotras | 5,489 | vosotras |
| 101 | diosa | 5,472 | diosa, diosas |
| 102 | barón | 5,401 | barón, barones |
| 103 | presidenta | 5,385 | presidenta |
| 104 | rudo | 5,317 | rudo, rudos, ruda |
| 105 | hemorragia | 5,301 | hemorragia, hemorragias |
| 106 | espiar (verb) | 5,262 | espiar, espias, espia, espiaba |
| 107 | fugitivo | 5,209 | fugitivo, fugitivos, fugitiva |
| 108 | telegrama | 5,183 | telegrama, telegramas |
| 109 | irlandés | 5,153 | irlandés, irlandeses |
| 110 | vaquero | 5,150 | vaquero, vaquera |
| 111 | terriblemente | 5,107 | terriblemente |
| 112 | monje | 5,056 | monje, monjes |
| 113 | cadera | 5,050 | cadera, caderas |
| 114 | prométeme | 4,872 | prométeme |
| 115 | tejado | 4,858 | tejado, tejados |
| 116 | pobrecito | 4,846 | pobrecito, pobrecitos, pobrecita |
| 117 | cabrear (verb) | 4,799 | cabrear, cabreo, cabrea, cabreó |
| 118 | suplico | 4,792 | suplico, suplica |
| 119 | brigada | 4,782 | brigada, brigadas |
| 120 | excitante | 4,723 | excitante, excitantes |
| 121 | pudiese | 4,722 | pudiese, pudieses |
| 122 | villano | 4,722 | villano, villanos, villana |
| 123 | agallas | 4,707 | agallas |
| 124 | torpe | 4,686 | torpe, torpes |
| 125 | hacha | 4,685 | hacha, hachas |
| 126 | condesa | 4,647 | condesa |
| 127 | pálido | 4,638 | pálido, pálidos, pálida, pálidas |
| 128 | paranoico | 4,636 | paranoico, paranoicos, paranoica |
| 129 | mocoso | 4,561 | mocoso, mocosos, mocosa |
| 130 | papeleo | 4,546 | papeleo |
| 131 | maldad | 4,539 | maldad, maldades |
| 132 | racista | 4,503 | racista, racistas |
| 133 | medicación | 4,477 | medicación |
| 134 | jovencito | 4,456 | jovencito, jovencitos |
| 135 | gays | 4,451 | gays |
| 136 | aterrador | 4,434 | aterrador, aterradores |
| 137 | dinosaurio | 4,433 | dinosaurios, dinosaurio |
| 138 | ego | 4,432 | ego, egos |
| 139 | lira | 4,401 | liras, lira |
| 140 | furia | 4,397 | furia, furias |
| 141 | espléndido | 4,374 | espléndido, espléndida |
| 142 | veredicto | 4,354 | veredicto |
| 143 | garra | 4,334 | garras, garra |
| 144 | permíteme | 4,304 | permíteme |
| 145 | tuviese | 4,294 | tuviese, tuvieses |
| 146 | armadura | 4,282 | armadura, armaduras |
| 147 | glorioso | 4,271 | glorioso, gloriosos, gloriosa, gloriosas |
| 148 | drogadicto | 4,251 | drogadicto, drogadictos, drogadicta |
| 149 | gentil | 4,226 | gentil, gentiles |
| 150 | ingenioso | 4,204 | ingenioso, ingeniosos, ingeniosa, ingeniosas |

## Theme coverage

Rank cut-offs are within the words list. `(none)` is a word with no theme.

| theme | words ranked | top 1,000 | top 3,000 | top 6,000 |
|---|---|---|---|---|
| (none) | 2011 | 528 | 1578 | 2011 |
| naturaleza | 317 | 52 | 157 | 317 |
| politica | 200 | 44 | 108 | 200 |
| arte | 193 | 25 | 99 | 193 |
| viajes | 191 | 21 | 93 | 191 |
| relaciones | 118 | 58 | 90 | 118 |
| alimentacion | 247 | 26 | 88 | 247 |
| vivienda | 141 | 36 | 71 | 141 |
| trabajo | 114 | 22 | 64 | 114 |
| cuerpo | 111 | 23 | 63 | 111 |
| salud | 167 | 12 | 63 | 167 |
| economia | 150 | 10 | 62 | 150 |
| servicios | 94 | 19 | 59 | 94 |
| medios | 115 | 20 | 58 | 115 |
| caracter | 134 | 15 | 55 | 134 |
| educacion | 122 | 19 | 53 | 122 |
| ocio | 91 | 11 | 53 | 91 |
| compras | 106 | 16 | 52 | 106 |
| ciencia | 109 | 10 | 51 | 109 |
| identidad | 72 | 23 | 49 | 72 |
| religion | 95 | 10 | 34 | 95 |

- Untagged words in the top 1,000: 528; in the top 3,000: 1,578 (about 53%).
- Proposed rule: none applies. The graph's PCIC notion tag does map to exactly one VOCAB theme (checked: 2,476 notions, 100% pure), but every graph lexeme that carries a tag (1,347) is already a VOCAB entry with that theme.
  The 1,901 graph-only words carry no tag, so nothing was applied for them (3 themed through duplicates). The untagged top-3,000 words are mostly closed-class
  (pronouns, prepositions, adverbs, numbers, colours, connectors, time words, which VOCAB deliberately leaves out of themes) plus core nouns (verdad, momento, palabra, manera, cosa, día).
  Suggestion: leave closed-class words themeless ("Basics"), and tag the roughly 400 untagged content words in the top 3,000 by hand or through the gate in stage 3.
- Verbs and phrases: 49 of 1,422 verbs have a theme, 1,998 of 2,000 phrases do (they come from PCIC). Themes are therefore a word-list concept; verbs would be coverage-measured as one group.
- Thin themes at the top: economía (10 in the top 1,000), religión (10), ciencia (10), salud (12), ocio (11). They fill out by 3,000 but a "well filled theme" needs about 150 common words each, so the missing-words and
  untagged lists above are the raw material.

## Glosses flagged (top 2,000)

Kept as given, per the brief. These would be poor or wrong prompts:

| Entry | Gloss | Problem |
|---|---|---|
| el mono | overalls | mostly means monkey |
| la cura | priest | el cura; la cura is a cure |
| la nave | warehouse, industrial unit | ship is the common sense |
| la clara | egg white | |
| el cuerpo | body (of a letter/text) | main sense is the body |
| la acción | share, stock | action is the common sense |
| el control | test, quiz | control is the common sense |
| la pena | sentence, penalty | main uses: pity, vale la pena |
| el consejo | council, advice | advice first |
| el cambio, la vuelta | change (money) | change / return are the common senses |
| la cuenta | bill | account, count |
| el medio | medium (media) | means, middle |
| la media | sock | |
| el estudio | studio flat | study |
| el parte | bulletin, report | listed as "parte" |
| la libra | pound (500 g) | |
| la fuente | serving dish | source, fountain |
| el análisis | test, analysis (medical) | |
| el mate, el fresco, el comisario, la sesión (showing) | drink / fresco / inspector / showing | narrow senses |
| la comunidad | residents' association | |
| fabuloso | fable, myth | wrong; means fabulous |
| policial | police procedural | |
| leal | adhering to the rules... | |
| nocturno, telefónico | night, telephonic | awkward |
| la arma, la alma | | articles wrong (el arma, el alma) |
| el diamantes, la olas, las ganas, alas, bodas, botas, gafas | plural entries | fine as plurals, but the singular is also listed |
| el culpable, el responsable, el joven, el ciego | adjective-and-noun glosses | two answers in one prompt |
| importar | to import; to matter | two senses |
| soler | to usually (do) | awkward |
| many nouns | the glosses "the X" vs "X" differ between old and new entries | cosmetic |
| el contento, abierto, limpio, sucio, privado, nacional, antiguo, político, trabajador, serio, rico, duro, justo, agradable | adjectives stored with an article | shown without it (override) |
| la buena, la mala, el buen, gran | "good (layout)", "good friend (buen amigo)" | excluded |

## Decisions that differ from the brief

- Words fell short of 6,000 because the merged vocabulary has 4,898 single words; the cap stays at 6,000.
- The missing-words report reads the top 12,000 forms, not 5,000 (names crowd the short range).
- Phrase fragments that are only a verb government pattern are dropped, which the brief did not say; without it the top 30 phrases were mostly "irse a" and "hacer de".
- A reflexive verb is always placed just after its base (kept even when its gloss is the same), so nothing is dropped; the 92 reflexives without a base verb in the data rank on their own forms.
- Demotions needed a rule for how much to keep, so there is a `share` field (default 5%).
- Verbs found only in VOCAB or the graph are conjugated with the engine's regular rules plus a small stem table in build-frequency.js; their counts are approximate.

## Gloss, grammar-flag and theme review (top 2,000 words, top 300 verbs)

All of it is data in `tools/freq/glosses.json` (`{"<es as listed>": {"en", "th" (null clears), "g": 1}}`), applied by `tools/build-frequency.js`. Outside the file, every gloss only gets " / " and "; " turned into ", ". `--check` still works.

**Glosses.** 632 entries carry a new `en` (about 560 in the top 2,000 words, 46 verbs in the top 300, the rest just beyond). Rules: lead with the everyday Colombian sense, 1 to 4 words, at most two senses, verbs start with "to ". Examples: el tiempo "time, weather"; la acción "action"; el consejo "advice"; la fianza "bail, deposit"; el mono "monkey"; la cura "cure"; fabuloso "fabulous"; el don "gift, talent"; la plata "money, silver"; la pena "pity, sorrow"; el piso "floor, apartment"; la nave "ship, spaceship"; la marcha "march, gear"; la vuelta "turn, return"; el tipo "guy, type"; deber "to owe, should". Where the Spanish as written disagreed with its old gloss I glossed the Spanish as written: la cura (cure, not the priest), el brillante ("brilliant, shiny", it is not a student), el don (gift, not the title), la media, la extra, el responsable, el cabo.

**Grammar flag (`g:1`).** 23 words: la, el, lo, un, una, unos, unas, los, las, se, te, me, le, les, nos, os, mi, tu, su, nuestro, vuestro, mí, ti. They stay in the list and in coverage counts. Closed-class words that carried a wrong theme (mi arte, no relaciones, si arte, sin compras, sí relaciones, la razón, la idea) now have none (50 theme clears in all).

**Ambiguous prompts.** Disambiguated with a short note: que / eso / ese / aquello / aquel; qué, cómo, cuándo, dónde, quién, cuál, cuánto (all "? (question)") against their relative forms; adónde / adonde; tú / usted / vosotros / vos; mío / la mina; bonito / lindo / hermoso / bello / precioso / guapo; coche / carro; esposo / marido; médico / doctor; ahí / allí / allá; dentro / adentro; despacio / lentamente; seguro / seguros; computadora / ordenador; the two boss, school, shot, report, crime, language and stage pairs. Remaining near-duplicates (the note is the only difference): nunca / jamás; ya / ahora; aún / todavía; estupendo / genial / maravilloso / fantástico; salvo / excepto; pelo / cabello; libre / gratis; casualidad / coincidencia; terminar / acabar; empezar / comenzar; seguir / continuar; oír / escuchar; the video / vídeo pair; el pájaro / el ave; la papa / la patata; la televisión / la tele. These need the answer to be typed or a different card, not a gloss.

**Themes.** 433 untagged content words in the top 3,000 words and top 700 verbs got an existing theme. Assigned per theme: caracter 71, salud 43, naturaleza 39, alimentacion 34, ciencia 33, relaciones 26, educacion 26, politica 25, identidad 24, viajes 22, religion 22, vivienda 19, trabajo 18, ocio 17, economia 15, arte 14, compras 14, cuerpo 10, servicios 7, medios 6. Words themed: top 1,000 472 to 513, top 2,000 960 to 1,098, top 3,000 1,422 to 1,697 (the "before" figures include ~20 closed-class words that wrongly had a theme, now cleared). Verbs themed: top 300 1 to 56, top 700 6 to 138. Adjectives and adverbs of manner not clearly in a theme, and closed-class words, stay null (about 1,200 of the top 3,000 words).

**Spanish entries that look wrong (not touched).** la arma, la alma (el arma, el alma); el diamantes, el trampa, el tarta-style article slips; el leo (zodiac only); el man (Colombian slang, not a noun entry elsewhere); el/la forense and similar double articles; vos, san (not stand-alone words); the verbs coser (rank 129, its forms cosa/cosas are the noun and it is probably over-ranked), acercar (127) and enamorar (261), which are mostly their reflexives in speech; pegar, armar (check scoring). The top 300 verbs also include haber (auxiliary, left unflagged: it has a clean gloss) and sonar / echar / andar, whose counts include very common idioms.

## Clean-up and additions (stage 3)

Data lives in `tools/freq/additions.json` (new), `overrides.json`, `glosses.json` and `region.json`; `tools/build-frequency.js` reads them. `--check` is green. New in the builder: additions (`{es, en, th, c, g?, f?}`; `f` ranks an expression by its content word's count, and an addition is dropped when the spelling is already listed), override fields `f` (rank by other subtitle forms), `into` (an excluded plural hands its count to the singular), verb overrides keyed `v:<infinitive>` with a `share`, a `sp` flag in glosses.json, past subjunctive `-se` forms counted for every verb, and `unas` as a function word. **Bug fixed:** the serialiser never wrote `sp:1`, so the Spain-word flag (coche, móvil, ordenador...) did nothing in the arcade; it is written now (96 entries).

**1. Missing common words.** 313 entries added (302 words, 11 verbs). 5 are grammar words (`g:1`: del, al, algún, ningún, tercer). The word list is now 5,129 entries (was 4,898) after the plural duplicates were folded in. Examples with their new ranks: del 30, al 34, hay 44, por supuesto 198, algún 180, maldito 181, cualquier 190, los demás 404, a través de 494, la maldición 541, la señorita 353, la prisión 653, respecto a 708, de repente 787, embarazada 810, nosotras 948, tercer 1,200, poquito 1,303, el rostro 1,059, enojarse (verb) 198, estacionar (verb) 657. `sin embargo` was already a phrase (rank 387), so it was not duplicated. Skipped on purpose: names, military ranks (teniente, sargento, coronel), strong insults, interjections, Spain words (chaval, enhorabuena, menudo), inflected forms (cállate, hubiese and the other `-se` forms, now counted under their verbs), and `ambas` (already scored under `ambos`). The rest of the 1,198-lemma missing list is names, English words and low-count specialist words.

**2. Odd entries.** `la arma`, `la alma` now `el arma`, `el alma`; `el diamantes` folded into `el diamante`; `la jurado` now `el jurado`; `el leo`, `el man`, `san` excluded; `vos` glossed "you (informal, regional)"; `el/la X` forms are legitimate gender-neutral nouns and were left. 43 plural headwords whose singular is also listed (llaves, huevos, países, bolsas, guantes, olas, camarones, nueces...) are excluded and their count moves to the singular (the list had "one card per word" doubled); 5 more leftovers excluded (la adema, obstante, el tac, el saturno, bajas/altas folded into the singular), and fragments (llegarle, venirle, írsele, la líneacontinua), `dni`, `pc`, `la fa`, `re`, `el house`, `el baby`, `el top`, `el out`. 181 entries have a `show` correction: the 16 earlier adjectives with a stray article plus about 165 more found in the top 5,000 (el callado, el tímido, el tierno, el bendito...), feminine/masculine slips (el águila, el menú, el volante, el yogur) and gender-neutral professions (el/la taxista, el/la pianista...).

**3. Verb scores.** 27 overrides (`share` of the computed score): coser 129 to 889, acercar 128 to 319, enamorar 262 to 407, armar 272 to 467, crear 74 to 229 (creo/crees are creer), sentar 84 to 195 (siento is sentir), valer 61 to 122 (vale is the Spain OK), partir, tardar, unir (unas), librar, charlar (Charles), parir (Paris), datar (date, data), silenciar, sangrar, adelantar, pesar, cuidar (cuidado), enterar, extrañar, enfermar, suponer (por supuesto), formar, callar, mejorar, jurar. `pegar` (316) was checked and is genuine, left alone.

**4. Glosses 2,001 to 5,000.** About 320 of the 2,588 entries kept in that range got a new prompt; the rest were already fine. Rules as before, plus: American spelling (tire, mustache, pajamas, eggplant, gas), Colombian sense first (la cuadra "city block", la goma "glue", la cometa "kite", el contador "accountant", el paradero "bus stop", apenado "embarrassed", la llanta "tire", el andén "sidewalk"), the right sense first where the old one was a rare one (el imán "magnet", la palmera "palm tree", el remolino, el celo), and a leading "the " dropped from every gloss (already the case in most). 496 `en` values in glosses.json are new or changed in total, in all.

**5. Latin American sweep.** 49 region pairs now (16 before). New pairs: judías and alubias to el fríjol, guisantes to arvejas, gambas to el camarón, el lavabo to el lavamanos, la bombilla to el bombillo, la cazadora to la chaqueta, el chándal to la sudadera, calcetines to medias, los pendientes to los aretes, vaqueros to el jean, el aparcamiento to el parqueadero, la acera to el andén, el neumático to la llanta, el maletero to el baúl, el sujetador to el brasier, la manta to la cobija, el bocadillo to el sándwich, la seta to el hongo, el enfado to el enojo, el coste to el costo, el visado to la visa, la cremallera to el cierre, la batidora to la licuadora, la fontanería to la plomería, la percha to el gancho, el cazo to la olla, la fregona to el trapeador, el puzle to el rompecabezas, la tirita to la curita, la escayola to el yeso, el rotulador to el marcador, el aseo to el baño, la bayeta to el trapo. Added LatAm words: estacionar, enojarse, el durazno, el camarón, el lavamanos, la cobija, los aretes, el bombillo, el brasier, la gaseosa, las pantuflas, la visa, el cierre, la licuadora, la plomería. `aparcar` and `enfadarse` pairs now resolve. Removed the `el billete` pair (billete is the Colombian banknote; it is glossed "banknote, bill"). `el tío` and `la tía` are demoted to 12% (in subtitles tío is Spain's "guy"; the uncle is the sense taught). Marked `sp:1` with no pair: vosotros, vuestro, os, el estanco, la tasca, el chiringuito, la fabada, la ensaimada, el arcén, el bañador, el intermitente, el albornoz, el parador, cualificado and about 30 more Spain-only words. Glossed for Colombia: la tapa "lid", el pincho "skewer", medias "socks", la tortilla, el colegio "school". Not changed: armario (used in Colombia too), manta (kept paired), gafas, fresa, piso "floor, apartment".

**New top-100 changes.** Entered the top 100 of words: del (30), al (34), hay (44). Pushed out to just below 100: nosotros, la gente, el padre. Entered the top 300: algún, maldito, cualquier, por supuesto, ningún, el arma. Top-100 verbs: encantar, suceder, tocar, sacar, regresar, ocurrir and escribir entered; valer, crear, formar, sentar and cuidar left.

**Left over.** (a) The validate run also reports a passage `tenses` mismatch and a stale `data/verb-gaps.js`, both other agents' files; mine is clean and the cache versions were bumped. (b) Verbs tail beyond rank 400 and nouns whose form is a verb form below rank ~1,000 were not scored by hand. (c) Spain words with no LatAm entry in the data (estanco, tasca...) are flagged but not paired. (d) Past subjunctive `-se` forms now count, which shifted only a few verbs. (e) `tío` stays at rank 1,130 even after demotion because tío as uncle is rarely in subtitles; a lower share is a one-line change.
