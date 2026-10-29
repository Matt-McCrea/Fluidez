#!/usr/bin/env python3
"""Curriculum pull-forward pass (29 Oct 2026) — applied once to content/graph and content/units.

Writing units 1-3 showed that the graph's prerequisite timing blocked ordinary beginner
Spanish (quiero ir, mi hermana, este café, muy/mucho, ¿con quién?, primero/luego, para…).
This script records every move so the pass can be audited or replayed on a fresh checkout
of the pre-pass content. It asserts the old state before changing anything, so running it
twice fails loudly instead of double-applying.

Rules kept: every unit keeps its day count (so lexeme priorities, which are session
numbers, stay exact); <=1 grammar Introduce per day, never on consecutive days, a Drill
1-3 sessions after; the structures that could not get an Introduce slot ride as patterns
(p:) or chunk families on drill/input days. See docs/unit-map.md, "Pull-forward pass".

    python3 tools/curriculum/pullforward.py     (from app/)
"""
import json
import os
import sys

APP = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
G = os.path.join(APP, 'content', 'graph')
U = os.path.join(APP, 'content', 'units')


def load(path):
    with open(path, encoding='utf8') as f:
        s = f.read()
    return json.loads(s), ('\n' if s.endswith('\n') else '')


def save(path, data, tail):
    with open(path, 'w', encoding='utf8') as f:
        f.write(json.dumps(data, ensure_ascii=False, indent=1) + tail)


graph = {k: load(os.path.join(G, k + '.json')) for k in ['grammar', 'patterns', 'chunks', 'contrasts', 'candos']}
nodes = {n['id']: n for k in graph for n in graph[k][0]}
units = {}
for f in sorted(os.listdir(U)):
    if f.endswith('.json') and f.startswith('u'):
        units[f[:-5]] = load(os.path.join(U, f))


def die(msg):
    sys.exit('pullforward: ' + msg + ' (already applied, or the content changed?)')


def move(nid, old, new):
    n = nodes[nid]
    if n['priority'] != old:
        die(f'{nid} priority is {n["priority"]}, expected {old}')
    n['priority'] = new


def day(u, i):
    return units[u][0]['days'][i]


def set_day(u, i, expect_type, type_=None, focus=None, chunks=None, drop_scene=False, scene=None):
    d = day(u, i)
    if d['type'] != expect_type:
        die(f'{u} day {i + 1} is {d["type"]}, expected {expect_type}')
    if type_:
        d['type'] = type_
    if focus is not None:
        d['focus'] = focus
    if chunks is not None:
        d['chunks'] = chunks
    if drop_scene:
        d.pop('scene', None)
    if scene:
        d['scene'] = scene


def add_node(kind, node):
    if node['id'] in nodes:
        die(node['id'] + ' exists')
    graph[kind][0].append(node)
    nodes[node['id']] = node


def note(nid, extra):
    n = nodes[nid]
    n['note'] = (n.get('note', '') + ' ' if n.get('note') else '') + extra


def serves(nid, old, new):
    s = nodes[nid]['serves']
    nodes[nid]['serves'] = [new if x == old else x for x in s] if old in s else s + [new]


PF = 'Pull-forward pass (Oct 2026): '

# ---------------------------------------------------------------- grammar moves
move('g:adjective-agreement', 40, 15)
serves('g:adjective-agreement', 'd:u05-people-in-my-life', 'd:u02-my-day-to-day')
note('g:adjective-agreement', PF + 'moved from session 40 to 15 (u02). Agreement is A1 core and gender is session 6: Vale está cansada, Mariana es colombiana, las arepas son buenas.')

move('g:questions', 16, 17)

move('g:verb-infinitive', 72, 24)
n = nodes['g:verb-infinitive']
n['title'] = 'Verb + verb: quiero ir, puedo pagar, necesito dormir, tengo que trabajar'
n['es'] = '¿Quieres tomar algo? Hoy no puedo salir: tengo que trabajar. Bailar es muy chévere.'
n['en'] = "Do you want to have something? I can't go out today: I have to work. Dancing is great."
n['requires'] = ['g:stem-boot']
serves('g:verb-infinitive', 'd:u08-have-you-ever', 'd:u03-likes-wants-and-plans')
note('g:verb-infinitive', PF + 'moved from session 72 to 24 (u03), straight after the boot verbs whose forms it uses (SEQ day 28; the c:quiero / c:puedo / c:tengo-que chunks start it in week 1). Covers querer, poder, preferir, necesitar, tener que and hay que + infinitive, and a plain infinitive as subject (Bailar es divertido) and empezar a / terminar de. saber + infinitive waits for g:yo-irregular (p:saber-conocer); volver a, dejar de, soler and ponerse a are tagged to their own patterns.')

