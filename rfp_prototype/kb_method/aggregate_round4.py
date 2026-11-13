"""Aggregate one fresh blind judge per RFI on fixed and expanded implementation cohorts for Round 4.

The original cohort is defined by the saved Round 3 panel keys, not by which
questions the current no-AI implementation answers. Missing responses are scored
1 under the judging rubric; zero and absent scores are rejected.

Run from any directory, after all four blind judge files have been written:
    python3 sow/rfp_prototype/kb_method/aggregate_round4.py

Optional directory flags support reproducible fixtures and alternate run folders.
This script only opens the four named panel keys and judge files. It never opens
an RFI, the held-out RFI key, source code, coverage files or answer text.
"""
import argparse
import json
import math
from pathlib import Path
import tempfile


TAGS = ('cedar', 'tallgrass', 'vennor', 'virelune')
LETTERS = ('A', 'B', 'C', 'D')
ARMS = ('ai', 'kb', 'kb_prior', 'catalog')


def read_json(path):
    try:
        def unique_keys(pairs):
            result = {}
            for key, value in pairs:
                if key in result:
                    raise ValueError(f'duplicate JSON key {key!r}')
                result[key] = value
            return result
        return json.loads(path.read_text(encoding='utf-8'), object_pairs_hook=unique_keys)
    except (OSError, ValueError) as error:
        raise ValueError(f'{path}: {error}') from error


def valid_ref(ref):
    return isinstance(ref, str) and bool(ref.strip())


def read_rfi(tag, round4_dir, judges_dir, round3_dir):
    key_path = round4_dir / f'{tag}_key.json'
    original_path = round3_dir / f'{tag}_key.json'
    judge_path = judges_dir / f'judge_round4_{tag}.json'
    key, original, judge = (read_json(path) for path in (key_path, original_path, judge_path))
    if not isinstance(key, dict) or not key or not all(valid_ref(ref) for ref in key):
        raise ValueError(f'{key_path}: expected a nonempty mapping of requirement references')
    for ref, mapping in key.items():
        if not isinstance(mapping, dict) or set(mapping) != set(LETTERS) or not all(isinstance(arm, str) for arm in mapping.values()) or set(mapping.values()) != set(ARMS):
            raise ValueError(f'{key_path}: {ref} must map A-D to each of {ARMS} exactly once')
    if not isinstance(original, dict) or not original or not all(valid_ref(ref) for ref in original):
        raise ValueError(f'{original_path}: expected a nonempty mapping of original requirement references')
    absent = set(original) - set(key)
    if absent:
        raise ValueError(f'{tag}: original cohort references absent from Round 4 key: {sorted(absent)}')
    if not isinstance(judge, dict) or not isinstance(judge.get('scores'), list):
        raise ValueError(f'{judge_path}: expected a scores array')
    notes = judge.get('notes', [])
    if not isinstance(notes, list) or not all(isinstance(note, str) for note in notes):
        raise ValueError(f'{judge_path}: notes must be an array of strings')
    by_ref = {}
    for score in judge['scores']:
        if not isinstance(score, dict) or not valid_ref(score.get('ref')):
            raise ValueError(f'{judge_path}: each score needs a nonempty ref')
        ref = score['ref']
        if ref in by_ref:
            raise ValueError(f'{judge_path}: duplicate score for {ref}')
        for letter in LETTERS:
            value = score.get(letter)
            # bool is a subclass of int in Python; a checkmark is not a numeric judge score.
            if isinstance(value, bool) or not isinstance(value, (int, float)) or not 1 <= value <= 10 or not math.isfinite(value):
                raise ValueError(f'{judge_path}: {ref} {letter} must be a finite numeric score from 1 to 10; missing answers receive 1')
        if 'why' in score and not isinstance(score['why'], str):
            raise ValueError(f'{judge_path}: {ref} why must be a string')
        by_ref[ref] = score
    missing, extra = set(key) - set(by_ref), set(by_ref) - set(key)
    if missing or extra:
        raise ValueError(f'{judge_path}: judge references must match the panel exactly; missing={sorted(missing)}, extra={sorted(extra)}')
    rows = []
    for ref, mapping in key.items():
        score = by_ref[ref]
        values = {arm: score[letter] for letter, arm in mapping.items()}
        rows.append({'rfi': tag, 'ref': ref, 'in_original_cohort': ref in original,
                     **values, 'kb_minus_prior': round(values['kb'] - values['kb_prior'], 6),
                     'why': score.get('why', '')})
    return {'tag': tag, 'notes': notes, 'original_refs': list(original), 'expanded_refs': list(key), 'rows': rows}


