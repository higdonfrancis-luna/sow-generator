'use strict';
/* Backtest of the hybrid number on SYNTHETIC dated holdings, using the same scoring code the page would run.
   Tune m on an earlier year (rates as of VAL, outcomes in the 12 months after), then test once on a later year
   (rates as of TEST, outcomes in the 12 months after) that tuning never saw.
   usage: node backtest.js <canvas dir> <synthetic dir> <out file> */
const fs = require('fs'), path = require('path');
const NB = require('./nextbuy_hybrid.js');
const [dir, sdir, outFile] = process.argv.slice(2);
const cat = JSON.parse(fs.readFileSync(path.join(dir, 'catalog.json'), 'utf8'));
const probs = JSON.parse(fs.readFileSync(path.join(dir, 'problems.json'), 'utf8'));
const F = NB.facts(cat, probs);
const launch = JSON.parse(fs.readFileSync(path.join(sdir, 'launch_SYNTHETIC.json'), 'utf8'));
const first = new Map();
for (const line of fs.readFileSync(path.join(sdir, 'holdings_SYNTHETIC.csv'), 'utf8').trim().split('\n').slice(1)) {
  const [a, p, mth] = line.split(','); if (!first.has(a)) first.set(a, new Map()); first.get(a).set(p, Number(mth));
}
const load = n => JSON.parse(fs.readFileSync(path.join(sdir, `rates_${n}_SYNTHETIC.json`), 'utf8'));
const lines = []; const say = s => { lines.push(s); console.log(s); };

/* score every account x product on sale at T that it doesn't own; y = bought within 12 months */
function score(R, T, opts, thinOnly) {
  const accts = [];
  for (const [, own] of first) {
    const S = [...own].filter(([, mth]) => mth < T).map(([p]) => p);
    const cands = R.products.filter(x => !S.includes(x) && (launch[x] ?? -1e6) <= T - 1 && (!thinOnly || (launch[x] ?? -1e6) > T - 13));
    if (!cands.length) continue;
    accts.push(cands.map(x => ({x, p: Math.min(Math.max(NB.dataNumber(F, R, x, S, opts).value, 1e-4), 0.9999),
      y: own.has(x) && own.get(x) >= T && own.get(x) < T + 12 ? 1 : 0})));
  }
  return accts;
}
const logit = p => Math.log(p / (1 - p)), sig = z => 1 / (1 + Math.exp(-z));
/* two-number calibration (Platt): p' = sig(a + b * logit(p)), fitted by Newton's method on one year's outcomes */
function fitCal(accts) {
  let a = 0, b = 1;
  const xs = accts.flat();
  for (let it = 0; it < 30; it++) {
    let ga = 0, gb = 0, haa = 0, hab = 0, hbb = 0;
    for (const s of xs) {
      const z = logit(s.p), q = sig(a + b * z), w = q * (1 - q);
      ga += s.y - q; gb += (s.y - q) * z; haa += w; hab += w * z; hbb += w * z * z;
    }
    const det = haa * hbb - hab * hab; if (!det) break;
    const da = (hbb * ga - hab * gb) / det, db = (haa * gb - hab * ga) / det;
    a += da; b += db; if (Math.abs(da) + Math.abs(db) < 1e-9) break;
  }
  return {a, b};
}
function metrics(accts, cal) {
  let ll = 0, br = 0, cnt = 0, hit = 0, buyers = 0;
  const bins = [0, .005, .01, .02, .05, .1, .2, .3, .5, 1.01].map((lo, i, a) => ({lo, hi: a[i + 1], p: 0, y: 0, n: 0})).slice(0, -1);
  for (const sc of accts) {
    for (const s of sc) {
      const p = cal ? Math.min(Math.max(sig(cal.a + cal.b * logit(s.p)), 1e-4), 0.9999) : s.p;
      ll -= s.y ? Math.log(p) : Math.log(1 - p); br += (p - s.y) ** 2; cnt++;
      const bn = bins.find(b => p >= b.lo && p < b.hi); bn.p += p; bn.y += s.y; bn.n++;
    }
    if (sc.some(s => s.y)) { buyers++; if (sc.slice().sort((a, b) => b.p - a.p).slice(0, 3).some(s => s.y)) hit++; }
  }
  return {logloss: ll / cnt, brier: br / cnt, top3: hit / buyers, buyers, pairs: cnt, bins};
}
function evaluate(R, T, opts, thinOnly, cal) { return metrics(score(R, T, opts, thinOnly), cal); }
const f3 = v => v.toFixed(3), pct = v => (100 * v).toFixed(1) + '%';

