"""Turn an account-level product footprint (private, on Adam's machine) into the aggregate file the static page reads.
The output holds ONLY: rates rounded to 3 decimals, account counts as bands, and a 4-number documentation prior.
No account ids, names, ARR, industry or state ever reach it. Groups under the floor are never written.

usage:
  python3 -I export_rates.py --holdings H.csv --catalog catalog.json --launch launch.json --mode dated|snapshot
                             --asof MONTH [--window 24] [--floor 30] [--diff 10] [--maxset 3] --label TEXT --out rates.json
holdings: account,product,first_month (first_month is a month index; -1 = owned before the data starts).
          For a snapshot export only ownership matters; first_month can be any value below --asof.
launch:   {product: month index first on sale} (public launch dates; products absent are treated as always on sale)."""
import argparse, csv, json, sys
from itertools import combinations
import numpy as np

ap = argparse.ArgumentParser()
for a in ('holdings', 'catalog', 'launch', 'mode', 'label', 'out'): ap.add_argument('--' + a, required=True)
ap.add_argument('--asof', type=int, required=True)
ap.add_argument('--window', type=int, default=24)
ap.add_argument('--horizon', type=int, default=12)
ap.add_argument('--floor', type=int, default=30)
ap.add_argument('--diff', type=int, default=10)
ap.add_argument('--maxset', type=int, default=3)
ap.add_argument('--m', type=float, default=20.0)
g = ap.parse_args()

cat = json.load(open(g.catalog))
P = {p['id']: p for p in cat['products']}
off = lambda i: 'eds' if i in ('eds', 'aemsites') else i
custom = next(p for p in cat['plays'] if p.get('custom'))
offers = []
for i in custom['products']:
    if not P[i].get('outside') and off(i) not in offers: offers.append(off(i))
K = len(offers); ix = {o: k for k, o in enumerate(offers)}
DOC = np.zeros((K, K), dtype=np.float32)
for c in cat['connections']:
    a, b = off(c['a']), off(c['b'])
    if a in ix and b in ix and a != b: DOC[ix[a], ix[b]] = DOC[ix[b], ix[a]] = 1
launch = json.load(open(g.launch))
L = np.array([launch.get(o, -10**6) for o in offers])

accts, rows = {}, []
for r in csv.DictReader(open(g.holdings)):
    if r['product'] not in ix: continue                     # products outside the tool's menu are ignored
    a = accts.setdefault(r['account'], len(accts))
    rows.append((a, ix[r['product']], int(r['first_month'])))
N = len(accts)
NEVER = 10**6
first = np.full((N, K), NEVER)
for a, k, mth in rows: first[a, k] = min(first[a, k], mth)
ids_to_check = list(accts)                                   # kept only for the final leak scan
del accts, rows

BANDS = [0, 1, 2, 5, 10, 20, 30, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000]
band = lambda v: max(b for b in BANDS if b <= v)
T = g.asof
F_end = (first < T).astype(np.float32)                       # what each account owns at the as-of month
distinct1 = F_end.sum(0)
distinct2 = F_end.T @ F_end

def distinct(A):
    if len(A) == 1: return distinct1[A[0]]
    if len(A) == 2: return distinct2[A[0], A[1]]
    return float(np.prod(F_end[:, list(A)], axis=1).sum())

# which combinations may be published: at least --floor accounts own them, and each is at least --diff accounts
# away from every combination one product smaller (otherwise it adds little and lets someone subtract one from the other)
pub, sup_floor, sup_diff = [], 0, 0
frontier = [(k,) for k in range(K)]
dist = {(): float(N)}
for size in range(1, g.maxset + 1):
    nxt = []
    for A in frontier:
        d = distinct(A); dist[A] = d
        if d < g.floor: sup_floor += 1; continue
        if any(dist.get(A[:i] + A[i + 1:], N) - d < g.diff for i in range(len(A))): sup_diff += 1; continue
        pub.append(A); nxt.append(A)
    if size == g.maxset: break
    ok = set(nxt); frontier = []
    for A in nxt:                                            # grow only from published sets (Apriori)
        for k in range(A[-1] + 1, K):
            B = A + (k,)
            if all(B[:i] + B[i + 1:] in ok for i in range(len(B))): frontier.append(B)

out = {'label': g.label, 'kind': g.mode, 'asof': T, 'floor': g.floor, 'diff': g.diff, 'm': g.m,
       'products': offers, 'base': {}, 'sets': {}, 'docPrior': {}, 'docPriorN': {}}
