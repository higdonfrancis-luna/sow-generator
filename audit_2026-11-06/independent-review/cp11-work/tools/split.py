"""Split the three largest packets in two, keeping each connection's records together.
Usage: python3 -I split.py <SCRATCH>  (after packets.py)"""
import json,collections,sys,os,pathlib
D=pathlib.Path(sys.argv[1])/'packets'
for f in ['data','sites','engage']:
    p=json.load(open(D/(f+'.json')))
    def g(r): return r.get('parent_connection') or (r['id'] if r['entity_type']=='connection' else '+'.join(r['products']))
    groups=collections.defaultdict(list)
    for r in p['records']: groups[g(r)].append(r)
    a,b=[],[]
    for k in sorted(groups,key=lambda k:-len(groups[k])): (a if len(a)<=len(b) else b).extend(groups[k])
    halves={f+'_1':a,f+'_2':b}; ids={h:{r['id'] for r in v} for h,v in halves.items()}; tasks={h:[] for h in halves}
    for t in p['url_tasks']: tasks[max(halves,key=lambda h:len(ids[h]&set(t['records'])))].append(t)
    for h in halves: json.dump({'records':halves[h],'url_tasks':tasks[h]},open(D/(h+'.json'),'w'),indent=1)
    os.rename(D/(f+'.json'),D/(f+'.unsplit'))
