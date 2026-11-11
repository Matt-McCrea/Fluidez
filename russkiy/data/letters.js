/* Svobodno stage 0: the thirty-three letters and the seven script lessons.
 * Written by hand for an English speaker who has never read Cyrillic. Stress
 * is written in this source as an apostrophe after the vowel and turned into
 * the combining acute (U+0301) on load; RU.translit gives the learner line.
 * Every lesson word uses only letters taught by then. Letters come in
 * teaching order: the familiar ones, the false friends, then the new shapes. */
(function (root) {
  function S(s) { return String(s).replace(/([аеиоуыэюяАЕИОУЫЭЮЯ])'/g, '$1́'); }

  // fam: letters a learner mixes up, used for the wrong options
  var L = [
    // lesson 1: look and sound as in English
    { id: 'a', ch: 'а', up: 'А', nm: 'а', name: 'a', tr: 'a', lesson: 1, fam: 'vow', say: 'a as in father.' },
    { id: 'k', ch: 'к', up: 'К', nm: 'ка', name: 'ka', tr: 'k', lesson: 1, say: 'English k, without the puff of air.' },
    { id: 'm', ch: 'м', up: 'М', nm: 'эм', name: 'em', tr: 'm', lesson: 1, say: 'English m. The small one is a small capital, not a curly m.' },
    { id: 'o', ch: 'о', up: 'О', nm: 'о', name: 'o', tr: 'o', lesson: 1, fam: 'vow', say: 'o as in more when stressed. Unstressed it is said a.' },
    { id: 't', ch: 'т', up: 'Т', nm: 'тэ', name: 'te', tr: 't', lesson: 1, say: 'English t, tongue on the back of the teeth. In italics it looks like m: т.' },
    { id: 'e', ch: 'е', up: 'Е', nm: 'е', name: 'ye', tr: 'ye / e', lesson: 1, fam: 'vow', say: 'ye as in yes at the start of a word, e after a consonant (and the consonant goes soft).' },
    // lesson 2: false friends, they look like English letters and are not
    { id: 'v', ch: 'в', up: 'В', nm: 'вэ', name: 've', tr: 'v', lesson: 2, fam: 'ff', say: 'Looks like B, says v as in van.' },
    { id: 'n', ch: 'н', up: 'Н', nm: 'эн', name: 'en', tr: 'n', lesson: 2, fam: 'ff', say: 'Looks like H, says n as in no.' },
    { id: 'r', ch: 'р', up: 'Р', nm: 'эр', name: 'er', tr: 'r', lesson: 2, fam: 'ff', say: 'Looks like P, says a rolled or tapped r, as in Spanish pero.' },
    { id: 's', ch: 'с', up: 'С', nm: 'эс', name: 'es', tr: 's', lesson: 2, fam: 'ff', say: 'Looks like C, always says s as in sun.' },
    { id: 'u', ch: 'у', up: 'У', nm: 'у', name: 'u', tr: 'u', lesson: 2, fam: 'ff', say: 'Looks like y, says oo as in food.' },
    { id: 'kh', ch: 'х', up: 'Х', nm: 'ха', name: 'kha', tr: 'kh', lesson: 2, fam: 'ff', say: 'Looks like X, says ch as in the Scottish loch.' },
    // lesson 3: new shapes for familiar sounds
    { id: 'b', ch: 'б', up: 'Б', nm: 'бэ', name: 'be', tr: 'b', lesson: 3, fam: 'bv', say: 'English b. Not to be mixed up with в, which is v.' },
    { id: 'g', ch: 'г', up: 'Г', nm: 'гэ', name: 'ge', tr: 'g', lesson: 3, fam: 'gp', say: 'A hard g as in go.' },
    { id: 'd', ch: 'д', up: 'Д', nm: 'дэ', name: 'de', tr: 'd', lesson: 3, say: 'English d, tongue on the back of the teeth. In italics it looks like g: д.' },
    { id: 'z', ch: 'з', up: 'З', nm: 'зэ', name: 'ze', tr: 'z', lesson: 3, say: 'English z. It looks like the number 3.' },
    { id: 'i', ch: 'и', up: 'И', nm: 'и', name: 'i', tr: 'i', lesson: 3, fam: 'vow', say: 'ee as in see. It looks like a backwards N.' },
    { id: 'y', ch: 'й', up: 'Й', nm: "и кра'ткое", name: 'i kratkoye', tr: 'y', lesson: 3, say: 'y as in boy. The short i: и with a little cap.' },
    { id: 'l', ch: 'л', up: 'Л', nm: 'эль', name: 'el', tr: 'l', lesson: 3, say: 'A dark l, as in full.' },
    { id: 'p', ch: 'п', up: 'П', nm: 'пэ', name: 'pe', tr: 'p', lesson: 3, fam: 'gp', say: 'English p. A doorway shape. In italics it looks like n: п.' },
    { id: 'f', ch: 'ф', up: 'Ф', nm: 'эф', name: 'ef', tr: 'f', lesson: 3, say: 'English f.' },
    // lesson 4: the hushing letters and ts
    { id: 'zh', ch: 'ж', up: 'Ж', nm: 'жэ', name: 'zhe', tr: 'zh', lesson: 4, fam: 'hush', say: 's as in pleasure, said hard.' },
    { id: 'ts', ch: 'ц', up: 'Ц', nm: 'цэ', name: 'tse', tr: 'ts', lesson: 4, fam: 'hush', say: 'ts as in cats. Note the little tail.' },
    { id: 'ch', ch: 'ч', up: 'Ч', nm: 'че', name: 'che', tr: 'ch', lesson: 4, fam: 'hush', say: 'ch as in chair. It looks like a 4.' },
    { id: 'sh', ch: 'ш', up: 'Ш', nm: 'ша', name: 'sha', tr: 'sh', lesson: 4, fam: 'hush', say: 'sh as in shop, said with the tongue pulled back.' },
    { id: 'shch', ch: 'щ', up: 'Щ', nm: 'ща', name: 'shcha', tr: 'shch', lesson: 4, fam: 'hush', say: 'A long, soft sh, as in fresh sheep said fast. ш with a tail.' },
    // lesson 5: the vowel pairs
    { id: 'yy', ch: 'ы', up: 'Ы', nm: 'ы', name: 'y', tr: 'y', lesson: 5, fam: 'vow', say: 'A sound English lacks: say ee with the tongue pulled back, as if about to say oo.' },
    { id: 'ee', ch: 'э', up: 'Э', nm: 'э', name: 'e', tr: 'e', lesson: 5, fam: 'vow', say: 'e as in met, with no y before it.' },
    { id: 'yu', ch: 'ю', up: 'Ю', nm: 'ю', name: 'yu', tr: 'yu', lesson: 5, fam: 'vow', say: 'yoo as in you.' },
    { id: 'ya', ch: 'я', up: 'Я', nm: 'я', name: 'ya', tr: 'ya', lesson: 5, fam: 'vow', say: 'ya as in yard. On its own it means I.' },
    { id: 'yo', ch: 'ё', up: 'Ё', nm: 'ё', name: 'yo', tr: 'yo', lesson: 5, fam: 'vow', say: 'yo as in yonder. Always stressed. Often printed without its dots, as е.' },
    // lesson 6: the two signs
    { id: 'soft', ch: 'ь', up: 'Ь', nm: "мя'гкий знак", name: 'myagkiy znak', tr: 'ʹ', lesson: 6, fam: 'sign', say: 'No sound of its own. It softens the letter before it: put the middle of your tongue up, as in the n of new.' },
    { id: 'hard', ch: 'ъ', up: 'Ъ', nm: "твё'рдый знак", name: 'tvyordyy znak', tr: '', lesson: 6, fam: 'sign', say: 'No sound of its own. A rare little wall: the y sound after it starts fresh.' }
  ];
  L.forEach(function (l) { l.nm = S(l.nm); });

  function W(ar, en) { return { ru: S(ar), en: en }; }

  var LESSONS = [
    { n: 1, title: 'А К М О Т Е', en: 'Six letters you can already read, and the stress mark', letters: ['a', 'k', 'm', 'o', 't', 'e'],
      kinds: ['sound', 'hear', 'shape', 'read', 'build'],
      card: { how: [
        'These six look and sound much as in English: *а к м о т е*.',
        'Every Russian word with more than one vowel has one stressed vowel, said louder and longer. Russians do not write it; this app marks it with an accent until you know the word: *ма́ма*.',
        'The capitals are bigger copies: *А К М О Т Е*. *т* and *м* are small capitals, not curly letters.'],
        tip: 'Say every word out loud, leaning on the marked vowel.' },
      words: [W('ма\'ма', 'mum'), W('кот', 'cat'), W('там', 'there'), W('как', 'how'), W('мак', 'poppy'), W('те\'ма', 'topic'), W('коме\'та', 'comet'), W('том', 'volume (book)')] },
    { n: 2, title: 'В Н Р С У Х', en: 'False friends: they look English and are not', letters: ['v', 'n', 'r', 's', 'u', 'kh'],
      kinds: ['sound', 'hear', 'shape', 'read', 'build'],
      card: { how: [
        '*в* is v, *н* is n, *р* is r, *с* is s, *у* is oo, *х* is kh. Say each one until the English sound stops coming first.',
        '*нос* is nos, nose, not hoc. *рот* is rot, mouth.',
        'Unstressed *о* is said a: *окно́* is aknó, window, but *сок* keeps its o.'],
        tip: 'The trickiest is *р*: it is never p. Read *рука́* aloud: rooká.' },
      words: [W('нос', 'nose'), W('сок', 'juice'), W('нет', 'no'), W('у\'тро', 'morning'), W('рука\'', 'hand'), W('сестра\'', 'sister'), W('са\'хар', 'sugar'), W('у\'хо', 'ear'), W('вот', 'here is'), W('мост', 'bridge')] },
    { n: 3, title: 'Б Г Д З И Й Л П Ф', en: 'New shapes for sounds you know', letters: ['b', 'g', 'd', 'z', 'i', 'y', 'l', 'p', 'f'],
      kinds: ['sound', 'hear', 'shape', 'read', 'build'],
      card: { how: [
        '*б* b and *в* v are easy to mix: б has a flag on top.',
        '*и* is ee, a backwards N. With a cap it is *й*, a short y: *мой* moy, my.',
        '*п* is p, a doorway. *г* is a hard g. *д* d, *з* z, *л* l, *ф* f.',
        'A voiced letter at the end of a word loses its voice: *хлеб* is said khlep, *друг* drook.'],
        tip: 'Read *приве́т* slowly: p, r, i, v, e, t. You just said hi.' },
      words: [W('да', 'yes'), W('дом', 'house'), W('хлеб', 'bread'), W('кни\'га', 'book'), W('друг', 'friend'), W('приве\'т', 'hi'), W('зима\'', 'winter'), W('ко\'фе', 'coffee'), W('па\'па', 'dad'), W('суп', 'soup'), W('авто\'бус', 'bus'), W('мой', 'my')] },
    { n: 4, title: 'Ж Ц Ч Ш Щ', en: 'The hushing letters and ts', letters: ['zh', 'ts', 'ch', 'sh', 'shch'],
      kinds: ['sound', 'hear', 'shape', 'read', 'build'],
      card: { how: [
        '*ж* zh, *ш* sh: both said with the tongue pulled back, hard.',
        '*щ* is ш with a tail: a long, soft sh (written shch). *ц* has a tail too: ts.',
        '*ч* looks like 4 and says ch. In *что*, what, it is said sh: shto.',
        'After *ж ш ц*, the letter *и* sounds like ы: *жить* zhyt.'],
        tip: 'Tails matter: *ш* sh, *щ* shch, *ц* ts. Look at the bottom of the letter.' },
      words: [W('чай', 'tea'), W('жена\'', 'wife'), W('ша\'пка', 'hat'), W('у\'лица', 'street'), W('щи', 'cabbage soup'), W('борщ', 'borscht'), W('час', 'hour'), W('что', 'what'), W('хорошо\'', 'good, well'), W('душ', 'shower'), W('центр', 'centre')] },
    { n: 5, title: 'Ы Э Ю Я Ё', en: 'The vowel pairs: hard and soft', letters: ['yy', 'ee', 'yu', 'ya', 'yo'],
      kinds: ['sound', 'hear', 'shape', 'pair', 'read', 'build'],
      card: { how: [
        'Russian vowels come in pairs. The second of each pair adds a y, or softens the letter before it: *а я*, *о ё*, *у ю*, *ы и*, *э е*.',
        '*я* is ya, and on its own means I. *ю* is yu. *ё* is yo and is always stressed.',
        '*ы* has no English match: say ee with your tongue pulled back. *ты* you, *мы* we.',
        'Unstressed *я* and *е* are said i: *язы́к* yizýk.'],
        tip: 'Books often print ё as е. In this app the dots stay, and typing е for ё is always fine.' },
      words: [W('ты', 'you'), W('мы', 'we'), W('э\'то', 'this, it is'), W('я', 'I'), W('юг', 'south'), W('ёж', 'hedgehog'), W('моя\'', 'my (f)'), W('люблю\'', 'I love'), W('сыр', 'cheese'), W('ещё', 'more, still'), W('тётя', 'aunt'), W('язы\'к', 'language, tongue')] },
    { n: 6, title: 'Ь Ъ', en: 'The two silent signs, and how Russian really sounds', letters: ['soft', 'hard'],
      kinds: ['sound', 'shape', 'read', 'build', 'stress'],
      card: { how: [
        '*ь*, the soft sign, has no sound. It softens the letter before it: *мат* mat (checkmate), *мать* matʹ, mother.',
        '*ъ*, the hard sign, is rare. It keeps the y sound after it apart: *подъе́зд* padyést, entrance.',
        'Only the stressed vowel keeps its full sound. Unstressed *о* is a, unstressed *е* and *я* are i: *молоко́* malakó.',
        'The stress can fall anywhere, and it changes the word: *за́мок* castle, *замо́к* lock.'],
        tip: 'Hold any word to see its stress again. Typed answers never need the accent.' },
      words: [W('мать', 'mother'), W('день', 'day'), W('семья\'', 'family'), W('соль', 'salt'), W('ночь', 'night'), W('пять', 'five'), W('дверь', 'door'), W('подъе\'зд', 'entrance'), W('съесть', 'to eat up'), W('любо\'вь', 'love'), W('молоко\'', 'milk')] },
    { n: 7, title: 'Чита́ть', en: 'Italics, handwriting shapes, and real words', letters: [],
      kinds: ['read', 'build', 'hear', 'italic'],
      card: { how: [
        'Italic and handwritten Russian change a few shapes: *т* looks like m, *д* like g, *и* like u, *п* like n.',
        'Signs, menus and books use italics often. Read the word, not the shape you expect.',
        'After this lesson comes the test. Pass it and the games open.'],
        tip: 'The stress marks stay until you know each word.' },
      words: [W('спаси\'бо', 'thank you'), W('пожа\'луйста', 'please'), W('здра\'вствуйте', 'hello (polite)'), W('извини\'те', 'excuse me'), W('Москва\'', 'Moscow'), W('рестора\'н', 'restaurant'), W('метро\'', 'metro'), W('апте\'ка', 'pharmacy'), W('доро\'га', 'road'), W('и\'мя', 'first name')] }
  ];
  LESSONS.forEach(function (l) { l.card.how = l.card.how.map(S); l.card.tip = S(l.card.tip); l.title = S(l.title); });

  var out = { RU_LETTERS: L, RU_LESSONS: LESSONS };
  if (typeof module !== 'undefined' && module.exports) module.exports = out;
  else { root.RU_LETTERS = L; root.RU_LESSONS = LESSONS; }
})(this);
