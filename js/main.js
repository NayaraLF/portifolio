// Entrada: inicializa os módulos na ordem certa.
import { initScroll, initParallax, initCursor, initHoverFx } from './scroll.js';
import { initTextReveals } from './text.js';
import { initChapters } from './chapters.js';

async function boot() {
  const root = document.documentElement;
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
    scene = initScene(document.getElementById('stage'));
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
