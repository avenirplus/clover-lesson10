(()=>{
'use strict';
if(window.LESSON_META?.teacherMode===false)return;
const toolbar=document.querySelector('.toolbar');
if(!toolbar)return;

const BOARD_STORE='clover.lesson10.board.v1';
const BACKUP_STORE='clover.lesson10.backup.overrides.v1';
const params=new URLSearchParams(location.search);
const year=params.get('year')||'';
const className=params.get('class')||params.get('klass')||params.get('classId')||'';
const classScope=className?`class:${year||'na'}:${className}`:'';
const current=()=>window.LessonEngine?.getCurrent?.()||{};
const currentId=()=>current().id||'note';
function escapeHtml(s=''){return String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));}
function toast(message){const t=document.getElementById('toast');if(!t)return;t.textContent=message;t.hidden=false;setTimeout(()=>{t.hidden=true;},1400);}
async function copyText(text){try{await navigator.clipboard.writeText(String(text||''));toast('コピーしました');}catch(_){toast('コピーできませんでした');}}
function readStore(key){try{return JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(_){return {};}}
function writeStore(key,value){localStorage.setItem(key,JSON.stringify(value));}
function toolButton(label){const b=document.createElement('button');b.type='button';b.className='icon-btn teacher-tool-btn';b.textContent=label;return b;}

function basePhrase(item){
 const d=item.outputDefault||{};
 return {en:[...(d.en||item.outputChunks||[])],ja:[...(d.ja||item.outputJaChunks||[])],naturalJa:d.naturalJa||item.outputNaturalJa||item.translation||''};
}
function getOverride(item,scope){return readStore(BACKUP_STORE)?.[scope]?.[item.id]||null;}
function effectivePhrase(item,scopeOverride){
 const base=basePhrase(item);
 const all=readStore(BACKUP_STORE);
 const common=all.default?.[item.id]||null;
 const scoped=scopeOverride?all[scopeOverride]?.[item.id]||null:null;
 const ov=scoped||common;
 if(!ov)return base;
 const en=Array.isArray(ov.en)&&ov.en.length?ov.en:base.en;
 const ja=Array.isArray(ov.ja)&&ov.ja.length===en.length?ov.ja:base.ja;
 return {en:[...en],ja:[...ja],naturalJa:ov.naturalJa||base.naturalJa};
}
function applyPhrase(item,phrase){
 item.outputChunks=[...phrase.en];
 item.outputJaChunks=[...phrase.ja];
 item.outputNaturalJa=phrase.naturalJa||'';
 item.outputCue=item.outputJaChunks.join(' / ');
 item.outputAudio=item.outputChunks.join(' ');
}
function applyAll(){
 for(const item of (window.LESSON_DATA||[]))applyPhrase(item,effectivePhrase(item,classScope));
}
applyAll();
window.CloverBackupOverrides=Object.freeze({applyAll,classScope});

const boardButton=toolButton('📝 Board');
const bankButton=toolButton('📚 Bank');
toolbar.insertBefore(boardButton,document.getElementById('resetBtn'));
toolbar.insertBefore(bankButton,document.getElementById('resetBtn'));

const board=document.createElement('div');
board.className='teacher-board-modal';board.hidden=true;
board.innerHTML=`<section class="teacher-board-card"><header><div><small>TEACHER BOARD</small><h2>授業説明ボード</h2></div><button type="button" data-close>×</button></header><div class="board-tools"><button type="button" data-cmd="bold"><b>B</b></button><button type="button" data-cmd="underline"><u>U</u></button><button type="button" data-color="#b42318">赤</button><button type="button" data-color="#175cd3">青</button><button type="button" data-color="#067647">緑</button><button type="button" data-highlight="#fff2a8">蛍光</button><button type="button" data-clear>書式解除</button><button type="button" data-load="completed">完成英文</button><button type="button" data-load="output">Back Up</button><button type="button" data-load="translation">日本語</button><button type="button" data-save>保存</button><button type="button" data-wipe>全消去</button></div><div class="teacher-board-editor" contenteditable="true" spellcheck="false"></div><footer>教材正本は変更せず、このボードだけを問題別に保存します。</footer></section>`;
document.body.appendChild(board);
const editor=board.querySelector('.teacher-board-editor');
function readBoard(){return readStore(BOARD_STORE);}
function writeBoard(html){const all=readBoard();all[currentId()]={html,updatedAt:new Date().toISOString()};writeStore(BOARD_STORE,all);}
function openBoard(){const all=readBoard();editor.innerHTML=all[currentId()]?.html||`<p>${escapeHtml(current().completed||'')}</p>`;board.hidden=false;editor.focus();}
function closeBoard(){board.hidden=true;}
boardButton.addEventListener('click',e=>{e.stopPropagation();openBoard();});
board.querySelector('[data-close]').addEventListener('click',closeBoard);
board.addEventListener('click',e=>{if(e.target===board)closeBoard();});
board.addEventListener('keydown',e=>e.stopPropagation());
board.querySelectorAll('[data-cmd]').forEach(b=>b.addEventListener('click',()=>{editor.focus();document.execCommand(b.dataset.cmd,false,null);}));
board.querySelectorAll('[data-color]').forEach(b=>b.addEventListener('click',()=>{editor.focus();document.execCommand('foreColor',false,b.dataset.color);}));
board.querySelectorAll('[data-highlight]').forEach(b=>b.addEventListener('click',()=>{editor.focus();document.execCommand('hiliteColor',false,b.dataset.highlight);}));
board.querySelector('[data-clear]').addEventListener('click',()=>{editor.focus();document.execCommand('removeFormat',false,null);});
board.querySelectorAll('[data-load]').forEach(b=>b.addEventListener('click',()=>{const item=current();let text='';if(b.dataset.load==='completed')text=item.completed||'';if(b.dataset.load==='output')text=(item.outputChunks||[]).join(' / ');if(b.dataset.load==='translation')text=item.translation||'';editor.focus();document.execCommand('insertText',false,text);}));
board.querySelector('[data-save]').addEventListener('click',()=>{writeBoard(editor.innerHTML);toast('保存しました');});
board.querySelector('[data-wipe]').addEventListener('click',()=>{if(confirm('この問題のボードを消去しますか？')){editor.innerHTML='';writeBoard('');}});

const bank=document.createElement('div');
bank.className='teacher-bank-modal';bank.hidden=true;
bank.innerHTML=`<section class="teacher-bank-card"><header><div><small>SENTENCE BANK / BACK UP EDITOR</small><h2>現在の問題データ</h2></div><button type="button" data-close>×</button></header><div class="teacher-bank-body"></div></section>`;
document.body.appendChild(bank);
const bankBody=bank.querySelector('.teacher-bank-body');
function staticRow(title,text,key){return `<article class="bank-static"><h3>${escapeHtml(title)}</h3><pre>${escapeHtml(text||'')}</pre><div><button type="button" data-copy="${key}">Copy</button><button type="button" data-board="${key}">Boardへ</button></div></article>`;}
function editorHtml(item,scope){
 const phrase=effectivePhrase(item,scope==='default'?'':scope);
 const scopeOptions=`<option value="default">教師共通</option>${classScope?`<option value="${escapeHtml(classScope)}" ${scope===classScope?'selected':''}>このクラス${className?`（${escapeHtml(className)}）`:''}</option>`:''}`;
 return `<section class="backup-editor-card"><div class="backup-editor-head"><div><h3>Back Up Editor</h3><p>英語・順送り訳・自然な訳を編集すると、Back Up画面と音声へすぐ反映されます。</p></div><label>保存先 <select data-scope>${scopeOptions}</select></label></div><div class="backup-editor-rows">${phrase.en.map((en,i)=>phraseRow(en,phrase.ja[i]||'',i)).join('')}</div><button type="button" data-add-phrase>＋ フレーズ</button><label class="natural-ja-field">自然な訳<textarea data-natural>${escapeHtml(phrase.naturalJa||'')}</textarea></label><div class="backup-live-preview"><b>プレビュー</b><div data-preview-en></div><div data-preview-ja></div><small data-preview-natural></small></div><div class="backup-editor-actions"><button type="button" data-save-backup class="primary-edit">保存してスライドへ反映</button><button type="button" data-reset-backup>この保存先を初期値に戻す</button></div></section>`;
}
function phraseRow(en,ja,i){return `<div class="backup-editor-row" data-row><span class="phrase-no">${i+1}</span><label>English<input data-en value="${escapeHtml(en)}"></label><label>順送り訳<input data-ja value="${escapeHtml(ja)}"></label><div class="row-actions"><button type="button" data-up title="上へ">↑</button><button type="button" data-down title="下へ">↓</button><button type="button" data-delete title="削除">×</button></div></div>`;}
function rows(){return [...bankBody.querySelectorAll('[data-row]')];}
function renumber(){rows().forEach((r,i)=>{const n=r.querySelector('.phrase-no');if(n)n.textContent=String(i+1);});preview();}
function readEditor(){const rs=rows();return {en:rs.map(r=>r.querySelector('[data-en]')?.value.trim()).filter(Boolean),ja:rs.map(r=>r.querySelector('[data-ja]')?.value.trim()),naturalJa:bankBody.querySelector('[data-natural]')?.value.trim()||''};}
function preview(){
 const p=readEditor();
 const en=bankBody.querySelector('[data-preview-en]'),ja=bankBody.querySelector('[data-preview-ja]'),nat=bankBody.querySelector('[data-preview-natural]');
 if(en)en.textContent=p.en.join(' / ');if(ja)ja.textContent=p.ja.join(' / ');if(nat)nat.textContent=p.naturalJa?`自然な訳：${p.naturalJa}`:'';
}
function bindEditor(item){
 bankBody.querySelectorAll('[data-en],[data-ja],[data-natural]').forEach(el=>el.addEventListener('input',preview));
 bankBody.querySelector('[data-add-phrase]')?.addEventListener('click',()=>{const wrap=bankBody.querySelector('.backup-editor-rows');wrap.insertAdjacentHTML('beforeend',phraseRow('','',rows().length));bindRowEvents();renumber();rows().at(-1)?.querySelector('[data-en]')?.focus();});
 bankBody.querySelector('[data-scope]')?.addEventListener('change',e=>renderBank(e.target.value));
 bankBody.querySelector('[data-save-backup]')?.addEventListener('click',()=>{
  const scope=bankBody.querySelector('[data-scope]')?.value||'default';
  const p=readEditor();
  if(!p.en.length)return toast('英語フレーズを1つ以上入れてください');
  while(p.ja.length<p.en.length)p.ja.push('');
  const all=readStore(BACKUP_STORE);all[scope]=all[scope]||{};all[scope][item.id]={...p,updatedAt:new Date().toISOString()};writeStore(BACKUP_STORE,all);
  applyPhrase(item,effectivePhrase(item,classScope));window.CloverBackupView?.refresh?.();toast('Back Upを保存して反映しました');preview();
 });
 bankBody.querySelector('[data-reset-backup]')?.addEventListener('click',()=>{
  const scope=bankBody.querySelector('[data-scope]')?.value||'default';const all=readStore(BACKUP_STORE);
  if(all[scope]){delete all[scope][item.id];if(!Object.keys(all[scope]).length)delete all[scope];writeStore(BACKUP_STORE,all);}
  applyPhrase(item,effectivePhrase(item,classScope));renderBank(scope);window.CloverBackupView?.refresh?.();toast('この保存先を初期値に戻しました');
 });
 bindRowEvents();preview();
}
function bindRowEvents(){
 rows().forEach(r=>{
  if(r.dataset.bound)return;r.dataset.bound='1';
  r.querySelector('[data-up]')?.addEventListener('click',()=>{const prev=r.previousElementSibling;if(prev)r.parentNode.insertBefore(r,prev);renumber();});
  r.querySelector('[data-down]')?.addEventListener('click',()=>{const next=r.nextElementSibling;if(next)r.parentNode.insertBefore(next,r);renumber();});
  r.querySelector('[data-delete]')?.addEventListener('click',()=>{if(rows().length<=1)return toast('フレーズは1つ以上必要です');r.remove();renumber();});
 });
}
function renderBank(scope='default'){
 const item=current();
 const values={question:item.question||'',completed:item.completed||'',translation:item.translation||'',focus:item.focus||''};
 bankBody.innerHTML=editorHtml(item,scope)+staticRow('Original Problem',values.question,'question')+staticRow('完成英文',values.completed,'completed')+staticRow('公式訳',values.translation,'translation')+staticRow('Grammar Focus',values.focus,'focus');
 bankBody.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>copyText(values[b.dataset.copy])));
 bankBody.querySelectorAll('[data-board]').forEach(b=>b.addEventListener('click',()=>{openBoard();editor.focus();document.execCommand('insertText',false,values[b.dataset.board]||'');bank.hidden=true;}));
 bindEditor(item);
}
function openBank(){renderBank(classScope||'default');bank.hidden=false;}
bankButton.addEventListener('click',e=>{e.stopPropagation();openBank();});
bank.querySelector('[data-close]').addEventListener('click',()=>{bank.hidden=true;});
bank.addEventListener('click',e=>{if(e.target===bank)bank.hidden=true;});
bank.addEventListener('keydown',e=>e.stopPropagation());
})();