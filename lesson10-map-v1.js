(()=>{
'use strict';
const refs=window.LESSON_REFERENCES||null;
const toolbar=document.querySelector('.toolbar');
if(!refs||!toolbar)return;
const esc=(s='')=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]||c));
function sectionHtml(s){
 const lead=s.lead?`<p>${esc(s.lead)}</p>`:'';
 if(s.type==='map')return lead+`<div class="concept-grid">${(s.groups||[]).map(g=>`<article class="concept-card"><small>LESSON 10</small><h3>${esc(g.title)}</h3><div>${(g.items||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div><p>${esc(g.note||'')}</p></article>`).join('')}</div>`;
 if(s.type==='matrix')return lead+`<div class="matrix-wrap"><table><thead><tr>${(s.headers||[]).map(x=>`<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${(s.rows||[]).map(r=>`<tr>${r.map((x,i)=>`<${i===0?'th':'td'}>${esc(x)}</${i===0?'th':'td'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 return lead+`<div class="big-flow">${(s.nodes||[]).map(x=>`<span class="${x==='→'?'arrow':''}">${esc(x)}</span>`).join('')}</div>`;
}
const button=document.createElement('button');
button.type='button';button.className='icon-btn map-btn';button.textContent='🗺 地図';button.title='Lesson 10 全体地図';
toolbar.insertBefore(button,document.getElementById('menuBtn')?.nextSibling||toolbar.firstChild);
const drawer=document.createElement('div');drawer.className='concept-map-drawer';drawer.hidden=true;
drawer.innerHTML=`<div class="concept-map-card" role="dialog" aria-modal="true"><header><div><small>REFERENCE MAP</small><h2>${esc(refs.title||'Lesson Map')}</h2><p>${esc(refs.subtitle||'')}</p></div><button type="button" data-close>×</button></header><nav>${(refs.sections||[]).map((s,i)=>`<button type="button" data-i="${i}">${esc(s.title)}</button>`).join('')}</nav><main></main></div>`;
document.body.appendChild(drawer);
const body=drawer.querySelector('main');const tabs=[...drawer.querySelectorAll('[data-i]')];
function show(i){const s=refs.sections?.[i];if(!s)return;tabs.forEach((x,n)=>x.classList.toggle('active',n===i));body.innerHTML=`<h2>${esc(s.title)}</h2>${sectionHtml(s)}`;}
function close(){drawer.hidden=true;button.focus();}
button.addEventListener('click',e=>{e.stopPropagation();drawer.hidden=false;show(0);});
drawer.querySelector('[data-close]').addEventListener('click',close);
drawer.addEventListener('click',e=>{if(e.target===drawer)close();});
drawer.addEventListener('keydown',e=>e.stopPropagation());
tabs.forEach(t=>t.addEventListener('click',()=>show(Number(t.dataset.i))));
})();