const fs=require('fs');const r=require('./report.json');const STORY=require('./story.js');
const D='/Users/Matthew/Fluidez/app/content/graph/';
const all=['grammar','patterns','chunks','contrasts','candos'].flatMap(f=>JSON.parse(fs.readFileSync(D+f+'.json')));
const byId=Object.fromEntries(all.map(n=>[n.id,n]));
const beat=n=>{const s=STORY[n].split(/(?<=[.!?])\s+/);let b=s[0];if(b.length<60&&s[1])b+=' '+s[1];return b.length>170?b.slice(0,167)+'…':b;};
const pat=u=>{const ps=[];u.days.forEach(d=>d.focus.forEach(f=>{if(f.startsWith('p:')&&byId[f].priority===d.s)ps.push(f)}));
  return ps.slice(0,3).map(f=>{const t=byId[f].title;return t.length>48?t.slice(0,46)+'…':t}).join('; ')+(ps.length>3?` (+${ps.length-3})`:'');};
const bands={A1:'A1 — the engine and every time frame',A2:'A2 — doing things, and the first wish',B1:'B1 — opinions, the subjunctive, longer stories',B2:'B2 — hypotheticals, register, argument',C1:'C1 — nuance, voice and variation'};
let o='';
for(const b of Object.keys(bands)){const us=r.units.filter(u=>u.band===b);
 o+=`\n## ${bands[b]}\n\nUnits ${us[0].n}–${us[us.length-1].n} · sessions ${us[0].s0}–${us[us.length-1].s1} (${us[us.length-1].s1-us[0].s0+1} sessions)\n\n`;
 o+='| Unit | Can-do | Grammar introduced (session) | Key patterns | Story beat |\n|---|---|---|---|---|\n';
 for(const u of us){const g=u.grammar.map(id=>`${id.slice(2)} (${byId[id].priority})`).join(', ');
  const cp=u.days.some(d=>d.t==='C')?' ✓':'';
  o+=`| **u${String(u.n).padStart(2,'0')} ${u.title}**${cp} | ${u.canDo.replace(/^I can /,'')} | ${g} | ${pat(u)||'—'} | ${beat(u.n)} |\n`;}
}
fs.writeFileSync('bands.md',o);
