// スケール指板ビューア（SVG） v4
// 仕様: 12フレット / 明るめテーマ / 1弦が上, 6弦が下 / 3段階選択（キー→ジャンル→スケール）

const NOTES_12 = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const DEGREE_LABELS = ["1","b2","2","b3","3","4","#4","5","b6","6","b7","7"];

// スケール定義（半音インターバル）
const SCALE_DEFS = {
  // Major系
  "メジャー（Ionian）":[0,2,4,5,7,9,11],
  "メジャー・ペンタトニック":[0,2,4,7,9],
  "ブルース・メジャー":[0,2,3,4,7,9], // メジャーペンタ + ♭3（扱い諸説）
  // Minor系
  "ナチュラル・マイナー（Aeolian）":[0,2,3,5,7,8,10],
  "ハーモニック・マイナー":[0,2,3,5,7,8,11],
  "メロディック・マイナー（上行）":[0,2,3,5,7,9,11],
  "マイナー・ペンタトニック":[0,3,5,7,10],
  "ブルース・マイナー":[0,3,5,6,7,10],
  // Church Modes（Ionian/AeolianはMajor/Minorに振り分け済み）
  "ドリアン":[0,2,3,5,7,9,10],
  "フリジアン":[0,1,3,5,7,8,10],
  "リディアン":[0,2,4,6,7,9,11],
  "ミクソリディアン":[0,2,4,5,7,9,10],
  "ロクリアン":[0,1,3,5,6,8,10]
};

// ジャンル→スケールの紐づけ
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

// 標準チューニング (低音側から): E2 A2 D3 G3 B3 E4
const TUNING = ["E","A","D","G","B","E"]; // 6 to 1
const FRETS = 12;

const $ = (sel)=>document.querySelector(sel);

function mod(n, m){ return ((n % m) + m) % m; }
function noteIndex(note){ return NOTES_12.indexOf(note); }

function buildKeyOptions(){
  const keySel = $("#keySelect");
  NOTES_12.forEach(n => {
    const opt = document.createElement("option");
    opt.value = n;
    opt.textContent = n;
    if(n==="C") opt.selected = true;
    keySel.appendChild(opt);
  });
}

function buildGenreOptions(){
  const gSel = $("#genreSelect");
  Object.keys(GENRES).forEach(g => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g;
    gSel.appendChild(opt);
  });
  gSel.value = "メジャー系";
}

function populateScalesByGenre(){
  const genre = $("#genreSelect").value;
  const sSel = $("#scaleSelect");
  sSel.innerHTML = "";
  GENRES[genre].forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    sSel.appendChild(opt);
  });
}

function makeFretboardData(keyRoot, scaleName){
  const rootIdx = noteIndex(keyRoot);
  const intervals = SCALE_DEFS[scaleName];
  const scaleSet = new Set(intervals.map(i => mod(rootIdx + i, 12)));
  return {rootIdx, intervals, scaleSet};
}

function generateSVG(keyRoot, scaleName, mode="dots"){
  const {rootIdx, intervals, scaleSet} = makeFretboardData(keyRoot, scaleName);

  const strings = 6;
  const frets = FRETS;
  const cellW = 80;  // 大きめ
  const cellH = 48;  // 大きめ
  const padL = 40, padR = 20, padT = 30, padB = 36;

  const W = padL + padR + cellW * (frets + 1);
  const H = padT + padB + cellH * (strings - 1);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("role","img");

  // 背景
  const bg = rect(0,0,W,H,"#ffffff");
  bg.setAttribute("rx","12"); bg.setAttribute("ry","12");
  svg.appendChild(bg);

  // フレット線
  for(let f=0; f<=frets; f++){
    const x = padL + cellW * f;
    const col = f===0 ? "#b08968" : "var(--fret)";
    const w = f===0 ? 6 : (f%12===0 ? 2.5 : 1.5);
    svg.appendChild(line(x, padT, x, H-padB, col, w));
  }
  // 弦（上=1弦, 下=6弦）
  for(let s=0; s<strings; s++){
    const y = padT + cellH * s;
    svg.appendChild(line(padL, y, W-padR, y, "var(--string)", 1.4));
  }

  // ポジションマーク（3,5,7,9,12）
  const markers = [3,5,7,9,12];
  markers.forEach(f => {
    const xCenter = padL + cellW*(f-0.5);
    const yCenter = padT + cellH*(strings-1)/2;
    if(f===12){
      svg.appendChild(circle(xCenter-8, yCenter-8, 4, "#e2e8f0"));
      svg.appendChild(circle(xCenter+8, yCenter+8, 4, "#e2e8f0"));
    }else{
      svg.appendChild(circle(xCenter, yCenter, 4, "#e2e8f0"));
    }
  });

  // 音のドット（1弦が上に来るように TUNING を逆参照）
  for(let s=0; s<strings; s++){
    const drawS = strings - 1 - s; // 0行目=1弦（E4）
    const openNoteIdx = noteIndex(TUNING[drawS]);
    for(let f=0; f<=frets; f++){
      const pitch = mod(openNoteIdx + f, 12);
      if(scaleSet.has(pitch)){
        const xCenter = padL + cellW*(f-0.5);
        const y = padT + cellH*s;
        const isRoot = pitch === rootIdx;

        const r = 14;
        const fill = isRoot ? "var(--root)" : "var(--note)";
        const g = group();
        g.appendChild(circle(xCenter, y, r, fill, 0.95));

        let label = "";
        if(mode === "notes"){
          label = NOTES_12[pitch];
        }else if(mode === "degrees"){
          const semis = mod(pitch - rootIdx, 12);
          label = DEGREE_LABELS[semis] || "";
        }
        if(label){
          const t = text(xCenter, y+4, label);
          t.setAttribute("font-size","11");
          t.setAttribute("text-anchor","middle");
          t.setAttribute("fill","#0b0e14");
          t.setAttribute("font-weight","700");
          g.appendChild(t);
        }
        svg.appendChild(g);
      }
    }
  }

  // フレット番号
  for(let f=0; f<=frets; f++){
    const tx = padL + cellW*f;
    const t = text(tx+4, H-10, String(f));
    t.setAttribute("font-size","10");
    t.setAttribute("fill","#475569");
    svg.appendChild(t);
  }

  return svg;
}

