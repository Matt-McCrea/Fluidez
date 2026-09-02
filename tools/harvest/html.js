/* ============================================================================
 * html.js — a tiny dependency-free HTML tree builder for the harvest scripts.
 *
 * The CVC pages are hand-written 2006-era HTML: unclosed <p>, stray tags, an
 * iso-8859-1 charset declaration on what is actually UTF-8. A real parser is
 * overkill and regex is not enough (we need to tell an <em> example apart from
 * the surrounding pattern text), so this builds a minimal forgiving DOM.
 *
 *   parse(html) -> node        node = { tag, attrs, children, parent }
 *                              text nodes are plain strings
 *   text(node)                 all descendant text, whitespace-collapsed
 *   directText(node, skip)     text, skipping whole subtrees named in `skip`
 *   find(node, tag, skip)      descendants with that tag, not descending into
 *                              any subtree named in `skip` (keeps a nested <ul>
 *                              from leaking its <em> examples into its parent)
 *   findChildren(node, tag)    immediate children with that tag
 * ========================================================================== */
'use strict';

var VOID = { br: 1, img: 1, hr: 1, meta: 1, link: 1, input: 1, area: 1, base: 1, col: 1, embed: 1, param: 1, source: 1, wbr: 1 };
// tags that may legally be left unclosed and should auto-close on a sibling
var AUTOCLOSE = { p: { p: 1, div: 1, table: 1, ul: 1, ol: 1, h1: 1, h2: 1, h3: 1, h4: 1 }, li: { li: 1 }, td: { td: 1, th: 1, tr: 1 }, th: { td: 1, th: 1, tr: 1 }, tr: { tr: 1 } };

var ENTS = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ndash: '\u2013', mdash: '\u2014', hellip: '\u2026', laquo: '\u00ab', raquo: '\u00bb',
  rsquo: '\u2019', lsquo: '\u2018', ldquo: '\u201c', rdquo: '\u201d', middot: '\u00b7',
  deg: '\u00b0', ordm: '\u00ba', ordf: '\u00aa', iexcl: '\u00a1', iquest: '\u00bf',
  aacute: '\u00e1', eacute: '\u00e9', iacute: '\u00ed', oacute: '\u00f3', uacute: '\u00fa',
  Aacute: '\u00c1', Eacute: '\u00c9', Iacute: '\u00cd', Oacute: '\u00d3', Uacute: '\u00da',
  ntilde: '\u00f1', Ntilde: '\u00d1', uuml: '\u00fc', Uuml: '\u00dc',
  agrave: '\u00e0', egrave: '\u00e8', igrave: '\u00ec', ograve: '\u00f2', ugrave: '\u00f9',
  acirc: '\u00e2', ecirc: '\u00ea', icirc: '\u00ee', ocirc: '\u00f4', ucirc: '\u00fb',
  auml: '\u00e4', euml: '\u00eb', iuml: '\u00ef', ouml: '\u00f6', ccedil: '\u00e7',
  eth: '\u00f0', szlig: '\u00df', copy: '\u00a9', reg: '\u00ae', euro: '\u20ac',
  bull: '\u2022', dagger: '\u2020', prime: '\u2032', times: '\u00d7', divide: '\u00f7' };

function decode(s) {
  return String(s).replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, function (m, e) {
    if (e[0] === '#') {
      var n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return isNaN(n) ? m : String.fromCodePoint(n);
    }
    return ENTS[e] != null ? ENTS[e] : m;
  });
}

function parse(html) {
  var src = String(html)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, '');

  var root = { tag: '#root', attrs: {}, children: [], parent: null };
  var cur = root, i = 0, re = /<\/?([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g, m;

  function addText(raw) {
    if (!raw) return;
    var t = decode(raw);
    if (/\S/.test(t) || / /.test(t)) cur.children.push(t);
  }
  function close(tag) {
    // pop to the nearest matching open element; ignore if never opened
    var n = cur;
    while (n && n !== root) { if (n.tag === tag) { cur = n.parent; return; } n = n.parent; }
  }

  while ((m = re.exec(src))) {
    addText(src.slice(i, m.index));
    i = re.lastIndex;
    var tag = m[1].toLowerCase(), closing = m[0][1] === '/', selfClose = /\/\s*$/.test(m[2]);

    if (closing) { close(tag); continue; }

    // auto-close the previous sibling where the markup omits the end tag
    var guard = 0;
    while (cur !== root && AUTOCLOSE[cur.tag] && AUTOCLOSE[cur.tag][tag] && guard++ < 50) cur = cur.parent;

    var attrs = {}, ar = /([a-zA-Z0-9_:-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]*))/g, am;
    while ((am = ar.exec(m[2]))) attrs[am[1].toLowerCase()] = decode(am[3] != null ? am[3] : am[4] != null ? am[4] : am[5] || '');

    var node = { tag: tag, attrs: attrs, children: [], parent: cur };
    cur.children.push(node);
    if (!VOID[tag] && !selfClose) cur = node;
  }
  addText(src.slice(i));
  return root;
}

function walkText(node, out, skip) {
  if (typeof node === 'string') { out.push(node); return; }
  if (skip && skip[node.tag]) return;
  if (node.tag === 'br') { out.push(' '); return; }
  for (var i = 0; i < node.children.length; i++) walkText(node.children[i], out, skip);
}

function clean(s) { return s.replace(/\s+/g, ' ').replace(/\s+([,.;:)\]])/g, '$1').trim(); }

function text(node) { var o = []; walkText(node, o, null); return clean(o.join('')); }

function directText(node, skipTags) {
  var skip = {};
  (skipTags || []).forEach(function (t) { skip[t] = 1; });
  var o = []; walkText(node, o, skip); return clean(o.join(''));
}

function find(node, tag, skipTags, out) {
  out = out || [];
  if (typeof node === 'string') return out;
  var skip = {};
  (skipTags || []).forEach(function (t) { skip[t] = 1; });
  for (var i = 0; i < node.children.length; i++) {
    var c = node.children[i];
    if (typeof c === 'string' || skip[c.tag]) continue;
    if (c.tag === tag) out.push(c);
    find(c, tag, skipTags, out);
  }
  return out;
}

function findChildren(node, tag) {
  return (node.children || []).filter(function (c) { return typeof c !== 'string' && c.tag === tag; });
}

module.exports = { parse: parse, text: text, directText: directText, find: find, findChildren: findChildren, decode: decode, clean: clean };
