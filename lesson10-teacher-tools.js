(()=>{
'use strict';
if(window.LESSON_META?.teacherMode===false)return;
const toolbar=document.querySelector('.toolbar');
if(!toolbar)return;
const STORE='clover.lesson10.board.v1';
const current=()=>window.LessonEngine?.getCurrent?.()||{};
const currentId=()=>current().id||'note';
function escapeHtml(s=''){return String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));}
function read(){try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{};}catch(_){return {};}}
function write(html){const all=read();all[currentId()]={html,updatedAt:new Date().toISOString()};localStorage.setItem(STORE,JSON.stringify(all));}
function toast(message){const t=document.getElementById('toast');if(!t)return;t.textContent=message;t.hidden=false;setTimeout(()=>{t.hidden=true;},1200);}
async function copyText(text){try{await navigator.clipboard.writeText(String(text||''));toast('コピーしました');}catch(_){toast('コピーできませんでした');}}
function toolButton(label){const b=document.createElement('button');b.type='button';b.className='icon-btn teacher-tool-btn';b.textContent=label;return b;}
const boardButton=toolButton('📝 Board');
const bankButton=toolButton('📚 Bank');
toolbar.insertBefore(boardButton,document.getElementById('resetBtn'));
toolbar.insertBefore(bankButton,document.getElementById('resetBtn'));

const board=document.createElement('div');
board.className='teacher-board-modal';
board.hidden=true;
board.innerHTML=`<section class="teacher-board-card"><header><div><small>TEACHER BOARD</small><h2>授業説明ボード</h2></div><button type="button" data-close>×</button></header><div class="board-tools"><button type="button" data-cmd="bold"><b>B</b></button><button type="button" data-cmd="underline"><u>U</u></button><button type="button" data-color="#b42318">赤</button><button type="button" data-color="#175cd3">青</button><button type="button" data-color="#067647">緑</button><button type="button" data-highlight="#fff2a8">蛍光</button><button type="button" data-clear>書式解除</button><button type="button" data-load="completed">完成英文</button><button type="button" data-load="output">Back Up</button><button type="button" data-load="translation">日本語</button><button type="button" data-save>保存</button><button type="button" data-wipe>全消去</button></div><div class="teacher-board-editor" contenteditable="true" spellcheck="false"></div><footer>教材正本は変更せず、このボードだけを問題別に保存します。</footer></section>`;
document.body.appendChild(board);
const editor=board.querySelector('.teacher-board-editor');
function openBoard(){const all=read();editor.innerHTML=all[currentId()]?.html||`<p>${escapeHtml(current().completed||'')}</p>`;board.hidden=false;editor.focus();}
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
board.querySelector('[data-save]').addEventListener('click',()=>{write(editor.innerHTML);toast('保存しました');});
board.querySelector('[data-wipe]').addEventListener('click',()=>{if(confirm('この問題のボードを消去しますか？')){editor.innerHTML='';write('');}});

const bank=document.createElement('div');
bank.className='teacher-bank-modal';
bank.hidden=true;
bank.innerHTML=`<section class="teacher-bank-card"><header><div><small>SENTENCE BANK</small><h2>現在の問題データ</h2></div><button type="button" data-close>×</button></header><div class="teacher-bank-body"></div></section>`;
document.body.appendChild(bank);
function row(title,text,key){return `<article><h3>${escapeHtml(title)}</h3><pre>${escapeHtml(text||'')}</pre><div><button type="button" data-copy="${key}">Copy</button><button type="button" data-board="${key}">Boardへ</button></div></article>`;}
function openBank(){const item=current();const values={question:item.question||'',completed:item.completed||'',output:(item.outputChunks||[]).join(' / '),translation:item.translation||'',focus:item.focus||''};bank.querySelector('.teacher-bank-body').innerHTML=row('Original Problem',values.question,'question')+row('完成英文',values.completed,'completed')+row('Back Up Target',values.output,'output')+row('公式訳',values.translation,'translation')+row('Grammar Focus',values.focus,'focus');bank.hidden=false;bank.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>copyText(values[b.dataset.copy])));bank.querySelectorAll('[data-board]').forEach(b=>b.addEventListener('click',()=>{openBoard();editor.focus();document.execCommand('insertText',false,values[b.dataset.board]||'');bank.hidden=true;}));}
bankButton.addEventListener('click',e=>{e.stopPropagation();openBank();});
bank.querySelector('[data-close]').addEventListener('click',()=>{bank.hidden=true;});
bank.addEventListener('click',e=>{if(e.target===bank)bank.hidden=true;});
bank.addEventListener('keydown',e=>e.stopPropagation());
})();