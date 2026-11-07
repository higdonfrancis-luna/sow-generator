"""Rebuild the 28 omitted original-generator files from the pinned application commit.

The checkpoint-10 package shipped 28 files under
original-review-package/warroom-sow-claude-review-2026-11-06/original-generator/
that are byte-identical to the repository at commit 497dc766. They were not
committed a second time (see IMPORT_MANIFEST.json). This script writes them
back from git, checks every byte against the package's own SNAPSHOT.json, and
then the package's verify_package.py runs unchanged.

Usage, from anywhere inside the repository:
    python3 sow/audit_2026-11-06/independent-review/restore_original_generator.py
The restored folder is listed in this directory's .gitignore.
"""
from pathlib import Path
import hashlib
import json
import subprocess

HERE = Path(__file__).resolve().parent
PKG = HERE / 'original-review-package' / 'warroom-sow-claude-review-2026-11-06'
manifest = json.loads((HERE / 'IMPORT_MANIFEST.json').read_text())
commit = manifest['application_commit']
omitted = [f for f in manifest['files'] if f['status'] == 'omitted_byte_identical_in_git']
assert len(omitted) == 28, len(omitted)
for entry in omitted:
    data = subprocess.run(['git', 'show', f"{commit}:{entry['repository_path']}"],
                          cwd=HERE, check=True, capture_output=True).stdout
    assert hashlib.sha256(data).hexdigest() == entry['sha256'], ('SHA-256 mismatch', entry['package_path'])
    target = HERE / entry['package_path']
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    print('✅', entry['package_path'])
print(f'✅ Restored {len(omitted)} files from {commit[:7]}; now run {PKG.name}/verify_package.py')
