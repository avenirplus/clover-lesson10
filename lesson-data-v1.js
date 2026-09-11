(()=>{
'use strict';
const src=(window.CLOVER_LESSON10&&Array.isArray(window.CLOVER_LESSON10.items))?window.CLOVER_LESSON10.items:[];
const mapTop={1:'Grammar & Structure',2:'Rewriting & Usage',3:'Vocabulary & Meaning',4:'Conversation',5:'Word Order'};
function safeAudioQ(x){if(x.type==='order')return '';return String(x.question||'').replace(/\([^)]*　[^)]*\)/g,' blank ').replace(/（[^）]*　[^）]*）/g,' blank ');}
window.LESSON_DATA=src.map(x=>{
 const focus=String(x.focus||'').trim(),branch=focus.split(/[／｜：/]/)[0].trim()||mapTop[x.section];
 return {id:x.id,key:x.key,section:String(x.section),sectionName:x.sectionName,format:x.type,focus,
 question:x.question,choices:x.choices||[],options:x.choices||[],answer:x.answer,completed:x.completed,translation:x.translation,
 audioQ:safeAudioQ(x),audioA:x.completed,outputAudio:x.outputAudio||'',hints:(x.hints||[]).map((v,i)=>({en:['Where is the clue?','What pattern do you remember?','How does that decide it?'][Math.min(i,2)],jp:v,lookAt:[]})),
 correct:x.why||[],wrong:x.wrong||[],method:x.decision||'',outputCue:x.output?.jp||x.translation||'',outputChunks:x.output?.phrases||[x.completed],tokens:x.tokens||[],acceptedAnswers:x.acceptedAnswers||[],
 mapPath:[mapTop[x.section],branch,focus].filter((v,i,a)=>v&&a.indexOf(v)===i)};
});
})();