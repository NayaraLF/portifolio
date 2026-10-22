// Animações por capítulo, todas ligadas ao scroll.
import { reduced } from './scroll.js';

export function initChapters({ scene }) {
  if (reduced) return;
  initVazio();
  initRuido();
  initFaisca(scene);
  initMetodo();
  initServicos();
  initContato();
}

function initVazio() {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#vazio', start: 'top top', end: 'bottom 25%', scrub: true },
  });
  tl.to('#vazio .display', { yPercent: -18, opacity: 0, ease: 'none' }, 0)
    .to('#vazio .label', { opacity: 0, ease: 'none' }, 0)
    .to('#vazio .hint', { opacity: 0, ease: 'none', duration: 0.3 }, 0);
}

function initRuido() {
  const panels = gsap.utils.toArray('#ruido .npanel');
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#ruido', start: 'top top', end: '+=140%', pin: true, scrub: 0.6 },
  });
  panels.forEach((p) => {
    const z = parseFloat(p.dataset.z);
    tl.fromTo(p, { z: 0, scale: 1, opacity: 0.78 }, { z: -260 * z, scale: 0.7, opacity: 0, y: -40 * z, ease: 'power1.in', duration: 1 }, 0.15);
  });
  tl.fromTo('#ruido .noise__copy', { opacity: 1 }, { opacity: 0.0, ease: 'power1.in', duration: 0.25 }, 0.95);
}

function initFaisca(scene) {
  const proxy = { b: 0 };
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#faisca', start: 'top top', end: '+=110%', pin: true, scrub: 0.6 },
  });
  tl.set('#faisca .spark__copy', { opacity: 0 }, 0)
    .to('#faisca .spark__flash', { opacity: 1, ease: 'power2.in', duration: 0.35 }, 0)
    .to(proxy, { b: 1, ease: 'power2.in', duration: 0.35, onUpdate: () => scene?.setBurst(proxy.b) }, 0)
    .to('#faisca .spark__flash', { opacity: 0.16, ease: 'power2.out', duration: 0.4 }, 0.38)
    .to(proxy, { b: 0.04, ease: 'power2.out', duration: 0.5, onUpdate: () => scene?.setBurst(proxy.b) }, 0.38)
    .fromTo('#faisca .spark__copy', { opacity: 0, y: 40, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }, 0.5);
}

function initMetodo() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const track = document.querySelector('.method__track');
    const viewport = document.querySelector('.method__viewport');
    const dist = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#metodo',
        start: 'top top',
        end: () => '+=' + Math.round(dist() * 1.8),
        pin: '.method__pin',
        scrub: 0.6,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
    tl.to(track, { x: () => -dist(), ease: 'none' }, 0)
      .to('.method__bar i', { scaleX: 1, ease: 'none' }, 0)
      .fromTo('.step__num', { x: 80 }, { x: -120, ease: 'none' }, 0);
  });
  mm.add('(max-width: 899px)', () => {
    gsap.utils.toArray('.step').forEach((s) => {
      gsap.from(s, { opacity: 0, y: 40, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 88%', once: true } });
    });
  });
}

function initServicos() {
  gsap.utils.toArray('.card').forEach((c) => {
    gsap.from(c, { opacity: 0, scale: 0.92, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 90%', once: true } });
  });
}

function initContato() {
  gsap.fromTo('.orb', { scale: 0.2 }, {
    scale: 1, ease: 'none',
    scrollTrigger: { trigger: '#contato', start: 'top 85%', end: 'top 10%', scrub: true },
  });
  gsap.from('.contact__copy .btn, .links li, .foot', {
    opacity: 0, y: 24, duration: 1, ease: 'expo.out', stagger: 0.08,
    scrollTrigger: { trigger: '.contact__copy', start: 'top 65%', once: true },
  });
}