say('SYNTHETIC BACKTEST: invented accounts and launch months. It tests the method, not Adobe\'s market.\n');
/* 1. tune m on the validation year */
const val = load('val'), VAL = val.asof;
say(`Tuning the prior strength m on the validation year (rates as of month ${VAL}, purchases in months ${VAL}-${VAL + 11}):`);
let best = null, bestLL = Infinity;
for (const mDoc of [500, 2000, 5000, 20000, 100000]) for (const m of [20, 100, 500, 2000, 10000]) {
  const o = {m, mDoc, maxset: 2, raw: true};
  const sc = score(val, VAL, o), raw = metrics(sc), cal = fitCal(sc), c = metrics(sc, cal);
  say(`  mDoc=${String(mDoc).padStart(6)} m=${String(m).padStart(5)}  log loss ${f3(raw.logloss)} raw, ${c.logloss.toFixed(4)} calibrated  top-3 ${pct(raw.top3)}`);
  if (c.logloss < bestLL) { bestLL = c.logloss; best = {m, mDoc}; }
}
const bestM = best.m, bestMDoc = best.mDoc;
say(`  chosen: mDoc = ${bestMDoc} (documentation vs a product's own history), m = ${bestM} (a combination vs smaller ones)\n`);

/* 2. test once on the later year */
const test = load('test'), TEST = test.asof;
const methods = [
  ['Popularity only (each product\'s overall rate)', {noSets: true, bottom: 'base', m: bestM}],
  ['Documentation only (rate by number of documented links)', {docOnly: true, m: bestM}],
  ['Sales data only (2-product combinations, no doc prior)', {bottom: 'base', maxset: 2, m: bestM}],
  ['Hybrid, combinations up to 3 products', {maxset: 3, m: bestM}],
  ['Hybrid, the design (combinations up to 2 products)', {maxset: 2, m: bestM}],
];
say(`Test year (rates as of month ${TEST}, purchases in months ${TEST}-${TEST + 11}), all products on sale at month ${TEST}:`);
const res = {}, calOf = {};
for (const [name, o] of methods) {
  const t0 = Date.now();
  o.raw = true; if (o.mDoc === undefined) o.mDoc = bestMDoc;
  const calV = fitCal(score(val, VAL, o)); calOf[name] = calV;     // each method gets its own calibration, from the validation year only
  const sc = score(test, TEST, o), r = metrics(sc), c = metrics(sc, calV); res[name] = {r, c};
  say(`  ${name.padEnd(58)} top-3 ${pct(r.top3)}  log loss ${f3(r.logloss)} raw / ${f3(c.logloss)} calibrated  Brier ${c.brier.toFixed(4)}  (${r.buyers} buying accounts, ${((Date.now() - t0) / 1000).toFixed(1)} s)`);
}
const thinList = test.products.filter(x => (launch[x] ?? -1e6) > TEST - 13 && (launch[x] ?? -1e6) <= TEST - 1);
say(`\nSame test, only products on sale for less than 12 months at month ${TEST} (thin history: ${thinList.join(', ')}):`);
for (const [name, o] of methods) {
  const sc = score(test, TEST, o, true), r = metrics(sc), c = metrics(sc, calOf[name]);
  say(`  ${name.padEnd(58)} top-3 among them ${pct(r.top3)}  log loss ${f3(r.logloss)} raw / ${f3(c.logloss)} calibrated  (${r.buyers} buyers)`);
}
const design = 'Hybrid, the design (combinations up to 2 products)';
for (const [label, key] of [['raw (no calibration)', 'r'], ['calibrated with the two numbers fitted on the validation year', 'c']]) {
  say(`\nCalibration of the design on the test year, ${label}:`);
  say('  tool said      pairs   average said   share that bought');
  for (const b of res[design][key].bins) if (b.n) say(`  ${(b.lo).toFixed(3)}-${Math.min(b.hi, 1).toFixed(3)}  ${String(b.n).padStart(7)}      ${f3(b.p / b.n)}          ${f3(b.y / b.n)}`);
}
say(`\nShipped with the design: calibration a=${calOf[design].a.toFixed(3)}, b=${calOf[design].b.toFixed(3)}; mDoc=${bestMDoc}; m=${bestM}`);
fs.writeFileSync(path.join(path.dirname(outFile), 'calibration_SYNTHETIC.json'), JSON.stringify({m: bestM, mDoc: bestMDoc, cal: calOf[design], SYNTHETIC: true}));
fs.writeFileSync(outFile, lines.join('\n') + '\n');
