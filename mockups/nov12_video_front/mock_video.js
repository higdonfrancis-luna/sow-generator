// Mockup only (Nov 12 2026, Adam: "I want this video to be front and center on the first page you come to"). Nothing in
// the tool changes: the video block is drawn into the built front page in the browser. Two options.
//   node sow/mockups/nov12_video_front/mock_video.js
const {chromium} = require('playwright'), path = require('path'), fs = require('fs');
const poster = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, 'poster.jpg')).toString('base64');
const PLAY = '<span style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:86px;height:86px;border-radius:50%;background:#EB1000;box-shadow:0 6px 18px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center"><svg width="34" height="34" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>';
const A = `<div style="border:1.5px solid #D5D5D5;border-top:4px solid #EB1000;border-radius:16px;background:#fff;padding:22px 24px;margin:0 0 22px">
  <h2 style="margin:0 0 4px;font-size:24px;font-weight:700;color:#1C1C1C">Watch the four Brand Visibility partner plays</h2>
  <p style="margin:0 0 14px;font-size:16px;color:#1C1C1C">Five minutes on what each play sells, who it is for and the services partners deliver. Then pick a play below.</p>
  <div style="position:relative;border-radius:12px;overflow:hidden;background:#000;aspect-ratio:16/9"><img src="${poster}" alt="" style="display:block;width:100%;height:100%;object-fit:cover"></div></div>`;
const B = `<div style="border:1.5px solid #D5D5D5;border-top:4px solid #EB1000;border-radius:16px;background:#fff;padding:20px 24px;margin:0 0 22px;display:flex;gap:26px;align-items:center">
  <div style="position:relative;flex:0 0 46%;border-radius:12px;overflow:hidden;background:#000;aspect-ratio:16/9"><img src="${poster}" alt="" style="display:block;width:100%;height:100%;object-fit:cover"></div>
  <div><p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#C40000">Start here</p>
    <h2 style="margin:0 0 8px;font-size:26px;line-height:1.15;font-weight:700;color:#1C1C1C">Watch the four Brand Visibility partner plays</h2>
    <p style="margin:0 0 16px;font-size:16.5px;line-height:1.45;color:#1C1C1C">Five minutes on what each play sells, who it is for and the services partners deliver. Then pick a play below and build its statement of work.</p>
    <span style="display:inline-block;background:#EB1000;color:#fff;font-size:16px;font-weight:700;padding:11px 22px;border-radius:8px">Watch the video</span></div></div>`;
(async () => { const b = await chromium.launch();
  for (const [name, html] of [['option_a_large', A], ['option_b_side', B]]) { const p = await b.newPage({viewport: {width: 1280, height: 1000}, deviceScaleFactor: 2});
    await p.goto('file://' + path.resolve(__dirname, '../../site/index.html')); await p.waitForSelector('#bp');
    await p.evaluate(html => { const bp = document.getElementById('bp'); bp.insertAdjacentHTML('beforebegin', html); const v = bp.previousElementSibling; v.style.boxSizing = 'border-box'; v.style.width = bp.getBoundingClientRect().width + 'px'; }, html); await p.waitForTimeout(300);
    await p.screenshot({path: path.join(__dirname, name + '.png'), clip: {x: 0, y: 0, width: 1280, height: name === 'option_a_large' ? 1000 : 900}}); await p.close(); }
  await b.close(); })().catch(e => { console.error(e); process.exit(1); });
