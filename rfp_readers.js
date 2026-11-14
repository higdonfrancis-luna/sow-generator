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
function table(grid,at,sectionRow){
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
  let section='';
  for(let r=h+1;r<grid.length;r++){
    const row=grid[r];if(!row.some(c=>clean(c)))continue;
    if(headerCols(row))continue;                                       // the header again (a second block of the same table)
    const cells=row.map(clean).filter(Boolean);
    if(cells.length===1&&sectionRow&&sectionRow(r)){
      section=cells[0];continue;
    }
    const text=get(row,'text');if(!text)continue;
    rows.push(Object.assign({label:get(row,'id'),text,section:get(row,'section')||section,priority:get(row,'priority'),comply:get(row,'comply'),limit:get(row,'limit')},at?at(r):{}));
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
const CONTEXT_HEADING=/^(?:(?:procurement |project |company )?(?:background|overview)|(?:products? (?:in scope|proposed)|proposed products?)|(?:delivery |project )?milestones?|(?:proposal |procurement )?constraints?(?: and [a-z ]+)?|(?:submission |response |bidder )?instructions?)\s*:?$/i;
function contextSheet(grid){
  const rows=grid.map(r=>(r||[]).map(clean).filter(Boolean)).filter(r=>r.length);
  if(rows.length&&rows.every(r=>r.length===1)){
    // A sheet can contain only instructions. Require explicit context headings
    // and leave single-column schedules containing requirement sections to the finder.
    return rows.some(([text])=>CONTEXT_HEADING.test(text))&&
      !rows.some(([text])=>/^(?:[A-Z]\s+[A-Z]|Section\s+\w|[A-Z]\.\d+\s|\d+[.)]\s|(?:questions|requirements)\s*$)/i.test(text));
  }
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
    const mergedHeaders=new Set((ws['!merges']||[]).filter(m=>m.s.r===m.e.r&&m.e.c>m.s.c).map(m=>m.s.r));
    const t=table(grid,r=>({sheet:name,row:start.r+r}),r=>mergedHeaders.has(start.r+r));
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
// Mammoth's HTML separates a continuous Word list at each intervening heading,
// and drops the list instance, numbering format and restart value. Recover these
// from Word's list definitions when the document actually contains ordered items.
async function wordListLabels(bytes){
  const X=await loadXLSX(), zip=X.CFB.read(new Uint8Array(bytes),{type:'array'});
  const xml=path=>{
    const entry=X.CFB.find(zip,path);
    return entry?new DOMParser().parseFromString(new TextDecoder().decode(entry.content),'application/xml'):null;
  };
  const numbering=xml('/word/numbering.xml'), document=xml('/word/document.xml');
  if(!numbering||!document)return new Map();
  const w=numbering.documentElement.namespaceURI;
  const child=(el,name)=>Array.from(el?.children||[]).find(node=>node.localName===name);
  const value=(el,prop)=>child(el,prop)?.getAttributeNS(w,'val');
  const items=(el,name)=>Array.from(el.getElementsByTagNameNS(w,name));
  const definitions=new Map(items(numbering,'abstractNum').map(n=>[n.getAttributeNS(w,'abstractNumId'),n]));
  const instances=new Map(items(numbering,'num').map(n=>[n.getAttributeNS(w,'numId'),n]));
  const styles=new Map(), counters=new Map(), labels=new Map();
  for(const [id,n] of instances){
    const def=definitions.get(value(n,'abstractNumId'));
    for(const lvl of def?items(def,'lvl'):[]){
      const style=value(lvl,'pStyle');
      if(style&&!styles.has(style))styles.set(style,{id,level:Number(lvl.getAttributeNS(w,'ilvl'))});
    }
  }
  const format=(n,type)=>{
    if(/^(?:upper|lower)Letter$/.test(type)){
      let s='';for(let i=n;i>0;i=Math.floor((i-1)/26))s=String.fromCharCode(65+(i-1)%26)+s;
      return type==='lowerLetter'?s.toLowerCase():s;
    }
    if(/^(?:upper|lower)Roman$/.test(type)){
      let s='';for(const [count,mark] of [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]){
        while(n>=count){s+=mark;n-=count;}
      }
      return type==='lowerRoman'?s.toLowerCase():s;
    }
    return String(n);
  };
  for(const p of items(document,'p')){
    const props=child(p,'pPr'),num=child(props,'numPr'),styled=styles.get(value(props,'pStyle'));
    const id=value(num,'numId')||styled?.id, level=Number(value(num,'ilvl')??styled?.level??0);
    const instance=instances.get(id), def=instance&&definitions.get(value(instance,'abstractNumId'));
    if(!def)continue;
    const levels=items(def,'lvl'), lookup=n=>levels.find(l=>Number(l.getAttributeNS(w,'ilvl'))===n);
    const overrides=items(instance,'lvlOverride'), override=n=>overrides.find(l=>Number(l.getAttributeNS(w,'ilvl'))===n);
    const setting=(n,k)=>value(child(override(n),'lvl'),k)??value(lookup(n),k);
    const count=counters.get(id)||[], start=n=>Number(value(override(n),'startOverride')??setting(n,'start')??1);
    count[level]=(count[level]??(start(level)-1))+1;
    count.length=level+1;counters.set(id,count);
    if(setting(level,'numFmt')==='bullet')continue;
    const pattern=setting(level,'lvlText')||'%'+(level+1)+'.';
    const label=pattern.replace(/%([1-9])/g,(_,digit)=>format(count[digit-1]??start(digit-1),setting(digit-1,'numFmt')));
    const text=clean(items(p,'t').map(t=>t.textContent).join(''));
    if(!labels.has(text))labels.set(text,[]);
    labels.get(text).push(label);
  }
  return labels;
}
async function readDocx(file){
  await loadScript('mammoth.browser.min.js',()=>window.mammoth);
  const bytes=await file.arrayBuffer(),r=await window.mammoth.convertToHtml({arrayBuffer:bytes});
  const root=new DOMParser().parseFromString('<div id="rfp-docx">'+r.value+'</div>','text/html').getElementById('rfp-docx');
  const labels=root.querySelector('ol')?await wordListLabels(bytes):new Map();
  const parts=[];let buf=[],noun='',section='',contextOnly=false;
  const flush=()=>{if(buf.length)parts.push({text:buf.join('\n\n'),contextOnly});buf=[];};
  const own=el=>{const c=el.cloneNode(true);for(const n of c.querySelectorAll('ul,ol,table'))n.remove();return clean(c.textContent);};
  for(const el of root.children){
    if(/^H[1-6]$/.test(el.tagName)){
      flush();section=clean(el.textContent);contextOnly=CONTEXT_HEADING.test(section);buf.push(section);
    }
    else if(el.tagName==='TABLE'){
      const grid=[...el.querySelectorAll('tr')].map(tr=>[...tr.children].map(td=>clean(td.textContent)));
      const t=table(grid);
      if(t){buf.push(...t.before);flush();parts.push({rows:t.rows.map(row=>({...row,section:row.section||section}))});if(t.noun)noun=t.noun;}
      else buf.push(...grid.map(row=>row.filter(Boolean).join(' ')).filter(Boolean));
    }
    else if(/^(UL|OL)$/.test(el.tagName)){
      for(const li of el.querySelectorAll('li')){
        const text=own(li);if(!text)continue;
        const label=li.parentElement.tagName==='OL'&&labels.get(text)?.shift();
        if(label&&!contextOnly){flush();parts.push({rows:[{label,text,section}]});}
        else buf.push('\u2022 '+text);
      }
    }
    else{const t=clean(el.textContent);if(t)buf.push(t);}
  }
  flush();return {parts,noun};
}

/* ---------- PDF */
function pdfLines(items){
  const lines=[];
  for(const it of [...items].sort((a,b)=>b.y-a.y||a.x-b.x)){
    let line=lines[lines.length-1];
    if(!line||Math.abs(it.y-line.y)>Math.max(2,it.h*0.4)){
      line={y:it.y,items:[]};
      lines.push(line);
    }
    line.items.push(it);
  }
  for(const line of lines){
    line.items.sort((a,b)=>a.x-b.x);
    line.text=pdfText(line.items);
    line.h=Math.max(...line.items.map(it=>it.h));
  }
  return lines;
}
// A gap between cells or words is a space. Adjacent letter glyphs stay in the same word.
function pdfText(items){
  let text='',end=null;
  for(const it of items){
    if(end!==null&&it.x-end>it.h*0.25&&!/\s$/.test(text)&&!/^\s/.test(it.s))text+=' ';
    text+=it.s;
    end=it.x+it.w;
  }
  return clean(text);
}
// Count edge lines on physical pages before splitting columns. Comparing position and
// whole lines avoids dropping a repeated instruction or similar question in the body.
function removeRunningLines(pages){
  const counts=new Map();
  function edgeKey(line,p){
    if((line.y>p.height*0.88||line.y<p.height*0.12)&&!pdfTableColumns(line)){
      const normalized=line.text.toLowerCase().replace(/\bpage\s+\d+|\b\d+\s*(\/|of)\s*\d+\b|^\d+$/g,'#');
      return Math.round(line.y/p.height*60)+'|'+normalized;
    }
    return '';
  }
  for(const page of pages){
    const keys=new Set(page.lines.map(line=>edgeKey(line,page)).filter(Boolean));
    for(const key of keys)counts.set(key,(counts.get(key)||0)+1);
  }
  const needed=Math.max(2,Math.ceil(pages.length/2));
  for(const p of pages)p.lines=p.lines.filter(line=>(counts.get(edgeKey(line,p))||0)<needed);
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
  // Multiple full-width body lines make this a single reading stream, even if short
  // cells at the side leave a large patch of white space.
  if(wide.filter(it=>it.w>=width*0.5).length>1)return [its];
  const ys=a=>new Set(a.map(it=>Math.round(it.y))),L=ys(left),R=ys(right),shared=[...R].filter(y=>L.has(y)).length;
  if(L.size<3||R.size<3||shared<2)return [its];
  return [wide,left,right].filter(a=>a.length);
}

// A header identifies an actual response table. Only the requirement and its own tag
// belong to a row; a prefilled response or a priority column is never a prose column.
function pdfTableColumns(line){
  const cols=headerCols(line.items.map(it=>it.s));
  if(!cols||cols.id===undefined)return null;
  const x=line.items[cols.text].x;
  return {text:x,priority:cols.priority===undefined?null:line.items[cols.priority].x,
    next:line.items.filter(it=>it.x>x).map(it=>it.x)[0]??Infinity};
}
function pageParagraphs(page,state){
  const first=page.lines[0];
  if(first&&state.table){
    const ref=pdfText(first.items.filter(it=>it.x<state.table.text-3));
    if(ref&&!ID.test(ref))state.table=null;
  }
  const tablePage=page.lines.some(pdfTableColumns)||!!state.table;
  const items=page.lines.flatMap(line=>line.items);
  const groups=tablePage?[items]:columns(items,page.width);
  const blocks=[];
  for(const group of groups){
    let prior=null,table=state.table,block=null;
    for(const line of pdfLines(group)){
      const headers=pdfTableColumns(line);
      if(headers){table=headers;prior=null;continue;}
      let text=line.text,priority='';
      if(table){
        const body=line.items.filter(it=>it.x>=table.text-3&&it.x<table.next-3);
        const ref=pdfText(line.items.filter(it=>it.x<table.text-3));
        const tag=table.priority===null?'':pdfText(line.items.filter(it=>Math.abs(it.x-table.priority)<4));
        if(PRIO.test(tag))priority=tag;
        if(ID.test(ref)&&body.length)text=ref+' '+pdfText(body);
        else if(!ref&&body.length)text=pdfText(body);
        else if(!ref&&priority){
          if(block)block.priority=priority;
          continue;
        }else table=null;
      }
      const labelled=window.RFPFinder.labelOf(text);
      const gap=prior?prior.y-line.y:Infinity;
      if(!block||labelled||gap>1.65*Math.max(prior?.h||0,line.h)||Math.abs((prior?.h||line.h)-line.h)>1.5){
        block={text,h:line.h};
        blocks.push(block);
      }else block.text+=' '+text;
      if(priority)block.priority=priority;
      prior=line;
    }
    state.table=table;
  }
  return blocks;
}
function pdfParts(pages){
  const parts=[],state={table:null};
  let open=null,front=[],started=false;
  const finder=window.RFPFinder;
  const sectionHeading=text=>/^[A-Z]\.?\s+[A-Z]/.test(text)||/^(?:section|lot|part|appendix)\s+\w+\b/i.test(text);
  const groups=pages.map(page=>pageParagraphs(page,state));
  const structured=groups.some(blocks=>blocks.some(b=>sectionHeading(b.text)||finder.labelOf(b.text)));
  function flushFront(){
    if(!front.length)return;
    const text=front.join('\n\n');
    const contextOnly=/\b(?:procurement context|existing estate|products in scope|constraints|submission instructions|scope of work)\b/i.test(text);
    parts.push({text,nativeLabels:true,...(contextOnly?{contextOnly:true}:{})});
    front=[];
  }
  function emit(text){
    const part=parts[parts.length-1];
    if(part&&!part.contextOnly)part.text+='\n\n'+text;
    else parts.push({text,nativeLabels:true});
  }
  function finishRow(){
    if(!open)return;
    emit(open.text+(open.priority?' ('+open.priority+')':''));
    open=null;
  }
  for(const blocks of groups){
    for(let i=0;i<blocks.length;i++){
      const b=blocks[i], next=blocks[i+1];
      const section=sectionHeading(b.text);
      const label=finder.labelOf(b.text);
      // A numbered chapter heading can look like the next item. Use its larger
      // type and title wording, while keeping numbered requests and statements.
      const numberedHeading=label&&next&&b.h>1.1*next.h&&b.text.length<=90
        &&!/[.?!]$/.test(b.text)&&!finder.isRequest(label.rest)&&!finder.isRequirement(label.rest);
      const title=!section&&next&&(numberedHeading||b.h>1.25*next.h)&&!/[?!]$/.test(b.text)&&!finder.isRequest(b.text);
      // In a form without codes or section headings, the first independent ask ends
      // the instructions even when it shares a page with them.
      const firstAsk=!structured&&finder.ASKS.test(b.text)&&!finder.INSTRUCTION.test(b.text);
      if(!started&&(section||label||firstAsk)&&!title){flushFront();started=true;}
      if(!started){front.push(b.text);continue;}
      if(open&&!section&&!title&&!label){
        open.text+=' '+b.text;
        if(b.priority)open.priority=b.priority;
        continue;
      }
      finishRow();
      if(title){
        const context=[b.text];
        if(numberedHeading){
          while(i+1<blocks.length&&!sectionHeading(blocks[i+1].text)&&!finder.labelOf(blocks[i+1].text)
            &&!finder.ASKS.test(blocks[i+1].text))context.push(blocks[++i].text);
        }
        parts.push({text:context.join('\n\n'),contextOnly:true});
        continue;
      }
      if(label)open={text:b.text,priority:b.priority};
      else emit(b.text);
    }
  }
  finishRow();
  flushFront();
  return parts;
}
async function readPdf(file){
  const pdfjs=await import('./'+LIB+'pdf.min.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc='./'+LIB+'pdf.worker.min.mjs';
  const doc=await pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false,disableFontFace:true}).promise;
  const pages=[];
  try{
    for(let i=1;i<=doc.numPages;i++){
      const page=await doc.getPage(i),content=await page.getTextContent();
      const viewport=page.getViewport({scale:1});
      // The viewport puts rotated and cropped pages into their displayed orientation.
      const items=content.items.filter(it=>it.str?.trim()).map(it=>{
        const transform=pdfjs.Util.transform(viewport.transform,it.transform);
        return {s:it.str,x:transform[4],y:viewport.height-transform[5],w:it.width||0,h:Math.hypot(transform[2],transform[3])||it.height||10};
      });
      pages.push({width:viewport.width,height:viewport.height,lines:pdfLines(items)});
    }
    if(!pages.some(p=>p.lines.length))return {parts:[{text:''}],noText:true};
    removeRunningLines(pages);
    return {parts:pdfParts(pages)};
  }finally{await doc.destroy();}
}
window.RFPReaders={readFile,readPdf,readSheet,readDocx,rowsFromDelimitedText,table,parseCsv,loadXLSX,LIB};
})();
