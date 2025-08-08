// v19: refactor foundation with App state + renderAll
(function(){
  // --- helpers (must be first) ---
  const $ = (s)=>document.querySelector(s);
  const $$ = (s)=>Array.from(document.querySelectorAll(s));
  const option = (v,t)=>{ const o=document.createElement('option'); o.value=v; o.textContent=t; return o; };
  const mod=(n,m)=>((n%m)+m)%m;

  // --- data ---
  const NOTES_12 = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  const DEGREE_LABELS = ["1","b2","2","b3","3","4","#4","5","b6","6","b7","7"];

  const SCALE_DEFS = {
    "メジャー（Ionian）":[0,2,4,5,7,9,11],
    "ナチュラル・マイナー（Aeolian）":[0,2,3,5,7,8,10],
    "ドリアン":[0,2,3,5,7,9,10],
    "フリジアン":[0,1,3,5,7,8,10],
    "リディアン":[0,2,4,6,7,9,11],
    "ミクソリディアン":[0,2,4,5,7,9,10],
    "ロクリアン":[0,1,3,5,6,8,10],
    "メジャー・ペンタトニック":[0,2,4,7,9],
    "マイナー・ペンタトニック":[0,3,5,7,10]
  };

  const GENRES = {
    "メジャー系":["メジャー（Ionian）","メジャー・ペンタトニック"],
    "マイナー系":["ナチュラル・マイナー（Aeolian）","マイナー・ペンタトニック"],
    "チャーチモード":["ドリアン","フリジアン","リディアン","ミクソリディアン","ロクリアン"]
  };

  const TENSION_MAP = {"b9":1,"9":2,"#9":3,"11":5,"#11":6,"b13":8,"13":9};
  const SEMI_TO_TENSION = Object.fromEntries(Object.entries(TENSION_MAP).map(([k,v])=>[v,k]));

  const INSTRUMENTS = {
    guitar: { type:"fret", name:"ギター", strings:["E","A","D","G","B","E"], frets:12, cellH:72 },
    bass4:  { type:"fret", name:"ベース4", strings:["E","A","D","G"], frets:12, cellH:86 },
    ukulele:{ type:"fret", name:"ウクレレ", strings:["G","C","E","A"], frets:12, cellH:86 },
    piano:  { type:"piano", name:"ピアノ", keys:24 }
  };

  // --- app state ---
  const App = {
    state: {
      key:"C", genre:"メジャー系", scale:"メジャー（Ionian）",
      display:"dots", tensions:[], instrument:"guitar"
    },
    set(patch){ Object.assign(this.state, patch); renderAll(); }
  };

  // --- core calc ---
  const noteIndex=(n)=>NOTES_12.indexOf(n);
  function makeFretData(){
    const {key, scale, tensions} = App.state;
    const rootIdx = noteIndex(key);
    const base = SCALE_DEFS[scale] || SCALE_DEFS["メジャー（Ionian）"];
    const tSemis = tensions.map(t=>TENSION_MAP[t]).filter(v=>v!=null);
    const totalSemis = Array.from(new Set([...base, ...tSemis])).map(x=>mod(x,12)).sort((a,b)=>a-b);
    const scaleSet = new Set(totalSemis.map(i=>mod(rootIdx+i,12)));
    return {rootIdx, base, tSemis, totalSemis, scaleSet};
  }

  // --- renderers ---
  const CELL_W = 120;
  function rect(x,y,w,h,fill){const e=document.createElementNS('http://www.w3.org/2000/svg','rect'); e.setAttribute('x',x); e.setAttribute('y',y); e.setAttribute('width',w); e.setAttribute('height',h); e.setAttribute('fill',fill); return e;}
  function line(x1,y1,x2,y2,stroke,w){const e=document.createElementNS('http://www.w3.org/2000/svg','line'); e.setAttribute('x1',x1); e.setAttribute('y1',y1); e.setAttribute('x2',x2); e.setAttribute('y2',y2); e.setAttribute('stroke',stroke); e.setAttribute('stroke-width',w); e.setAttribute('stroke-linecap','round'); return e;}
  function circle(cx,cy,r,fill,op){const e=document.createElementNS('http://www.w3.org/2000/svg','circle'); e.setAttribute('cx',cx); e.setAttribute('cy',cy); e.setAttribute('r',r); e.setAttribute('fill',fill); e.setAttribute('opacity',op); return e;}
  function text(x,y,str){const e=document.createElementNS('http://www.w3.org/2000/svg','text'); e.setAttribute('x',x); e.setAttribute('y',y); e.textContent=str; return e;}
  function group(){return document.createElementNS('http://www.w3.org/2000/svg','g');}

  function renderFretboard(cfg){
    const {rootIdx, tSemis, totalSemis, scaleSet} = makeFretData();
    const strings = cfg.strings.length, frets = cfg.frets;
    const CELL_H = cfg.cellH;
    const padL=40, padR=20, padT=30, padB=40;
    const W=padL+padR+CELL_W*(frets+1);
    const H=padT+padB+CELL_H*(strings-1);
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);

    svg.appendChild(rect(0,0,W,H,'#fff'));
    for(let f=0;f<=frets;f++){
      const x=padL+CELL_W*f;
      const col=f===0?'#b08968':'var(--fret)';
      const w=f===0?6:(f%12===0?2.5:1.5);
      svg.appendChild(line(x,padT,x,H-padB,col,w));
    }
    for(let s=0;s<strings;s++){
      const y=padT+CELL_H*s; svg.appendChild(line(padL,y,W-padR,y,'var(--string)',1.6));
    }
    [3,5,7,9,12].forEach(f=>{
      const x=padL+CELL_W*(f-0.5), y=padT+CELL_H*(strings-1)/2;
      if(f===12){ svg.appendChild(circle(x-9,y-9,5,'#e2e8f0')); svg.appendChild(circle(x+9,y+9,5,'#e2e8f0')); }
      else{ svg.appendChild(circle(x,y,5,'#e2e8f0')); }
    });

    const mode = App.state.display;
    for(let s=0;s<strings;s++){
      const drawS=strings-1-s; // top=1弦
      const open = noteIndex(cfg.strings[drawS]);
      for(let f=0;f<=frets;f++){
        const pitch=mod(open+f,12);
        if(scaleSet.has(pitch)){
          const x=padL+CELL_W*(f-0.5);
          const y=padT+CELL_H*s;
          const semis = mod(pitch - rootIdx, 12);
          const isRoot = pitch === rootIdx;
          const isTension = tSemis.includes(semis);

          const g=group();
          const fill = isRoot ? 'var(--root)' : (isTension ? 'var(--tension)' : 'var(--note)');
          g.appendChild(circle(x,y,18,fill,0.95));

          let label="";
          if(mode==='notes'){ label=NOTES_12[pitch]; }
          else if(mode==='degrees'){ label = (isTension && SEMI_TO_TENSION[semis]) ? SEMI_TO_TENSION[semis] : (DEGREE_LABELS[semis]||''); }
          if(label){
            const t=text(x,y+5,label); t.setAttribute('font-size','16'); t.setAttribute('text-anchor','middle'); t.setAttribute('fill','#0b0e14'); t.setAttribute('font-weight','700'); g.appendChild(t);
          }
          svg.appendChild(g);
        }
      }
    }
    for(let f=0;f<=frets;f++){ const tx=padL+CELL_W*f; const t=text(tx+6,H-12,String(f)); t.setAttribute('font-size','14'); t.setAttribute('fill','#475569'); svg.appendChild(t); }
    return svg;
  }

  function renderPiano(cfg){
    const {rootIdx, tSemis, totalSemis, scaleSet} = makeFretData();
    const whiteW=44, whiteH=220, blackW=28, blackH=140;
    const whitePattern=[0,2,4,5,7,9,11], totalWhite=14; // 2 octave
    const W=whiteW*totalWhite+20, H=whiteH+40;
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    svg.appendChild(rect(0,0,W,H,'#fff'));
    let x=10, y=10; const positions=[];
    for(let i=0;i<totalWhite;i++){ const rectKey=rect(x,y,whiteW,whiteH,'#f8fafc'); rectKey.setAttribute('stroke','#cbd5e1'); rectKey.setAttribute('stroke-width','1.2'); svg.appendChild(rectKey); positions.push({x,pc:whitePattern[i%7]}); x+=whiteW; }
    // markers on white keys
    const mode = App.state.display;
    positions.forEach((pos,i)=>{
      const pc = pos.pc; const pitch=pc; // starting C
      if(scaleSet.has(pitch)){
        const semis = mod(pitch - rootIdx, 12);
        const isRoot = pitch===rootIdx; const isTension = tSemis.includes(semis);
        const cx = pos.x + whiteW/2; const cy = 10 + whiteH - 28;
        const fill = isRoot ? 'var(--root)' : (isTension ? 'var(--tension)' : 'var(--note)');
        const g=group(); g.appendChild(circle(cx,cy,14,fill,0.95));
        let label=""; if(mode==='notes'){ label=NOTES_12[pitch]; } else if(mode==='degrees'){ label=(isTension && SEMI_TO_TENSION[semis])?SEMI_TO_TENSION[semis]:(DEGREE_LABELS[semis]||''); }
        if(label){ const t=text(cx,cy+5,label); t.setAttribute('font-size','12'); t.setAttribute('text-anchor','middle'); t.setAttribute('fill','#0b0e14'); t.setAttribute('font-weight','700'); g.appendChild(t); }
        svg.appendChild(g);
      }
    });
    return svg;
  }

  // --- table ---
  function renderScaleTable(){
    const host=$("#scaleTable"); host.innerHTML="";
    const {rootIdx, tSemis, totalSemis} = makeFretData();
    const table=document.createElement('table'); table.className='table';
    table.innerHTML='<thead><tr><th>区分</th><th>度数</th><th>音名</th><th>半音差</th></tr></thead><tbody></tbody>';
    const tbody=table.querySelector('tbody');
    totalSemis.forEach(semi=>{
      const pitch=mod(rootIdx+semi,12);
      const note=NOTES_12[pitch];
      const isTension=tSemis.includes(semi);
      const type=isTension?'テンション':(semi===0?'ルート':'スケール');
      const label=isTension?(SEMI_TO_TENSION[semi]||''):(DEGREE_LABELS[semi]||'');
      const badgeClass=isTension?'badge-tension':(semi===0?'badge-root':'badge-scale');
      const tr=document.createElement('tr');
      tr.innerHTML=`<td><span class="badge ${badgeClass}">${type}</span></td><td>${label||'-'}</td><td>${note}</td><td>${semi}</td>`;
      tbody.appendChild(tr);
    });
    host.appendChild(table);
  }

  // --- board host ---
  function renderBoard(){
    const host=$("#board");
    const inst=INSTRUMENTS[App.state.instrument]||INSTRUMENTS.guitar;
    let svg;
    if(inst.type==='piano') svg=renderPiano(inst);
    else svg=renderFretboard(inst);
    host.replaceWith(svg);
    svg.id='board';
    svg.addEventListener('click', openZoom);
  }

  function renderAll(){
    renderBoard();
    renderScaleTable();
  }

  // --- zoom ---
  function openZoom(){
    const overlay=$("#zoomOverlay"), stage=$("#zoomStage"), label=$("#zoomInfoLabel");
    stage.innerHTML="";
    const src=$("#board"); const clone=src.cloneNode(true);
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    while(clone.firstChild){ g.appendChild(clone.firstChild); }
    clone.appendChild(g); g.setAttribute('id','zoomTransform');
    clone.style.width="100%"; clone.style.height="100%"; clone.setAttribute("preserveAspectRatio","xMidYMid meet");
    stage.appendChild(clone);

    const tens=App.state.tensions;
    const instName = INSTRUMENTS[App.state.instrument]?.name || App.state.instrument;
    label.textContent = `${instName}｜${App.state.key}｜${App.state.scale}${tens.length?('｜'+tens.join(', ')):''}`;

    overlay.hidden=false; document.body.style.overflow='hidden';
    setupPanZoom(clone,g,true);
  }
  function closeZoom(){ $("#zoomOverlay").hidden=true; document.body.style.overflow=''; }
  function setupPanZoom(svg,g,fitWidth=false){
    let scale=1, tx=0, ty=0; const pointers=new Map(); let lastDist=null,lastCenter=null;
    function apply(){ g.setAttribute('transform',`translate(${tx},${ty}) scale(${scale})`); }
    function getPoint(evt){ const rect=svg.getBoundingClientRect(); const x=(evt.clientX-rect.left)*(svg.viewBox.baseVal.width/rect.width); const y=(evt.clientY-rect.top)*(svg.viewBox.baseVal.height/rect.height); return {x,y}; }
    function distance(a,b){ return Math.hypot(a.x-b.x,a.y-b.y); } function center(a,b){ return {x:(a.x+b.x)/2,y:(a.y+b.y)/2}; }
    if(fitWidth){ requestAnimationFrame(()=>{ scale=1; tx=0; ty=0; apply(); }); }
    svg.addEventListener('pointerdown',e=>{ svg.setPointerCapture(e.pointerId); pointers.set(e.pointerId,getPoint(e)); });
    svg.addEventListener('pointermove',e=>{
      if(!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId,getPoint(e));
      if(pointers.size===1){ const p=[...pointers.values()][0]; if(lastCenter){ tx+=(p.x-lastCenter.x); ty+=(p.y-lastCenter.y); apply(); } lastCenter=p; }
      else if(pointers.size===2){ const [p1,p2]=[...pointers.values()]; const c=center(p1,p2), d=distance(p1,p2);
        if(lastDist && lastCenter){ const ds=d/lastDist; const preX=(c.x-tx)/scale, preY=(c.y-ty)/scale; scale=Math.max(1,Math.min(8,scale*ds)); tx=c.x-preX*scale; ty=c.y-preY*scale; apply(); }
        lastDist=d; lastCenter=c;
      }
      e.preventDefault();
    });
    const reset=()=>{ pointers.clear(); lastDist=null; lastCenter=null; };
    svg.addEventListener('pointerup',e=>{ pointers.delete(e.pointerId); if(pointers.size===0) reset(); });
    svg.addEventListener('pointercancel',e=>{ pointers.delete(e.pointerId); if(pointers.size===0) reset(); });
    svg.addEventListener('wheel',e=>{ const c=getPoint(e); const preX=(c.x-tx)/scale, preY=(c.y-ty)/scale; const delta=e.deltaY<0?1.1:0.9; scale=Math.max(1,Math.min(8,scale*delta)); tx=c.x-preX*scale; ty=c.y-preY*scale; apply(); e.preventDefault(); },{passive:false});
    svg.addEventListener('dblclick',()=>{ scale=1; tx=0; ty=0; apply(); });
    $("#zoomOverlay").addEventListener('click',e=>{ if(e.target.id==='zoomOverlay') closeZoom(); });
  }

  // --- theory modal ---
  const SCALE_DESCRIPTIONS = {
    "メジャー（Ionian）":"Iメジャーで使用。安定したトニック機能。",
    "ナチュラル・マイナー（Aeolian）":"VImやmトニックで使用。暗く安定。",
    "ドリアン":"IIm7やモーダルmトニック。長6度が特徴。",
    "フリジアン":"Im上で♭2の強い色彩。エスニック。",
    "リディアン":"IVMaj7やMaj(#11)。浮遊感。",
    "ミクソリディアン":"属七（V7）で使用。"
  };
  const SCALE_THEORY = {
    "メジャー（Ionian）":{parent:"メジャースケール",formula:"1 2 3 4 5 6 7",tensions:"9, 11, 13",typical_chords:"IMaj7"},
    "ドリアン":{parent:"メジャースケール第2",formula:"1 2 ♭3 4 5 6 ♭7",tensions:"9,11,13",typical_chords:"IIm7"}
  };
  function openTheory(){
    const modal=$("#theoryModal"), body=$("#theoryBody");
    const name=App.state.scale, key=App.state.key;
    const info=SCALE_THEORY[name]||{}; const desc=SCALE_DESCRIPTIONS[name]||"";
    const rows=[["キー",key],["スケール",name],["親スケール/モード",info.parent||"-"],["度数/構成",info.formula||"-"],["テンション",info.tensions||"-"],["適用コード",info.typical_chords||"-"],["使用上の要点",desc||info.usage||"-"]];
    body.innerHTML = rows.map(([l,v])=>`<div class="row"><span class="label">${l}</span><span class="value">${v}</span></div>`).join("");
    modal.hidden=false;
  }
  function closeTheory(){ $("#theoryModal").hidden=true; }

  // --- init & bind ---
  function populateSelects(){
    const keySel=$("#keySelect"); keySel.innerHTML=""; NOTES_12.forEach(n=>keySel.appendChild(option(n,n))); keySel.value=App.state.key;
    const genSel=$("#genreSelect"); genSel.innerHTML=""; Object.keys(GENRES).forEach(g=>genSel.appendChild(option(g,g))); genSel.value=App.state.genre;
    const scSel=$("#scaleSelect"); scSel.innerHTML=""; (GENRES[genSel.value]||[]).forEach(n=>scSel.appendChild(option(n,n))); scSel.value=App.state.scale;
    $("#displayMode").value=App.state.display;
    $("#instrumentSelect").value=App.state.instrument;
  }
  function bindEvents(){
    $("#keySelect").addEventListener('change',e=>App.set({key:e.target.value}));
    $("#genreSelect").addEventListener('change',e=>{ const genre=e.target.value; const first=(GENRES[genre]||[])[0]||App.state.scale; App.set({genre, scale:first}); populateSelects(); });
    $("#scaleSelect").addEventListener('change',e=>App.set({scale:e.target.value}));
    $("#displayMode").addEventListener('change',e=>App.set({display:e.target.value}));
    $("#instrumentSelect").addEventListener('change',e=>App.set({instrument:e.target.value}));
    $$("#.tension").forEach(el=>el.addEventListener('change',()=>{ const tensions=Array.from(document.querySelectorAll('.tension:checked')).map(el=>el.value); App.set({tensions}); }));
    $("#tensionClearBtn").addEventListener('click',()=>{ document.querySelectorAll('.tension').forEach(el=>el.checked=false); App.set({tensions:[]}); });
    $("#downloadBtn").addEventListener('click',downloadPNG);
    $("#theoryBtn").addEventListener('click',openTheory);
    $("#theoryClose").addEventListener('click',closeTheory);
    $("#theoryModal").addEventListener('click',e=>{ if(e.target.id==='theoryModal') closeTheory(); });
  }

  function downloadPNG(){
    const svgEl=$("#board"); const serializer=new XMLSerializer(); const src=serializer.serializeToString(svgEl);
    const svgBlob=new Blob([src],{type:"image/svg+xml;charset=utf-8"}); const url=URL.createObjectURL(svgBlob); const img=new Image();
    img.onload=function(){ const scale=2; const canvas=document.createElement('canvas'); const vb=svgEl.viewBox.baseVal; canvas.width=vb.width*scale; canvas.height=vb.height*scale; const ctx=canvas.getContext('2d'); ctx.scale(scale,scale); ctx.drawImage(img,0,0); URL.revokeObjectURL(url);
      canvas.toBlob((blob)=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(blob); const inst=App.state.instrument; const tens=(App.state.tensions.join('-')||'none'); a.download=`board_${inst}_${App.state.key}_${App.state.scale}_tensions-${tens}.png`; a.click(); },'image/png');
    }; img.src=url;
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    try{
      populateSelects(); bindEvents(); renderAll();
      console.log('[v19] ready');
    }catch(e){
      alert('初期化でエラーが起きたかも。リロードしてね\n'+e.message);
      console.error(e);
    }
  });
})();