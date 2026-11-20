// The connected catalog on the first page and under a play, including its read-only product and system details.
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const {chromium} = require('playwright');
const catalog = require('./canvas/catalog.json');
const products = new Map(catalog.products.map(p => [p.id, p]));
const adobe = catalog.products.filter(p => !p.outside);
const origin = 'https://map-first-page.test/';
const section = '#knowledge-model-section';
const sorted = values => Array.from(values).sort();
const other = (c, id) => c.a === id ? c.b : c.a;

async function graph(page) {
  return page.locator(section).evaluate(s => ({
    nodes: Object.fromEntries([...s.querySelectorAll('.wke-node')].map(n => [n.dataset.id, n.getAttribute('transform')])),
    outside: [...s.querySelectorAll('.wke-node-outside')].map(n => n.dataset.id).sort(),
    edges: [...s.querySelectorAll('.wke-edge')].map(l => l.dataset.edge).sort(),
    selected: [...s.querySelectorAll('.wke-node[aria-pressed="true"]')].map(n => n.dataset.id),
    marked: [...s.querySelectorAll('.wke-on-canvas')].map(dot => dot.parentNode.dataset.id).sort()
  }));
}
function checkLayout(nodes) {
  const points = Object.values(nodes).map(v => v.slice(10, -1).split(',').map(Number));
  for (let i = 0; i < points.length; i++) {
    const [x,y] = points[i];
    assert(x >= 30 && x <= 830 && y >= 30);
    for (const [a,b] of points.slice(0,i)) assert(Math.hypot(x-a,y-b) >= 60, 'circles must stay apart');
  }
}

