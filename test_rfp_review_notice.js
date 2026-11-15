// Export review notices survive real downloads without altering answer cells or client worksheets.
// Run after python3 sow/build_site.py. All AI routes are blocked; fixtures are local and synthetic.
const fs=require('fs'),os=require('os'),path=require('path');
const {open}=require(__dirname+'/rfp_prototype/review_2026-11-09/harness.js');
let checks=0,fails=0;
const ok=(pass,message,detail='')=>{checks++;console.log((pass?'PASS ':'FAIL ')+message+(pass||!detail?'':' '+JSON.stringify(detail)));if(!pass)fails++;};
const fixture=__dirname+'/qa/rfp_fixtures/bank_rfp.xlsx';
(async()=>{
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'rfp-review-notice-')),h=await open(),p=h.page;
  await p.route('https://warroom-assistant.adam-d1a.workers.dev/rfi/propose',r=>r.abort());
  const save=async(action,name)=>{const [d]=await Promise.all([p.waitForEvent('download'),action()]);const file=path.join(tmp,name);await d.saveAs(file);return file;};
  const wb=file=>h.eval(bytes=>{
    const X=window.XLSX,b=new Uint8Array(bytes),w=X.read(b,{type:'array'}),z=X.CFB.read(b,{type:'array'}),dec=new TextDecoder();
    const part=n=>{const f=X.CFB.find(z,n);return f&&f.content?dec.decode(new Uint8Array(f.content)):'';};
    return {names:w.SheetNames,sheets:Object.fromEntries(w.SheetNames.map(n=>[n,X.utils.sheet_to_json(w.Sheets[n],{header:1,defval:''})])),workbook:part('/xl/workbook.xml'),styles:part('/xl/styles.xml'),other:part('/xl/worksheets/sheet2.xml')};
  },[...fs.readFileSync(file)]);
  const writeback=name=>save(()=>h.eval(()=>RFPAnswers.writeBack()),name);
  try{
    await h.file(fixture);
    const notice=await h.eval(()=>RFPAnswers.reviewNotice);
    // Round 6 carries the checklist's review statements into its Excel download.
    const banner=p.locator('#rfp-summary .rfp-review-notice'),bannerText=await banner.textContent();
    ok(await banner.isVisible()&&notice.every(n=>bannerText.includes(n)),'the complete review notice is visible before download');
    const checklist=await save(async()=>{await p.click('#rfp-download-menu');await p.locator('#rfp-dl-menu button').filter({hasText:'My checklist, in Excel'}).click();},'checklist.xlsx');
    const fresh=await wb(checklist),freshNotice=fresh.sheets['Review before sharing'];
    ok(!!freshNotice&&notice.every(n=>freshNotice.flat().includes(n)),'the checklist workbook contains all three review statements');
    ok(fresh.names[0]==='My checklist'&&fresh.sheets['My checklist'][0].join('|')==='Ref|Question|Type|Item|In the response|Done','the notice is separate from the working checklist and its six columns');
    ok(/activeTab="0"/.test(fresh.workbook)&&/wrapText="1"/.test(fresh.styles),'the workbook opens on its checklist and wraps long text');
    const target=await h.eval(()=>RFPBuilder.state.questions.findIndex(q=>q.kind==='adobe'&&RFPAnswers.hasAnswer(q)));
    await h.setStatus(target,'used');
    const expected=await h.eval(i=>{const q=RFPBuilder.state.questions[i];return {row:q.row,sheet:q.sheet,text:RFPAnswers.usedText(q,true)};},target);
    const answered=await writeback('answered.xlsx'),kept=await wb(answered),original=await wb(fixture);
    ok(notice.every(n=>kept.sheets['Review before sharing'].flat().includes(n))&&kept.sheets['Adobe sources'].length>1,'client writeback contains both its source references and complete notice');
    ok(new RegExp('activeTab="'+kept.names.indexOf('Review before sharing')+'"').test(kept.workbook)&&/wrapText="1"/.test(kept.styles),'the client workbook opens on its readable, wrapping review notice');
    ok(kept.sheets[expected.sheet][expected.row][3]===expected.text&&kept.other===original.other,'client answer is unchanged by the notice and its unrelated worksheet XML is preserved');

    // A pre-existing notice-like sheet must not be overwritten, including a case-only collision.
    const collision=path.join(tmp,'firm.xlsx');
    const bytes=await h.eval(()=>{const X=window.XLSX,w=X.utils.book_new();
      X.utils.book_append_sheet(w,X.utils.aoa_to_sheet([['Reference','Requirement','Vendor response'],['F.1','Provide your company legal name.','']]),'Requirements');
      X.utils.book_append_sheet(w,X.utils.aoa_to_sheet([['Client-owned worksheet'],['Retain this exact text']]),'review before sharing');
      return [...new Uint8Array(X.write(w,{bookType:'xlsx',type:'array'}))];});
    fs.writeFileSync(collision,Buffer.from(bytes));
    const imported=await h.file(collision);ok(imported.count===1,'the synthetic firm-only fixture has one requirement');
    await h.setAnswer(0,'Example Delivery LLC');
    const firmFile=await writeback('firm-answered.xlsx'),firm=await wb(firmFile);
    ok(firm.names.join('|')==='Requirements|review before sharing|Review before sharing 2'&&firm.sheets['review before sharing'][1][0]==='Retain this exact text','case-insensitive worksheet collision gets a new name without replacing client data');
    ok(!firm.names.includes('Adobe sources')&&notice.every(n=>firm.sheets['Review before sharing 2'].flat().includes(n)),'firm-only responses still carry the notice when there are no Adobe citations');
    const reimported=await h.file(firmFile);
    ok(reimported.count===1&&reimported.questions[0].label==='F.1','reimport does not turn review instructions into response questions');

    // Exercise the legacy values-only XLSX route explicitly; it must not accumulate notice sheets in session state.
    await h.file(collision);await h.setAnswer(0,'Example Delivery LLC');
    await h.eval(()=>{RFPBuilder.state.workbooks[0].bytes=null;});
    const fallback=await wb(await writeback('fallback.xlsx'));
    ok(fallback.names.includes('Review before sharing 2')&&fallback.sheets.Requirements[1][2]==='Example Delivery LLC'&&notice.every(n=>fallback.sheets['Review before sharing 2'].flat().includes(n)),'values-only XLSX fallback includes the notice and exact answer');
    ok((await h.eval(()=>RFPBuilder.state.workbooks[0].wb.SheetNames)).length===2,'fallback export does not add a notice sheet to the loaded client workbook');

    const csv=path.join(tmp,'firm.csv');fs.writeFileSync(csv,'Reference,Requirement,Vendor response\r\nF.1,Provide your company legal name.,\r\n');
    await h.file(csv);const answer='Example Delivery LLC, Chicago\nSecond line with "quotes"';await h.setAnswer(0,answer);
    const initialRange=await h.eval(()=>{const w=RFPBuilder.state.workbooks[0].wb;return w.Sheets[w.SheetNames[0]]['!ref'];});
    const one=fs.readFileSync(await writeback('one.csv'),'utf8'),two=fs.readFileSync(await writeback('two.csv'),'utf8');
    const parsed=await h.eval(text=>{const X=window.XLSX,w=X.read(text,{type:'string'});return X.utils.sheet_to_json(w.Sheets[w.SheetNames[0]],{header:1,defval:''});},one);
    ok(one===two&&parsed[0].length===4&&parsed[0][3]==='Review before sharing','repeat CSV downloads contain one extra notice column and do not accumulate columns');
    ok(parsed[1][2]===answer&&notice.every(n=>parsed[1][3].includes(n)),'CSV preserves multiline quoted answers and the complete review notice');
    ok(initialRange===await h.eval(()=>{const w=RFPBuilder.state.workbooks[0].wb;return w.Sheets[w.SheetNames[0]]['!ref'];}),'CSV notice does not change the loaded client worksheet range');
    ok(!h.errors.length,'no browser errors',h.errors);
  }finally{await h.close();fs.rmSync(tmp,{recursive:true,force:true});}
  console.log((checks-fails)+'/'+checks+' review-notice checks passed');if(fails)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
