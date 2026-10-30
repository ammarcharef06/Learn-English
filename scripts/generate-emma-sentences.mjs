#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdir, rename, rm, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { AUDIO_MAP } from "../assets/js/data/zero-audio-map.js";
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const isSentence=s=>/[.!?]$/.test(s.trim())&&s.trim().split(/\\s+/).length>=3;
async function main(){
 const write=process.argv.includes("--write"),force=process.argv.includes("--force");
 const jobs=Object.entries(AUDIO_MAP).filter(([t])=>isSentence(t));
 if(jobs.some(([,p])=>!p.startsWith("./assets/audio/zero/sentences/")))throw Error("Sentence paths must use the dedicated sentence folder.");
 console.log(JSON.stringify({voice:"en-US-EmmaNeural",mode:write?"write":"dry-run",count:jobs.length,examples:jobs.slice(0,6)},null,2));
 if(!write)return;
 let generated=0,skipped=0,failed=0;
 for(const [text,path] of jobs){const out=resolve(ROOT,path.slice(2)),tmp=out+".tmp.mp3";await mkdir(dirname(out),{recursive:true});try{try{const s=await stat(out);if(s.size>1024&&!force){skipped++;continue;}}catch(e){if(e.code!=="ENOENT")throw e;}await rm(tmp,{force:true});const py=process.env.PYTHON||(process.platform==="win32"?"python":"python3");const r=spawnSync(py,["-m","edge_tts","--voice","en-US-EmmaNeural","--text",text,"--write-media",tmp],{cwd:ROOT,encoding:"utf8",stdio:["ignore","pipe","pipe"],maxBuffer:2e6});if(r.error||r.status!==0)throw Error(r.error?.message||r.stderr||"edge-tts failed");const s=await stat(tmp);if(s.size<1024)throw Error("MP3 too small");await rename(tmp,out);generated++;}catch(e){failed++;await rm(tmp,{force:true});console.error(JSON.stringify({path,error:e.message}));}}
 console.log(JSON.stringify({generated,skipped,failed,total:jobs.length}));if(failed)process.exitCode=1;
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});