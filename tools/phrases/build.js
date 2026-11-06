// Builds phrases.json from src/*.txt. Lines: es|en|alt;alt|th|band|note. Lines "#T1" set tier.
const fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'src');const out=[];
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.txt')).sort()){
  let tier=1;
  for(const raw of fs.readFileSync(path.join(dir,f),'utf8').split('\n')){
    const l=raw.trim();if(!l)continue;
    const m=l.match(/^#T(\d)$/);if(m){tier=+m[1];continue;}
    const p=l.split('|');
    const o={es:p[0].trim(),en:p[1].trim(),alt:(p[2]||'').split(';').map(s=>s.trim()).filter(Boolean),th:p[3].trim(),b:p[4].trim(),tier};
    if(p[5]&&p[5].trim())o.note=p[5].trim();
    out.push(o);
  }
}
out.sort((a,b)=>a.tier-b.tier);
fs.writeFileSync(path.join(__dirname,'phrases.json'),JSON.stringify(out,null,1)+'\n');
console.log(out.length+' phrases');
