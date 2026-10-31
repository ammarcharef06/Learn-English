#!/usr/bin/env python3
"""Generate the literacy precision bank with the open Kokoro-82M TTS model."""
from pathlib import Path
import argparse, json, re, subprocess, tempfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets/audio/zero"
VOICE = "af_heart"
LETTERS = dict(zip("abcdefghijklmnopqrstuvwxyz", ["apple","ball","cat","dog","egg","fish","goat","hat","ice","juice","key","lion","moon","nose","orange","pen","queen","rabbit","sun","tree","umbrella","van","water","xylophone","yogurt","zebra"]))
DIGRAPHS = {
 "sh":("/ʃ/","ship"), "ch":("/tʃ/","chair"),
 "th-voiceless":("/θ/","three"), "th-voiced":("/ð/","this"),
 "ph":("/f/","phone"), "ck":("/k/","duck"), "ng":("/ŋ/","king"),
 "oo-long":("/uː/","spoon"), "oo-short":("/ʊ/","book"),
 "ee":("/iː/","bee"), "ea":("/iː/","sea"), "ou":("/aʊ/","mouse")
}
def slug(s): return re.sub(r"[^a-z0-9]+","-",s.lower()).strip("-")
PHONEMES = {
 "p":("/p/","pen"), "b":("/b/","bed"), "t":("/t/","ten"), "d":("/d/","dog"),
 "k":("/k/","cat"), "g":("/ɡ/","go"), "f":("/f/","fish"), "v":("/v/","van"),
 "theta":("/θ/","thin"), "eth":("/ð/","this"), "s":("/s/","sun"), "z":("/z/","zoo"),
 "sh":("/ʃ/","ship"), "ch":("/tʃ/","chip"), "jh":("/dʒ/","jam"), "m":("/m/","man"), "n":("/n/","net"),
 "eng":("/ŋ/","sing"), "l":("/l/","leg"), "r":("/ɹ/","red"), "h":("/h/","hat"),
 "w":("/w/","wet"), "y":("/j/","yes")
}
def jobs():
    result=[]
    for c in LETTERS: result.append((f"n/name-{c}.mp3", c.upper(), "letter-name"))
    for c,w in LETTERS.items(): result.append((f"n/word-{c}.mp3", w, "letter-example"))
    for key,(sound,word) in DIGRAPHS.items():
        result.append((f"d/{key}.mp3", sound, "grapheme-sound"))
        result.append((f"n/word-{key}.mp3", word, "grapheme-example"))
    for key,(ipa,word) in PHONEMES.items():
        result.append((f"p/phoneme-{key}.mp3", ipa, "phoneme"))
        result.append((f"n/phoneme-word-{key}.mp3", word, "phoneme-example"))
    return result
def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--write",action="store_true")
    ap.add_argument("--force",action="store_true")
    args=ap.parse_args()
    todo=jobs()
    print(json.dumps({"engine":"Kokoro-82M","license":"Apache-2.0","voice":VOICE,"mode":"write" if args.write else "dry-run","count":len(todo),"categories":{k:sum(1 for x in todo if x[2]==k) for k in sorted({x[2] for x in todo})}},ensure_ascii=False))
    if not args.write: return
    import numpy as np
    import soundfile as sf
    from kokoro import KPipeline
    pipe=KPipeline(lang_code="a")
    generated=skipped=0
    for rel,text,kind in todo:
        dest=OUT/rel
        dest.parent.mkdir(parents=True,exist_ok=True)
        if dest.exists() and dest.stat().st_size>1024 and not args.force:
            skipped+=1; continue
        chunks=[]
        if kind in ("grapheme-sound", "phoneme"):
            # Raw IPA must bypass English G2P; otherwise symbols such as /ʃ/ are discarded.
            phonemes = text.strip("/")
            results = pipe.generate_from_tokens(phonemes, voice=VOICE, speed=0.92)
            for result in results:
                if result.audio is not None: chunks.append(np.asarray(result.audio,dtype=np.float32))
        else:
            for result in pipe(text, voice=VOICE, speed=0.92):
                if result.audio is not None: chunks.append(np.asarray(result.audio,dtype=np.float32))
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
