#!/usr/bin/env node
/* ============================================================================
 * measure-overlap.js — do the day's new words appear in the day's reading?
 *
 *   node tools/measure-overlap.js
 *
 * The question step 1 of the passage/tense work was built to answer. The daily
 * session teaches a handful of new words in Repasar (stage 1) and puts a
 * passage in front of the learner in Comprender (stage 3). Before that work
 * the two were drawn independently: measured over a themed week, 7 of the 336
 * words taught appeared in the reading that taught them — 2%.
 *
 * Two mechanisms fixed it, and this measures them together:
 *   · js/views/review.js prefers new words that occur in the day's passage;
 *   · js/session.js picks, among the passages already right on grammar and
 *     theme, the one carrying the most words the learner has no SRS state for.
 *
 * IT DRIVES THE REAL CODE, and that turned out to matter more than expected.
 * A first version of this tool computed a proxy — the best unmet-word count
 * available anywhere in the level's pool — and reported 65% where the app
 * delivers 17%, because it skipped the tier narrowing, the bounded candidate
 * sample and SRS.batch's actual ordering. A measurement that does not run
 * through the code under test is a measurement of something else. So this
 * loads the app's own modules against a stub localStorage, calls
 * Session.buildContext for the day and runs SRS.batch with review.js's own
 * `prefer` function. The only thing simulated is the learner: a deterministic
 * mask marks a share of the vocabulary as already known.
 *
 * SRS memoises its parsed state, so the module is re-evaluated after the store
 * is written. Without that every word reads as new and every cell reports
 * 100%, which is what the first run of this did.
 *
 * WHAT THE NUMBERS MEAN. Each cell is the share of the day's new words that
 * occur in the day's passage, averaged over every third day of that band. The
 * 99% column is a control: a learner who knows everything has nothing left to
 * be taught from a text, and no amount of content can move it.
 *
 * WHAT THEY SHOWED. Adding 227 passages moved the 95%-known figure from 17%
 * to 18%. The shortage at that end is not passages, it is unmet words per
 * passage: a reader who knows 95% of the corpus meets two or three new words
 * in any text of ordinary density, and the daily quota is seven or eight.
 * ========================================================================== */
const fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..');
let store={};
global.localStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]}};
global.window=global;
global.location={search:'',hash:''}; global.navigator={language:'en'};
global.document={documentElement:{style:{setProperty(){}},dataset:{},setAttribute(){},classList:{add(){},remove(){}}},body:{classList:{add(){},remove(){}}},createElement:()=>({style:{},classList:{add(){},remove(){}},appendChild(){},setAttribute(){}}),querySelector:()=>null,addEventListener(){}};
global.UI={sample:(a,n)=>a.slice(0,n),pick:a=>a[0],seededRandom:()=>Math.random,t:(a,b)=>b||a,el:()=>({appendChild(){}}),shuffle:a=>a};
window.UI=global.UI;
const FILES=['data/taxonomy.js','data/connectors.js','data/verbs.js','data/vocab.js','data/idioms.js',
 'data/grammar-docs.js','data/grammar.js','data/passages.js','data/apply.js','data/writing.js','data/topics.js',
 'data/strand-lessons.js','data/course.js','data/resources.js','js/engine.js','js/lessons.js','js/checker.js',
 'js/srs.js','js/profile.js','js/curriculum.js','js/lexmatch.js','js/focus.js','js/unitcheck.js','js/session.js'];
FILES.forEach(f=>{ let src=fs.readFileSync(path.join(ROOT,f),'utf8');
  if(f==='js/session.js') src=src.replace('  return {\n    start: start,','  window.__buildContext = buildContext;\n  return {\n    start: start,');
  (0,eval)(src); });

const P=window.Profile, S=window.SRS, LM=window.LexMatch;
const DAYS=window.COURSE_DAYS, BANDS=window.COURSE_BANDS;
const bandOf=i=>{let o='A1';Object.keys(BANDS).sort((a,b)=>BANDS[a]-BANDS[b]).forEach(c=>{if(i>=BANDS[c])o=c;});return o;};

// the vocab half of review.js's pool(), which is what "new words" means here
function vocabPool(){ return (window.VOCAB||[]).filter(w=>P.wordAllowed(w)).map((w,idx)=>({
  id:'v:'+w.es+':meaning', es:w.es, en:w.en, kind:'vocab', cat:w.cat, theme:w.theme||null, idx:idx })); }

function run(share){
  const out={};
  ['A1','A2','B1','B2','C1'].forEach(code=>{
    P.set(code);
    const from=BANDS[code], to=Object.values(BANDS).filter(x=>x>from).sort((a,b)=>a-b)[0] ?? DAYS.length;
    let tot=0, n=0;
    for(let di=from; di<to; di+=3){           // every third day, for speed
      // fresh SRS state: mark `share` of vocab as already known
      store={};
      const studied={}; for(let i=0;i<di;i++) if(DAYS[i].lesson) studied[DAYS[i].lesson]=1;
      store['fluidez.progress']=JSON.stringify({studied, beginnerDay:di-from, courseSig:'x'});
      const all=vocabPool();
      const st={};
      all.forEach((it,i)=>{ if(((i*2654435761)%1000)/1000 < share) st[it.id]={box:3,due:99999,seen:1}; });
      store['fluidez.srs']=JSON.stringify(st);
      // SRS memoises its parsed state, so reload the module after writing it
      (0,eval)(fs.readFileSync(path.join(ROOT,'js/srs.js'),'utf8'));
      const SS=window.SRS;
      const ctx=window.__buildContext();
      if(!ctx.passage) continue;
      const px=LM.index(ctx.passage.text);
      const prefer=it=>(it.es && px.has(it.es)?2:0);
      const fresh=P.params().newPerDay;
      const batch=SS.batch(all, 0, fresh, true, prefer);   // 0 due, only the new ones
      if(!batch.length) continue;
      const hit=batch.filter(it=>px.has(it.es)).length;
      tot += hit/batch.length; n++;
    }
    out[code]= n? Math.round(100*tot/n) : 0;
  });
  return out;
}
const SH=[0,0.5,0.8,0.95,0.99];
console.log('share      ' + ['A1','A2','B1','B2','C1'].map(c=>c.padStart(6)).join('') + '     ALL');
SH.forEach(s=>{ const r=run(s); const vals=Object.values(r);
  console.log((s*100+'%').padStart(5)+'      '+vals.map(v=>(v+'%').padStart(6)).join('')+'  '+(Math.round(vals.reduce((a,c)=>a+c,0)/vals.length)+'%').padStart(6)); });
