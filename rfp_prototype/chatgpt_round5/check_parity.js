// Compare the two real browser readers. Run python3 sow/canvas/build.py and python3 sow/build_site.py first.
// Requires the normal Playwright Chromium installation, Python with ReportLab, git and pdftotext.
// Refresh the origin/claude/amazing-volta-go9ton tracking ref before testing against newly published base work.
// node sow/rfp_prototype/chatgpt_round5/check_parity.js [--json /tmp/parity.json]
// PARITY_BASE_WORKTREE can point to an existing detached worktree of origin/claude/amazing-volta-go9ton.
// Set PARITY_CANDIDATE_SITE only to verify a saved build. Defaults to this checkout's sow/site/sow.
const fs = require('fs'), path = require('path'), os = require('os'), http = require('http');
const {execFileSync} = require('child_process');
const {chromium} = require('playwright');
const root = path.resolve(__dirname, '../../..');
const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], {encoding: 'utf8'}).trim();
const ref = 'refs/remotes/origin/claude/amazing-volta-go9ton';
const sitePath = 'sow/site/sow';

function baseSite() {
  const sha = git(root, 'rev-parse', '--verify', ref);
  const dir = path.resolve(process.env.PARITY_BASE_WORKTREE || path.join(os.tmpdir(), 'warroom-parity-' + sha));
  if (dir === root || dir.startsWith(root + path.sep)) throw Error('Use a base worktree outside this repository');
  if (!fs.existsSync(path.join(dir, '.git'))) git(root, 'worktree', 'add', '--detach', dir, sha);
  if (git(dir, 'rev-parse', 'HEAD') !== sha || git(dir, 'rev-parse', '--abbrev-ref', 'HEAD') !== 'HEAD') {
    throw Error('Base worktree is not detached at ' + ref + ' (' + sha + ')');
  }
  const files = git(root, 'ls-tree', '-r', '--name-only', sha, sitePath).split('\n').filter(Boolean);
  const verified = () => files.includes(sitePath + '/index.html') && files.every(f =>
    fs.existsSync(path.join(dir, f)) && git(dir, 'hash-object', f) === git(root, 'rev-parse', sha + ':' + f));
  if (!verified()) {
    for (const script of ['sow/canvas/build.py', 'sow/build_site.py']) execFileSync('python3', [script], {cwd: dir, stdio: 'inherit'});
  }
  if (!verified()) throw Error('The base site and reader libraries do not reproduce ' + sha);
  return {dir: path.join(dir, sitePath), sha};
}

