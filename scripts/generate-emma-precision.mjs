#!/usr/bin/env node
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { LETTER_IDS, LETTER_WORDS, DIGRAPH_SOUND_IDS, DIGRAPH_WORDS } from "../assets/js/core/zero-audio.js";
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),".."),OUT=resolve(ROOT,"assets/audio/zero/precision");
const IPA={"sh":"ʃ","ch":"tʃ","th-voiceless":"θ","th-voiced":"ð","ph":"f","ck":"k","ng":"ŋ","oo-long":"uː","oo-short":"ʊ","ee":"iː","ea":"iː","ou":"aʊ"};
const esc=s=>s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
async function main(){const write=process.argv.includes("--write"),force=process.argv.includes("--force");const ref=JSON.parse(await readFile(resolve(ROOT,"curriculum/literacy/phoneme-grapheme-reference.json"),"utf8"));const jobs=[];
for(const c of LETTER_IDS)jobs.push({kind:"letter-name",text:c.toUpperCase(),file:"name-"+c+".mp3"});
for(const [c,w] of Object.entries(LETTER_WORDS))jobs.push({kind:"letter-word",text:w,file:"word-letter-"+c+".mp3"});
for(const id of DIGRAPH_SOUND_IDS)if(IPA[id])jobs.push({kind:"grapheme-phoneme",text:IPA[id],ipa:IPA[id],file:"sound-"+id+".mp3"});
for(const [id,w] of Object.entries(DIGRAPH_WORDS))jobs.push({kind:"digraph-word",text:w,file:"word-"+id+".mp3"});
for(const p of ref.phonemes||[]){const ipa=p.ipa.replaceAll("/","");if(!jobs.some(j=>j.ipa===ipa))jobs.push({kind:"consonant-phoneme",text:ipa,ipa,file:"phoneme-"+slug(ipa)+".mp3"});}
console.log(JSON.stringify({voice:"en-US-Emma:DragonHDLatestNeural",mode:write?"write":"dry-run",jobs:jobs.length,credentialsReady:Boolean(process.env.SPEECH_KEY&&process.env.SPEECH_REGION),counts:jobs.reduce((a,j)=>(a[j.kind]=(a[j.kind]||0)+1,a),{})},null,2));if(!write)return;
if(!process.env.SPEECH_KEY||!process.env.SPEECH_REGION)throw Error("Set SPEECH_KEY and SPEECH_REGION. No voice fallback is permitted.");
for(const j of jobs){const out=resolve(OUT,j.file),tmp=out+".tmp.mp3";await mkdir(dirname(out),{recursive:true});try{try{const s=await stat(out);if(s.size>1024&&!force)continue;}catch(e){if(e.code!=="ENOENT")throw e;}
const voice="en-US-Emma:DragonHDLatestNeural";const inner=j.ipa?("<phoneme alphabet=\"ipa\" ph=\""+esc(j.ipa)+"\">"+esc(j.text)+"</phoneme>"):esc(j.text);
const ssml="<speak version=\"1.0\" xmlns=\"http://www.w3.org/2001/10/synthesis\" xml:lang=\"en-US\"><voice name=\""+voice+"\">"+inner+"</voice></speak>";
const url="https://"+process.env.SPEECH_REGION+".tts.speech.microsoft.com/cognitiveservices/v1";const res=await fetch(url,{method:"POST",headers:{"Ocp-Apim-Subscription-Key":process.env.SPEECH_KEY,"Content-Type":"application/ssml+xml","X-Microsoft-OutputFormat":"audio-24khz-48kbitrate-mono-mp3"},body:ssml});if(!res.ok)throw Error("Azure Speech HTTP "+res.status+": "+(await res.text()).slice(0,300));const bytes=Buffer.from(await res.arrayBuffer());if(bytes.length<1024)throw Error("Audio response too small");await rm(tmp,{force:true});await writeFile(tmp,bytes);await rename(tmp,out);
}catch(e){await rm(tmp,{force:true});console.error(JSON.stringify({file:j.file,error:e.message}));throw e;}}console.log("Generated "+jobs.length+" precision Emma HD files.");}
main().catch(e=>{console.error(e.message);process.exitCode=1;});