move('g:ir-a-plans', 25, 26)

move('g:possessives', 44, 40)
n = nodes['g:possessives']
n['title'] = 'Whose is it, the whole set: mi/mis, tu/tus, su/sus, nuestro/nuestra'
note('g:possessives', PF + 'mi / tu / su + noun are licensed from session 12 by p:possessives-basic; this lesson (40, was 44) systematises nuestro/a/os/as agreement and the four meanings of su (de él, de ella, de usted, de ellos).')

move('g:negation-words', 69, 44)
serves('g:negation-words', 'd:u08-have-you-ever', 'd:u05-people-in-my-life')
note('g:negation-words', PF + 'moved from session 69 to 44 (u05). no hay nada / no hay nadie / no sé nada ride as a chunk from session 23 (c:no-hay-nada), algo / alguien as p:indefinites-basic (23).')

move('g:estar-gerund', 78, 69)
serves('g:estar-gerund', 'd:u09-my-routine', 'd:u08-have-you-ever')
note('g:estar-gerund', PF + 'moved from session 78 to 69 (u08; SEQ day 54): ¿Qué estás haciendo? is everyday A1.')

move('g:direct-objects', 92, 72)
nodes['g:direct-objects']['requires'] = ['g:gustar-basic', 'g:preterite-er-ir']
serves('g:direct-objects', 'd:u10-food-and-ordering', 'd:u08-have-you-ever')
note('g:direct-objects', PF + 'moved from session 92 to 72 (u08; SEQ day 75): ¿Lo has probado? — No, nunca lo he probado. me / te / nos as objects are licensed from session 30 by p:me-te-nos-objects; this lesson is lo / la / los / las and the personal a.')

move('g:prep-infinitive', 156, 78)
nodes['g:prep-infinitive']['band'] = 'A1'
serves('g:prep-infinitive', 'd:u17-making-plans', 'd:u09-my-routine')
note('g:prep-infinitive', PF + 'moved from session 156 (A2) to 78 (u09): antes de / después de + infinitive is how a routine is told (Antes de dormir, leo).')

move('g:prep-pronouns', 130, 92)
serves('g:prep-pronouns', 'd:u14-joining-it-up', 'd:u10-food-and-ordering')
note('g:prep-pronouns', PF + 'moved from session 130 to 92 (u10: Para mí, un tinto. ¿Y para ti?). a mí también / ¿y a ti? are a chunk from session 21 (c:a-mi-tambien), with gustar.')

move('g:object-pronoun-position', 144, 130)
nodes['g:object-pronoun-position']['band'] = 'A1'
serves('g:object-pronoun-position', 'd:u16-shopping', 'd:u14-joining-it-up')
note('g:object-pronoun-position', PF + 'moved from session 144 (A2) to 130 (u14): voy a llamarte / te voy a llamar, quiero verte.')

n = nodes['g:tener-que-hay-que']
n['title'] = 'Have to, must, no need: tener que vs hay que vs deber — and no tienes que'
n['es'] = 'Tienes que descansar. Hay que pagar antes. Debes ir al médico. Mañana no tienes que venir.'
n['en'] = "You have to rest. You have to pay first. You should go to the doctor. You don't have to come tomorrow."
n['requires'] = ['g:verb-infinitive', 'g:yo-irregular']
note('g:tener-que-hay-que', PF + 'tener que / hay que + infinitive are licensed from session 24 by g:verb-infinitive (chunks from session 6). This lesson (still 82) contrasts personal and general obligation with deber (present), and no tener que (no need) vs no deber (mustn\'t). The tagger now maps deber + infinitive here (it was B1 g:deber-modal).')

