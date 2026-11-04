"""Clickable prototype (Nov 4 2026, Adam: "please mock it up for me"): a copy of the built Build page with click to open
(the touch-screen behavior for every pointer: no card on hover), the i dots as "N services" pills, a service count on
each product box, and the hint saying Click. Not the site; Continue doesn't lead anywhere from here.
    python3 sow/mockups/nov4_click/make_prototype.py
"""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
html = open(os.path.join(HERE, '..', '..', 'site', 'index.html'), encoding='utf-8').read()
def rep(a, b):
    global html
    assert html.count(a) == 1, a[:70]
    html = html.replace(a, b)
rep("const touchy=e=>!HOVER.matches||", "const touchy=e=>true||")
rep("Hover a product or an i to see its services;", "Click a product or a connection to see its services;")
extra = r'''<style>
.ib.pill{width:auto;min-width:28px;height:30px;border-radius:15px;padding:0 12px;font-size:14px;line-height:25px;white-space:nowrap;box-shadow:0 0 0 4px #F4F4F4;cursor:pointer}
.node{flex-direction:column;gap:0;cursor:pointer}.node .cnt{display:block;font-size:13px;font-weight:600;color:#C40000;margin-top:2px}
.node:hover{outline:3px solid #EB1000;outline-offset:2px}
.proto{position:fixed;left:50%;transform:translateX(-50%);bottom:8px;z-index:99;background:#1C1C1C;color:#fff;font:600 13px/1.4 inherit;padding:7px 14px;border-radius:16px}
</style>
<div class="proto">Prototype: click to open, no hover</div>
<script>
/* prototype: pills and counts, refreshed after every render and click */
(function(){const n=k=>k===1?'1 service':k+' services';
  function paint(){try{document.querySelectorAll('.ib').forEach(b=>{const c=C.find(x=>x.id===b.dataset.c);if(!c)return;const t=n(all(c).filter(counted).length);if(b.textContent!==t||!b.classList.contains('pill')){b.classList.add('pill');b.textContent=t;b.style.marginLeft=-(b.offsetWidth-28)/2+'px';}});
    document.querySelectorAll('#stage .node').forEach(e=>{const o=P[e.dataset.p];if(!o||o.outside)return;const k=all(o).filter(counted).length,t=k?n(k):'Services on its connections';let sp=e.querySelector('.cnt');if(!sp){sp=document.createElement('span');sp.className='cnt';e.appendChild(sp);}if(sp.textContent!==t)sp.textContent=t;});}catch(e){}}
  new MutationObserver(()=>requestAnimationFrame(paint)).observe(document.getElementById('stage'),{childList:true,subtree:true});
  document.addEventListener('click',()=>setTimeout(paint,30),true);paint();})();
</script>'''
rep("</body>", extra + "</body>")
open(os.path.join(HERE, 'click_prototype.html'), 'w', encoding='utf-8').write(html)
print('click_prototype.html', len(html), 'bytes')