(async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [1440, 390]) {
      const ctx = await browser.newContext({viewport:{width,height:900}, isMobile:width<500, hasTouch:width<500});
      await ctx.route('https://abvfirefly.netlify.app/**', r=>r.fulfill({status:404,body:''}));
      await ctx.route(origin+'**', r=>{
        let name=new URL(r.request().url()).pathname;
        if (name.endsWith('/')) name+='index.html';
        const file=path.join(__dirname,'site',name);
        return fs.existsSync(file) ? r.fulfill({path:file}) : r.fulfill({status:404,body:''});
      });
      const page=await ctx.newPage(), errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto(origin);
      await page.waitForFunction(()=>window.READY);
      const map=page.locator(section), select=map.locator('[data-control="product"]');
      const node=id=>map.locator('.wke-node[data-id="'+id+'"]');
      const base=await graph(page);
      assert.deepEqual(sorted(Object.keys(base.nodes)),sorted(adobe.map(p=>p.id)));
      assert.deepEqual([base.edges,base.outside,base.marked,base.selected],[[],[],[],[]]);
      assert.equal(await map.locator('.wke-reset').count(),0);
      assert.equal(await page.locator('#picker-map h2').innerText(),'SEE HOW EVERY PRODUCT CONNECTS');
      assert.equal(await page.locator('.picker-map-s').textContent(),'Choose an Adobe product to see its direct connections.');
      assert(await map.evaluate(s=>s.parentElement.id==='picker-map' && s.parentElement.previousElementSibling.classList.contains('one') && s.parentElement===s.parentElement.parentElement.lastElementChild));
      assert(await map.isVisible());
      const initialState=await page.evaluate(()=>JSON.stringify({st,totals:totals(),storage:{...localStorage}}));
      for (const product of adobe) {
        await select.selectOption(product.id);
        const m=await graph(page);
        const edges=catalog.connections.filter(c=>c.a===product.id||c.b===product.id);
        const systems=new Set(edges.map(c=>other(c,product.id)).filter(id=>products.get(id).outside));
        assert.deepEqual(m.edges,sorted(edges.map(c=>c.id)),product.id);
        assert.deepEqual(m.outside,sorted(systems),product.id);
        assert.deepEqual(m.selected,[product.id]);
        assert.equal(Object.keys(m.nodes).length,adobe.length+systems.size);
        for (const p of adobe) assert.equal(m.nodes[p.id],base.nodes[p.id]);
        checkLayout(m.nodes);
      }
      await node('aemsites').click();
      assert.deepEqual((await graph(page)).outside,['chatgpt','claude','copilot']);
      await node('chatgpt').focus(); await page.keyboard.press('Enter');
      const relationship=map.locator('details[data-relationship="chatgpt-aemsites"]');
      assert(await relationship.locator('.wke-relationship').isVisible());
      assert.match(await relationship.locator('a').getAttribute('href'),/^https:\/\/experienceleague\.adobe\.com\//);
      assert.equal(await select.inputValue(),'aemsites');
      assert.equal(await map.locator('.wke-edge-detail').getAttribute('data-edge'),'chatgpt-aemsites');
      await page.keyboard.press('Escape');
      assert.equal(await relationship.getAttribute('open'),null);
      await node('commerce').click();
      assert.deepEqual((await graph(page)).outside,['crm','erp','oms','pim','wms']);
      await node('erp').click();
      assert(await map.locator('details[data-relationship="commerce-erp"][open] a').isVisible());
      await select.selectOption('cja');
      await map.locator('[data-focus-key="services"]').click();
      const serviceIds=await map.locator('.wke-services select option').evaluateAll(options=>options.map(o=>o.value));
      assert.deepEqual(sorted(serviceIds),sorted(new Set([...products.get('cja').lines,...products.get('cja').more])));
      assert.match(await map.locator('.wke-services').innerText(),/read-only/);
      await map.locator('.wke-clear').click();
      assert.deepEqual(await graph(page),base);
      assert.equal(await page.evaluate(()=>JSON.stringify({st,totals:totals(),storage:{...localStorage}})),initialState);
      assert(await page.evaluate(w=>document.documentElement.scrollWidth<=w,width));
      console.log('PASS',width+'px opening map, all '+adobe.length+' product views, fixed Adobe positions, direct connections, keyboard, sources, clear and quote isolation');

      await page.locator('#picker-list [data-play="commerce"]').click();
      const on=await page.evaluate(()=>displayProducts().map(p=>p.id));
      const active=on.filter(id=>!products.get(id).outside);
      const play=await graph(page);
      const externalEdges=catalog.connections.filter(c=>(active.includes(c.a)&&products.get(c.b).outside)||(active.includes(c.b)&&products.get(c.a).outside));
      const between=catalog.connections.filter(c=>active.includes(c.a)&&active.includes(c.b));
      assert.deepEqual(play.edges,sorted([...between,...externalEdges].map(c=>c.id)));
      assert.deepEqual(play.marked,sorted(on.filter(id=>play.nodes[id])));
      assert.deepEqual(play.selected,[]);
      assert(await map.evaluate(s=>s.previousElementSibling.classList.contains('sow-canvas-screen')));
      assert.match(await map.locator('.wke-inspector').innerText(),/Brand Visibility.*Commerce/);
      await node('target').click();
      assert.equal(await map.locator('.wke-membership').innerText(),'Not on my canvas');
      await map.locator('.wke-reset').click();
      assert.deepEqual(await graph(page),play);

      await page.locator('#rate').fill('125');
      const quote=()=>page.evaluate(()=>({
        picked:counted('XR02'), serviceHours:hrs('XR02'), serviceFee:fee('XR02'), oneTime:totals().one,
        hours:[...prods(),...conns()].flatMap(all).filter(counted).reduce((sum,id)=>sum+hrs(id),0)
      }));
      const withERP=await quote();
      assert.equal(withERP.picked,true);
      await page.evaluate(()=>showCard('c','commerce-erp'));
      const erpToggle=page.locator('#card [data-l="XR02"] button.tg');
      await erpToggle.click();
      const withoutERP=await quote();
      assert.equal(withoutERP.picked,false);
      assert.equal(withERP.hours-withoutERP.hours,withERP.serviceHours);
      assert.equal(withERP.oneTime-withoutERP.oneTime,withERP.serviceFee);
      await node('commerce').click(); await node('erp').click();
      assert.deepEqual(await quote(),withoutERP);
      await erpToggle.click();
      assert.deepEqual(await quote(),withERP);
      await page.locator('#card [data-close]').click();
      await page.locator('#change-play').click(); await page.locator('#confirm-yes').click();
      assert.deepEqual(await graph(page),base);
      assert(await map.evaluate(s=>s.parentElement.id==='picker-map'));
      assert.deepEqual(errors,[]);
      console.log('PASS',width+'px play context, actual membership, ERP service hours and fees, reset and return to first page');
      await ctx.close();
    }
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
