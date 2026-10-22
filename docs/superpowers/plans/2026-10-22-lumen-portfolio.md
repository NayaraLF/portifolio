# Lumen Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o portfólio "Lumen" de Nayara Louback, um site de scroll narrativo em camadas, verificado visualmente em 4 larguras.

**Architecture:** Site estático sem build. Um canvas Three.js fixo ao fundo recebe `uProgress` (0–1) de um único ScrollTrigger global; o DOM em camadas (parallax por `data-depth`) e os reveals de texto usam GSAP ScrollTrigger sobre o scroll suave do Lenis. Cada módulo JS expõe uma função `init*` chamada por `main.js`.

**Tech Stack:** HTML5, CSS3, JS ES modules, GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13, Three.js 0.160.0 (CDN com versão exata), Google Fonts.

**Spec:** `docs/superpowers/specs/2026-10-22-lumen-portfolio-design.md`

## Global Constraints

- Idioma: português do Brasil. Marca: "Nayara Louback — Desenvolvimento & Análise de Dados".
- Cores (tokens em `:root`): `--ink:#06050A`, `--violet:#7C3AED`, `--lavender:#C4B5FD`, `--paper:#F4F1FA`.
- Fontes: Instrument Serif (display), Inter Tight (corpo), JetBrains Mono (rótulos).
- Sem cases, clientes, métricas ou depoimentos inventados. Sem foto. Sem imagens/vídeos externos: tudo procedural.
- Serviços (exatamente 4): Sites e experiências web sob medida; Análise de dados e relatórios; Automação e pipelines de dados (SQL, Python); Sistemas e apps com dados integrados.
- Contatos: nayara993@gmail.com · `https://wa.me/5544991547508` (exibir +55 44 99154-7508) · https://www.linkedin.com/in/nayaralf/ · https://github.com/NayaraLF
- Capítulos, nesta ordem: Vazio, Ruído, Faísca, Método (4 passos: Descoberta, Direção, Construção, Lançamento), Serviços, Manifesto, Contato.
- Mobile: DPR do canvas limitado a 1.5, menos partículas, seção Método vira vertical. `prefers-reduced-motion`: sem Lenis, sem parallax, reveals viram fade curto, cena estática. Sem WebGL: fallback em gradiente CSS.
- Sem overflow horizontal em 1440, 1024, 768 e 390 px. Console sem erros. Contraste AA.
- Os arquivos antigos `style.css`, `script.js`, `img/` são removidos; o histórico fica no git.

## Review Focus

- Largura 320 px (menor que o mínimo testado): sem overflow nem texto cortado.
- Recarregar a página já rolada até o meio: sem estado quebrado do ScrollTrigger e cena no progresso correto.
- Redimensionar a janela durante o uso (rotação do celular): pins e canvas recalculam.
- Aba em segundo plano e volta: animação não acumula atraso nem dispara tudo de uma vez.
- Fonte web lenta ou bloqueada: títulos continuam legíveis e a quebra por linhas é refeita após `document.fonts.ready`.

---

### Task 1: Esqueleto, tokens e conteúdo estático

**Files:**
- Create: `index.html`, `css/main.css`, `js/main.js`, `favicon.svg`, `tools/check-layout.js`
- Delete: `style.css`, `script.js`, `img/nayara.png`
- Modify: `README.md` (reescrever descrevendo o Lumen)

**Interfaces:**
- Produces: seções `<section id="vazio|ruido|faisca|metodo|servicos|manifesto|contato">`; atributos `data-depth` (número) em elementos de parallax; `data-reveal="lines"` em títulos; `data-scrub-words` no manifesto; `<canvas id="stage">` fixo; `window.__checkLayout(): {width:number, overflowX:boolean, offenders:string[]}` definido em `tools/check-layout.js` (colado via console/`javascript_tool`).

