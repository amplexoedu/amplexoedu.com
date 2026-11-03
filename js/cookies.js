/* Amplexo Educação — aviso de cookies e Pixel da Meta (Facebook e Instagram).
   1) Aviso: na primeira visita pergunta se a pessoa aceita os cookies de publicidade da Meta.
      "Aceitar" e "Recusar" têm o mesmo destaque. A resposta fica guardada por 12 meses e pode ser
      mudada a qualquer momento pelo botão do item 12 da Política de Privacidade ([data-cookies-preferencias]).
   2) Pixel: só carrega depois do "Aceitar", só no site oficial (amplexoedu.com) e nunca com o sinal
      Global Privacy Control do navegador ligado. No site de teste o aviso aparece, mas o Pixel não.
   3) WhatsApp: cada clique num link wa.me é registrado no Pixel como "Contact" (contato).
   Sem JavaScript, nada disso roda: não aparece aviso e nenhum dado vai para a Meta. */
(function () {
  'use strict';

  var PIXEL = '1873573433803022';
  var CHAVE = 'amplexo-cookies';
  var VALIDADE = 365 * 24 * 60 * 60 * 1000; // depois de 12 meses, pergunta de novo
  var OFICIAL = location.hostname === 'amplexoedu.com';
  var GPC = navigator.globalPrivacyControl === true;

  var TEXTOS = {
    pt: {
      rotulo: 'Aviso de cookies', titulo: 'Ajude o Amplexo a chegar a mais famílias', tituloPreferencias: 'Suas preferências de cookies',
      texto: 'Com a sua permissão, usamos cookies da Meta (Facebook e Instagram) para medir nossos anúncios e mostrá-los a quem já visitou o site. Nada é ativado sem o seu “Aceitar”, e você pode mudar de ideia quando quiser.',
      saiba: 'Saiba mais', politica: '/privacidade/#cookies', recusar: 'Recusar', aceitar: 'Aceitar',
      aceito: 'Sua escolha atual: cookies aceitos.', recusado: 'Sua escolha atual: cookies recusados.',
      gpc: 'Seu navegador envia o sinal Global Privacy Control, por isso o Pixel da Meta fica desligado.'
    },
    en: {
      rotulo: 'Cookie notice', titulo: 'Help Amplexo reach more families', tituloPreferencias: 'Your cookie preferences',
      texto: 'With your permission, we use Meta (Facebook and Instagram) cookies to measure our ads and show them to people who have visited the site. Nothing is turned on without your “Accept”, and you can change your mind at any time.',
      saiba: 'Learn more', politica: '/en/privacy/#cookies', recusar: 'Decline', aceitar: 'Accept',
      aceito: 'Your current choice: cookies accepted.', recusado: 'Your current choice: cookies declined.',
      gpc: 'Your browser sends the Global Privacy Control signal, so the Meta Pixel stays off.'
    },
    es: {
      rotulo: 'Aviso de cookies', titulo: 'Ayuda a Amplexo a llegar a más familias', tituloPreferencias: 'Tus preferencias de cookies',
      texto: 'Con tu permiso, usamos cookies de Meta (Facebook e Instagram) para medir nuestros anuncios y mostrarlos a quienes ya visitaron el sitio. Nada se activa sin tu “Aceptar”, y puedes cambiar de idea cuando quieras.',
      saiba: 'Más información', politica: '/es/privacidad/#cookies', recusar: 'Rechazar', aceitar: 'Aceptar',
      aceito: 'Tu elección actual: cookies aceptadas.', recusado: 'Tu elección actual: cookies rechazadas.',
      gpc: 'Tu navegador envía la señal Global Privacy Control, por eso el Píxel de Meta queda desactivado.'
    }
  };
  var t = TEXTOS[(document.documentElement.getAttribute('lang') || 'pt').slice(0, 2).toLowerCase()] || TEXTOS.pt;

  function lerEscolha() {
    try {
      var salvo = JSON.parse(localStorage.getItem(CHAVE));
      if (salvo && Date.now() - salvo.data < VALIDADE) return salvo.escolha;
    } catch (e) { /* sem armazenamento: pergunta de novo */ }
    return null;
  }
  function gravarEscolha(escolha) {
    try { localStorage.setItem(CHAVE, JSON.stringify({ escolha: escolha, data: Date.now() })); } catch (e) { /* modo privado: vale só nesta página */ }
  }
  var escolhaAtual = lerEscolha();

  /* 2) Pixel: o código oficial da Meta, reorganizado para rodar só depois do consentimento */
  function ligarPixel() {
    if (!OFICIAL || GPC) {
      if (window.console) console.info('Amplexo: o Pixel da Meta só funciona em amplexoedu.com e sem o sinal Global Privacy Control.');
      return;
    }
    if (window.fbq) { window.fbq('consent', 'grant'); return; } // aceitou de novo depois de recusar, na mesma página
    var fbq = window.fbq = function () {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments); else fbq.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = [];
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
    fbq('init', PIXEL);
    fbq('track', 'PageView');
  }
  function desligarPixel() {
    if (window.fbq) window.fbq('consent', 'revoke');
    // Apaga os cookies que o Pixel tenha criado neste site
    ['_fbp', '_fbc'].forEach(function (nome) {
      document.cookie = nome + '=; Max-Age=0; path=/; domain=.' + location.hostname;
      document.cookie = nome + '=; Max-Age=0; path=/';
    });
  }

  /* 1) Aviso (com estilo próprio, porque as páginas do site usam folhas de estilo diferentes).
     As classes não têm "cookie" no nome porque bloqueadores de anúncio costumam esconder esses elementos. */
  var aviso, estado, origem;
  function criarAviso() {
    var css = document.createElement('style');
    css.textContent = [
      // Cartão claro flutuando no pé da tela: fácil de notar, sem pesar nem bloquear a página
      '.amx-aviso{position:fixed;z-index:2147483000;left:50%;bottom:16px;box-sizing:border-box;width:min(920px,calc(100% - 32px));padding:18px 22px;border-radius:18px;background:#fffdf9;color:#152232;box-shadow:0 18px 50px -18px rgba(6,25,42,.45),0 0 0 1px rgba(11,41,64,.1);transform:translateX(-50%);font-family:inherit;font-size:15px;line-height:1.5;letter-spacing:normal;text-align:left}',
      '.amx-aviso[hidden]{display:none}',
      '.amx-aviso-conteudo{display:flex;flex-wrap:wrap;align-items:center;gap:14px 28px}',
      '.amx-aviso-texto{flex:1 1 420px}',
      '.amx-aviso p{margin:0;color:#3d4955;font:inherit}',
      '.amx-aviso .amx-aviso-titulo{margin-bottom:2px;color:#0b2940;font-size:16.5px;font-weight:700;line-height:1.35}',
      '.amx-aviso .amx-aviso-estado{margin-top:6px;color:#740707;font-size:13.5px;font-weight:600}',
      '.amx-aviso a{color:#740707;font-weight:700;text-decoration:underline;text-underline-offset:3px}',
      '.amx-aviso-botoes{display:flex;gap:10px}',
      '.amx-aviso button{min-width:120px;min-height:44px;margin:0;padding:10px 20px;border:1.5px solid #0b2940;border-radius:999px;background:#fff;color:#0b2940;font:inherit;font-weight:700;cursor:pointer;transition:background-color .2s,color .2s}',
      '.amx-aviso button:hover{background:#0b2940;color:#fff}',
      '.amx-aviso:focus{outline:none}',
      '.amx-aviso :focus-visible{outline:3px solid #e3b04b;outline-offset:3px}',
      '@media (max-width:640px){.amx-aviso{bottom:12px;width:calc(100% - 24px);padding:16px;font-size:14.5px}.amx-aviso-texto{flex-basis:100%}.amx-aviso-botoes{flex:1 1 100%}.amx-aviso button{flex:1;min-width:0}}',
      '@media (prefers-reduced-motion:no-preference){.amx-aviso{animation:amx-aviso-entra .4s ease-out}@keyframes amx-aviso-entra{from{opacity:0;transform:translate(-50%,16px)}}}',
      '@media print{.amx-aviso{display:none!important}}'
    ].join('\n');
    document.head.appendChild(css);

    aviso = document.createElement('div');
    aviso.className = 'amx-aviso';
    aviso.setAttribute('role', 'region');
    aviso.setAttribute('aria-label', t.rotulo);
    aviso.tabIndex = -1;
    aviso.innerHTML = '<div class="amx-aviso-conteudo"><div class="amx-aviso-texto">' +
      '<p class="amx-aviso-titulo">' + t.titulo + '</p>' +
      '<p>' + t.texto + ' <a href="' + t.politica + '">' + t.saiba + '</a></p>' +
      '<p class="amx-aviso-estado" hidden></p></div>' +
      '<div class="amx-aviso-botoes">' +
      '<button type="button" data-escolha="recusado">' + t.recusar + '</button>' +
      '<button type="button" data-escolha="aceito">' + t.aceitar + '</button>' +
      '</div></div>';
    estado = aviso.querySelector('.amx-aviso-estado');
    aviso.addEventListener('click', function (evento) {
      var botao = evento.target.closest('[data-escolha]');
      if (botao) escolher(botao.getAttribute('data-escolha'));
    });
    // No começo da página, para quem navega pelo teclado encontrar o aviso logo
    document.body.insertBefore(aviso, document.body.firstChild);
    window.addEventListener('resize', reservarEspaco);
  }
  // Enquanto o aviso aparece, o fim da página ganha um espaço do tamanho dele, para o rodapé não ficar escondido
  var folgaOriginal = null;
  function reservarEspaco() {
    var corpo = document.body;
    if (folgaOriginal === null) folgaOriginal = corpo.style.paddingBottom;
    corpo.style.paddingBottom = folgaOriginal;
    if (!aviso.hidden) corpo.style.paddingBottom = (parseFloat(getComputedStyle(corpo).paddingBottom) || 0) + aviso.offsetHeight + 16 + 'px';
  }
  function mostrarAviso(pelaPolitica) {
    if (!aviso) criarAviso();
    // Aberto pelo botão da política: outro título e a escolha atual
    aviso.querySelector('.amx-aviso-titulo').textContent = pelaPolitica ? t.tituloPreferencias : t.titulo;
    var texto = pelaPolitica ? (GPC ? t.gpc : t[escolhaAtual] || '') : '';
    estado.textContent = texto;
    estado.hidden = !texto;
    aviso.hidden = false;
    reservarEspaco();
    if (pelaPolitica) aviso.focus();
  }
  function escolher(escolha) {
    escolhaAtual = escolha;
    gravarEscolha(escolha);
    aviso.hidden = true;
    reservarEspaco();
    if (escolha === 'aceito') ligarPixel(); else desligarPixel();
    if (origem) { origem.focus(); origem = null; }
  }

  function aoClicar(evento) {
    var alvo = evento.target;
    if (!alvo || !alvo.closest) return;

    var preferencias = alvo.closest('[data-cookies-preferencias]');
    if (preferencias && evento.type === 'click') { origem = preferencias; mostrarAviso(true); }

    // 3) WhatsApp: conta como contato (vale também para abrir em nova aba com o botão do meio)
    if (alvo.closest('a[href*="wa.me/"]') && escolhaAtual === 'aceito' && window.fbq) window.fbq('track', 'Contact');
  }
  document.addEventListener('click', aoClicar);
  document.addEventListener('auxclick', aoClicar);

  // O botão de preferências fica escondido sem JavaScript, porque sem script não há o que mudar
  Array.prototype.forEach.call(document.querySelectorAll('[data-cookies-preferencias]'), function (botao) { botao.hidden = false; });

  if (escolhaAtual === 'aceito') ligarPixel();
  else if (!escolhaAtual && !GPC) mostrarAviso(false);
})();
