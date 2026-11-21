"""Audit of Nov 21 2026, step 1: fetch every distinct address the tool cites (plain curl, default headers, no disguise), save each
page in a folder outside the repository, and write its status to audit_2026-11-21/data/link_check.json.

    python3 audit_2026-11-21/tools/fetch_all.py <folder for the saved pages>

business.adobe.com (turns automated requests away), partners.adobe.com (a sign-in site, never opened by rule), www.adobe.com (not
reachable from the session that ran this) and YouTube are recorded as skipped, not fetched.
"""
import json, re, os, sys, subprocess, hashlib, time
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse
HERE=os.path.dirname(os.path.abspath(__file__)); REPO=os.path.dirname(os.path.dirname(HERE)); OUT=os.path.abspath(sys.argv[1]); os.makedirs(OUT,exist_ok=True)
SKIP={'business.adobe.com':'paste-only (site blocks automated tools)','partners.adobe.com':'sign-in site, never opened by rule','www.youtube.com':'not an Adobe docs host','www.adobe.com':'not reachable from this session'}
def urls(o,acc):
    if isinstance(o,dict):
        for v in o.values(): urls(v,acc)
    elif isinstance(o,list):
        for v in o: urls(v,acc)
    elif isinstance(o,str):
        for u in re.findall(r'https?://[^\s"\'<>)\]]+',o): acc.add(u.rstrip('.,;'))
allu={}
for f in ['canvas/catalog.json','canvas/training.json','canvas/problems.json','rfp_facts.json','rfp_method.json']:
    s=set(); urls(json.load(open(os.path.join(REPO,f))),s)
    for u in s: allu.setdefault(u,[]).append(f)
def fn(u): return os.path.join(OUT,hashlib.sha1(u.encode()).hexdigest()[:12]+'.html')
def get(u):
    host=urlparse(u).netloc
    if host in SKIP: return u,{'status':'skipped','why':SKIP[host]}
    f=fn(u.split('#')[0])
    for attempt in range(3):
        r=subprocess.run(['curl','-sS','-L','-o',f,'-w','%{http_code} %{url_effective} %{num_redirects}','--max-time','45',u.split('#')[0]],capture_output=True,text=True)
        parts=r.stdout.strip().split(' ')
        code=parts[0] if parts else '000'
        if code not in('000','429','502','503','504'): break
        time.sleep(4*(attempt+1))
    time.sleep(0.4)
    return u,{'status':code,'final':parts[1] if len(parts)>1 else '','redirects':parts[2] if len(parts)>2 else '','size':os.path.getsize(f) if os.path.exists(f) else 0,'err':r.stderr.strip()[:200]}
log={}
todo=sorted(allu)
with ThreadPoolExecutor(4) as ex:
    for i,(u,res) in enumerate(ex.map(get,todo)):
        res['in']=allu[u]; log[u]=res
        if i%100==0: print(i,len(todo),flush=True)
json.dump(log,open(os.path.join(os.path.dirname(HERE),'data','link_check.json'),'w'),indent=1,sort_keys=True)
from collections import Counter
print(Counter(v['status'] for v in log.values()))