for nid, extra in [
    ('g:quantifiers', 'muy / mucho / poco are licensed from session 12 by p:quantifiers-basic; this lesson is bastante, demasiado, and muy vs mucho as a system.'),
    ('g:demonstratives', 'este / esta / esto / eso are licensed from session 14 by p:demonstratives-basic; this lesson is the three distances (este, ese, aquel) with aquí / ahí / allá.'),
    ('g:questions-prepositions', '¿de dónde?, ¿con quién?, ¿a qué hora?, ¿por qué?, ¿para qué? are licensed from session 18 by p:prep-questions-basic; this lesson is the verb-governed ones (¿De qué se trata? ¿En qué piensas? ¿Con qué sueñas?).'),
    ('g:time-sequence', 'primero / luego / después / al final are licensed from session 32 by p:time-sequence-basic; this lesson is the longer story frame.'),
    ('g:exclamations', '¡Qué + adjective! is licensed from session 23 by p:exclamations-basic; this lesson is ¡Qué tan…!, ¡Cuánto…!, ¡Qué … tan …!'),
    ('g:acabar-de-ya-todavia', 'ya / todavía / ya no / todavía no are licensed from session 52 by p:ya-todavia-basic; this lesson is acabar de and the fine points.'),
    ('g:por-para-1', 'para (purpose, recipient) is licensed from session 25 by p:para-inf; por stays here.'),
    ('g:cuando-indicative', 'cuando + present for habits is licensed from session 80 by p:cuando-basic; this lesson is cuando / mientras / siempre que across the pasts.'),
    ('g:se-meaning-change', 'quedarse, acordarse, dormirse… are licensed from g:reflexive-routine (76) as vocabulary; this lesson teaches the meaning contrasts (dormir / dormirse, ir / irse).'),
    ('g:infinitive-subject', 'a plain infinitive as subject (Bailar es divertido) is licensed by g:verb-infinitive (24); this lesson is el + infinitive and infinitives inside emotion frames.'),
    ('g:deber-modal', 'deber + infinitive in the present is now taught (and tagged) with g:tener-que-hay-que at 82; this lesson is deberías and debe de (probability).'),
    ('g:indefinites', 'algo / alguien are licensed from session 23 by p:indefinites-basic; this lesson is algún / ningún / alguno and agreement.'),
    ('g:yo-irregular', 'hago / salgo / vengo / pongo / traigo ride as a chunk family from session 22 (c:hago-salgo-vengo), when u03 teaches salir and venir; tengo from session 3 (c:tengo); sé from 11 (c:no-se).'),
    ('g:stem-boot', 'tener\'s forms are a chunk from session 14 (c:tienes).'),
]:
    note(nid, PF + extra)

# ---------------------------------------------------------------- new patterns
def pattern(id_, prio, title, es, en, requires, note_, sources, pcic=()):
    add_node('patterns', {
        'id': id_, 'kind': 'pattern', 'band': 'A1', 'priority': prio, 'title': title, 'es': es, 'en': en,
        'requires': requires, 'contrasts': [], 'serves': [], 'pcic': list(pcic), 'placement': 'teaching_choice',
        'note': PF + note_, 'sources': sources,
    })


pattern('p:quantifiers-basic', 12, 'Very, a lot, not much: muy, mucho, poco',
        'muy + adjective / adverb · mucho / mucha / muchos / muchas + noun · verb + mucho / poco: Es muy amable. Trabajo mucho. Tengo muchas preguntas. Duermo poco.',
        "very + adjective; a lot of + noun (it agrees); verb + a lot / not much: She's very kind. I work a lot. I have a lot of questions. I don't sleep much.",
        ['g:present-ar', 'g:gender-articles'],
        'the everyday quantifiers (tagger key np.quantifier.basic). Pitfall: *muy trabajo, *mucho cansado. The system (bastante, demasiado, x:muy-mucho) is g:quantifiers at 63.',
        ['gr-cuantificadores-no-universales-a1', 'nt-cantidad-relativa-a1'])
pattern('p:possessives-basic', 12, 'My, your, his, her: mi, tu, su (+ mis, tus, sus)',
        'mi / tu / su + noun; mis / tus / sus + plural noun: Mi nombre es Tomás. ¿Tu mamá vive aquí? Su café está frío. Mis amigos son de Cali.',
        'my / your / his-her-your(usted) + noun: My name is Tomás. Does your mum live here? Her coffee is cold. My friends are from Cali.',
        ['g:gender-articles'],
        'the everyday possessives (tagger key np.possessive.basic). Pitfall: *mi amigos; su = his, her, its, your (usted), their. nuestro and the full set are g:possessives at 40.',
        ['gr-posesivos-forma-a1', 'gr-posesivos-distribucion-a1'])
