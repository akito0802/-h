// v7b: larger cells + cache-busting, robust genre population
document.addEventListener("DOMContentLoaded", setup);

const NOTES_12 = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const DEGREE_LABELS = ["1","b2","2","b3","3","4","#4","5","b6","6","b7","7"];

// スケール定義（半音）
const SCALE_DEFS = {
  // Major系
  "メジャー（Ionian）":[0,2,4,5,7,9,11],
  "メジャー・ペンタトニック":[0,2,4,7,9],
  "ブルース・メジャー":[0,2,3,4,7,9],

  // Minor系
  "ナチュラル・マイナー（Aeolian）":[0,2,3,5,7,8,10],
  "ハーモニック・マイナー":[0,2,3,5,7,8,11],
  "メロディック・マイナー（上行）":[0,2,3,5,7,9,11],
  "マイナー・ペンタトニック":[0,3,5,7,10],
  "ブルース・マイナー":[0,3,5,6,7,10],

  // Church Modes（Ionian/Aeolianは各系へ）
  "ドリアン":[0,2,3,5,7,9,10],
  "フリジアン":[0,1,3,5,7,8,10],
  "リディアン":[0,2,4,6,7,9,11],
  "ミクソリディアン":[0,2,4,5,7,9,10],
  "ロクリアン":[0,1,3,5,6,8,10]
};

// ジャンル→スケール
const GENRES = {
  "メジャー系":[
    "メジャー（Ionian）",
    "メジャー・ペンタトニック",
    "ブルース・メジャー"
  ],
  "マイナー系":[
    "ナチュラル・マイナー（Aeolian）",
    "ハーモニック・マイナー",
    "メロディック・マイナー（上行）",
    "マイナー・ペンタトニック",
    "ブルース・マイナー"
  ],
  "チャーチモード":[
    "ドリアン",
    "フリジアン",
    "リディアン",
    "ミクソリディアン",
    "ロクリアン"
  ]
};

// 設定
const TUNING = ["E","A","D","G","B","E"]; // 6→1
const FRETS = 12;
const CELL_W = 120; // ←さらに大きく
const CELL_H = 72;  // ←さらに大きく

function $(sel){return document.querySelector(sel);}
function option(v,t){const o=document.createElement("option");o.value=v;o.textContent=t;return o;}
function mod(n,m){return((n%m)+m)%m;}
function noteIndex(n){return NOTES_12.indexOf(n);}

function buildKeyOptions(){
  const sel=$("#keySelect"); sel.innerHTML="";
  NOTES_12.forEach(n=>sel.appendChild(option(n,n)));
  sel.value="C";
}
function buildGenreOptions(){
  const sel=$("#genreSelect"); sel.innerHTML="";
  Object.keys(GENRES).forEach(g=>sel.appendChild(option(g,g)));
  sel.value="メジャー系";
}
function populateScalesByGenre(){
  const genre=$("#genreSelect").value;
  const sel=$("#scaleSelect"); sel.innerHTML="";
  GENRES[genre].forEach(s=>sel.appendChild(option(s,s)));
}

function makeFretboardData(key,scaleName){
  const root=noteIndex(key), ints=SCALE_DEFS[scaleName];
  return {rootIdx:root, scaleSet:new Set(ints.map(i=>mod(root+i,12)))};
}

function generateSVG(key,scaleName,mode="dots"){
  const {rootIdx,scaleSet}=makeFretboardData(key,scaleName);
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
        const isRoot=pitch===rootIdx;
        const g=group();
        g.appendChild(circle(x,y,18,isRoot?"var(--root)":"var(--note)",0.95));
        let label="";
        if(mode==="notes") label=NOTES_12[pitch];
        else if(mode==="degrees") label=DEGREE_LABELS[mod(pitch-rootIdx,12)]||"";
        if(label){
          const t=text(x,y+5,label);
          t.setAttribute("font-size","16");   // bigger labels
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

// SVG helpers
function rect(x,y,w,h,fill){const e=document.createElementNS("http://www.w3.org/2000/svg","rect");e.setAttribute("x",x);e.setAttribute("y",y);e.setAttribute("width",w);e.setAttribute("height",h);e.setAttribute("fill",fill);return e;}
function line(x1,y1,x2,y2,stroke,w){const e=document.createElementNS("http://www.w3.org/2000/svg","line");e.setAttribute("x1",x1);e.setAttribute("y1",y1);e.setAttribute("x2",x2);e.setAttribute("y2",y2);e.setAttribute("stroke",stroke);e.setAttribute("stroke-width",w);e.setAttribute("stroke-linecap","round");return e;}
function circle(cx,cy,r,fill,op){const e=document.createElementNS("http://www.w3.org/2000/svg","circle");e.setAttribute("cx",cx);e.setAttribute("cy",cy);e.setAttribute("r",r);e.setAttribute("fill",fill);e.setAttribute("opacity",op);return e;}
function text(x,y,str){const e=document.createElementNS("http://www.w3.org/2000/svg","text");e.setAttribute("x",x);e.setAttribute("y",y);e.textContent=str;return e;}
function group(){return document.createElementNS("http://www.w3.org/2000/svg","g");}

function render(){
  const svg=generateSVG($("#keySelect").value,$("#scaleSelect").value,$("#displayMode").value);
  $("#fretboard").replaceWith(svg);
  svg.id="fretboard";
}

function setup(){
  buildKeyOptions();
  buildGenreOptions();
  populateScalesByGenre();
  $("#genreSelect").addEventListener("change",()=>{ populateScalesByGenre(); render(); });
  ["#keySelect","#scaleSelect","#displayMode"].forEach(sel=>$(sel).addEventListener("change",render));
  $("#downloadBtn").addEventListener("click",downloadPNG);
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
      a.download=`fretboard_${key}_${genre}_${scaleName}.png`;
      a.click();
    },"image/png");
  };
  img.src=url;
}
