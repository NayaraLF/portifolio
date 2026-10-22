# Lumen — Portfólio de Nayara Louback

Portfólio de **Desenvolvimento & Análise de Dados**. A história é contada pelo scroll: o site começa no escuro e a luz acende conforme você desce.

## Capítulos
1. **Vazio** — uma partícula acende, o título se revela por linha.
2. **Ruído** — painéis genéricos recuam em profundidade (o problema).
3. **Faísca** — a luz explode e a câmera avança pelo túnel de partículas.
4. **Método** — scroll horizontal pinado: Descoberta, Direção, Construção, Lançamento.
5. **Serviços** — cartões de vidro em camadas, com parallax por profundidade.
6. **Manifesto** — texto que acende palavra por palavra.
7. **Contato** — o orbe de luz vira o convite final.

## Stack
HTML, CSS e JavaScript sem build. GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13 e Three.js 0.160.0 por CDN. Todos os visuais são procedurais (shaders, SVG, CSS).

## Rodar localmente
```bash
python3 tools/serve.py   # http://localhost:4173
```
Os módulos ES exigem servidor HTTP; abrir o `index.html` direto do disco não funciona.

## Estrutura
```
index.html          conteúdo e semântica
css/main.css        tokens, layout e estilos por capítulo
js/main.js          inicialização
js/scroll.js        Lenis, progresso, parallax, cursor
js/text.js          reveals de linha e de palavra
js/scene.js         cena WebGL de partículas
js/chapters.js      animações por capítulo
tools/              servidor local e checagens de layout
docs/               spec, plano e screenshots de verificação
```

## Acessibilidade e robustez
- `prefers-reduced-motion`: sem scroll suave, parallax ou pins; cena estática; conteúdo todo visível.
- Sem WebGL: fallback em gradiente CSS.
- Fonte web bloqueada: o texto cai para serifa do sistema e continua legível.
- Sem overflow horizontal de 320 a 1440 px; contraste AA nos textos.

## Verificação
Screenshots em `docs/verification/` (1440, 1024, 768 e 390 px). Para checar overflow, cole `tools/check-layout.js` no console e rode `__checkLayout()`.
