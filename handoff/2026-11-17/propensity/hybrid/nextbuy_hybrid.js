'use strict';
/* What they buy next, hybrid design (prototype for nbp/design_hybrid.md).
   Pure functions, no page code: the canvas would call rank() on every change.

   Layer 1, day one (no sales data): the goal the partner picked once, plus Adobe's documented connections
   and services from catalog.json. Gives an ORDER and a reason, never a probability.
   Layer 2, when Adam ships an aggregate rates file: a number for each product, from the sales data,
   pulled toward smaller combinations of the canvas when the exact one is rare, and toward a
   documentation prior (measured on established products) when the product itself has little history.

   Nothing here reads account data. The rates file holds only rounded rates and account-count bands. */

const KIND = {native: 'Native integration', platform: 'Shared-platform data path', extension: 'Supported extension',
  partner: 'Partner-designed workflow', outside: 'Outside system'};
const KIND_ORDER = {native: 3, platform: 3, extension: 2, partner: 1, outside: 0};
const SITES = 'eds';                       // the menu's single AEM Sites row (Edge Delivery or traditional publish)
const off = id => (id === 'aemsites' || id === 'eds') ? SITES : id;

const andList = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
const you = s => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s).replace(/\bmy client/g, 'your client');
const voice = s => s.replace(/\b([Tt])he client\b(?![-\w'])/g, (m, t) => (t === 'T' ? 'Your' : 'your') + ' client')
  .replace(/\b[Tt]he (customer|client)'s\b/g, (m) => (m[0] === 'T' ? 'Your' : 'your') + " client's");

/* ---------- the facts, built once from catalog.json and problems.json ---------- */
function facts(cat, probs) {
  const P = Object.fromEntries(cat.products.map(p => [p.id, p]));
  const custom = cat.plays.find(p => p.custom);
  const offerings = [...new Set(custom.products.filter(id => !P[id].outside).map(off))];
  const links = new Map();                 // offering -> Map(other offering -> [connections])
  for (const c of cat.connections) {
    const a = off(c.a), b = off(c.b);
    if (a === b) continue;                 // Edge Delivery <-> AEM Sites is inside one offering
    for (const [x, y] of [[a, b], [b, a]]) {
      if (!links.has(x)) links.set(x, new Map());
      const m = links.get(x); if (!m.has(y)) m.set(y, []); m.get(y).push(c);
    }
  }
  const name = id => id === SITES ? 'AEM Sites' : (P[id].title || P[id].name);
  const own = id => id === SITES ? [...new Set([...(P.eds.lines || []), ...(P.aemsites.lines || [])])] : (P[id].lines || []);
  const PR = Object.fromEntries(probs.problems.map(p => [p.id, p]));
  return {P, offerings, links, name, own, PR, outside: id => !!(P[id] && P[id].outside)};
}

/* ---------- layer 1: the goal tier and the documentation facts for one candidate ---------- */
const TIER = {
  3: 'The goal calls for it',
  2: 'Extends the goal',
  1: 'Works with the goal\'s products',
  0: 'Connects to your canvas',
};

function goalParts(F, goalIds) {
  const goals = (goalIds || []).map(g => F.PR[g]).filter(Boolean);
  const core = [];                         // the goal's own Adobe products, in the order the problem lists them
  for (const g of goals) for (const id of g.products) if (!F.outside(id) && !core.includes(off(id))) core.push(off(id));
  /* a refine chip either adds a product the client would BUY ("leaders want readouts on request" adds Coworker),
     or says the client ALREADY HAS one ("My client owns CJA": problems.json lists it under owned). Only the first is a
     purchase. The second becomes a "check first" question: what should they already own. */
  const ext = new Map(), owned = new Map();
  for (const g of goals) for (const r of g.refine || []) for (const id of r.add || []) {
    if (F.outside(id) || core.includes(off(id))) continue;
    const o = off(id), has = (r.owned || []).map(off).includes(o);
    if (!has && !ext.has(o)) ext.set(o, {chip: r.chip, note: r.note || ''});
    if (has && !owned.has(o)) owned.set(o, {chip: r.chip, note: r.note || ''});
  }
  for (const o of ext.keys()) owned.delete(o);   // a product some chip sells stays a purchase
  return {goals, core, ext, owned};
}

function candidateFacts(F, x, S, G) {
  const L = F.links.get(x) || new Map();
  const toCanvas = S.filter(s => L.has(s));
  const toCore = G.core.filter(s => s !== x && L.has(s));
  const conns = toCanvas.flatMap(s => L.get(s));
  const svc = conns.reduce((n, c) => n + (c.lines || []).length, 0);
  const more = conns.reduce((n, c) => n + (c.more || []).length, 0);
  const best = conns.slice().sort((a, b) => (KIND_ORDER[b.kind] || 0) - (KIND_ORDER[a.kind] || 0)
    || (b.lines || []).length - (a.lines || []).length)[0] || null;
  /* a product the goal's chips treat as something the client already has is asked about (check first), not sold as part
     of the goal: it drops to the "also connects" group, or out of the list when nothing on the canvas connects to it */
  const askOwned = G.owned.has(x);
  const tier = G.core.includes(x) ? 3 : G.ext.has(x) ? 2 : askOwned ? (toCanvas.length ? 0 : -1)
    : toCore.length ? 1 : toCanvas.length ? 0 : -1;
  return {id: x, name: F.name(x), tier, toCanvas, toCore, svc, more, ownSvc: F.own(x).length, best,
    ext: G.ext.get(x) || null, coreAt: G.core.indexOf(x)};
}

function whyText(F, r, G) {
  const parts = [];
  const chip = G.goals.length ? G.goals.map(g => g.chip).join('; ') : '';
  if (r.tier === 3) parts.push(`The goal you picked ("${chip}") calls for it.`);
  else if (r.tier === 2) parts.push(`Extends the goal if ${you(r.ext.chip)}.${r.ext.note ? ' ' + r.ext.note : ''}`);
  else if (r.tier === 1) parts.push(`Works with ${andList(r.toCore.map(F.name))}, which the goal needs.`);
  if (r.best) {
    const other = off(r.best.a) === r.id ? r.best.b : r.best.a;
    const label = voice(String(r.best.label || r.best.how || '').split(/;\s|\.\s/)[0]).replace(/\.$/, '');
    parts.push(`On your canvas it connects to ${andList(r.toCanvas.map(F.name))}. ${F.name(r.id)} + ${F.name(off(other))}: ${label} (${KIND[r.best.kind] || 'Connection'}).`);
  } else if (r.tier >= 1) parts.push('Nothing on your canvas connects to it yet.');
  return parts.join(' ');
}

/* ---------- layer 2: the number, from an aggregate rates file (absent on day one) ---------- */
/* est(A) = (r_A * n_A + m * prior_A) / (n_A + m)
   prior_A = the account-weighted average of est() over A minus one product (smaller combinations),
   and for the empty combination: the documentation prior for how x connects to the whole canvas. */
/* opts (for the backtest's comparisons only): {bottom: 'doc' (the design) | 'base' (no documentation prior),
   noSets: true (product's overall rate only), maxset: cap on combination size used, m: prior strength override} */
function combos(a, k, start = 0, pre = [], out = []) {
  if (pre.length === k) { out.push(pre); return out; }
  for (let i = start; i <= a.length - (k - pre.length); i++) combos(a, k, i + 1, pre.concat(a[i]), out);
  return out;
}
function dataNumber(F, R, x, S, opts = {}) {
  if (!R || !R.products.includes(x)) return null;
  const inData = S.filter(s => R.products.includes(s) && s !== x).sort();
  const nLinks = Math.min(3, inData.filter(s => (F.links.get(x) || new Map()).has(s)).length);
  const docPrior = R.docPrior[String(nLinks)];
  const m = opts.m !== undefined ? opts.m : R.m, maxset = opts.noSets ? 0 : (opts.maxset || 3), memo = new Map();
  const b = R.base[x];
  /* bottom of the chain: the product's own overall record, pulled toward the documentation prior by mDoc
     (a second dial: how much the documentation counts against a product's own history) */
  const mDoc = opts.mDoc !== undefined ? opts.mDoc : (R.mDoc !== undefined ? R.mDoc : m);
  const bottom = opts.bottom === 'base' ? {v: b ? b.r : docPrior, n: b ? b.n : 0}
    : {v: b ? (b.r * b.n + mDoc * docPrior) / (b.n + mDoc) : docPrior, n: b ? b.n : 0};
  function est(A) {
    if (!A.length) return bottom;
    const key = A.join('+');
    if (memo.has(key)) return memo.get(key);
    let w = 0, v = 0;                      // prior: smaller combinations, weighted by the accounts behind them
    for (let i = 0; i < A.length; i++) {
      const e = est(A.slice(0, i).concat(A.slice(i + 1)));
      w += e.n + m; v += (e.n + m) * e.v;
    }
    const prior = v / w, cell = R.sets[key] && R.sets[key][x];
    const out = cell ? {v: (cell[0] * cell[1] + m * prior) / (cell[1] + m), n: cell[1], key}
      : {v: prior, n: 0, key: null};
    memo.set(key, out); return out;
  }
  /* the canvas itself if it is small enough to be a published combination; otherwise every combination of
     maxset of its products, weighted by accounts (each of those already pulled toward its smaller ones) */
  let top, used = [];
  const k = Math.min(maxset, inData.length);
  if (k === 0) top = bottom;
  else {
    const parts = inData.length <= maxset ? [inData] : combos(inData, k);
    let w = 0, v = 0;
    for (const A of parts) { const e = est(A); w += e.n + m; v += (e.n + m) * e.v; if (e.n) used.push(e); }
    top = {v: v / w, n: used.reduce((s, e) => Math.max(s, e.n), 0)};
  }
  used.sort((p, q) => q.n - p.n);
  const ownWeight = bottom.n / (bottom.n + mDoc);   // how much the product's own record counts against the documentation prior
  let value = opts.docOnly ? docPrior : top.v;
  const cal = opts.cal || (opts.raw ? null : R.cal);  // the two calibration numbers the backtest fitted, shipped in the file
  if (cal) value = 1 / (1 + Math.exp(-(cal.a + cal.b * Math.log(value / (1 - value)))));
  return {value, raw: top.v, basedOn: used.length ? {set: used[0].key, n: used[0].n} : null,
    exact: used.length === 1 && used[0].key === inData.join('+'), early: ownWeight < 0.5, docPrior, nLinks, ownWeight};
}

/* ---------- rank: what the canvas calls ---------- */
function rank(F, goalIds, canvasIds, R) {
  const S = [...new Set(canvasIds.filter(id => !F.outside(id)).map(off))];
  const G = goalParts(F, goalIds);
  const rows = F.offerings.filter(x => !S.includes(x)).map(x => candidateFacts(F, x, S, G)).filter(r => r.tier >= 0);
  for (const r of rows) { r.why = whyText(F, r, G); r.tag = TIER[r.tier]; r.data = dataNumber(F, R, r.id, S); }
  const docOrder = (a, b) => b.tier - a.tier
    || (a.tier === 3 ? a.coreAt - b.coreAt : 0)
    || (a.tier === 1 ? b.toCore.length - a.toCore.length : 0)
    || b.toCanvas.length - a.toCanvas.length || b.svc - a.svc || (b.best ? KIND_ORDER[b.best.kind] : -1) - (a.best ? KIND_ORDER[a.best.kind] : -1)
    || a.name.localeCompare(b.name);
  /* with data, the number orders rows inside each goal group; the groups themselves stay goal first */
  const withData = (a, b) => b.tier - a.tier || ((b.data ? b.data.value : -1) - (a.data ? a.data.value : -1)) || docOrder(a, b);
  rows.sort(R ? withData : docOrder);
  /* check first: products the goal's refine chips say the client may already have, not on the canvas yet */
  const checkFirst = [...G.owned].filter(([o]) => !S.includes(o)).map(([o, v]) => ({id: o, name: F.name(o),
    ask: you(v.chip).replace(/^your client/, 'Your client') + '?'}));
  return {goal: G.goals.map(g => g.id), canvas: S, rows, checkFirst,
    group: r => r.tier >= 1 ? 'For your client\'s goal' : 'Also connects to your canvas'};
}

module.exports = {facts, rank, goalParts, dataNumber, off, TIER, KIND};
