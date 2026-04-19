document.addEventListener('DOMContentLoaded', () => {

  /* --- TECH MATH BACKGROUND --- */
  const techBackground = document.querySelector('.cyber-grid');
  initTechMathBackground();

  function initTechMathBackground() {
    if (!techBackground) return;

    const formulas = [
      'E = mc^2',
      'f(x) = ax^2 + bx + c',
      'sin^2(x) + cos^2(x) = 1',
      'lim n->inf (1 + 1/n)^n = e',
      'integral_0^1 x^2 dx = 1/3',
      'P(A|B) = P(B|A)P(A)/P(B)',
      'sum_(k=1)^n k = n(n + 1)/2',
      'A = pi r^2',
      'F = ma',
      'log(ab) = log(a) + log(b)',
      'n! = n * (n - 1)!',
      'x = (-b +- sqrt(b^2 - 4ac)) / 2a',
      'a^2 + b^2 = c^2',
      'd/dx (x^n) = n * x^(n - 1)',
      'integral sin(x) dx = -cos(x) + C',
      'det(A) != 0 => A^-1 exists',
      'sigma = sqrt(variance)',
      'f(g(x)) = (f o g)(x)',
      'curl(F) = nabla x F',
      'div(F) = nabla . F',
      'e^(i*pi) + 1 = 0',
      'P(A union B) = P(A) + P(B) - P(A inter B)',
      "x_(n+1) = x_n - f(x_n)/f'(x_n)",
      'gcd(a,b) * lcm(a,b) = a * b'
    ];
    const symbolPools = {
      algebra: [
        'x_1, x_2, x_3',
        'det(A)',
        'A * B',
        'f o g',
        'rank(A)',
        'n -> inf',
        'a_n = a_1 + (n-1)r',
        'x^2 - 5x + 6 = 0',
        '||v|| = sqrt(v.v)',
        'M[i][j]'
      ],
      physics: [
        'F = m*a',
        'v = d/t',
        'p = m*v',
        'W = F*d',
        'P = W/t',
        'E = h*f',
        'V = I*R',
        'Q = I*t',
        'a = dv/dt',
        'lambda = v/f'
      ],
      statistics: [
        'mu, sigma',
        'P(X = k)',
        'E[X]',
        'Var(X)',
        'z = (x - mu)/sigma',
        'N(mu, sigma^2)',
        'corr(X,Y)',
        'R^2',
        'CI 95%',
        'p < 0.05'
      ]
    };

    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const compact = window.matchMedia('(max-width: 480px)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const formulaFarCount = compact ? 4 : (mobile ? 6 : 8);
    const formulaNearCount = compact ? 5 : (mobile ? 8 : 10);
    const symbolCount = compact ? 10 : (mobile ? 16 : 22);
    const geometryCount = compact ? 4 : (mobile ? 7 : 11);
    const geometryLayer = document.createElement('div');
    geometryLayer.className = 'tech-geometry-layer';
    const cinemaLayer = document.createElement('div');
    cinemaLayer.className = 'cinema-atmo-layer';
    const formulaLayerFar = document.createElement('div');
    formulaLayerFar.className = 'formula-layer formula-layer-far';
    const formulaLayerNear = document.createElement('div');
    formulaLayerNear.className = 'formula-layer formula-layer-near';
    const symbolLayer = document.createElement('div');
    symbolLayer.className = 'symbol-loop-layer';
    const symbolChips = [];
    const symbolThemeNames = Object.keys(symbolPools);

    for (let i = 0; i < geometryCount; i += 1) {
      const shape = document.createElement('span');
      const baseSize = compact ? 90 : (mobile ? 120 : 170);
      shape.className = 'tech-geo-shape';
      shape.style.setProperty('--x', (4 + Math.random() * 92).toFixed(2) + '%');
      shape.style.setProperty('--y', (6 + Math.random() * 88).toFixed(2) + '%');
      shape.style.setProperty('--size', (baseSize + Math.random() * baseSize * 1.45).toFixed(0) + 'px');
      shape.style.setProperty('--rot', (Math.random() * 360).toFixed(1) + 'deg');
      shape.style.setProperty('--geoDur', (16 + Math.random() * 20).toFixed(1) + 's');
      shape.style.setProperty('--delay', (-Math.random() * 22).toFixed(1) + 's');
      shape.style.setProperty('--driftX', ((Math.random() * 36) - 18).toFixed(1) + 'px');
      shape.style.setProperty('--driftY', (12 + Math.random() * 24).toFixed(1) + 'px');

      if (reducedMotion) {
        shape.style.animation = 'none';
        shape.style.opacity = compact ? '0.26' : '0.34';
      }

      geometryLayer.appendChild(shape);
    }

    for (let i = 0; i < formulaFarCount; i += 1) {
      const chip = document.createElement('span');
      chip.className = 'formula-chip';
      chip.textContent = formulas[Math.floor(Math.random() * formulas.length)];
      chip.style.setProperty('--x', (2 + Math.random() * 96).toFixed(2) + '%');
      chip.style.setProperty('--y', (6 + Math.random() * 90).toFixed(2) + '%');
      chip.style.setProperty('--dur', (20 + Math.random() * 18).toFixed(1) + 's');
      chip.style.setProperty('--delay', (-Math.random() * 24).toFixed(1) + 's');
      chip.style.setProperty('--drift', ((Math.random() * 20) - 10).toFixed(1) + 'px');
      chip.style.setProperty('--scale', (0.78 + Math.random() * 0.3).toFixed(2));
      const farMinOpacity = 0.1 + Math.random() * 0.08;
      chip.style.setProperty('--opacity-min', farMinOpacity.toFixed(2));
      chip.style.setProperty('--opacity-max', (farMinOpacity + 0.08 + Math.random() * 0.04).toFixed(2));

      if (reducedMotion) {
        chip.style.animation = 'none';
        chip.style.opacity = '0.12';
      }

      formulaLayerFar.appendChild(chip);
    }

    for (let i = 0; i < formulaNearCount; i += 1) {
      const chip = document.createElement('span');
      chip.className = 'formula-chip';
      chip.textContent = formulas[Math.floor(Math.random() * formulas.length)];
      chip.style.setProperty('--x', (2 + Math.random() * 96).toFixed(2) + '%');
      chip.style.setProperty('--y', (6 + Math.random() * 90).toFixed(2) + '%');
      chip.style.setProperty('--dur', (12 + Math.random() * 14).toFixed(1) + 's');
      chip.style.setProperty('--delay', (-Math.random() * 24).toFixed(1) + 's');
      chip.style.setProperty('--drift', ((Math.random() * 34) - 17).toFixed(1) + 'px');
      chip.style.setProperty('--scale', (0.96 + Math.random() * 0.52).toFixed(2));
      const nearMinOpacity = 0.15 + Math.random() * 0.08;
      chip.style.setProperty('--opacity-min', nearMinOpacity.toFixed(2));
      chip.style.setProperty('--opacity-max', (nearMinOpacity + 0.12 + Math.random() * 0.06).toFixed(2));

      if (reducedMotion) {
        chip.style.animation = 'none';
        chip.style.opacity = compact ? '0.16' : '0.2';
      }

      formulaLayerNear.appendChild(chip);
    }

    for (let i = 0; i < symbolCount; i += 1) {
      const themeName = symbolThemeNames[i % symbolThemeNames.length];
      const symbolSet = symbolPools[themeName];
      const chip = document.createElement('span');
      chip.className = 'symbol-chip';
      chip.textContent = symbolSet[Math.floor(Math.random() * symbolSet.length)];
      chip.style.setProperty('--x', (3 + Math.random() * 94).toFixed(2) + '%');
      chip.style.setProperty('--y', (5 + Math.random() * 90).toFixed(2) + '%');
      chip.style.setProperty('--s-dur', (16 + Math.random() * 18).toFixed(1) + 's');
      chip.style.setProperty('--s-delay', (-Math.random() * 20).toFixed(1) + 's');
      chip.style.setProperty('--sx', (6 + Math.random() * 14).toFixed(1) + 'px');
      chip.style.setProperty('--scale', (0.82 + Math.random() * 0.46).toFixed(2));
      chip.style.setProperty('--s-opacity', (0.16 + Math.random() * 0.28).toFixed(2));

      if (reducedMotion) {
        chip.style.animation = 'none';
        chip.style.opacity = compact ? '0.16' : '0.22';
      }

      symbolChips.push(chip);
      symbolLayer.appendChild(chip);
    }

    const networkCanvas = initTechNetworkCanvas({
      container: techBackground,
      compact,
      mobile,
      reducedMotion
    });

    techBackground.appendChild(geometryLayer);
    techBackground.appendChild(cinemaLayer);
    if (networkCanvas) techBackground.appendChild(networkCanvas);
    techBackground.appendChild(formulaLayerFar);
    techBackground.appendChild(symbolLayer);
    techBackground.appendChild(formulaLayerNear);

    if (!reducedMotion) {
      startSymbolThemeLoop(symbolChips, symbolPools, symbolThemeNames);
    }

    if (!reducedMotion && !mobile) {
      const parallaxLayers = [
        { element: geometryLayer, strength: 24 },
        { element: cinemaLayer, strength: 6 },
        { element: formulaLayerFar, strength: 10 },
        { element: symbolLayer, strength: 14 },
        { element: formulaLayerNear, strength: 20 }
      ];
      if (networkCanvas) parallaxLayers.push({ element: networkCanvas, strength: 8 });
      initTechParallax(parallaxLayers);
    }
  }

  function startSymbolThemeLoop(symbolChips, symbolPools, symbolThemeNames) {
    if (!symbolChips.length) return;

    let themeOffset = 0;
    window.setInterval(() => {
      themeOffset = (themeOffset + 1) % symbolThemeNames.length;
      symbolChips.forEach((chip, index) => {
        const themeName = symbolThemeNames[(themeOffset + index) % symbolThemeNames.length];
        const pool = symbolPools[themeName];
        chip.textContent = pool[Math.floor(Math.random() * pool.length)];
      });
    }, 7000);
  }

  function initTechNetworkCanvas(config) {
    const { container, compact, mobile, reducedMotion } = config;
    const canvas = document.createElement('canvas');
    canvas.className = 'tech-network-canvas';
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointCount = compact ? 18 : (mobile ? 28 : 44);
    const linkDistance = compact ? 90 : (mobile ? 120 : 150);
    const cursorRadius = compact ? 120 : 170;
    const points = [];
    const cursor = { x: 0, y: 0, active: false };
    let width = 1;
    let height = 1;
    let dotColor = 'rgba(214,0,24,0.68)';
    let lineColor = 'rgba(214,0,24,0.3)';

    function readThemeColors() {
      const styles = getComputedStyle(document.documentElement);
      dotColor = styles.getPropertyValue('--tech-network-dot').trim() || dotColor;
      lineColor = styles.getPropertyValue('--tech-network-line').trim() || lineColor;
    }

    function seedPoints() {
      points.length = 0;
      for (let i = 0; i < pointCount; i += 1) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.44,
          vy: (Math.random() - 0.5) * 0.44,
          r: 1 + Math.random() * 1.3
        });
      }
    }

    function resizeCanvas() {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!points.length) seedPoints();
    }

    function updatePoints() {
      for (const point of points) {
        if (cursor.active) {
          const dx = cursor.x - point.x;
          const dy = cursor.y - point.y;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance < cursorRadius) {
            const pull = (1 - (distance / cursorRadius)) * 0.06;
            point.vx += (dx / distance) * pull;
            point.vy += (dy / distance) * pull;
          }
        }

        point.vx += (Math.random() - 0.5) * 0.004;
        point.vy += (Math.random() - 0.5) * 0.004;
        point.vx *= 0.994;
        point.vy *= 0.994;

        const speed = Math.hypot(point.vx, point.vy);
        if (speed > 0.8) {
          point.vx = (point.vx / speed) * 0.8;
          point.vy = (point.vy / speed) * 0.8;
        }

        point.x += point.vx;
        point.y += point.vy;

        if (point.x <= 0 || point.x >= width) point.vx *= -1;
        if (point.y <= 0 || point.y >= height) point.vy *= -1;
        point.x = Math.max(0, Math.min(width, point.x));
        point.y = Math.max(0, Math.min(height, point.y));
      }
    }

    function drawLinks() {
      ctx.strokeStyle = lineColor;
      for (let i = 0; i < points.length; i += 1) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j += 1) {
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);
          if (distance > linkDistance) continue;

          let alpha = (1 - (distance / linkDistance)) * 0.6;
          if (cursor.active) {
            const midX = (a.x + b.x) * 0.5;
            const midY = (a.y + b.y) * 0.5;
            const cursorDistance = Math.hypot(cursor.x - midX, cursor.y - midY);
            if (cursorDistance < cursorRadius) {
              alpha += (1 - (cursorDistance / cursorRadius)) * 0.4;
            }
          }

          ctx.globalAlpha = Math.min(alpha, 0.9);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    function drawPoints() {
      ctx.fillStyle = dotColor;
      for (const point of points) {
        let alpha = 0.46;
        if (cursor.active) {
          const cursorDistance = Math.hypot(cursor.x - point.x, cursor.y - point.y);
          if (cursorDistance < cursorRadius) {
            alpha += (1 - (cursorDistance / cursorRadius)) * 0.44;
          }
        }
        ctx.globalAlpha = Math.min(alpha, 0.96);
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function renderFrame() {
      ctx.clearRect(0, 0, width, height);
      updatePoints();
      drawLinks();
      drawPoints();
      if (!reducedMotion) window.requestAnimationFrame(renderFrame);
    }

    readThemeColors();
    resizeCanvas();

    if (!reducedMotion) {
      window.addEventListener('pointermove', (event) => {
        cursor.x = event.clientX;
        cursor.y = event.clientY;
        cursor.active = true;
      }, { passive: true });
      window.addEventListener('blur', () => {
        cursor.active = false;
      });
      window.addEventListener('pointerleave', () => {
        cursor.active = false;
      });
      window.addEventListener('resize', resizeCanvas);
      const themeObserver = new MutationObserver(() => {
        readThemeColors();
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
      renderFrame();
    } else {
      drawLinks();
      drawPoints();
    }

    return canvas;
  }

  function initTechParallax(layers) {
    if (!layers.length) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('pointermove', (event) => {
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      targetX = ((event.clientX / vw) - 0.5) * 2;
      targetY = ((event.clientY / vh) - 0.5) * 2;
    }, { passive: true });

    const resetParallax = () => {
      targetX = 0;
      targetY = 0;
    };
    window.addEventListener('pointerleave', resetParallax);
    window.addEventListener('blur', resetParallax);

    const animateParallax = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      for (const layer of layers) {
        const x = (currentX * layer.strength).toFixed(2);
        const y = (currentY * layer.strength).toFixed(2);
        layer.element.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
      }

      window.requestAnimationFrame(animateParallax);
    };

    animateParallax();
  }

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

  /* --- MOBILE NAV --- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('siteNav');
  const isEnglish = (document.documentElement.lang || '').toLowerCase().startsWith('en');
  const menuOpenLabel = isEnglish ? 'Close menu' : 'Fechar menu';
  const menuClosedLabel = isEnglish ? 'Open menu' : 'Abrir menu';

  function closeNavMenu() {
    if (!navToggle || !navMenu) return;
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', menuClosedLabel);
  }

  if (navToggle && navMenu) {
    navToggle.setAttribute('aria-label', menuClosedLabel);
    navToggle.addEventListener('click', () => {
      const willOpen = !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', willOpen);
      navToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', willOpen ? menuOpenLabel : menuClosedLabel);
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => closeNavMenu());
    });

    document.addEventListener('click', (event) => {
      if (!navMenu.classList.contains('open')) return;
      if (navMenu.contains(event.target) || navToggle.contains(event.target)) return;
      closeNavMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeNavMenu();
    });
  }

  /* --- LIGHTBOX --- */
  const overlay   = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lb-img');
  const lbClose   = document.getElementById('lb-close');
  const lbPrev    = document.getElementById('lb-prev');
  const lbNext    = document.getElementById('lb-next');
  const lbCaption = document.getElementById('lb-caption');

  const galleryItems = [...document.querySelectorAll('.gallery-item, [data-lightbox-item]')];
  let currentIndex = 0;

  function getItemImageData(item) {
    const img = item.querySelector('img');
    const src = item.dataset.lightboxSrc || img?.src || '';
    const alt = item.dataset.lightboxAlt || img?.alt || 'Imagem ampliada';
    return { src, alt };
  }

  function openLightbox(index) {
    if (!overlay || !galleryItems.length || !galleryItems[index]) return;
    currentIndex = index;
    const data = getItemImageData(galleryItems[index]);
    lbImg.src = data.src;
    lbImg.alt = data.alt;
    lbCaption.textContent = (index + 1) + ' / ' + galleryItems.length;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden','false');
    lbClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!overlay) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    galleryItems[currentIndex]?.focus();
  }

  function showNext() {
    if (!galleryItems.length) return;
    openLightbox((currentIndex + 1) % galleryItems.length);
  }
  function showPrev() {
    if (!galleryItems.length) return;
    openLightbox((currentIndex - 1 + galleryItems.length) % galleryItems.length);
  }

  galleryItems.forEach((item, i) => {
    const data = getItemImageData(item);
    item.setAttribute('tabindex','0');
    item.setAttribute('role','button');
    item.setAttribute('aria-label', 'Ver imagem ampliada: ' + data.alt);
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
