/* RFP Builder: the file readers (PDF with pdf.js, Word with mammoth, spreadsheets and CSV with SheetJS), all in the
   browser from lib/. Step 49, part one; split out of patch_step49.py on Nov 10 2026. readFile returns the RFP's text, or
   {rows: [...]} when a reader keeps the rows of a table (step 51). Exposes window.RFPReaders. */
(function(){
const LIB='lib/';
async function readFile(file){
  const name=file.name.toLowerCase();
  if(name.endsWith('.pdf')||file.type==='application/pdf')return readPdf(file);
  if(name.endsWith('.docx'))return readDocx(file);
  if(/\.(xlsx|xlsm|xls|csv)$/.test(name))return readSheet(file);
  if(name.endsWith('.doc'))throw Error('Save the Word file as .docx first; the old .doc format cannot be read in the browser.');
  return file.text();
}
async function readPdf(file){
  const pdfjs=await import('./'+LIB+'pdf.min.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc='./'+LIB+'pdf.worker.min.mjs';
  const doc=await pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false,disableFontFace:true}).promise;
  let text='';
  for(let i=1;i<=doc.numPages;i++){
    const page=await doc.getPage(i),content=await page.getTextContent();
    let lastY=null,line='';
    for(const it of content.items){
      if(!('str' in it))continue;
      const y=Math.round(it.transform[5]);
      if(lastY!==null&&Math.abs(y-lastY)>2){text+=line.trim()+'\n';line='';}
      line+=it.str+(it.hasEOL?'\n':' ');lastY=y;
    }
    text+=line.trim()+'\n\n';
  }
  return text;
}
function readSheet(file){
  // every sheet, row by row: the cells of a row joined with spaces, so a '#' column and a question column read as one numbered line
  return new Promise((resolve,reject)=>{
    const go=async()=>{try{
      const wb=window.XLSX.read(new Uint8Array(await file.arrayBuffer()),{type:'array',cellDates:false});
      const lines=[];
      for(const name of wb.SheetNames){
        const rows=window.XLSX.utils.sheet_to_json(wb.Sheets[name],{header:1,raw:false,defval:''});
        for(const row of rows){
          const cells=row.map(c=>String(c==null?'':c).trim()).filter(Boolean);
          // a numbering-only cell ('2.1', 'Q3', 'A.2') joins the cell after it; every other cell is its own line, so a Section column stays a heading
          for(let i=0;i<cells.length;i++){
            if(/^\(?[A-Za-z]?\d{0,3}(\.\d+)*[.)]?$/.test(cells[i])&&cells[i].length<=8&&i+1<cells.length){lines.push(cells[i].replace(/[.)]$/,'')+' '+cells[i+1]);i++;}
            else lines.push(cells[i]);
          }
        }
        lines.push('');
      }
      resolve(lines.join('\n'));
    }catch(e){reject(e);}};
    if(window.XLSX)return go();
    const sc=document.createElement('script');sc.src=LIB+'xlsx.mini.min.js';sc.onload=go;sc.onerror=()=>reject(Error('The spreadsheet reader did not load.'));document.head.appendChild(sc);
  });
}
function readDocx(file){
  return new Promise((resolve,reject)=>{
    const run=()=>window.mammoth.extractRawText({arrayBuffer:null}).catch(()=>{}),go=async()=>{try{const r=await window.mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()});resolve(r.value);}catch(e){reject(e);}};
    if(window.mammoth)return go();
    const s=document.createElement('script');s.src=LIB+'mammoth.browser.min.js';s.onload=go;s.onerror=()=>reject(Error('The Word reader did not load.'));document.head.appendChild(s);
  });
}
// A pasted table (tab-separated or comma-separated with a header row) can be read as rows too (step 51). null means: plain text.
function rowsFromDelimitedText(text){return null;}
window.RFPReaders={readFile,readPdf,readSheet,readDocx,rowsFromDelimitedText,LIB};
})();
