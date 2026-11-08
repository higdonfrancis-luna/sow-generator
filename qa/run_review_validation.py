"""Run the existing SOW browser suites and retain exact logs and exit codes.

This runner has no publish or deployment step. Use --group core, history or regression
to split the independent existing suites across CI jobs.
"""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parents[2]
SOW = ROOT / 'sow'
SUITES = {
    'core': [
        ('citation_manifest', [sys.executable, 'qa/check_citation_review.py']),
        ('test_citation_review', ['node', 'test_citation_review.js']),
        ('check', [sys.executable, 'check.py', 'index.html']),
        ('test_canvas', ['node', 'canvas/test_canvas.js']),
        ('test_problems', ['node', 'canvas/test_problems.js']),
        ('test_site', ['node', 'test_site.js']),
        ('test_own_service', ['node', 'test_own_service.js', 'index.html']),
        ('test_start_over', ['node', 'test_start_over.js', 'site/sow/index.html']),
    ],
    'history': [
        ('test_review_nov2', ['node', 'test_review_nov2.js']),
    ],
    'regression': [
        ('test_drafts', ['node', 'test_drafts.js']),
        ('test_step45', ['node', 'test_step45.js']),
        ('test_step46', ['node', 'test_step46.js']),
        ('test_step47', ['node', 'test_step47.js']),
    ],
}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--group', choices=[*SUITES, 'all'], default='all')
    parser.add_argument('--output', type=Path, default=Path('/tmp/warroom-validation'))
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    groups = list(SUITES) if args.group == 'all' else [args.group]
    outcomes = []
    for group in groups:
        for name, command in SUITES[group]:
            started = time.monotonic()
            timeout = 1800 if group == 'history' else 900
            with (args.output / (name + '.log')).open('w') as log:
                try:
                    result = subprocess.run(command, cwd=SOW, stdout=log,
                                            stderr=subprocess.STDOUT, timeout=timeout)
                    code = result.returncode
                except subprocess.TimeoutExpired:
                    code = 124
                    log.write(f'\nRunner timeout after {timeout} seconds.\n')
            outcome = {'suite': name, 'exit_code': code,
                       'seconds': round(time.monotonic() - started, 2),
                       'command': command}
            outcomes.append(outcome)
            print(json.dumps(outcome), flush=True)
            if code:
                print((args.output / (name + '.log')).read_text()[-8000:], flush=True)
    report = {'commit': os.environ.get('GITHUB_SHA', ''),
              'group': args.group, 'outcomes': outcomes,
              'passed': all(row['exit_code'] == 0 for row in outcomes)}
    (args.output / 'summary.json').write_text(json.dumps(report, indent=2) + '\n')
    return 0 if report['passed'] else 1

if __name__ == '__main__':
    raise SystemExit(main())
