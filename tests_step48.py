"""Step 48 on the SOW steps (Nov 5 2026, Adam: "Let's fix what we know that needs to be fixed and then we have to be ready
to ship it"): the earlier checks that test behaviour this step changed on purpose (sow/patch_step48_sow.py and
sow/canvas/patch_step48_changeplay.py). Run once on the step 47 checks.
- Download SOW, Print / PDF and Services CSV no longer refuse to run while Before you issue this SOW lists open items:
  they give the SOW marked "Draft, not ready to issue" with the number of open items, in files named -DRAFT. The three
  checks that expected no download (check.py, test_step47.js, test_site.js) now expect the marked draft, test_site.js
  also checks the folded list's summary and the CSV's draft row, and check.py checks that a ready SOW carries no mark.
- Change play next to the play title now opens the canvas's Change the play? confirm, so test_site.js's two trips
  through it answer the confirm that is already open instead of clicking the canvas's own Change play first.
test_review_nov2.js and test_drafts.js need no change.

    python3 sow/tests_step48.py [folder holding the checks, default sow/]
"""
import os
import sys
HERE = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))


def patch(name, edits):
    p = os.path.join(HERE, name)
    t = open(p, encoding='utf-8').read()
    dashes = t.count('—') + t.count('–')
    for old, new, n in edits:
        assert t.count(old) == n, (name, t.count(old), old[:90])
        t = t.replace(old, new)
    assert t.count('—') + t.count('–') == dashes, 'no new dashes'
    open(p, 'w', encoding='utf-8').write(t)


patch('check.py', [
    ("        await fresh.click('#download-sow')\n"
     "        await fresh.wait_for_timeout(150)\n"
     "        check('Download waits until the readiness items are done', 'Before you issue' in (await fresh.text_content('#toast')))\n",
     "        async with fresh.expect_download() as info:\n"
     "            await fresh.click('#download-sow')\n"
     "        dl = await info.value\n"
     "        n_open = await fresh.locator('#readiness li').count()\n"
     "        body = open(await dl.path(), encoding='utf-8').read()\n"
     "        check('with readiness items open, Download gives the SOW marked as a draft, not ready to issue, with the count, in a -DRAFT file (step 48)', dl.suggested_filename.endswith('-DRAFT.html') and f'Draft, not ready to issue: {n_open} open item' in body and 'Before you issue' in (await fresh.text_content('#toast')), dl.suggested_filename)\n", 1),
    ("        check('the downloaded SOW (not just the preview) carries the estimate basis, the reason and the illustrative-fee wording', 'Estimate basis' in body",
     "        check('the downloaded SOW (not just the preview) carries the estimate basis, the reason and the illustrative-fee wording, and no draft mark once ready (step 48)', not dl.suggested_filename.endswith('-DRAFT.html') and 'Draft, not ready to issue' not in body and 'Estimate basis' in body", 1),
])

patch('test_step47.js', [
    ("    await p.click('#download-sow'); await p.waitForTimeout(200);\n"
     "    ok((await p.textContent('#toast')).includes('Before you issue'), 'and Download waits for them');\n",
     "    const [dd] = await Promise.all([p.waitForEvent('download'), p.click('#download-sow')]); const draft = fs.readFileSync(await dd.path(), 'utf8');\n"
     "    ok(dd.suggestedFilename().endsWith('-DRAFT.html') && /Draft, not ready to issue: \\d+ open items?\\./.test(draft), 'and until they are done, Download marks the SOW as a draft (step 48)', dd.suggestedFilename());\n", 1),
])

patch('test_site.js', [
    ("  await p.click('.topbar [data-build]'); await p.waitForURL(u => !/\\/sow\\//.test(String(u))); await p.waitForTimeout(400);\n"
     "  await p.click('#change-play'); await p.click('#confirm-yes'); await p.waitForTimeout(300);\n",
     "  await p.click('.topbar [data-build]'); await p.waitForURL(u => !/\\/sow\\//.test(String(u))); await p.waitForTimeout(400);\n"
     "  ok(await p.isVisible('#confirm') && (await p.textContent('#confirm-title')) === 'Change the play?' && !p.url().includes('change=play'), 'Change play next to the play title opens the canvas confirm in one click (step 48)');\n"
     "  await p.click('#confirm-yes'); await p.waitForTimeout(300);\n", 2),
    ("  await p.click('#download-sow'); await p.waitForTimeout(200);\n"
     "  ok((await p.textContent('#toast')).includes('Before you issue'), 'Download waits until the concepts are written');\n",
     "  { const n = (await p.$$('#readiness li')).length, mark = 'Draft, not ready to issue: ' + n + ' open items.';\n"
     "    const summary = await p.textContent('#readiness summary'), folded = !(await p.$eval('#readiness', d => d.open));\n"
     "    const [dd] = await Promise.all([p.waitForEvent('download'), p.click('#download-sow')]); const draft = fs.readFileSync(await dd.path(), 'utf8');\n"
     "    const [dc] = await Promise.all([p.waitForEvent('download'), p.click('#export-csv')]); const csv = fs.readFileSync(await dc.path(), 'utf8');\n"
     "    ok(folded && summary === n + ' items to finish before you issue this SOW' && (await p.textContent('#sow-preview')).includes(mark), 'the open items fold into one line above the document, which is marked as a draft (step 48)', summary);\n"
     "    ok(dd.suggestedFilename().endsWith('-DRAFT.html') && draft.includes(mark) && dc.suggestedFilename().endsWith('-DRAFT.csv') && csv.split('\\r\\n')[0].includes(mark) && (await p.textContent('#toast')).includes('Before you issue'), 'with concepts still to write, Download SOW and Services CSV give drafts marked not ready to issue (step 48)', dd.suggestedFilename() + ' ' + dc.suggestedFilename()); }\n", 1),
])
print('step 48 checks updated: the exports give a marked draft while items are open, and Change play opens the canvas confirm')
