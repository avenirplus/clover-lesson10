(()=>{
'use strict';
const stage=document.getElementById('stage');
if(!stage)return;
function selected(){return String(window.getSelection?.()?.toString()||'').trim();}
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
 if(inQuestion){
  stage.dataset.lessonStage=state.stage||'problem';
  stage.dataset.long=String(item?.question||'').length>155?'1':'0';
 }else{
  delete stage.dataset.lessonStage;
  delete stage.dataset.long;
 }
 document.querySelectorAll('.where-am-i').forEach(n=>n.remove());
 if(inQuestion&&['answer','reason','wrong','translation','output'].includes(state.stage)&&item?.mapPath?.length){
  const n=document.createElement('div');
  n.className='where-am-i';
  n.innerHTML='<span>Now</span>'+item.mapPath.map((x,i)=>`<b>${x}</b>${i<item.mapPath.length-1?'<i>›</i>':''}`).join('');
  document.querySelector('.topline')?.insertAdjacentElement('afterend',n);
 }
}
window.addEventListener('lesson:render',e=>enhance(e.detail||{}));
requestAnimationFrame(()=>enhance(window.LessonEngine?.getState?.()||{}));
})();