async function openPage(browser, dir) {
  dir = path.resolve(dir);
  const contentTypes = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json'};
  const server = http.createServer((req, res) => {
    const file = path.resolve(dir, '.' + new URL(req.url, 'http://localhost').pathname);
    if (!file.startsWith(dir + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404); res.end(); return;
    }
    res.writeHead(200, {'Content-Type':contentTypes[path.extname(file)] || 'application/octet-stream'});
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  const page = await browser.newPage();
  await page.route('**/*', route => route.request().url().startsWith(origin + '/') ? route.continue() : route.abort());
  try {
    await page.goto(origin + '/index.html#rfp');
    await page.waitForFunction(() => window.RFPBuilder && window.RFPAnswers);
    return {page, close: () => server.close()};
  } catch (error) { server.close(); throw error; }
}

// Read fixture sources as data. Only literal strings passed to write() are extracted;
// no repository generator is executed to discover its embedded RFIs.
function writtenTexts(file) {
  const parser = `import ast, json, sys
tree = ast.parse(open(sys.argv[1], encoding='utf8').read())
print(json.dumps([c.args[0].value for c in ast.walk(tree)
  if isinstance(c, ast.Call) and isinstance(c.func, ast.Attribute) and c.func.attr == 'write'
  and c.args and isinstance(c.args[0], ast.Constant) and isinstance(c.args[0].value,str)]))`;
  return JSON.parse(execFileSync('python3',['-c',parser,file],{encoding:'utf8'}));
}
function reviewMarkdown(file) {
  if (!file || path.extname(file) !== '.md') return null;
  const text = fs.readFileSync(file,'utf8');
  if (!/^# .+ for ChatGPT\b/m.test(text) || !/^## How to work$/m.test(text)) return null;
  const tasks = [...text.matchAll(/^(\d+)\. (\*\*[^\n]+)$/gm)].map(m => ({label:m[1],line:m[2]}));
  return {text,tasks};
}
function companionEvidence(input) {
  if (!input.companion) return {};
  const review = reviewMarkdown(input.file);
  if (review) {
    return {
      capFromElsewhere: (q,n) => {
        const pattern = new RegExp('\\b' + n + '\\s*[- ]?words?\\b','ig');
        // Require every occurrence to be inside a quoted example, and none on
        // this question's own source line. Counts elsewhere in prose are ambiguous.
        const withoutQuotes = review.text.replace(/"[^"\n]*"/g,' ');
        if (!(review.text.match(pattern) || []).length || (withoutQuotes.match(pattern) || []).length) return '';
        const own = review.tasks.find(t => t.label === q.label);
        if ((own?.line || q.text).match(pattern)) return '';
        return 'This budget occurs only inside quoted examples on other QA task lines';
      }
    };
  }
  if (path.extname(input.file) === '.py') {
    const raw = fs.readFileSync(input.file,'utf8'), literals = writtenTexts(input.file);
    return {capFromElsewhere:(q,n) => {
      const pattern = new RegExp('\\b' + n + '\\s*[- ]?words?\\b','ig');
      const withCap = literals.filter(t => t.match(pattern));
      if (!withCap.length || withCap.some(t => hasText(t,q.text))) return '';
      let outside = raw;
      for (const t of withCap) {
        if (!outside.includes(t)) return '';
        outside = outside.replace(t,'');
      }
      if (outside.match(pattern) || !(raw.match(pattern) || []).length) return '';
      return 'Only a separate generated document literal states this budget, not the source code row';
    }};
  }
  return {};
}

const asks = [
  'Describe how you would build our new website on AEM Sites with Edge Delivery Services.',
  'Describe how you would implement Customer Journey Analytics.'
];
function corpus(tmp) {
  const cases = [];
  const folders = ['fixtures','../demo','review_5b','review_5c'];
  for (const folder of folders) {
    const dir = path.resolve(__dirname, folder);
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name), id = folder + '/' + name;
      cases.push({id, file, companion: !/\.(pdf|docx|xlsx|csv|tsv|txt|html)$/i.test(name)});
    }
  }
  const paste = (id, text) => cases.push({id: 'paste/' + id, text});
  for (const input of [...cases].filter(c => c.companion)) {
    if (input.file.endsWith('.py')) {
      writtenTexts(input.file).filter(t => /\b(?:RFI|RFP|Request for (?:Information|Proposal))\b/i.test(t) && /\n/.test(t))
        .forEach((t,i) => paste(input.id + '-literal-' + (i+1), t));
    }
  }
  const form = (line, heading = '') => ['Request for Information', heading, line, ...asks.map((q, i) => (i + 1) + '. ' + q)].filter(Boolean).join('\n');
  const lines = ['Maximum 300 words per question.', 'Proposals should not exceed 400 words per question.',
    'Your response to each question must not exceed 90 words.', 'Respondents must not exceed 140 words per answer.',
    'Each question has a 250-word limit.', 'The response to each item shall not exceed 230 words.',
    'The narrative for each response must be not exceeding 200 words.'];
  lines.forEach((line, i) => {
    paste('wording-' + (i + 1), form(line));
    paste('wording-under-section-' + (i + 1), form(line, 'Section 1 - Website and analytics'));
  });
  paste('respondent-instructions', 'Request for Information: Lakeshore Health Website\n\nSection 1. Instructions to Respondents\nAll responses must not exceed 90 words.\nSubmit your response by email to the procurement office.\n\nSection 2. Website Requirements\n2.1 Describe how you would build our new public website on AEM Sites with Edge Delivery Services.\n2.2 Explain how you would implement Customer Journey Analytics for our website.');
  paste('instructions-background', 'Request for Information\n\nInstructions\nAll responses are due on 15 January.\nDescribe how you would build our site on AEM Sites with Edge Delivery Services.\n\nBackground\nWe run Sitecore today.\nExplain how you would implement Customer Journey Analytics.');
  paste('requirements-context', 'Requirements\nResponses must not exceed 120 words.\nDescribe how you would build our site on AEM Sites with Edge Delivery Services.');
  paste('named-exclusion', 'Request for Information\nA.2 Northfield Water Authority will not license Adobe Target or Adobe Analytics in this program. Describe how you would test two versions of the Pay my bill page and report results within 30 days of launch.\nA.3 We do not use Marketo Engage and will not license it. Explain how site forms would reach our Salesforce CRM.');
  for (const [i,line] of ['Keep responses in this section under 300 words.', 'Please limit each answer to a maximum of 250 words.',
    'Each reply should be no more than 150 words.', 'Answers in this section must not exceed 250 words.'].entries()) {
    paste('heading-wording-' + (i + 1), 'Request for Information\nSection B. Website on AEM Sites with Edge Delivery Services\n' + line + '\nB.1 ' + asks[0]);
  }
  paste('section-vs-document-budget', 'Request for Information\nAll responses must not exceed 400 words.\nSection A: Websites\nResponses in this section must not exceed 100 words.\nA.1 ' + asks[0] + '\nSection B: Analytics\nB.1 ' + asks[1]);
  paste('restarted-references', 'Request for Proposal: Website Program\n\nSection A: Public website\n1. ' + asks[0] + '\n2. Explain how you would migrate our Drupal content into AEM Sites.\n\nSection B: Analytics\n1. ' + asks[1] + '\n2. Explain how you would connect AEM Sites data into Customer Journey Analytics.');
  const files = [];
  for (const [i, topic] of ['Website','Analytics'].entries()) {
    const file = path.join(tmp, 'Lot_' + (i + 1) + '_' + topic + '.txt');
    fs.writeFileSync(file, 'Request for Information: ' + topic + '\n1. ' + asks[i] + '\n2. Provide two references for similar work.\n3. Describe the acceptance tests for ' + topic + '.');
    files.push(file);
  }
  cases.push({id:'files/restarted-references', files});
  for (const [i,line] of ['Answers in this section must not exceed 100 words.', 'Each response in this section must not exceed 100 words.', 'Maximum 150 words per answer.'].entries()) {
    const file = path.join(tmp, 'lettered-' + (i + 1) + '.pdf');
    execFileSync('python3', [path.join(__dirname, 'review_5c/make_lettered_pdfs.py'), file, line]);
    cases.push({id:'generated/' + path.basename(file), file});
  }
  const numberedPdf = path.join(tmp,'analytics-word-budget.pdf');
  const drawPdf = `from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph
import sys
styles = getSampleStyleSheet()
parts = [Paragraph('Request for Information', styles['Title']), Paragraph('Section 3 - Analytics', styles['Heading2']),
         Paragraph('Maximum 150 words per answer.',styles['Normal'])]
parts += [Paragraph(str(i) + '. ' + q,styles['Normal']) for i,q in enumerate(sys.argv[2:],1)]
SimpleDocTemplate(sys.argv[1]).build(parts)`;
  execFileSync('python3',['-c',drawPdf,numberedPdf,...asks]);
  cases.push({id:'generated/analytics-word-budget.pdf',file:numberedPdf});
  return cases;
}

async function read(page, input) {
  await page.evaluate(() => RFPBuilder.clearAll());
  if (input.text || (input.file && input.file.endsWith('.html'))) {
    let text = input.text;
    if (!text) {
      // HTML is a source for the issued PDF. Paste its visible page text, as a procurement reader would.
      text = await page.evaluate(html => {
        const frame = document.createElement('iframe'); frame.setAttribute('sandbox','allow-same-origin'); document.body.appendChild(frame);
        const doc = frame.contentDocument; doc.open(); doc.write(html); doc.close();
        const text = doc.body.innerText; frame.remove(); return text;
      }, fs.readFileSync(input.file, 'utf8'));
    }
    await page.evaluate(([name,text]) => RFPBuilder.load(name, text), [input.id, text]);
  } else {
    const files = input.files || [input.file];
    await page.setInputFiles('#rfp-file', files);
    await page.waitForFunction(name => RFPBuilder.state.name === name || /Could not read/.test(document.querySelector('#rfp-status').textContent),
      path.basename(files[0]) + (files.length > 1 ? ' and ' + (files.length - 1) + ' more' : ''), {timeout:30000});
    const status = await page.locator('#rfp-status').textContent();
    if (/Could not read|no text layer/i.test(status)) throw Error(input.id + ': ' + status);
  }
  const result = await page.evaluate(() => RFPBuilder.state.questions.map(q => ({
    source:q.file || '', sheet:q.sheet || '', label:q.label || '', section:q.section || '', max:RFPAnswers.limitOf(q)?.max ?? null, text:q.text || ''
  })));
  if (input.files && result.some(row => !row.source)) {
    // The older page did not persist the filename on all rows. Locate each row
    // in the same reader's single-file results, in upload order, keeping duplicates.
    const originals = [];
    for (const file of input.files) {
      const single = await read(page,{id:path.basename(file),file});
      originals.push(...single.map(row => ({...row,source:path.basename(file)})));
    }
    let cursor = 0;
    for (const row of result) {
      const i = originals.findIndex((r,i) => i >= cursor && r.label === row.label && normalized(r.text) === normalized(row.text));
      if (i < 0) continue;
      if (!row.source) row.source = originals[i].source;
      cursor = i + 1;
    }
  } else if (input.file) {
    for (const row of result) if (!row.source) row.source = path.basename(input.file);
  }
  return result;
}

const normalized = s => String(s || '').normalize('NFKC').toLowerCase().replace(/[’‘]/g,"'").replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const sameFile = (a,b) => (!a.source || !b.source || a.source === b.source) && (!a.sheet || !b.sheet || a.sheet === b.sheet);
const hasText = (whole,part) => {
  const short = normalized(part);
  return !!short && (' ' + normalized(whole) + ' ').includes(' ' + short + ' ');
};
function goldFor(input) {
  if (!input.id.startsWith('fixtures/')) return [];
  const dir = path.join(__dirname,'gold');
  for (const name of fs.readdirSync(dir).filter(n => n.endsWith('.json'))) {
    const gold = JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
    if (gold.file === input.id) return gold.questions;
  }
  return [];
}

// Narrow, independently checkable evidence for a base cap that bled out of a PDF section.
// Accept only plain lettered sections, a uniquely identifiable printed question, and all
// references to word counts explicitly scoped to other sections. Ambiguity fails closed.
function scopedElsewhere(text) {
  if (!text) return () => false;
  const rows = new Map(), limits = [];
  let section = '', ambiguous = false;
  for (const raw of text.split(/[\r\n\f]+/)) {
    const line = raw.trim(), head = line.match(/^([A-Z])[.)]\s+[A-Z][^.!?]{1,90}$/);
    if (head) { section = head[1]; continue; }
    const row = line.match(/^([A-Z]\.\d+)\s+(.*)/);
    if (row) rows.set(row[1], rows.has(row[1]) ? null : {section, start: row[2]});
    if (!/\bwords?\b/i.test(line)) continue;
    const n = line.match(/\b(\d+)\s*[- ]?words?\b/i);
    if (!section || !n || !/\b(?:in|for) this section\b/i.test(line)) { ambiguous = true; continue; }
    limits.push({section,max:Number(n[1]) - (/\bunder\b/i.test(line) ? 1 : 0)});
  }
  return (row, value) => {
    const printed = rows.get(row.label);
    return !ambiguous && printed && printed.section === row.label.split('.')[0] && hasText(row.text,printed.start) &&
      limits.some(l => l.max === value) && limits.every(l => l.section !== printed.section);
  };
}

