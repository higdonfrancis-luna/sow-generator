# The AI reader for the RFI Builder's Read with AI (step 72, Nov 11 2026)

`warroom-assistant-worker.js` is the worker `warroom-assistant` as it ran on Nov 11 2026 with one route added:
`POST /rfi/read`. Nothing else in the worker is changed (74 lines added, none removed; `node --check` passes).

## To deploy

Code only, so the worker's secrets and bindings stay as they are (three KV and R2 bindings and five secrets, among them
`BEDROCK_API_KEY`):

- from Claude Code, once Adam says "deploy the worker": `PUT /accounts/{account}/workers/scripts/warroom-assistant/content`
  with `metadata={"main_module":"worker.js"}` and this file as `worker.js` (type `application/javascript+module`); then
  read the settings back and compare the bindings, and smoke-test a WARROOM route with a browser-style User-Agent;
- or by hand: Cloudflare dashboard, Workers, `warroom-assistant`, Edit code, paste this file over the code, Deploy.

To go back: deploy the previous version from the dashboard's Deployments list.

## To test once deployed

    curl -s -X POST https://warroom-assistant.adam-d1a.workers.dev/rfi/read \
      -H 'Origin: https://proto.adobe.io' -H 'Content-Type: application/json' \
      -d '{"name":"test.txt","text":"<at least 200 characters of an RFI>"}'

A call without that Origin gets 403. The button itself works only on proto.adobe.io.
