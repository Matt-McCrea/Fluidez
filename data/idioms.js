/* ============================================================================
 * IDIOMS — common Spanish idiomatic expressions.
 * Format: { es, en, lit }.  `lit` = literal word-for-word (shown as a hint
 * in the grammar/flashcard view, never used for quiz matching).
 * Survival phrases come first (the roadmap surfaces these on day one), then
 * the classic idioms — interleaved across their verb patterns (tener/dar/
 * hacer/echar/estar + adverbs) so no single pattern (e.g. "tener X") runs
 * for a whole lesson or two in a row.
 * ========================================================================== */
window.IDIOMS = [

/* ---- Everyday survival phrases (useful from lesson one) -------------- */
{es:'¿cómo se dice?', en:'how do you say it?', lit:'how is it said'},
{es:'¿qué significa?', en:'what does it mean?', lit:'what does it signify'},
{es:'mucho gusto', en:'nice to meet you', lit:'much pleasure'},
{es:'encantado', en:'delighted (nice to meet you)', lit:'enchanted'},
{es:'¿qué hora es?', en:'what time is it?', lit:'what hour is it'},
{es:'¿a qué hora?', en:'at what time?', lit:'at what hour'},
{es:'¿dónde está el baño?', en:'where is the bathroom?', lit:'where is the bath'},
{es:'me gustaría', en:'I would like', lit:'it would please me'},
{es:'¿puede repetir, por favor?', en:'can you repeat, please?', lit:'can you repeat, for favor'},
{es:'no entiendo', en:"I don't understand", lit:'not I-understand'},
{es:'más despacio, por favor', en:'slower, please', lit:'more slow, for favor'},
{es:'¿cómo te llamas?', en:"what's your name?", lit:'how do you call yourself'},
{es:'buen provecho', en:'enjoy your meal', lit:'good benefit'},
{es:'buena suerte', en:'good luck', lit:'good luck'},
{es:'que tengas un buen día', en:'have a good day', lit:'that you have a good day'},
{es:'con permiso', en:'excuse me (to pass by)', lit:'with permission'},
{es:'¿cuánto cuesta?', en:'how much does it cost?', lit:'how much does it cost'},
{es:'la cuenta, por favor', en:'the check, please', lit:'the account, for favor'},
{es:'¿puede ayudarme?', en:'can you help me?', lit:'can you help me'},
{es:'estoy perdido', en:'I am lost', lit:'I am lost'},
{es:'¿habla inglés?', en:'do you speak English?', lit:'do you speak English'},
{es:'no hay de qué', en:"don't mention it", lit:'there is not of what'},
{es:'¿qué tal?', en:"how's it going?", lit:'what such'},
{es:'nos vemos', en:'see you later', lit:'we see each other'},
{es:'buen viaje', en:'have a good trip', lit:'good trip'},
{es:'¿cómo llego al centro?', en:'how do I get downtown?', lit:'how I arrive to-the center'},

/* ---- Classic idioms, interleaved across patterns ---------------------- */
{es:'tener ganas de', en:'to feel like (doing something)', lit:'to have desire of'},
{es:'dar un paseo', en:'to take a walk', lit:'to give a stroll'},
{es:'hacer falta', en:'to be necessary / to lack', lit:'to make lack'},
{es:'echar de menos', en:'to miss (someone)', lit:'to throw of less'},
{es:'ponerse de acuerdo', en:'to come to an agreement', lit:'to put oneself of accord'},
{es:'a menudo', en:'often', lit:'to menu'},

{es:'tener hambre', en:'to be hungry', lit:'to have hunger'},
{es:'dar la vuelta', en:'to turn around', lit:'to give the turn'},
{es:'hacer caso', en:'to pay attention / to heed', lit:'to make case'},
{es:'echar una mano', en:'to lend a hand', lit:'to throw a hand'},
{es:'estar de acuerdo', en:'to agree', lit:'to be of accord'},
{es:'a veces', en:'sometimes', lit:'at times'},

{es:'tener sed', en:'to be thirsty', lit:'to have thirst'},
{es:'darse cuenta de', en:'to realize', lit:'to give oneself count of'},
{es:'hacer cola', en:'to stand in line', lit:'to make tail'},
{es:'estar a punto de', en:'to be about to', lit:'to be at point of'},
{es:'de vez en cuando', en:'from time to time', lit:'of time in when'},

{es:'tener sueño', en:'to be sleepy', lit:'to have sleep'},
{es:'hace buen tiempo', en:'the weather is nice', lit:'it makes good weather'},
{es:'valer la pena', en:'to be worth it', lit:'to be worth the sorrow'},
{es:'de repente', en:'suddenly', lit:'of sudden'},

{es:'tener prisa', en:'to be in a hurry', lit:'to have haste'},
{es:'hace mal tiempo', en:'the weather is bad', lit:'it makes bad weather'},
{es:'de nuevo', en:'again', lit:'of new'},

{es:'tener razón', en:'to be right', lit:'to have reason'},
{es:'por supuesto', en:'of course', lit:'for supposed'},

{es:'tener miedo', en:'to be afraid', lit:'to have fear'},
{es:'por fin', en:'finally / at last', lit:'for end'},

{es:'tener calor', en:'to be hot', lit:'to have heat'},
{es:'sin duda', en:'without a doubt', lit:'without doubt'},

{es:'tener frío', en:'to be cold', lit:'to have cold'},
{es:'en seguida', en:'right away', lit:'in following'},

{es:'tener suerte', en:'to be lucky', lit:'to have luck'},
{es:'a lo mejor', en:'maybe / perhaps', lit:'at the best'},

{es:'tener cuidado', en:'to be careful', lit:'to have care'},
{es:'menos mal', en:'thank goodness', lit:'less bad'},

{es:'tener lugar', en:'to take place', lit:'to have place'},
{es:'no importa', en:"it doesn't matter", lit:'it does not import'},

{es:'tener en cuenta', en:'to take into account', lit:'to have in count'},
{es:'vale la pena', en:"it's worth it", lit:'it is worth the sorrow'},

{es:'poco a poco', en:'little by little', lit:'little to little'},
{es:'ni idea', en:'no idea', lit:'nor idea'},

/* ---- More classic idioms ---------------------------------------------- */
{es:'meter la pata', en:'to mess up / put your foot in it', lit:'to put in the paw'},
{es:'costar un ojo de la cara', en:'to cost an arm and a leg', lit:'to cost an eye from the face'},
{es:'estar en las nubes', en:'to have your head in the clouds', lit:'to be in the clouds'},
{es:'no tener pelos en la lengua', en:'to speak bluntly', lit:'to not have hairs on the tongue'},
{es:'ser pan comido', en:'to be a piece of cake', lit:'to be eaten bread'},
{es:'tomar el pelo', en:"to pull someone's leg", lit:'to take the hair'},
{es:'estar como una cabra', en:'to be crazy', lit:'to be like a goat'},
{es:'no dar pie con bola', en:'to get everything wrong', lit:'to not give foot with ball'},
{es:'ponerse las pilas', en:"to get one's act together", lit:'to put in the batteries'},
{es:'dar en el clavo', en:'to hit the nail on the head', lit:'to hit on the nail'},
{es:'estar hasta las narices', en:'to be fed up', lit:'to be up to the noses'},
{es:'ser uña y carne', en:'to be inseparable', lit:'to be nail and flesh'},
{es:'irse por las ramas', en:'to beat around the bush', lit:'to go off through the branches'},
{es:'quedarse de piedra', en:'to be stunned', lit:'to remain as stone'},
{es:'no pegar ojo', en:'to not sleep a wink', lit:'to not stick an eye'}
];
