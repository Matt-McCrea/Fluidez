/* The service worker version must match the bytes of every file it precaches
 * (tools/ru/bump-cache.js), and Perf.BUILD must match the worker. */
const fs = require('fs'), path = require('path');
module.exports = ({ eq, ROOT }) => {
  const B = require('../bump-cache.js');
  eq(B.current(), B.version(), 'russkiy/sw.js CACHE_VERSION is stale: run node tools/ru/bump-cache.js');
  const perf = fs.readFileSync(path.join(ROOT, 'russkiy/js/perf.js'), 'utf8');
  eq(new RegExp("BUILD = '" + B.current() + "'").test(perf), true, 'Perf.BUILD must equal CACHE_VERSION');
};