pattern('p:demonstratives-basic', 14, 'This and that: este café, esta mesa, esto, eso',
        'este / esta + noun (here, with me) · esto / eso for a thing you don\'t name: Este café es de Huila. ¿Qué es esto? Eso es para Vale. Esta es Mariana.',
        "this + noun; this / that (thing): This coffee is from Huila. What's this? That's for Vale. This is Mariana.",
        ['g:gender-articles'],
        'the everyday demonstratives (tagger key np.demonstrative.basic). Pitfall: *esto café (esto never goes before a noun). ese / aquel and the three distances are g:demonstratives at 59.',
        ['gr-demostrativos-distribucion-a1', 'dc-deixis-espacial-a1'])
pattern('p:prep-questions-basic', 18, 'Questions that start with a little word: ¿de dónde?, ¿con quién?, ¿a qué hora?, ¿por qué?, ¿para qué?',
        'preposition + question word, at the front: ¿De dónde eres? ¿Con quién vives? ¿A qué hora abre el café? ¿Por qué? ¿Para qué es esto? ¿En qué trabajas?',
        "the preposition comes first, never at the end: Where are you from? Who do you live with? What time does the café open? Why? What's this for? What do you do?",
        ['g:questions'],
        'tagger key q.wh.prep. Pitfall: *¿Dónde eres de? / *¿Quién vives con? The verb-governed ones (¿De qué se trata?) are g:questions-prepositions at B1.',
        ['gr-interrogativos-a1', 'fn-pedir-informacion-a1'])
pattern('p:exclamations-basic', 23, 'Reacting: ¡Qué bonito!, ¡Qué rico!, ¡Qué pena!',
        '¡Qué + adjective / noun!: ¡Qué bonito! ¡Qué rico! ¡Qué chévere! ¡Qué pena! ¡Qué frío!',
        'How…! / What a…!: How pretty! Delicious! Great! What a shame! So cold!',
        ['g:adjective-agreement'],
        'tagger key excl.que. The adjective agrees with what you mean: ¡Qué bonita (la casa)! ¡Qué tan…! and ¡Cuánta gente! are g:exclamations at 206.',
        ['fn-valorar-a1', 'fn-acuerdo-a1'])
pattern('p:me-te-nos-objects', 30, 'Me, you, us: ¿me ayudas?, te llamo, nos vemos',
        'me / te / nos before the verb, for "me, you, us" or "to me, to you, to us": ¿Me ayudas? Te llamo mañana. ¿Me das un tinto? Te quiero mucho. Nos vemos el lunes.',
        "the little word goes before the verb: Will you help me? I'll call you tomorrow. Can you give me a coffee? I love you. See you on Monday.",
        ['g:gustar-basic', 'g:present-ar'],
        'tagger key clitic.personal (me / te / nos as objects, which learners already know from me gusta / te gusta). lo / la / los / las are g:direct-objects at 72, le / les g:indirect-objects at 121.',
        ['gr-objeto-directo-a1'])
pattern('p:time-sequence-basic', 32, 'First, then, after that: primero, luego, después, al final',
        'primero… luego / después… al final: Primero fui al banco, luego compré pan y después volví al café. Al final no hice nada.',
        'first… then / after that… in the end: First I went to the bank, then I bought bread and after that I came back to the café. In the end I did nothing.',
        ['g:preterite-ar'],
        'tagger key conn.sequence: the u04 can-do (what I did, in order) needs it. ese día / al día siguiente / al rato are g:time-sequence at 246.',
        ['dc-conectores-a1', 'nt-tiempo-futuro-presente-pasado-a1'])
pattern('p:indefinites-basic', 23, 'Something, someone — nothing, nobody: algo, alguien, nada, nadie',
        '¿algo? / ¿alguien? and the answers nada / nadie: ¿Quieres algo de tomar? —No, nada, gracias. ¿Hay alguien en el café? —No, no hay nadie.',
        "something / anything, someone / anyone, and the answers nothing, nobody: Do you want something to drink? — No, nothing, thanks. Is there anyone in the café? — No, there's nobody.",
        ['g:present-er-ir'],
        'tagger key np.indefinite.basic (algo, alguien): ¿Algo más? is week-1 Spanish. algún / ningún are g:indefinites (216); the double negative as a system is g:negation-words (44).',
        ['gr-indefinidos-negativos-b1', 'gr-cuantificadores-no-universales-a1'])
