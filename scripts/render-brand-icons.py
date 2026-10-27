#!/usr/bin/env python3
"""Frame One cinematic icon rasteriser. Python stdlib only; deterministic and offline.

The SVG is the editorial artwork; these pixels are the matching native/PWA
representation for launchers that require PNGs. Re-run after Capacitor sync.
"""
from __future__ import annotations
import math
import struct
import sys
import zlib
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent

def clamp(value:float)->float:
    return max(0.0,min(1.0,value))

def dist_line(x:float,y:float,a:float,b:float,c:float,d:float)->float:
    dx=c-a;dy=d-b;den=dx*dx+dy*dy
    t=clamp(((x-a)*dx+(y-b)*dy)/den) if den else 0
    return math.hypot(x-a-t*dx,y-b-t*dy)

def mark_dist(x:float,y:float):
    # The same geometric F1/four-sided film frame from public/frame-one-icon.svg.
    segments=[(49,115,49,46),(49,46,87,46),(49,81,78,81),
              (99,62,118,48),(118,48,118,114)]
    d=min(dist_line(x,y,*segment) for segment in segments)
    dx=abs(x-80)-48;dy=abs(y-80)-48
    rounded=math.hypot(max(dx,0),max(dy,0))+min(max(dx,dy),0)-9
    return d,abs(rounded)

def icon_pixel(px:int,py:int,size:int,foreground:bool=False)->bytes:
    x=(px+.5)*512/size
    y=(py+.5)*512/size
    # Artwork is centred in a 424x424 unit canvas, matching SVG transform.
    u=(x-44)/2.65;v=(y-44)/2.65
    d,edge=mark_dist(u,v)
    solid=clamp(5.05-d)
    rim=clamp(2.05-edge)
    # Brass catches more light at the top-left; thicker letterforms stay legible.
    lighting=clamp((u+v-55)/180)
    gold=(int(255-71*lighting),int(231-93*lighting),int(189-107*lighting))
    if foreground:
        alpha=max(solid,rim)
        return bytes((gold[0],gold[1],gold[2],round(255*alpha)))
    # Subtle copper glow, vignette and high-contrast midnight background.
    glow=math.exp(-((x-331)**2+(y-160)**2)/(2*165**2))
    vignette=clamp(1-.16*math.hypot(x-256,y-256)/360)
    base=[(11+31*glow)*vignette,(15+12*glow)*vignette,(22+7*glow)*vignette]
    near=min(max(d-4,0),max(edge-1.35,0))
    bloom=math.exp(-near/5.0)*.21
    base=[base[i]*(1-bloom)+(197,109,70)[i]*bloom for i in range(3)]
    alpha=max(solid,rim)
    result=[round(base[i]*(1-alpha)+gold[i]*alpha) for i in range(3)]
    return bytes((*[max(0,min(255,n)) for n in result],255))

def chunk(kind:bytes,payload:bytes)->bytes:
    return struct.pack('!I',len(payload))+kind+payload+struct.pack('!I',zlib.crc32(kind+payload)&0xffffffff)

def render(path:Path,size:int,foreground:bool=False):
    path.parent.mkdir(parents=True,exist_ok=True)
    compressor=zlib.compressobj(6)
    payload=[]
    for y in range(size):
        row=b'\x00'+b''.join(icon_pixel(x,y,size,foreground) for x in range(size))
        payload.append(compressor.compress(row))
    payload.append(compressor.flush())
    png=b'\x89PNG\r\n\x1a\n'
    png+=chunk(b'IHDR',struct.pack('!IIBBBBB',size,size,8,6,0,0,0))
    png+=chunk(b'IDAT',b''.join(payload))
    png+=chunk(b'IEND',b'')
    path.write_bytes(png)
    print(f'FRAME ONE ICON: {path.relative_to(ROOT)} {size}x{size} {len(png)} bytes')

def web():
    for size in (192,512):
        render(ROOT/'public'/f'icon-{size}.png',size)

def android():
    base=ROOT/'android/app/src/main/res'
    if not(base.parent/'AndroidManifest.xml').is_file():
        raise SystemExit('Generate native Android first with npx cap add android && npx cap sync android.')
    sizes={'mdpi':48,'hdpi':72,'xhdpi':96,'xxhdpi':144,'xxxhdpi':192}
    for dpi,size in sizes.items():
        folder=base/f'mipmap-{dpi}'
        render(folder/'ic_launcher.png',size)
        render(folder/'ic_launcher_round.png',size)
        render(folder/'ic_launcher_foreground.png',round(size*2.25),foreground=True)
    folder=base/'values'
    folder.mkdir(parents=True,exist_ok=True)
    (folder/'ic_launcher_background.xml').write_text(
      '<resources><color name="ic_launcher_background">#0B1018</color></resources>\n',encoding='utf8')
    xml=('<?xml version="1.0" encoding="utf-8"?>\n'
         '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n'
         '    <background android:drawable="@color/ic_launcher_background"/>\n'
         '    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>\n'
         '</adaptive-icon>\n')
    folder=base/'mipmap-anydpi-v26';folder.mkdir(parents=True,exist_ok=True)
    for filename in ('ic_launcher.xml','ic_launcher_round.xml'):
        (folder/filename).write_text(xml,encoding='utf8')
    print('FRAME ONE ICON: native adaptive and legacy launchers branded')

if __name__=='__main__':
    mode=sys.argv[1:] or ['--web']
    if mode==['--web']:web()
    elif mode==['--android']:android()
    else:raise SystemExit('Usage: python3 scripts/render-brand-icons.py [--web|--android]')
