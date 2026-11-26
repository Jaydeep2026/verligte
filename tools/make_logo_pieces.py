"""Splits the ORIGINAL logo PNG into animatable vector pieces (8 letters, dot, tagline).
Usage: python tools/make_logo_pieces.py path/to/logo.png src/components/logoPieces.js"""
import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
import potrace
from matplotlib.path import Path as MP
SRC, OUT, S, PAD = sys.argv[1], sys.argv[2], 4, 2   # S = trace upscale, PAD = px around each piece
im = Image.open(SRC).convert('RGBA'); M = 8   # flatten transparency on white + margin so tight crops don't clip
bg = Image.new('RGBA', (im.width + 2 * M, im.height + 2 * M), (255, 255, 255, 255)); bg.alpha_composite(im, (M, M))
a = np.asarray(bg.convert('RGB')).astype(float); H, W, _ = a.shape
R, G, B = a[..., 0], a[..., 1], a[..., 2]; sat = R - B
ocol = np.median(a[sat > 120], axis=0); kcol = np.median(a[a.sum(-1) < 90], axis=0)
hexc = lambda c: '#%02x%02x%02x' % tuple(int(round(v)) for v in c)
is_or = sat > 25
ao = np.where(is_or, np.clip((255 - B) / (255 - ocol[2]), 0, 1), 0)
ak = np.where(~is_or, np.clip((255 - a.mean(-1)) / (255 - kcol.mean()), 0, 1), 0)
up = lambda m: np.asarray(Image.fromarray((m * 255).astype(np.uint8)).resize((W * S, H * S), Image.BICUBIC)) > 127
mk, mo = up(ak), up(ao)
st8 = np.ones((3, 3))
def comps(m, minpx=40 * S * S):
    lab, n = ndi.label(m, structure=st8); out = []
    for i, sl in enumerate(ndi.find_objects(lab), 1):
        if (lab[sl] == i).sum() >= minpx: out.append((i, sl))
    return lab, out
labk, ck = comps(mk); ck.sort(key=lambda t: t[1][1].start)
laba, co = comps(mo, 8 * S * S)
print('black components (expect 8):', len(ck), '| orange components:', len(co))
dot_i = min(co, key=lambda t: t[1][0].start)
pieces = []
def add(pid, kind, mask, sl, fill):
    fl = lambda v: (v // S) * S; ce = lambda v: -(-v // S) * S
    y0, y1, x0, x1 = fl(sl[0].start) - PAD * S, ce(sl[0].stop) + PAD * S, fl(sl[1].start) - PAD * S, ce(sl[1].stop) + PAD * S
    pieces.append(dict(id=pid, kind=kind, fill=fill, box=(x0, y0, x1, y1), mask=mask[y0:y1, x0:x1]))
names = ['v', 'e', 'r', 'l', 'i', 'g', 't', 'e2']
for nm, (i, sl) in zip(names, ck): add(nm, 'letter', labk == i, sl, hexc(kcol))
i, sl = dot_i; add('dot', 'dot', laba == i, sl, hexc(ocol))
tag = np.zeros_like(mo); ys, xs = [], []
for j, s2 in co:
    if j != dot_i[0]: tag |= (laba == j); ys += [s2[0].start, s2[0].stop]; xs += [s2[1].start, s2[1].stop]
add('tagline', 'tag', tag, (slice(min(ys), max(ys)), slice(min(xs), max(xs))), hexc(ocol))
def trace(mask, inv=False):
    plist = potrace.Bitmap(~mask if inv else mask).trace(turdsize=4, alphamax=1.0, opticurve=True, opttolerance=0.4)
    d, polys = [], []
    f = lambda p: f'{p.x / S:.2f} {p.y / S:.2f}'
    for c in plist:
        sp = c.start_point; d.append('M' + f(sp)); pts = [(sp.x, sp.y)]; cur = sp
        for s in c.segments:
            if s.is_corner:
                d.append('L' + f(s.c) + 'L' + f(s.end_point)); pts += [(s.c.x, s.c.y), (s.end_point.x, s.end_point.y)]
            else:
                d.append('C' + f(s.c1) + ' ' + f(s.c2) + ' ' + f(s.end_point))
                for t in np.linspace(0, 1, 11)[1:]:
                    u = 1 - t; pts.append((u**3*cur.x + 3*u*u*t*s.c1.x + 3*u*t*t*s.c2.x + t**3*s.end_point.x,
                                           u**3*cur.y + 3*u*u*t*s.c1.y + 3*u*t*t*s.c2.y + t**3*s.end_point.y))
            cur = s.end_point
        d.append('Z'); polys.append(pts)
    return ''.join(d), polys
ux0 = min(p['box'][0] for p in pieces); uy0 = min(p['box'][1] for p in pieces)
ux1 = max(p['box'][2] for p in pieces); uy1 = max(p['box'][3] for p in pieces)
rec = np.zeros((H, W)); lines = []
for p in pieces:
    h, w = p['mask'].shape; gy, gx = np.mgrid[0:h, 0:w]; pts = np.c_[gx.ravel() + .5, gy.ravel() + .5]
    best = None
    for inv in (False, True):
        d, polys = trace(p['mask'], inv); par = np.zeros(h * w, bool)
        for poly in polys: par ^= MP(poly).contains_points(pts)
        par = par.reshape(h, w); iou = (par & p['mask']).sum() / max((par | p['mask']).sum(), 1)
        if best is None or iou > best[0]: best = (iou, d, par)
    iou, d, par = best
    print(f"{p['id']:8s} IoU vs original: {iou:.4f}")
    x0, y0, x1, y1 = p['box']; cov = par.reshape(h // S, S, w // S, S).mean((1, 3))
    rec[y0 // S:y1 // S, x0 // S:x1 // S] += cov
    lines.append("  { id: '%s', kind: '%s', fill: '%s', x: %.2f, y: %.2f, w: %.2f, h: %.2f,\n    d: '%s' }," % (
        p['id'], p['kind'], p['fill'], (x0 - ux0) / S, (y0 - uy0) / S, (x1 - x0) / S, (y1 - y0) / S, d))
tgt = np.clip(ak + ao, 0, 1); print('mean alpha error vs original PNG: %.4f' % np.abs(np.clip(rec, 0, 1) - tgt).mean())
open(OUT, 'w').write("// Generated from the original verligte logo by tools/make_logo_pieces.py - do not edit by hand.\nexport const STAGE = { w: %.2f, h: %.2f }\nexport const PIECES = [\n%s\n]\n" % ((ux1 - ux0) / S, (uy1 - uy0) / S, '\n'.join(lines)))
print('stage', (ux1 - ux0) / S, (uy1 - uy0) / S, '| ink', hexc(kcol), 'accent', hexc(ocol))
