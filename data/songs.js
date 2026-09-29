/* ============================================================================
 * SONGS — the "Canciones" page inside Recursos: songs from Mateo's Spotify
 * playlist ("Lista de Reproducción Española de Mateo"), each with its title in
 * English, what it is about, the words worth taking from it, and links out to
 * the full lyrics and a translation.
 *
 * The lyrics themselves are NOT in here, and must not be: they are copyrighted,
 * and the app is published. The vocab below is single words and short set
 * phrases — the Spanish a learner lifts out of a song — never lines from it.
 * Songs whose content we could not vouch for have no `about`, only links.
 *
 * Format: [{ title, en, artist, year?, about?, vocab:[[es, en]], note? }].
 * `note` is one grammar or usage point the song is a good example of.
 * Italian songs on the playlist (Volare) are left out.
 * ========================================================================== */
window.SONGS = [
  { title: 'Échame la culpa', en: 'Blame me', artist: 'Luis Fonsi, Demi Lovato', year: 2017,
    about: 'A couple going round in circles over whose fault the break-up was. His answer: fine, put it on me, if that ends it.',
    vocab: [['echar la culpa (a alguien)', 'to blame (someone)'], ['la culpa', 'the fault, the blame'], ['el perdón', 'forgiveness'], ['cansado/a', 'tired, fed up']],
    note: 'Échame = eche + me: the object pronoun is glued onto a positive command. Negative commands put it in front: no me eches la culpa.' },

  { title: 'Reggaetón lento (Bailemos)', en: 'Slow reggaeton (Let\'s dance)', artist: 'CNCO', year: 2016,
    about: 'He asks a girl to dance to something slow, close together, and forget everyone else in the club.',
    vocab: [['bailemos', 'let\'s dance'], ['lento', 'slow'], ['pegado/a', 'close, pressed up against'], ['la pista', 'the dance floor']],
    note: 'Bailemos is the nosotros subjunctive used as a command: "let\'s…". Same pattern: vamos, comamos, salgamos.' },

  { title: 'Atrévete-te-te', en: 'Go on, dare!', artist: 'Calle 13', year: 2005,
    about: 'Residente teases a prim, middle-class girl to drop the act and dance with the barrio. Dense with Puerto Rican slang and pop-culture jokes.',
    vocab: [['atreverse (a)', 'to dare (to)'], ['el barrio', 'the neighbourhood'], ['sudar', 'to sweat'], ['la nena', 'girl, babe (PR)'], ['el coro', 'the chorus']],
    note: 'Atrévete is the tú command of a reflexive verb: atrever + te. The title stutters the pronoun for rhythm.' },

  { title: 'Duele el corazón', en: 'My heart hurts', artist: 'Enrique Iglesias, Wisin', year: 2016,
    about: 'He tells a woman her boyfriend doesn\'t treat her right and she should leave with him instead.',
    vocab: [['doler', 'to hurt, to ache'], ['el corazón', 'the heart'], ['tratar bien/mal', 'to treat well/badly'], ['el novio', 'the boyfriend']],
    note: 'Doler works like gustar: me duele la cabeza, me duelen los pies. The thing that hurts is the subject.' },

  { title: 'La botella', en: 'The bottle', artist: 'Mach & Daddy', year: 2006,
    about: 'Panamanian reggaeton party track built around a bottle and a dance-floor chant.',
    vocab: [['la botella', 'the bottle'], ['la fiesta', 'the party'], ['la discoteca', 'the club'], ['perrear', 'to dance reggaeton (slang)']] },

  { title: 'Con calma', en: 'Take it easy / Nice and slow', artist: 'Daddy Yankee, Snow', year: 2019,
    about: 'Daddy Yankee rebuilds Snow\'s 1992 hit "Informer" into a song about watching a woman dance and telling her to take her time.',
    vocab: [['con calma', 'calmly, easy does it'], ['la cintura', 'the waist'], ['mover', 'to move'], ['despacio', 'slowly']],
    note: 'con + noun often does the job of an English adverb: con calma (calmly), con cuidado (carefully), con prisa (hurriedly).' },

  { title: 'China', en: 'China (a nickname)', artist: 'Anuel AA, Daddy Yankee, Karol G, Ozuna, J Balvin', year: 2019,
    about: 'A reworking of Shaggy\'s "It Wasn\'t Me": five voices trading verses about a cheating partner and denying everything.',
    vocab: [['engañar', 'to cheat on, to deceive'], ['negar', 'to deny'], ['la mentira', 'the lie'], ['china', 'orange (Puerto Rico); also a term of endearment']] },

  { title: 'Flaca', en: 'Skinny (my love)', artist: 'Andrés Calamaro', year: 1997,
    about: 'Argentine rock ballad: a heartbroken man tells the woman who hurt him that he\'s done being her fool, though he clearly isn\'t over her.',
    vocab: [['flaca', 'skinny — an affectionate way to address a girlfriend in Argentina'], ['el puñal', 'the dagger'], ['la espalda', 'the back'], ['herido/a', 'wounded']],
    note: 'Flaco/flaca, gordo/gorda, negro/negra are common, affectionate forms of address across Latin America — not insults.' },

  { title: 'Aprender a quererte', en: 'Learning to love you', artist: 'Morat', year: 2016,
    about: 'Colombian folk-pop: love as something you learn slowly, and he intends to put in the time.',
    vocab: [['aprender a + infinitivo', 'to learn to do something'], ['querer', 'to love; to want'], ['el tiempo', 'time'], ['la paciencia', 'patience']],
    note: 'querer a alguien is "to love someone"; te quiero is the everyday "I love you". Te amo is stronger and rarer.' },

  { title: 'Walter Palmeras', en: 'Walter Palmeras (a name)', artist: 'Taburete', year: 2016,
    vocab: [] },

  { title: 'Wavin\' Flag (versión española)', en: 'Waving flag', artist: 'K\'NAAN, David Bisbal', year: 2010,
    about: 'The Coca-Cola anthem for the 2010 World Cup, with Bisbal singing the Spanish verses: pride, struggle and celebration.',
    vocab: [['la bandera', 'the flag'], ['ondear', 'to wave (a flag)'], ['la libertad', 'freedom'], ['más fuerte', 'stronger']] },

  { title: 'Bamboléo', en: 'Swaying', artist: 'Gipsy Kings', year: 1987,
    about: 'Rumba flamenca from French gitanos singing in Andalusian-flavoured Spanish: a love song that\'s mostly about the feeling of the rhythm.',
    vocab: [['bambolear(se)', 'to sway, to wobble'], ['la vida', 'life'], ['el ritmo', 'the rhythm'], ['el amor', 'love']] },

  { title: 'Tacatà', en: 'Tacatà (a sound, not a word)', artist: 'Tacabro', year: 2012,
    about: 'Italian-made dance track with shouted Spanish instructions to move. The title is onomatopoeia.',
    vocab: [['mover', 'to move'], ['la cadera', 'the hip'], ['arriba / abajo', 'up / down']] },

  { title: 'Me gustas tú', en: 'I like you', artist: 'Manu Chao', year: 2001,
    about: 'A list of simple things he likes — planes, travelling, mornings, the rain — and each round ends on the same thing he likes most.',
    vocab: [['me gusta', 'I like (one thing)'], ['me gustan', 'I like (several things)'], ['me gustas', 'I like you'], ['viajar', 'to travel'], ['la lluvia', 'the rain'], ['la mañana', 'the morning']],
    note: 'The whole song is a gustar drill. Me gustas tú: tú is the subject ("you are pleasing to me"), so the verb is gustas, not gusta.' },

  { title: 'Oye mi amor', en: 'Listen, my love', artist: 'Maná', year: 1992,
    about: 'Mexican rock: he pleads with a lover who is pulling away not to leave him.',
    vocab: [['oye', 'listen / hey (tú command of oír)'], ['no te vayas', 'don\'t go'], ['el dolor', 'the pain'], ['sin ti', 'without you']],
    note: 'Oye (tú) and oiga (usted) are the everyday way to get someone\'s attention — "hey", "excuse me".' },

  { title: 'Tití me preguntó', en: 'Auntie asked me', artist: 'Bad Bunny', year: 2022,
    about: 'His aunt asks whether he has lots of girlfriends; he admits he does and doesn\'t plan on settling down with any of them.',
    vocab: [['tití', 'auntie (Puerto Rico)'], ['la novia', 'the girlfriend'], ['preguntar', 'to ask (a question)'], ['pedir', 'to ask for'], ['la foto', 'the photo']],
    note: 'preguntar is asking a question; pedir is asking for something. Me preguntó si… (she asked me whether…) vs. me pidió una foto.' },

  { title: 'Estamos bien intoxicados', en: 'We\'re pretty wasted', artist: 'Benja Murano', year: 2023,
    vocab: [['estar intoxicado/a', 'to be poisoned; (loosely) drunk, wasted'], ['bien + adjetivo', 'really, pretty (bien cansado = really tired)']] },

  { title: 'Candela', en: 'Fire / Heat', artist: 'Buena Vista Social Club', year: 1997,
    about: 'Cuban son sung by Faustino Oramas: "candela" is fire, and in Cuban slang something hot, wild or trouble.',
    vocab: [['la candela', 'fire, flame; (Cuba) something hot or wild'], ['echar candela', 'to be on fire, to give it everything'], ['el son', 'Cuban son, the root of salsa']] },

  { title: 'X (Equis) — Remix', en: 'X', artist: 'Nicky Jam, J Balvin, Maluma, Ozuna', year: 2018,
    about: 'Reggaeton about attraction on the dance floor; the title is the letter X, read "equis".',
    vocab: [['la equis', 'the letter X'], ['la mirada', 'the look, the gaze'], ['bailar pegado', 'to dance close']] },

  { title: 'Suavemente', en: 'Gently', artist: 'Elvis Crespo', year: 1998,
    about: 'The merengue everyone knows: a man asking to be kissed, softly.',
    vocab: [['suave', 'soft, smooth'], ['suavemente', 'softly, gently'], ['bésame', 'kiss me'], ['el merengue', 'merengue (Dominican dance)']],
    note: 'Adjective + -mente makes an adverb, built on the feminine form: suave → suavemente, lenta → lentamente.' },

  { title: 'La mudanza', en: 'The move', artist: 'Bad Bunny', year: 2025,
    about: 'Autobiographical: how his parents met and made a life, and why he chooses to stay in and stand up for Puerto Rico.',
    vocab: [['la mudanza', 'the (house) move'], ['mudarse', 'to move house'], ['quedarse', 'to stay'], ['la bandera', 'the flag']] },

  { title: 'DtMF (Debí tirar más fotos)', en: 'I should have taken more photos', artist: 'Bad Bunny', year: 2025,
    about: 'Nostalgia for people and nights that are gone, and the regret of not having captured them while they were happening.',
    vocab: [['debí + infinitivo', 'I should have…'], ['tirar fotos', 'to take photos (Caribbean; Spain: hacer fotos, elsewhere sacar fotos)'], ['extrañar', 'to miss (someone)'], ['el recuerdo', 'the memory']],
    note: 'Debí tirar = I should have taken: the preterite of deber + infinitive looks back at a missed chance.' },

  { title: 'Baile inolvidable', en: 'Unforgettable dance', artist: 'Bad Bunny', year: 2025,
    about: 'A full salsa band behind a man remembering the woman who taught him to dance, and who he still hasn\'t got over.',
    vocab: [['olvidar', 'to forget'], ['inolvidable', 'unforgettable'], ['enseñar a + infinitivo', 'to teach (someone) to…'], ['la salsa', 'salsa']],
    note: 'in- + verb + -able: olvidar → inolvidable, creer → increíble, evitar → inevitable.' },

  { title: 'Nuevayol', en: 'New York (said the Puerto Rican way)', artist: 'Bad Bunny', year: 2025,
    about: 'The Puerto Rican diaspora in New York; it opens on a sample of El Gran Combo\'s salsa classic "Un verano en Nueva York".',
    vocab: [['Nueva York', 'New York'], ['el verano', 'the summer'], ['la gente', 'the people (singular verb)']] },

  { title: 'El apagón', en: 'The blackout', artist: 'Bad Bunny', year: 2022,
    about: 'Puerto Rico\'s repeated power cuts as a way into bigger anger: outsiders buying up beaches and neighbourhoods, and pride in staying.',
    vocab: [['el apagón', 'the blackout, power cut'], ['la luz', 'the light; (colloquial) electricity'], ['la playa', 'the beach'], ['irse', 'to leave, to go away']],
    note: 'Se fue la luz — "the power went out" — is how everyone says it.' },

  { title: 'Lo que le pasó a Hawaii', en: 'What happened to Hawaii', artist: 'Bad Bunny', year: 2025,
    about: 'A warning that Puerto Rico could lose its land and culture the way Hawaii did, set to Puerto Rican folk music.',
    vocab: [['pasarle algo a alguien', 'for something to happen to someone'], ['la tierra', 'the land, the earth'], ['soltar', 'to let go of']],
    note: 'Lo que le pasó a Hawaii: the le is an indirect-object pronoun doubled with a Hawaii. Spanish repeats it; English doesn\'t.' },

  { title: 'Si antes te hubiera conocido', en: 'If I\'d met you sooner', artist: 'KAROL G', year: 2025,
    about: 'Summery tropical pop: she\'s just met someone and wonders what might have been if it had happened earlier.',
    vocab: [['conocer a alguien', 'to meet / know someone'], ['antes', 'before, sooner'], ['el verano', 'the summer']],
    note: 'Si + pluperfect subjunctive (hubiera conocido) = "if I had met". It sets up the what-might-have-been: …habría sido distinto.' },

  { title: 'Loca', en: 'Crazy', artist: 'Shakira, El Cata', year: 2010,
    about: 'The other woman speaks: he says his girlfriend is sensible, but she\'s the crazy one he keeps coming back to.',
    vocab: [['loco/a', 'crazy'], ['estar loco/a por', 'to be crazy about'], ['la otra', 'the other woman'], ['la calle', 'the street']],
    note: 'ser loco = to be a crazy person; estar loco = to be acting crazy / crazy right now; estar loco por = to be mad about someone.' },

  { title: 'Hasta siempre, Comandante', en: 'Farewell forever, Commander', artist: 'Compay Segundo (song by Carlos Puebla)', year: 1965,
    about: 'Carlos Puebla\'s farewell to Che Guevara when he left Cuba, sung here by the Buena Vista veteran.',
    vocab: [['hasta siempre', 'farewell forever'], ['el comandante', 'the commander'], ['la historia', 'history; story'], ['la presencia', 'the presence']] },

  { title: 'Eres para mí', en: 'You\'re meant for me', artist: 'Julieta Venegas, Ana Tijoux', year: 2006,
    about: 'Venegas is certain someone is meant for her, even if he doesn\'t know it yet; Tijoux adds a rap verse.',
    vocab: [['ser para alguien', 'to be meant for someone'], ['darse cuenta (de)', 'to realise'], ['por fin', 'at last']],
    note: 'para marks destination or purpose (eres para mí = you\'re meant for me); por marks cause or exchange (lo hice por ti = I did it for your sake).' },

  { title: 'Hasta la muerte', en: 'Until death', artist: 'Eslabon Armado, Ivan Cornejo', year: 2024,
    about: 'Sad sierreño: quiet guitars and a love he means to keep until death.',
    vocab: [['la muerte', 'death'], ['hasta', 'until; even'], ['para siempre', 'forever']] },

  { title: 'Mon amour (Remix)', en: 'My love (French)', artist: 'zzoilo, Aitana', year: 2021,
    about: 'Spanish summer pop about falling for someone fast; the remix gives her side of the story.',
    vocab: [['enamorarse (de)', 'to fall in love (with)'], ['el verano', 'the summer'], ['buscar', 'to look for']] },

  { title: 'Amárrame', en: 'Tie me down / Hold on to me', artist: 'Mon Laferte, Juanes', year: 2017,
    about: 'A duet asking to be held on to, and not let go.',
    vocab: [['amarrar', 'to tie up, to tie down'], ['amárrame', 'tie me / hold me tight'], ['el beso', 'the kiss']],
    note: 'Adding a pronoun to a command moves the stress back a syllable, so it takes an accent: amarra → amárrame, dime → dímelo.' },

  { title: 'Escucha mi salsa', en: 'Listen to my salsa', artist: 'Son Habana', year: null,
    vocab: [['escuchar', 'to listen (to) — no "a" needed for things'], ['escucha', 'listen (tú command)']] },

  { title: 'Clandestino', en: 'Undocumented', artist: 'Manu Chao', year: 1998,
    about: 'Life as an undocumented migrant in Europe: moving alone, avoiding the police, counted as illegal by the law.',
    vocab: [['clandestino/a', 'clandestine; undocumented'], ['la ley', 'the law'], ['ilegal', 'illegal'], ['perdido/a', 'lost'], ['el corazón', 'the heart']] },

  { title: 'Tuyo', en: 'Yours', artist: 'Rodrigo Amarante', year: 2015,
    about: 'The Narcos theme: a bossa-nova-inflected song in the voice of someone offering himself — his fire, his power — completely.',
    vocab: [['tuyo/a', 'yours'], ['el fuego', 'the fire'], ['soy tuyo', 'I\'m yours']],
    note: 'Stressed possessives come after the noun or after ser: un amigo tuyo, esto es mío.' }
];
