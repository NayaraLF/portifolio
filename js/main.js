// Entrada: inicializa os módulos na ordem certa.
import { initScroll, initParallax, initCursor, initHoverFx, reduced } from './scroll.js';
import { initTextReveals } from './text.js';
import { initChapters } from './chapters.js';

async function boot() {
  const root = document.documentElement;
  // Pins mudam a altura da página; restaurar scroll antigo cairia em posição errada.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);
  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.remove('pre');
    return;
  }
  initScroll();
  initCursor();
  initHoverFx();

  let scene = null;
  try {
    const { initScene } = await import('./scene.js');
    scene = initScene(document.getElementById('stage'), { still: reduced });
  } catch (e) {
    console.warn('WebGL indisponível, usando fallback.', e);
  }
  if (!scene) root.classList.add('no-webgl');
  window.addEventListener('lumen:progress', (e) => scene?.setProgress(e.detail));

  await initTextReveals();
  initParallax();
  initChapters({ scene });
  ScrollTrigger.refresh();

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) ScrollTrigger.update();
  });
}

boot();
