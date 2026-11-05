"""Step 46 test updates (Nov 4 2026): the checks that name the SOW's wording now read "the Client" (the client sweep).
Text a test writes itself as a partner ("the customer team", "the customer's tracker") and the live site's old
wording it replays stay as they were. Run once from sow/.

    python3 tests_step46.py
"""
import os
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'test_review_nov2.js')
s = open(P, encoding='utf-8').read()


def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)


rep("'routed to one customer-designated team'", "'routed to one Client-designated team'", 3)
rep("const deps = ['CDN log forwarding is the customer\\'s IT team\\'s change:", "const deps = ['CDN log forwarding is the Client\\'s IT team\\'s change:")
rep("'Data warehouse: the customer\\'s data team gives the access", "'Data warehouse: the Client\\'s data team gives the access")
rep("'Cloud storage: the customer gives access to the agreed storage location', 'CRM: the customer\\'s CRM administrator gives an API user'];",
    "'Cloud storage: the Client gives access to the agreed storage location', 'CRM: the Client\\'s CRM administrator gives an API user'];")
rep("and its Dependencies and risks give the customer\\'s part for each outside system", "and its Dependencies and risks give the Client\\'s part for each outside system")
rep("includes(\"confirm with the customer's data team that change tracking is on for each table\") && C('OX3').exclusions.includes('(the customer turns on change tracking)')",
    "includes(\"confirm with the Client's data team that change tracking is on for each table\") && C('OX3').exclusions.includes('(the Client turns on change tracking)')")
rep("deps[0] === \"CDN log forwarding is the customer's IT team's change:", "deps[0] === \"CDN log forwarding is the Client's IT team's change:")
rep("&& deps[1] === \"CDN log forwarding comes through a log export the partner builds in Adobe's file format and the customer's team runs\"",
    "&& deps[1] === \"CDN log forwarding comes through a log export the partner builds in Adobe's file format and the Client's team runs\"")
rep("&& deps[2] === \"CDN log forwarding is the customer's IT team's change: the partner creates the log job in the CDN console with the team's access and change approval, and builds a log export in Adobe's file format that the customer's team runs\"",
    "&& deps[2] === \"CDN log forwarding is the Client's IT team's change: the partner creates the log job in the CDN console with the team's access and change approval, and builds a log export in Adobe's file format that the Client's team runs\"")
rep("&& deps[3] === \"CDN log forwarding is set up by the customer's IT team\"", "&& deps[3] === \"CDN log forwarding is set up by the Client's IT team\"")
rep("'S28: Dependencies and risks give CDN log forwarding one owner, the customer\\'s IT team,", "'S28: Dependencies and risks give CDN log forwarding one owner, the Client\\'s IT team,")
# step 32's paragraphs: the same words as before, but for the client sweep
rep("same: t.replace(/\\n\\n/g, ' ') === PRIOR32[id].assumptions[0]};",
    "same: [t.replace(/\\n\\n/g, ' '), PRIOR32[id].assumptions[0]].map(x => x.replace(/\\b(customer|client)\\b/gi, 'C')).reduce((a, b) => a === b)};")
rep("x.textContent.startsWith('The customer has licensed Sites Optimizer')", "x.textContent.startsWith('The Client has licensed Sites Optimizer')")
rep("/^Customer CDN\\./m.test(dOwn.split(' | ').find(x => x.startsWith('Customer CDN')) || '')", "/^Client CDN\\./m.test(dOwn.split(' | ').find(x => x.startsWith('Client CDN')) || '')")
rep("/CDN log forwarding is the customer's IT team's change: the partner creates the log job/.test(dCja)", "/CDN log forwarding is the Client's IT team's change: the partner creates the log job/.test(dCja)")
rep("follow the answer (customer CDN until confirmed)", "follow the answer (Client CDN until confirmed)")
open(P, 'w', encoding='utf-8').write(s)
print('test_review_nov2.js: step 46 updates applied')