- [ ] **Step 1: Escrever `tools/check-layout.js`** definindo `window.__checkLayout`: `overflowX` = `document.documentElement.scrollWidth > innerWidth`; `offenders` = seletores de elementos visíveis cujo `getBoundingClientRect().right > innerWidth + 1` ou `left < -1`, ignorando descendentes de `[data-allow-overflow]`.
- [ ] **Step 2: Rodar o check na página antiga** (abrir `index.html` no navegador embutido, colar o script, chamar `__checkLayout()`). Expected: função existe e retorna objeto (valida a ferramenta antes do site novo).
- [ ] **Step 3: Criar `index.html`** semântico, com `lang="pt-BR"`, `<title>Nayara Louback — Desenvolvimento & Análise de Dados</title>`, meta description, `<nav>` com 4 âncoras (Método, Serviços, Manifesto, Contato), as 7 seções com todo o texto final em pt-BR (copy escrita aqui, sem placeholders), e links de contato exatos da seção Global Constraints. Scripts carregados como `type="module"` no fim.
- [ ] **Step 4: Criar `css/main.css`** com tokens, reset, tipografia fluida (`clamp`), grid, `html{background:var(--ink)}`, e estados iniciais dos reveals sob `.js` (sem JS o texto fica visível).
- [ ] **Step 5: Verificar** sem animação: páginas legíveis em 1440 e 390 px; `__checkLayout()` retorna `overflowX:false` e `offenders:[]`.
- [ ] **Step 6: Commit** `feat: esqueleto estático do portfólio Lumen`

### Task 2: Scroll suave, progresso, cursor e navegação

**Files:**
- Create: `js/scroll.js`
- Modify: `js/main.js`, `css/main.css`

**Interfaces:**
- Consumes: `data-depth`, âncoras da `<nav>` (Task 1).
- Produces: `initScroll(): { lenis: Lenis, progress: () => number }` (progresso global 0–1); `initCursor(): void`; `initParallax(): void` (aplica `y` proporcional a `data-depth` com `scrub:true`); evento `window` `lumen:progress` com `detail: number`. Em reduced-motion, `initScroll` não cria Lenis e `initParallax` é no-op.

- [ ] **Step 1: Teste manual de falha:** rolar a página da Task 1 e confirmar que não há barra de progresso, nem scroll suave, nem parallax.
- [ ] **Step 2: Implementar** `initScroll` (Lenis ligado ao ticker do GSAP e ao `ScrollTrigger.update`, `lagSmoothing(0)`), barra de progresso fixa no topo, `initParallax`, `initCursor` (ponto + anel que segue o mouse, escondido em dispositivos `pointer:coarse`), e rolagem suave das âncoras via `lenis.scrollTo`.
- [ ] **Step 3: Verificar** no navegador: barra vai de 0 a 100% do topo ao fim; âncoras rolam suavemente; `__checkLayout()` limpo em 1440 e 390 px; console sem erros.
- [ ] **Step 4: Commit** `feat: scroll suave, parallax, cursor e progresso`

### Task 3: Sistema de reveal de texto

**Files:**
- Create: `js/text.js`
- Modify: `js/main.js`, `css/main.css`

**Interfaces:**
- Consumes: `data-reveal="lines"`, `data-scrub-words` (Task 1).
- Produces: `initTextReveals(): Promise<void>` (aguarda `document.fonts.ready`); `splitLines(el: HTMLElement): HTMLElement[]` (envolve cada linha visual em máscara `overflow:clip`); `splitWords(el: HTMLElement): HTMLElement[]`; `refreshText(): void` (refaz o split e `ScrollTrigger.refresh()`, chamado em `resize` com debounce de 200 ms).

- [ ] **Step 1: Escrever a checagem em `tools/check-text.js`:** para cada `[data-reveal="lines"]`, após rolar até a seção, confirma que todas as linhas têm `transform` identidade e `opacity` 1. Rodar antes de implementar. Expected: falha (linhas ainda não existem).
- [ ] **Step 2: Implementar** `splitLines` medindo `offsetTop` de spans de palavras para agrupar linhas (sem libs pagas), reveal de `yPercent:110 → 0` com stagger, e scrub palavra a palavra (`opacity .15 → 1`) no manifesto.
- [ ] **Step 3: Rodar `tools/check-text.js`.** Expected: PASS; verificar também após redimensionar de 1440 para 390 px (linhas refeitas).
- [ ] **Step 4: Commit** `feat: reveals de texto por linha e por palavra`

