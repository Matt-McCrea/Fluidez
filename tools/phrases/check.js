const fs=require('fs'),path=require('path');
const TH='relaciones alimentacion viajes compras trabajo educacion salud vivienda ocio servicios cuerpo caracter medios economia naturaleza arte politica ciencia identidad religion basicas'.split(' ');
const BANDS=['A1','A2','B1','B2','C1'];
const SPAIN=['coche','móvil','movil','tío','tia','tía','coger','guay','vosotros','vosotras','vuestro','vuestra','vuestros','vuestras','ordenador','gilipollas','mola','molar','currar','chaval','zumo','patata','aparcar','conducir el coche','joder','ostras','hostia','mogollón','os'];
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9ñ ]/g,' ').replace(/\s+/g,' ').trim();
let errs=[];const err=(i,m)=>errs.push('#'+i+' '+m);
let data;try{data=JSON.parse(fs.readFileSync(path.join(__dirname,'phrases.json'),'utf8'));}catch(e){console.log('bad JSON',e.message);process.exit(1);}
const seenEs=new Map(),seenEn=new Map();const tc={},thc={};
data.forEach((d,i)=>{
  for(const k of ['es','en','alt','th','b','tier'])if(d[k]===undefined)err(i,'missing '+k);
  if(typeof d.es!=='string'||typeof d.en!=='string'||!Array.isArray(d.alt))return;
  for(const [lab,s] of [['es',d.es],['en',d.en],['note',d.note||''],...d.alt.map(a=>['alt',a])]){
    if(/[-‐-―−]/.test(s))err(i,'dash in '+lab+': '+s);
  }
  for(const s of [d.es,...d.alt]){
    const w=s.trim().split(/\s+/).length;
    if(w<2||w>8)err(i,w+' words: '+s);
    const q=(s.match(/¿/g)||[]).length,qq=(s.match(/\?/g)||[]).length,e=(s.match(/¡/g)||[]).length,ee=(s.match(/!/g)||[]).length;
    if(q!==qq)err(i,'¿? unpaired: '+s);if(e!==ee)err(i,'¡! unpaired: '+s);
    if(/\bcog(er|í|e|es|emos|en|ió|ía)(?![a-zñáéíóú])/i.test(s))err(i,'Spain coger: '+s);
    if(/(^|[,¿¡.] ?)vale\b(?! la pena)/i.test(s))err(i,'Spain vale: '+s);
    const toks=norm(s.replace(/vale la pena|valer la pena|vale mucho|vale más/gi,'')).split(' ');
    for(const sp of SPAIN){const n=norm(sp);if(n.includes(' ')?norm(s.replace(/vale la pena/gi,'')).includes(n):toks.includes(n))err(i,'Spain word "'+sp+'": '+s);}
  }
  if(!TH.includes(d.th))err(i,'theme '+d.th);
  if(!BANDS.includes(d.b))err(i,'band '+d.b);
  if(![1,2,3].includes(d.tier))err(i,'tier');
  const ne=norm(d.es),nn=norm(d.en);
  if(seenEs.has(ne))err(i,'dup es '+d.es+' (#'+seenEs.get(ne)+')');seenEs.set(ne,i);
  if(seenEn.has(nn))err(i,'dup en '+d.en+' (#'+seenEn.get(nn)+')');seenEn.set(nn,i);
  d.alt.forEach(a=>{if(norm(a)===ne)err(i,'alt equals es');});
  tc[d.tier]=(tc[d.tier]||0)+1;thc[d.th]=(thc[d.th]||0)+1;
});
console.log(data.length+' phrases; tiers',JSON.stringify(tc));console.log('themes',JSON.stringify(thc));
if(errs.length){console.log(errs.slice(0,80).join('\n'));console.log(errs.length+' errors');process.exit(1);}
console.log('✅');
