// Shared library for the original vanilla-JS app, bundled to js/lib.bundle.js
// and exposed as window.LIB.
import * as engineModule from './engine';

export const engine = engineModule;
