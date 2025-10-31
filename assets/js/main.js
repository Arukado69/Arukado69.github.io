// === Animación suave al entrar en viewport (contenido visible por defecto) ===
document.addEventListener('DOMContentLoaded', () => {
  const reveal = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('animate'); });
    }, { threshold: 0.18 });
    reveal.forEach(s => io.observe(s));
  } else {
    // Fallback: no hace falta, ya es visible por defecto
  }
});

// === Botón “volver arriba” ===
(() => {
  const btn = document.getElementById('btn-top');
  if (!btn) return;
  const TOGGLE_AT = 300;
  const onScroll = () => {
    if (window.scrollY > TOGGLE_AT) btn.classList.add('show');
    else btn.classList.remove('show');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// === Formulario (mailto) ===
(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = (document.getElementById('name').value || '').trim();
    const email = (document.getElementById('email').value || '').trim();
    const msg = (document.getElementById('message').value || '').trim();
    if(!name || !email || !msg){ return; }

    const to = 'omar.dimir69@gmail.com';
    const subject = encodeURIComponent(`Contacto desde el portafolio: ${name}`);
    const body = encodeURIComponent(
      `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${msg}\n\n-- Enviado desde el portafolio`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });
})();

// === Copiar correo al portapapeles ===
(() => {
  const btn = document.getElementById('copy-email');
  if(!btn) return;
  btn.addEventListener('click', async () => {
    try{
      await navigator.clipboard.writeText('omar.dimir69@gmail.com');
      btn.innerHTML = '<i class="bi bi-clipboard-check-fill me-2"></i> ¡Copiado!';
      setTimeout(()=> btn.innerHTML = '<i class="bi bi-clipboard-check me-2"></i> Copiar correo', 1500);
    }catch(_){ /* noop */ }
  });
})();
