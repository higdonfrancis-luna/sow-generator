# Round 5: RFI Builder reliability

Starting commit: `484f12a7` on `claude/amazing-volta-go9ton`. The audit's panel rated the original Briarhaven Word proposal 2/10. Its reader found 24 rows and retained only three printed references.

## Task 1: test pack and baseline

`make_fixtures.py` renders `fixtures_source.json` using ReportLab, python-docx and openpyxl. The 18 fictional procurements in `fixtures/` have 226 requirements, with one key each in `gold/`. The 12 PDFs include genuine cross-page continuations, two-column pages, numbered lists, tables and paragraphs containing several independent asks. The three Word files include native list numbering and a table. The three Excel forms use actual rows for the response cells. Separate extraction and inspection of the printed pages, Word numbering and workbook rows verified each question's text, order, reference, section and limit. Rebuilding reproduced the exact bytes of all 18 documents.

The supplied grader skipped text, section, limit and classification checks on missing references and could not match unnumbered asks. `check_reader.js` now compares these in document order, checks literal null limits, and requires complete coverage for the four fields. The eight checks per key use the same criteria before and after the reader work. The original reader passes **37 of 152 checks**.

| Key | Questions | Original rows | Before / 8 | After / 8 |
| --- | ---: | ---: | ---: | ---: |
| bellwater-city | 16 | 16 | 3 | pending |
| bracken-pier-insurance | 14 | 14 | 3 | pending |
| briarhaven | 32 | 24 | 0 | pending |
| brindlewick-pharma | 12 | 12 | 4 | pending |
| cedarspan-telecom | 12 | 12 | 1 | pending |
| copper-mere-bank | 12 | 2 | 1 | pending |
| copper_tide_media | 12 | 6 | 3 | pending |
| elmglass_power | 12 | 6 | 2 | pending |
| flintmere-software | 12 | 12 | 3 | pending |
| kestrel_bend_university | 12 | 12 | 0 | pending |
| lantern_cove_travel | 12 | 11 | 1 | pending |
| larkspur-meals | 12 | 13 | 1 | pending |
| marlow-motor | 12 | 12 | 3 | pending |
| northmere_waterways | 12 | 12 | 2 | pending |
| reedhaven-mutual | 13 | 2 | 1 | pending |
| silverfen_health | 12 | 12 | 2 | pending |
| snowcap-orchard-assurance | 12 | 13 | 0 | pending |
| stoneford-valve-works | 13 | 13 | 3 | pending |
| willow-quay-outfitters | 14 | 14 | 4 | pending |

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
