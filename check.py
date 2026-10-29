"""Checks for the partner SOW tool. Loads the page headless, exercises each template and prints ✅/❌ lines.

    python3 check.py index.html [screenshot_dir]
"""
import asyncio
import os
import re
import sys

from playwright.async_api import async_playwright

PATH = os.path.abspath(sys.argv[1])
SHOTS = sys.argv[2] if len(sys.argv) > 2 else None
EXPECTED_ORDER = ['cja', 'commerce', 'aem', 'fsi', 'abv', 'coworker']
EXPECTED_ONE_TIME_HOURS = {'cja': 216, 'commerce': 216, 'aem': 1488, 'fsi': 808, 'abv': 152, 'coworker': 156}
EXPECTED_MONTHLY_HOURS = {'cja': 104, 'commerce': 104, 'aem': 104, 'fsi': 104, 'abv': 104, 'coworker': 32}
EXPECTED_STARTERS = {'cja': ['L01', 'L02', 'C01', 'C06', 'O01', 'O02'], 'commerce': ['L01', 'L02', 'L03', 'C02', 'O01', 'O02'], 'aem': ['L01', 'L02', 'A01', 'A02', 'A03', 'C03', 'O01', 'O02'], 'fsi': ['L01', 'L02', 'F02', 'C04', 'O01', 'O02'], 'abv': ['L01', 'L02', 'C05', 'O01', 'O02'], 'coworker': ['CW01', 'CW02', 'CW03', 'CW07', 'CW05', 'CW06']}
EXPECTED_OPTIONAL = {'cja': 4, 'commerce': 5, 'aem': 4, 'fsi': 5, 'abv': 4, 'coworker': 1}

results = []


def check(name, ok, detail=''):
    results.append(ok)
    print(('✅ ' if ok else '❌ ') + name + (': ' + detail if detail else ''))


