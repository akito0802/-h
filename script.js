// v5 robust genre population
document.addEventListener("DOMContentLoaded", setup);

const NOTES_12 = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const DEGREE_LABELS = ["1","b2","2","b3","3","4","#4","5","b6","6","b7","7"];
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
const TUNING = ["E","A","D","G","B","E"];
const FRETS = 12;

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
  const strings=6, frets=FRETS, cellW=100, cellH=60, padL=40, padR=20, padT=30, padB=36;
  const W=padL+padR+cellW*(frets+1), H=padT+padB+cellH*(strings-1);
  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("viewBox",`0 0 ${W} ${H}`);
  svg.setAttribute("role","img");
  const bg=rect(0,0,W,H,"#fff"); bg.setAttribute("rx","12"); bg.setAttribute("ry","12"); svg.appendChild(bg);
  for(let f=0;f<=frets;f++){svg.appendChild(line(padL+cellW*f,padT,padL+cellW*f,H-padB,f===0?"#b08968":"var(--fret)",f===0?6:(f%12===0?2.5:1.5)));}
  for(let s=0;s<strings;s++){svg.appendChild(line(padL,padT+cellH*s,W-padR,padT+cellH*s,"var(--string)",1.4));}
  [3,5,7,9,12].forEach(f=>{const x=padL+cellW*(f-0.5),y=padT+cellH*(strings-1)/2;if(f===12){svg.appendChild(circle(x-8,y-8,4,"#e2e8f0"));svg.appendChild(circle(x+8,y+8,4,"#e2e8f0"));}else{svg.appendChild(circle(x,y,4,"#e2e8f0"));}});
  for(let s=0;s<strings;s++){const drawS=strings-1-s,open=noteIndex(TUNING[drawS]);for(let f=0;f<=frets;f++){const p=mod(open+f,12);if(scaleSet.has(p)){const x=padL+cellW*(f-0.5),y=padT+cellH*s,isRoot=p===rootIdx;const g=group();g.appendChild(circle(x,y,14,isRoot?"var(--root)":"var(--note)",0.95));let label="";if(mode==="notes")label=NOTES_12[p];else if(mode==="degrees")label=DEGREE_LABELS[mod(p-rootIdx,12)]||"";if(label){const t=text(x,y+4,label);t.setAttribute("font-size","13");t.setAttribute("text-anchor","middle");t.setAttribute("fill","#0b0e14");t.setAttribute("font-weight","700");g.appendChild(t);}svg.appendChild(g);}}}
  for(let f=0;f<=frets;f++){const t=text(padL+cellW*f+4,H-10,String(f));t.setAttribute("font-size","12");t.setAttribute("fill","#475569");svg.appendChild(t);}
  return svg;
}
function rect(x,y,w,h,fill){const e=document.createElementNS("http://www.w3.org/2000/svg","rect");e.setAttribute("x",x);e.setAttribute("y",y);e.setAttribute("width",w);e.setAttribute("height",h);e.setAttribute("fill",fill);return e;}
function line(x1,y1,x2,y2,stroke,w){const e=document.createElementNS("http://www.w3.org/2000/svg","line");e.setAttribute("x1",x1);e.setAttribute("y1",y1);e.setAttribute("x2",x2);e.setAttribute("y2",y2);e.setAttribute("stroke",stroke);e.setAttribute("stroke-width",w);e.setAttribute("stroke-linecap","round");return e;}
function circle(cx,cy,r,fill,op){const e=document.createElementNS("http://www.w3.org/2000/svg","circle");e.setAttribute("cx",cx);e.setAttribute("cy",cy);e.setAttribute("r",r);e.setAttribute("fill",fill);e.setAttribute("opacity",op);return e;}
function text(x,y,str){const e=document.createElementNS("http://www.w3.org/2000/svg","text");e.setAttribute("x",x);e.setAttribute("y",y);e.textContent=str;return e;}
function group(){return document.createElementNS("http://www.w3.org/2000/svg","g");}
function render(){const svg=generateSVG($("#keySelect").value,$("#scaleSelect").value,$("#displayMode").value);$("#fretboard").replaceWith(svg);svg.id="fretboard";}
function setup(){buildKeyOptions();buildGenreOptions();populateScalesByGenre();$("#genreSelect").addEventListener("change",()=>{populateScalesByGenre();render();});["#keySelect","#scaleSelect","#displayMode"].forEach(sel=>$(sel).addEventListener("change",render));$("#downloadBtn").addEventListener("click",downloadPNG);render();}
function downloadPNG(){const svgEl=$("#fretboard");const serializer=new XMLSerializer();const src=serializer.serializeToString(svgEl);const svgBlob=new Blob([src],{type:"image/svg+xml;charset=utf-8"});const url=URL.createObjectURL(svgBlob);const img=new Image();img.onload=function(){const scale=2;const canvas=document.createElement("canvas");const vb=svgEl.viewBox.baseVal;canvas.width=vb.width*scale;canvas.height=vb.height*scale;const ctx=canvas.getContext("2d");ctx.scale(scale,scale);ctx.drawImage(img,0,0);URL.revokeObjectURL(url);canvas.toBlob(blob=>{const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`fretboard_${$("#keySelect").value}_${$("#genreSelect").value}_${$("#scaleSelect").value}.png`;a.click();},"image/png");};img.src=url;}
