// === Revelar secciones al hacer scroll ===
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); } });
  }, {threshold: 0.2});
  sections.forEach(s=>io.observe(s));
});

// === Retícula + “pisadas” en hexágonos (versión estable) ===
(() => {
  // contenedor fijo donde se dibujan los hexágonos
  let layer = document.getElementById('hex-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'hex-layer';
    document.body.appendChild(layer);
  }
  Object.assign(layer.style, {
    position: 'fixed',
    inset: '0',
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 3
  });

  const reticle = document.querySelector('.reticle');
  const ring = document.querySelector('.reticle-ring');

  let pos = {x: innerWidth/2, y: innerHeight/2};
  let target = {x: pos.x, y: pos.y};
  let lastPulse = {x: pos.x, y: pos.y};

  const DIST_THRESHOLD = 90;   // distancia mínima entre clusters
  const HEX_SIZE = 14;         // tamaño base del hexágono
  const MAX_HEX = 60;          // límite de hexágonos activos

  // movimiento suavizado del cursor
  function animate(){
    pos.x += (target.x - pos.x) * 0.18;
    pos.y += (target.y - pos.y) * 0.18;
    reticle.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('pointermove', (e)=>{
    target.x = e.clientX;
    target.y = e.clientY;

    const dx = target.x - lastPulse.x;
    const dy = target.y - lastPulse.y;
    const dist = Math.hypot(dx, dy);

    if (dist > DIST_THRESHOLD) {
      hexBurst(target.x, target.y, HEX_SIZE);
      lastPulse.x = target.x;
      lastPulse.y = target.y;
      flashRing();
    }
  });

  function flashRing(){
    ring.style.boxShadow = '0 0 12px rgba(36,200,255,.85)';
    setTimeout(()=> ring.style.boxShadow = '0 0 8px rgba(36,200,255,.35)', 120);
  }

  // crea un grupo de hexágonos (centro + 6 vecinos)
  function hexBurst(x, y, a){
    const h = Math.sqrt(3) * a;
    const offsets = [
      {dx:  0,      dy:  0},
      {dx:  1.5*a,  dy:  0},
      {dx: -1.5*a,  dy:  0},
      {dx:  0.75*a, dy:  0.5*h},
      {dx:  0.75*a, dy: -0.5*h},
      {dx: -0.75*a, dy:  0.5*h},
      {dx: -0.75*a, dy: -0.5*h},
    ];
    offsets.forEach((o,i)=> setTimeout(()=> makeHex(x+o.dx, y+o.dy, a), i*25));
  }

  function makeHex(x, y, a){
    const el = document.createElement('div');
    el.className = 'hex-pulse';
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    el.style.width  = (a*2) + 'px';
    el.style.height = (a*1.78) + 'px';

    // limitar cantidad máxima
    if (layer.children.length > MAX_HEX) layer.removeChild(layer.firstChild);

    layer.appendChild(el);
    el.addEventListener('animationend', ()=> el.remove());
    setTimeout(()=> el.remove(), 1000);
  }

  window.addEventListener('blur',  ()=> reticle.style.opacity = 0);
  window.addEventListener('focus', ()=> reticle.style.opacity = 1);
})();

// === efecto “ALERT” cosmético ===
document.querySelectorAll('[data-alert]').forEach(card=>{
  card.addEventListener('mouseenter', ()=> card.classList.add('detected'));
  card.addEventListener('mouseleave', ()=> card.classList.remove('detected'));
});
