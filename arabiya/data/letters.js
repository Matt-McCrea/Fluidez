/* Ṭalāqa stage 0: the letters and the twelve script lessons. Written by hand
 * for an English speaker who has never seen the script. Every Arabic string
 * is fully vowelled; AR.translit gives the learner line unless tr is set.
 * Letters come in teaching order (shape families and frequency), not the
 * dictionary order. */
(function (root) {
  var L = [
    // lesson 1: the boat family, with the three short vowels
    { id: 'alif', ch: 'ا', nm: 'أَلِف', name: 'alif', tr: 'ā', lesson: 1, say: 'Holds a long ā, as in father. At the start of a word it carries the first vowel.' },
    { id: 'ba', ch: 'ب', nm: 'بَاء', name: 'bāʾ', tr: 'b', lesson: 1, say: 'English b. One dot below.' },
    { id: 'ta', ch: 'ت', nm: 'تَاء', name: 'tāʾ', tr: 't', lesson: 1, say: 'English t, with the tongue against the back of the top teeth. Two dots above.' },
    { id: 'tha', ch: 'ث', nm: 'ثَاء', name: 'thāʾ', tr: 'th', lesson: 1, say: 'th as in think. Three dots above.' },
    // lesson 2: the same tooth with other dots, joining, sukūn
    { id: 'nun', ch: 'ن', nm: 'نُون', name: 'nūn', tr: 'n', lesson: 2, say: 'English n. One dot above; at the end of a word it dips below the line.' },
    { id: 'ya', ch: 'ي', nm: 'يَاء', name: 'yāʾ', tr: 'y / ī', lesson: 2, say: 'y as in yes, or a long ī as in ski. Two dots below.' },
    // lesson 3: the cup family
    { id: 'jim', ch: 'ج', nm: 'جِيم', name: 'jīm', tr: 'j', lesson: 3, say: 'j as in jam. In Cairo it is a hard g as in go. Dot inside.' },
    { id: 'ha', ch: 'ح', nm: 'حَاء', name: 'ḥāʾ', tr: 'ḥ', lesson: 3, say: 'A strong, breathy h pushed from a tightened throat, like fogging a mirror, harder. No dot.' },
    { id: 'kha', ch: 'خ', nm: 'خَاء', name: 'khāʾ', tr: 'kh', lesson: 3, say: 'ch as in the Scottish loch. Dot above.' },
    // lesson 4: the letters that never join forward, and long ū
    { id: 'dal', ch: 'د', nm: 'دَال', name: 'dāl', tr: 'd', lesson: 4, say: 'English d, tongue on the back of the teeth. Never joins the next letter.' },
    { id: 'dhal', ch: 'ذ', nm: 'ذَال', name: 'dhāl', tr: 'dh', lesson: 4, say: 'th as in this. Dāl with a dot.' },
    { id: 'ra', ch: 'ر', nm: 'رَاء', name: 'rāʾ', tr: 'r', lesson: 4, say: 'A tapped or rolled r, as in Spanish pero. Sits low, never joins forward.' },
    { id: 'zay', ch: 'ز', nm: 'زَاي', name: 'zāy', tr: 'z', lesson: 4, say: 'English z. Rāʾ with a dot.' },
    { id: 'waw', ch: 'و', nm: 'وَاو', name: 'wāw', tr: 'w / ū', lesson: 4, say: 'w as in well, or a long ū as in moon. Never joins forward.' },
    // lesson 5: the teeth family and the first heavy letters
    { id: 'sin', ch: 'س', nm: 'سِين', name: 'sīn', tr: 's', lesson: 5, say: 'English s. Three little teeth.' },
    { id: 'shin', ch: 'ش', nm: 'شِين', name: 'shīn', tr: 'sh', lesson: 5, say: 'sh as in ship. Sīn with three dots.' },
    { id: 'sad', ch: 'ص', nm: 'صَاد', name: 'ṣād', tr: 'ṣ', lesson: 5, say: 'A heavy s: tongue low, back of the mouth hollow. The vowel beside it goes deep, ṣa almost like the sa in saw.' },
    { id: 'dad', ch: 'ض', nm: 'ضَاد', name: 'ḍād', tr: 'ḍ', lesson: 5, say: 'A heavy d with the same deep, hollow mouth. Arabic calls itself the language of ḍād.' },
    // lesson 6: the tall heavy pair and the throat pair
    { id: 'tta', ch: 'ط', nm: 'طَاء', name: 'ṭāʾ', tr: 'ṭ', lesson: 6, say: 'A heavy t: the t of ta with the deep mouth of ṣād.' },
    { id: 'zza', ch: 'ظ', nm: 'ظَاء', name: 'ẓāʾ', tr: 'ẓ', lesson: 6, say: 'A heavy dh (as in this). Ṭāʾ with a dot.' },
    { id: 'ayn', ch: 'ع', nm: 'عَيْن', name: 'ʿayn', tr: 'ʿ', lesson: 6, say: 'Squeeze the middle of the throat, as when starting to gag, and voice through it. English has nothing like it: listen and copy.' },
    { id: 'ghayn', ch: 'غ', nm: 'غَيْن', name: 'ghayn', tr: 'gh', lesson: 6, say: 'A gargled r at the back of the throat, like the French r in Paris. ʿAyn with a dot.' },
    // lesson 7: f, q, k, l and the doubling mark
    { id: 'fa', ch: 'ف', nm: 'فَاء', name: 'fāʾ', tr: 'f', lesson: 7, say: 'English f. One dot above the loop.' },
    { id: 'qaf', ch: 'ق', nm: 'قَاف', name: 'qāf', tr: 'q', lesson: 7, say: 'A k from much further back, at the uvula. In Cairo and Beirut people say a catch in the throat instead. Two dots.' },
    { id: 'kaf', ch: 'ك', nm: 'كَاف', name: 'kāf', tr: 'k', lesson: 7, say: 'English k. A little mark inside when it stands alone.' },
    { id: 'lam', ch: 'ل', nm: 'لَام', name: 'lām', tr: 'l', lesson: 7, say: 'English l, light, as in leaf.' },
    // lesson 8: m, h and the two word endings
    { id: 'mim', ch: 'م', nm: 'مِيم', name: 'mīm', tr: 'm', lesson: 8, say: 'English m. A small round head with a tail.' },
    { id: 'hha', ch: 'ه', nm: 'هَاء', name: 'hāʾ', tr: 'h', lesson: 8, say: 'A light English h, said even at the end of a word. Changes shape a lot: ه هـ ـهـ ـه.' },
    { id: 'marbuta', ch: 'ة', nm: 'تَاء مَرْبُوطَة', name: 'tāʾ marbūṭa', tr: 'a / t', lesson: 8, say: 'Only at the end of a word: the feminine ending. Said a, and t when another word is joined to it. Hāʾ with two dots.' },
    { id: 'maqsura', ch: 'ى', nm: 'أَلِف مَقْصُورَة', name: 'alif maqṣūra', tr: 'ā', lesson: 8, say: 'Only at the end of a word: a long ā written like yāʾ without its dots.' },
    // lesson 9: hamza and its seats
    { id: 'hamza', ch: 'ء', nm: 'هَمْزَة', name: 'hamza', tr: 'ʾ', lesson: 9, say: 'The catch in the throat in uh-oh. Sits alone or on a seat: أ إ ؤ ئ.' }
  ];

  var LESSONS = [
    { n: 1, title: 'أَلِف بَاء', en: 'The first letters and the three short vowels', letters: ['alif', 'ba', 'ta', 'tha'],
      kinds: ['sound', 'hear', 'vowel', 'read'],
      card: { how: [
        'Arabic is read from right to left. Your eyes start at the right edge.',
        'Letters with the same body differ only by their dots: *ب* has one below, *ت* two above, *ث* three above.',
        'Short vowels are small marks: *بَ* ba (a stroke above), *بِ* bi (a stroke below), *بُ* bu (a little wāw above).',
        'Alif after a fatḥa makes it long: *بَا* bā.'],
        tip: 'Everyday Arabic leaves the short vowels out. Ṭalāqa shows them until you know each word, then takes them away.' },
      words: [{ ar: 'بَا', en: 'the syllable bā' }, { ar: 'تَا', en: 'the syllable tā' }, { ar: 'بِ', en: 'the syllable bi' }, { ar: 'ثُ', en: 'the syllable thu' }, { ar: 'بَاب', en: 'door' }] },
    { n: 2, title: 'نُون يَاء', en: 'Two more dotted letters, joining, and the silent mark', letters: ['nun', 'ya'],
      kinds: ['sound', 'hear', 'shape', 'read', 'build'],
      card: { how: [
        'Most letters join to the next one, so each has up to four shapes: alone, at the start, in the middle, at the end. *ب بـ ـبـ ـب*.',
        'At the start and in the middle, *ن* and *ي* shrink to a tooth with dots, just like *ب*: *بَيْت* bayt.',
        'A small circle, sukūn, means no vowel: *بِنْت* bint.',
        'Kasra followed by *ي* is a long ī: *تِين* tīn.'],
        tip: 'Count the dots and look where they sit. Above or below is half the letter.' },
      words: [{ ar: 'بَيْت', en: 'house' }, { ar: 'بِنْت', en: 'girl' }, { ar: 'تِين', en: 'figs' }, { ar: 'بَنَات', en: 'girls' }, { ar: 'ثَابِت', en: 'steady' }, { ar: 'بَيْن', en: 'between' }] },
    { n: 3, title: 'جِيم حَاء خَاء', en: 'The cup letters', letters: ['jim', 'ha', 'kha'],
      kinds: ['sound', 'hear', 'shape', 'read', 'build'],
      card: { how: [
        'One body, three letters: dot inside *ج* j, no dot *ح* ḥ, dot above *خ* kh.',
        'At the start or middle the cup closes into a flat hook: *حَبِيب*.',
        '*ح* is the hardest sound so far. Breathe out hard through a tight throat, as if you just ate a hot pepper.'],
        tip: 'Play ḥāʾ and khāʾ one after the other. ḥ is smooth breath, kh scrapes.' },
      words: [{ ar: 'تَاج', en: 'crown' }, { ar: 'حَبِيب', en: 'darling' }, { ar: 'جَيْب', en: 'pocket' }, { ar: 'نَجَاح', en: 'success' }, { ar: 'بَحْث', en: 'research' }, { ar: 'بَخِيت', en: 'lucky' }] },
    { n: 4, title: 'دَال رَاء وَاو', en: 'Letters that never join forward, and long ū', letters: ['dal', 'dhal', 'ra', 'zay', 'waw'],
      kinds: ['sound', 'hear', 'shape', 'read', 'build'],
      card: { how: [
        'Six letters never join the letter after them: *ا د ذ ر ز و*. After one of them the next letter starts fresh, so words have gaps inside: *وَرْد*.',
        '*د* and *ذ* sit on the line; *ر* and *ز* drop below it.',
        'Ḍamma followed by *و* is a long ū: *نُور* nūr.'],
        tip: 'A gap inside a word is not a space. Look for the wider gaps between words.' },
      words: [{ ar: 'خُبْز', en: 'bread' }, { ar: 'وَرْد', en: 'roses' }, { ar: 'دَجَاج', en: 'chicken' }, { ar: 'زَيْت', en: 'oil' }, { ar: 'نُور', en: 'light' }, { ar: 'بَرْد', en: 'cold' }, { ar: 'حُدُود', en: 'borders' }] },
    { n: 5, title: 'سِين صَاد', en: 'The teeth letters and the heavy s and d', letters: ['sin', 'shin', 'sad', 'dad'],
      kinds: ['sound', 'hear', 'shape', 'read', 'build'],
      card: { how: [
        '*س* is three teeth; *ش* adds three dots: sh.',
        '*ص* and *ض* have a loop where *س* has teeth. They are the first of the four heavy letters: ṣ ḍ ṭ ẓ.',
        'A heavy letter makes the vowels around it deeper: *سَبْت* sabt against *صَبْر* ṣabr. Listen to both.'],
        tip: 'For a heavy letter, drop your tongue and pull it back, as if holding an egg in your mouth.' },
      words: [{ ar: 'شَاي', en: 'tea' }, { ar: 'بَيْض', en: 'eggs' }, { ar: 'دَرْس', en: 'lesson' }, { ar: 'صَبْر', en: 'patience' }, { ar: 'جِسْر', en: 'bridge' }, { ar: 'سَبْت', en: 'Saturday' }, { ar: 'شَيْخ', en: 'old man, sheikh' }] },
    { n: 6, title: 'طَاء عَيْن', en: 'The tall heavy letters and the throat', letters: ['tta', 'zza', 'ayn', 'ghayn'],
      kinds: ['sound', 'hear', 'shape', 'read', 'build'],
      card: { how: [
        '*ط* ṭ and *ظ* ẓ are a loop with a tall stroke. Same deep mouth as *ص*.',
        '*ع* ʿayn and *غ* ghayn share a body; the dot makes ghayn. In the middle of a word ʿayn closes into a small triangle: *بَعِيد*.',
        'ʿAyn is a sound English does not have. Do not skip it: *عَيْن* eye and *أَيْن* where are different words.'],
        tip: 'Play ʿayn many times. Copy it out loud each time. It gets easier within a week.' },
      words: [{ ar: 'طَبِيب', en: 'doctor' }, { ar: 'عَرَبِيّ', en: 'Arab, Arabic' }, { ar: 'عَيْن', en: 'eye' }, { ar: 'غَرِيب', en: 'strange' }, { ar: 'عَصِير', en: 'juice' }, { ar: 'بَعِيد', en: 'far' }, { ar: 'شَارِع', en: 'street' }] },
    { n: 7, title: 'فَاء قَاف كَاف لَام', en: 'f, q, k, l and the doubling mark', letters: ['fa', 'qaf', 'kaf', 'lam'],
      kinds: ['sound', 'hear', 'shape', 'read', 'build'],
      card: { how: [
        '*ف* has one dot, *ق* two. At the end of a word qāf dips deeper.',
        '*ك* and *ل* are tall. *ل* followed by alif becomes one shape: *لا* lā.',
        'Shadda *ّ* doubles a letter: *كُلّ* kull, all. Hold the sound a moment longer.'],
        tip: 'Qāf against kāf: *قَلْب* heart, *كَلْب* dog. Say them often.' },
      words: [{ ar: 'كِتَاب', en: 'book' }, { ar: 'قَلْب', en: 'heart' }, { ar: 'كَلْب', en: 'dog' }, { ar: 'فِيل', en: 'elephant' }, { ar: 'سُوق', en: 'market' }, { ar: 'صَدِيق', en: 'friend' }, { ar: 'كُلّ', en: 'all, every' }] },
    { n: 8, title: 'مِيم هَاء', en: 'm, h and the two word endings', letters: ['mim', 'hha', 'marbuta', 'maqsura'],
      kinds: ['sound', 'hear', 'shape', 'read', 'build'],
      card: { how: [
        '*ه* changes the most: *ه هـ ـهـ ـه*.',
        '*ة* is a hāʾ with two dots, only at the end of a word: the feminine ending, said a. *مَدْرَسَة* madrasa, school.',
        '*ى* is a yāʾ without dots, only at the end: a long ā. *مُسْتَشْفَى* mustashfā, hospital.'],
        tip: 'When you type, ة and ى matter: the app counts them, but forgives the first slip.' },
      words: [{ ar: 'مَدْرَسَة', en: 'school' }, { ar: 'مُعَلِّم', en: 'teacher' }, { ar: 'ذَهَب', en: 'gold' }, { ar: 'هُنَا', en: 'here' }, { ar: 'سَيَّارَة', en: 'car' }, { ar: 'مَعَ', en: 'with' }, { ar: 'مُسْتَشْفَى', en: 'hospital' }, { ar: 'وَجْه', en: 'face' }] },
    { n: 9, title: 'هَمْزَة', en: 'Hamza, the catch in the throat', letters: ['hamza'],
      kinds: ['sound', 'hear', 'read', 'build'],
      card: { how: [
        'Hamza *ء* is a stop in the throat. It sits on a seat: *أ* (with a or u), *إ* (with i), *ؤ*, *ئ*, or alone *ء*.',
        'At the start of a word it sits on alif: *أَنَا* anā, I. *إِ* has it below for i.',
        '*آ* (alif madda) is hamza plus long ā: *قُرْآن*.'],
        tip: 'Which seat it takes follows rules, but learn it with each word. The app forgives the first seat slip.' },
      words: [{ ar: 'أَنَا', en: 'I' }, { ar: 'أُمّ', en: 'mother' }, { ar: 'أَب', en: 'father' }, { ar: 'سُؤَال', en: 'question' }, { ar: 'مَاء', en: 'water' }, { ar: 'سَأَلَ', en: 'he asked' }, { ar: 'أَيْنَ', en: 'where' }, { ar: 'بِئْر', en: 'a well' }] },
    { n: 10, title: 'الشَّمْس وَالْقَمَر', en: 'The article: sun and moon letters', letters: [],
      kinds: ['read', 'build', 'article'],
      card: { how: [
        '*ال* al- means the: *بَيْت* a house, *الْبَيْت* al-bayt, the house.',
        'Before 14 sun letters the l is not said, and the letter doubles: *الشَّمْس* ash-shams, the sun. These are *ت ث د ذ ر ز س ش ص ض ط ظ ل ن*.',
        'Before the other 14, the moon letters, the l is said: *الْقَمَر* al-qamar, the moon.',
        'The l is always written. Only the sound changes.'],
        tip: 'Sun letters are made with the tip of the tongue, like the l itself. That is why the l melts into them.' },
      words: [{ ar: 'الشَّمْس', en: 'the sun' }, { ar: 'الْقَمَر', en: 'the moon' }, { ar: 'الْبَيْت', en: 'the house' }, { ar: 'النُّور', en: 'the light' }, { ar: 'الْكِتَاب', en: 'the book' }, { ar: 'السُّوق', en: 'the market' }, { ar: 'الرَّجُل', en: 'the man' }, { ar: 'الْوَلَد', en: 'the boy' }] },
    { n: 11, title: 'تَنْوِين', en: 'Tanwīn, the n endings, and lā', letters: [],
      kinds: ['read', 'build', 'vowel'],
      card: { how: [
        'A doubled vowel mark adds n: *ـٌ* un, *ـٍ* in, *ـً* an. It means a, an: *كِتَابٌ* kitābun, a book.',
        '*ـً* usually comes with an extra alif that is not said: *شُكْرًا* shukran, thanks.',
        'In speech and in this app, nouns are mostly shown without these endings. You will meet *ـًا* in set words.'],
        tip: 'Learn *شُكْرًا*, *أَهْلًا*, *جِدًّا*, *عَفْوًا* as whole words.' },
      words: [{ ar: 'شُكْرًا', en: 'thank you' }, { ar: 'أَهْلًا', en: 'welcome, hello' }, { ar: 'جِدًّا', en: 'very' }, { ar: 'لَا', en: 'no' }, { ar: 'مَرْحَبًا', en: 'hello' }, { ar: 'عَفْوًا', en: "you're welcome, sorry" }] },
    { n: 12, title: 'اِقْرَأْ', en: 'Read real words', letters: [],
      kinds: ['read', 'build', 'hear'],
      card: { how: [
        'Everything is in place. These are words from the first hundred you will meet.',
        'Read them right to left, letter by letter, then as a whole.',
        'After this lesson comes the test. Pass it and the games open.'],
        tip: 'The vowels stay on until you know each word. Hold any word to see them again.' },
      words: [{ ar: 'نَعَم', en: 'yes' }, { ar: 'كَيْفَ', en: 'how' }, { ar: 'مَاذَا', en: 'what' }, { ar: 'مَدِينَة', en: 'city' }, { ar: 'يَوْم', en: 'day' }, { ar: 'رَجُل', en: 'man' }, { ar: 'اِمْرَأَة', en: 'woman' }, { ar: 'وَلَد', en: 'boy' }, { ar: 'بَحْر', en: 'sea' }, { ar: 'جَمِيل', en: 'beautiful' }] }
  ];

  var out = { AR_LETTERS: L, AR_LESSONS: LESSONS };
  if (typeof module !== 'undefined' && module.exports) module.exports = out;
  else { root.AR_LETTERS = L; root.AR_LESSONS = LESSONS; }
})(this);
