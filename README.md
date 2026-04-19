# Clube Amplexo Educação — Website Oficial

[![Green Web Checked](https://img.shields.io/badge/Green%20Web-Checked-22c55e?style=flat-square&logo=leaflet)](https://www.thegreenwebfoundation.org/green-web-check/)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](LICENSE)

Site oficial do Clube Amplexo Educação, com versões em Português e Inglês, páginas institucionais e de premiações, além de metadados completos para SEO e compartilhamento em redes sociais.

## Páginas do Projeto

| Seção | PT-BR | EN-US |
|---|---|---|
| Home | / | /en/ |
| Escola Azul | /escola-azul/ | /en/escola-azul/ |
| Premiações | /premiacoes/ | /en/premiacoes/ |

## Recursos Principais

- Tema claro/escuro com persistência em localStorage.
- Navegação responsiva com menu mobile.
- Layout bilíngue (PT-BR e EN-US) com canonical e hreflang.
- Galeria com lightbox nas seções com imagens.
- Vídeos incorporados do YouTube.
- Efeitos visuais (glitch, cyber grid, reveal on scroll).
- Contadores animados nas seções de estatísticas.
- Metadados Open Graph e Twitter Card configurados por página.

## SEO e Thumb de Compartilhamento

Cada página pública possui metadados de compartilhamento com imagem dedicada:

- og:image
- og:image:secure_url
- og:image:alt
- twitter:card=summary_large_image
- twitter:image
- twitter:image:alt

Arquivos com metadados de thumb configurados:

- index.html
- en/index.html
- escola-azul/index.html
- en/escola-azul/index.html
- premiacoes/index.html
- en/premiacoes/index.html

Observação: após alterar imagem/meta de compartilhamento, algumas plataformas podem manter cache da prévia por um período.

## Estrutura de Pastas

```text
amplexoedu.com/
|-- index.html
|-- escola-azul/
|   |-- index.html
|-- premiacoes/
|   |-- index.html
|-- en/
|   |-- index.html
|   |-- escola-azul/
|   |   |-- index.html
|   |-- premiacoes/
|       |-- index.html
|-- css/
|   |-- styles.css
|   |-- escola-azul.css
|   |-- premiacoes.css
|-- js/
|   |-- main.js
|-- assets/
|   |-- images/
|-- reports/
|-- package.json
`-- LICENSE
```

## Desenvolvimento Local

Pré-requisitos:

- Node.js 18+ e npm

Instalação:

```bash
npm install
```

Subir servidor local:

```bash
npm run serve:local
```

URL local:

- http://127.0.0.1:4173/

## Auditoria (Lighthouse)

Executar auditoria completa (PT + EN):

```bash
npm run audit:lighthouse
```

Relatórios gerados em:

- reports/lighthouse-pt.html
- reports/lighthouse-en.html

## Tecnologias

- HTML5 semântico
- CSS3 (sem framework)
- JavaScript Vanilla
- Google Fonts (Outfit)

## Contato

| Canal | Informação |
|---|---|
| E-mail geral | amplexoedu@gmail.com |
| E-mail pedagógico | pedagogico@amplexoedu.com |
| WhatsApp | +55 (11) 9 1100-9793 |
| Instagram | https://www.instagram.com/amplexoedu |
| YouTube | https://www.youtube.com/@Amplexoeducacao |
| LinkedIn | https://www.linkedin.com/company/amplexo-educa%C3%A7%C3%A3o/ |

## Licença

Este repositório utiliza licença proprietária.

Consulte o arquivo LICENSE para termos completos de uso, restrições e contato para autorização formal.
