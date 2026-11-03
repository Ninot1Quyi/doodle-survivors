#!/usr/bin/env python3
"""Rebuild reviewed single-source weapon cues. Requires the separately retained source library.
Defaults to source verification; --write re-encodes processed samples from provenance recipes.
FFMPEG must name an installed ffmpeg executable. No source download or synthesis occurs.
"""
from pathlib import Path
import argparse, array, hashlib, json, math, os, re, subprocess

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--research', type=Path, default=ROOT.parent / 'doodle-survivors-audio-research')
parser.add_argument('--write', action='store_true')
args = parser.parse_args()
ff = os.environ.get('FFMPEG', 'ffmpeg')
ledger = ROOT / 'public/audio/WEAPON-AUDIO-PROVENANCE.json'
manifest = json.loads(ledger.read_text())
prepared_dir = args.research / 'combat-library/prepared'
prepared = json.loads((prepared_dir / 'manifest.json').read_text())['assets']

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def source(entry):
    pack, name = entry['pack'], entry['source']
    if pack == 'prepared':
        take = next(a for a in prepared if Path(a['source_file']).name == name)
        origin = (prepared_dir / take['source_file']).resolve()
        assert sha(origin) == entry['source_sha256'], f'Original changed: {origin}'
        path = prepared_dir / take['file']
        assert sha(path) == entry['prepared_source_sha256'], f'Prepared take changed: {path}'
        return path
    packs = {'rpg':'rpg-audio', 'scifi':'sci-fi-sounds', 'digital':'digital-audio', 'dusty':'dustyroom', 'jingles':'music-jingles'}
    folder = args.research / packs[pack] if pack in packs else args.research / 'combat-library/originals' / pack
    path = next(folder.rglob(name))
    assert sha(path) == entry['source_sha256'], f'Source changed: {path}'
    return path

def decode(path, filters=None):
    cmd = [ff, '-v', 'error', '-i', str(path), '-ac', '1', '-ar', '44100']
    if filters:
        cmd += ['-af', filters]
    result = subprocess.run(cmd + ['-f', 'f32le', 'pipe:1'], check=True, capture_output=True)
    samples = array.array('f'); samples.frombytes(result.stdout)
    return samples

def stats(samples):
    peak = max(map(abs, samples), default=0)
    rms = math.sqrt(sum(x*x for x in samples) / max(1, len(samples)))
    active = [x for x in samples if abs(x) > peak * .03]
    active_rms = math.sqrt(sum(x*x for x in active) / max(1, len(active)))
    db = lambda x: 20 * math.log10(max(x, 1e-9))
    return {'duration':len(samples)/44100, 'peak_dbfs':db(peak), 'rms_dbfs':db(rms), 'active_rms_dbfs':db(active_rms)}

count = 0
for entry in manifest['samples']:
    if not entry.get('weapon'):
        continue
    destination = ROOT / 'public/audio' / entry['file']
    if entry['weapon'] in ('firecracker', 'festival'):
        assert sha(destination) == entry['file_sha256'], f'Preserved fireworks changed: {destination}'
        continue
    origin = source(entry)
    if args.write:
        recipe = entry['processing']
        filters = recipe.split(';')[0]
        cap = float(re.search(r'at most ([\d.]+)s', recipe)[1])
        target = float(re.search(r'target (-?[\d.]+)dBFS', recipe)[1])
        samples = decode(origin, filters)
        peak = max(map(abs, samples)); threshold = peak * .004
        last = next((i for i in range(len(samples)-1, -1, -1) if abs(samples[i]) > threshold), len(samples)-1)
        samples = samples[:min(last + 441, int(cap*44100))]
        for i in range(min(88, len(samples))):
            samples[i] *= i / 88
        fade = min(int(.045*44100), len(samples)//4)
        for i in range(fade):
            samples[len(samples)-1-i] *= i / max(1, fade)
        before = stats(samples)
        gain = min(10**((target-before['active_rms_dbfs'])/20), 10**((-4-before['peak_dbfs'])/20), 6)
        samples = array.array('f', (x*gain for x in samples))
        subprocess.run([ff, '-v', 'error', '-f', 'f32le', '-ar', '44100', '-ac', '1', '-i', 'pipe:0', '-c:a', 'libvorbis', '-q:a', '5', '-y', str(destination)], input=samples.tobytes(), check=True)
        entry['normalization_gain'] = round(gain, 6)
        entry['file_sha256'] = sha(destination)
        entry['measurement'] = {k:round(v,4) for k,v in stats(decode(destination)).items()}
    count += 1
if args.write:
    ledger.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(f'{"Rebuilt" if args.write else "Verified sources for"} {count} processed weapon samples; original fireworks preserved.')
