/* ================= Canvas (constellations 1:1) ================= */
export function initCanvas() {
  initBgCanvas();
  initHeroCanvas();
}

/* -------- Background Constellation -------- */
function initBgCanvas() {
  const bgCanvas = document.getElementById("bgCanvas");
  if (!bgCanvas) return;
  const bgCtx = bgCanvas.getContext("2d");

  let particles = [];
  const particleCount = 80;   // numero punti
  const maxDistance = 120;    // distanza massima per collegare le linee

  // full-screen e ridimensionamento
  function resizeBG() {
    bgCanvas.width  = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeBG, { passive: true });
  resizeBG();

  // crea particelle
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6
    });
  }

  // mouse globale (il canvas ha pointer-events:none)
  const mouse = { x: null, y: null };
  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });
  window.addEventListener("mouseleave", () => {
    mouse.x = mouse.y = null;
  }, { passive: true });

  function animateBG() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    // aggiorna e disegna punti
    particles.forEach(p => {
      // reazione al mouse (aggiorna le velocità per effetto più fluido)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150 && dist > 0.001) {
          p.vx += (dx / dist) * 0.05;
          p.vy += (dy / dist) * 0.05;
        }
      }

      // movimento base
      p.x += p.vx;
      p.y += p.vy;

      // rimbalzo bordi
      if (p.x < 0 || p.x > bgCanvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > bgCanvas.height) p.vy *= -1;

      // attrito leggero
      p.vx *= 0.99; p.vy *= 0.99;

      // disegna punto
      bgCtx.beginPath();
      bgCtx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      bgCtx.fillStyle = "#17A2B8"; // ciano
      bgCtx.fill();
    });

    // disegna linee tra punti vicini
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < maxDistance) {
          const alpha = 1 - d / maxDistance;
          bgCtx.strokeStyle = `rgba(0, 123, 255, ${alpha * 0.6})`; // blu
          bgCtx.lineWidth = 1;
          bgCtx.beginPath();
          bgCtx.moveTo(a.x, a.y);
          bgCtx.lineTo(b.x, b.y);
          bgCtx.stroke();
        }
      }
    }

    requestAnimationFrame(animateBG);
  }
  animateBG();
}

/* -------- Hero Constellation -------- */
function initHeroCanvas() {
  const heroCanvas = document.getElementById('heroCanvas');
  if (!heroCanvas) return;
  const hCtx = heroCanvas.getContext('2d');

  // sizing al box hero (non full screen)
  function sizeHero() {
    const r = heroCanvas.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    heroCanvas.width  = Math.floor(r.width  * dpr);
    heroCanvas.height = Math.floor(r.height * dpr);
    heroCanvas.style.width  = r.width + 'px';
    heroCanvas.style.height = r.height + 'px';
    hCtx.setTransform(dpr, 0, 0, dpr, 0, 0); // coord in CSS px
  }
  window.addEventListener('resize', sizeHero, { passive: true });
  sizeHero();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const baseCount = Math.max(18, Math.floor((heroCanvas.clientWidth * heroCanvas.clientHeight) / 45000));
  const HCOUNT = prefersReduced ? Math.floor(baseCount * 0.5) : baseCount;

  const dots = [];
  for (let i = 0; i < HCOUNT; i++) {
    dots.push({
      x: Math.random() * heroCanvas.clientWidth,
      y: Math.random() * heroCanvas.clientHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 2.2 + Math.random() * 1.6
    });
  }

  const mouse = { x: null, y: null, inside: false };
  function getRect(){ return heroCanvas.getBoundingClientRect(); }
  window.addEventListener('mousemove', e => {
    const r = getRect();
    mouse.inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (mouse.inside) {
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }
  }, { passive:true });
  window.addEventListener('mouseleave', () => {
    mouse.inside = false;
    mouse.x = mouse.y = null;
  }, { passive:true });

  const LINK_DIST = 140;
  const ATTRACTION = 0.05; // regola intensità

  function drawHero(){
    const w = heroCanvas.clientWidth, h = heroCanvas.clientHeight;
    hCtx.clearRect(0,0,w,h);

    dots.forEach(p=>{
      // drift
      p.x += p.vx; p.y += p.vy;

      // attrazione dolce se il mouse è nella hero
      if (mouse.inside && mouse.x != null) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 180 && d > 0.001) {
          p.vx += (dx / d) * ATTRACTION;
          p.vy += (dy / d) * ATTRACTION;
        }
      }

      // wrap ai bordi
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      // punto
      hCtx.beginPath();
      hCtx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      hCtx.fillStyle = '#9ee9f0';      // ciano chiaro
      hCtx.globalAlpha = 0.9;
      hCtx.fill();
      hCtx.globalAlpha = 1;
    });

    // linee soft
    for(let i=0;i<dots.length;i++){
      for(let j=i+1;j<dots.length;j++){
        const a=dots[i], b=dots[j];
        const dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
        if (d < LINK_DIST){
          const alpha = 1 - d/LINK_DIST;
          hCtx.strokeStyle = `rgba(0,123,255,${alpha * 0.35})`;
          hCtx.lineWidth = 1;
          hCtx.beginPath();
          hCtx.moveTo(a.x,a.y);
          hCtx.lineTo(b.x,b.y);
          hCtx.stroke();
        }
      }
    }

    requestAnimationFrame(drawHero);
  }

  if (!prefersReduced) requestAnimationFrame(drawHero);
}
