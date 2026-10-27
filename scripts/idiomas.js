#!/usr/bin/env node
/*
  Aplica em todas as páginas do site as peças comuns aos três idiomas:
    - links hreflang (PT, EN, ES) para o Google entender as versões de cada página;
    - css/global.css e js/global.js (escolha automática de idioma e vídeos que só carregam ao clicar);
    - seletor de idioma com bandeiras;
    - fontes hospedadas no próprio site (remove os links do Google Fonts);
    - capa clicável no lugar dos vídeos do YouTube incorporados.

  Uso (na raiz do repositório):  node scripts/idiomas.js
  Pode ser executado quantas vezes quiser: o resultado é sempre o mesmo.

  Página nova? Acrescente uma linha em PAGINAS com o caminho da página nos três idiomas e rode o script.
*/
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const SITE = 'https://amplexoedu.com/';

// [português, inglês, espanhol] — pastas relativas à raiz do site
const PAGINAS = [
  ['', 'en/', 'es/'],
  ['escola-azul/', 'en/escola-azul/', 'es/escola-azul/'],
  ['premiacoes/', 'en/premiacoes/', 'es/premiacoes/'],
  ['competicoes/', 'en/competicoes/', 'es/competicoes/'],
  ['acsl/', 'en/acsl/', 'es/acsl/'],
  ['smeta/', 'en/smeta/', 'es/smeta/'],
  ['projetos-que-abraçam/', 'en/projetos-que-abraçam/', 'es/projetos-que-abraçam/'],
  ['jornal-amplexo/', 'en/jornal-amplexo/', 'es/jornal-amplexo/'],
  ...['calendario-reune-ciencia-arte-e-tecnologia', 'distincao-internacional-impacto-educacional', 'novos-projetos-dos-alunos', 'nutrir-o-cerebro-ao-longo-da-vida']
    .map(s => [`jornal-amplexo/${s}/`, `en/jornal-amplexo/${s}/`, `es/jornal-amplexo/${s}/`]),
  ['privacidade/', 'en/privacy/', 'es/privacidad/'],
  ['termos/', 'en/terms/', 'es/terminos/'],
  ['acessibilidade/', 'en/accessibility/', 'es/accesibilidad/'],
];

const IDIOMAS = [
  { codigo: 'pt', hreflang: 'pt-BR', nome: 'Português', sigla: 'PT', bandeira: 'br' },
  { codigo: 'en', hreflang: 'en', nome: 'English', sigla: 'EN', bandeira: 'us' },
  { codigo: 'es', hreflang: 'es', nome: 'Español', sigla: 'ES', bandeira: 'es' },
];
const TEXTOS = {
  pt: { seletor: 'Escolher idioma', assistir: 'Assistir ao vídeo', aviso: 'Clique para assistir. O vídeo será carregado do YouTube.' },
  en: { seletor: 'Choose language', assistir: 'Play video', aviso: 'Click to play. The video will load from YouTube.' },
  es: { seletor: 'Elegir idioma', assistir: 'Ver el video', aviso: 'Haz clic para verlo. El video se cargará desde YouTube.' },
};
const PADRAO = 'en'; // x-default: quem não fala português nem espanhol vê o inglês (igual ao js/global.js)

const relativo = (de, para) => {
  const r = path.posix.relative(de.replace(/\/$/, '') || '.', para.replace(/\/$/, '') || '.');
  return r ? r + '/' : './';
};
const absoluto = pasta => SITE + encodeURI(pasta);

let alteradas = 0;
const avisos = [];
const videosSemCapa = new Set();

