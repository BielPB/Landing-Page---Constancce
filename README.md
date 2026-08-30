# Constancce — Landing Page Otimizada

Landing page estática, responsiva e pronta para publicação.

## Arquivos principais

- `index.html`: conteúdo, SEO e estrutura da página.
- `styles.css`: direção de arte, responsividade e sistema completo de animações.
- `script.js`: quiz, tour das telas, FAQ, progresso de rolagem, transições por seção, microinterações e eventos de analytics.
- `assets/`: screenshots em WebP, logo oficial e ícones do Constancce.
- `favicon.ico`: favicon oficial em múltiplas resoluções.
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

Os cards BASIC e PRO apresentam perfil ideal, recursos por módulo, limites do plano gratuito e diferenciais da experiência completa. As condições comerciais do PRO permanecem disponíveis apenas dentro do aplicativo.

## Sistema de movimento

A página inclui animações de entrada e saída, títulos coreografados palavra por palavra, indicador de seção, profundidade nos cards, CTAs magnéticos e movimentos ambientais. Em celulares, ponteiros imprecisos ou dispositivos configurados para reduzir movimento, os efeitos mais intensos são desativados automaticamente.

### Ajustes para mobile

- A página não gera rolagem horizontal; apenas o carrossel de módulos possui navegação lateral própria.
- O atalho “Ir para o conteúdo” aparece somente durante navegação por teclado.
- O CTA flutuante inferior foi removido para não cobrir conteúdo ou a VSL.
- Blur, movimentos contínuos e camadas decorativas mais pesadas são reduzidos no celular.

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
