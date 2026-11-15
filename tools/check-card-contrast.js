#!/usr/bin/env node
/* check-card-contrast.js: opens a tense card in each of the five apps in headless
 * Chrome (via a temporary harness page, deleted afterwards), resolves every
 * text colour (custom properties included) and its real background, and fails
 * under 4.5:1 or when text sits straight on a patterned page background.
 *   node tools/check-card-contrast.js [app ...]        check
 *   node tools/check-card-contrast.js --shot DIR [app] screenshots at 390px
 * Serves the repo on port 8766 and stops again when done. */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 8766;
const APPS = {
  juegos: { dir: 'juegos', profile: 'fluidez.profile', verbs: /Verbos/ },
  liofa: { dir: 'gaeilge', profile: 'liofa.profile', verbs: /Verbs/ },
  talaqa: { dir: 'arabiya', profile: 'talaqa.profile', verbs: /Verbs/, extra: { 'talaqa.mode': 'script', 'talaqa.huruf': '{"exam":{"passed":true}}' } },
  svobodno: { dir: 'russkiy', profile: 'svobodno.profile', verbs: /Verbs/, extra: { 'svobodno.mode': 'script', 'svobodno.bukvy': '{"exam":{"passed":true}}' } },
  vlot: { dir: 'nederlands', profile: 'vlot.profile', verbs: /Verbs/ }
};
const args = process.argv.slice(2);
let shotDir = null;
if (args[0] === '--shot') { args.shift(); shotDir = args.shift(); }
const names = args.length ? args : Object.keys(APPS);

const DRIVER = (app, shot) => `
<script>
(function () {
  var APP = ${JSON.stringify({ profile: app.profile, verbs: app.verbs.source })};
  var SHOT = ${shot ? 'true' : 'false'};
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  var cv = document.createElement('canvas').getContext('2d');
  function rgba(c) { cv.clearRect(0, 0, 1, 1); cv.fillStyle = '#000'; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); var d = cv.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; }
  function over(top, base) { var a = top[3]; return [top[0] * a + base[0] * (1 - a), top[1] * a + base[1] * (1 - a), top[2] * a + base[2] * (1 - a), 1]; }
  function lum(c) { var f = function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); }
  function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
  function bgOf(e) {
    var stack = [], pattern = false, n = e, solid = false;
    while (n && n.nodeType === 1) {
      var s = getComputedStyle(n), c = rgba(s.backgroundColor);
      var img = s.backgroundImage && s.backgroundImage !== 'none';
      if (c[3] > 0) stack.push(c);
      if (img && !solid) { if (n === document.body || n === document.documentElement) pattern = true; else stack.push(null); }
      if (c[3] >= .98 && !img) { solid = true; break; }
      n = n.parentElement;
    }
    var base = [255, 255, 255, 1], hasImg = false;
    for (var i = stack.length - 1; i >= 0; i--) { if (stack[i] === null) { hasImg = true; continue; } base = over(stack[i], base); }
    return { c: base, pattern: pattern && !solid, image: hasImg };
  }
  function opac(e) { var o = 1; for (var n = e; n && n.nodeType === 1; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity); return o; }
  function name(e) { return e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\\s+/).join('.') : ''); }
  function analyse(root, tag) {
    var out = [];
    root.querySelectorAll('*').forEach(function (e) {
      if (!e.getClientRects().length) return;
      var own = ''; e.childNodes.forEach(function (t) { if (t.nodeType === 3) own += t.textContent; });
      own = own.trim(); if (!own) return;
      var s = getComputedStyle(e); if (s.visibility === 'hidden') return;
      var b = bgOf(e), o = opac(e), fg = rgba(s.color);
      fg[3] *= o; var f = over(fg, b.c);
      out.push({ tag: tag, el: name(e), text: own.slice(0, 24), fg: f.slice(0, 3).map(Math.round).join(','), bg: b.c.slice(0, 3).map(Math.round).join(','), ratio: Math.round(ratio(f, b.c) * 100) / 100, pattern: b.pattern, image: b.image });
    });
    return out;
  }
  async function go() {
    await wait(1200);
    var re = new RegExp(APP.verbs);
    var tile = Array.prototype.filter.call(document.querySelectorAll('.arc-tile'), function (t) { return re.test(t.textContent); })[0];
    if (tile) tile.click();
    await wait(400);
    var q = document.querySelector('.arc-chipq'); if (q) q.click();
    await wait(400);
    var host = document.getElementById('stage-host') || document.body;
    var res = analyse(host, 'card');
    if (SHOT) { window.scrollTo(0, 0); return; }
    var tabs = host.querySelectorAll('.arc-irr button, .arc-irr-tab, [class*="arc-irr"] button');
    for (var i = 0; i < tabs.length; i++) { tabs[i].click(); await wait(60); res = res.concat(analyse(host, 'tab' + i)); }
    var pre = document.createElement('pre'); pre.id = 'contrast-out';
    pre.textContent = JSON.stringify({ hasCard: !!q, tile: !!tile, res: res }); document.body.appendChild(pre);
  }
  if (document.readyState === 'complete') go(); else window.addEventListener('load', go);
})();
</script>`;

