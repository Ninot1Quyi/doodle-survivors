#!/usr/bin/env python3
"""Rebuild PaperHand from pinned official OFL sources (requires fonttools + brotli).
Run from any directory. Full source TTFs are cached only in the OS temp directory.
"""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont
import hashlib, json, tempfile, urllib.request, math
from fontTools.pens.ttGlyphPen import TTGlyphPen

OUT=Path(__file__).resolve().parent
DIST=OUT.parent
COMMIT='3bca1fc0a0e00f6627f4c8bee60ef07778ab1820'
BASE='https://raw.githubusercontent.com/lxgw/LxgwWenKai-Lite/'+COMMIT+'/'
SOURCES={
 'Regular':('LXGWWenKaiLite-Regular.ttf','f799a538a3355877e597a0ae04050e897932c9ae7689eb9227c2953c5dd549ea'),
 'Medium':('LXGWWenKaiLite-Medium.ttf','9282063131640c9558a102560cf6d6f8ecc4bb441e74f2bcff032ce4786238d0')
}
chars=set(chr(i) for i in range(32,127))
for p in DIST.rglob('*'):
 if p.suffix in ('.js','.html','.css'):
  chars.update(c for c in p.read_text() if ord(c)>=32)
# Include Chinese punctuation, arrows and usual UI characters even if not currently visible.
chars.update('，。！？：；、（）【】《》「」‘’“”—…·×÷±→←↑↓↗↘↙↖↻∞ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ')
def add_ui_symbol(font, character):
 # Original geometric fallback symbols, keeping the six UI marks inside one family.
 em=font['head'].unitsPerEm
 pen=TTGlyphPen(None)
 def poly(points,reverse=False):
  if reverse: points=list(reversed(points))
  pen.moveTo((round(points[0][0]*em),round(points[0][1]*em)))
  for x,y in points[1:]: pen.lineTo((round(x*em),round(y*em)))
  pen.closePath()
 def circle(x,y,r,reverse=False):
  poly([(x+math.cos(i*math.tau/24)*r,y+math.sin(i*math.tau/24)*r) for i in range(24)],reverse)
 if character in ['✦','✧']:
  points=[(.5,.89),(.60,.58),(.89,.48),(.60,.38),(.5,.07),(.4,.38),(.11,.48),(.4,.58)]
  poly(points)
  if character=='✧':poly([(.5+(x-.5)*.55,.48+(y-.48)*.55) for x,y in points],True)
 elif character=='⛶':
  for sx,sy in [(-1,-1),(-1,1),(1,-1),(1,1)]:
   poly([(.5+sx*x,.48+sy*y) for x,y in [(.18,.35),(.35,.35),(.35,.18),(.29,.18),(.29,.29),(.18,.29)]])
 elif character=='↩':
  poly([(.15,.45),(.37,.64),(.37,.52),(.69,.52),(.69,.79),(.78,.79),(.78,.43),(.37,.43),(.37,.27)])
 elif character=='↻':
  pts=[(.49+math.cos(a)*.32,.46+math.sin(a)*.32) for a in [(-.8+i*5.25/25) for i in range(26)]]
  pts += [(.49+math.cos(a)*.24,.46+math.sin(a)*.24) for a in [(4.45-i*5.25/25) for i in range(26)]]
  poly(pts)
  poly([(.74,.73),(.92,.53),(.65,.57)])
 elif character=='☠':
  circle(.5,.58,.24)
  poly([(.35,.43),(.65,.43),(.65,.25),(.35,.25)])
  circle(.41,.6,.06,True);circle(.59,.6,.06,True)
  poly([(.5,.51),(.55,.43),(.45,.43)],True)
  for x in [.42,.50,.58]:poly([(x-.015,.25),(x+.015,.25),(x+.015,.35),(x-.015,.35)],True)
  poly([(.17,.25),(.20,.31),(.83,.09),(.80,.03)])
  poly([(.17,.09),(.20,.03),(.83,.25),(.80,.31)])
 else:return False
 name='paperUi'+format(ord(character),'04X')
 glyf=font['glyf'];metrics=font['hmtx'].metrics
 vertical=font['vmtx'].metrics if 'vmtx' in font else None
 glyf[name]=pen.glyph();metrics[name]=(em,0)
 if vertical is not None:vertical[name]=(em,round(em*.1))
 if name not in font.getGlyphOrder():font.setGlyphOrder(font.getGlyphOrder()+[name])
 for table in font['cmap'].tables:
  if table.isUnicode():table.cmap[ord(character)]=name
 return True

manifest={'upstream':'https://github.com/lxgw/LxgwWenKai-Lite','commit':COMMIT,'license':'OFL-1.1','family':'PaperHand','requested_characters':len(chars),'files':[]}
for style,(source_name,expected_hash) in SOURCES.items():
 source=Path(tempfile.gettempdir())/source_name
 if not source.exists() or hashlib.sha256(source.read_bytes()).hexdigest()!=expected_hash:
  with urllib.request.urlopen(BASE+'fonts/TTF/'+source_name,timeout=60) as response: source.write_bytes(response.read())
 assert hashlib.sha256(source.read_bytes()).hexdigest()==expected_hash
 font=TTFont(source)
 supported=set(font.getBestCmap())
 missing=sorted(c for c in chars if ord(c) not in supported)
 missing_han=[c for c in missing if 0x3400<=ord(c)<=0x9fff]
 assert not missing_han,'Missing Chinese characters: '+''.join(missing_han)
 options=subset.Options()
 options.name_IDs=['*'];options.name_languages=['*'];options.name_legacy=True
 options.layout_features=['*'];options.notdef_glyph=True;options.notdef_outline=True
 tool=subset.Subsetter(options=options);tool.populate(unicodes=[ord(c) for c in chars if ord(c) in supported]);tool.subset(font)
 for character in missing: add_ui_symbol(font,character)
 # Reserved names remain only in copyright/designer attribution/license metadata.
 replacement={1:'PaperHand',2:style,3:'PaperHand-'+style+'-Subset-'+COMMIT[:8],4:'PaperHand '+style,6:'PaperHand-'+style,16:'PaperHand',17:style,18:'PaperHand '+style}
 for record in font['name'].names:
  if record.nameID in replacement:
   record.string=replacement[record.nameID].encode(record.getEncoding(),errors='replace')
 for identifier,value in replacement.items():
  font['name'].setName(value,identifier,3,1,0x409)
  font['name'].setName(value,identifier,1,0,0)
 for ext in (['ttf','woff2'] if style=='Regular' else ['woff2']):
  filename='PaperHand-'+style+'.'+ext
  font.flavor='woff2' if ext=='woff2' else None
  font.save(OUT/filename)
  verify=TTFont(OUT/filename)
  assert all(ord(c) in verify.getBestCmap() for c in chars if ord(c) in supported)
  assert verify['name'].getDebugName(1)=='PaperHand'
  data=(OUT/filename).read_bytes()
  manifest['files'].append({'file':filename,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'source':BASE+'fonts/TTF/'+source_name,'source_sha256':expected_hash,'glyphs':len(verify.getGlyphOrder())})
 manifest['original_ui_symbols']=missing
 manifest['missing_characters']=[c for c in chars if ord(c) not in font.getBestCmap()]
(OUT/'font-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(manifest,ensure_ascii=False,indent=2))