pattern('p:ya-todavia-basic', 52, 'Already, still, not any more: ya, todavía, ya no, todavía no',
        'ya (already, now) · todavía (still) · ya no (not any more) · todavía no (not yet): Ya no vivo en Toronto. Todavía trabajo en el café. ¿Ya comiste? —Todavía no.',
        "already · still · not any more · not yet: I don't live in Toronto any more. I still work at the café. Have you eaten? — Not yet.",
        ['g:present-er-ir'],
        'tagger key conn.ya; fits u06 (then vs now). acabar de and the perfecto nuances are g:acabar-de-ya-todavia at 250.',
        ['gr-adverbios-lugar-tiempo-cantidad-a1'])
pattern('p:cuando-basic', 80, 'When I get home…: cuando + present for what usually happens',
        'cuando + present, present: Cuando llego a casa, me ducho. Cuando tengo tiempo, leo. ¿Qué haces cuando llueve?',
        "when + present for habits: When I get home, I shower. When I have time, I read. What do you do when it rains?",
        ['g:present-er-ir'],
        'tagger key conj.cuando.ind; routine is told this way. cuando / mientras / siempre que across the pasts are g:cuando-indicative at 160; cuando + subjunctive for the future is B1.',
        ['nt-frecuencia-a1'])

n = nodes['p:para-inf']
move('p:para-inf', 73, 25)
n['title'] = 'For and in order to: para + person, para + verb'
n['es'] = 'para + persona / cosa · para + infinitivo (mismo sujeto): Este tinto es para Vale. Un jugo para llevar. Estudio español para trabajar en Bogotá.'
n['en'] = "for someone / something; (in order) to: This coffee is for Vale. A juice to go. I study Spanish to work in Bogotá."
note('p:para-inf', PF + 'moved from session 73 to 25 (u03, after g:verb-infinitive) and widened to para + person; the tagger maps every para here (key prep.para), por stays with g:por-para-1.')

for nid, old, new in [
    ('p:tener-hambre', 15, 16), ('p:senor-don-article', 15, 16), ('p:bien-mal-vs-bueno-malo', 15, 18),
    ('p:question-word-order', 17, 18), ('p:prefieres-x-o-y', 24, 25), ('p:jugar-a', 24, 25),
    ('p:days-el-lunes', 24, 27), ('p:ir-a-venir-de-place', 26, 27),
    ('p:talla-numero', 149, 144), ('p:colour-claro-oscuro', 149, 144),
    ('p:que-tal-si', 159, 156), ('p:por-que-no', 159, 156), ('p:te-invito-a', 159, 156),
]:
    move(nid, old, new)
move('x:tener-estar-states', 17, 18)

# ---------------------------------------------------------------- chunks
def chunk(id_, prio, title, es, en, unpacks, note_):
    add_node('chunks', {
        'id': id_, 'kind': 'chunk', 'band': 'A1', 'priority': prio, 'title': title, 'es': es, 'en': en,
        'requires': [], 'contrasts': [], **({'unpacks': unpacks} if unpacks else {}), 'serves': [], 'pcic': [],
        'placement': 'teaching_choice', 'note': PF + note_, 'sources': [],
    })


chunk('c:tienes', 14, 'Have you got…? — tener with everyone',
      '¿Tienes…? / ¿Tiene…? / Tenemos… / Tienen… — ¿Tienes tiempo? ¿Tiene wifi?',
      'Have you got…? / Has he/she/have you (usted) got…? / We have… / They have… — Have you got time? Has it got wifi?',
      'g:stem-boot', "tener's present for every person before the boot verbs (22) explain it; tengo is c:tengo (session 3).")
chunk('c:se-llama', 14, "His name is…, what's it called?: se llama",
      'Se llama… / ¿Cómo se llama? / Se llaman… — Se llama Simón.',
      "His / her name is… / What's his name? What's it called? / Their names are… — His name is Simón.",
      'g:reflexive-routine', 'talking about other people\'s names (mi hermana se llama Ana) long before reflexives (76).')
chunk('c:abierto-cerrado', 16, "It's open, it's closed",
      'Está abierto. / Está abierta. / Está cerrado. / Está cerrada. / ¿Está abierto?',
      "It's open. / It's closed. / Is it open?",
      'g:estar-participle', 'survival: shops, the café, the bank. abierto is a participle, so it would otherwise wait for g:estar-participle (136).')
