// Run with Node after building the site. Exercise the shipped eligibility,
// drawing, selection and pricing functions on the exact catalog in the browser page.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const site = path.join(__dirname, 'site');
const html = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
const downstream = fs.readFileSync(path.join(site, 'sow', 'index.html'), 'utf8');

function section(source, first, next) {
  const start = source.indexOf(first);
  const end = source.indexOf(next, start + first.length);
  assert(start >= 0 && end > start, 'Missing application section ' + first);
  return source.slice(start, end);
}

const marker = '<script id="canvas-scope-runtime">';
const runtime = section(html, marker, '</script>').slice(marker.length);
assert(downstream.includes(runtime), 'Both pages must use the same scope rules');
const context = vm.createContext({assert, console});
vm.runInContext(runtime, context);
const selection = section(html, 'const CAT=', 'try{const s=JSON.parse(localStorage') +
  section(html, 'const play=()=>', '/* ---------- layout') +
  section(html, 'function applyHot(){', 'function showCard(');
vm.runInContext(selection, context);

vm.runInContext(`
  const money = String;
  let card, edgeElement;
  const document = {
    querySelectorAll: () => [],
    querySelector: selector => selector.startsWith('.edge') ? edgeElement : null
  };
`, context);

function verify() {
  function seed(products) {
    st.play = 'custom';
    st.on = products.filter(id => !P[id].outside);
    st.out = products.filter(id => P[id].outside);
    st.ls = {};
    st.keep = {};
    st.decisions = CanvasScope.newDecisions();
    if (products.includes('eds') && products.includes('aemsites')) st.decisions.authoring = 'universal';
    st.def = null;
    st.eff = null;
    st.fresh = true;
    st.rate = 185;
    st.size = 'large';
  }

  function arrows(id) {
    const c = CBY[id];
    card = {k: 'c', id};
    edgeElement = {
      dataset: {s: c.a, e: c.b},
      classList: {add() {}},
      setAttribute(key) { this[key] = true; }
    };
    applyHot();
    return [!!edgeElement['marker-end'], !!edgeElement['marker-start']];
  }

  seed(['target', 'cja']);
  assert.deepEqual(arrows('target-cja'), [true, false]);
  assert.equal(counted('TC04'), false);
  for (const partner of ['ajo', 'rtcdp']) {
    st.on.push(partner);
    assert.deepEqual(arrows('target-cja'), [true, true]);
    assert.equal(counted('TC04'), true);
    st.on.pop();
  }

  seed(['ajob2b', 'target']);
  assert.equal(counted('XH11'), false);
  st.on.push('rtcdp');
  assert.equal(counted('XH11'), true);

  // Services that depend on what the client owns start included; the partner removes what does not apply.
  seed(['express', 'frameio', 'aemassets']);
  assert.equal(counted('XJ06'), true);
  assert.equal(counted('XJ17'), true);
  assert.equal(fee('XJ17'), 10360);
  assert.equal(counted('XJ18'), false, 'An optional service stays optional');
  st.ls.XJ17 = false;
  assert.equal(counted('XJ17'), false);

  seed(['commerce', 'eds']);
  assert.equal(counted('XA18'), true);
  assert.equal(counted('XA19'), true);
  assert.equal(counted('XA20'), false, 'An optional service stays optional');
  st.ls.XA18 = false;
  assert.equal(counted('XA18'), false);
  // Answers saved while the tool asked scope questions are dropped, never applied.
  assert.deepEqual(Object.keys(CanvasScope.normalize({authoring:'universal', cdn:'configured', commerce:'paas', workfront:'unavailable'})), ['authoring']);

  seed(['bv', 'eds', 'so', 'cdn']);
  st.play = 'aem';
  assert.equal(totals().yr, 1107040);
  assert.equal(totals().n, 13);
  assert.equal(totals().connectionCount, 3);
  assert.equal(counted('OX1'), true);
  st.ls.OX1 = false;
  assert.equal(counted('OX1'), false);
  assert.equal(totals().n, 12);
  assert.equal(has('cdn'), true);

  seed(['bv', 'eds', 'so', 'aemsites', 'cdn']);
  assert.equal(counted('A01'), true);
  assert.equal(counted('AXC01'), false);
  assert.equal(totals().yr, 1170680);
  assert.equal(totals().connectionCount, 6);
  assert.equal(totals().n, 18);
  st.ls.A01 = false;
  assert.equal(counted('AXC01'), true, 'AEM routing has its own owner when EDS implementation is excluded');
  delete st.ls.A01;
  for (const id of ['SI02', 'SI04', 'SI06']) {
    assert.equal(counted(id), false);
    st.ls[id] = true;
  }
  assert.equal(totals().yr, 1433380);
  st.ls.AXC01 = true;
  assert.equal(totals().yr, 1439300, 'An explicitly scoped second routing setup stays selectable');
  seed(['aemsites', 'bv']);
  assert.equal(counted('AXC01'), true, 'Standalone AEM routing keeps its own service');

  seed(['aemsites', 'cja', 'eds']);
  assert(conns().some(c => c.id === 'eds-cja'));
  for (const id of ['AXA04', 'AXA05', 'EDC01']) assert.equal(counted(id), false);
  st.ls.EDC01 = true;
  assert.equal(counted('EDC01'), true);

  seed(['bv', 'bc']);
  assert.equal(ownerTotal(CBY['bv-bc']).n, 0);
  st.ls.C04 = true;
  assert.equal(ownerTotal(CBY['bv-bc']).n, 1);
  seed(['bc', 'cja']);
  assert.equal(counted('XA10'), false);
  st.ls.XA10 = true;
  assert.equal(counted('XA10'), true);

  for (const c of C) {
    seed([c.a, c.b]);
    assert(conns().includes(c));
    const t = totals();
    assert.equal(t.n, t.productCount + t.connectionCount, c.id);
    assert(Number.isFinite(t.yr), c.id);
  }
  return C.length;
}
const pairs = vm.runInContext('(' + verify.toString() + ')()', context);
console.log('PASS: product prerequisites, pricing defaults and explicit overrides across ' + pairs + ' two-product connections');
