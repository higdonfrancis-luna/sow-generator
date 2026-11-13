/* RFP Builder: the file readers (PDF with pdf.js, Word with mammoth, spreadsheets and CSV with SheetJS), all in the
   browser from lib/. Step 49, part one; split out of patch_step49.py on Nov 10 2026.

   Step 51 (Nov 10 2026, Adam approved the first batch): tables are read as rows. A spreadsheet, a CSV, a pasted table
   or a Word table is read by its header row (ID, Section or Category, Requirement or Question, Priority, Comply,
   Response), or by its longest text column when it has none, and every row with text becomes one item with the client's
   ID, section and priority; a cell's line breaks are collapsed. PDFs: running headers and footers that repeat on most
   pages are dropped, pages join so a question that runs onto the next page stays whole, two-column pages are read
   column by column, letters are joined by their positions (so a letter-spaced header is not garbled), and a PDF with no
   text layer says it looks like a scan. Descriptive key/value worksheets return contextOnly text parts: their scope and
   constraints stay available without adding response questions. readFile returns {parts: [{text, contextOnly?} | {rows}], noun, workbook, noText}.
   Exposes window.RFPReaders. */
(function(){
const LIB='lib/';
const clean=s=>String(s==null?'':s).replace(/\s+/g,' ').trim();
function loadScript(file,ready){return new Promise((ok,fail)=>{if(ready())return ok(ready());const sc=document.createElement('script');sc.src=LIB+file;sc.onload=()=>ok(ready());sc.onerror=()=>fail(Error('The reader for this file did not load.'));document.head.appendChild(sc);});}
async function readFile(file){
  const name=file.name.toLowerCase();
  if(name.endsWith('.pdf')||file.type==='application/pdf')return readPdf(file);
  if(name.endsWith('.docx'))return readDocx(file);
  if(name.endsWith('.xls'))throw Error('This is the older .xls format, which the browser cannot open. Open it in Excel, save it as .xlsx, and drop it again.');
  if(/\.(xlsx|xlsm|csv)$/.test(name))return readSheet(file);
  if(name.endsWith('.doc'))throw Error('Save the Word file as .docx first; the old .doc format cannot be read in the browser.');
  const text=await file.text();
  return rowsFromDelimitedText(text)||{parts:[{text}]};
}

/* ---------- tables: one header-detection rule for spreadsheets, CSV, pasted tables and Word tables */
const COL={
  id:/^(?:(?:req(?:uirement)?|question|item|ref(?:erence)?|line)\.?\s*(?:id|#|no\.?|num(?:ber)?|ref)|id|#|no\.?|num(?:ber)?|ref(?:erence)?|s\/?n|q\s*#)$/i,
  section:/^(?:section|category|area|group|domain|topic|module|capability(?: area)?|lot|theme|workstream|functional area|sub-?section)$/i,
  text:/^(?:requirements?(?: (?:description|text|statement|details?))?|questions?(?: text)?|description|criteria|criterion|specification|statement|request|ask)$/i,
  priority:/^(?:priority|mandatory ?\/ ?desirable|m ?\/ ?d|must ?\/ ?should|importance|criticality|mandatory|required|weight(?:ing)?|m ?\/ ?o)$/i,
  comply:/^(?:(?:vendor |supplier |bidder )?(?:comply|compliance|complies|compliant)|meets? requirement|y ?\/ ?n(?: ?\/ ?p)?)$/i,
  response:/^(?:(?:vendor|supplier|bidder|respondent|proposer|partner|your)\s+)?(?:response|answer|comments?|reply|narrative|explanation|remarks?)$/i,
  limit:/^(?:(?:max(?:imum)?\.? )?word (?:limit|count|maximum|max)|max(?:imum)?\.? (?:words|word count|length)|words? (?:limit|max(?:imum)?)|(?:response|answer) (?:length|limit|word limit))$/i};   // step 89: a response form's Word limit column
const headerName=c=>clean(c).replace(/\s*\([^)]*\)\s*$/,'').replace(/[:*]+$/,'').trim();
function headerCols(row){
  const cols={};row.forEach((c,i)=>{const h=headerName(c);if(!h)return;for(const [k,re] of Object.entries(COL))if(cols[k]===undefined&&re.test(h)){cols[k]=i;break;}});
  return cols.text!==undefined&&Object.keys(cols).length>=2?cols:null;
}
const ID=/^(?:[A-Z]{1,6}[-.]?)?\d{1,4}(?:\.\d{1,3})*[a-z]?\.?$/i,PRIO=/^(?:m|d|mandatory|desirable|required|optional|must|should|must[- ]have|nice[- ]to[- ]have|essential|preferred)$/i;
// grid: rows of cell strings; at: (rowIndex) => {sheet,row} for write-back. Returns {before, rows, noun, cols, headerRow} or null.
function table(grid,at){
  grid=grid.map(r=>(r||[]).map(c=>String(c==null?'':c)));
  const width=Math.max(0,...grid.map(r=>r.length));if(width<2)return null;
  let h=-1,cols=null;
  for(let r=0;r<Math.min(grid.length,30)&&!cols;r++){cols=headerCols(grid[r]);if(cols)h=r;}
  if(!cols){   // no header row: the longest text column, with an ID or priority column beside it
    const len=Array.from({length:width},(_,c)=>grid.reduce((n,r)=>n+clean(r[c]).length,0));
    const t=len.indexOf(Math.max(...len));const data=grid.filter(r=>clean(r[t]).length>=15);
    if(!data.length)return null;
    const fits=(c,re)=>c!==t&&data.every(r=>!clean(r[c])||re.test(clean(r[c])))&&data.some(r=>clean(r[c]));
    const id=[...Array(width).keys()].find(c=>c<t&&fits(c,ID)),pr=[...Array(width).keys()].find(c=>fits(c,PRIO));
    if(id===undefined&&pr===undefined)return null;
    cols={text:t};if(id!==undefined)cols.id=id;if(pr!==undefined)cols.priority=pr;
    const sec=[...Array(width).keys()].find(c=>c!==t&&c!==id&&c!==pr&&data.some(r=>clean(r[c]))&&data.every(r=>clean(r[c]).length<=40&&!ID.test(clean(r[c]))&&!PRIO.test(clean(r[c]))));
    if(sec!==undefined)cols.section=sec;
  }
  const before=h>0?grid.slice(0,h).map(r=>r.map(clean).filter(Boolean).join(' ')).filter(Boolean):[];
  const rows=[],get=(r,k)=>cols[k]===undefined?'':clean(r[cols[k]]);
  for(let r=h+1;r<grid.length;r++){
    const row=grid[r];if(!row.some(c=>clean(c)))continue;
    if(headerCols(row))continue;                                       // the header again (a second block of the same table)
    const text=get(row,'text');if(!text)continue;
    rows.push(Object.assign({label:get(row,'id'),text,section:get(row,'section'),priority:get(row,'priority'),comply:get(row,'comply'),limit:get(row,'limit')},at?at(r):{}));
  }
  const textHead=h>=0?headerName(grid[h][cols.text]):'';
  return rows.length?{before,rows,cols,headerRow:h,headers:h>=0?grid[h].map(clean):[],noun:/requirement/i.test(textHead)?'requirements':''}:null;
}
// A pasted table: tab-separated lines, or comma-separated with a recognised header row. null means plain text.
function rowsFromDelimitedText(text){
  const lines=String(text||'').replace(/\r/g,'').split('\n');
  const tabbed=lines.filter(l=>l.includes('\t')).length;
  let grid=null;
  if(tabbed>=2)grid=lines.map(l=>l.split('\t'));
  else if(lines.length>=2&&headerCols(splitCsv(lines[0])))grid=parseCsv(text);
  if(!grid)return null;
  const t=table(grid);if(!t)return null;
  return {parts:[...(t.before.length?[{text:t.before.join('\n\n')}]:[]),{rows:t.rows}],noun:t.noun};
}
const splitCsv=l=>parseCsv(l)[0]||[];
function parseCsv(text){const out=[];let row=[],cell='',q=false;
  for(let i=0;i<text.length;i++){const c=text[i];
    if(q){if(c==='"'&&text[i+1]==='"'){cell+='"';i++;}else if(c==='"')q=false;else cell+=c;}
    else if(c==='"')q=true;else if(c===','){row.push(cell);cell='';}else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);out.push(row);row=[];cell='';}else cell+=c;}
  if(cell||row.length){row.push(cell);out.push(row);}return out;}

/* ---------- spreadsheets and CSV files */
const loadXLSX=()=>loadScript('xlsx.mini.min.js',()=>window.XLSX);
// A workbook often keeps project background in a two-column label/value sheet. Keep
// that text as document context, without treating instructions inside it as response
// rows. The shape and its labels establish this role; the worksheet name does not.
const CONTEXT_TITLE=/\b(?:background|context|project overview|procurement overview|response instructions)\b/i;
const CONTEXT_KEY=/^(?:document(?: title| reference)?|reference|client(?: name)?|company(?: name)?|organi[sz]ation(?: name)?|project(?: name| title| overview)?|background|overview|purpose|scope(?: boundary)?|current (?:environment|estate|systems?)|planning (?:volumes|assumptions)|proposal constraints|response instructions)$/i;
const REQUEST_LABEL=/\?|\b(?:shall|must|should)\b|^(?:describe|explain|provide|outline|propose|demonstrate|detail|state|list|confirm|set out|how|what|which|when|where|can you|do you|does your|will you)\b/i;
const REQUEST_VALUE=/^(?:please\s+)?(?:describe|explain|provide|outline|propose|demonstrate|detail|state|list|confirm|set out|how|what|which|when|where)\b|\?\s*$/i;
const REQUIREMENT_VALUE=/^(?:(?:the|our|your|proposed)\s+)?(?:solution|system|platform|service|supplier|vendor|bidder)\s+(?:must|shall|should|will|is required to)\b/i;
function contextSheet(grid){
  const rows=grid.map(r=>(r||[]).map(clean).filter(Boolean)).filter(r=>r.length);
  if(rows.some(r=>r.length>2))return false;
  const pairs=rows.filter(r=>r.length===2);if(pairs.length<3)return false;
  // A short question or a coded requirement remains a response item, even when its
  // answer is much longer than its label and the sheet also has a context heading.
  if(pairs.some(([key,value])=>ID.test(key)||REQUEST_LABEL.test(key)||REQUEST_VALUE.test(value)||REQUIREMENT_VALUE.test(value)))return false;
  if(pairs.some(([key])=>key.length>85||key.split(/\s+/).length>12||/[.!]$/.test(key)))return false;
  return rows.some(r=>r.length===1&&r[0].length<=180&&CONTEXT_TITLE.test(r[0]))||pairs.filter(([key])=>CONTEXT_KEY.test(key)).length>=2;
}
async function readSheet(file){
  const X=await loadXLSX();
  const bytes=new Uint8Array(await file.arrayBuffer());   // kept so the answers can go back into the file as the client made it (step 67)
  let wb;try{wb=X.read(bytes,{type:'array',cellDates:false});}
  catch(e){throw Error('The spreadsheet could not be opened. Save it as .xlsx and drop it again.');}
  const parts=[],workbook={name:file.name,type:/\.csv$/i.test(file.name)?'csv':'xlsx',wb,bytes,sheets:{}};let noun='';
  for(const name of wb.SheetNames){
    const ws=wb.Sheets[name];if(!ws||!ws['!ref'])continue;
    const start=X.utils.decode_range(ws['!ref']).s;
    const grid=X.utils.sheet_to_json(ws,{header:1,raw:false,defval:'',blankrows:true});
    const t=table(grid,r=>({sheet:name,row:start.r+r}));
    if(t){   // each spreadsheet row is its own paragraph: rows are never wrapped lines
      if(t.before.length)parts.push({text:t.before.join('\n\n')});
      parts.push({rows:t.rows});if(t.noun)noun=t.noun;
      workbook.sheets[name]={headerRow:start.r+t.headerRow,startCol:start.c,cols:t.cols,headers:t.headers};
    }
    else parts.push({text:grid.map(r=>r.map(clean).filter(Boolean).join(' ')).filter(Boolean).join('\n\n'),...(contextSheet(grid)?{contextOnly:true}:{})});
  }
  return {parts,noun,workbook};
}

/* ---------- Word: paragraphs as text, tables as rows, in the document's order */
async function readDocx(file){
  await loadScript('mammoth.browser.min.js',()=>window.mammoth);
  const r=await window.mammoth.convertToHtml({arrayBuffer:await file.arrayBuffer()});
  const root=new DOMParser().parseFromString('<div id="rfp-docx">'+r.value+'</div>','text/html').getElementById('rfp-docx');
  const parts=[];let buf=[],noun='';
  const flush=()=>{if(buf.length)parts.push({text:buf.join('\n\n')});buf=[];};
  const own=el=>{const c=el.cloneNode(true);for(const n of c.querySelectorAll('ul,ol,table'))n.remove();return clean(c.textContent);};
  for(const el of root.children){
    if(el.tagName==='TABLE'){
      const grid=[...el.querySelectorAll('tr')].map(tr=>[...tr.children].map(td=>clean(td.textContent)));
      const t=table(grid);
      if(t){buf.push(...t.before);flush();parts.push({rows:t.rows});if(t.noun)noun=t.noun;}
      else buf.push(...grid.map(row=>row.filter(Boolean).join(' ')).filter(Boolean));
    }
    else if(/^(UL|OL)$/.test(el.tagName))for(const li of el.querySelectorAll('li')){const t=own(li);if(t)buf.push('\u2022 '+t);}
    else{const t=clean(el.textContent);if(t)buf.push(t);}
  }
  flush();return {parts,noun};
}

/* ---------- PDF */
// one page's text items as lines, column by column when the page has two columns
function pageLines(raw,width){
  const its=raw.filter(it=>'str' in it&&it.str.trim()).map(it=>({s:it.str,x:it.transform[4],y:it.transform[5],w:it.width||0,h:Math.abs(it.transform[3])||it.height||10}));
  const cols=columns(its,width),out=[];
  for(const col of cols)out.push(...linesOf(col));
  return out;
}
function linesOf(its){
  its=its.slice().sort((a,b)=>b.y-a.y||a.x-b.x);
  const lines=[];let cur=null;
  for(const it of its){if(!cur||Math.abs(it.y-cur.y)>Math.max(2,it.h*0.4)){cur={y:it.y,items:[]};lines.push(cur);}cur.items.push(it);}
  return lines.map(l=>{l.items.sort((a,b)=>a.x-b.x);let s='',end=null;
    for(const it of l.items){if(end!==null&&it.x-end>it.h*0.25&&!/\s$/.test(s)&&!/^\s/.test(it.s))s+=' ';s+=it.s;end=it.x+it.w;}   // a space only where there is a gap: letters drawn one by one stay one word
    return clean(s);}).filter(Boolean);
}
// Two columns: a band in the middle of the page that no ordinary line crosses, with several lines on both sides that share
// baselines. Lines wider than half the page (a title across both columns) come first.
function columns(its,width){
  if(its.length<6||!width)return [its];
  const narrow=its.filter(it=>it.w<width*0.5),step=4;let best=null,run=null;
  for(let x=width*0.3;x<width*0.7;x+=step){
    const free=!narrow.some(it=>it.x<x&&it.x+it.w>x);
    if(free){run=run||{a:x,b:x};run.b=x;}else{if(run&&(!best||run.b-run.a>best.b-best.a))best=run;run=null;}
  }
  if(run&&(!best||run.b-run.a>best.b-best.a))best=run;
  if(!best||best.b-best.a<step*2)return [its];
  const mid=(best.a+best.b)/2,left=its.filter(it=>it.x+it.w<=mid),right=its.filter(it=>it.x>=mid),wide=its.filter(it=>it.x<mid&&it.x+it.w>mid);
  const ys=a=>new Set(a.map(it=>Math.round(it.y))),L=ys(left),R=ys(right),shared=[...R].filter(y=>L.has(y)).length;
  if(L.size<3||R.size<3||shared<2)return [its];
  return [wide,left,right].filter(a=>a.length);
}
async function readPdf(file){
  const pdfjs=await import('./'+LIB+'pdf.min.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc='./'+LIB+'pdf.worker.min.mjs';
  const doc=await pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false,disableFontFace:true}).promise;
  const pages=[];
  for(let i=1;i<=doc.numPages;i++){
    const page=await doc.getPage(i),content=await page.getTextContent();
    pages.push(pageLines(content.items,page.getViewport({scale:1}).width));
  }
  if(!pages.some(p=>p.length))return {parts:[{text:''}],noText:true};
  // running headers and footers: the same line (page numbers aside) in the top or bottom three lines of most pages
  if(pages.length>1){
    const key=l=>l.replace(/\d+/g,'#').toLowerCase(),edge=p=>[...new Set([...p.slice(0,3),...p.slice(-3)].map(key))],seen={};
    for(const p of pages)for(const k of edge(p))seen[k]=(seen[k]||0)+1;
    const need=Math.max(2,Math.ceil(pages.length/2));
    for(const p of pages){const n=p.length;for(let j=n-1;j>=0;j--)if((j<3||j>=n-3)&&seen[key(p[j])]>=need)p.splice(j,1);}
  }
  // pages joined by one line break: a question that runs onto the next page stays one paragraph
  return {parts:[{text:pages.map(p=>p.join('\n')).join('\n')}]};
}
window.RFPReaders={readFile,readPdf,readSheet,readDocx,rowsFromDelimitedText,table,parseCsv,loadXLSX,LIB};
})();
