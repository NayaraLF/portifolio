// Scroll suave (Lenis), progresso global, parallax por camada e cursor.
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

export function initScroll() {
  gsap.registerPlugin(ScrollTrigger);
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const bar = document.querySelector('#progress i');
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      bar.style.transform = `scaleX(${self.progress})`;
      window.dispatchEvent(new CustomEvent('lumen:progress', { detail: self.progress }));
    },
  });

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
      else target.scrollIntoView();
    });
  });

  return { lenis };
}

export function initParallax() {
  if (reduced) return;
  // Em coluna única (< 900px) o espaço entre cartões é pequeno: reduz a amplitude para não sobrepor.
  const amp = () => (innerWidth < 900 ? 70 : 220);
  document.querySelectorAll('[data-depth]').forEach((el) => {
    const d = parseFloat(el.dataset.depth);
    gsap.fromTo(
      el,
      { y: () => d * amp() },
      {
        y: () => d * -amp(),
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      },
    );
  });
}

export function initCursor() {
  if (reduced || !finePointer) return;
  const root = document.documentElement;
  root.classList.add('has-cursor');
  const dotX = gsap.quickTo('#cursor-dot', 'x', { duration: 0.08 });
  const dotY = gsap.quickTo('#cursor-dot', 'y', { duration: 0.08 });
  const ringX = gsap.quickTo('#cursor-ring', 'x', { duration: 0.5, ease: 'power3' });
  const ringY = gsap.quickTo('#cursor-ring', 'y', { duration: 0.5, ease: 'power3' });
  window.addEventListener('pointermove', (e) => {
    dotX(e.clientX); dotY(e.clientY); ringX(e.clientX); ringY(e.clientY);
  }, { passive: true });
  document.querySelectorAll('a, .card, .btn').forEach((el) => {
    el.addEventListener('pointerenter', () => root.classList.add('cursor-hover'));
    el.addEventListener('pointerleave', () => root.classList.remove('cursor-hover'));
  });
}

export function initHoverFx() {
  if (reduced || !finePointer) return;
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
  document.querySelectorAll('.btn').forEach((btn) => {
    const qx = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3' });
    const qy = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3' });
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      qx((e.clientX - (r.left + r.width / 2)) * 0.3);
      qy((e.clientY - (r.top + r.height / 2)) * 0.4);
    });
    btn.addEventListener('pointerleave', () => { qx(0); qy(0); });
  });
}
