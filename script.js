const SCALE_THEORY = {
  "アイオニアン": {
    "parent": "メジャースケール",
    "formula": "W-W-H-W-W-W-H（度数: 1 2 3 4 5 6 7）",
    "typical_chords": "IMaj7, I6, I(add9)",
    "tensions": "9, 11, 13（#11は避け）",
    "usage": "メジャートニックでの基本モード。安定・収束。"
  },
  "ドリアン": {
    "parent": "メジャースケール（第2モード）",
    "formula": "W-H-W-W-W-H-W（1 2 ♭3 4 5 6 ♭7）",
    "typical_chords": "IIm7, m6, m9",
    "tensions": "9, 11, 13（6が特徴）",
    "usage": "IIm7上、またはモーダル曲のmトニックで明るいマイナー感を獲得。"
  },
  "フリジアン": {
    "parent": "メジャースケール（第3モード）",
    "formula": "H-W-W-W-H-W-W（1 ♭2 ♭3 4 5 ♭6 ♭7）",
    "typical_chords": "Im7（♭9感）、bIIメジャー関連",
    "tensions": "♭9, 11, ♭13（♭2が特徴）",
    "usage": "エスニック/スペイン風。強い半音上行（♭2→1）。"
  },
  "リディアン": {
    "parent": "メジャースケール（第4モード）",
    "formula": "W-W-W-H-W-W-H（1 2 3 #4 5 6 7）",
    "typical_chords": "IVMaj7, Maj7(#11)",
    "tensions": "9, #11, 13（#11が特徴）",
    "usage": "明るく浮遊感。IV系やモーダルなMajトニック。"
  },
  "ミクソリディアン": {
    "parent": "メジャースケール（第5モード）",
    "formula": "W-W-H-W-W-H-W（1 2 3 4 5 6 ♭7）",
    "typical_chords": "V7, X7（属七全般）",
    "tensions": "9, 11, 13",
    "usage": "属機能。ブルース/ファンク/モーダルで頻用。"
  },
  "エオリアン": {
    "parent": "メジャースケール（第6モード）",
    "formula": "W-H-W-W-H-W-W（1 2 ♭3 4 5 ♭6 ♭7）",
    "typical_chords": "Im7, Im9, Im11",
    "tensions": "9, 11, ♭13",
    "usage": "ナチュラルマイナー。暗く安定。"
  },
  "ロクリアン": {
    "parent": "メジャースケール（第7モード）",
    "formula": "H-W-W-H-W-W-W（1 ♭2 ♭3 4 ♭5 ♭6 ♭7）",
    "typical_chords": "m7♭5（半減七）",
    "tensions": "♭9, 11, ♭13（♭5が特徴）",
    "usage": "IIø7での機能。強い不安定感。"
  },
  "リディアン・ドミナント（Mixolydian #11）": {
    "parent": "メロディックマイナー（第4モード）",
    "formula": "1 2 3 #4 5 6 ♭7",
    "typical_chords": "7(#11), IV7, トライトーン代理",
    "tensions": "9, #11, 13",
    "usage": "ドミナントに#11色を付与。IV7やV7でジャズ的色彩を強化。"
  },
  "アルタード（Super Locrian）": {
    "parent": "メロディックマイナー（第7モード）",
    "formula": "1 ♭2 ♯2 3 ♭5 ♯5 ♭7（解釈差あり）",
    "typical_chords": "V7alt（♭9,♯9,♭5,♯5）",
    "tensions": "♭9, ♯9, ♭5, ♯5",
    "usage": "強烈な属→解決。テンション総動員。"
  },
  "ホールトーン": {
    "parent": "対称スケール",
    "formula": "全音のみ：1 2 3 #4 #5 ♭7",
    "typical_chords": "7(#5), Aug系",
    "tensions": "9, #11, #5",
    "usage": "浮遊感/非機能。オーギュメントやV7#5で使用。"
  },
  "ディミニッシュ（H-W）": {
    "parent": "対称スケール（半→全）",
    "formula": "1 ♭2 ♯2 3 #4 5 6 ♭7",
    "typical_chords": "V7(b9,#9)",
    "tensions": "♭9, ♯9, #11, 13",
    "usage": "属直前の緊張増幅。シーケンス展開に好適。"
  },
  "ディミニッシュ（W-H）": {
    "parent": "対称スケール（全→半）",
    "formula": "1 2 ♭3 4 ♭5 ♯5 6 7",
    "typical_chords": "Dim7",
    "tensions": "9, 11, ♭13（文脈依存）",
    "usage": "ディミニッシュ7そのものの音材。"
  },
  "フリジアン・ドミナント": {
    "parent": "ハーモニックマイナー（第5モード）",
    "formula": "1 ♭2 3 4 5 ♭6 ♭7",
    "typical_chords": "V7♭9",
    "tensions": "♭9, 11, ♭13",
    "usage": "エスニックな属。ラテン/モーダルで映える。"
  },
  "ミクソリディアン♭13": {
    "parent": "メロディックマイナー（第5モード）",
    "formula": "1 2 3 4 5 ♭6 ♭7",
    "typical_chords": "V7♭13, IV7",
    "tensions": "9, 11, ♭13",
    "usage": "ブルージー×ジャジー。"
  },
  "リディアン・オーギュメント": {
    "parent": "メロディックマイナー（第3モード）",
    "formula": "1 2 3 #4 ♯5 6 7",
    "typical_chords": "Maj7(#5)",
    "tensions": "9, #11, #5, 13",
    "usage": "Majに拡張感と不安定さを付与。"
  },
  "ベバップ・ドミナント": {
    "parent": "Mixolydian + M7（パッシング）",
    "formula": "1 2 3 4 5 6 ♭7 7",
    "typical_chords": "V7",
    "tensions": "9, 11, 13（M7は通過音）",
    "usage": "スイング系ライン。拍裏でコードトーン着地。"
  },
  "ベバップ・メジャー": {
    "parent": "Ionian + ♭6（パッシング）",
    "formula": "1 2 3 4 5 ♭6 6 7",
    "typical_chords": "IMaj7",
    "tensions": "9, 11, 13（♭6は通過音）",
    "usage": "Iメジャーでの8音化。リズミックな通過。"
  },
  "ドリアン♭2": {
    "parent": "メロディックマイナー（第2モード）",
    "formula": "1 ♭2 ♭3 4 5 6 ♭7",
    "typical_chords": "m7（b9ニュアンス）, bII関連",
    "tensions": "♭9, 11, 13",
    "usage": "エスニック/モーダルなm上。"
  }
};

