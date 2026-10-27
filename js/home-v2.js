/* Amplexo Educação — Página inicial (v2) */
(() => {
  'use strict';
  window.__amplexoReady = true;

  const doc = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const stackQuery = matchMedia('(min-width: 900px) and (min-height: 720px)');
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  /* Faixas e paredes infinitas: duplica o conteúdo para o loop não ter emenda */
  document.querySelectorAll('[data-loop]').forEach(track => {
    [...track.children].forEach(node => {
      const clone = node.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  });

  /* Ano do rodapé */
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* Texto do propósito: cada palavra "acende" conforme a rolagem */
  const wordsEl = document.querySelector('[data-words]');
  const words = [];
  if (wordsEl && !reduce) {
    const split = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const span = document.createElement('span');
            span.className = 'w';
            span.textContent = part;
            words.push(span);
            frag.appendChild(span);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          split(child);
        }
      });
    };
    split(wordsEl);
  }
  let litWords = -1;

  /* Elementos que reagem à rolagem */
  const nav = document.querySelector('[data-nav]');
  const progress = document.querySelector('[data-progress]');
  const embrace = document.querySelector('[data-embrace]');
  const cards = [...document.querySelectorAll('[data-card]')];
  let lastY = scrollY;
  let menuOpen = false;
  let ticking = false;

  function update() {
    ticking = false;
    const y = scrollY;
    const vh = innerHeight;

    // Navegação: fundo ao rolar, esconde ao descer, volta ao subir
    nav.classList.toggle('is-scrolled', y > 24);
    if (!menuOpen) {
      if (y > lastY + 6 && y > 500) { nav.classList.add('is-hidden'); lastY = y; }
      else if (y < lastY - 6 || y <= 500) { nav.classList.remove('is-hidden'); lastY = y; }
    }

    // Barra de progresso
    const max = doc.scrollHeight - vh;
    progress.style.transform = `scaleX(${max > 0 ? clamp(y / max) : 0})`;

    // Palavras do propósito
    if (words.length) {
      const r = wordsEl.getBoundingClientRect();
      if (r.top < vh * 1.2 && r.bottom > -vh * .2) {
        const p = clamp((vh * .82 - r.top) / (r.height + vh * .4));
        const n = Math.round(p * words.length);
        if (n !== litWords) {
          words.forEach((w, i) => w.classList.toggle('on', i < n));
          litWords = n;
        }
      }
    }

    // Foto que se expande ("Abrace e seja abraçado")
    if (embrace && !reduce) {
      const r = embrace.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        const p = clamp(-r.top / (r.height - vh));
        const e = easeOut(clamp(p / .6));
        const narrow = innerWidth < 700;
        const s = embrace.style;
        s.setProperty('--iy', `${(1 - e) * (narrow ? 22 : 16)}%`);
        s.setProperty('--ix', `${(1 - e) * (narrow ? 8 : 24)}%`);
        s.setProperty('--r', `${(1 - e) * 40}px`);
        s.setProperty('--s', (1.22 - e * .22).toFixed(4));
        s.setProperty('--t', clamp((p - .38) / .32).toFixed(4));
      }
    }

    // Cartões empilhados: o de baixo encolhe quando o próximo o cobre
    if (cards.length && !reduce && stackQuery.matches) {
      for (let i = 0; i < cards.length - 1; i++) {
        const top = cards[i].getBoundingClientRect().top;
        const h = cards[i].offsetHeight;
        const nextTop = cards[i + 1].getBoundingClientRect().top;
        cards[i].style.setProperty('--cover', clamp((top + h - nextTop) / h).toFixed(3));
      }
    }
  }

  const requestUpdate = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };
  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', requestUpdate);
  stackQuery.addEventListener?.('change', () => {
    if (!stackQuery.matches) cards.forEach(c => c.style.removeProperty('--cover'));
    requestUpdate();
  });
  update();

  /* Revelar ao entrar na tela */
  const revealer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
  document.querySelectorAll('[data-reveal]').forEach(el => revealer.observe(el));

  /* Contadores: +500, +3.000 */
  const fmt = new Intl.NumberFormat(doc.lang || 'pt-BR');
  const counters = document.querySelectorAll('[data-count]');
  if (!reduce) {
    const countUp = el => {
      const target = Number(el.dataset.count);
      const prefix = el.dataset.prefix || '';
      const duration = 2000;
      let start;
      const step = now => {
        start ??= now;
        const k = clamp((now - start) / duration);
        const value = k === 1 ? target : Math.round(target * (1 - Math.pow(2, -10 * k)));
        el.textContent = prefix + fmt.format(value);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const counterIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        counterIO.unobserve(entry.target);
      });
    }, { threshold: .6 });
    counters.forEach(el => {
      el.textContent = (el.dataset.prefix || '') + '0';
      counterIO.observe(el);
    });
  }

  /* Efeitos que seguem o mouse (só em computador) */
  if (finePointer && !reduce) {
    const hero = document.querySelector('[data-hero]');
    const wall = document.querySelector('[data-wall]');
    hero?.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      hero.style.setProperty('--mx', `${x * 100}%`);
      hero.style.setProperty('--my', `${y * 100}%`);
      wall?.style.setProperty('--tx', `${(x - .5) * -36}px`);
      wall?.style.setProperty('--ty', `${(y - .5) * -28}px`);
    });

    document.querySelectorAll('[data-spot]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--x', `${e.clientX - r.left}px`);
        el.style.setProperty('--y', `${e.clientY - r.top}px`);
      });
    });

    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * .22}px, ${dy * .32}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    const tiltArea = document.querySelector('[data-tilt-area]');
    const trophy = document.querySelector('[data-tilt]');
    if (tiltArea && trophy) {
      tiltArea.addEventListener('pointermove', e => {
        const r = tiltArea.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        trophy.style.setProperty('--ry', `${x * 22}deg`);
        trophy.style.setProperty('--rx', `${y * -16}deg`);
        trophy.style.setProperty('--gx', `${x * 120}%`);
      });
      tiltArea.addEventListener('pointerleave', () => {
        ['--ry', '--rx', '--gx'].forEach(p => trophy.style.removeProperty(p));
      });
    }
  }

  /* Menu no celular */
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.getElementById('menu');
  const setMenu = open => {
    menuOpen = open;
    doc.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('span').textContent = open ? (toggle.dataset.close || 'Fechar') : (toggle.dataset.open || 'Menu');
    if (open) {
      nav.classList.remove('is-hidden');
      menu.querySelector('a')?.focus({ preventScroll: true });
    }
  };
  toggle?.addEventListener('click', () => setMenu(!menuOpen));
  menu?.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) { setMenu(false); toggle.focus(); }
  });
})();
