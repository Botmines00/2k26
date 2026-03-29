alert("System Sha256 bugado\nBlaze.bet.br");

(() => {
  const ID='ultra-premium-panel';
  if(document.getElementById(ID)) document.getElementById(ID).remove();

  const API='https://blaze.bet.br/api/singleplayer-originals/originals/roulette_games/recent/1';
  const INTERVAL=1200;
  const BAR_TIME=1000;
  const MAX_ENTRIES=10;

  const RED='#ff003c';
  const ICE='#00eaff';
  const GREEN='#00ff66';

  const SEQ=[
    'black','red','red','black','red',
    'black','red','red','black','red'
  ];

  let idx=0,lastId=null,entries=0,finished=false,minimized=false;

  const style=document.createElement('style');
  style.innerHTML=`
  #${ID}{
    position:fixed;top:20px;right:20px;width:300px;background:rgba(5,5,5,.92);
    border-radius:18px;overflow:hidden;z-index:999999;font-family:monospace;
    box-shadow:
      0 0 25px rgba(255,0,60,.22),
      0 0 50px rgba(0,234,255,.08),
      inset 0 0 18px rgba(255,255,255,.03);
    border:1px solid rgba(0,234,255,.08);
    backdrop-filter:blur(6px);
  }

  #matrix-bg{
    position:absolute;inset:0;width:100%;height:100%;opacity:.25;
  }

  .head,.body{position:relative;z-index:2}

  .head{
    cursor:move;padding:10px;font-size:13px;font-weight:900;color:${ICE};
    display:flex;justify-content:space-between;align-items:center;
    background:linear-gradient(90deg, rgba(0,234,255,.04), rgba(255,0,60,.03), rgba(0,234,255,.04));
    border-bottom:1px solid rgba(255,255,255,.04);
  }

  .title-glow{animation:pulseGlow 1.5s infinite alternate}

  @keyframes pulseGlow{
    from{text-shadow:0 0 5px ${ICE}}
    to{text-shadow:0 0 20px ${ICE}}
  }

  .min-btn{cursor:pointer;color:${RED}}

  .body{padding:12px;position:relative}

  .status{
    text-align:center;
    font-size:13px;
    font-weight:900;
    margin-bottom:12px;
    position:relative;
    min-height:42px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    overflow:hidden;
  }

  .status-text{
    display:inline-block;
    opacity:0;
    transform:translateX(-40px);
    filter:blur(1px);
    letter-spacing:1px;
  }

  .status.reveal .status-text{
    animation:signalSlideIn .55s cubic-bezier(.22,1,.36,1) forwards;
  }

  @keyframes signalSlideIn{
    0%{
      opacity:0;
      transform:translateX(-55px);
      filter:blur(3px);
    }
    60%{
      opacity:1;
      transform:translateX(6px);
      filter:blur(.6px);
    }
    100%{
      opacity:1;
      transform:translateX(0);
      filter:blur(0);
    }
  }

  .signal-loader{
    width:86%;
    height:6px;
    border-radius:999px;
    margin:0 auto 8px;
    position:relative;
    overflow:hidden;
    background:rgba(255,255,255,.06);
    border:1px solid rgba(255,255,255,.04);
    box-shadow:
      inset 0 0 8px rgba(255,255,255,.03),
      0 0 8px rgba(0,234,255,.06);
  }

  .signal-loader::before{
    content:'';
    position:absolute;
    inset:0;
    width:0%;
    border-radius:999px;
    background:linear-gradient(90deg,
      rgba(0,234,255,.25),
      rgba(255,255,255,.85),
      rgba(255,0,60,.55)
    );
    box-shadow:
      0 0 8px rgba(0,234,255,.45),
      0 0 16px rgba(255,0,60,.25);
    animation:signalLoadFill .35s cubic-bezier(.22,1,.36,1) forwards;
  }

  @keyframes signalLoadFill{
    from{width:0%}
    to{width:100%}
  }

  .signal-loader.hide{
    animation:loaderFadeOut .18s ease forwards;
  }

  @keyframes loaderFadeOut{
    to{
      opacity:0;
      transform:scaleX(.98);
    }
  }

  .red{
    color:${RED};
    text-shadow:
      0 0 10px ${RED},
      0 0 18px rgba(255,0,60,.75),
      0 0 28px rgba(255,0,60,.35);
  }

  .black{
    color:${ICE};
    text-shadow:
      0 0 10px ${ICE},
      0 0 18px rgba(0,234,255,.75),
      0 0 28px rgba(0,234,255,.35);
  }

  .radar-shell{
    width:120px;height:120px;margin:12px auto;perspective:600px;
  }

  .radar3d{
    width:100%;height:100%;border-radius:50%;position:relative;
    transform-style:preserve-3d;
    animation:rotate3d 3s linear infinite;
    background:
      radial-gradient(circle,
        rgba(255,0,60,.12) 0%,
        rgba(0,234,255,.035) 42%,
        rgba(0,234,255,.01) 58%,
        transparent 72%);
    box-shadow:
      inset 0 0 18px rgba(0,234,255,.05),
      0 0 18px rgba(0,234,255,.08);
  }

  @keyframes rotate3d{
    0%{transform:rotateX(65deg) rotateZ(0deg)}
    100%{transform:rotateX(65deg) rotateZ(360deg)}
  }

  .scan{
    position:absolute;inset:-25%;
    background:conic-gradient(
      transparent 0deg,
      rgba(0,234,255,.08) 40deg,
      rgba(0,234,255,.18) 75deg,
      rgba(0,234,255,.08) 105deg,
      transparent 150deg
    );
    filter:blur(.4px);
    animation:spin 1s linear infinite;
    mix-blend-mode:screen;
  }

  .ring{
    position:absolute;inset:0;border-radius:50%;
    background:conic-gradient(${RED} var(--p), rgba(255,255,255,.08) 0);
    mask:radial-gradient(circle, transparent 60%, #000 62%);
    box-shadow:0 0 12px rgba(255,0,60,.18);
  }

  .percent{
    position:absolute;inset:0;
    display:flex;align-items:center;justify-content:center;
    color:#fff;font-weight:900;
    text-shadow:0 0 8px rgba(255,255,255,.18);
  }

  .log-wrapper{
    max-height:0;
    overflow:hidden;
    transition:max-height .35s ease;
    border-top:1px solid rgba(255,255,255,.05);
    margin-top:10px;
  }

  #${ID}:hover .log-wrapper{
    max-height:150px;
  }

  .log-wrapper div{
    font-size:11px;
    padding:3px 4px;
  }

  .footer{
    text-align:center;font-size:10px;margin-top:8px;color:${ICE};
  }

  .online-green{
    color:${GREEN};
    text-shadow:0 0 10px ${GREEN},0 0 20px ${GREEN};
  }

  .final-msg{
    position:absolute;
    inset:0;
    display:flex;
    align-items:center;
    justify-content:center;
    background:rgba(0,0,0,.96);
    font-size:22px;
    font-weight:900;
    color:${RED};
    letter-spacing:2px;
    z-index:999;
    text-shadow:0 0 20px ${RED};
    animation:glitchMain .18s infinite, blinkHack .7s infinite alternate;
  }

  .final-msg::before,
  .final-msg::after{
    content:'BUG PRO FINISHED';
    position:absolute;
    left:0;
    right:0;
    text-align:center;
  }

  .final-msg::before{
    color:${ICE};
    transform:translate(-2px,-2px);
    clip-path:polygon(0 2%,100% 2%,100% 35%,0 35%);
    animation:glitchTop .2s infinite;
  }

  .final-msg::after{
    color:#fff;
    transform:translate(2px,2px);
    clip-path:polygon(0 65%,100% 65%,100% 100%,0 100%);
    animation:glitchBottom .15s infinite;
  }

  @keyframes glitchMain{
    0%{transform:translate(0)}
    20%{transform:translate(-2px,2px)}
    40%{transform:translate(2px,-2px)}
    60%{transform:translate(-1px,1px)}
    80%{transform:translate(1px,-1px)}
    100%{transform:translate(0)}
  }

  @keyframes glitchTop{
    0%{transform:translate(-2px,-2px)}
    50%{transform:translate(2px,2px)}
    100%{transform:translate(-2px,-2px)}
  }

  @keyframes glitchBottom{
    0%{transform:translate(2px,2px)}
    50%{transform:translate(-2px,-2px)}
    100%{transform:translate(2px,2px)}
  }

  @keyframes blinkHack{
    from{opacity:1}
    to{opacity:.55}
  }

  .minimized .body{display:none}

  @keyframes spin{
    to{transform:rotate(360deg)}
  }
  `;
  document.head.appendChild(style);

  const box=document.createElement('div');
  box.id=ID;
  box.innerHTML=`
    <canvas id="matrix-bg"></canvas>
    <div class="head">
      <span class="title-glow">◆ ALAVANCAGEM BUG PRO10X</span>
      <span class="min-btn">—</span>
    </div>
    <div class="body">
      <div id="status" class="status">
        <div class="status-text">AGUARDANDO FINALIZAR...</div>
      </div>

      <div class="radar-shell">
        <div id="radar" class="radar3d" style="--p:0%">
          <div class="ring"></div>
          <div class="scan"></div>
          <div id="percent" class="percent">0%</div>
        </div>
      </div>

      <div class="log-wrapper" id="log"></div>

      <div class="footer">
        ALAVANCAGEM 10X • <span class="online-green">● ONLINE</span>
      </div>
    </div>
  `;
  document.body.appendChild(box);

  const canvas=box.querySelector('#matrix-bg');
  const ctx=canvas.getContext('2d');
  canvas.width=300;
  canvas.height=340;

  const letters='01アイウエオXYZ#$%';
  const drops=Array(30).fill(1);

  function drawMatrix(){
    ctx.fillStyle='rgba(0,0,0,.03)';
    ctx.fillRect(0,0,300,340);
    ctx.shadowBlur=14;
    ctx.shadowColor='#ff003c';
    ctx.fillStyle='#ff1a4d';
    ctx.font='bold 10px monospace';
    for(let i=0;i<drops.length;i++){
      const t=letters[Math.floor(Math.random()*letters.length)];
      ctx.fillText(t,i*10,drops[i]*10);
      if(drops[i]*10>340&&Math.random()>.975)drops[i]=0;
      drops[i]++;
    }
    ctx.shadowBlur=0;
  }

  setInterval(drawMatrix,50);

  const head=box.querySelector('.head');
  let dx,dy,drag=false;

  head.onmousedown=e=>{
    drag=true;
    dx=e.clientX-box.offsetLeft;
    dy=e.clientY-box.offsetTop;
  };

  document.onmousemove=e=>{
    if(drag){
      box.style.left=e.clientX-dx+'px';
      box.style.top=e.clientY-dy+'px';
      box.style.right='auto';
    }
  };

  document.onmouseup=()=>drag=false;

  box.querySelector('.min-btn').onclick=()=>{
    minimized=!minimized;
    box.classList.toggle('minimized', minimized);
  };

  const statusEl=box.querySelector('#status');
  const radar=box.querySelector('#radar');
  const percentEl=box.querySelector('#percent');
  const logEl=box.querySelector('#log');

  function runRadar(){
    let s=Date.now();
    const t=setInterval(()=>{
      const p=Math.min(100,((Date.now()-s)/BAR_TIME)*100);
      radar.style.setProperty('--p',p+'%');
      percentEl.textContent=(p|0)+'%';
      if(p>=100) clearInterval(t);
    },16);
  }

  function addLog(c){
    const d=document.createElement('div');
    d.className=c;
    d.textContent='INFILTRATION • '+(c==='red'?'RED':'BLACK');
    logEl.prepend(d);
  }

  function showFinal(){
    const msg=document.createElement('div');
    msg.className='final-msg';
    msg.textContent='BUG PRO FINISHED';
    box.querySelector('.body').appendChild(msg);
  }

  function showSignalAnimated(c){
    statusEl.className='status';

    const loader=document.createElement('div');
    loader.className='signal-loader';

    const text=document.createElement('div');
    text.className='status-text '+c;
    text.textContent='SIGNAL '+(c==='red'?'VERMELHO':'PRETO');

    statusEl.innerHTML='';
    statusEl.appendChild(loader);
    statusEl.appendChild(text);

    setTimeout(()=>{
      loader.classList.add('hide');
    },300);

    setTimeout(()=>{
      statusEl.classList.add('reveal');
    },320);
  }

  async function poll(){
    if(finished) return;
    try{
      const r=await fetch(API,{cache:'no-store'});
      const d=await r.json();
      const g=d[0];
      if(!g) return;

      const id=g.id||g.created_at;

      if(id!==lastId){
        lastId=id;

        const c=SEQ[idx++ % SEQ.length];

        showSignalAnimated(c);

        addLog(c);
        runRadar();

        entries++;
        if(entries>=MAX_ENTRIES){
          finished=true;
          showFinal()
        }
      }
    }catch(e){
      console.log('Erro ao buscar API:', e);
    }
  }

  setInterval(poll,INTERVAL);
  poll();
})();
