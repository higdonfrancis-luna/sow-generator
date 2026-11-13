"""Round 4 panel regression checks: preserve complete-case output and expose missing arms honestly."""
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).with_name('panel_build.py')
MISSING = 'No answer was produced for this requirement.'


class PanelBuildTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        (self.root / 'rfi.txt').write_text('Example client\nA.1 Describe the work.\n', encoding='utf-8')
        ai = [{'ref': 'A.' + str(i), 'question': 'Question ' + str(i), 'limit': 120 + i,
               'model': 'claude-opus-5-5' if i < 5 else 'catalog' if i == 5 else 'knowledge base',
               'answer': 'AI ' + str(i)} for i in range(1, 7)]
        ai.append({'ref': '', 'question': 'Background', 'model': 'claude-opus-5-5', 'answer': 'Not a requirement'})
        current = [
            {'ref': 'A.1', 'question': 'Describe the work.', 'limit': 180, 'kb': 'Current method', 'catalog': 'Current catalog'},
            {'ref': 'A.2', 'question': 'Question 2', 'limit': 122, 'kb': None, 'catalog': 'Current fallback'},
            {'ref': 'A.7', 'question': 'No AI answer exists', 'kb': 'Uncompared method', 'catalog': 'Other catalog'}]
        prior = [
            {'ref': 'A.1', 'kb': 'Prior method', 'catalog': 'Prior catalog'},
            {'ref': 'A.2', 'kb': None, 'catalog': 'Prior fallback'},
            {'ref': 'A.3', 'kb': None, 'catalog': 'Prior-only fallback'}]
        for name, data in [('ai.json', {'answers': ai}), ('current.json', current), ('prior.json', prior)]:
            (self.root / name).write_text(json.dumps(data), encoding='utf-8')

    def tearDown(self):
        self.temp.cleanup()

    def run_panel(self, missing=False, prior=True, requirement_key=False, flags_first=False):
        args = [sys.executable, str(SCRIPT), str(self.root / 'rfi.txt'), str(self.root / 'ai.json'),
                str(self.root / 'current.json'), str(self.root), 'test']
        if prior:
            args.append(str(self.root / 'prior.json'))
        flags = ['--include-missing'] if missing else []
        if requirement_key:
            flags.extend(['--requirement-key', str(self.root / 'requirements.json')])
        if flags_first:
            args[2:2] = flags
        else:
            args.extend(flags)
        subprocess.run(args, check=True, capture_output=True, text=True)
        return (self.root / 'test_panel.txt').read_text(), json.loads((self.root / 'test_key.json').read_text())

    def test_default_output_is_unchanged(self):
        text, key = self.run_panel()
        self.assertEqual(key, {'A.1': {'A': 'ai', 'B': 'kb', 'C': 'kb_prior', 'D': 'catalog'}})
        self.assertEqual(text, 'THE RFP (as the client issued it)\nExample client\nA.1 Describe the work.\n\n'
                         '=== A.1 (word limit 180): Describe the work.\n\n--- Answer A\nAI 1\n\n'
                         '--- Answer B\nCurrent method\n\n--- Answer C\nPrior method\n\n--- Answer D\nCurrent catalog\n\n')

    def test_expanded_panel_keeps_missing_and_actual_fallbacks(self):
        text, key = self.run_panel(missing=True)
        self.assertEqual(list(key), ['A.1', 'A.2', 'A.3', 'A.4'])
        self.assertTrue(all(set(arm.values()) == {'ai', 'kb', 'kb_prior', 'catalog'} for arm in key.values()))
        a2 = text.split('=== A.2', 1)[1].split('=== A.3', 1)[0]
        self.assertEqual(a2.count('Current fallback'), 2)
        self.assertIn('Prior fallback', a2)
        a3 = text.split('=== A.3', 1)[1].split('=== A.4', 1)[0]
        self.assertIn('(word limit 123): Question 3', a3)
        self.assertIn('Prior-only fallback', a3)
        self.assertEqual(a3.count(MISSING), 2)
        self.assertEqual(text.split('=== A.4', 1)[1].count(MISSING), 3)
        self.assertNotIn('AI 5', text)
        self.assertNotIn('AI 6', text)
        self.assertNotIn('Not a requirement', text)

    def test_three_arm_mode_remains_available(self):
        text, key = self.run_panel(prior=False)
        self.assertEqual(key, {'A.1': {'A': 'ai', 'B': 'kb', 'C': 'catalog'}})
        self.assertNotIn('--- Answer D', text)

    def test_authored_key_removes_security_and_firm_questions_only_when_requested(self):
        key = [{'ref': 'A.1', 'kind': 'adobe'}, {'ref': 'A.2', 'kind': 'firm'},
               {'ref': 'A.3', 'kind': 'security'}, {'ref': 'A.4', 'kind': 'adobe'}]
        (self.root / 'requirements.json').write_text(json.dumps(key))
        unfiltered, unfiltered_key = self.run_panel(missing=True)
        self.assertEqual(list(unfiltered_key), ['A.1', 'A.2', 'A.3', 'A.4'])
        text, filtered_key = self.run_panel(missing=True, requirement_key=True)
        self.assertEqual(list(filtered_key), ['A.1', 'A.4'])
        self.assertNotIn('=== A.2', text)
        self.assertNotIn('=== A.3', text)
        self.assertEqual(text.split('=== A.4', 1)[1].count(MISSING), 3)
        before, before_key = self.run_panel(missing=True, requirement_key=True, flags_first=True)
        self.assertEqual((before, before_key), (text, filtered_key))
        default, default_key = self.run_panel(requirement_key=True)
        self.assertEqual(list(default_key), ['A.1'])

    def test_authored_key_duplicate_references_are_rejected(self):
        (self.root / 'requirements.json').write_text(json.dumps([
            {'ref': 'A.1', 'kind': 'adobe'}, {'ref': 'A.1', 'kind': 'security'}]))
        with self.assertRaises(subprocess.CalledProcessError):
            self.run_panel(missing=True, requirement_key=True)

    def test_sources_are_not_substituted_for_missing_answer_text(self):
        (self.root / 'current.json').write_text(json.dumps([{'ref': 'A.1', 'kb': '\nAdobe sources\nLink only', 'catalog': ''}]))
        text, key = self.run_panel(missing=True)
        section = text.split('=== A.1', 1)[1].split('=== A.2', 1)[0]
        self.assertEqual(section.count(MISSING), 2)
        self.assertNotIn('Link only', text)


if __name__ == '__main__':
    unittest.main()
