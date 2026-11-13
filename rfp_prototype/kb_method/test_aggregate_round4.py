"""Synthetic regression checks for fair Round 4 unblinding, cohorts and score validation."""
import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).with_name('aggregate_round4.py')
spec = importlib.util.spec_from_file_location('aggregate_round4', SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class AggregateTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.round4, self.judges, self.round3 = (self.root / name for name in ('r4', 'judges', 'r3'))
        for directory in (self.round4, self.judges, self.round3):
            directory.mkdir()
        self.values = {
            'cedar': [(9, 8, 6, 3), (8, 5, 7, 2)],
            'tallgrass': [(7, 6, 6, 3)],
            'vennor': [(8, 9, 5, 3)],
            'virelune': [(8, 4, 5, 2), (8, 5, 5, 2), (8, 10, 6, 4)],
        }
        for offset, (tag, entries) in enumerate(self.values.items()):
            key, scores = {}, []
            for index, entry in enumerate(entries):
                ref = 'A.' + str(index + 1)
                rotation = (offset + index) % 4
                arms = module.ARMS[rotation:] + module.ARMS[:rotation]
                key[ref] = dict(zip(module.LETTERS, arms))
                values = dict(zip(module.ARMS, entry))
                scores.append({'ref': ref, **{letter: values[arm] for letter, arm in key[ref].items()}, 'why': 'Synthetic justification'})
            self.write(self.round4 / f'{tag}_key.json', key)
            self.write(self.round3 / f'{tag}_key.json', {'A.1': key['A.1']})
            self.write(self.judges / f'judge_round4_{tag}.json', {'scores': scores, 'notes': ['Synthetic note']})

    def tearDown(self):
        self.temp.cleanup()

    def write(self, path, value):
        path.write_text(json.dumps(value), encoding='utf-8')

    def aggregate(self):
        return module.aggregate(self.round4, self.judges, self.round3)

    def change_judge(self, change):
        path = self.judges / 'judge_round4_cedar.json'
        data = json.loads(path.read_text())
        change(data)
        self.write(path, data)

    def test_fixed_and_expanded_cohorts_and_weighting(self):
        result = self.aggregate()
        self.assertEqual(result['analysis_population'], 'implementation')
        original = result['pooled_question_weighted']['original']
        expanded = result['pooled_question_weighted']['expanded']
        self.assertEqual(original['ref_count'], 4)
        self.assertEqual(original['means']['kb'], 6.75)
        self.assertEqual(original['kb_vs_prior'], {'mean_difference': 1.25, 'total_difference': 5,
                                                  'wins': 2, 'ties': 1, 'losses': 1})
        self.assertEqual(expanded['ref_count'], 7)
        self.assertAlmostEqual(expanded['means']['kb'], 47 / 7, places=6)
        self.assertEqual(expanded['kb_vs_prior'], {'mean_difference': 1, 'total_difference': 7,
                                                  'wins': 3, 'ties': 2, 'losses': 2})
        self.assertAlmostEqual(result['equal_rfi_mean']['expanded']['means']['kb'], (6.5 + 6 + 9 + 19 / 3) / 4, places=6)
        self.assertEqual(result['equal_rfi_mean']['expanded']['kb_vs_prior_mean_difference'], 1.25)
        self.assertNotEqual(result['equal_rfi_mean']['expanded']['means']['kb'], expanded['means']['kb'])

    def test_unblinding_and_paired_rows_use_each_requirement_key(self):
        result = self.aggregate()
        rows = {(row['rfi'], row['ref']): row for row in result['paired_per_ref']}
        self.assertEqual(len(rows), 7)
        self.assertEqual(rows['virelune', 'A.3']['kb'], 10)
        self.assertEqual(rows['virelune', 'A.3']['kb_prior'], 6)
        self.assertEqual(rows['virelune', 'A.3']['kb_minus_prior'], 4)
        self.assertFalse(rows['virelune', 'A.3']['in_original_cohort'])
        self.assertTrue(rows['cedar', 'A.1']['in_original_cohort'])
        self.assertEqual(result['per_rfi']['virelune']['expanded']['ref_count'], 3)

    def test_all_scores_must_be_finite_numbers_within_the_rubric(self):
        path = self.judges / 'judge_round4_cedar.json'
        original = json.loads(path.read_text())
        for invalid in [True, False, '7', None, 0, 11, float('nan'), float('inf'), 10 ** 400]:
            with self.subTest(invalid=str(invalid)[:20]):
                data = copy.deepcopy(original)
                data['scores'][0]['A'] = invalid
                self.write(path, data)
                with self.assertRaises(ValueError):
                    self.aggregate()
        original['scores'][0]['A'] = 1
        self.write(path, original)
        self.assertEqual(self.aggregate()['paired_per_ref'][0]['ai'], 1)

    def test_missing_duplicate_and_extra_reference_scores_are_rejected(self):
        path = self.judges / 'judge_round4_cedar.json'
        original = json.loads(path.read_text())
        cases = [original['scores'][:1], original['scores'] + [original['scores'][0]],
                 original['scores'] + [{**original['scores'][0], 'ref': 'A.99'}]]
        for scores in cases:
            self.write(path, {'scores': scores})
            with self.assertRaises(ValueError):
                self.aggregate()

    def test_missing_score_letter_is_rejected(self):
        self.change_judge(lambda data: data['scores'][0].pop('D'))
        with self.assertRaises(ValueError):
            self.aggregate()

    def test_original_cohort_cannot_silently_shrink(self):
        self.write(self.round3 / 'cedar_key.json', {'A.1': {}, 'A.99': {}})
        with self.assertRaisesRegex(ValueError, 'original cohort'):
            self.aggregate()

    def test_duplicate_json_keys_and_repeated_arm_labels_are_rejected(self):
        path = self.round4 / 'cedar_key.json'
        original = path.read_text()
        path.write_text('{"A.1":{},"A.1":{}}')
        with self.assertRaisesRegex(ValueError, 'duplicate JSON key'):
            self.aggregate()
        data = json.loads(original)
        data['A.1']['A'] = data['A.1']['B']
        self.write(path, data)
        with self.assertRaisesRegex(ValueError, 'exactly once'):
            self.aggregate()

    def test_cli_does_not_replace_results_when_validation_fails(self):
        output = self.root / 'results.json'
        output.write_text('previous valid results')
        self.change_judge(lambda data: data['scores'].clear())
        run = subprocess.run([sys.executable, str(SCRIPT), '--round4-dir', str(self.round4), '--judges-dir', str(self.judges),
                              '--round3-dir', str(self.round3), '--output', str(output)], capture_output=True, text=True)
        self.assertNotEqual(run.returncode, 0)
        self.assertIn('Invalid judging data', run.stderr)
        self.assertEqual(output.read_text(), 'previous valid results')


if __name__ == '__main__':
    unittest.main()
