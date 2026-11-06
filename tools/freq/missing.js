#!/usr/bin/env node
/* Frequent word forms that are in neither VOCAB nor the course graph, folded to
 * lemmas as well as a script can (plurals, feminines, clitics, regular verb
 * forms; names, profanity, interjections and foreign words from exclude.json).
 *   node tools/freq/missing.js [out.json] [from] [to]   prints a ranked list */
const {compute,plural}=require('../build-frequency.js');
const fs=require('fs');
const {data,ctx}=compute();const {freq,order,cnt,EX}=ctx;
const E=window.ENGINE;
const ex=new Set([].concat(EX.names||[],EX.interjections||[],EX.foreign||[],EX.profanity||[]));
// known forms
const known=new Set(ctx.allVerbForms);
ctx.ents.forEach(e=>{ if(/\s/.test(e.bare))return; known.add(e.bare); known.add(plural(e.bare)); if(/o$/.test(e.bare)){const st=e.bare.slice(0,-1);known.add(st+'a');known.add(st+'os');known.add(st+'as');} if(/(or|ón|és|án|ín)$/.test(e.bare)){known.add(e.bare+'a');known.add(e.bare+'as');known.add(e.bare.replace(/[óé]n$|és$/,m=>({ón:'on',én:'en',és:'es'}[m]))+'a')} });
ctx.verbMap.forEach(r=>r.forms.forEach(f=>known.add(f)));
const da=x=>x.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const kd=new Set([...known].map(da));
const CL=/(?:(?:me|te|se|nos|os|lo|la|los|las|le|les)){1,2}$/;
function clitic(f){ const m=f.match(/^(.+?)((?:me|te|se|nos|os|lo|la|los|las|le|les){1,2})$/); return m?m[1]:null; }
const TOP=+process.env.TOP||12000;
const seeds=order.slice(0,TOP);
const groups=new Map();
const taken=new Set();
function add(lemma,kind,f){let g=groups.get(lemma);if(!g){g={lemma,kind,count:0,forms:[]};groups.set(lemma,g)}g.count+=cnt(f);g.forms.push(f);taken.add(f)}
// verb guesses
function regForms(inf){const t=/er$/.test(inf)?'er':/ir$/.test(inf)?'ir':'ar';const v={inf,en:'to x',type:t};const set=new Set([inf]);E.TENSES.forEach(T=>{let a;try{a=E.conjugate(v,T.key)}catch(e){return}(a||[]).forEach(f=>{const p=String(f).replace(/^no /,'').split(' ');set.add(p[p.length-1])})});try{set.add(E.gerund(v));const pa=E.participle(v);set.add(pa);set.add(pa.replace(/o$/,'a'));set.add(pa+'s');set.add(pa.replace(/o$/,'as'))}catch(e){}return [...set]}
for(const f of seeds){
  if(known.has(f)||taken.has(f)||ex.has(f)||!/^[a-zñáéíóúü]{3,}$/.test(f)) continue;
  if(known.has(da(f))||kd.has(da(f))&&da(f)!==f&&known.has(f.normalize('NFC'))){taken.add(f);continue}
  if(kd.has(da(f))){taken.add(f);continue}
  const rem=clitic(f);
  if(rem){ const r2=rem.replace(/(ándo|iéndo)$/,'');
    if(kd.has(da(rem))||kd.has(da(rem)+'s')||/^(.*)(ar|er|ir|ír)$/.test(rem)&&known.has(rem)){taken.add(f);continue}
    if(/(ar|er|ir)$/.test(rem)&&cnt(rem)>0&&rem.length>4){ add(rem,'v',f); continue }
  }
  let m=f.match(/^(.+)(ando|iendo|yendo|ado|ido|ados|idos|adas|idas|ada|ida)$/);
  if(m){
    const st=m[1], ar=/a/.test(m[2][0])?[st+'ar']:[st+'er',st+'ir'];
    let best=null;
    ar.forEach(inf=>{ const fs_=regForms(inf).filter(x=>cnt(x)>0&&!known.has(x)||x===f); const hit=regForms(inf).filter(x=>cnt(x)>=30); if(cnt(inf)>0&&hit.length>=5){const sc=hit.reduce((a,x)=>a+cnt(x),0); if(!best||sc>best.sc)best={inf,sc,hit}} });
    if(best&&ctx.verbMap.has(best.inf)===false){ best.hit.forEach(x=>{if(!known.has(x)&&!taken.has(x))add(best.inf,'v',x)}); continue;}
  }
  // plural/feminine fold
  let base=f;
  const tryb=c=>c&&c.length>=4&&freq.has(c)&&c!==f;
  if(/ces$/.test(f)&&tryb(f.slice(0,-3)+'z'))base=f.slice(0,-3)+'z';
  else if(/(ones|anes|enes|ines)$/.test(f)&&tryb(f.replace(/(on|an|en|in)es$/,m=>({on:'ón',an:'án',en:'én',in:'ín'}[m.slice(0,2)])))) base=f.replace(/(on|an|en|in)es$/,m=>({on:'ón',an:'án',en:'én',in:'ín'}[m.slice(0,2)]));
  else if(/es$/.test(f)&&tryb(f.slice(0,-2))&&!/[aeiou]$/.test(f.slice(0,-2)))base=f.slice(0,-2);
  else if(/s$/.test(f)&&tryb(f.slice(0,-1)))base=f.slice(0,-1);
  if(base!==f&&known.has(base)){taken.add(f);continue;}
  if(/a$/.test(base)&&tryb(base.slice(0,-1)+'o')&&cnt(base.slice(0,-1)+'o')>cnt(base)){ base=base.slice(0,-1)+'o'; }
  if(known.has(base)||kd.has(da(base))){taken.add(f);continue}
  add(base,'w',f);
  [plural(base),base.replace(/o$/,'a'),base.replace(/o$/,'as'),base.replace(/o$/,'os')].forEach(x=>{if(x!==f&&freq.has(x)&&!taken.has(x)&&!known.has(x))add(base,'w',x)});
}
const SPAN_END=/[aeiouáéíóúdlrnszxjñ]$/;
const ALLOW=new Set(['golf','robot','sheriff'].filter(x=>x!=='sheriff'));
for(const [k,g] of [...groups]){
  const bad=ex.has(k)||g.forms.every(f=>ex.has(f))||(g.kind==='w'&&g.forms.length<=1&&!SPAN_END.test(k)&&!ALLOW.has(k))||(g.kind==='v'&&ex.has(k));
  if(bad)groups.delete(k);
}
const out=[...groups.values()].sort((a,b)=>b.count-a.count);
fs.writeFileSync(process.argv[2]||"/dev/null",JSON.stringify(out));
console.log(out.length);
out.slice(+process.argv[3]||0,+process.argv[4]||200).forEach((g,i)=>console.log((i+1+(+process.argv[3]||0))+' '+g.lemma+(g.kind==='v'?'(v)':'')+' '+g.count+' ['+g.forms.slice(0,3).join(',')+']'));
