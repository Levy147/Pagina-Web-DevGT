/* ---- Animated blob background ---- */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  const blobs = [
    { x: .2, y: .2, r: 350, color: '#366FE0', speed: .00012 },
    { x: .8, y: .3, r: 300, color: '#8C65E0', speed: .00009 },
    { x: .5, y: .8, r: 280, color: '#67DCE0', speed: .00015 },
    { x: .1, y: .7, r: 200, color: '#6567E0', speed: .0001 },
  ];
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function drawBlob(b, t) {
    const x = (b.x + Math.sin(t * b.speed * 1000 + b.r) * .12) * W;
    const y = (b.y + Math.cos(t * b.speed * 900 + b.r) * .1) * H;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, b.r);
    grad.addColorStop(0, b.color + '22');
    grad.addColorStop(1, b.color + '00');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, b.r, 0, Math.PI * 2);
    ctx.fill();
  }
  function animate(t) {
    ctx.clearRect(0, 0, W, H);
    blobs.forEach(b => drawBlob(b, t));
    requestAnimationFrame(animate);
  }
  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(animate);

  /* ---- Mouse glow on hero ---- */
  const heroGlow = document.getElementById('heroGlow');
  if (heroGlow) {
    const glowBall = heroGlow.querySelector('.glow-ball');
    document.getElementById('inicio').addEventListener('mousemove', e => {
      const rect = heroGlow.parentElement.getBoundingClientRect();
      glowBall.style.left = (e.clientX - rect.left) + 'px';
      glowBall.style.top = (e.clientY - rect.top) + 'px';
    });
  }

  /* ---- Scroll reveal (per-section stagger) ---- */
  const sectionContainers = document.querySelectorAll('section, footer');
  sectionContainers.forEach(section => {
    const items = section.querySelectorAll('.reveal');
    if (items.length === 0) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          items.forEach((el, i) => {
            el.style.transitionDelay = (i * .08) + 's';
            el.classList.add('visible');
          });
          observer.unobserve(section);
        }
      });
    }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
    observer.observe(section);
  });

  /* ---- Counter animation for stats ---- */
  function animateCounter(el, target) {
    let current = 0;
    const step = Math.max(1, target / 50);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 16);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const num = entry.target;
        const target = parseInt(num.dataset.count);
        if (!isNaN(target)) animateCounter(num, target);
        statsObserver.unobserve(num);
      }
    });
  }, { threshold: .5 });

  document.querySelectorAll('.stat-num').forEach(el => statsObserver.observe(el));

  /* ---- Hamburger ---- */
  const ham = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  ham.addEventListener('click', () => links.classList.toggle('mobile-open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('mobile-open')));

  /* ---- Modals ---- */
  function openModal(id) {
    document.getElementById('modal-' + id).classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    document.getElementById('modal-' + id).classList.remove('open');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) {
        m.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => {
        m.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });

  /* ---- Form → WhatsApp ---- */
  function sendToWhatsApp() {
    const name    = document.getElementById('f-name').value.trim();
    const email   = document.getElementById('f-email').value.trim();
    const phone   = document.getElementById('f-phone').value.trim();
    const service = document.getElementById('f-service').value;
    const msg     = document.getElementById('f-msg').value.trim();
    if (!name || !email || !msg) {
      alert('Por favor completa los campos obligatorios (nombre, correo y mensaje).');
      return;
    }
    const text = `Hola, soy ${name}!%0A%0A` +
      `Correo: ${email}%0A` +
      (phone ? `Teléfono: ${phone}%0A` : '') +
      (service ? `Servicio: ${service}%0A` : '') +
      `%0AMensaje:%0A${encodeURIComponent(msg)}`;
    window.open(`https://api.whatsapp.com/send/?phone=50234274158&text=${text}&type=phone_number&app_absent=0`, '_blank');
  }
