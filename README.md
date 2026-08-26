# Constancce App — Landing Page

Landing page responsiva em PT-BR, estruturada como:

1. Triagem / Quiz de 5 perguntas
2. Diagnóstico personalizado
3. VSL
4. Explicação do produto
5. Recursos principais
6. Amigos + Conquistas
7. Comparação "antes x Constancce"
8. Prova social (placeholders — usar somente relatos reais)
9. Oferta vitalícia de R$ 37,90
10. Urgência sem contador artificial
11. Timeline de evolução
12. Para quem é / para quem não é
13. FAQ
14. Garantia
15. CTA final

## Arquivos

- `index.html` — estrutura
- `styles.css` — identidade visual e responsividade
- `script.js` — quiz, diagnóstico, VSL, checkout e eventos
- `assets/` — coloque aqui os prints reais do app, logo e outros arquivos

## O que editar primeiro

Abra `script.js` e edite:

```js
const CONSTANCCE_CONFIG = {
  checkoutUrl: "",
  vslEmbedUrl: "",
  metaPixelId: "",
  gaMeasurementId: ""
};
```

### Checkout

Exemplo:

```js
checkoutUrl: "https://seu-checkout.com/constancce"
```

Todos os botões com a classe `.js-checkout` passarão a abrir esse link.

### VSL

Use uma URL de incorporação (embed), por exemplo do Vimeo, YouTube, Panda ou player compatível:

```js
vslEmbedUrl: "https://player..."
```

### Prints reais do app

A versão entregue possui mockups em CSS para funcionar sem imagens.

Para usar prints reais, salve as imagens em `assets/` e substitua os blocos `.phone-mockup` no `index.html` por:

```html
<div class="app-shot">
  <img src="assets/hoje.png" alt="Tela Hoje do Constancce App">
</div>
```

E acrescente em `styles.css`:

```css
.app-shot img {
  width: 100%;
  display: block;
  border-radius: 28px;
}
```

## Meta Pixel / Google Analytics

A landing já dispara eventos internos via `dataLayer` e `fbq`, caso essas bibliotecas estejam instaladas:

- `quiz_start`
- `quiz_answer`
- `quiz_complete`
- `landing_unlocked`
- `vsl_play`
- `checkout_click`

Cole os scripts oficiais do Meta Pixel e GA4 no `<head>` e ajuste os eventos conforme seu funil.

## Publicação

É um site estático. Pode ser publicado em:

- Vercel
- Netlify
- GitHub Pages
- Hostinger / cPanel
- Cloudflare Pages
- Qualquer hospedagem que aceite HTML/CSS/JS

Basta subir todos os arquivos mantendo a estrutura de pastas.

## Observações estratégicas

- Não foi inserida contagem regressiva porque ainda não foi informado um prazo real de campanha.
- Não foram inventados depoimentos.
- O texto da garantia foi mantido com ressalva para que corresponda ao checkout e às regras aplicáveis.
- Os mockups atuais são demonstrativos e devem ser substituídos pelos prints reais do produto para aumentar credibilidade.
