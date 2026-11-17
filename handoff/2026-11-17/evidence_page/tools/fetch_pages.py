import json,sys,subprocess,hashlib,time,os
data,out=sys.argv[1],sys.argv[2]
d=json.load(open(data))
urls=[]
for x in d['general']+[s for g in d['groups'] for s in g['services']]:
    if x['url'] not in urls: urls.append(x['url'])
log=[]
for u in urls:
    if 'business.adobe.com' in u: log.append((u,'skipped: site blocks automated tools'));continue
    fn=os.path.join(out,hashlib.sha1(u.encode()).hexdigest()[:12]+'.html')
    if not os.path.exists(fn) or os.path.getsize(fn)<2000:
        r=subprocess.run(['curl','-sS','-L','-o',fn,'-w','%{http_code}','--max-time','40',u],capture_output=True,text=True)
        log.append((u,r.stdout.strip()));time.sleep(0.7)
    else: log.append((u,'cached'))
json.dump(log,open(os.path.join(out,'fetch_log.json'),'w'),indent=1)
from collections import Counter
print(Counter(c for _,c in log)); print([l for l in log if l[1] not in('200','cached')])