// v14: clean baseline with robust init, fit-to-width zoom, info label
(function(){
  const onReady = (fn)=> document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);
  onReady(()=>{ try{ setup(); }catch(e){ console.error('Setup error', e); alert('初期化でエラーが起きたかも。リロードしてね\n'+e.message); } });

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
    "ロクリアン":[0,1,3,5,6,8,10],

  // --- Jazz oriented ---
  "リディアン・ドミナント（Mixolydian #11）":[0,2,4,6,7,9,10],
  "アルタード（Super Locrian）":[0,1,3,4,6,8,10],
  "ホールトーン":[0,2,4,6,8,10],
  "ディミニッシュ（H-W）":[0,1,3,4,6,7,9,10],
  "ディミニッシュ（W-H）":[0,2,3,5,6,8,9,11],
  "フリジアン・ドミナント":[0,1,4,5,7,8,10],
  "ミクソリディアン♭13":[0,2,4,5,7,8,10],
  "リディアン・オーギュメント":[0,2,4,6,8,9,11],
  "ベバップ・ドミナント":[0,2,4,5,7,9,10,11],
  "ベバップ・メジャー":[0,2,4,5,7,8,9,11],
  "ドリアン♭2":[0,1,3,5,7,9,10],
  };

  const SCALE_DESCRIPTIONS = {"アイオニアン": "メジャースケールそのもの。Iメジャーコード上で使用され、完全五度を含む安定感のある響きを持つ。機能和声においてはトニック機能を担う。", "ドリアン": "IIm7コード上で使用されるモード。短三度と長六度を含み、ナチュラルマイナーよりも明るい響き。ジャズのマイナーII-V進行やモーダルジャズで頻用。", "フリジアン": "Im7コード上で使用され、短二度の半音進行が特徴。スペイン音楽やエスニックな響きを演出。bIIメジャーとの関係性が強い。", "リディアン": "IVMaj7コード上で使用されるモード。#11を含み、明るく浮遊感のある響き。モーダルジャズではIonianよりも好まれることが多い。", "ミクソリディアン": "V7コード上で使用されるモード。長三度と短七度を含み、属機能を強調。ブルース、ファンク、モーダルジャズで頻用。", "エオリアン": "ナチュラルマイナースケールそのもの。VIマイナーコード上で使用され、暗く安定した響きを持つ。トニックマイナーとしても機能。", "ロクリアン": "m7♭5コード上で使用されるモード。短二度と減五度を含み、不安定で緊張感のある響き。IIø7としての機能が代表的。", "ジャズメジャー": "自然短音階の6度と7度を半音上げた構成。ImMaj7で使用され、現代ジャズのマイナー・トニックにおける基本スケール。", "ドリアン♭2": "メロディックマイナーの2ndモード。bII7やエスニックな響きを持たせたい場面で使用。", "リディアン♯5": "メロディックマイナーの3rdモード。Maj7(#5)コード上に使用され、明るくも不安定な響きを持つ。", "ミクソリディアン♭6": "メロディックマイナーの5thモード。V7♭13で使用され、ブルース感とジャズ感を融合。", "ロクリアン♮2": "メロディックマイナーの6thモード。m7♭5コード上で使用され、ナチュラル9により柔らかい響き。", "オルタード": "メロディックマイナーの7thモード。V7altに使用され、♭9, ♯9, ♭5, ♯5をすべて含むため強烈な解決感。", "ホールトーン": "全音のみで構成された対称スケール。AugやV7♯5コードに使用され、浮遊感のある響き。", "ディミニッシュ(H-W)": "半音→全音の繰り返し。V7(b9, #9)コードに使用され、対称性を活かしたフレーズ展開が可能。", "ディミニッシュ(W-H)": "全音→半音の繰り返し。Dim7コードに使用され、安定的な緊張感を提供。"};

