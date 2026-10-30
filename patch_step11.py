"""Step 11 of the SOW tool (Oct 30 2026, 4:59 pm; Adam: "add the new Services line", from mockups/custom_lines.png):
a dashed "Add your own Launch / Connect / Optimize service" button at the end of each group on the Services step. It opens
a short form in place (service name, hours, one-time or monthly, what's included), and the line lands at the end of that group,
tagged Custom. Custom lines use the same data and save path as the library's existing "Create a custom service" form, which
stays as it is (its lines still land in Optimize). Catalog lines keep their order; only custom lines are placed by group.
Run once on the step 10 file; every anchor must appear exactly once.

    python3 patch_step11.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:70]!r}'
    html = html.replace(old, new)


# styles, next to the library's custom-entry styles
rep('.custom-entry{margin-top:24px;font-size:15px;font-weight:600}',
    '.custom-entry{margin-top:24px;font-size:15px;font-weight:600}'
    '.own{display:flex;align-items:center;gap:10px;width:100%;border:2px dashed var(--ink);border-radius:6px;background:#fff;padding:12px 18px;font-weight:700;font-size:16px;margin:0 0 12px;text-align:left}'
    '.own:hover{border-color:var(--red)}.own svg{flex:none}'
    '.own-form{border:2px solid var(--red);border-radius:6px;background:#fff;padding:16px 20px 18px;margin:0 0 12px}'
    '.own-form h4{margin:0 0 12px;font-size:17px}.own-form .own-grid{display:grid;grid-template-columns:2fr 120px 160px;gap:14px}'
    '.own-form label{display:flex;flex-direction:column;gap:5px;font-size:14px;font-weight:600}'
    '.own-form textarea{min-height:58px}.own-form .own-wide{margin-top:12px}'
    '.own-form .own-acts{display:flex;gap:10px;justify-content:flex-end;margin-top:12px}'
    '.custom-tag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;border:1.5px solid var(--red);color:var(--red);border-radius:3px;padding:1px 6px;margin-left:10px;vertical-align:3px}'
    '@media (max-width:700px){.own-form .own-grid{grid-template-columns:1fr 1fr}.own-form .own-grid label:first-child{grid-column:1/-1}}')

# render: custom lines go to the end of their group, then the button (or the open form) ends each group
rep("function renderRows(){\n const lines=selectedLines();let last='';\n $('service-lines').innerHTML=lines.map(s=>{const r=row(s);const st=STAGES[s.stage]?s.stage:'Launch';const head=st!==last?stageHead(st):'';last=st;return head+",
    "const OWN_ORDER=['Launch','Connect','Optimize'];let ownOpen='';\n"
    "const stageOf=s=>STAGES[s.stage]?s.stage:'Launch';\n"
    "function placeCustom(all){const lines=all.filter(s=>!isCustom(s));for(const c of all.filter(isCustom)){const st=stageOf(c);let at=-1;lines.forEach((s,i)=>{if(stageOf(s)===st)at=i;});"
    "if(at<0)lines.forEach((s,i)=>{if(OWN_ORDER.indexOf(stageOf(s))<OWN_ORDER.indexOf(st))at=i;});lines.splice(at+1,0,c);}return lines;}\n"
    "function ownBlock(st){if(ownOpen===st)return '<form class=\"own-form\" data-own-form=\"'+st+'\"><h4>Your own '+st+' service</h4><div class=\"own-grid\"><label>Service name<input name=\"own-name\" maxlength=\"180\" required></label>"
    "<label>Hours<input name=\"own-hours\" type=\"number\" min=\"0\" step=\"0.5\" value=\"16\" required></label><label>Cadence<select name=\"own-cadence\"><option value=\"one-time\">One-time</option><option value=\"monthly\">Monthly</option></select></label></div>"
    "<label class=\"own-wide\">What\\'s included<textarea name=\"own-scope\" maxlength=\"4000\" required></textarea></label><div class=\"own-acts\"><button type=\"button\" data-own-cancel>Cancel</button><button class=\"primary\" type=\"submit\">Add service</button></div></form>';"
    "return '<button class=\"own\" type=\"button\" data-own=\"'+st+'\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 5v14M5 12h14\" stroke=\"#EB1000\" stroke-width=\"3\" stroke-linecap=\"round\"/></svg>Add your own '+st+' service</button>';}\n"
    "function renderRows(){\n const lines=placeCustom(selectedLines());let last='';const lastAt={};lines.forEach((s,i)=>{lastAt[stageOf(s)]=i;});\n"
    " $('service-lines').innerHTML=lines.map((s,i)=>{const r=row(s);const st=stageOf(s);const head=st!==last?stageHead(st):'';last=st;const tail=lastAt[st]===i?ownBlock(st):'';return head+")
rep("Restore starting scope and hours</button></details></article>';}).join('')",
    "Restore starting scope and hours</button></details></article>'+tail;}).join('')")

# the Custom tag on a custom line's card
rep("<h3>'+esc(s.name)+'</h3><p class=\"service-scope\">",
    "<h3>'+esc(s.name)+(isCustom(s)?'<span class=\"custom-tag\">Custom</span>':'')+'</h3><p class=\"service-scope\">")

# open, cancel and submit the form; the new line uses the existing custom-service data and save path
rep("$('custom-form').onsubmit=e=>{",
    "document.addEventListener('click',e=>{const o=e.target.closest('[data-own]');if(o){ownOpen=o.dataset.own;renderRows();const f=document.querySelector('[data-own-form] [name=\"own-name\"]');if(f)f.focus();return;}"
    "if(e.target.closest('[data-own-cancel]')){ownOpen='';renderRows();}});\n"
    "document.addEventListener('submit',e=>{const f=e.target.closest('[data-own-form]');if(!f)return;e.preventDefault();const st=f.dataset.ownForm,name=f.querySelector('[name=\"own-name\"]').value.trim(),scope=f.querySelector('[name=\"own-scope\"]').value.trim();"
    "if(!name||!scope){toast('Enter a service name and what\\'s included.');return;}const base=Number(amount(f.querySelector('[name=\"own-hours\"]').value,0)||0),"
    "s={id:'CUSTOM'+Date.now(),name,stage:st,base,low:0,high:base,unit:f.querySelector('[name=\"own-cadence\"]').value,plays:[state.play],scope,deliverable:scope,acceptance:'Customer confirms the agreed deliverable meets the documented scope.',assumptions:'Confirm access, approved inputs and review responsibilities.',exclusions:'Work outside the described scope.',basis:'Partner-defined service scope.'};"
    "state.custom.push(s);state.estimates[state.play][s.id]=newLine(s,true,state.size);ownOpen='';renderRows();renderTotals();save();toast('Your service is added to '+st+'.');});\n"
    "$('custom-form').onsubmit=e=>{")

open(path, 'w', encoding='utf-8').write(html)
print('step 11 applied')
