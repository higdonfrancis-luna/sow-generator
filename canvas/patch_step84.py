#!/usr/bin/env python3
"""Step 84 (Nov 12 2026, Adam, with a picture of his video page: "we don't have the jump to on our video ... We need that
for the video on our SOW generator as well").

The first page's video gets the video page's own player: Jump to (the eight parts, the one playing marked), Next, and a
full screen button that takes the video and its buttons together. The look and the behaviour are the video page's
(exec/build_web_coworker.py on the abv-partner-plays branch), carried over. When the video starts, its box widens to the
whole card so the list of parts fits inside the picture, as on the video page.

Run once from the repo root, after patch_step83.py: python3 sow/canvas/patch_step84.py"""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(HERE, 'template.html')
s = open(PATH, encoding='utf-8').read()
assert 'VIDEO_PARTS' not in s, 'step 84 has already been applied'
before = (s.count('{') - s.count('}'), s.count('(') - s.count(')'), s.count('[') - s.count(']'))


def rep(a, b):
    global s
    assert s.count(a) == 1, (s.count(a), a[:70])
    s = s.replace(a, b)


# 1. the player: the step 83 function gives way to one that builds the video with its buttons
a = s.index("function playVideo(){")
b = s.index("$('vid-play').addEventListener('click',playVideo);")
assert s.count("function playVideo(){") == 1 and a < b
s = s[:a] + r'''/* step 84: the parts of the video, as on the video page (chapters.vtt there): start in seconds, name, kind */
const VIDEO_PARTS=[[0,'Intro','start'],[55.65,'CJA','play'],[81.57,'Coworker in CJA','coworker'],[118.83,'Commerce','play'],[159.04,'BV + Sites Optimizer + EDS','play'],[192.9,'Coworker in AEM','coworker'],[232.58,'FSI','play'],[251.82,'Coworker for FSI','coworker']];
const vidClock=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
function playVideo(){const holder=$('vid-box');let v=holder.querySelector('video');
  if(v){v.play().catch(()=>{});return;}   // a file that cannot play already shows its line
  const poster=holder.querySelector('img').src,spark='<svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c.7 5.3 4 8.6 10 10-6 1.4-9.3 4.7-10 10-.7-5.3-4-8.6-10-10 6-1.4 9.3-4.7 10-10z"/></svg>';
  holder.innerHTML='<div class="vid-pl" id="vid-pl"><video controls controlslist="nofullscreen" playsinline autoplay preload="auto" aria-label="Video: the four Brand Visibility partner plays"></video>'+
    '<div class="jump"><button type="button" class="jbtn" aria-controls="jpan" aria-expanded="false"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2" fill="currentColor"/><circle cx="4.5" cy="12" r="1.2" fill="currentColor"/><circle cx="4.5" cy="18" r="1.2" fill="currentColor"/></svg>Jump to</button>'+
    '<div class="jpan" id="jpan" aria-label="Parts of the video">'+VIDEO_PARTS.map(([t,name,kind])=>'<button type="button" class="jrow '+kind+'" data-t="'+t+'" data-name="'+esc(name)+'">'+(kind==='coworker'?spark:'')+'<span>'+esc(name)+'</span><span class="t">'+vidClock(t)+'</span></button>').join('')+'</div>'+
    '<button type="button" class="fsb" aria-label="Full screen" title="Full screen"><svg class="in" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg><svg class="out" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg></button>'+
    '<button type="button" class="nxt"><span>Next:</span><b></b><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button></div></div>';
  $('vid-card').classList.add('playing');$('vid-fail').hidden=true;$('vid-watch').hidden=true;
  v=holder.querySelector('video');v.poster=poster;v.addEventListener('error',()=>{$('vid-fail').hidden=false;});
  const pl=$('vid-pl'),box=pl.querySelector('.jump'),btn=box.querySelector('.jbtn'),pan=box.querySelector('.jpan'),nx=box.querySelector('.nxt'),nxName=nx.querySelector('b'),fsb=box.querySelector('.fsb');
  const rows=[...pan.querySelectorAll('.jrow')],starts=rows.map(r=>+r.dataset.t);
  // a small player (a phone) opens the list as a sheet at the foot of the screen
  const size=()=>box.classList.toggle('small',v.clientHeight<360);
  new ResizeObserver(size).observe(v);size();
  // the part playing now is marked in the list; Next names the part after it (none after the last)
  let cur=-1;
  const sync=()=>{let i=0;starts.forEach((t,k)=>{if(t<=v.currentTime+0.05)i=k;});if(i===cur)return;cur=i;
    rows.forEach((r,k)=>r.classList.toggle('on',k===i));nx.hidden=i===rows.length-1;if(!nx.hidden)nxName.textContent=rows[i+1].dataset.name;};
  ['timeupdate','seeking','seeked','loadedmetadata'].forEach(e=>v.addEventListener(e,sync));sync();
  // the buttons show with the player's own controls: while paused, and for a few seconds after the pointer moves
  let hideAt;
  const show=()=>{box.classList.add('show');clearTimeout(hideAt);hideAt=setTimeout(()=>{if(!v.paused&&!pan.classList.contains('open')&&!box.contains(document.activeElement))box.classList.remove('show');},2500);};
  ['pointermove','pointerdown'].forEach(e=>{v.addEventListener(e,show);box.addEventListener(e,show);});
  ['play','pause'].forEach(e=>v.addEventListener(e,show));box.addEventListener('focusin',show);
  const menu=open=>{pan.classList.toggle('open',open);btn.setAttribute('aria-expanded',open);show();};
  const go=t=>{v.currentTime=t;v.play().catch(()=>{});menu(false);};
  btn.addEventListener('click',e=>{e.stopPropagation();menu(!pan.classList.contains('open'));});
  rows.forEach(r=>r.addEventListener('click',()=>go(+r.dataset.t)));
  nx.addEventListener('click',()=>go(starts[cur+1]));
  document.addEventListener('click',e=>{if(!box.contains(e.target))menu(false);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&pan.classList.contains('open')){menu(false);btn.focus();}});
  // full screen takes the video and its buttons together (the browser's own full screen shows the video alone)
  const fsEl=()=>document.fullscreenElement||document.webkitFullscreenElement;
  const fs=()=>{if(fsEl())(document.exitFullscreen||document.webkitExitFullscreen).call(document);
    else if(pl.requestFullscreen||pl.webkitRequestFullscreen)Promise.resolve((pl.requestFullscreen||pl.webkitRequestFullscreen).call(pl)).catch(()=>{});
    else if(v.webkitEnterFullscreen)v.webkitEnterFullscreen();};
  fsb.addEventListener('click',e=>{e.stopPropagation();fs();});v.addEventListener('dblclick',e=>{e.preventDefault();fs();});
  ['fullscreenchange','webkitfullscreenchange'].forEach(n=>document.addEventListener(n,()=>{const on=fsEl()===pl;fsb.classList.toggle('on',on);fsb.setAttribute('aria-label',on?'Exit full screen':'Full screen');fsb.title=fsb.getAttribute('aria-label');size();show();}));
  v.src=VIDEO_URL;show();v.focus();}
''' + s[b:]

