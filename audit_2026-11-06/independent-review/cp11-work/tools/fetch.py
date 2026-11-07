import sys,re,html,json,hashlib,subprocess,pathlib,concurrent.futures as cf
S=pathlib.Path(sys.argv[1]); out=S/'pages'; out.mkdir(exist_ok=True)
urls=[u.strip() for u in open(S/'urls.txt') if u.strip()]
def key(u): return hashlib.sha1(u.split('#')[0].encode()).hexdigest()[:16]
def get(u):
    base=u.split('#')[0]; k=key(u); p=out/(k+'.txt')
    if p.exists(): return u,k,'cached'
    r=subprocess.run(['curl','-sSL','-A','Mozilla/5.0 (Macintosh) Chrome/130','-m','40','-w','\n__CODE__%{http_code} %{url_effective}',base],capture_output=True,text=True,errors='ignore')
    t=r.stdout; m=re.search(r'\n__CODE__(\d+) (\S+)$',t); code,eff=(m.group(1),m.group(2)) if m else ('000',base); t=t[:m.start()] if m else t
    lu=re.search(r'name="last-update" content="([^"]+)"',t); title=re.search(r'<title>(.*?)</title>',t,re.S)
    b=re.sub(r'<script.*?</script>|<style.*?</style>|<nav.*?</nav>|<footer.*?</footer>','',t,flags=re.S|re.I)
    b=re.sub(r'<(h[1-6])[^>]*>',lambda m:'\n\n## ',b); b=re.sub(r'<(li)[^>]*>','\n- ',b); b=re.sub(r'<(p|tr|div|br)[^>]*>','\n',b)
    x=html.unescape(re.sub(r'<[^>]+>',' ',b)); x=re.sub(r'[ \t]+',' ',x); x=re.sub(r'\n\s*\n+','\n\n',x).strip()
    meta={'url':u,'fetched_url':base,'http':code,'effective_url':eff,'last_update':lu.group(1) if lu else None,'title':html.unescape(title.group(1).strip()) if title else None,'chars':len(x)}
    p.write_text(json.dumps(meta)+'\n\n'+x); return u,k,code
idx={}
with cf.ThreadPoolExecutor(8) as ex:
    for u,k,c in ex.map(get,urls): idx[u]=k
json.dump(idx,open(S/'pages_index.json','w'),indent=0)