async def main():
    html = open(PATH, encoding='utf-8').read()
    check('no em or en dashes in the file', '—' not in html and '–' not in html)
    check('no Adobe Consulting Services mention', 'consulting services' not in html.lower())
    check('no software pricing in the file', not re.search(r'\$\s?\d', html))
    check('no navy template colors left', not any(c in html.lower() for c in ('#1c2e3e', '#203343', '#e16a5c', '#e35242', '#647482')))
    check('one planning note, no repeated disclaimers', html.count('class="planning-note"') == 1 and 'estimateNote' not in html and 'library-note' not in html)
    check('every catalog service carries a source and a title', html.count('"sourceTitle": "') == 35 and html.count('"source": "http') == 35)
    check('no dead scopeText fields in the catalog', '"scopeText"' not in html)
    check('200 prompts to start, nowhere 50', '200 prompts to start' in html and 'up to 50 prompts' not in html)
    check('AEM play reads as a new-site pursuit', 'Build the site on AEM Sites with Edge Delivery Services' in html)
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1440, 'height': 1000})
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: errors.append(m.type + ': ' + m.text) if m.type == 'error' else None)
        await page.goto('file://' + PATH)
        await page.wait_for_timeout(1200)
        check('page loads with no console or script errors', not errors, '; '.join(errors)[:300])
        check('Adobe logo in the masthead', await page.locator('.masthead img[alt="Adobe"]').count() == 1)
        font = await page.evaluate("getComputedStyle(document.body).fontFamily")
        check('body font is Source Sans 3', 'Source Sans 3' in font, font)
        order = await page.eval_on_selector_all('#plays .play', 'els=>els.map(e=>e.dataset.play)')
        check('six templates in deck order', order == EXPECTED_ORDER, ','.join(order))
        labels = await page.eval_on_selector_all('#plays .nav-label', 'els=>els.map(e=>e.textContent)')
        check('two groups: Sales plays, Sell on its own', labels == ['Sales plays', 'Sell on its own'], ','.join(labels))
        title = await page.text_content('#play-title')
        check('CJA play opens first', title == 'Brand Visibility + Customer Journey Analytics', title)
        side_bg = await page.evaluate("getComputedStyle(document.querySelector('.sidebar')).backgroundColor")
        check('sidebar is white', side_bg in ('rgba(0, 0, 0, 0)', 'rgb(255, 255, 255)'), side_bg)
        for play in EXPECTED_ORDER:
            await page.click(f'[data-play="{play}"]')
            await page.click('[data-step="services"]')
            await page.fill('#service-rate', '150')
            await page.wait_for_timeout(120)
            one = await page.text_content('.total-card:nth-child(1) small')
            month = await page.text_content('.total-card:nth-child(2) small')
            one_h = int(one.split()[0].replace(',', ''))
            month_h = int(month.split()[0].replace(',', ''))
            check(f'{play}: starter hours one-time {one_h}, monthly {month_h}', one_h == EXPECTED_ONE_TIME_HOURS[play] and month_h == EXPECTED_MONTHLY_HOURS[play])
            ids = await page.eval_on_selector_all('.service-card', 'els=>els.map(e=>e.dataset.line)')
            check(f'{play}: starting services in order', ids == EXPECTED_STARTERS[play], ','.join(ids))
            optional = await page.locator('#service-extensions button[data-add]').count()
            check(f'{play}: optional services offered', optional == EXPECTED_OPTIONAL[play], str(optional))
            cards = await page.locator('.service-card').count()
            sources = await page.eval_on_selector_all('.service-card .service-source a', 'els=>els.map(e=>e.href)')
            check(f'{play}: every service card shows a source link', cards == len(sources) and all(s.startswith('http') for s in sources), f'{cards} cards, {len(sources)} links')
            notes = await page.locator('.planning-note').count()
            check(f'{play}: the planning note shows once', notes == 1)
        await page.click('[data-play="cja"]')
        await page.click('[data-step="services"]')
        await page.click('#add-service')
        await page.wait_for_timeout(200)
        lib = await page.locator('#available-services .available').count()
        lib_src = await page.locator('#available-services .available a').count()
        check('service library lists the unselected services with sources', lib > 0 and lib == lib_src, f'{lib} services, {lib_src} links')
        await page.keyboard.press('Escape')
        await page.click('[data-step="document"]')
        await page.wait_for_timeout(300)
        rule = await page.evaluate("getComputedStyle(document.querySelector('.sow-doc-header')).borderTopColor")
        check('SOW document top rule is black, no Adobe branding on the partner paper', rule == 'rgb(28, 28, 28)', rule)
        doc_logo = await page.locator('#sow-preview img').count()
        check('no logo inside the SOW document', doc_logo == 0)
        sections = await page.locator('#sow-preview .sow-section').count()
        check('SOW document renders its nine sections', sections == 9, str(sections))
        check('no errors after exercising every template', not errors, '; '.join(errors)[:300])
        if SHOTS:
            os.makedirs(SHOTS, exist_ok=True)
            await page.click('[data-play="aem"]')
            for step in ('scope', 'services', 'document'):
                await page.click('[data-step="' + step + '"]')
                await page.wait_for_timeout(300)
                await page.screenshot(path=os.path.join(SHOTS, f'sow_{step}.png'))
            mobile = await browser.new_page(viewport={'width': 390, 'height': 844})
            await mobile.goto('file://' + PATH)
            await mobile.wait_for_timeout(1200)
            await mobile.click('[data-step="services"]')
            await mobile.wait_for_timeout(300)
            await mobile.screenshot(path=os.path.join(SHOTS, 'sow_mobile.png'))
        await browser.close()
    print(('ALL CHECKS PASSED (%d)' % len(results)) if all(results) else ('%d OF %d CHECKS FAILED' % (results.count(False), len(results))))
    sys.exit(0 if all(results) else 1)


asyncio.run(main())
