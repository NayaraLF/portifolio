# Lumen — Portfólio de Nayara Louback (Design Spec)

Data: 2026-10-22 · Status: aguardando revisão

## 1. Objetivo
Portfólio pessoal para prospectar clientes. A história é contada inteiramente pelo scroll, com animações em camadas e sensação de profundidade, em nível de site candidato a prêmio de design.

- **Marca:** Nayara Louback — Desenvolvimento & Análise de Dados
- **Idioma:** português do Brasil
- **Conceito:** "Lumen — Do vazio à luz": o scroll acende o site.
- **Sem cases de clientes.** O foco é processo e serviços. Nenhum cliente, métrica ou depoimento é inventado.
- **Sem foto.** O visual é abstrato e gerado em código.

## 2. Identidade visual
- **Cores:** tinta `#06050A` (fundo), violeta `#7C3AED`, lavanda `#C4B5FD` (luz), branco quente `#F4F1FA` (texto). Tokens em `:root`.
- **Tipografia:** serifa display (Instrument Serif) para títulos gigantes; sans técnica (Inter Tight) para corpo; mono (JetBrains Mono) para rótulos. Carregadas via Google Fonts.
- **Textura:** grão sutil em SVG, vinheta e névoa em CSS.
- **Assets:** 100% procedurais (WebGL/GLSL, SVG, CSS). Nenhum arquivo de imagem ou vídeo externo. Favicon em SVG.

## 3. Capítulos
1. **Vazio** — tela preta, uma partícula acende, título revelado por linha com máscara: "Sites e dados que não se esquecem." Rótulo: Nayara Louback · Desenvolvimento & Análise de Dados.
2. **Ruído** — painéis genéricos apagados flutuam em Z e se afastam ao rolar. Texto: o problema de sites e relatórios esquecíveis.
3. **Faísca** — a luz explode, a câmera avança por um túnel de partículas. Virada para a solução.
4. **Método** — seção horizontal pinada com 4 passos: Descoberta, Direção, Construção, Lançamento.
5. **Serviços** — cartões de vidro em camadas Z, parallax diferente por camada, hover magnético:
   - Sites e experiências web sob medida
   - Análise de dados e relatórios
   - Automação e pipelines de dados (SQL, Python)
   - Sistemas e apps com dados integrados
6. **Manifesto** — texto gigante que acende palavra por palavra com o scroll.
7. **Contato** — orbe de luz vira o botão central; rodapé revelado por cortina.

## 4. Camadas de profundidade
| Nível | Conteúdo | Movimento |
|---|---|---|
| Fundo | Canvas Three.js: partículas + luz volumétrica | Progresso do scroll e mouse |
| Meio-fundo | Grão, névoa, vinheta (CSS/SVG) | Deriva lenta |
| Meio | Linhas e formas SVG | Parallax lento |
| Frente | Conteúdo e tipografia | Reveals por máscara |
| Topo | Cursor, barra de progresso, navegação | Fixo / seguidor |

## 5. Técnica
- HTML/CSS/JS sem build. Substitui `index.html`, `style.css`, `script.js` (histórico permanece no git).
- Estrutura: `index.html`, `css/main.css`, `js/scene.js`, `js/scroll.js`, `js/text.js`, `js/main.js`.
- Bibliotecas por CDN, com versão exata: GSAP + ScrollTrigger, Lenis, Three.js.
- Uma única timeline de scroll alimenta o canvas e o DOM.
- **Mobile:** menos partículas, DPR limitado a 1.5, seção horizontal vira vertical.
- **`prefers-reduced-motion`:** sem scroll suave nem parallax; reveals viram fades curtos; cena estática.
- **Sem WebGL:** fallback em gradiente CSS.
- Acessibilidade: HTML semântico, foco visível, contraste AA, links com rótulos.

## 6. Contato (dados fornecidos)
- E-mail: nayara993@gmail.com
- WhatsApp: +55 44 99154-7508 (`https://wa.me/5544991547508`)
- LinkedIn: https://www.linkedin.com/in/nayaralf/
- GitHub: https://github.com/NayaraLF

## 7. Verificação (critério de pronto)
- Screenshots no navegador embutido em 1440, 1024, 768 e 390 px, em pelo menos 6 pontos do scroll cada.
- Script confirma `scrollWidth <= innerWidth` em cada largura, e nenhum elemento fora dos limites.
- Console sem erros ou avisos.
- Contraste AA nos textos principais.
- Teste com `prefers-reduced-motion` ativo.
- Links de contato conferidos.

## 8. Fora de escopo
Blog/CMS, formulário com backend, multi-idioma, cases reais, fotos, assets do Higgsfield.

## 9. Referências (apenas técnica, sem cópia)
jazeancoffee.com, Godly, Awwwards, Refero, 21st.dev.
