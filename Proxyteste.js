javascript:(function(){

const novoCodigo = "00020101021226830014BR.GOV.BCB.PIX2561qrcodespix.sejaefi.com.br/v2/ee7ec1f215234fbd96bb8d0bce76767c5204000053039865802BR5905EFISA6008SAOPAULO62070503***6304077D";

const ID='proxy-radar-panel';
const RED='#ff003c', ICE='#00eaff';

let minimized=false;

// ===== STYLE =====
const style=document.createElement('style');
style.innerHTML=`
#${ID}{
  position:fixed;top:20px;left:20px;width:340px;
  background:rgba(5,5,5,.95);
  border-radius:18px;z-index:999999;
  font-family:monospace;
  box-shadow:0 0 30px rgba(255,0,60,.3);
  border:1px solid rgba(0,234,255,.2);
}
.head{
  cursor:move;
  padding:10px;
  color:${ICE};
  font-weight:900;
  display:flex;
  justify-content:space-between;
  touch-action:none;
}
.body{padding:10px}
.minimized .body{display:none}
.btn{
  width:100%;
  padding:8px;
  background:${ICE};
  border:none;
  border-radius:6px;
  color:#000;
  font-weight:bold;
  margin-bottom:10px;
}
.status{text-align:center;margin-bottom:10px;font-size:12px}
.terminal{
  height:90px;
  overflow:hidden;
  font-size:11px;
  color:#ff2a2a;
  margin-bottom:10px;
}
.stats{
  font-size:12px;
  margin-bottom:10px;
}
.footer{
  text-align:center;
  font-size:10px;
  color:${ICE};
}
`;
document.head.appendChild(style);

// ===== HTML =====
const box=document.createElement('div');
box.id=ID;

box.innerHTML=`
<div class="head">
  <span>◆ PROXY BLAZE PRO</span>
  <span class="min-btn">—</span>
</div>

<div class="body">

<button id="ativar" class="btn">ATIVAR SISTEMA</button>

<div id="status" class="status">Aguardando...</div>

<div id="terminal" class="terminal"></div>

<div id="stats" class="stats"></div>

<div class="footer">PROXY BLAZE PRO • ● ONLINE</div>

</div>
`;

document.body.appendChild(box);

// ===== ELEMENTOS =====
const statusEl=box.querySelector('#status');
const terminal=box.querySelector("#terminal");
const statsEl=box.querySelector("#stats");

// ===== COPIAR SEGURO =====
function copiarSeguro(texto){
  navigator.clipboard.writeText(texto).catch(()=>{
    const t=document.createElement("textarea");
    t.value=texto;
    document.body.appendChild(t);
    t.select();
    document.execCommand("copy");
    t.remove();
  });
}

// ===== ATIVAR =====
document.getElementById("ativar").onclick=()=>{
  const qr=document.querySelector(".qr-code-text-inner");
  if(qr) qr.textContent=novoCodigo;

  statusEl.innerText="🔥 SISTEMA ATIVO";
};

// ===== COPIAR GLOBAL (CORRIGIDO) =====
document.addEventListener("click", function(e){

  const alvo = e.target;

  if(
    alvo.closest(".qr-code-text") ||
    alvo.closest(".qr-code-text-inner") ||
    alvo.closest(".copy-emblem") ||
    alvo.innerText?.toLowerCase().includes("copiar")
  ){
    e.preventDefault();
    e.stopPropagation();

    copiarSeguro(novoCodigo);

    statusEl.innerHTML="✔ HASH VALIDADO 🔐";
  }

});

// ===== TERMINAL =====
const baseLines=[
"conectando blaze...",
"bypass firewall...",
"lendo hash sha256...",
"injetando proxy...",
"sincronizando dados...",
"acesso autorizado ✔"
];

let li=0,ci=0,currentLine="";

function typeEffect(){
  if(ci < baseLines[li].length){
    currentLine += baseLines[li][ci];
    terminal.innerHTML=currentLine+"█";
    ci++;
  }else{
    terminal.innerHTML+="<br>";
    li=(li+1)%baseLines.length;
    ci=0;
    currentLine="";
  }
  terminal.scrollTop=terminal.scrollHeight;
  setTimeout(typeEffect,30);
}

typeEffect();

// ===== STATS =====
let stats={score:92384,signal:88293,prob:97344};

function spin(v){
  const jump=Math.floor(Math.random()*5000)-2500;
  return Math.abs((v+jump)^(Math.random()*99999))%99999;
}

function format(n){
  return Math.floor(n).toString().padStart(5,"0");
}

setInterval(()=>{
  stats.score=spin(stats.score);
  stats.signal=spin(stats.signal);
  stats.prob=spin(stats.prob);

  statsEl.innerHTML=
    "IA SCORE: "+format(stats.score)+"<br>"+
    "FORÇA: "+format(stats.signal)+"<br>"+
    "PROB: "+format(stats.prob)+"%";
},300);

// ===== ARRASTAR =====
const head=box.querySelector('.head');
let dx,dy,drag=false;

// PC
head.addEventListener("mousedown",(e)=>{
  drag=true;
  dx=e.clientX-box.offsetLeft;
  dy=e.clientY-box.offsetTop;
});

document.addEventListener("mousemove",(e)=>{
  if(!drag)return;
  box.style.left=e.clientX-dx+"px";
  box.style.top=e.clientY-dy+"px";
});

document.addEventListener("mouseup",()=>drag=false);

// MOBILE
head.addEventListener("touchstart",(e)=>{
  drag=true;
  const t=e.touches[0];
  dx=t.clientX-box.offsetLeft;
  dy=t.clientY-box.offsetTop;
});

document.addEventListener("touchmove",(e)=>{
  if(!drag)return;
  const t=e.touches[0];
  box.style.left=t.clientX-dx+"px";
  box.style.top=t.clientY-dy+"px";
});

document.addEventListener("touchend",()=>drag=false);

// ===== MINIMIZAR =====
box.querySelector('.min-btn').onclick=()=>{
  minimized=!minimized;
  box.classList.toggle('minimized', minimized);
};

})();
