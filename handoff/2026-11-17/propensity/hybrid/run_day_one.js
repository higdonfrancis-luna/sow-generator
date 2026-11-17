'use strict';
/* Day-one ranking on the REAL catalog.json and problems.json (read only). No sales data, no numbers.
   usage: node run_day_one.js <canvas dir> <out dir> */
const fs = require('fs'), path = require('path');
const NB = require('./nextbuy_hybrid.js');
const dir = process.argv[2], out = process.argv[3];
const cat = JSON.parse(fs.readFileSync(path.join(dir, 'catalog.json'), 'utf8'));
const probs = JSON.parse(fs.readFileSync(path.join(dir, 'problems.json'), 'utf8'));
const F = NB.facts(cat, probs);
const lines = [], json = {};
const say = s => lines.push(s);

function show(title, goal, canvas, top = 6) {
  const t0 = process.hrtime.bigint();
  const res = NB.rank(F, goal ? [goal] : [], canvas, null);
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  say(`\n=== ${title}`);
  say(`goal: ${goal ? F.PR[goal].chip : '(none: skipped)'} | canvas: ${res.canvas.map(F.name).join(', ') || '(empty)'} | ${res.rows.length} ranked, ${ms.toFixed(2)} ms`);
  if (res.checkFirst.length) say(`  check first (already has it?): ${res.checkFirst.map(c => `${c.name} ("${c.ask}")`).join('; ')}`);
  let g = '';
  res.rows.slice(0, top).forEach((r, i) => {
    if (res.group(r) !== g) { g = res.group(r); say(`  -- ${g}`); }
    say(`  ${i + 1}. ${r.name}  [${r.tag}]  services on canvas if added: ${r.ownSvc} own + ${r.svc} on its lines (${r.more} more optional)`);
    say(`     why: ${r.why}`);
  });
  json[title] = {goal, canvas: res.canvas, rows: res.rows.slice(0, top).map(r => ({id: r.id, name: r.name, tier: r.tier, tag: r.tag,
    why: r.why, ownSvc: r.ownSvc, svc: r.svc, more: r.more, toCanvas: r.toCanvas, toCore: r.toCore}))};
  return res;
}

/* 1. Adam's example: the client can't see AI traffic, and already has CJA */
show('A1 Adam\'s example: AI traffic to revenue, client owns CJA', 'ai-traffic-revenue', ['cja']);
/* 2. the chain: keep adding the top product; the goal is never asked again */
let canvas = ['cja'];
for (let step = 1; step <= 4; step++) {
  const r = NB.rank(F, ['ai-traffic-revenue'], canvas, null);
  const pick = r.rows[0];
  canvas = [...canvas, pick.id];
  show(`A${step + 1} chain step ${step}: added ${pick.name}`, 'ai-traffic-revenue', canvas, 4);
}
show('B1 Missing from AI answers, client owns CJA', 'ai-answers-missing', ['cja']);
show('C1 Coworker play, goal: team buried in routine work', 'team-busywork', ['cw']);
show('C2 Coworker play, no goal given (skipped)', null, ['cw']);
show('C3 Coworker play, goal: AI traffic to revenue', 'ai-traffic-revenue', ['cw']);
show('D1 Three products: reporting goal, CJA + Coworker + Brand Visibility', 'slow-reporting', ['cw', 'cja', 'bv']);
show('E1 Five products: scattered data goal', 'customer-data-silos', ['rtcdp', 'cja', 'aemsites', 'ajo', 'marketo']);
show('E2 Eight products: scattered data goal', 'customer-data-silos', ['rtcdp', 'cja', 'aemsites', 'ajo', 'marketo', 'target', 'aemassets', 'workfront']);
show('F1 Empty canvas, goal: site shows everyone the same thing', 'same-site-for-everyone', []);

/* 3. every preloaded goal, right after Build this (the canvas holds the goal's own setup) */
say('\n=== G: all 23 goals, canvas = the goal\'s own setup after Build this (top 3 next)');
const all = {};
for (const p of probs.problems) {
  const r = NB.rank(F, [p.id], p.products, null);
  const top = r.rows.slice(0, 3);
  all[p.id] = top.map(x => ({id: x.id, tier: x.tier}));
  say(`  ${p.id.padEnd(32)} ${top.map(x => `${x.name} [${x.tier}]`).join(' | ')}  (${r.rows.length} ranked; goal group ${r.rows.filter(x => x.tier >= 1).length})`);
}
json.allGoals = all;

/* 4. sanity checks the build's tests would make */
const fails = [];
for (const p of probs.problems) {
  for (const c of [[], p.products, [p.products[0]]]) {
    const r = NB.rank(F, [p.id], c, null);
    const S = new Set(c.map(NB.off));
    for (const x of r.rows) {
      if (S.has(x.id)) fails.push(`${p.id}: ${x.id} already on canvas`);
      if (F.outside(x.id)) fails.push(`${p.id}: ${x.id} is an outside system`);
      if (x.tier === 0 && !x.toCanvas.length) fails.push(`${p.id}: ${x.id} tier 0 without a documented connection`);
      if (x.tier === 1 && !x.toCore.length) fails.push(`${p.id}: ${x.id} tier 1 without a link to the goal`);
    }
    const core = p.products.filter(id => !F.outside(id)).map(NB.off).filter(id => !S.has(id));
    const first = r.rows.slice(0, core.length).map(x => x.id);
    if (core.some(id => !first.includes(id))) fails.push(`${p.id}: a product the goal calls for is not first (${core} vs ${first})`);
  }
}
/* the order never depends on the order products were added */
const a = NB.rank(F, ['ai-traffic-revenue'], ['cja', 'bv', 'cw'], null).rows.map(r => r.id).join();
const b = NB.rank(F, ['ai-traffic-revenue'], ['cw', 'bv', 'cja'], null).rows.map(r => r.id).join();
if (a !== b) fails.push('order of adding changes the ranking');
say(`\n=== checks: ${fails.length ? fails.length + ' FAILED\n' + fails.join('\n') : 'all passed (goal products first, nothing already on canvas, no outside systems, every tier backed by a documented fact, same result in any adding order)'}`);

fs.mkdirSync(out, {recursive: true});
fs.writeFileSync(path.join(out, 'day_one_real_catalog.txt'), lines.join('\n') + '\n');
fs.writeFileSync(path.join(out, 'day_one_real_catalog.json'), JSON.stringify(json, null, 1));
console.log(lines.join('\n'));
