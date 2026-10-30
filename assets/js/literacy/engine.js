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
  progress.lessons||={};progress.lessons[id]={attempts:old.attempts+1,best:Math.max(old.best,score),mastered:old.mastered||(old.attempts+1>=2&&score>=.9),lastScore:score,lastAttempt:new Date().toISOString()};
  save();render();renderLesson(id);$("#lesson-feedback").textContent="نتيجتك: "+correct+" من "+lesson.items.length+". "+(progress.lessons[id].mastered?"تم تسجيل الإتقان.":"يلزم محاولتان على الأقل ونتيجة 90% في إحداهما أو أفضل أداء متكرر.");
 };
}
function renderLetterTask(id){
 const item=data.letters.find(x=>x.id===id),target=$("#letter-task");if(!item||!target)return;
 const distractors=data.letters.filter(x=>x.id!==id).slice((item.order*3)%20,(item.order*3)%20+2);
 const choices=[item.upper,...distractors.map(x=>x.upper)].sort(()=>Math.random()-.5);
 target.innerHTML='<section class="lit-letter-task"><p class="eyebrow">تدريب اسم الحرف وشكله</p><div class="letter-focus">'+item.lower+' <span>'+item.upper+'</span></div><p>اختر الحرف الكبير المطابق للحرف الصغير '+item.lower+'</p><div class="lit-choice-row">'+choices.map(c=>'<button data-choice="'+c+'">'+c+'</button>').join("")+'</div><p id="letter-feedback" role="status"></p><small>اسم الحرف: '+esc(item.name)+'. هذا ليس اختبارًا لصوت الحرف.</small></section>';
 target.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>{
  const ok=b.dataset.choice===item.upper,old=state(id),attempts=old.attempts+1;
  progress.lessons||={};progress.lessons[id]={attempts,best:Math.max(old.best,ok?1:0),mastered:old.mastered||(attempts>=2&&ok),lastScore:ok?1:0,lastAttempt:new Date().toISOString()};
  save();$("#letter-feedback").textContent=ok?"صحيح. أعد التدريب في محاولة لاحقة لتأكيد الاسترجاع.":"ليست المطابقة الصحيحة؛ راجع الشكلين ثم أعد المحاولة.";
 });
}
async function boot(){load();const r=await fetch(DATA_URL);if(!r.ok)throw Error("curriculum unavailable");data=await r.json();render()}
boot().catch(e=>{console.error(e);$("#literacy-app").textContent="تعذر تحميل مسار التأسيس."});