function serve() {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg' };
  const srv = http.createServer((req, res) => {
    const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise(r => srv.listen(PORT, () => r(srv)));
}
function run(args) { return new Promise(r => cp.execFile(CHROME, ['--headless=new', '--disable-gpu', '--virtual-time-budget=10000', ...args], { maxBuffer: 1 << 26 }, (e, out) => r(out || ''))); }

(async () => {
  const srv = await serve();
  let fail = 0;
  for (const n of names) {
    const app = APPS[n], dir = path.join(ROOT, app.dir), hp = path.join(dir, '_harness.html');
    try {
      const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8').replace(/<script defer src="[^"]*sw[^"]*"><\/script>/g, '');
      const pre = `<script>try{localStorage.setItem(${JSON.stringify(app.profile)},JSON.stringify({band:'A1',placed:true}));var x=${JSON.stringify(app.extra || {})};for(var k in x)localStorage.setItem(k,x[k])}catch(e){}</script>`;
      fs.writeFileSync(hp, html.replace('<head>', '<head>' + pre).replace('</body>', DRIVER(app, !!shotDir) + '</body>'));
      const url = `http://localhost:${PORT}/${app.dir}/_harness.html`;
      if (shotDir) {
        fs.mkdirSync(shotDir, { recursive: true });
        const wp = path.join(dir, '_shot.html');      // an iframe gives a true 390px viewport (headless Chrome will not go under 500)
        fs.writeFileSync(wp, `<!doctype html><body style="margin:0;background:#888"><iframe src="_harness.html" style="width:390px;height:1700px;border:0;display:block"></iframe></body>`);
        try { await run(['--window-size=390,1700', '--screenshot=' + path.join(shotDir, n + '.png'), `http://localhost:${PORT}/${app.dir}/_shot.html`]); } finally { fs.unlinkSync(wp); }
        console.log(n + ': ' + path.join(shotDir, n + '.png'));
        continue;
      }
      const dom = await run(['--dump-dom', url]);
      const m = dom.match(/<pre id="contrast-out">([\s\S]*?)<\/pre>/);
      if (!m) { console.log(n + ': harness produced nothing'); fail++; continue; }
      const d = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
      if (!d.hasCard) { console.log(n + ': no ? card button reached (tile ' + d.tile + ')'); fail++; continue; }
      const seen = new Set(), bad = [];
      d.res.forEach(r => {
        const key = r.el + '|' + r.fg + '|' + r.bg;
        if (seen.has(key)) return; seen.add(key);
        if (r.ratio < 4.5 || r.pattern) bad.push(r);
      });
      console.log(n + ': ' + d.res.length + ' text elements, ' + bad.length + ' problems');
      bad.forEach(r => console.log('   ' + r.ratio + '  ' + r.el + '  "' + r.text + '"  fg ' + r.fg + ' bg ' + r.bg + (r.pattern ? '  ON PATTERN' : '') + (r.image ? ' (image behind)' : '')));
      fail += bad.length;
    } finally { try { fs.unlinkSync(hp); } catch (e) {} }
  }
  srv.close();
  process.exit(fail ? 1 : 0);
})();
