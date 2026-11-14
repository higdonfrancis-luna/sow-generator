# Round 5: RFI Builder reliability

Starting commit: `484f12a7` on `claude/amazing-volta-go9ton`. The audit's panel rated the original Briarhaven Word proposal 2/10. Its reader found 24 rows and retained only three printed references.

## Task 1: test pack and baseline

`make_fixtures.py` renders `fixtures_source.json` using ReportLab, python-docx and openpyxl. The 18 fictional procurements in `fixtures/` have 226 requirements, with one key each in `gold/`. The 12 PDFs include genuine cross-page continuations, two-column pages, numbered lists, tables and paragraphs containing several independent asks. The three Word files include native list numbering and a table. The three Excel forms use actual rows for the response cells. Separate extraction and inspection of the printed pages, Word numbering and workbook rows verified each question's text, order, reference, section and limit. Rebuilding reproduced the exact bytes of all 18 documents.

The supplied grader skipped text, section, limit and classification checks on missing references and could not match unnumbered asks. `check_reader.js` now compares these in document order, checks literal null limits, and requires complete coverage for the four fields. The eight checks per key use the same criteria before and after the reader work. The original reader passes **37 of 152 checks**.

| Key | Questions | Original rows | Before / 8 | After / 8 |
| --- | ---: | ---: | ---: | ---: |
| bellwater-city | 16 | 16 | 3 | 8 |
| bracken-pier-insurance | 14 | 14 | 3 | 8 |
| briarhaven | 32 | 24 | 0 | 8 |
| brindlewick-pharma | 12 | 12 | 4 | 8 |
| cedarspan-telecom | 12 | 12 | 1 | 8 |
| copper-mere-bank | 12 | 2 | 1 | 8 |
| copper_tide_media | 12 | 6 | 3 | 8 |
| elmglass_power | 12 | 6 | 2 | 8 |
| flintmere-software | 12 | 12 | 3 | 8 |
| kestrel_bend_university | 12 | 12 | 0 | 8 |
| lantern_cove_travel | 12 | 11 | 1 | 8 |
| larkspur-meals | 12 | 13 | 1 | 8 |
| marlow-motor | 12 | 12 | 3 | 8 |
| northmere_waterways | 12 | 12 | 2 | 8 |
| reedhaven-mutual | 13 | 2 | 1 | 8 |
| silverfen_health | 12 | 12 | 2 | 8 |
| snowcap-orchard-assurance | 12 | 13 | 0 | 8 |
| stoneford-valve-works | 13 | 13 | 3 | 8 |
| willow-quay-outfitters | 14 | 14 | 4 | 8 |

### Verification

Both prescribed Python builds passed. All 12 shared suites passed. Each later task reruns these suites.

- `test_rfp.js`
- `test_rfp_kb_round2.js`
- `test_rfp_part3.js`
- `test_rfp_round4_exclusions.js`
- `test_rfp_round4_sorting.js`
- `test_rfp_round4_subasks.js`
- `test_rfp_round4_tailoring.js`
- `test_rfp_round4_trimming.js`
- `test_rfp_step75.js`
- `test_rfp_step81.js`
- `test_rfp_step89.js`
- `test_rfp_step90.js`

No screen changes in this task.

## Task 2: reader, step 98

`sow/rfp_readers.js` groups PDF glyphs by physical line, removes repeated page edges, and reads table cells and page continuations in position. It distinguishes two-column prose from response tables. Word lists keep their native numbers and restart values. Excel sections include merged heading rows, and response records retain their worksheet coordinates. `sow/rfp_finder.js` preserves a numbered requirement as one response, splits independent unnumbered requests, carries headings and context, and calculates file, section and row limits. The pile classifier uses the actual procurement question and surrounding section. `sow/rfp_answers.js` uses the resolved budget and retains its historical fallback for older saves.

All 19 files scored **8/8**, up from 37/152 to **152/152**. All 258 requirements matched their wording, references, order, section, limit and pile. The browser also retained instructions and milestones as context. An independent check compared all 77 printed priorities in the tagged documents. The supplied Briarhaven PDF contains no printed priority values.

Both builds and the 12 shared suites passed. The additional suites `test_rfp_step50.js`, `test_rfp_step51.js`, `test_rfp_step52.js`, `test_rfp_context_sheets.js` and `test_rfp_step74.js` passed. The word-limit checks in `test_rfp_step67.js` also passed. No existing tests or screen layout needed changes.
