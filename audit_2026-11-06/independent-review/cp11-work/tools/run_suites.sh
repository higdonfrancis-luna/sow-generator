#!/bin/bash
# usage: run_suites.sh <label>
cd /home/user/warroom/sow; L=$1; O=${SUITE_OUT:-/tmp}/suites_$L; mkdir -p $O
run(){ n=$1; shift; timeout 900 "$@" > $O/$n.log 2>&1; echo "$n exit=$? | $(grep -E 'PASSED|FAILED|passed|failed|ALL ' $O/$n.log | tail -1)"; }
run check python3 check.py index.html
run test_canvas node canvas/test_canvas.js
run test_problems node canvas/test_problems.js
run test_site node test_site.js
run test_own_service node test_own_service.js index.html
run test_start_over node test_start_over.js site/sow/index.html
run test_review_nov2 node test_review_nov2.js
run test_drafts node test_drafts.js
run test_step45 node test_step45.js
run test_step46 node test_step46.js
run test_step47 node test_step47.js
