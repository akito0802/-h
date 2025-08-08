// v10: pinch-zoom overlay for fretboard + previous v9 features
document.addEventListener("DOMContentLoaded", setup);

const NOTES_12 = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const DEGREE_LABELS = ["1","b2","2","b3","3","4","#4","5","b6","6","b7","7"];

// スケール定義（半音）
const SCALE_DEFS = {
  "メジャー（Ionian）":[0,2,4,5,7,9,11],
  "メジャー・ペンタトニック":[0,2,4,7,9],
  "ブルース・メジャー":[0,2,3,4,7,9],
  "ナチュラル・マイナー（Aeolian）":[0,2,3,5,7,8,10],
  "ハーモニック・マイナー":[0,2,3,5,7,8,11],
  "メロディック・マイナー（上行）":[0,2,3,5,7,9,11],
  "マイナー・ペンタトニック":[0,3,5,7,10],
  "ブルース・マイナー":[0,3,5,6,7,10],
  "ドリアン":[0,2,3,5,7,9,10],
  "フリジアン":[0,1,3,5,7,8,10],
  "リディアン":[0,2,4,6,7,9,11],
  "ミクソリディアン":[0,2,4,5,7,9,10],
  "ロクリアン":[0,1,3,5,6,8,10]
};

const GENRES = {
  "メジャー系":["メジャー（Ionian）","メジャー・ペンタトニック","ブルース・メジャー"],
  "マイナー系":["ナチュラル・マイナー（Aeolian）","ハーモニック・マイナー","メロディック・マイナー（上行）","マイナー・ペンタトニック","ブルース・マイナー"],
  "チャーチモード":["ドリアン","フリジアン","リディアン","ミクソリディアン","ロクリアン"]
};

const TENSION_MAP = {"b9":1,"9":2,"#9":3,"11":5,"#11":6,"b13":8,"13":9};
const SEMI_TO_TENSION = Object.fromEntries(Object.entries(TENSION_MAP).map(([k,v])=>[v,k]));

const TUNING = ["E","A","D","G","B","E"]; // 6→1
const FRETS = 12;
const CELL_W = 120;
const CELL_H = 72;

function $(sel){return document.querySelector(sel);}
function $all(sel){return Array.from(document.querySelectorAll(sel));}
function option(v,t){const o=document.createElement("option");o.value=v;o.textContent=t;return o;}
function mod(n,m){return((n%m)+m)%m;}
function noteIndex(n){return NOTES_12.indexOf(n);}

function buildKeyOptions(){ const sel=$("#keySelect"); sel.innerHTML=""; NOTES_12.forEach(n=>sel.appendChild(option(n,n))); sel.value="C"; }
function buildGenreOptions(){ const sel=$("#genreSelect"); sel.innerHTML=""; Object.keys(GENRES).forEach(g=>sel.appendChild(option(g,g))); sel.value="メジャー系"; }
function populateScalesByGenre(){ const g=$("#genreSelect").value; const s=$("#scaleSelect"); s.innerHTML=""; GENRES[g].forEach(n=>s.appendChild(option(n,n))); }

function getSelectedTensions(){ return $all('.tension:checked').map(el=>el.value); }

function makeFretboardData(key,scaleName,tensions){
  const root=noteIndex(key);
  const base=SCALE_DEFS[scaleName];
  const tSemis = tensions.map(t=>TENSION_MAP[t]).filter(v=>v!=null);
  const totalSemis = Array.from(new Set([...base, ...tSemis])).map(x=>mod(x,12)).sort((a,b)=>a-b);
  const scaleSet = new Set(totalSemis.map(i=>mod(root+i,12)));
  return {rootIdx:root, base, tSemis, totalSemis, scaleSet};
}