// SVGユーティリティ
function rect(x,y,w,h,fill){
  const e = document.createElementNS("http://www.w3.org/2000/svg","rect");
  e.setAttribute("x",x); e.setAttribute("y",y);
  e.setAttribute("width",w); e.setAttribute("height",h);
  if(fill) e.setAttribute("fill",fill);
  return e;
}
function line(x1,y1,x2,y2,stroke,w=1){
  const e = document.createElementNS("http://www.w3.org/2000/svg","line");
  e.setAttribute("x1",x1); e.setAttribute("y1",y1);
  e.setAttribute("x2",x2); e.setAttribute("y2",y2);
  e.setAttribute("stroke",stroke); e.setAttribute("stroke-width",w);
  e.setAttribute("stroke-linecap","round");
  return e;
}
function circle(cx,cy,r,fill,opacity=1){
  const e = document.createElementNS("http://www.w3.org/2000/svg","circle");
  e.setAttribute("cx",cx); e.setAttribute("cy",cy);
  e.setAttribute("r",r); e.setAttribute("fill",fill);
  e.setAttribute("opacity",opacity);
  return e;
}
function text(x,y,str){
  const e = document.createElementNS("http://www.w3.org/2000/svg","text");
  e.setAttribute("x",x); e.setAttribute("y",y);
  e.textContent = str;
  return e;
}
function group(){ return document.createElementNS("http://www.w3.org/2000/svg","g"); }

function render(){
  const key = $("#keySelect").value;
  const scale = $("#scaleSelect").value;
  const mode = $("#displayMode").value;
  const svg = generateSVG(key, scale, mode);
  const host = $("#fretboard");
  host.replaceWith(svg);
  svg.id = "fretboard";
}

function setup(){
  buildKeyOptions();
  buildGenreOptions();
  populateScalesByGenre();
  // 連動
  $("#genreSelect").addEventListener("change", ()=>{
    populateScalesByGenre();
    render();
  });
  ["#keySelect", "#scaleSelect", "#displayMode"].forEach(sel=>{
    document.querySelector(sel).addEventListener("change", render);
  });
  document.getElementById("downloadBtn").addEventListener("click", downloadPNG);
  render();
}

// SVG→PNGダウンロード
function downloadPNG(){
  const svgEl = document.getElementById("fretboard");
  const serializer = new XMLSerializer();
  const src = serializer.serializeToString(svgEl);
  const svgBlob = new Blob([src], {type:"image/svg+xml;charset=utf-8"});
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = function(){
    const scale = 2;
    const canvas = document.createElement("canvas");
    const vb = svgEl.viewBox.baseVal;
    canvas.width = vb.width * scale;
    canvas.height = vb.height * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob)=>{
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      const key = document.getElementById("keySelect").value;
      const genre = document.getElementById("genreSelect").value;
      const scaleName = document.getElementById("scaleSelect").value;
      a.download = `fretboard_${key}_${genre}_${scaleName}.png`;
      a.click();
    }, "image/png");
  };
  img.src = url;
}

document.addEventListener("DOMContentLoaded", setup);
