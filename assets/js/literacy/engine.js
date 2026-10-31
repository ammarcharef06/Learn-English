import { initSpeech, speak } from "../core/speech.js";
import { registerZeroSounds, LETTER_WORDS } from "../core/zero-audio.js";

const DATA_URL = new URL("../../curriculum/literacy/literacy-l0-l1.json", import.meta.url);
const KEY = "lea.literacy.progress.v1";
const $ = (s,r=document)=>r.querySelector(s);
const esc = v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let data, progress={}, stageId="L0";
let appHost=null;
function load(){try{progress=JSON.parse(localStorage.getItem(KEY)||"{}")}catch{progress={}}}
function localDate(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")}
function save(){try{localStorage.setItem(KEY,JSON.stringify(progress))}catch{}}
function state(id){return progress.lessons?.[id]||{attempts:0,best:0,mastered:false}}
function lessons(stage){return stage.units.flatMap(u=>u.lessons)}
function stageReadiness(id){
 const stage=data.stages.find(x=>x.id===id);
 if(!stage)return {ready:false,reasons:["مرحلة غير معروفة"]};
 const missing=[];
 if(id==="L1"&&!data.letters.every(letter=>state(letter.id).mastered))missing.push("إتقان مهارات الحروف الـ26 في يومين مختلفين لكل مهارة");
 if(id!=="L1"){
  for(const lesson of lessons(stage)){
   if(!lesson.items?.length)missing.push("مادة غير متاحة: "+lesson.title);
   else if(!state(lesson.id).mastered)missing.push("إتقان: "+lesson.title);
  }
 }
 const check=(data.transferChecks||[]).find(x=>x.id===id);
 if(check&&(progress.stageChecks?.[id]?.qualifyingDates||[]).length<2)missing.push("نجاح في تقييمين مؤجلين في يومين مختلفين");
 if(id==="L1"&&(progress.stageChecks?.L1?.qualifyingDates||[]).length<2)missing.push("اجتياز تقييم نقل الحروف في يومين مختلفين");
 return {ready:missing.length===0,reasons:missing};
}
function render(){
 const stage=data.stages.find(s=>s.id===stageId);
 const host=appHost || $("#literacy-app");
 const lessonCount=stage.units.reduce((n,u)=>n+u.lessons.length,0)+(stageId==="L1"?26:0);
 const mastered=stage.units.reduce((n,u)=>n+u.lessons.filter(l=>state(l.id).mastered).length,0)+(stageId==="L1"?data.letters.filter(x=>state(x.id).mastered).length:0);
 let unitHtml=stageId==="L1"?stage.units.map(u=>'<section class="lit-unit-nav"><h2>'+esc(u.title)+'</h2><p>'+esc(u.objective||"") +'</p><button type="button" data-unit="'+u.id+'">انتقل إلى المجموعة</button></section>').join(""):stage.units.map(u=>"<section><h2>"+esc(u.title)+"</h2>"+u.lessons.map(l=>'<button class="lit-lesson" data-lesson="'+l.id+'">'+esc(l.title)+' <small>'+(state(l.id).mastered?"متقن":(l.items?.length?"تدرّب":"قيد الإعداد"))+"</small></button>").join("")+"</section>").join("");
 const readiness=stageReadiness(stageId);
 host.innerHTML='<header class="lit-head"><a href="./index.html#/lessons">← العودة للأكاديمية</a><span>مسار محو أمية الإنجليزية</span></header><section class="lit-intro"><p class="eyebrow">LEARNING PATH · '+stageId+'</p><h1>'+esc(stage.title)+'</h1><p>'+esc(stage.outcome)+'</p><div class="lit-progress"><span style="width:'+(lessonCount?Math.round(mastered/lessonCount*100):0)+'%"></span></div><small>إتقان '+mastered+' من '+lessonCount+' عنصرًا تعليميًا</small><div class="lit-info" style="margin-top:14px">حالة المرحلة: <strong>'+(readiness.ready?"استوفت شروط الإتقان المسجلة":"لم تستوفِ جميع الشروط بعد") +'</strong>'+(readiness.ready?"":'<ul>'+readiness.reasons.slice(0,5).map(x=>'<li>'+esc(x)+'</li>').join("")+(readiness.reasons.length>5?"<li>ومتطلبات أخرى…</li>":"")+'</ul>')+'<p>يمكنك استكشاف المراحل، لكن الاستكشاف لا يعني اجتيازها.</p></div></section><nav class="lit-tabs">'+data.stages.map(s=>'<button data-stage="'+s.id+'" class="'+(s.id===stageId?"active":"")+'">'+s.id+' · '+esc(s.title)+'</button>').join("")+'</nav><div class="lit-layout"><aside class="lit-units">'+unitHtml+'</aside><main id="lesson-panel" class="lit-panel">'+(stageId==="L1"?renderLetters():renderStageStart())+'</main></div><section class="prea1-bridge"><p class="eyebrow">NEXT · PRE-A1</p><h2>'+esc(data.transition.title)+'</h2><p>'+esc(data.transition.description)+'</p><h3>شروط الانتقال</h3><ul>'+data.transition.entryRequirements.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><p class="bridge-note">'+esc(data.transition.boundary)+'</p></section><p id="notice" class="lit-notice" role="status"></p>';
 host.querySelectorAll("[data-stage]").forEach(b=>b.onclick=()=>{stageId=b.dataset.stage;render()});
 host.querySelectorAll("[data-lesson]").forEach(b=>b.onclick=()=>renderLesson(b.dataset.lesson));
 host.querySelectorAll("[data-letter]").forEach(b=>b.onclick=()=>renderLetterTask(b.dataset.letter));
 host.querySelectorAll("[data-unit]").forEach(b=>b.onclick=()=>host.querySelector('[data-group="'+b.dataset.unit+'"]')?.scrollIntoView({behavior:"smooth",block:"start"}));
 const transferButton=$("#open-transfer");if(transferButton)transferButton.onclick=renderTransferCheck;
}
function renderStageStart(){
 const check=(data.transferChecks||[]).find(x=>x.id===stageId);
 return '<div class="lit-empty"><div>🌱</div><h2>اختر درسًا للبدء</h2><p>ابدأ بالدرس الأول ثم تابع بالتدرج.</p>'+(check||stageId==="L1"?'<button type="button" id="open-transfer" class="lit-primary">ابدأ تقييم نقل المهارات</button>':'')+'</div>';
}
function renderTransferCheck(){
 let check=(data.transferChecks||[]).find(x=>x.id===stageId);
 const panel=$("#lesson-panel");
 if(stageId==="L1"){
  const alphabet=data.letters;
  check={id:"L1",title:"تقييم نقل مهارات الأبجدية",description:"اختبار تعرّف واسترجاع على حروف مختارة عشوائيًا. لا يختبر النطق أو الصوت أو الكتابة اليدوية.",passMark:.8,modality:"visual",items:alphabet.map((letter,index)=>({id:"l1-"+letter.id,prompt:"اختر الحرف الصغير المطابق لـ "+letter.upper,choices:[letter.lower,...alphabet.filter(x=>x.id!==letter.id).slice((index*3)%23,(index*3)%23+2).map(x=>x.lower)],answer:letter.lower}))};
 }
 if(!check||!panel)return;
 const today=localDate(),old=progress.stageChecks?.[stageId]||{attempts:0,qualifyingDates:[]};
 const prior=old.forms?.[today]||[];
 const pool=[...check.items];
 let chosen;
 if(prior.length)chosen=pool.filter(x=>prior.includes(x.id));
 else {
  const past=Object.values(old.forms||{}).map(ids=>[...ids].sort().join("|"));
  const candidates=[];
  for(let n=0;n<40;n++){const candidate=[...pool].sort(()=>Math.random()-.5).slice(0,5);if(!past.includes(candidate.map(x=>x.id).sort().join("|")))candidates.push(candidate);}
  chosen=(candidates[0]||[...pool].sort(()=>Math.random()-.5).slice(0,5));
  progress.stageChecks||={};progress.stageChecks[stageId]={...old,forms:{...(old.forms||{}),[today]:chosen.map(x=>x.id)}};save();
 }
 panel.innerHTML='<p class="eyebrow">TRANSFER CHECK · '+stageId+'</p><h2>'+esc(check.title)+'</h2><p>'+esc(check.description)+'</p>'+(check.modality==="visual-text-only"?'<div class="lit-info">هذا تقييم بصري وكتابي فقط، وليس اختبار استماع أو نطق.</div>':'')+chosen.map((item,i)=>'<fieldset class="lit-question"><legend>'+(i+1)+'. '+esc(item.prompt)+'</legend><div class="lit-choice-row">'+[...item.choices].sort(()=>Math.random()-.5).map(choice=>'<label class="lit-option"><input type="radio" name="transfer'+i+'" value="'+esc(choice)+'"> '+esc(choice)+'</label>').join('')+'</div></fieldset>').join('')+'<button type="button" id="submit-transfer" class="lit-primary">تصحيح التقييم</button><div id="transfer-feedback" role="status"></div><p class="lit-progress-note">النجاح هنا دليل نقل مهارة في هذا النموذج فقط، ولا يمنح إتقان المرحلة. يلزم تكرار التقييم بنموذج آخر في يوم مختلف واستيفاء جميع متطلبات المرحلة.</p>';
 $("#submit-transfer").onclick=()=>{
  let correct=0,answered=0;
  chosen.forEach((item,i)=>{const selected=panel.querySelector('input[name="transfer'+i+'"]:checked');if(selected){answered++;if(selected.value===item.answer)correct++;}});
  if(answered!==chosen.length){$("#transfer-feedback").textContent="أجب عن جميع الأسئلة أولًا.";return;}
  const score=correct/chosen.length,qualifying=[...new Set([...(old.qualifyingDates||[]),...(score>=check.passMark?[today]:[])])];
  progress.stageChecks||={};progress.stageChecks[stageId]={...old,attempts:(old.attempts||0)+1,qualifyingDates:qualifying,lastScore:score,lastAttempt:new Date().toISOString(),forms:{...(old.forms||{}),[today]:chosen.map(x=>x.id)}};
  save();
  $("#transfer-feedback").textContent="النتيجة: "+correct+"/"+chosen.length+" ("+Math.round(score*100)+"%). "+(score>=check.passMark?"بلغت حد النجاح لهذا النموذج.":"لم تبلغ حد النجاح؛ راجع الدروس ثم أعد المحاولة في وقت لاحق.")+" نماذج ناجحة في أيام مختلفة: "+qualifying.length+".";
 };
}
function renderLetters(){
 const units=data.stages.find(s=>s.id==="L1").units;
 const groups=units.map(u=>{
  const letters=data.letters.filter(x=>u.letterIds?.includes(x.id));
  return '<section class="lit-letter-group" data-group="'+u.id+'"><h3>'+esc(u.title)+'</h3><p>'+esc(u.objective||"")+'</p><div class="letter-grid">'+letters.map(x=>{
   const p=state(x.id),done=["case","name","identify","write"].filter(k=>(p.skills?.[k]?.correctDates||[]).length>=2).length;
   return '<button class="letter-card" data-letter="'+x.id+'"><b>'+x.upper+'</b><strong>'+x.lower+'</strong><small>'+esc(x.name)+'</small><span>'+(p.mastered?"متقن":done+"/4 مهارات")+'</span></button>';
  }).join("")+'</div><small class="lit-group-note">'+esc(u.completionNote||"")+'</small></section>';
 }).join("");
 const criteria=data.stages.find(s=>s.id==="L1").masteryCriteria||[];
 return '<h2>الحروف الإنجليزية الـ26</h2><button type="button" id="open-transfer" class="lit-primary">ابدأ تقييم نقل مهارات الحروف</button><p>تعلم مجموعة بعد أخرى. لكل حرف أربع مهارات: مطابقة الشكلين، واسترجاع الاسم، والتعرف إلى الصغير، وكتابة الشكلين من الذاكرة. هذه التدريبات لا تختبر نطق الصوت ولا الكتابة اليدوية بالقلم.</p>'+groups+'<section class="lit-mastery"><h3>ما معنى إتقان الحروف؟</h3><ul>'+criteria.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></section><div id="letter-task"></div>';
}
function renderLesson(id){
 const lesson=lessons(data.stages.find(s=>s.id===stageId)).find(l=>l.id===id);
 if(!lesson)return;
 const panel=$("#lesson-panel");
 const questions=lesson.items.map((item,i)=>{
  const control=item.input
   ? '<label class="lit-text-answer"><span>اكتب إجابتك بالإنجليزية</span><input type="text" dir="ltr" autocomplete="off" spellcheck="false" data-answer="'+i+'" placeholder="اكتب هنا"></label>'
   : '<div class="lit-choice-row">'+(item.choices||[]).map(c=>'<label class="lit-option"><input type="radio" name="q'+i+'" value="'+esc(c)+'"> '+esc(c)+'</label>').join("")+'</div>';
  return '<fieldset class="lit-question"><legend>'+(i+1)+'. '+esc(item.prompt)+'</legend>'+(item.audioText?'<button type="button" class="lit-audio-button" data-speak="'+esc(item.audioText)+'">🔊 استمع إلى التسجيل</button>':'')+control+'</fieldset>';
 }).join("");
 panel.innerHTML='<p class="eyebrow">'+lesson.id+'</p><h2>'+esc(lesson.title)+'</h2><p>'+esc(lesson.objective)+'</p>'+(lesson.audioRequiredForMastery?'<div class="lit-info">هذا تدريب بصري وكتابي على التهجئة فقط. لا يختبر التمييز السمعي أو نطق الصوت، ولن يُسجّل إتقان المهارة الصوتية قبل إضافة تسجيلات واختبار استماع.</div>':'')+(questions||'<div class="lit-info">هذا الدرس غير مفعّل بعد لعدم توفر مادته الأساسية (مثل التسجيل الصوتي أو نشاط التوجيه). لا يمكن احتسابه إتقانًا، وسيظل ظاهرًا بوضوح على أنه قيد الإعداد.</div>')+'<button id="check-lesson" class="lit-primary" '+(lesson.items.length?"":"disabled")+'>تحقق من الإجابات</button><div id="lesson-feedback" role="status"></div>';
 $("#check-lesson").onclick=()=>{
  let correct=0,answered=0;
  lesson.items.forEach((item,i)=>{
   let value="";
   if(item.input){const field=panel.querySelector('[data-answer="'+i+'"]');value=field?.value.trim()||"";}
   else {const selected=panel.querySelector('input[name="q'+i+'"]:checked');value=selected?.value||"";}
   if(value){answered++;const accepted=[item.answer,...(item.accepted||[])].map(x=>String(x).trim().replace(/\s+/g," "));if(accepted.includes(value.replace(/\s+/g," ")))correct++;}
  });
  if(answered!==lesson.items.length){$("#lesson-feedback").textContent="أكمل جميع الإجابات أولًا.";return}
  const old=state(id),score=lesson.items.length?correct/lesson.items.length:0,today=localDate();
  const qualifying=[...new Set([...(old.qualifyingDates||[]),...(score>=.9?[today]:[])])];
  progress.lessons||={};progress.lessons[id]={...old,attempts:(old.attempts||0)+1,best:Math.max(old.best||0,score),qualifyingDates:qualifying,mastered:old.mastered||(!lesson.audioRequiredForMastery&&qualifying.length>=2),visualPracticeComplete:lesson.audioRequiredForMastery&&qualifying.length>=2,lastScore:score,lastAttempt:new Date().toISOString()};
  save();render();renderLesson(id);
  $("#lesson-feedback").textContent="نتيجتك: "+correct+" من "+lesson.items.length+". "+(progress.lessons[id].mastered?"أُثبت الإتقان عبر يومين مختلفين.":"يلزم تحقيق 90% على الأقل في يومين مختلفين.");
 };
}
function renderLetterTask(id,selectedMode){
 const item=data.letters.find(x=>x.id===id),target=$("#letter-task");if(!item||!target)return;
 const modes=[
  {id:"case",label:"مطابقة الكبير والصغير",prompt:"اختر الحرف الكبير المطابق للحرف الصغير "+item.lower,answer:item.upper,choices:[item.upper,...data.letters.filter(x=>x.id!==id).slice((item.order*3)%20,(item.order*3)%20+2).map(x=>x.upper)]},
  {id:"name",label:"استرجاع اسم الحرف",prompt:"أي حرف اسمه "+item.name+"؟",answer:item.upper,choices:[item.upper,...data.letters.filter(x=>x.id!==id).slice((item.order*5+2)%21,(item.order*5+2)%21+2).map(x=>x.upper)]},
  {id:"identify",label:"التعرف إلى الحرف",prompt:"اختر الحرف الصغير الذي يقابل "+item.upper,answer:item.lower,choices:[item.lower,...data.letters.filter(x=>x.id!==id).slice((item.order*7+1)%21,(item.order*7+1)%21+2).map(x=>x.lower)]},
  {id:"write",label:"كتابة الحرف من الذاكرة",prompt:"اكتب الحرف الصغير ثم الكبير دون نسخ النموذج.",answer:item.lower+" "+item.upper,input:true}
 ];
 const mode=modes.find(m=>m.id===selectedMode)||modes[Math.floor(Math.random()*modes.length)],choices=[...new Set(mode.choices||[])].sort(()=>Math.random()-.5),old=state(id);
 target.innerHTML='<section class="lit-letter-task"><div class="lit-audio-tools"><button type="button" data-speak="'+item.lower+'">🔊 استمع إلى اسم الحرف</button><button type="button" data-speak="'+esc(LETTER_WORDS[item.lower]||"")+'">🔊 استمع إلى كلمة المثال: '+esc(LETTER_WORDS[item.lower]||"")+'</button></div><div class="lit-mode-tabs">'+modes.map(m=>'<button type="button" data-mode="'+m.id+'" class="'+(m.id===mode.id?"active":"")+'">'+m.label+'</button>').join("")+'</div><p class="eyebrow">'+mode.label+'</p><div class="letter-focus">'+item.lower+' <span>'+item.upper+'</span></div><p>'+mode.prompt+'</p>'+(mode.input?'<div class="lit-write-row"><input id="letter-write" type="text" dir="ltr" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="3" placeholder="m M"><button type="button" id="check-write">تحقق</button></div>':'<div class="lit-choice-row">'+choices.map(c=>'<button data-choice="'+esc(c)+'">'+esc(c)+'</button>').join("")+'</div>')+'<p id="letter-feedback" role="status"></p><small>اسم الحرف: '+esc(item.name)+'. لا يختبر هذا النشاط صوت الحرف أو نطقه.</small><p class="lit-progress-note">الإتقان يتطلب نجاحًا في المهارات الأربع في يومين مختلفين لكل مهارة.</p></section>';
 target.querySelectorAll("[data-mode]").forEach(btn=>btn.onclick=()=>renderLetterTask(id,btn.dataset.mode));
 const submitAnswer=(answer)=>{
  target.querySelectorAll("[data-choice]").forEach(x=>x.disabled=true);
  const ok=answer===mode.answer,today=localDate(),current=state(id),skills={...(current.skills||{})},skill={...(skills[mode.id]||{})};
  skill.attempts=(skill.attempts||0)+1;skill.correctDates=[...new Set([...(skill.correctDates||[]),...(ok?[today]:[])])];skills[mode.id]=skill;
  const mastered=modes.every(m=>(skills[m.id]?.correctDates||[]).length>=2);
  progress.lessons||={};progress.lessons[id]={...current,attempts:(current.attempts||0)+1,best:Math.max(current.best||0,ok?1:0),skills,mastered,lastScore:ok?1:0,lastAttempt:new Date().toISOString()};
  save();$("#letter-feedback").textContent=ok?"إجابة صحيحة. أعد هذا النوع في يوم آخر لترسيخ الاسترجاع.":"ليست الإجابة الصحيحة. راجع الحرف ثم حاول لاحقًا.";
  const card=target.closest(".lit-layout")?.querySelector('[data-letter="'+id+'"]');if(card)card.querySelector("span").textContent=mastered?"متقن":"تدرّب";
 };
 target.querySelectorAll("[data-choice]").forEach(btn=>btn.onclick=()=>submitAnswer(btn.dataset.choice));
 const writeButton=$("#check-write");if(writeButton)writeButton.onclick=()=>submitAnswer($("#letter-write").value.trim());
}
export async function bootLiteracy(host = $("#literacy-app")) {
 if (!host) return false;
 appHost=host;
 load();
 initSpeech();
 registerZeroSounds();
 const r=await fetch(DATA_URL);
 if(!r.ok)throw Error("curriculum unavailable");
 data=await r.json();
 render();
 host.addEventListener("click", event => {
  const button=event.target.closest("[data-speak]");
  if(button && host.contains(button)) {
   const played=speak(button.dataset.speak,{recordedOnly:true});
   const notice=$("#notice",host);
   if(notice) notice.textContent=played?"":"هذا التسجيل غير متوفر في بنك الصوت المعتمد؛ لم نشغّل صوتًا بديلًا.";
  }
 });
 return true;
}
