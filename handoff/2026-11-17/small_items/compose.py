import sys
from PIL import Image, ImageDraw, ImageFont
small,out=sys.argv[1],sys.argv[2]
def font(sz):
    for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf','/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf']:
        try: return ImageFont.truetype(p,sz)
        except OSError: pass
    return ImageFont.load_default()
def side(pairs,dst,crop_from_bottom=None,pad=40,label_h=70):
    ims=[]
    for label,fn in pairs:
        im=Image.open(fn).convert('RGB')
        if crop_from_bottom: im=im.crop((0,max(0,im.height-crop_from_bottom),im.width,im.height))
        ims.append((label,im))
    W=sum(i.width for _,i in ims)+pad*(len(ims)+1); H=max(i.height for _,i in ims)+label_h+pad*2
    c=Image.new('RGB',(W,H),'#f2f2f2'); d=ImageDraw.Draw(c); x=pad
    for label,im in ims:
        d.text((x,pad-6),label,fill='#222',font=font(34)); c.paste(im,(x,pad+label_h)); x+=im.width+pad
    c.save(dst); print(dst,c.size)
side([('Today: optional, not ticked',small+'/item1_today_card.png'),('Proposed for new quotes: ticked from the start',small+'/item1_proposed_card.png')],out+'/item1_xl27_today_vs_proposed.png',crop_from_bottom=560)
side([('Today',small+'/item2_today.png'),('Proposed: one phrase, Ask Adobe',small+'/item2_proposed.png')],out+'/item2_ask_adobe_today_vs_proposed.png')