chunk('c:voy-vas', 16, "I'm going, are you going?: voy, vas",
      'Voy… / ¿Vas…? / ¿Adónde vas? / Voy al centro.',
      "I'm going… / Are you going…? / Where are you going? / I'm going downtown.",
      'g:ir-a-plans', 'ir is a top-30 verb and u02 is the day-to-day unit (voy al café a las seis); the system arrives with g:ir-a-plans (26).')
chunk('c:a-mi-tambien', 21, 'Me too, me neither, and you? — with gustar',
      'A mí también. / A mí tampoco. / A mí no. / A mí sí. / ¿Y a ti? / A mí me gusta.',
      'Me too. / Me neither. / Not me. / I do. / And you? / I like it.',
      'g:prep-pronouns', 'taught with g:gustar-basic (20): Me gusta el tinto. —¡A mí también! The prepositional pronouns as a system are g:prep-pronouns (92).')
chunk('c:hago-salgo-vengo', 22, "The odd 'I' forms you need now: hago, salgo, vengo, pongo, traigo",
      'Hago… / Salgo… / Vengo… / Pongo… / Traigo… — Salgo a las seis. Vengo mañana.',
      'I do / make… / I go out / leave… / I come… / I put… / I bring… — I leave at six. I\'m coming tomorrow.',
      'g:yo-irregular', 'u03 teaches salir and venir as verbs; the -go forms ride as a chunk family until g:yo-irregular (38) explains them.')
chunk('c:si-quieres', 23, 'If you like: si quieres',
      'Si quieres. / Si quieres, vamos mañana. / Si puedes.',
      "If you like. / If you like, let's go tomorrow. / If you can.",
      'g:si-present', 'the everyday conditional offer, long before g:si-present (154).')
chunk('c:no-hay-nada', 23, "There's nothing, there's nobody: no hay nada, no sé nada",
      'No hay nada. / No hay nadie. / No sé nada. / No tengo nada.',
      "There's nothing. / There's nobody here. / I don't know anything. / I've got nothing.",
      'g:negation-words', 'the four double negatives a beginner needs first; the system is g:negation-words (44).')
chunk('c:normalmente', 81, 'Usually, really, only: normalmente, realmente, solamente',
      'Normalmente… / Generalmente… / Realmente… / Solamente…',
      'Usually… / Generally… / Really… / Only…',
      'g:adverbs-mente', 'p:frequency-scale needs normalmente in u09; -mente as a system is g:adverbs-mente (236).')

move('c:que-es-esto', 60, 16)
nodes['c:que-es-esto']['requires'] = ['p:demonstratives-basic']
nodes['c:que-es-esto']['unpacks'] = 'g:demonstratives'
move('c:ahorita', 215, 23)
nodes['c:ahorita']['requires'] = []
nodes['c:ahorita']['unpacks'] = 'g:diminutives'
move('c:a-que-te-dedicas', 17, 18)

# ---------------------------------------------------------------- units
D = lambda *xs: list(xs)

# u02 (sessions 11-19): er-ir, estar, adjective agreement, questions — four Introduces, no review day
u = 'u02'
set_day(u, 1, 'drill', focus=D('g:present-er-ir', 'g:present-ar', 'p:quantifiers-basic', 'p:possessives-basic'))
set_day(u, 3, 'drill', focus=D('g:estar-location-states', 'g:present-er-ir', 'p:demonstratives-basic'),
        chunks=day(u, 3)['chunks'] + ['c:tienes', 'c:se-llama'])
set_day(u, 4, 'input', type_='introduce', focus=D('g:adjective-agreement'))
set_day(u, 5, 'introduce', type_='drill', focus=D('g:adjective-agreement', 'g:estar-location-states', 'p:tener-hambre', 'p:senor-don-article'),
        chunks=D('c:que-es-esto', 'c:abierto-cerrado', 'c:voy-vas'))
set_day(u, 6, 'drill', type_='introduce', focus=D('g:questions'), chunks=[])
set_day(u, 7, 'output', type_='drill', drop_scene=True,
        focus=D('g:questions', 'g:adjective-agreement', 'p:question-word-order', 'p:prep-questions-basic', 'p:bien-mal-vs-bueno-malo', 'x:tener-estar-states'),
        chunks=D('c:a-que-te-dedicas'))
set_day(u, 8, 'review', type_='output', scene='sc-u02-a',
        focus=D('g:present-er-ir', 'g:estar-location-states', 'g:adjective-agreement', 'g:questions'))

