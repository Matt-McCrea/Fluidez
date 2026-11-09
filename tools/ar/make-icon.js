#!/usr/bin/env node
/* Ṭalāqa icons: ع in gold, set in the app's own Naskh font, on lapis.
 * Rendered in headless Chromium (Playwright) so the letter is a real glyph.
 *   node tools/ar/make-icon.js [path-to-playwright] */
'use strict';
const path = require('path');
const fs = require('fs');
const PW = process.argv[2] || '/Users/Matthew/.npm/_npx/705bc6b22212b352/node_modules/playwright';
const { chromium } = require(PW);
const ROOT = path.join(__dirname, '..', '..');
const font = fs.readFileSync(path.join(ROOT, 'arabiya', 'fonts', 'naskh.woff2')).toString('base64');
const SIZES = [['icon-512.png', 512, 0.62], ['icon-192.png', 192, 0.62], ['apple-touch-icon.png', 180, 0.62], ['icon-512-maskable.png', 512, 0.5]];
(async () => {
  const b = await chromium.launch();
  for (const [name, size, scale] of SIZES) {
    const p = await b.newPage({ viewport: { width: size, height: size } });
    await p.setContent(`<style>@font-face{font-family:N;src:url(data:font/woff2;base64,${font})}
      html,body{margin:0;width:${size}px;height:${size}px;background:#12305a;display:flex;align-items:center;justify-content:center}
      span{font:700 ${Math.round(size * scale)}px N;color:#e9b44c;line-height:1;transform:translateY(-${Math.round(size * 0.06)}px)}</style><span>ع</span>`);
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(ROOT, 'arabiya', 'icons', name) });
    await p.close();
  }
  await b.close();
  console.log('icons written');
})();
