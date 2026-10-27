/* Amplexo Educação — script comum a todas as páginas.
   Carregado no <head> (sem defer) para escolher o idioma antes de a página aparecer.
   1) Idioma: na primeira visita usa o idioma do navegador; depois, a escolha feita no seletor.
   2) Vídeos do YouTube: só carregam quando a pessoa clica (nenhum dado vai ao Google antes disso). */
(function () {
  'use strict';

  var CHAVE = 'amplexo-idioma';
  var IDIOMAS = ['pt', 'en', 'es'];
  var html = document.documentElement;
  var atual = (html.getAttribute('lang') || 'pt').slice(0, 2).toLowerCase();

  function ler(armazenamento, chave) {
    try { return window[armazenamento].getItem(chave); } catch (e) { return null; }
  }
  function gravar(armazenamento, chave, valor) {
    try { window[armazenamento].setItem(chave, valor); } catch (e) { /* modo privado: segue sem lembrar */ }
  }

  function idiomaDoNavegador() {
    var lista = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < lista.length; i++) {
      var codigo = String(lista[i]).slice(0, 2).toLowerCase();
      if (IDIOMAS.indexOf(codigo) !== -1) return codigo;
    }
    return 'en'; // outros idiomas: inglês é o mais provável de ser entendido
  }

  // Robôs de busca e geradores de prévia não são redirecionados: cada versão precisa ser indexada.
  var robo = /bot|crawl|spider|slurp|lighthouse|headless|preview|facebookexternalhit|embedly|whatsapp|telegram/i.test(navigator.userAgent);
  var escolhido = ler('localStorage', CHAVE);
  var desejado = IDIOMAS.indexOf(escolhido) !== -1 ? escolhido : idiomaDoNavegador();

  if (!robo && desejado !== atual) {
    var alternativa = document.querySelector('link[rel="alternate"][hreflang^="' + desejado + '"]');
    if (alternativa) {
      // Os links hreflang apontam para amplexoedu.com; usa só o caminho para funcionar também no site de teste.
      var destino = new URL(alternativa.getAttribute('href'), location.href).pathname;
      // Proteção contra vai e volta: não devolve para a página de onde acabou de redirecionar.
      var ultimo = null;
      try { ultimo = JSON.parse(ler('sessionStorage', 'amplexo-redirecionado')); } catch (e) { /* ignora */ }
      var volta = ultimo && Date.now() - ultimo.t < 5000 && ultimo.para === location.pathname && ultimo.de === destino;
      if (destino !== location.pathname && !volta) {
        gravar('sessionStorage', 'amplexo-redirecionado', JSON.stringify({ de: location.pathname, para: destino, t: Date.now() }));
        location.replace(destino + location.search + location.hash);
        return;
      }
    }
  }

  function aoClicar(evento) {
    var alvo = evento.target;
    if (!alvo || !alvo.closest) return;

    // Seletor de idioma: lembra a escolha (vale também para abrir em nova aba)
    var link = alvo.closest('[data-idioma]');
    if (link) gravar('localStorage', CHAVE, link.getAttribute('data-idioma'));

    // Vídeo: troca a capa pelo player do YouTube, em modo de privacidade aprimorada
    var capa = alvo.closest('[data-youtube]');
    if (capa && evento.type === 'click') {
      var player = document.createElement('iframe');
      player.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(capa.getAttribute('data-youtube')) + '?autoplay=1&rel=0';
      player.title = capa.getAttribute('data-titulo') || 'YouTube';
      player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      player.allowFullscreen = true;
      player.referrerPolicy = 'strict-origin-when-cross-origin';
      player.className = 'yt-player';
      capa.replaceWith(player);
      player.focus();
    }
  }
  document.addEventListener('click', aoClicar);
  document.addEventListener('auxclick', aoClicar);
})();
