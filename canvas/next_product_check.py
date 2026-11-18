"""Checks the summary numbers behind the ranked Add product list (next_product_counts.json).

The file holds counts of customers per product set and nothing else: no company, no person, no segment, no money,
no date, no note. check(table, adobe_ids) raises AssertionError with a plain message when a table is anything else,
or when its counts cannot all be true together. build.py calls it before it puts the table into the canvas page, and
whoever counts the table runs it on the result.

Run by itself from the repository root after python3 canvas/build.py:
    python3 canvas/next_product_check.py
It checks the real file against canvas/catalog.json, then shows on small made-up tables that each kind of bad table
is refused.
"""
import copy
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
KEYS = ['v', 'round', 'min_group', 'pretend', 'min_number', 'products', 'numbered', 'few', 'sets']


def compact(table):
    """The one way the file is written, so two counts of the same customers give the same bytes."""
    return json.dumps(table, sort_keys=True, separators=(',', ':'))


def check(table, adobe_ids):
    def need(ok, message):
        if not ok:
            raise AssertionError('next_product_counts.json: ' + message)

    def whole(n):
        return isinstance(n, int) and not isinstance(n, bool)

    need(isinstance(table, dict) and sorted(table) == sorted(KEYS), 'the keys must be exactly ' + ', '.join(KEYS))
    need(table['v'] == 1 and whole(table['v']), 'v must be 1')
    step, floor, pretend, bar = table['round'], table['min_group'], table['pretend'], table['min_number']
    need(whole(step) and step in (1, 10), 'round must be 1 or 10')
    need(whole(floor) and floor >= 30, 'min_group must be a whole number of at least 30')
    need(whole(pretend) and 1 <= pretend <= 100, 'pretend must be a whole number from 1 to 100')
    need(whole(bar) and bar >= floor, 'min_number must be a whole number of at least min_group')
    need(floor % step == 0 and bar % step == 0, 'min_group and min_number must be multiples of round')

    products, numbered, few, sets = table['products'], table['numbered'], table['few'], table['sets']
    for name, ids in (('products', products), ('numbered', numbered), ('few', few)):
        need(isinstance(ids, list) and all(isinstance(i, str) for i in ids), name + ' must be a list of product ids')
        need(ids == sorted(set(ids)), name + ' must be sorted, with no id twice')
        bad = [i for i in ids if i not in adobe_ids or i == 'eds']
        need(not bad, name + ' holds ids that are not Adobe products of the catalog (or eds): ' + ', '.join(bad))
    need(set(numbered) <= set(products), 'every id in numbered must be in products')
    need(not set(products) & set(few), 'an id cannot be in both products and few')

    need(isinstance(sets, dict) and '' in sets, 'sets must hold the empty set (all customers) under the key ""')
    width = 1 + len(numbered)
    for key, row in sets.items():
        ids = key.split('+') if key else []
        need(all(i in products for i in ids), 'the set "%s" names an id that is not in products' % key)
        need(ids == sorted(set(ids)), 'the set "%s" must list its ids sorted, each once' % key)
        need(isinstance(row, list) and len(row) == width and all(whole(n) and n >= 0 for n in row),
             'the row of "%s" must be %d whole numbers of 0 or more' % (key, width))
        need(all(n % step == 0 for n in row), 'the row of "%s" holds a number that is not a multiple of round' % key)
        need(all(n <= row[0] for n in row), 'the row of "%s" holds a count larger than its group' % key)
        need(row[0] >= floor, 'the set "%s" is smaller than min_group' % key)
        for i in ids:
            if i in numbered:
                need(row[1 + numbered.index(i)] == row[0], 'in the row of "%s" the count for %s must equal the group' % (key, i))

    for i in products:
        need(i in sets, 'the product %s has no set of its own' % i)
        need((sets[i][0] >= bar) == (i in numbered), 'the product %s is on the wrong side of min_number for numbered' % i)

    for key, row in sets.items():
        ids = key.split('+') if key else []
        # closure: every set with one product fewer is in the table, and is at least as large
        for i in ids:
            smaller = '+'.join(x for x in ids if x != i)
            need(smaller in sets and sets[smaller][0] >= row[0], 'the set "%s" is missing, or smaller than "%s"' % (smaller, key))
        # agreement: a count for one more product is the size of the larger set, or the larger set is under min_group
        for col, x in enumerate(numbered, 1):
            if x in ids:
                continue
            larger = '+'.join(sorted(ids + [x]))
            if larger in sets:
                need(sets[larger][0] == row[col], 'the row of "%s" and the set "%s" disagree on a count' % (key, larger))
            else:
                need(row[col] < floor, 'the set "%s" is missing although the row of "%s" counts %d or more for it' % (larger, key, floor))

    # nothing but keys, product ids and whole numbers: no name, e-mail, currency sign, date or free text can ride along
    text = compact(table)
    words = re.findall(r'"([^"\\]*)"', text)
    need(re.fullmatch(r'[\[\]{},:0-9]*', re.sub(r'"[^"\\]*"', '', text)) is not None, 'the file holds something other than keys, product ids and whole numbers')
    need(all(w in KEYS or re.fullmatch(r'(?:[a-z0-9]+(?:\+[a-z0-9]+)*)?', w) for w in words), 'the file holds a text that is neither a key nor a product id')


