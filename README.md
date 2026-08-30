# Constancce — Landing Page Otimizada

Landing page estática, responsiva e pronta para publicação.

## Arquivos principais

- `index.html`: conteúdo, SEO e estrutura da página.
- `styles.css`: design responsivo e animações.
- `script.js`: quiz, tour das telas, FAQ e eventos de analytics.
- `assets/`: screenshots do Constancce em PNG e WebP.
- `robots.txt`, `sitemap.xml` e `manifest.webmanifest`: arquivos de SEO e instalação.

## Como inserir a VSL

No `index.html`, localize:

```html
<div class="vsl-frame reveal" id="vslPlayerSlot" data-delay="100">
```

Substitua apenas o conteúdo interno dessa `div` pelo seu player.

### Vídeo MP4

```html
<video controls playsinline preload="metadata" poster="assets/capa-vsl.webp">
  <source src="assets/vsl.mp4" type="video/mp4">
  Seu navegador não suporta reprodução de vídeo.
</video>
```

### YouTube

```html
<iframe
  src="https://www.youtube.com/embed/SEU_ID"
  title="Apresentação do Constancce"
  loading="lazy"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen>
</iframe>
```

### Panda Video, Vimeo ou outro player

Cole o código de incorporação fornecido pela plataforma dentro de `#vslPlayerSlot`.

## Destino dos botões

Todos os CTAs levam para:

```text
https://www.constancceapp.com/
```

O valor do plano PRO não é exibido na landing page.

## Analytics

O código envia eventos para `window.dataLayer` e também para `fbq`, quando o Meta Pixel já estiver instalado:

- `quiz_start`
- `quiz_answer`
- `quiz_complete`
- `feature_view`
- `faq_open`
- `app_cta_click`

Instale o Google Tag Manager, GA4 ou Meta Pixel no `<head>` conforme os IDs oficiais da conta.

## Publicação

Envie toda a pasta para sua hospedagem mantendo a estrutura de arquivos. O domínio configurado no SEO é `https://www.constancceapp.com/`.
