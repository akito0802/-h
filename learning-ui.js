(()=>{
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const NOTES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const DEG=['1','♭2','2','♭3','3','4','♯4','5','♭6','6','♭7','7'];
const COMMON={
 'メジャー（Ionian）':[0,2,4,5,7,9,11],
 'ナチュラル・マイナー（Aeolian）':[0,2,3,5,7,8,10],
 'ハーモニック・マイナー':[0,2,3,5,7,8,11],
 'メロディック・マイナー（上行）':[0,2,3,5,7,9,11],
 'メジャー・ペンタトニック':[0,2,4,7,9],
 'マイナー・ペンタトニック':[0,3,5,7,10],
 'ドリアン':[0,2,3,5,7,9,10],
 'フリジアン':[0,1,3,5,7,8,10],
 'リディアン':[0,2,4,6,7,9,11],
 'ミクソリディアン':[0,2,4,5,7,9,10],
 'ロクリアン':[0,1,3,5,6,8,10],
 'リディアン・ドミナント':[0,2,4,6,7,9,10],
 'フリジアン・ドミナント':[0,1,4,5,7,8,10],
 'アルタード':[0,1,3,4,6,8,10]
};
const INFO={
 'メジャー（Ionian）':{feature:[4,11],tone:'明るく安定した基準となる響き',chords:'Imaj7 / iim7 / IVmaj7 / V7',use:'ポップス、ロック、ジャズなど幅広く使いやすい'},
 'ナチュラル・マイナー（Aeolian）':{feature:[3,8,10],tone:'落ち着きと陰りを持つ自然なマイナー感',chords:'Im7 / ♭IIImaj7 / IVm7 / ♭VII7',use:'バラード、ロック、ポップスの哀愁表現'},
 'ドリアン':{feature:[3,9,10],tone:'マイナー感の中に明るさと浮遊感がある',chords:'Im7 / IIm7 / IV7',use:'ファンク、ジャズ、ロックのモーダルな場面'},
 'フリジアン':{feature:[1,3,10],tone:'♭2が強い緊張感と異国的な響きを作る',chords:'Im7 / ♭IImaj7',use:'メタル、フラメンコ風、エキゾチックな演出'},
 'リディアン':{feature:[6,11],tone:'♯4による明るく浮遊する響き',chords:'Imaj7 / II7',use:'映画音楽、フュージョン、幻想的なポップス'},
 'ミクソリディアン':{feature:[4,10],tone:'メジャーの明るさに♭7の開放感が加わる',chords:'I7 / ♭VIImaj7',use:'ロック、ブルース、ファンク'},
 'ロクリアン':{feature:[1,6,10],tone:'♭2と♭5が不安定で緊張感の強い響きを作る',chords:'Im7♭5 / ♭IImaj7',use:'ジャズのm7♭5周辺や実験的な表現'},
 'ハーモニック・マイナー':{feature:[3,8,11],tone:'短調に強い導音が加わり劇的な解決感を持つ',chords:'Im(maj7) / IVm7 / V7',use:'クラシック、メタル、ドラマチックな短調'},
 'メロディック・マイナー（上行）':{feature:[3,9,11],tone:'短調の色と洗練された明るさを両立する',chords:'Im(maj7) / IIm7 / V7',use:'ジャズ、フュージョン、現代的な和声'},
 'メジャー・ペンタトニック':{feature:[4,9],tone:'濁りが少なく明るく歌いやすい',chords:'I / IV / V',use:'ポップス、カントリー、ロックのメロディ'},
 'マイナー・ペンタトニック':{feature:[3,10],tone:'シンプルで力強いマイナーの核',chords:'Im / ♭III / IVm / ♭VII',use:'ロック、ブルース、ソロの定番'},
 'リディアン・ドミナント':{feature:[6,10],tone:'♯4と♭7が同居する開放的なドミナント感',chords:'I7 / II7',use:'ジャズのsubVやモダンなドミナント'},
 'フリジアン・ドミナント':{feature:[1,4,10],tone:'♭2と長3度が強い異国感を作る',chords:'I7 / ♭IImaj7',use:'ハーモニックマイナー由来のドミナント表現'},
 'アルタード':{feature:[1,3,6,8,10],tone:'ドミナント上の強いテンションを集めた緊張感',chords:'V7alt',use:'ジャズのV7で解決直前の緊張を最大化'}
};
let focusMode='all';
function intervalsFromTable(){return $$('#scaleTable tbody tr').map(tr=>Number(tr.lastElementChild?.textContent)).filter(Number.isFinite)}
function featureFor(name,vals){if(INFO[name])return INFO[name].feature.filter(x=>vals.includes(x));const major=[0,2,4,5,7,9,11],diff=vals.filter(x=>!major.includes(x));return (diff.length?diff:vals.filter(x=>x!==0).slice(-2)).slice(0,3)}
function pitchName(root,semi){return NOTES[(NOTES.indexOf(root)+semi+12)%12]}
function applyRootAndFeature(){const svg=$('#fretboard');if(!svg)return;const vals=intervalsFromTable(),rootName=$('#keySelect').value,root=NOTES.indexOf(rootName),features=featureFor($('#scaleSelect').value,vals),inst=$('#instrumentSelect').value;
 svg.querySelectorAll('circle').forEach(c=>{const fill=(c.getAttribute('fill')||'').toLowerCase();if(fill==='#dc2626'||fill==='#ef4444'){c.setAttribute('r','24');c.setAttribute('stroke','#ffffff');c.setAttribute('stroke-width','5');c.style.filter='drop-shadow(0 2px 4px rgba(0,0,0,.35))';c.style.opacity='1'}else if(fill==='#f59e0b'){c.setAttribute('r','18');c.removeAttribute('stroke');c.style.opacity=focusMode==='feature'?'.18':'1'}});
 if(inst!=='piano'){
  const tunings={guitar:['E','A','D','G','B','E'],bass:['E','A','D','G'],ukulele:['G','C','E','A']},t=tunings[inst]||tunings.guitar,strings=t.length;
  svg.querySelectorAll('circle[fill="#f59e0b"]').forEach(c=>{const x=Number(c.getAttribute('cx')),y=Number(c.getAttribute('cy'));if(!Number.isFinite(x)||!Number.isFinite(y))return;const fret=Math.round((x-45)/115+.5),row=Math.round((y-35)/78);if(row<0||row>=strings)return;const open=NOTES.indexOf(t[strings-1-row]),pitch=(open+fret+12)%12,iv=(pitch-root+12)%12;if(features.includes(iv)){c.setAttribute('r','21');c.setAttribute('stroke','#2563eb');c.setAttribute('stroke-width','6');c.style.opacity='1'}})
 }else{
  const rects=[...svg.querySelectorAll('rect')].filter(r=>['#fbbf24','#f59e0b','#ef4444'].includes((r.getAttribute('fill')||'').toLowerCase()));let wi=0,bi=0;rects.forEach(r=>{const fill=(r.getAttribute('fill')||'').toLowerCase();if(fill==='#ef4444'){r.setAttribute('stroke','#fff');r.setAttribute('stroke-width','6');return}const isBlack=Number(r.getAttribute('height'))<200,p=isBlack?[1,3,6,8,10][bi++%5]:[0,2,4,5,7,9,11][wi++%7],iv=(p-root+12)%12;if(features.includes(iv)){r.setAttribute('stroke','#2563eb');r.setAttribute('stroke-width','7');r.style.opacity='1'}else if(focusMode==='feature')r.style.opacity='.2'})
 }
}
function updateStatus(){const el=$('#learningStatus');if(!el)return;el.innerHTML=`<span>${$('#instrumentSelect').selectedOptions[0]?.textContent||''}</span><b>${$('#keySelect').value} ${$('#scaleSelect').value}</b><span>${$('#displayMode').selectedOptions[0]?.textContent||''}</span>`}
function updateLearningCard(){const vals=intervalsFromTable(),name=$('#scaleSelect').value,root=$('#keySelect').value,info=INFO[name],features=featureFor(name,vals),featureText=features.map(v=>`${DEG[v]}（${pitchName(root,v)}）`).join('・')||'—';const box=$('#scaleLearningCard');if(!box)return;box.innerHTML=`<div class="learn-head"><div><span>LEARNING GUIDE</span><h2>${root} ${name}</h2></div><div class="learn-feature">特徴音 <b>${featureText}</b></div></div><div class="learn-grid"><div><small>響き</small><p>${info?.tone||'構成音の間隔から生まれる固有の色合いを、ルートとの関係で確認しよう。'}</p></div><div><small>よく合わせるコード</small><p>${info?.chords||'コード上では構成音と特徴音のぶつかり方を確認して使う。'}</p></div><div><small>使いどころ</small><p>${info?.use||`${$('#genreSelect').value}の音階として、メロディやアドリブの素材に使える。`}</p></div><div><small>構成度数</small><p>${vals.map(v=>DEG[v]).join(' ・ ')}</p></div></div>`}
function updateCompare(){const box=$('#compareResult');if(!box)return;const aName=$('#scaleSelect').value,a=intervalsFromTable(),bName=$('#compareScale').value,b=COMMON[bName]||[];const all=[...new Set([...a,...b])].sort((x,y)=>x-y);box.innerHTML=`<div class="compare-title"><b>${aName}</b><span>↔</span><b>${bName}</b></div><div class="compare-chips">${all.map(v=>{const ia=a.includes(v),ib=b.includes(v),cls=ia&&ib?'same':ia?'only-a':'only-b',mark=ia&&ib?'共通':ia?'現在のみ':'比較のみ';return `<span class="${cls}"><b>${DEG[v]}</b><small>${pitchName($('#keySelect').value,v)}・${mark}</small></span>`}).join('')}</div>`}
function refresh(){requestAnimationFrame(()=>{updateStatus();updateLearningCard();updateCompare();applyRootAndFeature()})}
function install(){if($('#learningStatus'))return;const header=document.querySelector('header'),main=document.querySelector('main'),controls=$('.controls'),tension=$('.tension-panel');if(!header||!main||!controls)return;
 const status=document.createElement('div');status.id='learningStatus';status.className='learning-status';header.insertAdjacentElement('afterend',status);
 const presets=document.createElement('section');presets.className='view-presets';presets.innerHTML='<div class="preset-label"><b>表示プリセット</b><small>見たい情報をワンタップで切り替え</small></div><div class="preset-buttons"><button data-preset="notes">♪ 音名</button><button data-preset="degrees">度数</button><button data-preset="feature">◎ ルート＋特徴音</button><button data-preset="all" class="active">● 構成音</button></div>';tension.insertAdjacentElement('beforebegin',presets);
 const learn=document.createElement('section');learn.id='scaleLearningCard';learn.className='scale-learning-card';$('#fretboardWrapper').insertAdjacentElement('afterend',learn);
 const compare=document.createElement('section');compare.className='compare-panel';compare.innerHTML=`<div class="compare-head"><div><span>COMPARE MODE</span><h2>スケール比較</h2><p>変わる音だけ色分けして確認できるよ。</p></div><label>比較するスケール<select id="compareScale">${Object.keys(COMMON).map(n=>`<option>${n}</option>`).join('')}</select></label></div><div class="compare-legend"><span class="same">■ 共通</span><span class="only-a">■ 現在のみ</span><span class="only-b">■ 比較のみ</span></div><div id="compareResult"></div>`;learn.insertAdjacentElement('afterend',compare);
 const style=document.createElement('style');style.textContent=`.learning-status{position:sticky;top:0;z-index:120;display:flex;align-items:center;justify-content:center;gap:10px;width:min(calc(100% - 24px),980px);margin:0 auto 12px;padding:9px 12px;border:1px solid var(--border);border-radius:13px;background:color-mix(in srgb,var(--paper) 92%,transparent);box-shadow:0 6px 20px rgba(0,0,0,.08);backdrop-filter:blur(12px);font-size:.78rem}.learning-status b{font-size:.86rem}.learning-status span{color:var(--muted)}.view-presets{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:14px 0 10px;padding:12px;border:1px solid var(--border);border-radius:14px;background:rgba(255,255,255,.58)}.preset-label b,.preset-label small{display:block}.preset-label small{margin-top:2px;color:var(--muted);font-size:.7rem}.preset-buttons{display:flex;gap:6px;flex-wrap:wrap}.preset-buttons button{width:auto;padding:8px 11px;border-radius:999px;font-size:.76rem}.preset-buttons button.active{background:#8b6f47;color:#fff;border-color:#8b6f47}.scale-learning-card,.compare-panel{margin-top:16px;padding:18px 20px;border:1px solid var(--border);border-radius:18px;background:var(--paper);box-shadow:var(--shadow)}.learn-head,.compare-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.learn-head span,.compare-head span{font-size:.62rem;font-weight:900;letter-spacing:.13em;color:#8b6f47}.learn-head h2,.compare-head h2{margin:3px 0;font-size:1.12rem}.learn-feature{padding:8px 11px;border-radius:12px;background:#eef4ff;font-size:.72rem;color:#475569}.learn-feature b{display:block;margin-top:2px;color:#1d4ed8;font-size:.82rem}.learn-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:12px}.learn-grid>div{padding:11px;border-radius:13px;background:#f8f6f1}.learn-grid small{font-weight:900;color:#8b6f47}.learn-grid p{margin:4px 0 0;font-size:.78rem;line-height:1.55}.compare-head label{display:grid;gap:5px;color:var(--muted);font-size:.72rem}.compare-head select{min-width:220px}.compare-legend{display:flex;gap:12px;flex-wrap:wrap;margin:12px 0 8px;font-size:.68rem;font-weight:800}.compare-legend .same{color:#64748b}.compare-legend .only-a{color:#d97706}.compare-legend .only-b{color:#2563eb}.compare-title{display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:.8rem}.compare-chips{display:flex;gap:6px;flex-wrap:wrap}.compare-chips>span{display:grid;min-width:68px;padding:8px 9px;border:2px solid transparent;border-radius:11px;background:#f8fafc;text-align:center}.compare-chips b{font-size:.88rem}.compare-chips small{font-size:.58rem;margin-top:2px}.compare-chips .same{border-color:#cbd5e1}.compare-chips .only-a{border-color:#f59e0b;background:#fff7ed}.compare-chips .only-b{border-color:#3b82f6;background:#eff6ff}html[data-theme=dark] .learning-status,html[data-theme=dark] .scale-learning-card,html[data-theme=dark] .compare-panel{background:#201e1b;border-color:#514a42}html[data-theme=dark] .view-presets{background:#24211e;border-color:#514a42}html[data-theme=dark] .learn-grid>div,html[data-theme=dark] .compare-chips>span{background:#2b2824}html[data-theme=dark] .learn-feature{background:#172554;color:#bfdbfe}@media(max-width:680px){.learning-status{justify-content:flex-start;overflow-x:auto;white-space:nowrap}.view-presets{display:block}.preset-buttons{margin-top:10px;display:grid;grid-template-columns:1fr 1fr}.preset-buttons button{width:100%}.learn-head,.compare-head{display:block}.learn-feature{margin-top:10px}.learn-grid{grid-template-columns:1fr}.compare-head label{margin-top:12px}.compare-head select{width:100%;min-width:0}.compare-chips>span{min-width:62px;flex:1 0 62px}}`;document.head.appendChild(style);
 presets.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{presets.querySelectorAll('button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const p=btn.dataset.preset;focusMode=p==='feature'?'feature':'all';if(p==='notes')$('#displayMode').value='notes';else if(p==='degrees'||p==='feature')$('#displayMode').value='degrees';else $('#displayMode').value='dots';$('#displayMode').dispatchEvent(new Event('change',{bubbles:true}));refresh()});
 $('#compareScale').value='ドリアン';$('#compareScale').onchange=updateCompare;
 ['instrumentSelect','keySelect','genreSelect','scaleSelect','displayMode'].forEach(id=>$('#'+id)?.addEventListener('change',refresh));$$('.tension').forEach(x=>x.addEventListener('change',refresh));$('#tensionClearBtn')?.addEventListener('click',refresh);
 refresh();
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',()=>setTimeout(install,0)):setTimeout(install,0);
})();