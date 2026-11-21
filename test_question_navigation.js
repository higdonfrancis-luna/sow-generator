// End-to-end navigation between client questions, their original answers and an edited canvas.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.join(__dirname, 'site');
const origin = 'https://question-navigation.test/';
const catalog = require('./canvas/catalog.json');
const { family, agentic } = catalog.plays.find(p => p.custom);
const problem = require('./canvas/problems.json').problems.find(p => p.id === 'content-too-slow');
const snapshot = page => page.evaluate(() => JSON.parse(JSON.stringify({
  play: st.play, on: st.on, outside: st.out, rate: st.rate, size: st.size, choices: st.ls,
  decisions: st.decisions, selected: [...prods(), ...conns()].flatMap(o => all(o)).filter(counted), totals: totals()
})));
async function checkRevenueGoals(page, width) {
  for (const goal of agentic.areas) {
    for (const refinement of [null, ...goal.refine]) {
      await page.evaluate(() => {
        localStorage.clear();
        localStorage.setItem('abv-sow-build-v1', JSON.stringify({v:2, rate:173, size:'typical'}));
      });
      await page.goto(origin); await page.waitForFunction(() => window.READY);
      if (width === 390) {
        await page.locator('#bp-q').fill(goal.question);
        await page.locator('#bp-q').press('Enter');
      } else {
        await page.getByRole('button', {name:goal.question, exact:true}).click();
      }
      const answer = page.locator('#bp .bp-ans');
      assert.equal(await answer.locator('#bp-goal-title').textContent(), 'Recommended: ' + goal.label);
      if (refinement) await answer.getByRole('button', {name:refinement.chip, exact:true}).click();
      const description = await answer.locator('.bp-del').innerText();
      const quote = await answer.locator('.bp-del b').innerText();
      const expectedProducts = [...new Set([...goal.products, ...(refinement?.add || [])])];
      await answer.locator('[data-bpa="build"]').click(); await page.locator('#back-to-answer').waitFor();
      const built = await page.evaluate(() => {
        const ids = [...prods(), ...conns()].flatMap(o => all(o)).filter(counted);
        let once = 0, monthly = 0;
        for (const id of ids) {
          if (unitOf(id) === 'monthly') monthly += hrs(id);
          else once += hrs(id);
        }
        return {products:st.on, area:st.area, choices:st.ls, n:ids.length, once, monthly, fee:document.getElementById('t-big').textContent};
      });
      const detail = goal.label + (refinement ? ' / ' + refinement.chip : '');
      assert.deepEqual(built.products, expectedProducts, detail);
      assert.equal(built.area, goal.label, detail);
      assert.equal(quote, built.fee, detail);
      assert.ok(description.includes(built.n + ' starting services:'), detail);
      assert.ok(description.includes(built.once.toLocaleString('en-US') + ' one-time hours'), detail);
      assert.ok(description.includes(built.monthly.toLocaleString('en-US') + ' a month'), detail);
      if (refinement) {
        if (refinement.owned?.length) assert.ok(Object.values(built.choices).includes(false), detail);
        await page.locator('#back-to-answer').click();
        assert.equal(await page.locator('#bp .bp-ask').last().textContent(), refinement.chip);
        assert.equal(await answer.locator('.bp-del b').innerText(), quote);
        await answer.locator('[data-bpa="build-all"]').click();
        await page.locator('#confirm-yes').click(); await page.locator('#back-to-answer').waitFor();
        const combined = await snapshot(page);
        assert.deepEqual(new Set(combined.on), new Set([...agentic.all.products, ...expectedProducts]), detail);
        for (const [id, enabled] of Object.entries(built.choices)) {
          if (!enabled) assert.equal(combined.choices[id], false, detail + ' / ' + id);
        }
      }
    }
  }
}
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
        assert.equal(await p.locator('#bp-goal-title').textContent(), 'Recommended: GenStudio · Creative foundations');
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
        const insights = family.areas.find(area => area.id === 'genstudio-insights');
        await familyQuestion(p, insights.question);
        await familyQuestion(p, insights.refine[0].chip);
        const refined = await p.evaluate(() => ({
          quote: money(bpSim(bp.setup).yr), products: bp.setup.prods, off: bp.setup.off
        }));
        assert.deepEqual(refined.products, [...insights.products, 'cja']);
        assert.ok(refined.off.length > 0);
        assert.equal(await p.locator('#bp .bp-del b').innerText(), refined.quote);
        await build.click(); await back.waitFor();
        assert.equal(await p.evaluate(() => money(totals().yr)), refined.quote);
        assert.deepEqual((await snapshot(p)).on, refined.products);
        await back.click(); await answer.waitFor();
        assert.equal(await p.locator('#bp .bp-ask').last().innerText(), insights.refine[0].chip);
        await p.locator('#bp [data-bpa="build-all"]').click();
        await p.locator('#confirm-yes').click(); await back.waitFor();
        const combined = await snapshot(p);
        assert.deepEqual(new Set(combined.on), new Set([...family.areas.flatMap(area => area.products), 'cja']));
        for (const service of refined.off) assert.equal(combined.choices[service], false);
        await checkRevenueGoals(p, width);
        assert.deepEqual(errors, []);
        console.log(width + 'px: navigation, refined GenStudio family and every revenue goal and refinement matched their canvases.');
      } finally { await ctx.close(); }
    }
  } finally { await browser.close(); }
}
function familyQuestion(page, text) {return page.getByRole('button',{name:text,exact:true}).click();}
main().catch(e=>{console.error(e);process.exitCode=1;});
