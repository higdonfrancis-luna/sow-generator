// Render the animation to a silent MP4, one frame at a time, so every frame is exact.
// Also writes build/cues_<timeline>.json (sound-effect cue times) for the audio mix.
//   node render_video.js <out.mp4> [timeline] [fromFrame] [toFrame]
// timeline: timeline (full video, default) or timeline_cja / timeline_com / timeline_aem.
// A toFrame of 0 writes the cues only.
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright');

(async () => {
  const [out, tl = 'timeline', from, to] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  // a translated timeline (i18n/build_lang.py) names its own page; the English ones use anim/animate.html
  const own = JSON.parse(fs.readFileSync(path.resolve(__dirname, `${tl}.json`), 'utf8')).page;
  await page.goto('file://' + path.resolve(__dirname, '..', own || 'anim/animate.html') + '?tl=' + tl);
  const info = await page.evaluate(() => window.READY);
  const cues = await page.evaluate(() => window.CUES);
  fs.writeFileSync(path.resolve(__dirname, `cues_${tl}.json`), JSON.stringify(cues, null, 1));
  const f0 = from ? +from : 0;
  const f1 = to !== undefined ? Math.min(+to, info.frames) : info.frames;
  if (f1 <= f0) { console.log(`cues only: ${cues.length} cues`); await browser.close(); return; }
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(info.fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(info.fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const started = Date.now();
  for (let i = f0; i < f1; i++) {
    await page.evaluate(t => window.render(t), i / info.fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((i - f0) % 300 === 0) console.log(`frame ${i} of ${f1}, ${((Date.now() - started) / 1000).toFixed(0)} s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  const secs = (Date.now() - started) / 1000;
  console.log(`done: ${f1 - f0} frames in ${secs.toFixed(0)} s (${((f1 - f0) / secs).toFixed(1)} fps) -> ${out}`);
  if (errs.length) { console.log('PAGE ERRORS', errs); process.exit(1); }
})();
