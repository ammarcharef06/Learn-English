const DATA_URL = new URL("../../curriculum/literacy/literacy-l0-l1.json", import.meta.url);
const KEY = "lea.literacy.progress.v1";
const $ = (s,r=document)=>r.querySelector(s);
const esc = v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let data, progress={}, stageId="L0";
function load(){try{progress=JSON.parse(localStorage.getItem(KEY)||"{}")}catch{progress={}}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(progress))}catch{}}
function state(id){return progress.lessons?.[id]||{attempts:0,best:0,mastered:false}}
function lessons(stage){return stage.units.flatMap(u=>u.lessons)}
function render(){
 const stage=data.stages.find(s=>s.id===stageId);
 const host=$("#literacy-app");
 const lessonCount=stage.units.reduce((n,u)=>n+u.lessons.length,0)+(stageId==="L1"?26:0);
 const mastered=stage.units.reduce((n,u)=>n+u.lessons.filter(l=>state(l.id).mastered).length,0)+(stageId==="L1"?data.letters.filter(x=>state(x.id).mastered).length:0);
 let unitHtml=stage.units.map(u=>"<section><h2>"+esc(u.title)+"</h2>"+u.lessons.map(l=>'<button class="lit-lesson" data-lesson="'+l.id+'">'+esc(l.title)+' <small>'+(state(l.id).mastered?"متقن":"تدرّب")+"</small></button>").join("")+"</section>").join("");
 host.innerHTML='<header class="lit-head"><a href="./index.html">← العودة للأكاديمية</a><span>مسار محو أمية الإنجليزية</span></header><section class="lit-intro"><p class="eyebrow">LEARNING PATH · '+stageId+'</p><h1>'+esc(stage.title)+'</h1><p>'+esc(stage.outcome)+'</p><div class="lit-progress"><span style="width:'+(lessonCount?Math.round(mastered/lessonCount*100):0)+'%"></span></div><small>إتقان '+mastered+' من '+lessonCount+' عنصرًا تعليميًا</small></section><nav class="lit-tabs">'+data.stages.map(s=>'<button data-stage="'+s.id+'" class="'+(s.id===stageId?"active":"")+'">'+s.id+' · '+esc(s.title)+'</button>').join("")+'</nav><div class="lit-layout"><aside class="lit-units">'+unitHtml+'</aside><main id="lesson-panel" class="lit-panel">'+(stageId==="L1"?renderLetters():'<div class="lit-empty"><div>🌱</div><h2>اختر درسًا للبدء</h2><p>ابدأ بالدرس الأول ثم تابع بالتدرج.</p></div>')+'</main></div><section class="prea1-bridge"><p class="eyebrow">NEXT · PRE-A1</p><h2>'+esc(data.transition.title)+'</h2><p>'+esc(data.transition.description)+'</p><h3>شروط الانتقال</h3><ul>'+data.transition.entryRequirements.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><p class="bridge-note">'+esc(data.transition.boundary)+'</p></section><p id="notice" class="lit-notice" role="status"></p>';
 host.querySelectorAll("[data-stage]").forEach(b=>b.onclick=()=>{stageId=b.dataset.stage;render()});
 host.querySelectorAll("[data-lesson]").forEach(b=>b.onclick=()=>renderLesson(b.dataset.lesson));
 host.querySelectorAll("[data-letter]").forEach(b=>b.onclick=()=>renderLetterTask(b.dataset.letter));
}
function renderLetters(){
 return '<h2>الحروف الإنجليزية الـ26</h2><p>تعرف إلى الشكل الكبير والصغير واسم الحرف. ستضاف الأصوات بعد اعتماد تسجيلات موثوقة.</p><div class="letter-grid">'+data.letters.map(x=>'<button class="letter-card" data-letter="'+x.id+'"><b>'+x.upper+'</b><strong>'+x.lower+'</strong><small>'+esc(x.name)+'</small><span>'+(state(x.id).mastered?"متقن":"تدرّب")+'</span></button>').join("")+'</div><div id="letter-task"></div>';
}
function renderLesson(id){
 const lesson=lessons(data.stages.find(s=>s.id===stageId)).find(l=>l.id===id);
 if(!lesson)return;
 const panel=$("#lesson-panel");
 let questions=lesson.items.map((item,i)=>'<fieldset class="lit-question"><legend>'+esc(item.prompt)+'</legend>'+item.choices.map(c=>'<label><input type="radio" name="q'+i+'" value="'+esc(c)+'"> '+esc(c)+'</label>').join("")+'</fieldset>').join("");
 panel.innerHTML='<p class="eyebrow">'+lesson.id+'</p><h2>'+esc(lesson.title)+'</h2><p>'+esc(lesson.objective)+'</p>'+(questions||'<div class="lit-info">هذا الدرس تمهيدي. ستضاف له مادة صوتية وتمارين بعد مراجعة الأصول التعليمية.</div>')+'<button id="check-lesson" class="lit-primary" '+(lesson.items.length?"":"disabled")+'>تحقق من الإجابات</button><div id="lesson-feedback" role="status"></div>';
 $("#check-lesson").onclick=()=>{
  let correct=0,answered=0;
  lesson.items.forEach((item,i)=>{const p=panel.querySelector('input[name="q'+i+'"]:checked');if(p){answered++;if(p.value===item.answer)correct++}});
  if(answered!==lesson.items.length){$("#lesson-feedback").textContent="أجب عن جميع الأسئلة أولًا.";return}
  const old=state(id),score=lesson.items.length?correct/lesson.items.length:0;
  progress.lessons||={};const today=new Date().toISOString().slice(0,10);const qualifying=[...new Set([...(old.qualifyingDates||[]),...(score>=.9?[today]:[])])];progress.lessons[id]={attempts:old.attempts+1,best:Math.max(old.best,score),qualifyingDates:qualifying,mastered:old.mastered||qualifying.length>=2,lastScore:score,lastAttempt:new Date().toISOString()};
  save();render();renderLesson(id);$("#lesson-feedback").textContent="نتيجتك: "+correct+" من "+lesson.items.length+". "+(progress.lessons[id].mastered?"تم تسجيل الإتقان.":"يلزم تحقيق 90% على الأقل في يومين مختلفين.");
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
 const mode=modes.find(m=>m.id===selectedMode)||modes[Math.floor(Math.random()*modes.length)],choices=[...new Set(mode.choices)].sort(()=>Math.random()-.5),old=state(id);
 target.innerHTML='<section class="lit-letter-task"><div class="lit-mode-tabs">'+modes.map(m=>'<button type="button" data-mode="'+m.id+'" class="'+(m.id===mode.id?"active":"")+'">'+m.label+'</button>').join("")+'</div><p class="eyebrow">'+mode.label+'</p><div class="letter-focus">'+item.lower+' <span>'+item.upper+'</span></div><p>'+mode.prompt+'</p>'+(mode.input?'<div class="lit-write-row"><input id="letter-write" type="text" dir="ltr" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="3" placeholder="m M"><button type="button" id="check-write">تحقق</button></div>':'<div class="lit-choice-row">'+choices.map(c=>'<button data-choice="'+esc(c)+'">'+esc(c)+'</button>').join("")+'</div>')+'<p id="letter-feedback" role="status"></p><small>اسم الحرف: '+esc(item.name)+'. لا يختبر هذا النشاط صوت الحرف أو نطقه.</small><p class="lit-progress-note">الإتقان يتطلب نجاحًا في المهارات الأربع في يومين مختلفين لكل مهارة.</p></section>';
 target.querySelectorAll("[data-mode]").forEach(btn=>btn.onclick=()=>renderLetterTask(id,btn.dataset.mode));
 const submitAnswer=(answer)=>{
  target.querySelectorAll("[data-choice]").forEach(x=>x.disabled=true);
  const ok=answer===mode.answer,today=new Date().toISOString().slice(0,10),current=state(id),skills={...(current.skills||{})},skill={...(skills[mode.id]||{})};
  skill.attempts=(skill.attempts||0)+1;skill.correctDates=[...new Set([...(skill.correctDates||[]),...(ok?[today]:[])])];skills[mode.id]=skill;
  const mastered=modes.every(m=>(skills[m.id]?.correctDates||[]).length>=2);
  progress.lessons||={};progress.lessons[id]={...current,attempts:(current.attempts||0)+1,best:Math.max(current.best||0,ok?1:0),skills,mastered,lastScore:ok?1:0,lastAttempt:new Date().toISOString()};
  save();$("#letter-feedback").textContent=ok?"إجابة صحيحة. أعد هذا النوع في يوم آخر لترسيخ الاسترجاع.":"ليست الإجابة الصحيحة. راجع الحرف ثم حاول لاحقًا.";
  const card=target.closest(".lit-layout")?.querySelector('[data-letter="'+id+'"]');if(card)card.querySelector("span").textContent=mastered?"متقن":"تدرّب";
 };
 target.querySelectorAll("[data-choice]").forEach(btn=>btn.onclick=()=>submitAnswer(btn.dataset.choice));
 const writeButton=$("#check-write");if(writeButton)writeButton.onclick=()=>submitAnswer($("#letter-write").value.trim());
}
async function boot(){load();const r=await fetch(DATA_URL);if(!r.ok)throw Error("curriculum unavailable");data=await r.json();render()}
boot().catch(e=>{console.error(e);$("#literacy-app").textContent="تعذر تحميل مسار التأسيس."});
