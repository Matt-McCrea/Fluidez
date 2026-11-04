// Smoke test: the built bundle loads into a bare window and exposes LIB.engine.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { expect, test } from 'vitest';

test('js/lib.bundle.js exposes LIB.engine.conjugate', () => {
  const ctx: any = { window: {} };
  vm.createContext(ctx);
  const src = readFileSync(fileURLToPath(new URL('../../js/lib.bundle.js', import.meta.url)), 'utf8');
  vm.runInContext(src + '\nwindow.LIB = LIB;', ctx);
  const LIB = ctx.window.LIB;
  expect(typeof LIB.engine.conjugate).toBe('function');
  expect(LIB.engine.conjugate('hablar', 'presente')[0]).toBe('hablo');
});