// Independently read unambiguous Word decimal lists and heading styles from the original
// OOXML. Never infer an unprinted reference from its position in the candidate output.
function wordEvidence(file) {
  if (!file || !/\.docx$/i.test(file)) return {labels:{},headings:[]};
  const xml = `import sys, json, zipfile, xml.etree.ElementTree as ET
with zipfile.ZipFile(sys.argv[1]) as z:
    w = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
    doc = ET.fromstring(z.read('word/document.xml'))
    styles = ET.fromstring(z.read('word/styles.xml'))
    numbering = ET.fromstring(z.read('word/numbering.xml')) if 'word/numbering.xml' in z.namelist() else []
    val = lambda node: node.get(w+'val') if node is not None else None
    rules = {}
    for num in numbering:
        if num.tag != w+'num' or num.find(w+'lvlOverride') is not None: continue
        aid = val(num.find(w+'abstractNumId'))
        abstract = next((a for a in numbering if a.tag == w+'abstractNum' and a.get(w+'abstractNumId') == aid), None)
        if abstract is None: continue
        levels = abstract.findall(w+'lvl')
        if len(levels) != 1 or val(levels[0].find(w+'numFmt')) != 'decimal': continue
        start, pattern = val(levels[0].find(w+'start')), val(levels[0].find(w+'lvlText'))
        if start and pattern in ('%1.','%1)','%1'): rules[num.get(w+'numId')] = [int(start),pattern]
    styleById = {s.get(w+'styleId'):s for s in styles.findall(w+'style')}
    labels, headings = {}, []
    for p in doc.iter(w+'p'):
        text = ''.join(t.text or '' for t in p.iter(w+'t'))
        style = styleById.get(val(p.find(w+'pPr/'+w+'pStyle')))
        if style is not None and (val(style.find(w+'name')) or '').lower().startswith('heading '): headings.append(text)
        np = p.find(w+'pPr/'+w+'numPr')
        if np is None and style is not None: np = style.find(w+'pPr/'+w+'numPr')
        if np is None or val(np.find(w+'ilvl')) not in (None,'0'): continue
        rule = rules.get(val(np.find(w+'numId')))
        if rule:
            labels[text] = rule[1].replace('%1',str(rule[0])) if text not in labels else None
            rule[0] += 1
    print(json.dumps(dict(labels=labels,headings=headings)))`;
  return JSON.parse(execFileSync('python3',['-c',xml,file],{encoding:'utf8'}));
}

