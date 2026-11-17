import sys,os,re,base64,zipfile
site,brief_zip,out=sys.argv[1:4]
# 1. the brief as a zip, with the new tab: same files, same order, plus coworker-evidence.html
src=zipfile.ZipFile(brief_zip); names=src.namelist()
zp=os.path.join(out,'brand-visibility-growth.zip')
with zipfile.ZipFile(zp,'w',zipfile.ZIP_DEFLATED) as z:
    for n in names:
        if n.endswith('/'): continue
        z.write(os.path.join(site,n),n)
    z.write(os.path.join(site,'coworker-evidence.html'),'coworker-evidence.html')
new=zipfile.ZipFile(zp)
changed=[n for n in names if not n.endswith('/') and src.read(n)!=new.read(n)]
print('zip files',len(new.namelist()),'changed vs upload:',changed,'added:',sorted(set(new.namelist())-set(names)))
# 2. one-file preview: stylesheets and fonts inlined, links back to the brief switched off
t=open(os.path.join(site,'coworker-evidence.html'),encoding='utf-8').read()
def font(m):
    p=os.path.normpath(os.path.join(site,m.group(1)))
    return 'url(data:font/woff2;base64,%s)'%base64.b64encode(open(p,'rb').read()).decode()
def sheet(m):
    css=open(os.path.join(site,m.group(1)),encoding='utf-8').read()
    css=re.sub(r'url\(["\']?((?:\./)?fonts/[^"\')]+)["\']?\)',font,css)
    left=re.findall(r'url\((?!data:)[^)]*\)',css)
    assert not [u for u in left if 'svg+xml' not in u and '#' not in u[:6]],left[:3]
    return '<style>\n%s\n</style>'%css
t,n=re.subn(r'<link rel="stylesheet" href="([^"]+)">',sheet,t); assert n==4
k=t.count('href="index.html#')
t=t.replace('</body>','<script>document.addEventListener("click",function(e){var a=e.target.closest(\'a[href^="index.html"]\');if(a)e.preventDefault();});</script>\n</body>')
t=t.replace('<title>Coworker evidence','<title>Preview: Coworker evidence')
sp=os.path.join(out,'coworker-evidence-preview.html'); open(sp,'w',encoding='utf-8').write(t)
print('preview',os.path.getsize(sp),'bytes; brief links switched off:',k)