def adobe_ids_of(catalog):
    return {p['id'] for p in catalog['products'] if not p.get('outside')}


def self_test(adobe_ids):
    """Made-up sample numbers, small enough to read: four products, two of them without a number."""
    good = {'v': 1, 'round': 1, 'min_group': 30, 'pretend': 10, 'min_number': 150,
            'products': ['aa', 'bv', 'cja', 'target'], 'numbered': ['cja', 'target'], 'few': ['cw'],
            'sets': {'': [1000, 200, 300], 'aa': [100, 60, 40], 'bv': [80, 20, 20], 'cja': [200, 200, 90], 'target': [300, 90, 300],
                     'aa+bv': [40, 10, 10], 'aa+cja': [60, 60, 20], 'aa+target': [40, 20, 40], 'cja+target': [90, 90, 90]}}
    fails = 0

    def case(description, change, says='', ids=adobe_ids):
        """says: words the refusal must hold; empty means the table must be accepted"""
        nonlocal fails
        table = copy.deepcopy(good)
        change(table)
        try:
            check(table, ids)
            message = ''
        except AssertionError as refusal:
            message = str(refusal)
        right = says in message if says else not message
        fails += not right
        print(('ok    ' if right else 'FAIL  ') + description + ('' if right else '  [' + (message or 'accepted') + ']'))

    def put(path, value):
        def change(t):
            for k in path[:-1]:
                t = t[k]
            t[path[-1]] = value
        return change

    def drop(path):
        def change(t):
            for k in path[:-1]:
                t = t[k]
            del t[path[-1]]
        return change

    def both(*changes):
        def change(t):
            for c in changes:
                c(t)
        return change

    case('accepts the made-up sample table', lambda t: None)
    case('accepts other starting values (min_group 40, pretend 20)', both(put(['min_group'], 40), put(['pretend'], 20)))
    case('refuses an extra key', put(['as_of'], '2026'), 'keys must be exactly')
    case('refuses a missing key', drop(['few']), 'keys must be exactly')
    case('refuses v other than 1', put(['v'], 2), 'v must be 1')
    case('refuses round other than 1 or 10', put(['round'], 5), 'round must be 1 or 10')
    case('refuses min_group under 30', put(['min_group'], 20), 'at least 30')
    case('refuses pretend of 0', put(['pretend'], 0), 'from 1 to 100')
    case('refuses min_number under min_group', put(['min_number'], 20), 'at least min_group')
    case('refuses min_number that is not a multiple of round', both(put(['round'], 10), put(['min_number'], 155)), 'multiples of round')
    case('refuses an id that is not an Adobe product of the catalog', put(['few'], ['crm']), 'not Adobe products')
    case('refuses the id eds', put(['few'], ['eds']), 'not Adobe products')
    case('refuses a list that is not sorted', put(['products'], ['bv', 'aa', 'cja', 'target']), 'must be sorted')
    case('refuses an id of numbered that is not in products', put(['numbered'], ['cja', 'cw', 'target']), 'must be in products')
    case('refuses an id in both products and few', put(['few'], ['aa']), 'both products and few')
    case('refuses a table without the set of all customers', drop(['sets', '']), 'empty set')
    case('refuses a set key that is not sorted', lambda t: t['sets'].update({'cja+aa': t['sets'].pop('aa+cja')}), 'ids sorted')
    case('refuses a set of a product that is not in products', lambda t: t['sets'].update({'cw': [40, 10, 10]}), 'not in products')
    case('refuses a row of the wrong length', put(['sets', 'aa'], [100, 60]), 'whole numbers of 0 or more')
    case('refuses a number that is not whole', put(['sets', 'aa'], [100, 60.5, 40]), 'whole numbers of 0 or more')
    case('refuses a negative number', put(['sets', 'aa+cja'], [60, 60, -1]), 'whole numbers of 0 or more')
    case('refuses a number that is not a multiple of round', both(put(['round'], 10), put(['sets', 'aa+cja'], [60, 60, 25])), 'not a multiple of round')
    case('refuses a count larger than its group', put(['sets', 'aa+cja'], [60, 60, 70]), 'larger than its group')
    case('refuses a member of the set that does not own the set', put(['sets', 'cja'], [200, 190, 90]), 'must equal the group')
    case('refuses a set smaller than min_group', lambda t: t['sets'].update({'aa+cja+target': [20, 20, 20]}), 'smaller than min_group')
    case('refuses all customers under min_group', put(['sets', ''], [20, 20, 20]), 'smaller than min_group')
    case('refuses a product without its own set', drop(['sets', 'bv']), 'no set of its own')
    case('refuses a product at or over min_number that is not in numbered', put(['sets', 'aa'], [160, 60, 40]), 'wrong side of min_number')
    case('refuses a product in numbered under min_number', put(['min_number'], 250), 'wrong side of min_number')
    case('refuses a set whose smaller set is missing (closure)',
         both(drop(['sets', 'aa+target']), put(['sets', 'aa'], [100, 60, 20]), put(['sets', 'aa+cja'], [60, 60, 30]), lambda t: t['sets'].update({'aa+cja+target': [30, 30, 30]})), 'is missing, or smaller than')
    case('refuses a set larger than its smaller set (closure)', put(['sets', 'aa+bv'], [90, 10, 10]), 'is missing, or smaller than')
    case('refuses a row and a larger set that disagree (agreement)', put(['sets', 'aa'], [100, 50, 40]), 'disagree on a count')
    case('refuses a missing set that a row counts 30 or more for (agreement)', drop(['sets', 'aa+target']), 'is missing although')
    case('refuses a text that is not an id, even if a catalog offered it (a name, an e-mail, a date)', put(['few'], ['cw', 'jo@example.com']), 'neither a key nor a product id', ids=set(adobe_ids) | {'jo@example.com'})
    return fails


def main():
    catalog = json.load(open(os.path.join(HERE, 'catalog.json'), encoding='utf-8'))
    adobe_ids = adobe_ids_of(catalog)
    path = os.path.join(HERE, 'next_product_counts.json')
    text = open(path, encoding='utf-8').read()
    table = json.loads(text)
    check(table, adobe_ids)
    assert text == compact(table) + '\n', 'next_product_counts.json is not written in the one compact form (sorted keys, no spaces, one newline)'
    print('ok    the real file: %d products with a number, %d without, %d sets, counts rounded down to the nearest %d'
          % (len(table['numbered']), len(table['products']) - len(table['numbered']) + len(table['few']), len(table['sets']), table['round'])
          if table['round'] > 1 else
          'ok    the real file: %d products with a number, %d without, %d sets, exact counts'
          % (len(table['numbered']), len(table['products']) - len(table['numbered']) + len(table['few']), len(table['sets'])))
    fails = self_test(adobe_ids)
    print('%d failed' % fails)
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
