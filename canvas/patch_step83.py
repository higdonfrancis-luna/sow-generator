#!/usr/bin/env python3
"""Step 83 (Nov 12 2026, Adam: "I want this video to be front and center on the first page you come to", then "B" to
sow/mockups/nov12_video_front/option_b_side.png, and "it's also here https://abvfirefly.netlify.app/").

The first page opens with the four Brand Visibility plays video: its poster on the left, "Start here", a headline, one
sentence and a Watch the video button on the right. A click plays the video in place. The video file is not in the
site: it is played from abvfirefly.netlify.app, where Adam's video page lives; if it cannot play, a link to that page
takes its place. The poster is in the page (sow/video_poster.jpg, put in by build.py).

Run once from the repo root: python3 sow/canvas/patch_step83.py"""
import os
HERE = os.path.dirname(os.path.abspath(__file__))


def patch(path, pairs):
    s = open(path, encoding='utf-8').read()
    before = (s.count('{') - s.count('}'), s.count('(') - s.count(')'), s.count('[') - s.count(']'))
    for a, b in pairs:
        assert s.count(a) == 1, (path, s.count(a), a[:70])
        s = s.replace(a, b)
    after = (s.count('{') - s.count('}'), s.count('(') - s.count(')'), s.count('[') - s.count(']'))
    assert tuple(x - y for x, y in zip(after, before)) in ((0, 0, 0), (2, 0, 0)), (before, after)   # {{VIDEO_POSTER}} adds two braces
    open(path, 'w', encoding='utf-8').write(s)


T = os.path.join(HERE, 'template.html')
assert 'vid-card' not in open(T, encoding='utf-8').read(), 'step 83 has already been applied'
patch(T, [
    ('<section class="picker" id="picker"><div class="in"><div class="bp" id="bp">',
     '<section class="picker" id="picker"><div class="in"><div class="vid-card" id="vid-card"><div class="vid-box" id="vid-box"><button type="button" class="vid-poster" id="vid-play" aria-label="Play the video: the four Brand Visibility partner plays"><img src="data:image/jpeg;base64,{{VIDEO_POSTER}}" alt="" width="1120" height="630"></button></div><div class="vid-copy"><p class="vid-eye">Start here</p><h2 class="vid-t">Watch the four Brand Visibility partner plays</h2><p class="vid-s">Five minutes on what each play sells, who it is for and the services partners deliver. Then pick a play below and build its statement of work.</p><button type="button" class="vid-btn" id="vid-watch">Watch the video</button><p class="vid-fail" id="vid-fail" hidden>The video could not play here. <a href="https://abvfirefly.netlify.app/" target="_blank" rel="noopener">Open the video page</a></p></div></div><div class="bp" id="bp">'),
    ('.bp{background:#fff;border:1.5px solid #1C1C1C;border-top:4px solid #EB1000;',
     '''/* step 83: the plays video opens the first page */
.vid-card{display:flex;gap:26px;align-items:center;background:#fff;border:1.5px solid #1C1C1C;border-top:4px solid #EB1000;border-radius:8px;padding:20px 24px;margin:0 0 26px;max-width:1080px}
.vid-box{flex:0 0 46%;min-width:0;aspect-ratio:16/9;border-radius:8px;overflow:hidden;background:#000}
.vid-poster{display:block;width:100%;height:100%;padding:0;border:0;background:#fff;cursor:pointer}
.vid-poster img,.vid-box video{display:block;width:100%;height:100%;object-fit:contain}
.vid-poster:focus-visible{outline:3px solid #1C1C1C;outline-offset:-3px}
.vid-eye{margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#C40000}
.vid-t{margin:0 0 8px;font-size:26px;line-height:1.15;font-weight:700;color:#1C1C1C}
.vid-s{margin:0 0 16px;font-size:16.5px;line-height:1.45;color:#1C1C1C}
.vid-btn{border:0;border-radius:8px;background:#EB1000;color:#fff;font:inherit;font-size:16px;font-weight:700;padding:11px 22px;cursor:pointer}
.vid-btn:hover{background:#C40000}
.vid-fail{margin:12px 0 0;font-size:15px;color:#1C1C1C}.vid-fail a{color:#C40000;font-weight:700}
@media(max-width:760px){.vid-card{flex-direction:column;align-items:stretch}.vid-box{flex:none}}
.bp{background:#fff;border:1.5px solid #1C1C1C;border-top:4px solid #EB1000;'''),
    ("/* ---------- Start from your client's problem (step 40) ----------",
     '''/* ---------- The plays video on the first page (step 83) ----------
   The file is played from Adam's video site, not kept in this one; VIDEO_URL is its one address. */
const VIDEO_URL='https://abvfirefly.netlify.app/brand-visibility-four-plays-coworker-cd091098.mp4';
function playVideo(){const box=$('vid-box');let v=box.querySelector('video');
  if(v){v.play().catch(()=>{});return;}   // a file that cannot play already shows its line
  const poster=box.querySelector('img').src;v=document.createElement('video');
  v.controls=true;v.autoplay=true;v.playsInline=true;v.preload='auto';v.poster=poster;v.setAttribute('aria-label','Video: the four Brand Visibility partner plays');
  v.addEventListener('error',()=>{$('vid-fail').hidden=false;});
  v.src=VIDEO_URL;box.textContent='';box.appendChild(v);$('vid-fail').hidden=true;$('vid-watch').hidden=true;v.focus();}
$('vid-play').addEventListener('click',playVideo);$('vid-watch').addEventListener('click',playVideo);

/* ---------- Start from your client's problem (step 40) ----------'''),
])
B = os.path.join(HERE, 'build.py')
patch(B, [
    (".replace('{{LOGO}}', b64(os.path.join(SOW, 'adobe_logo.png'))))",
     ".replace('{{LOGO}}', b64(os.path.join(SOW, 'adobe_logo.png')))\n              .replace('{{VIDEO_POSTER}}', b64(os.path.join(SOW, 'video_poster.jpg'))))"),
])
print('template.html and build.py: the plays video opens the first page')
