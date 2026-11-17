import json,sys,re,html,hashlib,os
def norm(s):
    s=html.unescape(s)
    for a,b in {'‘':"'",'’':"'",'“':'"','”':'"',' ':' ','‑':'-'}.items(): s=s.replace(a,b)
    return re.sub(r'\s+',' ',s).strip()
def page_text(fn):
    t=open(fn,encoding='utf-8',errors='replace').read()
    title=re.search(r'<title>(.*?)</title>',t,re.S)
    t=re.sub(r'<(script|style)\b.*?</\1>',' ',t,flags=re.S)
    t=re.sub(r'<[^>]+>','',t)   # drop tags without adding spaces, then collapse
    return norm(t), norm(title.group(1)) if title else ''
def page_text_spaced(fn):
    t=open(fn,encoding='utf-8',errors='replace').read()
    t=re.sub(r'<(script|style)\b.*?</\1>',' ',t,flags=re.S)
    return norm(re.sub(r'<[^>]+>',' ',t))
def found(q,fn):
    parts=[norm(p) for p in q.split('...') if norm(p)]
    for txt in (page_text(fn)[0],page_text_spaced(fn)):
        pos=0;ok=True
        for p in parts:
            i=txt.find(p,pos)
            if i<0: ok=False;break
            pos=i+len(p)
        if ok: return True
    return False
def fn_for(pages,u): return os.path.join(pages,hashlib.sha1(u.encode()).hexdigest()[:12]+'.html')
if __name__=='__main__':
    data,pages=sys.argv[1],sys.argv[2]
    d=json.load(open(data)); ok=bad=0
    for x in d['general']+[s for g in d['groups'] for s in g['services']]:
        if 'business.adobe.com' in x['url']: print('PASTE-ONLY',x['url']);continue
        f=fn_for(pages,x['url']); r=found(x['quote'],f); tt=page_text(f)[1]
        if r: ok+=1
        else: bad+=1; print('QUOTE MISSING',x.get('id',x.get('label')),'|',x['quote'][:90])
        if tt!=norm(x['title']): print('TITLE DIFF',x.get('id',x.get('label')),'|',tt,'|',x['title'])
    print('ok',ok,'bad',bad)
    if len(sys.argv)>3:
        for u,q in json.load(open(sys.argv[3])):
            print('CAND', found(q,fn_for(pages,u)), '|', q[:110])
