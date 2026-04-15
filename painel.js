(() => {

  // REMOVE ANTIGO
  const old = document.getElementById("hack-overlay");
  if (old) old.remove();

  // OVERLAY
  const overlay = document.createElement("div");
  overlay.id = "hack-overlay";

  Object.assign(overlay.style,{
    position:"fixed",
    inset:"0",
    background:"rgba(0,0,0,.88)",
    zIndex:"999999999",
    pointerEvents:"none",
    overflow:"hidden"
  });

  document.body.appendChild(overlay);

  // ================= TERMINAL =================
  const terminal=document.createElement("div");

  Object.assign(terminal.style,{
    position:"absolute",
    top:"20px",
    left:"20px",
    right:"340px",
    bottom:"20px",
    color:"#ff2a2a",
    fontFamily:"Courier New, monospace",
    fontSize:"15px",
    whiteSpace:"pre-wrap",
    textShadow:"0 0 8px #ff0000",
    overflow:"hidden"
  });

  overlay.appendChild(terminal);

  const baseLines=[
    "root@system: initializing kernel...",
    "loading encrypted modules...",
    "syncing remote nodes...",
    "decrypting layer...",
    "bypassing firewall...",
    "injecting packets...",
    "reading memory blocks...",
    "establishing ghost tunnel...",
    "overclocking processors...",
    "injecting remote shell...",
    "access granted ✔"
  ];

  const lines=[];
  for(let i=0;i<120;i++){
    lines.push(
      baseLines[Math.floor(Math.random()*baseLines.length)]
      +" ["+Math.floor(Math.random()*99999)+"]"
    );
  }

  let li=0,ci=0;

  function typeEffect(){

    if(li>=lines.length){
      terminal.innerHTML="";
      li=0;
    }

    const line=lines[li];

    if(ci<line.length){
      terminal.innerHTML=
        terminal.innerHTML.replace("█","")+line[ci]+"█";
      ci++;
    }else{
      terminal.innerHTML=
        terminal.innerHTML.replace("█","")+"\n█";
      li++;ci=0;
    }

    terminal.scrollTop=terminal.scrollHeight;
    setTimeout(typeEffect,18);
  }

  typeEffect();

  // ================= PAINEL =================
  const panel=document.createElement("div");

  Object.assign(panel.style,{
    position:"fixed",
    right:"40px",
    top:"40px",
    fontFamily:"Courier New, monospace",
    fontSize:"16px",
    color:"#ff2a2a",
    lineHeight:"1.9"
  });

  overlay.appendChild(panel);

  const stats={
    cpu:42150,
    node:83393,
    signal:38209,
    server:94826,
    data:49302,
    token:30662
  };

  function spin(v){
    const jump = Math.floor(Math.random()*9000) - 4500;
    const noise = Math.random()*Math.random()*999;
    v = Math.abs((v + jump + noise) ^ (Math.random()*99999));
    v = v % 99999;
    if(v < 10000) v += 10000;
    return v;
  }

  function casino(n){
    return Math.floor(n)
      .toString()
      .padStart(5,"0")
      .split("")
      .map(d=>'<span class="digit">'+d+'</span>')
      .join("");
  }

  let blazeIndex = 0;
  const blazeText = "Blaze.bet.br";

  function typingBlaze(){
    blazeIndex++;
    if(blazeIndex > blazeText.length) blazeIndex = 0;
    return blazeText.slice(0, blazeIndex) + "█";
  }

  function updatePanel(){

    stats.cpu=spin(stats.cpu);
    stats.node=spin(stats.node);
    stats.signal=spin(stats.signal);
    stats.server=spin(stats.server);
    stats.data=spin(stats.data);
    stats.token=spin(stats.token);

    panel.innerHTML=
      "SYSTEM ONLINE<br><br>"+
      "CPU: "+casino(stats.cpu)+"%<br>"+
      "NODE: "+casino(stats.node)+"<br>"+
      "SIGNAL: "+casino(stats.signal)+"<br>"+
      "SERVER: "+casino(stats.server)+"<br><br>"+
      "STATUS: ACTIVE<br><br>"+
      "DATA: "+casino(stats.data)+"<br>"+
      "TOKEN: "+casino(stats.token)+"<br>"+
      typingBlaze();
  }

  setInterval(updatePanel,80);

  // ================= CPU GRAPH =================
  const canvas=document.createElement("canvas");
  canvas.width=260;
  canvas.height=120;

  Object.assign(canvas.style,{
    position:"fixed",
    right:"40px",
    bottom:"40px"
  });

  overlay.appendChild(canvas);

  const ctx=canvas.getContext("2d");
  let graph=[];

  function draw(){

    if(graph.length>60) graph.shift();
    graph.push(Math.random()*100);

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.beginPath();

    graph.forEach((v,i)=>{
      const x=i*4;
      const y=canvas.height-(v*1.1);
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    });

    ctx.strokeStyle="#ff2a2a";
    ctx.lineWidth=2;
    ctx.shadowBlur=10;
    ctx.shadowColor="#ff0000";
    ctx.stroke();

    requestAnimationFrame(draw);
  }

  draw();

  // ================= CSS =================
  const style=document.createElement("style");

  style.textContent = `
    @keyframes blink{
      50%{opacity:.2;}
    }

    .digit{
      display:inline-block;
      font-weight:bold;
      animation:digitGlow 1.5s ease-in-out infinite;
    }

    @keyframes digitGlow{
      0%{text-shadow:0 0 5px #ff0000;}
      50%{
        text-shadow:
          0 0 15px #ff0000,
          0 0 30px #ff2a2a;
      }
      100%{text-shadow:0 0 5px #ff0000;}
    }
  `;

  document.head.appendChild(style);

  window.removeHackOverlay=()=>overlay.remove();

  // ================= ALERTA =================
  setTimeout(() => {

    const alertBox = document.createElement("div");

    Object.assign(alertBox.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "#2b2b2b",
      color: "#fff",
      padding: "20px",
      borderRadius: "10px",
      width: "320px",
      fontFamily: "Arial, sans-serif",
      boxShadow: "0 0 20px rgba(0,0,0,0.8)",
      zIndex: "9999999999",
      textAlign: "left"
    });

    alertBox.innerHTML = `
      <div style="font-size:14px; margin-bottom:10px; opacity:.8;">
        blaze.bet.br diz
      </div>

      <div style="font-size:16px; margin-bottom:15px;">
        System Sha256 bugado<br>
        Blaze.bet.br
      </div>

      <button id="alert-ok-btn" style="
        padding:6px 14px;
        border:none;
        border-radius:6px;
        background:#4a4a4a;
        color:#fff;
        cursor:pointer;
        float:right;
      ">OK</button>
    `;

    document.body.appendChild(alertBox);

    document.getElementById("alert-ok-btn").onclick = () => {
      alertBox.remove();
    };

  }, 90000); // 1 minuto e meio

})();