function compare(input, before, after) {
  const events = [], oldRows = before.map((q,i) => ({...q,i})), newRows = after.map((q,i) => ({...q,i}));
  const gold = goldFor(input), checked = new Map(), companion = companionEvidence(input);
  newRows.forEach(q => {
    const g = gold[q.i];
    if (g && (g.label || '') === q.label && normalized(g.text) === normalized(q.text)) checked.set(q.i,g);
  });
  const allGold = !!gold.length && gold.length === newRows.length && checked.size === newRows.length;
  const pdfText = input.file && /\.pdf$/i.test(input.file) ? execFileSync('pdftotext',['-layout',input.file,'-'],{encoding:'utf8'}) : '';
  const outsideSection = scopedElsewhere(pdfText), word = wordEvidence(input.file);
  const plainSource = input.text || (input.file && /\.txt$/i.test(input.file) ? fs.readFileSync(input.file,'utf8') : '');
  const matches = new Map(), used = new Set(), splitChildren = new Map(), byOrder = new Set();
  const pair = (q,n) => { matches.set(q.i,n); used.add(n.i); };
  const candidates = q => newRows.filter(n => !used.has(n.i) && sameFile(q,n));
  for (const q of oldRows.filter(q => q.label)) {
    const pool = candidates(q).filter(n => n.label && normalized(n.label) === normalized(q.label));
    // Restarted references retain file, question text, and section when available.
    const n = pool.find(n => normalized(n.text) === normalized(q.text) && normalized(n.section) === normalized(q.section)) ||
      pool.find(n => normalized(n.text) === normalized(q.text)) ||
      pool.find(n => q.section && normalized(n.section) === normalized(q.section)) || pool[0];
    if (n) pair(q,n);
  }
  // Anchor exact text before order so a split, merged sub-ask, or recovered reference
  // cannot shift all subsequent unnumbered questions by one.
  for (const q of oldRows.filter(q => !matches.has(q.i))) {
    const n = candidates(q).find(n => normalized(n.text) === normalized(q.text));
    if (n) pair(q,n);
  }
  const event = (kind,field,q,a,b,reason) => events.push({kind,field,baseRow:q ? q.i + 1 : null,source:q?.source || '',label:q?.label || '',before:a,after:b,reason});
  for (const q of oldRows.filter(q => !matches.has(q.i))) {
    // A base row can be one of several sentences on a single printed requirement.
    const covered = newRows.find(n => sameFile(q,n) && (!q.label || q.label === n.label) &&
      normalized(q.text).split(' ').length >= 5 && hasText(n.text,q.text));
    if (covered) {
      pair(q,covered);
      event('correction','structure',q,q.text,covered.label || covered.i + 1,'Full old row retained inside a printed requirement');
      continue;
    }
    // Conversely the base sometimes glued separate asks. Only count a verified
    // split when the entire old text equals the complete, adjacent recovered text.
    const start = newRows.findIndex(n => !used.has(n.i) && sameFile(q,n) && normalized(q.text).startsWith(normalized(n.text) + ' '));
    if (start < 0) continue;
    let joined = '';
    for (let i = start; i < newRows.length; i++) {
      const n = newRows[i];
      if (used.has(n.i) || !sameFile(q,n)) break;
      joined = (joined + ' ' + normalized(n.text)).trim();
      if (joined === normalized(q.text)) {
        pair(q,newRows[start]);
        for (let j = start + 1; j <= i; j++) used.add(j);
        splitChildren.set(q.i,newRows.slice(start + 1,i + 1));
        event('correction','structure',q,q.text,[start + 1,i + 1],'Entire old text retained across consecutive new questions');
        break;
      }
      if (!normalized(q.text).startsWith(joined + ' ')) break;
    }
  }
  for (const q of oldRows.filter(q => !matches.has(q.i))) {
    const n = candidates(q)[0];
    if (n) { pair(q,n); byOrder.add(q.i); }
  }
  const expanded = oldRows.flatMap(q => [matches.get(q.i), ...(splitChildren.get(q.i) || [])].map(n => [q,n]));
  for (const [q,n] of expanded) {
    if (!n) {
      const heading = word.headings.some(h => normalized(h) === normalized(q.text)) && newRows.some(n => sameFile(q,n) && normalized(n.section) === normalized(q.text));
      const administrative = !q.label && normalized(q.section).includes('instructions') &&
        q.text.split(/(?<=[.!?])\s+/).every(s => /^(?:All responses must not exceed \d+ words\.?|Submit your response by (?:email|post)\b[^?]*)$/i.test(s));
      const explain = heading ? 'Native Word heading appears as the exact section title on recovered questions' : administrative ?
        'Old row consists only of response-length and submission instructions' : allGold ? 'All printed questions match the hand-checked key in order and wording' : '';
      event(explain ? 'correction' : 'loss','row',q,q.text,null,explain || 'Base question is missing');
      continue;
    }
    const g = checked.get(n.i);
    // Order is the fallback, not evidence that a disappeared ask survived. Look for
    // at least a short sequence in common before crediting an unreferenced replacement.
    if (byOrder.has(q.i) && !allGold && !q.label) {
      const words = normalized(q.text).split(' '), size = Math.min(4,words.length);
      const sharesPhrase = words.some((_,i) => i + size <= words.length && hasText(n.text,words.slice(i,i+size).join(' ')));
      if (!sharesPhrase) event('loss','row',q,q.text,n.text,'Order matched, but no identifying phrase survived');
    }
    const change = (field, a, b, lost, corrected, evidence) => {
      if (a === b) return;
      const gained = (!a && b) || (field === 'limit' && a != null && b != null && b < a);
      event(corrected ? 'correction' : lost ? 'loss' : gained ? 'improvement' : 'change',field,q,a,b,evidence);
    };
    const native = word.labels[n.text] && word.labels[n.text] === n.label;
    const printed = n.label && q.label !== n.label && (pdfText || plainSource).split(/[\r\n\f]+/).some(line => {
      const first = line.trim().match(/^(\S+)\s+(.+)/);
      return first && first[1] === n.label && normalized(first[2]).split(' ').length >= 4 && hasText(n.text,first[2]);
    });
    change('label',q.label,n.label,!!q.label,native || printed || (!!g && q.label !== (g.label || '')),
      native ? 'Native Word numbering, start and displayed decimal pattern match the candidate label' :
      printed ? 'Literal printed reference and matching question text verified on the original line' : 'Printed reference or reference recovered on a previously unnumbered row');
    const sectionChanged = q.section !== n.section;
    if (sectionChanged) {
      const clean = n.section && normalized(q.section).startsWith(normalized(n.section) + ' ');
      change('section',q.section,n.section,!!q.section && !n.section,clean || (g && !n.section && !g.section),
        clean ? 'Removed material glued to the heading' : 'Section on the matched requirement');
    }
    if (q.max !== n.max) {
      const lost = q.max != null && (n.max == null || n.max > q.max);
      let reason = 'Effective limitOf(q).max on the matched requirement';
      let corrected = false;
      const unrelatedCap = lost && companion.capFromElsewhere?.(q,q.max);
      if (unrelatedCap) { corrected = true; reason = unrelatedCap; }
      else if (lost && g && g.limit === n.max && g.limit !== q.max) {
        corrected = true; reason = 'New effective cap matches this exact printed question in the hand-checked key';
      } else if (lost && n.max != null && plainSource.split(/\r?\n/).some(line => {
        const cap = line.match(/\(\s*(\d+)\s+words?\s*\)\s*$/i);
        return cap && Number(cap[1]) === n.max && normalized(line).startsWith(normalized(n.label) + ' ') && hasText(line,n.text.replace(/\s*\(\d+ words?\)\s*$/i,''));
      })) {
        corrected = true; reason = 'Original plain-text question explicitly prints its own overriding cap';
      } else if (lost && n.max == null && outsideSection(n,q.max)) {
        corrected = true; reason = 'Printed PDF restricts that cap exclusively to another named section';
      }
      change('limit',q.max,n.max,lost,corrected,reason);
    }
  }
  for (const n of newRows.filter(n => !used.has(n.i))) event('change','row',null,null,n.label || n.text,'Additional candidate row ' + (n.i + 1));
  if (before.length !== after.length) {
    const loss = before.length > after.length && events.some(e => e.kind === 'loss' && e.field === 'row');
    event(loss ? 'loss' : before.length > after.length ? 'correction' : 'change','count',null,before.length,after.length,'Raw question count including repaired splits, joins and heading rows above');
  }
  return events;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== '--json')) throw Error('Usage: node check_parity.js [--json report.json]');
  const base = baseSite(), candidate = path.resolve(process.env.PARITY_CANDIDATE_SITE || path.join(root,sitePath));
  if (!fs.existsSync(path.join(candidate,'index.html'))) throw Error('Build the candidate page first.');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(),'warroom-parity-inputs-'));
  const browser = await chromium.launch(), servers = [];
  const report = {base:base.sha, candidatePage:git(root,'hash-object',path.join(candidate,'index.html')), inputs:[], losses:0, corrections:0, improvements:0, changes:0};
  try {
    const a = await openPage(browser,base.dir); servers.push(a);
    const b = await openPage(browser,candidate); servers.push(b);
    for (const input of corpus(tmp)) {
      const [before,after] = await Promise.all([read(a.page,input),read(b.page,input)]);
      const events = compare(input,before,after), losses = events.filter(e => e.kind === 'loss');
      report.losses += losses.length; report.corrections += events.filter(e => e.kind === 'correction').length; report.improvements += events.filter(e => e.kind === 'improvement').length; report.changes += events.filter(e => e.kind === 'change').length;
      report.inputs.push({input:input.id,companion:!!input.companion,before,after,events});
      console.log((losses.length ? 'FAIL ' : 'PASS ') + input.id + (input.companion ? ' [supporting file]' : '') + ': ' + before.length + ' -> ' + after.length + ' rows, ' + losses.length + ' losses, ' + (events.length - losses.length) + ' other differences');
      for (const e of events) console.log('  ' + e.kind + ' ' + e.field + ' ' + (e.label || (e.baseRow ? 'row ' + e.baseRow : '')) + ' ' + JSON.stringify(e.before) + ' -> ' + JSON.stringify(e.after) + ' (' + e.reason + ')');
    }
  } finally {
    for (const server of servers) server.close();
    await browser.close(); fs.rmSync(tmp,{recursive:true,force:true});
  }
  if (args[1]) fs.writeFileSync(args[1],JSON.stringify(report,null,2) + '\n');
  console.log('Parity: ' + report.inputs.length + ' inputs; ' + report.losses + ' losses, ' + report.corrections + ' evidenced corrections, ' + report.improvements + ' improvements, ' + report.changes + ' other changes.');
  if (report.losses) process.exitCode = 1;
}

if (require.main === module) main().catch(error => {console.error(error); process.exitCode = 2;});
