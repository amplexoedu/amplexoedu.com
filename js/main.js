document.addEventListener('DOMContentLoaded', () => {

  /* --- THEME (dark default) --- */
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');

  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);
  applyThemeIcons(saved);

  themeBtn?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    applyThemeIcons(next);
  });

  function applyThemeIcons(t) {
    if (t === 'dark') { sunIcon.style.display='block'; moonIcon.style.display='none'; }
    else              { sunIcon.style.display='none';  moonIcon.style.display='block'; }
  }

  /* --- CUSTOM CURSOR --- */
  const cursor = document.getElementById('cursor');
  let mx=0, my=0, cx=0, cy=0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  // Smooth lag effect
  (function loop() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a,button,.feature-card,.gallery-item,.video-wrap,.info-block,.ctrl-btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('big'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
  });

  /* --- SCROLL REVEAL --- */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => ro.observe(el));

  /* --- STAGGER CARDS --- */
  document.querySelectorAll('.cards-grid .feature-card').forEach((c,i) => {
    c.style.transitionDelay = (i * 80) + 'ms';
  });

  /* --- STAT NUMBER COUNT-UP --- */
  const stats = document.querySelectorAll('.stat-num[data-target]');
  const so = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = prefix + current.toLocaleString('pt-BR') + suffix;
        if (current >= target) clearInterval(timer);
      }, 25);
      so.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach(s => so.observe(s));

});