rate3 = lambda v: round(float(v), 3)

if g.mode == 'dated':
    # account-months in the window: the footprint at the start of each month, and what was bought that month
    W = g.window
    Fs, Bs, Es = [], [], []
    for t in range(T - W, T):
        Ft = first < t
        Fs.append(Ft); Bs.append(first == t); Es.append((~Ft) & (L[None, :] <= t))
    F = np.vstack(Fs).astype(np.float32); B = np.vstack(Bs).astype(np.float32); E = np.vstack(Es).astype(np.float32)
    year = lambda k, e: 1 - (1 - k / e) ** g.horizon         # monthly buy rate -> chance of buying within the horizon
    eb, kb = E.sum(0), B.sum(0)
    for X in range(K):
        if eb[X] > 0: out['base'][offers[X]] = {'r': rate3(year(kb[X], eb[X])), 'n': band(eb[X] / 12)}
    for A in pub:
        mask = np.prod(F[:, list(A)], axis=1)
        e, k = mask @ E, mask @ B
        cell = {offers[X]: [rate3(year(k[X], e[X])), band(e[X] / 12)] for X in range(K) if X not in A and e[X] > 0}
        if cell: out['sets']['+'.join(sorted(offers[a] for a in A))] = cell
    # documentation prior: measured only on products on sale for 12+ months before the window starts
    estab = (L <= T - W - 12)
    links = np.minimum(F @ DOC, 3)
    for c in range(4):
        sel = (links == c) & (E > 0) & estab[None, :]
        e, k = float(sel.sum()), float((sel & (B > 0)).sum())
        out['docPrior'][str(c)] = rate3(year(k, e)) if e else None
        out['docPriorN'][str(c)] = band(e / 12)
    out['window'] = W; out['horizon'] = g.horizon
    out['means'] = f'chance of buying within {g.horizon} months, from account-months in the {W} months before the as-of month'
else:
    for X in range(K): out['base'][offers[X]] = {'r': rate3(distinct1[X] / N), 'n': band(N)}
    for A in pub:
        mask = np.prod(F_end[:, list(A)], axis=1); n = mask.sum()
        k = mask @ F_end
        out['sets']['+'.join(sorted(offers[a] for a in A))] = {offers[X]: [rate3(k[X] / n), band(n)] for X in range(K) if X not in A}
    estab = (L <= T - 24)
    others = F_end @ DOC                                     # links from each account's footprint to each product
    for c in range(4):
        num = den = 0.0
        for X in np.where(estab)[0]:
            lk = np.minimum(others[:, X] - 0, 3)             # the product itself has no link to itself
            sel = lk == c
            den += sel.sum(); num += (sel & (F_end[:, X] > 0)).sum()
        out['docPrior'][str(c)] = rate3(num / den) if den else None
        out['docPriorN'][str(c)] = band(den)
    out['means'] = 'share of accounts with these products that also own it today (not a forecast)'

out['privacy'] = {'accounts_band': band(N), 'sets_published': len(out['sets']), 'suppressed_under_floor': sup_floor,
                  'suppressed_too_close_to_a_smaller_set': sup_diff, 'max_set_size': g.maxset}
# last guards before anything is written: the file has exactly this shape (numbers and product ids only),
# and no account id from the input appears anywhere in it
TOP = {'label', 'kind', 'asof', 'floor', 'diff', 'm', 'products', 'base', 'sets', 'docPrior', 'docPriorN', 'privacy',
       'window', 'horizon', 'means'}
num = lambda v: isinstance(v, (int, float)) and not isinstance(v, bool)
assert set(out) <= TOP, f'unexpected fields {set(out) - TOP}'
assert all(o in offers and set(v) == {'r', 'n'} and num(v['r']) and num(v['n']) for o, v in out['base'].items())
for key, cell in out['sets'].items():
    assert all(p in offers for p in key.split('+')), key
    assert all(o in offers and len(v) == 2 and num(v[0]) and num(v[1]) and 0 <= v[0] <= 1 for o, v in cell.items()), key
assert all(v is None or num(v) for v in out['docPrior'].values())
text = json.dumps(out, separators=(',', ':'))
leaks = [a for a in ids_to_check if a in text]
assert not leaks, f'{len(leaks)} account ids found in the output'
open(g.out, 'w').write(text)
print(f'{g.mode}: {N} accounts -> {len(out["sets"])} published sets ({sup_floor} under the floor, {sup_diff} too close to a smaller set), '
      f'{len(text)/1024:.0f} KB; docPrior {out["docPrior"]}')
