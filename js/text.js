// Reveals de texto: linhas com máscara e palavras acendendo com o scroll.
import { reduced } from './scroll.js';

const triggers = [];

export function splitWords(el) {
  const text = el.dataset.orig ?? el.textContent.trim();
  el.dataset.orig = text;
  el.setAttribute('aria-label', text);
  el.innerHTML = '';
  return text.split(/\s+/).map((word, i, arr) => {
    const span = document.createElement('span');
    span.className = 'w';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = word + (i < arr.length - 1 ? ' ' : '');
    el.appendChild(span);
    return span;
  });
}

export function splitLines(el) {
  const words = splitWords(el);
  const lines = [];
  let top = null;
  words.forEach((w) => {
    if (top === null || Math.abs(w.offsetTop - top) > 4) {
      lines.push([]);
      top = w.offsetTop;
    }
    lines[lines.length - 1].push(w.textContent);
  });
  el.innerHTML = '';
  return lines.map((parts) => {
    const mask = document.createElement('span');
    mask.className = 'line-mask';
    mask.setAttribute('aria-hidden', 'true');
    const line = document.createElement('span');
    line.className = 'line';
    line.textContent = parts.join('').trimEnd();
    mask.appendChild(line);
    el.appendChild(mask);
    return line;
  });
}

function build() {
  triggers.splice(0).forEach((t) => t.kill());

  document.querySelectorAll('[data-reveal="lines"]').forEach((el) => {
    const lines = splitLines(el);
    if (el.dataset.done) return; // já revelado: refaz o split sem animar de novo
    gsap.set(lines, { yPercent: 115 });
    const tween = gsap.to(lines, {
      yPercent: 0,
      duration: 1.3,
      ease: 'expo.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => { el.dataset.done = '1'; },
      },
    });
    triggers.push(tween.scrollTrigger, tween);
  });

  document.querySelectorAll('[data-scrub-words]').forEach((el) => {
    const words = splitWords(el);
    const tween = gsap.fromTo(
      words,
      { opacity: 0.16 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 48%', scrub: true },
      },
    );
    triggers.push(tween.scrollTrigger, tween);
  });
}

export async function initTextReveals() {
  const html = document.documentElement;
  if (reduced) {
    html.classList.remove('pre');
    return;
  }
  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]);
  build();
  html.classList.remove('pre');

  let timer;
  let lastWidth = innerWidth;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (innerWidth === lastWidth) return; // ignora barras do navegador móvel
      lastWidth = innerWidth;
      build();
      ScrollTrigger.refresh();
      // O primeiro refresh pode medir pins antes do layout assentar; o segundo fecha a conta.
      setTimeout(() => ScrollTrigger.refresh(), 300);
    }, 200);
  });
}
