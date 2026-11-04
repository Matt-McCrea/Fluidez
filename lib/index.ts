// Shared library for the original vanilla-JS app, bundled to js/lib.bundle.js
// and exposed as window.LIB. Each module is ported from the rebuild (app/src)
// and tested under tests/lib; the UI in js/ stays vanilla and calls into here.
import * as engineModule from './engine';
import * as taggerModule from './tagger';
import * as graphModule from './graph';
import * as matchModule from './match';
import * as fsrsModule from './fsrs';
import * as glossModule from './gloss';
import * as searchModule from './search';

export const engine = engineModule;
export const tagger = taggerModule;
export const graph = graphModule;
export const match = matchModule;
export const fsrs = fsrsModule;
export const gloss = glossModule;
export const search = searchModule;