# u03 (sessions 20-28): gustar, boot verbs, verb + infinitive, ir a — four Introduces, no review day
u = 'u03'
set_day(u, 1, 'drill', chunks=day(u, 1)['chunks'] + ['c:a-mi-tambien'])
set_day(u, 2, 'introduce', chunks=D('c:hago-salgo-vengo'))
set_day(u, 3, 'drill', focus=D('g:stem-boot', 'g:gustar-basic', 'p:exclamations-basic', 'p:indefinites-basic'), chunks=D('c:si-quieres', 'c:ahorita', 'c:no-hay-nada'))
set_day(u, 4, 'input', type_='introduce', focus=D('g:verb-infinitive', 'p:que-tipo-de'))  # ch006 uses ¿Qué tipo de…?
set_day(u, 5, 'introduce', type_='drill', focus=D('g:verb-infinitive', 'g:stem-boot', 'p:para-inf', 'p:prefieres-x-o-y', 'p:jugar-a'))
set_day(u, 6, 'drill', type_='introduce', focus=D('g:ir-a-plans'))
set_day(u, 7, 'output', type_='drill', drop_scene=True,
        focus=D('g:ir-a-plans', 'g:verb-infinitive', 'p:ir-a-venir-de-place', 'p:days-el-lunes'))
set_day(u, 8, 'review', type_='output', scene='sc-u03-a',
        focus=D('g:gustar-basic', 'g:stem-boot', 'g:verb-infinitive', 'g:ir-a-plans'))

# u04: me / te / nos objects; first, then, after that
set_day('u04', 1, 'drill', focus=day('u04', 1)['focus'] + ['p:me-te-nos-objects'])
set_day('u04', 3, 'drill', focus=day('u04', 3)['focus'] + ['p:time-sequence-basic'])

# u05: yo-irregular, possessives (40), negation words (44)
u = 'u05'
set_day(u, 2, 'introduce', focus=D('g:possessives'))
set_day(u, 3, 'drill', focus=D('g:possessives', 'g:yo-irregular', 'g:adjective-agreement'))
set_day(u, 6, 'introduce', focus=D('g:negation-words'))
f7 = day(u, 7)['focus']
set_day(u, 7, 'drill', focus=['g:negation-words', 'g:possessives'] + [x for x in f7 if not x.startswith('g:')])
for i in (8, 9):
    set_day(u, i, day(u, i)['type'], focus=D('g:yo-irregular', 'g:possessives', 'g:negation-words'))

# u06: ya / todavía
set_day('u06', 4, 'input', focus=day('u06', 4)['focus'] + ['p:ya-todavia-basic'])

# u07: c:que-es-esto moved to u02
set_day('u07', 3, 'drill', chunks=[c for c in day('u07', 3)['chunks'] if c != 'c:que-es-esto'])

# u08: perfecto, estar + gerund (69), lo / la (72)
u = 'u08'
set_day(u, 2, 'introduce', focus=D('g:estar-gerund'))
set_day(u, 3, 'drill', focus=D('g:estar-gerund', 'g:perfecto-experience'))
set_day(u, 5, 'introduce', focus=D('g:direct-objects'))
f6 = day(u, 6)['focus']
set_day(u, 6, 'drill', focus=['g:direct-objects', 'g:estar-gerund'] + [x for x in f6 if not x.startswith('g:') and x != 'p:para-inf'])
for i in (7, 8):
    set_day(u, i, day(u, i)['type'], focus=D('g:perfecto-experience', 'g:estar-gerund', 'g:direct-objects'))

# u09: reflexives, antes de / después de + inf (78), obligation (82)
u = 'u09'
set_day(u, 1, 'drill', focus=D('g:reflexive-routine', 'g:direct-objects', 'p:lavarse-las-manos'))
set_day(u, 2, 'introduce', focus=D('g:prep-infinitive'))
f3 = day(u, 3)['focus']
set_day(u, 3, 'drill', focus=['g:prep-infinitive', 'g:reflexive-routine'] + [x for x in f3 if not x.startswith('g:')])
set_day(u, 4, 'input', focus=day(u, 4)['focus'] + ['p:cuando-basic'])
set_day(u, 5, 'patterns', chunks=D('c:normalmente'))
f7 = day(u, 7)['focus']
set_day(u, 7, 'drill', focus=['g:tener-que-hay-que', 'g:prep-infinitive'] + [x for x in f7 if not x.startswith('g:')])
for i in (8, 9):
    set_day(u, i, day(u, i)['type'], focus=D('g:reflexive-routine', 'g:prep-infinitive', 'g:tener-que-hay-que'))

