(()=>{
'use strict';
const stage=document.getElementById('stage');
if(!stage)return;
function selected(){return String(window.getSelection?.()?.toString()||'').trim();}
let arranging=false;
function arrangeBackupControls(){
 if(arranging)return;
 arranging=true;
 try{
  const state=window.LessonEngine?.getState?.()||{};
  if(state.stage!=='output')return;
  const practice=stage.querySelector('.backup-practice');
  const chunks=practice?.querySelector('.backup-chunks');
  const cue=practice?.querySelector('.backup-cue');
  if(!practice||!chunks||!cue)return;

  let controls=practice.querySelector('.backup-inline-controls');
  if(!controls){
   controls=document.createElement('div');
   controls.className='output-actions backup-inline-controls';
  }

  const allButtons=[...stage.querySelectorAll('button')];
  const show=allButtons.find(b=>b.dataset.action==='show-all');
  const hide=allButtons.find(b=>b.dataset.action==='hide-more');
  const listen=allButtons.find(b=>b.dataset.action==='speak-answer');
  [show,hide,listen].filter(Boolean).forEach(button=>controls.appendChild(button));

  const oldRows=[...stage.querySelectorAll('.output-panel > .output-actions')].filter(row=>row!==controls);
  oldRows.forEach(row=>{if(!row.children.length)row.remove();});

  chunks.insertAdjacentElement('afterend',controls);
  controls.insertAdjacentElement('afterend',cue);
 }
 finally{arranging=false;}
}
function refreshBackup(){
 const state=window.LessonEngine?.getState?.()||{};
 const item=window.LessonEngine?.getCurrent?.();
 if(state.stage!=='output'||!item)return;
 const cue=stage.querySelector('.backup-cue');
 if(cue){
  const ja=Array.isArray(item.outputJaChunks)&&item.outputJaChunks.length?item.outputJaChunks:[item.outputCue||item.translation||''].filter(Boolean);
  cue.replaceChildren();
  const label=document.createElement('span');label.className='backup-ja-label';label.textContent='順送り訳';
  const line=document.createElement('span');line.className='backup-ja-line';line.textContent=ja.join(' / ');
  cue.append(label,line);
 }
 stage.querySelectorAll('.backup-natural').forEach(n=>n.remove());
 const natural=item.outputNaturalJa||'';
 if(natural){
  const practice=stage.querySelector('.backup-practice');
  if(practice){
   const box=document.createElement('div');box.className='backup-natural';
   const b=document.createElement('b');b.textContent='自然な訳';
   const span=document.createElement('span');span.textContent=natural;
   box.append(b,span);practice.insertAdjacentElement('afterend',box);
  }
 }
 arrangeBackupControls();
}
stage.addEventListener('click',e=>{
 const state=window.LessonEngine?.getState?.()||{};
 const item=window.LessonEngine?.getCurrent?.();
 const button=e.target.closest('button');
 if(state.stage==='output'&&button?.dataset.action==='speak-answer'&&item){
  e.preventDefault();
  e.stopImmediatePropagation();
  const text=item.outputAudio||(item.outputChunks||[]).join(' ')||item.completed||'';
  window.LessonAudio?.speak({...item,audioA:text},1);
  return;
 }
 if(!button&&selected()){
  e.preventDefault();
  e.stopImmediatePropagation();
 }
},true);
function enhance(state){
 const item=window.LessonEngine?.getCurrent?.();
 const inQuestion=state.slideIndex>=0&&state.slideIndex<(window.LESSON_DATA||[]).length;
 if(inQuestion){stage.dataset.lessonStage=state.stage||'problem';stage.dataset.long=String(item?.question||'').length>155?'1':'0';}
 else{delete stage.dataset.lessonStage;delete stage.dataset.long;}
 document.querySelectorAll('.where-am-i').forEach(n=>n.remove());
 if(inQuestion&&['answer','reason','wrong','translation','output'].includes(state.stage)&&item?.mapPath?.length){
  const n=document.createElement('div');n.className='where-am-i';
  n.innerHTML='<span>Now</span>'+item.mapPath.map((x,i)=>`<b>${x}</b>${i<item.mapPath.length-1?'<i>›</i>':''}`).join('');
  document.querySelector('.topline')?.insertAdjacentElement('afterend',n);
 }
 refreshBackup();
}
const observer=new MutationObserver(()=>{
 const state=window.LessonEngine?.getState?.()||{};
 if(state.stage!=='output')return;
 requestAnimationFrame(()=>{refreshBackup();arrangeBackupControls();});
});
observer.observe(stage,{childList:true,subtree:true});
window.CloverBackupView=Object.freeze({refresh:refreshBackup});
window.addEventListener('lesson:render',e=>enhance(e.detail||{}));
requestAnimationFrame(()=>enhance(window.LessonEngine?.getState?.()||{}));
})();