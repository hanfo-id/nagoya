"""Build the original winter Nagoya icon. Pillow is only needed to regenerate assets."""
import json
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'icons'
OUT.mkdir(exist_ok=True)
GREEN, CREAM, GOLD = '#183c32', '#f8f5ed', '#d9b981'
SCALE = 4
canvas = Image.new('RGB', (512 * SCALE, 512 * SCALE), GREEN)
draw = ImageDraw.Draw(canvas)

def line(points, fill, width):
    draw.line([(int(x*SCALE), int(y*SCALE)) for x, y in points], fill=fill, width=width*SCALE, joint='curve')

def rounded(box, radius, fill):
    draw.rounded_rectangle(tuple(int(v*SCALE) for v in box), radius=radius*SCALE, fill=fill)

def snow(x, y, radius):
    line([(x-radius, y), (x+radius, y)], CREAM, 7)
    line([(x-radius*.5, y-radius*.866), (x+radius*.5, y+radius*.866)], CREAM, 7)
    line([(x-radius*.5, y+radius*.866), (x+radius*.5, y-radius*.866)], CREAM, 7)

line([(256,110),(256,203)], GOLD, 12)
line([(238,237),(178,390)], GOLD, 13)
line([(274,237),(334,390)], GOLD, 13)
line([(220,283),(292,283)], GOLD, 11)
line([(200,335),(312,335)], GOLD, 11)
line([(238,245),(312,335),(178,390)], GOLD, 10)
line([(274,245),(200,335),(334,390)], GOLD, 10)
rounded((214,201,298,241), 9, CREAM)
for x in (235,256,277):
    line([(x,207),(x,235)], GREEN, 5)
line([(151,400),(361,400)], CREAM, 12)
snow(365,151,23)
snow(134,280,15)

base = canvas.resize((512,512), Image.Resampling.LANCZOS)
for size, name in ((32,'favicon-32.png'),(180,'apple-touch-icon.png'),(192,'icon-192.png'),(512,'icon-512.png')):
    base.resize((size,size), Image.Resampling.LANCZOS).save(OUT / name, optimize=True)
base.save(ROOT / 'favicon.ico', format='ICO', sizes=[(16,16),(32,32),(48,48),(64,64)])
svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>겨울 나고야 여행</title><rect width="512" height="512" rx="100" fill="#183c32"/><g fill="none" stroke="#d9b981" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"><path d="M256 110v93M238 237l-60 153M274 237l60 153M220 283h72M200 335h112M238 245l74 90-134 55M274 245l-74 90 134 55"/></g><rect x="214" y="201" width="84" height="40" rx="9" fill="#f8f5ed"/><path d="M235 207v28m21-28v28m21-28v28" stroke="#183c32" stroke-width="5"/><g stroke="#f8f5ed" stroke-linecap="round" fill="none"><path d="M151 400h210" stroke-width="12"/><path d="M342 151h46m-34.5-19.9 23 39.8m-23 0 23-39.8M119 280h30m-22.5-13 15 26m-15 0 15-26" stroke-width="7"/></g></svg>'''
(ROOT / 'favicon.svg').write_text(svg, encoding='utf-8')
manifest = {
    'id': './', 'name': '나고야 여행', 'short_name': '나고야 여행', 'lang': 'ko',
    'start_url': './?page=home', 'scope': './', 'display': 'standalone',
    'background_color': CREAM, 'theme_color': GREEN,
    'icons': [
        {'src':'icons/icon-192.png','sizes':'192x192','type':'image/png','purpose':'any'},
        {'src':'icons/icon-512.png','sizes':'512x512','type':'image/png','purpose':'any'},
        {'src':'icons/icon-512.png','sizes':'512x512','type':'image/png','purpose':'maskable'},
    ],
}
(ROOT / 'manifest.webmanifest').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print('Built SVG/ICO favicon, Apple touch icon and 192/512px web-app icons.')
