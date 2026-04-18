document.addEventListener('DOMContentLoaded', () => {

  /* --- THEME --- */
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

  /* --- LIGHTBOX --- */
  const overlay   = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lb-img');
  const lbClose   = document.getElementById('lb-close');
  const lbPrev    = document.getElementById('lb-prev');
  const lbNext    = document.getElementById('lb-next');
  const lbCaption = document.getElementById('lb-caption');

  const galleryItems = [...document.querySelectorAll('.gallery-item')];
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const img = galleryItems[index].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = (index + 1) + ' / ' + galleryItems.length;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden','false');
    lbClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    galleryItems[currentIndex].focus();
  }

  function showNext() { openLightbox((currentIndex + 1) % galleryItems.length); }
  function showPrev() { openLightbox((currentIndex - 1 + galleryItems.length) % galleryItems.length); }

  galleryItems.forEach((item, i) => {
    item.setAttribute('tabindex','0');
    item.setAttribute('role','button');
    item.setAttribute('aria-label', 'Ver imagem ampliada: ' + (item.querySelector('img')?.alt || ''));
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); } });
  });

  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click', showPrev);
  lbNext?.addEventListener('click', showNext);

  overlay?.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!overlay?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft')  showPrev();
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

  /* --- STAT COUNT-UP --- */
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
  document.querySelectorAll('.stat-num[data-target]').forEach(s => so.observe(s));

});