def rounded(value):
    return round(value, 6)


def summarize(rows):
    count = len(rows)
    if not count:
        raise ValueError('Cannot summarize an empty cohort')
    differences = [row['kb'] - row['kb_prior'] for row in rows]
    return {
        'ref_count': count,
        'means': {arm: rounded(sum(row[arm] for row in rows) / count) for arm in ARMS},
        'kb_vs_prior': {
            'mean_difference': rounded(sum(differences) / count),
            'total_difference': rounded(sum(differences)),
            'wins': sum(delta > 0 for delta in differences),
            'ties': sum(delta == 0 for delta in differences),
            'losses': sum(delta < 0 for delta in differences),
        },
    }


def aggregate(round4_dir, judges_dir, round3_dir):
    data = [read_rfi(tag, round4_dir, judges_dir, round3_dir) for tag in TAGS]
    rows = [row for rfi in data for row in rfi['rows']]
    cohorts = {'original': lambda row: row['in_original_cohort'], 'expanded': lambda row: True}
    per_rfi = {}
    for rfi in data:
        per_rfi[rfi['tag']] = {
            'original_refs': rfi['original_refs'], 'expanded_refs': rfi['expanded_refs'], 'judge_notes': rfi['notes'],
            **{name: summarize([row for row in rfi['rows'] if include(row)]) for name, include in cohorts.items()},
        }
    pooled = {name: summarize([row for row in rows if include(row)]) for name, include in cohorts.items()}
    equal_rfi = {}
    for name, include in cohorts.items():
        groups = [[row for row in rfi['rows'] if include(row)] for rfi in data]
        # Use the unrounded per-question scores, not the rounded means in per_rfi.
        equal_rfi[name] = {
            'rfi_count': len(groups),
            'means': {arm: rounded(sum(sum(row[arm] for row in group) / len(group) for group in groups) / len(groups)) for arm in ARMS},
            'kb_vs_prior_mean_difference': rounded(sum(sum(row['kb'] - row['kb_prior'] for row in group) / len(group) for group in groups) / len(groups)),
        }
    return {
        'schema_version': 1,
        'analysis_population': 'implementation',
        'scoring': {'minimum': 1, 'maximum': 10, 'missing_answer_score': 1,
                    'arms': {'ai': 'Saved AI-written answer', 'kb': 'Round 4 no-AI answer',
                             'kb_prior': 'Round 3 no-AI answer', 'catalog': 'Current catalog answer'},
                    'note': 'Each fresh judge scored all four arms. Missing responses are represented in the panel and receive 1 under the rubric; missing-arm scores are never imputed by this script.'},
        'cohorts': {'original': 'References in the saved Round 3 panel keys, scored again by the fresh Round 4 judges.',
                    'expanded': 'AI-written implementation references in the Round 4 panel keys, filtered by the authored Adobe requirement kind where a key exists, including missing no-AI responses.'},
        'weighting': {'pooled_question_weighted': 'Each scored requirement has equal weight across all RFIs.',
                      'equal_rfi_mean': 'Compute each RFI mean first, then give each RFI equal weight.'},
        'rfi_order': list(TAGS), 'per_rfi': per_rfi,
        'pooled_question_weighted': pooled, 'equal_rfi_mean': equal_rfi,
        'paired_per_ref': rows,
    }


def main():
    here = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--round4-dir', type=Path, default=here / 'scores_round4')
    parser.add_argument('--judges-dir', type=Path, default=here / 'chatgpt_round2')
    parser.add_argument('--round3-dir', type=Path, default=here / 'scores_round3')
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    try:
        result = aggregate(args.round4_dir, args.judges_dir, args.round3_dir)
    except ValueError as error:
        parser.exit(1, 'Invalid judging data: ' + str(error) + '\n')
    output = args.output or args.round4_dir / 'results.json'
    output.parent.mkdir(parents=True, exist_ok=True)
    # Validate everything before replacing an existing results file.
    with tempfile.NamedTemporaryFile('w', encoding='utf-8', dir=output.parent, prefix=output.name + '.', suffix='.tmp', delete=False) as temp:
        json.dump(result, temp, indent=2, ensure_ascii=False, allow_nan=False)
        temp.write('\n')
        staged = Path(temp.name)
    staged.replace(output)
    counts = result['pooled_question_weighted']
    print(f'Wrote {output}: {counts["original"]["ref_count"]} original-cohort and {counts["expanded"]["ref_count"]} expanded implementation-cohort requirements; all scores validated.')


if __name__ == '__main__':
    main()
