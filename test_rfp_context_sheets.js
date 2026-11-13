// Workbook context stays available to the answer engine without creating extra
// response questions. These fixtures vary the worksheet names and table shapes.
// No browser, network or customer file is needed: SheetJS supplies the same grids
// to the real readSheet and Finder paths in each case.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const sandbox={window:{},console};vm.createContext(sandbox);
for(const file of ['rfp_readers.js','rfp_finder.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+file,'utf8'),sandbox);
const {RFPReaders:readers,RFPFinder:finder}=sandbox.window;
let count=0;
const check=(value,message)=>{assert.ok(value,message);console.log('PASS '+message);count++;};
async function read(sheets){
  const wb={SheetNames:Object.keys(sheets),Sheets:Object.fromEntries(Object.entries(sheets).map(([name,grid])=>[name,{'!ref':'A1:E100',grid}]))};
  sandbox.window.XLSX={read:()=>wb,utils:{decode_range:()=>({s:{r:0,c:0}}),sheet_to_json:ws=>ws.grid}};
  return readers.readSheet({name:'procurement.xlsx',arrayBuffer:async()=>new ArrayBuffer(0)});
}
const requirements=[['Reference','Section','Requirement','Word limit','Vendor response'],
  ['R1','Delivery','Describe how you would migrate the public website.',200,''],
  ['R2','Measurement','Explain how you would reconcile the event totals.',200,'']];
const background=[['Procurement background'],['Document','Supplier response pack'],['Reference','PROC-42'],
  ['Scope','The public website and agreed reporting data.'],
  ['Commercial boundary','Workfront and Adobe Analytics are excluded from the base proposal.'],
  ['Integrations','Do not assume a native integration is sufficient. Describe the proposed connection methods and identify client dependencies.'],
  ['Response instructions','Each response has a limit of 200 words. Explain assumptions separately and identify the evidence needed for acceptance.']];
(async()=>{
  let imported=await read({Requirements:requirements,Responses:background}),found=finder.read(imported.parts);
  check(found.questions.length===2&&found.questions.map(q=>q.label).join(',')==='R1,R2','descriptive metadata does not add response questions');
  check(imported.parts.some(p=>p.contextOnly)&&found.paragraphs.some(t=>t.includes('Workfront and Adobe Analytics are excluded')),'constraints remain in full document context');
  check(found.paragraphs.some(t=>t.includes('Describe the proposed connection methods')),'request wording inside metadata is retained as context');
  check(Object.keys(imported.workbook.sheets).join(',')==='Requirements','write-back targets only the response table');
  imported=await read({FrontMatter:background,Requirements:requirements});found=finder.read(imported.parts);
  check(found.questions.length===2&&found.questions[0].section==='Delivery','context before the table preserves question order and sections');
  imported=await read({Setup:[['Client','Example Company'],['Project','Public experience renewal'],['Scope','AEM Sites, existing CRM and approved reporting.'],['Planning assumptions','The cost basis is recorded separately.']]});
  check(imported.parts[0].contextOnly&&finder.read(imported.parts).questions.length===0,'metadata key/value sheets work without a special heading or worksheet name');
  imported=await read({Background:[['Describe your delivery approach.','Our delivery approach is supplied here.'],['Explain how migration works.','Our migration approach is supplied here.'],['What support do you provide?','Our support arrangements are supplied here.']]});
  check(!imported.parts[0].contextOnly&&finder.read(imported.parts).questions.length===3,'headerless question/answer sheets remain questions even when named Background');
  imported=await read({Setup:[['Project background'],['Security','Please describe how you protect personal information.'],['Integration','Explain your integration approach.'],['Support','How will support requests be handled?']]});
  found=finder.read(imported.parts);
  const baseline=finder.read([{text:imported.parts[0].text}]);
  check(!imported.parts.some(p=>p.contextOnly)&&JSON.stringify(found)===JSON.stringify(baseline)&&found.questions.length+found.skipped.length===3,'topic labels beside direct questions retain ordinary question discovery and visible skipped items under a background title');
  imported=await read({Notes:[['R1','The solution shall support keyboard navigation.'],['R2','The solution must provide an audit history.'],['R3','The service should document recovery steps.']]});found=finder.read(imported.parts);
  check(found.questions.length===3&&found.questions.every(q=>q.label),'coded headerless requirements remain response rows');
  imported=await read({Overview:[['Project overview'],['Accessibility','The solution shall support keyboard navigation.'],['Audit','The system must retain an audit history.'],['Recovery','The service should document recovery steps.']]});
  check(!imported.parts.some(p=>p.contextOnly),'formal requirements in description cells are not reclassified as metadata');
  imported=await read({Background:[['Background'],['Question','Response'],['Describe your hosting approach.',''],['Explain your support model.','']]});found=finder.read(imported.parts);
  check(found.questions.length===2&&!imported.parts.some(p=>p.contextOnly),'recognized response headers take precedence over a context-like title');
  imported=await read({Background:[['Describe your deployment approach.'],['Explain how you test releases.'],['What support do you provide?']]});
  check(!imported.parts[0].contextOnly&&finder.read(imported.parts).questions.length===3,'single-column question sheets remain supported');
  imported=await read({Notes:[['Navigation','Customers can browse information by subject.'],['Search','Visitors can find pages using search.'],['Reports','Analysts can inspect weekly performance.']]});
  check(!imported.parts[0].contextOnly,'unmarked descriptive tables are not silently treated as background');
  console.log('ALL CONTEXT SHEET CHECKS PASSED ('+count+')');
})().catch(e=>{console.error(e);process.exitCode=1;});