### Task 4: Cena WebGL de fundo

**Files:**
- Create: `js/scene.js`
- Modify: `js/main.js`, `css/main.css`

**Interfaces:**
- Consumes: evento `lumen:progress` (Task 2).
- Produces: `initScene(canvas: HTMLCanvasElement): { setProgress(p: number): void, dispose(): void } | null` (retorna `null` sem WebGL, e o CSS ativa o fallback em gradiente); constante `PARTICLES = { desktop: 6000, mobile: 2000 }`.

- [ ] **Step 1: Teste de falha:** `document.querySelector('#stage')` existe mas o canvas está vazio (leitura de pixels via `toDataURL` igual a canvas em branco).
- [ ] **Step 2: Implementar** `initScene`: `THREE.Points` com `ShaderMaterial` (posições em espaço de túnel; `uProgress`, `uTime`, `uMouse`), glow volumétrico por sprite aditivo na origem, câmera avançando em Z com `uProgress`, cor indo de lavanda fraca (progress 0) a violeta intensa (~0.15, Faísca), `devicePixelRatio ≤ 1.5` no mobile, pausa quando `document.hidden`, `resize` tratado, e `webglcontextlost` cai para o fallback.
- [ ] **Step 3: Verificar** no navegador: canvas não está em branco em progress 0, 0.2 e 0.8 (screenshots distintos); 60 fps aproximado em desktop (`performance` sem long tasks > 50 ms em 5 s rolando); fallback testado forçando `getContext` a retornar `null`.
- [ ] **Step 4: Commit** `feat: cena WebGL de partículas ligada ao scroll`

### Task 5: Capítulos Vazio, Ruído e Faísca

**Files:**
- Modify: `index.html`, `css/main.css`, `js/main.js`; Create: `js/chapters.js`

**Interfaces:**
- Consumes: `initParallax`, `initTextReveals`, cena (Tasks 2–4).
- Produces: `initChapters(): void` com timelines ScrollTrigger por capítulo (`scrub`), expostas em `window.__lumen.chapters: ScrollTrigger[]` para depuração.

- [ ] **Step 1: Teste de falha:** na posição de cada capítulo o screenshot ainda mostra apenas o layout estático.
- [ ] **Step 2: Implementar** Vazio (partícula inicial pulsa, título "Sites e dados que não se esquecem." revelado por linha, rótulo de marca), Ruído (6 painéis genéricos em `data-depth` variados que recuam em Z e perdem opacidade) e Faísca (flash de luz via overlay radial + `setProgress` acelerado, texto da virada).
- [ ] **Step 3: Verificar** screenshots em 1440 e 390 px em 3 pontos por capítulo; `__checkLayout()` limpo em cada.
- [ ] **Step 4: Commit** `feat: capítulos Vazio, Ruído e Faísca`

### Task 6: Capítulo Método (horizontal pinado)

**Files:**
- Modify: `index.html`, `css/main.css`, `js/chapters.js`

**Interfaces:**
- Produces: `initMethod(): void` usando `ScrollTrigger.matchMedia`: ≥ 900 px pina `#metodo` e move a trilha horizontal com `scrub`; abaixo disso, os 4 passos empilham verticalmente com reveal. Trilha marcada com `data-allow-overflow`.

- [ ] **Step 1: Teste de falha:** em 1440 px a trilha de 4 painéis não rola horizontalmente.
- [ ] **Step 2: Implementar** os 4 painéis (Descoberta, Direção, Construção, Lançamento) com numeral gigante em camada de fundo (parallax próprio) e linha de progresso do passo ativo.
- [ ] **Step 3: Verificar** 1440, 1024, 768 e 390 px: no desktop o pin dura exatamente o comprimento da trilha, sem espaço vazio depois; no mobile, vertical; `__checkLayout()` limpo; trocar de 1440 para 390 px sem recarregar mantém o layout correto.
- [ ] **Step 4: Commit** `feat: capítulo Método com scroll horizontal pinado`

