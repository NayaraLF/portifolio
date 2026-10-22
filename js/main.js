// Entrada: inicializa os módulos na ordem certa.
import { initScroll, initParallax, initCursor, initHoverFx, sortTriggers, reduced } from './scroll.js';
import { initTextReveals } from './text.js';
import { initChapters } from './chapters.js';

let scene = null;
let lastProgress = 0;

// Three.js é pesado: carrega em segundo plano para não atrasar texto, pins e scroll.
async function loadScene(root) {
  try {
    const { initScene } = await import('./scene.js');
    scene = initScene(document.getElementById('stage'), { still: reduced });
  } catch (e) {
    console.warn('WebGL indisponível, usando fallback.', e);
  }
  if (!scene) root.classList.add('no-webgl');
  else scene.setProgress(lastProgress);
}

function goToHash(lenis) {
  if (!location.hash) return;
  let target = null;
  try { target = document.querySelector(location.hash); } catch (e) { /* hash inválido */ }
  if (!target) return;
  if (lenis) lenis.scrollTo(target, { immediate: true });
  else target.scrollIntoView();
}

async function boot() {
  const root = document.documentElement;
  // Pins mudam a altura da página; restaurar scroll antigo cairia em posição errada.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.remove('pre');
    return;
  }
  const { lenis } = initScroll();
  initCursor();
  initHoverFx();

  window.addEventListener('lumen:progress', (e) => {
    lastProgress = e.detail;
    scene?.setProgress(lastProgress);
  });
  loadScene(root);

  await initTextReveals();
  initParallax();
  initChapters({ getScene: () => scene });
  sortTriggers();
  ScrollTrigger.refresh();
  goToHash(lenis);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) ScrollTrigger.update();
  });
}

boot();
