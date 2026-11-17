"""SYNTHETIC test accounts with dated purchases, for exercising the export, the scorer and the backtest.
Nothing here is real: invented accounts, invented launch months, invented buying behaviour.
The hidden truth: a product sells more when the account owns products it has documented connections to
(from the real catalog.json), plus a few UNDOCUMENTED pairings the documentation cannot know about.

usage: python3 -I synth_dated.py <catalog.json> <out dir> [accounts] [seed]
writes holdings_SYNTHETIC.csv (account,product,first_month) and world_SYNTHETIC.json (launch months, the truth)."""
import json, sys, os
import numpy as np

cat_path, out = sys.argv[1], sys.argv[2]
N = int(sys.argv[3]) if len(sys.argv) > 3 else 4000
seed = int(sys.argv[4]) if len(sys.argv) > 4 else 7
rng = np.random.default_rng(seed)
cat = json.load(open(cat_path))
P = {p['id']: p for p in cat['products']}
custom = next(p for p in cat['plays'] if p.get('custom'))
off = lambda i: 'eds' if i in ('eds', 'aemsites') else i
offers = []
for i in custom['products']:
    if not P[i].get('outside') and off(i) not in offers:
        offers.append(off(i))
K = len(offers); ix = {o: k for k, o in enumerate(offers)}
A = np.zeros((K, K))
for c in cat['connections']:
    a, b = off(c['a']), off(c['b'])
    if a in ix and b in ix and a != b:
        A[ix[a], ix[b]] = A[ix[b], ix[a]] = 1

MONTHS = 94                      # month 0 = Jan 2019 ... month 93 = Oct 2026 (synthetic calendar)
def m(y, mo): return (y - 2019) * 12 + (mo - 1)
# SYNTHETIC launch months (invented for the test, not Adobe's real dates). Everything else is on sale from month 0.
launch = {o: 0 for o in offers}
launch.update({'gspm': m(2024, 6), 'ca': m(2025, 1), 'collab': m(2025, 1), 'planning': m(2025, 1), 'xa': m(2025, 3),
               'fireflycp': m(2025, 6), 'fireflycm': m(2025, 6), 'mmm': m(2025, 6), 'bv': m(2025, 7), 'bc': m(2025, 10),
               'brandintel': m(2026, 1), 'cw': m(2026, 7), 'mqualifier': m(2026, 5), 'moptimizer': m(2026, 5)})
L = np.array([launch[o] for o in offers])

base = np.exp(rng.normal(np.log(0.0011), 0.7, K))          # monthly hazard with no connections
for o, mult in {'cw': 1.5, 'bv': 2.0}.items():   # two hot new products in this invented world
    if o in ix: base[ix[o]] *= mult
beta = 0.55                                                  # each documented link to the footprint (up to 3) multiplies the hazard by e^0.55
hidden_pairs = [('aa', 'target'), ('marketo', 'ajob2b'), ('workfront', 'aemassets'), ('commerce', 'target'),
                ('acrobat', 'acrobatsign'), ('cja', 'mmm'), ('rtcdp', 'ajo'), ('express', 'creativecloud')]
Hd = np.zeros((K, K))
for a, b in hidden_pairs:
    if a in ix and b in ix:
        Hd[ix[a], ix[b]] = Hd[ix[b], ix[a]] = 1
act = np.exp(rng.normal(0, 0.6, N))                          # how actively each invented account buys

NEVER = 10**6
first = np.full((N, K), NEVER)                               # month first owned; NEVER = not owned
est = np.where(L == 0)[0]
pop = base[est] / base[est].sum()
for n in range(N):                                           # a starting footprint before month 0
    for k in rng.choice(est, size=1 + (rng.random() < 0.35), replace=False, p=pop):
        first[n, k] = -12
for t in range(MONTHS):
    own = first < t
    links = np.minimum(own.astype(float) @ A, 3)
    hid = (own.astype(float) @ Hd) > 0
    h = act[:, None] * base[None, :] * np.exp(beta * links) * np.where(hid, 2.5, 1.0)
    elig = (~own) & (L[None, :] <= t)
    buy = elig & (rng.random((N, K)) < np.minimum(h, 0.5))
    first[buy] = t

os.makedirs(out, exist_ok=True)
with open(os.path.join(out, 'holdings_SYNTHETIC.csv'), 'w') as f:
    f.write('account,product,first_month\n')
    for n in range(N):
        for k in np.where(first[n] != NEVER)[0]:
            f.write(f'S{n:05d},{offers[k]},{max(int(first[n, k]), -1)}\n')
json.dump({'SYNTHETIC': 'Invented accounts and launch months for testing only. Not Adobe data.',
           'accounts': N, 'months': MONTHS, 'month0': '2019-01', 'launch': launch, 'beta_per_link': beta,
           'hidden_pairs': hidden_pairs, 'offerings': offers},
          open(os.path.join(out, 'world_SYNTHETIC.json'), 'w'), indent=1)
own_end = (first != NEVER)
print(f'{N} synthetic accounts, {own_end.sum()} holdings, mean {own_end.sum(1).mean():.2f} products per account')
for o in ['cw', 'bv', 'bc', 'cja', 'aemsites' if 'aemsites' in ix else 'eds', 'target', 'aa']:
    if o in ix: print(f'  {o:10} owned by {own_end[:, ix[o]].mean():.3f} (launch month {launch[o]})')