for (const grupo of PAGINAS) {
  grupo.forEach((pasta, i) => {
    const idioma = IDIOMAS[i];
    const arquivo = path.join(RAIZ, pasta, 'index.html');
    if (!fs.existsSync(arquivo)) { avisos.push(`não existe: ${pasta || '/'}index.html`); return; }

    const original = fs.readFileSync(arquivo, 'utf8');
    const eol = original.includes('\r\n') ? '\r\n' : '\n';
    let html = original.replace(/\r\n/g, '\n');
    const raiz = '../'.repeat(pasta.split('/').filter(Boolean).length);
    const t = TEXTOS[idioma.codigo];

    // 1) Fontes: remove Google Fonts (preconnect, link, noscript)
    html = html.replace(/^[ \t]*<(?:link|noscript)\b[^\n]*fonts\.(?:googleapis|gstatic)\.com[^\n]*\n/gm, '');
    if (/fonts\.(googleapis|gstatic)\.com/.test(html)) avisos.push(`${pasta || '/'}: ainda há referência ao Google Fonts`);

    // 2) Bloco no <head>: hreflang + fontes locais + global.css/js
    html = html.replace(/^[ \t]*<link rel="alternate" hreflang="[^"]*"[^>]*>\n/gm, '');
    const temFontes = /href="[^"]*css\/fonts\.css"/.test(html.replace(/<!-- idiomas:inicio -->[\s\S]*?<!-- idiomas:fim -->/, ''));
    const bloco = [
      '<!-- idiomas:inicio -->',
      ...grupo.map((p, j) => `  <link rel="alternate" hreflang="${IDIOMAS[j].hreflang}" href="${absoluto(p)}">`),
      `  <link rel="alternate" hreflang="x-default" href="${absoluto(grupo[IDIOMAS.findIndex(x => x.codigo === PADRAO)])}">`,
      ...(temFontes ? [] : [`  <link rel="stylesheet" href="${raiz}css/fonts.css">`]),
      `  <link rel="stylesheet" href="${raiz}css/global.css">`,
      `  <script src="${raiz}js/global.js"></script>`,
      '  <!-- idiomas:fim -->',
    ].join('\n');
    if (html.includes('<!-- idiomas:inicio -->')) {
      html = html.replace(/<!-- idiomas:inicio -->[\s\S]*?<!-- idiomas:fim -->/, bloco);
    } else {
      const ancora = html.match(/^([ \t]*)<link rel="canonical"[^>]*>\n/m) || html.match(/^([ \t]*)<title>[^<]*<\/title>\n/m);
      if (!ancora) { avisos.push(`${pasta || '/'}: sem <title> para ancorar o bloco`); return; }
      const pos = ancora.index + ancora[0].length;
      html = html.slice(0, pos) + ancora[1] + bloco.replace(/\n {2}/g, '\n' + ancora[1]) + '\n' + html.slice(pos);
    }

    // 3) Seletor de idioma com bandeiras
    const itens = grupo.map((p, j) => {
      const l = IDIOMAS[j];
      const atual = j === i ? ' aria-current="true"' : '';
      return `<a href="${relativo(pasta, p)}" hreflang="${l.hreflang}" lang="${l.hreflang}" data-idioma="${l.codigo}" aria-label="${l.nome}" title="${l.nome}"${atual}><img src="${raiz}assets/flags/${l.bandeira}.svg" alt="" width="18" height="13"><span>${l.sigla}</span></a>`;
    }).join('');
    const seletor = `<!-- idioma:seletor --><nav class="lang-switch" aria-label="${t.seletor}">${itens}</nav><!-- /idioma:seletor -->`;
    if (html.includes('<!-- idioma:seletor -->')) {
      html = html.replace(/<!-- idioma:seletor -->[\s\S]*?<!-- \/idioma:seletor -->/, seletor);
    } else if (/<a [^>]*class="ctrl-btn lang-btn"[^>]*>[^<]*<\/a>/.test(html)) {           // páginas do Clube
      html = html.replace(/<a [^>]*class="ctrl-btn lang-btn"[^>]*>[^<]*<\/a>/, seletor);
    } else if (/<button class="nav-toggle"/.test(html)) {                                     // nova home
      html = html.replace(/<button class="nav-toggle"/, seletor + '\n        <button class="nav-toggle"');
    } else if (/<span class="edition">[^<]*<\/span>/.test(html)) {                            // Jornal
      html = html.replace(/(<span class="edition">[^<]*<\/span>)/, '$1 ' + seletor);
    } else {
      avisos.push(`${pasta || '/'}: não achei onde colocar o seletor`);
    }

    // 4) Vídeos do YouTube: capa local no lugar do iframe
    html = html.replace(/<iframe src="https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/([\w-]+)[^"]*"([^>]*)><\/iframe>/g, (_, id, atributos) => {
      const titulo = (atributos.match(/title="([^"]*)"/) || [, 'YouTube'])[1];
      if (!fs.existsSync(path.join(RAIZ, 'assets/images/youtube', id + '.jpg'))) videosSemCapa.add(id);
      return `<button type="button" class="yt-facade" data-youtube="${id}" data-titulo="${titulo}" aria-label="${t.assistir}: ${titulo}">` +
        `<img src="${raiz}assets/images/youtube/${id}.jpg" alt="" loading="lazy" decoding="async">` +
        `<span class="yt-facade-play" aria-hidden="true"></span><span class="yt-facade-aviso">${t.aviso}</span></button>`;
    });

    const final = html.replace(/\n/g, eol);
    if (final !== original) { fs.writeFileSync(arquivo, final); alteradas++; }
  });
}

console.log(`${alteradas} página(s) atualizada(s).`);
if (videosSemCapa.size) avisos.push(`baixe as capas destes vídeos para assets/images/youtube/<id>.jpg: ${[...videosSemCapa].join(', ')}`);
if (avisos.length) { console.log('\nAvisos:'); avisos.forEach(a => console.log(' - ' + a)); }
