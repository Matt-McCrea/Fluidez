#!/usr/bin/env node
/* Svobodno icons: a gold С on a red-to-black lacquer ground (#d2402f to #110c0b).
 * Rendered in headless Chromium (Playwright) so the letter is a real glyph.
 *   node tools/ru/make-icon.js [path-to-playwright] */
'use strict';
const path = require('path');
const PW = process.argv[2] || '/Users/Matthew/.npm/_npx/705bc6b22212b352/node_modules/playwright';
const { chromium } = require(PW);
const ROOT = path.join(__dirname, '..', '..');
const SIZES = [['icon-512.png', 512, 0.62], ['icon-192.png', 192, 0.62], ['apple-touch-icon.png', 180, 0.62], ['icon-512-maskable.png', 512, 0.5]];
(async () => {
  const b = await chromium.launch();
  for (const [name, size, scale] of SIZES) {
    const p = await b.newPage({ viewport: { width: size, height: size } });
    await p.setContent(`<style>
      html,body{margin:0;width:${size}px;height:${size}px;background:linear-gradient(160deg,#d2402f 0%,#110c0b 85%);display:flex;align-items:center;justify-content:center}
      span{font:700 ${Math.round(size * scale)}px -apple-system,"Helvetica Neue",Arial,sans-serif;color:#e3a83a;line-height:1;transform:translateY(-${Math.round(size * 0.02)}px)}</style><span>С</span>`);
    await p.screenshot({ path: path.join(ROOT, 'russkiy', 'icons', name) });
    await p.close();
  }
  await b.close();
  console.log('icons written');
})();
