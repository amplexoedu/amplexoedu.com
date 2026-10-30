/* Amplexo Educação — Matrículas e rematrículas 2027
   1) Menu do celular   2) Sombra do cabeçalho   3) Link da seção atual   4) Revelação suave ao rolar
   O botão do WhatsApp fica no cabeçalho fixo (em vez de flutuante) para não cobrir conteúdos nem controles.
   A página funciona sem este script: tudo continua visível e os links do WhatsApp são links comuns. */
(function () {
  'use strict';

  var html = document.documentElement;
  var header = document.querySelector('[data-header]');
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');
  var celular = window.matchMedia('(max-width: 960px)');
  var cada = function (seletor, fn) { Array.prototype.forEach.call(document.querySelectorAll(seletor), fn); };

  /* 1) Menu do celular */
  function abrirMenu(abrir) {
    toggle.setAttribute('aria-expanded', String(abrir));
    menu.classList.toggle('is-open', abrir);
    toggle.querySelector('.menu-toggle-label').textContent = abrir ? 'Fechar' : 'Menu';
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      abrirMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a') && celular.matches) abrirMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) { abrirMenu(false); toggle.focus(); }
    });
    celular.addEventListener('change', function () { abrirMenu(false); });
  }

  /* 2) Sombra do cabeçalho depois do topo */
  function aoRolar() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  aoRolar();
  window.addEventListener('scroll', aoRolar, { passive: true });

  if (!('IntersectionObserver' in window)) return;

  /* 3) Link da seção atual no menu */
  var links = {};
  cada('.main-nav a[href^="#"]', function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var secaoAtual = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      Object.keys(links).forEach(function (id) { links[id].classList.toggle('is-active', id === entrada.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(links).forEach(function (id) {
    var secao = document.getElementById(id);
    if (secao) secaoAtual.observe(secao);
  });

  /* 4) Revelação suave ao rolar (o CSS ignora isto quando a pessoa prefere menos movimento) */
  var revelar = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('is-visible');
      revelar.unobserve(entrada.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  cada('[data-reveal]', function (el) { revelar.observe(el); });
  html.classList.add('reveal-on');
})();