### Task 7: Serviços em camadas e Manifesto

**Files:**
- Modify: `index.html`, `css/main.css`, `js/chapters.js`

**Interfaces:**
- Produces: `initServices(): void` (cartões de vidro com `backdrop-filter`, `data-depth` de 0.05 a 0.3, hover magnético que só liga em `pointer:fine`); `initManifesto(): void` (usa `splitWords` de Task 3).

- [ ] **Step 1: Teste de falha:** a seção mostra os 4 serviços estáticos, sem camadas nem hover.
- [ ] **Step 2: Implementar** os 4 cartões exatamente com os nomes da seção Global Constraints, cada um com uma linha de descrição honesta (sem números ou promessas inventados), e o manifesto de 2–3 frases acendendo palavra a palavra.
- [ ] **Step 3: Verificar** screenshots 1440/390; contraste AA do texto sobre o vidro (razão ≥ 4.5 medida por script); `__checkLayout()` limpo.
- [ ] **Step 4: Commit** `feat: serviços em camadas e manifesto`

### Task 8: Contato e rodapé em cortina

**Files:**
- Modify: `index.html`, `css/main.css`, `js/chapters.js`

**Interfaces:**
- Produces: `initContact(): void` (orbe de luz cresce com o scroll e vira o botão de WhatsApp; 4 links de contato; rodapé "cortina" por `position:sticky`/clip).

- [ ] **Step 1: Teste de falha:** script confere que os 4 links existem com os `href` exatos de Global Constraints (`mailto:nayara993@gmail.com`, `https://wa.me/5544991547508`, LinkedIn, GitHub), com `rel="noopener noreferrer"` e `target="_blank"` nos externos. Expected: falha até implementar.
- [ ] **Step 2: Implementar** e rodar o script. Expected: PASS.
- [ ] **Step 3: Verificar** screenshots 1440/390 no fim da página; foco por teclado visível em cada link.
- [ ] **Step 4: Commit** `feat: capítulo Contato e rodapé em cortina`

### Task 9: Acessibilidade, reduced-motion e robustez

**Files:**
- Modify: `js/main.js`, `js/scroll.js`, `js/scene.js`, `css/main.css`, `index.html`

**Interfaces:**
- Produces: `const reduced = matchMedia('(prefers-reduced-motion: reduce)')` consultado por todos os `init*`; link "Pular para o conteúdo"; `aria-hidden="true"` no canvas e em elementos decorativos.

- [ ] **Step 1: Teste de falha:** com reduced-motion emulado, ainda existe Lenis ativo ou transform de parallax. Expected: falha.
- [ ] **Step 2: Implementar** os caminhos de reduced-motion (conteúdo visível e estático, fades de 200 ms), fallback sem WebGL, retomada ao voltar à aba, e `resize` recalculando pins e canvas.
- [ ] **Step 3: Verificar** os 5 itens de Review Focus: 320 px sem overflow; reload no meio do scroll; redimensionar 1440→390; aba oculta e retorno; fonte bloqueada (bloquear Google Fonts na rede e conferir que o texto permanece legível).
- [ ] **Step 4: Commit** `fix: acessibilidade, movimento reduzido e robustez`

### Task 10: Verificação final e entrega

**Files:**
- Create: `docs/verification/` (screenshots); Modify: `README.md`

- [ ] **Step 1: Capturar screenshots** em 1440, 1024, 768 e 390 px em pelo menos 6 pontos de scroll cada (topo, Ruído, Faísca, Método, Serviços, Contato) e salvar em `docs/verification/<largura>-<ponto>.png`.
- [ ] **Step 2: Rodar `__checkLayout()`** em cada largura em cada ponto. Expected: `overflowX:false` e `offenders:[]` em todos.
- [ ] **Step 3: Conferir** console sem erros/avisos, contraste AA, links de contato, e teste com reduced-motion.
- [ ] **Step 4: Corrigir** qualquer falha e repetir os passos 1–3 até tudo passar.
- [ ] **Step 5: Atualizar `README.md`** e fazer o commit final `docs: verificação e README do Lumen`.
