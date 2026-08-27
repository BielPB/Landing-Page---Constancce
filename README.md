# Constancce App — Landing Page com VSL Gate 70% + BASIC/PRO

## Funil implementado

1. Quiz de 5 perguntas
2. Diagnóstico personalizado
3. Liberação exclusiva da VSL
4. Restante da página fica totalmente oculto
5. Ao atingir 70% realmente assistido, o restante é liberado automaticamente
6. Apresentação do produto
7. Dois planos: BASIC gratuito e PRO vitalício
8. FAQ, garantia e CTAs

## Como funciona o bloqueio da VSL

A página não usa apenas o `currentTime` do vídeo no modo HTML5. Ela soma os intervalos realmente reproduzidos (`video.played`), evitando que apenas arrastar a barra para 70% libere o conteúdo.

No YouTube, o código acompanha o maior ponto assistido e impede saltos grandes para frente antes da parte já vista.

Ao atingir 70%, são liberados:

- Recursos
- Benefícios
- Prova social
- Planos BASIC e PRO
- FAQ
- Garantia
- CTA final
- Rodapé
- CTA fixo no mobile

A liberação é salva no navegador com `localStorage` para não bloquear novamente o mesmo usuário em uma recarga posterior.

## Configuração principal

Edite `script.js`:

```js
const CONSTANCCE_CONFIG = {
  basicUrl: "",
  proCheckoutUrl: "",
  vslProvider: "html5",
  vslUrl: "",
  youtubeVideoId: "",
  unlockAt: 0.70,
  devMode: false
};
```

### Opção 1 — MP4/WebM direto

```js
vslProvider: "html5",
vslUrl: "assets/vsl.mp4"
```

Coloque o vídeo na pasta `assets`.

### Opção 2 — YouTube

```js
vslProvider: "youtube",
youtubeVideoId: "SEU_ID_AQUI"
```

Use apenas o ID do vídeo, não a URL completa.

### Outros players (Panda, Vimeo, etc.)

Cada player possui sua própria API de progresso. Para medir 70% de forma real, a integração precisa usar a API oficial do player escolhido. Não use um iframe genérico se quiser garantir o bloqueio com precisão.

## Planos

### BASIC — R$ 0

O texto foi propositalmente criado sem inventar limites numéricos que ainda não foram definidos no produto. A landing comunica que é uma versão gratuita, limitada e destinada a testes.

### PRO — R$ 37,90

Oferta atual apresentada como pagamento único/vitalício, seguindo as informações fornecidas para o Constancce.

## URLs

```js
basicUrl: "https://..."
proCheckoutUrl: "https://..."
```

## Teste do bloqueio

Durante desenvolvimento, altere temporariamente:

```js
devMode: true
```

Será exibido um botão discreto de desenvolvimento para simular 70%. Antes de publicar, volte para `false`.

## Eventos de rastreamento preparados

- quiz_start
- quiz_answer
- quiz_complete
- landing_vsl_revealed
- vsl_play
- vsl_25_percent
- vsl_50_percent
- vsl_70_percent
- basic_plan_click
- pro_checkout_click

## Importante

Os limites exatos do BASIC devem ser ajustados quando forem definidos no próprio Constancce. Evitei anunciar, por exemplo, “3 hábitos” ou “1 treino”, porque esses limites não foram fornecidos.


## Screenshots reais inseridos nesta versão

Os mockups ilustrativos foram substituídos pelos prints enviados, nesta ordem:

1. `assets/01-hoje.png`
2. `assets/02-habitos.png`
3. `assets/03-treinos.png`
4. `assets/04-financas.png`
5. `assets/05-metas.png`
6. `assets/06-progresso.png`
7. `assets/07-amigos-conquistas.png`

As imagens são os arquivos originais enviados, sem geração de novas imagens.
