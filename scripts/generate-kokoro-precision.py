#!/usr/bin/env python3
"""Generate the literacy precision bank with the open Kokoro-82M TTS model."""
from pathlib import Path
import argparse, json, re, subprocess, tempfile
import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets/audio/zero"
VOICE = "af_heart"
LETTERS = dict(zip("abcdefghijklmnopqrstuvwxyz", ["apple","ball","cat","dog","egg","fish","goat","hat","ice","juice","key","lion","moon","nose","orange","pen","queen","rabbit","sun","tree","umbrella","van","water","xylophone","yogurt","zebra"]))
DIGRAPHS = {
 "sh":("shh","ship"), "ch":("ch","chair"),
 "th-voiceless":("th","three"), "th-voiced":("th","this"),
 "ph":("f","phone"), "ck":("k","duck"), "ng":("ng","king"),
 "oo-long":("oo","spoon"), "oo-short":("oo","book"),
 "ee":("ee","bee"), "ea":("ee","sea"), "ou":("ow","mouse")
}
def slug(s): return re.sub(r"[^a-z0-9]+","-",s.lower()).strip("-")
def jobs():
    result=[]
    for c in LETTERS: result.append((f"n/name-{c}.mp3", c.upper(), "letter-name"))
    for c,w in LETTERS.items(): result.append((f"n/word-{c}.mp3", w, "letter-example"))
    for key,(sound,word) in DIGRAPHS.items():
        result.append((f"d/{key}.mp3", sound, "grapheme-sound"))
        result.append((f"n/word-{key}.mp3", word, "grapheme-example"))
    return result
def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--write",action="store_true")
    ap.add_argument("--force",action="store_true")
    args=ap.parse_args()
    todo=jobs()
    print(json.dumps({"engine":"Kokoro-82M","license":"Apache-2.0","voice":VOICE,"mode":"write" if args.write else "dry-run","count":len(todo),"categories":{k:sum(1 for x in todo if x[2]==k) for k in sorted({x[2] for x in todo})}},ensure_ascii=False))
    if not args.write: return
    pipe=KPipeline(lang_code="a")
    generated=skipped=0
    for rel,text,kind in todo:
        dest=OUT/rel
        dest.parent.mkdir(parents=True,exist_ok=True)
        if dest.exists() and dest.stat().st_size>1024 and not args.force:
            skipped+=1; continue
        chunks=[]
        for _,_,audio in pipe(text, voice=VOICE, speed=0.92):
            if audio is not None: chunks.append(np.asarray(audio,dtype=np.float32))
        if not chunks: raise RuntimeError(f"No audio generated for {rel}: {text}")
        audio=np.concatenate(chunks)
        if audio.size < 1000: raise RuntimeError(f"Audio too short for {rel}")
        with tempfile.NamedTemporaryFile(suffix=".wav",delete=False,dir=dest.parent) as f: wav=Path(f.name)
        try:
            sf.write(wav,audio,24000)
            tmp=dest.with_suffix(".tmp.mp3")
            subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(wav),"-codec:a","libmp3lame","-b:a","96k",str(tmp)],check=True)
            if tmp.stat().st_size<1024: raise RuntimeError(f"MP3 too small: {rel}")
            tmp.replace(dest)
        finally:
            wav.unlink(missing_ok=True)
        generated+=1
    print(json.dumps({"generated":generated,"skipped":skipped,"total":len(todo),"output":str(OUT)},ensure_ascii=False))
if __name__=="__main__": main()
