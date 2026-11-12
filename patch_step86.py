"""Step 86 (Nov 12 2026), the statement of work page: the rule that asked for Adobe's written confirmation goes.

Since step 47, on the FSI play, "Before you issue" listed every Coworker service until its assumptions recorded Adobe's
written confirmation that Coworker is available to the Client's organization, and held the statement of work as a draft
until then; a second rule listed a service whose assumptions still held the partner note "confirm eligibility" or "before
proposing". Adam, Nov 12: "publish every connection every feature every functionality as though it's available and don't
provide any caveats". Step 86 took those sentences out of the Coworker services, so both rules are removed whole: the
comment, the test and the loop. The same goes for the rule that held Real-Time CDP context in conversations until Adobe's
written confirmation was recorded, and for those words in what Implement Brand Concierge says when that service is in scope.

Run once from the repo root, after canvas/data_step86.py: python3 sow/patch_step86.py
"""
import os

PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'index.html')
OLD = """ /* step 47: Coworker isn't offered to some industries, so on the FSI play each Coworker service records Adobe's written confirmation; and no partner note stays in an assumption */
 const COWORKER_CONFIRM=s=>state.play==='fsi'&&(/^CW/.test(baseId(s))||/\\bCoworker\\b/.test(s.name));
 for(const s of lines){const r=row(s);if(COWORKER_CONFIRM(s)&&!(/confirm/i.test(r.assumptions)&&/\\d/.test(r.assumptions)))out.push(s.name+': record Adobe\\'s written confirmation (date or reference) that Coworker is available to the Client\\'s organization in its assumptions.');
  if(/confirm eligibility|before proposing/i.test(r.assumptions||''))out.push(s.name+': its assumptions still hold a note to you ("confirm eligibility" or "before proposing"). Rewrite it as an assumption, such as "Assumes Adobe confirms that Coworker is available to the Client\\'s organization."');}
"""
# the same rule for Real-Time CDP context in Brand Concierge conversations: the whole loop goes
OLD_XA09 = """ for(const s of lines)if(baseId(s)==='XA09'){const r=row(s);if(!(/confirm/i.test(r.assumptions)&&/\\d/.test(r.assumptions)))out.push(s.name+': record Adobe\\'s written confirmation (date or reference) that the integration is enabled for the tenant, use case and region in its assumptions.');}
"""
# and Implement Brand Concierge, when that service is in scope, says profile answers are as scoped there, with no condition on Adobe
OLD_F02 = "profile-based answers only as scoped in Real-Time CDP context in conversations, after Adobe\\'s written confirmation.');"
NEW_F02 = "profile-based answers only as scoped in Real-Time CDP context in conversations.');"
s = open(PATH, encoding='utf-8').read()
for old in (OLD, OLD_XA09):
    assert s.count(old) == 1, (old[:60], s.count(old))
    assert all(old.count(a) == old.count(b) for a, b in ('()', '{}', '[]')), 'the removed block is not balanced'
    s = s.replace(old, '')
assert s.count(OLD_F02) == 1
s = s.replace(OLD_F02, NEW_F02)
code = s[s.index('<script>const CATALOG='):]
assert 'COWORKER_CONFIRM' not in s and "record Adobe\\'s written confirmation" not in code and "after Adobe\\'s written confirmation" not in code
open(PATH, 'w', encoding='utf-8').write(s)
print('step 86 patch applied to the statement of work page: no rule asks for Adobe\'s written confirmation')