function generateSVG(key,scaleName,mode="dots",tensions=[]){
  const {rootIdx, base, tSemis, totalSemis, scaleSet} = makeFretboardData(key,scaleName,tensions);
  const strings=6, frets=FRETS;
  const padL=40, padR=20, padT=30, padB=40;
  const W=padL+padR+CELL_W*(frets+1);
  const H=padT+padB+CELL_H*(strings-1);

  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("viewBox",`0 0 ${W} ${H}`);
  svg.setAttribute("role","img");

  const bg=rect(0,0,W,H,"#ffffff"); bg.setAttribute("rx","12"); bg.setAttribute("ry","12"); svg.appendChild(bg);

  for(let f=0;f<=frets;f++){
    const x=padL+CELL_W*f;
    const col=f===0?"#b08968":"var(--fret)";
    const w=f===0?6:(f%12===0?2.5:1.5);
    svg.appendChild(line(x,padT,x,H-padB,col,w));
  }
  for(let s=0;s<strings;s++){
    const y=padT+CELL_H*s;
    svg.appendChild(line(padL,y,W-padR,y,"var(--string)",1.6));
  }

  [3,5,7,9,12].forEach(f=>{
    const x=padL+CELL_W*(f-0.5);
    const y=padT+CELL_H*(strings-1)/2;
    if(f===12){ svg.appendChild(circle(x-9,y-9,5,"#e2e8f0")); svg.appendChild(circle(x+9,y+9,5,"#e2e8f0")); }
    else{ svg.appendChild(circle(x,y,5,"#e2e8f0")); }
  });

  for(let s=0;s<strings;s++){
    const drawS=strings-1-s; // 上=1弦
    const open=noteIndex(TUNING[drawS]);
    for(let f=0;f<=frets;f++){
      const pitch=mod(open+f,12);
      if(scaleSet.has(pitch)){
        const x=padL+CELL_W*(f-0.5);
        const y=padT+CELL_H*s;
        const semis = mod(pitch - rootIdx, 12);
        const isRoot = pitch === rootIdx;
        const isTension = tSemis.includes(semis);

        const g=group();
        const fill = isRoot ? "var(--root)" : (isTension ? "var(--tension)" : "var(--note)");
        g.appendChild(circle(x,y,18,fill,0.95));

        let label="";
        if(mode==="notes"){ label=NOTES_12[pitch]; }
        else if(mode==="degrees"){ label = (isTension && SEMI_TO_TENSION[semis]) ? SEMI_TO_TENSION[semis] : (DEGREE_LABELS[semis]||""); }

        if(label){
          const t=text(x,y+5,label);
          t.setAttribute("font-size","16");
          t.setAttribute("text-anchor","middle");
          t.setAttribute("fill","#0b0e14");
          t.setAttribute("font-weight","700");
          g.appendChild(t);
        }
        svg.appendChild(g);
      }
    }
  }

  for(let f=0;f<=frets;f++){
    const tx=padL+CELL_W*f;
    const t=text(tx+6,H-12,String(f));
    t.setAttribute("font-size","14");
    t.setAttribute("fill","#475569");
    svg.appendChild(t);
  }

  return svg;
}

