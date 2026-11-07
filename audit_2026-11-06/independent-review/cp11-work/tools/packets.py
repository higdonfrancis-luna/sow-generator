import json,csv,collections,sys,re,pathlib
S=pathlib.Path(sys.argv[1]); R=pathlib.Path(sys.argv[2]); P=R/'original-review-package/warroom-sow-claude-review-2026-11-06/'
recs=json.load(open(P/'review-inputs/original-records.json'))
rec={(r['entity_type'],r['id']):r for r in recs}
byid={r['id']:r for r in recs}
aud={(r['entity_type'],r['id']):r for r in json.load(open(P/'audit-results/sow-citation-audit-data.json'))['reviews']}
master={r['id']:r for r in csv.DictReader(open(R/'review-progress/warroom-review-checkpoint-10.csv'))}
SL=json.load(open(R/'source-lookups.json'))
queue={r['id']:r for r in SL['record_verification_queue']}
tasks=SL['url_tasks']
state=json.load(open(R/'REVIEW_STATE.json'))['records_by_id']
nb=json.load(open(R/'NEXT_BATCH.json'))
idx=json.load(open(S/'pages_index.json'))
pend={x.split(':',1)[1] for x in open(R/'review-progress/warroom-review-remaining-ids-cp10.txt').read().split()}
FAM={'assets':{'aemassets'},'sites':{'aemsites','eds','so','target'},'commerce':{'commerce'},'workfront':{'workfront'},'data':{'rtcdp','ajo','dwh','ads','crm','bi'},'cja':{'cja'},'engage':{'marketo','cw','bc','cms'},'root':{'bv','search','cdn','csrc'}}
ORDER=['workfront','assets','commerce','cja','engage','data','sites','root']
def fam(r):
    p=r['products']
    for f in ORDER:
        if FAM[f]&set(p): return f
    return 'root'
def page(u):
    k=idx.get(u) or idx.get(u.split('#')[0])
    return str(S/'pages'/(k+'.txt')) if k else None
nonempty=lambda d:{k:v for k,v in d.items() if v not in ('',None,'[]','{}')}
open_tasks=[t for t in tasks if t['status_class']!='closed']
packets=collections.defaultdict(lambda:{'records':[],'url_tasks':[]})
# assign records
for r in recs:
    i=r['id']; q=queue.get(i); pending=i in pend
    if not pending and not q: continue
    if not pending and q and q.get('queue_status')=='closed_tracked_claims': continue
    f=fam(r); key=(r['entity_type'],i)
    conn=None
    if r['entity_type']=='service' and len(r['products'])==2:
        a,b=r['products']; 
        for cid in (f'{a}-{b}',f'{b}-{a}'):
            if ('connection',cid) in rec: conn=cid
    packets[f]['records'].append({'id':i,'entity_type':r['entity_type'],'work':'scope_review_and_source_checks' if pending else 'source_checks_only (scope already complete; keep its settled position unless primary evidence contradicts)',
        'products':r['products'],'catalog_record':r['record'],'cited_urls':r['urls'],'cited_url_pages':{u:page(u) for u in r['urls']},
        'parent_connection':conn,'original_audit':aud.get(key),'cp10_master_row':nonempty(master.get(i,{})),'cp10_queue':nonempty(q or {}),'review_state':state.get(i)})
ids_to_f={x['id']:f for f,p in packets.items() for x in p['records']}
for t in open_tasks:
    ids=t['records']; c=collections.Counter(ids_to_f.get(i) for i in ids if i in ids_to_f)
    f=c.most_common(1)[0][0] if c else fam(byid[ids[0]]) if ids and ids[0] in byid else 'root'
    fr=[x for x in nb['first_source_reads'] if x['url']==t['url']]
    packets[f]['url_tasks'].append({**t,'records':ids,'cached_page':page(t['url']),'cp10_first_source_read':fr[0] if fr else None})
for f,p in packets.items():
    json.dump(p,open(S/'packets'/f'{f}.json','w'),indent=1)
    print(f,'records',len(p['records']),'pending',sum(x['work'].startswith('scope') for x in p['records']),'url_tasks',len(p['url_tasks']), 'KB',(S/'packets'/f'{f}.json').stat().st_size//1024)