# 2. the styles: the playing card, and the video page's buttons
rep('''@media(max-width:760px){.vid-card{flex-direction:column;align-items:stretch}.vid-box{flex:none}}''',
    '''@media(max-width:760px){.vid-card{flex-direction:column;align-items:stretch}.vid-box{flex:none}}
/* step 84: once it plays, the video takes the card's width, and carries Jump to, Next and full screen as on the video page */
.vid-card.playing{flex-direction:column;align-items:stretch;gap:0}
.vid-card.playing .vid-box{flex:none}
.vid-card.playing .vid-copy>:not(.vid-fail){display:none}
.vid-pl{position:relative;width:100%;height:100%;background:#000}
.vid-pl:fullscreen,.vid-pl:-webkit-full-screen{background:#000}
.vid-pl video::-webkit-media-controls-fullscreen-button{display:none}
.jump{position:absolute;inset:0;z-index:2;pointer-events:none}
.jump .jbtn,.jump .nxt,.jump .fsb{position:absolute;display:flex;align-items:center;border:0;font:inherit;line-height:1.2;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .2s}
.jump.show .jbtn,.jump.show .nxt,.jump.show .fsb{opacity:1;pointer-events:auto}
.jump .jbtn{top:14px;right:64px;gap:8px;padding:8px 14px;border-radius:999px;background:#fff;color:#1C1C1C;font-size:15px;font-weight:700;box-shadow:0 2px 10px rgba(0,0,0,.25)}
.jump .jbtn[aria-expanded="true"]{background:#1C1C1C;color:#fff}
.jump .nxt{right:14px;bottom:76px;gap:8px;padding:9px 14px 9px 16px;border-radius:12px;background:#1C1C1C;color:#fff;font-size:16px;box-shadow:0 2px 10px rgba(0,0,0,.3)}
.jump .nxt b{font-weight:700}
.jump .nxt[hidden]{display:none}
.jump .fsb{top:14px;right:14px;width:42px;height:37px;justify-content:center;padding:0;border-radius:999px;background:#fff;color:#1C1C1C;box-shadow:0 2px 10px rgba(0,0,0,.25)}
.jump .fsb .out,.jump .fsb.on .in{display:none}
.jump .fsb.on .out{display:block}
.jump .jpan{display:none;position:absolute;top:58px;right:14px;width:280px;max-height:calc(100% - 72px);overflow:auto;padding:8px;border-radius:14px;background:#fff;box-shadow:0 8px 28px rgba(0,0,0,.28);pointer-events:auto}
.jump .jpan.open{display:block}
.jump .jrow{display:flex;align-items:center;gap:8px;width:100%;padding:6px 10px;border:0;border-radius:8px;background:none;font:inherit;font-size:15px;line-height:1.25;color:#1C1C1C;cursor:pointer;text-align:left}
.jump .jrow:hover,.jump .jrow:focus-visible{background:#EDEDED;outline:none}
.jump .jrow.start,.jump .jrow.play{font-weight:700}
.jump .jrow.coworker{padding-left:24px}
.jump .jrow svg{flex:none;fill:#EB1000}
.jump .jrow .t{margin-left:auto;font-weight:400;font-variant-numeric:tabular-nums;color:#3A3A3A}
.jump .jrow.on{background:#EB1000;color:#fff}
.jump .jrow.on svg{fill:#fff}
.jump .jrow.on .t{color:#fff}
.jump.small .jbtn{top:8px;right:48px;gap:6px;padding:6px 10px;font-size:13px}
.jump.small .jbtn svg{width:15px;height:15px}
.jump.small .fsb{top:8px;right:8px;width:34px;height:30px}
.jump.small .fsb svg{width:15px;height:15px}
.jump.small .nxt{right:8px;bottom:52px;gap:6px;padding:6px 10px 6px 12px;font-size:13px}
.jump.small .jpan{position:fixed;z-index:10;top:auto;left:12px;right:12px;bottom:12px;width:auto;max-height:70vh;box-shadow:0 8px 40px rgba(0,0,0,.4)}''')
after = (s.count('{') - s.count('}'), s.count('(') - s.count(')'), s.count('[') - s.count(']'))
assert before == after, (before, after)
open(PATH, 'w', encoding='utf-8').write(s)
print('template.html: the first page video has Jump to, Next and full screen')