# u10: gustar-full, stem e>i, prepositional pronouns (92)
u = 'u10'
set_day(u, 6, 'introduce', focus=D('g:prep-pronouns'))
set_day(u, 7, 'drill', focus=D('g:prep-pronouns', 'g:stem-e-i'))
for i in (8, 9):
    set_day(u, i, day(u, i)['type'], focus=D('g:gustar-full', 'g:stem-e-i', 'g:prep-pronouns'))

# u14: relative que, cause, object-pronoun position (130)
u = 'u14'
set_day(u, 5, 'introduce', focus=D('g:object-pronoun-position'))
f6 = day(u, 6)['focus']
set_day(u, 6, 'drill', focus=['g:object-pronoun-position'] + [x for x in f6 if x != 'g:prep-pronouns'])
f7 = day(u, 7)['focus']
set_day(u, 7, 'output', focus=[('g:object-pronoun-position' if x == 'g:prep-pronouns' else x) for x in f7])
f8 = day(u, 8)['focus']
set_day(u, 8, 'review', focus=[('g:object-pronoun-position' if x == 'g:prep-pronouns' else x) for x in f8])

# u16: object-pronoun position left for u14 — day 1 becomes an input day carrying two of its patterns
u = 'u16'
set_day(u, 0, 'introduce', type_='input', focus=D('p:talla-numero', 'p:colour-claro-oscuro'))
set_day(u, 5, 'patterns', focus=[x for x in day(u, 5)['focus'] if x not in ('p:talla-numero', 'p:colour-claro-oscuro')])

# u17: antes de / después de left for u09 — day 3 becomes a patterns day
u = 'u17'
set_day(u, 2, 'introduce', type_='patterns', focus=D('p:que-tal-si', 'p:por-que-no', 'p:te-invito-a'))
set_day(u, 3, 'drill', focus=D('g:si-present', 'g:double-pronouns'))
set_day(u, 5, 'patterns', focus=[x for x in day(u, 5)['focus'] if x not in ('p:que-tal-si', 'p:por-que-no', 'p:te-invito-a')])
set_day(u, 7, 'drill', focus=[('g:si-present' if x == 'g:prep-infinitive' else x) for x in day(u, 7)['focus']])
for i in (8, 9):
    set_day(u, i, day(u, i)['type'], focus=[x for x in day(u, i)['focus'] if x != 'g:prep-infinitive'])

# u23: c:ahorita moved to u03
set_day('u23', 1, 'drill', chunks=[c for c in day('u23', 1)['chunks'] if c != 'c:ahorita'])

# ---------------------------------------------------------------- can-dos
for cid, prio, req in [
    ('d:u02-my-day-to-day', 19, ['g:present-er-ir', 'g:estar-location-states', 'g:adjective-agreement', 'g:questions']),
    ('d:u03-likes-wants-and-plans', 28, ['g:gustar-basic', 'g:stem-boot', 'g:verb-infinitive', 'g:ir-a-plans']),
    ('d:u05-people-in-my-life', None, ['g:yo-irregular', 'g:possessives', 'g:negation-words']),
    ('d:u08-have-you-ever', None, ['g:perfecto-experience', 'g:estar-gerund', 'g:direct-objects']),
    ('d:u09-my-routine', None, ['g:reflexive-routine', 'g:prep-infinitive', 'g:tener-que-hay-que']),
    ('d:u10-food-and-ordering', None, ['g:gustar-full', 'g:stem-e-i', 'g:prep-pronouns']),
    ('d:u14-joining-it-up', None, ['g:relative-que', 'g:cause-result', 'g:object-pronoun-position']),
    ('d:u16-shopping', None, ['g:superlatives', 'g:double-pronouns']),
    ('d:u17-making-plans', None, ['g:si-present', 'g:cuando-indicative']),
]:
    if prio is not None:
        nodes[cid]['priority'] = prio
    nodes[cid]['requires'] = req

# ---------------------------------------------------------------- write (stable re-sort by priority)
for k, (arr, tail) in graph.items():
    arr.sort(key=lambda n: n['priority'])
    save(os.path.join(G, k + '.json'), arr, tail)
for k, (data, tail) in units.items():
    save(os.path.join(U, k + '.json'), data, tail)
print('pullforward: applied')