// ----- Table rendering -----
function renderScaleTable(key, scaleName, tensions){
  const host = $("#scaleTable");
  host.innerHTML = "";
  const {rootIdx, tSemis, totalSemis} = makeFretboardData(key,scaleName,tensions);

  const rows = totalSemis.map(semi => {
    const pitchIdx = mod(rootIdx + semi, 12);
    const note = NOTES_12[pitchIdx];
    const isTension = tSemis.includes(semi);
    const type = isTension ? "テンション" : (semi===0 ? "ルート" : "スケール");
    const label = isTension ? (SEMI_TO_TENSION[semi] || "") : (DEGREE_LABELS[semi] || "");
    const badgeClass = isTension ? "badge-tension" : (semi===0 ? "badge-root" : "badge-scale");
    return {type, badgeClass, label, note, semi};
  });

  const table = document.createElement("table");
  table.className = "table";
  table.innerHTML = `<thead><tr><th>区分</th><th>度数</th><th>音名</th><th>半音差</th></tr></thead><tbody></tbody>`;
  const tbody = table.querySelector("tbody");
  rows.forEach(r=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><span class="badge ${r.badgeClass}">${r.type}</span></td><td>${r.label||"-"}</td><td>${r.note}</td><td>${r.semi}</td>`;
    tbody.appendChild(tr);
  });
  host.appendChild(table);
}

// ---------- Zoom overlay (pinch & pan) ----------
function openZoom(){
  const overlay = $("#zoomOverlay");
  const stage = $("#zoomStage");
  stage.innerHTML = "";

  // Clone current fretboard SVG
  const src = $("#fretboard");
  const clone = src.cloneNode(true);
  clone.removeAttribute("id"); // avoid id dup
  // Wrap children into a group we can transform
  const vb = clone.viewBox.baseVal;
  const g = document.createElementNS("http://www.w3.org/2000/svg","g");
  // move all children into g
  while(clone.firstChild){ g.appendChild(clone.firstChild); }
  clone.appendChild(g);
  g.setAttribute("id","zoomTransform");
  stage.appendChild(clone);

  // Fit SVG to stage
  clone.style.width = "100%";
  clone.style.height = "100%";
  clone.setAttribute("preserveAspectRatio","xMidYMid meet");

  overlay.hidden = false;
  setupPanZoom(clone, g);
}

function setupPanZoom(svg, g){
  let scale = 1;
  let tx = 0, ty = 0;
  let pointers = new Map();
  let lastDist = null;
  let lastCenter = null;

  function apply(){
    g.setAttribute("transform", `translate(${tx},${ty}) scale(${scale})`);
  }

  function getPoint(evt){
    const rect = svg.getBoundingClientRect();
    const x = (evt.clientX - rect.left) * (svg.viewBox.baseVal.width / rect.width);
    const y = (evt.clientY - rect.top) * (svg.viewBox.baseVal.height / rect.height);
    return {x,y};
  }

  function distance(a,b){
    const dx = a.x - b.x, dy = a.y - b.y;
    return Math.hypot(dx,dy);
  }

  function center(a,b){ return {x:(a.x+b.x)/2, y:(a.y+b.y)/2}; }

  function onPointerDown(e){
    svg.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, getPoint(e));
  }
  function onPointerMove(e){
    if(!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, getPoint(e));
    if(pointers.size===1){
      // Pan
      const p = Array.from(pointers.values())[0];
      if(lastCenter){
        tx += (p.x - lastCenter.x);
        ty += (p.y - lastCenter.y);
        apply();
      }
      lastCenter = p;
    }else if(pointers.size===2){
      const [p1,p2] = Array.from(pointers.values());
      const c = center(p1,p2);
      const d = distance(p1,p2);
      if(lastDist && lastCenter){
        const ds = d / lastDist;
        // zoom around center
        const preX = (c.x - tx) / scale;
        const preY = (c.y - ty) / scale;
        scale *= ds;
        // clamp scale
        scale = Math.max(1, Math.min(8, scale));
        tx = c.x - preX * scale;
        ty = c.y - preY * scale;
        apply();
      }
      lastDist = d;
      lastCenter = c;
    }
    e.preventDefault();
  }
  function onPointerUp(e){
    pointers.delete(e.pointerId);
    if(pointers.size===0){ lastDist=null; lastCenter=null; }
  }
  function onWheel(e){
    const c = getPoint(e);
    const preX = (c.x - tx) / scale;
    const preY = (c.y - ty) / scale;
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    scale *= delta;
    scale = Math.max(1, Math.min(8, scale));
    tx = c.x - preX * scale;
    ty = c.y - preY * scale;
    apply();
    e.preventDefault();
  }
  function onDblClick(){
    // reset
    scale = 1; tx = 0; ty = 0; apply();
  }

  svg.addEventListener("pointerdown", onPointerDown);
  svg.addEventListener("pointermove", onPointerMove);
  svg.addEventListener("pointerup", onPointerUp);
  svg.addEventListener("pointercancel", onPointerUp);
  svg.addEventListener("wheel", onWheel, {passive:false});
  svg.addEventListener("dblclick", onDblClick);
}

function closeZoom(){
  $("#zoomOverlay").hidden = true;
}

// SVG helpers
function rect(x,y,w,h,fill){const e=document.createElementNS("http://www.w3.org/2000/svg","rect");e.setAttribute("x",x);e.setAttribute("y",y);e.setAttribute("width",w);e.setAttribute("height",h);e.setAttribute("fill",fill);return e;}
function line(x1,y1,x2,y2,stroke,w){const e=document.createElementNS("http://www.w3.org/2000/svg","line");e.setAttribute("x1",x1);e.setAttribute("y1",y1);e.setAttribute("x2",x2);e.setAttribute("y2",y2);e.setAttribute("stroke",stroke);e.setAttribute("stroke-width",w);e.setAttribute("stroke-linecap","round");return e;}
function circle(cx,cy,r,fill,op){const e=document.createElementNS("http://www.w3.org/2000/svg","circle");e.setAttribute("cx",cx);e.setAttribute("cy",cy);e.setAttribute("r",r);e.setAttribute("fill",fill);e.setAttribute("opacity",op);return e;}
function text(x,y,str){const e=document.createElementNS("http://www.w3.org/2000/svg","text");e.setAttribute("x",x);e.setAttribute("y",y);e.textContent=str;return e;}
function group(){return document.createElementNS("http://www.w3.org/2000/svg","g");}

function render(){
  const key=$("#keySelect").value;
  const scaleName=$("#scaleSelect").value;
  const mode=$("#displayMode").value;
  const tensions = getSelectedTensions();
  const svg=generateSVG(key,scaleName,mode,tensions);
  $("#fretboard").replaceWith(svg);
  svg.id="fretboard";
  renderScaleTable(key, scaleName, tensions);
  // attach click to open zoom
  svg.addEventListener("click", openZoom);
}

function setup(){
  buildKeyOptions();
  buildGenreOptions();
  populateScalesByGenre();
  $("#genreSelect").addEventListener("change",()=>{ populateScalesByGenre(); render(); });
  ["#keySelect","#scaleSelect","#displayMode"].forEach(sel=>$(sel).addEventListener("change",render));
  document.getElementById("downloadBtn").addEventListener("click",downloadPNG);

  document.getElementById("tensionClearBtn").addEventListener("click", ()=>{
    document.querySelectorAll('.tension').forEach(el=>el.checked=false);
    render();
  });
  document.querySelectorAll('.tension').forEach(el=>el.addEventListener("change", render));

  document.getElementById("zoomClose").addEventListener("click", closeZoom);

  render();
}

function downloadPNG(){
  const svgEl=$("#fretboard");
  const serializer=new XMLSerializer();
  const src=serializer.serializeToString(svgEl);
  const svgBlob=new Blob([src],{type:"image/svg+xml;charset=utf-8"});
  const url=URL.createObjectURL(svgBlob);
  const img=new Image();
  img.onload=function(){
    const scale=2;
    const canvas=document.createElement("canvas");
    const vb=svgEl.viewBox.baseVal;
    canvas.width=vb.width*scale; canvas.height=vb.height*scale;
    const ctx=canvas.getContext("2d");
    ctx.scale(scale,scale);
    ctx.drawImage(img,0,0);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob)=>{
      const a=document.createElement("a");
      a.href=URL.createObjectURL(blob);
      const key=$("#keySelect").value;
      const genre=$("#genreSelect").value;
      const scaleName=$("#scaleSelect").value;
      const tens=getSelectedTensions().join('-')||'none';
      a.download=`fretboard_${key}_${genre}_${scaleName}_tensions-${tens}.png`;
      a.click();
    },"image/png");
  };
  img.src=url;
}
