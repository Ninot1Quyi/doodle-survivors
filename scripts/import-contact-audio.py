#!/usr/bin/env python3
"""Compatibility entry point for the current soft15 single-source contact recipe.
--source may name the complete retained research directory or its combat-library child.
The old strongest-window rip/crunch recipe was replaced after actual user feedback.
"""
from pathlib import Path
import argparse,subprocess,sys
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--source',type=Path,required=True)
p.add_argument('--ffmpeg',required=True)
a=p.parse_args()
research=a.source.parent if a.source.name=='combat-library' else a.source
subprocess.run([sys.executable,str(Path(__file__).with_name('refine-paper-palette.py')),'--research',str(research),'--ffmpeg',a.ffmpeg,'--write','--contacts-only'],check=True)
