// End-to-end navigation between client questions, their original answers and an edited canvas.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.join(__dirname, 'site');
const origin = 'https://question-navigation.test/';
const catalog = require('./canvas/catalog.json');
const family = catalog.plays.find(p => p.custom).family;
const problem = require('./canvas/problems.json').problems.find(p => p.id === 'content-too-slow');
const snapshot = page => page.evaluate(() => JSON.parse(JSON.stringify({
  play: st.play, on: st.on, outside: st.out, rate: st.rate, size: st.size, choices: st.ls,
  decisions: st.decisions, selected: [...prods(), ...conns()].flatMap(o => all(o)).filter(counted), totals: totals()
})));
async function main() {
  const browser = await chromium.launch();
  try {
    for (const width of [1440, 390]) {
      const ctx = await browser.newContext({viewport: {width, height: 900}, reducedMotion:'reduce'});
      try {
        await ctx.route(origin + '**', route => {
          const u = new URL(route.request().url());
          const file = path.join(root, u.pathname.endsWith('/') ? u.pathname + 'index.html' : u.pathname);
          return fs.existsSync(file) ? route.fulfill({path: file}) : route.fulfill({status: 404, body: ''});
        });
        const p = await ctx.newPage(), errors = [];
        p.on('pageerror', e => errors.push(e.message));
        await p.goto(origin); await p.waitForFunction(() => window.READY);
        const q = p.locator('#bp-q'), clear = p.locator('#bp-clear');
        const answer = p.locator('#bp .bp-ans'), build = p.locator('#bp [data-bpa="build"]');
        const resume = p.locator('#bp-resume'), back = p.locator('#back-to-answer');
        assert.equal(await clear.isVisible(), false);
        await q.fill('a question still being typed'); await clear.click();
        assert.equal(await q.inputValue(), '');
        await p.getByRole('button',{name:'See all problems',exact:true}).click();
        await p.getByRole('button',{name:problem.chip,exact:true}).click();
        await answer.waitFor();
        await p.locator('#bp [data-bpr]').first().click(); await answer.waitFor();
        const bubbles = await p.locator('#bp .bp-ask').allTextContents();
        assert.equal(bubbles.length, 2);
        await build.click(); await back.waitFor();
        await p.locator('#rate').fill('173');
        await p.locator('[data-size="large"]').click();
        const selected = await p.evaluate(() => {
          const owner = prods().find(o => !o.outside && all(o).some(counted));
          const line = all(owner).find(counted); return {product:owner.id,line};
        });
        const tile = p.locator('#stage .node[data-p="' + selected.product + '"]');
        const title = tile.locator('.offering-title');
        await (await title.count() ? title : tile).dblclick();
        await p.locator('#card [data-t="' + selected.line + '"]').click();
        await p.keyboard.press('Escape');
        const edited = await snapshot(p);
        assert.equal(edited.choices[selected.line], false);
        // A page reload reopens the saved canvas. Browser Back restores the refined answer.
        await p.reload(); await back.waitFor();
        await p.goBack(); await answer.waitFor();
        assert.deepEqual(await p.locator('#bp .bp-ask').allTextContents(), bubbles);
        await p.reload(); await resume.waitFor();
        assert.deepEqual(await p.locator('#bp .bp-ask').allTextContents(), bubbles);
        await p.goForward(); await back.waitFor();
        assert.deepEqual(await snapshot(p), edited);
        await back.click(); await answer.waitFor(); await build.click(); await back.waitFor();
        assert.deepEqual(await snapshot(p), edited);
        await back.click(); await p.getByRole('button',{name:'Back to questions',exact:true}).click();
        assert.equal(await p.locator('#bp [data-bpp]').count(), 32);
        await p.getByRole('button',{name:family.areas[1].question,exact:true}).click();
        assert.equal(await p.locator('#bp-goal-title').innerText(), 'GenStudio · Creative foundations');
        await build.click(); await p.locator('#confirm-no').click();
        await resume.click(); assert.deepEqual(await snapshot(p), edited);
        await back.click(); await clear.click(); await familyQuestion(p,family.areas[1].question);
        await build.click(); await p.locator('#confirm-yes').click(); await back.waitFor();
        assert.deepEqual((await snapshot(p)).on, family.areas[1].products);
        await back.click(); await clear.click();
        assert.equal(await q.inputValue(), '');
        await resume.click(); await p.locator('#start-over').click(); await p.locator('#confirm-no').click();
        assert.deepEqual((await snapshot(p)).on, family.areas[1].products);
        await p.locator('#start-over').click(); await p.locator('#confirm-yes').click();
        await p.reload(); await q.waitFor();
        assert.equal(await p.evaluate(() => st.play), null);
        assert.equal(await back.isVisible(), false);
        assert.equal(await p.locator('#bp [data-bpp]').count(), 15);
        assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth), true);
        assert.deepEqual(errors, []);
        console.log(width + 'px: typed and refined questions, browser Back/Forward, reload, edited canvas, replace, cancel and clear passed.');
      } finally { await ctx.close(); }
    }
  } finally { await browser.close(); }
}
function familyQuestion(page, text) {return page.getByRole('button',{name:text,exact:true}).click();}
main().catch(e=>{console.error(e);process.exitCode=1;});