const GENRES = {
    "メジャー系":["メジャー（Ionian）","メジャー・ペンタトニック","ブルース・メジャー"],
    "マイナー系":["ナチュラル・マイナー（Aeolian）","ハーモニック・マイナー","メロディック・マイナー（上行）","マイナー・ペンタトニック","ブルース・マイナー"],
    "チャーチモード":["ドリアン","フリジアン","リディアン","ミクソリディアン","ロクリアン"],

  "ジャズ系":[
    "リディアン・ドミナント（Mixolydian #11）",
    "アルタード（Super Locrian）",
    "ホールトーン",
    "ディミニッシュ（H-W）",
    "ディミニッシュ（W-H）",
    "フリジアン・ドミナント",
    "ミクソリディアン♭13",
    "リディアン・オーギュメント",
    "ベバップ・ドミナント",
    "ベバップ・メジャー",
    "ドリアン♭2"
  ],
  };

  const TENSION_MAP = {"b9":1,"9":2,"#9":3,"11":5,"#11":6,"b13":8,"13":9};
  const SEMI_TO_TENSION = Object.fromEntries(Object.entries(TENSION_MAP).map(([k,v])=>[v,k]));

  const TUNING = ["E","A","D","G","B","E"]; // 6→1
  const FRETS = 12;
  const CELL_W = 120;
  const CELL_H = 72;

  const $ = (s)=>document.querySelector(s);
  const $$ = (s)=>Array.from(document.querySelectorAll(s));
  const option = (v,t)=>{ const o=document.createElement('option'); o.value=v; o.textContent=t; return o; };
  const mod=(n,m)=>((n%m)+m)%m;
  const noteIndex=(n)=>NOTES_12.indexOf(n);

  function buildKeyOptions(){ const sel=$("#keySelect"); if(!sel) return; sel.innerHTML=""; NOTES_12.forEach(n=>sel.appendChild(option(n,n))); sel.value=sel.value||"C"; }
  function buildGenreOptions(){ const sel=$("#genreSelect"); if(!sel) return; sel.innerHTML=""; Object.keys(GENRES).forEach(g=>sel.appendChild(option(g,g))); sel.value=sel.value||"メジャー系"; }
  function populateScalesByGenre(){ const g=$("#genreSelect"); const s=$("#scaleSelect"); if(!g||!s) return; s.innerHTML=""; (GENRES[g.value]||[]).forEach(n=>s.appendChild(option(n,n))); if(!s.value) s.value=s.options[0]?.value||""; }

  function getSelectedTensions(){ return $$('.tension:checked').map(el=>el.value); }

  function makeFretboardData(key,scaleName,tensions){
    const root=noteIndex(key);
    const base=SCALE_DEFS[scaleName]||SCALE_DEFS["メジャー（Ionian）"];
    const tSemis = tensions.map(t=>TENSION_MAP[t]).filter(v=>v!=null);
    const totalSemis = Array.from(new Set([...base, ...tSemis])).map(x=>mod(x,12)).sort((a,b)=>a-b);
    const scaleSet = new Set(totalSemis.map(i=>mod(root+i,12)));
    return {rootIdx:root, base, tSemis, totalSemis, scaleSet};
  }

  function generateSVG(key,scaleName,mode="dots",tensions=[]){
    const {rootIdx, tSemis, totalSemis, scaleSet} = makeFretboardData(key,scaleName,tensions);
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

  function renderScaleTable(key, scaleName, tensions){
    const host = $("#scaleTable");
    if(!host) return;
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

  // ---- Zoom overlay ----
  let _zooming=false;
  function openZoom(){
    if(_zooming) return; _zooming=true;
    const overlay=$("#zoomOverlay"), stage=$("#zoomStage"), label=$("#zoomInfoLabel");
    stage.innerHTML="";
    // clone svg
    const src=$("#fretboard"); const clone=src.cloneNode(true); clone.removeAttribute("id");
    const g=document.createElementNS("http://www.w3.org/2000/svg","g");
    while(clone.firstChild){ g.appendChild(clone.firstChild); }
    clone.appendChild(g); g.setAttribute("id","zoomTransform");
    stage.appendChild(clone);
    clone.style.width="100%"; clone.style.height="100%"; clone.setAttribute("preserveAspectRatio","xMidYMid meet");
    // info label text
    const key=$("#keySelect")?.value||"C";
    const scale=$("#scaleSelect")?.value||"メジャー（Ionian）";
    const tens=getSelectedTensions(); label.textContent = key+"｜"+scale+(tens.length?("｜"+tens.join(', ')):"");
    overlay.hidden=false; document.body.style.overflow="hidden";
    setupPanZoom(clone,g,true);
  }
  function closeZoom(){ $("#zoomOverlay").hidden=true; document.body.style.overflow=""; _zooming=false; }

  function setupPanZoom(svg,g,fitWidth=false){
    let scale=1, tx=0, ty=0;
    const pointers=new Map();
    let lastDist=null,lastCenter=null;

    function apply(){ g.setAttribute('transform',`translate(${tx},${ty}) scale(${scale})`); }
    function getPoint(evt){
      const rect = svg.getBoundingClientRect();
      const x = (evt.clientX - rect.left) * (svg.viewBox.baseVal.width / rect.width);
      const y = (evt.clientY - rect.top) * (svg.viewBox.baseVal.height / rect.height);
      return {x,y};
    }
    function distance(a,b){ return Math.hypot(a.x-b.x,a.y-b.y); }
    function center(a,b){ return {x:(a.x+b.x)/2, y:(a.y+b.y)/2}; }

    // initial fit-to-width + vertical center
    if(fitWidth){
      requestAnimationFrame(()=>{
        // Fit-to-width is handled by preserveAspectRatio='xMidYMid meet'.
        // To keep the fretboard perfectly centered, don't add manual offsets.
        const vb = svg.viewBox.baseVal;
        scale = 1;
        tx = 0; ty = 0; // let SVG handle centering
        apply();
      });
    }

    svg.addEventListener('pointerdown',(e)=>{ svg.setPointerCapture(e.pointerId); pointers.set(e.pointerId,getPoint(e)); });
    svg.addEventListener('pointermove',(e)=>{
      if(!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId,getPoint(e));
      if(pointers.size===1){
        const p=[...pointers.values()][0];
        if(lastCenter){ tx += (p.x-lastCenter.x); ty += (p.y-lastCenter.y); apply(); }
        lastCenter=p;
      }else if(pointers.size===2){
        const [p1,p2]=[...pointers.values()];
        const c=center(p1,p2), d=distance(p1,p2);
        if(lastDist && lastCenter){
          const ds=d/lastDist;
          const preX=(c.x-tx)/scale, preY=(c.y-ty)/scale;
          scale=Math.max(1,Math.min(8,scale*ds));
          tx=c.x-preX*scale; ty=c.y-preY*scale;
          apply();
        }
        lastDist=d; lastCenter=c;
      }
      e.preventDefault();
    });
    svg.addEventListener('pointerup',(e)=>{ pointers.delete(e.pointerId); if(pointers.size===0){ lastDist=null; lastCenter=null; } });
    svg.addEventListener('pointercancel',(e)=>{ pointers.delete(e.pointerId); if(pointers.size===0){ lastDist=null; lastCenter=null; } });
    svg.addEventListener('wheel',(e)=>{
      const c=getPoint(e); const preX=(c.x-tx)/scale, preY=(c.y-ty)/scale;
      const delta=e.deltaY<0?1.1:0.9; scale=Math.max(1,Math.min(8,scale*delta));
      tx=c.x-preX*scale; ty=c.y-preY*scale; apply(); e.preventDefault();
    },{passive:false});
    svg.addEventListener('dblclick',()=>{ scale=1; tx=0; ty=0; apply(); });

    // tap anywhere to close (when not dragging)
    const overlay=$("#zoomOverlay");
    overlay.addEventListener('click',(e)=>{ if(pointers.size>0) return; closeZoom(); });
  }

  // SVG helpers
  function rect(x,y,w,h,fill){const e=document.createElementNS('http://www.w3.org/2000/svg','rect'); e.setAttribute('x',x); e.setAttribute('y',y); e.setAttribute('width',w); e.setAttribute('height',h); e.setAttribute('fill',fill); return e;}
  function line(x1,y1,x2,y2,stroke,w){const e=document.createElementNS('http://www.w3.org/2000/svg','line'); e.setAttribute('x1',x1); e.setAttribute('y1',y1); e.setAttribute('x2',x2); e.setAttribute('y2',y2); e.setAttribute('stroke',stroke); e.setAttribute('stroke-width',w); e.setAttribute('stroke-linecap','round'); return e;}
  function circle(cx,cy,r,fill,op){const e=document.createElementNS('http://www.w3.org/2000/svg','circle'); e.setAttribute('cx',cx); e.setAttribute('cy',cy); e.setAttribute('r',r); e.setAttribute('fill',fill); e.setAttribute('opacity',op); return e;}
  function text(x,y,str){const e=document.createElementNS('http://www.w3.org/2000/svg','text'); e.setAttribute('x',x); e.setAttribute('y',y); e.textContent=str; return e;}
  function group(){return document.createElementNS('http://www.w3.org/2000/svg','g');}

  function render(){
    const key=$("#keySelect").value;
    const scaleName=$("#scaleSelect").value;
    const mode=$("#displayMode").value;
    const tensions = getSelectedTensions();
    const svg=generateSVG(key,scaleName,mode,tensions);
    $("#fretboard").replaceWith(svg);
    svg.id="fretboard";
    renderScaleTable(key, scaleName, tensions);
    svg.addEventListener('click', openZoom);
  }

  function setup(){
    buildKeyOptions();
    buildGenreOptions();
    populateScalesByGenre();
    $("#genreSelect").addEventListener('change',()=>{ populateScalesByGenre(); render(); });
    ["#keySelect","#scaleSelect","#displayMode"].forEach(sel=>$(sel).addEventListener('change',render));
    document.getElementById('downloadBtn').addEventListener('click',downloadPNG);
    document.getElementById('tensionClearBtn').addEventListener('click', ()=>{ document.querySelectorAll('.tension').forEach(el=>el.checked=false); render(); });
    document.querySelectorAll('.tension').forEach(el=>el.addEventListener('change', render));

    // First render + sanity retry
    render();
    setTimeout(()=>{
      const g=$("#genreSelect"), s=$("#scaleSelect");
      if(g && s && (g.options.length===0 || s.options.length===0)){ buildKeyOptions(); buildGenreOptions(); populateScalesByGenre(); render(); }
    }, 200);
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
})();


// ---- Theory modal ----
const theoryBtn = document.getElementById('theoryBtn');
const theoryModal = document.getElementById('theoryModal');
const theoryClose = document.getElementById('theoryClose');
const theoryBody = document.getElementById('theoryBody');
function openTheory(){
  const key = document.getElementById('keySelect').value;
  const scaleSel = document.getElementById('scaleSelect');
  const scaleName = scaleSel.options[scaleSel.selectedIndex].text.trim();
  const pureName = scaleName.replace(/^.*?\s*\|\s*/, '').replace(/\s*\|.*$/, '');
  const info = SCALE_THEORY[pureName] || {};
  // Also show description if available
  const desc = (typeof SCALE_DESCRIPTIONS !== 'undefined') ? (SCALE_DESCRIPTIONS[pureName]||'') : '';

  const rows = [
    ['キー', key],
    ['スケール', pureName],
    ['親スケール/モード', info.parent || '-'],
    ['度数/構成', info.formula || '-'],
    ['テンション', info.tensions || '-'],
    ['適用コード', info.typical_chords || '-'],
    ['使用上の要点', desc || info.usage || '-']
  ];

  let html = '';
  for(const [label, val] of rows){
    html += `<div class="row"><span class="label">${label}</span><span class="value">${val}</span></div>`;
  }
  theoryBody.innerHTML = html;
  theoryModal.hidden = false;
}
function closeTheory(){ theoryModal.hidden = true; }
if(theoryBtn){ theoryBtn.addEventListener('click', openTheory); }
if(theoryClose){ theoryClose.addEventListener('click', closeTheory); }
theoryModal?.addEventListener('click', (e)=>{ if(e.target === theoryModal) closeTheory(); });



// ---- Theory modal (robust) ----
(function(){
  function ensureModal(){
    let modal = document.getElementById('theoryModal');
    if(modal) return modal;
    // create modal dynamically if missing
    modal = document.createElement('div');
    modal.id = 'theoryModal';
    modal.hidden = true;
    modal.innerHTML = `
      <div class="theory-dialog" role="dialog" aria-modal="true" aria-labelledby="theoryTitle">
        <div class="theory-header">
          <h3 id="theoryTitle">スケールの説明</h3>
          <button id="theoryClose" aria-label="閉じる">×</button>
        </div>
        <div id="theoryBody" class="theory-body"></div>
      </div>`;
    document.body.appendChild(modal);
    return modal;
  }

  function openTheory(){
    const modal = ensureModal();
    const body = modal.querySelector('#theoryBody');
    const keySel = document.getElementById('keySelect');
    const scaleSel = document.getElementById('scaleSelect');
    if(!keySel || !scaleSel){ console.warn('[theory] selects not ready'); return; }
    const key = keySel.value;
    const selectedText = scaleSel.options[scaleSel.selectedIndex]?.text?.trim() || scaleSel.value;
    const pureName = selectedText.replace(/^.*?\s*\|\s*/, '').replace(/\s*\|.*$/, '');
    const info = (typeof SCALE_THEORY!=='undefined' && SCALE_THEORY[pureName]) ? SCALE_THEORY[pureName] : {};
    const desc = (typeof SCALE_DESCRIPTIONS!=='undefined' && SCALE_DESCRIPTIONS[pureName]) ? SCALE_DESCRIPTIONS[pureName] : '';

    const rows = [
      ['キー', key],
      ['スケール', pureName],
      ['親スケール/モード', info.parent || '-'],
      ['度数/構成', info.formula || '-'],
      ['テンション', info.tensions || '-'],
      ['適用コード', info.typical_chords || '-'],
      ['使用上の要点', desc || info.usage || '-']
    ];

    body.innerHTML = rows.map(([l,v])=>`<div class="row"><span class="label">${l}</span><span class="value">${v}</span></div>`).join('');
    modal.hidden = false;

    // wire close each time
    modal.querySelector('#theoryClose')?.addEventListener('click', ()=>{ modal.hidden = true; }, {once:true});
    modal.addEventListener('click', (e)=>{ if(e.target === modal){ modal.hidden = true; } }, {once:true});
  }

  function bindTheory(){
    const btn = document.getElementById('theoryBtn');
    if(btn){ btn.addEventListener('click', openTheory); return true; }
    return false;
  }

  if(!bindTheory()){
    // try again after first render
    document.addEventListener('readystatechange', ()=>{ if(document.readyState==='complete') bindTheory(); });
    setTimeout(bindTheory, 300);
  }
})();
